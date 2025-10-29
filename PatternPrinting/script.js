/* -------------------------------------------------------------
   Helper – turn a multiline string with indentation into HTML
   ------------------------------------------------------------- */
function formatCodeForHTML(snippet) {
  const lines = snippet.split('\n');
  const htmlLines = lines.map(line => {
    // count leading spaces (2-space indent)
    const indent = line.match(/^ */)[0].length;
    const text  = line.trimStart();
    const spaces = '&nbsp;'.repeat(indent);
    return spaces + text;
  });
  return htmlLines.join('<br>');
}

/* -------------------------------------------------------------
   MAIN FUNCTION
   ------------------------------------------------------------- */
function printPattern() {
  const n = parseInt(document.getElementById("rows").value);
  const symbol = document.getElementById("symbol").value || "*";
  const patternType = document.getElementById("pattern").value;

  // ---- colour from selected circle ----
  const selected = document.querySelector(".color-option.selected");
  const color = selected ? selected.dataset.color : "#00ff90";

  // ---- validation ----
  if (isNaN(n) || n <= 0) {
    document.getElementById("output").textContent = "Please enter a valid number of rows!";
    document.getElementById("codeOutput").querySelector("code").innerHTML = "";
    return;
  }

  // ---- build pattern & code snippet (same loops as before) ----
  let pattern = "";
  let codeSnippet = "";               // raw JS with \n

  switch (patternType) {
    case "square":
      for (let i = 0; i < n; i++) pattern += symbol.repeat(n) + "\n";
      codeSnippet = `for(let i=0;i<${n};i++){\n  console.log("${symbol}".repeat(${n}));\n}`;
      break;

    case "hollow-square":
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          pattern += (i === 0 || j === 0 || i === n - 1 || j === n - 1) ? symbol : " ";
        }
        pattern += "\n";
      }
      codeSnippet = `// Hollow Square\nfor(let i=0;i<${n};i++){\n  let row='';\n  for(let j=0;j<${n};j++){\n    row += (i===0||j===0||i===${n}-1||j===${n}-1)?'${symbol}':' ';\n  }\n  console.log(row);\n}`;
      break;

    case "left-triangle":
      for (let i = 1; i <= n; i++) pattern += symbol.repeat(i) + "\n";
      codeSnippet = `for(let i=1;i<=${n};i++) console.log("${symbol}".repeat(i));`;
      break;

    case "left-inverted":
      for (let i = n; i >= 1; i--) pattern += symbol.repeat(i) + "\n";
      codeSnippet = `for(let i=${n};i>=1;i--) console.log("${symbol}".repeat(i));`;
      break;

    case "right-triangle":
      for (let i = 1; i <= n; i++) pattern += " ".repeat(n - i) + symbol.repeat(i) + "\n";
      codeSnippet = `for(let i=1;i<=${n};i++) console.log(" ".repeat(${n}-i)+"${symbol}".repeat(i));`;
      break;

    case "right-inverted":
      for (let i = n; i >= 1; i--) pattern += " ".repeat(n - i) + symbol.repeat(i) + "\n";
      codeSnippet = `for(let i=${n};i>=1;i--) console.log(" ".repeat(${n}-i)+"${symbol}".repeat(i));`;
      break;

    case "pyramid":
      for (let i = 1; i <= n; i++)
        pattern += " ".repeat(n - i) + symbol.repeat(2 * i - 1) + "\n";
      codeSnippet = `for(let i=1;i<=${n};i++) console.log(" ".repeat(${n}-i)+"${symbol}".repeat(2*i-1));`;
      break;

    case "diamond":
      for (let i = 1; i <= n; i++)
        pattern += " ".repeat(n - i) + symbol.repeat(2 * i - 1) + "\n";
      for (let i = n - 1; i >= 1; i--)
        pattern += " ".repeat(n - i) + symbol.repeat(2 * i - 1) + "\n";
      codeSnippet = `// Diamond (upper)\nfor(let i=1;i<=${n};i++) console.log(" ".repeat(${n}-i)+"${symbol}".repeat(2*i-1));\n// (lower)\nfor(let i=${n}-1;i>=1;i--) console.log(" ".repeat(${n}-i)+"${symbol}".repeat(2*i-1));`;
      break;

    case "hollow-diamond":
      for (let i = 1; i <= n; i++)
        pattern += " ".repeat(n - i) + symbol + " ".repeat(2 * i - 3) + (i > 1 ? symbol : "") + "\n";
      for (let i = n - 1; i >= 1; i--)
        pattern += " ".repeat(n - i) + symbol + " ".repeat(2 * i - 3) + (i > 1 ? symbol : "") + "\n";
      codeSnippet = `// Hollow Diamond (upper)\nfor(let i=1;i<=${n};i++) console.log(" ".repeat(${n}-i)+"${symbol}"+" ".repeat(2*i-3)+(i>1?"${symbol}":""));\n// (lower)\nfor(let i=${n}-1;i>=1;i--) console.log(" ".repeat(${n}-i)+"${symbol}"+" ".repeat(2*i-3)+(i>1?"${symbol}":""));`;
      break;

    case "l-shape":
      for (let i = 0; i < n; i++) {
        pattern += (i === n - 1) ? symbol.repeat(n) : symbol + "\n";
      }
      codeSnippet = `for(let i=0;i<${n};i++) console.log(i===${n}-1?"${symbol}".repeat(${n}):"${symbol}");`;
      break;

    case "t-shape":
      for (let i = 0; i < n; i++) {
        if (i === 0) pattern += symbol.repeat(n) + "\n";
        else pattern += " ".repeat(Math.floor(n / 2)) + symbol + "\n";
      }
      codeSnippet = `for(let i=0;i<${n};i++){\n  if(i===0) console.log("${symbol}".repeat(${n}));\n  else console.log(" ".repeat(Math.floor(${n}/2))+"${symbol}");\n}`;
      break;

    case "x-shape":
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          pattern += (j === i || j === n - i - 1) ? symbol : " ";
        }
        pattern += "\n";
      }
      codeSnippet = `for(let i=0;i<${n};i++){\n  let row='';\n  for(let j=0;j<${n};j++) row += (j===i||j===${n}-i-1)?'${symbol}':' ';\n  console.log(row);\n}`;
      break;

    case "h-shape":
      for (let i = 0; i < n; i++) {
        if (i === Math.floor(n / 2)) pattern += symbol.repeat(n) + "\n";
        else pattern += symbol + " ".repeat(n - 2) + symbol + "\n";
      }
      codeSnippet = `for(let i=0;i<${n};i++){\n  if(i===Math.floor(${n}/2)) console.log("${symbol}".repeat(${n}));\n  else console.log("${symbol}"+" ".repeat(${n}-2)+"${symbol}");\n}`;
      break;

    case "u-shape":
      for (let i = 0; i < n - 1; i++)
        pattern += symbol + " ".repeat(n - 2) + symbol + "\n";
      pattern += symbol.repeat(n);
      codeSnippet = `for(let i=0;i<${n}-1;i++) console.log("${symbol}"+" ".repeat(${n}-2)+"${symbol}");\nconsole.log("${symbol}".repeat(${n}));`;
      break;

    default:
      pattern = "Invalid pattern type!";
      codeSnippet = "// No code available for invalid pattern";
  }

  /* ---------- PATTERN (typing animation) ---------- */
  const output = document.getElementById("output");
  output.innerHTML = "";
  let idx = 0;
  const span = document.createElement("span");
  span.style.color = color;
  output.appendChild(span);

  const interval = setInterval(() => {
    span.textContent += pattern[idx];
    idx++;
    if (idx >= pattern.length) clearInterval(interval);
  }, 10);

  /* ---------- CODE (pretty-printed) ---------- */
  const codeEl = document.getElementById("codeOutput").querySelector("code");
  codeEl.innerHTML = formatCodeForHTML(codeSnippet);
}

/* ---------- Circle-picker init (paint + select) ---------- */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".color-option").forEach(opt => {
    opt.style.background = opt.dataset.color;
  });

  const first = document.querySelector(".color-option");
  if (first) first.classList.add("selected");

  document.querySelectorAll(".color-option").forEach(opt => {
    opt.addEventListener("click", function () {
      document.querySelectorAll(".color-option").forEach(o => o.classList.remove("selected"));
      this.classList.add("selected");
    });
  });
});