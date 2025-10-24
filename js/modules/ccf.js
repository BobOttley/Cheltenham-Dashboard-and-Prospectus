/* ===== CCF Module (precise autoplay on entry + fixed sound labels) ===== */
MODULES['ccf'] = (root, ctx) => {
  const $ = (sel, p = root) => p.querySelector(sel);
  const $$ = (sel, p = root) => Array.from(p.querySelectorAll(sel));

  // --- i18n with safe fallback ---
  const RAW_T = (window.PEN_I18N && typeof window.PEN_I18N.t === 'function') ? window.PEN_I18N.t : null;
  const t = (key, params) => {
    try {
      const val = RAW_T ? RAW_T(key, params) : '';
      if (val && String(val).trim()) return val;
    } catch (_) {}
    // Fallback strings (only what we need here)
    if (key === 'ccf.placeholders.your_child') return 'your child';
    if (key === 'ccf.ui.click_to_unmute') return 'CLICK TO UNMUTE';
    if (key === 'ccf.ui.click_to_mute')   return 'CLICK TO MUTE';
    return '';
  };

  // --- Personalisation (kept) ---
  const applyNames = () => {
    const name = (ctx?.childName || '').trim();
    const fallback = t('ccf.placeholders.your_child');
    $$('.child-name', root).forEach(el => {
      el.textContent = (name && !name.startsWith('[')) ? name : fallback;
    });
  };
  applyNames();

  // --- Elements from your file ---
  const video       = $('.ccf-video');     // hero video element                       // :contentReference[oaicite:1]{index=1}
  const heroSection = $('.ccf-hero');      // hero section wrapper                      // :contentReference[oaicite:2]{index=2}
  const overlay     = $('#ccfOverlay');    // overlay text block                        // :contentReference[oaicite:3]{index=3}
  const audioBtn    = $('#ccfAudioToggle'); // clickable button                          // :contentReference[oaicite:4]{index=4}
  const audioIcon   = $('#ccfAudioIcon');  // text container for label                  // :contentReference[oaicite:5]{index=5}
  const scrollHint  = $('#ccfScrollIndicator');                                         // :contentReference[oaicite:6]{index=6}

  // --- Video helpers ---
  let isMuted = true;

  const primeVideo = (v) => {
    if (!v) return;
    v.muted = true;
    v.playsInline = true;
    v.setAttribute('playsinline', '');
    if (!v.hasAttribute('loop'))    v.setAttribute('loop', '');
    if (!v.hasAttribute('preload')) v.setAttribute('preload', 'metadata');
    v.removeAttribute('autoplay');
  };

  const ensureSrc = (v) => {
    if (!v) return;
    // If you use data-src on the video, attach it just-in-time (safe no-op otherwise)
    const ds = v.getAttribute('data-src');
    if (ds && !v.getAttribute('src')) v.setAttribute('src', ds);
  };

  const playWhenReady = async (v) => {
    if (!v) return;
    try {
      primeVideo(v);
      if (v.readyState < 2) {
        await new Promise((resolve) => {
          const onCanPlay = () => { v.removeEventListener('canplay', onCanPlay); resolve(); };
          v.addEventListener('canplay', onCanPlay, { once: true });
          v.load();
        });
      }
      await v.play();
      // console.log('CCF video playing');
    } catch (e) {
      // console.log('CCF autoplay deferred', e?.name || e);
    }
  };

  const pauseAndReset = (v) => {
    if (!v) return;
    v.pause();
    try { v.currentTime = 0; } catch (_) {}
  };

  // --- Precise “play on entry / pause+reset on exit” ---
  if (video && heroSection) {
    // Fire as the section touches the top ~10% of viewport
    const enterOpts = { root: null, rootMargin: '0px 0px -90% 0px', threshold: 0.01 };
    const leaveOpts = { root: null, rootMargin: '0px', threshold: 0 };

    const enterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          ensureSrc(video);
          playWhenReady(video);
          // Fade overlay after 15s (kept)
          if (overlay) {
            setTimeout(() => {
              overlay.style.transition = 'opacity 1s ease-out';
              overlay.style.opacity = '0';
            }, 15000);
          }
        }
      });
    }, enterOpts);

    const leaveObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          pauseAndReset(video);
          // Reset overlay for next entry
          if (overlay) {
            overlay.style.transition = '';
            overlay.style.opacity = '1';
          }
        }
      });
    }, leaveOpts);

    enterObs.observe(heroSection);
    leaveObs.observe(heroSection);
  }

  // --- Auto-mute when scrolled away (kept, complements leave observer) ---
  const handleScroll = () => {
    if (!video || !heroSection) return;
    const rect = heroSection.getBoundingClientRect();
    const visible = rect.top < window.innerHeight && rect.bottom > 0;
    if (!visible && !video.muted) {
      video.muted = true;
      isMuted = true;
      updateMuteLabel();
      // console.log('CCF auto-muted on scroll away');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  // --- Sound button (fixed labels + aria) ---
  const updateMuteLabel = () => {
    const label = isMuted ? t('ccf.ui.click_to_unmute') : t('ccf.ui.click_to_mute');
    if (audioIcon) audioIcon.textContent = label;
    if (audioBtn)  audioBtn.setAttribute('aria-label', label);
  };
  updateMuteLabel();

  if (audioBtn && video) {
    audioBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      video.muted = isMuted;
      updateMuteLabel();
      if (!isMuted && video.paused) {
        video.play().catch(() => {});
      }
    });
  }

  // --- Scroll indicator (kept) ---
  if (scrollHint) {
    setTimeout(() => scrollHint.classList.add('show'), 2000);
    scrollHint.addEventListener('click', () => {
      const services = root.querySelector('.ccf-services-section');
      if (services) services.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // --- Lazy images (kept) ---
  if (typeof hydrateLazyAssets === 'function') {
    hydrateLazyAssets(root);
  }

  // console.log('CCF module initialised');
};
