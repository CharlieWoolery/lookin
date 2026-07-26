# Lookin

An AI-powered fashion app that helps you find clothing at stores near you — personalized to your style.

**[Live Demo → getlookin.app](https://getlookin.app)**

![Status](https://img.shields.io/badge/Status-Live-4ade80?style=flat-square) ![AI](https://img.shields.io/badge/AI-Anthropic%20Claude-7c3aed?style=flat-square) ![Backend](https://img.shields.io/badge/Backend-Render-0066cc?style=flat-square)

---

## What it does

Lookin lets you describe what you're looking for in natural language. **Chuck**, the built-in AI fashion assistant, asks one focused follow-up question and surfaces nearby stores that match your vibe.

- **Personalized onboarding** — style quiz, celebrity inspo picker, budget selector
- **Chuck AI** — conversational fashion assistant powered by Anthropic Claude
- **Nearby stores** — browse filtered by style category and distance
- **14 style vibes** — Streetwear, Old Money, Vintage, California, Avant-Garde, Gorpcore, Y2K, and more
- **Save & heart** stores for later
- **Map view** — see matching stores on an interactive map

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | HTML, CSS, vanilla JavaScript — no framework, no build step |
| AI | [Anthropic Claude API](https://anthropic.com) (claude-haiku, proxied through backend) |
| Backend | Node.js + Express, deployed on [Render](https://render.com) |
| Database | `node:sqlite` (SQLite via Node built-in) |
| Auth | JWT — email/password + guest mode |
| Maps | [Leaflet.js](https://leafletjs.com) |
| Hosting | GitHub Pages (custom domain: getlookin.app) |

## Project structure

```
lookin/
├── index.html          # Home screen + Chuck chat overlay
├── onboarding.html     # 4-step style onboarding flow
├── CNAME               # Custom domain → getlookin.app
├── css/
│   ├── styles.css      # Main design system + all component styles
│   └── onboarding.css  # Onboarding-specific styles
├── js/
│   ├── api.js          # Backend API client + auth helpers
│   ├── data.js         # Store & inspo data
│   ├── chuck.js        # Chuck AI — message handling & store rendering
│   ├── app.js          # Home screen UI logic
│   ├── map.js          # Leaflet map integration
│   └── onboarding.js   # Onboarding flow + step transitions
└── backend/
    ├── server.js       # Express app — CORS, routes, error handling
    ├── routes/
    │   ├── auth.js     # Sign up / sign in / JWT
    │   ├── chuck.js    # Proxies Anthropic API calls
    │   └── saved.js    # Save/unsave stores
    └── db.js           # SQLite setup
```

## How Chuck works

1. User opens Chuck and types a message (e.g. "something to wear to a concert")
2. Chuck sends the conversation history + a system prompt to Anthropic's Messages API through the backend
3. The system prompt instructs Chuck to ask exactly one focused follow-up question, then emit a `[SHOW_STORES]` token
4. When the frontend sees `[SHOW_STORES]`, it triggers the store results panel filtered to the user's vibe

The API key lives only on the Render backend — it never touches the browser.

## Run locally

**Frontend** — any static server works:

```bash
git clone https://github.com/CharlieWoolery/lookin.git
cd lookin
python3 -m http.server 8080
# open http://localhost:8080
```

**Backend** — needed for Chuck AI and auth:

```bash
cd backend
npm install
cp .env.example .env   # add your ANTHROPIC_API_KEY and JWT_SECRET
node server.js
# runs on http://localhost:3001
```

The frontend auto-detects `localhost` and points API calls to `localhost:3001`.

## Deployment

- **Frontend** — push to `main` → GitHub Pages deploys automatically. The `CNAME` file routes `getlookin.app` → `charliewoolery.github.io/lookin`.
- **Backend** — push to `main` in the backend repo → Render redeploys. Set `ANTHROPIC_API_KEY`, `JWT_SECRET`, and `CORS_ORIGIN` as environment variables in the Render dashboard.

> **Note:** Render's free tier spins down after 15 minutes of inactivity. The app pings `/health` on page load to pre-warm the server — first message after a cold start may take ~30 seconds.

---

Built by [Charlie Woolery](https://github.com/CharlieWoolery)
