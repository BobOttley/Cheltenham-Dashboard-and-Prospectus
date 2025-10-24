/* Applied & Vocational Studies Module Initializer - Add this to the MODULES object in app.js */
MODULES['applied_vocational'] = (root, ctx) => {
    // Translation function
    const t = (window.PEN_I18N && typeof window.PEN_I18N.t === 'function')
      ? window.PEN_I18N.t
      : () => '';
  
    // Update name placeholders
    const updateNames = () => {
      root.querySelectorAll('.child-name').forEach(el => {
        el.textContent = ctx.childName || t('applied_vocational.placeholders.child_name');
      });
    };
  
    // Customize welcome message based on user interests
    const customizeWelcome = () => {
      const welcomeText = root.querySelector('.av-welcome-text');
      if (!welcomeText) return;
      
      const childName = ctx.childName || t('applied_vocational.placeholders.child_name');
      let message = t('applied_vocational.welcome.discover_prefix') + ' ' + childName + ' ' + t('applied_vocational.welcome.discover_suffix') + ' ';
      
      if (ctx.academicInterests?.includes('business') || ctx.activities?.includes('leadership')) {
        message += t('applied_vocational.welcome.leadership_pathway');
      } else if (ctx.academicInterests?.includes('sciences') && ctx.activities?.includes('sports')) {
        message += t('applied_vocational.welcome.sports_science_pathway');
      } else if (ctx.academicInterests?.includes('mathematics') || ctx.activities?.includes('technology')) {
        message += t('applied_vocational.welcome.technology_pathway');
      } else if (ctx.universityAspirations === 'Russell Group') {
        message += t('applied_vocational.welcome.russell_group_pathway');
      } else {
        message += t('applied_vocational.welcome.default_pathway');
      }
      
      welcomeText.textContent = message;
    };
  
    // Prioritize subjects based on interests and activities
    const prioritizeSubjects = () => {
      const navButtons = root.querySelectorAll('.av-nav-btn');
      const cards = root.querySelectorAll('.av-card');
      
      // Business Studies prioritization
      if (ctx.academicInterests?.includes('business') || ctx.activities?.includes('leadership')) {
        navButtons.forEach(btn => {
          if (btn.getAttribute('data-filter') === 'business') {
            btn.classList.add('priority-high');
          }
        });
        cards.forEach(card => {
          if (card.getAttribute('data-subject') === 'business') {
            card.classList.add('priority-match');
          }
        });
      }
      
      // Computer Science prioritization
      if (ctx.academicInterests?.includes('mathematics') || ctx.activities?.includes('technology')) {
        navButtons.forEach(btn => {
          if (btn.getAttribute('data-filter') === 'computer-science') {
            btn.classList.add('priority-high');
          }
        });
        cards.forEach(card => {
          if (card.getAttribute('data-subject') === 'computer-science') {
            card.classList.add('priority-match');
          }
        });
      }
      
      // Psychology prioritization
      if (ctx.academicInterests?.includes('sciences') || ctx.activities?.includes('leadership')) {
        navButtons.forEach(btn => {
          if (btn.getAttribute('data-filter') === 'psychology') {
            btn.classList.add('priority-high');
          }
        });
        cards.forEach(card => {
          if (card.getAttribute('data-subject') === 'psychology') {
            card.classList.add('priority-match');
          }
        });
      }
      
      // Sports Science prioritization
      if (ctx.activities?.includes('sports') || ctx.academicInterests?.includes('sciences')) {
        navButtons.forEach(btn => {
          if (btn.getAttribute('data-filter') === 'sports-science') {
            btn.classList.add('priority-high');
          }
        });
        cards.forEach(card => {
          if (card.getAttribute('data-subject') === 'sports-science') {
            card.classList.add('priority-match');
          }
        });
      }
    };
  
    // Personalize content based on context
    const personalizeContent = () => {
      // Business card personalization
      const businessIntro = root.querySelector('#business-card .av-subject-intro');
      if (businessIntro && ctx.activities?.includes('leadership')) {
        businessIntro.textContent = t('applied_vocational.personalization.business_intro', {
          childName: ctx.childName || t('applied_vocational.placeholders.child_name'),
          university: ctx.universityAspirations || t('applied_vocational.placeholders.university')
        });
      }
      
      // Computer Science personalization for technology interests
      const csIntro = root.querySelector('#cs-card .av-subject-intro');
      if (csIntro && ctx.activities?.includes('technology')) {
        csIntro.textContent = t('applied_vocational.personalization.cs_intro', {
          childName: ctx.childName || t('applied_vocational.placeholders.child_name')
        });
      }
      
      // Sports Science personalization
      const sportsIntro = root.querySelector('#sports-card .av-subject-intro');
      if (sportsIntro && ctx.activities?.includes('sports')) {
        sportsIntro.textContent = t('applied_vocational.personalization.sports_intro', {
          childName: ctx.childName || t('applied_vocational.placeholders.child_name')
        });
      }
    };
  
    // Customize navigation title
    const customizeNavigation = () => {
      const navTitle = root.querySelector('.av-nav-title');
      if (navTitle && ctx.childName) {
        navTitle.textContent = t('applied_vocational.navigation.subjects_filter', {
          childName: ctx.childName
        });
      }
    };
  
    // Setup navigation filtering
    const setupNavigation = () => {
      const navButtons = root.querySelectorAll('.av-nav-btn');
      const cards = root.querySelectorAll('.av-card');
      
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
      const sectionTitles = root.querySelectorAll('.av-section-title');
      sectionTitles.forEach(title => {
        title.addEventListener('click', function() {
          const section = this.parentElement;
          section.classList.toggle('collapsed');
        });
      });
  
      // Add interactivity to stats
      const stats = root.querySelectorAll('.av-stat');
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
    setupNavigation();
  };
