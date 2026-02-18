# DevUnity - Project Context

## Project Overview

**DevUnity** is an open-source developer community platform built with **Next.js 15** and **TypeScript**. It serves as both a portfolio site for Asadullah Shafique (Agentic AI Developer & Full-Stack Engineer) and a community hub for developers to connect, collaborate, and share knowledge.

The project consists of two main parts:
1. **Frontend**: Next.js 15 application with ShadCN UI components
2. **Backend**: FastAPI Python service with LangGraph AI agent and MCP server integration

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 15 | React framework with SSR/SSG |
| TypeScript | Type-safe JavaScript |
| ShadCN UI | Accessible UI component library |
| Radix UI | Unstyled, accessible primitives |
| Tailwind CSS | Utility-first styling |
| next-themes | Dark/light theme management |
| Framer Motion | Animations |
| Lucide Icons | Icon library |

### Backend
| Technology | Purpose |
|------------|---------|
| FastAPI | Async Python web framework |
| LangGraph | Agentic AI workflows |
| LangChain | AI/LLM integration |
| Pydantic | Data validation |
| Docker | Containerized deployment |

## Project Structure

```
D:\GitHub\asadullahshafique_devunity\
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── about/        # About page
│   │   ├── blogs/        # Blog posts
│   │   ├── community/    # Community features
│   │   ├── dashboard/    # User dashboard
│   │   ├── explore/      # Explore content
│   │   ├── login/        # Authentication
│   │   ├── question/     # Q&A system
│   │   ├── signup/       # User registration
│   │   ├── api/          # API routes
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Home page
│   ├── components/
│   │   ├── ui/           # ShadCN UI components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── SearchDialog.tsx
│   │   └── ThemeProvider.tsx
│   ├── lib/
│   │   └── utils.ts      # Utility functions (cn helper)
│   └── types/            # TypeScript type definitions
├── backend/
│   ├── main.py           # FastAPI application
│   ├── agent.py          # LangGraph AI agent
│   ├── mcp_server.py     # MCP server implementation
│   ├── requirements.txt  # Python dependencies
│   └── Dockerfile        # Backend Docker config
├── public/               # Static assets
├── docker-compose.yml    # Multi-container orchestration
└── Configuration files (see below)
```

## Building and Running

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+ (for backend)
- Docker (optional, for containerized deployment)

### Frontend Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

The frontend runs on [http://localhost:3000](http://localhost:3000).

### Backend Development

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn main:app --reload --port 8000
```

The backend API runs on [http://localhost:8000](http://localhost:8000) with Swagger docs at `/docs`.

### Docker Deployment

```bash
# Start both frontend and backend
docker-compose up

# Or run in detached mode
docker-compose up -d
```

## Environment Variables

### Backend (.env)
| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Optional | Enables LangGraph agent features |
| `DISCORD_WEBHOOK_URL` | Optional | Contact form notifications |
| `GITHUB_TOKEN` | Optional | Higher GitHub API rate limits |

### Frontend
| Variable | Description |
|----------|-------------|
| `FASTAPI_BACKEND_URL` | Backend API URL (default: `http://localhost:8000`) |

## API Endpoints (Backend)

| Route | Method | Description |
|-------|--------|-------------|
| `/` | GET | Health check |
| `/api/contact` | POST | Contact form submission |
| `/api/blog` | GET | Blog posts |
| `/api/github/stats` | GET | GitHub profile stats |
| `/api/agent/chat` | POST | LangGraph AI assistant |
| `/api/agent/info` | GET | Agent configuration |
| `/mcp/tools` | GET | MCP tool listing |
| `/mcp/rpc` | POST | MCP JSON-RPC endpoint |
| `/docs` | GET | Swagger UI documentation |

## Configuration Files

| File | Purpose |
|------|---------|
| `next.config.js` | Next.js configuration |
| `next.config.ts` | Placeholder (avoids dual-config conflicts) |
| `tsconfig.json` | TypeScript compiler options |
| `tailwind.config.ts` | Tailwind CSS theming |
| `components.json` | ShadCN UI configuration |
| `.eslintrc.json` | ESLint rules |
| `postcss.config.mjs` | PostCSS configuration |
| `vercel.json` | Vercel deployment settings |
| `docker-compose.yml` | Docker multi-container setup |

## Development Conventions

### Code Style
- **TypeScript**: Strict mode enabled, path aliases (`@/*` → `./src/*`)
- **ESLint**: Extends `next/core-web-vitals` and `next/typescript`
- **Relaxed Rules**: Unused vars, explicit any, and unescaped entities are allowed

### Component Patterns
- ShadCN UI components follow the "new-york" style
- Components use `cn()` utility for class merging
- Theme-aware components use CSS variables from `globals.css`
- Client-side state components use mounted checks to prevent hydration issues

### File Naming
- React components: PascalCase (e.g., `ThemeProvider.tsx`)
- Utilities: camelCase (e.g., `utils.ts`)
- Pages: Follow Next.js App Router conventions

## Key Features

- **Dark/Light Theme**: Toggle via `next-themes` with system preference detection
- **Global Search**: Keyboard shortcut (Ctrl+K / Cmd+K) for quick navigation
- **Responsive Design**: Mobile-first with Tailwind breakpoints
- **AI Assistant**: LangGraph-powered portfolio assistant (when API key configured)
- **MCP Integration**: Model Context Protocol server for AI tool interoperability

## Common Tasks

### Adding a New Page
1. Create folder in `src/app/your-route/`
2. Add `page.tsx` with default export
3. Optionally add `layout.tsx` for nested layouts

### Adding UI Components
```bash
# Use ShadCN CLI (if available)
npx shadcn-ui@latest add button

# Or manually create in src/components/ui/
```

### API Integration
- Frontend API routes: `src/app/api/`
- Backend endpoints: `backend/main.py`
- Use `FASTAPI_BACKEND_URL` environment variable for backend communication

## Troubleshooting

### Hydration Issues
- Components using client-side state should use mounted checks
- `suppressHydrationWarning` on `<html>` and `<body>` for theme-related mismatches
- Browser extensions (Grammarly, etc.) may cause warnings that can be safely ignored

### Build Errors
- Run `npm run lint` to catch TypeScript/ESLint issues
- Ensure all imports use the `@/` alias correctly
- Check `tsconfig.json` paths configuration

## Author

**Asadullah Shafique** — Agentic AI Developer & Full-Stack Engineer
- GitHub: [@asadullah48](https://github.com/asadullah48)
- Portfolio: [asadullahshafique-devunity.vercel.app](https://asadullahshafique-devunity.vercel.app)
