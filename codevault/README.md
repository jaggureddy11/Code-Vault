# 🚀 CODEVAULT

> **Built by developers, for developers.**  
> CodeVault is a high-performance, AI-powered workspace designed to eliminate context-switching. It is an "Industrial-Grade" engineering brain that centralizes your snippets, documentation, and continuous learning into one secure, ultra-fast environment.

---

## 🦾 Key Features

### 1. CodeVault AI: Your Elite Tutor
The heart of the Vault. A powerful sidekick powered by **Meta Llama 3 (8B)** that helps you:
- **Instant Explanation:** Deep-dive into complex architectural patterns or snippets.
- **Proactive Search:** Find exactly the logic you need inside your own library.
- **Industrial Logic:** A specialized "Tutor" persona designed to keep you focused and professional.

### 2. Voice Typing (Speech-to-Code)
Stop typing, start building.  
- **Zero-Lag Transcription:** Integrated native browser speech-to-text.
- **Interactive Workflow:** Dictate your logic or questions directly into the AI agent for rapid-fire development.

### 3. The Core Engine
- **Vault Dashboard:** Manage your secure logic library with the **Monaco Editor** (VS Code's engine).
- **Document Vault:** Dual-pane PDF viewer and Markdown note-taker for architectural planning.
- **Learning Zone:** Search and pin YouTube coding tutorials natively to stay out of the distractions of the main feed.
- **Project Explorer:** IDE-style structured file trees to group related modules and architectures.

### 4. Task Sheet (Protocol Tracker)
- **Weekly Grid:** Manage your long-term focus protocols with a dedicated 7-day task sheet.
- **Local Persistence:** All your tasks and daily progress are securely saved to your browser's persistent storage.
- **Momentum Tracking:** Integrated streak systems to visualize your 100% completion performance over time.
- **Responsive Sheet:** A professional, brutalist design optimized for both high-end desktops and mobile mobile usage.

---

## 🎨 Tech Stack & Aesthetic

CodeVault utilizes a **"Gritty Industrial"** design system:
- **Visuals:** High-contrast Black, White, and Red palette using **JetBrains Mono** typography.
- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Shadcn UI.
- **Backend:** Node.js, Express (Industrial Proxy).
- **Intelligence:** Hugging Face Inference API (Llama 3), Google Gemini.
- **Infrastructure:** Supabase (Auth, PostgreSQL, Row Level Security).

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/jaggureddy11/Code-Vault.git
cd Code-Vault

# Install all dependencies (Monorepo)
npm run install:all
```

### 2. Environment Setup
Create a `frontend/.env.local` file with the following keys:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_HUGGINGFACE_API_KEY=your_hf_token
VITE_GEMINI_API_KEY=your_gemini_key
```

### 3. Launch the Vault
```bash
npm run dev
```

---

## 🚢 Production Deployment

The project is pre-configured for **Render** or **Vercel** with a unified build command:
- **Build Command:** `npm run build` (Installs all dependencies and builds the production bundle).
- **Start Command:** `npm run start:backend` (Serves the production frontend via the Express proxy).

---
> [!IMPORTANT]
> **Security First:** CodeVault utilizes Supabase RLS (Row Level Security). Your "Intel" (Snippets/Notes) is never visible to other users unless explicitly marked as **Public**.

> [!TIP]
> Use the **Interactive Voice Mode** (Microphone Icon) for the fastest chat-based learning experience.
