// special_programmes.i18n.dict.js (EN + zh-Hans only)
(function(){
  if (!window.PEN_I18N || typeof PEN_I18N.registerTranslations !== 'function') {
    console.warn('[special_programmes.i18n] PEN_I18N.registerTranslations not found. Load js/loader.js first.');
    return;
  }
  const R = window.PEN_I18N.registerTranslations;

  // EN (English)
  R('en', 'special_programmes', {
    welcome: {
      music_leadership: "developing your musical talents and leadership potential through diverse enrichment opportunities.",
      music: "nurturing your musical interests while developing core skills needed for academic and personal success.",
      leadership: "developing your leadership potential and broadening your horizons through challenging activities.",
      technology: "advancing your technical skills while developing research abilities and creative expression.",
      activities_high: "providing rich opportunities to explore interests and develop new talents.",
      general: "developing your talents and interests beyond the academic curriculum through enriching experiences.",
      prefix: "Discover how our special programmes will support "
    },
    music: {
      build_on: "In Music, {{childName}} will develop {{pronoun}} musical interests and confidence through ensemble performances, composition with industry-standard software, and opportunities for small recitals.",
      leadership: "In Music, {{childName}} will develop creative expression and collaborative leadership through ensemble production and performance.",
      general: "In Music, {{childName}} will develop creative expression and collaborative skills through ensemble performances and digital composition.",
      intro_interests: "Music will develop {{childName}}'s musical interests through performance, composition and collaborative opportunities.",
      his: "his",
      her: "her"
    },
    computing: {
      advance: "In Computing, {{childName}} will advance {{pronoun}} technical interests through differentiated learning that consolidates existing experience while introducing coding and computational thinking.",
      academic: "In Computing, {{childName}} will develop digital literacy and programming skills that support excellence across all subjects.",
      general: "In Computing, {{childName}} will develop digital literacy and programming skills essential for academic success and modern life.",
      intro_interests: "Computing will advance {{childName}}'s technical abilities through coding and digital innovation projects."
    },
    fpq: {
      academic_high: "In FPQ, {{childName}} will develop independent research and academic writing skills crucial for future academic success and university preparation.",
      oxbridge: "In FPQ, {{childName}} will develop research and analytical abilities highly valued by top universities, laying foundations for EPQ study.",
      general: "In FPQ, {{childName}} will develop independent research skills through personally meaningful projects, building academic confidence and preparation.",
      intro_academic: "FPQ will develop {{childName}}'s research capabilities needed for academic excellence and university success."
    },
    skills: {
      academic_high: "In Skills, {{childName}} will master study and organisational techniques for maintaining academic excellence across multiple demanding subjects.",
      general: "In Skills, {{childName}} will develop study and organisational techniques needed for academic success and effective time management.",
      intro_academic: "Skills will equip {{childName}} with advanced study techniques for maintaining academic excellence."
    },
    challenge: {
      leadership: "In Third Form Challenge, {{childName}} will demonstrate {{pronoun}} leadership potential through Dragon's Den presentations, coding challenges and collaborative activities.",
      technology: "In Third Form Challenge, {{childName}} will particularly enjoy the coding days and Dragon's Den presentations that combine technical skills with creative problem-solving.",
      sports: "In Third Form Challenge, {{childName}} will thrive in the sports development sessions including squash, rowing and cross-country activities that complement regular PE.",
      general: "In Third Form Challenge, {{childName}} will develop leadership abilities and explore new interests through rich and varied Wednesday afternoon activities.",
      intro_leadership: "Third Form Challenge will develop {{childName}}'s leadership potential through diverse and challenging activities."
    },
    floreat: {
      pastoral_high: "In Floreat, {{childName}} will develop the emotional intelligence and personal resilience needed during this critical growth stage.",
      leadership: "In Floreat, {{childName}} will develop emotional intelligence and social skills that enhance {{pronoun}} leadership potential and community engagement.",
      general: "In Floreat, {{childName}} will develop emotional intelligence and personal resilience during this crucial stage of {{pronoun}} development.",
      intro_pastoral: "Floreat will provide {{childName}} with comprehensive wellbeing support during this important developmental stage."
    },
    pronouns: {
      his: "his",
      her: "her",
      he: "he",
      she: "she"
    }
  });

  // zh-Hans (Chinese – Simplified)
  R('zh-Hans', 'special_programmes', {
    welcome: {
      music_leadership: "通过多样化的充实机会培养您的音乐才能与领导潜力。",
      music: "培养您的音乐兴趣，同时发展学术与个人成功所需的核心技能。",
      leadership: "通过富有挑战性的活动培养您的领导潜力并拓宽视野。",
      technology: "提升您的技术技能，同时培养研究能力与创造性表达。",
      activities_high: "提供丰富的机会以探索兴趣并培养新才能。",
      general: "通过充实的体验，在学术课程之外发展您的才能与兴趣。",
      prefix: "了解我们的特殊课程如何"
    },
    music: {
      build_on: "在音乐课程中，{{childName}}将通过合奏表演、使用行业标准软件进行作曲，以及小型独奏会机会来提升{{pronoun}}的音乐兴趣与自信。",
      leadership: "在音乐课程中，{{childName}}将通过合奏制作与舞台表演，培养创造性表达与协作型领导力。",
      general: "在音乐课程中，{{childName}}将通过合奏表演与数字作曲，发展创造性表达与协作能力。",
      intro_interests: "音乐将通过表演、作曲与协作机会，发展{{childName}}的音乐兴趣。",
      his: "他的",
      her: "她的"
    },
    computing: {
      advance: "在计算机课程中，{{childName}}将通过分层教学巩固既有经验，并系统引入编程与计算思维，从而推进{{pronoun}}的技术兴趣。",
      academic: "在计算机课程中，{{childName}}将发展支持各学科卓越表现的数字素养与编程技能。",
      general: "在计算机课程中，{{childName}}将培养学术成功与现代生活所需的数字素养与编程能力。",
      intro_interests: "计算机课程将通过编程与数字创新项目，提升{{childName}}的技术能力。"
    },
    fpq: {
      academic_high: "在FPQ课程中，{{childName}}将发展独立研究与学术写作能力，这对未来学业成功与大学准备至关重要。",
      oxbridge: "在FPQ课程中，{{childName}}将培养顶尖大学高度看重的研究与分析能力，并为EPQ学习奠定基础。",
      general: "在FPQ课程中，{{childName}}将围绕个人兴趣开展独立研究，提升学术自信与准备度。",
      intro_academic: "FPQ将培养{{childName}}实现学术卓越与大学成功所需的研究能力。"
    },
    skills: {
      academic_high: "在技能课程中，{{childName}}将掌握在多门高要求学科中保持学术卓越的学习与组织技巧。",
      general: "在技能课程中，{{childName}}将培养学业成功与高效时间管理所需的学习与组织能力。",
      intro_academic: "技能课程将为{{childName}}提供保持学术卓越的高级学习技巧。"
    },
    challenge: {
      leadership: "在三年级挑战课程中，{{childName}}将通过“龙穴”演讲、编程挑战与协作活动展现{{pronoun}}的领导潜力。",
      technology: "在三年级挑战课程中，{{childName}}将尤其喜爱兼具技术技能与创造性解题的编程日与“龙穴”演讲。",
      sports: "在三年级挑战课程中，{{childName}}将在壁球、赛艇与越野等运动发展环节中成长，这些活动与常规体育课程相得益彰。",
      general: "在三年级挑战课程中，{{childName}}将通过丰富多样的周三下午活动培养领导能力并探索新兴趣。",
      intro_leadership: "三年级挑战课程将通过多样且具挑战性的活动，培养{{childName}}的领导潜力。"
    },
    floreat: {
      pastoral_high: "在Floreat课程中，{{childName}}将培养在关键成长阶段所需的情绪智力与个人韧性。",
      leadership: "在Floreat课程中，{{childName}}将培养有助于提升{{pronoun}}领导潜力与社区参与度的情商与社交技能。",
      general: "在Floreat课程中，{{childName}}将在{{pronoun}}的重要发展阶段培养情商与个人韧性。",
      intro_pastoral: "Floreat课程将在这一重要发展阶段为{{childName}}提供全面的身心健康支持。"
    },
    pronouns: {
      his: "他的",
      her: "她的",
      he: "他",
      she: "她"
    }
  });
})();
