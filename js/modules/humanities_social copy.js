/* Humanities & Social Sciences Module Initializer - Add to MODULES object in app.js */
MODULES['humanities_social'] = (root, ctx) => {
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
        message = `Discover how our rigorous humanities and social sciences programmes will develop the critical thinking and analytical writing skills essential for Oxbridge success.`;
      } else {
        message = `Explore our humanities and social sciences programmes designed to develop your critical thinking and prepare you for university excellence.`;
      }
    } else if (ctx.activities?.includes('debate') || ctx.activities?.includes('public_speaking')) {
      message = `See how our humanities programmes will enhance your communication and analytical skills through engaging with complex ideas and perspectives.`;
    } else if (ctx.priorities?.academic >= 2) {
      message = `Discover how our humanities and social sciences programmes develop the critical thinking skills valued by universities and employers.`;
    } else {
      message = `Explore our humanities and social sciences programmes that develop analytical thinking and prepare you for university success.`;
    }
    
    welcomeText.textContent = message;
  }

  // Personalize hero subtitle based on interests
  const heroSubtitle = $('.hs-hero-subtitle', root);
  if (heroSubtitle && ctx.academicInterests?.includes('humanities')) {
    heroSubtitle.textContent = `Perfect for students passionate about literature, history, and understanding human society. These subjects develop the analytical and communication skills that open doors to prestigious universities and diverse career paths.`;
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
        highlight.innerHTML = `<strong>Recommended for ${ctx.childName}:</strong> ${reason}`;
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
    prioritizeSubject('english', 'Your interest in literature and creative writing makes English Literature an ideal choice for developing analytical and creative skills.');
  }
  
  if (ctx.academicInterests?.includes('history') || ctx.activities?.includes('debate')) {
    prioritizeSubject('history', 'Your interests align perfectly with History, developing research skills and analytical thinking valued by universities.');
  }
  
  if (ctx.academicInterests?.includes('geography') || ctx.activities?.includes('environmental_awareness')) {
    prioritizeSubject('geography', 'Geography combines your interests with essential skills in data analysis and environmental understanding.');
  }
  
  if (ctx.academicInterests?.includes('economics') || ctx.activities?.includes('young_enterprise')) {
    prioritizeSubject('economics', 'Economics perfectly matches your interests and provides valuable analytical skills for business and finance careers.');
  }
  
  if (ctx.activities?.includes('student_council') || ctx.activities?.includes('debate')) {
    prioritizeSubject('politics', 'Your leadership activities and interest in current affairs make Politics an excellent choice for developing understanding of governance and society.');
  }
  
  if (ctx.academicInterests?.includes('psychology') || ctx.activities?.includes('peer_mentoring')) {
    prioritizeSubject('psychology', 'Your interest in understanding human behavior makes Psychology ideal for developing scientific analysis of mind and behavior.');
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
          <h4>Oxbridge Preparation</h4>
          <p><strong>Essential for ${ctx.childName}:</strong> EPQ demonstrates the independent research skills and academic initiative highly valued by Cambridge and Oxford admissions tutors. Many successful Oxbridge candidates cite their EPQ as crucial preparation for university-level study.</p>
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
        comboTitle = `Perfect for ${ctx.childName}`;
        comboContent = `<p><strong>English Literature + History:</strong> Your combined interests make this an ideal combination for Law, English, or Classical Studies degrees.</p>
                      <p>Both subjects develop the analytical writing and critical thinking skills that universities value most highly.</p>`;
      } else if (ctx.academicInterests.includes('economics') && ctx.academicInterests.includes('geography')) {
        comboTitle = `Recommended for ${ctx.childName}`;
        comboContent = `<p><strong>Geography + Economics:</strong> Perfect for your interests in understanding global systems and economic patterns.</p>
                      <p>Excellent preparation for careers in international development, environmental consulting, or urban planning.</p>`;
      } else if (ctx.universityAspirations === 'Oxbridge') {
        comboTitle = `Oxbridge Strategy for ${ctx.childName}`;
        comboContent = `<p><strong>Your Subject Combination + EPQ:</strong> Focus on achieving A*A*A with EPQ to meet Oxbridge requirements.</p>
                      <p>Choose subjects you're passionate about - Oxford and Cambridge value genuine intellectual curiosity above strategic subject selection.</p>`;
      } else {
        comboTitle = `Tailored for ${ctx.childName}`;
        comboContent = `<p><strong>Your Interests + EPQ:</strong> Any three humanities/social sciences subjects provide excellent preparation for university study.</p>
                      <p>The EPQ will develop the independent research skills essential for degree-level success.</p>`;
      }
      
      personalCombo.innerHTML = `<h3>${comboTitle}</h3>${comboContent}`;
      grid.appendChild(personalCombo);
    }
  }

  // Add activity connections where relevant
  const addActivityConnection = (subject, activity, connection) => {
    const card = $(`.hs-card[data-subject="${subject}"]`, root);
    if (card && ctx.activities?.includes(activity)) {
      const cardContent = card.querySelector('.hs-card-content');
      if (cardContent) {
        const activityNote = document.createElement('div');
        activityNote.className = 'hs-activity-connection';
        activityNote.innerHTML = `
          <h4>Perfect Match with Your Activities</h4>
          <p><strong>${ctx.childName}'s ${activity.replace('_', ' ')} experience</strong> provides excellent foundation for ${connection}</p>
        `;
        cardContent.appendChild(activityNote);
      }
    }
  };

  // Apply activity connections
  addActivityConnection('english', 'drama', 'understanding character development and literary analysis through performance experience.');
  addActivityConnection('history', 'debate', 'developing the argumentation and evidence evaluation skills essential for historical analysis.');
  addActivityConnection('geography', 'duke_of_edinburgh', 'applying geographical knowledge through practical fieldwork and environmental awareness.');
  addActivityConnection('politics', 'student_council', 'understanding democratic processes and governance through practical leadership experience.');
  addActivityConnection('psychology', 'peer_mentoring', 'applying understanding of human behavior and development in supporting others.');

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
          label.textContent = 'Oxbridge Requirements (A*A*A + EPQ)';
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
        existingText.innerHTML = `
          Discover how our humanities and social sciences programmes will develop your critical thinking and prepare you for university success.<br>
          <small style="opacity: 0.8; margin-top: 10px; display: block;">
            ${ctx.universityAspirations === 'Oxbridge' ? 'Specially designed to meet Oxbridge entry requirements' : 'Proven track record of university success'}
          </small>
        `;
      }
    }
  };
  
  enhanceWelcomeCard();

  // Initialize with all subjects visible
  console.log('Humanities & Social Sciences module initialized with personalization for:', ctx.childName);
};