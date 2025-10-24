/* Creative Arts & Design Module Initializer - Add this to the MODULES object in app.js */
MODULES['creative_arts'] = (root, ctx) => {
    // Update name placeholders
    const updateNames = () => {
      root.querySelectorAll('.child-name').forEach(el => {
        el.textContent = ctx.childName || '[Child\'s Name]';
      });
    };
  
    // Customize welcome message based on creative interests
    const customizeWelcome = () => {
      const welcomeText = root.querySelector('.ca-welcome-text');
      if (!welcomeText) return;
      
      const childName = ctx.childName || '[Child\'s Name]';
      let message = `Discover how our creative programmes will nurture ${childName}'s artistic talents and prepare `;
      
      if (ctx.activities?.includes('drama') && ctx.activities?.includes('music')) {
        message += `${childName} for excellence in both theatre and music through our professional-standard facilities.`;
      } else if (ctx.activities?.includes('drama') && ctx.universityAspirations === 'Oxford or Cambridge') {
        message += `${childName} for Oxbridge success through rigorous creative training and analytical skill development.`;
      } else if (ctx.activities?.includes('music') && ctx.priorities?.activities === 3) {
        message += `${childName} for musical excellence in our All-Steinway School with world-class performance opportunities.`;
      } else if (ctx.academicInterests?.includes('arts') && ctx.academicInterests?.includes('humanities')) {
        message += `${childName} for university success by combining creative expression with critical thinking and cultural analysis.`;
      } else if (ctx.universityAspirations === 'Oxford or Cambridge') {
        message += `${childName} for Oxbridge applications through creative programmes that develop the analytical thinking and cultural knowledge top universities seek.`;
      } else if (ctx.activities?.includes('drama')) {
        message += `${childName} for theatrical success through professional drama training and performance opportunities.`;
      } else if (ctx.activities?.includes('music')) {
        message += `${childName} for musical achievement through exceptional facilities and expert teaching.`;
      } else if (ctx.academicInterests?.includes('arts')) {
        message += `${childName} for creative success through comprehensive arts education and professional preparation.`;
      } else {
        message += `${childName} for creative success and university excellence through exceptional artistic education.`;
      }
      
      welcomeText.textContent = message;
    };
  
    // Prioritize subjects based on interests and activities
    const prioritizeSubjects = () => {
      const navButtons = root.querySelectorAll('.ca-nav-btn');
      const cards = root.querySelectorAll('.ca-card');
      
      // Drama prioritization
      if (ctx.activities?.includes('drama')) {
        navButtons.forEach(btn => {
          if (btn.getAttribute('data-filter') === 'drama') {
            btn.classList.add('priority-high');
          }
        });
        cards.forEach(card => {
          if (card.getAttribute('data-subject') === 'drama') {
            card.classList.add('priority-match');
            addPersonalizedContent(card, ctx, 'drama');
          }
        });
      }
      
      // Music prioritization
      if (ctx.activities?.includes('music')) {
        navButtons.forEach(btn => {
          if (btn.getAttribute('data-filter') === 'music') {
            btn.classList.add('priority-high');
          }
        });
        cards.forEach(card => {
          if (card.getAttribute('data-subject') === 'music') {
            card.classList.add('priority-match');
            addPersonalizedContent(card, ctx, 'music');
          }
        });
      }
      
      // Art prioritization
      if (ctx.academicInterests?.includes('arts')) {
        navButtons.forEach(btn => {
          if (btn.getAttribute('data-filter') === 'art' || btn.getAttribute('data-filter') === 'history-of-art') {
            btn.classList.add('priority-high');
          }
        });
        cards.forEach(card => {
          const subject = card.getAttribute('data-subject');
          if (subject === 'art' || subject === 'history-of-art') {
            card.classList.add('priority-match');
            addPersonalizedContent(card, ctx, subject);
          }
        });
      }
    };
  
    // Add personalized content to specific subject cards
    const addPersonalizedContent = (card, ctx, subject) => {
      const cardContent = card.querySelector('.ca-card-content');
      if (!cardContent) return;
  
      // Remove existing personalized content
      const existingPersonalized = cardContent.querySelector('.ca-personalized-content');
      if (existingPersonalized) {
        existingPersonalized.remove();
      }
  
      // Create new personalized section
      const personalizedSection = document.createElement('div');
      personalizedSection.className = 'ca-personalized-content';
      personalizedSection.style.cssText = `
        background: rgba(201, 169, 97, 0.1);
        border: 2px solid rgba(201, 169, 97, 0.3);
        border-radius: 12px;
        padding: 1.5rem;
        margin: 1.5rem 0;
        font-weight: 500;
        color: #1e3a5f;
      `;
  
      let content = '';
      const childName = ctx.childName || '[Child\'s Name]';
  
      if (subject === 'drama' && ctx.activities?.includes('leadership')) {
        content = `<h4 style="color: #c9a961; margin-bottom: 1rem;">${childName}'s Leadership Through Drama</h4>
        <p>Drama naturally develops leadership skills through directing, devising theatre, and collaborative creation. ${childName} will have opportunities to lead House productions, direct scenes, and mentor younger students - essential experience for university applications and future career success.</p>`;
      } else if (subject === 'drama' && ctx.universityAspirations === 'Oxford or Cambridge') {
        content = `<h4 style="color: #c9a961; margin-bottom: 1rem;">Oxbridge Drama Preparation for ${childName}</h4>
        <p>Our Drama A Level provides exceptional preparation for Oxbridge applications. ${childName} will develop the analytical thinking, cultural knowledge, and creative expression that Cambridge and Oxford seek in their most competitive applicants.</p>`;
      } else if (subject === 'music' && ctx.universityAspirations === 'Oxford or Cambridge') {
        content = `<h4 style="color: #c9a961; margin-bottom: 1rem;">Oxbridge Music Excellence for ${childName}</h4>
        <p>Our Music programme provides rigorous preparation for Oxbridge music degrees. ${childName} will develop the analytical skills, cultural knowledge, and performance excellence that Cambridge and Oxford music departments seek.</p>`;
      } else if (subject === 'music' && ctx.priorities?.activities === 3) {
        content = `<h4 style="color: #c9a961; margin-bottom: 1rem;">Perfect for ${childName}'s Activity Priorities</h4>
        <p>With high priority on activities, ${childName} will thrive in our All-Steinway School environment. Access world-class instruments, perform in premium venues, and participate in international opportunities including Jazz Festival in Montpellier.</p>`;
      } else if (subject === 'art' && ctx.academicInterests?.includes('humanities')) {
        content = `<h4 style="color: #c9a961; margin-bottom: 1rem;">Art & Humanities Synergy for ${childName}</h4>
        <p>Art A Level complements humanities studies perfectly, developing visual analysis skills and cultural understanding. ${childName} will explore historical contexts, philosophical themes, and social commentary through creative practice.</p>`;
      } else if (subject === 'history-of-art' && ctx.priorities?.academic === 3) {
        content = `<h4 style="color: #c9a961; margin-bottom: 1rem;">Academic Rigour for ${childName}</h4>
        <p>History of Art offers exceptional academic challenge, developing critical analysis, research skills, and cultural literacy. ${childName} will engage with complex philosophical and historical concepts while building analytical writing skills essential for university success.</p>`;
      }
  
      if (content) {
        personalizedSection.innerHTML = content;
        cardContent.insertBefore(personalizedSection, cardContent.firstChild);
      }
    };
  
    // Personalize content based on context
    const personalizeContent = () => {
      // Update subject introductions
      const artIntro = root.querySelector('[data-subject="art"] .ca-subject-intro');
      if (artIntro && ctx.childName) {
        artIntro.textContent = `Vibrant and exciting department where ${ctx.childName} will develop life-long love of visual expression. Choose between Fine Art and 3D Design courses suited to students who enjoy individual voice and creative thought.`;
      }
  
      const dramaIntro = root.querySelector('[data-subject="drama"] .ca-subject-intro');
      if (dramaIntro && ctx.childName && ctx.activities?.includes('leadership')) {
        dramaIntro.textContent = `Perfect for ${ctx.childName}'s leadership interests - inspires students to become independent theatre-makers with skills for higher education and beyond. Emphasising practical creativity alongside research and theoretical understanding.`;
      }
  
      const musicIntro = root.querySelector('[data-subject="music"] .ca-subject-intro');
      if (musicIntro && ctx.childName && ctx.activities?.includes('music')) {
        musicIntro.textContent = `Ideal for ${ctx.childName}'s musical interests - relevant and contemporary qualification offering chance to study wide range of genres. From Hans Zimmer to Renaissance music, taught in our 'All-Steinway School' facilities.`;
      }
    };
  
    // Customize navigation title
    const customizeNavigation = () => {
      const navTitle = root.querySelector('.ca-nav-title');
      if (navTitle && ctx.childName) {
        navTitle.textContent = `Creative Subjects for ${ctx.childName}`;
      }
    };
  
    // Add university-specific content
    const addUniversityContent = () => {
      if (ctx.universityAspirations === 'Oxford or Cambridge') {
        const pathwaysSection = root.querySelector('.ca-pathways-section');
        if (pathwaysSection && !pathwaysSection.querySelector('.ca-oxbridge-note')) {
          const oxbridgeNote = document.createElement('div');
          oxbridgeNote.className = 'ca-oxbridge-note';
          oxbridgeNote.style.cssText = `
            background: rgba(201, 169, 97, 0.15);
            border-radius: 12px;
            padding: 1.5rem;
            margin-top: 1.5rem;
            text-align: center;
          `;
          const childName = ctx.childName || '[Child\'s Name]';
          oxbridgeNote.innerHTML = `
            <h4 style="color: #92400e; margin-bottom: 1rem; font-size: 1.2rem;">Oxbridge Creative Excellence for ${childName}</h4>
            <p style="color: #78350f;">Our creative A Levels provide exceptional preparation for Oxford and Cambridge applications. ${childName} will develop the analytical thinking, cultural knowledge, and creative expression that top universities seek, with dedicated support for portfolio development and university interviews.</p>
          `;
          pathwaysSection.appendChild(oxbridgeNote);
        }
      }
    };
  
    // Setup navigation filtering
    const setupNavigation = () => {
      const navButtons = root.querySelectorAll('.ca-nav-btn');
      const cards = root.querySelectorAll('.ca-card');
      
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
      const sectionTitles = root.querySelectorAll('.ca-section-title');
      sectionTitles.forEach(title => {
        title.addEventListener('click', function() {
          const section = this.parentElement;
          section.classList.toggle('collapsed');
        });
      });
  
      // Add interactivity to stats
      const stats = root.querySelectorAll('.ca-stat');
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
    addUniversityContent();
    setupNavigation();
  };