/* Third Form Sciences Module Initializer - Add to MODULES object in app.js */
MODULES['third_form_sciences'] = (root, ctx) => {
  // Translation function
  const t = (window.PEN_I18N && typeof window.PEN_I18N.t === 'function')
    ? window.PEN_I18N.t
    : () => '';

  // Update name placeholders
  const updateNamePlaceholders = () => {
      root.querySelectorAll('.child-name').forEach(element => {
          element.textContent = ctx.childName || t('third_form_sciences.placeholders.child_name');
      });
      
      root.querySelectorAll('.parent-name').forEach(element => {
          element.textContent = ctx.parentName || t('third_form_sciences.placeholders.parent_name');
      });
      
      root.querySelectorAll('.family-name').forEach(element => {
          element.textContent = ctx.familyName || t('third_form_sciences.placeholders.family_name');
      });
  };

  // Customize welcome message
  const customizeWelcomeMessage = () => {
      const welcomeText = root.querySelector('.personalized-welcome-text');
      if (welcomeText && ctx.academicInterests) {
          let message = t('third_form_sciences.welcome.prefix') + ' ';
          
          if (ctx.academicInterests.includes('sciences') && ctx.academicInterests.includes('mathematics')) {
              message += t('third_form_sciences.welcome.sciences_and_math');
          } else if (ctx.academicInterests.includes('sciences')) {
              message += t('third_form_sciences.welcome.sciences');
          } else if (ctx.academicInterests.includes('mathematics')) {
              message += t('third_form_sciences.welcome.mathematics');
          } else if (ctx.priorities?.academic === 3) {
              message += t('third_form_sciences.welcome.academic_priority');
          } else {
              message += t('third_form_sciences.welcome.general');
          }
          
          message += '.';
          welcomeText.textContent = message;
      }
  };

  // Prioritize subjects based on interests
  const prioritizeSubjects = () => {
      if (ctx.academicInterests?.includes('mathematics')) {
          root.querySelector('.subject-card.mathematics')?.classList.add('priority-match');
      }
      
      if (ctx.academicInterests?.includes('sciences')) {
          root.querySelector('.subject-card.physics')?.classList.add('priority-match');
          root.querySelector('.subject-card.chemistry')?.classList.add('priority-match');
          root.querySelector('.subject-card.biology')?.classList.add('priority-match');
      }
      
      if (ctx.priorities?.academic === 3) {
          root.querySelectorAll('.subject-card').forEach(card => {
              if (!card.classList.contains('priority-match')) {
                  card.classList.add('priority-match');
              }
          });
      }
  };

  // Add personalized content sections
  const addPersonalizedContent = () => {
      const childName = ctx.childName || t('third_form_sciences.placeholders.child_name');
      const possessive = ctx.childGender === 'female' 
        ? t('third_form_sciences.pronouns.her')
        : t('third_form_sciences.pronouns.his');
      const pronoun = ctx.childGender === 'female' 
        ? t('third_form_sciences.pronouns.she')
        : t('third_form_sciences.pronouns.he');
      
      // Mathematics personalization
      const mathPersonalizedContent = root.querySelector('.mathematics-personalized-content');
      if (mathPersonalizedContent) {
          let content = '';
          
          if (ctx.academicInterests?.includes('mathematics')) {
              content = t('third_form_sciences.mathematics.interest', { childName, possessive });
          } else if (ctx.priorities?.academic === 3) {
              content = t('third_form_sciences.mathematics.academic', { childName });
          } else {
              content = t('third_form_sciences.mathematics.general', { childName });
          }
          
          mathPersonalizedContent.innerHTML = `<p>${content}</p>`;
      }

      // Mathematics pathway section
      const mathPathwayContent = root.querySelector('.mathematics-pathway-content');
      if (mathPathwayContent) {
          let content = '';
          
          if (ctx.academicInterests?.includes('mathematics') && ctx.priorities?.academic === 3) {
              content = t('third_form_sciences.mathematics_pathway.strong_interest', { childName, pronoun });
          } else if (ctx.academicInterests?.includes('mathematics')) {
              content = t('third_form_sciences.mathematics_pathway.interest', { childName, pronoun });
          } else if (ctx.priorities?.academic === 3) {
              content = t('third_form_sciences.mathematics_pathway.academic', { childName, pronoun });
          } else {
              content = t('third_form_sciences.mathematics_pathway.general', { childName, pronoun, possessive });
          }
          
          mathPathwayContent.innerHTML = `<p>${content}</p>`;
      }

      // Biology personalization
      const biologyPersonalizedContent = root.querySelector('.biology-personalized-content');
      if (biologyPersonalizedContent) {
          let content = '';
          
          if (ctx.academicInterests?.includes('sciences')) {
              content = t('third_form_sciences.biology.sciences', { childName });
          } else if (ctx.activities?.includes('outdoors')) {
              content = t('third_form_sciences.biology.outdoors', { childName });
          } else {
              content = t('third_form_sciences.biology.general', { childName });
          }
          
          biologyPersonalizedContent.innerHTML = `<p>${content}</p>`;
      }

      // Chemistry personalization
      const chemistryPersonalizedContent = root.querySelector('.chemistry-personalized-content');
      if (chemistryPersonalizedContent) {
          let content = '';
          
          if (ctx.academicInterests?.includes('sciences')) {
              content = t('third_form_sciences.chemistry.sciences', { childName });
          } else if (ctx.priorities?.academic === 3) {
              content = t('third_form_sciences.chemistry.academic', { childName });
          } else {
              content = t('third_form_sciences.chemistry.general', { childName });
          }
          
          chemistryPersonalizedContent.innerHTML = `<p>${content}</p>`;
      }

      // Physics personalization
      const physicsPersonalizedContent = root.querySelector('.physics-personalized-content');
      if (physicsPersonalizedContent) {
          let content = '';
          
          if (ctx.academicInterests?.includes('mathematics') && ctx.academicInterests?.includes('sciences')) {
              content = t('third_form_sciences.physics.math_and_sciences', { childName });
          } else if (ctx.academicInterests?.includes('sciences')) {
              content = t('third_form_sciences.physics.sciences', { childName });
          } else if (ctx.activities?.includes('technology')) {
              content = t('third_form_sciences.physics.technology', { childName });
          } else {
              content = t('third_form_sciences.physics.general', { childName });
          }
          
          physicsPersonalizedContent.innerHTML = `<p>${content}</p>`;
      }
  };

  // Customize navigation
  const customizeNavigation = () => {
      const navButtons = root.querySelectorAll('.nav-btn');
      
      if (ctx.academicInterests?.includes('sciences') || ctx.academicInterests?.includes('mathematics')) {
          navButtons.forEach(button => {
              const filter = button.getAttribute('data-filter');
              
              if (filter === 'mathematics' && ctx.academicInterests?.includes('mathematics')) {
                  button.classList.add('priority-high');
              }
              if ((filter === 'biology' || filter === 'chemistry' || filter === 'physics') && ctx.academicInterests?.includes('sciences')) {
                  button.classList.add('priority-high');
              }
          });
      }
  };

  // Subject filtering functionality
  const filterSubjects = (category) => {
      const subjects = root.querySelectorAll('.subject-card');
      
      subjects.forEach(subject => {
          if (category === 'all' || subject.dataset.subject === category) {
              subject.classList.remove('hidden');
          } else {
              subject.classList.add('hidden');
          }
      });
  };

  // Initialize navigation buttons
  const initializeNavigation = () => {
      const navButtons = root.querySelectorAll('.nav-btn');
      
      navButtons.forEach(button => {
          button.addEventListener('click', function() {
              const filter = this.getAttribute('data-filter');
              
              // Update active state
              navButtons.forEach(btn => btn.classList.remove('active'));
              this.classList.add('active');
              
              // Filter subjects
              filterSubjects(filter);
          });
      });
  };

  // Initialize collapsible sections
  const initializeCollapsibles = () => {
      const sectionTitles = root.querySelectorAll('.section-title');
      
      sectionTitles.forEach(title => {
          title.addEventListener('click', function() {
              const section = this.parentElement;
              section.classList.toggle('collapsed');
          });
      });
  };

  // Add hover effects to stats
  const initializeStatsAnimation = () => {
      const stats = root.querySelectorAll('.stat');
      
      stats.forEach(stat => {
          stat.addEventListener('mouseenter', () => {
              stat.style.transform = 'translateY(-5px) scale(1.05)';
          });
          
          stat.addEventListener('mouseleave', () => {
              stat.style.transform = 'translateY(0) scale(1)';
          });
      });
  };

  // Lazy load images
  if (typeof hydrateLazyAssets === 'function') {
      hydrateLazyAssets(root);
  }

  // Execute all initialization functions
  updateNamePlaceholders();
  customizeWelcomeMessage();
  prioritizeSubjects();
  addPersonalizedContent();
  customizeNavigation();
  initializeNavigation();
  initializeCollapsibles();
  initializeStatsAnimation();

  console.log('Third Form Sciences module initialized for:', ctx.childName);
};