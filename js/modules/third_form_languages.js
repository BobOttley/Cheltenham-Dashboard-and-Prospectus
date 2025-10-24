/* Third Form Languages module initializer */
MODULES['third_form_languages'] = (root, ctx) => {
  // Translation function
  const t = (window.PEN_I18N && typeof window.PEN_I18N.t === 'function')
    ? window.PEN_I18N.t
    : () => '';

  // Update all name placeholders
  $$('.child-name', root).forEach(el => el.textContent = ctx.childName || t('third_form_languages.placeholders.child_name'));
  $$('.parent-name', root).forEach(el => el.textContent = ctx.parentName || t('third_form_languages.placeholders.parent_name'));
  $$('.family-name', root).forEach(el => el.textContent = ctx.familyName || t('third_form_languages.placeholders.family_name'));

  // Lazy load images
  hydrateLazyAssets(root);

  // Customize welcome message based on interests
  const welcomeText = $('.personalized-welcome-text', root);
  if (welcomeText) {
    let message = t('third_form_languages.welcome.prefix') + ' ';
    
    if (ctx.academicInterests?.includes('languages')) {
      message += t('third_form_languages.welcome.languages_interest');
    } else if (ctx.academicInterests?.includes('humanities')) {
      message += t('third_form_languages.welcome.humanities_interest');
    } else if (ctx.universityAspirations === 'International') {
      message += t('third_form_languages.welcome.international_aspirations');
    } else {
      message += t('third_form_languages.welcome.general');
    }
    
    message += (window.PEN_I18N?.lang === 'zh-Hans' ? '。' : '.');

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

  // Get pronouns
  const childName = ctx.childName || t('third_form_languages.placeholders.child_name');
  const g = ctx.childGender || ctx.gender;
  const possessive =
    g === 'female' ? t('third_form_languages.pronouns.her') :
    g === 'male'   ? t('third_form_languages.pronouns.his') : '';

  // Personalize French content
  const frenchContent = $('.french-personalized-content', root);
  if (frenchContent) {
    let content = '';
    
    if (ctx.academicInterests?.includes('languages')) {
      content = t('third_form_languages.french.languages', { childName, possessive });
    } else if (ctx.universityAspirations === 'International') {
      content = t('third_form_languages.french.international', { childName });
    } else {
      content = t('third_form_languages.french.general', { childName });
    }
    
    frenchContent.innerHTML = `<p>${content}</p>`;
  }

  // Personalize Spanish content
  const spanishContent = $('.spanish-personalized-content', root);
  if (spanishContent) {
    let content = '';
    
    if (ctx.academicInterests?.includes('languages')) {
      content = t('third_form_languages.spanish.languages', { childName });
    } else if (ctx.activities?.includes('community')) {
      content = t('third_form_languages.spanish.community', { childName });
    } else {
      content = t('third_form_languages.spanish.general', { childName });
    }
    
    spanishContent.innerHTML = `<p>${content}</p>`;
  }

  // Personalize German content
  const germanContent = $('.german-personalized-content', root);
  if (germanContent) {
    let content = '';
    
    if (ctx.priorities?.academic === 3) {
      content = t('third_form_languages.german.academic_priority', { childName });
    } else if (ctx.academicInterests?.includes('languages')) {
      content = t('third_form_languages.german.languages', { childName });
    } else {
      content = t('third_form_languages.german.general', { childName });
    }
    
    germanContent.innerHTML = `<p>${content}</p>`;
  }

  // Personalize Latin content
  const latinContent = $('.latin-personalized-content', root);
  if (latinContent) {
    let content = '';
    
    if (ctx.academicInterests?.includes('classics') || ctx.academicInterests?.includes('humanities')) {
      content = t('third_form_languages.latin.classics', { childName, possessive });
    } else if (ctx.priorities?.academic === 3) {
      content = t('third_form_languages.latin.academic_priority', { childName });
    } else {
      content = t('third_form_languages.latin.general', { childName });
    }
    
    latinContent.innerHTML = `<p>${content}</p>`;
  }

  // Personalize Classical Civilisation content
  const classicalContent = $('.classical-personalized-content', root);
  if (classicalContent) {
    let content = '';
    
    if (ctx.academicInterests?.includes('humanities')) {
      content = t('third_form_languages.classical.humanities', { childName, possessive });
    } else if (ctx.activities?.includes('leadership')) {
      content = t('third_form_languages.classical.leadership', { childName });
    } else {
      content = t('third_form_languages.classical.general', { childName });
    }
    
    classicalContent.innerHTML = `<p>${content}</p>`;
  }

  // Personalize EAL content
  const ealContent = $('.eal-personalized-content', root);
  if (ealContent) {
    let content = '';
    
    if (ctx.universityAspirations === 'International') {
      content = t('third_form_languages.eal.international', { childName });
    } else {
      content = t('third_form_languages.eal.general', { childName });
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