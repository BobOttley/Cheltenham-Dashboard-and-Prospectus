(function(){
  if (!window.PEN_I18N || typeof PEN_I18N.registerTranslations !== 'function') {
    console.warn('[humanities_social.i18n] PEN_I18N.registerTranslations not found. Load js/loader.js first.');
    return;
  }
  const R = window.PEN_I18N.registerTranslations;

  // English (default)
  R('en', 'humanities_social', {
    welcome: {
      oxbridge: "Discover how our rigorous Humanities and Social Sciences programmes develop the critical thinking and analytical writing skills essential for Oxbridge success.",
      general: "Explore our Humanities and Social Sciences programmes designed to develop your critical thinking and prepare you for university excellence.",
      debate: "Discover how our Humanities programmes enhance your communication and analytical skills through engagement with complex ideas and perspectives.",
      academic: "Discover how our Humanities and Social Sciences programmes develop the critical thinking skills valued by universities and employers.",
      default: "Explore our Humanities and Social Sciences programmes that develop analytical thinking and prepare you for university success."
    },
    hero: {
      subtitle_humanities: "Perfect for students passionate about literature, history, and understanding human society. These subjects develop analytical and communication skills that open doors to prestigious universities and diverse career paths."
    },
    recommendations: {
      prefix: "Recommended for {{childName}}:",
      english: "Your interest in literature and creative writing makes English Literature an ideal choice for developing analytical and creative skills.",
      history: "Your interests align perfectly with History, developing research skills and analytical thinking valued by universities.",
      geography: "Geography combines your interests with essential skills in data analysis and environmental understanding.",
      economics: "Economics is a perfect match for your interests and provides valuable analytical skills for careers in business and finance.",
      politics: "Your leadership activities and interest in current affairs make Politics an excellent choice for developing understanding of governance and society.",
      psychology: "Your interest in understanding human behaviour makes Psychology ideal for developing scientific analysis of the mind and behaviour."
    },
    epq: {
      oxbridge_title: "Oxbridge Preparation",
      oxbridge_essential: "Essential for {{childName}}:",
      oxbridge_text: "The EPQ demonstrates the independent research skills and academic initiative highly valued by Cambridge and Oxford admissions tutors. Many successful Oxbridge candidates credit their EPQ as key preparation for university-level study."
    },
    combinations: {
      perfect_for: "Perfect for {{childName}}",
      recommended_for: "Recommended for {{childName}}",
      oxbridge_strategy: "Oxbridge Strategy for {{childName}}",
      tailored_for: "Tailored for {{childName}}",
      english_history: "English Literature + History: Your combined interests make this an ideal combination for Law, English, or Classics degrees.",
      english_history_detail: "Both subjects develop the analytical writing and critical thinking skills most valued by universities.",
      geography_economics: "Geography + Economics: Perfect for your interest in understanding global systems and economic patterns.",
      geography_economics_detail: "Excellent preparation for careers in international development, environmental consultancy, or urban planning.",
      oxbridge_combo: "Your subject combination + EPQ: Focus on achieving A*A*A plus EPQ to meet Oxbridge requirements.",
      oxbridge_combo_detail: "Choose subjects you're passionate about - Oxford and Cambridge value genuine intellectual curiosity over strategic subject choices.",
      general_combo: "Your interests + EPQ: Any three Humanities/Social Sciences subjects provide excellent preparation for university study.",
      general_combo_detail: "The EPQ will develop the independent research skills essential for degree-level success."
    },
    activities: {
      perfect_match: "Perfect Match with Your Activities",
      experience_foundation: "{{childName}}'s {{activity}} experience",
      provides_foundation: "provides an excellent foundation for {{connection}}",
      drama_english: "understanding character development and literary analysis through performance experience.",
      debate_history: "developing argumentation and evidence evaluation skills essential for historical analysis.",
      dof_geography: "applying geographical knowledge through practical fieldwork and environmental awareness.",
      student_politics: "understanding democratic processes and governance through practical leadership experience.",
      mentoring_psychology: "applying understanding of human behaviour and development in supporting others."
    },
    stats: {
      oxbridge_requirements: "Oxbridge Requirements (A*A*A + EPQ)"
    },
    welcome_card: {
      discover: "Discover how our Humanities and Social Sciences programmes will develop your critical thinking and prepare you for university success.",
      oxbridge_designed: "Specially designed to meet Oxbridge entry requirements",
      proven_track: "Proven track record of university success"
    }
  });

  // zh-Hans (Chinese Simplified)
  R('zh-Hans', 'humanities_social', {
    welcome: {
      oxbridge: "了解我们严格的人文和社会科学课程如何培养牛津剑桥成功所必需的批判性思维和分析性写作技能。",
      general: "探索我们旨在培养您的批判性思维并为大学卓越成就做好准备的人文和社会科学课程。",
      debate: "了解我们的人文课程如何通过接触复杂的思想和观点来增强您的沟通和分析技能。",
      academic: "了解我们的人文和社会科学课程如何培养大学和雇主所重视的批判性思维技能。",
      default: "探索我们培养分析思维并为大学成功做好准备的人文和社会科学课程。"
    },
    hero: {
      subtitle_humanities: "非常适合热衷于文学、历史和理解人类社会的学生。这些学科培养分析和沟通技能，为进入名校和多元化职业道路打开大门。"
    },
    recommendations: {
      prefix: "为{{childName}}推荐：",
      english: "您对文学和创意写作的兴趣使英国文学成为培养分析和创造性技能的理想选择。",
      history: "您的兴趣与历史完美契合，培养大学重视的研究技能和分析思维。",
      geography: "地理学将您的兴趣与数据分析和环境理解的基本技能相结合。",
      economics: "经济学完美契合您的兴趣，并为商业和金融职业提供宝贵的分析技能。",
      politics: "您的领导力活动和对时事的兴趣使政治学成为培养对治理和社会理解的绝佳选择。",
      psychology: "您对理解人类行为的兴趣使心理学成为培养对思维和行为进行科学分析的理想选择。"
    },
    epq: {
      oxbridge_title: "牛津剑桥准备",
      oxbridge_essential: "对{{childName}}至关重要：",
      oxbridge_text: "EPQ展示了剑桥和牛津招生导师高度重视的独立研究技能和学术主动性。许多成功的牛津剑桥候选人将他们的EPQ称为大学水平学习的关键准备。"
    },
    combinations: {
      perfect_for: "非常适合{{childName}}",
      recommended_for: "为{{childName}}推荐",
      oxbridge_strategy: "{{childName}}的牛津剑桥策略",
      tailored_for: "为{{childName}}量身定制",
      english_history: "英国文学 + 历史：您的综合兴趣使这成为法律、英语或古典研究学位的理想组合。",
      english_history_detail: "这两门学科都培养大学最重视的分析性写作和批判性思维技能。",
      geography_economics: "地理 + 经济学：非常适合您对理解全球系统和经济模式的兴趣。",
      geography_economics_detail: "为国际发展、环境咨询或城市规划职业做好充分准备。",
      oxbridge_combo: "您的学科组合 + EPQ：专注于获得A*A*A加EPQ以满足牛津剑桥要求。",
      oxbridge_combo_detail: "选择您热衷的学科 - 牛津和剑桥重视真正的智力好奇心，而不是战略性学科选择。",
      general_combo: "您的兴趣 + EPQ：任何三门人文/社会科学学科都为大学学习提供出色的准备。",
      general_combo_detail: "EPQ将培养学位水平成功所必需的独立研究技能。"
    },
    activities: {
      perfect_match: "与您的活动完美契合",
      experience_foundation: "{{childName}}的{{activity}}经验",
      provides_foundation: "为{{connection}}提供了出色的基础",
      drama_english: "通过表演经验理解角色发展和文学分析。",
      debate_history: "培养历史分析所必需的论证和证据评估技能。",
      dof_geography: "通过实际实地考察和环境意识应用地理知识。",
      student_politics: "通过实际领导经验理解民主进程和治理。",
      mentoring_psychology: "在支持他人时应用对人类行为和发展的理解。"
    },
    stats: {
      oxbridge_requirements: "牛津剑桥要求（A*A*A + EPQ）"
    },
    welcome_card: {
      discover: "了解我们的人文和社会科学课程如何培养您的批判性思维并为大学成功做好准备。",
      oxbridge_designed: "专为满足牛津剑桥入学要求而设计",
      proven_track: "经证实的大学成功记录"
    }
  });
})();