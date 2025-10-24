/* Special Programmes Module Initializer - Add this to the MODULES object in app.js */
MODULES['special_programmes'] = (root, ctx) => {
    // Translation function
    const t = (window.PEN_I18N && typeof window.PEN_I18N.t === 'function')
      ? window.PEN_I18N.t
      : () => '';
  
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
        
        let suffix = '';
        
        if (ctx.activities?.includes('music') && ctx.activities?.includes('leadership')) {
            suffix = t('special_programmes.welcome.music_leadership');
        } else if (ctx.activities?.includes('music')) {
            suffix = t('special_programmes.welcome.music');
        } else if (ctx.activities?.includes('leadership')) {
            suffix = t('special_programmes.welcome.leadership');
        } else if (ctx.activities?.includes('technology')) {
            suffix = t('special_programmes.welcome.technology');
        } else if (ctx.priorities?.activities === 3) {
            suffix = t('special_programmes.welcome.activities_high');
        } else {
            suffix = t('special_programmes.welcome.general');
        }
        
        welcomeText.textContent = t('special_programmes.welcome.prefix') + suffix + '。';
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
        const pronoun = ctx.childGender === 'female' 
          ? t('special_programmes.pronouns.her')
          : t('special_programmes.pronouns.his');
        const pronounSubject = ctx.childGender === 'female' 
          ? t('special_programmes.pronouns.she')
          : t('special_programmes.pronouns.he');
  
        // Music personalization
        const musicPersonal = root.querySelector('.sp-music-personal .sp-section-content');
        if (musicPersonal) {
            let content = '';
            
            if (ctx.activities?.includes('music')) {
                content = t('special_programmes.music.build_on', { childName, pronoun });
            } else if (ctx.activities?.includes('leadership')) {
                content = t('special_programmes.music.leadership', { childName });
            } else {
                content = t('special_programmes.music.general', { childName });
            }
            
            musicPersonal.innerHTML = `<p>${content}</p>`;
        }
  
        // Computing personalization
        const computingPersonal = root.querySelector('.sp-computing-personal .sp-section-content');
        if (computingPersonal) {
            let content = '';
            
            if (ctx.activities?.includes('technology')) {
                content = t('special_programmes.computing.advance', { childName, pronoun });
            } else if (ctx.priorities?.academic === 3) {
                content = t('special_programmes.computing.academic', { childName });
            } else {
                content = t('special_programmes.computing.general', { childName });
            }
            
            computingPersonal.innerHTML = `<p>${content}</p>`;
        }
  
        // FPQ personalization
        const fpqPersonal = root.querySelector('.sp-fpq-personal .sp-section-content');
        if (fpqPersonal) {
            let content = '';
            
            if (ctx.priorities?.academic === 3) {
                content = t('special_programmes.fpq.academic_high', { childName });
            } else if (ctx.universityAspirations === 'Oxford or Cambridge') {
                content = t('special_programmes.fpq.oxbridge', { childName });
            } else {
                content = t('special_programmes.fpq.general', { childName });
            }
            
            fpqPersonal.innerHTML = `<p>${content}</p>`;
        }
  
        // Skills Programme personalization
        const skillsPersonal = root.querySelector('.sp-skills-personal .sp-section-content');
        if (skillsPersonal) {
            let content = '';
            
            if (ctx.priorities?.academic === 3) {
                content = t('special_programmes.skills.academic_high', { childName });
            } else {
                content = t('special_programmes.skills.general', { childName });
            }
            
            skillsPersonal.innerHTML = `<p>${content}</p>`;
        }
  
        // Challenge Programme personalization
        const challengePersonal = root.querySelector('.sp-challenge-personal .sp-section-content');
        if (challengePersonal) {
            let content = '';
            
            if (ctx.activities?.includes('leadership')) {
                content = t('special_programmes.challenge.leadership', { childName, pronoun });
            } else if (ctx.activities?.includes('technology')) {
                content = t('special_programmes.challenge.technology', { childName });
            } else if (ctx.activities?.includes('sports')) {
                content = t('special_programmes.challenge.sports', { childName });
            } else {
                content = t('special_programmes.challenge.general', { childName });
            }
            
            challengePersonal.innerHTML = `<p>${content}</p>`;
        }
  
        // Floreat personalization
        const floreatPersonal = root.querySelector('.sp-floreat-personal .sp-section-content');
        if (floreatPersonal) {
            let content = '';
            
            if (ctx.priorities?.pastoral === 3) {
                content = t('special_programmes.floreat.pastoral_high', { childName });
            } else if (ctx.activities?.includes('leadership')) {
                content = t('special_programmes.floreat.leadership', { childName, pronoun });
            } else {
                content = t('special_programmes.floreat.general', { childName, pronoun });
            }
            
            floreatPersonal.innerHTML = `<p>${content}</p>`;
        }
  
        // Update personalized intro texts based on interests
        const musicIntro = root.querySelector('.sp-music-intro p');
        if (musicIntro && ctx.activities?.includes('music')) {
            musicIntro.textContent = t('special_programmes.music.intro_interests', { childName });
        }
  
        const computingIntro = root.querySelector('.sp-computing-intro p');
        if (computingIntro && ctx.activities?.includes('technology')) {
            computingIntro.textContent = t('special_programmes.computing.intro_interests', { childName });
        }
  
        const fpqIntro = root.querySelector('.sp-fpq-intro p');
        if (fpqIntro && ctx.priorities?.academic === 3) {
            fpqIntro.textContent = t('special_programmes.fpq.intro_academic', { childName });
        }
  
        const skillsIntro = root.querySelector('.sp-skills-intro p');
        if (skillsIntro && ctx.priorities?.academic === 3) {
            skillsIntro.textContent = t('special_programmes.skills.intro_academic', { childName });
        }
  
        const challengeIntro = root.querySelector('.sp-challenge-intro p');
        if (challengeIntro && ctx.activities?.includes('leadership')) {
            challengeIntro.textContent = t('special_programmes.challenge.intro_leadership', { childName });
        }
  
        const floreatIntro = root.querySelector('.sp-floreat-intro p');
        if (floreatIntro && ctx.priorities?.pastoral === 3) {
            floreatIntro.textContent = t('special_programmes.floreat.intro_pastoral', { childName });
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