/*
 * ================================================================
 * MENU LATÉRAL (injection shared-components.js)
 * Ouvre/ferme la sidebar via le bouton burger et ferme au clic externe.
 * ================================================================
 */
const menuToggle = document.querySelector(".menu-toggle");
const menuBar = document.querySelector(".menu");
const sidebar = document.querySelector(".sidebar");

if (menuToggle && menuBar && sidebar) {
  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    menuBar.classList.toggle("active");
    sidebar.classList.toggle("active");
  });

  document.addEventListener("click", (e) => {
    if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
      menuBar.classList.remove("active");
      sidebar.classList.remove("active");
    }
  });

  sidebar.addEventListener("click", (e) => {
    e.stopPropagation();
  });
}




/* ── Couleurs pour les tokens ─────────────────────────────── */
const TOKEN_COLORS = [
  { bg: 'rgba(79,141,255,.22)',  border: '#4f8dff', text: '#689dfa' },
  { bg: 'rgba(139,92,246,.22)', border: '#8b5cf6', text: '#9361ff' },
  { bg: 'rgba(6,214,160,.2)',   border: '#06d6a0', text: '#21ce8b' },
  { bg: 'rgba(245,158,11,.2)',  border: '#f59e0b', text: '#fdb435' },
  { bg: 'rgba(244,63,94,.2)',   border: '#f43f5e', text: '#f84866' },
  { bg: 'rgba(14,165,233,.2)',  border: '#0ea5e9', text: '#3daef5' },
];
 
/* ── Tokeniseurs ──────────────────────────────────────────── */
function tokenizeWord(text) {
  // Simple BPE-like: split on spaces, punctuation gets own token
  const raw = text.match(/[\w'àâäéèêëïîôöùûüç]+|[^\w\s]|\s+/gi) || [];
  const tokens = [];
  raw.forEach(t => {
    if (/^\s+$/.test(t)) {
      // attach space to next real token as prefix marker
      tokens.push({ text: t, isSpace: true });
    } else {
      tokens.push({ text: t, isSpace: false });
    }
  });
  // merge spaces with following token
  const merged = [];
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].isSpace && i + 1 < tokens.length) {
      merged.push({ text: '▁' + tokens[i + 1].text, display: tokens[i + 1].text, hadSpace: true });
      i++;
    } else if (!tokens[i].isSpace) {
      merged.push({ text: tokens[i].text, display: tokens[i].text, hadSpace: false });
    }
  }
  return merged;
}
 
function tokenizeSubword(text) {
  // Simulate BPE subword: common French/English subwords
  const common = ['tion','ment','ement','ité','ique','ible','ance','ence','eur','euse','iste','isme','ent','est','les','des','une','que','pas','sur','par','pour','mais','avec','dans','comme'];
  const words = text.split(/(\s+)/);
  const result = [];
  words.forEach(w => {
    if (/^\s+$/.test(w)) return;
    let remaining = w;
    let sub = [];
    while (remaining.length > 0) {
      let found = false;
      for (const c of common) {
        if (remaining.endsWith(c) && remaining.length > c.length) {
          sub.unshift(c);
          remaining = remaining.slice(0, -c.length);
          found = true;
          break;
        }
      }
      if (!found) {
        sub.unshift(remaining);
        break;
      }
    }
    sub.forEach((s, i) => result.push({ text: (i === 0 ? '▁' : '') + s, display: s }));
  });
  return result;
}
 
function tokenizeChar(text) {
  return text.split('').filter(c => c !== '').map(c => ({
    text: c === ' ' ? '▁' : c,
    display: c === ' ' ? '·' : c
  }));
}
 
function getTokens(text, mode) {
  if (!text.trim()) return [];
  if (mode === 'word') return tokenizeWord(text);
  if (mode === 'subword') return tokenizeSubword(text);
  if (mode === 'char') return tokenizeChar(text);
  return tokenizeWord(text);
}
 
