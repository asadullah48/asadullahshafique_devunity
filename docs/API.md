# API Documentation

## Asadullah.dev Portfolio API

This document provides comprehensive documentation for the Asadullah.dev Portfolio API.

**Base URL:** `https://asadullah-dev-portfolio-api.hf.space` (Production)  
**Local URL:** `http://localhost:8000`  
**API Version:** 2.1.0  
**OpenAPI Spec:** `/openapi.json`  
**Swagger UI:** `/docs`  
**ReDoc:** `/redoc`

---

## Table of Contents

- [Authentication](#authentication)
- [Health Endpoints](#health-endpoints)
- [Contact API](#contact-api)
- [Blog API](#blog-api)
- [GitHub Stats API](#github-stats-api)
- [AI Agent API](#ai-agent-api)
- [MCP Server API](#mcp-server-api)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

---

## Authentication

Currently, the API is open for demo purposes. For production use, add API key authentication via headers:

```http
Authorization: Bearer YOUR_API_KEY
```

---

## Health Endpoints

### Health Check

Check the API health status.

**Endpoint:** `GET /`  
**Endpoint:** `GET /health`

**Response:**

```json
{
  "status": "healthy",
  "version": "2.1.0",
  "timestamp": "2026-02-18T12:00:00.000Z",
  "environment": "production"
}
```

**Status Codes:**
- `200 OK` - API is healthy
- `503 Service Unavailable` - API is unhealthy

---

## Contact API

### Submit Contact Form

Submit a contact form message.

**Endpoint:** `POST /api/contact`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Collaboration",
  "message": "I would like to discuss a potential collaboration opportunity."
}
```

**Response:**

```json
{
  "success": true,
  "message": "Message received! I'll get back to you soon."
}
```

**Status Codes:**
- `200 OK` - Message submitted successfully
- `400 Bad Request` - Invalid input data
- `422 Unprocessable Entity` - Validation error
- `500 Internal Server Error` - Server error

**Example (cURL):**

```bash
curl -X POST http://localhost:8000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Project Collaboration",
    "message": "Hello!"
  }'
```

### Get All Messages (Admin)

Retrieve all contact messages. ⚠️ **Requires authentication in production.**

**Endpoint:** `GET /api/contact/messages`

**Response:**

```json
{
  "messages": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "subject": "Project Collaboration",
      "message": "Hello!",
      "timestamp": "2026-02-18T12:00:00.000Z",
      "read": false
    }
  ],
  "total": 1
}
```

---

## Blog API

### Get All Blog Posts

Retrieve all blog posts with optional filtering.

**Endpoint:** `GET /api/blog`

**Query Parameters:**

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `featured` | boolean | Filter by featured status | All posts |
| `limit` | integer | Limit number of results | All posts |

**Example:** `GET /api/blog?featured=true&limit=5`

**Response:**

```json
[
  {
    "id": 1,
    "title": "Why Spec-First Development Changes Everything",
    "excerpt": "How the SpecifyKit methodology transformed my approach to building AI applications.",
    "content": "Full article content...",
    "date": "Feb 2026",
    "read_time": "5 min",
    "tags": ["SpecifyKit", "Methodology", "AI"],
    "slug": "spec-first-development",
    "featured": true
  }
]
```

### Get Single Blog Post

Retrieve a single blog post by slug.

**Endpoint:** `GET /api/blog/{slug}`

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `slug` | string | Unique slug identifier |

**Example:** `GET /api/blog/spec-first-development`

**Response:**

```json
{
  "id": 1,
  "title": "Why Spec-First Development Changes Everything",
  "excerpt": "How the SpecifyKit methodology transformed my approach to building AI applications.",
  "content": "Full article content...",
  "date": "Feb 2026",
  "read_time": "5 min",
  "tags": ["SpecifyKit", "Methodology", "AI"],
  "slug": "spec-first-development",
  "featured": true
}
```

**Status Codes:**
- `200 OK` - Success
- `404 Not Found` - Blog post not found

---

## GitHub Stats API

### Get GitHub Profile Stats

Retrieve GitHub profile statistics for the portfolio owner.

**Endpoint:** `GET /api/github/stats`

**Response:**

```json
{
  "public_repos": 50,
  "followers": 100,
  "following": 20,
  "total_stars": 500,
  "top_languages": ["Python", "TypeScript", "JavaScript", "Rust", "Go"]
}
```

**Status Codes:**
- `200 OK` - Success
- `403 Forbidden` - GitHub API rate limit exceeded
- `503 Service Unavailable` - GitHub API unavailable

---

## AI Agent API

### Chat with AI Agent

Chat with the LangGraph-powered portfolio assistant.

**Endpoint:** `POST /api/agent/chat`

**Request Body:**

```json
{
  "message": "What are Asadullah's main skills?",
  "session_id": "user-123"
}
```

**Response:**

```json
{
  "answer": "Asadullah's main skills include TypeScript, JavaScript, Python, Next.js, React, FastAPI, Docker, Agentic AI, and Generative AI.",
  "mode": "langgraph",
  "session_id": "user-123",
  "confidence": 0.95
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `answer` | string | AI-generated response |
| `mode` | string | Agent mode: `langgraph` or `static` |
| `session_id` | string | Session identifier (optional) |
| `confidence` | number | Response confidence score (0-1) |

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Invalid input
- `500 Internal Server Error` - Agent error

### Get Agent Info

Retrieve information about the AI agent configuration.

**Endpoint:** `GET /api/agent/info`

**Response:**

```json
{
  "agent_type": "LangGraph StateGraph with tool-calling",
  "llm": "claude-haiku-4-5-20251001 (Anthropic)",
  "tools": ["get_portfolio_info"],
  "langgraph_installed": true,
  "llm_configured": true,
  "mode": "langgraph",
  "fallback": "Static portfolio responses when LLM not configured"
}
```

---

## MCP Server API

### MCP Info

Get MCP server information.

**Endpoint:** `GET /mcp/`

**Response:**

```json
{
  "name": "asadullah-portfolio-mcp",
  "version": "1.0.0",
  "description": "MCP server exposing Asadullah Shafique's portfolio as AI-queryable tools",
  "protocol": "Model Context Protocol",
  "endpoint": "/mcp/rpc"
}
```

### List MCP Tools (REST)

List all available MCP tools.

**Endpoint:** `GET /mcp/tools`

**Response:**

```json
{
  "tools": [
    {
      "name": "get_skills",
      "description": "Get Asadullah's technical skills, languages, and frameworks",
      "inputSchema": {
        "type": "object",
        "properties": {}
      }
    },
    {
      "name": "get_projects",
      "description": "Get list of Asadullah's projects with tech stack",
      "inputSchema": {
        "type": "object",
        "properties": {}
      }
    },
    {
      "name": "get_contact",
      "description": "Get Asadullah's contact information",
      "inputSchema": {
        "type": "object",
        "properties": {}
      }
    },
    {
      "name": "get_about",
      "description": "Get background information about Asadullah Shafique",
      "inputSchema": {
        "type": "object",
        "properties": {}
      }
    },
    {
      "name": "get_hackathons",
      "description": "Get Asadullah's hackathon experience",
      "inputSchema": {
        "type": "object",
        "properties": {}
      }
    }
  ],
  "count": 5
}
```

### Get Specific Tool (REST)

Get a specific MCP tool's result.

**Endpoint:** `GET /mcp/tools/{tool_name}`

**Example:** `GET /mcp/tools/get_skills`

**Response:**

```json
{
  "tool": "get_skills",
  "result": {
    "languages": ["TypeScript", "JavaScript", "Python"],
    "frameworks": ["Next.js", "React", "FastAPI"],
    "ai_tools": ["LangGraph", "Claude API", "OpenAI API", "RAG", "MCP Servers"],
    "devops": ["Docker", "GitHub Actions", "Kubernetes", "WSL/Ubuntu"],
    "methodology": "Spec-first development (SpecifyKit SDK)"
  }
}
```

### MCP JSON-RPC Endpoint

MCP-compatible JSON-RPC 2.0 endpoint.

**Endpoint:** `POST /mcp/rpc`

**Request (tools/list):**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {}
}
```

**Response:**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [...]
  }
}
```

**Request (tools/call):**

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "get_skills"
  }
}
```

**Response:**

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{...}"
      }
    ]
  }
}
```

---

## Error Handling

All API errors follow a consistent format:

```json
{
  "detail": "Error message description",
  "status_code": 400
}
```

### Common Status Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid request data |
| 403 | Forbidden | Authentication required |
| 404 | Not Found | Resource not found |
| 422 | Unprocessable Entity | Validation error |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Service temporarily unavailable |

### Error Examples

**Validation Error (422):**

```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    }
  ]
}
```

**Not Found Error (404):**

```json
{
  "detail": "Blog post not found",
  "status_code": 404
}
```

---

## Rate Limiting

Currently, the API does not enforce rate limits. For production use:

- **Unauthenticated:** 100 requests/hour
- **Authenticated:** 1000 requests/hour

Rate limit headers:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1645200000
```

---

## SDKs & Client Libraries

### JavaScript/TypeScript

```typescript
// Using fetch
const response = await fetch('http://localhost:8000/api/blog');
const blogs = await response.json();

// Using a client library (future)
import { PortfolioAPI } from '@asadullah/portfolio-client';

const api = new PortfolioAPI('http://localhost:8000');
const blogs = await api.blog.getAll();
```

### Python

```python
# Using requests
import requests

response = requests.get('http://localhost:8000/api/blog')
blogs = response.json()

# Using httpx (async)
import httpx

async with httpx.AsyncClient() as client:
    response = await client.get('http://localhost:8000/api/blog')
    blogs = response.json()
```

---

## Changelog

### v2.1.0 (February 2026)
- Added comprehensive API documentation
- Enhanced error handling with detailed messages
- Improved LangGraph agent integration
- Added MCP server endpoints
- Added request logging middleware

### v2.0.0 (January 2026)
- Migrated to FastAPI
- Added LangGraph AI agent
- Implemented MCP server protocol
- Added Docker and Kubernetes support

---

## Support

For API support or questions:
- **Email:** asadullahshafique@hotmail.com
- **GitHub:** [Create an issue](https://github.com/asadullah48/asadullahshafique_devunity/issues)
- **Discord:** [Join the community](https://discord.gg/kXfEYVGX)

---

**Last Updated:** February 18, 2026
