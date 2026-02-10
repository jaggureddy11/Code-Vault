-- 1. Snippets Table Protection
ALTER TABLE snippets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view all snippets" ON snippets;
CREATE POLICY "Users can view all snippets"
ON snippets FOR SELECT
USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can only modify their own snippets" ON snippets;
CREATE POLICY "Users can only modify their own snippets"
ON snippets FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 2. Tags Table Protection
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can only access their own tags" ON tags;
CREATE POLICY "Users can only access their own tags"
ON tags FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 3. Recently Viewed Table Protection
ALTER TABLE recently_viewed ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can only access their own recently viewed items" ON recently_viewed;
CREATE POLICY "Users can only access their own recently viewed items"
ON recently_viewed FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. Snippet Tags (Join Table) Protection
-- First, ensure snippet_tags has a user_id for direct isolation
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='snippet_tags' AND column_name='user_id') THEN
        ALTER TABLE snippet_tags ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

ALTER TABLE snippet_tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can only access their own snippet associations" ON snippet_tags;
CREATE POLICY "Users can only access their own snippet associations"
ON snippet_tags FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 5. Automate user_id assignment (Backup for frontend)
-- This ensures that even if user_id is omitted by the requester, the authenticated user ID is used.
CREATE OR REPLACE FUNCTION public.handle_set_user_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := auth.uid();
  ELSIF NEW.user_id != auth.uid() THEN
    -- Prevent users from spoofing other user IDs
    RAISE EXCEPTION 'Unauthorized: Cannot set user_id to different user';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply trigger to all tables
DROP TRIGGER IF EXISTS ensure_user_id_snippets ON snippets;
CREATE TRIGGER ensure_user_id_snippets BEFORE INSERT OR UPDATE ON snippets
FOR EACH ROW EXECUTE FUNCTION public.handle_set_user_id();

DROP TRIGGER IF EXISTS ensure_user_id_tags ON tags;
CREATE TRIGGER ensure_user_id_tags BEFORE INSERT OR UPDATE ON tags
FOR EACH ROW EXECUTE FUNCTION public.handle_set_user_id();

DROP TRIGGER IF EXISTS ensure_user_id_recently_viewed ON recently_viewed;
CREATE TRIGGER ensure_user_id_recently_viewed BEFORE INSERT OR UPDATE ON recently_viewed
FOR EACH ROW EXECUTE FUNCTION public.handle_set_user_id();

DROP TRIGGER IF EXISTS ensure_user_id_snippet_tags ON snippet_tags;
CREATE TRIGGER ensure_user_id_snippet_tags BEFORE INSERT OR UPDATE ON snippet_tags
FOR EACH ROW EXECUTE FUNCTION public.handle_set_user_id();

-- 6. User Profiles & Usernames
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Function to handle new user signup and create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'username', SPLIT_PART(new.email, '@', 1) || '_' || SUBSTR(new.id::text, 1, 4))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
