MODULES['third_form'] = (root, ctx) => {
  // Update names
  root.querySelectorAll('.child-name').forEach(el => {
    const fallback = el.getAttribute('data-fallback') || 'your child';
    const name = (ctx.childName || '').trim();
    el.textContent = name && !name.startsWith('[') ? name : fallback;
  });

  // Personalized intro
  const intro = root.querySelector('.personalized-intro');
  if (intro && ctx.childName) {
    let text = `${ctx.childName} will `;
    if (ctx.priorities?.academic === 3) {
      text += 'find the academic rigour perfect for university preparation.';
    } else if (ctx.activities?.includes('leadership')) {
      text += 'develop leadership skills through our comprehensive programme.';
    } else {
      text += 'discover their passions and build lasting friendships.';
    }
    intro.textContent = text;
  }

  // Show/hide pathways based on interests
  const pathways = {
    '.sciences-pathway': ctx.academicInterests?.includes('sciences'),
    '.mathematics-pathway': ctx.academicInterests?.includes('mathematics'),
    '.business-note': ctx.academicInterests?.includes('business'),
    '.drama-note': ctx.activities?.includes('drama')
  };

  Object.entries(pathways).forEach(([selector, show]) => {
    const el = root.querySelector(selector);
    if (el) el.style.display = show ? 'block' : 'none';
  });

  // University aspirations
  const uniNote = root.querySelector('.university-prep-note');
  if (uniNote) {
    if (ctx.universityAspirations === 'Oxford or Cambridge') {
      uniNote.textContent = 'Early preparation for Oxbridge begins here with top set placement and academic excellence.';
    } else if (ctx.universityAspirations === 'Russell Group') {
      uniNote.textContent = 'Building the strong academic foundation essential for Russell Group applications.';
    }
  }

  // NAVIGATION FUNCTIONALITY - THIS IS WHAT WAS MISSING!
  const navButtons = root.querySelectorAll('.nav-btn');
  const sectionCards = root.querySelectorAll('.section-card');

  navButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');
      
      // Update active button
      navButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Filter sections
      sectionCards.forEach(card => {
        if (filter === 'all') {
          card.classList.remove('hidden');
        } else {
          if (card.getAttribute('data-section') === filter) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        }
      });
    });
  });

  // COLLAPSIBLE SUBSECTIONS - ALSO MISSING!
  const subsectionTitles = root.querySelectorAll('.subsection-title');
  
  subsectionTitles.forEach(title => {
    title.addEventListener('click', function() {
      const subsection = this.closest('.subsection');
      if (subsection) {
        subsection.classList.toggle('collapsed');
      }
    });
  });

  // Lazy load images
  if (typeof hydrateLazyAssets === 'function') {
    hydrateLazyAssets(root);
  }
};