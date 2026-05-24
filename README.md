# Lookin

An AI-powered fashion app that helps users find clothing at stores near them — personalized to their style.

**[Live Demo →](https://charliewoolery.github.io/lookin)**

![Lookin App](https://img.shields.io/badge/Status-Live-4ade80?style=flat-square) ![Built with Claude](https://img.shields.io/badge/AI-Anthropic%20Claude-7c3aed?style=flat-square)

---

## What it does

Lookin lets users describe what they're looking for in natural language, then an AI assistant named **Chuck** asks one focused follow-up question and surfaces nearby stores that match their vibe.

- **Personalized onboarding** — style quiz, celebrity inspo picker, budget selector
- **Chuck AI** — conversational fashion assistant powered by the Anthropic API
- **Nearby stores** — browse stores filtered by style category and distance
- **Style categories** — Old Money, Streetwear, Vintage, California, Avant-Garde
- **Save & heart** stores for later

## Tech stack

- HTML, CSS, JavaScript — no framework, no build tools
- [Anthropic Claude API](https://anthropic.com) for Chuck's AI responses
- `localStorage` for user profile and session persistence
- Mobile-first responsive design (430px)

## Run locally

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/lookin.git
cd lookin

# Serve with any static file server, e.g.:
python3 -m http.server 3000
```

Then open `http://localhost:3000` and enter your [Anthropic API key](https://console.anthropic.com) when prompted.

## Project structure

```
lookin/
├── index.html          # Home screen + Chuck chat
├── onboarding.html     # 4-step style onboarding
├── css/
│   ├── styles.css      # Main design system
│   └── onboarding.css  # Onboarding styles
└── js/
    ├── data.js         # Mock store & inspo data
    ├── chuck.js        # Anthropic API integration
    ├── app.js          # Home screen UI logic
    └── onboarding.js   # Onboarding flow logic
```

## How Chuck works

Chuck maintains a conversation history array that gets sent to the Anthropic Messages API on each turn. A system prompt constrains Chuck to ask exactly one follow-up question, then emit a `[SHOW_STORES]` token — which the frontend parses to trigger the store results UI.

---

Built by [Charlie Woolery](https://github.com/CharlieWoolery)
