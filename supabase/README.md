# Supabase Setup Guide

This guide walks you through setting up Supabase for the Helgus Marketplace.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click **New Project**
3. Choose your organization
4. Enter project details:
   - **Name**: helgus-marketplace (or your preferred name)
   - **Database Password**: Save this securely - you'll need it for direct DB access
   - **Region**: Choose the closest to your users (e.g., Frankfurt for AT/DE)
5. Click **Create new project** and wait for provisioning (~2 minutes)

## Step 2: Get Your API Credentials

1. In your Supabase project, go to **Project Settings** (gear icon) > **API**
2. Copy the following values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (under Project API keys)

3. Create `.env.local` in your project root:
```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 3: Run the Database Migration

1. In your Supabase project, go to **SQL Editor** (left sidebar)
2. Click **New query**
3. Open `supabase/migrations/001_initial_schema.sql` from this project
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click **Run** (or press Cmd/Ctrl + Enter)

You should see "Success. No rows returned" - this is expected.

## Step 4: Verify Setup

Check that the tables were created:

1. Go to **Table Editor** (left sidebar)
2. You should see these tables:
   - `profiles`
   - `seller_verifications`
   - `categories`
   - `products`
   - `product_images`

3. Click on `categories` - it should have 11 pre-seeded categories

## Step 5: (Optional) Enable Google OAuth

If you want social login with Google:

1. Go to **Authentication** > **Providers** in Supabase
2. Find **Google** and click to expand
3. Toggle it ON
4. You'll need OAuth credentials from Google Cloud Console:
   - Go to [console.cloud.google.com](https://console.cloud.google.com)
   - Create a new project (or use existing)
   - Go to **APIs & Services** > **Credentials**
   - Click **Create Credentials** > **OAuth Client ID**
   - Choose **Web application**
   - Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
5. Copy the **Client ID** and **Client Secret** back to Supabase

## Troubleshooting

### "relation already exists" error
The migration has already been run. This is fine - your database is set up.

### "permission denied" errors
Make sure you're using the SQL Editor as the project owner (not a team member with limited access).

### Auth not working
1. Check `.env.local` has correct values (no quotes around values)
2. Restart your dev server after changing env vars
3. Check browser console for specific errors

### Storage bucket errors
If the `profiles` bucket already exists, you can comment out or remove this line from the migration:
```sql
INSERT INTO storage.buckets (id, name, public) VALUES ('profiles', 'profiles', true);
```

## Database Schema Overview

```
profiles
├── id (UUID, FK to auth.users)
├── name, avatar_url, bio
├── phone, zip, city, country
├── is_verified, verified_at
└── created_at, updated_at

seller_verifications
├── id (UUID)
├── user_id (FK to profiles)
├── full_name, street, house_number
├── zip, city, country
├── iban, bic
├── accepted_terms
├── status (pending/verified/rejected)
└── created_at

categories
├── id (UUID)
├── name, slug
├── parent_id (self-referencing FK)
└── sort_order

products
├── id (UUID)
├── seller_id (FK to profiles)
├── category_id (FK to categories)
├── title, description, price
├── condition, delivery_options
├── shipping_cost, zip, city
├── phone_contact_available
├── view_count, is_active, sold_at
└── created_at, updated_at

product_images
├── id (UUID)
├── product_id (FK to products)
├── storage_path
├── sort_order
└── created_at
```

## Row Level Security (RLS)

All tables have RLS enabled with these policies:

- **profiles**: Public read, users can only update/insert their own
- **seller_verifications**: Users can only view/create their own
- **categories**: Public read only
- **products**: Public read for active, sellers manage their own
- **product_images**: Public read, sellers manage their own product images
