/* ====== FINAL HERO MODULE - FIXED BUTTON VERSION ====== */
MODULES['final_hero'] = (root, ctx) => {
  console.log('Final Hero module initializing for:', ctx.childName);
  
  const $ = (sel, context = root) => context.querySelector(sel);
  
  // Update child names
  root.querySelectorAll('.child-name').forEach(el => {
    const name = (ctx.childName || '').trim();
    el.textContent = name && !name.startsWith('[') ? name : 'Child';
  });
  
  // Customize vision statement
  const visionEls = root.querySelectorAll('.fh-personal-vision');
  if (visionEls.length > 0) {
    let vision = '';
    
    if (ctx.priorities?.academic === 3 && (ctx.universityAspirations === 'Oxford or Cambridge' || ctx.universityAspirations === 'Oxbridge')) {
      vision = `${ctx.childName}, imagine yourself among the intellectual elite at Oxbridge, debating philosophy in historic halls, conducting groundbreaking research, and joining a lineage of Nobel laureates and world leaders. Your journey begins here, where we'll nurture your academic brilliance and prepare you for the most prestigious universities in the world.`;
    } else if (ctx.priorities?.activities === 3 && ctx.activities?.includes('leadership')) {
      vision = `${ctx.childName}, picture yourself as Head of House, leading school initiatives, inspiring your peers, and developing the confidence and skills that will define your future. At Cheltenham, leadership isn't taught—it's discovered, nurtured, and celebrated in every aspect of school life.`;
    } else if (ctx.boardingPreference === 'Full Boarding' || ctx.boardingPreference === 'boarding') {
      vision = `${ctx.childName}, boarding at Cheltenham means waking up in a community that becomes your second family, forming friendships that will last a lifetime, and experiencing the independence and maturity that comes from living among peers who share your ambitions and values.`;
    } else {
      vision = `${ctx.childName}, your time at Cheltenham will be transformative. Here, you'll discover talents you never knew you had, push boundaries you thought were fixed, and become the person you're meant to be—confident, compassionate, and ready to make your mark on the world.`;
    }
    
    visionEls.forEach(el => el.textContent = vision);
  }
  
  // Customize conclusion
  const conclusionEl = $('.fh-personal-conclusion', root);
  if (conclusionEl) {
    let conclusion = '';
    
    if (ctx.priorities?.pastoral === 3) {
      conclusion = `The friendships, support, and sense of belonging shown in this video are what awaits ${ctx.childName}. In our House system, every pupil finds their place, their voice, and their people.`;
    } else if (ctx.activities?.includes('leadership') && ctx.priorities?.activities === 3) {
      conclusion = `Every position of responsibility, every team captaincy, every initiative you've just seen represents opportunity. Next year, that could be ${ctx.childName} - captaining teams, organizing events, mentoring younger pupils.`;
    } else if (ctx.priorities?.academic === 3) {
      conclusion = `Every academic achievement celebrated in this video represents hours of dedication and inspired teaching. ${ctx.childName} will join this tradition of excellence.`;
    } else {
      conclusion = `This video captures what makes Cheltenham College extraordinary. For ${ctx.childName}, this represents not just the next chapter, but the beginning of a remarkable journey.`;
    }
    
    conclusionEl.textContent = conclusion;
  }
  
  // Customize tagline
  const taglineEl = $('.fh-personal-tagline', root);
  if (taglineEl) {
    if ((ctx.universityAspirations === 'Oxford or Cambridge' || ctx.universityAspirations === 'Oxbridge') && ctx.priorities?.academic === 3) {
      taglineEl.textContent = 'Where Oxbridge dreams take flight and academic excellence knows no bounds';
    } else if (ctx.activities?.includes('leadership') && ctx.priorities?.activities === 3) {
      taglineEl.textContent = 'Where tomorrow\'s leaders discover their voice and learn to inspire others';
    } else if (ctx.boardingPreference === 'Full Boarding' || ctx.boardingPreference === 'boarding') {
      taglineEl.textContent = 'Where boarding life creates bonds that last forever and memories that define you';
    }
  }
  
  // VIDEO LOADING - Only when module enters view
  const video = $('.fh-hero-video', root);
  if (video) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        console.log('Final Hero module entered view - starting video');
        
        // Start the video when the module comes into view
        video.play().catch(e => console.log('Video play failed:', e));
        
        observer.unobserve(root);
        
        // Setup sound control for video element
        setupSoundControl();
        
        // Text timer - 20 seconds after video starts
        setTimeout(() => {
          const overlay = $('.fh-overlay-content', root);
          const below = $('.fh-text-below-video', root);
          if (overlay && below) {
            overlay.style.opacity = '0';
            below.classList.add('visible');
            console.log('Final Hero: Text moved down after 20 seconds');
          }
        }, 20000);
      }
    }, { 
      threshold: 0.1, // Less aggressive - starts when 10% visible
      rootMargin: '50px 0px 0px 0px'  // Start earlier
    });
    
    observer.observe(root);
  }
  
  // FIXED: Setup sound control - matches sports module logic
  function setupSoundControl() {
    const video = root.querySelector('.fh-hero-video');
    const audioToggle = root.querySelector('#audioToggle');
    
    if (audioToggle && video) {
      audioToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Final Hero unmute button clicked');
        
        // Simple toggle - button text shows what clicking WILL do
        if (video.muted) {
          // Currently muted - unmute it
          video.muted = false;
          video.volume = 1.0;
          audioToggle.textContent = 'CLICK TO MUTE'; // Now playing, so show "click to mute"
          console.log('Final Hero video unmuted');
          
          // Try to play if paused
          if (video.paused) {
            video.play().catch(err => console.error('Could not play video:', err));
          }
        } else {
          // Currently unmuted - mute it
          video.muted = true;
          audioToggle.textContent = 'CLICK TO UNMUTE'; // Now muted, so show "click to unmute"
          console.log('Final Hero video muted');
        }
      });
    }
  }
  
  console.log('Final Hero module initialized for:', ctx.childName);
};