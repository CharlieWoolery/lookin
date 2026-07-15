// ============ MOCK STORES ============
const MOCK_STORES = [
  {
    id: 1,
    name: 'Kith',
    distance: '0.3 mi',
    category: 'Streetwear',
    rating: '4.9',
    priceRange: '$$$$',
    open: true,
    gradient: 'linear-gradient(145deg, #0f0c29 0%, #1a1042 50%, #24243e 100%)',
    accentColor: '#a78bfa',
    featuredItem: 'Mercer Hoodie',
    itemPrice: '$280',
    tags: ['Streetwear', 'Premium'],
    lat: 33.9882, lng: -118.4714,
    tip: 'New collab drops hit the back wall on Fridays — get there early.',
  },
  {
    id: 2,
    name: 'Carhartt WIP',
    distance: '0.7 mi',
    category: 'Workwear',
    rating: '4.7',
    priceRange: '$$$',
    open: true,
    gradient: 'linear-gradient(145deg, #1a1209 0%, #2c1f0e 50%, #3d2b14 100%)',
    accentColor: '#f59e0b',
    featuredItem: 'Detroit Jacket',
    itemPrice: '$220',
    tags: ['Streetwear', 'Workwear'],
    lat: 33.9925, lng: -118.4740,
    tip: 'Duck canvas runs slim — size up one for the right fit.',
  },
  {
    id: 3,
    name: 'Bodega',
    distance: '1.1 mi',
    category: 'Curated',
    rating: '4.9',
    priceRange: '$$$',
    open: true,
    gradient: 'linear-gradient(145deg, #0d1a0d 0%, #142814 50%, #1c3a1c 100%)',
    accentColor: '#4ade80',
    featuredItem: 'NB 990v6',
    itemPrice: '$260',
    tags: ['Vintage', 'Curated'],
    lat: 33.9950, lng: -118.4785,
    tip: 'Hidden door entrance — ask the guy behind the counter.',
  },
  {
    id: 4,
    name: 'Needles',
    distance: '1.8 mi',
    category: 'Avant-Garde',
    rating: '4.8',
    priceRange: '$$$$',
    open: false,
    gradient: 'linear-gradient(145deg, #110a1a 0%, #2d1255 50%, #4c1d95 100%)',
    accentColor: '#7c3aed',
    featuredItem: 'Rebuild Jacket',
    itemPrice: '$580',
    tags: ['Avant-Garde', 'Vintage'],
    lat: 34.0005, lng: -118.4825,
    tip: 'Weekend rack has archive pieces they rotate every Thursday.',
  },
  {
    id: 5,
    name: 'Aritzia',
    distance: '0.5 mi',
    category: 'California',
    rating: '4.6',
    priceRange: '$$$',
    open: true,
    gradient: 'linear-gradient(145deg, #1a0a10 0%, #2d1020 50%, #3d1530 100%)',
    accentColor: '#f472b6',
    featuredItem: 'Wilfred Blazer',
    itemPrice: '$198',
    tags: ['California', 'Old Money'],
    lat: 33.9902, lng: -118.4730,
    tip: 'New drops hit Tuesday mornings — sale rack is in the back.',
  },
  {
    id: 6,
    name: 'Patagonia',
    distance: '1.2 mi',
    category: 'Outdoor',
    rating: '4.7',
    priceRange: '$$$',
    open: true,
    gradient: 'linear-gradient(145deg, #0a1508 0%, #142210 50%, #1c3018 100%)',
    accentColor: '#34d399',
    featuredItem: 'Nano Puff Jacket',
    itemPrice: '$249',
    tags: ['California', 'Outdoor'],
    lat: 33.9960, lng: -118.4800,
    tip: 'Ironclad repair guarantee — bring anything worn out and they fix it free.',
  },
  {
    id: 7,
    name: 'Uniqlo',
    distance: '0.6 mi',
    category: 'Minimal',
    rating: '4.5',
    priceRange: '$$',
    open: true,
    gradient: 'linear-gradient(145deg, #0a0f1a 0%, #12192e 50%, #1a2540 100%)',
    accentColor: '#60a5fa',
    featuredItem: 'U Crewneck Sweater',
    itemPrice: '$49.90',
    tags: ['Minimal', 'Old Money'],
    lat: 33.9920, lng: -118.4752,
    tip: 'LifeWear line restocks Thursday mornings — go early for your size.',
  },
  {
    id: 8,
    name: 'SSENSE',
    distance: '2.2 mi',
    category: 'Luxury',
    rating: '4.8',
    priceRange: '$$$$',
    open: true,
    gradient: 'linear-gradient(145deg, #0a0a0a 0%, #141414 50%, #1e1e1e 100%)',
    accentColor: '#e5e7eb',
    featuredItem: 'Ami Paris Crewneck',
    itemPrice: '$390',
    tags: ['Luxury', 'Avant-Garde'],
    lat: 34.0082, lng: -118.4882,
    tip: 'Staff can pull pieces from the stockroom not shown on the floor.',
  },
];

