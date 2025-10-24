/* Student Gallery module initializer - Add to MODULES object in app.js */
MODULES['student_gallery'] = (root, ctx) => {
  // Update name placeholders
  const updateNames = () => {
    root.querySelectorAll('.child-name').forEach(el => {
      const fallback = el.getAttribute('data-fallback') || 'your child';
      const name = (ctx.childName || '').trim();
      el.textContent = name && !name.startsWith('[') ? name : fallback;
    });
  };

  // Add conditional content
  const addConditionalContent = () => {
    const childName = ctx.childName || 'your child';
    
    // Personal journey note
    const journeyNote = root.querySelector('.personal-journey-note');
    if (journeyNote) {
      if (ctx.boardingPreference === 'Full Boarding') {
        journeyNote.textContent = `As a boarding student, you'll experience the full richness of our community life.`;
      } else if (ctx.boardingPreference === 'Day') {
        journeyNote.textContent = `As a day student, you'll enjoy the best of both worlds - our vibrant school community and your home life.`;
      }
    }
    
    // Community note
    const communityNote = root.querySelector('.community-note');
    if (communityNote) {
      if (ctx.values?.includes('wellbeing')) {
        communityNote.textContent = `- with wellbeing at the heart of everything we do.`;
      } else if (ctx.boardingPreference === 'Full Boarding') {
        communityNote.textContent = `- perfect for students seeking a truly immersive educational experience.`;
      } else if (ctx.priorities?.academic === 3) {
        communityNote.textContent = `- where academic excellence drives everything we do.`;
      }
    }
    
    // Academic support note
    const academicNote = root.querySelector('.academic-support-note');
    if (academicNote && ctx.academicInterests?.length > 0) {
      let note = '';
      if (ctx.academicInterests.includes('sciences')) {
        note = ctx.universityAspirations === 'Oxford or Cambridge' 
          ? `With your Sciences interests and Oxbridge ambitions, our university-standard laboratories will support your goals.`
          : `With your interest in Sciences, you'll love our specialized research resources.`;
      } else if (ctx.academicInterests.includes('mathematics')) {
        note = `For mathematical interests like yours, our academic support team provides extension opportunities.`;
      } else if (ctx.academicInterests.includes('humanities')) {
        note = `Our Humanities departments will perfectly support your interests.`;
      }
      academicNote.textContent = note;
    }
    
    // Sports interest note
    const sportNote = root.querySelector('.sport-interest-note');
    if (sportNote && ctx.activities?.includes('sports')) {
      let note = '';
      if (ctx.specificSports?.includes('hockey')) {
        note = `As someone interested in hockey, you'll love our astroturf pitches and excellent reputation.`;
      } else if (ctx.specificSports?.includes('athletics')) {
        note = `With your athletics interests, our track and field facilities will help you excel.`;
      } else if (ctx.specificSports?.includes('rugby')) {
        note = `Our rugby programme has produced internationals - perfect for developing your skills.`;
      } else {
        note = `With your sporting interests, you'll thrive with our professional coaching.`;
      }
      sportNote.textContent = note;
    }
    
    // Pastoral priority note
    const pastoralNote = root.querySelector('.pastoral-priority-note');
    if (pastoralNote) {
      if (ctx.priorities?.pastoral === 3) {
        pastoralNote.textContent = `Since pastoral care is important to you, you'll appreciate our exceptional House staff.`;
      } else if (ctx.boardingPreference === 'Full Boarding') {
        pastoralNote.textContent = `As a boarding family, our House staff live on-site creating a true home environment.`;
      }
    }
    
    // Testimonial connection
    const testimonialConnection = root.querySelector('.testimonial-connection');
    if (testimonialConnection) {
      if (ctx.activities?.includes('leadership')) {
        testimonialConnection.textContent = `This student's experience with leadership opportunities aligns with your interests.`;
      } else if (ctx.boardingPreference === 'Full Boarding') {
        testimonialConnection.textContent = `This perfectly captures the boarding experience you're considering.`;
      }
    }
  };

  // Filter items by gender
  const filterByGender = () => {
    const gender = (ctx.gender || ctx.childGender || '').toLowerCase();
    if (!gender) return;
    
    root.querySelectorAll('.gallery-item[data-gender]').forEach(item => {
      const itemGender = item.getAttribute('data-gender');
      if (itemGender && itemGender !== gender) {
        item.style.display = 'none';
      }
    });
  };

  // Smart category ordering based on priorities
  const smartCategoryOrdering = () => {
    const tabsContainer = root.querySelector('.category-tabs');
    if (!tabsContainer) return;
    
    const tabs = Array.from(root.querySelectorAll('.category-tab'));
    const allTab = tabs.find(t => t.getAttribute('data-category') === 'all');
    const otherTabs = tabs.filter(t => t.getAttribute('data-category') !== 'all');
    
    // Priority mapping
    const categoryPriority = {
      'academic': ctx.priorities?.academic || 2,
      'sport': ctx.priorities?.sports || 2,
      'arts': ctx.priorities?.arts || 2,
      'community': ctx.priorities?.pastoral || 2
    };
    
    // Sort tabs by priority
    otherTabs.sort((a, b) => {
      const aPriority = categoryPriority[a.getAttribute('data-category')] || 2;
      const bPriority = categoryPriority[b.getAttribute('data-category')] || 2;
      return bPriority - aPriority;
    });
    
    // Rebuild tabs container
    tabsContainer.innerHTML = '';
    if (allTab) tabsContainer.appendChild(allTab);
    otherTabs.forEach(tab => {
      const priority = categoryPriority[tab.getAttribute('data-category')];
      if (priority === 3) tab.classList.add('high-priority');
      tabsContainer.appendChild(tab);
    });
  };

  // Reorder gallery items based on priorities
  const reorderGalleryItems = () => {
    const grid = root.querySelector('.gallery-grid');
    if (!grid) return;
    
    const items = Array.from(root.querySelectorAll('.gallery-item'));
    
    // Calculate priority scores
    items.forEach(item => {
      let score = 0;
      const category = item.getAttribute('data-category');
      
      // Category priority scores
      if (category === 'academic' && ctx.priorities?.academic === 3) score += 4;
      if (category === 'sport' && ctx.priorities?.sports === 3) score += 4;
      if (category === 'arts' && ctx.priorities?.arts === 3) score += 4;
      if (category === 'community' && ctx.priorities?.pastoral === 3) score += 4;
      
      // Activity boosts
      if (ctx.activities?.includes('sports') && category === 'sport') score += 3;
      if (ctx.activities?.includes('music') && category === 'arts') score += 3;
      if (ctx.activities?.includes('drama') && category === 'arts') score += 3;
      if (ctx.activities?.includes('leadership') && category === 'community') score += 3;
      
      // Boarding boosts
      if (ctx.boardingPreference === 'Full Boarding' && category === 'community') score += 2;
      
      item.dataset.priority = score;
    });
    
    // Sort and re-append
    items.sort((a, b) => (b.dataset.priority || 0) - (a.dataset.priority || 0));
    grid.innerHTML = '';
    items.forEach(item => grid.appendChild(item));
  };

  // Initialize category filtering
  const initializeFilters = () => {
    const tabs = root.querySelectorAll('.category-tab');
    const items = root.querySelectorAll('.gallery-item');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Update active state
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Filter items
        const category = tab.getAttribute('data-category');
        
        items.forEach(item => {
          const itemCategory = item.getAttribute('data-category');
          
          if (category === 'all' || itemCategory === category) {
            item.classList.remove('hidden');
            item.style.display = '';
          } else {
            item.classList.add('hidden');
            setTimeout(() => {
              if (item.classList.contains('hidden')) {
                item.style.display = 'none';
              }
            }, 500);
          }
        });
      });
    });
  };

  // Initialize module
  updateNames();
  addConditionalContent();
  filterByGender();
  smartCategoryOrdering();
  reorderGalleryItems();
  initializeFilters();
  
  // Lazy load images
  if (typeof hydrateLazyAssets === 'function') {
    hydrateLazyAssets(root);
  }
};