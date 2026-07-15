// ============ LOOKIN — Onboarding Logic ============

// ---- Data ----
const VIBES = [
  {
    id: 'old-money',
    name: 'Old Money',
    emoji: '⚓',
    desc: 'Quiet luxury, coastal prep',
    gradient: 'linear-gradient(145deg, #c9a96e 0%, #8b6520 40%, #4a3010 100%)',
  },
  {
    id: 'streetwear',
    name: 'Streetwear',
    emoji: '🔥',
    desc: 'Heat, hype, and drip',
    gradient: 'linear-gradient(145deg, #0f0c29 0%, #1a1042 50%, #24243e 100%)',
  },
  {
    id: 'vintage',
    name: 'Vintage',
    emoji: '📼',
    desc: 'Archive pieces, lived-in fits',
    gradient: 'linear-gradient(145deg, #7a5c38 0%, #4a3420 50%, #2c1e10 100%)',
  },
  {
    id: 'california',
    name: 'California',
    emoji: '🌴',
    desc: 'Effortless West Coast cool',
    gradient: 'linear-gradient(145deg, #c84b00 0%, #9b1fa8 100%)',
  },
  {
    id: 'avant-garde',
    name: 'Avant-Garde',
    emoji: '🎨',
    desc: 'Fashion-forward, no rules',
    gradient: 'linear-gradient(145deg, #06000e 0%, #250870 55%, #7c3aed 100%)',
  },
  {
    id: 'gorpcore',
    name: 'Gorpcore',
    emoji: '🏔️',
    desc: 'Technical gear as fashion',
    gradient: 'linear-gradient(145deg, #0a140e 0%, #142418 50%, #1e3820 100%)',
  },
  {
    id: 'y2k',
    name: 'Y2K',
    emoji: '💿',
    desc: 'Early 2000s revival',
    gradient: 'linear-gradient(145deg, #1c082e 0%, #3d1060 50%, #8820c0 100%)',
  },
  {
    id: 'dark-academia',
    name: 'Dark Academia',
    emoji: '📚',
    desc: 'Scholarly, moody, layered',
    gradient: 'linear-gradient(145deg, #12080a 0%, #221418 50%, #3d2028 100%)',
  },
  {
    id: 'coastal-grandma',
    name: 'Coastal Grandma',
    emoji: '☀️',
    desc: 'Linen, relaxed, elegant',
    gradient: 'linear-gradient(145deg, #0d1820 0%, #153040 50%, #1c4458 100%)',
  },
  {
    id: 'workwear',
    name: 'Workwear',
    emoji: '💼',
    desc: 'Elevated office style',
    gradient: 'linear-gradient(145deg, #080c1a 0%, #101830 50%, #182240 100%)',
  },
  {
    id: 'grunge',
    name: 'Grunge',
    emoji: '🎸',
    desc: '90s inspired, distressed',
    gradient: 'linear-gradient(145deg, #1a0a08 0%, #321412 50%, #4a1e1a 100%)',
  },
  {
    id: 'preppy',
    name: 'Preppy',
    emoji: '🎾',
    desc: 'Clean, collegiate',
    gradient: 'linear-gradient(145deg, #060e24 0%, #0e1a42 50%, #162660 100%)',
  },
  {
    id: 'bohemian',
    name: 'Bohemian',
    emoji: '🌻',
    desc: 'Flowy, earthy, eclectic',
    gradient: 'linear-gradient(145deg, #1a1205 0%, #3d2a0a 50%, #5c4015 100%)',
  },
];

