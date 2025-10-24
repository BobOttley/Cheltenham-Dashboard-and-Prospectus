/* Humanities & Social Sciences Module Initializer - Add to MODULES object in app.js */
MODULES['humanities_social'] = (root, ctx) => {
  // Translation function
  const t = (window.PEN_I18N && typeof window.PEN_I18N.t === 'function')
    ? window.PEN_I18N.t
    : () => '';

  // Helper function to get elements
  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => root.querySelectorAll(selector);
  
  // Update child name placeholders
  const nameElements = $$('.child-name', root);
  nameElements.forEach(el => {
    if (ctx.childName) {
      el.textContent = ctx.childName;
    }
  });

  // Personalize welcome message based on student interests
  const welcomeText = $('.hs-welcome-text', root);
  if (welcomeText && ctx.childName) {
    let message = '';
    
    if (ctx.academicInterests?.includes('humanities') || ctx.academicInterests?.includes('social_sciences')) {
      if (ctx.universityAspirations === 'Oxbridge') {
        message = t('humanities_social.welcome.oxbridge');
      } else {
        message = t('humanities_social.welcome.general');
      }
    } else if (ctx.activities?.includes('debate') || ctx.activities?.includes('public_speaking')) {
      message = t('humanities_social.welcome.debate');
    } else if (ctx.priorities?.academic >= 2) {
      message = t('humanities_social.welcome.academic');
    } else {
      message = t('humanities_social.welcome.default');
    }
    
    welcomeText.textContent = message;
  }

  // Personalize hero subtitle based on interests
  const heroSubtitle = $('.hs-hero-subtitle', root);
  if (heroSubtitle && ctx.academicInterests?.includes('humanities')) {
    heroSubtitle.textContent = t('humanities_social.hero.subtitle_humanities');
  }

  // Navigation filtering functionality
  $$('.hs-nav-btn', root).forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      $$('.hs-nav-btn', root).forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');
      
      const filter = btn.getAttribute('data-filter');
      const cards = $$('.hs-card', root);
      
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.subject === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // Highlight priority subjects based on student interests and aspirations
  const prioritizeSubject = (subject, reason) => {
    const card = $(`.hs-card[data-subject="${subject}"]`, root);
    const button = $(`.hs-nav-btn[data-filter="${subject}"]`, root);
    
    if (card) {
      card.classList.add('priority-match');
      // Add personalized content explaining why this subject is recommended
      const existingHighlight = card.querySelector('.hs-priority-highlight');
      if (!existingHighlight) {
        const highlight = document.createElement('div');
        highlight.className = 'hs-priority-highlight';
        highlight.innerHTML = `<strong>${t('humanities_social.recommendations.prefix', { childName: ctx.childName })}</strong> ${reason}`;
        const cardContent = card.querySelector('.hs-card-content');
        if (cardContent) {
          cardContent.insertBefore(highlight, cardContent.firstChild);
        }
      }
    }
    
    if (button) {
      button.classList.add('priority-high');
    }
  };

  // Apply personalized subject recommendations
  if (ctx.academicInterests?.includes('literature') || ctx.activities?.includes('creative_writing')) {
    prioritizeSubject('english', t('humanities_social.recommendations.english'));
  }
  
  if (ctx.academicInterests?.includes('history') || ctx.activities?.includes('debate')) {
    prioritizeSubject('history', t('humanities_social.recommendations.history'));
  }
  
  if (ctx.academicInterests?.includes('geography') || ctx.activities?.includes('environmental_awareness')) {
    prioritizeSubject('geography', t('humanities_social.recommendations.geography'));
  }
  
  if (ctx.academicInterests?.includes('economics') || ctx.activities?.includes('young_enterprise')) {
    prioritizeSubject('economics', t('humanities_social.recommendations.economics'));
  }
  
  if (ctx.activities?.includes('student_council') || ctx.activities?.includes('debate')) {
    prioritizeSubject('politics', t('humanities_social.recommendations.politics'));
  }
  
  if (ctx.academicInterests?.includes('psychology') || ctx.activities?.includes('peer_mentoring')) {
    prioritizeSubject('psychology', t('humanities_social.recommendations.psychology'));
  }

  // Special EPQ recommendations
  if (ctx.priorities?.academic >= 3 && ctx.universityAspirations === 'Oxbridge') {
    const epqCard = $('.hs-card[data-subject="epq"]', root);
    if (epqCard) {
      epqCard.classList.add('priority-high');
      const cardContent = epqCard.querySelector('.hs-card-content');
      if (cardContent) {
        const oxbridgeNote = document.createElement('div');
        oxbridgeNote.className = 'hs-university-focus';
        oxbridgeNote.innerHTML = `
          <h4>${t('humanities_social.epq.oxbridge_title')}</h4>
          <p><strong>${t('humanities_social.epq.oxbridge_essential', { childName: ctx.childName })}</strong> ${t('humanities_social.epq.oxbridge_text')}</p>
        `;
        cardContent.appendChild(oxbridgeNote);
      }
    }
  }

  // Add subject combinations based on student profile
  const combinationsSection = $('.hs-combinations-section', root);
  if (combinationsSection && ctx.academicInterests) {
    const grid = $('.hs-combinations-grid', root);
    if (grid) {
      // Add personalized combination recommendation
      const personalCombo = document.createElement('div');
      personalCombo.className = 'hs-combination-item hs-interest-match';
      
      let comboTitle = '';
      let comboContent = '';
      
      if (ctx.academicInterests.includes('literature') && ctx.academicInterests.includes('history')) {
        comboTitle = t('humanities_social.combinations.perfect_for', { childName: ctx.childName });
        comboContent = `<p><strong>${t('humanities_social.combinations.english_history')}</strong></p>
                      <p>${t('humanities_social.combinations.english_history_detail')}</p>`;
      } else if (ctx.academicInterests.includes('economics') && ctx.academicInterests.includes('geography')) {
        comboTitle = t('humanities_social.combinations.recommended_for', { childName: ctx.childName });
        comboContent = `<p><strong>${t('humanities_social.combinations.geography_economics')}</strong></p>
                      <p>${t('humanities_social.combinations.geography_economics_detail')}</p>`;
      } else if (ctx.universityAspirations === 'Oxbridge') {
        comboTitle = t('humanities_social.combinations.oxbridge_strategy', { childName: ctx.childName });
        comboContent = `<p><strong>${t('humanities_social.combinations.oxbridge_combo')}</strong></p>
                      <p>${t('humanities_social.combinations.oxbridge_combo_detail')}</p>`;
      } else {
        comboTitle = t('humanities_social.combinations.tailored_for', { childName: ctx.childName });
        comboContent = `<p><strong>${t('humanities_social.combinations.general_combo')}</strong></p>
                      <p>${t('humanities_social.combinations.general_combo_detail')}</p>`;
      }
      
      personalCombo.innerHTML = `<h3>${comboTitle}</h3>${comboContent}`;
      grid.appendChild(personalCombo);
    }
  }

  // Add activity connections where relevant
  const addActivityConnection = (subject, activity, connectionKey) => {
    const card = $(`.hs-card[data-subject="${subject}"]`, root);
    if (card && ctx.activities?.includes(activity)) {
      const cardContent = card.querySelector('.hs-card-content');
      if (cardContent) {
        const activityNote = document.createElement('div');
        activityNote.className = 'hs-activity-connection';
        const activityName = activity.replace('_', ' ');
        activityNote.innerHTML = `
          <h4>${t('humanities_social.activities.perfect_match')}</h4>
          <p><strong>${t('humanities_social.activities.experience_foundation', { childName: ctx.childName, activity: activityName })}</strong> ${t('humanities_social.activities.provides_foundation', { connection: t(connectionKey) })}</p>
        `;
        cardContent.appendChild(activityNote);
      }
    }
  };

  // Apply activity connections
  addActivityConnection('english', 'drama', 'humanities_social.activities.drama_english');
  addActivityConnection('history', 'debate', 'humanities_social.activities.debate_history');
  addActivityConnection('geography', 'duke_of_edinburgh', 'humanities_social.activities.dof_geography');
  addActivityConnection('politics', 'student_council', 'humanities_social.activities.student_politics');
  addActivityConnection('psychology', 'peer_mentoring', 'humanities_social.activities.mentoring_psychology');

  // Collapsible sections functionality
  $$('.hs-section-title', root).forEach(title => {
    title.addEventListener('click', function() {
      const section = this.parentElement;
      section.classList.toggle('collapsed');
    });
  });

  // Smooth scrolling for navigation
  $$('.hs-nav-btn:not([data-filter="all"])', root).forEach(btn => {
    btn.addEventListener('click', () => {
      const subject = btn.getAttribute('data-filter');
      const targetCard = $(`.hs-card[data-subject="${subject}"]`, root);
      if (targetCard) {
        setTimeout(() => {
          targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    });
  });

  // Update statistics based on personalization
  const updateStats = () => {
    if (ctx.universityAspirations === 'Oxbridge') {
      const requirementsStat = $('.hs-stat-number', root);
      if (requirementsStat && requirementsStat.textContent === 'A*AA') {
        const label = requirementsStat.nextElementSibling;
        if (label) {
          label.textContent = t('humanities_social.stats.oxbridge_requirements');
        }
      }
    }
  };
  
  updateStats();

  // Enhanced welcome card personalization
  const enhanceWelcomeCard = () => {
    const welcomeCard = $('.hs-welcome-card', root);
    if (welcomeCard && ctx.academicInterests?.includes('humanities')) {
      const existingText = welcomeCard.querySelector('.hs-welcome-text');
      if (existingText) {
        const secondaryText = ctx.universityAspirations === 'Oxbridge' 
          ? t('humanities_social.welcome_card.oxbridge_designed')
          : t('humanities_social.welcome_card.proven_track');
        existingText.innerHTML = `
          ${t('humanities_social.welcome_card.discover')}<br>
          <small style="opacity: 0.8; margin-top: 10px; display: block;">
            ${secondaryText}
          </small>
        `;
      }
    }
  };
  
  enhanceWelcomeCard();

  // Initialize with all subjects visible
  console.log('Humanities & Social Sciences module initialized with personalization for:', ctx.childName);
};