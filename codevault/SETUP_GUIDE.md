# 🚀 CodeVault - Complete Setup Guide

## ⚡ Quick Start (5 Minutes)

### Step 1: Set Up Supabase (2 minutes)

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" → Sign up (free)
3. Create a new project:
   - Name: `codevault`
   - Database Password: (choose a strong one)
   - Region: Choose closest to you
   - Wait ~2 minutes for project to set up

4. **Get your credentials:**
   - Go to Settings → API
   - Copy `Project URL` and `anon public` key
   - Save these - you'll need them in Step 3

5. **Create database tables:**
   - Go to SQL Editor
   - Click "New query"
   - Paste this SQL and run it:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Snippets table
CREATE TABLE snippets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  code TEXT NOT NULL,
  language VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tags table
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(50) NOT NULL,
  color VARCHAR(7) DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Snippet tags junction table
CREATE TABLE snippet_tags (
  snippet_id UUID REFERENCES snippets(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (snippet_id, tag_id)
);

-- Create indexes for better performance
CREATE INDEX idx_snippets_user_id ON snippets(user_id);
CREATE INDEX idx_snippets_created_at ON snippets(created_at DESC);
CREATE INDEX idx_tags_user_id ON tags(user_id);

-- Enable Row Level Security
ALTER TABLE snippets ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE snippet_tags ENABLE ROW LEVEL SECURITY;

-- Snippets policies
CREATE POLICY "Users can view their own snippets"
  ON snippets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own snippets"
  ON snippets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own snippets"
  ON snippets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own snippets"
  ON snippets FOR DELETE
  USING (auth.uid() = user_id);

-- Tags policies
CREATE POLICY "Users can view their own tags"
  ON tags FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tags"
  ON tags FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tags"
  ON tags FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tags"
  ON tags FOR DELETE
  USING (auth.uid() = user_id);

-- Snippet tags policies
CREATE POLICY "Users can manage snippet tags for their snippets"
  ON snippet_tags
  USING (
    EXISTS (
      SELECT 1 FROM snippets
      WHERE snippets.id = snippet_tags.snippet_id
      AND snippets.user_id = auth.uid()
    )
  );
```

### Step 2: Clone and Install (1 minute)

```bash
# Extract the codevault folder
cd codevault/frontend

# Install dependencies
npm install
```

### Step 3: Configure Environment (1 minute)

Create `frontend/.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace with the values from Step 1.

### Step 4: Run the App (30 seconds)

```bash
npm run dev
```

Open http://localhost:5173

**That's it! You're ready to code! 🎉**

---

## 📋 Day-by-Day Development Plan

### ✅ DAY 1 (TODAY) - Foundation
**Status:** DONE
- [x] Project setup
- [x] Database schema
- [x] Authentication
- [x] Basic structure

**Your tasks:**
- [ ] Test login/signup
- [ ] Get familiar with the codebase
- [ ] Customize the branding (optional)

### 📝 DAY 2 - Core Snippet Features
**What to build:**
- Snippet creation form
- Snippet list view
- Basic CRUD operations

**Files to create/modify:**
- `src/pages/DashboardPage.tsx` - Main dashboard
- `src/components/SnippetForm.tsx` - Create/edit form
- `src/components/SnippetCard.tsx` - Display snippet
- `src/hooks/useSnippets.ts` - Data fetching logic

**Key features:**
```typescript
// In useSnippets.ts
- fetchSnippets()
- createSnippet()
- updateSnippet()
- deleteSnippet()
```

### 🎨 DAY 3 - Code Editor Integration
**What to build:**
- Monaco Editor integration
- Syntax highlighting
- Language selection

**Files to create:**
- `src/components/CodeEditor.tsx` - Monaco wrapper
- `src/components/LanguageSelect.tsx` - Language picker

**Key implementation:**
```typescript
import Editor from '@monaco-editor/react';

// Dark/light theme support
<Editor
  height="400px"
  language={language}
  value={code}
  theme={theme === 'dark' ? 'vs-dark' : 'light'}
  options={{
    minimap: { enabled: false },
    fontSize: 14,
  }}
/>
```

### 🏷️ DAY 4 - Tags System
**What to build:**
- Tag creation
- Tag filtering
- Tag management

**Files to create:**
- `src/components/TagInput.tsx` - Create tags
- `src/components/TagFilter.tsx` - Filter by tags
- `src/hooks/useTags.ts` - Tag operations

### 🔍 DAY 5 - Search Feature
**What to build:**
- Text search
- Filter combinations
- Search UI

**Files to create:**
- `src/components/SearchBar.tsx`
- `src/hooks/useSearch.ts`

**Implementation:**
```typescript
// Simple text search to start
const filtered = snippets.filter(s =>
  s.title.toLowerCase().includes(query.toLowerCase()) ||
  s.code.toLowerCase().includes(query.toLowerCase())
);
```

### ✨ DAY 6 - Polish & UX
**What to improve:**
- Loading states
- Error handling
- Animations
- Empty states
- Mobile responsive

### 🧪 DAY 7 - Testing & Bug Fixes
**What to do:**
- Test all features
- Fix bugs
- Performance optimization
- Add demo data

### 🚀 DAY 8 - Deployment
**Deploy frontend:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

**Configure:**
- Add environment variables in Vercel dashboard
- Test production build

### 🎥 DAY 9 - Demo Video
**Script:**
1. Intro (15s): "Hi, I built CodeVault..."
2. Problem (20s): "Developers waste time..."
3. Demo (90s): Show features
4. Tech (20s): "Built with React..."
5. Outro (15s): "Try it at..."

**Recording tips:**
- Use Loom or OBS
- Show, don't tell
- Keep it under 3 minutes
- Good audio quality

### 📤 DAY 10 - Submission
**Checklist:**
- [ ] GitHub repo is public
- [ ] README is complete
- [ ] Demo video uploaded
- [ ] Screenshots added
- [ ] Live URL works
- [ ] Submit on DevPost

### 🎯 DAY 11 - Buffer
**Final checks:**
- Re-test everything
- Fix critical bugs
- Update documentation

---

## 🛠️ Useful Commands

```bash
# Development
npm run dev           # Start dev server
npm run build         # Build for production
npm run preview       # Preview production build

# Troubleshooting
rm -rf node_modules   # Remove node_modules
npm install           # Reinstall dependencies
npm run dev -- --host # Expose to network
```

---

## 🎨 Customization Ideas

### Color Scheme
Edit `src/index.css` to change primary color:
```css
:root {
  --primary: 221.2 83.2% 53.3%; /* Blue */
}
```

### Branding
1. Change app name in `src/pages/*.tsx`
2. Update favicon in `public/`
3. Add logo to header

---

## 🐛 Common Issues & Solutions

### "Missing Supabase environment variables"
- Check `.env.local` exists in `frontend/` folder
- Verify variable names start with `VITE_`
- Restart dev server

### "Cannot connect to database"
- Verify Supabase credentials
- Check if tables are created (run SQL script)
- Ensure RLS policies are set up

### Monaco Editor not loading
- Check internet connection (loads from CDN)
- Verify `@monaco-editor/react` is installed

---

## 💡 Pro Tips for Winning

1. **Focus on UX**: Make it feel professional
2. **Show real value**: Use it yourself during development
3. **Clean code**: Comment important sections
4. **Great demo**: This is 50% of your grade
5. **Polish > Features**: Better to have 5 perfect features than 10 buggy ones

---

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [React Query Docs](https://tanstack.com/query/latest)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

---

## 🎯 Success Criteria for Kilo Challenge

✅ **Required:**
- Actually use Kilo (show in video)
- Ship something useful
- Clean execution

✅ **Bonus Points:**
- Creative solution
- Professional polish
- "I wish I'd thought of that" factor

---

## 🎉 You've Got This!

Remember:
- You have 11 days - plenty of time
- The foundation is already built
- Follow the daily plan
- Don't overthink it - ship it!

**Good luck! Build something amazing! 🚀**
