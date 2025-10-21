function checkPrime() {
  const actualInput = document.getElementById("inputText").value;
  const input = document.getElementById("inputText").value.trim();
  const result = document.getElementById("result");

  // Check for empty input
  if (input === "") {
    result.textContent = "⚠️ Please enter a number!";
    result.className = "result error";
    return;
  }

  const num = Number(input);

  // Check for invalid (non-numeric) input
  if (isNaN(num)) {
    result.textContent = "⚠️ Please enter a valid number!";
    result.className = "result error";
    return;
  }

  // Prime number must be > 1
  if (num <= 1) {
    result.textContent = `❌ ${actualInput} is not a Prime Number.`;
    result.className = "result error";
    return;
  }

  // Prime check logic
  let isPrime = true;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) {
      isPrime = false;
      break;
    }
  }

  if (isPrime) {
    result.textContent = `✅ ${actualInput} is a Prime Number!`;
    result.className = "result success";
  } else {
    result.textContent = `❌ ${actualInput} is not a Prime Number.`;
    result.className = "result error";
  }
}
