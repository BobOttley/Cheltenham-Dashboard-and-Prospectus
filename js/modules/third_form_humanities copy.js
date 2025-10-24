/* Third Form Humanities Module Initializer - Add this to the MODULES object in app.js */
MODULES['third_form_humanities'] = (root, ctx) => {
    // Update name placeholders
    const updateNames = () => {
        root.querySelectorAll('.child-name').forEach(el => {
            el.textContent = ctx.childName || '[Child\'s Name]';
        });
    };
  
    // Customize welcome message
    const customizeWelcome = () => {
        const welcomeTitle = root.querySelector('.hum-welcome-title');
        const welcomeText = root.querySelector('.hum-welcome-text');
        
        if (welcomeTitle && welcomeText) {
            const childName = ctx.childName || '[Child\'s Name]';
            welcomeTitle.textContent = `${childName}'s Humanities Journey`;
            
            let message = `Discover how our Humanities subjects will develop ${childName}'s `;
            
            if (ctx.activities?.includes('leadership')) {
                message += "leadership communication skills and critical thinking abilities essential for ";
            } else {
                message += "critical thinking and communication skills essential for ";
            }
            
            if (ctx.universityAspirations === 'Oxford or Cambridge') {
                message += `Oxbridge success.`;
            } else if (ctx.universityAspirations === 'Russell Group') {
                message += `Russell Group university success.`;
            } else {
                message += `university preparation and future success.`;
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
        const childName = ctx.childName || '[Child\'s Name]';
        const pronoun = ctx.childGender === 'female' ? 'her' : 'his';
        const pronounSubject = ctx.childGender === 'female' ? 'she' : 'he';
  
        // English personalization
        const englishIntro = root.querySelector('.hum-english-intro');
        if (englishIntro) {
            const title = englishIntro.querySelector('h4');
            const text = englishIntro.querySelector('p');
            
            if (ctx.activities?.includes('leadership')) {
                title.textContent = `Perfect for ${childName}'s Leadership Development`;
                text.textContent = `English will help ${childName} develop the articulate communication and persuasive writing skills essential for the leadership roles ${pronounSubject}'s interested in pursuing.`;
            } else if (ctx.activities?.includes('drama')) {
                title.textContent = `${childName}'s Creative Expression Journey`;
                text.textContent = `English will nurture ${childName}'s dramatic and creative interests while developing the analytical skills needed for academic success.`;
            } else {
                title.textContent = `Perfect for ${childName}'s Development`;
                text.textContent = `English will help ${childName} develop the articulate communication and analytical writing skills that will serve throughout ${pronoun} academic career and into university life.`;
            }
        }
  
        // History personalization
        const historyIntro = root.querySelector('.hum-history-intro');
        if (historyIntro) {
            const title = historyIntro.querySelector('h4');
            const text = historyIntro.querySelector('p');
            
            title.textContent = `${childName}'s Analytical Skills Journey`;
            text.textContent = `History will develop ${childName}'s critical analysis and evidence evaluation skills, building the intellectual rigor needed for ${pronoun} university aspirations.`;
        }
  
        // Geography personalization
        const geographyIntro = root.querySelector('.hum-geography-intro');
        if (geographyIntro) {
            const title = geographyIntro.querySelector('h4');
            const text = geographyIntro.querySelector('p');
            
            if (ctx.academicInterests?.includes('sciences')) {
                title.textContent = `${childName}'s Scientific & Analytical Approach`;
                text.textContent = `Geography bridges ${childName}'s scientific interests with humanities analysis, providing the interdisciplinary skills valued by top universities.`;
            } else {
                title.textContent = `Scientific & Analytical Approach`;
                text.textContent = `Geography combines scientific investigation with analytical skills, bridging science and humanities for ${childName}'s well-rounded development.`;
            }
        }
  
        // TPE personalization
        const tpeIntro = root.querySelector('.hum-tpe-intro');
        if (tpeIntro) {
            const title = tpeIntro.querySelector('h4');
            const text = tpeIntro.querySelector('p');
            
            if (ctx.activities?.includes('leadership')) {
                title.textContent = `${childName}'s Ethical Leadership Development`;
                text.textContent = `TPE develops the ethical reasoning and cultural understanding essential for ${childName}'s leadership aspirations and university-level discourse.`;
            } else {
                title.textContent = `Ethical Reasoning & Cultural Understanding`;
                text.textContent = `TPE develops ${childName}'s critical thinking about values and ethics, essential skills for leadership and university-level discourse.`;
            }
        }
    };
  
    // Customize pathways based on interests
    const customizePathways = () => {
        const childName = ctx.childName || '[Child\'s Name]';
        const pronoun = ctx.childGender === 'female' ? 'her' : 'his';
        const pronounSubject = ctx.childGender === 'female' ? 'she' : 'he';
  
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
                    heading.textContent = `${childName}'s University Preparation`;
                    
                    if (ctx.universityAspirations === 'Oxford or Cambridge') {
                        text.textContent = `English will develop ${childName}'s critical analysis and essay writing skills essential for Oxbridge applications. ${childName}'s strong English grades will demonstrate the communication abilities Oxford and Cambridge value across all disciplines.`;
                    } else if (ctx.universityAspirations === 'Russell Group') {
                        text.textContent = `English will develop ${childName}'s critical analysis and essay writing skills essential for Russell Group applications. ${childName}'s strong English grades will demonstrate the communication abilities universities value across all disciplines.`;
                    } else {
                        text.textContent = `English will develop ${childName}'s critical analysis and essay writing skills essential for university applications. Strong English grades demonstrate the communication abilities universities value across all disciplines.`;
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
                    heading.textContent = `Developing ${childName}'s Leadership Communication`;
                    text.textContent = `English will develop ${childName}'s articulate speaking and persuasive writing skills essential for the leadership roles ${pronounSubject} is interested in pursuing. ${childName} will gain confidence through presentation opportunities that build the communication skills needed for effective leadership.`;
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
                    heading.textContent = `${childName}'s Creative Expression`;
                    text.textContent = `The creative writing elements of English, including ${childName}'s potential participation in the creative writing prize competition, provide outlets for artistic expression whilst developing technical writing skills for university success.`;
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