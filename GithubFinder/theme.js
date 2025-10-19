document.getElementById('themeToggle').addEventListener('click', () => {
  const currentTheme = document.body.dataset.theme;
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.body.setAttribute('data-theme', newTheme);
  document.getElementById('themeToggle').innerHTML = newTheme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
  localStorage.setItem('theme', newTheme);

  // Update particles for theme change
  particlesJS('particles-js', {
    particles: {
      number: { value: 20, density: { enable: true, value_area: 1000 } },
      color: { value: newTheme === 'dark' ? '#3fb950' : '#2ea043' },
      shape: { type: 'star', stroke: { width: 0 } },
      opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1, opacity_min: 0.3 } },
      size: { value: 5, random: true, anim: { enable: true, speed: 2, size_min: 3 } },
      line_linked: { enable: false },
      move: {
        enable: true,
        speed: 2,
        direction: 'none',
        random: true,
        straight: false,
        out_mode: 'out',
        bounce: false
      }
    },
    interactivity: {
      detect_on: 'window',
      events: {
        onhover: { enable: true, mode: 'grab' },
        onclick: { enable: true, mode: 'push' },
        resize: true
      },
      modes: {
        grab: { distance: 140, line_linked: { opacity: 0.7 } },
        push: { particles_nb: 3 }
      }
    },
    retina_detect: true
  });
});

// Apply saved theme on load
const savedTheme = localStorage.getItem('theme') || 'light';
document.body.setAttribute('data-theme', savedTheme);
document.getElementById('themeToggle').innerHTML = savedTheme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';