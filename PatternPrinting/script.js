function printPattern() {
  const patternType = document.getElementById("pattern").value;
  const n = parseInt(document.getElementById("rows").value);
  let output = "";

  if (isNaN(n) || n <= 0) {
    document.getElementById("output").textContent = "⚠️ Enter a valid positive number!";
    return;
  }

  switch (patternType) {
    // 🔹 Basic Shapes
    case "square":
      for (let i = 0; i < n; i++) output += "*".repeat(n) + "\n";
      break;

    case "hollowSquare":
      for (let i = 1; i <= n; i++) {
        if (i === 1 || i === n) output += "*".repeat(n) + "\n";
        else output += "*" + " ".repeat(n - 2) + "*" + "\n";
      }
      break;

    case "LShape":
      for (let i = 1; i <= n; i++) {
        if (i === n) output += "*".repeat(n) + "\n";
        else output += "*\n";
      }
      break;

    case "TShape":
      for (let i = 1; i <= n; i++) {
        if (i === 1) output += "*".repeat(n) + "\n";
        else output += " ".repeat(Math.floor(n / 2)) + "*\n";
      }
      break;

    case "XShape":
      for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= n; j++) {
          output += (j === i || j === n - i + 1) ? "*" : " ";
        }
        output += "\n";
      }
      break;

    case "HShape":
      for (let i = 1; i <= n; i++) {
        if (i === Math.ceil(n / 2)) output += "*".repeat(n) + "\n";
        else output += "*"+ " ".repeat(n - 2) + "*\n";
      }
      break;

    case "UShape":
      for (let i = 1; i <= n; i++) {
        if (i === n) output += "*".repeat(n) + "\n";
        else output += "*" + " ".repeat(n - 2) + "*\n";
      }
      break;

    // 🔹 Triangles
    case "left":
      for (let i = 1; i <= n; i++) output += "*".repeat(i) + "\n";
      break;

    case "leftInverted":
      for (let i = n; i >= 1; i--) output += "*".repeat(i) + "\n";
      break;

    case "right":
      for (let i = 1; i <= n; i++) output += " ".repeat(n - i) + "*".repeat(i) + "\n";
      break;

    case "rightInverted":
      for (let i = n; i >= 1; i--) output += " ".repeat(n - i) + "*".repeat(i) + "\n";
      break;

    // 🔹 Pyramid / Diamond
    case "pyramid":
      for (let i = 1; i <= n; i++) {
        output += " ".repeat(n - i) + "*".repeat(2 * i - 1) + "\n";
      }
      break;

    case "diamond":
      for (let i = 1; i <= n; i++) output += " ".repeat(n - i) + "*".repeat(2 * i - 1) + "\n";
      for (let i = n - 1; i >= 1; i--) output += " ".repeat(n - i) + "*".repeat(2 * i - 1) + "\n";
      break;

    case "hollowDiamond":
      for (let i = 1; i <= n; i++) {
        output += " ".repeat(n - i);
        for (let j = 1; j <= 2 * i - 1; j++) {
          output += (j === 1 || j === 2 * i - 1) ? "*" : " ";
        }
        output += "\n";
      }
      for (let i = n - 1; i >= 1; i--) {
        output += " ".repeat(n - i);
        for (let j = 1; j <= 2 * i - 1; j++) {
          output += (j === 1 || j === 2 * i - 1) ? "*" : " ";
        }
        output += "\n";
      }
      break;

    default:
      output = "❌ Unknown pattern!";
  }

  document.getElementById("output").textContent = output;
}
