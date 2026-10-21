/* Original, optional water interaction. No animation loop or external libraries. */
(() => {
  const poster = document.querySelector('.water-poster');
  if (!poster) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const ripple = poster.querySelector('.pointer-ripple');
  let lastRipple = 0;
  let animation;
  const reset = () => {
    animation?.cancel();
    poster.style.removeProperty('--pointer-x');
    poster.style.removeProperty('--pointer-y');
  };
  poster.addEventListener('pointermove', event => {
    if (motion.matches || !finePointer.matches) return;
    const now = performance.now();
    if (now - lastRipple < 650) return;
    lastRipple = now;
    const box = poster.getBoundingClientRect();
    const x = event.clientX - box.left;
    const y = event.clientY - box.top;
    if (y < box.height * .46) return;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    animation?.cancel();
    animation = ripple.animate([
      { transform: 'translate(-50%, -50%) scale(.2)', opacity: .45 },
      { transform: 'translate(-50%, -50%) scale(2.5)', opacity: 0 }
    ], { duration: 2400, easing: 'cubic-bezier(.16,.6,.3,1)' });
  }, { passive: true });
  motion.addEventListener('change', reset);
  document.addEventListener('visibilitychange', () => {
    poster.classList.toggle('water-paused', document.hidden);
    if (document.hidden) reset();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      poster.classList.toggle('water-paused', !entry.isIntersecting);
      if (!entry.isIntersecting) reset();
    }).observe(poster);
  }
})();
