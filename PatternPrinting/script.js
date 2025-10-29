function printPattern() {
  const n = parseInt(document.getElementById("rows").value);
  const symbol = document.getElementById("symbol").value || "*";
  const patternType = document.getElementById("pattern").value;

  // Get selected color from circle picker
  const selected = document.querySelector(".color-option.selected");
  const color = selected ? selected.dataset.color : "#00ff90";

  // Validation
  if (isNaN(n) || n <= 0) {
    document.getElementById("output").textContent = "Please enter a valid number of rows!";
    return;
  }

  let pattern = "";

  switch (patternType) {
    case "square":
      for (let i = 0; i < n; i++) pattern += symbol.repeat(n) + "\n";
      break;

    case "hollow-square":
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          pattern += (i === 0 || j === 0 || i === n - 1 || j === n - 1) ? symbol : " ";
        }
        pattern += "\n";
      }
      break;

    case "left-triangle":
      for (let i = 1; i <= n; i++) pattern += symbol.repeat(i) + "\n";
      break;

    case "left-inverted":
      for (let i = n; i >= 1; i--) pattern += symbol.repeat(i) + "\n";
      break;

    case "right-triangle":
      for (let i = 1; i <= n; i++) pattern += " ".repeat(n - i) + symbol.repeat(i) + "\n";
      break;

    case "right-inverted":
      for (let i = n; i >= 1; i--) pattern += " ".repeat(n - i) + symbol.repeat(i) + "\n";
      break;

    case "pyramid":
      for (let i = 1; i <= n; i++)
        pattern += " ".repeat(n - i) + symbol.repeat(2 * i - 1) + "\n";
      break;

    case "diamond":
      for (let i = 1; i <= n; i++)
        pattern += " ".repeat(n - i) + symbol.repeat(2 * i - 1) + "\n";
      for (let i = n - 1; i >= 1; i--)
        pattern += " ".repeat(n - i) + symbol.repeat(2 * i - 1) + "\n";
      break;

    case "hollow-diamond":
      for (let i = 1; i <= n; i++)
        pattern += " ".repeat(n - i) + symbol + " ".repeat(2 * i - 3) + (i > 1 ? symbol : "") + "\n";
      for (let i = n - 1; i >= 1; i--)
        pattern += " ".repeat(n - i) + symbol + " ".repeat(2 * i - 3) + (i > 1 ? symbol : "") + "\n";
      break;

    case "l-shape":
      for (let i = 0; i < n; i++) {
        pattern += (i === n - 1) ? symbol.repeat(n) : symbol + "\n";
      }
      break;

    case "t-shape":
      for (let i = 0; i < n; i++) {
        if (i === 0) pattern += symbol.repeat(n) + "\n";
        else pattern += " ".repeat(Math.floor(n / 2)) + symbol + "\n";
      }
      break;

    case "x-shape":
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          pattern += (j === i || j === n - i - 1) ? symbol : " ";
        }
        pattern += "\n";
      }
      break;

    case "h-shape":
      for (let i = 0; i < n; i++) {
        if (i === Math.floor(n / 2)) pattern += symbol.repeat(n) + "\n";
        else pattern += symbol + " ".repeat(n - 2) + symbol + "\n";
      }
      break;

    case "u-shape":
      for (let i = 0; i < n - 1; i++)
        pattern += symbol + " ".repeat(n - 2) + symbol + "\n";
      pattern += symbol.repeat(n);
      break;

    default:
      pattern = "Invalid pattern type!";
  }

  // Live typing animation with selected color
  const output = document.getElementById("output");
  output.innerHTML = ""; // Clear previous
  let idx = 0;

  const span = document.createElement("span");
  span.style.color = color;
  output.appendChild(span);

  const interval = setInterval(() => {
    span.textContent += pattern[idx];
    idx++;
    if (idx >= pattern.length) clearInterval(interval);
  }, 10);
}
document.addEventListener("DOMContentLoaded", () => {
  // Paint circles with their data-color
  document.querySelectorAll(".color-option").forEach(opt => {
    opt.style.background = opt.dataset.color;
  });

  // Select first circle
  const first = document.querySelector(".color-option");
  if (first) first.classList.add("selected");

  // Click handler
  document.querySelectorAll(".color-option").forEach(opt => {
    opt.addEventListener("click", function () {
      document.querySelectorAll(".color-option").forEach(o => o.classList.remove("selected"));
      this.classList.add("selected");
    });
  });
});