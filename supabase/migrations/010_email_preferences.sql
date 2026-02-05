-- Email-Präferenzen und Benachrichtigungssystem
-- Erweitert profiles Tabelle um Email-Spalte und Präferenzen

-- Email-Spalte zu profiles hinzufügen (falls nicht vorhanden)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS email TEXT;

-- Email-Präferenzen als JSONB
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS email_preferences JSONB DEFAULT '{
  "new_message": true,
  "counter_offer": true,
  "counter_offer_accepted": true,
  "counter_offer_refused": true,
  "purchase_buyer": true,
  "purchase_seller": true
}'::jsonb;

-- Index für GIN-Suche (bessere Performance für JSONB Queries)
CREATE INDEX IF NOT EXISTS idx_profiles_email_preferences
ON profiles USING GIN (email_preferences);

-- Funktion: Email von auth.users zu profiles syncen
CREATE OR REPLACE FUNCTION sync_email_to_profile()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET email = NEW.email
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Bei Email-Update in auth.users
DROP TRIGGER IF EXISTS sync_email_on_user_update ON auth.users;
CREATE TRIGGER sync_email_on_user_update
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_email_to_profile();

-- Initiales Sync aller bestehenden Emails (einmalig)
UPDATE profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id AND p.email IS NULL;

-- Optional: Email-Log Tabelle für Debugging
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  email_type TEXT NOT NULL CHECK (email_type IN ('new_message', 'counter_offer', 'counter_offer_accepted', 'counter_offer_refused', 'purchase_buyer', 'purchase_seller')),
  recipient_email TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  metadata JSONB
);

-- Indices für Email-Logs
CREATE INDEX IF NOT EXISTS idx_email_logs_user_id ON email_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_logs_type ON email_logs(email_type);