// ============ MOCK ITEMS (for Chuck results) ============
const MOCK_ITEMS = [
  { storeId: 1, name: 'Mercer Hoodie',      price: '$280',   category: 'Hoodie',    vibes: ['streetwear', 'premium'] },
  { storeId: 1, name: 'Williams III Polo',  price: '$185',   category: 'Top',       vibes: ['old money', 'streetwear'] },
  { storeId: 2, name: 'Detroit Jacket',     price: '$220',   category: 'Jacket',    vibes: ['streetwear', 'workwear', 'vintage'] },
  { storeId: 2, name: 'Chase Cargo Pant',   price: '$140',   category: 'Pants',     vibes: ['streetwear', 'workwear'] },
  { storeId: 3, name: 'New Balance 990v6',  price: '$260',   category: 'Sneakers',  vibes: ['old money', 'streetwear', 'vintage'] },
  { storeId: 3, name: 'Seersucker Shirt',   price: '$165',   category: 'Shirt',     vibes: ['vintage', 'california'] },
  { storeId: 4, name: 'Rebuild Track Pant', price: '$340',   category: 'Pants',     vibes: ['avant-garde', 'vintage'] },
  { storeId: 4, name: 'Butterfly Button-Up',price: '$420',   category: 'Shirt',     vibes: ['avant-garde', 'vintage'] },
  { storeId: 5, name: 'Wilfred Blazer',     price: '$198',   category: 'Blazer',    vibes: ['california', 'old money'] },
  { storeId: 5, name: 'TNA Hoodie',         price: '$128',   category: 'Hoodie',    vibes: ['california', 'streetwear'] },
  { storeId: 6, name: 'Nano Puff Jacket',   price: '$249',   category: 'Jacket',    vibes: ['california', 'outdoor'] },
  { storeId: 7, name: 'U Crewneck Sweater', price: '$49.90', category: 'Sweater',   vibes: ['minimal', 'old money'] },
  { storeId: 7, name: 'Heattech Turtleneck',price: '$19.90', category: 'Top',       vibes: ['minimal', 'old money'] },
  { storeId: 8, name: 'Ami Paris Crewneck', price: '$390',   category: 'Sweater',   vibes: ['old money', 'premium'] },
  { storeId: 8, name: 'Stone Island Fleece',price: '$595',   category: 'Jacket',    vibes: ['streetwear', 'premium'] },
];

