# 🚀 CodeVault Quick Reference

## 📂 Project Structure
```
codevault/
├── frontend/                 # React app
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Route pages
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks (YOU'LL CREATE THESE)
│   │   ├── lib/            # Utilities
│   │   └── types/          # TypeScript types
│   ├── .env.example        # Environment template
│   └── package.json        # Dependencies
├── README.md              # Project overview
├── SETUP_GUIDE.md        # Detailed setup instructions
├── NEXT_STEPS.md         # Your immediate action plan
└── DEVPOST_SUBMISSION.md # Submission template
```

## 🎯 Daily Goals Checklist

### Day 1 (TODAY) ✅
- [x] Supabase setup
- [x] Project structure
- [x] Auth working
- [ ] App running locally
- [ ] Understand codebase

### Day 2
- [ ] Snippet form
- [ ] CRUD operations
- [ ] Snippet list
- [ ] Basic search

### Day 3
- [ ] Monaco editor
- [ ] Syntax highlighting
- [ ] Language selection

### Day 4
- [ ] Tag creation
- [ ] Tag filtering
- [ ] Tag colors

### Day 5
- [ ] Better search
- [ ] Multiple filters
- [ ] Search UI

### Day 6-7
- [ ] UI polish
- [ ] Animations
- [ ] Error handling
- [ ] Mobile responsive

### Day 8
- [ ] Deploy to Vercel
- [ ] Test production

### Day 9
- [ ] Record demo video
- [ ] Take screenshots

### Day 10
- [ ] Write submission
- [ ] Update README
- [ ] Submit DevPost

### Day 11
- [ ] Buffer for fixes

## 💻 Essential Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npx tsc --noEmit

# Fix common issues
rm -rf node_modules package-lock.json
npm install
```

## 🗄️ Database Quick Reference

### Supabase Tables

**snippets**
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key)
- title (varchar)
- description (text)
- code (text)
- language (varchar)
- created_at (timestamp)
- updated_at (timestamp)
```

**tags**
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key)
- name (varchar)
- color (varchar)
```

**snippet_tags**
```sql
- snippet_id (uuid, foreign key)
- tag_id (uuid, foreign key)
```

### Common Queries

```typescript
// Fetch all snippets
const { data, error } = await supabase
  .from('snippets')
  .select('*, tags(*)')
  .order('created_at', { ascending: false });

// Create snippet
const { data, error } = await supabase
  .from('snippets')
  .insert({
    title,
    description,
    code,
    language,
    user_id: user.id
  })
  .select()
  .single();

// Update snippet
const { data, error } = await supabase
  .from('snippets')
  .update({ title, code })
  .eq('id', snippetId)
  .select()
  .single();

// Delete snippet
const { error } = await supabase
  .from('snippets')
  .delete()
  .eq('id', snippetId);
```

## 🎨 UI Components Available

```typescript
// Button
<Button variant="default | outline | ghost">
  Click me
</Button>

// Theme toggle
const { theme, toggleTheme } = useTheme();

// Auth
const { user, signIn, signOut } = useAuth();
```

## 🔧 Code Snippets to Copy

### Custom Hook Template
```typescript
// src/hooks/useSnippets.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useSnippets() {
  const queryClient = useQueryClient();

  const { data: snippets, isLoading } = useQuery({
    queryKey: ['snippets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('snippets')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (snippet: any) => {
      const { data, error } = await supabase
        .from('snippets')
        .insert(snippet)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
    },
  });

  return {
    snippets,
    isLoading,
    createSnippet: createMutation.mutate,
  };
}
```

### Monaco Editor Component
```typescript
// src/components/CodeEditor.tsx
import Editor from '@monaco-editor/react';
import { useTheme } from '@/contexts/ThemeContext';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
}

export function CodeEditor({ value, onChange, language }: CodeEditorProps) {
  const { theme } = useTheme();

  return (
    <Editor
      height="400px"
      language={language}
      value={value}
      onChange={(value) => onChange(value || '')}
      theme={theme === 'dark' ? 'vs-dark' : 'light'}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
    />
  );
}
```

## 🐛 Troubleshooting

### Problem: "Can't connect to Supabase"
```bash
# Check environment variables
cat frontend/.env.local

# Should have:
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=...

# Restart dev server
npm run dev
```

### Problem: "TypeScript errors"
```bash
# Check what's wrong
npx tsc --noEmit

# Common fixes:
# 1. Add missing types
# 2. Use 'any' temporarily
# 3. Check imports
```

### Problem: "Page won't load"
```bash
# Clear cache
# Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

# Check console
# Open browser DevTools → Console tab
```

## 📚 Learning Resources

- **React Query:** https://tanstack.com/query/latest/docs/react/overview
- **Supabase:** https://supabase.com/docs/guides/getting-started
- **Monaco Editor:** https://microsoft.github.io/monaco-editor/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **TypeScript:** https://www.typescriptlang.org/docs/

## 🎥 Demo Video Tips

**Structure (2-3 minutes):**
1. **Intro (15s):** "Hi, I'm X and I built CodeVault..."
2. **Problem (20s):** Show the pain point
3. **Demo (90s):** Live walkthrough of features
4. **Tech (20s):** Tech stack highlight
5. **Outro (15s):** Call to action

**Recording:**
- Use Loom (free) or OBS
- 1080p resolution minimum
- Clear audio (use headphones mic)
- Show your face (builds trust)
- No reading from script (be natural)

## 🏆 Winning Checklist

### Code Quality
- [ ] Clean, commented code
- [ ] No console errors
- [ ] TypeScript no errors
- [ ] Git commits with good messages

### Features
- [ ] Core functionality works
- [ ] No critical bugs
- [ ] Smooth user experience
- [ ] Mobile responsive

### Presentation
- [ ] Great demo video
- [ ] Clear README
- [ ] Good screenshots
- [ ] Live demo works

### Submission
- [ ] GitHub repo public
- [ ] DevPost submitted
- [ ] All links work
- [ ] Mentioned using Kilo

## ⚡ Time-Saving Tips

1. **Use AI (Kilo)** for boilerplate code
2. **Copy-paste** from this quick reference
3. **Focus** on core features first
4. **Test frequently** (don't wait till the end)
5. **Commit often** (save your progress)
6. **Deploy early** (test in production)

## 📊 Feature Priority

### Must Have (P0)
- ✅ Auth (done)
- Create/view snippets
- Code editor
- Copy to clipboard

### Should Have (P1)
- Tags
- Search
- Dark mode (done)

### Nice to Have (P2)
- AI categorization
- Export snippets
- Keyboard shortcuts

### If Time Allows (P3)
- Browser extension
- Public sharing
- Code execution

---

## 🎯 Remember

**You're building CodeVault to:**
1. Win the Kilo challenge
2. Create something useful
3. Learn new skills
4. Have an awesome portfolio piece

**You've got this! 🚀**

Need help? Check:
- `NEXT_STEPS.md` for immediate actions
- `SETUP_GUIDE.md` for detailed guide
- `README.md` for project overview
