document.getElementById('themeToggle').addEventListener('click', () => {
  const currentTheme = document.body.dataset.theme;
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.body.setAttribute('data-theme', newTheme);
  document.getElementById('themeToggle').innerHTML = newTheme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
  document.getElementById('header-logo').src = newTheme === 'light' ? 'assets/logo_full_dark.png' : 'assets/logo_full.png';
  localStorage.setItem('theme', newTheme);
});

// Apply saved theme on load
const savedTheme = localStorage.getItem('theme') || 'light';
document.body.setAttribute('data-theme', savedTheme);
document.getElementById('themeToggle').innerHTML = savedTheme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
document.getElementById('header-logo').src = savedTheme === 'light' ? 'assets/logo_full_dark.png' : 'assets/logo_full.png';