// ============ INSPO CARDS ============
const INSPO_CARDS = [
  {
    vibe: 'Old Money',
    desc: 'Coastal grandfather',
    gradient: 'linear-gradient(160deg, #c9a96e 0%, #8b6520 40%, #4a3010 100%)',
    decorColor: 'rgba(255,255,255,0.08)',
    decorSize: '140px',
    decorPos: { top: '-20px', right: '-20px' },
  },
  {
    vibe: 'Streetwear',
    desc: 'Tokyo nights',
    gradient: 'linear-gradient(160deg, #060614 0%, #1a1042 55%, #4a20b0 100%)',
    decorColor: 'rgba(167,139,250,0.12)',
    decorSize: '120px',
    decorPos: { bottom: '40px', left: '-30px' },
  },
  {
    vibe: 'California',
    desc: 'Venice Beach',
    gradient: 'linear-gradient(160deg, #ff7a1a 0%, #ff4560 50%, #9b1fa8 100%)',
    decorColor: 'rgba(255,255,255,0.1)',
    decorSize: '100px',
    decorPos: { top: '10px', right: '10px' },
  },
  {
    vibe: 'Vintage',
    desc: '90s archive',
    gradient: 'linear-gradient(160deg, #7a5c38 0%, #4a3420 50%, #2c1e10 100%)',
    decorColor: 'rgba(255,200,100,0.08)',
    decorSize: '160px',
    decorPos: { top: '-40px', left: '-40px' },
  },
  {
    vibe: 'Avant-Garde',
    desc: 'Gallery opening',
    gradient: 'linear-gradient(160deg, #06000e 0%, #250870 55%, #7c3aed 100%)',
    decorColor: 'rgba(124,58,237,0.2)',
    decorSize: '130px',
    decorPos: { bottom: '20px', right: '-20px' },
  },
  {
    vibe: 'Night Out',
    desc: 'Off-duty drip',
    gradient: 'linear-gradient(160deg, #0a0a0a 0%, #1a1a1a 60%, #2d2d2d 100%)',
    decorColor: 'rgba(74,222,128,0.06)',
    decorSize: '150px',
    decorPos: { top: '-20px', right: '-20px' },
  },
];

// ============ PROFILE LOOKUP TABLES ============
const VIBE_META = {
  'old-money':       { name: 'Old Money',        emoji: '⚓' },
  'streetwear':      { name: 'Streetwear',        emoji: '🔥' },
  'vintage':         { name: 'Vintage',           emoji: '📼' },
  'california':      { name: 'California',        emoji: '🌴' },
  'avant-garde':     { name: 'Avant-Garde',       emoji: '🎨' },
  'gorpcore':        { name: 'Gorpcore',          emoji: '🏔️' },
  'y2k':             { name: 'Y2K',               emoji: '💿' },
  'dark-academia':   { name: 'Dark Academia',     emoji: '📚' },
  'coastal-grandma': { name: 'Coastal Grandma',   emoji: '☀️' },
  'workwear':        { name: 'Workwear',          emoji: '💼' },
  'grunge':          { name: 'Grunge',            emoji: '🎸' },
  'preppy':          { name: 'Preppy',            emoji: '🎾' },
  'bohemian':        { name: 'Bohemian',          emoji: '🌻' },
};

