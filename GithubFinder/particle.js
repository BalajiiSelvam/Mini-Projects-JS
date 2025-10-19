particlesJS('particles-js', {
  particles: {
    number: { value: 20, density: { enable: true, value_area: 1000 } },
    color: { value: '#2ea043' },
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

document.addEventListener('mousemove', (e) => {
  particlesJS('particles-js', {
    particles: {
      number: { value: 5, density: { enable: false } },
      color: { value: document.body.dataset.theme === 'dark' ? '#3fb950' : '#2ea043' },
      shape: { type: 'star' },
      opacity: { value: 0.6, random: true },
      size: { value: 4, random: true },
      line_linked: { enable: false },
      move: {
        enable: true,
        speed: 4,
        direction: 'none',
        random: true,
        straight: false,
        out_mode: 'out',
        bounce: false
      }
    },
    interactivity: {
      events: { onhover: { enable: false }, onclick: { enable: false } }
    }
  });
});