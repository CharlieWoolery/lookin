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

// ── Top US cities for autocomplete ────────────────────
const US_CITIES = [
  'Albuquerque, NM', 'Anaheim, CA', 'Anchorage, AK', 'Arlington, TX',
  'Atlanta, GA', 'Aurora, CO', 'Austin, TX', 'Bakersfield, CA',
  'Baltimore, MD', 'Boston, MA', 'Buffalo, NY', 'Charlotte, NC',
  'Chicago, IL', 'Cincinnati, OH', 'Cleveland, OH', 'Colorado Springs, CO',
  'Columbus, OH', 'Corpus Christi, TX', 'Dallas, TX', 'Denver, CO',
  'Detroit, MI', 'Durham, NC', 'El Paso, TX', 'Fort Worth, TX',
  'Fresno, CA', 'Garland, TX', 'Greensboro, NC', 'Henderson, NV',
  'Honolulu, HI', 'Houston, TX', 'Indianapolis, IN', 'Irvine, CA',
  'Jacksonville, FL', 'Jersey City, NJ', 'Kansas City, MO', 'Laredo, TX',
  'Las Vegas, NV', 'Lexington, KY', 'Long Beach, CA', 'Los Angeles, CA',
  'Louisville, KY', 'Lubbock, TX', 'Madison, WI', 'Memphis, TN',
  'Mesa, AZ', 'Miami, FL', 'Milwaukee, WI', 'Minneapolis, MN',
  'Nashville, TN', 'New Orleans, LA', 'New York, NY', 'Newark, NJ',
  'Oklahoma City, OK', 'Omaha, NE', 'Orlando, FL', 'Philadelphia, PA',
  'Phoenix, AZ', 'Pittsburgh, PA', 'Plano, TX', 'Portland, OR',
  'Raleigh, NC', 'Riverside, CA', 'Sacramento, CA', 'San Antonio, TX',
  'San Diego, CA', 'San Francisco, CA', 'San Jose, CA', 'Santa Ana, CA',
  'Seattle, WA', 'St. Louis, MO', 'Stockton, CA', 'Tampa, FL',
  'Toledo, OH', 'Tucson, AZ', 'Tulsa, OK', 'Virginia Beach, VA',
  'Washington, DC', 'Winston-Salem, NC',
];

// ── Autocomplete state ─────────────────────────────────
let selectedCity = null;
let highlightedIndex = -1;

// ── Utility ────────────────────────────────────────────
function isDesktopBrowser() {
  return navigator.maxTouchPoints === 0 && window.innerWidth >= 768;
}

// ── Storage ────────────────────────────────────────────
function getSavedLocation() {
  const raw = localStorage.getItem('lookin_location');
  return raw ? JSON.parse(raw) : null;
}

function saveLocationData(city, lat, lng) {
  localStorage.setItem('lookin_location', JSON.stringify({ city, lat: lat || null, lng: lng || null }));
}

// ── Reverse geocoding ──────────────────────────────────
async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
      { headers: { 'Accept-Language': 'en', 'User-Agent': 'Lookin-App/1.0' } }
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

// ── Apply location across UI ───────────────────────────
function applyLocation(city) {
  const navText = document.getElementById('nav-location-text');
  if (navText) navText.textContent = city;

  const chuckStatus = document.getElementById('chuck-location');
  if (chuckStatus) chuckStatus.textContent = `AI Fashion Assistant · ${city}`;

  const profileHeroLoc = document.getElementById('profile-hero-location');
  if (profileHeroLoc) profileHeroLoc.textContent = city;

  const profileSettingLoc = document.getElementById('profile-location-value');
  if (profileSettingLoc) profileSettingLoc.textContent = city;

  if (typeof setGreeting === 'function') setGreeting();
  if (typeof populateStores === 'function') populateStores();
  if (typeof resetConversation === 'function') resetConversation();
}

