-- 1. Database Table
-- (This is already in PRODUCTION_SCHEMA.sql, but here for reference)
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  pdf_url TEXT,
  pdf_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notes_crud_own" ON public.notes;
CREATE POLICY "notes_crud_own" ON public.notes FOR ALL 
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 2. Storage Setup (Run in SQL Editor)
-- Create bucket for note attachments
INSERT INTO storage.buckets (id, name, public) VALUES ('notes_attachments', 'notes_attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy: Allow authenticated users to upload their own files
CREATE POLICY "Users can upload own note attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'notes_attachments'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Storage Policy: Allow users to update/delete their own files
CREATE POLICY "Users can update own note attachments"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'notes_attachments' AND (storage.foldername(name))[1] = auth.uid()::text );

CREATE POLICY "Users can delete own note attachments"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'notes_attachments' AND (storage.foldername(name))[1] = auth.uid()::text );

-- Storage Policy: Public read access
CREATE POLICY "Note attachments are publicly readable"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'notes_attachments' );
