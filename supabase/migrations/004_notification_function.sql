-- Create a function to insert notifications that bypasses RLS
-- This ensures notifications are created reliably and real-time subscriptions work

CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_product_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, type, title, message, product_id, is_read, created_at)
  VALUES (p_user_id, p_type, p_title, p_message, p_product_id, FALSE, NOW())
  RETURNING id INTO notification_id;

  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_notification(UUID, TEXT, TEXT, TEXT, UUID) TO authenticated;
