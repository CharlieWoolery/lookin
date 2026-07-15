// ============ LOOKIN — App UI Logic ============

// ---- DOM refs ----
const $ = id => document.getElementById(id);
const setupModal   = $('setup-modal');
const saveKeyBtn   = $('save-api-key');
const openChuckBar = $('open-chuck');
const openChuckNav = $('open-chuck-nav');
const chuckOverlay = $('chuck-overlay');
const chuckBackdrop= $('chuck-backdrop');
const chuckClose   = $('chuck-close');
const chuckMsgs    = $('chuck-messages');
const quickReplies = $('quick-replies');
const storeResults = $('store-results');
const storeList    = $('store-results-list');
const storeCount   = $('store-results-count');
const chuckInput   = $('chuck-input');
const chuckSend    = $('chuck-send');
const greetingTime = $('greeting-time');
const storesScroll = $('stores-scroll');
const inspoGrid    = $('inspo-grid');
const categoryChips= $('category-chips');
const photoInput   = $('photo-input');
const chuckPhotoBtn= $('chuck-photo-btn');

let chuckOpened = false;
let savedOpen = false;

// ============ SAVED STORES — STORAGE ============
function getSavedStores() {
  const raw = localStorage.getItem('lookin_saved_stores');
  return raw ? JSON.parse(raw) : [];
}

function saveStore(item) {
  const stores = getSavedStores();
  const exists = stores.some(s => s.storeId === item.store.id && s.item === item.name);
  if (exists) return;
  stores.push({
    storeId:    item.store.id,
    name:       item.store.name,
    gradient:   item.store.gradient,
    priceRange: item.store.priceRange,
    distance:   item.store.distance,
    lat:        item.store.lat  || null,
    lng:        item.store.lng  || null,
    item:       item.name,
    price:      item.price,
    category:   item.category,
    savedAt:    Date.now(),
  });
  localStorage.setItem('lookin_saved_stores', JSON.stringify(stores));
  syncSaveToBackend(item);
}

function unsaveStore(storeId, itemName) {
  const stores = getSavedStores().filter(
    s => !(s.storeId === storeId && s.item === itemName)
  );
  localStorage.setItem('lookin_saved_stores', JSON.stringify(stores));
  syncUnsaveToBackend(storeId, itemName);
}

// ============ INIT ============
function init() {
  // Redirect to onboarding if first time
  if (!localStorage.getItem('lookin_onboarded')) {
    window.location.href = 'onboarding.html';
    return;
  }

  setGreeting();
  populateStores();
  populateTrending();
  populateTrendingStores();
  populateInspoGrid();
  bindEvents();
  initLocation();
  warmBackend(); // wake Render before user opens Chuck

  if (!hasApiKey()) {
    setupModal.classList.remove('hidden');
  }
}

// ============ GREETING ============
function setGreeting() {
  const h = new Date().getHours();
  let msg = 'Good morning,';
  if (h >= 12 && h < 17) msg = 'Good afternoon,';
  else if (h >= 17 && h < 21) msg = 'Good evening,';
  else if (h >= 21 || h < 5) msg = 'Late night,';

  const loc = getSavedLocation ? getSavedLocation() : null;
  greetingTime.textContent = loc ? `${msg} · ${loc.city}` : msg;
}

// ============ POPULATE HOME STORES ============
function populateStores() {
  storesScroll.innerHTML = '';
  MOCK_STORES.slice(0, 6).forEach(store => {
    const item = {
      name:     store.featuredItem,
      price:    store.itemPrice,
      category: store.category,
      store: {
        id:         store.id,
        name:       store.name,
        distance:   store.distance,
        category:   store.category,
        priceRange: store.priceRange,
        rating:     store.rating,
        open:       store.open,
        gradient:   store.gradient,
        lat:        store.lat  || null,
        lng:        store.lng  || null,
        tip:        store.tip  || 'Ask staff about their latest arrivals.',
      },
    };

    const alreadySaved = getSavedStores().some(
      s => s.storeId === store.id && s.item === item.name
    );

    const card = document.createElement('div');
    card.className = 'store-card-mini';
    card.innerHTML = `
      <div class="store-card-mini-thumb">
        <div class="store-card-mini-thumb-bg" style="background: ${store.gradient};"></div>
        <div class="store-card-mini-open${store.open ? '' : ' closed'}">${store.open ? 'OPEN' : 'CLOSED'}</div>
        <button class="store-card-mini-heart ${alreadySaved ? 'saved' : ''}" aria-label="Save">
          ${alreadySaved ? '♥' : '♡'}
        </button>
      </div>
      <div class="store-card-mini-body">
        <div class="store-card-mini-name">${store.name}</div>
        <div class="store-card-mini-meta">
          <span>${store.distance}</span>
          <span class="meta-dot"></span>
          <span>${store.priceRange}</span>
          <span class="meta-dot"></span>
          <span>★ ${store.rating}</span>
        </div>
      </div>
    `;

    card.querySelector('.store-card-mini-heart').addEventListener('click', e => {
      e.stopPropagation();
      const btn = e.currentTarget;
      const isSaved = btn.classList.toggle('saved');
      btn.textContent = isSaved ? '♥' : '♡';
      if (isSaved) saveStore(item); else unsaveStore(store.id, item.name);
    });

    card.addEventListener('click', () => showStoreDetail(item));
    storesScroll.appendChild(card);
  });
}

