/* =========================================================================
   APOSTELLO DETAILING — PERSISTENT SITE AUDIO
   One background track that plays continuously across page navigations
   (this is a static multi-page site, not a single-page app, so "continuous"
   means: we save playback position + mute state on every page and resume
   from that exact spot on the next page load — not a true gapless stream).
   Also exposes duck()/restore() so before/after video clips can take over
   the "sound spotlight" and hand it back to the music afterward.
   ========================================================================= */

(function () {
  const KEY_TIME = 'apostello_music_time';
  const KEY_MUTED = 'apostello_music_muted';
  const KEY_ENTERED = 'apostello_entered';
  const TARGET_VOLUME = 0.32;

  const audio = document.createElement('audio');
  audio.id = 'bgMusic';
  audio.src = 'audio/theme-song.mp3';
  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = 0;
  audio.setAttribute('playsinline', '');
  document.body.appendChild(audio);

  const savedTime = parseFloat(localStorage.getItem(KEY_TIME) || '0');
  const savedMuted = localStorage.getItem(KEY_MUTED) === 'true';
  const hasEntered = sessionStorage.getItem(KEY_ENTERED) === 'true';

  if (savedTime) { try { audio.currentTime = savedTime; } catch (e) {} }
  audio.muted = savedMuted;

  let fadeTimer = null;
  function fadeTo(target, ms, done) {
    clearInterval(fadeTimer);
    target = Math.max(0, Math.min(1, target));
    const start = audio.volume;
    const t0 = Date.now();
    const STEP_MS = 40;
    fadeTimer = setInterval(() => {
      const p = Math.max(0, Math.min(1, (Date.now() - t0) / ms));
      audio.volume = Math.max(0, Math.min(1, start + (target - start) * p));
      if (p >= 1) {
        clearInterval(fadeTimer);
        if (done) done();
      }
    }, STEP_MS);
  }

  function attemptPlay() {
    if (audio.muted) return;
    const p = audio.play();
    if (p && p.catch) {
      p.catch(() => {
        const resume = () => { audio.play().catch(() => {}); };
        window.addEventListener('pointerdown', resume, { once: true });
      });
    }
  }

  // keep saved position fresh so the next page resumes close to here
  setInterval(() => {
    if (!audio.paused) localStorage.setItem(KEY_TIME, String(audio.currentTime));
  }, 1000);
  window.addEventListener('pagehide', () => {
    localStorage.setItem(KEY_TIME, String(audio.currentTime));
  });

  let ducked = false;

  const SiteAudio = {
    audio,
    hasEntered: () => hasEntered,
    enter(startMuted) {
      sessionStorage.setItem(KEY_ENTERED, 'true');
      localStorage.setItem(KEY_MUTED, String(!!startMuted));
      audio.muted = !!startMuted;
      if (!startMuted) {
        attemptPlay();
        fadeTo(TARGET_VOLUME, 900);
      }
      document.dispatchEvent(new CustomEvent('siteaudio:entered', { detail: { muted: !!startMuted } }));
    },
    toggleMute() {
      const nowMuted = !audio.muted;
      audio.muted = nowMuted;
      localStorage.setItem(KEY_MUTED, String(nowMuted));
      if (!nowMuted) {
        attemptPlay();
        if (!ducked) fadeTo(TARGET_VOLUME, 300);
      }
      document.dispatchEvent(new CustomEvent('siteaudio:mutechange', { detail: { muted: nowMuted } }));
      return nowMuted;
    },
    isMuted: () => audio.muted,
    duck() {
      ducked = true;
      fadeTo(0, 450);
    },
    restore() {
      ducked = false;
      if (audio.muted) return;
      attemptPlay();
      fadeTo(TARGET_VOLUME, 550);
    },
  };
  window.SiteAudio = SiteAudio;

  // ---- floating mute/unmute button (every page) ----
  function injectMuteButton() {
    const btn = document.createElement('button');
    btn.id = 'audioToggle';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Toggle site music');
    btn.className = 'audio-toggle-btn';
    btn.innerHTML = ICON_ON;
    btn.addEventListener('click', () => {
      const muted = SiteAudio.toggleMute();
      btn.innerHTML = muted ? ICON_OFF : ICON_ON;
      btn.classList.toggle('is-muted', muted);
    });
    document.body.appendChild(btn);
    btn.innerHTML = audio.muted ? ICON_OFF : ICON_ON;
    btn.classList.toggle('is-muted', audio.muted);
    document.addEventListener('siteaudio:mutechange', (e) => {
      btn.innerHTML = e.detail.muted ? ICON_OFF : ICON_ON;
      btn.classList.toggle('is-muted', e.detail.muted);
    });
  }

  const ICON_ON = '<svg width="18" height="18" viewBox="0 0 22 22" fill="none"><path d="M3 8v6h4l5 4V4L7 8H3z" fill="currentColor"/><path d="M15 8a4 4 0 010 6M17.5 5.5a8 8 0 010 11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
  const ICON_OFF = '<svg width="18" height="18" viewBox="0 0 22 22" fill="none"><path d="M3 8v6h4l5 4V4L7 8H3z" fill="currentColor"/><path d="M15 8l5 6M20 8l-5 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';

  // ---- intro splash gate (only shows once per browser session, whichever page loads first) ----
  function injectIntro() {
    const overlay = document.createElement('div');
    overlay.id = 'introOverlay';
    overlay.className = 'intro-overlay';
    overlay.innerHTML = `
      <div class="intro-glow"></div>
      <img src="images/logo.png" alt="Apostello Detailing" class="intro-logo">
      <p class="eyebrow mb-4">Franklin County, VA &amp; Surrounding Areas</p>
      <h1 class="font-display intro-title">APOSTELLO DETAILING</h1>
      <p class="intro-sub">Clean. Protect. Restore.</p>
      <button type="button" id="introEnter" class="btn btn-primary intro-enter">🔊 Enter Site</button>
      <button type="button" id="introEnterMuted" class="intro-skip">Enter without sound</button>
    `;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    function dismiss(muted) {
      SiteAudio.enter(muted);
      overlay.classList.add('intro-out');
      document.body.style.overflow = '';
      setTimeout(() => overlay.remove(), 700);
    }
    document.getElementById('introEnter').addEventListener('click', () => dismiss(false));
    document.getElementById('introEnterMuted').addEventListener('click', () => dismiss(true));
  }

  function init() {
    injectMuteButton();
    if (hasEntered) {
      audio.volume = audio.muted ? 0 : TARGET_VOLUME;
      attemptPlay();
    } else {
      injectIntro();
    }
  }

  if (document.body) init();
  else document.addEventListener('DOMContentLoaded', init);
})();
