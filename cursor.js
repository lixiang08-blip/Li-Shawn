/* Fixed tip, immediate positioning. Only the triangle scales/turns, not its hotspot. */
(() => {
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const root = document.documentElement;
  const cursor = document.createElement('div');
  cursor.className = 'portfolio-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML = '<span></span>';
  document.body.append(cursor);
  const editable = 'input,textarea,select,[contenteditable]:not([contenteditable="false"]),[role="textbox"],pre,code';
  const text = 'p,figcaption,blockquote,li,h1,h2,h3,h4,dt,dd';
  const clickable = 'a[href],button:not(:disabled),[role="button"]';
  const hide = () => {
    root.classList.remove('custom-cursor-active');
    cursor.classList.remove('is-visible', 'is-hover', 'is-pressed', 'is-title');
  };
  document.addEventListener('pointermove', event => {
    const target = event.target instanceof Element ? event.target : null;
    if (!fine.matches || event.pointerType !== 'mouse' || !target) return hide();
    const title = !!target.closest('.title-art');
    const link = !!target.closest(clickable);
    if (target.closest(editable) || target.closest(':disabled') || (!title && !link && target.closest(text)) || !getSelection()?.isCollapsed) return hide();
    // Read no layout: the SVG-like triangle's tip is exactly (20,0).
    cursor.style.transform = `translate3d(${event.clientX - 20}px,${event.clientY}px,0)`;
    cursor.classList.toggle('is-hover', link);
    cursor.classList.toggle('is-title', title);
    cursor.classList.add('is-visible');
    root.classList.add('custom-cursor-active');
  }, { passive: true });
  document.addEventListener('pointerdown', event => {
    if (event.button === 0 && root.classList.contains('custom-cursor-active')) cursor.classList.add('is-pressed');
  }, { passive: true });
  document.addEventListener('pointerup', () => cursor.classList.remove('is-pressed'), { passive: true });
  document.addEventListener('pointercancel', hide);
  document.documentElement.addEventListener('pointerleave', hide);
  window.addEventListener('blur', hide);
  window.addEventListener('scroll', hide, { passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) hide(); });
  fine.addEventListener('change', hide);
})();
