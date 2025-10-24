/* ====== FINAL HERO MODULE — precise autoplay on entry + fixed sound labels ====== */
MODULES['final_hero'] = (root, ctx) => {
  const $  = (sel, p = root) => p.querySelector(sel);
  const $$ = (sel, p = root) => Array.from(p.querySelectorAll(sel));

  // --- i18n with safe fallback ---
  const RAW_T = (window.PEN_I18N && typeof window.PEN_I18N.t === 'function') ? window.PEN_I18N.t : null;
  const t = (key, params) => {
    try {
      const val = RAW_T ? RAW_T(key, params) : '';
      if (val && String(val).trim()) return val;
    } catch (_) {}
    // Minimal English fallbacks used here
    if (key === 'final_hero.placeholders.child')   return 'your child';
    if (key === 'final_hero.ui.click_to_unmute')   return 'CLICK TO UNMUTE';
    if (key === 'final_hero.ui.click_to_mute')     return 'CLICK TO MUTE';
    return '';
  };

  // --- Personalisation (kept from your file) ---
  $$('.child-name').forEach(el => {
    const name = (ctx.childName || '').trim();
    el.textContent = (name && !name.startsWith('[')) ? name : (t('final_hero.placeholders.child') || 'your child');
  });

  // --- Vision (kept) ---
  const visionEls = $$('.fh-personal-vision');
  if (visionEls.length) {
    let vision = '';
    const childName = ctx.childName || (t('final_hero.placeholders.child') || 'your child');
    if (ctx.priorities?.academic === 3 && (ctx.universityAspirations === 'Oxford or Cambridge' || ctx.universityAspirations === 'Oxbridge')) {
      vision = t('final_hero.visions.oxbridge_academic', { childName }) ||
        `${childName}, picture yourself amongst the intellectual elite at Oxford or Cambridge, debating philosophy in historic halls, conducting groundbreaking research, and joining the ranks of Nobel laureates and world leaders. Your journey begins here, where we'll nurture your academic brilliance and prepare you for entry to the world's most prestigious universities.`;
    } else if (ctx.priorities?.activities === 3 && ctx.activities?.includes('leadership')) {
      vision = t('final_hero.visions.leadership_activities', { childName }) ||
        `${childName}, imagine yourself as Head of House, leading school initiatives, inspiring peers, and developing the confidence and skills that will define your future. At Cheltenham, leadership isn't taught - it's discovered, nurtured, and celebrated in every aspect of school life.`;
    } else if (ctx.boardingPreference === 'Full Boarding' || ctx.boardingPreference === 'boarding') {
      vision = t('final_hero.visions.boarding', { childName }) ||
        `${childName}, boarding at Cheltenham means waking up in a community that becomes your second home, building friendships that will last a lifetime, and experiencing the independence and maturity that comes from living alongside peers who share your ambitions and values.`;
    } else {
      vision = t('final_hero.visions.default', { childName }) ||
        `${childName}, your time at Cheltenham will be transformative. Here, you'll discover talents you never knew you had, push past boundaries you thought were fixed, and become the person you're meant to be - confident, compassionate, and ready to make your mark on the world.`;
    }
    visionEls.forEach(el => { el.textContent = vision; });
  }

  // --- Conclusion (kept) ---
  const conclusionEl = $('.fh-personal-conclusion');
  if (conclusionEl) {
    let conclusion = '';
    const childName = ctx.childName || (t('final_hero.placeholders.child') || 'your child');
    if (ctx.priorities?.pastoral === 3) {
      conclusion = t('final_hero.conclusions.pastoral_high', { childName }) ||
        `The friendships, support, and sense of belonging shown in this video await ${childName}. In our House system, every student finds their place, their voice, and their people.`;
    } else if (ctx.activities?.includes('leadership') && ctx.priorities?.activities === 3) {
      conclusion = t('final_hero.conclusions.leadership_activities_high', { childName }) ||
        `Every position of responsibility, every captaincy, every initiative you've just seen represents opportunity. Next year, that could be ${childName} - leading a team, organizing an event, mentoring younger pupils.`;
    } else if (ctx.priorities?.academic === 3) {
      conclusion = t('final_hero.conclusions.academic_high', { childName }) ||
        `Every academic achievement celebrated in this video represents hours of dedication and inspired teaching. ${childName} will join this tradition of excellence.`;
    } else {
      conclusion = t('final_hero.conclusions.default', { childName }) ||
        `This video captures what makes Cheltenham College extraordinary. For ${childName}, it represents not just the next chapter, but the beginning of an extraordinary journey.`;
    }
    conclusionEl.textContent = conclusion;
  }

  // --- Tagline (kept) ---
  const taglineEl = $('.fh-personal-tagline');
  if (taglineEl) {
    if ((ctx.universityAspirations === 'Oxford or Cambridge' || ctx.universityAspirations === 'Oxbridge') && ctx.priorities?.academic === 3) {
      const translated = t('final_hero.taglines.oxbridge_academic');
      if (translated) taglineEl.textContent = translated;
    } else if (ctx.activities?.includes('leadership') && ctx.priorities?.activities === 3) {
      const translated = t('final_hero.taglines.leadership_activities');
      if (translated) taglineEl.textContent = translated;
    } else if (ctx.boardingPreference === 'Full Boarding' || ctx.boardingPreference === 'boarding') {
      const translated = t('final_hero.taglines.boarding');
      if (translated) taglineEl.textContent = translated;
    }
    // else: keep default HTML
  }

  // --- Elements from your current file ---
  const video      = $('.fh-hero-video');           // hero video element            // uses your existing selector
  const overlay    = $('.fh-overlay-content');      // overlay text block
  const belowText  = $('.fh-text-below-video');     // text that appears after 20s
  const audioBtn   = $('#audioToggle');             // sound toggle button           // same id as in your file
  // (Selectors match your uploaded file.) :contentReference[oaicite:1]{index=1}

  // --- Video helpers for precise timing ---
  const primeVideo = (v) => {
    if (!v) return;
    v.muted = true;
    v.playsInline = true;
    v.setAttribute('playsinline', '');
    v.removeAttribute('autoplay');
    if (!v.hasAttribute('preload')) v.setAttribute('preload', 'metadata');
    if (!v.hasAttribute('loop'))    v.setAttribute('loop', '');
  };

  const ensureSrc = (v) => {
    if (!v) return;
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
    } catch (_) { /* ignore autoplay blocks while muted */ }
  };

  const pauseAndReset = (v) => {
    if (!v) return;
    v.pause();
    try { v.currentTime = 0; } catch (_) {}
  };

  // --- Precise “play on entry / pause+reset on exit” observers ---
  if (video) {
    // Trigger right as the module enters (top ~10% of the viewport)
    const enterOpts = { root: null, rootMargin: '0px 0px -90% 0px', threshold: 0.01 };
    const leaveOpts = { root: null, rootMargin: '0px', threshold: 0 };

    const enterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          ensureSrc(video);
          playWhenReady(video);

          // Keep your 20s overlay fade/move (unchanged)
          if (overlay && belowText) {
            setTimeout(() => {
              overlay.style.opacity = '0';
              belowText.classList.add('visible');
            }, 20000);
          }
        }
      });
    }, enterOpts);

    const leaveObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          pauseAndReset(video);
          // Reset overlay/text for next entry
          if (overlay) overlay.style.opacity = '1';
          if (belowText) belowText.classList.remove('visible');
        }
      });
    }, leaveOpts);

    // Observe the whole module root so timing aligns with entering this module
    enterObs.observe(root);
    leaveObs.observe(root);
  }

  // --- Sound button: fixed labels + aria (like Sports) ---
  const updateSoundLabel = () => {
    if (!audioBtn || !video) return;
    const label = video.muted ? (t('final_hero.ui.click_to_unmute') || 'CLICK TO UNMUTE')
                              : (t('final_hero.ui.click_to_mute')   || 'CLICK TO MUTE');
    audioBtn.textContent = label;
    audioBtn.setAttribute('aria-label', label);
  };
  updateSoundLabel();

  if (audioBtn && video) {
    audioBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      video.muted = !video.muted;
      updateSoundLabel();
      if (!video.muted && video.paused) {
        video.play().catch(() => {});
      }
    });
  }

  // --- Auto-mute when scrolled away (compliments leave observer) ---
  const handleScroll = () => {
    if (!video) return;
    const rect = root.getBoundingClientRect();
    const visible = rect.top < window.innerHeight && rect.bottom > 0;
    if (!visible && !video.muted) {
      video.muted = true;
      updateSoundLabel();
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  // --- Lazy assets (kept) ---
  if (typeof hydrateLazyAssets === 'function') {
    hydrateLazyAssets(root);
  }

  // console.log('Final Hero module initialised for:', ctx.childName);
};
