// Mobile nav toggle
const toggle = document.querySelector('.menu-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.textContent = isOpen ? '✕' : '☰';
  });
  links.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = '☰';
  }));
}

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Animate voice wave bars
const bars = document.querySelectorAll('.voice-wave span');
bars.forEach((bar, i) => {
  bar.style.animation = `voiceBar 1.2s ease-in-out ${i * 0.08}s infinite alternate`;
});

const style = document.createElement('style');
style.textContent = `
  @keyframes voiceBar {
    from { transform: scaleY(0.4); opacity: 0.5; }
    to { transform: scaleY(1.4); opacity: 1; }
  }
  .typing i {
    animation: blink 1.2s ease-in-out infinite;
  }
  .typing i:nth-child(2) { animation-delay: 0.2s; }
  .typing i:nth-child(3) { animation-delay: 0.4s; }
  @keyframes blink {
    0%, 100% { opacity: 0.3; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.2); }
  }
  .pulse {
    animation: pulseAnim 2s ease-in-out infinite;
  }
  @keyframes pulseAnim {
    0%, 100% { box-shadow: 0 0 8px #56e6b0; }
    50% { box-shadow: 0 0 20px #56e6b0; }
  }
`;
document.head.appendChild(style);

// Intersection observer for fo-items
const foItems = document.querySelectorAll('.fo-item');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateX(0)';
    }
  });
}, { threshold: 0.1 });

foItems.forEach((item, i) => {
  item.style.opacity = '0';
  item.style.transform = 'translateX(-20px)';
  item.style.transition = `opacity 0.4s ease ${i * 0.05}s, transform 0.4s ease ${i * 0.05}s`;
  observer.observe(item);
});
