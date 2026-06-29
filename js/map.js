// ============ CHUCK MAP — Leaflet.js integration ============

const VENICE_LATLNG = [33.9860, -118.4693];

let _map = null;
let _markers = [];
let _items = [];
let _mapOpen = false;

// Called by app.js each time Chuck shows new store results
function setupMap(items) {
  _items = items;
  _mapOpen = false;
  _destroyMap();
  _syncToggleBtn();
}

// Called by map toggle button onclick
function toggleMap() {
  _mapOpen = !_mapOpen;
  const mapEl = document.getElementById('chuck-map');
  const listEl = document.getElementById('store-results-list');

  if (_mapOpen) {
    listEl.classList.add('hidden');
    mapEl.classList.remove('hidden');
    _syncToggleBtn();
    if (!_map) {
      _initMap(_items);
    } else {
      // Leaflet needs a tick after becoming visible
      setTimeout(() => _map.invalidateSize(), 50);
    }
  } else {
    mapEl.classList.add('hidden');
    listEl.classList.remove('hidden');
    _syncToggleBtn();
  }
}

// Called when Chuck panel closes — resets to list view
function resetMap() {
  if (_mapOpen) {
    _mapOpen = false;
    const mapEl = document.getElementById('chuck-map');
    const listEl = document.getElementById('store-results-list');
    if (mapEl)  mapEl.classList.add('hidden');
    if (listEl) listEl.classList.remove('hidden');
    _syncToggleBtn();
  }
  // Clear any card highlights
  document.querySelectorAll('.result-card.map-highlight').forEach(c => {
    c.classList.remove('map-highlight');
  });
}

// ── Internal ──────────────────────────────────────────────

function _initMap(items) {
  const container = document.getElementById('chuck-map');

  _map = L.map(container, {
    zoomControl: false,
    attributionControl: true,
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OSM</a> © <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
  }).addTo(_map);

  L.control.zoom({ position: 'bottomright' }).addTo(_map);

  function placeAll(userLatLng) {
    // User pin
    const userIcon = L.divIcon({
      className: '',
      html: '<div class="lf-pin-user"></div>',
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });

    L.marker(userLatLng, { icon: userIcon, zIndexOffset: 1000 })
      .addTo(_map)
      .bindPopup('<b>You</b>');

    // Store pins
    _markers = [];
    items.forEach((item, i) => {
      const num = i + 1;
      const storeIcon = L.divIcon({
        className: '',
        html: `<div class="lf-pin-store" data-num="${num}"></div>`,
        iconSize: [28, 36],
        iconAnchor: [14, 36],
        popupAnchor: [0, -38],
      });

      const marker = L.marker([item.store.lat, item.store.lng], { icon: storeIcon })
        .addTo(_map)
        .bindPopup(`<b>${item.store.name}</b>${item.name} · ${item.store.distance}`);

      marker.on('click', () => _onPinTap(i, marker));
      _markers.push(marker);
    });

    // Fit all markers in view
    const points = [userLatLng, ...items.map(it => [it.store.lat, it.store.lng])];
    _map.fitBounds(L.latLngBounds(points), { padding: [28, 28], maxZoom: 15 });
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => placeAll([pos.coords.latitude, pos.coords.longitude]),
      ()  => placeAll(VENICE_LATLNG),
      { timeout: 5000 }
    );
  } else {
    placeAll(VENICE_LATLNG);
  }
}

function _onPinTap(index, marker) {
  // Switch back to list view
  if (_mapOpen) toggleMap();

  // Highlight the corresponding card
  document.querySelectorAll('.result-card.map-highlight').forEach(c => {
    c.classList.remove('map-highlight');
  });

  const cards = document.querySelectorAll('#store-results-list .result-card');
  if (cards[index]) {
    cards[index].classList.add('map-highlight');
    cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Auto-clear after 2.5s
    setTimeout(() => cards[index].classList.remove('map-highlight'), 2500);
  }
}

function _destroyMap() {
  if (_map) {
    _map.remove();
    _map = null;
    _markers = [];
  }
}

function _syncToggleBtn() {
  const btn = document.getElementById('map-toggle-btn');
  if (!btn) return;

  if (_mapOpen) {
    btn.classList.add('active');
    btn.innerHTML = `
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
        <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
        <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg> List`;
  } else {
    btn.classList.remove('active');
    btn.innerHTML = `
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
      </svg> Map`;
  }
}
