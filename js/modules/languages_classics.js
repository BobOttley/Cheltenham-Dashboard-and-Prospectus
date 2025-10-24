// Add this to your app.js MODULES object
MODULES['languages_classics'] = (root, ctx) => {
  // Translation function
  const t = (window.PEN_I18N && typeof window.PEN_I18N.t === 'function')
    ? window.PEN_I18N.t
    : () => '';

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
      
      const aspiration = ctx.universityAspirations === 'Oxford or Cambridge' 
        ? t('languages_classics.header.oxbridge')
        : t('languages_classics.header.university_success');
      
      // Customize based on academic interests
      if (ctx.academicInterests?.includes('languages')) {
        introTitle.innerHTML = t('languages_classics.header.language_enthusiast', { childName: ctx.childName });
        introContent.innerHTML = t('languages_classics.header.language_enthusiast_content', { 
          childName: ctx.childName,
          aspiration: ctx.universityAspirations === 'Oxford or Cambridge' ? t('languages_classics.header.oxbridge') : t('languages_classics.header.university_success')
        });
      } else if (ctx.academicInterests?.includes('classics')) {
        introTitle.innerHTML = t('languages_classics.header.classical_scholar', { childName: ctx.childName });
        introContent.innerHTML = t('languages_classics.header.classical_scholar_content', { 
          childName: ctx.childName,
          aspiration: ctx.universityAspirations === 'Oxford or Cambridge' ? t('languages_classics.header.top_universities') : t('languages_classics.header.top_universities')
        });
      } else if (ctx.academicInterests?.includes('humanities')) {
        introTitle.innerHTML = t('languages_classics.header.humanities_choice', { childName: ctx.childName });
        introContent.innerHTML = t('languages_classics.header.humanities_content', {
          aspiration: ctx.universityAspirations === 'Oxford or Cambridge' ? t('languages_classics.header.competitive_apps') : t('languages_classics.header.university_success')
        });
      } else {
        introTitle.innerHTML = t('languages_classics.header.discover_horizons', { childName: ctx.childName });
        introContent.innerHTML = t('languages_classics.header.discover_content', { childName: ctx.childName });
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
      const activities = ctx.activities?.includes('leadership') ? t('languages_classics.subjects.french.leadership_and') : '';
      const aspiration = ctx.universityAspirations === 'Oxford or Cambridge' 
        ? t('languages_classics.header.oxbridge')
        : t('languages_classics.header.university_success');
      
      frenchContent.innerHTML = `
        <div class="lc-high-priority">
          <h4>${t('languages_classics.subjects.french.perfect_match', { childName })}</h4>
          <p><strong>${t('languages_classics.subjects.french.language_leadership')}</strong> ${t('languages_classics.subjects.french.language_leadership_text', { childName, activities, aspiration })}</p>
          <p><strong>${t('languages_classics.subjects.french.cultural_engagement')}</strong> ${t('languages_classics.subjects.french.cultural_engagement_text', { childName })}</p>
        </div>
      `;
    }
    
    // German personalization
    const germanContent = root.querySelector('#german-personalized-content');
    if (germanContent && (ctx.academicInterests?.includes('languages') || (ctx.priorities?.academic >= 3))) {
      const aspiration = ctx.universityAspirations === 'Oxford or Cambridge'
        ? t('languages_classics.header.competitive_apps')
        : t('languages_classics.header.university_success');
      
      let leadershipSection = '';
      if (ctx.activities?.includes('leadership')) {
        leadershipSection = `<p><strong>${t('languages_classics.subjects.german.leadership_skills')}</strong> ${t('languages_classics.subjects.german.leadership_text', { childName })}</p>`;
      }
      
      germanContent.innerHTML = `
        <div class="lc-university-focus">
          <h4>${t('languages_classics.subjects.german.academic_excellence', { childName })}</h4>
          <p><strong>${t('languages_classics.subjects.german.rigorous_approach')}</strong> ${t('languages_classics.subjects.german.rigorous_text', { aspiration })}</p>
          ${leadershipSection}
        </div>
      `;
    }
    
    // Spanish personalization
    const spanishContent = root.querySelector('#spanish-personalized-content');
    if (spanishContent && (ctx.academicInterests?.includes('languages') || ctx.activities?.includes('community'))) {
      const aspiration = ctx.universityAspirations === 'Oxford or Cambridge'
        ? t('languages_classics.header.competitive_apps')
        : t('languages_classics.header.university_success');
      
      let communitySection = '';
      if (ctx.activities?.includes('community')) {
        communitySection = `<p><strong>${t('languages_classics.subjects.spanish.community_engagement')}</strong> ${t('languages_classics.subjects.spanish.community_text', { childName })}</p>`;
      }
      
      spanishContent.innerHTML = `
        <div class="lc-activity-match">
          <h4>${t('languages_classics.subjects.spanish.global_perspective', { childName })}</h4>
          <p><strong>${t('languages_classics.subjects.spanish.worlds_second')}</strong> ${t('languages_classics.subjects.spanish.worlds_second_text', { childName, aspiration })}</p>
          ${communitySection}
        </div>
      `;
    }
    
    // Latin personalization  
    const latinContent = root.querySelector('#latin-personalized-content');
    if (latinContent && (ctx.academicInterests?.includes('classics') || ctx.universityAspirations === 'Oxford or Cambridge')) {
      const aspiration = ctx.universityAspirations === 'Oxford or Cambridge'
        ? t('languages_classics.header.top_universities')
        : t('languages_classics.header.top_universities');
      
      latinContent.innerHTML = `
        <div class="lc-high-priority">
          <h4>${t('languages_classics.subjects.latin.classical_excellence', { childName })}</h4>
          <p><strong>${t('languages_classics.subjects.latin.oxbridge_prep')}</strong> ${t('languages_classics.subjects.latin.oxbridge_prep_text', { aspiration })}</p>
          <p><strong>${t('languages_classics.subjects.latin.foundation_skills')}</strong> ${t('languages_classics.subjects.latin.foundation_text', { childName })}</p>
        </div>
      `;
    }
    
    // Greek personalization
    const greekContent = root.querySelector('#greek-personalized-content');
    if (greekContent && (ctx.academicInterests?.includes('classics') || (ctx.priorities?.academic >= 3))) {
      const aspiration = ctx.universityAspirations === 'Oxford or Cambridge'
        ? t('languages_classics.header.competitive_apps')
        : t('languages_classics.header.university_success');
      
      greekContent.innerHTML = `
        <div class="lc-university-focus">
          <h4>${t('languages_classics.subjects.greek.philosophical_foundations', { childName })}</h4>
          <p><strong>${t('languages_classics.subjects.greek.academic_distinction')}</strong> ${t('languages_classics.subjects.greek.academic_distinction_text', { aspiration })}</p>
          <p><strong>${t('languages_classics.subjects.greek.unique_advantage')}</strong> ${t('languages_classics.subjects.greek.unique_advantage_text', { childName })}</p>
        </div>
      `;
    }
    
    // Classical Civilisation personalization
    const classicalCivContent = root.querySelector('#classical-civ-personalized-content');
    if (classicalCivContent && (ctx.academicInterests?.includes('classics') || ctx.academicInterests?.includes('humanities'))) {
      const interests = ctx.academicInterests?.includes('humanities')
        ? t('languages_classics.subjects.classical_civ.humanities_interests')
        : t('languages_classics.subjects.classical_civ.academic_studies');
      
      const aspiration = ctx.universityAspirations === 'Oxford or Cambridge'
        ? t('languages_classics.subjects.classical_civ.oxbridge_classics')
        : t('languages_classics.subjects.classical_civ.diverse_courses');
      
      classicalCivContent.innerHTML = `
        <div class="lc-priority-highlight">
          <h4>${t('languages_classics.subjects.classical_civ.humanities_excellence', { childName })}</h4>
          <p><strong>${t('languages_classics.subjects.classical_civ.perfect_combination')}</strong> ${t('languages_classics.subjects.classical_civ.perfect_combination_text', { interests })}</p>
          <p><strong>${t('languages_classics.subjects.classical_civ.university_success')}</strong> ${t('languages_classics.subjects.classical_civ.university_success_text', { aspiration })}</p>
        </div>
      `;
    }
    
    // EAL personalization (if international context suggested)
    const ealContent = root.querySelector('#eal-personalized-content');
    if (ealContent && ctx.stage === 'Sixth Form') {
      const aspiration = ctx.universityAspirations === 'Oxford or Cambridge'
        ? t('languages_classics.header.competitive_apps')
        : t('languages_classics.header.university_success');
      
      ealContent.innerHTML = `
        <div class="lc-age-appropriate">
          <h4>${t('languages_classics.subjects.eal.university_prep', { childName })}</h4>
          <p><strong>${t('languages_classics.subjects.eal.academic_english')}</strong> ${t('languages_classics.subjects.eal.academic_english_text', { childName, aspiration })}</p>
          <p><strong>${t('languages_classics.subjects.eal.integrated_support')}</strong> ${t('languages_classics.subjects.eal.integrated_support_text', { childName })}</p>
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
      navTitle.textContent = t('languages_classics.navigation.options_title', { childName: ctx.childName });
    }
  }

  // 6. Add university-focused content
  function addUniversityFocus() {
    const universityTitle = root.querySelector('#university-success-title');
    const globalSkillsContent = root.querySelector('#global-skills-content');
    
    if (universityTitle && globalSkillsContent) {
      if (ctx.universityAspirations === 'Oxford or Cambridge') {
        universityTitle.textContent = t('languages_classics.university.oxbridge_title', { childName: ctx.childName });
        globalSkillsContent.innerHTML = t('languages_classics.university.oxbridge_content', { childName: ctx.childName });
      } else if (ctx.universityAspirations === 'Russell Group') {
        universityTitle.textContent = t('languages_classics.university.russell_title', { childName: ctx.childName });
        globalSkillsContent.innerHTML = t('languages_classics.university.russell_content', { childName: ctx.childName });
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
              <h4>${t('languages_classics.boarding.life_enhancement', { childName: ctx.childName })}</h4>
              <p><strong>${t('languages_classics.boarding.immersive_learning')}</strong> ${t('languages_classics.boarding.immersive_text', { childName: ctx.childName })}</p>
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
        ctaTitle.textContent = t('languages_classics.cta.experience_excellence', { childName });
        ctaSubtitle.innerHTML = t('languages_classics.cta.experience_subtitle', { childName });
      } else {
        ctaTitle.textContent = t('languages_classics.cta.discover_opportunities', { childName });
        ctaSubtitle.innerHTML = t('languages_classics.cta.discover_subtitle', { childName });
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