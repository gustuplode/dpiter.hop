-- Add currency field to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';

-- Create a settings table for global currency preference
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default currency setting
INSERT INTO app_settings (key, value)
VALUES ('default_currency', 'USD')
ON CONFLICT (key) DO NOTHING;

-- Enable RLS
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read settings
CREATE POLICY "Anyone can view app settings"
ON app_settings FOR SELECT
TO public
USING (true);

-- Allow authenticated users to update settings
CREATE POLICY "Authenticated users can update app settings"
ON app_settings FOR UPDATE
TO authenticated
USING (true);
