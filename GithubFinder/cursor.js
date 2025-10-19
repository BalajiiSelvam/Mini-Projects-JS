const sparkleColors = [
  '#2eff76', '#2ea043', '#36dd60', '#a0ffb0', '#c0ffc0',
  '#3ebe3e', '#8cff9e', '#3bdf56', '#66e285', '#70ff80'
];

document.addEventListener('mousemove', function(e) {
    for (let i = 0; i < 5; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        document.body.appendChild(sparkle);

        const size = Math.random() * 3 + 4; // random size
        const color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
        sparkle.style.width = size + 'px';
        sparkle.style.height = size + 'px';
        sparkle.style.background = color;
        sparkle.style.boxShadow = `0 0 ${size * 2}px ${size}px ${color}`;

        const offsetX = (Math.random() - 0.5) * 10;
        const offsetY = (Math.random() - 0.5) * 10;
        sparkle.style.left = (e.pageX + offsetX) + 'px';
        sparkle.style.top = (e.pageY + offsetY) + 'px';

        setTimeout(() => sparkle.remove(), 500);
    }
});