const CELEB_META = {
  'frank-ocean':   { name: 'Frank Ocean',         emoji: '🌊', style: 'Vintage · Artsy',          gradient: 'linear-gradient(145deg, #0a1828 0%, #0d3255 100%)' },
  'asap-rocky':    { name: 'A$AP Rocky',           emoji: '🔱', style: 'Street · High Fashion',    gradient: 'linear-gradient(145deg, #1a0808 0%, #3d1010 100%)' },
  'playboi-carti': { name: 'Playboi Carti',        emoji: '🦇', style: 'Avant-Garde · Punk',       gradient: 'linear-gradient(145deg, #0a0a0a 0%, #1c0a1c 100%)' },
  'jacob-elordi':  { name: 'Jacob Elordi',         emoji: '☕', style: 'Old Money · Minimal',      gradient: 'linear-gradient(145deg, #1e1a10 0%, #3d3520 100%)' },
  'tyler':         { name: 'Tyler, the Creator',   emoji: '🌿', style: 'Preppy · Eclectic',        gradient: 'linear-gradient(145deg, #0f1a0a 0%, #243d12 100%)' },
  'timothee':      { name: 'Timothée Chalamet',    emoji: '🎬', style: 'Avant-Garde · Luxury',     gradient: 'linear-gradient(145deg, #0a0a18 0%, #18183a 100%)' },
  'zendaya':       { name: 'Zendaya',              emoji: '✨', style: 'Glamour · Streetwear',     gradient: 'linear-gradient(145deg, #1a0a12 0%, #3d1030 100%)' },
  'kendall':       { name: 'Kendall Jenner',       emoji: '🤍', style: 'Model Off-Duty · Minimal', gradient: 'linear-gradient(145deg, #1a1510 0%, #2d2518 100%)' },
  'bad-bunny':     { name: 'Bad Bunny',            emoji: '🐰', style: 'Streetwear · Maximalist',  gradient: 'linear-gradient(145deg, #0a1020 0%, #1a2040 100%)' },
  'hailey-bieber': { name: 'Hailey Bieber',        emoji: '🌸', style: 'Model Off-Duty · Clean',   gradient: 'linear-gradient(145deg, #1a1008 0%, #3d2c18 100%)' },
  'pharrell':      { name: 'Pharrell Williams',    emoji: '🎧', style: 'Streetwear · Artsy',       gradient: 'linear-gradient(145deg, #0a1428 0%, #1428a0 100%)' },
  'harry-styles':  { name: 'Harry Styles',         emoji: '🌈', style: 'Maximalist · Vintage',     gradient: 'linear-gradient(145deg, #1a0818 0%, #3d1040 100%)' },
  'rihanna':       { name: 'Rihanna',              emoji: '💎', style: 'Bold · High Fashion',      gradient: 'linear-gradient(145deg, #1a0808 0%, #4d1010 100%)' },
  'kanye':         { name: 'Kanye West',           emoji: '🎤', style: 'Minimalist · Avant-Garde', gradient: 'linear-gradient(145deg, #080808 0%, #1c1c1c 100%)' },
  'sydney':        { name: 'Sydney Sweeney',       emoji: '🌻', style: 'California · Vintage',     gradient: 'linear-gradient(145deg, #201808 0%, #3d2c10 100%)' },
  'sabrina':       { name: 'Sabrina Carpenter',    emoji: '🍒', style: 'Y2K · Feminine',           gradient: 'linear-gradient(145deg, #1a0818 0%, #3d1a30 100%)' },
  'travis-scott':  { name: 'Travis Scott',         emoji: '🌵', style: 'Streetwear · Dark',        gradient: 'linear-gradient(145deg, #0a0818 0%, #1a1040 100%)' },
  'billie-eilish': { name: 'Billie Eilish',        emoji: '🖤', style: 'Grunge · Oversized',       gradient: 'linear-gradient(145deg, #080e08 0%, #0a2010 100%)' },
  'dev-patel':     { name: 'Dev Patel',            emoji: '🎭', style: 'Bohemian · Tailored',      gradient: 'linear-gradient(145deg, #180c04 0%, #3d2010 100%)' },
};

const BUDGET_TIERS = [
  { id: 'thrift',    name: 'Thrift',    range: '$10 – $30' },
  { id: 'mid-range', name: 'Mid Range', range: '$30 – $100' },
  { id: 'premium',   name: 'Premium',   range: '$100 – $250' },
  { id: 'designer',  name: 'Designer',  range: '$250 – $500' },
  { id: 'no-budget', name: 'No Budget', range: '$500+' },
];

