(function(){
  if (!window.PEN_I18N || typeof PEN_I18N.registerTranslations !== 'function') {
    console.warn('[languages_classics.i18n] PEN_I18N.registerTranslations not found. Load js/loader.js first.');
    return;
  }
  const R = window.PEN_I18N.registerTranslations;

  // EN (English) - ADDED
  R('en', 'languages_classics', {
    header: {
      language_enthusiast: "Perfect for {{childName}} - Language Enthusiast",
      language_enthusiast_content: "With your passion for languages, {{childName}} will thrive in our comprehensive language programmes. From modern European languages to classical studies, these subjects align perfectly with your academic interests and provide excellent preparation for {{aspiration}}.",
      classical_scholar: "Perfect for {{childName}} - Classical Scholar",
      classical_scholar_content: "Your interest in classics makes these subjects ideal for {{childName}}. Our world-class Classics department with six specialist teachers in a historic setting provides unparalleled preparation for {{aspiration}}.",
      humanities_choice: "An Excellent Choice for {{childName}}",
      humanities_content: "Languages and classical studies complement humanities perfectly, developing critical thinking, cultural awareness, and communication skills. These subjects provide excellent preparation for {{aspiration}}.",
      discover_horizons: "Discover New Horizons for {{childName}}",
      discover_content: "Even without prior language experience, {{childName}} can discover a passion for global communication and cultural understanding through our exceptional language and classics programmes.",
      oxbridge: "Oxbridge applications",
      competitive_apps: "competitive university applications",
      university_success: "university success",
      top_universities: "top universities"
    },
    subjects: {
      french: {
        perfect_match: "Perfect Match for {{childName}}",
        language_leadership: "Language Leadership:",
        language_leadership_text: "{{childName}}'s interest in {{activities}}languages makes French ideal for developing the global communication skills essential for international careers and {{aspiration}}.",
        cultural_engagement: "Cultural Engagement:",
        cultural_engagement_text: "Individual Research Projects allow {{childName}} to explore personal interests while developing advanced speaking skills valued by top universities.",
        leadership_and: "leadership and "
      },
      german: {
        academic_excellence: "Academic Excellence for {{childName}}",
        rigorous_approach: "Rigorous Academic Approach:",
        rigorous_text: "German's systematic grammar structure appeals to analytical minds and develops precision in thinking - providing excellent preparation for {{aspiration}}.",
        leadership_skills: "Leadership Skills:",
        leadership_text: "Cultural understanding and communication skills developed through German learning enhance {{childName}}'s leadership potential in international contexts."
      },
      spanish: {
        global_perspective: "Global Perspective for {{childName}}",
        worlds_second: "World's Second Language:",
        worlds_second_text: "Spanish opens doors to communication with over 500 million people globally - perfect for {{childName}}'s international aspirations and {{aspiration}}.",
        community_engagement: "Community Engagement:",
        community_text: "Understanding Hispanic cultures enhances {{childName}}'s community service perspective and cultural sensitivity."
      },
      latin: {
        classical_excellence: "Classical Excellence for {{childName}}",
        oxbridge_prep: "Oxbridge Preparation:",
        oxbridge_prep_text: "Latin develops linguistic precision, analytical thinking, and cultural literacy highly valued for {{aspiration}}. Recent graduates have achieved places at both universities.",
        foundation_skills: "Foundation Skills:",
        foundation_text: "Latin's logical structure enhances {{childName}}'s analytical capabilities and provides excellent preparation for Law, Medicine, and academic careers."
      },
      greek: {
        philosophical_foundations: "Philosophical Foundations for {{childName}}",
        academic_distinction: "Academic Distinction:",
        academic_distinction_text: "Classical Greek provides access to original philosophical and literary works, developing sophisticated analytical skills perfect for {{aspiration}}.",
        unique_advantage: "Unique Advantage:",
        unique_advantage_text: "Few students study Greek, making {{childName}} stand out in university applications with this distinctive subject combination."
      },
      classical_civ: {
        humanities_excellence: "Humanities Excellence for {{childName}}",
        perfect_combination: "Perfect Subject Combination:",
        perfect_combination_text: "Classical Civilisation complements {{interests}} perfectly, requiring no prior knowledge but developing sophisticated analysis and essay-writing skills.",
        university_success: "University Success:",
        university_success_text: "83% of recent graduates achieved Russell Group places, providing excellent preparation for {{aspiration}}.",
        humanities_interests: "humanities interests",
        academic_studies: "academic studies",
        oxbridge_classics: "Oxbridge applications in Classics, History or related fields",
        diverse_courses: "diverse university courses"
      },
      eal: {
        university_prep: "University Preparation for {{childName}}",
        academic_english: "Academic English Excellence:",
        academic_english_text: "EAL support ensures {{childName}} develops university-level English skills essential for A Level success and {{aspiration}}.",
        integrated_support: "Integrated Support:",
        integrated_support_text: "Individual tuition available to help {{childName}} excel across all chosen subjects while building confidence in academic English."
      }
    },
    navigation: {
      options_title: "{{childName}}'s Language & Classics Options"
    },
    university: {
      oxbridge_title: "Oxbridge Success & Global Opportunities for {{childName}}",
      oxbridge_content: "Languages and classics provide exceptional preparation for Oxford and Cambridge applications. {{childName}} will develop the analytical thinking, cultural knowledge, and communication skills that admissions tutors value highly. Recent students have achieved places at both universities across diverse subjects.",
      russell_title: "Russell Group Success & Professional Excellence for {{childName}}",
      russell_content: "With 83% of classics students achieving Russell Group places, {{childName}} will be excellently prepared for top university applications. Language competence and classical knowledge provide valuable differentiation in competitive admissions processes."
    },
    boarding: {
      life_enhancement: "Boarding Life Enhancement for {{childName}}",
      immersive_learning: "Immersive Learning:",
      immersive_text: "Boarding students benefit from Modern Languages Society activities, Classics Society gatherings, and peer study groups. {{childName}} will engage with international students, enhancing cultural understanding and language practice opportunities."
    },
    cta: {
      experience_excellence: "Experience Language Excellence with {{childName}}",
      experience_subtitle: "Book your personalised visit to discover how {{childName}} can thrive in our world-class language and classics programmes. Tour our facilities, meet our teachers, and explore the opportunities that await.",
      discover_opportunities: "Discover Global Opportunities for {{childName}}",
      discover_subtitle: "Book your personalised visit to see how languages and classics can open new horizons for {{childName}}. Explore our exceptional facilities and meet our passionate teaching staff."
    }
  });


  // zh-Hans (Chinese Simplified)
  R('zh-Hans', 'languages_classics', {
    header: {
      language_enthusiast: "非常适合{{childName}} - 语言爱好者",
      language_enthusiast_content: "凭借您对语言的热情，{{childName}}将在我们全面的语言课程中茁壮成长。从现代欧洲语言到古典研究，这些学科与您的学术兴趣完美契合，并为{{aspiration}}提供出色的准备。",
      classical_scholar: "非常适合{{childName}} - 古典学者",
      classical_scholar_content: "您对古典学的兴趣使这些学科成为{{childName}}的理想选择。我们世界级的古典研究系拥有六位在历史环境中的专业教师，为{{aspiration}}提供无与伦比的准备。",
      humanities_choice: "{{childName}}的绝佳选择",
      humanities_content: "语言和古典研究与人文学科完美互补，培养批判性思维、文化意识和沟通技能。这些学科为{{aspiration}}提供出色的准备。",
      discover_horizons: "为{{childName}}发现新视野",
      discover_content: "即使没有先前的语言经验，{{childName}}也可以通过我们卓越的语言和古典课程发现对全球交流和文化理解的热情。",
      oxbridge: "牛津剑桥申请",
      competitive_apps: "竞争性大学申请",
      university_success: "大学成功",
      top_universities: "顶尖大学"
    },
    subjects: {
      french: {
        perfect_match: "{{childName}}的完美匹配",
        language_leadership: "语言领导力：",
        language_leadership_text: "{{childName}}对{{activities}}语言的兴趣使法语成为培养国际职业和{{aspiration}}所必需的全球交流技能的理想选择。",
        cultural_engagement: "文化参与：",
        cultural_engagement_text: "个人研究项目允许{{childName}}探索个人兴趣，同时培养顶尖大学重视的高级演讲技能。",
        leadership_and: "领导力和"
      },
      german: {
        academic_excellence: "{{childName}}的学术卓越",
        rigorous_approach: "严格的学术方法：",
        rigorous_text: "德语的系统语法结构吸引分析型思维并培养思维的精确性 - 为{{aspiration}}提供出色的准备。",
        leadership_skills: "领导技能：",
        leadership_text: "通过德语学习培养的文化理解和沟通技能增强了{{childName}}在国际背景下的领导潜力。"
      },
      spanish: {
        global_perspective: "{{childName}}的全球视角",
        worlds_second: "世界第二语言：",
        worlds_second_text: "西班牙语为全球超过5亿人的交流打开大门 - 非常适合{{childName}}的国际抱负和{{aspiration}}。",
        community_engagement: "社区参与：",
        community_text: "理解西班牙裔文化增强了{{childName}}的社区服务视角和文化敏感性。"
      },
      latin: {
        classical_excellence: "{{childName}}的古典卓越",
        oxbridge_prep: "牛津剑桥准备：",
        oxbridge_prep_text: "拉丁语培养{{aspiration}}高度重视的语言精确性、分析思维和文化素养。近期毕业生已在这两所大学获得录取。",
        foundation_skills: "基础技能：",
        foundation_text: "拉丁语的逻辑结构增强了{{childName}}的分析能力，并为法律、医学和学术职业提供出色的准备。"
      },
      greek: {
        philosophical_foundations: "{{childName}}的哲学基础",
        academic_distinction: "学术特色：",
        academic_distinction_text: "古典希腊语提供了对原始哲学和文学作品的访问，培养了非常适合{{aspiration}}的复杂分析技能。",
        unique_advantage: "独特优势：",
        unique_advantage_text: "很少有学生学习希腊语，使{{childName}}在大学申请中以这种独特的学科组合脱颖而出。"
      },
      classical_civ: {
        humanities_excellence: "{{childName}}的人文卓越",
        perfect_combination: "完美的学科组合：",
        perfect_combination_text: "古典文明与{{interests}}完美互补，不需要先验知识但培养复杂的分析和论文写作技能。",
        university_success: "大学成功：",
        university_success_text: "83%的近期毕业生获得罗素集团录取，为{{aspiration}}提供出色的准备。",
        humanities_interests: "人文兴趣",
        academic_studies: "学术研究",
        oxbridge_classics: "牛津剑桥古典学、历史或相关领域的申请",
        diverse_courses: "多样化的大学课程"
      },
      eal: {
        university_prep: "{{childName}}的大学准备",
        academic_english: "学术英语卓越：",
        academic_english_text: "EAL支持确保{{childName}}培养A Level学科成功和{{aspiration}}所必需的大学水平英语技能。",
        integrated_support: "综合支持：",
        integrated_support_text: "提供个人辅导，帮助{{childName}}在所有选择的学科中取得优异成绩，同时建立学术英语的信心。"
      }
    },
    navigation: {
      options_title: "{{childName}}的语言和古典学选项"
    },
    university: {
      oxbridge_title: "{{childName}}的牛津剑桥成功和全球机遇",
      oxbridge_content: "语言和古典学为牛津和剑桥申请提供卓越的准备。{{childName}}将培养招生导师高度重视的分析思维、文化知识和沟通技能。近期学生已在这两所大学的多个学科获得录取。",
      russell_title: "{{childName}}的罗素集团成功和职业卓越",
      russell_content: "83%的古典学学生获得罗素集团录取，{{childName}}将为顶尖大学申请做好充分准备。语言能力和古典知识在竞争性招生过程中提供有价值的差异化。"
    },
    boarding: {
      life_enhancement: "{{childName}}的寄宿生活提升",
      immersive_learning: "沉浸式学习：",
      immersive_text: "寄宿学生受益于现代语言学会活动、古典学会聚会和同伴学习小组。{{childName}}将与国际学生互动，增强文化理解和语言练习机会。"
    },
    cta: {
      experience_excellence: "与{{childName}}体验语言卓越",
      experience_subtitle: "预订您的个性化参观，了解{{childName}}如何在我们世界级的语言和古典课程中茁壮成长。参观我们的设施，会见我们的老师，并探索等待的机会。",
      discover_opportunities: "为{{childName}}发现全球机遇",
      discover_subtitle: "预订您的个性化参观，看看语言和古典学如何为{{childName}}开辟新视野。探索我们卓越的设施并会见我们充满热情的教师。"
    }
  });
})();