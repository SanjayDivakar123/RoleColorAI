# RoleColorAI — AI-Powered Resume Rewriting Platform

RoleColorAI is the artificial intelligence engine powering **RoleColorFinder**, designed to reconstruct resumes through the lens of **RoleColor profiles**. Instead of producing standard CVs, it highlights what makes individuals distinct within teams — Builders (innovation, leadership, strategy), Enablers (collaboration, execution, bridge roles), Thrivers (adaptability, results under pressure), and Supportees (reliability, consistency, dependability).

## 🎯 Objective

Design and implement RoleColorAI as a Supabase-first platform that:
1. Uses Supabase for authentication, database, and storage
2. Relies on OpenAI API exclusively for parsing and rewriting resumes
3. Generates ATS-friendly resumes mapped to RoleColor profiles
4. Exports outputs as PDF and DOCX using programmatic templates

## 🏗️ Architecture Overview

```
[Web App (Next.js/React)]
        |
        v
[API Layer (FastAPI/Python)]
        |
        v
Resume Service (Upload → OpenAI Parse → Rewrite → Export)
        |
        v
Supabase (Auth, DB, Storage)
        |
        v
OpenAI API (Parsing + Rewriting)
```

## 📁 Repository Structure

```
/rolecolorai
  /apps
    /web               # Next.js frontend
    /api               # FastAPI backend
  /services
    /resume            # upload, OpenAI parsing, rewriting, export
    /ai                # prompt templates, OpenAI handlers
  /infra
    /supabase          # schema, migrations, policies
```

## 🛠️ Tech Stack

- **Frontend:** Next.js + TypeScript + Tailwind CSS + Supabase JS client
- **Backend:** FastAPI (Python) + Pydantic + SQLAlchemy
- **Auth & DB:** Supabase Auth + PostgreSQL
- **Storage:** Supabase Buckets
- **AI:** OpenAI API (GPT-4 for parsing and rewriting)
- **Document Generation:** ReportLab (PDF), python-docx (DOCX)
- **Deployment:** Docker + Docker Compose

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.9+
- Docker and Docker Compose
- Supabase CLI
- OpenAI API key

### Editing the Repository

#### 🌐 Direct GitHub Editing

**Quick File Editing:**
1. Navigate to any file in the [GitHub repository](https://github.com/SanjayDivakar123/RoleColorAI)
2. Click the **pencil icon (✏️)** in the top-right corner of the file view
3. Make your changes directly in the GitHub editor
4. Scroll down to "Commit changes" section
5. Add a commit message and click **"Commit changes"**

**Creating New Files:**
1. Navigate to the desired folder in the repository
2. Click **"Add file"** → **"Create new file"**
3. Name your file and add content
4. Commit directly to main or create a new branch

**GitHub Web Editor (Advanced):**
1. Press **`.` (period key)** while viewing the repository
2. This opens GitHub's VS Code-like web editor
3. Edit multiple files, navigate the project structure
4. Use Ctrl+S to save and commit changes
5. Access terminal, extensions, and full IDE features

**GitHub Codespaces (Cloud Development):**
1. Click **"Code"** → **"Codespaces"** → **"Create codespace on main"**
2. Full VS Code environment runs in your browser
3. Complete development environment with terminal access
4. Install extensions and run development servers
5. Changes sync automatically to your repository

#### 🔧 Development Environment Setup

1. **Environment Variables**
   ```bash
   cp .env.example .env
   cp apps/web/.env.local.example apps/web/.env.local
   cp apps/api/.env.example apps/api/.env
   ```

2. **Quick Start with Docker**
   ```bash
   docker-compose up -d
   ```

3. **Manual Setup (for detailed development):**

   **Frontend (Next.js):**
   ```bash
   cd apps/web
   npm install
   npm run dev
   ```

   **Backend (FastAPI):**
   ```bash
   cd apps/api
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

   **Supabase (Local):**
   ```bash
   cd infra/supabase
   supabase start
   ```

#### 🤖 AI-Powered Development Tools

**Using Codegen (AI Assistant):**
- **Slack Integration**: Tag `@codegen` in any channel to get help with code, reviews, or project tasks
- **Linear Integration**: Mention `@codegen` in Linear issues for automated task completion and updates
- **Codegen Platform**: Visit [codegen.com](https://codegen.com) to interact directly with the AI assistant
- **GitHub Integration**: Codegen automatically responds to PR comments and can create/update PRs

**GitHub Copilot (AI Code Completion):**
- **In GitHub Web Editor**: Press `.` to open web editor, then install GitHub Copilot extension
- **In Codespaces**: Copilot is pre-installed and ready to use
- **Usage**: Start typing code and Copilot will suggest completions
- **Accept Suggestions**: Press `Tab` to accept, `Esc` to dismiss
- **Alternative Suggestions**: Press `Alt+]` for next suggestion, `Alt+[` for previous

#### 💡 GitHub Editing Tips

- **Quick Edits**: Use the pencil icon for single file changes
- **Bulk Changes**: Press `.` for the web editor when editing multiple files
- **Keyboard Shortcuts**: In web editor, use Ctrl+Shift+P for command palette
- **Branch Protection**: Create a branch for major changes to avoid direct main commits
- **Commit Messages**: Use clear, descriptive commit messages for better project history

## 📊 Database Schema

### Users Table
- `id` (uuid, Supabase Auth)
- `email` (text)
- `plan` (enum: free, premium, pro, white_label)
- `rolecolor_profile` (jsonb: builder/enabler/thriver/supportee traits)

### Resumes Table
- `id` (uuid)
- `user_id` (fk → users.id)
- `original_file_url` (text, Supabase storage path)
- `parsed_json` (jsonb, from OpenAI parse)
- `rewritten_json` (jsonb, from OpenAI rewrite)
- `status` (enum: uploaded, parsed, rewritten, exported)

### Exports Table
- `id` (uuid)
- `resume_id` (fk → resumes.id)
- `file_url` (text, Supabase storage path)
- `format` (enum: pdf, docx)

## 🔄 Core Flows

### Authentication Flow
- Supabase Auth for login/signup
- On login, fetch RoleColorFinder assessments → store in `rolecolor_profile`

### Resume Processing Flow
1. User uploads resume (PDF/DOCX/TXT)
2. Raw text extracted from file
3. Raw text sent to OpenAI API for structured parsing into JSON
4. JSON + RoleColor profile sent to OpenAI for rewriting
5. Rewritten JSON injected into template (with/without branding depending on plan)
6. Export PDF + DOCX to Supabase Storage

## 🎨 RoleColor Profiles

- **Builders:** Innovation, leadership, strategy, vision
- **Enablers:** Collaboration, execution, bridge roles, facilitation
- **Thrivers:** Adaptability, results under pressure, resilience
- **Supportees:** Reliability, consistency, dependability, stability

## 📈 Success Criteria

- ✅ All resumes parsed into JSON by OpenAI API
- ✅ Rewritten resumes reflect RoleColor differences
- ✅ Exports are clean, ATS-friendly, and professional
- ✅ Branding toggle works per user plan

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software owned by RoleColorFinder.

## 🆘 Support

For support, email support@rolecolorfinder.com or join our Slack channel.

---

**Mission:** To create the world's first AI that rewrites resumes through a team-role lens, bridging personal career growth with RoleColorFinder's broader mission of enabling alignment within organizations.
