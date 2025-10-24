/* Third Form Humanities Module Initializer - Add this to the MODULES object in app.js */
MODULES['third_form_humanities'] = (root, ctx) => {
    // Translation function
    const t = (window.PEN_I18N && typeof window.PEN_I18N.t === 'function')
      ? window.PEN_I18N.t
      : () => '';

    // Update name placeholders
    const updateNames = () => {
        root.querySelectorAll('.child-name').forEach(el => {
            el.textContent = ctx.childName || t('third_form_humanities.placeholders.child_name');
        });
    };
  
    // Customize welcome message
    const customizeWelcome = () => {
        const welcomeTitle = root.querySelector('.hum-welcome-title');
        const welcomeText = root.querySelector('.hum-welcome-text');
        
        if (welcomeTitle && welcomeText) {
            const childName = ctx.childName || t('third_form_humanities.placeholders.child_name');
            welcomeTitle.textContent = t('third_form_humanities.welcome.title', { childName });
            
            let message = t('third_form_humanities.welcome.discover_prefix') + ' ';
            
            if (ctx.activities?.includes('leadership')) {
                message += t('third_form_humanities.welcome.leadership_skills') + ' ';
            } else {
                message += t('third_form_humanities.welcome.general_skills') + ' ';
            }
            
            if (ctx.universityAspirations === 'Oxford or Cambridge') {
                message += t('third_form_humanities.welcome.oxbridge_success');
            } else if (ctx.universityAspirations === 'Russell Group') {
                message += t('third_form_humanities.welcome.russell_group_success');
            } else {
                message += t('third_form_humanities.welcome.university_success');
            }
            
            welcomeText.textContent = message;
        }
    };
  
    // Prioritize subjects based on interests
    const prioritizeSubjects = () => {
        const subjects = root.querySelectorAll('.hum-card');
        
        subjects.forEach(subject => {
            const subjectType = subject.dataset.subject;
            let priority = 'medium';
            
            // Determine priority based on user preferences
            if (ctx.academicInterests?.includes('humanities') && ctx.priorities?.academic === 3) {
                priority = 'high';
            } else if (subjectType === 'english' && ctx.activities?.includes('leadership')) {
                priority = 'high';
            } else if (subjectType === 'english' && ctx.activities?.includes('drama')) {
                priority = 'high';
            } else if (subjectType === 'history' && ctx.academicInterests?.includes('humanities')) {
                priority = 'high';
            }
            
            subject.classList.add(`priority-${priority}`);
        });
    };
  
    // Personalize subject introductions
    const personalizeSubjects = () => {
        const childName = ctx.childName || t('third_form_humanities.placeholders.child_name');
        const pronoun = ctx.childGender === 'female' 
          ? t('third_form_humanities.pronouns.she') 
          : t('third_form_humanities.pronouns.he');
        const pronounSubject = pronoun; // Same in most languages
        const possessive = ctx.childGender === 'female'
          ? t('third_form_humanities.pronouns.her')
          : t('third_form_humanities.pronouns.his');
  
        // English personalization
        const englishIntro = root.querySelector('.hum-english-intro');
        if (englishIntro) {
            const title = englishIntro.querySelector('h4');
            const text = englishIntro.querySelector('p');
            
            if (ctx.activities?.includes('leadership')) {
                if (title) title.textContent = t('third_form_humanities.english.leadership_title', { childName });
                if (text) text.textContent = t('third_form_humanities.english.leadership_text', { childName, pronoun: pronounSubject });
            } else if (ctx.activities?.includes('drama')) {
                if (title) title.textContent = t('third_form_humanities.english.drama_title', { childName });
                if (text) text.textContent = t('third_form_humanities.english.drama_text', { childName });
            } else {
                if (title) title.textContent = t('third_form_humanities.english.general_title', { childName });
                if (text) text.textContent = t('third_form_humanities.english.general_text', { childName, possessive });
            }
        }
  
        // History personalization
        const historyIntro = root.querySelector('.hum-history-intro');
        if (historyIntro) {
            const title = historyIntro.querySelector('h4');
            const text = historyIntro.querySelector('p');
            
            if (title) title.textContent = t('third_form_humanities.history.title', { childName });
            if (text) text.textContent = t('third_form_humanities.history.text', { childName, possessive });
        }
  
        // Geography personalization
        const geographyIntro = root.querySelector('.hum-geography-intro');
        if (geographyIntro) {
            const title = geographyIntro.querySelector('h4');
            const text = geographyIntro.querySelector('p');
            
            if (ctx.academicInterests?.includes('sciences')) {
                if (title) title.textContent = t('third_form_humanities.geography.sciences_title', { childName });
                if (text) text.textContent = t('third_form_humanities.geography.sciences_text', { childName });
            } else {
                if (title) title.textContent = t('third_form_humanities.geography.general_title');
                if (text) text.textContent = t('third_form_humanities.geography.general_text', { childName });
            }
        }
  
        // TPE personalization
        const tpeIntro = root.querySelector('.hum-tpe-intro');
        if (tpeIntro) {
            const title = tpeIntro.querySelector('h4');
            const text = tpeIntro.querySelector('p');
            
            if (ctx.activities?.includes('leadership')) {
                if (title) title.textContent = t('third_form_humanities.tpe.leadership_title', { childName });
                if (text) text.textContent = t('third_form_humanities.tpe.leadership_text', { childName });
            } else {
                if (title) title.textContent = t('third_form_humanities.tpe.general_title');
                if (text) text.textContent = t('third_form_humanities.tpe.general_text', { childName });
            }
        }
    };
  
    // Customize pathways based on interests
    const customizePathways = () => {
        const childName = ctx.childName || t('third_form_humanities.placeholders.child_name');
        const pronoun = ctx.childGender === 'female' 
          ? t('third_form_humanities.pronouns.she') 
          : t('third_form_humanities.pronouns.he');
        const pronounSubject = pronoun;
  
        // Show/hide pathways based on interests
        const pathwayMappings = {
            'hum-university-pathway': true, // Always show
            'hum-humanities-pathway': ctx.academicInterests?.includes('humanities'),
            'hum-leadership-pathway': ctx.activities?.includes('leadership'),
            'hum-creative-pathway': ctx.academicInterests?.includes('arts') || ctx.activities?.includes('drama')
        };
  
        Object.entries(pathwayMappings).forEach(([className, shouldShow]) => {
            const elements = root.querySelectorAll(`.${className}`);
            elements.forEach(element => {
                element.style.display = shouldShow ? 'block' : 'none';
            });
        });
  
        // Personalize university pathway content
        const universityPathways = root.querySelectorAll('.hum-university-pathway');
        universityPathways.forEach(pathway => {
            const heading = pathway.querySelector('h5');
            const text = pathway.querySelector('p');
            
            if (heading && text) {
                if (pathway.closest('.hum-card[data-subject="english"]')) {
                    heading.textContent = t('third_form_humanities.pathways.university_title', { childName });
                    
                    if (ctx.universityAspirations === 'Oxford or Cambridge') {
                        text.textContent = t('third_form_humanities.pathways.university_oxbridge', { childName });
                    } else if (ctx.universityAspirations === 'Russell Group') {
                        text.textContent = t('third_form_humanities.pathways.university_russell', { childName });
                    } else {
                        text.textContent = t('third_form_humanities.pathways.university_general', { childName });
                    }
                }
            }
        });
  
        // Personalize leadership pathways
        if (ctx.activities?.includes('leadership')) {
            const leadershipPathways = root.querySelectorAll('.hum-leadership-pathway');
            leadershipPathways.forEach(pathway => {
                const heading = pathway.querySelector('h5');
                const text = pathway.querySelector('p');
                
                if (heading && text && pathway.closest('.hum-card[data-subject="english"]')) {
                    heading.textContent = t('third_form_humanities.pathways.leadership_title', { childName });
                    text.textContent = t('third_form_humanities.pathways.leadership_text', { childName, pronoun: pronounSubject });
                }
            });
        }
  
        // Personalize creative pathways
        if (ctx.academicInterests?.includes('arts') || ctx.activities?.includes('drama')) {
            const creativePathways = root.querySelectorAll('.hum-creative-pathway');
            creativePathways.forEach(pathway => {
                const heading = pathway.querySelector('h5');
                const text = pathway.querySelector('p');
                
                if (heading && text && pathway.closest('.hum-card[data-subject="english"]')) {
                    heading.textContent = t('third_form_humanities.pathways.creative_title', { childName });
                    text.textContent = t('third_form_humanities.pathways.creative_text', { childName });
                }
            });
        }
    };
  
    // Setup navigation and highlight priority buttons
    const setupNavigation = () => {
        const navButtons = root.querySelectorAll('.hum-nav-btn');
        const cards = root.querySelectorAll('.hum-card');
        
        // Highlight priority navigation buttons
        navButtons.forEach(button => {
            const filter = button.getAttribute('data-filter');
            
            // Add priority styling for humanities focus
            if (ctx.academicInterests?.includes('humanities') && ctx.priorities?.academic === 3) {
                if (filter === 'english' || filter === 'history') {
                    button.classList.add('priority-high');
                }
            }
            
            if (ctx.activities?.includes('leadership') && filter === 'english') {
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
    };
  
    // Initialize the module
    updateNames();
    customizeWelcome();
    prioritizeSubjects();
    personalizeSubjects();
    customizePathways();
    setupNavigation();
  };