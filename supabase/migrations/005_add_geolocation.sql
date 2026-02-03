-- Add geolocation support for proximity search
-- This migration adds coordinate fields to products and profiles

-- Add geolocation fields to products table
ALTER TABLE products
  ADD COLUMN street TEXT,
  ADD COLUMN latitude DECIMAL(10, 8),
  ADD COLUMN longitude DECIMAL(11, 8),
  ADD COLUMN geocoded_at TIMESTAMPTZ;

-- Add index for geolocation queries (improves proximity search performance)
CREATE INDEX idx_products_location ON products(latitude, longitude)
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Add comments explaining the fields
COMMENT ON COLUMN products.street IS 'Optional street address for more precise geocoding. Used for proximity search, not visible to buyers.';
COMMENT ON COLUMN products.latitude IS 'Geocoded latitude from OpenStreetMap Nominatim API';
COMMENT ON COLUMN products.longitude IS 'Geocoded longitude from OpenStreetMap Nominatim API';
COMMENT ON COLUMN products.geocoded_at IS 'Timestamp when the address was last geocoded';
