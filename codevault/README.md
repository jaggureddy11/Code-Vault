# CodeVault 🔐

> Your personal AI-powered code snippet library

**DeveloperWeek 2026 Hackathon Project**  
**Challenge:** Kilo - "Finally Ship It"

## 🎯 The Problem

Developers spend countless hours re-searching for code snippets they've used before. We dig through old projects, bookmark Stack Overflow answers we never find again, and waste time recreating solutions we've already built.

## 💡 The Solution

CodeVault is a beautiful, fast, and intelligent code snippet manager that helps developers:
- 📝 Save code snippets with rich context
- 🏷️ Organize with tags and collections
- 🔍 Find snippets instantly with AI-powered search
- 🎨 Beautiful syntax highlighting for 100+ languages
- 📋 One-click copy to clipboard
- 🌓 Dark mode support
- 🚀 Blazing fast performance

## ✨ Key Features

### Core Features
- **Rich Code Editor**: Monaco Editor (same as VS Code) with IntelliSense
- **Smart Search**: AI-powered semantic search + traditional text search
- **Auto-Categorization**: AI suggests tags and categories
- **Syntax Highlighting**: Support for 100+ programming languages
- **Tag Management**: Create, filter, and organize with tags
- **Dark/Light Theme**: Beautiful UI in both modes
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop

### Technical Highlights
- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui components
- **Backend**: Node.js + Express
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Authentication
- **AI**: OpenAI API for semantic search
- **Deployment**: Vercel (Frontend) + Railway (Backend)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (free tier works)
- OpenAI API key (for AI features)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/codevault.git
cd codevault
```

2. **Set up Frontend**
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
npm run dev
```

3. **Set up Backend** (in a new terminal)
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

4. **Open your browser**
```
http://localhost:5173
```

## 📁 Project Structure

```
codevault/
├── frontend/           # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom hooks
│   │   ├── lib/         # Utilities
│   │   └── types/       # TypeScript types
│   └── package.json
├── backend/            # Node.js backend
│   ├── src/
│   │   ├── routes/      # API routes
│   │   ├── controllers/ # Business logic
│   │   ├── services/    # External services
│   │   └── middleware/  # Express middleware
│   └── package.json
└── docs/              # Documentation
```

## 🗄️ Database Schema

```sql
-- Users table (managed by Supabase Auth)

-- Snippets
CREATE TABLE snippets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  code TEXT NOT NULL,
  language VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tags
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name VARCHAR(50) NOT NULL,
  color VARCHAR(7) DEFAULT '#3B82F6',
  UNIQUE(user_id, name)
);

-- Snippet Tags (many-to-many)
CREATE TABLE snippet_tags (
  snippet_id UUID REFERENCES snippets ON DELETE CASCADE,
  tag_id UUID REFERENCES tags ON DELETE CASCADE,
  PRIMARY KEY (snippet_id, tag_id)
);
```

## 🎨 UI Screenshots

[Add screenshots here after building]

## 🎥 Demo Video

[Link to demo video - 2-3 minutes]

## 🏗️ Built With

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Monaco Editor** - Code editor
- **React Query** - Data fetching
- **React Router** - Routing

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Supabase** - Database & Auth
- **OpenAI API** - AI features
- **PostgreSQL** - Database

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test
```

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Backend (Railway)
```bash
cd backend
railway up
```

## 📝 Environment Variables

### Frontend (.env.local)
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:3000
```

### Backend (.env)
```
DATABASE_URL=your_supabase_db_url
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
OPENAI_API_KEY=your_openai_key
PORT=3000
NODE_ENV=development
```

## 🎯 Roadmap

- [x] Core snippet CRUD
- [x] Tag management
- [x] Search functionality
- [x] AI categorization
- [x] Dark mode
- [ ] Browser extension
- [ ] Public snippet sharing
- [ ] Collections/folders
- [ ] Code execution
- [ ] Export to GitHub Gist

## 🤝 Contributing

This is a hackathon project, but contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Twitter: [@yourtwitter](https://twitter.com/yourtwitter)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Built for DeveloperWeek 2026 Hackathon
- Powered by Kilo AI coding tools
- UI inspiration from modern developer tools
- Thanks to the open source community

## 📧 Contact

Questions? Reach out at your.email@example.com or open an issue!

---

**Built with ❤️ for the DeveloperWeek 2026 Hackathon**
