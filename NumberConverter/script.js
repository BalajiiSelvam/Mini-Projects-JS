function convert() {
  const fromType = document.getElementById("fromType").value;
  const toType = document.getElementById("toType").value;
  const inputValue = document.getElementById("inputValue").value.trim();
  const resultBox = document.getElementById("result");

  if (inputValue === "") {
    resultBox.textContent = "⚠️ Please enter a value.";
    return;
  }

  let decimalValue;

  // Convert input to decimal first
  try {
    switch (fromType) {
      case "dec":
        decimalValue = parseInt(inputValue, 10);
        break;
      case "bin":
        decimalValue = parseInt(inputValue, 2);
        break;
      case "oct":
        decimalValue = parseInt(inputValue, 8);
        break;
      case "hex":
        decimalValue = parseInt(inputValue, 16);
        break;
    }

    if (isNaN(decimalValue)) throw "Invalid input";

    // Convert decimal to target type
    let convertedValue;
    switch (toType) {
      case "dec":
        convertedValue = decimalValue.toString(10);
        break;
      case "bin":
        convertedValue = decimalValue.toString(2);
        break;
      case "oct":
        convertedValue = decimalValue.toString(8);
        break;
      case "hex":
        convertedValue = decimalValue.toString(16).toUpperCase();
        break;
    }

    resultBox.textContent = `✅ Result: ${convertedValue}`;
  } catch (err) {
    resultBox.textContent = "❌ Invalid number for the selected type.";
  }
}
