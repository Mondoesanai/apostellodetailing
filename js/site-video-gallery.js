/* Renders a grid of vertical before/after video cards. Videos always loop
   silently in the background; tapping the speaker plays that one clip's real
   audio once through (ducking the site music), then automatically reverts to
   a silent loop and hands the music back — on end, on manual re-mute, or if
   the card scrolls out of view. Only one card can have sound at a time. */
function renderVideoGallery(container, items) {
  if (!container) return;

  container.innerHTML = items.map((item, i) => `
    <div class="video-card reveal in" data-video-card>
      <span class="video-label">${item.label}</span>
      <video data-idx="${i}" src="${item.src}" muted loop autoplay playsinline preload="metadata"></video>
      <button type="button" class="video-sound-btn" data-sound-btn aria-label="Play with sound">
        <svg width="18" height="18" viewBox="0 0 22 22" fill="none"><path d="M3 8v6h4l5 4V4L7 8H3z" fill="currentColor"/><path d="M15 8l5 6M20 8l-5 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
      </button>
    </div>`).join('');

  const cards = Array.from(container.querySelectorAll('[data-video-card]'));
  let activeCard = null;

  const ICON_ON = '<svg width="18" height="18" viewBox="0 0 22 22" fill="none"><path d="M3 8v6h4l5 4V4L7 8H3z" fill="currentColor"/><path d="M15 8a4 4 0 010 6M17.5 5.5a8 8 0 010 11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
  const ICON_OFF = '<svg width="18" height="18" viewBox="0 0 22 22" fill="none"><path d="M3 8v6h4l5 4V4L7 8H3z" fill="currentColor"/><path d="M15 8l5 6M20 8l-5 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';

  function silence(card) {
    const video = card.querySelector('video');
    const btn = card.querySelector('[data-sound-btn]');
    video.muted = true;
    video.loop = true;
    if (video.paused) video.play().catch(() => {});
    btn.innerHTML = ICON_OFF;
    btn.classList.remove('is-active');
    if (activeCard === card) {
      activeCard = null;
      if (window.SiteAudio) window.SiteAudio.restore();
    }
  }

  function activate(card) {
    if (activeCard && activeCard !== card) silence(activeCard);
    const video = card.querySelector('video');
    const btn = card.querySelector('[data-sound-btn]');
    video.loop = false;
    video.currentTime = 0;
    video.muted = false;
    video.play().catch(() => {});
    btn.innerHTML = ICON_ON;
    btn.classList.add('is-active');
    activeCard = card;
    if (window.SiteAudio) window.SiteAudio.duck();
  }

  cards.forEach((card) => {
    const video = card.querySelector('video');
    const btn = card.querySelector('[data-sound-btn]');

    btn.addEventListener('click', () => {
      if (activeCard === card) silence(card);
      else activate(card);
    });

    video.addEventListener('ended', () => { if (activeCard === card) silence(card); });
    video.addEventListener('pause', () => { if (activeCard === card && !video.loop) silence(card); });
  });

  // auto-silence when a playing-with-sound card scrolls out of view
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting && activeCard === entry.target) silence(entry.target);
      });
    }, { threshold: 0.15 });
    cards.forEach((card) => io.observe(card));
  }

  // if user navigates away entirely, nothing to clean up — next page load
  // starts fresh and SiteAudio resumes at full volume on its own.
}
