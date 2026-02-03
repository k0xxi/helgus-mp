-- ============================================================================
-- Migration 007: Purchase System Implementation
-- Adds buyer tracking, pending status, and comprehensive transaction history
-- ============================================================================

-- ============================================================================
-- Add buyer tracking and pending status to products
-- ============================================================================

ALTER TABLE products
  ADD COLUMN buyer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ADD COLUMN pending_since TIMESTAMPTZ;

COMMENT ON COLUMN products.buyer_id IS 'User who purchased/reserved this product';
COMMENT ON COLUMN products.pending_since IS 'When product was reserved (pending state)';

CREATE INDEX idx_products_buyer ON products(buyer_id) WHERE buyer_id IS NOT NULL;
CREATE INDEX idx_products_pending ON products(pending_since) WHERE pending_since IS NOT NULL;

-- ============================================================================
-- Create purchases table for transaction history
-- ============================================================================

CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  price_at_purchase DECIMAL(10,2) NOT NULL,
  purchase_type TEXT NOT NULL CHECK (purchase_type IN ('direct', 'offer_accepted')),
  offer_id UUID REFERENCES offers(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE purchases IS 'Transaction history for all purchases';
COMMENT ON COLUMN purchases.price_at_purchase IS 'Actual sale price (may differ from listing price for offers)';
COMMENT ON COLUMN purchases.purchase_type IS 'How the purchase was initiated (direct button or offer acceptance)';
COMMENT ON COLUMN purchases.status IS 'Current transaction status (pending, completed, or cancelled)';

-- Indexes for performance
CREATE INDEX idx_purchases_product ON purchases(product_id);
CREATE INDEX idx_purchases_seller ON purchases(seller_id);
CREATE INDEX idx_purchases_buyer ON purchases(buyer_id);
CREATE INDEX idx_purchases_status ON purchases(status);
CREATE INDEX idx_purchases_date ON purchases(purchased_at DESC);

-- ============================================================================
-- Row Level Security for purchases
-- ============================================================================

ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Sellers and buyers can view their own purchases
CREATE POLICY "Users can view own purchases" ON purchases
  FOR SELECT USING (auth.uid() = seller_id OR auth.uid() = buyer_id);

-- Buyers can create purchases
CREATE POLICY "Buyers can create purchases" ON purchases
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- Sellers can update purchase status (for completing/cancelling)
CREATE POLICY "Sellers can update purchase status" ON purchases
  FOR UPDATE USING (auth.uid() = seller_id);

-- ============================================================================
-- Update products RLS policies to include pending products and deletion
-- ============================================================================

DROP POLICY "Active products are viewable by everyone" ON products;
DROP POLICY "Users can update own products" ON products;

CREATE POLICY "Products visibility policy" ON products
  FOR SELECT USING (
    is_active = true OR
    auth.uid() = seller_id OR
    auth.uid() = buyer_id
  );

-- Sellers can update their own products
CREATE POLICY "Users can update own products" ON products
  FOR UPDATE USING (auth.uid() = seller_id);

-- Sellers can delete their own products
CREATE POLICY "Users can delete own products" ON products
  FOR DELETE USING (auth.uid() = seller_id);

-- ============================================================================
-- Function to create direct purchase (handles buyer update)
-- ============================================================================

CREATE OR REPLACE FUNCTION create_direct_purchase(
  p_product_id UUID,
  p_seller_id UUID,
  p_buyer_id UUID,
  p_price DECIMAL
)
RETURNS JSON AS $$
DECLARE
  v_purchase_id UUID;
BEGIN
  -- 1. Create purchase record
  INSERT INTO purchases (product_id, seller_id, buyer_id, price_at_purchase, purchase_type, status)
  VALUES (p_product_id, p_seller_id, p_buyer_id, p_price, 'direct', 'pending')
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

COMMENT ON FUNCTION create_direct_purchase IS 'Create a direct purchase with all necessary updates (product, offers, notifications)';

-- ============================================================================
-- Function to accept offer (handles buyer update and purchase creation)
-- ============================================================================

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
BEGIN
  -- 1. Create purchase record
  INSERT INTO purchases (product_id, seller_id, buyer_id, price_at_purchase, purchase_type, offer_id, status)
  VALUES (p_product_id, p_seller_id, p_buyer_id, p_offer_amount, 'offer_accepted', p_offer_id, 'pending')
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

  -- 4. Decline other pending offers (will be handled by trigger, but explicitly here too)
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

COMMENT ON FUNCTION accept_offer IS 'Accept an offer with all necessary updates (purchase, product, offers, notifications)';

-- ============================================================================
-- Helper function to auto-decline other offers when one is accepted
-- ============================================================================

CREATE OR REPLACE FUNCTION decline_other_offers()
RETURNS TRIGGER AS $$
BEGIN
  -- When an offer is accepted, decline all other pending offers on the same product
  IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
    UPDATE offers
    SET status = 'declined', responded_at = NOW()
    WHERE product_id = NEW.product_id
      AND id != NEW.id
      AND status = 'pending';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER auto_decline_other_offers
  AFTER UPDATE ON offers
  FOR EACH ROW
  WHEN (NEW.status = 'accepted')
  EXECUTE FUNCTION decline_other_offers();

COMMENT ON FUNCTION decline_other_offers IS 'Automatically declines other pending offers when one is accepted';

-- ============================================================================
-- Update notification type constraint to include purchase notifications
-- ============================================================================

ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;

ALTER TABLE notifications ADD CONSTRAINT notifications_type_check
  CHECK (type IN (
    'new_message',
    'offer_received',
    'offer_accepted',
    'offer_declined',
    'price_drop',
    'purchase_initiated',
    'purchase_cancelled',
    'purchase_completed'
  ));

-- ============================================================================
-- Migration complete
-- ============================================================================
