-- Create category_products table for Fashion, Gadgets, and Gaming products
CREATE TABLE IF NOT EXISTS category_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  brand TEXT NOT NULL,
  price NUMERIC NOT NULL,
  image_url TEXT NOT NULL,
  affiliate_link TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('fashion', 'gadgets', 'gaming')),
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE category_products ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can view visible category products"
  ON category_products FOR SELECT
  USING (visible = true);

CREATE POLICY "Authenticated users can manage category products"
  ON category_products FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_category_products_category ON category_products(category);
CREATE INDEX IF NOT EXISTS idx_category_products_visible ON category_products(visible);
CREATE INDEX IF NOT EXISTS idx_category_products_created_at ON category_products(created_at DESC);
