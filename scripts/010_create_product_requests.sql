-- Create product_requests table for users to request new products
CREATE TABLE IF NOT EXISTS product_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  product_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE product_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own requests
CREATE POLICY "Users can view their own requests"
  ON product_requests
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own requests
CREATE POLICY "Users can create their own requests"
  ON product_requests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Authenticated users (admins) can view all requests
CREATE POLICY "Authenticated can view all requests"
  ON product_requests
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users (admins) can update requests
CREATE POLICY "Authenticated can update requests"
  ON product_requests
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_product_requests_user_id ON product_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_product_requests_status ON product_requests(status);