// ============ POPULATE INSPO GRID ============
function populateInspoGrid() {
  inspoGrid.innerHTML = '';
  INSPO_CARDS.forEach(card => {
    const el = document.createElement('div');
    el.className = 'inspo-card';
    el.innerHTML = `
      <div class="inspo-card-inner">
        <div class="inspo-card-bg" style="background: ${card.gradient};">
          <div class="inspo-card-decor" style="
            background: ${card.decorColor};
            width: ${card.decorSize};
            height: ${card.decorSize};
            top: ${card.decorPos.top || 'auto'};
            bottom: ${card.decorPos.bottom || 'auto'};
            left: ${card.decorPos.left || 'auto'};
            right: ${card.decorPos.right || 'auto'};
          "></div>
        </div>
        <div class="inspo-card-overlay">
          <div class="inspo-card-vibe">${card.vibe}</div>
          <div class="inspo-card-desc">${card.desc}</div>
        </div>
        <button class="inspo-card-heart" aria-label="Save">♡</button>
      </div>
    `;
    el.querySelector('.inspo-card-heart').addEventListener('click', e => {
      e.stopPropagation();
      const btn = e.currentTarget;
      btn.textContent = btn.textContent === '♡' ? '♥' : '♡';
      btn.style.color = btn.textContent === '♥' ? '#ef4444' : '';
    });
    inspoGrid.appendChild(el);
  });
}

// ============ TRENDING OUTFITS ============
function populateTrending() {
  const scroll = $('trending-scroll');
  if (!scroll) return;
  scroll.innerHTML = '';

  const savedOutfits = JSON.parse(localStorage.getItem('lookin_saved_outfits') || '[]');

  TRENDING_OUTFITS.forEach(outfit => {
    const isSaved = savedOutfits.includes(outfit.id);
    const card = document.createElement('div');
    card.className = 'trending-card';
    card.innerHTML = `
      <div class="trending-card-bg" style="background:${outfit.gradient}"></div>
      <div class="trending-card-indicator">
        <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
        Trending
      </div>
      <button class="trending-card-heart${isSaved ? ' saved' : ''}" aria-label="Save outfit">${isSaved ? '♥' : '♡'}</button>
      <div class="trending-card-overlay">
        <div class="trending-card-name">${outfit.name}</div>
        <div class="trending-card-cat">${outfit.category}</div>
      </div>
    `;

    card.querySelector('.trending-card-heart').addEventListener('click', e => {
      e.stopPropagation();
      const btn = e.currentTarget;
      const nowSaved = btn.classList.toggle('saved');
      btn.textContent = nowSaved ? '♥' : '♡';
      const saved = JSON.parse(localStorage.getItem('lookin_saved_outfits') || '[]');
      if (nowSaved) {
        if (!saved.includes(outfit.id)) saved.push(outfit.id);
      } else {
        const idx = saved.indexOf(outfit.id);
        if (idx > -1) saved.splice(idx, 1);
      }
      localStorage.setItem('lookin_saved_outfits', JSON.stringify(saved));
    });

    card.addEventListener('click', () => loadOutfitIntoChuck(outfit));
    scroll.appendChild(card);
  });
}

function loadOutfitIntoChuck(outfit) {
  resetConversation();
  chuckMsgs.innerHTML = '';
  hideQuickReplies();
  chuckOpened = true;
  openChuck();
  setTimeout(() => sendMessage(outfit.prompt), 480);
}

