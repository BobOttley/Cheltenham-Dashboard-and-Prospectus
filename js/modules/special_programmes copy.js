/* Special Programmes Module Initializer - Add this to the MODULES object in app.js */
MODULES['special_programmes'] = (root, ctx) => {
  // Update name placeholders
  const updateNames = () => {
      root.querySelectorAll('.child-name').forEach(el => {
          el.textContent = ctx.childName || '[Child\'s Name]';
      });
  };

  // Customize welcome message
  const customizeWelcome = () => {
      const welcomeText = root.querySelector('.sp-welcome-text');
      if (!welcomeText) return;
      
      let message = 'Discover how our special programmes will ';
      
      if (ctx.activities?.includes('music') && ctx.activities?.includes('leadership')) {
          message += 'develop your musical talents and leadership potential through diverse enrichment opportunities';
      } else if (ctx.activities?.includes('music')) {
          message += 'nurture your musical interests while developing essential skills for academic and personal success';
      } else if (ctx.activities?.includes('leadership')) {
          message += 'develop your leadership potential and broaden your horizons through challenging activities';
      } else if (ctx.activities?.includes('technology')) {
          message += 'advance your technology skills while developing research abilities and creative expression';
      } else if (ctx.priorities?.activities === 3) {
          message += 'provide diverse opportunities to explore your interests and develop new talents';
      } else {
          message += 'develop your talents and interests beyond the academic curriculum through enriching experiences';
      }
      
      message += '.';
      welcomeText.textContent = message;
  };

  // Prioritize programmes based on interests
  const prioritizeProgrammes = () => {
      // Highlight programmes based on interests
      if (ctx.activities?.includes('music') || ctx.academicInterests?.includes('music')) {
          root.querySelector('.sp-card[data-programme="music"]')?.classList.add('priority-match');
      }
      
      if (ctx.activities?.includes('technology') || ctx.academicInterests?.includes('technology')) {
          root.querySelector('.sp-card[data-programme="computing"]')?.classList.add('priority-match');
      }
      
      if (ctx.priorities?.academic === 3) {
          root.querySelector('.sp-card[data-programme="fpq"]')?.classList.add('priority-match');
          root.querySelector('.sp-card[data-programme="skills"]')?.classList.add('priority-match');
      }
      
      if (ctx.activities?.includes('leadership') || ctx.priorities?.activities === 3) {
          root.querySelector('.sp-card[data-programme="challenge"]')?.classList.add('priority-match');
      }
      
      if (ctx.priorities?.pastoral === 3) {
          root.querySelector('.sp-card[data-programme="floreat"]')?.classList.add('priority-match');
      }
  };

  // Add personalized content to programmes
  const addPersonalizedContent = () => {
      const childName = ctx.childName || '[Child\'s Name]';
      const pronoun = ctx.childGender === 'female' ? 'her' : 'his';
      const pronounSubject = ctx.childGender === 'female' ? 'she' : 'he';

      // Music personalization
      const musicPersonal = root.querySelector('.sp-music-personal .sp-section-content');
      if (musicPersonal) {
          let content = 'In our Music programme, ';
          
          if (ctx.activities?.includes('music')) {
              content += `${childName} will build on ${pronoun} musical interests through ensemble performance, composition using industry-standard software, and mini-recital opportunities that build confidence.`;
          } else if (ctx.activities?.includes('leadership')) {
              content += `${childName} will develop creative expression and collaborative leadership skills through ensemble music-making and performance opportunities.`;
          } else {
              content += `${childName} will develop creative expression and collaborative skills through ensemble performance and digital composition using professional software.`;
          }
          
          musicPersonal.innerHTML = `<p>${content}</p>`;
      }

      // Computing personalization
      const computingPersonal = root.querySelector('.sp-computing-personal .sp-section-content');
      if (computingPersonal) {
          let content = 'In our Computing programme, ';
          
          if (ctx.activities?.includes('technology')) {
              content += `${childName} will advance ${pronoun} technology interests through differentiated learning that builds on existing experience while introducing coding and computational thinking.`;
          } else if (ctx.priorities?.academic === 3) {
              content += `${childName} will develop essential digital literacy and programming skills that support academic excellence across all subjects.`;
          } else {
              content += `${childName} will develop digital literacy and programming skills essential for academic success and modern life.`;
          }
          
          computingPersonal.innerHTML = `<p>${content}</p>`;
      }

      // FPQ personalization
      const fpqPersonal = root.querySelector('.sp-fpq-personal .sp-section-content');
      if (fpqPersonal) {
          let content = 'In the FPQ programme, ';
          
          if (ctx.priorities?.academic === 3) {
              content += `${childName} will excel in developing the independent research and academic writing skills essential for future academic success and university preparation.`;
          } else if (ctx.universityAspirations === 'Oxford or Cambridge') {
              content += `${childName} will develop the sophisticated research and analytical skills highly valued by competitive universities, preparing for the EPQ in Upper College.`;
          } else {
              content += `${childName} will develop independent research skills through a personally meaningful project that builds academic confidence and preparation.`;
          }
          
          fpqPersonal.innerHTML = `<p>${content}</p>`;
      }

      // Skills Programme personalization
      const skillsPersonal = root.querySelector('.sp-skills-personal .sp-section-content');
      if (skillsPersonal) {
          let content = 'In the Skills Programme, ';
          
          if (ctx.priorities?.academic === 3) {
              content += `${childName} will develop the organizational and study techniques essential for maintaining academic excellence across multiple demanding subjects.`;
          } else {
              content += `${childName} will develop the organizational and study techniques essential for academic success and effective time management.`;
          }
          
          skillsPersonal.innerHTML = `<p>${content}</p>`;
      }

      // Challenge Programme personalization
      const challengePersonal = root.querySelector('.sp-challenge-personal .sp-section-content');
      if (challengePersonal) {
          let content = 'In Third Form Challenge, ';
          
          if (ctx.activities?.includes('leadership')) {
              content += `${childName} will excel in developing ${pronoun} leadership potential through Dragons' Den presentations, coding challenges, and collaborative activities.`;
          } else if (ctx.activities?.includes('technology')) {
              content += `${childName} will particularly enjoy the coding day and Dragons' Den presentations that combine technology skills with creative problem-solving.`;
          } else if (ctx.activities?.includes('sports')) {
              content += `${childName} will thrive in the athletic development components including squash, rowing, and cross-country activities that complement regular sports.`;
          } else {
              content += `${childName} will develop leadership skills and explore new activities through this diverse and engaging Wednesday afternoon programme.`;
          }
          
          challengePersonal.innerHTML = `<p>${content}</p>`;
      }

      // Floreat personalization
      const floreatPersonal = root.querySelector('.sp-floreat-personal .sp-section-content');
      if (floreatPersonal) {
          let content = 'In Floreat, ';
          
          if (ctx.priorities?.pastoral === 3) {
              content += `${childName} will develop the emotional intelligence and personal resilience essential for thriving during this important developmental stage.`;
          } else if (ctx.activities?.includes('leadership')) {
              content += `${childName} will develop the emotional intelligence and social skills that enhance ${pronoun} leadership potential and community engagement.`;
          } else {
              content += `${childName} will develop emotional intelligence and personal resilience during this important stage of ${pronoun} development.`;
          }
          
          floreatPersonal.innerHTML = `<p>${content}</p>`;
      }

      // Update personalized intro texts based on interests
      const musicIntro = root.querySelector('.sp-music-intro p');
      if (musicIntro && ctx.activities?.includes('music')) {
          musicIntro.textContent = `Music will build on ${childName}'s musical interests through performance, composition, and collaborative opportunities.`;
      }

      const computingIntro = root.querySelector('.sp-computing-intro p');
      if (computingIntro && ctx.activities?.includes('technology')) {
          computingIntro.textContent = `Computing will advance ${childName}'s technology skills through coding and digital innovation projects.`;
      }

      const fpqIntro = root.querySelector('.sp-fpq-intro p');
      if (fpqIntro && ctx.priorities?.academic === 3) {
          fpqIntro.textContent = `FPQ will develop ${childName}'s research capabilities essential for academic excellence and university success.`;
      }

      const skillsIntro = root.querySelector('.sp-skills-intro p');
      if (skillsIntro && ctx.priorities?.academic === 3) {
          skillsIntro.textContent = `Skills Programme will equip ${childName} with advanced study techniques for maintaining academic excellence.`;
      }

      const challengeIntro = root.querySelector('.sp-challenge-intro p');
      if (challengeIntro && ctx.activities?.includes('leadership')) {
          challengeIntro.textContent = `Third Form Challenge will develop ${childName}'s leadership potential through diverse and challenging activities.`;
      }

      const floreatIntro = root.querySelector('.sp-floreat-intro p');
      if (floreatIntro && ctx.priorities?.pastoral === 3) {
          floreatIntro.textContent = `Floreat will provide ${childName} with comprehensive wellbeing support during this important developmental stage.`;
      }
  };

  // Setup navigation filtering
  const setupNavigation = () => {
      const navButtons = root.querySelectorAll('.sp-nav-btn');
      const cards = root.querySelectorAll('.sp-card');
      
      // Highlight priority navigation buttons based on interests
      navButtons.forEach(btn => {
          const filter = btn.getAttribute('data-filter');
          
          if (filter === 'music' && (ctx.activities?.includes('music') || ctx.academicInterests?.includes('music'))) {
              btn.classList.add('priority-high');
          }
          if (filter === 'computing' && (ctx.activities?.includes('technology') || ctx.academicInterests?.includes('technology'))) {
              btn.classList.add('priority-high');
          }
          if (filter === 'fpq' && ctx.priorities?.academic === 3) {
              btn.classList.add('priority-high');
          }
          if (filter === 'skills' && ctx.priorities?.academic === 3) {
              btn.classList.add('priority-high');
          }
          if (filter === 'challenge' && (ctx.activities?.includes('leadership') || ctx.priorities?.activities === 3)) {
              btn.classList.add('priority-high');
          }
          if (filter === 'floreat' && ctx.priorities?.pastoral === 3) {
              btn.classList.add('priority-high');
          }
      });
      
      // Add click handlers for filtering
      navButtons.forEach(btn => {
          btn.addEventListener('click', () => {
              // Remove active class from all buttons
              navButtons.forEach(b => b.classList.remove('active'));
              // Add active class to clicked button
              btn.classList.add('active');
              
              const filter = btn.getAttribute('data-filter');
              
              cards.forEach(card => {
                  const programme = card.getAttribute('data-programme');
                  if (filter === 'all' || programme === filter) {
                      card.style.display = 'block';
                      card.classList.remove('hidden');
                  } else {
                      card.style.display = 'none';
                      card.classList.add('hidden');
                  }
              });
          });
      });
  };

  // Initialize the module
  updateNames();
  customizeWelcome();
  prioritizeProgrammes();
  addPersonalizedContent();
  setupNavigation();
};