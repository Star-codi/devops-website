// ─────────────────────────────────────────────
//  DevOps Zero to Hero — main.js
// ─────────────────────────────────────────────

const MODULE_ORDER = [
  'home',
  'devopslife', 'networking', 'yaml',
  'aws-combined',
  'linux', 'shell',
  'git', 'maven',
  'jenkins', 'github-actions', 'docker', 'kubernetes', 'helm',
  'terraform', 'ansible',
  'monitoring', 'elk', 'nginx',
  'security', 'interview', 'nextsteps'
];

const moduleCache = {};
let currentModule = 'home';

// ── localStorage progress ──────────────────────
const STORAGE_KEY = 'devops_visited';

function getVisited() {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
  } catch { return new Set(); }
}

function markVisited(id) {
  const visited = getVisited();
  visited.add(id);
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...visited])); } catch {}
  updateProgress(visited);
}

function updateProgress(visited) {
  if (!visited) visited = getVisited();
  const content = MODULE_ORDER.filter(m => m !== 'home');
  const done = content.filter(m => visited.has(m)).length;
  const pct = Math.round((done / content.length) * 100);
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-pct').textContent = pct + '%';
}

function resetProgress() {
  if (confirm('Reset your progress? This will clear all visited modules.')) {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    updateProgress(new Set());
    // Update nav completion dots
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('completed'));
  }
}

// ── Module loading ─────────────────────────────
async function loadModule(id) {
  if (moduleCache[id]) return moduleCache[id];
  try {
    const res = await fetch(`modules/${id}.html`);
    if (!res.ok) throw new Error(`Failed to load module: ${id}`);
    const html = await res.text();
    moduleCache[id] = html;
    return html;
  } catch (err) {
    console.error(err);
    return `<p style="color:red;padding:40px">Could not load module "${id}". Check that modules/${id}.html exists.</p>`;
  }
}

function runInjectedScripts(container) {
  container.querySelectorAll('script').forEach(old => {
    const s = document.createElement('script');
    Array.from(old.attributes).forEach(a => s.setAttribute(a.name, a.value));
    if (old.src) {
      s.src = old.src;
      old.remove();
      document.head.appendChild(s);
    } else {
      s.textContent = old.textContent;
      old.parentNode.replaceChild(s, old);
    }
  });
}

async function showModule(id) {
  let section = document.getElementById('mod-' + id);

  if (!section) {
    section = document.createElement('section');
    section.className = 'module';
    section.id = 'mod-' + id;
    document.getElementById('main').appendChild(section);
  }

  if (!section.dataset.loaded) {
    section.innerHTML = '<p style="padding:40px;color:var(--muted)">Loading...</p>';
    const html = await loadModule(id);
    section.innerHTML = html;
    runInjectedScripts(section);
    section.dataset.loaded = 'true';
  }

  document.querySelectorAll('.module').forEach(m => m.classList.remove('visible'));
  section.classList.add('visible');
  currentModule = id;

  // Update nav active state
  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.remove('active');
    if ((n.getAttribute('onclick') || '').includes(`'${id}'`)) {
      n.classList.add('active');
    }
  });

  // Track progress (skip home)
  if (id !== 'home') {
    markVisited(id);
    // Add completion dot to nav item
    document.querySelectorAll('.nav-item').forEach(n => {
      if ((n.getAttribute('onclick') || '').includes(`'${id}'`)) {
        n.classList.add('completed');
      }
    });
  } else {
    updateProgress();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (window.innerWidth <= 768) {
    document.getElementById('sidebar').classList.remove('open');
  }

  history.pushState({ module: id }, '', `#${id}`);
}

// ── Sidebar toggle ─────────────────────────────
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ── Search / Filter ────────────────────────────
function filterNav(query) {
  const q = query.toLowerCase().trim();
  const nav = document.getElementById('sidebar-nav');
  const empty = document.getElementById('search-empty');
  const items = nav.querySelectorAll('.nav-item');
  const labels = nav.querySelectorAll('.nav-section-label');
  let anyVisible = false;

  if (!q) {
    items.forEach(el => el.style.display = '');
    labels.forEach(el => el.style.display = '');
    empty.style.display = 'none';
    return;
  }

  // Hide all section labels first
  labels.forEach(el => el.style.display = 'none');

  items.forEach(el => {
    const text = (el.textContent + ' ' + (el.dataset.search || '')).toLowerCase();
    const match = text.includes(q);
    el.style.display = match ? '' : 'none';
    if (match) anyVisible = true;
  });

  empty.style.display = anyVisible ? 'none' : 'block';
}

// ── Init ───────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  // Restore visited markers on nav
  const visited = getVisited();
  document.querySelectorAll('.nav-item').forEach(n => {
    const onclick = n.getAttribute('onclick') || '';
    const m = onclick.match(/'([^']+)'/);
    if (m && visited.has(m[1])) {
      n.classList.add('completed');
    }
  });

  // Load initial module from URL hash or default home
  const hash = location.hash.replace('#', '');
  const startModule = (hash && MODULE_ORDER.includes(hash)) ? hash : 'home';
  showModule(startModule);
});

window.addEventListener('popstate', e => {
  if (e.state && e.state.module) showModule(e.state.module);
});
