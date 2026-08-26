# DevUnity - Full-Stack Developer Portfolio & Community Platform

<div align="center">

[![Frontend CI](https://github.com/asadullah48/asadullahshafique_devunity/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/asadullah48/asadullahshafique_devunity/actions/workflows/frontend-ci.yml)
[![Backend CI](https://github.com/asadullah48/asadullahshafique_devunity/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/asadullah48/asadullahshafique_devunity/actions/workflows/backend-ci.yml)
[![Docker Build](https://github.com/asadullah48/asadullahshafique_devunity/actions/workflows/docker-build.yml/badge.svg)](https://github.com/asadullah48/asadullahshafique_devunity/actions/workflows/docker-build.yml)
[![Code Quality](https://github.com/asadullah48/asadullahshafique_devunity/actions/workflows/code-quality.yml/badge.svg)](https://github.com/asadullah48/asadullahshafique_devunity/actions/workflows/code-quality.yml)

[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green?logo=fastapi)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-✓-blue?logo=docker)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-✓-blue?logo=kubernetes)](https://kubernetes.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Live Demo](https://asadullahshafique-devunity.vercel.app) • [API Docs](https://asadullah-dev-portfolio-api.hf.space/docs) • [Discord Community](https://discord.gg/kXfEYVGX)

</div>

---

## 🌟 Overview

**DevUnity** is a production-ready, full-stack developer portfolio and community platform built with modern technologies. It showcases the work of **Asadullah Shafique** — an Agentic AI Developer & Full-Stack Engineer — while providing features for developer collaboration, knowledge sharing, and community engagement.

### Key Features

- 🎨 **Modern UI/UX** — Built with ShadCN UI, Tailwind CSS, and CSS-driven scroll reveals (framer-motion was removed: −40 kB First Load JS)
- 🌓 **Dark/Light Theme** — Seamless theme switching with next-themes
- 🤖 **AI-Powered Assistant** — LangGraph-powered portfolio chatbot
- 🔍 **Global Search** — Keyboard-accessible search (Ctrl/Cmd + K)
- 📝 **Blog System** — Share technical knowledge and experiences
- 💬 **Contact Form** — Discord webhook integration for notifications
- 📊 **GitHub Stats** — Real-time GitHub profile integration
- 🔌 **MCP Server** — a real Model Context Protocol server (official SDK, Streamable HTTP) exposing the portfolio as 6 read-only tools
- 🎬 **Video Library** — Upload and share educational videos
- 🧠 **AI Error Solver** — Intelligent coding error debugger
- 📚 **Learn through LLM** — Personalized AI-generated lessons
- 💡 **Teach to LLM** — Contribute knowledge to the AI system
- 🔒 **NoTeachLLM** — Privacy controls to opt-out of AI training
- 📦 **Backendless Projects** — Showcase frontend-only & static sites
- 🐳 **Docker Ready** — Multi-stage builds for optimized containers
- ☸️ **Kubernetes Ready** — Complete K8s manifests for production deployment
- 🚀 **CI/CD** — GitHub Actions workflows for automated testing and deployment

---

## 🧠 Agentic AI Mastery Matrix

Twelve competencies across four categories. **Every row cites a path you can open**, because a status badge nobody can check is decoration. Nothing reaches this table until something in the tree can answer for it — that rule is written down in [`CLAUDE.md`](CLAUDE.md) and it is the highest-priority instruction in this repository.

### Agentic Orchestration

| Competency | Substrate | Status |
|---|---|---|
| Engineering Multi-Agent Ecosystem Design (MAS) | [`backend/orchestration/orchestrator.py`](backend/orchestration/orchestrator.py) — triage agent + 4 specialists, star topology, one hop | Completed ✅ |
| Designing Graph-Based Agent Workflows | [`backend/agent.py`](backend/agent.py) — LangGraph graph; Plan-Act-Verify with no draft→approve edge | Completed ✅ |
| Implementing Agentic Coding & SDLC Standardization | [`CLAUDE.md`](CLAUDE.md) — a written operating spec governing every change | Completed ✅ |

### Connectivity & Protocols

| Competency | Substrate | Status |
|---|---|---|
| Engineering MCP Interoperability Layers | [`/mcp/server`](backend/mcp_server.py) — real FastMCP over Streamable HTTP, verified `initialize` → `tools/list` → `tools/call` | Completed ✅ |
| Standardizing Read-Only Agent Tool Contracts | [`backend/mcp_server.py`](backend/mcp_server.py) — 6 tools, read-only by default | Completed ✅ |
| Architecting Provider-Agnostic Fallback Ladders | [`backend/agent.py`](backend/agent.py) — Agents SDK → LangGraph → static answers | Completed ✅ |

### Enterprise & Scale

| Competency | Substrate | Status |
|---|---|---|
| Engineering Domain-Specific Intelligence Systems (Finance) | [FinAgent-Nexus](https://github.com/asadullah48/finagent-nexus) — <2 ms compliance screen, 0 model calls, 94 tests | Completed ✅ |
| Architecting Domain-Specific ERP Intelligence (Textile) | [Textile ERP / CMT](https://cmt-stitching-asadullah-shafiques-projects.vercel.app) — order lifecycle, 4 auto-billing types, party ledgers | In production ✅ |
| Implementing Cloud-Native Scale-Out | [`k8s/`](k8s/) — 11 manifests: autoscaling, network policy, service monitoring | Completed ✅ |

### Reliability & Safety

| Competency | Substrate | Status |
|---|---|---|
| Implementing Deterministic Guardrails | [`backend/constitution/principles.json`](backend/constitution/principles.json) — 5 principles; verified blocking 4/4 violations with no model reachable | Completed ✅ |
| Designing Feedback-Driven Evaluation Loops | [`evals/`](evals/) — deterministic trace layer + LLM judge; a case passes only if both pass | Completed ✅ |
| Engineering Context Integrity & Trace Auditability | [`backend/orchestration/context.py`](backend/orchestration/context.py) — typed shared state recording `route` and `tool_calls` | Completed ✅ |

> **Proof of the matrix, end to end:** [**FinAgent-Nexus**](https://github.com/asadullah48/finagent-nexus) — *Agentic AI Adoption for Financial Services.* Three specialists (MarketAnalyst, ComplianceOfficer, WealthStrategist) on a fixed state machine where no agent holds two of the three powers, Shari'ah and regulatory principles live in a versioned constitution reviewed like code, and every run writes a hash-chained, tamper-evident audit trail. **94 tests pass with no API key and no network** — so the numbers above are reproducible offline, at no marginal cost, by anyone who clones it. [Live screening engine →](https://finagent-nexus.vercel.app)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js 15)                    │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Pages     │  │  Components  │  │   AI Tools   │           │
│  │  (App Router)│  │  (ShadCN UI) │  │  (Error/Learn)│          │
│  └─────────────┘  └──────────────┘  └──────────────┘           │
│  ┌─────────────┐  ┌──────────────┐                              │
│  │   Videos    │  │   Dashboard  │                              │
│  │   Library   │  │              │                              │
│  └─────────────┘  └──────────────┘                              │
│                           Port: 3000                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Backend (FastAPI)                          │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Contact   │  │  LangGraph   │  │  MCP Server  │           │
│  │    API      │  │    Agent     │  │   Tools      │           │
│  └─────────────┘  └──────────────┘  └──────────────┘           │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  Blog Posts │  │ GitHub Stats │  │  Video Upload│           │
│  └─────────────┘  └──────────────┘  └──────────────┘           │
│  ┌─────────────┐  ┌──────────────┐                              │
│  │Error Solver │  │ Learn/Teach  │                              │
│  │   Agent     │  │   Agents     │                              │
│  └─────────────┘  └──────────────┘                              │
│                           Port: 7860                             │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
        ┌──────────┐   ┌──────────┐   ┌──────────┐
        │ Discord  │   │ GitHub   │   │Anthropic │
        │ Webhook  │   │   API    │   │   API    │
        └──────────┘   └──────────┘   └──────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 20+** and npm
- **Python 3.12+** (for backend)
- **Docker** (optional, for containerized deployment)

### 1. Clone the Repository

```bash
git clone https://github.com/asadullah48/asadullahshafique_devunity.git
cd asadullahshafique_devunity
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 3. Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env

# Start FastAPI server
uvicorn main:app --reload --port 8000
```

Visit [http://localhost:8000/docs](http://localhost:8000/docs) for Swagger UI

### 4. Docker (Alternative)

```bash
# Start both frontend and backend
docker-compose up

# Or build specific services
docker-compose build frontend
docker-compose build backend
```

---

## 📁 Project Structure

```
asadullahshafique_devunity/
├── src/                      # Frontend Next.js application
│   ├── app/                  # App Router pages
│   │   ├── about/            # About page
│   │   ├── ai-tools/         # AI tools (Error Solver, Learn, Teach)
│   │   ├── blogs/            # Blog listing
│   │   ├── community/        # Community features
│   │   ├── dashboard/        # User dashboard
│   │   ├── explore/          # Explore content
│   │   ├── videos/           # Video library & upload
│   │   ├── login/            # Authentication
│   │   ├── question/         # Q&A system
│   │   ├── signup/           # Registration
│   │   ├── api/              # API routes
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/           # React components
│   │   ├── ui/               # ShadCN UI components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── SearchDialog.tsx
│   │   └── ThemeProvider.tsx
│   ├── lib/                  # Utilities
│   │   └── utils.ts          # cn() helper
│   └── types/                # TypeScript types
├── backend/                  # FastAPI backend
│   ├── main.py               # FastAPI application
│   ├── agent.py              # LangGraph AI agents (4 agents)
│   ├── mcp_server.py         # MCP server implementation
│   ├── requirements.txt      # Python dependencies
│   └── Dockerfile            # Backend Docker config
├── k8s/                      # Kubernetes manifests
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── secrets.yaml
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   ├── services/
│   └── ingress.yaml
├── .github/workflows/        # GitHub Actions CI/CD
│   ├── frontend-ci.yml
│   ├── backend-ci.yml
│   ├── docker-build.yml
│   └── k8s-deploy.yml
├── scripts/                  # Utility scripts
│   └── build-docker.sh
├── docker-compose.yml        # Docker Compose config
├── Dockerfile.frontend       # Frontend Docker config
└── README.md                 # This file
```

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15 | React framework with App Router |
| **TypeScript** | 5 | Type-safe JavaScript |
| **ShadCN UI** | Latest | Accessible UI components |
| **Radix UI** | Latest | UI primitives |
| **Tailwind CSS** | 3.4 | Utility-first CSS |
| **Framer Motion** | 11 | Animations |
| **next-themes** | 0.4 | Theme management |
| **Lucide Icons** | Latest | Icon library |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **FastAPI** | 0.115 | Async Python web framework |
| **LangGraph** | 0.2+ | Agentic AI workflows |
| **LangChain** | 0.3+ | AI/LLM integration |
| **Pydantic** | 2.10 | Data validation |
| **httpx** | 0.28 | Async HTTP client |
| **Uvicorn** | 0.32 | ASGI server |

### DevOps

| Technology | Purpose |
|------------|---------|
| **Docker** | Containerization |
| **Kubernetes** | Orchestration |
| **GitHub Actions** | CI/CD |
| **Vercel** | Frontend hosting |
| **Hugging Face Spaces** | Backend hosting |

---

## 📦 Deployment

### Frontend (Vercel)

The frontend is automatically deployed to Vercel on push to `main`:

1. Connect your repository to [Vercel](https://vercel.com)
2. Set environment variables in Vercel dashboard
3. Push to `main` branch

### Backend (Hugging Face Spaces)

Deploy to Hugging Face Spaces with Docker SDK:

1. Create a new Space with Docker SDK
2. Add environment variables in Space settings
3. Push backend files to Space repository

Or use the automated GitHub Actions workflow.

### Kubernetes (Production)

```bash
# Apply all manifests
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ingress.yaml

# Verify deployment
kubectl get pods -n asadullah-dev
kubectl get services -n asadullah-dev
```

---

## 🔌 MCP Server

The portfolio is exposed as a real [Model Context Protocol](https://modelcontextprotocol.io) server, built on the official
Python SDK and served over **Streamable HTTP**. Any MCP client can complete a full `initialize` → `tools/list` → `tools/call`
handshake against it.

**Endpoint:** `https://asadullahshafique-devunity.onrender.com/mcp/server`

**Tools** (all read-only, no arguments):

| Tool | Returns |
|------|---------|
| `get_skills` | Languages, frameworks, data stores, AI tooling, DevOps |
| `get_projects` | Every project with status, summary, tech stack, and published metrics |
| `get_contact` | Email, WhatsApp, GitHub, Discord, portfolio URL |
| `get_about` | Roles, location, positioning, focus, education |
| `get_hackathons` | Six Panaversity hackathons with per-event results |
| `get_agent_engineering` | The harness / loop / graph disciplines |

Every tool reads from `backend/knowledge/portfolio.json`, the single source of truth shared with the site's chat agent — so the
MCP tools and the website can never disagree.

```jsonc
// Claude Desktop — claude_desktop_config.json
{
  "mcpServers": {
    "asadullah-portfolio": {
      "url": "https://asadullahshafique-devunity.onrender.com/mcp/server"
    }
  }
}
```

> The older `/mcp/tools` and `/mcp/rpc` paths are a plain-REST convenience shim kept for backwards compatibility. They are **not**
> MCP and no MCP client can connect to them — use `/mcp/server`.

---

## ⚖️ Constitutional AI

The agent operates under a written constitution — `backend/constitution/principles.json` — enforced as guardrails on the
orchestrator, not as prompt suggestions.

| Principle | Applies to |
|-----------|-----------|
| Refuse academic dishonesty | input |
| Refuse assistance with illegal activity | input |
| Refuse harmful content | input |
| Never invent facts about Asadullah | output |
| Never disclose system instructions or credentials | output |

Each principle is enforced twice: a **deterministic substring screen** that needs no model, and an **LLM classifier** against the
principle's written rule for the nuance substrings miss. Either can trip the wire.

The deterministic layer is the point. It fires *before* any model call, so the constitution holds even when the provider is down —
verified blocking 4/4 violations with **no model reachable at all**. Conversely, enforcement **fails open**: if the classifier is
unavailable the request proceeds under deterministic-only screening rather than the site refusing everything. `/api/agent/info`
reports which mode is live.

Over-blocking is treated as a failure too. `evals/cases/constitution.json` includes explicit *allow* cases — explaining a concept
that mentions "homework", asking about defensive security — because a portfolio assistant that refuses legitimate questions fails
in front of exactly the audience it exists to impress.

---

## 📊 Agent Evals

Agent quality is measured, not asserted. `evals/` holds golden datasets scored on two layers:

```bash
python evals/run.py --no-judge   # deterministic checks, no model spend
python evals/run.py --strict     # full run; exit 1 on failure (what CI runs)
```

| Layer | Checks | How |
|-------|--------|-----|
| **Deterministic** | Did triage route to the right specialist? Did it call the right tool? | Read from the run's typed context — free, exact |
| **LLM-as-judge** | Is the answer faithful to `portfolio.json`? Did it refuse to invent? | Rubric-scored 1–5, reason required before the score |

The deterministic layer catches the failure that matters most: **an agent answering fluently from memory instead of calling
its tool.** Prose-only judging passes those; a tool-call trace does not.

One case (`portfolio-contact`) is committed **failing on purpose** — it pins a known defect where the specialist skips
`get_contact`. A suite that is green on day one has not been tested. See [`evals/README.md`](evals/README.md).

---

## 🤖 AI-Powered Features

### 1. Error Solver Agent
**Location:** `/ai-tools` or `/api/agent/solve-error`

An intelligent debugging assistant that analyzes coding errors and provides:
- **Clear explanations** of what went wrong
- **Step-by-step solutions** to fix the issue
- **Corrected code** snippets
- **Confidence scores** for each solution

**Supported Languages:** Python, JavaScript, TypeScript, Java, C++

**Example Usage:**
```bash
curl -X POST http://localhost:8000/api/agent/solve-error \
  -H "Content-Type: application/json" \
  -d '{
    "error_message": "TypeError: '\''int'\'' object is not iterable",
    "code_snippet": "for i in 5:\n    print(i)",
    "language": "python",
    "context": "Trying to loop through a number"
  }'
```

### 2. Learn Through LLM
**Location:** `/ai-tools` or `/api/learn`

Get personalized AI-generated lessons on any topic:
- **Customized lesson plans** based on your level (beginner/intermediate/advanced)
- **Learning style adaptation** (interactive, visual, theoretical)
- **Recommended resources** and tutorials
- **Quiz questions** to test understanding
- **Next steps** for continued learning

**Example Usage:**
```bash
curl -X POST http://localhost:8000/api/learn \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Machine Learning",
    "level": "beginner",
    "learning_style": "interactive",
    "questions": ["What is ML?", "How does neural network work?"]
  }'
```

### 3. Teach To LLM
**Location:** `/ai-tools` or `/api/teach`

Contribute your knowledge to the AI system:
- **Structure and organize** educational content
- **Generate practical exercises** for learners
- **Link related topics** for better discovery
- **Build a knowledge base** for the community

**Example Usage:**
```bash
curl -X POST http://localhost:8000/api/teach \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "FastAPI Dependency Injection",
    "content": "Dependency injection is a technique for providing dependencies to functions.",
    "difficulty": "intermediate",
    "examples": ["def get_db(): ...", "async def get_current_user(): ..."]
  }'
```

### 4. Video Library
**Location:** `/videos` or `/api/video/*`

Upload and share educational videos:
- **Upload videos** with metadata (title, description, tags)
- **Browse video library** with search functionality
- **Tag-based filtering** for easy discovery
- **Delete videos** you've uploaded

**Example Usage:**
```bash
# Upload video
curl -X POST http://localhost:8000/api/video/upload \
  -F "title=Introduction to FastAPI" \
  -F "description=Learn the basics of FastAPI" \
  -F "tags=python,fastapi,tutorial" \
  -F "uploader=John Doe" \
  -F "file=@video.mp4"

# List all videos
curl http://localhost:8000/api/video/list

# Filter by tag
curl "http://localhost:8000/api/video/list?tag=python"
```

### 5. NoTeachLLM - Privacy Controls
**Location:** `/privacy` or `/api/noteachllm/*`

Opt-out of AI training and control your data privacy:
- **Complete opt-out** from all AI features
- **Granular control** (learning, teaching, analytics)
- **Check status** of your opt-out
- **Revoke opt-out** anytime

**Scopes:**
- `all`: Complete opt-out from all AI features
- `learning`: Don't track learning progress
- `teaching`: Don't use taught content for AI training
- `analytics`: Disable analytics tracking

**Example Usage:**
```bash
# Opt out
curl -X POST http://localhost:8000/api/noteachllm \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "scope": "all",
    "reason": "Privacy concerns"
  }'

# Check status
curl "http://localhost:8000/api/noteachllm/status?email=user@example.com"

# Revoke opt-out
curl -X DELETE http://localhost:8000/api/noteachllm/opt-abc123
```

### 6. Backendless Project Support
**Location:** `/backendless` or `/api/backendless/*`

Showcase frontend-only projects without backend requirements:
- **Create project entries** for static sites
- **Support multiple frameworks** (Next.js, React, Vue, Angular, Svelte)
- **Upload static files** (ZIP deployment)
- **Serve static content** directly from backend
- **Filter by framework** for easy browsing

**Perfect for:**
- Portfolio websites
- Landing pages
- JAMstack applications
- Frontend framework demos
- Static site generators

**Example Usage:**
```bash
# Create backendless project
curl -X POST http://localhost:8000/api/backendless \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Portfolio",
    "description": "Personal portfolio built with Next.js",
    "framework": "nextjs",
    "github_url": "https://github.com/...",
    "demo_url": "https://myportfolio.vercel.app",
    "tech_stack": ["TypeScript", "Tailwind", "Framer Motion"],
    "features": ["Dark mode", "Responsive", "SEO optimized"]
  }'

# List all projects
curl http://localhost:8000/api/backendless

# Filter by framework
curl "http://localhost:8000/api/backendless?framework=nextjs"

# Upload static files (ZIP)
curl -X POST http://localhost:8000/api/backendless/1/upload \
  -F "file=@dist.zip"
```

---

## 🔧 Configuration

### Environment Variables

#### Frontend (.env.local)

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` |
| `NEXT_PUBLIC_PRODUCTION_API_URL` | Production API URL | - |
| `NEXT_PUBLIC_SITE_URL` | Site URL for SEO | `https://asadullah.dev` |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID | - |
| `NEXT_PUBLIC_ENABLE_AI_AGENT` | Enable AI chatbot | `true` |

#### Backend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `DISCORD_WEBHOOK_URL` | Discord webhook for notifications | No |
| `GITHUB_TOKEN` | GitHub API token | No |
| `ANTHROPIC_API_KEY` | Anthropic API for AI agent | No* |
| `GITHUB_USERNAME` | GitHub username | `asadullah48` |
| `PORT` | Server port | `7860` |

*Required for LangGraph agent features

---

## 🔌 API Endpoints

### Backend API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/contact` | POST | Submit contact form |
| `/api/contact/messages` | GET | Get all messages |
| `/api/blog` | GET | Get blog posts |
| `/api/blog/{slug}` | GET | Get single blog post |
| `/api/github/stats` | GET | Get GitHub stats |
| `/api/agent/chat` | POST | AI agent chat |
| `/api/agent/solve-error` | POST | **NEW** AI-powered error solver |
| `/api/agent/info` | GET | Agent configuration |
| `/api/learn` | POST | **NEW** Learn through LLM |
| `/api/learn/progress` | GET | **NEW** Learning progress |
| `/api/teach` | POST | **NEW** Teach to LLM |
| `/api/teach/content` | GET | **NEW** Taught content |
| `/api/video/upload` | POST | **NEW** Upload video |
| `/api/video/list` | GET | **NEW** List videos |
| `/api/video/{video_id}` | GET | **NEW** Get video |
| `/api/video/{video_id}` | DELETE | **NEW** Delete video |
| `/api/noteachllm` | POST | **NEW** Opt-out of AI training |
| `/api/noteachllm/status` | GET | **NEW** Check opt-out status |
| `/api/noteachllm/{id}` | DELETE | **NEW** Revoke opt-out |
| `/api/backendless` | GET | **NEW** List backendless projects |
| `/api/backendless` | POST | **NEW** Create backendless project |
| `/api/backendless/{id}` | GET | **NEW** Get project |
| `/api/backendless/{id}` | PUT | **NEW** Update project |
| `/api/backendless/{id}` | DELETE | **NEW** Delete project |
| `/api/backendless/{id}/upload` | POST | **NEW** Upload static files |
| `/mcp/server` | * | **Real MCP endpoint** (Streamable HTTP) — connect MCP clients here |
| `/mcp/tools` | GET | Plain-REST tool listing (convenience shim, not MCP) |
| `/mcp/rpc` | POST | JSON-RPC-shaped shim (convenience, not MCP) |
| `/docs` | GET | Swagger UI documentation |

### Example: Contact Form

```bash
curl -X POST http://localhost:8000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Project Collaboration",
    "message": "I would like to discuss a potential collaboration."
  }'
```

### Example: AI Agent Chat

```bash
curl -X POST http://localhost:8000/api/agent/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What are Asadullah main skills?"
  }'
```

---

## 🧪 Testing

### Frontend

```bash
# Run linter
npm run lint

# Type check
npx tsc --noEmit

# Run tests (when added)
npm test
```

### Backend

```bash
cd backend

# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest -v

# Lint with Ruff
ruff check .

# Type check with MyPy
mypy .
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure CI passes before requesting review

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [ShadCN UI](https://ui.shadcn.com/) - Beautiful, accessible components
- [Radix UI](https://www.radix-ui.com/) - UI primitives
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Next.js](https://nextjs.org/) - React framework
- [FastAPI](https://fastapi.tiangolo.com/) - Python web framework
- [LangGraph](https://langchain-ai.github.io/langgraph/) - Agentic AI
- [Lucide Icons](https://lucide.dev/) - Icon library

---

## 📬 Contact

**Asadullah Shafique**

- 📧 Email: asadullahshafique@hotmail.com
- 💻 GitHub: [@asadullah48](https://github.com/asadullah48)
- 🎮 Discord: [Join Server](https://discord.gg/kXfEYVGX)
- 🌐 Portfolio: [asadullah.dev](https://asadullah.dev)

---

<div align="center">

**Made with ❤️ by Asadullah Shafique**

[Back to top](#readme)

</div>
