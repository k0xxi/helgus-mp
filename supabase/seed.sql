-- Helgus Marketplace - Sample Products Seed Data
--
-- INSTRUCTIONS:
-- 1. Sign up for an account at /marketplace/auth
-- 2. Go to Supabase Dashboard → Authentication → Users
-- 3. Copy your User ID (UUID)
-- 4. Replace 'YOUR_USER_ID_HERE' below with your actual User ID
-- 5. Run this script in Supabase SQL Editor

-- Get category IDs
DO $$
DECLARE
  v_seller_id UUID := 'YOUR_USER_ID_HERE'; -- Replace with your user ID
  v_elektronik_id UUID;
  v_mode_id UUID;
  v_haus_id UUID;
  v_sport_id UUID;
  v_fahrzeuge_id UUID;
  v_familie_id UUID;
BEGIN
  -- Get category IDs
  SELECT id INTO v_elektronik_id FROM categories WHERE slug = 'elektronik';
  SELECT id INTO v_mode_id FROM categories WHERE slug = 'mode-accessoires';
  SELECT id INTO v_haus_id FROM categories WHERE slug = 'haus-garten';
  SELECT id INTO v_sport_id FROM categories WHERE slug = 'sport-freizeit';
  SELECT id INTO v_fahrzeuge_id FROM categories WHERE slug = 'fahrzeuge';
  SELECT id INTO v_familie_id FROM categories WHERE slug = 'familie-baby';

  -- Insert sample products
  INSERT INTO products (seller_id, category_id, title, description, price, condition, delivery_options, shipping_cost, zip, city) VALUES
  (v_seller_id, v_elektronik_id, 'iPhone 14 Pro 256GB Space Black', 'Verkaufe mein iPhone 14 Pro in sehr gutem Zustand. Akku-Kapazität noch bei 92%. Originalverpackung und Ladekabel dabei. Keine Kratzer oder Beschädigungen.', 799.00, 'sehr-gut', ARRAY['versand', 'abholung'], 6.99, '1010', 'Wien'),
  (v_seller_id, v_elektronik_id, 'Sony PlayStation 5 mit 2 Controllern', 'PS5 Disc Edition, funktioniert einwandfrei. Inkl. 2 DualSense Controller und 3 Spiele (FIFA 24, Spider-Man 2, God of War). Nur Abholung.', 450.00, 'gut', ARRAY['abholung'], NULL, '8010', 'Graz'),
  (v_seller_id, v_mode_id, 'Canada Goose Winterjacke Herren L', 'Original Canada Goose Expedition Parka, Größe L. Wurde nur eine Saison getragen. Neupreis war über 1000€. Keine Flecken oder Beschädigungen.', 550.00, 'wie-neu', ARRAY['versand', 'abholung'], 8.99, '5020', 'Salzburg'),
  (v_seller_id, v_haus_id, 'IKEA KALLAX Regal 4x4 weiß', 'KALLAX Regal mit 16 Fächern in weiß. Sehr guter Zustand, keine Kratzer. Muss selbst abgebaut und abgeholt werden.', 80.00, 'sehr-gut', ARRAY['abholung'], NULL, '4020', 'Linz'),
  (v_seller_id, v_sport_id, 'E-Bike KTM Macina 2023', 'KTM Macina Sport 630, Rahmengröße 56cm. Bosch Performance CX Motor, 625Wh Akku. Erst 800km gefahren. Mit Rechnung und Restgarantie.', 3200.00, 'wie-neu', ARRAY['abholung'], NULL, '6020', 'Innsbruck'),
  (v_seller_id, v_familie_id, 'Kinderwagen Bugaboo Fox 3', 'Bugaboo Fox 3 Komplettset: Liegewanne, Sportsitz, Regenschutz, Sonnenschirm. Farbe: Midnight Black. Gepflegter Zustand.', 650.00, 'gut', ARRAY['versand', 'abholung'], 15.00, '9020', 'Klagenfurt');

END $$;
