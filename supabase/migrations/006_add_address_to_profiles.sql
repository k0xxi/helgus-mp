-- Add street and house_number columns to profiles table
-- This allows storing complete address information in user profiles

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS street TEXT,
ADD COLUMN IF NOT EXISTS house_number TEXT;
