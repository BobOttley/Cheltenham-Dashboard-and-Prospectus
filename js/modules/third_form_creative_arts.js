/* Third Form Creative Arts module initializer */
MODULES['third_form_creative_arts'] = (root, ctx) => {
  // Translation function
  const t = (window.PEN_I18N && typeof window.PEN_I18N.t === 'function')
    ? window.PEN_I18N.t
    : () => '';

  // Update all name placeholders
  $$('.child-name', root).forEach(el => el.textContent = ctx.childName || t('third_form_creative_arts.placeholders.child_name'));
  $$('.parent-name', root).forEach(el => el.textContent = ctx.parentName || t('third_form_creative_arts.placeholders.parent_name'));
  $$('.family-name', root).forEach(el => el.textContent = ctx.familyName || t('third_form_creative_arts.placeholders.family_name'));

  // Lazy load images
  hydrateLazyAssets(root);

  // Customize welcome message based on interests
  const welcomeText = $('.personalized-welcome-text', root);
  if (welcomeText) {
    let message = t('third_form_creative_arts.welcome.prefix') + ' ';
    
    if (ctx.academicInterests?.includes('arts')) {
      message += t('third_form_creative_arts.welcome.arts_interest');
    } else if (ctx.activities?.includes('arts')) {
      message += t('third_form_creative_arts.welcome.arts_activity');
    } else {
      message += t('third_form_creative_arts.welcome.general');
    }
    
    message += t('third_form_creative_arts.welcome.suffix');
    welcomeText.textContent = message;
  }

  // Get pronouns
  const possessive = ctx.gender === 'female' 
    ? t('third_form_creative_arts.pronouns.her')
    : t('third_form_creative_arts.pronouns.his');

  // Personalize Art content
  const artPersonalizedContent = $('.art-personalized-content', root);
  if (artPersonalizedContent) {
    const childName = ctx.childName || t('third_form_creative_arts.placeholders.child_name');
    let content = '';
    
    if (ctx.academicInterests?.includes('arts')) {
      content = t('third_form_creative_arts.art.strong_interest', { childName, possessive });
    } else if (ctx.priorities?.arts === 3) {
      content = t('third_form_creative_arts.art.arts_priority', { childName, possessive });
    } else {
      content = t('third_form_creative_arts.art.general', { childName });
    }
    
    artPersonalizedContent.innerHTML = `<p>${content}</p>`;
  }

  // Personalize Design Technology content
  const designTechContent = $('.design-tech-personalized-content', root);
  if (designTechContent) {
    const childName = ctx.childName || t('third_form_creative_arts.placeholders.child_name');
    let content = '';
    
    if (ctx.activities?.includes('technology') || ctx.academicInterests?.includes('design')) {
      content = t('third_form_creative_arts.design_tech.tech_interest', { childName, possessive });
    } else if (ctx.priorities?.academic === 3) {
      content = t('third_form_creative_arts.design_tech.academic', { childName });
    } else {
      content = t('third_form_creative_arts.design_tech.general', { childName });
    }
    
    designTechContent.innerHTML = `<p>${content}</p>`;
  }

  // Highlight subjects based on interests
  const artCard = $('.subject-card.art', root);
  const designCard = $('.subject-card.design-technology', root);
  
  if (ctx.academicInterests?.includes('arts') || ctx.priorities?.arts === 3) {
    artCard?.classList.add('priority-match');
  }
  
  if (ctx.academicInterests?.includes('design') || ctx.activities?.includes('technology')) {
    designCard?.classList.add('priority-match');
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
        if (filter === 'all' || card.classList.contains(filter)) {
          card.style.display = 'block';
          card.classList.remove('hidden');
        } else {
          card.style.display = 'none';
          card.classList.add('hidden');
        }
      });
    });
  });

  // Highlight navigation based on priorities
  $$('.nav-btn', root).forEach(button => {
    const filter = button.getAttribute('data-filter');
    
    if (filter === 'art' && (ctx.academicInterests?.includes('arts') || ctx.priorities?.arts === 3)) {
      button.classList.add('priority-high');
    } else if (filter === 'design-technology' && (ctx.academicInterests?.includes('design') || ctx.activities?.includes('technology'))) {
      button.classList.add('priority-high');
    }
  });
};
