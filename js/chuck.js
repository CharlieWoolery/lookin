// ============ CHUCK AI — Backend Proxy ============

const CHUCK_MODEL = 'claude-sonnet-4-6';

const CHUCK_SYSTEM = `You are Chuck, the AI fashion assistant for Lookin — an app that helps users discover clothing at nearby stores.

Your personality: Cool, direct, and genuinely helpful. Like a stylish friend who knows every boutique in the city. Think Supreme meets Frank Ocean meets California. Laid-back but sharp. Never corporate, never stiff.

Your job:
1. When a user tells you what they're looking for, ask exactly ONE focused follow-up question to narrow it down. Pick the most useful thing to know: budget, occasion, specific style direction, color preference, etc.
2. After their answer, write a brief cool response (1-3 sentences max) that references the user's real city by name, then output [SHOW_STORES] followed immediately on the next line by a JSON array of exactly 4 real stores.

Response format when showing stores:
[your 1-3 sentence reply mentioning the user's city]
[SHOW_STORES]
[{"name":"Store Name","distance":"0.4 mi","category":"Streetwear","priceRange":"$$$","item":"Specific Item Name","price":"$180","open":true,"lat":32.1234,"lng":-96.7890},{"name":"Store 2","distance":"0.9 mi","category":"Vintage","priceRange":"$$","item":"Item Name","price":"$65","open":true,"lat":32.1290,"lng":-96.7950},{"name":"Store 3","distance":"1.4 mi","category":"Luxury","priceRange":"$$$$","item":"Item Name","price":"$420","open":false,"lat":32.1180,"lng":-96.7820},{"name":"Store 4","distance":"2.1 mi","category":"Minimal","priceRange":"$$","item":"Item Name","price":"$95","open":true,"lat":32.1350,"lng":-96.7780}]

JSON rules — follow these exactly:
- name: A real store that actually exists near the user's city (national chains or known local boutiques)
- distance: Realistic driving/walking distance from the user's coordinates
- category: What the store specializes in (Streetwear, Vintage, Luxury, Minimal, Workwear, etc.)
- priceRange: "$", "$$", "$$$", or "$$$$"
- item: A specific real item that store carries which matches what the user asked for
- price: Realistic price for that item at that store
- open: true or false — based on whether the store is likely open right now
- lat/lng: Approximate real-world coordinates for that store's actual location

General rules:
- Keep every conversational message short — 1-3 sentences max.
- Sound like a real person, not an AI assistant.
- Use casual language but stay sharp. No corporate speak.
- No excessive emojis.
- When asking your follow-up question, make it feel natural and conversational.
- Output ONLY the raw JSON array after [SHOW_STORES] — no markdown code blocks, no backticks, no extra text.`;

let conversationHistory = [];
let isChuckThinking = false;

function getSystemPrompt() {
  let locationCtx = '';
  try {
    const raw = localStorage.getItem('lookin_location');
    if (raw) {
      const loc = JSON.parse(raw);
      if (loc.city) {
        locationCtx = `\n\nUser's current location: ${loc.city}`;
        if (loc.lat && loc.lng) {
          locationCtx += ` (lat: ${loc.lat.toFixed(4)}, lng: ${loc.lng.toFixed(4)})`;
        }
        locationCtx += `.\nIMPORTANT: Recommend real stores that actually exist in or near ${loc.city}. If ${loc.city} is a small town or suburb (like a suburb of Dallas, Houston, LA, etc.), recommend stores in the nearest major metro area and mention realistic drive distances. Always reference "${loc.city}" by name when you respond — say something like "Here are some spots near ${loc.city}" or "In the ${loc.city} area...". Use realistic lat/lng coordinates for each store's actual physical address.`;
      }
    }
  } catch {}

  let budgetCtx = '';
  try {
    const raw = localStorage.getItem('lookin_profile');
    if (raw) {
      const profile = JSON.parse(raw);
      if (profile.budgetAmount) {
        const tier = dollarToTier(profile.budgetAmount);
        budgetCtx = `\n\nUser's budget: approximately $${profile.budgetAmount} per piece (${tier.name} range). Prioritize stores and items in this price range.`;
      } else if (profile.budget) {
        const tier = BUDGET_TIERS.find(t => t.id === profile.budget);
        if (tier) budgetCtx = `\n\nUser's budget: ${tier.name} (${tier.range}) per piece. Prioritize stores and items in this price range.`;
      }
    }
  } catch {}

  return CHUCK_SYSTEM + locationCtx + budgetCtx;
}

