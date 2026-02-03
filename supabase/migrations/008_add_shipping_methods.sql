-- ============================================================================
-- Migration 008: Add Shipping Method Selection to Purchases
-- Allows buyers to select their preferred shipping/pickup method during purchase
-- ============================================================================

-- ============================================================================
-- Add shipping_method to purchases table
-- ============================================================================

ALTER TABLE purchases
  ADD COLUMN shipping_method TEXT CHECK (shipping_method IN ('Abholung', 'Versand'));

COMMENT ON COLUMN purchases.shipping_method IS 'Shipping/pickup method selected by buyer (Abholung = pickup, Versand = delivery)';

-- ============================================================================
-- Update create_direct_purchase function to accept and store shipping method
-- ============================================================================

-- Drop old version first due to function overloading
DROP FUNCTION IF EXISTS create_direct_purchase(UUID, UUID, UUID, DECIMAL);

CREATE OR REPLACE FUNCTION create_direct_purchase(
  p_product_id UUID,
  p_seller_id UUID,
  p_buyer_id UUID,
  p_price DECIMAL,
  p_shipping_method TEXT DEFAULT 'Versand'
)
RETURNS JSON AS $$
DECLARE
  v_purchase_id UUID;
BEGIN
  -- 1. Create purchase record with shipping method
  INSERT INTO purchases (product_id, seller_id, buyer_id, price_at_purchase, purchase_type, status, shipping_method)
  VALUES (p_product_id, p_seller_id, p_buyer_id, p_price, 'direct', 'pending', p_shipping_method)
  RETURNING id INTO v_purchase_id;

  -- 2. Update product to pending status
  UPDATE products
  SET buyer_id = p_buyer_id,
      pending_since = NOW(),
      is_active = false
  WHERE id = p_product_id;

  -- 3. Decline all pending offers
  UPDATE offers
  SET status = 'declined', responded_at = NOW()
  WHERE product_id = p_product_id AND status = 'pending';

  -- 4. Create notification for seller
  INSERT INTO notifications (user_id, type, title, message, product_id)
  VALUES (p_seller_id, 'purchase_initiated'::notification_type, 'Neuer Kauf', 'Ein Käufer möchte dein Produkt kaufen', p_product_id);

  RETURN json_build_object('success', true, 'purchase_id', v_purchase_id);
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION create_direct_purchase IS 'Create a direct purchase with shipping method selection';

-- ============================================================================
-- Update accept_offer function to accept and store shipping method
-- ============================================================================

-- Drop old version first due to function overloading
DROP FUNCTION IF EXISTS accept_offer(UUID, UUID, UUID, UUID, DECIMAL);

CREATE OR REPLACE FUNCTION accept_offer(
  p_offer_id UUID,
  p_product_id UUID,
  p_buyer_id UUID,
  p_seller_id UUID,
  p_offer_amount DECIMAL,
  p_shipping_method TEXT DEFAULT 'Versand'
)
RETURNS JSON AS $$
DECLARE
  v_purchase_id UUID;
BEGIN
  -- 1. Create purchase record with shipping method
  INSERT INTO purchases (product_id, seller_id, buyer_id, price_at_purchase, purchase_type, offer_id, status, shipping_method)
  VALUES (p_product_id, p_seller_id, p_buyer_id, p_offer_amount, 'offer_accepted', p_offer_id, 'pending', p_shipping_method)
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

COMMENT ON FUNCTION accept_offer IS 'Accept an offer with shipping method selection';

-- ============================================================================
-- Migration complete
-- ============================================================================
