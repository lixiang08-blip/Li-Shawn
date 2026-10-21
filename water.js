/* Atmosphere is CSS/SVG only. Pause it when offscreen or in a hidden tab. */
(() => {
  const poster = document.querySelector('.water-poster');
  if (!poster) return;
  let visible = true;
  const sync = () => {
    poster.classList.toggle('water-paused', document.hidden || !visible);
  };
  document.addEventListener('visibilitychange', sync);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(poster);
  }
  sync();
})();
