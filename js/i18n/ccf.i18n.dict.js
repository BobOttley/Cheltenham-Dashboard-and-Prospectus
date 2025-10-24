(function(){
  if (!window.PEN_I18N || typeof PEN_I18N.registerTranslations !== 'function') {
    console.warn('[applied_vocational.i18n] PEN_I18N.registerTranslations not found. Load js/loader.js first.');
    return;
  }
  const R = window.PEN_I18N.registerTranslations;

  // English (default)
  R('en', 'applied_vocational', {
    placeholders: {
      child_name: "[Child's Name]",
      university: "university"
    },
    welcome: {
      discover_prefix: "Discover how our applied learning programmes prepare",
      discover_suffix: "for",
      leadership_pathway: "professional leadership success and business excellence.",
      sports_science_pathway: "sports science excellence and performance analysis careers.",
      technology_pathway: "technological innovation and computational thinking success.",
      russell_group_pathway: "Russell Group university success through applied learning excellence.",
      default_pathway: "professional success and university excellence through practical skill development."
    },
    personalization: {
      business_intro: "Perfect for {{childName}}'s leadership interests - a dynamic programme exploring global organizations. Ideal foundation for business-related undergraduate study and {{university}} applications.",
      cs_intro: "Suited to {{childName}}'s technology interests - developing analytical thinking and problem-solving through computational thinking, modelling, analysis and implementing innovative coding solutions.",
      sports_intro: "Perfect for {{childName}}'s sporting interests - deeper understanding of human performance, applying scientific theory to optimize health and athletic excellence."
    },
    navigation: {
      subjects_filter: "Subjects for {{childName}} - Filter by Interest"
    }
  });

  // zh-Hans (Chinese Simplified)
  R('zh-Hans', 'applied_vocational', {
    placeholders: {
      child_name: "[孩子姓名]",
      university: "大学"
    },
    welcome: {
      discover_prefix: "了解我们的应用学习课程如何为",
      discover_suffix: "做好准备",
      leadership_pathway: "专业领导力成功和商业卓越。",
      sports_science_pathway: "运动科学卓越和绩效分析职业。",
      technology_pathway: "技术创新和计算思维成功。",
      russell_group_pathway: "通过应用学习卓越获得罗素集团大学成功。",
      default_pathway: "通过实用技能培养实现专业成功和大学卓越。"
    },
    personalization: {
      business_intro: "{{childName}} 的领导力兴趣的理想选择 - 探索全球组织的充满活力的课程。为商业相关的本科学习和 {{university}} 申请打下完美基础。",
      cs_intro: "适合 {{childName}} 的技术兴趣 - 通过计算思维、建模、分析和实施创新编码解决方案来培养分析思维和解决问题的能力。",
      sports_intro: "适合 {{childName}} 的运动兴趣 - 更深入地理解人体表现，应用科学理论优化健康和运动卓越。"
    },
    navigation: {
      subjects_filter: "{{childName}} 的科目 - 按兴趣筛选"
    }
  });
})();