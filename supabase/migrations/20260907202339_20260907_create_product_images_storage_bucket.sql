/*
# Create product-images storage bucket

1. Purpose
- Creates a public storage bucket called `product-images` where admin-uploaded
  product photos will be stored as real image files instead of Base64 strings.
- This eliminates the statement timeout caused by inserting enormous Base64
  data URLs into JSONB columns.

2. Storage Policies
- SELECT (public read): anyone (anon + authenticated) can read product images
  so the storefront displays them without authentication.
- INSERT: only authenticated admin users can upload images.
- UPDATE: only authenticated admin users can replace images.
- DELETE: only authenticated admin users can remove images.

3. Notes
- The bucket is created with `public: true` so URLs are directly accessible
  without signed tokens, keeping the frontend simple.
- Admin checks use the existing `is_admin()` SECURITY DEFINER function.
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public_read_product_images" ON storage.objects;
CREATE POLICY "public_read_product_images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "admin_insert_product_images" ON storage.objects;
CREATE POLICY "admin_insert_product_images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND is_admin());

DROP POLICY IF EXISTS "admin_update_product_images" ON storage.objects;
CREATE POLICY "admin_update_product_images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images' AND is_admin())
  WITH CHECK (bucket_id = 'product-images' AND is_admin());

DROP POLICY IF EXISTS "admin_delete_product_images" ON storage.objects;
CREATE POLICY "admin_delete_product_images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images' AND is_admin());
