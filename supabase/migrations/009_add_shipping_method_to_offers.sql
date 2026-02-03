-- ============================================================================
-- Migration 009: Add Shipping Method Selection to Offers
-- Allows buyers to specify their preferred shipping/pickup method when creating offers
-- ============================================================================

-- ============================================================================
-- Add shipping_method to offers table
-- ============================================================================

ALTER TABLE offers
  ADD COLUMN shipping_method TEXT CHECK (shipping_method IN ('Abholung', 'Versand')) DEFAULT 'Versand';

COMMENT ON COLUMN offers.shipping_method IS 'Shipping/pickup method preferred by buyer (Abholung = pickup, Versand = delivery)';

-- ============================================================================
-- Update accept_offer function to use shipping_method from offer
-- ============================================================================

-- Drop old version first
DROP FUNCTION IF EXISTS accept_offer(UUID, UUID, UUID, UUID, DECIMAL, TEXT);

CREATE OR REPLACE FUNCTION accept_offer(
  p_offer_id UUID,
  p_product_id UUID,
  p_buyer_id UUID,
  p_seller_id UUID,
  p_offer_amount DECIMAL
)
RETURNS JSON AS $$
DECLARE
  v_purchase_id UUID;
  v_shipping_method TEXT;
BEGIN
  -- Get shipping method from offer
  SELECT shipping_method INTO v_shipping_method FROM offers WHERE id = p_offer_id;

  -- Default to 'Versand' if not set
  IF v_shipping_method IS NULL THEN
    v_shipping_method := 'Versand';
  END IF;

  -- 1. Create purchase record with shipping method from offer
  INSERT INTO purchases (product_id, seller_id, buyer_id, price_at_purchase, purchase_type, offer_id, status, shipping_method)
  VALUES (p_product_id, p_seller_id, p_buyer_id, p_offer_amount, 'offer_accepted', p_offer_id, 'pending', v_shipping_method)
  RETURNING id INTO v_purchase_id;

  -- 2. Update product to pending status
  UPDATE products
  SET buyer_id = p_buyer_id,
      pending_since = NOW(),
      is_active = false
  WHERE id = p_product_id;

  -- 3. Accept the offer
  UPDATE offers
  SET status = 'accepted', responded_at = NOW()
  WHERE id = p_offer_id;

  -- 4. Decline other pending offers
  UPDATE offers
  SET status = 'declined', responded_at = NOW()
  WHERE product_id = p_product_id AND id != p_offer_id AND status = 'pending';

  -- 5. Create notification for buyer
  INSERT INTO notifications (user_id, type, title, message, product_id)
  VALUES (p_buyer_id, 'offer_accepted'::notification_type, 'Gegenangebot akzeptiert', 'Dein Gegenangebot wurde akzeptiert!', p_product_id);

  RETURN json_build_object('success', true, 'purchase_id', v_purchase_id);
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION accept_offer IS 'Accept an offer, using shipping method specified in the offer';

-- ============================================================================
-- Migration complete
-- ============================================================================
