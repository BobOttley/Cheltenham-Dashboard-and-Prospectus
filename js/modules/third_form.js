MODULES['third_form'] = (root, ctx) => {
  // Translation function
  const t = (window.PEN_I18N && typeof window.PEN_I18N.t === 'function')
    ? window.PEN_I18N.t
    : () => '';

  // Helper to get child name with fallback
  const getChildName = () => {
    const name = (ctx.childName || '').trim();
    const fallback = t('third_form.placeholders.your_child');
    return name && !name.startsWith('[') ? name : fallback;
  };

  // Get gender-appropriate pronouns
  const getPronoun = (type = 'possessive') => {
    const gender = ctx.childGender || ctx.gender || 'male';
    const pronouns = {
      possessive: gender === 'female' ? 'her' : 'his',
      subject: gender === 'female' ? 'she' : 'he',
      object: gender === 'female' ? 'her' : 'him',
      subjectCap: gender === 'female' ? 'She' : 'He'
    };
    return pronouns[type] || pronouns.possessive;
  };

  // Update all name placeholders
  root.querySelectorAll('.child-name').forEach(el => {
    const fallback = el.getAttribute('data-fallback') || t('third_form.placeholders.your_child');
    const name = getChildName();
    el.textContent = name !== fallback ? name : fallback;
  });

  root.querySelectorAll('.parent-name').forEach(el => {
    el.textContent = ctx.parentName || t('third_form.placeholders.parent_name') || '[Parent Name]';
  });

  // ====== PERSONALIZED WELCOME MESSAGE ======
  const personalizedMessage = root.querySelector('.personalized-message');
  if (personalizedMessage) {
    const childName = getChildName();
    let message = `We're excited to show ${childName} how Third Form will `;
    
    // Prioritize based on academic interests and priorities
    if (ctx.academicInterests?.includes('sciences') && ctx.priorities?.academic === 3) {
      message += `provide the rigorous scientific foundation essential for ${getPronoun('possessive')} university aspirations, with dedicated Biology, Chemistry, and Physics teaching from specialist teachers.`;
    } else if (ctx.academicInterests?.includes('mathematics') && ctx.priorities?.academic === 3) {
      message += `challenge ${getPronoun('object')} mathematically through our top-set programme, potentially leading to early IGCSE entry in Fourth Form.`;
    } else if (ctx.academicInterests?.includes('humanities')) {
      message += `develop ${getPronoun('possessive')} analytical and communication skills through our comprehensive Humanities programme.`;
    } else if (ctx.activities?.includes('leadership')) {
      message += `develop ${getPronoun('possessive')} leadership potential through our Challenge programme and opportunities for peer mentoring.`;
    } else if (ctx.activities?.includes('arts') || ctx.academicInterests?.includes('arts')) {
      message += `nurture ${getPronoun('possessive')} creative expression across Art, Music, Design Technology, and Drama.`;
    } else if (ctx.activities?.includes('sports')) {
      message += `provide a balanced academic and sporting programme with Games on Tuesday, Thursday, and Saturday, plus extensive activities.`;
    } else if (ctx.priorities?.academic === 3) {
      message += `provide the perfect foundation for ${getPronoun('possessive')} academic and personal development with rigorous preparation for IGCSE and GCSE studies.`;
    } else {
      message += `provide the perfect foundation for ${getPronoun('possessive')} academic and personal development at Cheltenham College.`;
    }
    
    personalizedMessage.textContent = message;
  }

  // ====== ACADEMIC STRUCTURE PERSONALIZATION ======
  const academicIntro = root.querySelector('.section-card.academic .personalized-section-message');
  if (academicIntro) {
    const childName = getChildName();
    let intro = '';
    
    if (ctx.academicInterests?.includes('sciences') && ctx.academicInterests?.includes('mathematics')) {
      intro = `With ${getPronoun('possessive')} strong interests in both sciences and mathematics, ${childName} will particularly benefit from our separate science teaching and ability-set system in Maths.`;
    } else if (ctx.academicInterests?.includes('sciences')) {
      intro = `${childName}'s interest in sciences means ${getPronoun('subject')} will especially enjoy our dedicated Biology, Chemistry, and Physics lessons with specialist teachers.`;
    } else if (ctx.academicInterests?.includes('mathematics')) {
      intro = `With ${getPronoun('possessive')} mathematical aptitude, ${childName} will thrive in our ability-set system, with potential for early IGCSE entry.`;
    } else if (ctx.academicInterests?.includes('humanities')) {
      intro = `${childName}'s interest in humanities will be well-served by our form-based teaching in English, Geography, History, and TPE.`;
    } else if (ctx.priorities?.academic === 3) {
      intro = `With ${childName}'s high academic priorities, you'll find Third Form's broad curriculum particularly engaging as it provides the foundation for future specialisation.`;
    } else {
      intro = `With ${getPronoun('possessive')} interests in mind, ${childName} will find Third Form's broad curriculum particularly engaging as it provides the foundation for future specialisation.`;
    }
    
    academicIntro.textContent = intro;
  }

  // ====== SHOW/HIDE PERSONALIZED PATHWAYS ======
  const pathwayVisibility = {
    '.sciences-pathway': ctx.academicInterests?.includes('sciences') || false,
    '.mathematics-pathway': ctx.academicInterests?.includes('mathematics') || (ctx.priorities?.academic === 3 && !ctx.academicInterests?.includes('humanities')),
    '.leadership-pathway': ctx.activities?.includes('leadership') || false,
    '.university-pathway': ctx.universityAspirations === 'Oxford or Cambridge' || ctx.universityAspirations === 'Russell Group' || false
  };

  Object.entries(pathwayVisibility).forEach(([selector, shouldShow]) => {
    const el = root.querySelector(selector);
    if (el) {
      el.style.display = shouldShow ? 'block' : 'none';
    }
  });

  // ====== PERSONALIZE PATHWAY CONTENT ======
  const childName = getChildName();
  
  // Sciences pathway
  const sciencesPathway = root.querySelector('.sciences-pathway p');
  if (sciencesPathway) {
    sciencesPathway.innerHTML = `${childName} will thrive in our dedicated Science sets across Biology, Chemistry, and Physics. With three separate teachers specializing in each subject, ${getPronoun('subject')} will develop the deep understanding needed for A-Level success and university applications in STEM fields.`;
  }

  // Mathematics pathway
  const mathPathway = root.querySelector('.mathematics-pathway p');
  if (mathPathway) {
    if (ctx.priorities?.academic === 3 && ctx.academicInterests?.includes('mathematics')) {
      mathPathway.innerHTML = `With strong mathematical aptitude, placement in Set 1 Mathematics means ${childName} could be working toward taking IGCSE Mathematics at the end of Fourth Form, typically achieving Grade 9 before progressing to Additional Mathematics in Fifth Form.`;
    } else {
      mathPathway.innerHTML = `${childName}'s mathematical ability will be carefully assessed, with placement in the most appropriate set to ensure ${getPronoun('subject')} receives optimal challenge and support.`;
    }
  }

  // Leadership pathway
  const leadershipPathway = root.querySelector('.leadership-pathway p');
  if (leadershipPathway) {
    leadershipPathway.innerHTML = `${childName}'s interest in leadership will be naturally developed through our setting system. High-achieving students in top sets often become peer mentors, helping classmates and taking on presentation responsibilities that build confidence and communication skills.`;
  }

  // University pathway
  const universityPathway = root.querySelector('.university-pathway');
  if (universityPathway) {
    const pathwayParagraph = universityPathway.querySelector('p');
    if (pathwayParagraph) {
      if (ctx.universityAspirations === 'Oxford or Cambridge') {
        universityPathway.querySelector('h5').textContent = 'Oxbridge Preparation';
        pathwayParagraph.innerHTML = `With Oxbridge aspirations, the setting system ensures ${childName} receives the rigorous academic challenge needed for highly competitive applications. Top sets maintain the exceptional pace and depth required for A* grades at A-Level and beyond.`;
      } else if (ctx.universityAspirations === 'Russell Group') {
        universityPathway.querySelector('h5').textContent = 'Russell Group Preparation';
        pathwayParagraph.innerHTML = `With Russell Group aspirations, the setting system ensures ${childName} receives the rigorous academic challenge needed for competitive university applications. Top sets maintain the pace and depth required for A*-A grades at A-Level.`;
      }
    }
  }

  // ====== PERSONALIZED FORM EXPERIENCE ======
  const formExperience = root.querySelector('.personalized-form-experience p');
  if (formExperience) {
    let experience = `In ${getPronoun('possessive')} form group, ${childName} will `;
    
    if (ctx.activities?.includes('leadership') || ctx.activities?.includes('debate')) {
      experience += `excel in collaborative projects, discussions, and presentations that develop the communication skills valued by top universities. The consistent group dynamic allows for taking on informal leadership roles and building confidence in expressing ideas.`;
    } else if (ctx.academicInterests?.includes('humanities')) {
      experience += `engage in collaborative projects, discussions, and presentations about English, Geography, History, and TPE that develop analytical thinking and communication skills.`;
    } else {
      experience += `engage in collaborative projects, discussions, and presentations that develop the communication skills valued by universities. The consistent group dynamic allows for building confidence in expressing ideas.`;
    }
    
    formExperience.textContent = experience;
  }

  // ====== TWO-LANGUAGE PROGRAMME HIGHLIGHTS ======
  const languagesHighlight = root.querySelector('.languages-highlight');
  if (languagesHighlight) {
    if (ctx.academicInterests?.includes('languages') || ctx.activities?.includes('languages')) {
      languagesHighlight.style.display = 'block';
      const highlightP = languagesHighlight.querySelector('p');
      if (highlightP) {
        highlightP.textContent = `${childName}'s interest in languages will be well-served by our comprehensive two-language programme. With German, French, and Spanish all available, ${getPronoun('subject')} will gain cultural awareness and communication skills valued by employers and universities worldwide.`;
      }
    } else {
      if (languagesHighlight) languagesHighlight.style.display = 'none';
    }
  }

  // ====== PASTORAL SUPPORT PERSONALIZATION ======
  const pastoralIntro = root.querySelector('.section-card.pastoral .personalized-section-message');
  if (pastoralIntro) {
    pastoralIntro.textContent = `Our comprehensive pastoral care system, including ${getPronoun('possessive')} dedicated Tutor and the Floreat wellbeing programme, ensures ${childName} receives the personal support needed to thrive academically and personally.`;
  }

  // ====== CHALLENGE PROGRAMME PERSONALIZATION ======
  const challengeIntro = root.querySelector('.section-card.challenge .personalized-section-message');
  if (challengeIntro) {
    let challengeMsg = '';
    
    if (ctx.activities?.includes('leadership')) {
      challengeMsg = `The Challenge programme offers perfect opportunities for ${childName} to develop leadership skills through Dragons' Den presentations, team activities, and public speaking modules.`;
    } else if (ctx.activities?.includes('sports')) {
      challengeMsg = `The Challenge programme's diverse sporting activities including Squash, Rowing, swimming galas, and cross-country events will complement ${childName}'s sporting interests perfectly.`;
    } else if (ctx.academicInterests?.includes('technology') || ctx.activities?.includes('technology')) {
      challengeMsg = `The Challenge programme includes a Coding Day run by experts, plus Dragons' Den presentations - perfect for developing ${childName}'s entrepreneurial and technical skills.`;
    } else {
      challengeMsg = `The Challenge programme offers ${childName} diverse experiences from athletic development to leadership skills and entrepreneurial thinking through Dragons' Den presentations.`;
    }
    
    challengeIntro.textContent = challengeMsg;
  }

  // ====== SUBJECT-SPECIFIC HIGHLIGHTS ======
  // Show/hide based on interests
  const highlightVisibility = {
    '.mathematics-highlight': ctx.academicInterests?.includes('mathematics') || false,
    '.sports-highlight': ctx.activities?.includes('sports') || false,
    '.leadership-highlight': ctx.activities?.includes('leadership') || false,
    '.business-highlight': ctx.academicInterests?.includes('business') || ctx.academicInterests?.includes('economics') || false
  };

  Object.entries(highlightVisibility).forEach(([selector, shouldShow]) => {
    const el = root.querySelector(selector);
    if (el) {
      el.style.display = shouldShow ? 'block' : 'none';
    }
  });

  // Personalize mathematics highlight
  const mathHighlight = root.querySelector('.mathematics-highlight p');
  if (mathHighlight && ctx.academicInterests?.includes('mathematics')) {
    mathHighlight.textContent = `With ${childName}'s mathematical aptitude, placement in Set 1 Maths could lead to sitting IGCSE at the end of Fourth Form, typically achieving Grade 9, before progressing to Additional Mathematics in Fifth Form - perfect preparation for A-Level Mathematics and Further Mathematics.`;
  }

  // Personalize sports highlight
  const sportsHighlight = root.querySelector('.sports-highlight p');
  if (sportsHighlight && ctx.activities?.includes('sports')) {
    sportsHighlight.textContent = `The Challenge programme includes diverse sporting opportunities including Squash and Rowing, plus swimming galas and cross-country events that will complement ${childName}'s sporting interests and develop ${getPronoun('possessive')} athletic abilities further.`;
  }

  // Personalize leadership highlight
  const leadershipHighlight = root.querySelector('.leadership-highlight p');
  if (leadershipHighlight && ctx.activities?.includes('leadership')) {
    leadershipHighlight.textContent = `This programme specifically develops the leadership qualities ${childName} is interested in, with structured modules in public speaking, presentation skills, and team leadership - all highly valued by universities and employers.`;
  }

  // ====== LEARNING SUPPORT PERSONALIZATION ======
  const supportIntro = root.querySelector('.section-card.support .personalized-section-message');
  if (supportIntro) {
    if (ctx.priorities?.academic === 3) {
      supportIntro.textContent = `Our support programmes, including the Foundation Project Qualification and Skills Programme, ensure ${childName} develops the sophisticated research and study skills needed to achieve ${getPronoun('possessive')} full academic potential.`;
    } else {
      supportIntro.textContent = `Our support programmes ensure ${childName} achieves ${getPronoun('possessive')} full academic potential while developing essential research and study skills through the FPQ and Skills Programme.`;
    }
  }

  // ====== GCSE PREPARATION PERSONALIZATION ======
  const preparationIntro = root.querySelector('.section-card.preparation .personalized-section-message');
  if (preparationIntro) {
    if (ctx.universityAspirations === 'Oxford or Cambridge') {
      preparationIntro.textContent = `Third Form begins ${childName}'s journey toward Oxbridge, with early career reflection, strategic GCSE planning, and development of the independent learning skills essential for success at the most competitive universities.`;
    } else if (ctx.universityAspirations === 'Russell Group') {
      preparationIntro.textContent = `Third Form begins ${childName}'s journey toward Russell Group success, with early career reflection and strategic planning for ${getPronoun('possessive')} academic future.`;
    } else {
      preparationIntro.textContent = `Third Form begins ${childName}'s journey toward university success, with early career reflection and strategic planning for ${getPronoun('possessive')} academic future.`;
    }
  }

  // ====== NAVIGATION FUNCTIONALITY (Keep existing) ======
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

  // ====== COLLAPSIBLE SUBSECTIONS (Keep existing) ======
  const subsectionTitles = root.querySelectorAll('.subsection-title');
  
  subsectionTitles.forEach(title => {
    title.addEventListener('click', function() {
      const subsection = this.closest('.subsection');
      if (subsection) {
        subsection.classList.toggle('collapsed');
      }
    });
  });

  // ====== PRIORITY HIGHLIGHTING ======
  // Add visual priority indicators to relevant sections
  if (ctx.priorities?.academic === 3) {
    root.querySelector('.section-card.academic')?.classList.add('priority-high');
  }
  
  if (ctx.activities?.includes('leadership')) {
    root.querySelector('.section-card.challenge')?.classList.add('priority-high');
  }

  // ====== LAZY LOAD IMAGES (Keep existing) ======
  if (typeof hydrateLazyAssets === 'function') {
    hydrateLazyAssets(root);
  }

  // Log personalization for debugging
  console.log('Third Form Personalization Applied:', {
    childName: getChildName(),
    interests: ctx.academicInterests,
    activities: ctx.activities,
    priorities: ctx.priorities,
    university: ctx.universityAspirations
  });
};