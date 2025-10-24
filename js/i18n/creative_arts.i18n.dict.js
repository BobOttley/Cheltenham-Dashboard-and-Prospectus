(function(){
  if (!window.PEN_I18N || typeof PEN_I18N.registerTranslations !== 'function') {
    console.warn('[creative_arts.i18n] PEN_I18N.registerTranslations not found. Load js/loader.js first.');
    return;
  }
  const R = window.PEN_I18N.registerTranslations;

  // English (default)
  R('en', 'creative_arts', {
    placeholders: {
      child_name: "[Child's Name]"
    },
    welcome: {
      discover_prefix: "Explore how our creative programmes nurture",
      discover_suffix: "'s artistic talents and prepare for",
      theatre_music_both: "{{childName}} for excellence in both Drama and Music through our professional-standard facilities.",
      drama_oxbridge: "{{childName}} for Oxbridge success through rigorous creative training and analytical skills development.",
      music_excellence: "{{childName}} for musical excellence through world-class performance opportunities at our All-Steinway School.",
      arts_humanities: "{{childName}} for university success by combining creative expression with critical thinking and cultural analysis.",
      oxbridge_apps: "{{childName}} for Oxbridge applications through creative programmes that develop the analytical thinking and cultural knowledge sought by top universities.",
      drama_success: "{{childName}} for drama success through professional theatre training and performance opportunities.",
      music_achievement: "{{childName}} for musical achievement through exceptional facilities and expert teaching.",
      arts_success: "{{childName}} for creative success through comprehensive arts education and professional preparation.",
      default: "{{childName}} for creative success and university excellence through exceptional arts education."
    },
    personalized_cards: {
      drama_leadership_title: "Leadership Through Drama for {{childName}}",
      drama_leadership_text: "Drama naturally develops leadership skills through directing, devising theatre, and collaborative creation. {{childName}} will have opportunities to lead College productions, direct scenes, and mentor younger students - essential experience for university applications and future career success.",
      drama_oxbridge_title: "Oxbridge Drama Preparation for {{childName}}",
      drama_oxbridge_text: "Our Drama A Level provides excellent preparation for Oxbridge applications. {{childName}} will develop the analytical thinking, cultural knowledge, and creative expression that Cambridge and Oxford seek in their most competitive applicants.",
      music_oxbridge_title: "Oxbridge Musical Excellence for {{childName}}",
      music_oxbridge_text: "Our Music programmes provide rigorous preparation for Oxbridge music degrees. {{childName}} will develop the analytical skills, cultural knowledge, and performance excellence sought by Cambridge and Oxford music departments.",
      music_activities_title: "Perfect for {{childName}}'s Activities Priority",
      music_activities_text: "With high priority in activities, {{childName}} will thrive in our All-Steinway School environment. Perform using world-class instruments, in prestigious venues, and participate in international opportunities including the Montpellier Jazz Festival.",
      art_humanities_title: "Arts & Humanities Synergy for {{childName}}",
      art_humanities_text: "Art A Level perfectly complements Humanities subjects, developing visual analysis skills and cultural understanding. {{childName}} will explore historical contexts, philosophical themes, and social commentary through creative practice.",
      history_art_academic_title: "Academic Rigor for {{childName}}",
      history_art_academic_text: "History of Art offers exceptional academic challenge, developing critical analysis, research skills, and cultural literacy. {{childName}} will engage with complex philosophical and historical concepts while building analytical writing skills essential for university success."
    },
    subject_intros: {
      art_intro: "A vibrant and passionate department where {{childName}} will develop a lifelong love of visual expression. Choose between Fine Art and 3D Design pathways, suited to students who enjoy individual voice and creative thinking.",
      drama_leadership_intro: "Perfect for {{childName}}'s leadership interests - inspiring students to become independent theatre-makers with skills necessary for higher education and beyond. Emphasis on practical creativity alongside research and theoretical understanding through experience.",
      music_intro: "Suited to {{childName}}'s musical interests - relevant and modern qualification offering opportunities to study wide-ranging musical genres. From Hans Zimmer to Renaissance music - continually updated to remain current, taught in 'All-Steinway School' facilities."
    },
    navigation: {
      creative_subjects_for: "Creative Subjects for {{childName}}"
    },
    university_content: {
      oxbridge_title: "Oxbridge Creative Excellence for {{childName}}",
      oxbridge_text: "Our creative A Levels provide excellent preparation for Oxford and Cambridge applications. {{childName}} will develop the analytical thinking, cultural knowledge, and creative expression sought by top universities, with specialist support for portfolio development and university interviews."
    }
  });

  // zh-Hans (Chinese Simplified)
  R('zh-Hans', 'creative_arts', {
    placeholders: {
      child_name: "[孩子姓名]"
    },
    welcome: {
      discover_prefix: "探索我们的创意课程如何培养",
      discover_suffix: "的艺术才能并做好准备",
      theatre_music_both: "{{childName}} 通过我们的专业标准设施在戏剧和音乐方面取得卓越成就。",
      drama_oxbridge: "{{childName}} 通过严格的创意培训和分析技能培养获得牛津剑桥成功。",
      music_excellence: "{{childName}} 在我们的全施坦威学校通过世界级表演机会取得音乐卓越。",
      arts_humanities: "{{childName}} 通过将创意表达与批判性思维和文化分析相结合,为大学成功做好准备。",
      oxbridge_apps: "{{childName}} 通过培养顶尖大学所寻求的分析思维和文化知识的创意课程为牛津剑桥申请做好准备。",
      drama_success: "{{childName}} 通过专业戏剧培训和表演机会获得戏剧成功。",
      music_achievement: "{{childName}} 通过卓越的设施和专家教学取得音乐成就。",
      arts_success: "{{childName}} 通过全面的艺术教育和专业准备取得创意成功。",
      default: "{{childName}} 通过卓越的艺术教育取得创意成功和大学卓越。"
    },
    personalized_cards: {
      drama_leadership_title: "{{childName}} 通过戏剧实现领导力",
      drama_leadership_text: "戏剧通过导演、设计戏剧和合作创作自然培养领导技能。{{childName}} 将有机会领导学院制作、导演场景并指导年轻学生 - 这是大学申请和未来职业成功的重要经验。",
      drama_oxbridge_title: "{{childName}} 的牛津剑桥戏剧准备",
      drama_oxbridge_text: "我们的戏剧 A Level 为牛津剑桥申请提供卓越的准备。{{childName}} 将培养剑桥和牛津在其最具竞争力的申请者中寻求的分析思维、文化知识和创意表达。",
      music_oxbridge_title: "{{childName}} 的牛津剑桥音乐卓越",
      music_oxbridge_text: "我们的音乐课程为牛津剑桥音乐学位提供严格的准备。{{childName}} 将培养剑桥和牛津音乐系所寻求的分析技能、文化知识和表演卓越。",
      music_activities_title: "完美适合 {{childName}} 的活动优先级",
      music_activities_text: "在活动方面具有高优先级,{{childName}} 将在我们的全施坦威学校环境中茁壮成长。使用世界级乐器,在高端场馆演出,并参加包括蒙彼利埃爵士音乐节在内的国际机会。",
      art_humanities_title: "{{childName}} 的艺术与人文协同作用",
      art_humanities_text: "艺术 A Level 完美补充人文学科,培养视觉分析技能和文化理解。{{childName}} 将通过创意实践探索历史背景、哲学主题和社会评论。",
      history_art_academic_title: "{{childName}} 的学术严谨性",
      history_art_academic_text: "艺术史提供卓越的学术挑战,培养批判性分析、研究技能和文化素养。{{childName}} 将参与复杂的哲学和历史概念,同时建立大学成功所必需的分析写作技能。"
    },
    subject_intros: {
      art_intro: "充满活力和激情的系部,{{childName}} 将在这里培养对视觉表达的终生热爱。在纯艺术和3D设计课程之间选择,适合享受个人声音和创意思维的学生。",
      drama_leadership_intro: "完美适合 {{childName}} 的领导力兴趣 - 激励学生成为独立的戏剧制作者,具备高等教育及以后所需的技能。强调实践创造力以及通过体验进行的研究和理论理解。",
      music_intro: "适合 {{childName}} 的音乐兴趣 - 相关且现代的资格证书,提供学习广泛音乐流派的机会。从汉斯·季默到文艺复兴音乐 - 持续更新与时俱进,在'全施坦威学校'设施中授课。"
    },
    navigation: {
      creative_subjects_for: "{{childName}} 的创意科目"
    },
    university_content: {
      oxbridge_title: "{{childName}} 的牛津剑桥创意卓越",
      oxbridge_text: "我们的创意 A Level 为牛津和剑桥申请提供卓越的准备。{{childName}} 将培养顶尖大学所寻求的分析思维、文化知识和创意表达,并获得作品集开发和大学面试的专门支持。"
    }
  });
})();