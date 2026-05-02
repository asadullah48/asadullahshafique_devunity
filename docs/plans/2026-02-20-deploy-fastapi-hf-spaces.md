# FastAPI Backend → Hugging Face Spaces Deployment Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Deploy the FastAPI backend (`/backend/`) to Hugging Face Spaces using Docker SDK, then wire it to the Vercel frontend via environment variables.

**Architecture:** HF Spaces hosts the FastAPI container (port 7860, Docker SDK). The Dockerfile already targets port 7860. Secrets are set in HF Space settings UI. Vercel `FASTAPI_BACKEND_URL` points to the live Space URL.

**Tech Stack:** FastAPI, Python 3.12, Docker, Hugging Face Hub, Vercel CLI / Dashboard

---

## Prerequisites (check before starting)

- [ ] `huggingface-cli` installed: `pip install huggingface_hub[cli]`
- [ ] Logged in: `huggingface-cli login` (needs HF token with write access)
- [ ] Have these secrets ready:
  - `ANTHROPIC_API_KEY`
  - `DISCORD_WEBHOOK_URL`
  - `GITHUB_TOKEN`
  - `ALLOWED_ORIGINS` (e.g. `https://asadullahshafique-devunity.vercel.app,https://asadullah.dev`)

---

## Task 1: Verify the Dockerfile is HF-Spaces Ready

**Files:**
- Read: `backend/Dockerfile`

**Step 1: Confirm port 7860 and non-root user**

The Dockerfile already sets `ENV PORT=7860`, exposes 7860, runs as `appuser`. No changes needed.

**Step 2: Confirm the CMD line**

```
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT} --workers 2
```

This is correct for HF Spaces. No changes needed.

**Step 3: Add README.md for HF Spaces (required)**

HF Spaces requires a `README.md` with a YAML front-matter block at the top. Check if `backend/README.md` already has it.

Run:
```bash
head -10 backend/README.md
```

Expected: starts with `---` and includes `sdk: docker`.

If missing the front-matter, add it (see Task 2).

---

## Task 2: Add HF Spaces Front-Matter to README

**Files:**
- Modify: `backend/README.md` (prepend only if front-matter is missing)

**Step 1: Check current content**

```bash
head -20 backend/README.md
```

**Step 2: If front-matter is missing, prepend this block**

```markdown
---
title: Asadullah Dev Portfolio API
emoji: 🚀
colorFrom: green
colorTo: blue
sdk: docker
pinned: false
license: mit
app_port: 7860
---

```

Keep all existing README content after this block.

**Step 3: Commit**

```bash
git add backend/README.md
git commit -m "chore: add HF Spaces front-matter to backend README"
```

---

## Task 3: Create the HF Space (one-time setup via CLI)

**Step 1: Create the Space**

```bash
huggingface-cli repo create asadullah-portfolio-api --type space --space_sdk docker --private
```

Expected output:
```
Successfully created repo asadullahshafique/asadullah-portfolio-api
https://huggingface.co/spaces/asadullahshafique/asadullah-portfolio-api
```

> Note: The Space URL will be `https://asadullahshafique-asadullah-portfolio-api.hf.space`

**Step 2: Verify it exists**

Visit: `https://huggingface.co/spaces/asadullahshafique/asadullah-portfolio-api`

---

## Task 4: Set HF Space Secrets

Secrets are NOT set via CLI — use the HF Spaces web UI.

**Step 1: Go to Space Settings**

URL: `https://huggingface.co/spaces/asadullahshafique/asadullah-portfolio-api/settings`

**Step 2: Under "Repository secrets", add each secret:**

| Name | Value |
|------|-------|
| `ANTHROPIC_API_KEY` | your Anthropic key |
| `DISCORD_WEBHOOK_URL` | your Discord webhook URL |
| `GITHUB_TOKEN` | your GitHub PAT |
| `ALLOWED_ORIGINS` | `https://asadullahshafique-devunity.vercel.app,https://asadullah.dev` |

> Secrets are injected as environment variables at container startup. Never commit these to git.

---

## Task 5: Push the Backend to HF Spaces via Git

HF Spaces uses a Git remote. You push the `backend/` subdirectory as the root of the Space repo.

**Step 1: Clone the Space repo locally (temp dir)**

```bash
git clone https://huggingface.co/spaces/asadullahshafique/asadullah-portfolio-api /tmp/hf-space
```

**Step 2: Copy backend files into it**

```bash
cp -r backend/. /tmp/hf-space/
```

