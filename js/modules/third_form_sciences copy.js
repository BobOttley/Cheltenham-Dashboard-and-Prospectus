/* Third Form Sciences Module Initializer - Add to MODULES object in app.js */
MODULES['third_form_sciences'] = (root, ctx) => {
  // Update name placeholders
  const updateNamePlaceholders = () => {
      root.querySelectorAll('.child-name').forEach(element => {
          element.textContent = ctx.childName || '[Child\'s Name]';
      });
      
      root.querySelectorAll('.parent-name').forEach(element => {
          element.textContent = ctx.parentName || '[Parent Name]';
      });
      
      root.querySelectorAll('.family-name').forEach(element => {
          element.textContent = ctx.familyName || '[Family Name]';
      });
  };

  // Customize welcome message
  const customizeWelcomeMessage = () => {
      const welcomeText = root.querySelector('.personalized-welcome-text');
      if (welcomeText && ctx.academicInterests) {
          let message = 'Discover how our STEM programme will ';
          
          if (ctx.academicInterests.includes('sciences') && ctx.academicInterests.includes('mathematics')) {
              message += 'build on your strong interests in both sciences and mathematics, developing the analytical skills essential for top university entry';
          } else if (ctx.academicInterests.includes('sciences')) {
              message += 'develop your scientific understanding through hands-on investigation and analytical thinking';
          } else if (ctx.academicInterests.includes('mathematics')) {
              message += 'strengthen your mathematical problem-solving abilities and logical thinking skills';
          } else if (ctx.priorities?.academic === 3) {
              message += 'provide the rigorous academic foundation essential for university success';
          } else {
              message += 'develop your analytical thinking and problem-solving skills across all four core STEM subjects';
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
      const childName = ctx.childName || '[Child\'s Name]';
      const pronoun = ctx.childGender === 'female' ? 'her' : 'his';
      const pronounCap = ctx.childGender === 'female' ? 'she' : 'he';
      
      // Mathematics personalization
      const mathPersonalizedContent = root.querySelector('.mathematics-personalized-content');
      if (mathPersonalizedContent) {
          let content = 'In our Mathematics programme, ';
          
          if (ctx.academicInterests?.includes('mathematics')) {
              content += `${childName} will excel in ${pronoun} mathematical studies through our ability-set system, with opportunities for early IGCSE entry and progression to Additional Mathematics.`;
          } else if (ctx.priorities?.academic === 3) {
              content += `${childName} will develop the logical thinking and problem-solving skills essential for academic excellence across all subjects.`;
          } else {
              content += `${childName} will develop analytical thinking skills through challenging problem-solving in our supportive ability-set system.`;
          }
          
          mathPersonalizedContent.innerHTML = `<p>${content}</p>`;
      }

      // Mathematics pathway section
      const mathPathwayContent = root.querySelector('.mathematics-pathway-content');
      if (mathPathwayContent) {
          let content = '';
          
          if (ctx.academicInterests?.includes('mathematics') && ctx.priorities?.academic === 3) {
              content = `With ${childName}'s strong mathematical interests and high academic priorities, ${pronounCap} will likely be placed in our top set, working towards early IGCSE entry in Fourth Form and targeting Grade 9 achievement.`;
          } else if (ctx.academicInterests?.includes('mathematics')) {
              content = `${childName}'s mathematical interests suggest ${pronounCap} will thrive in our advanced sets, with regular assessment ensuring optimal challenge and progression.`;
          } else if (ctx.priorities?.academic === 3) {
              content = `With ${childName}'s high academic priorities, our ability-set system will ensure ${pronounCap} receives appropriate mathematical challenge while building solid foundations.`;
          } else {
              content = `Based on ${childName}'s mathematical background and interests, ${pronounCap} will be placed in the most appropriate set to challenge and support ${pronoun} development.`;
          }
          
          mathPathwayContent.innerHTML = `<p>${content}</p>`;
      }

      // Biology personalization
      const biologyPersonalizedContent = root.querySelector('.biology-personalized-content');
      if (biologyPersonalizedContent) {
          let content = 'In our Biology programme, ';
          
          if (ctx.academicInterests?.includes('sciences')) {
              content += `${childName} will explore the fascinating complexity of life through practical investigation, developing the scientific inquiry skills essential for advanced study.`;
          } else if (ctx.activities?.includes('outdoors')) {
              content += `${childName} will connect classroom learning with the natural world through fieldwork and ecological investigations.`;
          } else {
              content += `${childName} will explore the fascinating world of living organisms through practical investigation and scientific discovery.`;
          }
          
          biologyPersonalizedContent.innerHTML = `<p>${content}</p>`;
      }

      // Chemistry personalization
      const chemistryPersonalizedContent = root.querySelector('.chemistry-personalized-content');
      if (chemistryPersonalizedContent) {
          let content = 'In our Chemistry programme, ';
          
          if (ctx.academicInterests?.includes('sciences')) {
              content += `${childName} will master the central science that connects physics and biology, developing laboratory skills essential for scientific careers.`;
          } else if (ctx.priorities?.academic === 3) {
              content += `${childName} will develop rigorous analytical thinking through systematic study of matter and its interactions.`;
          } else {
              content += `${childName} will discover how matter works at the molecular level while developing essential laboratory skills.`;
          }
          
          chemistryPersonalizedContent.innerHTML = `<p>${content}</p>`;
      }

      // Physics personalization
      const physicsPersonalizedContent = root.querySelector('.physics-personalized-content');
      if (physicsPersonalizedContent) {
          let content = 'In our Physics programme, ';
          
          if (ctx.academicInterests?.includes('mathematics') && ctx.academicInterests?.includes('sciences')) {
              content += `${childName} will excel in applying mathematical skills to understand the fundamental laws governing the universe.`;
          } else if (ctx.academicInterests?.includes('sciences')) {
              content += `${childName} will discover the elegant mathematical relationships that govern natural phenomena through practical investigation.`;
          } else if (ctx.activities?.includes('technology')) {
              content += `${childName} will explore how physics principles apply to modern technology and engineering applications.`;
          } else {
              content += `${childName} will discover the fundamental laws that govern everything from motion to energy through mathematical analysis.`;
          }
          
          physicsPersonalizedContent.innerHTML = `<p>${content}</p>`;
      }

      // Similar personalization for other subject sections...
      // (This is abbreviated for space - you'd continue with all the other personalized sections)
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

  console.log('Third Form module initialized for:', ctx.childName);
};
/* Third Form Creative Arts module initializer */
MODULES['third_form_creative_arts'] = (root, ctx) => {
  // Update all name placeholders
  $$('.child-name', root).forEach(el => el.textContent = ctx.childName);
  $$('.parent-name', root).forEach(el => el.textContent = ctx.parentName || '[Parent Name]');
  $$('.family-name', root).forEach(el => el.textContent = ctx.familyName || '[Family Name]');

  // Lazy load images
  hydrateLazyAssets(root);

  // Customize welcome message based on interests
  const welcomeText = $('.personalized-welcome-text', root);
  if (welcomeText) {
    let message = 'Discover how our Creative Arts & Design programme will nurture your ';
    
    if (ctx.academicInterests?.includes('arts')) {
      message += 'artistic talents and creative vision';
    } else if (ctx.activities?.includes('arts')) {
      message += 'creative interests and practical skills';
    } else {
      message += 'creative potential and design thinking abilities';
    }
    
    message += ', preparing you for GCSE study and beyond.';
    welcomeText.textContent = message;
  }

  // Personalize Art content
  const artPersonalizedContent = $('.art-personalized-content', root);
  if (artPersonalizedContent) {
    const gender = ctx.gender === 'female' ? 'her' : 'his';
    let content = 'In our Art programme, ';
    
    if (ctx.academicInterests?.includes('arts')) {
      content += `${ctx.childName} will develop ${gender} artistic vision through hands-on exploration of Fine Art, Ceramics, and Printmaking. With your strong interest in the arts, you'll thrive in our supportive creative environment where risk-taking and experimentation are encouraged.`;
    } else if (ctx.priorities?.arts === 3) {
      content += `${ctx.childName} will discover ${gender} creative potential through structured exploration of different artistic mediums. Our three-specialist rotation ensures comprehensive exposure to various creative techniques.`;
    } else {
      content += `${ctx.childName} will develop creative confidence through structured exploration of different artistic mediums, building essential skills for visual communication and personal expression.`;
    }
    
    artPersonalizedContent.innerHTML = `<p>${content}</p>`;
  }

  // Personalize Design Technology content
  const designTechContent = $('.design-tech-personalized-content', root);
  if (designTechContent) {
    const gender = ctx.gender === 'female' ? 'her' : 'his';
    let content = 'In our Design Technology programme, ';
    
    if (ctx.activities?.includes('technology') || ctx.academicInterests?.includes('design')) {
      content += `${ctx.childName} will excel in hands-on problem-solving, developing ${gender} technical skills through real-world design challenges. Your interest in technology and design makes this programme particularly exciting for your development.`;
    } else if (ctx.priorities?.academic === 3) {
      content += `${ctx.childName} will develop practical skills while learning to solve real-world problems through innovative design. The programme's GCSE preparation focus aligns perfectly with your academic priorities.`;
    } else {
      content += `${ctx.childName} will develop practical skills while learning to solve real-world problems through innovative design, building confidence in both textiles and resistant materials.`;
    }
    
    designTechContent.innerHTML = `<p>${content}</p>`;
  }

  // Highlight subjects based on interests
  const artCard = $('.subject-card.art', root);
  const designCard = $('.subject-card.design-technology', root);
  
  if (ctx.academicInterests?.includes('arts') || ctx.priorities?.arts === 3) {
    artCard?.classList.add('priority-match');
  }
  
  if (ctx.academicInterests?.includes('design') || ctx.activities?.includes('technology')) {
    designCard?.classList.add('priority-match');
  }

  // Navigation filtering functionality
  $$('.nav-btn', root).forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      $$('.nav-btn', root).forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');
      
      const filter = btn.getAttribute('data-filter');
      const cards = $$('.subject-card', root);
      
      cards.forEach(card => {
        if (filter === 'all' || card.classList.contains(filter)) {
          card.style.display = 'block';
          card.classList.remove('hidden');
        } else {
          card.style.display = 'none';
          card.classList.add('hidden');
        }
      });
    });
  });

  // Highlight navigation based on priorities
  $$('.nav-btn', root).forEach(button => {
    const filter = button.getAttribute('data-filter');
    
    if (filter === 'art' && (ctx.academicInterests?.includes('arts') || ctx.priorities?.arts === 3)) {
      button.classList.add('priority-high');
    } else if (filter === 'design-technology' && (ctx.academicInterests?.includes('design') || ctx.activities?.includes('technology'))) {
      button.classList.add('priority-high');
    }
  });
};