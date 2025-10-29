function printPattern() {
  const patternType = document.getElementById("pattern").value;
  const n = parseInt(document.getElementById("rows").value);
  let output = "";

  if (isNaN(n) || n <= 0) {
    document.getElementById("output").textContent = "⚠️ Please enter a valid positive number!";
    return;
  }

  switch (patternType) {
    case "square":
      for (let i = 0; i < n; i++) output += "*".repeat(n) + "\n";
      break;

    case "left":
      for (let i = 1; i <= n; i++) output += "*".repeat(i) + "\n";
      break;

    case "right":
      for (let i = 1; i <= n; i++) output += " ".repeat(n - i) + "*".repeat(i) + "\n";
      break;

    case "inverted":
      for (let i = n; i >= 1; i--) output += "*".repeat(i) + "\n";
      break;

    case "hollowSquare":
      for (let i = 1; i <= n; i++) {
        if (i === 1 || i === n) output += "*".repeat(n) + "\n";
        else output += "*" + " ".repeat(n - 2) + "*" + "\n";
      }
      break;

    default:
      output = "❌ Unknown pattern type!";
  }

  document.getElementById("output").textContent = output;
}
