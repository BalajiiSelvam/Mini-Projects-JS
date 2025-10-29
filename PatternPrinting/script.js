function printPattern() {
  const n = document.getElementById("size").value;
  let output = "";

  if (n <= 0) {
    output = "Please enter a positive number!";
  } else {
    for (let i = 0; i < n; i++) {
      output += "*".repeat(n) + "\n";
    }
  }

  document.getElementById("output").textContent = output;
}