// ============ TRENDING OUTFITS ============
const TRENDING_OUTFITS = [
  {
    id: 'old-money-summer',
    name: 'Old Money Summer',
    category: 'Old Money',
    gradient: 'linear-gradient(145deg, #a08060 0%, #6e5030 50%, #4a3020 100%)',
    prompt: 'I want the Old Money Summer look — linen trousers, polo shirts, and loafers.',
  },
  {
    id: 'frank-ocean-fit',
    name: 'Frank Ocean Fit',
    category: 'R&B Drip',
    gradient: 'linear-gradient(145deg, #0a1a30 0%, #0e2a50 50%, #184078 100%)',
    prompt: 'I want a Frank Ocean-inspired fit — relaxed, artistic, vintage-leaning streetwear.',
  },
  {
    id: 'y2k-revival',
    name: 'Y2K Revival',
    category: 'Y2K',
    gradient: 'linear-gradient(145deg, #2d0845 0%, #6d1a9c 50%, #a020c8 100%)',
    prompt: 'I want a Y2K Revival outfit — baby tees, low-rise jeans, and chrome accessories.',
  },
  {
    id: 'gorpcore',
    name: 'Gorpcore Hike',
    category: 'Gorpcore',
    gradient: 'linear-gradient(145deg, #182e10 0%, #2d5020 50%, #467838 100%)',
    prompt: 'I want a Gorpcore hiking fit — technical fleece, cargo pants, and trail shoes.',
  },
  {
    id: 'dark-academia',
    name: 'Dark Academia',
    category: 'Academia',
    gradient: 'linear-gradient(145deg, #18100a 0%, #3d2814 50%, #5c3e20 100%)',
    prompt: 'I want a Dark Academia look — tweed blazer, turtleneck, and Oxford shoes.',
  },
  {
    id: 'clean-streetwear',
    name: 'Clean Streetwear',
    category: 'Streetwear',
    gradient: 'linear-gradient(145deg, #0c1018 0%, #141e2c 50%, #1c2c42 100%)',
    prompt: 'I want clean streetwear — oversized tee, wide-leg cargos, and clean sneakers.',
  },
  {
    id: 'california-surf',
    name: 'California Surf',
    category: 'California',
    gradient: 'linear-gradient(145deg, #0a3560 0%, #0c5090 50%, #1070c0 100%)',
    prompt: 'I want a California surf look — board shorts, breezy linen shirt, and sandals.',
  },
  {
    id: 'coastal-grandma',
    name: 'Coastal Grandma',
    category: 'Coastal',
    gradient: 'linear-gradient(145deg, #8a6a42 0%, #6a5030 50%, #4e3c22 100%)',
    prompt: 'I want the Coastal Grandma vibe — linen, natural tones, and woven accessories.',
  },
];

// ============ TRENDING STORES CONFIG ============
const TRENDING_STORES_CONFIG = [
  { id: 1, hotLabel: 'Packed today' },
  { id: 3, hotLabel: 'New drop just landed' },
  { id: 5, hotLabel: '20% off this weekend' },
  { id: 7, hotLabel: 'Most visited this week' },
];

// ============ BUDGET UTILS ============
function dollarToTier(amount) {
  amount = Number(amount) || 60;
  if (amount < 30)   return { id: 'thrift',    name: 'Thrift',    range: '$10–$30' };
  if (amount <= 100) return { id: 'mid-range', name: 'Mid Range', range: '$30–$100' };
  if (amount <= 250) return { id: 'premium',   name: 'Premium',   range: '$100–$250' };
  if (amount < 500)  return { id: 'designer',  name: 'Designer',  range: '$250–$500' };
  return { id: 'no-budget', name: 'No Budget', range: '$500+' };
}

function tierIdToAmount(tierId) {
  const map = { 'thrift': 20, 'mid-range': 60, 'premium': 175, 'designer': 370, 'no-budget': 500 };
  return map[tierId] || 60;
}

// Utility: get store by id
function getStore(id) {
  return MOCK_STORES.find(s => s.id === id);
}

// Utility: get random result cards for Chuck
function getResultCards(count = 4) {
  const shuffled = [...MOCK_ITEMS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(item => ({
    ...item,
    store: getStore(item.storeId),
  }));
}
