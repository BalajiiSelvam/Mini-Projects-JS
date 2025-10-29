// Basic drawing with undo (stores paths)
const canvas = document.getElementById('drawCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;
let currentPath = [];
const paths = [];

ctx.lineWidth = 6;
ctx.lineCap = 'round';
ctx.strokeStyle = '#111';

function getPointerPos(e) {
  const rect = canvas.getBoundingClientRect();
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
  return {x, y};
}

function startDraw(e) {
  drawing = true;
  currentPath = [];
  const p = getPointerPos(e);
  currentPath.push(p);
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
}
function draw(e) {
  if(!drawing) return;
  e.preventDefault();
  const p = getPointerPos(e);
  currentPath.push(p);
  ctx.lineTo(p.x, p.y);
  ctx.stroke();
}
function stopDraw() {
  if(!drawing) return;
  drawing = false;
  paths.push(currentPath.slice());
}

canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDraw);
canvas.addEventListener('mouseleave', stopDraw);
canvas.addEventListener('touchstart', startDraw, {passive:false});
canvas.addEventListener('touchmove', draw, {passive:false});
canvas.addEventListener('touchend', stopDraw);

document.getElementById('clearBtn').addEventListener('click', () => {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  paths.length = 0;
});
document.getElementById('undoBtn').addEventListener('click', () => {
  paths.pop();
  redrawAll();
});
function redrawAll() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.beginPath();
  for(const path of paths){
    if(!path.length) continue;
    ctx.moveTo(path[0].x, path[0].y);
    for(let i=1;i<path.length;i++){
      ctx.lineTo(path[i].x, path[i].y);
    }
    ctx.stroke();
  }
}

// Recognize using Tesseract.js
const ocrTextEl = document.getElementById('ocrText');
const resultTextEl = document.getElementById('resultText');
const errorEl = document.getElementById('error');

document.getElementById('recognizeBtn').addEventListener('click', async () => {
  errorEl.textContent = '';
  ocrTextEl.textContent = 'Recognizing...';
  resultTextEl.textContent = '—';
  // make image (white bg for better OCR)
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tctx = tempCanvas.getContext('2d');
  tctx.fillStyle = '#ffffff';
  tctx.fillRect(0,0,tempCanvas.width,tempCanvas.height);
  tctx.drawImage(canvas, 0, 0);

  const dataURL = tempCanvas.toDataURL('image/png');

  try {
    // Use Tesseract to recognize text. Simple config — digits + symbols may help.
    const worker = Tesseract.createWorker({
      logger: m => { /* console.log(m) */ }
    });
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    // you can experiment with Tesseract's config for digits
    const { data } = await worker.recognize(dataURL, { tessjs_create_hocr: '0' });
    await worker.terminate();

    let text = data.text || '';
    text = text.replace(/\s+/g,''); // remove whitespace
    ocrTextEl.textContent = text || 'No text found';

    if(!text) return;

    // sanitize allowed characters for basic math: digits, + - * / ^ ( ) . x (for multiplication) and letters for variable handling
    // replace common OCR mistakes: 'x' used for multiplication, '—' or '–' to '-'
    text = text.replace(/×/g, '*').replace(/X/g, '*').replace(/x/g, '*');
    text = text.replace(/[—–−]/g, '-');
    text = text.replace(/÷/g, '/');

    // keep only allowed chars (digits, operators, parentheses, letters, decimal point, '^')
    const allowed = text.match(/[0-9+\-*/().^a-zA-Z]+/g);
    if(!allowed) {
      throw new Error('OCR returned no valid math tokens.');
    }
    const expr = allowed.join('');
    // Basic safety: allow only chars in whitelist
    if(!/^[0-9+\-*/().^a-zA-Z]+$/.test(expr)) {
      throw new Error('Expression contains invalid characters.');
    }

    // Evaluate using math.js
    let result;
    try {
      result = math.evaluate(expr);
    } catch (e) {
      // Try to replace implicit multiplication like '2(3)' -> '2*(3)'
      let fixed = expr.replace(/(\d)\s*\(/g, '$1*(');
      result = math.evaluate(fixed);
    }

    resultTextEl.textContent = String(result);
  } catch (err) {
    console.error(err);
    errorEl.textContent = 'Error: ' + (err.message || err);
    ocrTextEl.textContent = '—';
    resultTextEl.textContent = '—';
  }
});
