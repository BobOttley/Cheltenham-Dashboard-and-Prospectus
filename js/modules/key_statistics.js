/* Key Statistics module */
MODULES['key_statistics'] = (sectionEl, ctx) => {
  // Translation function
  const t = (window.PEN_I18N && typeof window.PEN_I18N.t === 'function')
    ? window.PEN_I18N.t
    : () => '';

  const name = (ctx.childName || '').trim();
  const hasName = name && !name.startsWith('[');

  const titleEl = sectionEl.querySelector('.section-title');
  const subEl   = sectionEl.querySelector('.section-subtitle');

  // Header: "By the Numbers for {Name}"
  if (titleEl && hasName){
    const byNumbers = t('key_statistics.title.by_numbers');
    const forChild = t('key_statistics.title.for_child', { childName: name });
    titleEl.innerHTML = `${byNumbers.split(' ')[0]} <span class="highlight">${byNumbers.split(' ')[1] || ''}</span> ${forChild}`;
  }

  // Subtitle: "…and the success of {Name}"
  if (subEl && hasName){
    subEl.textContent = t('key_statistics.subtitle.excellence', { childName: name });
  }
};