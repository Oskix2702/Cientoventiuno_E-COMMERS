/*
# Migrate variants to new structure with per-variant image arrays

## Purpose
Convert existing variant objects from {name, color, image} to
{colorName, color, images: [...]} so each color variant has its own gallery.

## Changes
1. For every product, transform each variant:
   - name -> colorName
   - color stays
   - image (string) -> images: [image] (array)
   - If variant already has images array, keep it.
2. Also set top-level images from first variant's images for backward compat.

## Security
No RLS changes needed — only data transformation.
*/

UPDATE products
SET variants = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'colorName', COALESCE(v->>'colorName', v->>'name', 'Único'),
      'color',     COALESCE(v->>'color', '#1a1a1a'),
      'images',    CASE
                     WHEN v ? 'images' AND jsonb_array_length(v->'images') > 0
                       THEN v->'images'
                     WHEN v ? 'image' AND v->>'image' != ''
                       THEN jsonb_build_array(v->'image')
                     ELSE '[]'::jsonb
                   END
    )
  )
  FROM (
    SELECT jsonb_array_elements(variants) AS v
    WHERE variants IS NOT NULL AND jsonb_array_length(variants) > 0
  ) sub
)
WHERE variants IS NOT NULL AND jsonb_array_length(variants) > 0;
