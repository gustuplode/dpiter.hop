-- Add comment field to ratings table
ALTER TABLE ratings ADD COLUMN IF NOT EXISTS comment TEXT;
ALTER TABLE ratings ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_ratings_created_at ON ratings(created_at DESC);
