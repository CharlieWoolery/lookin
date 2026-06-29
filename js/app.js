// ============ LOOKIN — App UI Logic ============

// ---- DOM refs ----
const $ = id => document.getElementById(id);
const setupModal   = $('setup-modal');
const apiKeyInput  = $('api-key-input');
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

// ============ INIT ============
function init() {
  // Redirect to onboarding if first time
  if (!localStorage.getItem('lookin_onboarded')) {
    window.location.href = 'onboarding.html';
    return;
  }

  setGreeting();
  populateStores();
  populateInspoGrid();
  bindEvents();

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
  greetingTime.textContent = msg;
}

// ============ POPULATE HOME STORES ============
function populateStores() {
  storesScroll.innerHTML = '';
  MOCK_STORES.slice(0, 6).forEach(store => {
    const card = document.createElement('div');
    card.className = 'store-card-mini';
    card.innerHTML = `
      <div class="store-card-mini-thumb">
        <div class="store-card-mini-thumb-bg" style="background: ${store.gradient};"></div>
        <div class="store-card-mini-open${store.open ? '' : ' closed'}">${store.open ? 'OPEN' : 'CLOSED'}</div>
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
function showStoreResults() {
  const items = getResultCards(4);
  storeList.innerHTML = '';
  storeCount.textContent = `${items.length} stores`;
  setupMap(items);

  items.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = 'result-card';
    card.style.animationDelay = `${i * 80}ms`;
    card.innerHTML = `
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
      <div class="result-card-actions">
        <button class="btn-directions">Directions</button>
        <button class="btn-heart" aria-label="Save">♡</button>
      </div>
    `;

    card.querySelector('.btn-heart').addEventListener('click', e => {
      e.stopPropagation();
      const btn = e.currentTarget;
      const saved = btn.classList.toggle('saved');
      btn.textContent = saved ? '♥' : '♡';
    });

    storeList.appendChild(card);
  });

  storeResults.classList.remove('hidden');

  // Scroll down so results are visible
  setTimeout(() => {
    storeResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}

// ============ SEND MESSAGE ============
async function sendMessage(text) {
  const msg = (text || chuckInput.value).trim();
  if (!msg || isChuckThinking) return;

  if (!hasApiKey()) {
    setupModal.classList.remove('hidden');
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

    const showStores = shouldShowStores(reply);
    const cleanText = cleanReply(reply);

    if (cleanText) {
      addMessage('chuck', cleanText);
    }

    if (showStores) {
      showStoreResults();
    }

  } catch (err) {
    hideTyping();
    if (err.message === 'NO_API_KEY' || err.message === 'BAD_KEY') {
      setupModal.classList.remove('hidden');
      clearApiKey();
    } else if (err.message === 'RATE_LIMIT') {
      addMessage('chuck', "Give it a sec — hit the rate limit. Try again in a moment.");
    } else {
      addMessage('chuck', "Having trouble connecting right now. Check your key and try again.");
      console.error('Chuck error:', err);
    }
  }
}

// ============ API KEY SETUP ============
function saveApiKey() {
  const key = apiKeyInput.value.trim();
  if (!key || !key.startsWith('sk-ant')) {
    apiKeyInput.style.borderColor = 'rgba(239, 68, 68, 0.6)';
    apiKeyInput.placeholder = 'Must start with sk-ant-...';
    setTimeout(() => {
      apiKeyInput.style.borderColor = '';
      apiKeyInput.placeholder = 'sk-ant-api03-...';
    }, 2000);
    return;
  }
  setApiKey(key);
  setupModal.classList.add('hidden');
  apiKeyInput.value = '';
  openChuck();
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

      const showStores = shouldShowStores(reply);
      const cleanText  = cleanReply(reply);
      if (cleanText)   addMessage('chuck', cleanText);
      if (showStores)  showStoreResults();

    } catch (err) {
      hideTyping();
      if (err.message === 'NO_API_KEY' || err.message === 'BAD_KEY') {
        setupModal.classList.remove('hidden');
        clearApiKey();
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
      chip.innerHTML = `<span class="chip-emoji">${meta.emoji}</span>${meta.name}`;
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
          <div class="profile-celeb-emoji">${meta.emoji}</div>
        </div>
        <div class="profile-celeb-name">${meta.name}</div>
        <div class="profile-celeb-style">${meta.style}</div>
      `;
      celebsEl.appendChild(card);
    });
  } else {
    celebsEl.innerHTML = '<div style="color:var(--text-muted);font-size:13px;padding:4px 0;">No inspo picked yet.</div>';
  }

  // Budget
  const budgetEl = $('profile-budget');
  const bMeta = profile.budget ? BUDGET_META[profile.budget] : null;
  if (bMeta) {
    budgetEl.innerHTML = `
      <div>
        <div class="profile-budget-label">${bMeta.label}</div>
        <div class="profile-budget-desc">${bMeta.desc}</div>
      </div>
      <button class="profile-budget-change" onclick="goToOnboarding()">Change</button>
    `;
  } else {
    budgetEl.innerHTML = `<div style="color:var(--text-muted);font-size:13px;">Not set — <span style="color:var(--purple);cursor:pointer" onclick="goToOnboarding()">take the quiz</span></div>`;
  }

  // API key display
  const key = localStorage.getItem('lookin_api_key');
  $('apikey-display').textContent = key
    ? key.slice(0, 14) + '••••••••'
    : 'Not set';
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
  apiKeyInput.addEventListener('keydown', e => { if (e.key === 'Enter') saveApiKey(); });

  $('nav-home').addEventListener('click', () => { if (profileOpen) closeProfile(); });
  $('nav-profile').addEventListener('click', () => { if (!profileOpen) openProfile(); });

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
