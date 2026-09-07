/*
# Add images array column to products

## Purpose
Replace the single `image` text field with an `images` jsonb array to support
multiple product photos per product.

## Changes
1. Add `images` jsonb column to products table (defaults to empty array).
2. Migrate existing data: copy `image` into `images` array for any rows that have an image.
3. The old `image` and `gallery` columns remain in the table for backwards
   compatibility but the frontend will now read/write `images` exclusively.

## Security
No RLS policy changes needed — the new column inherits the table's existing policies.
*/

ALTER TABLE products ADD COLUMN IF NOT EXISTS images jsonb DEFAULT '[]'::jsonb;

-- Migrate existing image data into the new images array
UPDATE products
SET images = CASE
  WHEN gallery IS NOT NULL AND jsonb_array_length(gallery) > 0 THEN gallery
  WHEN image IS NOT NULL AND image != '' THEN jsonb_build_array(image)
  ELSE '[]'::jsonb
END
WHERE images = '[]'::jsonb;
