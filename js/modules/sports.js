/* ====== SPORTS MODULE — PRECISION AUTOPLAY ON SECTION ENTRY (MP4 ONLY) ====== */
MODULES['sports'] = (root, ctx) => {
  // ---- SAFE TRANSLATION WRAPPER WITH ENGLISH FALLBACK ----
  const RAW_T = (window.PEN_I18N && typeof window.PEN_I18N.t === 'function') ? window.PEN_I18N.t : null;

  // Minimal English dictionary used as fallback when no i18n key/value is available.  // (kept from your file)
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

  // Helpers
  const getDeep = (obj, path) => path.split('.').reduce((o, k) => (o && o[k] != null ? o[k] : undefined), obj);
  const renderParams = (str, params) => String(str).replace(/\{(\w+)\}/g, (_, p) => (params && params[p] != null ? params[p] : `{${p}}`));
  const t = (key, params = {}) => {
    let out = RAW_T ? RAW_T(key, params) : '';
    if (out && String(out).trim()) return out;
    const fallback = getDeep(EN_DICT, key);
    if (typeof fallback === 'string') return renderParams(fallback, params);
    return '';
  };
  const normaliseSport = (s) => !s ? '' : s.toLowerCase().replace(/[_-]/g, ' ').replace(/\s+/g, ' ').trim().replace(/\b\w/g, c => c.toUpperCase());
  const onScreen = (el) => {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    return r.top < vh && r.bottom > 0;
  };

  // Update name placeholders
  const updateChildNames = () => {
    const childName = ctx.childName || t('sports.placeholders.child');
    root.querySelectorAll('.child-name').forEach(el => { el.textContent = childName; });
  };

  // Gender content (rugby/netball) — keeps your existing selectors                 // based on your current structure. :contentReference[oaicite:1]{index=1}
  const updateGenderContent = (sportType) => {
    const genderSection = root.querySelector('#gender-specific-section');         // :contentReference[oaicite:2]{index=2}
    if (!genderSection) return;

    const titleEl     = genderSection.querySelector('.gender-sport-title');
    const heroTitleEl = genderSection.querySelector('.gender-sport-hero-title');
    const subtitleEl  = genderSection.querySelector('.gender-sport-subtitle');
    const stats       = genderSection.querySelectorAll('.sport-stats .stat-item');

    if (sportType === 'rugby') {
      if (titleEl)     titleEl.textContent     = t('sports.gender_rugby.title');
      if (heroTitleEl) heroTitleEl.textContent = t('sports.gender_rugby.hero_title');
      if (subtitleEl)  subtitleEl.textContent  = t('sports.gender_rugby.subtitle');
      if (stats[0]) { stats[0].querySelector('.stat-number').textContent = t('sports.gender_rugby.stat1'); stats[0].querySelector('.stat-label').textContent = t('sports.gender_rugby.label1'); }
      if (stats[1]) { stats[1].querySelector('.stat-number').textContent = t('sports.gender_rugby.stat2'); stats[1].querySelector('.stat-label').textContent = t('sports.gender_rugby.label2'); }
      if (stats[2]) { stats[2].querySelector('.stat-number').textContent = t('sports.gender_rugby.stat3'); stats[2].querySelector('.stat-label').textContent = t('sports.gender_rugby.label3'); }
    } else {
      if (titleEl)     titleEl.textContent     = t('sports.gender_netball.title');
      if (heroTitleEl) heroTitleEl.textContent = t('sports.gender_netball.hero_title');
      if (subtitleEl)  subtitleEl.textContent  = t('sports.gender_netball.subtitle');
      if (stats[0]) { stats[0].querySelector('.stat-number').textContent = t('sports.gender_netball.stat1'); stats[0].querySelector('.stat-label').textContent = t('sports.gender_netball.label1'); }
      if (stats[1]) { stats[1].querySelector('.stat-number').textContent = t('sports.gender_netball.stat2'); stats[1].querySelector('.stat-label').textContent = t('sports.gender_netball.label2'); }
      if (stats[2]) { stats[2].style.display = 'none'; }
    }
  };

  // Gender filtering + prep video src
  const filterSportsByGender = () => {
    const gender = (ctx.gender || ctx.childGender || '').toLowerCase();

    // Tab label swap (RUGBY/NETBALL)                                              // matches your markup. :contentReference[oaicite:3]{index=3}
    const genderTab = root.querySelector('.gender-sport-tab');
    if (genderTab) {
      genderTab.textContent = (gender === 'male' || gender === 'boy' || gender === 'boys')
        ? t('sports.gender_rugby.tab')
        : t('sports.gender_netball.tab');
    }

    // Primary statement toggle (boys vs girls)
    const boysStatement  = root.querySelector('.gender-statement.boys');          // :contentReference[oaicite:4]{index=4}
    const girlsStatement = root.querySelector('.gender-statement.girls');
    if (boysStatement && girlsStatement) {
      boysStatement.removeAttribute('style');
      girlsStatement.removeAttribute('style');

      if (gender === 'male' || gender === 'boy' || gender === 'boys') {
        boysStatement.style.display = 'block';
        girlsStatement.style.display = 'none';
      } else if (gender === 'female' || gender === 'girl' || gender === 'girls') {
        boysStatement.style.display = 'none';
        girlsStatement.style.display = 'block';
      } else {
        boysStatement.style.display = 'none';
        girlsStatement.style.display = 'block';
      }
    }

    // Pre-select correct gender video src (we attach it only when needed)
    const genderVideo = root.querySelector('.gender-video');                      // :contentReference[oaicite:5]{index=5}
    if (genderVideo) {
      const src = (gender === 'male' || gender === 'boy' || gender === 'boys')
        ? genderVideo.getAttribute('data-rugby-src')
        : genderVideo.getAttribute('data-netball-src');
      if (src) genderVideo.setAttribute('data-src', src);
      updateGenderContent((gender === 'male' || gender === 'boy' || gender === 'boys') ? 'rugby' : 'netball');
    }
  };

  // Top-3 sport cards (kept from your file, unchanged in behaviour)                // uses your classes .top-sport-card etc. :contentReference[oaicite:6]{index=6}
  const addSportsContent = () => {
    const childName = ctx.childName || t('sports.placeholders.child');

    let specificSports = [];
    if (Array.isArray(ctx.specificSports) && ctx.specificSports.length > 0) {
      specificSports = ctx.specificSports;
    } else if (ctx.sport1 || ctx.sport2 || ctx.sport3) {
      if (ctx.sport1) specificSports.push(ctx.sport1);
      if (ctx.sport2) specificSports.push(ctx.sport2);
      if (ctx.sport3) specificSports.push(ctx.sport3);
    } else if (ctx.activities?.specificSports) {
      specificSports = Array.isArray(ctx.activities.specificSports) ? ctx.activities.specificSports : [ctx.activities.specificSports];
    }

    const sportNote = root.querySelector('.sport-interest-note');
    if (sportNote) {
      sportNote.textContent = (Array.isArray(ctx.activities) && ctx.activities.includes('sports'))
        ? t('sports.personal.interest_note_sports', { childName })
        : t('sports.personal.interest_note_general', { childName });
    }

    const highlight = root.querySelector('.chosen-sports-highlight');
    if (highlight) {
      const chosen = (specificSports && specificSports.length)
        ? specificSports.map(s => normaliseSport(s)).join(' • ')
        : t('sports.personal.highlight_default');
      highlight.textContent = chosen;
    }

    const sportDetails = {
      'Hockey': { title: t('sports.sports.hockey_title'), details: t('sports.sports.hockey_details', { childName }), highlight: t('sports.sports.hockey_highlight', { childName }) },
      'Athletics': { title: t('sports.sports.athletics_title'), details: t('sports.sports.athletics_details', { childName }), highlight: t('sports.sports.athletics_highlight', { childName }) },
      'Tennis': { title: t('sports.sports.tennis_title'), details: t('sports.sports.tennis_details', { childName }), highlight: t('sports.sports.tennis_highlight') },
      'Rugby': { title: t('sports.sports.rugby_title'), details: t('sports.sports.rugby_details', { childName }), highlight: t('sports.sports.rugby_highlight') },
      'Netball': { title: t('sports.sports.netball_title'), details: t('sports.sports.netball_details', { childName }), highlight: t('sports.sports.netball_highlight') },
      'Cricket': { title: t('sports.sports.cricket_title'), details: t('sports.sports.cricket_details', { childName }), highlight: t('sports.sports.cricket_highlight') },
      'Swimming': { title: t('sports.sports.swimming_title'), details: t('sports.sports.swimming_details', { childName }), highlight: t('sports.sports.swimming_highlight') },
      'Rowing': { title: t('sports.sports.rowing_title'), details: t('sports.sports.rowing_details', { childName }), highlight: t('sports.sports.rowing_highlight') },
      'Squash': { title: t('sports.sports.squash_title'), details: t('sports.sports.squash_details', { childName }), highlight: t('sports.sports.squash_highlight') },
      'Badminton': { title: t('sports.sports.badminton_title'), details: t('sports.sports.badminton_details', { childName }), highlight: t('sports.sports.badminton_highlight') },
      'Basketball': { title: t('sports.sports.basketball_title'), details: t('sports.sports.basketball_details', { childName }), highlight: t('sports.sports.basketball_highlight') },
      'Football': { title: t('sports.sports.football_title'), details: t('sports.sports.football_details', { childName }), highlight: t('sports.sports.football_highlight') },
      'Cross Country': { title: t('sports.sports.cross_country_title'), details: t('sports.sports.cross_country_details', { childName }), highlight: t('sports.sports.cross_country_highlight') },
      'Golf': { title: t('sports.sports.golf_title'), details: t('sports.sports.golf_details', { childName }), highlight: t('sports.sports.golf_highlight') },
      'Equestrian': { title: t('sports.sports.equestrian_title'), details: t('sports.sports.equestrian_details', { childName }), highlight: t('sports.sports.equestrian_highlight') },
      'Clay Shooting': { title: t('sports.sports.clay_shooting_title'), details: t('sports.sports.clay_shooting_details', { childName }), highlight: t('sports.sports.clay_shooting_highlight') },
      'Polo': { title: t('sports.sports.polo_title'), details: t('sports.sports.polo_details', { childName }), highlight: t('sports.sports.polo_highlight') },
      'Water Polo': { title: t('sports.sports.water_polo_title'), details: t('sports.sports.water_polo_details', { childName }), highlight: t('sports.sports.water_polo_highlight') },
      'Volleyball': { title: t('sports.sports.volleyball_title'), details: t('sports.sports.volleyball_details', { childName }), highlight: t('sports.sports.volleyball_highlight') },
      'Ultimate Frisbee': { title: t('sports.sports.ultimate_title'), details: t('sports.sports.ultimate_details', { childName }), highlight: t('sports.sports.ultimate_highlight') },
      'Lacrosse': { title: t('sports.sports.lacrosse_title'), details: t('sports.sports.lacrosse_details', { childName }), highlight: t('sports.sports.lacrosse_highlight') },
      'Rounders': { title: t('sports.sports.rounders_title'), details: t('sports.sports.rounders_details', { childName }), highlight: t('sports.sports.rounders_highlight') }
    };

    const topCards = root.querySelectorAll('.top-sport-card');                     // :contentReference[oaicite:7]{index=7}

    const fillCard = (card, sport, index) => {
      const sportKey    = normaliseSport(sport);
      const badge       = card.querySelector('.top-sport-badge');
      const title       = card.querySelector('.sport-name');
      const details     = card.querySelector('.sport-details');
      const highlightEl = card.querySelector('.sport-highlight');

      if (badge) badge.innerHTML = `<span class="child-name">${(childName || '').toUpperCase()}</span>'S CHOICE #${index + 1}`;

      if (sportDetails[sportKey]) {
        if (title)       title.textContent       = sportDetails[sportKey].title;
        if (details)     details.textContent     = sportDetails[sportKey].details;
        if (highlightEl) highlightEl.textContent = sportDetails[sportKey].highlight;
      } else {
        if (title)       title.textContent       = sport;
        if (details)     details.textContent     = `${childName}, you'll develop your ${sport.toLowerCase()} skills with our professional coaching and excellent facilities.`;
        if (highlightEl) highlightEl.textContent = `Excellence in ${sport} • Perfect for ${childName}`;
      }
      card.style.display = 'block';
      card.style.opacity = '1';
      card.style.visibility = 'visible';
    };

    if (specificSports.length > 0) {
      topCards.forEach((card, i) => i < specificSports.length ? fillCard(card, specificSports[i], i) : (card.style.display = 'none'));
    } else {
      ['Hockey', 'Athletics', 'Tennis'].forEach((s, i) => topCards[i] && fillCard(topCards[i], s, i));
      for (let j = 3; j < topCards.length; j++) topCards[j].style.display = 'none';
    }
  };

  // ---------- PRECISE AUTOPLAY/PAUSE/RESET ON SECTION ENTRY/EXIT ----------
  // We observe the SECTION containers, not the <video> tags, to time the trigger
  // “just as you’re entering” the module content.                                  // Uses your #overview-section and #gender-specific-section. :contentReference[oaicite:8]{index=8}
  const setupVideoSectionObservers = () => {
    const overviewSection = root.querySelector('#overview-section');
    const genderSection   = root.querySelector('#gender-specific-section');

    const heroVideo   = overviewSection?.querySelector('.hero-video') || overviewSection?.querySelector('video');
    const genderVideo = genderSection?.querySelector('.gender-video') || genderSection?.querySelector('video');

    // Helper to lazily attach src when needed
    const ensureSrc = (video) => {
      if (!video) return;
      if (video.dataset && video.dataset.src && !video.getAttribute('src')) {
        video.setAttribute('src', video.dataset.src);
      }
      video.muted = true;
      video.playsInline = true; // iOS inline playback
    };

    const playWhenReady = async (video) => {
      if (!video) return;
      try {
        if (video.readyState < 2) {
          await new Promise((resolve) => {
            const onCanPlay = () => { video.removeEventListener('canplay', onCanPlay); resolve(); };
            video.addEventListener('canplay', onCanPlay, { once: true });
            video.load();
          });
        }
        await video.play();
      } catch (_) { /* ignore autoplay blocks (shouldn’t happen while muted) */ }
    };

    const pauseAndReset = (video) => {
      if (!video) return;
      video.pause();
      try { video.currentTime = 0; } catch (_) {}
    };

    // “Just as you enter” = when the section touches the top ~10% of viewport
    const enterOpts = { root: null, rootMargin: '0px 0px -90% 0px', threshold: 0.01 };
    const leaveOpts = { root: null, rootMargin: '0px', threshold: 0 };

    // Overview
    if (overviewSection && heroVideo) {
      const ovEnter = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { ensureSrc(heroVideo); playWhenReady(heroVideo); }
        });
      }, enterOpts);

      const ovLeave = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (!e.isIntersecting) pauseAndReset(heroVideo); });
      }, leaveOpts);

      ovEnter.observe(overviewSection);
      ovLeave.observe(overviewSection);
    }

    // Gender-specific (choose correct src already stored in data-src by filterSportsByGender)
    if (genderSection && genderVideo) {
      const gnEnter = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { ensureSrc(genderVideo); playWhenReady(genderVideo); }
        });
      }, enterOpts);

      const gnLeave = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (!e.isIntersecting) pauseAndReset(genderVideo); });
      }, leaveOpts);

      gnEnter.observe(genderSection);
      gnLeave.observe(genderSection);
    }
  };

  // Tabs: keep behaviour, but ensure videos obey “visible-only” rule
  const setupTabs = () => {
    const tabs = root.querySelectorAll('.sport-tab');                             // :contentReference[oaicite:9]{index=9}
    const sections = root.querySelectorAll('.sport-section');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const sportType = tab.getAttribute('data-sport');

        // Pause all videos before switching
        sections.forEach(section => {
          const v = section.querySelector('video');
          if (v) v.pause();
        });

        // Switch active classes
        tabs.forEach(t => t.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        tab.classList.add('active');

        if (sportType === 'overview') {
          const section = root.querySelector('#overview-section');
          if (section) {
            section.classList.add('active');
            const v = section.querySelector('video');
            if (v && onScreen(section)) { v.muted = true; v.playsInline = true; if (v.dataset.src && !v.src) v.src = v.dataset.src; v.load(); v.play().catch(()=>{}); }
            const btn = section.querySelector('.unmute-btn');
            if (btn && v) btn.textContent = v.muted ? (t('sports.ui.click_to_unmute') || 'CLICK TO UNMUTE')
                                                    : (t('sports.ui.click_to_mute')   || 'CLICK TO MUTE');
          }
        } else if (sportType === 'gender-specific') {
          const section = root.querySelector('#gender-specific-section');
          if (section) {
            section.classList.add('active');
            const genderVideo = section.querySelector('.gender-video');
            if (genderVideo) {
              // Ensure correct src (filterSportsByGender already set data-src)
              if (genderVideo.dataset.src && genderVideo.src !== genderVideo.dataset.src) {
                genderVideo.src = genderVideo.dataset.src;
                genderVideo.load();
              }
              genderVideo.muted = true;
              genderVideo.playsInline = true;
              if (onScreen(section)) genderVideo.play().catch(()=>{});
              const btn = section.querySelector('.unmute-btn');
              if (btn) btn.textContent = genderVideo.muted ? (t('sports.ui.click_to_unmute') || 'CLICK TO UNMUTE')
                                                           : (t('sports.ui.click_to_mute')   || 'CLICK TO MUTE');
            }
          }
        }
      });
    });
  };

  // Auto-mute when scrolled away (kept)
  const setupScrollMute = () => {
    const handleScroll = () => {
      const activeSection = root.querySelector('.sport-section.active');
      if (!activeSection) return;
      const video = activeSection.querySelector('video');
      if (!video || !video.src) return;
      const rect = video.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (!isVisible && !video.muted) {
        video.muted = true;
        const btn = activeSection.querySelector('.unmute-btn');
        if (btn) btn.textContent = t('sports.ui.click_to_unmute') || 'CLICK TO UNMUTE';
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
  };

  // Hide long hero copy on mobile (kept)
  const setupHeroContentHiding = () => {
    const heroCopy = root.querySelector('.hero-copy');                            // :contentReference[oaicite:10]{index=10}
    if (!heroCopy) return;
    const isMobile = () => /Mobi|Android/i.test(navigator.userAgent);
    if (isMobile()) setTimeout(() => heroCopy.classList.add('collapsed'), 10000);
  };

  // Unmute buttons (kept)
  const setupUnmute = () => {
    const buttons = root.querySelectorAll('.unmute-btn');                         // :contentReference[oaicite:11]{index=11}
    buttons.forEach(button => {
      const updateButton = () => {
        const section = button.closest('.sport-section');
        const video = section ? section.querySelector('video') : null;
        if (!video) return;
        button.textContent = video.muted ? (t('sports.ui.click_to_unmute') || 'CLICK TO UNMUTE')
                                         : (t('sports.ui.click_to_mute')   || 'CLICK TO MUTE');
      };
      button.addEventListener('click', () => {
        const section = button.closest('.sport-section');
        const video = section ? section.querySelector('video') : null;
        if (!video) return;
        video.muted = !video.muted;
        if (!video.paused) video.play().catch(()=>{});
        updateButton();
      });
      updateButton();
    });
  };

  // ---------- INIT ORDER ----------
  updateChildNames();
  setupTabs();
  filterSportsByGender();       // sets gender text + prepares gender video data-src
  addSportsContent();
  setupVideoSectionObservers(); // precise entry/exit timing (replaces old lazy observers)
  setupScrollMute();
  setupUnmute();
  setupHeroContentHiding();

  // Lazy images (kept)
  if (typeof hydrateLazyAssets === 'function') {
    hydrateLazyAssets(root);
  }
};
