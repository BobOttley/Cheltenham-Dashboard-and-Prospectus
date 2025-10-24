MODULES['house_system'] = (root, ctx) => {
  // Name personalization
  root.querySelectorAll('.child-name').forEach(el => {
    const fallback = el.getAttribute('data-fallback') || 'Your child';
    const name = (ctx.childName || '').trim();
    el.textContent = name && !name.startsWith('[') ? name : fallback;
  });

  // Pastoral emphasis note
  const note = root.querySelector('.house-personality-note');
  if (note) {
    if (ctx?.priorities?.pastoral === 3) {
      note.textContent = `I'm pleased you value pastoral care so highly - ${ctx.childName || 'your child'}'s wellbeing will always be our priority.`;
    } else {
      note.style.display = 'none';
    }
  }

  // Simple gender and boarding detection to match enquiry form
  const getGender = () => {
    const raw = (ctx.gender || '').toString().toLowerCase().trim();
    if (raw === 'female') return 'female';
    if (raw === 'male') return 'male';
    return '';
  };

  const getBoarding = () => {
    const raw = (ctx.boardingPreference || '').toString().toLowerCase().trim();
    if (raw.includes('day')) return 'day';
    if (raw.includes('boarding')) return 'boarding';
    return '';
  };

  const gender = getGender();
  const pref = getBoarding();

  console.log('House filtering - Gender:', gender, 'Boarding:', pref);

  // Filter houses by gender and boarding preference
  root.querySelectorAll('.house-card').forEach(card => {
    const cardGender = (card.dataset.gender || '').toLowerCase();
    const cardType = (card.dataset.type || '').toLowerCase();
    
    let show = true;
    
    if (gender && cardGender && gender !== cardGender) {
      show = false;
    }
    
    if (pref === 'day' && cardType === 'boarding') {
      show = false;
    } else if (pref === 'boarding' && cardType === 'day') {
      show = false;
    }
    
    card.style.display = show ? 'block' : 'none';
  });

  // Lazy load images
  if (typeof hydrateLazyAssets === 'function') {
    hydrateLazyAssets(root);
  }

  // ===== NEW VIDEO MANAGEMENT FOR MP4 FILES - OPTIMIZED FOR MOBILE =====
  
  // Utility: Prime video for mobile autoplay (critical for iOS/Safari)
  const primeVideo = (video) => {
    if (!video) return;
    video.muted = true;
    video.playsInline = true;            // JS property
    video.setAttribute('playsinline', ''); // iOS attribute  
    video.setAttribute('autoplay', '');
    video.setAttribute('loop', '');
    video.setAttribute('preload', 'metadata'); // Only load metadata until play
  };

  // LAZY LOAD: Set video source from data-src (only called on expand)
  const loadVideoSource = (video) => {
    if (!video) return;
    
    const dataSrc = video.getAttribute('data-src');
    if (!dataSrc || video.src) return;
    
    video.src = dataSrc;
    video.load();
    console.log('Lazy loaded video:', dataSrc);
  };

  // Play video when card expands
  const playVideo = (video) => {
    if (!video) return;
    
    primeVideo(video);        // Prime for mobile
    loadVideoSource(video);   // Lazy load source
    
    // Small delay to ensure source is loaded
    setTimeout(() => {
      video.play().catch(err => {
        console.log('House video autoplay blocked:', err);
      });
    }, 100);
  };

  // Stop video when card collapses
  const stopVideo = (video) => {
    if (!video) return;
    video.pause();
    video.currentTime = 0;
    video.muted = true;
  };

  // Expand/collapse functionality with EVENT DELEGATION
  root.addEventListener('click', (e) => {
    // Handle expand buttons
    if (e.target.classList.contains('expand-button')) {
      e.preventDefault();
      e.stopPropagation();
      
      const card = e.target.closest('.house-card');
      if (!card) return;
      
      const details = card.querySelector('.house-details');
      if (!details) return;
      
      const isExpanded = card.classList.contains('expanded');
      
      // Close all other expanded cards
      root.querySelectorAll('.house-card.expanded').forEach(otherCard => {
        if (otherCard !== card) {
          otherCard.classList.remove('expanded');
          const otherDetails = otherCard.querySelector('.house-details');
          const otherVideo = otherCard.querySelector('.house-video');
          if (otherDetails) {
            otherDetails.style.display = 'none';
            otherDetails.setAttribute('hidden', '');
          }
          if (otherVideo) stopVideo(otherVideo);
        }
      });

      if (!isExpanded) {
        // Expand this card
        card.classList.add('expanded');
        details.style.display = 'block';
        details.removeAttribute('hidden');
        
        const video = card.querySelector('.house-video');
        if (video) playVideo(video);
        
        setTimeout(() => {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      } else {
        // Collapse this card
        card.classList.remove('expanded');
        details.style.display = 'none';
        details.setAttribute('hidden', '');
        
        const video = card.querySelector('.house-video');
        if (video) stopVideo(video);
      }
      return;
    }

    // Handle mute buttons - TOGGLE audio on/off
    if (e.target.classList.contains('mute-button')) {
      e.preventDefault();
      e.stopPropagation();
      
      const card = e.target.closest('.house-card');
      const video = card?.querySelector('.house-video');
      if (!video) return;
      
      // Ensure video source is loaded
      loadVideoSource(video);
      
      // Toggle mute state
      if (video.muted) {
        // Unmute
        video.muted = false;
        video.volume = 1.0;
        e.target.innerHTML = '🔇 Click to Mute';
        console.log('House video unmuted');
        
        // If paused, play it
        if (video.paused) {
          video.play().catch(err => {
            console.error('Could not play video:', err);
          });
        }
      } else {
        // Mute
        video.muted = true;
        e.target.innerHTML = '🔊 Click for Sound';
        console.log('House video muted');
      }
      return;
    }

    // Handle close buttons
    if (e.target.classList.contains('close-button')) {
      e.preventDefault();
      e.stopPropagation();
      
      const card = e.target.closest('.house-card');
      if (!card) return;
      
      card.classList.remove('expanded');
      const details = card.querySelector('.house-details');
      if (details) {
        details.style.display = 'none';
        details.setAttribute('hidden', '');
        const video = card.querySelector('.house-video');
        if (video) stopVideo(video);
      }
      return;
    }
  });

  // Auto-mute videos when scrolling away
  const setupAutoMute = () => {
    const checkVideoVisibility = () => {
      const expandedCards = root.querySelectorAll('.house-card.expanded');
      
      expandedCards.forEach(card => {
        const video = card.querySelector('.house-video');
        if (!video || !video.src) return;
        
        const rect = video.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        // If video is out of view and not muted, mute it
        if (!isVisible && !video.muted) {
          video.muted = true;
          const btn = card.querySelector('.mute-button');
          if (btn) btn.innerHTML = '🔊 Click for Sound';
          console.log('House video auto-muted - scrolled out of view');
        }
      });
    };

    // Throttled scroll handler
    let scrollTimeout;
    const handleScroll = () => {
      if (scrollTimeout) return;
      scrollTimeout = setTimeout(() => {
        checkVideoVisibility();
        scrollTimeout = null;
      }, 200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  };

  setupAutoMute();
};