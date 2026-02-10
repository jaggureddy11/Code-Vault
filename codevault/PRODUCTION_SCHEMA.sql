-- CodeVault production schema (authoritative)
-- Run this in Supabase SQL Editor (in order). Safe to re-run where possible.

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1) Core tables
CREATE TABLE IF NOT EXISTS public.snippets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  code TEXT NOT NULL,
  language VARCHAR(50) NOT NULL,
  is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(50) NOT NULL,
  color VARCHAR(7) DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name)
);

CREATE TABLE IF NOT EXISTS public.snippet_tags (
  snippet_id UUID REFERENCES public.snippets(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  PRIMARY KEY (snippet_id, tag_id)
);

-- Recently viewed (Learning Zone)
CREATE TABLE IF NOT EXISTS public.recently_viewed (
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

-- Profiles (for username display and avatar)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add avatar_url if table already exists without it
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'avatar_url') THEN
    ALTER TABLE public.profiles ADD COLUMN avatar_url TEXT;
  END IF;
END $$;

-- 2) Indexes
CREATE INDEX IF NOT EXISTS idx_snippets_user_id ON public.snippets(user_id);
CREATE INDEX IF NOT EXISTS idx_snippets_created_at ON public.snippets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_snippet_tags_user_id ON public.snippet_tags(user_id);
CREATE INDEX IF NOT EXISTS idx_tags_user_id ON public.tags(user_id);
CREATE INDEX IF NOT EXISTS idx_recently_viewed_user_id ON public.recently_viewed(user_id);

-- 3) RLS
ALTER TABLE public.snippets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.snippet_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recently_viewed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Snippets: allow authenticated users to read all (for "Explore"), but only mutate their own.
DROP POLICY IF EXISTS "snippets_select_all_authed" ON public.snippets;
CREATE POLICY "snippets_select_all_authed"
  ON public.snippets FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "snippets_write_own" ON public.snippets;
CREATE POLICY "snippets_write_own"
  ON public.snippets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "snippets_update_own" ON public.snippets;
CREATE POLICY "snippets_update_own"
  ON public.snippets FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "snippets_delete_own" ON public.snippets;
CREATE POLICY "snippets_delete_own"
  ON public.snippets FOR DELETE
  USING (auth.uid() = user_id);

-- Tags: isolate per-user
DROP POLICY IF EXISTS "tags_crud_own" ON public.tags;
CREATE POLICY "tags_crud_own"
  ON public.tags FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Snippet tags: isolate per-user via user_id column
DROP POLICY IF EXISTS "snippet_tags_crud_own" ON public.snippet_tags;
CREATE POLICY "snippet_tags_crud_own"
  ON public.snippet_tags FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Recently viewed: isolate per-user
DROP POLICY IF EXISTS "recently_viewed_crud_own" ON public.recently_viewed;
CREATE POLICY "recently_viewed_crud_own"
  ON public.recently_viewed FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Profiles: viewable by authed users; user can update own
DROP POLICY IF EXISTS "profiles_select_authed" ON public.profiles;
CREATE POLICY "profiles_select_authed"
  ON public.profiles FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 4) Safety triggers to prevent user_id spoofing
CREATE OR REPLACE FUNCTION public.handle_set_user_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := auth.uid();
  ELSIF NEW.user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: Cannot set user_id to different user';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS ensure_user_id_snippets ON public.snippets;
CREATE TRIGGER ensure_user_id_snippets BEFORE INSERT OR UPDATE ON public.snippets
FOR EACH ROW EXECUTE FUNCTION public.handle_set_user_id();

DROP TRIGGER IF EXISTS ensure_user_id_tags ON public.tags;
CREATE TRIGGER ensure_user_id_tags BEFORE INSERT OR UPDATE ON public.tags
FOR EACH ROW EXECUTE FUNCTION public.handle_set_user_id();

DROP TRIGGER IF EXISTS ensure_user_id_recently_viewed ON public.recently_viewed;
CREATE TRIGGER ensure_user_id_recently_viewed BEFORE INSERT OR UPDATE ON public.recently_viewed
FOR EACH ROW EXECUTE FUNCTION public.handle_set_user_id();

DROP TRIGGER IF EXISTS ensure_user_id_snippet_tags ON public.snippet_tags;
CREATE TRIGGER ensure_user_id_snippet_tags BEFORE INSERT OR UPDATE ON public.snippet_tags
FOR EACH ROW EXECUTE FUNCTION public.handle_set_user_id();

-- 5) Create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', SPLIT_PART(new.email, '@', 1) || '_' || SUBSTR(new.id::text, 1, 4))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

