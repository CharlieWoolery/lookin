# Lookin API — Backend

Node.js / Express backend that powers auth, saved stores, and the Chuck AI proxy.

## Stack

- **Express** — HTTP server
- **better-sqlite3** — SQLite database (file-based, zero config)
- **bcryptjs** — password hashing
- **jsonwebtoken** — JWT auth (30-day tokens)
- **cors** — cross-origin requests from GitHub Pages

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /health | — | Health check |
| POST | /api/auth/signup | — | Create account, returns JWT |
| POST | /api/auth/login | — | Sign in, returns JWT |
| GET | /api/saved | ✓ | Get saved stores |
| POST | /api/saved | ✓ | Save a store |
| DELETE | /api/saved/:id | ✓ | Remove a saved store |
| POST | /api/chuck | ✓ | Proxy to Anthropic API |

## Local development

```bash
cd backend
cp .env.example .env       # fill in JWT_SECRET and ANTHROPIC_API_KEY
npm install
npm run dev                # starts on http://localhost:3001
```

The frontend auto-detects `localhost` and points to `http://localhost:3001`. Serve the frontend with any static server:

```bash
cd ..
npx serve . -l 8080
```

---

## Deploy to Render (free tier)

1. Push your repo to GitHub (make sure `backend/.env` is gitignored — it is).

2. Go to [render.com](https://render.com) → **New → Web Service** → connect your GitHub repo.

3. Set the following in the Render dashboard:

   | Field | Value |
   |-------|-------|
   | **Root Directory** | `backend` |
   | **Build Command** | `npm install` |
   | **Start Command** | `node server.js` |
   | **Node version** | 18 or higher |

4. Under **Environment Variables**, add:

   | Key | Value |
   |-----|-------|
   | `JWT_SECRET` | A long random string (32+ chars) |
   | `ANTHROPIC_API_KEY` | `sk-ant-api03-...` |
   | `CORS_ORIGIN` | `https://yourusername.github.io` |

5. Deploy. Copy the service URL (e.g. `https://lookin-api.onrender.com`).

6. In `js/api.js`, update the production URL:
   ```js
   return 'https://your-actual-service-url.onrender.com';
   ```

> **Note:** Render's free tier spins down after 15 min of inactivity. The first request after sleep takes ~30s. Upgrade to a paid instance ($7/mo) to keep it always-on.

---

## Deploy to Railway

1. Go to [railway.app](https://railway.app) → **New Project → Deploy from GitHub repo**.

2. Select your repo. Railway auto-detects Node.js.

3. In **Settings → Root Directory**, set to `backend`.

4. Under **Variables**, add the same three env vars as above (`JWT_SECRET`, `ANTHROPIC_API_KEY`, `CORS_ORIGIN`).

5. Railway auto-assigns a public URL. Copy it and update `js/api.js`.

Railway's free hobby tier gives $5 credit/month, enough for a low-traffic API. No cold starts.

---

## Environment variables reference

```
PORT=3001                          # optional, defaults to 3001
JWT_SECRET=<32+ char random string>
ANTHROPIC_API_KEY=sk-ant-api03-...
CORS_ORIGIN=https://yourusername.github.io
```

Generate a strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```
