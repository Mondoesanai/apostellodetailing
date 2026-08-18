// Shared behavior across all pages: mobile nav, scroll reveals, footer year.
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('flex');
      mobileNav.classList.toggle('hidden');
      navToggle.setAttribute('aria-expanded', mobileNav.classList.contains('flex'));
    });
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobileNav.classList.add('hidden');
      mobileNav.classList.remove('flex');
    }));
  }

  const yearEls = document.querySelectorAll('[data-year]');
  yearEls.forEach(el => el.textContent = new Date().getFullYear());

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  // subtle 3D tilt on hover, follows the cursor — desktop only
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.tilt-card').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(700px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg) translateY(-4px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  // gentle parallax drift on hero background blobs
  const blob1 = document.getElementById('heroBlob1');
  const blob2 = document.getElementById('heroBlob2');
  if (blob1 || blob2) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (blob1) blob1.style.transform = `translateY(${y * 0.15}px)`;
      if (blob2) blob2.style.transform = `translateY(${y * 0.25}px)`;
    }, { passive: true });
  }
});
