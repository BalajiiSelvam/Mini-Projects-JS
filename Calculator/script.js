const display = document.getElementById("display");

// Append values to the display
function appendValue(value) {
  display.value += value;
}

// Clear all input
function clearDisplay() {
  display.value = "";
}

// Delete last character
function deleteLast() {
  display.value = display.value.slice(0, -1);
}

// Calculate result safely
function calculate() {
  try {
    display.value = eval(display.value);
  } catch {
    display.value = "Error";
  }
}