// ── Screen visibility ──────────────────────────────────
function showLocationScreen() {
  const defaultView = document.getElementById('location-default-view');
  const manualView  = document.getElementById('location-manual-view');
  if (defaultView) defaultView.classList.remove('hidden');
  if (manualView)  manualView.classList.add('hidden');

  const enableBtn = document.getElementById('location-enable-btn');
  if (enableBtn) { enableBtn.textContent = 'Enable Location'; enableBtn.disabled = false; }

  // Reset autocomplete state
  selectedCity = null;
  highlightedIndex = -1;
  const input = document.getElementById('location-city-input');
  if (input) input.value = '';
  closeDropdown();
  const failMsg = document.getElementById('location-auto-fail');
  if (failMsg) failMsg.classList.add('hidden');

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

function showManualEntry(errorMsg) {
  document.getElementById('location-default-view').classList.add('hidden');
  const manualView = document.getElementById('location-manual-view');
  manualView.classList.remove('hidden');

  const failMsg = document.getElementById('location-auto-fail');
  if (failMsg) {
    if (errorMsg) {
      failMsg.textContent = errorMsg;
      failMsg.classList.remove('hidden');
    } else {
      failMsg.classList.add('hidden');
    }
  }

  setTimeout(() => document.getElementById('location-city-input').focus(), 120);
}

// ── City autocomplete ──────────────────────────────────
function filterCities(query) {
  if (!query || query.length < 1) return [];
  const q = query.toLowerCase();
  return US_CITIES.filter(c => c.toLowerCase().includes(q)).slice(0, 8);
}

function renderDropdown(matches) {
  const dropdown = document.getElementById('city-dropdown');
  if (!dropdown) return;
  dropdown.innerHTML = '';
  highlightedIndex = -1;

  if (!matches.length) {
    dropdown.classList.add('hidden');
    return;
  }

  matches.forEach(city => {
    const item = document.createElement('div');
    item.className = 'city-dropdown-item';
    item.textContent = city;
    item.addEventListener('mousedown', e => {
      e.preventDefault(); // keep input focused until after selection
      selectCity(city);
    });
    dropdown.appendChild(item);
  });

  dropdown.classList.remove('hidden');
}

function highlightDropdownItem(index) {
  const dropdown = document.getElementById('city-dropdown');
  if (!dropdown) return;
  const items = dropdown.querySelectorAll('.city-dropdown-item');
  items.forEach(el => el.classList.remove('highlighted'));
  if (index >= 0 && index < items.length) {
    items[index].classList.add('highlighted');
    highlightedIndex = index;
  } else {
    highlightedIndex = -1;
  }
}

function selectCity(city) {
  selectedCity = city;
  const input = document.getElementById('location-city-input');
  if (input) input.value = city;
  closeDropdown();
}

function closeDropdown() {
  const dropdown = document.getElementById('city-dropdown');
  if (dropdown) {
    dropdown.innerHTML = '';
    dropdown.classList.add('hidden');
  }
  highlightedIndex = -1;
}

// ── Geolocation ────────────────────────────────────────
function handleEnableLocation() {
  const btn = document.getElementById('location-enable-btn');

  if (!navigator.geolocation) {
    showManualEntry();
    return;
  }

  const isDesktop = isDesktopBrowser();
  btn.textContent = 'Finding your location…';
  btn.disabled = true;

  navigator.geolocation.getCurrentPosition(
    function(pos) {
      btn.textContent = 'Finding your city…';
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      reverseGeocode(lat, lng).then(function(city) {
        if (!city) city = 'Unknown City';
        saveLocationData(city, lat, lng);
        applyLocation(city);
        hideLocationScreen();
      });
    },
    function(err) {
      btn.disabled = false;
      btn.textContent = 'Enable Location';
      // PERMISSION_DENIED (code 1): user explicitly said no — go straight to manual entry
      // TIMEOUT (code 3) or POSITION_UNAVAILABLE (code 2): tried and failed — show message
      const denied = err.code === 1;
      showManualEntry(denied ? null : "We couldn't detect your location automatically.");
    },
    {
      enableHighAccuracy: !isDesktop,   // no GPS on laptops; high accuracy just slows things down
      timeout:           isDesktop ? 20000 : 10000,
      maximumAge:        isDesktop ? 300000 : 0,
    }
  );
}

function handleConfirmCity() {
  const input = document.getElementById('location-city-input');
  const typed = (input ? input.value : '').trim();

  // If user edited the input after selecting from dropdown, clear the selection
  if (selectedCity && typed !== selectedCity) selectedCity = null;

  // Also accept if the typed value exactly matches a known city (e.g. copy-paste)
  if (!selectedCity && US_CITIES.includes(typed)) selectedCity = typed;

  if (!selectedCity) {
    if (input) {
      input.style.borderColor = 'rgba(248,113,113,0.6)';
      setTimeout(() => { input.style.borderColor = ''; }, 1600);
      input.focus();
    }
    const matches = filterCities(typed);
    if (matches.length) renderDropdown(matches);
    return;
  }

  saveLocationData(selectedCity, null, null);
  applyLocation(selectedCity);
  selectedCity = null;
  hideLocationScreen();
}

// ── Init ───────────────────────────────────────────────
function initLocation() {
  document.getElementById('location-enable-btn')
    ?.addEventListener('click', handleEnableLocation);
  document.getElementById('location-manual-btn')
    ?.addEventListener('click', () => showManualEntry());
  document.getElementById('location-confirm-btn')
    ?.addEventListener('click', handleConfirmCity);

  const cityInput = document.getElementById('location-city-input');
  if (cityInput) {
    cityInput.addEventListener('input', () => {
      const q = cityInput.value.trim();
      if (selectedCity && q !== selectedCity) selectedCity = null;
      renderDropdown(filterCities(q));
    });

    cityInput.addEventListener('keydown', e => {
      const dropdown = document.getElementById('city-dropdown');
      const items = dropdown ? Array.from(dropdown.querySelectorAll('.city-dropdown-item')) : [];
      const dropdownVisible = dropdown && !dropdown.classList.contains('hidden');

      if (e.key === 'ArrowDown' && dropdownVisible) {
        e.preventDefault();
        highlightDropdownItem(Math.min(highlightedIndex + 1, items.length - 1));
      } else if (e.key === 'ArrowUp' && dropdownVisible) {
        e.preventDefault();
        highlightDropdownItem(Math.max(highlightedIndex - 1, -1));
      } else if (e.key === 'Enter') {
        if (highlightedIndex >= 0 && items[highlightedIndex]) {
          e.preventDefault();
          selectCity(items[highlightedIndex].textContent);
        } else if (items.length > 0 && dropdownVisible) {
          e.preventDefault();
          selectCity(items[0].textContent);
        } else if (selectedCity) {
          e.preventDefault();
          handleConfirmCity();
        }
      } else if (e.key === 'Escape') {
        closeDropdown();
      }
    });

    cityInput.addEventListener('blur', () => {
      // Delay so mousedown on a dropdown item fires before we close
      setTimeout(closeDropdown, 200);
    });
  }

  const saved = getSavedLocation();
  if (saved) {
    applyLocation(saved.city);
    const screen = document.getElementById('location-screen');
    if (screen) screen.classList.add('hidden');
  }
}