// ============ TRENDING STORES ============
function populateTrendingStores() {
  const list = $('trending-stores-list');
  if (!list) return;
  list.innerHTML = '';

  TRENDING_STORES_CONFIG.forEach((config, i) => {
    const store = getStore(config.id);
    if (!store) return;

    const row = document.createElement('div');
    row.className = 'trending-store-row';
    row.style.animationDelay = `${i * 60}ms`;
    row.innerHTML = `
      <div class="trending-store-thumb">
        <div class="trending-store-thumb-bg" style="background:${store.gradient}"></div>
        <span class="trending-store-hot-badge">🔥 HOT</span>
      </div>
      <div class="trending-store-body">
        <div class="trending-store-name">${store.name}</div>
        <div class="trending-store-meta">
          <span>${store.distance}</span>
          <span class="meta-dot"></span>
          <span>${store.category}</span>
          <span class="meta-dot"></span>
          <span>${store.priceRange}</span>
        </div>
        <div class="trending-store-hot-label">🔥 ${config.hotLabel}</div>
      </div>
      <span class="trending-store-open-pill${store.open ? '' : ' closed'}">${store.open ? 'Open' : 'Closed'}</span>
    `;

    row.addEventListener('click', () => {
      openChuck();
      setTimeout(() => {
        hideQuickReplies();
        sendMessage('Tell me about ' + store.name + ' — what should I get there?');
      }, 480);
    });

    list.appendChild(row);
  });
}

// ============ AI STORE HELPERS ============
const STORE_GRADIENTS = [
  'linear-gradient(145deg, #0f0c29 0%, #1a1042 50%, #24243e 100%)',
  'linear-gradient(145deg, #1a1209 0%, #2c1f0e 50%, #3d2b14 100%)',
  'linear-gradient(145deg, #0d1a0d 0%, #142814 50%, #1c3a1c 100%)',
  'linear-gradient(145deg, #110a1a 0%, #2d1255 50%, #4c1d95 100%)',
  'linear-gradient(145deg, #1a0a10 0%, #2d1020 50%, #3d1530 100%)',
  'linear-gradient(145deg, #0a1508 0%, #142210 50%, #1c3018 100%)',
  'linear-gradient(145deg, #0a0f1a 0%, #12192e 50%, #1a2540 100%)',
  'linear-gradient(145deg, #1a1209 0%, #2a1e0c 50%, #3c2d16 100%)',
];

function gradientForStore(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (Math.imul(h, 31) + name.charCodeAt(i)) | 0;
  return STORE_GRADIENTS[Math.abs(h) % STORE_GRADIENTS.length];
}

function buildStoreItems(aiStores) {
  if (aiStores && aiStores.length > 0) {
    return aiStores.slice(0, 4).map(s => ({
      name:     s.item       || 'Featured Item',
      price:    s.price      || '$—',
      category: s.category   || 'Fashion',
      store: {
        id:         s.name,
        name:       s.name,
        distance:   s.distance   || 'Nearby',
        category:   s.category   || 'Fashion',
        priceRange: s.priceRange || s.price_range || '$$',
        rating:     s.rating     || '4.7',
        open:       s.open !== false,
        gradient:   gradientForStore(s.name),
        lat:        s.lat  || null,
        lng:        s.lng  || null,
        tip:        s.tip  || 'Ask staff about their latest arrivals.',
      },
    }));
  }
  return getResultCards(4);
}

function showLocationQuickReply() {
  quickReplies.innerHTML = '';
  const btn = document.createElement('button');
  btn.className = 'quick-reply-btn';
  btn.textContent = 'Set my location';
  btn.addEventListener('click', () => {
    hideQuickReplies();
    closeChuck();
    showLocationScreen();
  });
  quickReplies.appendChild(btn);
  quickReplies.classList.remove('hidden');
}

// ============ CHUCK OPEN / CLOSE ============
function openChuck() {
  chuckOverlay.classList.remove('hidden');
  if (!chuckOpened) {
    chuckOpened = true;
    showChuckGreeting();
  }
  setTimeout(() => chuckInput.focus(), 450);
}

function closeChuck() {
  chuckOverlay.classList.add('hidden');
  resetMap();
}

function showChuckGreeting() {
  addMessage('chuck', "What are we shopping for today?");
  showQuickReplies([
    'Need a jacket',
    'Looking for a full fit',
    'Something vintage',
    'Give me a vibe',
  ]);
}

// ============ MESSAGING ============
function addMessage(role, text) {
  const wrap = document.createElement('div');
  wrap.className = `message ${role}`;

  if (role === 'chuck') {
    wrap.innerHTML = `
      <div class="message-avatar">C</div>
      <div class="message-bubble">${text}</div>
    `;
  } else {
    wrap.innerHTML = `<div class="message-bubble">${text}</div>`;
  }

  chuckMsgs.appendChild(wrap);
  scrollMessages();
}

