/* Pastoral Care module initializer - Add to MODULES object in app.js */
MODULES['pastoral_care'] = (root, ctx) => {
  // Translation function
  const t = (window.PEN_I18N && typeof window.PEN_I18N.t === 'function')
    ? window.PEN_I18N.t
    : () => '';

  // Update all name placeholders
  const updateNamePlaceholders = () => {
    root.querySelectorAll('.child-name').forEach(el => {
      const fallback = el.getAttribute('data-fallback') || t('pastoral_care.placeholders.your_child');
      const name = (ctx.childName || '').trim();
      el.textContent = name && !name.startsWith('[') ? name : fallback;
    });
  };

  // Add priority-based content
  const addPriorityContent = () => {
    const priorityTitle = root.querySelector('.priority-title');
    const priorityMessage = root.querySelector('.priority-message');
    
    if (!priorityTitle || !priorityMessage) return;
    
    const childName = ctx.childName || t('pastoral_care.placeholders.your_child');
    const familyName = ctx.familyName || 'your family';
    
    if (ctx.priorities?.pastoral === 3) {
      priorityTitle.textContent = t('pastoral_care.priority.wellbeing_title', { childName });
      priorityMessage.textContent = t('pastoral_care.priority.wellbeing_message', { childName });
    } else if (ctx.boardingPreference === 'Full Boarding') {
      priorityTitle.textContent = t('pastoral_care.priority.boarding_title', { childName });
      priorityMessage.textContent = t('pastoral_care.priority.boarding_message');
    } else {
      priorityTitle.textContent = t('pastoral_care.priority.comprehensive_title', { childName });
      priorityMessage.textContent = t('pastoral_care.priority.comprehensive_message', { childName });
    }
  };

  // Add conditional content
  const addConditionalContent = () => {
    const childName = ctx.childName || t('pastoral_care.placeholders.your_child');
    
    // Boarding notes
    const boardingNote = root.querySelector('.boarding-note');
    if (boardingNote && ctx.boardingPreference === 'Full Boarding') {
      boardingNote.textContent = t('pastoral_care.conditional.boarding_note', { childName });
    }
    
    // Academic notes
    const academicNote = root.querySelector('.academic-support-note');
    if (academicNote && ctx.academicInterests?.includes('sciences')) {
      academicNote.textContent = t('pastoral_care.conditional.academic_note', { childName });
    }
    
    // Wellbeing notes
    const wellbeingNote = root.querySelector('.wellbeing-note');
    if (wellbeingNote && ctx.values?.includes('wellbeing')) {
      wellbeingNote.textContent = t('pastoral_care.conditional.wellbeing_note');
    }
    
    // Health notes
    const healthNote = root.querySelector('.health-note');
    if (healthNote && ctx.activities?.includes('sports')) {
      healthNote.textContent = t('pastoral_care.conditional.health_note', { childName });
    }
    
    // Leadership notes
    const leadershipNote = root.querySelector('.leadership-note');
    if (leadershipNote && ctx.activities?.includes('leadership')) {
      leadershipNote.textContent = t('pastoral_care.conditional.leadership_note', { childName });
    }
    
    // Learning support notes
    const learningNote = root.querySelector('.learning-support-note');
    if (learningNote && ctx.priorities?.academic === 3) {
      learningNote.textContent = t('pastoral_care.conditional.learning_note', { childName });
    }
  };

  // Prioritize support pillars
  const prioritizeSupportPillars = () => {
    const pillars = root.querySelectorAll('.pillar-card');
    
    pillars.forEach(pillar => {
      const category = pillar.getAttribute('data-category');
      let priority = 'medium-priority';
      
      if ((category === 'house' && ctx.boardingPreference === 'Full Boarding') ||
          (category === 'floreat' && ctx.priorities?.pastoral === 3) ||
          (category === 'tutor' && ctx.priorities?.academic === 3)) {
        priority = 'high-priority';
      }
      
      pillar.classList.add(priority);
    });
  };

  // Add final commitment
  const addFinalCommitment = () => {
    const finalCommitment = root.querySelector('.final-commitment');
    if (!finalCommitment) return;
    
    const childName = ctx.childName || t('pastoral_care.placeholders.your_child');
    let message = t('pastoral_care.commitment.main', { childName });
    
    if (ctx.priorities?.pastoral === 3 && ctx.boardingPreference === 'Full Boarding') {
      message += ' ' + t('pastoral_care.commitment.pastoral_boarding');
    }
    
    finalCommitment.textContent = message;
  };

  // Setup journey timeline
  const setupJourneyTimeline = () => {
    const steps = root.querySelectorAll('.journey-step');
    const details = root.querySelector('#journey-details');
    const text = root.querySelector('#journey-text');
    
    if (!steps.length || !details || !text) return;
    
    const childName = ctx.childName || t('pastoral_care.placeholders.your_child');
    const stepDetails = [
      t('pastoral_care.journey.step1', { childName }),
      t('pastoral_care.journey.step2', { childName }),
      t('pastoral_care.journey.step3', { childName }),
      t('pastoral_care.journey.step4', { childName })
    ];
    
    steps.forEach((step, index) => {
      step.addEventListener('click', () => {
        steps.forEach(s => s.classList.remove('active'));
        step.classList.add('active');
        text.textContent = stepDetails[index];
        details.style.display = 'block';
      });
    });
  };

  // Setup expandable cards
  const setupExpandables = () => {
    const expandables = root.querySelectorAll('.pillar-card.expandable');
    
    expandables.forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.expandable-content')) return;
        
        card.classList.toggle('expanded');
        const content = card.querySelector('.expandable-content');
        if (content) {
          content.classList.toggle('open');
        }
      });
    });
  };

  // Initialize module
  updateNamePlaceholders();
  addPriorityContent();
  addConditionalContent();
  prioritizeSupportPillars();
  addFinalCommitment();
  setupJourneyTimeline();
  setupExpandables();
  
  // Lazy load any images
  if (typeof hydrateLazyAssets === 'function') {
    hydrateLazyAssets(root);
  }
};