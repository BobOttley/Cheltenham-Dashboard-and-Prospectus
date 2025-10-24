/* ====== SPORTS MODULE WITH MP4 VIDEO SUPPORT ONLY - NO IFRAMES ====== */
MODULES['sports'] = (root, ctx) => {
  console.log('=== SPORTS MODULE INIT DEBUG ===');
  console.log('Full context received:', ctx);
  console.log('Specific sports:', ctx.specificSports);
  console.log('Child name:', ctx.childName);
  console.log('================================');

  // ---- SAFE TRANSLATION WRAPPER WITH ENGLISH FALLBACK ----
  const RAW_T = (window.PEN_I18N && typeof window.PEN_I18N.t === 'function') ? window.PEN_I18N.t : null;

  // Minimal English dictionary used as fallback when no i18n key/value is available.
  const EN_DICT = {
    sports: {
      placeholders: { child: 'Child' },
      ui: {
        show_more: 'Show more sports',
        hide_details: 'Hide sports details',
        click_to_mute: 'CLICK TO MUTE',
        click_to_unmute: 'CLICK TO UNMUTE'
      },
      gender_rugby: {
        tab: 'RUGBY',
        title: 'RUGBY AT CHELTENHAM',
        hero_title: 'Strength, Strategy, Success',
        subtitle: 'Elite Rugby Programme with International Recognition',
        stat1: '15+',
        label1: 'Teams',
        stat2: '12',
        label2: 'Pitches',
        stat3: '2',
        label3: 'Annual Tours'
      },
      gender_netball: {
        tab: 'NETBALL',
        title: 'NETBALL AT CHELTENHAM',
        hero_title: 'Precision, Power, Performance',
        subtitle: 'Elite Netball Programme with National Recognition',
        stat1: '12',
        label1: 'Teams',
        stat2: '6',
        label2: 'Courts'
      },
      personal: {
        interest_note_sports: '{childName}, with your passion for sports already evident, ',
        interest_note_general: '{childName}, ',
        highlight_default: 'Hockey • Athletics • Tennis • Plus Many More Sports to Explore'
      },
      sports: {
        hockey_title: 'Hockey Excellence',
        hockey_details: "{childName}, you'll train on our two Olympic-standard water-based Astro pitches alongside 20+ teams of passionate players. With professional coaching from former international players, you'll develop advanced stick skills, tactical awareness, and game intelligence. Regular fixtures against top schools like Millfield and Marlborough, plus National Finals appearances, will challenge you at the highest level.",
        hockey_highlight: 'U18 National Finals 2024 • Perfect for {childName}',

        athletics_title: 'Athletics Programme',
        athletics_details: "{childName}, our athletics facilities will be your training ground for excellence. Whether you excel in sprints, middle-distance, throws, or jumps, our specialist coaches will develop your technique through biomechanical analysis. You'll compete in prestigious events including English Schools Championships and ISA Championships.",
        athletics_highlight: '3 National Medallists • County Champions • Ideal for {childName}',

        tennis_title: 'Tennis Development',
        tennis_details: "{childName}, with 12 hard courts, 6 grass courts, and 4 indoor courts at your disposal, you'll have year-round opportunities to perfect your game. Our LTA licensed coaches provide both individual and group coaching tailored to your skill level.",
        tennis_highlight: 'National Schools Finalists • LTA Regional Centre',

        rugby_title: 'Rugby Excellence',
        rugby_details: "{childName}, you'll join 15+ teams from U13 to 1st XV competing at the highest level. Twelve full-size pitches including floodlit training areas provide the perfect environment for your development.",
        rugby_highlight: 'U18 National Champions • England Internationals',

        netball_title: 'Netball Excellence',
        netball_details: "{childName}, you'll compete with 12 teams from U13 to 1st VII at regional and national level. Six outdoor courts and indoor facilities provide year-round training opportunities.",
        netball_highlight: 'Regional Champions • National Top 10',

        cricket_title: 'Cricket Excellence',
        cricket_details: "{childName}, you'll train on our professional standard cricket square with 12 pitches. Indoor cricket centre with bowling machines and video analysis provides year-round development.",
        cricket_highlight: 'County Cup Winners • MCC Coaching',

        swimming_title: 'Swimming Excellence',
        swimming_details: "{childName}, you'll train in our 25m six-lane heated indoor pool with electronic timing systems. Daily squad training from 6:30am develops competitive swimming skills.",
        swimming_highlight: 'Regional Champions • 8 County Swimmers',

        rowing_title: 'Rowing Excellence',
        rowing_details: "{childName}, our state-of-the-art boathouse on River Severn houses a fleet of 50+ boats. Compete at Henley Royal Regatta and National Schools' Regatta.",
        rowing_highlight: 'Henley Qualifiers • GB Juniors Pipeline',

        squash_title: 'Squash Excellence',
        squash_details: "{childName}, you'll train on four glass-backed championship courts in our dedicated squash centre. Professional coaching from former PSA tour players provides individual support.",
        squash_highlight: 'Top 10 UK School • County Training Venue',

        badminton_title: 'Badminton Excellence',
        badminton_details: "{childName}, you'll compete in our four-court sports hall with specialist badminton flooring. Teams compete in National Schools Championships and county leagues.",
        badminton_highlight: 'County Champions • Regional Finals',

        basketball_title: 'Basketball Excellence',
        basketball_details: "{childName}, you'll play on indoor courts with professional hoops and electronic scoreboards. Boys' and girls' teams compete in regional leagues with American-style coaching methods.",
        basketball_highlight: 'Regional League Winners • National Schools Qualifiers',

        football_title: 'Football Excellence',
        football_details: "{childName}, you'll train on our 3G all-weather pitch and multiple grass pitches. FA qualified coaches including UEFA B license holders provide expert guidance.",
        football_highlight: 'ISFA Regional Champions • County Cup Semi-Finals',

        cross_country_title: 'Cross Country Excellence',
        cross_country_details: "{childName}, you'll train across beautiful countryside routes with specialist distance coaching. Our winter programme builds endurance and mental toughness.",
        cross_country_highlight: 'County Champions • Regional Competitors',

        golf_title: 'Golf Excellence',
        golf_details: "{childName}, you'll benefit from partnerships with Cotswold Hills and Lilley Brook Golf Clubs. PGA professional coaching with video analysis and Trackman technology.",
        golf_highlight: 'ISGA Finals • 3 County Players',

        equestrian_title: 'Equestrian Excellence',
        equestrian_details: "{childName}, comprehensive programme covering showjumping, eventing, dressage, and polo. Partnership with local BHS approved centres. NSEA competitions including Schools Championships at Hickstead.",
        equestrian_highlight: 'NSEA National Qualifiers • Hickstead Competitors',

        clay_shooting_title: 'Clay Shooting Excellence',
        clay_shooting_details: "{childName}, partnership with premier local shooting grounds. CPSA qualified instruction in all disciplines. Compete in Schools Challenge and NSRA championships.",
        clay_shooting_highlight: 'Schools Challenge Finalists • CPSA Registered',

        polo_title: 'Polo Excellence',
        polo_details: "{childName}, introduction to polo at Edgeworth Polo Club. HPA coaching with horses provided. Compete in SUPA schools tournaments.",
        polo_highlight: 'SUPA Tournament Players • HPA Affiliated',

        water_polo_title: 'Water Polo Excellence',
        water_polo_details: "{childName}, train in our 25m pool with dedicated equipment. Boys' and girls' teams competing in regional leagues.",
        water_polo_highlight: 'Regional League • National Schools Competition',

        volleyball_title: 'Volleyball Excellence',
        volleyball_details: "{childName}, indoor volleyball in sports hall with competition-standard nets. Teams compete in National Schools competitions.",
        volleyball_highlight: 'Regional Competitors • Fastest Growing Sport',

        ultimate_title: 'Ultimate Frisbee Excellence',
        ultimate_details: "{childName}, mixed teams competing in school tournaments. Participate in UK Ultimate Junior tournaments.",
        ultimate_highlight: 'National Schools Tournament • Inclusive Sport Award',

        lacrosse_title: 'Lacrosse Excellence',
        lacrosse_details: "{childName}, you'll join our growing lacrosse programme with specialist coaching and competitive fixtures against other schools.",
        lacrosse_highlight: 'Growing Programme • Competitive Fixtures',

        rounders_title: 'Rounders Excellence',
        rounders_details: "{childName}, summer term sport with teams from U13 to 1st IX. County tournament participation including Lady Taverners competitions.",
        rounders_highlight: 'County Tournament Winners • Regional Finals'
      }
    }
  };

  // Helper: deep get by key path, e.g. "sports.sports.hockey_title"
  const getDeep = (obj, path) => path.split('.').reduce((o, k) => (o && o[k] != null ? o[k] : undefined), obj);

  // Render {placeholders} in fallback strings
  const renderParams = (str, params) => String(str).replace(/\{(\w+)\}/g, (_, p) => (params && params[p] != null ? params[p] : `{${p}}`));

  const t = (key, params = {}) => {
    let out = RAW_T ? RAW_T(key, params) : '';
    if (out && String(out).trim()) return out;

    const fallback = getDeep(EN_DICT, key);
    if (typeof fallback === 'string') return renderParams(fallback, params);

    return ''; // ultimate fallback
  };

  // Normalise incoming sport names to match our canonical keys ("Hockey", "Cross Country", etc.)
  const normaliseSport = (s) => {
    if (!s) return '';
    return s
      .toLowerCase()
      .replace(/[_-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, c => c.toUpperCase());
  };

  // Update name placeholders
  const updateChildNames = () => {
    const childName = ctx.childName || t('sports.placeholders.child');
    root.querySelectorAll('.child-name').forEach(el => {
      el.textContent = childName;
    });
  };

  // Update gender-specific section content (rugby or netball)
  const updateGenderContent = (sportType) => {
    const genderSection = root.querySelector('#gender-specific-section');
    if (!genderSection) return;

    const titleEl = genderSection.querySelector('.gender-sport-title');
    const heroTitleEl = genderSection.querySelector('.gender-sport-hero-title');
    const subtitleEl = genderSection.querySelector('.gender-sport-subtitle');
    
    const stats = genderSection.querySelectorAll('.sport-stats .stat-item');

    if (sportType === 'rugby') {
      if (titleEl) titleEl.textContent = t('sports.gender_rugby.title');
      if (heroTitleEl) heroTitleEl.textContent = t('sports.gender_rugby.hero_title');
      if (subtitleEl) subtitleEl.textContent = t('sports.gender_rugby.subtitle');
      
      if (stats[0]) {
        stats[0].querySelector('.stat-number').textContent = t('sports.gender_rugby.stat1');
        stats[0].querySelector('.stat-label').textContent = t('sports.gender_rugby.label1');
      }
      if (stats[1]) {
        stats[1].querySelector('.stat-number').textContent = t('sports.gender_rugby.stat2');
        stats[1].querySelector('.stat-label').textContent = t('sports.gender_rugby.label2');
      }
      if (stats[2]) {
        stats[2].querySelector('.stat-number').textContent = t('sports.gender_rugby.stat3');
        stats[2].querySelector('.stat-label').textContent = t('sports.gender_rugby.label3');
      }
    } else {
      if (titleEl) titleEl.textContent = t('sports.gender_netball.title');
      if (heroTitleEl) heroTitleEl.textContent = t('sports.gender_netball.hero_title');
      if (subtitleEl) subtitleEl.textContent = t('sports.gender_netball.subtitle');
      
      if (stats[0]) {
        stats[0].querySelector('.stat-number').textContent = t('sports.gender_netball.stat1');
        stats[0].querySelector('.stat-label').textContent = t('sports.gender_netball.label1');
      }
      if (stats[1]) {
        stats[1].querySelector('.stat-number').textContent = t('sports.gender_netball.stat2');
        stats[1].querySelector('.stat-label').textContent = t('sports.gender_netball.label2');
      }
      // Netball only has 2 stats, hide third if present
      if (stats[2]) {
        stats[2].style.display = 'none';
      }
    }
  };

  // Gender filtering tabs (Rugby/Netball labels etc.)
  const filterSportsByGender = () => {
    console.log('==========================================');
    console.log('🔍 filterSportsByGender() CALLED');
    console.log('🔍 Root element:', root);
    console.log('🔍 Root tagName:', root?.tagName);
    console.log('🔍 Root className:', root?.className);
    
    const gender = (ctx.gender || ctx.childGender || '').toLowerCase();
    console.log('🔍 Raw ctx.gender:', ctx.gender);
    console.log('🔍 Raw ctx.childGender:', ctx.childGender);
    console.log('🔍 Computed gender:', gender);
    
    // Update the gender-specific tab label
    const genderTab = root.querySelector('.gender-sport-tab');
    console.log('🔍 Gender tab found:', !!genderTab);
    if (genderTab) {
      if (gender === 'male' || gender === 'boy' || gender === 'boys') {
        genderTab.textContent = t('sports.gender_rugby.tab');
      } else {
        genderTab.textContent = t('sports.gender_netball.tab');
      }
    }

    // Update primary sport statement visibility - CONTAINERIZED
    const boysStatement = root.querySelector('.gender-statement.boys');
    const girlsStatement = root.querySelector('.gender-statement.girls');
    
    console.log('🔍 Boys statement element:', boysStatement);
    console.log('🔍 Girls statement element:', girlsStatement);
    console.log('🔍 Boys statement current display:', boysStatement?.style.display);
    console.log('🔍 Girls statement current display:', girlsStatement?.style.display);
    
    if (!boysStatement || !girlsStatement) {
      console.error('❌ CRITICAL: Gender statement elements NOT FOUND in root!');
      console.log('🔍 All elements in root:', root.querySelectorAll('*').length);
      console.log('🔍 Looking for .primary-sport-statement:', root.querySelector('.primary-sport-statement'));
      return;
    }
    
    // CRITICAL: Remove inline styles FIRST (they override JS)
    boysStatement.removeAttribute('style');
    girlsStatement.removeAttribute('style');
    console.log('✓ Removed inline styles');
    
    // Now set the correct one to show
    if (gender === 'male' || gender === 'boy' || gender === 'boys') {
      boysStatement.style.display = 'block';
      girlsStatement.style.display = 'none';
      console.log('✅ SET TO RUGBY (boys) - display: block');
    } else if (gender === 'female' || gender === 'girl' || gender === 'girls') {
      boysStatement.style.display = 'none';
      girlsStatement.style.display = 'block';
      console.log('✅ SET TO NETBALL (girls) - display: block');
    } else {
      console.warn('⚠️ Gender not recognized ("' + gender + '"), defaulting to NETBALL (girls)');
      boysStatement.style.display = 'none';
      girlsStatement.style.display = 'block';
      console.log('✅ SET TO NETBALL (default) - display: block');
    }
    
    console.log('🔍 AFTER setting - Boys display:', boysStatement.style.display);
    console.log('🔍 AFTER setting - Girls display:', girlsStatement.style.display);
    console.log('==========================================');
    
    // Initialize gender-specific section content
    const genderVideo = root.querySelector('.gender-video');
    if (genderVideo) {
      let videoSrc = '';
      if (gender === 'male' || gender === 'boy' || gender === 'boys') {
        videoSrc = genderVideo.getAttribute('data-rugby-src');
        updateGenderContent('rugby');
      } else {
        videoSrc = genderVideo.getAttribute('data-netball-src');
        updateGenderContent('netball');
      }
      
      if (videoSrc) {
        genderVideo.setAttribute('data-src', videoSrc);
      }
    }
  };

  // Build and insert content for the three "top sports" cards
  const addSportsContent = () => {
    const childName = ctx.childName || t('sports.placeholders.child');

    // Build specificSports array from various shapes of ctx
    let specificSports = [];
    if (Array.isArray(ctx.specificSports) && ctx.specificSports.length > 0) {
      specificSports = ctx.specificSports;
    } else if (ctx.sport1 || ctx.sport2 || ctx.sport3) {
      if (ctx.sport1) specificSports.push(ctx.sport1);
      if (ctx.sport2) specificSports.push(ctx.sport2);
      if (ctx.sport3) specificSports.push(ctx.sport3);
    } else if (ctx.activities?.specificSports) {
      specificSports = Array.isArray(ctx.activities.specificSports)
        ? ctx.activities.specificSports
        : [ctx.activities.specificSports];
    }
    console.log('Processed specificSports array:', specificSports);

    // Update sports interest note
    const sportNote = root.querySelector('.sport-interest-note');
    if (sportNote) {
      if (Array.isArray(ctx.activities) && ctx.activities.includes('sports')) {
        sportNote.textContent = t('sports.personal.interest_note_sports', { childName });
      } else {
        sportNote.textContent = t('sports.personal.interest_note_general', { childName });
      }
    }

    // Update chosen sports highlight
    const highlight = root.querySelector('.chosen-sports-highlight');
    if (highlight) {
      const chosen = (specificSports && specificSports.length)
        ? specificSports.map(s => normaliseSport(s)).join(' • ')
        : t('sports.personal.highlight_default');
      highlight.textContent = chosen;
    }

    // Map of detailed copy (keys must match normalised sport names)
    const sportDetails = {
      'Hockey': {
        title: t('sports.sports.hockey_title'),
        details: t('sports.sports.hockey_details', { childName }),
        highlight: t('sports.sports.hockey_highlight', { childName })
      },
      'Athletics': {
        title: t('sports.sports.athletics_title'),
        details: t('sports.sports.athletics_details', { childName }),
        highlight: t('sports.sports.athletics_highlight', { childName })
      },
      'Tennis': {
        title: t('sports.sports.tennis_title'),
        details: t('sports.sports.tennis_details', { childName }),
        highlight: t('sports.sports.tennis_highlight')
      },
      'Rugby': {
        title: t('sports.sports.rugby_title'),
        details: t('sports.sports.rugby_details', { childName }),
        highlight: t('sports.sports.rugby_highlight')
      },
      'Netball': {
        title: t('sports.sports.netball_title'),
        details: t('sports.sports.netball_details', { childName }),
        highlight: t('sports.sports.netball_highlight')
      },
      'Cricket': {
        title: t('sports.sports.cricket_title'),
        details: t('sports.sports.cricket_details', { childName }),
        highlight: t('sports.sports.cricket_highlight')
      },
      'Swimming': {
        title: t('sports.sports.swimming_title'),
        details: t('sports.sports.swimming_details', { childName }),
        highlight: t('sports.sports.swimming_highlight')
      },
      'Rowing': {
        title: t('sports.sports.rowing_title'),
        details: t('sports.sports.rowing_details', { childName }),
        highlight: t('sports.sports.rowing_highlight')
      },
      'Squash': {
        title: t('sports.sports.squash_title'),
        details: t('sports.sports.squash_details', { childName }),
        highlight: t('sports.sports.squash_highlight')
      },
      'Badminton': {
        title: t('sports.sports.badminton_title'),
        details: t('sports.sports.badminton_details', { childName }),
        highlight: t('sports.sports.badminton_highlight')
      },
      'Basketball': {
        title: t('sports.sports.basketball_title'),
        details: t('sports.sports.basketball_details', { childName }),
        highlight: t('sports.sports.basketball_highlight')
      },
      'Football': {
        title: t('sports.sports.football_title'),
        details: t('sports.sports.football_details', { childName }),
        highlight: t('sports.sports.football_highlight')
      },
      'Cross Country': {
        title: t('sports.sports.cross_country_title'),
        details: t('sports.sports.cross_country_details', { childName }),
        highlight: t('sports.sports.cross_country_highlight')
      },
      'Golf': {
        title: t('sports.sports.golf_title'),
        details: t('sports.sports.golf_details', { childName }),
        highlight: t('sports.sports.golf_highlight')
      },
      'Equestrian': {
        title: t('sports.sports.equestrian_title'),
        details: t('sports.sports.equestrian_details', { childName }),
        highlight: t('sports.sports.equestrian_highlight')
      },
      'Clay Shooting': {
        title: t('sports.sports.clay_shooting_title'),
        details: t('sports.sports.clay_shooting_details', { childName }),
        highlight: t('sports.sports.clay_shooting_highlight')
      },
      'Polo': {
        title: t('sports.sports.polo_title'),
        details: t('sports.sports.polo_details', { childName }),
        highlight: t('sports.sports.polo_highlight')
      },
      'Water Polo': {
        title: t('sports.sports.water_polo_title'),
        details: t('sports.sports.water_polo_details', { childName }),
        highlight: t('sports.sports.water_polo_highlight')
      },
      'Volleyball': {
        title: t('sports.sports.volleyball_title'),
        details: t('sports.sports.volleyball_details', { childName }),
        highlight: t('sports.sports.volleyball_highlight')
      },
      'Ultimate Frisbee': {
        title: t('sports.sports.ultimate_title'),
        details: t('sports.sports.ultimate_details', { childName }),
        highlight: t('sports.sports.ultimate_highlight')
      },
      'Lacrosse': {
        title: t('sports.sports.lacrosse_title'),
        details: t('sports.sports.lacrosse_details', { childName }),
        highlight: t('sports.sports.lacrosse_highlight')
      },
      'Rounders': {
        title: t('sports.sports.rounders_title'),
        details: t('sports.sports.rounders_details', { childName }),
        highlight: t('sports.sports.rounders_highlight')
      }
    };

    // Insert into three top cards
    const topCards = root.querySelectorAll('.top-sport-card');

    // If we have specific sports, populate with those
    if (specificSports.length > 0) {
      topCards.forEach((card, index) => {
        if (index < specificSports.length) {
          const sport = specificSports[index];
          const sportKey = normaliseSport(sport);

          const badge = card.querySelector('.top-sport-badge');
          const title = card.querySelector('.sport-name');
          const details = card.querySelector('.sport-details');
          const highlightEl = card.querySelector('.sport-highlight');

          if (badge) badge.innerHTML = `<span class="child-name">${childName.toUpperCase()}</span>'S CHOICE #${index + 1}`;

          if (sportDetails[sportKey]) {
            if (title) title.textContent = sportDetails[sportKey].title;
            if (details) details.textContent = sportDetails[sportKey].details;
            if (highlightEl) highlightEl.textContent = sportDetails[sportKey].highlight;
          } else {
            // Fallback for sports not in the main list
            if (title) title.textContent = sport;
            if (details) details.textContent = `${childName}, you'll develop your ${sport.toLowerCase()} skills with our professional coaching and excellent facilities.`;
            if (highlightEl) highlightEl.textContent = `Excellence in ${sport} • Perfect for ${childName}`;
          }

          // Ensure card is visible
          card.style.display = 'block';
          card.style.opacity = '1';
          card.style.visibility = 'visible';
        } else {
          // Hide extra cards if we have fewer sports than cards
          card.style.display = 'none';
        }
      });
    } else {
      // NO SPECIFIC SPORTS - Show default popular sports instead of hiding everything
      const defaultSports = ['Hockey', 'Athletics', 'Tennis'];
      
      topCards.forEach((card, index) => {
        if (index < defaultSports.length) {
          const sport = defaultSports[index];
          const sportKey = normaliseSport(sport);
          
          const badge = card.querySelector('.top-sport-badge');
          const title = card.querySelector('.sport-name');
          const details = card.querySelector('.sport-details');
          const highlightEl = card.querySelector('.sport-highlight');

          if (badge) badge.innerHTML = `<span class="child-name">${childName.toUpperCase()}</span>'S CHOICE #${index + 1}`;

          if (sportDetails[sportKey]) {
            if (title) title.textContent = sportDetails[sportKey].title;
            if (details) details.textContent = sportDetails[sportKey].details;
            if (highlightEl) highlightEl.textContent = sportDetails[sportKey].highlight;
          } else {
            // Shouldn't happen with defaults, but keep a safety fallback
            if (title) title.textContent = sport;
            if (details) details.textContent = `${childName}, you'll develop your ${sport.toLowerCase()} skills with our professional coaching and excellent facilities.`;
            if (highlightEl) highlightEl.textContent = `Excellence in ${sport} • Perfect for ${childName}`;
          }

          // Ensure card is visible
          card.style.display = 'block';
          card.style.opacity = '1';
          card.style.visibility = 'visible';
        } else {
          // Hide extra cards if we have fewer sports than cards
          card.style.display = 'none';
        }
      });
    }
  };

  // Tab switcher with gender-specific video handling
  const setupTabs = () => {
    const tabs = root.querySelectorAll('.sport-tab');
    const sections = root.querySelectorAll('.sport-section');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const sportType = tab.getAttribute('data-sport');
        
        // Pause all videos before switching
        sections.forEach(section => {
          const video = section.querySelector('video');
          if (video) {
            video.pause();
          }
        });
        
        // Remove active from all tabs and sections
        tabs.forEach(t => t.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        
        // Add active to clicked tab
        tab.classList.add('active');
        
        // Activate corresponding section
        if (sportType === 'overview') {
          const overviewSection = root.querySelector('#overview-section');
          if (overviewSection) {
            overviewSection.classList.add('active');
            
            // Play overview video
            const video = overviewSection.querySelector('video');
            if (video) {
              video.play().catch(() => {});
            }
            
            // Update unmute button for overview video
            const btn = overviewSection.querySelector('.unmute-btn');
            if (video && btn) {
              btn.textContent = video.muted ? 
                (t('sports.ui.click_to_unmute') || 'CLICK TO UNMUTE') : 
                (t('sports.ui.click_to_mute') || 'CLICK TO MUTE');
            }
          }
        } else if (sportType === 'gender-specific') {
          const genderSection = root.querySelector('#gender-specific-section');
          if (genderSection) {
            genderSection.classList.add('active');
            
            // Load correct video based on gender
            const gender = (ctx.gender || ctx.childGender || '').toLowerCase();
            const genderVideo = genderSection.querySelector('.gender-video');
            
            if (genderVideo) {
              let videoSrc = '';
              
              if (gender === 'male' || gender === 'boy' || gender === 'boys') {
                videoSrc = genderVideo.getAttribute('data-rugby-src');
                updateGenderContent('rugby');
              } else {
                videoSrc = genderVideo.getAttribute('data-netball-src');
                updateGenderContent('netball');
              }
              
              if (videoSrc && genderVideo.src !== videoSrc) {
                genderVideo.src = videoSrc;
                genderVideo.load();
                genderVideo.muted = true;
              }
              
              // Play the gender video
              genderVideo.play().catch(() => {});
              
              // Update unmute button for gender video
              const btn = genderSection.querySelector('.unmute-btn');
              if (btn) {
                btn.textContent = genderVideo.muted ? 
                  (t('sports.ui.click_to_unmute') || 'CLICK TO UNMUTE') : 
                  (t('sports.ui.click_to_mute') || 'CLICK TO MUTE');
              }
            }
          }
        }
      });
    });
  };

  // Lazy load and auto-play videos
  const setupVideoLazyLoading = () => {
    // Handle overview hero video
    const heroVideo = root.querySelector('.hero-video');
    if (heroVideo && heroVideo.dataset.src) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (!heroVideo.src) {
              heroVideo.src = heroVideo.dataset.src;
              heroVideo.load();
            }
            heroVideo.muted = true;
            heroVideo.play().catch(err => console.log('Hero video play failed:', err));
          } else {
            heroVideo.pause();
          }
        });
      }, { threshold: 0.25 });
      
      observer.observe(heroVideo);
    }

    // Handle gender-specific video (rugby/netball)
    const genderVideo = root.querySelector('.gender-video');
    if (genderVideo) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && genderVideo.src) {
            genderVideo.muted = true;
            genderVideo.play().catch(err => console.log('Gender video play failed:', err));
          } else {
            genderVideo.pause();
          }
        });
      }, { threshold: 0.25 });
      
      observer.observe(genderVideo);
    }
  };

  // Auto-mute on scroll away - Matches hero module pattern
  const setupScrollMute = () => {
    const handleScroll = () => {
      const activeSection = root.querySelector('.sport-section.active');
      if (!activeSection) return;
      
      const video = activeSection.querySelector('video');
      if (!video || !video.src) return;
      
      // Check the VIDEO element position, not the section
      const rect = video.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      // If video scrolled out of view and is unmuted, auto-mute it
      if (!isVisible && !video.muted) {
        video.muted = true;
        const btn = activeSection.querySelector('.unmute-btn');
        if (btn) {
          btn.textContent = t('sports.ui.click_to_unmute') || 'CLICK TO UNMUTE';
        }
        console.log('Sports video auto-muted - scrolled out of view');
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
  };

  // Hide long hero copy on small screens after a few seconds (keeps it tidy)
  const setupHeroContentHiding = () => {
    const heroCopy = root.querySelector('.hero-copy');
    if (!heroCopy) return;

    const isMobile = () => /Mobi|Android/i.test(navigator.userAgent);
    if (isMobile()) {
      setTimeout(() => {
        heroCopy.classList.add('collapsed');
      }, 10000);
    }
  };

  // Unmute button behaviour (desktop + mobile friendly)
  const setupUnmute = () => {
    const buttons = root.querySelectorAll('.unmute-btn');
    
    buttons.forEach(button => {
      const updateButton = () => {
        // Find the video in the same section as this button
        const section = button.closest('.sport-section');
        const video = section ? section.querySelector('video') : null;
        
        if (!video) return;
        
        const makeLabel = () => (video.muted ? (t('sports.ui.click_to_unmute') || 'CLICK TO UNMUTE')
                                             : (t('sports.ui.click_to_mute')   || 'CLICK TO MUTE'));
        
        button.textContent = makeLabel();
      };
      
      button.addEventListener('click', () => {
        const section = button.closest('.sport-section');
        const video = section ? section.querySelector('video') : null;
        
        if (!video) return;
        
        video.muted = !video.muted;
        if (!video.paused) {
          video.play().catch(() => {});
        }
        updateButton();
      });
      
      updateButton();
    });
  };

  // Initialisation
  updateChildNames();
  setupTabs();
  filterSportsByGender();
  addSportsContent();
  setupVideoLazyLoading();
  setupScrollMute(); // Add scroll-based auto-mute
  setupUnmute();
  setupHeroContentHiding();

  // Immediately initialize and play the hero video in the active section
  setTimeout(() => {
    const activeSection = root.querySelector('.sport-section.active');
    if (activeSection) {
      const video = activeSection.querySelector('video');
      if (video) {
        if (video.dataset.src && !video.src) {
          video.src = video.dataset.src;
          video.load();
        }
        video.muted = true;
        video.play().catch(err => console.log('Initial video play failed:', err));
      }
    }
  }, 100);

  // Lazy load images
  if (typeof hydrateLazyAssets === 'function') {
    hydrateLazyAssets(root);
  }

  console.log('Sports module initialization complete');
};