const CELEBS = [
  { id: 'frank-ocean',   name: 'Frank Ocean',         emoji: '🌊', style: 'Vintage · Artsy',           gradient: 'linear-gradient(145deg, #0a1828 0%, #0d3255 100%)' },
  { id: 'asap-rocky',    name: 'A$AP Rocky',           emoji: '🔱', style: 'Street · High Fashion',     gradient: 'linear-gradient(145deg, #1a0808 0%, #3d1010 100%)' },
  { id: 'playboi-carti', name: 'Playboi Carti',        emoji: '🦇', style: 'Avant-Garde · Punk',        gradient: 'linear-gradient(145deg, #0a0a0a 0%, #1c0a1c 100%)' },
  { id: 'jacob-elordi',  name: 'Jacob Elordi',         emoji: '☕', style: 'Old Money · Minimal',       gradient: 'linear-gradient(145deg, #1e1a10 0%, #3d3520 100%)' },
  { id: 'tyler',         name: 'Tyler, the Creator',   emoji: '🌿', style: 'Preppy · Eclectic',         gradient: 'linear-gradient(145deg, #0f1a0a 0%, #243d12 100%)' },
  { id: 'timothee',      name: 'Timothée Chalamet',    emoji: '🎬', style: 'Avant-Garde · Luxury',      gradient: 'linear-gradient(145deg, #0a0a18 0%, #18183a 100%)' },
  { id: 'zendaya',       name: 'Zendaya',              emoji: '✨', style: 'Glamour · Streetwear',      gradient: 'linear-gradient(145deg, #1a0a12 0%, #3d1030 100%)' },
  { id: 'kendall',       name: 'Kendall Jenner',       emoji: '🤍', style: 'Model Off-Duty · Minimal',  gradient: 'linear-gradient(145deg, #1a1510 0%, #2d2518 100%)' },
  { id: 'bad-bunny',     name: 'Bad Bunny',            emoji: '🐰', style: 'Streetwear · Maximalist',   gradient: 'linear-gradient(145deg, #0a1020 0%, #1a2040 100%)' },
  { id: 'hailey-bieber', name: 'Hailey Bieber',        emoji: '🌸', style: 'Model Off-Duty · Clean',    gradient: 'linear-gradient(145deg, #1a1008 0%, #3d2c18 100%)' },
  { id: 'pharrell',      name: 'Pharrell Williams',    emoji: '🎧', style: 'Streetwear · Artsy',        gradient: 'linear-gradient(145deg, #0a1428 0%, #1428a0 100%)' },
  { id: 'harry-styles',  name: 'Harry Styles',         emoji: '🌈', style: 'Maximalist · Vintage',      gradient: 'linear-gradient(145deg, #1a0818 0%, #3d1040 100%)' },
  { id: 'rihanna',       name: 'Rihanna',              emoji: '💎', style: 'Bold · High Fashion',       gradient: 'linear-gradient(145deg, #1a0808 0%, #4d1010 100%)' },
  { id: 'kanye',         name: 'Kanye West',           emoji: '🎤', style: 'Minimalist · Avant-Garde',  gradient: 'linear-gradient(145deg, #080808 0%, #1c1c1c 100%)' },
  { id: 'sydney',        name: 'Sydney Sweeney',       emoji: '🌻', style: 'California · Vintage',      gradient: 'linear-gradient(145deg, #201808 0%, #3d2c10 100%)' },
  { id: 'sabrina',       name: 'Sabrina Carpenter',    emoji: '🍒', style: 'Y2K · Feminine',            gradient: 'linear-gradient(145deg, #1a0818 0%, #3d1a30 100%)' },
  { id: 'travis-scott',  name: 'Travis Scott',         emoji: '🌵', style: 'Streetwear · Dark',         gradient: 'linear-gradient(145deg, #0a0818 0%, #1a1040 100%)' },
  { id: 'billie-eilish', name: 'Billie Eilish',        emoji: '🖤', style: 'Grunge · Oversized',        gradient: 'linear-gradient(145deg, #080e08 0%, #0a2010 100%)' },
  { id: 'dev-patel',     name: 'Dev Patel',            emoji: '🎭', style: 'Bohemian · Tailored',       gradient: 'linear-gradient(145deg, #180c04 0%, #3d2010 100%)' },
];

