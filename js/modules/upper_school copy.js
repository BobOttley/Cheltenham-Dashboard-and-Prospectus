/* Upper School Module Initializer - Add this to the MODULES object in app.js */
MODULES['upper_school'] = (root, ctx) => {
  // Update name placeholders
  const updateNames = () => {
      root.querySelectorAll('.child-name').forEach(el => {
          el.textContent = ctx.childName || '[Child\'s Name]';
      });
  };

  // Customize welcome message
  const customizeWelcome = () => {
      const welcomeText = root.querySelector('.us-welcome-text');
      if (!welcomeText) return;
      
      const childName = ctx.childName || '[Child\'s Name]';
      let message = `Discover how our Upper School will prepare ${childName} for `;
      
      if (ctx.universityAspirations === 'Oxford or Cambridge') {
          message += 'Oxbridge success through rigorous academics and comprehensive support.';
      } else if (ctx.universityAspirations === 'Russell Group') {
          message += 'Russell Group university success through rigorous academics and comprehensive support.';
      } else if (ctx.universityAspirations === 'International') {
          message += 'international university opportunities and global career paths.';
      } else {
          message += 'university success and beyond through exceptional teaching and support.';
      }
      
      welcomeText.textContent = message;
  };

  // Prioritize sections based on interests
  const prioritizeSections = () => {
      // Academic section priority
      if (ctx.academicInterests?.length > 0 || ctx.priorities?.academic === 3) {
          root.querySelector('.us-card[data-section="academic"]')?.classList.add('priority-match');
      }
      
      // EPQ priority for academic students
      if (ctx.priorities?.academic === 3 || ctx.universityAspirations === 'Oxford or Cambridge') {
          root.querySelector('.us-card[data-section="epq"]')?.classList.add('priority-match');
      }
      
      // University support priority
      if (ctx.universityAspirations && ctx.universityAspirations !== 'Unsure') {
          root.querySelector('.us-card[data-section="university"]')?.classList.add('priority-match');
      }
      
      // Floreat priority for pastoral care
      if (ctx.priorities?.pastoral >= 2) {
          root.querySelector('.us-card[data-section="floreat"]')?.classList.add('priority-match');
      }
      
      // Results priority for ambitious students
      if (ctx.universityAspirations === 'Russell Group' || ctx.universityAspirations === 'Oxford or Cambridge') {
          root.querySelector('.us-card[data-section="results"]')?.classList.add('priority-match');
      }
  };

  // Add personalized content
  const addPersonalizedContent = () => {
      const childName = ctx.childName || '[Child\'s Name]';
      const pronoun = ctx.childGender === 'female' ? 'her' : 'his';
      const pronounSubject = ctx.childGender === 'female' ? 'she' : 'he';

      // Academic personalization
      const academicPersonal = root.querySelector('.us-academic-personal .us-section-content');
      if (academicPersonal) {
          let content = '';
          
          if (ctx.academicInterests?.includes('sciences') && ctx.academicInterests?.includes('mathematics')) {
              content = `${childName}'s academic journey will leverage ${pronoun} strengths in sciences and mathematics. The combination of rigorous A Levels in these subjects provides the perfect foundation for competitive university applications, particularly for STEM courses at leading universities.`;
          } else if (ctx.academicInterests?.includes('humanities')) {
              content = `${childName}'s academic pathway will build on ${pronoun} humanities interests, developing the analytical writing and critical thinking skills highly valued by universities. Essay-based A Levels provide excellent preparation for ${pronoun} chosen field.`;
          } else if (ctx.academicInterests?.includes('arts')) {
              content = `${childName}'s creative talents will flourish through specialized A Level study in the arts, combined with academic rigor that prepares students for leading creative courses at top universities.`;
          } else {
              content = `${childName}'s academic journey will be tailored to maximize ${pronoun} potential and prepare ${pronoun} for university success through careful subject selection and exceptional teaching support.`;
          }
          
          academicPersonal.innerHTML = `<p>${content}</p>`;
      }

      // EPQ personalization
      const epqPersonal = root.querySelector('.us-epq-personal .us-section-content');
      if (epqPersonal) {
          let content = `${childName}'s EPQ project will develop essential research skills while exploring `;
          
          if (ctx.academicInterests?.includes('sciences')) {
              content += `${pronoun} scientific interests in depth. Recent projects have included cutting-edge topics like CRISPR gene editing, sustainable energy solutions, and AI applications - perfect for demonstrating academic capability to universities.`;
          } else if (ctx.academicInterests?.includes('humanities')) {
              content += `${pronoun} passion for humanities through in-depth historical, philosophical, or literary research. This independent study demonstrates the intellectual curiosity universities seek.`;
          } else if (ctx.activities?.includes('leadership')) {
              content += `leadership themes or social impact topics that align with ${pronoun} interests. This demonstrates both academic capability and personal values to university admissions teams.`;
          } else {
              content += `${pronoun} personal interests in depth, demonstrating the independent learning skills universities value highly.`;
          }
          
          epqPersonal.innerHTML = `<p>${content}</p>`;
      }

      // University personalization
      const universityPersonal = root.querySelector('.us-university-personal .us-section-content');
      if (universityPersonal) {
          let content = `${childName}'s university journey will be supported by comprehensive guidance `;
          
          if (ctx.universityAspirations === 'Oxford or Cambridge') {
              content += `specifically tailored for Oxbridge applications. With dedicated support from Mrs Jo Wintle, our Oxbridge Coordinator, ${childName} will receive mock interview preparation and specialist guidance for entrance assessments.`;
          } else if (ctx.universityAspirations === 'Russell Group') {
              content += `focused on securing places at leading Russell Group universities. Our track record shows consistent success at universities like Bath, Bristol, Durham, and Exeter - exactly the caliber ${childName} is targeting.`;
          } else if (ctx.universityAspirations === 'International') {
              content += `for prestigious international institutions. Mr Nick Nelson provides expert guidance for applications to universities in the USA, Canada, Europe, and Asia.`;
          } else {
              content += `tailored to ${pronoun} aspirations, ensuring ${pronounSubject} achieves a place at ${pronoun} first-choice university.`;
          }
          
          universityPersonal.innerHTML = `<p>${content}</p>`;
      }

      // Floreat personalization
      const floreatPersonal = root.querySelector('.us-floreat-personal .us-section-content');
      if (floreatPersonal) {
          let content = `${childName}'s personal development journey will `;
          
          if (ctx.activities?.includes('leadership')) {
              content += `build on ${pronoun} leadership interests, developing the emotional intelligence and ethical grounding essential for future leadership roles while preparing for university independence.`;
          } else if (ctx.priorities?.pastoral === 3) {
              content += `provide comprehensive wellbeing support during this crucial transition period, ensuring ${pronounSubject} develops the resilience and life skills needed for university success.`;
          } else {
              content += `prepare ${pronoun} for the challenges and opportunities of university life through practical skills development and personal growth opportunities.`;
          }
          
          floreatPersonal.innerHTML = `<p>${content}</p>`;
      }

      // Results personalization
      const resultsPersonal = root.querySelector('.us-results-personal .us-section-content');
      if (resultsPersonal) {
          let content = `${childName} will join our graduates at `;
          
          if (ctx.universityAspirations === 'Oxford or Cambridge') {
              content += `the most prestigious universities. While Oxbridge remains highly competitive, our annual success rate of 4-6 offers from 25 applications demonstrates our preparation quality. ${childName} will also have excellent chances at other leading universities.`;
          } else if (ctx.universityAspirations === 'Russell Group') {
              content += `leading Russell Group universities that align with ${pronoun} academic goals. Our strongest relationships with Bath, Bristol, Durham, and Exeter match perfectly with typical Russell Group aspirations.`;
          } else {
              content += `universities that align with ${pronoun} academic goals and career aspirations, benefiting from our extensive network and proven track record.`;
          }
          
          resultsPersonal.innerHTML = `<p>${content}</p>`;
      }

      // Update intro texts based on interests
      const academicIntro = root.querySelector('.us-academic-intro p');
      if (academicIntro && ctx.priorities?.academic === 3) {
          academicIntro.textContent = `Our rigorous academic structure will provide ${childName} with the perfect foundation for achieving top grades and competitive university admission.`;
      }

      const epqIntro = root.querySelector('.us-epq-intro p');
      if (epqIntro && (ctx.priorities?.academic === 3 || ctx.universityAspirations === 'Oxford or Cambridge')) {
          epqIntro.textContent = `The EPQ will showcase ${childName}'s independent research capabilities, providing crucial differentiation for competitive university applications.`;
      }

      const universityIntro = root.querySelector('.us-university-intro p');
      if (universityIntro && ctx.universityAspirations === 'Russell Group') {
          universityIntro.textContent = `Our comprehensive university support will guide ${childName} to secure offers from target Russell Group universities.`;
      }

      const floreatIntro = root.querySelector('.us-floreat-intro p');
      if (floreatIntro && ctx.activities?.includes('leadership')) {
          floreatIntro.textContent = `Floreat will develop ${childName}'s leadership capabilities and personal resilience for university challenges and future success.`;
      }

      const resultsIntro = root.querySelector('.us-results-intro p');
      if (resultsIntro && (ctx.universityAspirations === 'Russell Group' || ctx.universityAspirations === 'Oxford or Cambridge')) {
          resultsIntro.textContent = `Join our successful graduates at the prestigious universities that match ${childName}'s ambitious aspirations.`;
      }
  };

  // Setup navigation and highlight priorities
  const setupNavigation = () => {
      const navButtons = root.querySelectorAll('.us-nav-btn');
      const cards = root.querySelectorAll('.us-card');
      
      // Highlight priority navigation buttons
      navButtons.forEach(button => {
          const filter = button.getAttribute('data-filter');
          
          if ((filter === 'academic' && (ctx.academicInterests?.length > 0 || ctx.priorities?.academic === 3)) ||
              (filter === 'university' && ctx.universityAspirations && ctx.universityAspirations !== 'Unsure') ||
              (filter === 'epq' && (ctx.priorities?.academic === 3 || ctx.universityAspirations === 'Oxford or Cambridge')) ||
              (filter === 'floreat' && ctx.priorities?.pastoral >= 2) ||
              (filter === 'results' && (ctx.universityAspirations === 'Russell Group' || ctx.universityAspirations === 'Oxford or Cambridge'))) {
              button.classList.add('priority-high');
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
                  const section = card.getAttribute('data-section');
                  if (filter === 'all' || section === filter) {
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
  prioritizeSections();
  addPersonalizedContent();
  setupNavigation();
};