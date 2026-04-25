// ─────────────────────────────────────────────
//  DevOps Buddy — main.js
//  Handles navigation, module loading, progress
// ─────────────────────────────────────────────

const MODULE_ORDER = [
  'home',
  'devopslife', 'networking', 'yaml',
  'cloud', 'aws-fundamentals', 'aws-deepdive',
  'linux', 'shell',
  'git', 'maven',
  'jenkins', 'docker', 'kubernetes',
  'terraform', 'ansible',
  'monitoring', 'vpc',
  'security', 'interview', 'nextsteps'
];

// Cache loaded modules so we don't re-fetch them
const moduleCache = {};

// Track current module
let currentModule = 'home';

/**
 * Load a module's HTML from /modules/{id}.html
 * Uses cache after first load
 */
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
    return `<p style="color:var(--accent2)">Could not load module "${id}". Check the file exists in /modules/.</p>`;
  }
}

/**
 * Re-execute <script> tags injected via innerHTML.
 * Browsers silently ignore scripts set via innerHTML — this fixes that.
 */
function runInjectedScripts(container) {
  container.querySelectorAll('script').forEach(oldScript => {
    const newScript = document.createElement('script');
    Array.from(oldScript.attributes).forEach(attr =>
      newScript.setAttribute(attr.name, attr.value)
    );
    newScript.textContent = oldScript.textContent;
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });
}

/**
 * Show a module by ID
 * Fetches HTML from /modules/{id}.html and injects into the main container
 */
async function showModule(id) {
  let section = document.getElementById('mod-' + id);

  if (!section) {
    section = document.createElement('section');
    section.className = 'module';
    section.id = 'mod-' + id;
    document.getElementById('main').appendChild(section);
  }

  // Load content if not already loaded
  if (!section.dataset.loaded) {
    section.innerHTML = '<p style="padding:40px;color:var(--muted)">Loading...</p>';
    const html = await loadModule(id);
    section.innerHTML = html;

    // Re-run any scripts that were injected (innerHTML drops them silently)
    runInjectedScripts(section);

    section.dataset.loaded = 'true';
  }

  // Hide all modules
  document.querySelectorAll('.module').forEach(m => m.classList.remove('visible'));

  // Show this one
  section.classList.add('visible');
  currentModule = id;

  // Update nav active state
  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.remove('active');
    const onclick = n.getAttribute('onclick') || '';
    if (onclick.includes(`'${id}'`)) {
      n.classList.add('active');
    }
  });

  // Update progress bar
  const idx = MODULE_ORDER.indexOf(id);
  const pct = idx <= 0 ? 0 : Math.round((idx / (MODULE_ORDER.length - 1)) * 100);
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-pct').textContent = pct + '%';

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Close sidebar on mobile
  if (window.innerWidth <= 768) {
    document.getElementById('sidebar').classList.remove('open');
  }

  // Update URL hash so browser back button works
  history.pushState({ module: id }, '', `#${id}`);
}

/**
 * Toggle sidebar on mobile
 */
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ─── Init ───────────────────────────────────────

window.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash.replace('#', '') || 'home';
  showModule(hash);
});

window.addEventListener('popstate', (e) => {
  const id = e.state?.module || 'home';
  showModule(id);
});