const BUDGETS = [
  { id: 'under-50',  label: 'Under $50',     desc: 'Thrift & fast fashion finds' },
  { id: '50-150',    label: '$50 – $150',    desc: 'Mid-range staples' },
  { id: '150-300',   label: '$150 – $300',   desc: 'Premium pieces' },
  { id: '300-500',   label: '$300 – $500',   desc: 'High-end & designer' },
  { id: 'no-limit',  label: 'No limit',      desc: 'Only the best' },
];

// ---- State ----
let currentStep = 1;
const QUIZ_STEPS = 3; // steps 2, 3, 4
let selectedVibes  = new Set();
let selectedCelebs = new Set();
let selectedBudget = null;

// ---- DOM ----
const topbar       = document.getElementById('ob-topbar');
const progressFill = document.getElementById('ob-progress-fill');
const stepCount    = document.getElementById('ob-step-count');
const backBtn      = document.getElementById('ob-back');
const startBtn     = document.getElementById('start-btn');
const step2Next    = document.getElementById('step2-next');
const step3Next    = document.getElementById('step3-next');
const step4Next    = document.getElementById('step4-next');
const finishBtn    = document.getElementById('finish-btn');

// ---- Helpers ----
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

// ---- Build UI ----
function buildVibeGrid() {
  const grid = document.getElementById('vibe-grid');
  VIBES.forEach(v => {
    const card = document.createElement('div');
    card.className = 'vibe-card';
    card.dataset.id = v.id;
    card.innerHTML = `
      <div class="vibe-card-bg" style="background:${v.gradient};"></div>
      <div class="vibe-card-content">
        <div class="vibe-card-name">${v.name}</div>
        <div class="vibe-card-desc">${v.desc}</div>
      </div>
      <div class="vibe-card-check">✓</div>
    `;
    card.addEventListener('click', () => toggleVibe(v.id, card));
    grid.appendChild(card);
  });
}

function buildCelebGrid() {
  const grid = document.getElementById('celeb-grid');
  CELEBS.forEach(c => {
    const card = document.createElement('div');
    card.className = 'celeb-card';
    card.dataset.id = c.id;
    card.innerHTML = `
      <div class="celeb-card-thumb">
        <div class="celeb-card-bg" style="background:${c.gradient}; width:100%; height:100%;"></div>
        <div class="celeb-initials">${getCelebInitials(c.name)}</div>
        <div class="celeb-card-check">✓</div>
      </div>
      <div class="celeb-card-name">${c.name}</div>
      <div class="celeb-card-style">${c.style}</div>
    `;
    card.addEventListener('click', () => toggleCeleb(c.id, card));
    grid.appendChild(card);
  });
}

function buildBudgetList() {
  const list = document.getElementById('budget-list');
  BUDGETS.forEach(b => {
    const opt = document.createElement('div');
    opt.className = 'budget-option';
    opt.dataset.id = b.id;
    opt.innerHTML = `
      <div class="budget-option-left">
        <div class="budget-option-label">${b.label}</div>
        <div class="budget-option-desc">${b.desc}</div>
      </div>
      <div class="budget-option-radio">
        <div class="budget-option-radio-dot"></div>
      </div>
    `;
    opt.addEventListener('click', () => selectBudget(b.id, opt));
    list.appendChild(opt);
  });
}

// ---- Interactions ----
function toggleVibe(id, card) {
  if (selectedVibes.has(id)) {
    selectedVibes.delete(id);
    card.classList.remove('selected');
  } else {
    selectedVibes.add(id);
    card.classList.add('selected');
  }
  step2Next.disabled = selectedVibes.size === 0;
}

function toggleCeleb(id, card) {
  if (selectedCelebs.has(id)) {
    selectedCelebs.delete(id);
    card.classList.remove('selected');
  } else {
    if (selectedCelebs.size >= 3) {
      // Deselect the earliest selected
      const first = [...selectedCelebs][0];
      selectedCelebs.delete(first);
      document.querySelector(`.celeb-card[data-id="${first}"]`).classList.remove('selected');
    }
    selectedCelebs.add(id);
    card.classList.add('selected');
  }
  step3Next.disabled = selectedCelebs.size === 0;
}