> This copies `main.py`, `agent.py`, `mcp_server.py`, `database.py`, `models.py`, `db_helpers.py`, `requirements.txt`, `Dockerfile`, `README.md`, etc.

**Step 3: Make sure `.env` is NOT included**

```bash
ls /tmp/hf-space/.env 2>/dev/null && echo "REMOVE THIS" || echo "OK - not present"
```

If `.env` is present, remove it:
```bash
rm /tmp/hf-space/.env
```

**Step 4: Verify `.dockerignore` excludes secrets**

```bash
cat /tmp/hf-space/.dockerignore
```

It should include: `.env`, `__pycache__`, `*.pyc`, `.git`

**Step 5: Commit and push**

```bash
cd /tmp/hf-space
git add .
git commit -m "feat: initial deploy to HF Spaces"
git push
```

Expected: HF will trigger a Docker build automatically.

**Step 6: Monitor the build**

Visit: `https://huggingface.co/spaces/asadullahshafique/asadullah-portfolio-api`

Watch the "Building" status → should turn "Running" in ~3-5 minutes.

---

## Task 6: Verify the Space is Running

**Step 1: Hit the health endpoint**

The Space URL follows the pattern: `https://asadullahshafique-asadullah-portfolio-api.hf.space`

```bash
curl https://asadullahshafique-asadullah-portfolio-api.hf.space/health
```

Expected response:
```json
{"status":"healthy","version":"2.1.0","timestamp":"...","environment":"production"}
```

**Step 2: Check the API docs**

Open in browser: `https://asadullahshafique-asadullah-portfolio-api.hf.space/docs`

You should see the FastAPI Swagger UI with all endpoints.

**Step 3: Test the contact endpoint**

```bash
curl -X POST https://asadullahshafique-asadullah-portfolio-api.hf.space/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","subject":"Test","message":"HF Spaces test"}'
```

Expected:
```json
{"success":true,"message":"Message received! I'll get back to you soon."}
```

---

## Task 7: Set FASTAPI_BACKEND_URL in Vercel

**Step 1: Go to Vercel Project Settings**

URL: `https://vercel.com/asadullah48/asadullahshafique-devunity/settings/environment-variables`

**Step 2: Add the environment variable**

| Key | Value | Environment |
|-----|-------|-------------|
| `FASTAPI_BACKEND_URL` | `https://asadullahshafique-asadullah-portfolio-api.hf.space` | Production, Preview |

**Step 3: Redeploy the Vercel frontend**

In Vercel dashboard → Deployments → click "Redeploy" on the latest deployment.

Or via CLI:
```bash
vercel --prod
```

**Step 4: Test the contact form on the live site**

Go to: `https://asadullahshafique-devunity.vercel.app/#contact`

Submit a test message. Check Discord for the webhook notification.

---

## Task 8: Final Verification Checklist

Run through each:

- [ ] `GET /health` → `{"status":"healthy"}`
- [ ] `GET /api/blog` → returns blog posts array
- [ ] `GET /api/github/stats` → returns GitHub stats
- [ ] `POST /api/contact` → returns success, Discord notification fires
- [ ] `GET /api/agent/info` → shows `"mode":"langgraph"` if ANTHROPIC_API_KEY set
- [ ] Contact form on vercel.app → message received
- [ ] HF Space shows "Running" status (not "Building" or "Error")

---

## Troubleshooting

**Build fails with import error:**
- Check `requirements.txt` — all modules used in `main.py` must be listed
- Currently missing in requirements: none (verified)
- `mcp_server.py`, `agent.py`, `database.py`, `models.py`, `db_helpers.py` must all be copied to the Space root

**CORS errors from frontend:**
- Verify `ALLOWED_ORIGINS` secret includes your exact Vercel URL
- No trailing slash in the URL

**Space shows "Error" status:**
- Check Space build logs at: `https://huggingface.co/spaces/asadullahshafique/asadullah-portfolio-api` → Logs tab
- Common cause: missing Python module → add to `requirements.txt`

**Contact works but Discord notification missing:**
- Verify `DISCORD_WEBHOOK_URL` secret is set correctly in HF Space settings
- Test webhook manually: `curl -X POST <your-webhook-url> -H "Content-Type: application/json" -d '{"content":"test"}'`

**HF Space URL format:**
- Spaces URL: `https://huggingface.co/spaces/asadullahshafique/asadullah-portfolio-api`
- API URL: `https://asadullahshafique-asadullah-portfolio-api.hf.space`
- The API URL is what goes into `FASTAPI_BACKEND_URL`
