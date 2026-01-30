-- Helgus Marketplace - Initial Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PROFILES TABLE
-- Extends Supabase auth.users with additional profile fields
-- ============================================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  phone TEXT,
  zip TEXT,
  city TEXT,
  country TEXT DEFAULT 'AT',
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SELLER VERIFICATIONS TABLE
-- Stores seller verification requests and status
-- ============================================================================
CREATE TABLE seller_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  street TEXT NOT NULL,
  house_number TEXT NOT NULL,
  zip TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT DEFAULT 'AT',
  iban TEXT NOT NULL,
  bic TEXT,
  accepted_terms BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- CATEGORIES TABLE
-- Product categories with optional parent for nested categories
-- ============================================================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  parent_id UUID REFERENCES categories(id),
  sort_order INTEGER DEFAULT 0
);

-- ============================================================================
-- PRODUCTS TABLE
-- Main products/listings table
-- ============================================================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('neu', 'wie-neu', 'sehr-gut', 'gut', 'akzeptabel')),
  delivery_options TEXT[] NOT NULL,
  shipping_cost DECIMAL(10,2),
  zip TEXT NOT NULL,
  city TEXT NOT NULL,
  phone_contact_available BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  sold_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PRODUCT IMAGES TABLE
-- Images associated with products
-- ============================================================================
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PROFILES POLICIES
-- ============================================================================

-- Anyone can view profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can only insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================================================
-- SELLER VERIFICATIONS POLICIES
-- ============================================================================

-- Users can only view their own verifications
CREATE POLICY "Users can view own verifications" ON seller_verifications
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only create their own verifications
CREATE POLICY "Users can insert own verifications" ON seller_verifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- CATEGORIES POLICIES
-- ============================================================================

-- Anyone can view categories
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

-- ============================================================================
-- PRODUCTS POLICIES
-- ============================================================================

-- Anyone can view active products; sellers can view their own inactive products
CREATE POLICY "Active products are viewable by everyone" ON products
  FOR SELECT USING (is_active = true OR auth.uid() = seller_id);

-- Users can only create products as themselves
CREATE POLICY "Users can insert own products" ON products
  FOR INSERT WITH CHECK (auth.uid() = seller_id);

-- Users can only update their own products
CREATE POLICY "Users can update own products" ON products
  FOR UPDATE USING (auth.uid() = seller_id);

-- ============================================================================
-- PRODUCT IMAGES POLICIES
-- ============================================================================

-- Anyone can view product images
CREATE POLICY "Product images viewable with product" ON product_images
  FOR SELECT USING (true);

-- Users can manage images for their own products
CREATE POLICY "Users can manage own product images" ON product_images
  FOR ALL USING (
    EXISTS (SELECT 1 FROM products WHERE products.id = product_images.product_id AND products.seller_id = auth.uid())
  );

-- ============================================================================
-- STORAGE BUCKET FOR AVATARS
-- ============================================================================

-- Create public bucket for profile avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('profiles', 'profiles', true);

-- Users can upload their own avatar (folder name = user id)
CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'profiles' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Anyone can view avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'profiles');

-- ============================================================================
-- HELPER FUNCTION: Auto-create profile on signup
-- ============================================================================

-- Function to create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'name', new.email));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- HELPER FUNCTION: Update updated_at timestamp
-- ============================================================================

-- Function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for products
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- SEED DATA: Default Categories
-- ============================================================================

INSERT INTO categories (name, slug, sort_order) VALUES
  ('Elektronik', 'elektronik', 1),
  ('Mode & Accessoires', 'mode-accessoires', 2),
  ('Haus & Garten', 'haus-garten', 3),
  ('Sport & Freizeit', 'sport-freizeit', 4),
  ('Fahrzeuge', 'fahrzeuge', 5),
  ('Immobilien', 'immobilien', 6),
  ('Jobs', 'jobs', 7),
  ('Dienstleistungen', 'dienstleistungen', 8),
  ('Familie & Baby', 'familie-baby', 9),
  ('Haustiere', 'haustiere', 10),
  ('Sonstiges', 'sonstiges', 99);
