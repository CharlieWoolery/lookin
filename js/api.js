// ============ LOOKIN — Backend API Client ============
//
// After deploying to Render/Railway, replace the production URL below
// with your actual service URL.

const API_BASE = (function () {
  const h = window.location.hostname;
  if (h === 'localhost' || h === '127.0.0.1') return 'http://localhost:3001';
  return 'https://lookin-api.onrender.com'; // <-- update after deploy
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

  const res = await fetch(API_BASE + path, Object.assign({}, options, { headers }));
  const data = await res.json().catch(() => ({}));

  if (res.status === 401) {
    clearToken();
    throw new Error('AUTH_REQUIRED');
  }
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}
