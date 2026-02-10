-- Recently Viewed videos table
CREATE TABLE IF NOT EXISTS recently_viewed (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  video_id VARCHAR(255) NOT NULL,
  title TEXT NOT NULL,
  thumbnail TEXT,
  channel TEXT,
  duration VARCHAR(50),
  views VARCHAR(50),
  likes VARCHAR(50),
  description TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, video_id)
);

-- Enable RLS
ALTER TABLE recently_viewed ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own recently viewed videos"
  ON recently_viewed FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recently viewed videos"
  ON recently_viewed FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recently viewed videos"
  ON recently_viewed FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recently viewed videos"
  ON recently_viewed FOR DELETE
  USING (auth.uid() = user_id);
