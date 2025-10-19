document.getElementById('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  document.getElementById('themeToggle').innerHTML = isDark ? '<i class="fas fa-sun"></i> Light Mode' : '<i class="fas fa-moon"></i> Dark Mode';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Apply saved theme on load
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark');
  document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i> Light Mode';
}