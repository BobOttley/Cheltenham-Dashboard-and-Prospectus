/* Key Statistics module */
MODULES['key_statistics'] = (sectionEl, ctx) => {
  const name = (ctx.childName || '').trim();
  const hasName = name && !name.startsWith('[');

  const titleEl = sectionEl.querySelector('.section-title');
  const subEl   = sectionEl.querySelector('.section-subtitle');

  // Header: “By the Numbers for {Name}”
  if (titleEl && hasName){
    titleEl.innerHTML = `By the <span class="highlight">Numbers</span> for ${name}`;
  }

  // Subtitle: “…and the success of {Name}”
  if (subEl && hasName){
    subEl.textContent = `Excellence measured in achievements, opportunities, and the success of ${name}.`;
  }
};