// Get references
const toggleBtn = document.getElementById("toggleBtn");
const body = document.body;

// Check if theme already saved in localStorage
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark");
  toggleBtn.querySelector(".icon").textContent = "🌙";
} else {
  toggleBtn.querySelector(".icon").textContent = "🌞";
}

// Button click event
toggleBtn.addEventListener("click", () => {
  body.classList.toggle("dark");

  // Update icon + save preference
  if (body.classList.contains("dark")) {
    toggleBtn.querySelector(".icon").textContent = "🌙";
    localStorage.setItem("theme", "dark");
  } else {
    toggleBtn.querySelector(".icon").textContent = "🌞";
    localStorage.setItem("theme", "light");
  }
});
