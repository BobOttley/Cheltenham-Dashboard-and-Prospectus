/* Third Form Languages module initializer */
MODULES['third_form_languages'] = (root, ctx) => {
    // Update all name placeholders
    $$('.child-name', root).forEach(el => el.textContent = ctx.childName || '[Child\'s Name]');
    $$('.parent-name', root).forEach(el => el.textContent = ctx.parentName || '[Parent Name]');
    $$('.family-name', root).forEach(el => el.textContent = ctx.familyName || '[Family Name]');
  
    // Lazy load images
    hydrateLazyAssets(root);
  
    // Customize welcome message based on interests
    const welcomeText = $('.personalized-welcome-text', root);
    if (welcomeText) {
      let message = 'Discover how language learning will ';
      
      if (ctx.academicInterests?.includes('languages')) {
        message += 'build on your existing language interests to open up a world of cultural understanding and global opportunities';
      } else if (ctx.academicInterests?.includes('humanities')) {
        message += 'complement your humanities interests while developing cultural awareness and analytical thinking skills';
      } else if (ctx.universityAspirations === 'International') {
        message += 'prepare you for international study opportunities and global career prospects';
      } else {
        message += 'open up a world of cultural understanding and global opportunities';
      }
      
      message += '.';
      welcomeText.textContent = message;
    }
  
    // Prioritize languages based on interests
    if (ctx.academicInterests?.includes('languages')) {
      $('.subject-card.french', root)?.classList.add('priority-match');
      $('.subject-card.spanish', root)?.classList.add('priority-match');
    }
    
    if (ctx.academicInterests?.includes('classics') || ctx.academicInterests?.includes('humanities')) {
      $('.subject-card.latin', root)?.classList.add('priority-match');
      $('.subject-card.classical-civilisation', root)?.classList.add('priority-match');
    }
    
    if (ctx.universityAspirations === 'International') {
      $('.subject-card.french', root)?.classList.add('priority-match');
      $('.subject-card.spanish', root)?.classList.add('priority-match');
      $('.subject-card.german', root)?.classList.add('priority-match');
    }
  
    // Personalize French content
    const frenchContent = $('.french-personalized-content', root);
    if (frenchContent) {
      const gender = ctx.gender === 'female' ? 'her' : 'his';
      let content = 'In our French programme, ';
      
      if (ctx.academicInterests?.includes('languages')) {
        content += `${ctx.childName} will build on ${gender} existing language interests, developing sophisticated communication skills through cultural immersion and authentic experiences in Montpellier.`;
      } else if (ctx.universityAspirations === 'International') {
        content += `${ctx.childName} will develop the cultural awareness and language skills essential for international study and global career opportunities.`;
      } else {
        content += `${ctx.childName} will develop sophisticated communication skills while exploring French culture and history through immersive learning experiences.`;
      }
      
      frenchContent.innerHTML = `<p>${content}</p>`;
    }
  
    // Personalize Spanish content
    const spanishContent = $('.spanish-personalized-content', root);
    if (spanishContent) {
      let content = 'In our Spanish programme, ';
      
      if (ctx.academicInterests?.includes('languages')) {
        content += `${ctx.childName} will explore the vibrant cultures of the Spanish-speaking world while developing practical language skills through our Salamanca immersion experiences.`;
      } else if (ctx.activities?.includes('community')) {
        content += `${ctx.childName} will connect with diverse Hispanic cultures, perfect for someone interested in community engagement and global understanding.`;
      } else {
        content += `${ctx.childName} will explore the rich cultures of Spanish-speaking countries while developing practical language skills for global communication.`;
      }
      
      spanishContent.innerHTML = `<p>${content}</p>`;
    }
  
    // Personalize German content
    const germanContent = $('.german-personalized-content', root);
    if (germanContent) {
      let content = 'In our German programme, ';
      
      if (ctx.priorities?.academic === 3) {
        content += `${ctx.childName} will develop systematic thinking skills through structured grammar learning, perfect for someone with strong academic priorities.`;
      } else if (ctx.academicInterests?.includes('languages')) {
        content += `${ctx.childName} will discover the logical structure of German while exploring German culture through our Berlin exchange programmes.`;
      } else {
        content += `${ctx.childName} will develop systematic thinking skills through structured grammar learning and cultural discovery.`;
      }
      
      germanContent.innerHTML = `<p>${content}</p>`;
    }
  
    // Personalize Latin content
    const latinContent = $('.latin-personalized-content', root);
    if (latinContent) {
      const gender = ctx.gender === 'female' ? 'her' : 'his';
      let content = 'In our Latin programme, ';
      
      if (ctx.academicInterests?.includes('classics') || ctx.academicInterests?.includes('humanities')) {
        content += `${ctx.childName} will excel in the rigorous analytical thinking that Latin develops, complementing ${gender} interests in classical studies and humanities.`;
      } else if (ctx.priorities?.academic === 3) {
        content += `${ctx.childName} will develop the logical thinking and academic rigour that Latin provides, essential for high academic achievement.`;
      } else {
        content += `${ctx.childName} will develop rigorous analytical skills while exploring the foundations of Western civilization through the Cambridge Latin Course.`;
      }
      
      latinContent.innerHTML = `<p>${content}</p>`;
    }
  
    // Personalize Classical Civilisation content
    const classicalContent = $('.classical-personalized-content', root);
    if (classicalContent) {
      const gender = ctx.gender === 'female' ? 'her' : 'his';
      let content = 'In our Classical Civilisation programme, ';
      
      if (ctx.academicInterests?.includes('humanities')) {
        content += `${ctx.childName} will explore the foundations of Western culture, perfectly complementing ${gender} humanities interests through study of ancient civilizations.`;
      } else if (ctx.activities?.includes('leadership')) {
        content += `${ctx.childName} will study the leadership and governance of ancient civilizations, developing insights valuable for modern leadership roles.`;
      } else {
        content += `${ctx.childName} will explore the foundations of Western culture while developing analytical and interpretive skills through study of ancient worlds.`;
      }
      
      classicalContent.innerHTML = `<p>${content}</p>`;
    }
  
    // Personalize EAL content
    const ealContent = $('.eal-personalized-content', root);
    if (ealContent) {
      let content = 'In our EAL programme, ';
      
      if (ctx.universityAspirations === 'International') {
        content += `${ctx.childName} will develop academic English skills essential for international study success while building confidence across all subjects.`;
      } else {
        content += `${ctx.childName} will develop academic English skills while building confidence for success across all subjects in the British curriculum.`;
      }
      
      ealContent.innerHTML = `<p>${content}</p>`;
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
          if (filter === 'all' || card.dataset.subject === filter) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  
    // Highlight navigation based on priorities
    if (ctx.academicInterests?.includes('languages')) {
      $$('.nav-btn', root).forEach(button => {
        const filter = button.getAttribute('data-filter');
        if (filter !== 'all') {
          button.classList.add('priority-high');
        }
      });
    }
  
    // Collapsible sections
    $$('.section-title', root).forEach(title => {
      title.addEventListener('click', function() {
        const section = this.parentElement;
        section.classList.toggle('collapsed');
      });
    });
  };