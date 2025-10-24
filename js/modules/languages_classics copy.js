// Add this to your app.js MODULES object
MODULES['languages_classics'] = (root, ctx) => {
  // 1. Update name placeholders
  function updateNames() {
    const childName = ctx.childName || '[Child\'s Name]';
    
    // Update all child name placeholders
    root.querySelectorAll('.child-name').forEach(element => {
      element.textContent = childName;
    });
  }

  // 2. Add personalized header content
  function addPersonalizedHeader() {
    const personalizedIntro = root.querySelector('#personalized-intro');
    const introTitle = root.querySelector('#intro-title');
    const introContent = root.querySelector('#intro-content');
    
    if (ctx.childName && ctx.childName !== '[Child\'s Name]') {
      personalizedIntro.style.display = 'block';
      
      // Customize based on academic interests
      if (ctx.academicInterests?.includes('languages')) {
        introTitle.innerHTML = `Perfect for ${ctx.childName} - Language Enthusiast`;
        introContent.innerHTML = `With your passion for languages, ${ctx.childName} will thrive in our comprehensive language programmes. From modern European languages to classical studies, these subjects align perfectly with your academic interests and offer excellent preparation for ${ctx.universityAspirations === 'Oxford or Cambridge' ? 'Oxbridge applications' : 'university success'}.`;
      } else if (ctx.academicInterests?.includes('classics')) {
        introTitle.innerHTML = `Perfect for ${ctx.childName} - Classical Scholar`;
        introContent.innerHTML = `Your interest in classics makes these subjects ideal for ${ctx.childName}. Our world-class Classical Studies department, with six specialist teachers in historic settings, offers unparalleled preparation for ${ctx.universityAspirations === 'Oxford or Cambridge' ? 'Oxford and Cambridge' : 'top universities'}.`;
      } else if (ctx.academicInterests?.includes('humanities')) {
        introTitle.innerHTML = `Excellent Choice for ${ctx.childName}`;
        introContent.innerHTML = `Languages and Classical Studies complement humanities beautifully, developing critical thinking, cultural awareness, and communication skills. These subjects provide excellent preparation for ${ctx.universityAspirations === 'Oxford or Cambridge' ? 'competitive university applications' : 'university success'}.`;
      } else {
        introTitle.innerHTML = `Discover New Horizons for ${ctx.childName}`;
        introContent.innerHTML = `Even without prior language experience, ${ctx.childName} could discover a passion for global communication and cultural understanding through our exceptional language and classics programmes.`;
      }
    }
  }

  // 3. Prioritize and reorder subjects
  function prioritizeSubjects() {
    const container = root.querySelector('#subjects-container');
    const subjectCards = Array.from(container.children);
    
    // Create priority scoring system
    const getSubjectPriority = (card) => {
      let score = 0;
      const subject = card.getAttribute('data-subject');
      
      // Academic interest matches
      if (ctx.academicInterests?.includes('languages') && 
          ['french', 'german', 'spanish'].includes(subject)) {
        score += 30;
        card.classList.add('priority-match');
      }
      
      if (ctx.academicInterests?.includes('classics') && 
          ['latin', 'greek', 'classical-civilisation'].includes(subject)) {
        score += 30;
        card.classList.add('priority-match');
      }
      
      // University aspiration bonuses
      if (ctx.universityAspirations === 'Oxford or Cambridge') {
        if (['latin', 'greek', 'classical-civilisation'].includes(subject)) {
          score += 15;
        }
        if (['french', 'german', 'spanish'].includes(subject)) {
          score += 10;
        }
      }
      
      // Activity matches (leadership = languages for global communication)
      if (ctx.activities?.includes('leadership') && 
          ['french', 'german', 'spanish'].includes(subject)) {
        score += 10;
      }
      
      // EAL for international students
      if (ctx.stage === 'Sixth Form' && subject === 'eal') {
        score += 5;
      }
      
      return score;
    };
    
    // Sort by priority score
    subjectCards.sort((a, b) => getSubjectPriority(b) - getSubjectPriority(a));
    
    // Reorder in DOM
    subjectCards.forEach(card => container.appendChild(card));
  }

  // 4. Add personalized content to each subject
  function addPersonalizedSubjectContent() {
    const childName = ctx.childName || '[Child\'s Name]';
    
    // French personalization
    const frenchContent = root.querySelector('#french-personalized-content');
    if (frenchContent && (ctx.academicInterests?.includes('languages') || ctx.activities?.includes('leadership'))) {
      frenchContent.innerHTML = `
        <div class="lc-high-priority">
          <h4>Perfect Match for ${childName}</h4>
          <p><strong>Language Leadership:</strong> ${childName}'s interest in ${ctx.activities?.includes('leadership') ? 'leadership and ' : ''}languages makes French ideal for developing global communication skills essential for international careers and ${ctx.universityAspirations === 'Oxford or Cambridge' ? 'Oxbridge preparation' : 'university success'}.</p>
          <p><strong>Cultural Engagement:</strong> Individual Research Projects allow ${childName} to explore personal interests while developing advanced presentation skills valued by top universities.</p>
        </div>
      `;
    }
    
    // German personalization
    const germanContent = root.querySelector('#german-personalized-content');
    if (germanContent && (ctx.academicInterests?.includes('languages') || (ctx.priorities?.academic >= 3))) {
      germanContent.innerHTML = `
        <div class="lc-university-focus">
          <h4>Academic Excellence for ${childName}</h4>
          <p><strong>Rigorous Academic Approach:</strong> German's systematic grammatical structure appeals to analytical minds and develops precision in thinking - excellent preparation for ${ctx.universityAspirations === 'Oxford or Cambridge' ? 'Oxford and Cambridge applications' : 'competitive university courses'}.</p>
          ${ctx.activities?.includes('leadership') ? `<p><strong>Leadership Skills:</strong> Cultural understanding and communication skills developed through German study enhance ${childName}'s leadership potential in international contexts.</p>` : ''}
        </div>
      `;
    }
    
    // Spanish personalization
    const spanishContent = root.querySelector('#spanish-personalized-content');
    if (spanishContent && (ctx.academicInterests?.includes('languages') || ctx.activities?.includes('community'))) {
      spanishContent.innerHTML = `
        <div class="lc-activity-match">
          <h4>Global Perspective for ${childName}</h4>
          <p><strong>World's Second Language:</strong> Spanish opens doors to global communication with over 500 million speakers worldwide - perfect for ${childName}'s international aspirations and ${ctx.universityAspirations === 'Oxford or Cambridge' ? 'competitive university applications' : 'future career success'}.</p>
          ${ctx.activities?.includes('community') ? `<p><strong>Community Engagement:</strong> Understanding Hispanic cultures enhances ${childName}'s community service perspective and cultural sensitivity.</p>` : ''}
        </div>
      `;
    }
    
    // Latin personalization  
    const latinContent = root.querySelector('#latin-personalized-content');
    if (latinContent && (ctx.academicInterests?.includes('classics') || ctx.universityAspirations === 'Oxford or Cambridge')) {
      latinContent.innerHTML = `
        <div class="lc-high-priority">
          <h4>Classical Excellence for ${childName}</h4>
          <p><strong>Oxbridge Preparation:</strong> Latin develops linguistic precision, analytical thinking, and cultural literacy highly valued by ${ctx.universityAspirations === 'Oxford or Cambridge' ? 'Oxford and Cambridge' : 'top universities'}. Recent graduates have achieved places at both universities.</p>
          <p><strong>Foundation Skills:</strong> The logical structure of Latin enhances ${childName}'s analytical abilities and provides excellent preparation for law, medicine, and academic careers.</p>
        </div>
      `;
    }
    
    // Greek personalization
    const greekContent = root.querySelector('#greek-personalized-content');
    if (greekContent && (ctx.academicInterests?.includes('classics') || (ctx.priorities?.academic >= 3))) {
      greekContent.innerHTML = `
        <div class="lc-university-focus">
          <h4>Philosophical Foundations for ${childName}</h4>
          <p><strong>Academic Distinction:</strong> Classical Greek provides access to original philosophical and literary works, developing sophisticated analytical skills perfect for ${ctx.universityAspirations === 'Oxford or Cambridge' ? 'Oxbridge applications' : 'competitive academic programmes'}.</p>
          <p><strong>Unique Advantage:</strong> Few students study Greek, making ${childName} stand out in university applications with this distinctive subject combination.</p>
        </div>
      `;
    }
    
    // Classical Civilisation personalization
    const classicalCivContent = root.querySelector('#classical-civ-personalized-content');
    if (classicalCivContent && (ctx.academicInterests?.includes('classics') || ctx.academicInterests?.includes('humanities'))) {
      classicalCivContent.innerHTML = `
        <div class="lc-priority-highlight">
          <h4>Humanities Excellence for ${childName}</h4>
          <p><strong>Perfect Subject Combination:</strong> Classical Civilisation complements ${ctx.academicInterests?.includes('humanities') ? 'humanities interests' : 'academic studies'} beautifully, requiring no prior knowledge but developing sophisticated analytical and essay-writing skills.</p>
          <p><strong>University Success:</strong> 83% of recent leavers achieved Russell Group places, with excellent preparation for ${ctx.universityAspirations === 'Oxford or Cambridge' ? 'Oxbridge applications in Classics, History, or related fields' : 'diverse university courses'}.</p>
        </div>
      `;
    }
    
    // EAL personalization (if international context suggested)
    const ealContent = root.querySelector('#eal-personalized-content');
    if (ealContent && ctx.stage === 'Sixth Form') {
      ealContent.innerHTML = `
        <div class="lc-age-appropriate">
          <h4>University Preparation for ${childName}</h4>
          <p><strong>Academic English Excellence:</strong> EAL support ensures ${childName} develops university-level English skills essential for success in A Level subjects and ${ctx.universityAspirations === 'Oxford or Cambridge' ? 'competitive university applications' : 'higher education'}.</p>
          <p><strong>Integrated Support:</strong> Individual tuition available to help ${childName} excel across all chosen subjects while building confidence in academic English.</p>
        </div>
      `;
    }
  }

  // 5. Update navigation highlighting  
  function updateNavigation() {
    const navButtons = root.querySelectorAll('.lc-nav-btn');
    
    navButtons.forEach(button => {
      const filter = button.getAttribute('data-filter');
      
      // Highlight based on academic interests
      if (ctx.academicInterests?.includes('languages') && 
          ['french', 'german', 'spanish'].includes(filter)) {
        button.classList.add('priority-match');
      }
      
      if (ctx.academicInterests?.includes('classics') && 
          ['latin', 'greek', 'classical-civilisation'].includes(filter)) {
        button.classList.add('priority-match');
      }
    });
    
    // Update nav title
    const navTitle = root.querySelector('#nav-title');
    if (navTitle && (ctx.academicInterests?.includes('languages') || ctx.academicInterests?.includes('classics'))) {
      navTitle.textContent = `${ctx.childName}'s Language & Classics Options`;
    }
  }

  // 6. Add university-focused content
  function addUniversityFocus() {
    const universityTitle = root.querySelector('#university-success-title');
    const globalSkillsContent = root.querySelector('#global-skills-content');
    
    if (universityTitle && globalSkillsContent) {
      if (ctx.universityAspirations === 'Oxford or Cambridge') {
        universityTitle.textContent = `Oxbridge Success & Global Opportunities for ${ctx.childName}`;
        globalSkillsContent.innerHTML = `Languages and classics provide exceptional preparation for Oxford and Cambridge applications. ${ctx.childName} will develop the analytical thinking, cultural knowledge, and communication skills that admissions tutors value highly. Recent students have achieved places at both universities across diverse subjects.`;
      } else if (ctx.universityAspirations === 'Russell Group') {
        universityTitle.textContent = `Russell Group Success & Professional Excellence for ${ctx.childName}`;
        globalSkillsContent.innerHTML = `With 83% of classics students achieving Russell Group places, ${ctx.childName} will be excellently prepared for top university applications. Language competence and classical knowledge provide valuable differentiation in competitive admissions processes.`;
      }
    }
  }

  // 7. Add boarding-specific content
  function addBoardingContent() {
    if (ctx.boardingPreference === 'boarding' || ctx.boardingPreference === 'Full Boarding') {
      // Add boarding-specific language opportunities
      const subjects = ['french', 'german', 'spanish', 'latin', 'greek', 'classical-civilisation'];
      
      subjects.forEach(subject => {
        const content = root.querySelector(`#${subject}-personalized-content`);
        if (content && !content.innerHTML.includes('boarding')) {
          const boardingContent = `
            <div class="lc-boarding-highlight">
              <h4>Boarding Life Enhancement for ${ctx.childName}</h4>
              <p><strong>Immersive Learning:</strong> Boarding students benefit from Modern Languages Society events, Classical Society gatherings, and peer study groups. ${ctx.childName} will engage with international students, enhancing cultural understanding and language practice opportunities.</p>
            </div>
          `;
          content.innerHTML += boardingContent;
        }
      });
    }
  }

  // 8. Update CTA section
  function updateCTASection() {
    const ctaTitle = root.querySelector('#cta-title');
    const ctaSubtitle = root.querySelector('#cta-subtitle');
    const childName = ctx.childName || '[Child\'s Name]';
    
    if (ctaTitle && ctaSubtitle) {
      if (ctx.academicInterests?.includes('languages') || ctx.academicInterests?.includes('classics')) {
        ctaTitle.textContent = `Experience Language Excellence with ${childName}`;
        ctaSubtitle.innerHTML = `Book your personalised visit and discover how ${childName} will thrive in our world-class language and classics programmes. See our facilities, meet our teachers, and explore the opportunities that await.`;
      } else {
        ctaTitle.textContent = `Discover Global Opportunities for ${childName}`;
        ctaSubtitle.innerHTML = `Book your personalised visit and see how languages and classics could open new horizons for ${childName}. Explore our exceptional facilities and meet our passionate teachers.`;
      }
    }
  }

  // 9. Subject filtering functionality
  function setupSubjectFiltering() {
    const navButtons = root.querySelectorAll('.lc-nav-btn');
    const subjectCards = root.querySelectorAll('.lc-subject-card');

    navButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Update active button
        navButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filter = button.getAttribute('data-filter');

        // Filter subject cards
        subjectCards.forEach(card => {
          if (filter === 'all' || card.getAttribute('data-subject') === filter) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  // 10. Collapsible sections functionality
  function setupCollapsibleSections() {
    const sectionTitles = root.querySelectorAll('.lc-section-title');
    
    sectionTitles.forEach(title => {
      title.addEventListener('click', () => {
        const section = title.parentElement;
        section.classList.toggle('collapsed');
      });
    });
  }

  // 11. Interactive stats
  function setupInteractiveStats() {
    const stats = root.querySelectorAll('.lc-stat');
    stats.forEach(stat => {
      stat.addEventListener('mouseenter', () => {
        stat.style.transform = 'translateY(-5px) scale(1.05)';
      });
      
      stat.addEventListener('mouseleave', () => {
        stat.style.transform = 'translateY(0) scale(1)';
      });
    });
  }

  // Initialize all personalization
  updateNames();
  addPersonalizedHeader();
  prioritizeSubjects();
  addPersonalizedSubjectContent();
  updateNavigation();
  addUniversityFocus();
  addBoardingContent();
  updateCTASection();
  setupSubjectFiltering();
  setupCollapsibleSections();
  setupInteractiveStats();
  
  // Lazy load images
  if (typeof hydrateLazyAssets === 'function') {
    hydrateLazyAssets(root);
  }
};