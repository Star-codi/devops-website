// ─────────────────────────────────────────────
//  DevOps Buddy — main.js
// ─────────────────────────────────────────────

const MODULE_ORDER = [
  'home',

  // Module 0 — Before You Begin
  'devopslife', 'networking', 'yaml',

  // Module 1 — Linux & Scripting
  'linux', 'shell',

  // Module 2 — Code & Version Control
  'git', 'maven',

  // Module 3 — Cloud Foundation
  'cloud', 'aws-fundamentals', 'aws-deepdive',

  // Module 4 — Containers & Orchestration
  'docker', 'kubernetes', 'eks', 'helm',

  // Module 5 — CI/CD & GitOps
  'jenkins', 'github-actions', 'argocd',

  // Module 6 — IaC & Config Management
  'terraform', 'ansible',

  // Module 7 — Networking & Observability
  'vpc', 'nginx', 'elk', 'monitoring',

  // Module 8 — Security
  'sonarqube', 'owasp', 'security',

  // Module 9 — Career
  'interview', 'nextsteps'
];

const moduleCache = {};
let currentModule = 'home';

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
    return `<p style="color:red;padding:40px">Could not load module "${id}".</p>`;
  }
}

/**
 * Re-execute scripts injected via innerHTML.
 * For inline scripts: clone and replace.
 * For external scripts (src=): create new script tag and append —
 * this triggers the browser to fetch and execute the file.
 */
function runInjectedScripts(container) {
  container.querySelectorAll('script').forEach(old => {
    const s = document.createElement('script');
    Array.from(old.attributes).forEach(a => s.setAttribute(a.name, a.value));
    if (old.src) {
      // External script — append to head so it loads fresh
      s.src = old.src;
      old.remove();
      document.head.appendChild(s);
    } else {
      // Inline script — replace in place
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

  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.remove('active');
    if ((n.getAttribute('onclick') || '').includes(`'${id}'`)) {
      n.classList.add('active');
    }
  });

  const idx = MODULE_ORDER.indexOf(id);
  const pct = idx <= 0 ? 0 : Math.round((idx / (MODULE_ORDER.length - 1)) * 100);
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-pct').textContent = pct + '%';

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (window.innerWidth <= 768) {
    document.getElementById('sidebar').classList.remove('open');
  }

  history.pushState({ module: id }, '', `#${id}`);
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

window.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash.replace('#', '') || 'home';
  showModule(hash);
});

window.addEventListener('popstate', (e) => {
  showModule(e.state?.module || 'home');
});
