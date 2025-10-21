function checkPalindrome() {
  const input = document.getElementById("inputText").value.trim().toLowerCase();
  const result = document.getElementById("result");

  if (input === "") {
    result.textContent = "⚠️ Please enter some text!";
    result.className = "result error";
    return;
  }

  // Remove non-alphanumeric chars
  const cleaned = input.replace(/[^a-z0-9]/g, '');
  const reversed = cleaned.split("").reverse().join("");

  if (cleaned === reversed) {
    result.textContent = `✅ "${input}" is a Palindrome!`;
    result.className = "result success";
  } else {
    result.textContent = `❌ "${input}" is not a Palindrome.`;
    result.className = "result error";
  }
}
