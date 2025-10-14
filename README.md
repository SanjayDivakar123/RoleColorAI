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

### Local Development Setup

#### 🎯 Editing in Your Preferred IDE

**For Cursor IDE:**
1. Open Cursor and select "Open Folder"
2. Navigate to your local RoleColorAI directory
3. Cursor will automatically detect the project structure and provide AI-powered assistance
4. Install recommended extensions when prompted (TypeScript, Python, Tailwind CSS)

**For VS Code:**
1. Open VS Code and use `File > Open Folder`
2. Select your RoleColorAI project directory
3. Install recommended extensions:
   - Python
   - TypeScript and JavaScript Language Features
   - Tailwind CSS IntelliSense
   - Supabase (for database schema)
   - Docker (for container management)

**For Other IDEs:**
- **WebStorm/PyCharm**: Open project folder and configure Python/Node.js interpreters
- **Sublime Text**: Use `Project > Add Folder to Project`
- **Vim/Neovim**: Navigate to project directory and use your preferred plugin manager

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

#### 💡 IDE-Specific Tips

- **Cursor**: Use Ctrl+K for AI-powered code generation and explanations
- **VS Code**: Install the "GitHub Copilot" extension for AI assistance
- **All IDEs**: Set up integrated terminals for running development servers
- **Debugging**: Configure debugger settings for both Python (FastAPI) and TypeScript (Next.js)

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
