
(function(){
  if (!window.PEN_I18N || typeof PEN_I18N.registerTranslations !== 'function') {
    console.warn('[pastoral_care.i18n] PEN_I18N.registerTranslations not found. Load js/loader.js first.');
    return;
  }
  const R = window.PEN_I18N.registerTranslations;

  // ============================================
  // ENGLISH TRANSLATIONS (ADD THIS SECTION!)
  // ============================================
  R('en', 'pastoral_care', {
    placeholders: {
      your_child: "your child"
    },
    priority: {
      wellbeing_title: "Wellbeing at the Heart of {{childName}}'s Experience",
      wellbeing_message: "I'm delighted you value pastoral care so highly. Our comprehensive support system ensures {{childName}}'s wellbeing is at the heart of everything we do.",
      boarding_title: "A Home Away From Home for {{childName}}",
      boarding_message: "As a boarding family, you'll be reassured knowing our Housemasters and Housemistresses live on-site with their own families, creating a true home environment.",
      comprehensive_title: "Comprehensive Care for {{childName}}",
      comprehensive_message: "Every pupil's wellbeing journey is unique. Our multi-layered pastoral care system ensures {{childName}} receives exactly the right support at every stage."
    },
    conditional: {
      boarding_note: "As a full boarding pupil, {{childName}} will experience the richness and warmth of our residential community life.",
      academic_note: "With {{childName}}'s interest in Sciences, your Tutor will provide specialist academic guidance and support.",
      wellbeing_note: "Given your family's focus on wellbeing, you'll appreciate our Floreat programme's emphasis on mental health and resilience.",
      health_note: "With {{childName}}'s sporting interests, our Health Centre provides specialist sports injury support and performance guidance.",
      leadership_note: "{{childName}}'s leadership interests align perfectly with our peer mentoring and House leadership opportunities.",
      learning_note: "Given your high academic priorities, our Learning Support team will ensure {{childName}} has every opportunity to excel and reach full potential."
    },
    commitment: {
      main: "Cheltenham College's comprehensive pastoral care system ensures {{childName}} receives individual attention, support, and guidance to flourish academically, socially, and personally.",
      pastoral_boarding: "With dedicated House staff living on-site and our innovative Floreat programme, we create a nurturing environment where wellbeing is paramount."
    },
    journey: {
      step1: "In {{childName}}'s first weeks, their Housemaster/Housemistress and Tutor will work closely together to ensure a smooth transition.",
      step2: "{{childName}} will participate in House activities, be paired with an older mentor, and build trust with their Tutor through regular check-ins.",
      step3: "Through the Floreat programme, {{childName}} will develop resilience, learn stress management techniques, and take on leadership roles.",
      step4: "As {{childName}} progresses, they'll become a mentor to younger pupils themselves and be fully prepared for Upper College and beyond."
    }
  });

  // ============================================
  // EXISTING CHINESE TRANSLATIONS 
  // ============================================

  // zh-Hans (Chinese Simplified)
  R('zh-Hans', 'pastoral_care', {
    placeholders: {
      your_child: "您的孩子"
    },
    priority: {
      wellbeing_title: "{{childName}}的福祉是我们的首要任务",
      wellbeing_message: "我很高兴您如此重视牧养关怀。我们全面的支持系统确保{{childName}}的福祉是我们所做一切的核心。",
      boarding_title: "为{{childName}}提供的寄宿家庭支持",
      boarding_message: "作为寄宿家庭，您会放心地知道我们的宿舍长与他们自己的家人一起住在校园里。",
      comprehensive_title: "为{{childName}}提供的全面牧养支持",
      comprehensive_message: "每个学生的福祉之旅都是独特的。我们多层次的牧养关怀系统确保{{childName}}获得恰到好处的支持。"
    },
    conditional: {
      boarding_note: "作为全日制寄宿学生，{{childName}}将体验我们住宿社区生活的丰富性。",
      academic_note: "凭借{{childName}}对科学的兴趣，您的导师将提供专业的学术指导。",
      wellbeing_note: "鉴于您家庭对福祉的关注，您会欣赏我们Floreat计划对心理健康的重视。",
      health_note: "凭借{{childName}}的体育兴趣，我们的健康中心提供专业的运动损伤支持。",
      leadership_note: "{{childName}}的领导力兴趣与我们的同伴辅导计划完美契合。",
      learning_note: "鉴于您对学术的高度重视，我们的学习支持团队将确保{{childName}}有各种机会脱颖而出。"
    },
    commitment: {
      main: "切尔滕纳姆学院全面的牧养关怀系统确保{{childName}}获得个性化的关注、支持和指导，在学业、社交和个人方面蓬勃发展。",
      pastoral_boarding: "有专职的宿舍员工住在校园里和我们创新的Floreat计划，我们创造了一个培养环境，福祉至上。"
    },
    journey: {
      step1: "在{{childName}}的最初几周，他们的宿舍长和导师将密切合作，确保顺利过渡。",
      step2: "{{childName}}将参加宿舍活动，与年长的导师配对，并通过定期检查与他们的导师建立信任。",
      step3: "通过Floreat计划，{{childName}}将培养韧性，学习压力管理技巧，并承担领导角色。",
      step4: "随着{{childName}}的进步，他们将成为年幼学生的导师，并为高年级及以后做好充分准备。"
    }
  });
})();