/* ── Rendu tokens ─────────────────────────────────────────── */
function renderTokens(tokens, container) {
  container.innerHTML = '';
  if (tokens.length === 0) {
    container.innerHTML = '<span style="color:var(--muted);font-size:.85rem;font-style:italic">Les tokens apparaîtront ici…</span>';
    return;
  }
  tokens.forEach((tok, i) => {
    const col = TOKEN_COLORS[i % TOKEN_COLORS.length];
    const pill = document.createElement('span');
    pill.className = 'token-pill';
    pill.style.cssText = `background:${col.bg};color:${col.text};border-color:${col.border};animation-delay:${i * 18}ms`;
    pill.textContent = tok.display || tok.text;
    pill.setAttribute('data-tooltip', `Token #${i + 1} : "${tok.text}" (id ~${1000 + i * 37})`);
    container.appendChild(pill);
  });
}
 
/* ── Démo principale ─────────────────────────────────────── */
const mainInput  = document.getElementById('mainInput');
const modeSelect = document.getElementById('modeSelect');
const tokenDisp  = document.getElementById('tokenDisplay');
const statChars  = document.getElementById('statChars');
const statTokens = document.getElementById('statTokens');
const statRatio  = document.getElementById('statRatio');
const statWords  = document.getElementById('statWords');
 
function updateDemo() {
  const text = mainInput.value;
  const mode = modeSelect.value;
  const tokens = getTokens(text, mode);
 
  statChars.textContent  = text.length;
  statTokens.textContent = tokens.length;
  statRatio.textContent  = tokens.length ? (text.length / tokens.length).toFixed(1) : '0';
  statWords.textContent  = text.trim() ? text.trim().split(/\s+/).length : 0;
  renderTokens(tokens, tokenDisp);
}
 
mainInput.addEventListener('input', updateDemo);
modeSelect.addEventListener('change', updateDemo);
document.getElementById('clearBtn').addEventListener('click', () => { mainInput.value = ''; updateDemo(); });
 
const examples = [
  'Les élèves adorent l\'intelligence artificielle !',
  'ChatGPT utilise le tokenizer tiktoken de OpenAI.',
  'Le Byte-Pair Encoding fusionne les paires de caractères fréquentes.',
  '2024 tokens × 0,0015 $ = 0,003 $ par requête.',
  '🎉 Félicitations ! Vous avez compris la tokenisation 🧠',
];
let exIdx = 0;
document.getElementById('exampleBtn').addEventListener('click', () => {
  mainInput.value = examples[exIdx++ % examples.length];
  updateDemo();
});
 
updateDemo();
 
/* ── Comparaison encodages ────────────────────────────────── */
const compareInput = document.getElementById('compareInput');
const encodingGrid = document.getElementById('encodingGrid');
 
const ENCODINGS = [
  { name: 'Mots', mode: 'word', color: '#4f8dff' },
  { name: 'Sous-mots (BPE)', mode: 'subword', color: '#8b5cf6' },
  { name: 'Caractères', mode: 'char', color: '#06d6a0' },
];
 
function updateCompare() {
  const text = compareInput.value;
  encodingGrid.innerHTML = '';
  ENCODINGS.forEach(enc => {
    const tokens = getTokens(text, enc.mode);
    const card = document.createElement('div');
    card.className = 'enc-card';
    card.innerHTML = `
      <div class="enc-title" style="color:${enc.color}">${enc.name}</div>
      <div class="enc-tokens" id="enc-${enc.mode}"></div>
      <div class="enc-count">${tokens.length} token${tokens.length > 1 ? 's' : ''}</div>
    `;
    encodingGrid.appendChild(card);
    const wrap = card.querySelector(`#enc-${enc.mode}`);
    tokens.forEach((tok, i) => {
      const span = document.createElement('span');
      span.className = 'enc-token';
      span.style.borderLeft = `2px solid ${enc.color}`;
      span.textContent = tok.display || tok.text;
      wrap.appendChild(span);
    });
  });
}
 
compareInput.addEventListener('input', updateCompare);
updateCompare();
 
