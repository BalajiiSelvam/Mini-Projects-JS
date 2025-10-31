// === VOICE CALCULATOR ===

// Select elements
const expressionInput = document.getElementById('expression');
const resultDisplay = document.getElementById('result');
const speakBtn = document.getElementById('speakBtn');
const calcBtn = document.getElementById('calcBtn');

// Speech Recognition Setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.interimResults = false;

// Handle voice input
speakBtn.addEventListener('click', () => {
  recognition.start();
  speakBtn.textContent = "🎧 Listening...";
});

// On speech result
recognition.onresult = (event) => {
  const speechText = event.results[0][0].transcript.toLowerCase();
  expressionInput.value = speechText;
  speakBtn.textContent = "🎤 Speak";
  processExpression(speechText);
};

recognition.onerror = () => {
  alert("Couldn't recognize your voice. Try again!");
  speakBtn.textContent = "🎤 Speak";
};

// Calculate when button clicked
calcBtn.addEventListener('click', () => {
  processExpression(expressionInput.value);
});

// Convert speech to math and calculate
function processExpression(text) {
  try {
    const replaced = text
      .replace(/plus/gi, '+')
      .replace(/minus/gi, '-')
      .replace(/times|multiplied by/gi, '*')
      .replace(/divide|divided by/gi, '/')
      .replace(/into/gi, '*')
      .replace(/x/gi, '*')
      .replace(/over/gi, '/')
      .replace(/ /g, '');

    const result = eval(replaced);
    if (isNaN(result)) throw Error();
    resultDisplay.textContent = result;
    speakResult(result);
  } catch {
    resultDisplay.textContent = "Error ❌";
    speakResult("Invalid expression");
  }
}

// Speak result
function speakResult(result) {
  const utter = new SpeechSynthesisUtterance("The answer is " + result);
  utter.rate = 1;
  utter.pitch = 1;
  speechSynthesis.speak(utter);
}
