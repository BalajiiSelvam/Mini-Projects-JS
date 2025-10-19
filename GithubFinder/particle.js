particlesJS('particles-js', {
  particles: {
    number: { value: 50, density: { enable: true, value_area: 1000 } },
    color: { value: ['#0366d6', '#28a745', '#d73a49'] },
    shape: { type: ['circle', 'triangle', 'star'], stroke: { width: 0 } },
    opacity: { value: 0.6, random: true, anim: { enable: true, speed: 1, opacity_min: 0.2 } },
    size: { value: 4, random: true, anim: { enable: true, speed: 2, size_min: 1 } },
    line_linked: {
      enable: false
    },
    move: {
      enable: true,
      speed: 3,
      direction: 'none',
      random: true,
      straight: false,
      out_mode: 'out',
      bounce: false
    }
  },
  interactivity: {
    detect_on: 'canvas',
    events: {
      onhover: { enable: true, mode: 'bubble' },
      onclick: { enable: true, mode: 'repulse' },
      resize: true
    },
    modes: {
      bubble: { distance: 200, size: 6, duration: 2, opacity: 0.8 },
      repulse: { distance: 100, duration: 0.4 }
    }
  },
  retina_detect: true
});