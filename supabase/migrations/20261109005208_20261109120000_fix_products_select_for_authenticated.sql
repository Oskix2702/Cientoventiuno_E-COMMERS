-- Fix: the store view was empty for logged-in users because the SELECT
-- policy on products only granted read access to the anon role, not to
-- authenticated. Replace it so both roles can read products.
DROP POLICY IF EXISTS "select_products" ON products;

CREATE POLICY "select_products" ON products FOR SELECT
  TO anon, authenticated
  USING (true);