/* ── Fréquences ───────────────────────────────────────────── */
document.getElementById('freqBtn').addEventListener('click', () => {
  const text = document.getElementById('freqInput').value;
  if (!text.trim()) return;
  const tokens = getTokens(text, 'word');
  const freq = {};
  tokens.forEach(t => { const k = t.text; freq[k] = (freq[k] || 0) + 1; });
  const sorted = Object.entries(freq).sort((a,b) => b[1] - a[1]).slice(0, 15);
  const max = sorted[0]?.[1] || 1;
  const result = document.getElementById('freqResult');
  result.innerHTML = sorted.map(([tok, count], i) => {
    const col = TOKEN_COLORS[i % TOKEN_COLORS.length];
    const pct = Math.round(count / max * 100);
    return `
      <div class="freq-row">
        <span class="freq-token" style="color:${col.text}">${tok}</span>
        <span class="freq-count">${count}×</span>
        <div class="freq-bar-wrap"><div class="freq-bar-fill" style="width:0%;background:${col.border}" data-pct="${pct}"></div></div>
      </div>
    `;
  }).join('');
  setTimeout(() => {
    result.querySelectorAll('.freq-bar-fill').forEach(el => {
      el.style.width = el.dataset.pct + '%';
    });
  }, 50);
});
 
/* ── Coût ─────────────────────────────────────────────────── */
let selectedModel = { in: 0.15, out: 0.60, name: 'GPT-4o mini', ctx: 128000 };
 
const MODEL_CTX = {
  'GPT-4o mini': 128000,
  'GPT-4o': 128000,
  'Claude Haiku': 200000,
  'Claude Sonnet': 200000,
};
 
function updateCost() {
  const inp = +document.getElementById('inputTokens').value || 0;
  const out = +document.getElementById('outputTokens').value || 0;
  const calls = +document.getElementById('callsPerDay').value || 1;
 
  const costPerCall  = (inp * selectedModel.in + out * selectedModel.out) / 1_000_000;
  const costDay      = costPerCall * calls;
  const costMonth    = costDay * 30;
  const totalTokens  = inp + out;
  const ctx          = MODEL_CTX[selectedModel.name] || 128000;
  const ctxPct       = Math.min(totalTokens / ctx * 100, 100);
 
  document.getElementById('costResult').innerHTML = `
    <div class="cost-metric">
      <div class="cost-metric-val" style="color:var(--accent3)">$${costPerCall < 0.01 ? costPerCall.toFixed(5) : costPerCall.toFixed(4)}</div>
      <div class="cost-metric-label">par appel</div>
    </div>
    <div class="cost-metric">
      <div class="cost-metric-val" style="color:var(--accent4)">$${costDay.toFixed(3)}</div>
      <div class="cost-metric-label">par jour (${calls} appels)</div>
    </div>
    <div class="cost-metric">
      <div class="cost-metric-val" style="color:var(--accent2)">$${costMonth.toFixed(2)}</div>
      <div class="cost-metric-label">par mois estimé</div>
    </div>
    <div class="cost-metric">
      <div class="cost-metric-val" style="color:var(--accent)">${totalTokens.toLocaleString()}</div>
      <div class="cost-metric-label">tokens / appel</div>
    </div>
  `;
 
  document.getElementById('ctxBar').style.width = ctxPct + '%';
  document.getElementById('ctxUsedLabel').textContent = `${totalTokens.toLocaleString()} tokens utilisés`;
  document.getElementById('ctxTotalLabel').textContent = `${(ctx/1000).toFixed(0)}k contexte (${selectedModel.name})`;
  let msg = ctxPct < 25 ? '✅ Fenêtre très peu utilisée — vous avez de la marge !'
          : ctxPct < 60 ? '🟡 Utilisation modérée de la fenêtre de contexte.'
          : ctxPct < 90 ? '🟠 Attention, vous approchez de la limite !'
          : '🔴 Fenêtre presque saturée — le modèle risque d\'oublier le début !';
  document.getElementById('ctxMessage').textContent = msg;
}
 
document.getElementById('modelSelector').addEventListener('click', e => {
  const btn = e.target.closest('.model-btn');
  if (!btn) return;
  document.querySelectorAll('.model-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedModel = { in: +btn.dataset.in, out: +btn.dataset.out, name: btn.dataset.name };
  updateCost();
});
['inputTokens','outputTokens','callsPerDay'].forEach(id => {
  document.getElementById(id).addEventListener('input', updateCost);
});
updateCost();
 
/* ── Tabs ─────────────────────────────────────────────────── */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + tab).classList.add('active');
    if (tab === 'compare') updateCompare();
  });
});
 
/* ── IntersectionObserver pour fade-up ───────────────────── */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-up').forEach(el => io.observe(el));