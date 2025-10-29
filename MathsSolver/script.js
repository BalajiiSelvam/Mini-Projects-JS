// script.js - Fixed Version (Tesseract v5+)
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const resultDiv = document.getElementById('result');
const solveBtn = document.getElementById('solveBtn');
const clearBtn = document.getElementById('clearBtn');

let drawing = false;

// === DRAWING SETUP ===
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

function startDrawing() {
  drawing = true;
  ctx.beginPath();
}

function stopDrawing() {
  if (drawing) {
    drawing = false;
    ctx.beginPath();
  }
}

function draw(e) {
  if (!drawing) return;

  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'black';

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}

// === CLEAR CANVAS ===
clearBtn.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  resultDiv.innerHTML = '<small>Canvas cleared 🧹</small>';
});

// === IMAGE PREPROCESSING ===
function preprocessCanvas() {
  const temp = document.createElement('canvas');
  const tctx = temp.getContext('2d');
  const scale = 2;

  temp.width = canvas.width * scale;
  temp.height = canvas.height * scale;

  tctx.imageSmoothingEnabled = false;
  tctx.drawImage(canvas, 0, 0, temp.width, temp.height);

  const imgData = tctx.getImageData(0, 0, temp.width, temp.height);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
    const val = gray < 180 ? 0 : 255;
    data[i] = data[i+1] = data[i+2] = val;
  }
  tctx.putImageData(imgData, 0, 0);
  return temp.toDataURL('image/png');
}

// === TEXT NORMALIZATION ===
function normalizeExpression(text) {
  return text
    .replace(/[÷]/g, '/')
    .replace(/[×]/g, '*')
    .replace(/[|l]/g, '1')
    .replace(/[O]/g, '0')
    .replace(/\s+/g, ' ')
    .replace(/[^0-9+\-*/().=^ ]/g, '')
    .trim();
}

// === SAFE MATH EVALUATION ===
function safeEvaluate(expr) {
  try {
    if (!/^[0-9+\-*/().\s^]+$/.test(expr)) return 'Invalid Expression';
    return Function('"use strict"; return (' + expr + ')')();
  } catch {
    return 'Could not solve';
  }
}

// === MAIN SOLVE BUTTON ===
solveBtn.addEventListener('click', async () => {
  solveBtn.disabled = true;
  solveBtn.textContent = '⏳ Recognizing...';
  resultDiv.innerHTML = '<span class="spinner"></span> OCR in progress...';

  try {
    const image = preprocessCanvas();

    const { data: { text } } = await Tesseract.recognize(
      image,
      'eng',
      { logger: m => console.log(m) }
    );

    const expr = normalizeExpression(text);
    const answer = safeEvaluate(expr);

    resultDiv.innerHTML = `
      <div> Recognized: <b>${expr || 'nothing detected'}</b></div>
      <div> Answer: <b style="color:#48bb78;">${answer}</b>
      </div>
    `;
  } catch (err) {
    console.error(err);
    resultDiv.innerHTML = `❌ Error: ${err.message}`;
  } finally {
    solveBtn.disabled = false;
    solveBtn.textContent = '🚀 Solve';
  }
});
