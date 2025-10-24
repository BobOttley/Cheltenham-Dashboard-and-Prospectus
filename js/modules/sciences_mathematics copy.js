/* Sciences & Mathematics Module Initializer - Add this to the MODULES object in app.js */
MODULES['sciences_mathematics'] = (root, ctx) => {
  // Update name placeholders
  const updateNames = () => {
    root.querySelectorAll('.child-name').forEach(el => {
      el.textContent = ctx.childName || '[Child\'s Name]';
    });
  };

  // Customize welcome message based on STEM interests
  const customizeWelcome = () => {
    const welcomeText = root.querySelector('.sm-welcome-text');
    if (!welcomeText) return;
    
    const childName = ctx.childName || '[Child\'s Name]';
    let message = `Discover how our rigorous STEM programmes will develop ${childName}'s analytical thinking and prepare `;
    
    if (ctx.academicInterests?.includes('sciences') && ctx.academicInterests?.includes('mathematics')) {
      message += `${childName} for excellence in both sciences and mathematics, providing the perfect foundation for ${ctx.universityAspirations === 'Oxford or Cambridge' ? 'Oxbridge success' : 'competitive university entry'}.`;
    } else if (ctx.academicInterests?.includes('mathematics')) {
      message += `${childName} for mathematical excellence and logical reasoning essential for ${ctx.universityAspirations === 'Oxford or Cambridge' ? 'Oxbridge applications' : 'university success'}.`;
    } else if (ctx.academicInterests?.includes('sciences')) {
      message += `${childName} for scientific excellence through experimental investigation and analytical thinking valued by top universities.`;
    } else if (ctx.universityAspirations === 'Oxford or Cambridge') {
      message += `${childName} for Oxbridge success through the analytical and problem-solving skills that Cambridge and Oxford seek in their applicants.`;
    } else {
      message += `${childName} for university success through analytical thinking and scientific literacy essential for modern careers.`;
    }
    
    welcomeText.textContent = message;
  };

  // Prioritize subjects based on interests and activities
  const prioritizeSubjects = () => {
    const navButtons = root.querySelectorAll('.sm-nav-btn');
    const cards = root.querySelectorAll('.sm-card');
    
    // Mathematics prioritization
    if (ctx.academicInterests?.includes('mathematics')) {
      navButtons.forEach(btn => {
        const filter = btn.getAttribute('data-filter');
        if (filter === 'mathematics' || filter === 'further-mathematics') {
          btn.classList.add('priority-high');
        }
      });
      cards.forEach(card => {
        const subject = card.getAttribute('data-subject');
        if (subject === 'mathematics' || subject === 'further-mathematics') {
          card.classList.add('priority-match');
          addPersonalizedContent(card, ctx, subject);
        }
      });
    }
    
    // Sciences prioritization
    if (ctx.academicInterests?.includes('sciences')) {
      navButtons.forEach(btn => {
        const filter = btn.getAttribute('data-filter');
        if (filter === 'physics' || filter === 'chemistry' || filter === 'biology') {
          btn.classList.add('priority-high');
        }
      });
      cards.forEach(card => {
        const subject = card.getAttribute('data-subject');
        if (subject === 'physics' || subject === 'chemistry' || subject === 'biology') {
          card.classList.add('priority-match');
          addPersonalizedContent(card, ctx, subject);
        }
      });
    }
    
    // Technology/Computer Science prioritization
    if (ctx.activities?.includes('technology')) {
      navButtons.forEach(btn => {
        if (btn.getAttribute('data-filter') === 'computer-science') {
          btn.classList.add('priority-high');
        }
      });
      cards.forEach(card => {
        if (card.getAttribute('data-subject') === 'computer-science') {
          card.classList.add('priority-match');
          addPersonalizedContent(card, ctx, 'computer-science');
        }
      });
    }
  };

  // Add personalized content to specific subject cards
  const addPersonalizedContent = (card, ctx, subject) => {
    const cardContent = card.querySelector('.sm-card-content');
    if (!cardContent) return;

    // Remove existing personalized content
    const existingPersonalized = cardContent.querySelector('.sm-personalized-content');
    if (existingPersonalized) {
      existingPersonalized.remove();
    }

    // Create new personalized section
    const personalizedSection = document.createElement('div');
    personalizedSection.className = 'sm-personalized-content';
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

    if (subject === 'mathematics' && ctx.universityAspirations === 'Oxford or Cambridge') {
      content = `<h4 style="color: #c9a961; margin-bottom: 1rem;">Oxbridge Mathematics for ${childName}</h4>
      <p>Mathematics A Level is highly desirable for most Oxbridge courses and essential for many STEM subjects. ${childName} will develop the logical reasoning and analytical skills that Cambridge and Oxford value in their applicants, providing excellent preparation for competitive applications.</p>`;
    } else if (subject === 'mathematics' && ctx.academicInterests?.includes('mathematics')) {
      content = `<h4 style="color: #c9a961; margin-bottom: 1rem;">Perfect Match for ${childName}</h4>
      <p>Mathematics aligns perfectly with ${childName}'s academic interests. This subject will develop the logical reasoning and problem-solving skills essential for ${ctx.universityAspirations === 'Russell Group' ? 'Russell Group success' : 'competitive university entry'} and future STEM careers.</p>`;
    } else if (subject === 'further-mathematics' && ctx.universityAspirations === 'Oxford or Cambridge') {
      content = `<h4 style="color: #c9a961; margin-bottom: 1rem;">Highly Recommended for ${childName}</h4>
      <p>Given ${childName}'s Oxbridge aspirations, Further Mathematics is strongly recommended. This advanced subject provides crucial preparation for Cambridge Mathematics and significant advantages for Oxford applications, demonstrating mathematical excellence to admissions tutors.</p>`;
    } else if (subject === 'physics' && ctx.academicInterests?.includes('sciences')) {
      content = `<h4 style="color: #c9a961; margin-bottom: 1rem;">Excellent Choice for ${childName}</h4>
      <p>Physics aligns perfectly with ${childName}'s scientific interests, developing analytical thinking and experimental skills highly valued by ${ctx.universityAspirations === 'Oxford or Cambridge' ? 'Oxbridge' : 'top universities'}. Essential for engineering and physical sciences pathways.</p>`;
    } else if (subject === 'chemistry' && ctx.academicInterests?.includes('sciences')) {
      content = `<h4 style="color: #c9a961; margin-bottom: 1rem;">Ideal for ${childName}</h4>
      <p>Chemistry perfectly matches ${childName}'s scientific interests. This central science connects biological and physical worlds, opening doors to medicine, research, and cutting-edge technological careers while providing excellent ${ctx.universityAspirations === 'Oxford or Cambridge' ? 'Oxbridge' : 'university'} preparation.</p>`;
    } else if (subject === 'biology' && ctx.academicInterests?.includes('sciences')) {
      content = `<h4 style="color: #c9a961; margin-bottom: 1rem;">Perfect for ${childName}</h4>
      <p>Biology aligns beautifully with ${childName}'s scientific interests, developing investigative and analytical skills essential for medical and biological sciences. Excellent preparation for ${ctx.universityAspirations === 'Oxford or Cambridge' ? 'competitive Oxbridge applications' : 'university success'} in healthcare and research.</p>`;
    } else if (subject === 'computer-science' && ctx.activities?.includes('technology')) {
      content = `<h4 style="color: #c9a961; margin-bottom: 1rem;">Great Match for ${childName}</h4>
      <p>Given ${childName}'s interest in technology, Computer Science offers an exciting pathway to develop computational thinking and programming skills increasingly valued across all industries, perfect for the digital economy.</p>`;
    }

    if (content) {
      personalizedSection.innerHTML = content;
      cardContent.insertBefore(personalizedSection, cardContent.firstChild);
    }
  };

  // Personalize subject introductions
  const personalizeContent = () => {
    const childName = ctx.childName || '[Child\'s Name]';
    
    // Update Mathematics intro if it's a priority subject
    if (ctx.academicInterests?.includes('mathematics')) {
      const mathsIntro = root.querySelector('[data-subject="mathematics"] .sm-subject-intro');
      if (mathsIntro) {
        mathsIntro.textContent = `Excellent choice, ${childName}! Mathematics is the foundation of scientific thinking and modern technology. This subject will develop the logical reasoning and problem-solving skills needed for ${ctx.universityAspirations === 'Oxford or Cambridge' ? 'Oxbridge success' : 'competitive university entry'}.`;
      }
    }

    // Update sciences intros if relevant
    if (ctx.academicInterests?.includes('sciences')) {
      const physicsIntro = root.querySelector('[data-subject="physics"] .sm-subject-intro');
      if (physicsIntro) {
        physicsIntro.textContent = `Perfect for ${childName}'s scientific interests! Physics develops analytical thinking and experimental skills essential for understanding the physical world, providing excellent preparation for ${ctx.universityAspirations === 'Oxford or Cambridge' ? 'Oxbridge' : 'competitive university'} applications in science and engineering.`;
      }

      const chemistryIntro = root.querySelector('[data-subject="chemistry"] .sm-subject-intro');
      if (chemistryIntro) {
        chemistryIntro.textContent = `Excellent choice, ${childName}! Chemistry is the central science that will satisfy scientific curiosity while developing analytical and practical skills needed for ${ctx.universityAspirations === 'Oxford or Cambridge' ? 'competitive Oxbridge applications' : 'success at top universities'}.`;
      }

      const biologyIntro = root.querySelector('[data-subject="biology"] .sm-subject-intro');
      if (biologyIntro) {
        biologyIntro.textContent = `Excellent match for ${childName}'s scientific interests! Biology develops understanding of life sciences while building analytical and investigative skills needed for ${ctx.universityAspirations === 'Oxford or Cambridge' ? 'Oxbridge success' : 'competitive university applications'}.`;
      }
    }

    // Update Computer Science if technology interest
    if (ctx.activities?.includes('technology')) {
      const csIntro = root.querySelector('[data-subject="computer-science"] .sm-subject-intro');
      if (csIntro) {
        csIntro.textContent = `Perfect for ${childName}'s technology interests! Computer Science will develop computational thinking and programming abilities, preparing for the rapidly evolving digital economy and modern technological careers.`;
      }
    }
  };

  // Customize navigation title
  const customizeNavigation = () => {
    const navTitle = root.querySelector('.sm-nav-title');
    if (navTitle && ctx.childName) {
      if (ctx.academicInterests?.includes('sciences') && ctx.academicInterests?.includes('mathematics')) {
        navTitle.textContent = `${ctx.childName}'s STEM Pathway - Select Subjects`;
      } else if (ctx.academicInterests?.includes('mathematics')) {
        navTitle.textContent = `Mathematics & Related Subjects for ${ctx.childName}`;
      } else if (ctx.academicInterests?.includes('sciences')) {
        navTitle.textContent = `Science Subjects for ${ctx.childName}`;
      } else {
        navTitle.textContent = `STEM Subjects for ${ctx.childName}`;
      }
    }
  };

  // Customize hero subtitle and stats
  const customizeHeroContent = () => {
    const subtitle = root.querySelector('.sm-hero-subtitle');
    if (subtitle) {
      if (ctx.academicInterests?.includes('sciences') && ctx.academicInterests?.includes('mathematics')) {
        subtitle.textContent = `Excellence in STEM Education • Perfect preparation for ${ctx.childName}'s scientific aspirations • Pathway to ${ctx.universityAspirations === 'Oxford or Cambridge' ? 'Oxbridge' : 'Leading Universities'}`;
      } else if (ctx.universityAspirations === 'Oxford or Cambridge') {
        subtitle.textContent = `Excellence in STEM Education • Oxbridge Preparation • Pathway to Cambridge and Oxford Success`;
      }
    }

    // Update stats based on aspirations
    const stats = root.querySelectorAll('.sm-stat');
    if (ctx.universityAspirations === 'Oxford or Cambridge') {
      stats.forEach(stat => {
        const label = stat.querySelector('.sm-stat-label');
        if (label && label.textContent.includes('Oxbridge Requirements')) {
          const number = stat.querySelector('.sm-stat-number');
          if (number) number.textContent = 'A*A*A';
        }
      });
    } else if (ctx.universityAspirations === 'Russell Group') {
      stats.forEach(stat => {
        const label = stat.querySelector('.sm-stat-label');
        if (label && label.textContent.includes('Oxbridge Requirements')) {
          const number = stat.querySelector('.sm-stat-number');
          if (number) number.textContent = 'A*AA';
          label.textContent = 'Russell Group Entry';
        }
      });
    }
  };

  // Add university-specific content
  const addUniversityContent = () => {
    if (ctx.universityAspirations === 'Oxford or Cambridge') {
      const universitySection = root.querySelector('.sm-university-section');
      if (universitySection && !universitySection.querySelector('.sm-oxbridge-note')) {
        const oxbridgeNote = document.createElement('div');
        oxbridgeNote.className = 'sm-oxbridge-note';
        oxbridgeNote.style.cssText = `
          background: rgba(201, 169, 97, 0.15);
          border-radius: 12px;
          padding: 1.5rem;
          margin-top: 1.5rem;
          text-align: center;
        `;
        const childName = ctx.childName || '[Child\'s Name]';
        oxbridgeNote.innerHTML = `
          <h4 style="color: #92400e; margin-bottom: 1rem; font-size: 1.2rem;">Oxbridge STEM Excellence for ${childName}</h4>
          <p style="color: #78350f;">Our STEM programmes provide exceptional preparation for Oxford and Cambridge applications. ${childName} will develop the analytical thinking, problem-solving skills, and academic rigor that top universities seek, with dedicated support for competitive applications and interviews.</p>
        `;
        universitySection.appendChild(oxbridgeNote);
      }
    }
  };

  // Setup navigation filtering
  const setupNavigation = () => {
    const navButtons = root.querySelectorAll('.sm-nav-btn');
    const cards = root.querySelectorAll('.sm-card');
    
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
    const sectionTitles = root.querySelectorAll('.sm-section-title');
    sectionTitles.forEach(title => {
      title.addEventListener('click', function() {
        const section = this.parentElement;
        section.classList.toggle('collapsed');
      });
    });

    // Add interactivity to stats
    const stats = root.querySelectorAll('.sm-stat');
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
  customizeHeroContent();
  addUniversityContent();
  setupNavigation();
};