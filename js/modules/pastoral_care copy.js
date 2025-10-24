/* Pastoral Care module initializer - Add to MODULES object in app.js */
MODULES['pastoral_care'] = (root, ctx) => {
  // Update all name placeholders
  const updateNamePlaceholders = () => {
    root.querySelectorAll('.child-name').forEach(el => {
      const fallback = el.getAttribute('data-fallback') || 'your child';
      const name = (ctx.childName || '').trim();
      el.textContent = name && !name.startsWith('[') ? name : fallback;
    });
  };

  // Add priority-based content
  const addPriorityContent = () => {
    const priorityTitle = root.querySelector('.priority-title');
    const priorityMessage = root.querySelector('.priority-message');
    
    if (!priorityTitle || !priorityMessage) return;
    
    const childName = ctx.childName || 'Your child';
    const familyName = ctx.familyName || 'your family';
    
    if (ctx.priorities?.pastoral === 3) {
      priorityTitle.textContent = `${childName}'s Wellbeing is Our Priority`;
      priorityMessage.textContent = `I'm pleased you value pastoral care so highly. Our comprehensive support system ensures ${childName}'s wellbeing is at the heart of everything we do.`;
    } else if (ctx.boardingPreference === 'Full Boarding') {
      priorityTitle.textContent = `Boarding Family Support for ${childName}`;
      priorityMessage.textContent = `As a boarding family, you'll be reassured to know our Housemasters and Housemistresses live on-site with their own families.`;
    } else {
      priorityTitle.textContent = `Comprehensive Pastoral Support for ${childName}`;
      priorityMessage.textContent = `Every pupil's wellbeing journey is unique. Our multi-layered pastoral care system ensures ${childName} receives exactly the right support.`;
    }
  };

  // Add conditional content
  const addConditionalContent = () => {
    const childName = ctx.childName || 'your child';
    
    // Boarding notes
    const boardingNote = root.querySelector('.boarding-note');
    if (boardingNote && ctx.boardingPreference === 'Full Boarding') {
      boardingNote.textContent = `As a full boarding pupil, ${childName} will experience the richness of our residential community life.`;
    }
    
    // Academic notes
    const academicNote = root.querySelector('.academic-support-note');
    if (academicNote && ctx.academicInterests?.includes('sciences')) {
      academicNote.textContent = `With ${childName}'s Sciences interests, your Tutor will provide specialist academic guidance.`;
    }
    
    // Wellbeing notes
    const wellbeingNote = root.querySelector('.wellbeing-note');
    if (wellbeingNote && ctx.values?.includes('wellbeing')) {
      wellbeingNote.textContent = `Given your family's focus on wellbeing, you'll appreciate our Floreat programme's emphasis on mental health.`;
    }
    
    // Health notes
    const healthNote = root.querySelector('.health-note');
    if (healthNote && ctx.activities?.includes('sports')) {
      healthNote.textContent = `With ${childName}'s sporting interests, our Health Centre provides specialist sports injury support.`;
    }
    
    // Leadership notes
    const leadershipNote = root.querySelector('.leadership-note');
    if (leadershipNote && ctx.activities?.includes('leadership')) {
      leadershipNote.textContent = `${childName}'s leadership interests align perfectly with our peer mentoring programme.`;
    }
    
    // Learning support notes
    const learningNote = root.querySelector('.learning-support-note');
    if (learningNote && ctx.priorities?.academic === 3) {
      learningNote.textContent = `Given your high academic priorities, our Learning Support team will ensure ${childName} has every opportunity to excel.`;
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
    
    const childName = ctx.childName || 'your child';
    let message = `Cheltenham College's comprehensive pastoral care system ensures ${childName} receives individual attention, support, and guidance to flourish academically, socially, and personally.`;
    
    if (ctx.priorities?.pastoral === 3 && ctx.boardingPreference === 'Full Boarding') {
      message += ` With dedicated House staff living on-site and our innovative Floreat programme, we create a nurturing environment where wellbeing is paramount.`;
    }
    
    finalCommitment.textContent = message;
  };

  // Setup journey timeline
  const setupJourneyTimeline = () => {
    const steps = root.querySelectorAll('.journey-step');
    const details = root.querySelector('#journey-details');
    const text = root.querySelector('#journey-text');
    
    if (!steps.length || !details || !text) return;
    
    const childName = ctx.childName || 'your child';
    const stepDetails = [
      `During ${childName}'s first weeks, their Housemaster/Housemistress and Tutor will work closely together to ensure a smooth transition.`,
      `${childName} will participate in House activities, be paired with older mentors, and develop trust with their Tutor through regular check-ins.`,
      `Through the Floreat programme, ${childName} will develop resilience, learn stress management techniques, and take on leadership roles.`,
      `As ${childName} progresses, they'll become a mentor to younger pupils and be fully prepared for Upper College and beyond.`
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