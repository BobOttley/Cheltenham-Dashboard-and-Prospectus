(function(){
  if (!window.PEN_I18N || typeof PEN_I18N.registerTranslations !== 'function') {
    console.warn('[hero.i18n] PEN_I18N.registerTranslations not found. Load js/loader.js first.');
    return;
  }
  const R = window.PEN_I18N.registerTranslations;

  // English (default)
  R('en', 'hero', {
    ui: {
      click_to_unmute: "CLICK TO UNMUTE",
      click_to_mute: "CLICK TO MUTE"
    },
    notes: {
      academic_sciences: "I understand {{childName}}'s interest in Sciences - our laboratories are university-standard, our Science departments have an exceptional track record, and many of our pupils go on to read Medicine, Engineering and Natural Sciences at top universities.",
      academic_mathematics: "For students like {{childName}} with an interest in Mathematics, our setting from day one and enrichment opportunities including UKMT challenges provide the perfect environment for excellence.",
      academic_languages: "{{childName}}'s interest in languages will flourish here with our offering of French, Spanish, German and Mandarin, plus regular exchanges and immersive trips.",
      academic_humanities: "Our Humanities departments will be perfect for {{childName}} - from the Morley History Society to Geography field trips, we bring these subjects alive.",
      academic_arts: "{{childName}}'s creative interests align perfectly with our exceptional Arts department and dedicated studio spaces.",
      sport_interest: "I see {{childName}} is interested in sport - we offer 30+ sports and are coached by professionals including Olympians and internationals, with every pupil finding their passion.",
      pastoral_high_priority: "I'm particularly pleased that you value pastoral care so highly - through our Floreat wellbeing programme, dedicated House staff living on campus, and 1:8 tutor ratios, {{childName}}'s wellbeing will always be our priority.",
      pastoral_boarding: "As a boarding family, you'll be reassured knowing our House staff live on campus with their families, creating a true home from home."
    }
  });

  // zh-Hans (Chinese Simplified)
  R('zh-Hans', 'hero', {
    ui: {
      click_to_unmute: "点击取消静音",
      click_to_mute: "点击静音"
    },
    notes: {
      academic_sciences: "我了解{{childName}}对科学的兴趣——我们的实验室设备达到大学标准，我们的科学系有着卓越的成绩记录，许多学生继续在顶尖大学攻读医学、工程和自然科学。",
      academic_mathematics: "对于像{{childName}}这样对数学感兴趣的学生，我们从第一天开始的分层教学和包括UKMT挑战在内的拓展机会提供了卓越的完美环境。",
      academic_languages: "{{childName}}对语言的兴趣将在这里蓬勃发展，我们提供法语、西班牙语、德语和普通话，加上定期的交流和沉浸式旅行。",
      academic_humanities: "我们的人文学科系将非常适合{{childName}}——从莫利历史学会到地理实地考察，我们让这些学科生动起来。",
      academic_arts: "{{childName}}的创造性兴趣与我们卓越的艺术系和专用工作室空间完美契合。",
      sport_interest: "我看到{{childName}}对体育感兴趣——我们提供超过30项体育运动，并由包括奥运选手和国际选手在内的专业人士执教，每个学生都能找到自己的热情所在。",
      pastoral_high_priority: "我特别高兴您如此重视牧养关怀——通过我们的Floreat福祉计划、住在校园的专职宿舍员工以及1:8的导师比例，{{childName}}的福祉将永远是我们的首要任务。",
      pastoral_boarding: "作为寄宿家庭，您会放心地知道我们的宿舍员工与他们的家人一起住在校园里，营造真正的家外之家。"
    }
  });
})();