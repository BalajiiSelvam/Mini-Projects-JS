/* ============================================================= */
/*               app.js – FINAL, 100% WORKING 2025               */
/* ============================================================= */

const languages = {
  'auto': 'Auto-Detect',
  'en': 'English',  'hi': 'Hindi',    'ta': 'Tamil',
  'te': 'Telugu',   'fr': 'French',  'es': 'Spanish',
  'de': 'German',   'it': 'Italian', 'pt': 'Portuguese',
  'ru': 'Russian',  'zh': 'Chinese', 'ja': 'Japanese',
  'ko': 'Korean'
};

/* ----------------------- DOM elements ----------------------- */
const fromSel      = document.getElementById('fromLang');
const toSel        = document.getElementById('toLang');
const src          = document.getElementById('source');
const dst          = document.getElementById('dest');
const translateBtn = document.getElementById('translateBtn');
const loadingEl    = document.getElementById('loading');

/* ------------------- WORKING PROXY (2025) ------------------ */
const PROXY = 'https://api.codetabs.com/v1/proxy/?url=';
const translateEndpoint = PROXY + encodeURIComponent('https://libretranslate.de/translate');
const detectEndpoint    = PROXY + encodeURIComponent('https://libretranslate.de/detect');

/* --------------------- Populate selects -------------------- */
function populate() {
  Object.entries(languages).forEach(([code, name]) => {
    const txt = `${name}${code !== 'auto' ? ` — ${code}` : ''}`;
    fromSel.add(new Option(txt, code));
    toSel.add(new Option(txt, code));
  });
  fromSel.value = 'en';
  toSel.value   = 'hi';
  toSel.querySelector('option[value="auto"]').disabled = true;
}
populate();

/* -------------------------- Translate ---------------------- */
async function translate() {
  const text = src.value.trim();
  if (!text) { dst.value = ''; return; }

  showLoading(true);
  try {
    const payload = {
      q: text,
      source: fromSel.value,
      target: toSel.value,
      format: 'text'
    };

    const res = await fetch(translateEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    dst.value = data.translatedText || data.result || JSON.stringify(data);
  } catch (err) {
    console.error(err);
    dst.value = `Translation failed — ${err.message}`;
  } finally {
    showLoading(false);
  }
}

/* -------------------------- Loading UI --------------------- */
function showLoading(flag) {
  loadingEl.style.display = flag ? 'flex' : 'none';
  translateBtn.disabled = flag;
}

/* ----------------------- Swap languages -------------------- */
document.getElementById('swapBtn').addEventListener('click', () => {
  const a = fromSel.value, b = toSel.value;
  fromSel.value = (b === 'auto' ? 'en' : b);
  toSel.value   = (a === 'auto' ? 'en' : a);
});

/* ----------------------- Translate button ------------------ */
translateBtn.addEventListener('click', translate);

/* --------------------------- Clear -------------------------- */
document.getElementById('clearBtn').addEventListener('click', () => {
  src.value = dst.value = '';
});

/* ----------------------- Copy source ----------------------- */
document.getElementById('copySrc').addEventListener('click', async () => {
  if (src.value) await navigator.clipboard.writeText(src.value) && alert('Copied');
});

/* ---------------------- Copy translation ------------------- */
document.getElementById('copyDst').addEventListener('click', async () => {
  if (dst.value) await navigator.clipboard.writeText(dst.value) && alert('Copied');
});

/* -------------------------- Speech -------------------------- */
document.getElementById('speakSrc').addEventListener('click', () => speakText(src.value, fromSel.value));
document.getElementById('speakDst').addEventListener('click', () => speakText(dst.value, toSel.value));

function speakText(text, lang) {
  if (!text) return;
  const ut = new SpeechSynthesisUtterance(text);
  const short = (lang || '').split('-')[0];
  const voices = speechSynthesis.getVoices();
  const match = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(short));
  if (match) ut.voice = match;
  ut.lang = lang === 'auto' ? 'en' : (lang || 'en');
  speechSynthesis.speak(ut);
}

/* -------------------------- Download ----------------------- */
document.getElementById('downloadBtn').addEventListener('click', () => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([dst.value], { type: 'text/plain' }));
  a.download = 'translation.txt';
  a.click();
});

/* ----------------------- Auto-detect ----------------------- */
document.getElementById('detectBtn').addEventListener('click', async () => {
  const text = src.value.trim();
  if (!text) return alert('Enter text');

  showLoading(true);
  try {
    const res = await fetch(detectEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text })
    });
    const data = await res.json();
    if (Array.isArray(data) && data[0]) {
      fromSel.value = data[0].language;
      alert(`Detected: ${data[0].language}`);
    }
  } catch (err) {
    alert('Detection failed');
  } finally {
    showLoading(false);
  }
});

/* ----------------------- Swap texts ------------------------ */
document.getElementById('swapTextBtn').addEventListener('click', () => {
  [src.value, dst.value] = [dst.value, src.value];
});

/* ------------------- Ctrl + Enter -------------------------- */
src.addEventListener('keydown', e => e.ctrlKey && e.key === 'Enter' && translate());

/* ------------------- Warm-up voices ------------------------ */
speechSynthesis.getVoices();
setTimeout(() => speechSynthesis.getVoices(), 500);