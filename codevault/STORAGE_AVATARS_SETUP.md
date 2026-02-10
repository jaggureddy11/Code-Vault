# Profile avatars – Supabase Storage setup

Run these in the **Supabase Dashboard** (Storage or SQL) so profile picture upload works.

## 1. Create the bucket

- Go to **Storage** in the Supabase project.
- Click **New bucket**.
- Name: `avatars`
- **Public bucket**: ON (so avatar URLs work without signed URLs).
- Click **Create bucket**.

## 2. Storage policies

Go to **Storage** → **Policies** for the `avatars` bucket (or add via SQL below).

- **Allow upload**: authenticated users can upload only to a path that starts with their user id.
- **Allow read**: anyone can read (public bucket).

If you use SQL (Supabase SQL Editor), you can run:

```sql
-- Policy: users can upload only to their own folder (user_id/...)
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: users can update their own file
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text );

-- Public read (bucket is public)
CREATE POLICY "Avatar images are publicly readable"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'avatars' );
```

After this, profile picture upload in **My profile** will work.
