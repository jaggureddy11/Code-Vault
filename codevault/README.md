# 🚀 CodeVault

> **Built by developers, for developers.**
> CodeVault is a high-performance, AI-powered workspace and knowledge-management platform designed specifically to eliminate context-switching. It combines code snippet execution, architectural planning, documentation storage, and tutorial tracking into one secure environment.

---

## 🎨 Brand Identity & Architecture

* **Tech Stack:** React 18, Vite, Tailwind CSS (Frontend), Express, Node.js (Backend proxy), and Supabase (PostgreSQL Database & Auth).
* **Aesthetic:** "Gritty Industrial." Features a stark black, white, and red color palette utilizing strict `JetBrains Mono` code fonts and aggressive italics to feel like a premium, high-speed engineering tool.
* **Security:** Built completely on Supabase Row Level Security (RLS). Every snippet, note, and project is rigorously protected so users can only access their personal "intel."

---

## 🗺️ Complete Website Sections

### 1. Authentication & Onboarding
* **The Gates (Login & Signup Pages):** The entry points feature a stunning, interactive 3D CSS Holographic Cube that maps to the user’s cursor movement. It provides a massive "wow" factor right from the start, utilizing Supabase Auth to securely log developers in.

### 2. The Core Engine (Code Management)
* **Vault Dashboard (`/dashboard`):** The primary hub. Here, developers can create, read, update, and delete their code snippets. It utilizes the powerful Monaco Editor (the same tech behind VS Code) to support syntax highlighting for over 100+ languages. 
* **Project Explorer (`/projects`):** Instead of loose snippets, developers can create structured "Projects" to group related files, architectures, and modules together, operating much like a standard IDE file tree.
* **Favorites (`/favorites`):** Quick-access bookmarks for a developer's most heavily utilized logic blocks.

### 3. Community & Discovery
* **Explore Grid (`/explore`):** The open-source community section. Developers can toggle snippets from "Private" to "Public", allowing other engineers across the platform to search, view, and utilize their code.
* **Snippet Details:** Dedicated full-screen views for deep-diving into specific public or private logic blocks, complete with one-click copy functionality.

### 4. Advanced Learning Tools
* **Document Vault (`/notes`):** A specialized dual-pane workflow. Developers can upload and review technical PDFs on the left, while taking rich-text, markdown-supported architectural notes on the right.
* **Learning Zone (`/learning`):** To prevent developers from getting lost in the YouTube algorithm, this section integrates the YouTube v3 API native into the application. Developers can search, watch, and pin coding tutorials directly inside CodeVault.


## 💡 Why CodeVault Wins (The Pitch)

*"Developers waste countless hours switching between Google, YouTube, VS Code, and Notion just to find one piece of logic they wrote 6 months ago. **CodeVault** centralizes the engineering brain. It’s not just a pastebin; it’s an entire secure operating system for your code architecture, documentation, and continuous learning."*

---

## 🚀 Getting Started

To run the platform locally:

1. Clone this repository.
2. Install dependencies for both frontend and backend:
   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   ```
3. Set up your `.env` variables for Supabase and the Backend Server.
4. Run the development environment:
   ```bash
   npm run dev
   ```

Enjoy building inside the vault!
