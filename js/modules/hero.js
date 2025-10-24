/* Hero module initializer */
MODULES['hero'] = (root, ctx) => {
  const $ = (sel, p = root) => p.querySelector(sel);
  const $$ = (sel, p = root) => Array.from(p.querySelectorAll(sel));
  
  // Translation function
  const t = (window.PEN_I18N && typeof window.PEN_I18N.t === 'function')
    ? window.PEN_I18N.t
    : () => '';

  // Personal text
  $$('.child-name').forEach(el => el.textContent = ctx.childName || '');
  $$('.parent-name').forEach(el => el.textContent = ctx.parentName || '');
  $$('.family-name').forEach(el => el.textContent = ctx.familyName || '');

  // Get elements
  const video = $('.hero-video');
  const audioToggle = $('#audioToggle');
  const audioIcon = $('#audioIcon');
  const overlay = $('#heroOverlay');
  const scrollIndicator = $('#scrollIndicator');

  // Setup sound control - FIXED VERSION
  function setupSoundControl() {
    if (!audioToggle || !video) {
      console.log('Hero: Missing audio button or video element');
      return;
    }

    // Set initial state
    video.muted = true;
    
    const updateButtonText = () => {
      const label = video.muted 
        ? (t('hero.ui.click_to_unmute') || 'CLICK TO UNMUTE')
        : (t('hero.ui.click_to_mute') || 'CLICK TO MUTE');
      
      if (audioIcon) {
        audioIcon.textContent = label;
      } else {
        audioToggle.textContent = label;
      }
      audioToggle.setAttribute('aria-label', label);
    };

    // Initialize button text
    updateButtonText();

    // Add click event listener
    audioToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('Hero unmute button clicked');
      
      // Toggle mute state
      video.muted = !video.muted;
      
      if (!video.muted) {
        video.volume = 1.0;
        console.log('Hero video unmuted');
        
        // Try to play if paused
        if (video.paused) {
          video.play().catch(err => console.error('Could not play video:', err));
        }
      } else {
        console.log('Hero video muted');
      }
      
      // Update button text
      updateButtonText();
    });
  }

  // Call the setup function
  setupSoundControl();

  // Overlay movement timer (12 seconds)
  if (overlay) {
    setTimeout(() => {
      overlay.classList.add('move-bottom');
      if (scrollIndicator) {
        setTimeout(() => scrollIndicator.classList.add('show'), 300);
      }
    }, 12000);
  }

  // Scroll indicator click handler
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    });
  }

  // Auto-mute on scroll away
  const handleScroll = () => {
    if (!video) return;
    if (window.scrollY > 50 && !video.muted) {
      video.muted = true;
      if (audioIcon) {
        audioIcon.textContent = t('hero.ui.click_to_unmute') || 'CLICK TO UNMUTE';
      } else if (audioToggle) {
        audioToggle.textContent = t('hero.ui.click_to_unmute') || 'CLICK TO UNMUTE';
      }
    }
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Lazy load assets
  if (typeof hydrateLazyAssets === 'function') {
    hydrateLazyAssets(root);
  }

  console.log('Hero module initialized for:', ctx.childName);
};