const container = document.querySelector(".bubble-container");

// Function to create a bubble
function createBubble() {
  const bubble = document.createElement("div");
  bubble.classList.add("bubble");

  // Random size & position
  const size = Math.random() * 60 + 20; // 20px - 80px
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;
  bubble.style.left = `${Math.random() * 100}%`;

  // Random animation speed & delay
  bubble.style.animationDuration = `${6 + Math.random() * 4}s`;
  bubble.style.animationDelay = `${Math.random() * 2}s`;

  container.appendChild(bubble);

  // Remove bubble after animation ends
  setTimeout(() => {
    bubble.remove();
  }, 10000);
}

// Generate bubbles continuously
setInterval(createBubble, 400);
