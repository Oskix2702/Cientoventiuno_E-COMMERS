/*
# Create profiles and products tables for CIENTOVEINTIUNO store

## Purpose
This migration sets up the database schema for a full e-commerce system with:
- User authentication via Supabase Auth (auth.users)
- User profiles with role-based access (admin vs customer)
- Product catalog with inventory management (stock, sizes, variants)
- Row Level Security to protect admin-only operations

## New Tables

### 1. `profiles`
- `id` (uuid, primary key) — references auth.users(id), cascading delete
- `email` (text) — user email, copied from auth at signup
- `role` (text) — either 'admin' or 'customer', defaults to 'customer'
- `created_at` (timestamptz) — record creation timestamp

### 2. `products`
- `id` (uuid, primary key, auto-generated)
- `name` (text, not null) — product name
- `category` (text) — category/style label
- `description` (text) — product description
- `price` (integer, not null) — price in COP
- `image` (text) — main product image URL
- `gallery` (jsonb) — array of image URLs for the gallery
- `variants` (jsonb) — array of {name, color, image} objects
- `sizes` (jsonb) — array of size strings (e.g. ["S","M","L"])
- `material` (text) — material/fabric description
- `reviews` (jsonb) — array of {author, rating, text} objects
- `stock` (integer, not null, default 0) — units available
- `created_at` (timestamptz) — record creation timestamp

## Security

### RLS on `profiles`
- SELECT: users can read their own profile; admins can read all profiles
- UPDATE: users can update their own profile; admins can update all profiles
- INSERT/DELETE: admin only (profiles are auto-created via trigger)

### RLS on `products`
- SELECT: public (anon + authenticated) — anyone browsing the store can see products
- INSERT/UPDATE/DELETE: admin only (checked via is_admin() function)

### `is_admin()` function
- SECURITY DEFINER function that checks if the current user's profile has role = 'admin'
- Returns boolean; used in RLS policies for products and profiles

### Auto-profile trigger
- A trigger on auth.users INSERT automatically creates a profile row
- Default role is 'customer'
- This ensures every new signup has a profile without frontend intervention

## Important Notes
1. The `is_admin()` function is SECURITY DEFINER so it can read profiles
  even though the calling role might not have SELECT on all profiles.
2. The first admin must be set manually via SQL after registration:
   UPDATE profiles SET role = 'admin' WHERE email = 'your-admin@email.com';
3. Products table uses jsonb for gallery, variants, sizes, and reviews
  to keep the schema flexible without needing join tables for this scope.
*/

-- ============================================================
-- 1. PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles: SELECT — users read own profile, admins read all
DROP POLICY IF EXISTS "select_profiles" ON profiles;
CREATE POLICY "select_profiles" ON profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id
    OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Profiles: UPDATE — users update own profile, admins update all
DROP POLICY IF EXISTS "update_profiles" ON profiles;
CREATE POLICY "update_profiles" ON profiles FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id
    OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  )
  WITH CHECK (
    auth.uid() = id
    OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Profiles: INSERT — admin only (profiles auto-created via trigger)
DROP POLICY IF EXISTS "insert_profiles" ON profiles;
CREATE POLICY "insert_profiles" ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Profiles: DELETE — admin only
DROP POLICY IF EXISTS "delete_profiles" ON profiles;
CREATE POLICY "delete_profiles" ON profiles FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ============================================================
-- 2. IS_ADMIN() HELPER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ============================================================
-- 3. PRODUCTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text,
  description text,
  price integer NOT NULL,
  image text,
  gallery jsonb DEFAULT '[]'::jsonb,
  variants jsonb DEFAULT '[]'::jsonb,
  sizes jsonb DEFAULT '[]'::jsonb,
  material text,
  reviews jsonb DEFAULT '[]'::jsonb,
  stock integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Products: SELECT — public, anyone can browse
DROP POLICY IF EXISTS "select_products" ON products;
CREATE POLICY "select_products" ON products FOR SELECT
  TO anon, authenticated
  USING (true);

-- Products: INSERT — admin only
DROP POLICY IF EXISTS "insert_products" ON products;
CREATE POLICY "insert_products" ON products FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- Products: UPDATE — admin only
DROP POLICY IF EXISTS "update_products" ON products;
CREATE POLICY "update_products" ON products FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Products: DELETE — admin only
DROP POLICY IF EXISTS "delete_products" ON products;
CREATE POLICY "delete_products" ON products FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ============================================================
-- 4. AUTO-CREATE PROFILE TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'customer');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
