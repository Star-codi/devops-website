(function () {

  /* ── State ─────────────────────────────────────── */
  const COLORS = {
    main:    '#3fb950',
    develop: '#58a6ff',
    feature: '#bc8cff',
    hotfix:  '#f85149',
    release: '#e3b341',
    other:   '#39c5cf',
  };

  function branchColor(name) {
    if (name === 'main' || name === 'master') return COLORS.main;
    if (name.startsWith('develop'))           return COLORS.develop;
    if (name.startsWith('feature'))           return COLORS.feature;
    if (name.startsWith('hotfix'))            return COLORS.hotfix;
    if (name.startsWith('release'))           return COLORS.release;
    return COLORS.other;
  }

  let commitId = 0;
  function makeId() { return 'c' + (++commitId).toString(16).padStart(7, '0'); }

  // repo state
  let commits   = [];   // { id, msg, parents, branch, x, y }
  let branches  = {};   // { name: commitId (HEAD of branch) }
  let HEAD      = 'main';
  let log       = [];

  function initRepo() {
    commitId = 0;
    commits  = [];
    branches = {};
    HEAD     = 'main';
    log      = [];

    // Initial commit
    const c0 = { id: makeId(), msg: 'Initial commit', parents: [], branch: 'main', x: 0, y: 0 };
    commits.push(c0);
    branches['main'] = c0.id;
    addLog('Initialised empty Git repository', 'ok');
    addLog('Created commit ' + c0.id.slice(0,7) + ' — Initial commit', 'ok');
    render();
  }

  function currentCommit() {
    return commits.find(c => c.id === branches[HEAD]);
  }

  function addLog(msg, type = 'info') {
    log.push({ msg, type });
    if (log.length > 80) log.shift();
    renderLog();
  }

  /* ── Commands ──────────────────────────────────── */
  const COMMANDS = {

    'git branch': (args) => {
      if (!args[0]) {
        // list branches
        const list = Object.keys(branches).map(b => (b === HEAD ? '* ' : '  ') + b).join('\n');
        addLog(list || '(no branches)', 'info');
        return;
      }
      const name = args[0];
      if (branches[name] !== undefined) { addLog("fatal: branch '" + name + "' already exists", 'err'); return; }
      branches[name] = branches[HEAD];
      addLog("Created branch '" + name + "'", 'ok');
      render();
    },

    'git checkout': (args) => {
      if (args[0] === '-b') {
        const name = args[1];
        if (!name) { addLog('usage: git checkout -b <branch>', 'err'); return; }
        if (branches[name] !== undefined) { addLog("fatal: branch '" + name + "' already exists", 'err'); return; }
        branches[name] = branches[HEAD];
        HEAD = name;
        addLog("Switched to a new branch '" + name + "'", 'ok');
        render();
        return;
      }
      const name = args[0];
      if (!name) { addLog('usage: git checkout <branch>', 'err'); return; }
      if (branches[name] === undefined) { addLog("error: pathspec '" + name + "' did not match any branch", 'err'); return; }
      HEAD = name;
      addLog("Switched to branch '" + name + "'", 'ok');
      render();
    },

    'git switch': (args) => {
      if (args[0] === '-c') {
        COMMANDS['git checkout'](['-b', args[1]]);
      } else {
        COMMANDS['git checkout'](args);
      }
    },

    'git commit': (args) => {
      const mIdx = args.indexOf('-m');
      const msg = mIdx >= 0 && args[mIdx + 1]
        ? args.slice(mIdx + 1).join(' ').replace(/^"|"$/g, '').replace(/^'|'$/g, '')
        : 'Update';
      const parent = branches[HEAD];
      const c = { id: makeId(), msg, parents: [parent], branch: HEAD, x: 0, y: 0 };
      commits.push(c);
      branches[HEAD] = c.id;
      addLog('[' + HEAD + ' ' + c.id.slice(0, 7) + '] ' + msg, 'ok');
      render();
    },

    'git merge': (args) => {
      const src = args[0];
      if (!src) { addLog('usage: git merge <branch>', 'err'); return; }
      if (branches[src] === undefined) { addLog("merge: '" + src + "' - not something we can merge", 'err'); return; }
      if (branches[src] === branches[HEAD]) { addLog('Already up to date.', 'info'); return; }

      // Check if fast-forward possible
      const srcHead = branches[src];
      function isAncestor(ancestorId, descendantId) {
        if (ancestorId === descendantId) return true;
        const d = commits.find(c => c.id === descendantId);
        if (!d) return false;
        return d.parents.some(p => isAncestor(ancestorId, p));
      }

      if (isAncestor(branches[HEAD], srcHead)) {
        // Fast-forward
        branches[HEAD] = srcHead;
        addLog("Fast-forward merge of '" + src + "' into '" + HEAD + "'", 'ok');
      } else {
        // Merge commit
        const msg = "Merge branch '" + src + "' into " + HEAD;
        const c = { id: makeId(), msg, parents: [branches[HEAD], srcHead], branch: HEAD, x: 0, y: 0 };
        commits.push(c);
        branches[HEAD] = c.id;
        addLog("Merge made by 'recursive' strategy.", 'ok');
        addLog('[' + HEAD + ' ' + c.id.slice(0, 7) + '] ' + msg, 'ok');
      }
      render();
    },

    'git rebase': (args) => {
      const onto = args[0];
      if (!onto) { addLog('usage: git rebase <branch>', 'err'); return; }
      if (branches[onto] === undefined) { addLog("fatal: no such branch: '" + onto + "'", 'err'); return; }
      // Simplified: move HEAD branch tip to point after onto
      const msg = 'Rebased ' + HEAD + ' onto ' + onto;
      const c = { id: makeId(), msg, parents: [branches[onto]], branch: HEAD, x: 0, y: 0 };
      commits.push(c);
      branches[HEAD] = c.id;
      addLog('Successfully rebased and updated refs/heads/' + HEAD, 'ok');
      render();
    },

    'git log': () => {
      const chain = [];
      let id = branches[HEAD];
      let safety = 0;
      while (id && safety++ < 20) {
        const c = commits.find(x => x.id === id);
        if (!c) break;
        chain.push(c);
        id = c.parents[0];
      }
      chain.forEach(c => {
        addLog('commit ' + c.id + ' (' + c.branch + ')', 'info');
        addLog('    ' + c.msg, 'muted');
      });
    },

    'git status': () => {
      addLog('On branch ' + HEAD, 'info');
      addLog('nothing to commit, working tree clean', 'ok');
    },

    'git reset': (args) => {
      if (args[0] === '--hard' && args[1] === 'HEAD~1') {
        const cur = currentCommit();
        if (!cur || !cur.parents.length) { addLog('Already at root commit', 'err'); return; }
        branches[HEAD] = cur.parents[0];
        commits = commits.filter(c => c.id !== cur.id);
        addLog('HEAD is now at ' + branches[HEAD].slice(0,7), 'warn');
        render();
      } else {
        addLog('Supported: git reset --hard HEAD~1', 'info');
      }
    },

    'git stash': () => { addLog('Saved working directory state (simulated)', 'ok'); },
    'git stash pop': () => { addLog('Applied stash@{0} (simulated)', 'ok'); },
    'git pull': () => { addLog('Already up to date. (simulated — no remote)', 'info'); },
    'git push': () => { addLog("Branch '" + HEAD + "' set up to track origin/" + HEAD + ". (simulated)", 'ok'); },
    'git fetch': () => { addLog('Fetching origin... done. (simulated)', 'ok'); },
    'git diff': () => { addLog('(no unstaged changes in simulation)', 'muted'); },
    'git init': () => { addLog('Reinitialising existing repository...', 'info'); },

    'clear': () => { log = []; renderLog(); },
    'help': () => {
      addLog('Available commands:', 'info');
      addLog('  git branch [-b] <name>    git checkout [-b] <name>', 'muted');
      addLog('  git commit -m "msg"       git merge <branch>', 'muted');
      addLog('  git rebase <branch>       git log', 'muted');
      addLog('  git reset --hard HEAD~1   git status', 'muted');
      addLog('  git push / pull / fetch   clear / help', 'muted');
    },
  };

  function parseAndRun(raw) {
    const parts = raw.trim().split(/\s+/);
    if (parts[0] !== 'git' && parts[0] !== 'clear' && parts[0] !== 'help') {
      addLog("command not found: " + parts[0], 'err'); return;
    }
    let key, args;
    if (parts[0] === 'clear' || parts[0] === 'help') {
      key = parts[0]; args = [];
    } else {
      // try 3-word key first (git stash pop)
      key = parts.slice(0, 3).join(' ');
      if (!COMMANDS[key]) { key = parts.slice(0, 2).join(' '); args = parts.slice(2); }
      else args = parts.slice(3);
    }
    if (!COMMANDS[key]) { addLog("git: '" + parts[1] + "' is not a git command", 'err'); return; }
    COMMANDS[key](args);
  }

  /* ── Layout ────────────────────────────────────── */
  function layoutCommits() {
    // Assign column (x) by topological order, row (y) by branch lane
    const lanes = {};
    let laneCount = 0;

    function getLane(branch) {
      if (lanes[branch] === undefined) lanes[branch] = laneCount++;
      return lanes[branch];
    }

    // Topological sort
    const inDeg = {};
    commits.forEach(c => { inDeg[c.id] = 0; });
    commits.forEach(c => c.parents.forEach(p => { if (inDeg[p] !== undefined) inDeg[p]++; }));

    const queue = commits.filter(c => inDeg[c.id] === 0).map(c => c.id);
    const order = [];
    const visited = new Set();
    while (queue.length) {
      const id = queue.shift();
      if (visited.has(id)) continue;
      visited.add(id);
      order.push(id);
      const c = commits.find(x => x.id === id);
      if (c) {
        commits.forEach(x => {
          if (x.parents.includes(id)) {
            inDeg[x.id]--;
            if (inDeg[x.id] === 0) queue.push(x.id);
          }
        });
      }
    }

    order.forEach((id, col) => {
      const c = commits.find(x => x.id === id);
      if (c) {
        c.x = col;
        c.y = getLane(c.branch);
      }
    });

    return laneCount;
  }

  /* ── Render ────────────────────────────────────── */
  function render() {
    const laneCount = layoutCommits();
    const svg = document.getElementById('git-svg');
    if (!svg) return;

    const CW = 80;   // cell width
    const CH = 60;   // cell height
    const R  = 16;   // commit radius
    const PAD = 40;

    const totalCols = commits.length;
    const w = Math.max(600, PAD * 2 + totalCols * CW);
    const h = Math.max(120, PAD * 2 + laneCount * CH);

    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.setAttribute('width', w);
    svg.setAttribute('height', h);
    svg.innerHTML = '';

    function cx(c) { return PAD + c.x * CW + CW / 2; }
    function cy(c) { return PAD + c.y * CH + CH / 2; }

    // Draw edges
    commits.forEach(c => {
      c.parents.forEach(pid => {
        const p = commits.find(x => x.id === pid);
        if (!p) return;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const x1 = cx(p), y1 = cy(p), x2 = cx(c), y2 = cy(c);
        const midX = (x1 + x2) / 2;
        line.setAttribute('d', `M${x1},${y1} C${midX},${y1} ${midX},${y2} ${x2},${y2}`);
        line.setAttribute('stroke', branchColor(c.branch));
        line.setAttribute('stroke-width', '2');
        line.setAttribute('fill', 'none');
        line.setAttribute('opacity', '0.5');
        svg.appendChild(line);
      });
    });

    // Draw commits
    commits.forEach(c => {
      const x = cx(c), y = cy(c);
      const col = branchColor(c.branch);
      const isBranchHead = Object.values(branches).includes(c.id);
      const isHEAD = branches[HEAD] === c.id;

      // Glow for HEAD
      if (isHEAD) {
        const glow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        glow.setAttribute('cx', x); glow.setAttribute('cy', y);
        glow.setAttribute('r', R + 6);
        glow.setAttribute('fill', col); glow.setAttribute('opacity', '0.15');
        svg.appendChild(glow);
      }

      // Circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x); circle.setAttribute('cy', y);
      circle.setAttribute('r', R);
      circle.setAttribute('fill', isHEAD ? col : '#161b22');
      circle.setAttribute('stroke', col);
      circle.setAttribute('stroke-width', isBranchHead ? '2.5' : '1.5');
      svg.appendChild(circle);

      // Short ID
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x); text.setAttribute('y', y + 4);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-family', 'DM Mono, monospace');
      text.setAttribute('font-size', '9');
      text.setAttribute('fill', isHEAD ? '#000' : col);
      text.setAttribute('font-weight', '600');
      text.textContent = c.id.slice(1, 8);
      svg.appendChild(text);

      // Commit message below
      const msg = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      msg.setAttribute('x', x); msg.setAttribute('y', y + R + 14);
      msg.setAttribute('text-anchor', 'middle');
      msg.setAttribute('font-family', 'DM Mono, monospace');
      msg.setAttribute('font-size', '8');
      msg.setAttribute('fill', '#6e7681');
      msg.textContent = c.msg.length > 14 ? c.msg.slice(0, 13) + '…' : c.msg;
      svg.appendChild(msg);

      // Branch label(s)
      const branchLabels = Object.entries(branches).filter(([, id]) => id === c.id).map(([b]) => b);
      branchLabels.forEach((b, i) => {
        const isHd = b === HEAD;
        const lbl = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        const lblW = Math.max(b.length * 6 + 8, 30);
        const lblX = x - lblW / 2;
        const lblY = y - R - 20 - i * 16;

        lbl.setAttribute('x', lblX); lbl.setAttribute('y', lblY);
        lbl.setAttribute('width', lblW); lbl.setAttribute('height', 14);
        lbl.setAttribute('rx', 3);
        lbl.setAttribute('fill', isHd ? branchColor(b) : 'rgba(0,0,0,0)');
        lbl.setAttribute('stroke', branchColor(b));
        lbl.setAttribute('stroke-width', '1');
        svg.appendChild(lbl);

        textEl.setAttribute('x', x); textEl.setAttribute('y', lblY + 10);
        textEl.setAttribute('text-anchor', 'middle');
        textEl.setAttribute('font-family', 'DM Mono, monospace');
        textEl.setAttribute('font-size', '8');
        textEl.setAttribute('font-weight', '600');
        textEl.setAttribute('fill', isHd ? '#000' : branchColor(b));
        textEl.textContent = (isHd ? 'HEAD→' : '') + b;
        svg.appendChild(textEl);
      });
    });

    // Update branch pills
    renderBranches();
  }

  function renderBranches() {
    const el = document.getElementById('git-branches');
    if (!el) return;
    el.innerHTML = Object.keys(branches).map(b => {
      const isHead = b === HEAD;
      const col = branchColor(b);
      return `<span style="display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:4px;
        background:${isHead ? col : 'transparent'};border:1px solid ${col};
        color:${isHead ? '#000' : col};font-size:10px;font-family:DM Mono,monospace;font-weight:600;cursor:pointer"
        onclick="gitCheckout('${b}')">${isHead ? '● ' : ''}${b}</span>`;
    }).join('');
  }

  function renderLog() {
    const el = document.getElementById('git-log');
    if (!el) return;
    const COLS = { ok:'#3fb950', err:'#f85149', warn:'#e3b341', info:'#58a6ff', muted:'#6e7681' };
    el.innerHTML = log.map(l =>
      `<div style="color:${COLS[l.type]||COLS.info}">${l.msg}</div>`
    ).join('');
    el.scrollTop = el.scrollHeight;
  }

  /* ── Input handling ────────────────────────────── */
  function submitGitCmd() {
    const inp = document.getElementById('git-input');
    if (!inp) return;
    const val = inp.value.trim();
    if (!val) return;
    addLog('$ ' + val, 'muted');
    parseAndRun(val);
    inp.value = '';
  }

  function gitCheckout(branch) {
    addLog('$ git checkout ' + branch, 'muted');
    COMMANDS['git checkout']([branch]);
  }

  function gitLoadScenario(key) {
    initRepo();
    const scenarios = {
      feature: [
        'git commit -m "Add login page"',
        'git commit -m "Style login form"',
        'git checkout -b feature/dark-mode',
        'git commit -m "Add dark mode toggle"',
        'git commit -m "Dark mode styles"',
        'git checkout main',
        'git merge feature/dark-mode',
      ],
      gitflow: [
        'git commit -m "Project setup"',
        'git checkout -b develop',
        'git commit -m "Dev config"',
        'git checkout -b feature/auth',
        'git commit -m "Add auth module"',
        'git commit -m "Add JWT"',
        'git checkout develop',
        'git merge feature/auth',
        'git checkout -b release/1.0',
        'git commit -m "Bump version 1.0"',
        'git checkout main',
        'git merge release/1.0',
      ],
      hotfix: [
        'git commit -m "v1.0 release"',
        'git checkout -b develop',
        'git commit -m "New feature WIP"',
        'git checkout main',
        'git checkout -b hotfix/critical-bug',
        'git commit -m "Fix critical bug"',
        'git checkout main',
        'git merge hotfix/critical-bug',
        'git checkout develop',
        'git merge hotfix/critical-bug',
      ],
    };
    const steps = scenarios[key];
    if (!steps) return;
    steps.forEach((cmd, i) => setTimeout(() => {
      addLog('$ ' + cmd, 'muted');
      parseAndRun(cmd);
    }, i * 180));
  }

  // Expose globals
  window.submitGitCmd   = submitGitCmd;
  window.gitCheckout    = gitCheckout;
  window.gitLoadScenario = gitLoadScenario;
  window.gitInitRepo    = initRepo;

  // Handle Enter key
  const inp = document.getElementById('git-input');
  if (inp) {
    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter') submitGitCmd();
    });
  }

  // Boot
  initRepo();

})();
