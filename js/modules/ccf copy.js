/* ===== CCF Module (mirrors hero MP4 behaviour) ===== */
MODULES['ccf'] = (root, ctx) => {
  const $ = (sel, p = root) => p.querySelector(sel);
  const $$ = (sel, p = root) => Array.from(p.querySelectorAll(sel));

  // Personalisation
  const applyNames = () => {
    const name = (ctx?.childName || '').trim();
    const fallback = 'Your child';
    $$('.child-name', root).forEach(el => {
      el.textContent = (name && !name.startsWith('[')) ? name : fallback;
    });
  };
  applyNames();

  // VIDEO SETUP
  let isMuted = true;
  
  const primeVideo = (video) => {
    if (!video) return;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    if (!video.hasAttribute('loop')) video.setAttribute('loop', '');
    if (!video.hasAttribute('preload')) video.setAttribute('preload', 'metadata');
    video.removeAttribute('autoplay');
  };

  const loadVideo = (video) => {
    if (!video) return;
    console.log('Loading CCF video');

    primeVideo(video);

    if (!video._dbgBound) {
      video.addEventListener('loadedmetadata', () => console.log('CCF video metadata loaded'));
      video.addEventListener('canplay', () => console.log('CCF video can play'));
      video.addEventListener('error', (e) => console.error('CCF video error:', e));
      video._dbgBound = true;
    }

    video.play().then(() => {
      console.log('CCF video playing');
    }).catch(e => {
      console.log('CCF autoplay deferred:', e?.name || e);
    });
  };

  // LAZY LOAD VIDEO ON SCROLL
  const video = $('.ccf-video');
  const heroSection = $('.ccf-hero');
  const overlay = $('#ccfOverlay');
  const audioBtn = $('#ccfAudioToggle');
  const audioIcon = $('#ccfAudioIcon');
  
  if (video && heroSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          console.log('CCF hero entered viewport - starting video');
          loadVideo(video);
          
          // Fade out text after 15 seconds
          setTimeout(() => {
            if (overlay) {
              overlay.style.transition = 'opacity 1s ease-out';
              overlay.style.opacity = '0';
            }
          }, 15000);
          
          observer.unobserve(heroSection);
        }
      });
    }, {
      threshold: 0.4,
      rootMargin: '0px 0px -10% 0px'
    });

    observer.observe(heroSection);
  }

  // AUTO-MUTE ON SCROLL AWAY
  const handleScroll = () => {
    if (!video || !heroSection) return;
    
    const rect = heroSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (!isVisible && !video.muted) {
      video.muted = true;
      isMuted = true;
      if (audioIcon) audioIcon.textContent = 'Click to unmute';
      console.log('CCF video auto-muted - scrolled away');
    }
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });

  // AUDIO TOGGLE - FIXED VERSION
  const updateMuteLabel = () => {
    if (!audioIcon) return;
    audioIcon.textContent = isMuted ? 'Click to unmute' : 'Click to mute';
  };
  updateMuteLabel();
  
  // CRITICAL FIX: Ensure button and video are properly connected
  if (audioBtn && video) {
    console.log('CCF: Audio button found, attaching click listener');
    
    audioBtn.addEventListener('click', () => {
      console.log('CCF: Audio button clicked');
      
      // Toggle mute state
      isMuted = !isMuted;
      video.muted = isMuted;
      updateMuteLabel();
      
      console.log(`CCF: Video ${isMuted ? 'muted' : 'unmuted'}`);
      
      // If unmuting and video is paused, try to play
      if (!isMuted && video.paused) {
        video.play().catch((err) => {
          console.error('CCF: Could not play video:', err);
        });
      }
    });
  } else {
    console.warn('CCF: Audio button or video not found', { audioBtn: !!audioBtn, video: !!video });
  }

  // SCROLL INDICATOR
  const scrollHint = $('#ccfScrollIndicator');
  
  if (scrollHint) {
    setTimeout(() => {
      scrollHint.classList.add('show');
    }, 2000);
    
    scrollHint.addEventListener('click', () => {
      const servicesSection = root.querySelector('.ccf-services-section');
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Lazy load images
  if (typeof hydrateLazyAssets === 'function') {
    hydrateLazyAssets(root);
  }

  console.log('CCF module initialization complete');
};