/* Applied & Vocational Studies Module Initializer - Add this to the MODULES object in app.js */
MODULES['applied_vocational'] = (root, ctx) => {
    // Update name placeholders
    const updateNames = () => {
      root.querySelectorAll('.child-name').forEach(el => {
        el.textContent = ctx.childName || '[Child\'s Name]';
      });
    };
  
    // Customize welcome message based on user interests
    const customizeWelcome = () => {
      const welcomeText = root.querySelector('.av-welcome-text');
      if (!welcomeText) return;
      
      const childName = ctx.childName || '[Child\'s Name]';
      let message = `Discover how our applied learning pathways will prepare ${childName} for `;
      
      if (ctx.academicInterests?.includes('business') || ctx.activities?.includes('leadership')) {
        message += 'professional leadership success and business excellence.';
      } else if (ctx.academicInterests?.includes('sciences') && ctx.activities?.includes('sports')) {
        message += 'sports science excellence and performance analysis careers.';
      } else if (ctx.academicInterests?.includes('mathematics') || ctx.activities?.includes('technology')) {
        message += 'technology innovation and computational thinking success.';
      } else if (ctx.universityAspirations === 'Russell Group') {
        message += 'Russell Group university success through applied learning excellence.';
      } else {
        message += 'professional success and university excellence through practical skills development.';
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
        businessIntro.textContent = `Perfect for ${ctx.childName || '[Child\'s Name]'}'s leadership interests - dynamic subject exploring organisations globally. Excellent foundation for business-related undergraduate study and ${ctx.universityAspirations || 'university'} applications.`;
      }
      
      // Computer Science personalization for technology interests
      const csIntro = root.querySelector('#cs-card .av-subject-intro');
      if (csIntro && ctx.activities?.includes('technology')) {
        csIntro.textContent = `Ideal for ${ctx.childName || '[Child\'s Name]'}'s technology interests - develop analytical thinking and problem-solving through computational thinking, modelling, analysing, and implementing innovative coding solutions.`;
      }
      
      // Sports Science personalization
      const sportsIntro = root.querySelector('#sports-card .av-subject-intro');
      if (sportsIntro && ctx.activities?.includes('sports')) {
        sportsIntro.textContent = `Perfect for ${ctx.childName || '[Child\'s Name]'}'s sporting interests - deeper understanding of human body performance applying scientific theories to optimise health and athletic excellence.`;
      }
    };
  
    // Customize navigation title
    const customizeNavigation = () => {
      const navTitle = root.querySelector('.av-nav-title');
      if (navTitle && ctx.childName) {
        navTitle.textContent = `Subjects for ${ctx.childName} - Filter by Interest`;
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