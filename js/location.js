// ============ LOOKIN — Location Service ============

const STATE_ABBR = {
  'Alabama':'AL','Alaska':'AK','Arizona':'AZ','Arkansas':'AR','California':'CA',
  'Colorado':'CO','Connecticut':'CT','Delaware':'DE','Florida':'FL','Georgia':'GA',
  'Hawaii':'HI','Idaho':'ID','Illinois':'IL','Indiana':'IN','Iowa':'IA',
  'Kansas':'KS','Kentucky':'KY','Louisiana':'LA','Maine':'ME','Maryland':'MD',
  'Massachusetts':'MA','Michigan':'MI','Minnesota':'MN','Mississippi':'MS',
  'Missouri':'MO','Montana':'MT','Nebraska':'NE','Nevada':'NV','New Hampshire':'NH',
  'New Jersey':'NJ','New Mexico':'NM','New York':'NY','North Carolina':'NC',
  'North Dakota':'ND','Ohio':'OH','Oklahoma':'OK','Oregon':'OR','Pennsylvania':'PA',
  'Rhode Island':'RI','South Carolina':'SC','South Dakota':'SD','Tennessee':'TN',
  'Texas':'TX','Utah':'UT','Vermont':'VT','Virginia':'VA','Washington':'WA',
  'West Virginia':'WV','Wisconsin':'WI','Wyoming':'WY','District of Columbia':'DC',
};

function getSavedLocation() {
  const raw = localStorage.getItem('lookin_location');
  return raw ? JSON.parse(raw) : null;
}

function saveLocationData(city, lat, lng) {
  localStorage.setItem('lookin_location', JSON.stringify({ city, lat: lat || null, lng: lng || null }));
}

async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    const a = data.address || {};
    const city = a.city || a.town || a.suburb || a.village || a.hamlet || a.county || 'Your City';
    const stateAbbr = STATE_ABBR[a.state] || a.state || '';
    const countryCode = (a.country_code || '').toUpperCase();
    if (countryCode === 'US' && stateAbbr) return `${city}, ${stateAbbr}`;
    if (stateAbbr) return `${city}, ${stateAbbr}`;
    return city;
  } catch {
    return null;
  }
}

function applyLocation(city) {
  // Nav pin
  const navText = document.getElementById('nav-location-text');
  if (navText) navText.textContent = city;

  // Chuck status bar
  const chuckStatus = document.getElementById('chuck-location');
  if (chuckStatus) chuckStatus.textContent = `AI Fashion Assistant · ${city}`;

  // Profile hero location
  const profileHeroLoc = document.getElementById('profile-hero-location');
  if (profileHeroLoc) profileHeroLoc.textContent = city;

  // Profile settings row
  const profileSettingLoc = document.getElementById('profile-location-value');
  if (profileSettingLoc) profileSettingLoc.textContent = city;

  // Greeting (reads from localStorage itself)
  if (typeof setGreeting === 'function') setGreeting();
}

// ── Screen visibility ──────────────────────────────────

function showLocationScreen() {
  // Reset to default view
  const defaultView = document.getElementById('location-default-view');
  const manualView  = document.getElementById('location-manual-view');
  if (defaultView) defaultView.classList.remove('hidden');
  if (manualView)  manualView.classList.add('hidden');

  const enableBtn = document.getElementById('location-enable-btn');
  if (enableBtn) { enableBtn.textContent = 'Enable Location'; enableBtn.disabled = false; }

  const screen = document.getElementById('location-screen');
  if (screen) screen.classList.remove('hidden');
}

function hideLocationScreen() {
  const screen = document.getElementById('location-screen');
  if (!screen) return;
  screen.style.transition = 'opacity 0.38s ease';
  screen.style.opacity = '0';
  setTimeout(() => {
    screen.classList.add('hidden');
    screen.style.cssText = '';
  }, 390);
}

function showManualEntry() {
  document.getElementById('location-default-view').classList.add('hidden');
  const manualView = document.getElementById('location-manual-view');
  manualView.classList.remove('hidden');
  setTimeout(() => document.getElementById('location-city-input').focus(), 120);
}

// ── Handlers ──────────────────────────────────────────

async function handleEnableLocation() {
  const btn = document.getElementById('location-enable-btn');
  btn.textContent = 'Getting location…';
  btn.disabled = true;

  if (!navigator.geolocation) {
    showManualEntry();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async pos => {
      btn.textContent = 'Finding your city…';
      const { latitude: lat, longitude: lng } = pos.coords;
      let city = await reverseGeocode(lat, lng);
      if (!city) city = 'Your City';
      saveLocationData(city, lat, lng);
      applyLocation(city);
      hideLocationScreen();
    },
    () => {
      // Denied — fall back to manual
      btn.disabled = false;
      btn.textContent = 'Enable Location';
      showManualEntry();
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}

function handleConfirmCity() {
  const input = document.getElementById('location-city-input');
  const city = input.value.trim();
  if (!city) {
    input.style.borderColor = 'rgba(248,113,113,0.6)';
    setTimeout(() => { input.style.borderColor = ''; }, 1600);
    input.focus();
    return;
  }
  saveLocationData(city, null, null);
  applyLocation(city);
  hideLocationScreen();
}

// ── Init (called once from app.js) ────────────────────

function initLocation() {
  // Bind button events (once)
  document.getElementById('location-enable-btn')
    ?.addEventListener('click', handleEnableLocation);
  document.getElementById('location-manual-btn')
    ?.addEventListener('click', showManualEntry);
  document.getElementById('location-confirm-btn')
    ?.addEventListener('click', handleConfirmCity);
  document.getElementById('location-city-input')
    ?.addEventListener('keydown', e => { if (e.key === 'Enter') handleConfirmCity(); });

  const saved = getSavedLocation();
  if (saved) {
    applyLocation(saved.city);
    const screen = document.getElementById('location-screen');
    if (screen) screen.classList.add('hidden');
  }
  // If no saved location the screen is visible by default — nothing to do
}
