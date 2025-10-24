/* Sciences & Mathematics Module */
MODULES['sciences_mathematics'] = (root, ctx) => {
  // ——— language + helpers ———
  const isZH = (window.PEN_I18N?.lang === 'zh-Hans');
  const t = (window.PEN_I18N && typeof window.PEN_I18N.t === 'function') ? window.PEN_I18N.t : () => '';
  const setText = (el, val) => { if (el && val) el.textContent = val; };
  const q = (sel, base = root) => base?.querySelector(sel);
  const qa = (sel, base = root) => Array.from(base?.querySelectorAll(sel) || []);

  // ——— 1) Names ———
  const updateNames = () => {
    qa('.child-name').forEach(el => el.textContent = (ctx.childName || "[Child's Name]"));
  };

  // ——— 2) Welcome (Chinese only) ———
  const customizeWelcome = () => {
    if (!isZH) return; // leave English exactly as in HTML
    const welcomeText = q('.sm-welcome-text');
    if (!welcomeText) return;

    const childName = ctx.childName || "[Child's Name]";
    let suffix = '';

    const hasSci = !!ctx.academicInterests?.includes('sciences');
    const hasMath = !!ctx.academicInterests?.includes('mathematics');
    const asp = ctx.universityAspirations;

    if (hasSci && hasMath) {
      const aspiration = (asp === 'Oxford or Cambridge')
        ? t('sciences_mathematics.welcome.oxbridge_prep')
        : t('sciences_mathematics.welcome.university_success');
      suffix = t('sciences_mathematics.welcome.mathematics', { aspiration });
    } else if (hasSci) {
      suffix = t('sciences_mathematics.welcome.sciences');
    } else if (asp === 'Oxford or Cambridge') {
      suffix = t('sciences_mathematics.welcome.oxbridge');
    } else {
      suffix = t('sciences_mathematics.welcome.general');
    }

    setText(welcomeText, t('sciences_mathematics.welcome.prefix', { childName }) + suffix);
  };

  // ——— 3) Prioritise subjects (safe; doesn’t touch visible text) ———
  const prioritizeSubjects = () => {
    // no-op placeholder in case your HTML relies on order via DOM;
    // deliberately not moving elements here to avoid side-effects.
  };

  // ——— 4) Personalised content (Chinese only) ———
  const personalizeContent = () => {
    if (!isZH) return;
    // If you have any Chinese-only paragraphs/cards to insert, do it here.
    // Intentionally empty to avoid altering English DOM.
  };

  // ——— 5) Navigation heading (Chinese only) ———
  const customizeNavigation = () => {
    if (!isZH) return;
    const navTitle = q('.sm-nav-title');
    if (!navTitle) return;

    const hasSci = !!ctx.academicInterests?.includes('sciences');
    const hasMath = !!ctx.academicInterests?.includes('mathematics');

    let val = '';
    if (hasSci && hasMath) {
      val = t('sciences_mathematics.navigation.stem_pathway', { childName: ctx.childName || "[Child's Name]" });
    } else if (hasMath) {
      val = t('sciences_mathematics.navigation.maths_related', { childName: ctx.childName || "[Child's Name]" });
    } else if (hasSci) {
      val = t('sciences_mathematics.navigation.science_subjects', { childName: ctx.childName || "[Child's Name]" });
    } else {
      val = t('sciences_mathematics.navigation.stem_subjects', { childName: ctx.childName || "[Child's Name]" });
    }
    setText(navTitle, val);
  };

  // ——— 6) Hero subtitle + stats ———
  const customizeHeroContent = () => {
    const subtitle = q('.sm-hero-subtitle');
    const stats = qa('.sm-stat');

    // Subtitle: only change for Chinese. English stays as in HTML.
    if (isZH && subtitle) {
      const hasSci = !!ctx.academicInterests?.includes('sciences');
      const hasMath = !!ctx.academicInterests?.includes('mathematics');
      const both = hasSci && hasMath;
      const asp = ctx.universityAspirations;

      if (both) {
        const aspiration = (asp === 'Oxford or Cambridge')
          ? t('sciences_mathematics.hero.oxbridge_full')
          : t('sciences_mathematics.hero.leading_universities');
        setText(subtitle, t('sciences_mathematics.hero.stem_excellence', {
          childName: ctx.childName || "[Child's Name]", aspiration
        }));
      } else if (asp === 'Oxford or Cambridge') {
        setText(subtitle, t('sciences_mathematics.hero.oxbridge_prep'));
      }
      // otherwise keep existing subtitle
    }

    // Stats: NEVER blank English. Only overwrite if Chinese.
    if (!stats.length) return;

    const isOxbridge = (ctx.universityAspirations === 'Oxford or Cambridge');
    const isRussell = (ctx.universityAspirations === 'Russell Group');

    stats.forEach(stat => {
      const label = q('.sm-stat-label', stat);
      const number = q('.sm-stat-number', stat);
      if (!label || !number) return;

      const labelText = (label.textContent || '').trim();

      // Oxbridge Requirements row (detect by its current label text)
      if (/Oxbridge Requirements/i.test(labelText)) {
        if (isZH && isOxbridge) {
          // Chinese: show the dict value for Oxbridge (don’t touch English)
          setText(number, t('sciences_mathematics.stats.oxbridge_aaa')); // e.g. A*A*A in zh file
        } else if (isZH && isRussell) {
          setText(number, t('sciences_mathematics.stats.russell_aaa'));  // e.g. A-level AAB, etc.
          setText(label,  t('sciences_mathematics.stats.russell_entry'));
        }
        // English: do nothing — keeps whatever is in the HTML (e.g. A*AA)
      }

      // You can add other stat lines below if needed (Chinese only), always guard with isZH.
      // Example: if your Chinese dict includes a localised label for “Annual Oxbridge Applicants”
      // you could set it here with `if (isZH && /Annual Oxbridge Applicants/i.test(labelText)) { ... }`
    });
  };

  // ——— 7) University cards/notes (Chinese only) ———
  const addUniversityContent = () => {
    if (!isZH) return;
    // If your Chinese page adds extra Oxbridge/Russell notes, do them here.
    // Left empty to avoid touching English DOM.
  };

  // ——— 8) Simple nav reveal animation (safe) ———
  const setupNavigation = () => {
    const container = q('.sm-stats');
    if (!container) return;
    const items = qa('.sm-stat', container);
    if (!items.length) return;

    // small, safe fade-in when visible; does not change text
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const stat = e.target;
        stat.style.transition = 'transform .45s ease, opacity .45s ease';
        stat.style.opacity = '1';
        stat.style.transform = 'translateY(0) scale(1)';
        io.unobserve(stat);
      });
    }, { threshold: 0.15 });

    items.forEach(stat => {
      stat.style.opacity = '0';
      stat.style.transform = 'translateY(10px) scale(.98)';
      io.observe(stat);
    });
  };

  // ——— Initialise ———
  updateNames();
  // English is the baseline; Chinese applies extra wording:
  customizeWelcome();          // no-op in English
  prioritizeSubjects();        // safe, structural only
  personalizeContent();        // no-op in English
  customizeNavigation();       // no-op in English
  customizeHeroContent();      // guarded inside
  addUniversityContent();      // no-op in English
  setupNavigation();           // safe animation only
};