function showTyping() {
  const el = document.createElement('div');
  el.className = 'message chuck';
  el.id = 'typing-indicator';
  el.innerHTML = `
    <div class="message-avatar">C</div>
    <div class="typing-bubble">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;
  chuckMsgs.appendChild(el);
  scrollMessages();
}

function hideTyping() {
  const el = $('typing-indicator');
  if (el) el.remove();
}

function scrollMessages() {
  chuckMsgs.scrollTo({ top: chuckMsgs.scrollHeight, behavior: 'smooth' });
}

// ============ QUICK REPLIES ============
function showQuickReplies(options) {
  quickReplies.innerHTML = '';
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'quick-reply-btn';
    btn.textContent = opt;
    btn.addEventListener('click', () => {
      hideQuickReplies();
      sendMessage(opt);
    });
    quickReplies.appendChild(btn);
  });
  quickReplies.classList.remove('hidden');
}

function hideQuickReplies() {
  quickReplies.classList.add('hidden');
  quickReplies.innerHTML = '';
}

// ============ STORE RESULTS ============
function showStoreResults(aiStores) {
  const items = buildStoreItems(aiStores);
  storeList.innerHTML = '';
  storeCount.textContent = `${items.length} stores`;
  setupMap(items);

  items.forEach((item, i) => {
    const alreadySaved = getSavedStores().some(
      s => s.storeId === item.store.id && s.item === item.name
    );

    const card = document.createElement('div');
    card.className = 'result-card';
    card.style.animationDelay = `${i * 80}ms`;
    card.innerHTML = `
      <button class="card-mini-heart ${alreadySaved ? 'saved' : ''}" aria-label="Save">${alreadySaved ? '♥' : '♡'}</button>
      <div class="result-card-thumb">
        <div class="result-card-thumb-bg" style="background: ${item.store.gradient};"></div>
      </div>
      <div class="result-card-body">
        <div class="result-card-store">${item.store.name}</div>
        <div class="result-card-item">${item.name}</div>
        <div class="result-card-meta">
          <span>${item.store.distance}</span>
          <span class="meta-dot"></span>
          <span>${item.category}</span>
        </div>
        <div class="result-card-price">${item.price}</div>
      </div>
    `;

    card.querySelector('.card-mini-heart').addEventListener('click', e => {
      e.stopPropagation();
      const btn = e.currentTarget;
      const isSaved = btn.classList.toggle('saved');
      btn.textContent = isSaved ? '♥' : '♡';
      if (isSaved) saveStore(item); else unsaveStore(item.store.id, item.name);
    });

    card.addEventListener('click', () => showStoreDetail(item));

    storeList.appendChild(card);
  });

  storeResults.classList.remove('hidden');

  // Scroll down so results are visible
  setTimeout(() => {
    storeResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}

// ============ STORE DETAIL SHEET ============
function showStoreDetail(item) {
  const existing = $('store-detail-overlay');
  if (existing) existing.remove();

  const store = item.store;
  const savedStores = getSavedStores();
  const alreadySaved = savedStores.some(s => s.storeId === store.id && s.item === item.name);

  const overlay = document.createElement('div');
  overlay.id = 'store-detail-overlay';
  overlay.className = 'store-detail-overlay';
  overlay.innerHTML = `
    <div class="store-detail-backdrop" id="store-detail-backdrop"></div>
    <div class="store-detail-panel">
      <div class="store-detail-handle"></div>
      <div class="store-detail-body">
        <div class="store-detail-top-row">
          <div>
            <div class="store-detail-name">${store.name}</div>
            <div class="store-detail-meta">
              <span>${store.distance}</span>
              <span class="meta-dot"></span>
              <span>${store.priceRange}</span>
            </div>
          </div>
          <div class="store-detail-top-icons">
            <button class="store-detail-heart-btn ${alreadySaved ? 'saved' : ''}" id="store-detail-heart">${alreadySaved ? '♥' : '♡'}</button>
            <button class="store-detail-close" id="store-detail-close">✕</button>
          </div>
        </div>
        <div class="store-detail-btn-stack">
          <button class="store-detail-chuck-btn" id="store-detail-chuck">Ask Chuck about it</button>
          <button class="store-detail-website-btn" id="store-detail-website">Visit website</button>
          <button class="store-detail-directions-btn" id="store-detail-dir">Get directions</button>
        </div>
      </div>
    </div>
  `;

  $('app').appendChild(overlay);

  // Double rAF ensures CSS transition fires on mobile Safari
  requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('open')));

  overlay.querySelector('#store-detail-backdrop').addEventListener('click', closeStoreDetail);
  overlay.querySelector('#store-detail-close').addEventListener('click', closeStoreDetail);

  overlay.querySelector('#store-detail-chuck').addEventListener('click', () => {
    closeStoreDetail();
    openChuck();
    setTimeout(() => {
      hideQuickReplies();
      sendMessage('Tell me about ' + store.name + ' — what should I check out there?');
    }, 480);
  });

  overlay.querySelector('#store-detail-website').addEventListener('click', () => {
    window.open('https://www.google.com/search?q=' + encodeURIComponent(store.name + ' official website'), '_blank');
  });

  overlay.querySelector('#store-detail-dir').addEventListener('click', () => {
    openMapsDirections(store);
  });

  overlay.querySelector('#store-detail-heart').addEventListener('click', function() {
    const isSaved = this.classList.toggle('saved');
    this.textContent = isSaved ? '♥' : '♡';
    if (isSaved) {
      saveStore(item);
    } else {
      unsaveStore(store.id, item.name);
    }
  });
}

function closeStoreDetail() {
  const overlay = $('store-detail-overlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  setTimeout(() => overlay.remove(), 380);
}

// ============ SEND MESSAGE ============
async function sendMessage(text) {
  const msg = (text || chuckInput.value).trim();
  if (!msg || isChuckThinking) return;

  if (!hasApiKey()) {
    setupModal.classList.remove('hidden');
    return;
  }

  // Require location before searching
  const loc = getSavedLocation ? getSavedLocation() : null;
  if (!loc || !loc.city) {
    chuckInput.value = '';
    addMessage('user', msg);
    addMessage('chuck', "I need your location to find stores near you — set your city first.");
    showLocationQuickReply();
    return;
  }

  chuckInput.value = '';
  chuckSend.disabled = true;
  hideQuickReplies();
  addMessage('user', msg);
  showTyping();

  try {
    const reply = await askChuck(msg);
    hideTyping();
    if (!reply) return;

    const cleanText = cleanReply(reply);
    if (cleanText) addMessage('chuck', cleanText);

    if (shouldShowStores(reply)) {
      showStoreResults(parseStoresFromReply(reply));
    }

  } catch (err) {
    hideTyping();
    if (err.message === 'AUTH_REQUIRED') {
      showAuthModal();
    } else if (err.message === 'RATE_LIMIT') {
      addMessage('chuck', "Give it a sec — hit the rate limit. Try again in a moment.");
    } else if (isNetworkError(err)) {
      addMessage('chuck', "Server's waking up — usually takes 30 seconds on first load. Try again in a moment.");
    } else {
      addMessage('chuck', "Having trouble connecting right now. Try again.");
      console.error('Chuck error:', err);
    }
  }
}

// ============ AUTH MODAL ============
let authModalMode = 'login'; // 'login' | 'signup'

function showAuthModal() {
  $('auth-email').value    = '';
  $('auth-password').value = '';
  $('auth-error').style.display = 'none';
  setupModal.classList.remove('hidden');
}

function setAuthModalMode(mode) {
  authModalMode = mode;
  const isSignup = mode === 'signup';
  $('auth-modal-title').textContent = isSignup ? 'Create your account' : 'Sign in to use Chuck';
  $('auth-modal-desc').textContent  = isSignup
    ? 'Free forever. Save stores, sync across devices.'
    : 'Sign in to chat with Chuck and access your saved stores.';
  saveKeyBtn.textContent = isSignup ? 'Create Account' : 'Sign In';
  $('auth-mode-toggle').textContent = isSignup
    ? 'Already have an account? Sign in'
    : "Don't have an account? Sign up free";
}

async function saveApiKey() {
  const email    = ($('auth-email').value    || '').trim();
  const password = ($('auth-password').value || '').trim();
  const errorEl  = $('auth-error');

  errorEl.style.display = 'none';

  if (!email || !password) {
    errorEl.textContent   = 'Please fill in both fields.';
    errorEl.style.display = 'block';
    return;
  }

  saveKeyBtn.disabled    = true;
  saveKeyBtn.textContent = '…';

  try {
    const endpoint = authModalMode === 'signup' ? '/api/auth/signup' : '/api/auth/login';
    const data = await apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    setToken(data.token);
    localStorage.setItem('lookin_email', email);
    setupModal.classList.add('hidden');
    openChuck();
  } catch (err) {
    if (isNetworkError(err)) {
      signInLocally(email);
      setupModal.classList.add('hidden');
      openChuck();
      return;
    }
    errorEl.textContent   = err.message === 'AUTH_REQUIRED'
      ? 'Invalid email or password.'
      : (err.message || 'Something went wrong. Try again.');
    errorEl.style.display = 'block';
    saveKeyBtn.disabled    = false;
    setAuthModalMode(authModalMode);
  }
}

function continueAsGuest() {
  localStorage.setItem('lookin_guest', 'true');
  signInLocally('');
  setupModal.classList.add('hidden');
  openChuck();
}

// ============ SAVE SYNC ============
function syncSaveToBackend(item) {
  if (!isAuthenticated()) return;
  apiRequest('/api/saved', {
    method: 'POST',
    body: JSON.stringify({
      store_id:    item.store.id,
      store_name:  item.store.name,
      item_name:   item.name,
      price:       item.price,
      category:    item.category,
      gradient:    item.store.gradient,
      price_range: item.store.priceRange,
      distance:    item.store.distance,
      lat:         item.store.lat  || null,
      lng:         item.store.lng  || null,
    }),
  }).catch(e => console.warn('Backend save failed:', e.message));
}

function syncUnsaveToBackend(storeId, itemName) {
  if (!isAuthenticated()) return;
  apiRequest('/api/saved')
    .then(rows => {
      const entry = rows.find(r => r.store_id === storeId && r.item_name === itemName);
      if (entry) return apiRequest('/api/saved/' + entry.id, { method: 'DELETE' });
    })
    .catch(e => console.warn('Backend unsave failed:', e.message));
}

// ============ CATEGORY CHIPS ============
function bindChips() {
  categoryChips.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      categoryChips.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });
}

// ============ INPUT ENABLE/DISABLE ============
function bindInput() {
  chuckInput.addEventListener('input', () => {
    chuckSend.disabled = chuckInput.value.trim().length === 0;
  });

  chuckInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey && !chuckSend.disabled) {
      e.preventDefault();
      sendMessage();
    }
  });

  chuckSend.addEventListener('click', () => sendMessage());
}

// ============ PHOTO UPLOAD ============
function isProUser() {
  return localStorage.getItem('lookin_is_pro') === 'true';
}

function handlePhotoBtn() {
  if (!hasApiKey()) {
    setupModal.classList.remove('hidden');
    return;
  }
  if (!isProUser()) {
    showPremiumModal();
    return;
  }
  photoInput.click();
}

function addPhotoMessage(dataUrl) {
  const wrap = document.createElement('div');
  wrap.className = 'message user';
  wrap.innerHTML = `
    <div class="message-bubble message-bubble-photo">
      <img src="${dataUrl}" class="message-photo" alt="Uploaded clothing photo" />
      <span class="message-photo-caption">Find me something similar</span>
    </div>
  `;
  chuckMsgs.appendChild(wrap);
  scrollMessages();
}

async function handlePhotoSelected(file) {
  if (!file || !file.type.startsWith('image/')) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    const dataUrl = e.target.result;
    const [header, base64] = dataUrl.split(',');
    const mimeType = header.match(/:(.*?);/)[1];

    hideQuickReplies();
    addPhotoMessage(dataUrl);
    showTyping();

    try {
      const reply = await askChuckWithVision(base64, mimeType);
      hideTyping();
      if (!reply) return;

      const cleanText = cleanReply(reply);
      if (cleanText) addMessage('chuck', cleanText);
      if (shouldShowStores(reply)) showStoreResults(parseStoresFromReply(reply));

    } catch (err) {
      hideTyping();
      if (err.message === 'AUTH_REQUIRED') {
        showAuthModal();
      } else if (err.message === 'RATE_LIMIT') {
        addMessage('chuck', "Give it a sec — hit the rate limit. Try again in a moment.");
      } else {
        addMessage('chuck', "Couldn't read the photo right now. Try again.");
        console.error('Vision error:', err);
      }
    }
  };
  reader.readAsDataURL(file);
}

// ============ PREMIUM MODAL ============
function showPremiumModal() {
  $('premium-modal').classList.remove('hidden');
}

function hidePremiumModal() {
  $('premium-modal').classList.add('hidden');
}

function activatePro() {
  localStorage.setItem('lookin_is_pro', 'true');
  hidePremiumModal();
  // Small delay so the sheet closes before the file picker opens
  setTimeout(() => photoInput.click(), 350);
}

// ============ PROFILE ============
let profileOpen = false;

function openProfile() {
  if (savedOpen) closeSaved();
  profileOpen = true;
  $('profile-screen').classList.remove('hidden');
  $('home-content').style.display = 'none';
  $('nav-profile').classList.add('active');
  $('nav-home').classList.remove('active');
  renderProfile();
}

function closeProfile() {
  profileOpen = false;
  $('profile-screen').classList.add('hidden');
  $('home-content').style.display = '';
  $('nav-home').classList.add('active');
  $('nav-profile').classList.remove('active');
}

function renderProfile() {
  const raw = localStorage.getItem('lookin_profile');
  const profile = raw ? JSON.parse(raw) : { vibes: [], inspo: [], budget: null };

  // Vibes
  const vibesEl = $('profile-vibes');
  vibesEl.innerHTML = '';
  if (profile.vibes && profile.vibes.length) {
    profile.vibes.forEach(id => {
      const meta = VIBE_META[id];
      if (!meta) return;
      const chip = document.createElement('div');
      chip.className = 'profile-vibe-chip';
      chip.textContent = meta.name;
      vibesEl.appendChild(chip);
    });
  } else {
    vibesEl.innerHTML = '<div style="color:var(--text-muted);font-size:13px;">No vibes selected — <span style="color:var(--purple);cursor:pointer" onclick="goToOnboarding()">take the quiz</span></div>';
  }

  // Celebs
  const celebsEl = $('profile-celebs');
  celebsEl.innerHTML = '';
  if (profile.inspo && profile.inspo.length) {
    profile.inspo.forEach(id => {
      const meta = CELEB_META[id];
      if (!meta) return;
      const card = document.createElement('div');
      card.className = 'profile-celeb-card';
      card.innerHTML = `
        <div class="profile-celeb-thumb">
          <div class="profile-celeb-bg" style="background:${meta.gradient};width:100%;height:100%;"></div>
          <div class="profile-celeb-initials">${getCelebInitials(meta.name)}</div>
        </div>
        <div class="profile-celeb-name">${meta.name}</div>
        <div class="profile-celeb-style">${meta.style}</div>
      `;
      celebsEl.appendChild(card);
    });
  } else {
    celebsEl.innerHTML = '<div style="color:var(--text-muted);font-size:13px;padding:4px 0;">No inspo picked yet.</div>';
  }

  // Budget slider ($10–$500 in $10 steps)
  const budgetEl = $('profile-budget');
  const savedAmount = Math.min(profile.budgetAmount || tierIdToAmount(profile.budget || 'mid-range'), 500);
  const initTierInfo = dollarToTier(savedAmount);
  const amountLabel = savedAmount >= 500 ? '$500+' : `$${savedAmount}`;

  budgetEl.innerHTML = `
    <div class="budget-slider-wrap">
      <input
        type="range"
        id="budget-range"
        class="budget-range"
        min="10" max="500" step="10"
        value="${savedAmount}"
      />
      <div class="budget-tier-labels">
        <span>Thrift</span>
        <span>Mid</span>
        <span>Premium</span>
        <span>Designer</span>
        <span>∞</span>
      </div>
    </div>
    <div class="budget-selected-display">
      <span class="budget-selected-amount" id="budget-selected-amount">${amountLabel}</span>
      <span class="budget-selected-per-piece">per piece</span>
      <span class="budget-selected-tier" id="budget-selected-tier">· ${initTierInfo.name}</span>
    </div>
  `;

  const rangeInput = $('budget-range');
  updateBudgetSliderFill(rangeInput);
  rangeInput.addEventListener('input', () => {
    const amount = parseInt(rangeInput.value, 10);
    const tierInfo = dollarToTier(amount);
    $('budget-selected-amount').textContent = amount >= 500 ? '$500+' : `$${amount}`;
    $('budget-selected-tier').textContent = `· ${tierInfo.name}`;
    updateBudgetSliderFill(rangeInput);
    saveBudgetAmount(amount);
  });

  // Account display
  const email = localStorage.getItem('lookin_email');
  $('apikey-display').textContent = email || (isAuthenticated() ? 'Signed in' : 'Not signed in');

  // Location display
  const locData = getSavedLocation ? getSavedLocation() : null;
  const locEl = $('profile-location-value');
  if (locEl) locEl.textContent = locData ? locData.city : 'Not set';

  const heroLoc = $('profile-hero-location');
  if (heroLoc) heroLoc.textContent = locData ? locData.city : 'Location not set';
}

// ============ MAPS ============
function openMapsDirections(store) {
  let url;
  if (store.lat && store.lng) {
    url = `https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`;
  } else {
    const loc = getSavedLocation ? getSavedLocation() : null;
    const q = loc && loc.city ? `${store.name} ${loc.city}` : store.name;
    url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
  }
  window.open(url, '_blank');
}

// ============ SAVED SCREEN ============
function openSaved() {
  if (profileOpen) closeProfile();
  savedOpen = true;
  $('saved-screen').classList.remove('hidden');
  $('home-content').style.display = 'none';
  $('nav-saved').classList.add('active');
  $('nav-home').classList.remove('active');
  renderSavedStores();
}

function closeSaved() {
  savedOpen = false;
  $('saved-screen').classList.add('hidden');
  $('home-content').style.display = '';
  $('nav-home').classList.add('active');
  $('nav-saved').classList.remove('active');
}

function switchSavedTab(tab) {
  const isStores = tab === 'stores';
  $('tab-stores').classList.toggle('active', isStores);
  $('tab-outfits').classList.toggle('active', !isStores);
  $('saved-stores-pane').classList.toggle('hidden', !isStores);
  $('saved-outfits-pane').classList.toggle('hidden', isStores);
}

function renderSavedStores() {
  const list = $('saved-list');
  const stores = getSavedStores();

  if (!stores.length) {
    list.innerHTML = `
      <div class="saved-empty">
        <div class="saved-empty-icon">♡</div>
        <div class="saved-empty-title">Nothing saved yet</div>
        <div class="saved-empty-sub">Ask Chuck to find something and tap the heart on any store.</div>
        <button class="saved-empty-btn" onclick="openChuck(); closeSaved()">Ask Chuck →</button>
      </div>
    `;
    return;
  }

  list.innerHTML = '';
  stores.slice().reverse().forEach(entry => {
    const card = document.createElement('div');
    card.className = 'saved-card';
    card.innerHTML = `
      <div class="saved-card-thumb">
        <div class="saved-card-thumb-bg" style="background:${entry.gradient}"></div>
      </div>
      <div class="saved-card-body">
        <div class="saved-card-store">${entry.name}</div>
        <div class="saved-card-item">${entry.item}</div>
        <div class="saved-card-meta">
          <span>${entry.distance}</span>
          <span class="meta-dot"></span>
          <span>${entry.priceRange}</span>
          <span class="meta-dot"></span>
          <span>${entry.price}</span>
        </div>
      </div>
      <div class="saved-card-actions">
        <button class="btn-directions-sm">Directions</button>
        <button class="btn-unsave" aria-label="Unsave">♥</button>
      </div>
    `;

    card.querySelector('.btn-directions-sm').addEventListener('click', () => {
      openMapsDirections({ name: entry.name, lat: entry.lat, lng: entry.lng });
    });

    card.querySelector('.btn-unsave').addEventListener('click', () => {
      unsaveStore(entry.storeId, entry.item);
      card.style.transition = 'opacity 0.2s, transform 0.2s';
      card.style.opacity = '0';
      card.style.transform = 'translateX(12px)';
      setTimeout(() => renderSavedStores(), 220);
    });

    list.appendChild(card);
  });
}

function updateBudgetSliderFill(input) {
  const pct = ((parseFloat(input.value) - 10) / (500 - 10)) * 100;
  input.style.setProperty('--pct', `${Math.max(0, Math.min(100, pct))}%`);
}

function saveBudgetAmount(amount) {
  const tier = dollarToTier(amount);
  const raw = localStorage.getItem('lookin_profile');
  const profile = raw ? JSON.parse(raw) : { vibes: [], inspo: [], budget: null };
  profile.budget = tier.id;
  profile.budgetAmount = amount;
  localStorage.setItem('lookin_profile', JSON.stringify(profile));
}

function getCelebInitials(name) {
  return name.replace(/[$&'.,]/g, ' ')
             .split(/[\s,]+/)
             .filter(w => /[a-zA-Z]/.test(w))
             .map(w => w.replace(/[^a-zA-Z]/g, '')[0] || '')
             .filter(Boolean)
             .slice(0, 2)
             .join('')
             .toUpperCase();
}

function openApiKeyEdit() {
  setupModal.classList.remove('hidden');
}

function handleSignOut() {
  if (confirm('Sign out and clear your style profile?')) {
    localStorage.clear();
    window.location.href = 'login.html';
  }
}

function goToOnboarding() {
  localStorage.removeItem('lookin_onboarded');
  window.location.href = 'onboarding.html';
}

// ============ EVENT BINDINGS ============
function bindEvents() {
  openChuckBar.addEventListener('click', openChuck);
  openChuckNav.addEventListener('click', openChuck);
  chuckClose.addEventListener('click', closeChuck);
  chuckBackdrop.addEventListener('click', closeChuck);
  saveKeyBtn.addEventListener('click', saveApiKey);
  $('auth-email')?.addEventListener('keydown',    e => { if (e.key === 'Enter') saveApiKey(); });
  $('auth-password')?.addEventListener('keydown', e => { if (e.key === 'Enter') saveApiKey(); });
  $('auth-mode-toggle')?.addEventListener('click', () => {
    setAuthModalMode(authModalMode === 'login' ? 'signup' : 'login');
  });
  $('guest-btn')?.addEventListener('click', continueAsGuest);

  $('nav-home').addEventListener('click', () => {
    closeChuck();
    if (profileOpen) closeProfile();
    if (savedOpen)   closeSaved();
  });
  $('nav-saved').addEventListener('click', () => {
    closeChuck();
    if (!savedOpen) openSaved();
  });
  $('nav-profile').addEventListener('click', () => {
    closeChuck();
    if (!profileOpen) openProfile();
  });

  $('tab-stores').addEventListener('click',  () => switchSavedTab('stores'));
  $('tab-outfits').addEventListener('click', () => switchSavedTab('outfits'));

  chuckPhotoBtn.addEventListener('click', handlePhotoBtn);
  photoInput.addEventListener('change', e => {
    const file = e.target.files[0];
    photoInput.value = '';
    if (file) handlePhotoSelected(file);
  });

  bindChips();
  bindInput();
}

// ============ BOOT ============
document.addEventListener('DOMContentLoaded', init);
