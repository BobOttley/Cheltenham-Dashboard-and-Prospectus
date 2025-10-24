/* Creative Arts & Design Module Initializer - Add this to the MODULES object in app.js */
MODULES['creative_arts'] = (root, ctx) => {
  // Translation function
  const t = (window.PEN_I18N && typeof window.PEN_I18N.t === 'function')
    ? window.PEN_I18N.t
    : () => '';

  // Update name placeholders
  const updateNames = () => {
    root.querySelectorAll('.child-name').forEach(el => {
      el.textContent = ctx.childName || t('creative_arts.placeholders.child_name');
    });
  };

  // Customize welcome message based on creative interests
  const customizeWelcome = () => {
    const welcomeText = root.querySelector('.ca-welcome-text');
    if (!welcomeText) return;
    
    const childName = ctx.childName || t('creative_arts.placeholders.child_name');
    let message = t('creative_arts.welcome.discover_prefix') + ' ' + childName + ' ' + t('creative_arts.welcome.discover_suffix') + ' ';
    
    if (ctx.activities?.includes('drama') && ctx.activities?.includes('music')) {
      message += t('creative_arts.welcome.theatre_music_both', { childName });
    } else if (ctx.activities?.includes('drama') && ctx.universityAspirations === 'Oxford or Cambridge') {
      message += t('creative_arts.welcome.drama_oxbridge', { childName });
    } else if (ctx.activities?.includes('music') && ctx.priorities?.activities === 3) {
      message += t('creative_arts.welcome.music_excellence', { childName });
    } else if (ctx.academicInterests?.includes('arts') && ctx.academicInterests?.includes('humanities')) {
      message += t('creative_arts.welcome.arts_humanities', { childName });
    } else if (ctx.universityAspirations === 'Oxford or Cambridge') {
      message += t('creative_arts.welcome.oxbridge_apps', { childName });
    } else if (ctx.activities?.includes('drama')) {
      message += t('creative_arts.welcome.drama_success', { childName });
    } else if (ctx.activities?.includes('music')) {
      message += t('creative_arts.welcome.music_achievement', { childName });
    } else if (ctx.academicInterests?.includes('arts')) {
      message += t('creative_arts.welcome.arts_success', { childName });
    } else {
      message += t('creative_arts.welcome.default', { childName });
    }
    
    welcomeText.textContent = message;
  };

  // Prioritize subjects based on interests and activities
  const prioritizeSubjects = () => {
    const navButtons = root.querySelectorAll('.ca-nav-btn');
    const cards = root.querySelectorAll('.ca-card');
    
    // Drama prioritization
    if (ctx.activities?.includes('drama')) {
      navButtons.forEach(btn => {
        if (btn.getAttribute('data-filter') === 'drama') {
          btn.classList.add('priority-high');
        }
      });
      cards.forEach(card => {
        if (card.getAttribute('data-subject') === 'drama') {
          card.classList.add('priority-match');
          addPersonalizedContent(card, ctx, 'drama');
        }
      });
    }
    
    // Music prioritization
    if (ctx.activities?.includes('music')) {
      navButtons.forEach(btn => {
        if (btn.getAttribute('data-filter') === 'music') {
          btn.classList.add('priority-high');
        }
      });
      cards.forEach(card => {
        if (card.getAttribute('data-subject') === 'music') {
          card.classList.add('priority-match');
          addPersonalizedContent(card, ctx, 'music');
        }
      });
    }
    
    // Art prioritization
    if (ctx.academicInterests?.includes('arts')) {
      navButtons.forEach(btn => {
        if (btn.getAttribute('data-filter') === 'art' || btn.getAttribute('data-filter') === 'history-of-art') {
          btn.classList.add('priority-high');
        }
      });
      cards.forEach(card => {
        const subject = card.getAttribute('data-subject');
        if (subject === 'art' || subject === 'history-of-art') {
          card.classList.add('priority-match');
          addPersonalizedContent(card, ctx, subject);
        }
      });
    }
  };

  // Add personalized content to specific subject cards
  const addPersonalizedContent = (card, ctx, subject) => {
    const cardContent = card.querySelector('.ca-card-content');
    if (!cardContent) return;

    // Remove existing personalized content
    const existingPersonalized = cardContent.querySelector('.ca-personalized-content');
    if (existingPersonalized) {
      existingPersonalized.remove();
    }

    // Create new personalized section
    const personalizedSection = document.createElement('div');
    personalizedSection.className = 'ca-personalized-content';
    personalizedSection.style.cssText = `
      background: rgba(201, 169, 97, 0.1);
      border: 2px solid rgba(201, 169, 97, 0.3);
      border-radius: 12px;
      padding: 1.5rem;
      margin: 1.5rem 0;
      font-weight: 500;
      color: #1e3a5f;
    `;

    let content = '';
    const childName = ctx.childName || t('creative_arts.placeholders.child_name');

    if (subject === 'drama' && ctx.activities?.includes('leadership')) {
      const title = t('creative_arts.personalized_cards.drama_leadership_title', { childName });
      const text = t('creative_arts.personalized_cards.drama_leadership_text', { childName });
      content = `<h4 style="color: #c9a961; margin-bottom: 1rem;">${title}</h4>
      <p>${text}</p>`;
    } else if (subject === 'drama' && ctx.universityAspirations === 'Oxford or Cambridge') {
      const title = t('creative_arts.personalized_cards.drama_oxbridge_title', { childName });
      const text = t('creative_arts.personalized_cards.drama_oxbridge_text', { childName });
      content = `<h4 style="color: #c9a961; margin-bottom: 1rem;">${title}</h4>
      <p>${text}</p>`;
    } else if (subject === 'music' && ctx.universityAspirations === 'Oxford or Cambridge') {
      const title = t('creative_arts.personalized_cards.music_oxbridge_title', { childName });
      const text = t('creative_arts.personalized_cards.music_oxbridge_text', { childName });
      content = `<h4 style="color: #c9a961; margin-bottom: 1rem;">${title}</h4>
      <p>${text}</p>`;
    } else if (subject === 'music' && ctx.priorities?.activities === 3) {
      const title = t('creative_arts.personalized_cards.music_activities_title', { childName });
      const text = t('creative_arts.personalized_cards.music_activities_text', { childName });
      content = `<h4 style="color: #c9a961; margin-bottom: 1rem;">${title}</h4>
      <p>${text}</p>`;
    } else if (subject === 'art' && ctx.academicInterests?.includes('humanities')) {
      const title = t('creative_arts.personalized_cards.art_humanities_title', { childName });
      const text = t('creative_arts.personalized_cards.art_humanities_text', { childName });
      content = `<h4 style="color: #c9a961; margin-bottom: 1rem;">${title}</h4>
      <p>${text}</p>`;
    } else if (subject === 'history-of-art' && ctx.priorities?.academic === 3) {
      const title = t('creative_arts.personalized_cards.history_art_academic_title', { childName });
      const text = t('creative_arts.personalized_cards.history_art_academic_text', { childName });
      content = `<h4 style="color: #c9a961; margin-bottom: 1rem;">${title}</h4>
      <p>${text}</p>`;
    }

    if (content) {
      personalizedSection.innerHTML = content;
      cardContent.insertBefore(personalizedSection, cardContent.firstChild);
    }
  };

  // Personalize content based on context
  const personalizeContent = () => {
    // Update subject introductions
    const artIntro = root.querySelector('[data-subject="art"] .ca-subject-intro');
    if (artIntro && ctx.childName) {
      artIntro.textContent = t('creative_arts.subject_intros.art_intro', { childName: ctx.childName });
    }

    const dramaIntro = root.querySelector('[data-subject="drama"] .ca-subject-intro');
    if (dramaIntro && ctx.childName && ctx.activities?.includes('leadership')) {
      dramaIntro.textContent = t('creative_arts.subject_intros.drama_leadership_intro', { childName: ctx.childName });
    }

    const musicIntro = root.querySelector('[data-subject="music"] .ca-subject-intro');
    if (musicIntro && ctx.childName && ctx.activities?.includes('music')) {
      musicIntro.textContent = t('creative_arts.subject_intros.music_intro', { childName: ctx.childName });
    }
  };

  // Customize navigation title
  const customizeNavigation = () => {
    const navTitle = root.querySelector('.ca-nav-title');
    if (navTitle && ctx.childName) {
      navTitle.textContent = t('creative_arts.navigation.creative_subjects_for', { childName: ctx.childName });
    }
  };

  // Add university-specific content
  const addUniversityContent = () => {
    if (ctx.universityAspirations === 'Oxford or Cambridge') {
      const pathwaysSection = root.querySelector('.ca-pathways-section');
      if (pathwaysSection && !pathwaysSection.querySelector('.ca-oxbridge-note')) {
        const oxbridgeNote = document.createElement('div');
        oxbridgeNote.className = 'ca-oxbridge-note';
        oxbridgeNote.style.cssText = `
          background: rgba(201, 169, 97, 0.15);
          border-radius: 12px;
          padding: 1.5rem;
          margin-top: 1.5rem;
          text-align: center;
        `;
        const childName = ctx.childName || t('creative_arts.placeholders.child_name');
        const title = t('creative_arts.university_content.oxbridge_title', { childName });
        const text = t('creative_arts.university_content.oxbridge_text', { childName });
        oxbridgeNote.innerHTML = `
          <h4 style="color: #92400e; margin-bottom: 1rem; font-size: 1.2rem;">${title}</h4>
          <p style="color: #78350f;">${text}</p>
        `;
        pathwaysSection.appendChild(oxbridgeNote);
      }
    }
  };

  // Setup navigation filtering
  const setupNavigation = () => {
    const navButtons = root.querySelectorAll('.ca-nav-btn');
    const cards = root.querySelectorAll('.ca-card');
    
    // Add click handlers for filtering
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons
        navButtons.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        cards.forEach(card => {
          const subject = card.getAttribute('data-subject');
          if (filter === 'all' || subject === filter) {
            card.style.display = 'block';
            card.classList.remove('hidden');
          } else {
            card.style.display = 'none';
            card.classList.add('hidden');
          }
        });
      });
    });

    // Add collapsible section functionality
    const sectionTitles = root.querySelectorAll('.ca-section-title');
    sectionTitles.forEach(title => {
      title.addEventListener('click', function() {
        const section = this.parentElement;
        section.classList.toggle('collapsed');
      });
    });

    // Add interactivity to stats
    const stats = root.querySelectorAll('.ca-stat');
    stats.forEach(stat => {
      stat.addEventListener('mouseenter', () => {
        stat.style.transform = 'translateY(-5px) scale(1.05)';
      });
      
      stat.addEventListener('mouseleave', () => {
        stat.style.transform = 'translateY(0) scale(1)';
      });
    });
  };

  // Initialize the module
  updateNames();
  customizeWelcome();
  prioritizeSubjects();
  personalizeContent();
  customizeNavigation();
  addUniversityContent();
  setupNavigation();
};