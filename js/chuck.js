// ============ CHUCK AI — Anthropic API Integration ============
//
// NOTE: Using anthropic-dangerous-direct-browser-access for prototyping.
// In production, route API calls through a backend proxy to protect your key.

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const CHUCK_MODEL = 'claude-sonnet-4-6';

const CHUCK_SYSTEM = `You are Chuck, the AI fashion assistant for Lookin — an app that helps users discover clothing at nearby stores.

Your personality: Cool, direct, and genuinely helpful. Like a stylish friend who knows every boutique in the city. Think Supreme meets Frank Ocean meets California. Laid-back but sharp. Never corporate, never stiff.

Your job:
1. When a user tells you what they're looking for, ask exactly ONE focused follow-up question to narrow it down. Pick the most useful thing to know: budget, occasion, specific style direction, color preference, etc.
2. After their answer, write a brief cool response (1-3 sentences max), then end your message with the exact token: [SHOW_STORES]

Rules:
- Keep every message short. 1-3 sentences. No lists, no bullet points.
- Sound like a real person, not an AI assistant.
- Use casual language but stay sharp. No corporate speak.
- No excessive emojis.
- When asking your follow-up question, make it feel natural and conversational.
- When responding after their answer, be affirming and cool, then end with [SHOW_STORES].`;

let conversationHistory = [];
let chuckApiKey = null;
let isChuckThinking = false;

function getApiKey() {
  if (!chuckApiKey) {
    chuckApiKey = localStorage.getItem('lookin_api_key');
  }
  return chuckApiKey;
}

function setApiKey(key) {
  chuckApiKey = key.trim();
  localStorage.setItem('lookin_api_key', chuckApiKey);
}

function clearApiKey() {
  chuckApiKey = null;
  localStorage.removeItem('lookin_api_key');
}

function hasApiKey() {
  return !!getApiKey();
}

function resetConversation() {
  conversationHistory = [];
}

async function askChuck(userMessage) {
  const key = getApiKey();
  if (!key) {
    throw new Error('NO_API_KEY');
  }

  if (isChuckThinking) return null;
  isChuckThinking = true;

  conversationHistory.push({ role: 'user', content: userMessage });

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: CHUCK_MODEL,
        max_tokens: 300,
        system: CHUCK_SYSTEM,
        messages: conversationHistory,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      if (response.status === 401) throw new Error('BAD_KEY');
      if (response.status === 429) throw new Error('RATE_LIMIT');
      throw new Error(err.error?.message || `API error ${response.status}`);
    }

    const data = await response.json();
    const reply = data.content[0].text;

    conversationHistory.push({ role: 'assistant', content: reply });
    return reply;

  } finally {
    isChuckThinking = false;
  }
}

// Parse whether Chuck wants to show stores
function shouldShowStores(reply) {
  return reply.includes('[SHOW_STORES]');
}

// Strip the [SHOW_STORES] token from the visible message
function cleanReply(reply) {
  return reply.replace('[SHOW_STORES]', '').trim();
}
