/* ============================================================
   PIKO AI — interactive IDE demo
   No dependencies, no network calls: everything runs in the page.
   ============================================================ */
(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  /* ----------------------------------------------------------- content */
  const FILES = {
    'src/App.tsx': {
      lang: 'ts', tag: 'TS', type: 'TypeScript React', name: 'App.tsx',
      code: `import { useEffect } from 'react'
import { ActivityBar } from './components/ActivityBar'
import { AiPanel } from './components/AiPanel'
import { Editor } from './components/Editor'
import { Terminal } from './components/Terminal'
import { useAppStore } from './store/useAppStore'

export function App() {
  const ready = useAppStore((s) => s.ready)
  const workspace = useAppStore((s) => s.workspace)
  const rightVisible = useAppStore((s) => s.rightVisible)

  // the agent reads the indexed project before it edits
  useEffect(() => {
    if (!workspace.root) return
    void initialize()
  }, [workspace.root])

  if (!ready) return <Boot />

  return (
    <div className="app-shell">
      <ActivityBar />
      <Editor />
      <Terminal />
      {rightVisible && <AiPanel />}
    </div>
  )
}`,
    },
    'src/agent.ts': {
      lang: 'ts', tag: 'TS', type: 'TypeScript', name: 'agent.ts',
      code: `import type { AgentMode, ToolCall } from '../shared/types'

const MODES: Record<AgentMode, { tools: string[]; approvals: boolean }> = {
  ask: { tools: ['read_file', 'search_files'], approvals: false },
  plan: { tools: ['read_file', 'read_url'], approvals: false },
  code: { tools: ['read_file', 'edit_file', 'run_command'], approvals: true },
  agent: { tools: ['*'], approvals: true },
}

export async function runTask(prompt: string, mode: AgentMode) {
  const profile = MODES[mode]
  const tools = await loadTools(profile.tools)

  for (let step = 0; step < MAX_STEPS; step++) {
    const decision = await model.decide({ prompt, tools, memory })

    if (decision.kind === 'final') {
      return { status: 'completed', text: decision.text }
    }

    const call: ToolCall = decision.call
    if (profile.approvals && needsApproval(call)) {
      await approvals.request(call)
    }

    const result = await execute(call)
    memory.remember(call, result)
  }

  return { status: 'stopped', reason: 'step limit reached' }
}`,
    },
    'src/styles.css': {
      lang: 'css', tag: '#', type: 'CSS', name: 'styles.css',
      code: `:root {
  --bg: #08040f;
  --panel: rgba(14, 8, 30, 0.78);
  --line: rgba(139, 92, 246, 0.16);
  --text: #f3f0ff;
  --text-dim: #b3accb;
  --accent: #a78bfa;
}

.app-shell {
  height: 100%;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(900px 420px at 50% -10%, rgba(109, 40, 217, 0.28), transparent 70%),
    var(--bg);
}

.ai-panel {
  width: 320px;
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--line);
  background: var(--panel);
}`,
    },
    'package.json': {
      lang: 'json', tag: '{}', type: 'JSON', name: 'package.json',
      code: `{
  "name": "piko-ai",
  "version": "1.5.3",
  "private": true,
  "main": "dist-electron/main.js",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "start": "electron ."
  },
  "dependencies": {
    "monaco-editor": "^0.52.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "electron": "^33.0.0",
    "typescript": "^5.6.0",
    "vite": "^5.4.0"
  }
}`,
    },
    'README.md': {
      lang: 'md', tag: 'M', type: 'Markdown', name: 'README.md',
      code: `# PIKO AI

A free, local-first AI development environment for Windows 10 and 11.

## Modes

| Mode  | What it does                                |
| ----- | ------------------------------------------- |
| ASK   | Read-only answers and explanations          |
| PLAN  | Read-only research and implementation plans |
| CODE  | Edits files and runs tools with approvals   |
| AGENT | Full autonomous loop with approvals         |

## Commands

/learn <topic>        index the project and study it
/global-learn <topic> research trusted public sources
/security             defensive static checks
/fix <issue>          reproduce, patch, verify

No subscription, no account, no telemetry.`,
    },
  };

  const TREE = [
    {
      name: 'src', dir: true, key: 'src',
      children: [
        { name: 'components', dir: true, key: 'components', children: [{ name: 'AiPanel.tsx', path: 'src/App.tsx' }] },
        { name: 'App.tsx', path: 'src/App.tsx' },
        { name: 'agent.ts', path: 'src/agent.ts' },
        { name: 'styles.css', path: 'src/styles.css' },
      ],
    },
    { name: 'public', dir: true, key: 'public', children: [{ name: 'logo.svg', path: null }] },
    { name: 'package.json', path: 'package.json' },
    { name: 'README.md', path: 'README.md' },
  ];

  const state = { tabs: [], active: null, view: 'explorer', expanded: new Set(['project', 'src']) };

  /* ------------------------------------------------------- highlight */
  const TOKEN_RE =
    /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|([A-Za-z_$][\w$]*)(?=\s*\()|\b(const|let|var|function|return|await|async|import|from|export|default|if|else|for|of|in|new|class|extends|interface|type|true|false|null|undefined|this|switch|case|break|continue|throw|try|catch|while|do|typeof|as|readonly|private|public|static|void)\b|\b(\d+(?:\.\d+)?)\b|\b([A-Z][A-Za-z0-9_]*)\b/g;

  function highlight(line, lang) {
    if (lang === 'json') {
      return esc(line)
        .replace(/("(?:\\.|[^"\\])*")(\s*:)/g, '<span class="tp">$1</span>$2')
        .replace(/:\s*("(?:\\.|[^"\\])*")/g, ': <span class="s">$1</span>')
        .replace(/\b(true|false|null)\b/g, '<span class="k">$1</span>');
    }
    if (lang === 'css') {
      return esc(line)
        .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="c">$1</span>')
        .replace(/(--[\w-]+)/g, '<span class="f">$1</span>')
        .replace(/(#[0-9a-fA-F]{3,8})/g, '<span class="n">$1</span>')
        .replace(/\b(\d+(?:\.\d+)?(?:px|rem|em|s|ms|%|vh|vw)?)\b/g, '<span class="n">$1</span>');
    }
    if (lang === 'md') {
      return esc(line)
        .replace(/^(#{1,6}\s.*)$/g, '<span class="tp">$1</span>')
        .replace(/(\/[\w-]+)/g, '<span class="f">$1</span>');
    }
    let out = '';
    let last = 0;
    let m;
    TOKEN_RE.lastIndex = 0;
    while ((m = TOKEN_RE.exec(line))) {
      out += esc(line.slice(last, m.index));
      const [raw, comment, str, fn, keyword, num, type] = m;
      if (comment) out += '<span class="c">' + esc(raw) + '</span>';
      else if (str) out += '<span class="s">' + esc(raw) + '</span>';
      else if (fn) out += '<span class="f">' + esc(raw) + '</span>';
      else if (keyword) out += '<span class="k">' + esc(raw) + '</span>';
      else if (num) out += '<span class="n">' + esc(raw) + '</span>';
      else if (type) out += '<span class="tp">' + esc(raw) + '</span>';
      else out += esc(raw);
      last = m.index + raw.length;
    }
    return out + esc(line.slice(last));
  }

  /* ----------------------------------------------------------- editor */
  const tabsHost = $('#tabs');
  const editor = $('#editor');

  function renderTabs() {
    tabsHost.innerHTML = state.tabs
      .map((path) => {
        const f = FILES[path];
        return (
          '<button class="tab' + (path === state.active ? ' active' : '') + '" type="button" data-path="' + path + '">' +
          '<span class="tag ' + (f.lang === 'css' ? 't-css' : f.lang === 'json' ? 't-json' : f.lang === 'md' ? 't-md' : 't-ts') + '">' + f.tag + '</span>' +
          '<span>' + esc(f.name) + '</span>' +
          '<span class="x" data-close="' + path + '" title="Close"><svg class="i s11"><use href="#d-x"/></svg></span>' +
          '</button>'
        );
      })
      .join('');
  }

  function openFile(path) {
    if (!FILES[path]) {
      const term = $('#term');
      term.insertAdjacentHTML('beforeend', '<div class="term-line dim">logo.svg is an image asset — the desktop app previews it instead.</div>');
      return;
    }
    if (!state.tabs.includes(path)) state.tabs.push(path);
    state.active = path;
    renderTabs();
    renderEditor();
    renderSide();
  }

  function closeFile(path) {
    const i = state.tabs.indexOf(path);
    if (i < 0) return;
    state.tabs.splice(i, 1);
    if (state.active === path) state.active = state.tabs[i] || state.tabs[i - 1] || null;
    renderTabs();
    renderEditor();
  }

  function renderEditor() {
    const path = state.active;
    if (!path) {
      editor.innerHTML =
        '<div class="empty"><svg class="i"><use href="#d-code"/></svg>' +
        '<div>No file open — pick one in the Explorer</div>' +
        '<div class="dim">Ctrl+Shift+P for commands</div></div>';
      return;
    }
    const f = FILES[path];
    const parts = path.split('/');
    const lines = f.code.split('\n')
      .map((line, i) => {
        const n = i + 1;
        return '<div class="line' + (n === 2 ? ' active' : '') + '"><span class="ln">' + n + '</span><span class="lc">' +
          (highlight(line, f.lang) || ' ') + '</span></div>';
      })
      .join('');

    editor.innerHTML =
      '<div class="crumbs">' + parts.map((part, i) =>
        (i ? '<svg class="i"><use href="#d-chevron"/></svg>' : '') +
        '<span>' + esc(part) + '</span>'
      ).join('') +
      '<span class="right"><span>' + esc(f.type) + '</span><span>UTF-8</span><span>LF</span></span></div>' +
      '<pre class="code">' + lines + '</pre>';
  }

  tabsHost.addEventListener('click', (event) => {
    const close = event.target.closest('[data-close]');
    if (close) { event.stopPropagation(); closeFile(close.getAttribute('data-close')); return; }
    const tab = event.target.closest('[data-path]');
    if (tab) openFile(tab.getAttribute('data-path'));
  });

  /* ---------------------------------------------------------- sidebar */
  const sideBody = $('#side-body');
  const sideTitle = $('#side-title');

  function treeRows(nodes, depth) {
    return nodes.map((node) => {
      const pad = 'padding-left:' + (6 + depth * 11) + 'px';
      if (node.dir) {
        const open = state.expanded.has(node.key);
        return '<div class="row" data-dir="' + node.key + '" style="' + pad + '">' +
          '<svg class="i chev"><use href="#' + (open ? 'd-chevron-down' : 'd-chevron') + '"/></svg>' +
          '<svg class="i"><use href="#d-folder"/></svg>' +
          '<span>' + esc(node.name) + '</span></div>' +
          (open ? treeRows(node.children || [], depth + 1) : '');
      }
      const f = node.path ? FILES[node.path] : null;
      const tag = f ? f.tag : 'S';
      const cls = !f ? 't-md' : f.lang === 'css' ? 't-css' : f.lang === 'json' ? 't-json' : f.lang === 'md' ? 't-md' : 't-ts';
      return '<div class="row' + (node.path === state.active ? ' active' : '') + '" data-file="' + (node.path || '') + '" data-name="' + esc(node.name) + '" style="' + pad + '">' +
        '<span style="width:9px"></span><span class="tag ' + cls + '">' + esc(tag) + '</span>' +
        '<span>' + esc(node.name) + '</span></div>';
    }).join('');
  }

  function renderExplorer() {
    const open = state.expanded.has('project');
    sideBody.innerHTML =
      '<div class="project" data-project="project">' +
      '<svg class="i chev"><use href="#' + (open ? 'd-chevron-down' : 'd-chevron') + '"/></svg>US-SMOKE-PROJECT</div>' +
      (open ? treeRows(TREE, 0) : '');
  }

  function renderSearch() {
    sideBody.innerHTML =
      '<div class="side-search"><svg class="i"><use href="#d-search"/></svg><input id="q" placeholder="Search" /></div>' +
      '<div id="hits"></div>';
    const q = $('#q');
    const hits = [
      { file: 'src/App.tsx', line: 6, text: 'import { useAppStore }' },
      { file: 'src/agent.ts', line: 14, text: 'const tools = await loadTools(profile.tools)' },
      { file: 'README.md', line: 12, text: 'Full autonomous loop with approvals' },
    ];
    const draw = () => {
      const v = q.value.trim().toLowerCase();
      $('#hits').innerHTML = hits
        .filter((h) => !v || h.text.toLowerCase().includes(v))
        .map((h) => '<div class="hit" data-open="' + h.file + '">' + esc(h.file.split('/').pop()) + ' ' + h.line +
          '<small>' + esc(h.text) + '</small></div>').join('') || '<div class="side-note">No results.</div>';
    };
    q.addEventListener('input', draw);
    $('#hits').addEventListener('click', (e) => {
      const hit = e.target.closest('[data-open]');
      if (hit) openFile(hit.getAttribute('data-open'));
    });
    draw();
  }

  function renderGit() {
    sideBody.innerHTML =
      '<div class="side-note"><b style="color:#d8cff5">Source control</b><br>No repository detected in this workspace. Initialise one to track edits.</div>' +
      '<div class="row"><svg class="i"><use href="#d-git"/></svg>git init</div>';
  }

  /* ------------------------------------------------------ extensions */
  const EXTENSIONS = [
    { id: 'piko-agent', name: 'PIKO Agent', by: 'PIKO', desc: 'Autonomous edits, approvals', icon: 'd-sparkles', installed: true },
    { id: 'monaco', name: 'Monaco Editor', by: 'Microsoft', desc: 'Bundled editor engine', icon: 'd-code', installed: true },
    { id: 'memory', name: 'Local Memory', by: 'PIKO', desc: 'Project and global memory', icon: 'd-brain', installed: true },
    { id: 'bridge', name: 'Marketplace', by: 'PIKO', desc: 'Install without a browser', icon: 'd-blocks', installed: true },
    { id: 'gitlens', name: 'Git Lens Lite', by: 'Community', desc: 'Inline blame and history', icon: 'd-git', installed: false },
    { id: 'prettier', name: 'Prettier', by: 'Community', desc: 'Format on save', icon: 'd-check', installed: false },
    { id: 'containers', name: 'Container Tools', by: 'Community', desc: 'Build containers here', icon: 'd-terminal', installed: false },
    { id: 'icons', name: 'File Icons', by: 'Community', desc: 'Icons in the explorer', icon: 'd-files', installed: false },
  ];
  let extQuery = '';

  function extCard(ext) {
    return '<div class="ext" data-ext="' + ext.id + '">' +
      '<span class="ext-icon"><svg class="i"><use href="#' + ext.icon + '"/></svg></span>' +
      '<span class="ext-meta" title="' + esc(ext.by + ' — ' + ext.desc) + '"><b>' + esc(ext.name) + '</b>' +
      '<small>' + esc(ext.by) + ' · ' + esc(ext.desc) + '</small></span>' +
      '<button class="ext-btn" type="button" data-install="' + ext.id + '">' +
      (ext.installed ? 'Remove' : 'Install') + '</button></div>';
  }

  function renderExtensions() {
    const q = extQuery.trim().toLowerCase();
    const match = (ext) => !q || (ext.name + ' ' + ext.by + ' ' + ext.desc).toLowerCase().includes(q);
    const installed = EXTENSIONS.filter((e) => e.installed && match(e));
    const market = EXTENSIONS.filter((e) => !e.installed && match(e));
    const count = EXTENSIONS.filter((e) => e.installed).length;

    sideBody.innerHTML =
      '<div class="side-search"><svg class="i"><use href="#d-search"/></svg>' +
      '<input id="ext-q" placeholder="Search extensions" value="' + esc(extQuery) + '" /></div>' +
      '<div class="ext-head">Installed<b>' + count + '</b></div>' +
      (installed.map(extCard).join('') || '<div class="side-note">Nothing installed yet.</div>') +
      '<div class="ext-head">Marketplace</div>' +
      (market.map(extCard).join('') || '<div class="side-note">No extensions match that search.</div>');

    const input = $('#ext-q');
    input.addEventListener('input', () => {
      extQuery = input.value;
      renderExtensions();
      const next = $('#ext-q');
      next.focus();
      next.setSelectionRange(next.value.length, next.value.length);
    });
  }

  let toastTimer = 0;
  function toast(message) {
    let el = $('.ext-toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'ext-toast';
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.remove('show');
    void el.offsetWidth; // restart the transition
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 1900);
  }

  sideBody.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-install]');
    if (!btn) return;
    const ext = EXTENSIONS.find((e) => e.id === btn.getAttribute('data-install'));
    if (!ext) return;

    if (ext.installed) {
      ext.installed = false;
      renderExtensions();
      toast(ext.name + ' removed');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Installing…';
    setTimeout(() => {
      ext.installed = true;
      if (state.view === 'extensions') renderExtensions();
      toast(ext.name + ' installed');
    }, 850);
  });

  function renderMemory() {
    sideBody.innerHTML =
      '<div class="side-note"><b style="color:#d8cff5">Project memory · 18</b><br>' +
      'Wallpaper dimming defaults to 45%.<br>Approvals are required for shell calls.<br>Monaco is bundled locally, never from a CDN.</div>' +
      '<div class="side-note"><b style="color:#d8cff5">Global memory · 7</b><br>Prefer PowerShell 7 in terminal panels.<br>API keys stay in OS secure storage.</div>';
  }

  const VIEWS = {
    explorer: ['EXPLORER', renderExplorer],
    search: ['SEARCH', renderSearch],
    git: ['SOURCE CONTROL', renderGit],
    extensions: ['EXTENSIONS', renderExtensions],
    memory: ['MEMORY', renderMemory],
  };

  function renderSide() {
    const view = VIEWS[state.view];
    sideTitle.textContent = view[0];
    view[1]();
  }

  function setView(view) {
    state.view = view;
    $$('.rail-btn[data-view]').forEach((btn) => btn.classList.toggle('active', btn.getAttribute('data-view') === view));
    renderSide();
  }

  sideBody.addEventListener('click', (event) => {
    const dir = event.target.closest('[data-dir]');
    if (dir) {
      const key = dir.getAttribute('data-dir');
      if (state.expanded.has(key)) state.expanded.delete(key); else state.expanded.add(key);
      renderExplorer();
      return;
    }
    const project = event.target.closest('[data-project]');
    if (project) {
      const key = project.getAttribute('data-project');
      if (state.expanded.has(key)) state.expanded.delete(key); else state.expanded.add(key);
      renderExplorer();
      return;
    }
    const file = event.target.closest('[data-file]');
    if (file) {
      const path = file.getAttribute('data-file');
      if (path) openFile(path);
      else openFile(null);
    }
  });

  $$('.rail-btn[data-view]').forEach((btn) => btn.addEventListener('click', () => setView(btn.getAttribute('data-view'))));

  // deep link: demo.html#extensions opens that view directly
  const deepLink = decodeURIComponent(location.hash.replace('#', ''));
  if (VIEWS[deepLink]) setView(deepLink);

  /* ----------------------------------------------------------- panels */
  const ai = $('#ai');
  const bottom = $('#bottom');

  function toggleAI(force) {
    const show = typeof force === 'boolean' ? force : ai.style.display === 'none';
    ai.style.display = show ? '' : 'none';
    $('#toggle-ai').style.opacity = show ? '1' : '0.6';
  }
  $('#toggle-ai').addEventListener('click', () => toggleAI());
  $('#hide-ai').addEventListener('click', () => toggleAI(false));

  $('#hide-bottom').addEventListener('click', () => { bottom.style.display = 'none'; });
  $$('.bottom-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      $$('.bottom-tab').forEach((other) => other.classList.toggle('active', other === tab));
      if (tab.textContent.trim() === 'Terminal') {
        bottom.style.display = '';
        $('#term-input').focus();
      }
    });
  });

  /* --------------------------------------------------------- terminal */
  const term = $('#term');
  const termInput = $('#term-input');
  const history = [];
  let hIndex = 0;

  const OUTPUTS = {
    help: () => 'help · ls · pwd · node --version · npm test · npm run build · git status · clear',
    ls: () => '    Directory: C:\\Users\\ULTRAPC\\US-SMOKE-PROJECT\n\nd----  src\nd----  public\n-a---  package.json\n-a---  README.md\n-a---  vite.config.ts',
    dir: () => OUTPUTS.ls(),
    pwd: () => 'C:\\Users\\ULTRAPC\\US-SMOKE-PROJECT',
    'node --version': () => 'v22.11.0',
    'npm test': () => '> vitest run\n\n ✓ src/agent.test.ts (6 tests)\n ✓ src/memory.test.ts (4 tests)\n\n Tests  10 passed (10)\n exit code 0',
    'npm run build': () => '> tsc -b && vite build\n\n✓ 1284 modules transformed.\ndist/assets/index-2f9c1a.js  412.55 kB │ gzip: 132.07 kB\n✓ built in 3.42s\n exit code 0',
    'git status': () => 'On branch main\nnothing to commit, working tree clean',
    'npm install': () => 'up to date, audited 312 packages\n\nfound 0 vulnerabilities',
    '/learn': () => 'Indexed US-SMOKE-PROJECT · 42 files · 118 chunks',
  };

  function line(html, cls) {
    const el = document.createElement('div');
    el.className = 'term-line' + (cls ? ' ' + cls : '');
    el.innerHTML = html;
    term.appendChild(el);
    term.scrollTop = term.scrollHeight;
  }

  function run(raw) {
    const cmd = raw.trim();
    if (!cmd) return;
    history.push(cmd);
    hIndex = history.length;
    line('<b>PS&gt;</b> ' + esc(cmd));
    const lower = cmd.toLowerCase();
    if (lower === 'clear' || lower === 'cls') { term.innerHTML = ''; return; }
    if (lower.startsWith('echo ')) { line(esc(cmd.slice(5))); return; }
    const handler = OUTPUTS[lower];
    if (handler) {
      handler().split('\n').forEach((l) => line(esc(l), /exit code 0|passed|built|✓/.test(l) ? 'ok' : ''));
      return;
    }
    line("The term '" + esc(cmd.split(' ')[0]) + "' is not recognized as a cmdlet, function, script file, or executable program.", 'err');
  }

  termInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const value = termInput.value;
      termInput.value = '';
      run(value);
    } else if (event.key === 'ArrowUp' && hIndex > 0) {
      event.preventDefault();
      termInput.value = history[--hIndex] || '';
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (hIndex < history.length - 1) termInput.value = history[++hIndex] || '';
      else { hIndex = history.length; termInput.value = ''; }
    }
  });

  $('#clear-term').addEventListener('click', () => { term.innerHTML = '<div class="term-line dim">Terminal cleared.</div>'; });

  /* --------------------------------------------------------- AI panel */
  const chat = $('#chat');
  const prompt = $('#prompt');
  const MODE_HINTS = {
    ask: 'Read-only answers and explanations',
    plan: 'Read-only research and implementation plans',
    code: 'Edits files and runs tools with approvals',
    agent: 'Full autonomous loop with approvals',
  };

  $$('#modes button').forEach((btn) => {
    btn.addEventListener('click', () => {
      $$('#modes button').forEach((other) => other.classList.toggle('on', other === btn));
      const mode = btn.getAttribute('data-mode');
      $('#intro-hint').textContent = MODE_HINTS[mode];
      $('#composer-hint').textContent = (mode === 'ask' || mode === 'plan' ? 'read-only tools' : 'file + shell tools · approvals');
    });
  });

  function reply(text) {
    const t = text.toLowerCase();
    if (t.includes('/security') || t.includes('security')) {
      return { html: 'Scanned <b>42 files</b>: 0 critical, 0 high, 2 informational.<br>The approval gate on shell calls is on.', tool: 'security_scan · 42 files' };
    }
    if (t.includes('test')) {
      return { html: 'Added <code>agent.test.ts</code> with 6 cases for mode profiles and approvals. <b>10 passed</b>, 0 failed.', tool: 'run_command · npm test' };
    }
    if (t.includes('bug')) {
      return { html: 'Found one: <code>runTask</code> never clears the running flag when a tool throws. I can patch it and keep the diff small.', tool: 'read_file · src/agent.ts' };
    }
    if (t.includes('architecture') || t.includes('explain')) {
      return { html: 'Entry point <code>src/App.tsx</code> renders the shell. <code>agent.ts</code> owns the mode profiles and the approval loop; state lives in one store.', tool: 'index_project · 118 chunks' };
    }
    return { html: 'I can make that change. I read <code>src/App.tsx</code> first, then run the build with your approval.', tool: 'read_file · src/App.tsx' };
  }

  function send() {
    const text = prompt.value.trim();
    if (!text) return;
    prompt.value = '';
    const intro = $('#chat-intro');
    if (intro) intro.remove();

    chat.insertAdjacentHTML('beforeend', '<div class="msg user"><div class="bubble">' + esc(text) + '</div></div>');
    chat.insertAdjacentHTML('beforeend', '<div class="thinking" id="thinking"><i></i><i></i><i></i><span>Thinking…</span></div>');
    chat.scrollTop = chat.scrollHeight;

    const data = reply(text);
    setTimeout(() => {
      const thinking = $('#thinking');
      if (thinking) thinking.remove();
      chat.insertAdjacentHTML('beforeend',
        '<div class="msg ai"><div class="bubble">' + data.html + '</div>' +
        '<div class="tool"><svg class="i s11"><use href="#d-check"/></svg>' + esc(data.tool) + '</div></div>');
      chat.scrollTop = chat.scrollHeight;
    }, 750);
  }

  $('#send').addEventListener('click', send);
  prompt.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); send(); }
  });
  chat.addEventListener('click', (event) => {
    const chip = event.target.closest('[data-prompt]');
    if (chip) { prompt.value = chip.getAttribute('data-prompt'); prompt.focus(); }
  });

  /* ------------------------------------------------------------ menu */
  $$('.tb-menu button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-menu');
      if (name === 'View') setView('explorer');
      if (name === 'Terminal') { bottom.style.display = ''; termInput.focus(); }
      if (name === 'Help') run('help');
      if (name === 'Run') run('npm run build');
      if (name === 'File') openFile('src/App.tsx');
    });
  });

  /* ---------------------------------------------------------- palette */
  const palette = $('#palette');
  const paletteInput = $('#palette-input');
  const paletteList = $('#palette-list');
  let pIndex = 0;
  let pItems = [];

  function commands() {
    const list = [
      { label: 'View: Explorer', run: () => setView('explorer') },
      { label: 'View: Search', run: () => setView('search') },
      { label: 'View: Source Control', run: () => setView('git') },
      { label: 'View: Extensions', run: () => setView('extensions') },
      { label: 'View: Memory', run: () => setView('memory') },
      { label: 'View: Toggle AI panel', run: () => toggleAI() },
      { label: 'Terminal: Run build', run: () => run('npm run build') },
      { label: 'Terminal: Run tests', run: () => run('npm test') },
      { label: 'Terminal: Clear', run: () => { term.innerHTML = ''; } },
    ];
    Object.keys(FILES).forEach((path) => list.push({ label: 'Open: ' + path, run: () => openFile(path) }));
    return list;
  }

  function drawPalette(query) {
    const q = query.trim().toLowerCase();
    pItems = commands().filter((item) => !q || item.label.toLowerCase().includes(q));
    pIndex = Math.min(pIndex, Math.max(0, pItems.length - 1));
    paletteList.innerHTML = pItems.map((item, i) =>
      '<button class="palette-item' + (i === pIndex ? ' active' : '') + '" type="button" data-i="' + i + '">' +
      '<svg class="i"><use href="#d-command"/></svg>' + esc(item.label) + '</button>'
    ).join('') || '<div class="side-note">No matching commands.</div>';
  }

  function openPalette() {
    palette.hidden = false;
    paletteInput.value = '';
    pIndex = 0;
    drawPalette('');
    paletteInput.focus();
  }

  $('#palette-open').addEventListener('click', openPalette);
  paletteInput.addEventListener('input', () => { pIndex = 0; drawPalette(paletteInput.value); });
  paletteInput.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') { event.preventDefault(); pIndex = Math.min(pItems.length - 1, pIndex + 1); drawPalette(paletteInput.value); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); pIndex = Math.max(0, pIndex - 1); drawPalette(paletteInput.value); }
    else if (event.key === 'Enter') { event.preventDefault(); const item = pItems[pIndex]; palette.hidden = true; if (item) item.run(); }
    else if (event.key === 'Escape') palette.hidden = true;
  });
  paletteList.addEventListener('click', (event) => {
    const item = event.target.closest('[data-i]');
    if (!item) return;
    const entry = pItems[Number(item.getAttribute('data-i'))];
    palette.hidden = true;
    if (entry) entry.run();
  });
  palette.addEventListener('mousedown', (event) => { if (event.target === palette) palette.hidden = true; });

  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'p') {
      event.preventDefault();
      openPalette();
    }
    if (event.key === 'Escape') palette.hidden = true;
  });

  /* ------------------------------------------------------------- boot */
  renderTabs();
  openFile('src/App.tsx');
  renderSide();
})();
