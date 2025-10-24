/* Upper School Module Initializer - Add this to the MODULES object in app.js */
MODULES['upper_school'] = (root, ctx) => {
    // Translation function
    const t = (window.PEN_I18N && typeof window.PEN_I18N.t === 'function')
      ? window.PEN_I18N.t
      : () => '';
  
    // Update name placeholders
    const updateNames = () => {
        root.querySelectorAll('.child-name').forEach(el => {
            el.textContent = ctx.childName || t('upper_school.placeholders.child_name');
        });
    };
  
    // Customize welcome message
    const customizeWelcome = () => {
        const welcomeText = root.querySelector('.us-welcome-text');
        if (!welcomeText) return;
        
        const childName = ctx.childName || t('upper_school.placeholders.child_name');
        let message = t('upper_school.welcome.prefix', { childName }) + ' ';
        
        if (ctx.universityAspirations === 'Oxford or Cambridge') {
            message += t('upper_school.welcome.oxbridge');
        } else if (ctx.universityAspirations === 'Russell Group') {
            message += t('upper_school.welcome.russell_group');
        } else if (ctx.universityAspirations === 'International') {
            message += t('upper_school.welcome.international');
        } else {
            message += t('upper_school.welcome.general');
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
        const childName = ctx.childName || t('upper_school.placeholders.child_name');
        const possessive = ctx.childGender === 'female' 
          ? t('upper_school.pronouns.her')
          : t('upper_school.pronouns.his');
        const pronoun = ctx.childGender === 'female' 
          ? t('upper_school.pronouns.she')
          : t('upper_school.pronouns.he');
  
        // Academic personalization
        const academicPersonal = root.querySelector('.us-academic-personal .us-section-content');
        if (academicPersonal) {
            let content = '';
            
            if (ctx.academicInterests?.includes('sciences') && ctx.academicInterests?.includes('mathematics')) {
                content = t('upper_school.academic.stem', { childName, possessive });
            } else if (ctx.academicInterests?.includes('humanities')) {
                content = t('upper_school.academic.humanities', { childName, possessive });
            } else if (ctx.academicInterests?.includes('arts')) {
                content = t('upper_school.academic.arts', { childName });
            } else {
                content = t('upper_school.academic.general', { childName, possessive });
            }
            
            academicPersonal.innerHTML = `<p>${content}</p>`;
        }
  
        // EPQ personalization
        const epqPersonal = root.querySelector('.us-epq-personal .us-section-content');
        if (epqPersonal) {
            let content = '';
            
            if (ctx.academicInterests?.includes('sciences')) {
                content = t('upper_school.epq.sciences', { childName, possessive });
            } else if (ctx.academicInterests?.includes('humanities')) {
                content = t('upper_school.epq.humanities', { childName, possessive });
            } else if (ctx.activities?.includes('leadership')) {
                content = t('upper_school.epq.leadership', { childName, possessive });
            } else {
                content = t('upper_school.epq.general', { childName, possessive });
            }
            
            epqPersonal.innerHTML = `<p>${content}</p>`;
        }
  
        // University personalization
        const universityPersonal = root.querySelector('.us-university-personal .us-section-content');
        if (universityPersonal) {
            let content = '';
            
            if (ctx.universityAspirations === 'Oxford or Cambridge') {
                content = t('upper_school.university.oxbridge', { childName });
            } else if (ctx.universityAspirations === 'Russell Group') {
                content = t('upper_school.university.russell_group', { childName });
            } else if (ctx.universityAspirations === 'International') {
                content = t('upper_school.university.international', { childName });
            } else {
                content = t('upper_school.university.general', { childName, possessive, pronoun });
            }
            
            universityPersonal.innerHTML = `<p>${content}</p>`;
        }
  
        // Floreat personalization
        const floreatPersonal = root.querySelector('.us-floreat-personal .us-section-content');
        if (floreatPersonal) {
            let content = '';
            
            if (ctx.activities?.includes('leadership')) {
                content = t('upper_school.floreat.leadership', { childName, possessive });
            } else if (ctx.priorities?.pastoral === 3) {
                content = t('upper_school.floreat.pastoral', { childName, pronoun });
            } else {
                content = t('upper_school.floreat.general', { childName, possessive });
            }
            
            floreatPersonal.innerHTML = `<p>${content}</p>`;
        }
  
        // Results personalization
        const resultsPersonal = root.querySelector('.us-results-personal .us-section-content');
        if (resultsPersonal) {
            let content = '';
            
            if (ctx.universityAspirations === 'Oxford or Cambridge') {
                content = t('upper_school.results.oxbridge', { childName });
            } else if (ctx.universityAspirations === 'Russell Group') {
                content = t('upper_school.results.russell_group', { childName, possessive });
            } else {
                content = t('upper_school.results.general', { childName, possessive });
            }
            
            resultsPersonal.innerHTML = `<p>${content}</p>`;
        }
  
        // Update intro texts based on interests
        const academicIntro = root.querySelector('.us-academic-intro p');
        if (academicIntro && ctx.priorities?.academic === 3) {
            academicIntro.textContent = t('upper_school.intros.academic', { childName });
        }
  
        const epqIntro = root.querySelector('.us-epq-intro p');
        if (epqIntro && (ctx.priorities?.academic === 3 || ctx.universityAspirations === 'Oxford or Cambridge')) {
            epqIntro.textContent = t('upper_school.intros.epq', { childName });
        }
  
        const universityIntro = root.querySelector('.us-university-intro p');
        if (universityIntro && ctx.universityAspirations === 'Russell Group') {
            universityIntro.textContent = t('upper_school.intros.university', { childName });
        }
  
        const floreatIntro = root.querySelector('.us-floreat-intro p');
        if (floreatIntro && ctx.activities?.includes('leadership')) {
            floreatIntro.textContent = t('upper_school.intros.floreat', { childName });
        }
  
        const resultsIntro = root.querySelector('.us-results-intro p');
        if (resultsIntro && (ctx.universityAspirations === 'Russell Group' || ctx.universityAspirations === 'Oxford or Cambridge')) {
            resultsIntro.textContent = t('upper_school.intros.results', { childName });
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