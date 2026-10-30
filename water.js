/* Event-driven pointer effects; no perpetual JS animation loop. */
(() => {
  const poster = document.querySelector('.water-poster');
  if (!poster) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = matchMedia('(hover: hover) and (pointer: fine)');
  const fish = poster.querySelector('.fish-response');
  const reflection = poster.querySelector('.surface-reflection');
  const displacement = poster.querySelector('#reflection-displacement');
  const ripple = poster.querySelector('.reflection-ripple');
  let visible = true;
  let frame = 0;
  let wave;
  let lastWave = 0;
  const keys = ['--ray-x', '--ray-angle', '--ray-light', '--pink-brightness', '--fish-away-x', '--fish-away-y'];
  const reset = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    keys.forEach(key => poster.style.removeProperty(key));
    displacement.setAttribute('scale', '32');
    wave?.cancel();
  };
  const sync = () => {
    poster.classList.toggle('water-paused', document.hidden || !visible);
    if (document.hidden || !visible || motion.matches || !pointer.matches) reset();
  };
  poster.addEventListener('pointermove', event => {
    if (motion.matches || !pointer.matches || !visible || frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const box = poster.getBoundingClientRect();
      const nx = (event.clientX - box.left) / box.width - .5;
      poster.style.setProperty('--ray-x', `${nx * 10}px`);
      poster.style.setProperty('--ray-angle', `${nx * 1.5}deg`);
      poster.style.setProperty('--ray-light', `${1 + (.5 - Math.abs(nx)) * .08}`);
      const title = poster.querySelector('.title-art').getBoundingClientRect();
      const distance = Math.hypot(event.clientX - (title.left + title.width * .5), event.clientY - (title.top + title.height * .45));
      poster.style.setProperty('--pink-brightness', `${1 + Math.max(0, 1 - distance / (title.width * .5)) * .13}`);
      const f = fish.getBoundingClientRect();
      const dx = event.clientX - (f.left + f.width / 2);
      const dy = event.clientY - (f.top + f.height / 2);
      const proximity = Math.max(0, 1 - Math.hypot(dx, dy) / 180);
      poster.style.setProperty('--fish-away-x', `${-Math.sign(dx) * proximity * 15}px`);
      poster.style.setProperty('--fish-away-y', `${-Math.sign(dy) * proximity * 8}px`);
      const r = reflection.getBoundingClientRect();
      const nearSurface = event.clientY >= r.top && event.clientY <= r.bottom + 60;
      displacement.setAttribute('scale', nearSurface ? '38' : '32');
      if (nearSurface && performance.now() - lastWave > 700) {
        lastWave = performance.now();
        ripple.style.left = `${Math.max(0, Math.min(r.width, event.clientX - r.left))}px`;
        ripple.style.top = `${Math.max(0, Math.min(r.height, event.clientY - r.top))}px`;
        wave?.cancel();
        wave = ripple.animate([
          { transform: 'translate(-50%,-50%) scale(.25)', opacity: .2 },
          { transform: 'translate(-50%,-50%) scale(1.7)', opacity: 0 }
        ], { duration: 1800, easing: 'ease-out' });
      }
    });
  }, { passive: true });
  poster.addEventListener('pointerleave', reset);
  motion.addEventListener('change', sync);
  pointer.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }).observe(poster);
  }
  sync();
})();
