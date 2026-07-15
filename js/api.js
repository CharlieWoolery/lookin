// ============ LOOKIN — Backend API Client ============

// Wipe the old key-in-localStorage approach — backend holds the key now.
localStorage.removeItem('lookin_api_key');

const API_BASE = (function () {
  const h = window.location.hostname;
  if (h === 'localhost' || h === '127.0.0.1') return 'http://localhost:3001';
  return 'https://lookin-api-psrl.onrender.com';
})();

function getToken()        { return localStorage.getItem('lookin_token'); }
function setToken(t)       { localStorage.setItem('lookin_token', t); }
function clearToken()      { localStorage.removeItem('lookin_token'); }
function isAuthenticated() { return !!getToken(); }

async function apiRequest(path, options) {
  options = options || {};
  const token = getToken();
  const headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
  if (token) headers['Authorization'] = 'Bearer ' + token;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 65000); // 65s — covers Render cold start

  try {
    const res = await fetch(API_BASE + path, Object.assign({}, options, { headers, signal: controller.signal }));
    const data = await res.json().catch(() => ({}));

    if (res.status === 401) {
      clearToken();
      throw new Error('AUTH_REQUIRED');
    }
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  } finally {
    clearTimeout(timer);
  }
}

// Pre-warm the Render instance so it's ready when the user opens Chuck.
function warmBackend() {
  fetch(API_BASE + '/health').catch(() => {});
}

// ── Local auth fallback (used when backend is unreachable) ──

function isNetworkError(err) {
  return err instanceof TypeError || err.name === 'TypeError' || err.name === 'AbortError';
}

function signInLocally(email) {
  const token = 'local_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  setToken(token);
  if (email) localStorage.setItem('lookin_email', email);
}
