---
title: Asadullah Portfolio API
emoji: 🤖
colorFrom: green
colorTo: blue
sdk: docker
pinned: true
license: mit
app_port: 7860
short_description: FastAPI backend — contact, blog, AI agent, MCP
---

# Asadullah.dev — Portfolio API Backend

FastAPI backend powering [asadullahshafique-devunity.vercel.app](https://asadullahshafique-devunity.vercel.app)

## Endpoints

| Route | Description |
|-------|-------------|
| `GET /` | Health check |
| `POST /api/contact` | Contact form submission |
| `GET /api/blog` | Blog posts |
| `GET /api/github/stats` | GitHub profile stats |
| `POST /api/agent/chat` | LangGraph AI portfolio assistant |
| `GET /api/agent/info` | Agent configuration info |
| `GET /mcp/tools` | MCP tool listing |
| `POST /mcp/rpc` | MCP JSON-RPC endpoint |
| `GET /docs` | Interactive Swagger UI |

## Tech Stack

- **FastAPI** — async Python web framework
- **LangGraph** — agentic AI workflow (portfolio assistant)
- **MCP** — Model Context Protocol server for AI tool integration
- **Docker** — containerized deployment
- **Pydantic** — data validation

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Optional | Enables full LangGraph agent (falls back to static otherwise) |
| `DISCORD_WEBHOOK_URL` | Optional | Contact form → Discord notifications |
| `GITHUB_TOKEN` | Optional | Higher GitHub API rate limits |
| `ALLOWED_ORIGINS` | Recommended | Comma-separated CORS origins (e.g. `https://asadullahshafique-devunity.vercel.app`) |

## Local Development

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# Docs at http://localhost:8000/docs
```

## Author

**Asadullah Shafique** — Agentic AI Developer
GitHub: [@asadullah48](https://github.com/asadullah48)
Discord: [Join Server](https://discord.gg/kXfEYVGX)