function selectBudget(id, opt) {
  document.querySelectorAll('.budget-option').forEach(o => o.classList.remove('selected'));
  opt.classList.add('selected');
  selectedBudget = id;
  step4Next.disabled = false;
}

// ---- Step Transitions ----
function goToStep(next) {
  const from = document.getElementById(`ob-step-${currentStep}`);
  const to   = document.getElementById(`ob-step-${next}`);

  // Position incoming step fully off-screen right with no transition
  to.style.transition = 'none';
  to.style.transform  = 'translateX(100%)';
  to.style.opacity    = '1';
  to.classList.add('active');

  to.offsetHeight; // force reflow

  const dur = '0.25s ease';
  from.style.transition = `transform ${dur}, opacity 0.2s ease`;
  to.style.transition   = `transform ${dur}, opacity 0.2s ease`;

  from.style.transform = 'translateX(-100%)'; // fully off-screen — no overlap
  from.style.opacity   = '0';
  to.style.transform   = 'translateX(0)';

  setTimeout(() => {
    from.classList.remove('active');
    from.style.cssText = '';
    to.style.transition = '';
    currentStep = next;
    updateTopbar();
  }, 260);
}

function goBack() {
  if (currentStep <= 1) return;
  const from = document.getElementById(`ob-step-${currentStep}`);
  const to   = document.getElementById(`ob-step-${currentStep - 1}`);

  // Position returning step fully off-screen left with no transition
  to.style.transition = 'none';
  to.style.transform  = 'translateX(-100%)';
  to.style.opacity    = '1';
  to.classList.add('active');

  to.offsetHeight; // force reflow

  const dur = '0.25s ease';
  from.style.transition = `transform ${dur}, opacity 0.2s ease`;
  to.style.transition   = `transform ${dur}, opacity 0.2s ease`;

  from.style.transform = 'translateX(100%)';
  from.style.opacity   = '0';
  to.style.transform   = 'translateX(0)';
  to.style.opacity     = '1';

  setTimeout(() => {
    from.classList.remove('active');
    from.style.cssText = '';
    to.style.transition = '';
    currentStep = currentStep - 1;
    updateTopbar();
  }, 260);
}

// ---- Progress Bar ----
function updateTopbar() {
  const isEdge = currentStep === 1 || currentStep === 5;
  topbar.classList.toggle('hidden', isEdge);

  if (!isEdge) {
    // Map step 2→3→4 to 1/3 → 2/3 → 3/3
    const quizStep = currentStep - 1; // 1, 2, 3
    const pct = (quizStep / QUIZ_STEPS) * 100;
    progressFill.style.width = `${pct}%`;
    stepCount.textContent = `${quizStep} / ${QUIZ_STEPS}`;
  }
}

// ---- Done Screen ----
function showDoneScreen() {
  // Build vibe chips
  const container = document.getElementById('done-vibes');
  container.innerHTML = '';
  selectedVibes.forEach(id => {
    const vibe = VIBES.find(v => v.id === id);
    if (!vibe) return;
    const chip = document.createElement('div');
    chip.className = 'done-vibe-chip';
    chip.textContent = vibe.name;
    container.appendChild(chip);
  });
}

// ---- Save & Finish ----
function saveProfile() {
  const profile = {
    vibes:  [...selectedVibes],
    inspo:  [...selectedCelebs],
    budget: selectedBudget,
  };
  localStorage.setItem('lookin_profile', JSON.stringify(profile));
  localStorage.setItem('lookin_onboarded', 'true');
}

// ---- Event Listeners ----
startBtn.addEventListener('click', () => goToStep(2));
backBtn.addEventListener('click', goBack);

step2Next.addEventListener('click', () => goToStep(3));

step3Next.addEventListener('click', () => goToStep(4));

step4Next.addEventListener('click', () => {
  saveProfile();
  showDoneScreen();
  goToStep(5);
});

finishBtn.addEventListener('click', () => {
  window.location.href = 'index.html';
});

// ---- Init ----
buildVibeGrid();
buildCelebGrid();
buildBudgetList();