function resetConversation() {
  conversationHistory = [];
}

async function askChuck(userMessage) {
  if (!isAuthenticated()) throw new Error('AUTH_REQUIRED');
  if (isChuckThinking) return null;
  isChuckThinking = true;

  conversationHistory.push({ role: 'user', content: userMessage });

  try {
    const data = await apiRequest('/api/chuck', {
      method: 'POST',
      body: JSON.stringify({
        model: CHUCK_MODEL,
        max_tokens: 800,
        system: getSystemPrompt(),
        messages: conversationHistory,
      }),
    });

    const reply = data.content[0].text;
    conversationHistory.push({ role: 'assistant', content: reply });
    return reply;
  } finally {
    isChuckThinking = false;
  }
}

// ============ VISION (photo upload) ============
const VISION_SYSTEM = `You are Chuck, the AI fashion assistant for Lookin. A user has uploaded a photo of a clothing item.

Your job:
1. In 1-2 short sentences: describe the item (type, color, style). Sound like a knowledgeable friend, not a product description. Reference the user's city.
2. Then output [SHOW_STORES] followed immediately on the next line by a JSON array of exactly 4 real stores that carry similar items near the user's city.

Use the exact same JSON format:
[SHOW_STORES]
[{"name":"...","distance":"...","category":"...","priceRange":"...","item":"Similar Item Name","price":"$...","open":true,"lat":0.0,"lng":0.0},...]

Rules: Keep text tight. Casual tone. Output ONLY raw JSON after [SHOW_STORES] — no backticks.`;

async function askChuckWithVision(base64Data, mimeType) {
  if (!isAuthenticated()) throw new Error('AUTH_REQUIRED');
  if (isChuckThinking) return null;
  isChuckThinking = true;

  let system = VISION_SYSTEM;
  try {
    const raw = localStorage.getItem('lookin_location');
    if (raw) {
      const loc = JSON.parse(raw);
      if (loc.city) {
        system += `\n\nUser's location: ${loc.city}`;
        if (loc.lat && loc.lng) system += ` (${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)})`;
        system += `. Recommend real stores near ${loc.city} with realistic coordinates.`;
      }
    }
  } catch {}

  try {
    const data = await apiRequest('/api/chuck', {
      method: 'POST',
      body: JSON.stringify({
        model: CHUCK_MODEL,
        max_tokens: 600,
        system,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mimeType, data: base64Data } },
            { type: 'text', text: 'Analyze this clothing item and find me similar pieces at nearby stores.' },
          ],
        }],
      }),
    });

    const reply = data.content[0].text;
    conversationHistory.push({ role: 'assistant', content: reply });
    return reply;
  } finally {
    isChuckThinking = false;
  }
}

function shouldShowStores(reply) { return reply.includes('[SHOW_STORES]'); }

function cleanReply(reply) {
  const idx = reply.indexOf('[SHOW_STORES]');
  return idx === -1 ? reply.trim() : reply.slice(0, idx).trim();
}

function parseStoresFromReply(reply) {
  const marker = '[SHOW_STORES]';
  const markerIdx = reply.indexOf(marker);
  if (markerIdx === -1) return null;

  const after = reply.slice(markerIdx + marker.length).trim();

  // Find the JSON array — be robust to extra whitespace or stray text
  const start = after.indexOf('[');
  const end = after.lastIndexOf(']');
  if (start === -1 || end === -1 || end <= start) return null;

  try {
    const parsed = JSON.parse(after.slice(start, end + 1));
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch (e) {
    console.warn('Chuck: store JSON parse failed:', e.message);
  }
  return null;
}

// Legacy shims — kept so nothing in app.js breaks if called
function hasApiKey()  { return isAuthenticated(); }
function getApiKey()  { return getToken(); }
function setApiKey()  {}
function clearApiKey(){ clearToken(); }
