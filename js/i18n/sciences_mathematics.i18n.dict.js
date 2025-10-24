(function(){
  if (!window.PEN_I18N || typeof PEN_I18N.registerTranslations !== 'function') {
    console.warn('[sciences_mathematics.i18n] PEN_I18N.registerTranslations not found. Load js/loader.js first.');
    return;
  }
  const R = window.PEN_I18N.registerTranslations;

  // EN (English)
  R('en', 'sciences_mathematics', {
    welcome: {
      stem_both: "achieving excellence in both science and mathematics, providing the perfect foundation for {{aspiration}}.",
      mathematics: "mathematical excellence and logical reasoning, essential for {{aspiration}}.",
      sciences: "scientific excellence through experimental investigation and analytical thinking valued by top universities.",
      oxbridge: "Oxbridge success through the analytical and problem-solving skills that Cambridge and Oxford look for in their applicants.",
      general: "university success through analytical thinking and scientific literacy essential for modern careers.",
      prefix: "Discover how our rigorous STEM curriculum develops {{childName}}'s analytical thinking and prepares {{childName}} for ",
      oxbridge_success: "Oxbridge success",
      competitive_entry: "competitive university entry",
      oxbridge_apps: "Oxbridge applications",
      university_success: "university success"
    },
    personalized: {
      oxbridge_maths_title: "Oxbridge Mathematics for {{childName}}",
      oxbridge_maths_text: "Mathematics A Level is highly desirable for most Oxbridge courses and essential for many STEM subjects. {{childName}} will develop the logical reasoning and analytical skills that Cambridge and Oxford value in their applicants, providing excellent preparation for competitive applications.",
      perfect_match: "Perfect Match for {{childName}}",
      maths_match_text: "Mathematics aligns perfectly with {{childName}}'s academic interests. This subject will develop logical reasoning and problem-solving skills essential for {{aspiration}} and future STEM careers.",
      highly_recommended: "Highly Recommended for {{childName}}",
      further_maths_text: "Given {{childName}}'s Oxbridge aspirations, Further Mathematics is strongly recommended. This advanced subject provides crucial preparation for Cambridge Mathematics and significant advantage for Oxford applications, demonstrating mathematical excellence to admissions tutors.",
      excellent_choice: "Excellent Choice for {{childName}}",
      physics_text: "Physics aligns perfectly with {{childName}}'s science interests, developing analytical thinking and experimental skills highly valued for {{aspiration}}. Essential for Engineering and Physical Sciences pathways.",
      ideal_for: "Ideal for {{childName}}",
      chemistry_text: "Chemistry is a perfect match for {{childName}}'s science interests. This central science connects the biological and physical worlds, opening doors to Medicine, Research, and cutting-edge technology careers while providing excellent preparation for {{aspiration}}.",
      perfect_for: "Perfect for {{childName}}",
      biology_text: "Biology aligns perfectly with {{childName}}'s science interests, developing investigative and analytical skills essential for Medicine and Biological Sciences. Provides excellent preparation for {{aspiration}}.",
      great_match: "Great Match for {{childName}}",
      cs_text: "Given {{childName}}'s interest in technology, Computer Science offers an exciting pathway to develop computational thinking and programming skills increasingly valued across all industries, perfect for the digital economy.",
      russell_success: "Russell Group success",
      oxbridge_short: "Oxbridge",
      top_universities: "top universities",
      university_short: "university",
      competitive_oxbridge: "competitive Oxbridge applications",
      university_success_short: "university success"
    },
    intros: {
      maths_choice: "Excellent choice, {{childName}}! Mathematics is the foundation of scientific thinking and modern technology. This subject will develop the logical reasoning and problem-solving skills required for {{aspiration}}.",
      physics_perfect: "Perfect for {{childName}}'s science interests! Physics develops analytical thinking and experimental skills essential for understanding the physical world, providing excellent preparation for {{aspiration}} applications in Science and Engineering.",
      chemistry_excellent: "Excellent choice, {{childName}}! Chemistry is the central science that will satisfy scientific curiosity while developing analytical and practical skills needed for {{aspiration}}.",
      biology_match: "Perfect match for {{childName}}'s science interests! Biology develops understanding of life sciences while building analytical and investigative skills needed for {{aspiration}}.",
      cs_perfect: "Perfect for {{childName}}'s technology interests! Computer Science will develop computational thinking and programming abilities, preparing for the rapidly evolving digital economy and modern technology careers.",
      oxbridge_success: "Oxbridge success",
      competitive_entry: "competitive university entry",
      competitive_university: "competitive university",
      competitive_oxbridge_apps: "competitive Oxbridge applications",
      oxbridge_short: "Oxbridge",
      top_universities: "top universities",
      oxbridge_success_full: "Oxbridge success",
      competitive_apps: "competitive university applications"
    },
    navigation: {
      stem_pathway: "{{childName}}'s STEM Pathway - Choose Subjects",
      maths_related: "{{childName}}'s Mathematics & Related",
      science_subjects: "{{childName}}'s Science Subjects",
      stem_subjects: "{{childName}}'s STEM Subjects"
    },
    hero: {
      stem_excellence: "STEM Education Excellence • Perfect Preparation for {{childName}}'s Scientific Aspirations • Pathways to {{aspiration}}",
      oxbridge_prep: "STEM Education Excellence • Oxbridge Preparation • Pathways to Cambridge and Oxford Success",
      leading_universities: "leading universities",
      oxbridge_full: "Oxbridge"
    },
    stats: {
      oxbridge_aaa: "A*A*A",
      russell_aaa: "A*AA",
      russell_entry: "Russell Group Entry"
    },
    university: {
      oxbridge_title: "Oxbridge STEM Excellence for {{childName}}",
      oxbridge_text: "Our STEM curriculum provides exceptional preparation for Oxford and Cambridge applications. {{childName}} will develop the analytical thinking, problem-solving skills, and academic rigour that top universities seek, with specialist support for competitive applications and interviews."
    }
  });

  // zh-Hans (Chinese – Simplified)
  R('zh-Hans', 'sciences_mathematics', {
    welcome: {
      stem_both: "在科学和数学两方面取得卓越，为{{aspiration}}打下完美基础。",
      mathematics: "数学卓越与逻辑推理能力，这对{{aspiration}}至关重要。",
      sciences: "通过实验探究与分析性思维实现科学卓越，这些能力深受顶尖大学重视。",
      oxbridge: "凭借剑桥与牛津看重的分析与解题能力，迈向牛津剑桥的成功之路。",
      general: "以分析思维与科学素养支撑大学阶段的成功，契合现代职业需求。",
      prefix: "了解我们严谨的STEM课程如何培养{{childName}}的分析思维，并为{{childName}}做好准备，",
      oxbridge_success: "牛津剑桥成功",
      competitive_entry: "竞争性大学入学",
      oxbridge_apps: "牛津剑桥申请",
      university_success: "大学成功"
    },
    personalized: {
      oxbridge_maths_title: "{{childName}}的牛津剑桥数学",
      oxbridge_maths_text: "数学A Level对多数牛津剑桥课程高度加分，对许多STEM学科更是必不可少。{{childName}}将发展剑桥与牛津所重视的逻辑推理与分析能力，为竞争性申请打下坚实基础。",
      perfect_match: "与{{childName}}完美契合",
      maths_match_text: "数学与{{childName}}的学术兴趣高度匹配，将培养实现{{aspiration}}所需的逻辑推理与解题能力，并为未来STEM道路奠基。",
      highly_recommended: "强烈建议{{childName}}选择",
      further_maths_text: "鉴于{{childName}}的牛津剑桥目标，强烈建议修读高等数学（Further Mathematics）。该课程对剑桥数学尤为关键，也能为牛津相关专业带来优势，充分体现数学实力。",
      excellent_choice: "极佳选择，{{childName}}",
      physics_text: "物理与{{childName}}的科学兴趣高度吻合，可培养分析思维与实验能力，对{{aspiration}}极具价值；亦是工程与物理科学路径的核心学科。",
      ideal_for: "非常适合{{childName}}",
      chemistry_text: "化学与{{childName}}的科学兴趣完美匹配。作为“中心学科”，它衔接生命科学与物理世界，为医学、科研与前沿技术铺路，并为{{aspiration}}提供优秀准备。",
      perfect_for: "最适合{{childName}}",
      biology_text: "生物学契合{{childName}}的科学取向，将培养面向医学与生命科学所需的调查与分析能力，并为{{aspiration}}打下坚实基础。",
      great_match: "与{{childName}}高度匹配",
      cs_text: "若{{childName}}对技术方向感兴趣，计算机科学能系统培养计算思维与编程能力，适配各行业的数字化趋势，面向未来就业更具竞争力。",
      russell_success: "罗素集团成功",
      oxbridge_short: "牛津剑桥",
      top_universities: "顶尖大学",
      university_short: "大学",
      competitive_oxbridge: "竞争性牛津剑桥申请",
      university_success_short: "大学成功"
    },
    intros: {
      maths_choice: "绝佳选择，{{childName}}！数学是科学思维与现代技术的基础，将培养实现{{aspiration}}所需的逻辑推理与解题能力。",
      physics_perfect: "非常契合{{childName}}的科学兴趣！物理学培养分析思维与实验能力，有助于理解物质世界，并为科学与工程方向的{{aspiration}}申请提供出色准备。",
      chemistry_excellent: "很棒的选择，{{childName}}！化学是“中心学科”，既能满足科学好奇心，也能锻炼实现{{aspiration}}所需的分析与实践能力。",
      biology_match: "与{{childName}}的科学兴趣完美匹配！生物学帮助理解生命科学，并培养实现{{aspiration}}所需的调查与分析能力。",
      cs_perfect: "非常适合{{childName}}的技术兴趣！计算机科学将培养计算思维与编程能力，面向数字经济与现代技术职业做好准备。",
      oxbridge_success: "牛津剑桥成功",
      competitive_entry: "竞争性大学入学",
      competitive_university: "竞争性大学",
      competitive_oxbridge_apps: "竞争性牛津剑桥申请",
      oxbridge_short: "牛津剑桥",
      top_universities: "顶尖大学",
      oxbridge_success_full: "牛津剑桥成功",
      competitive_apps: "竞争性大学申请"
    },
    navigation: {
      stem_pathway: "{{childName}}的STEM路径 — 选择学科",
      maths_related: "{{childName}}的数学与相关学科",
      science_subjects: "{{childName}}的科学学科",
      stem_subjects: "{{childName}}的STEM学科"
    },
    hero: {
      stem_excellence: "STEM教育卓越 • 为{{childName}}的科学志向做好充分准备 • 通往{{aspiration}}的路径",
      oxbridge_prep: "STEM教育卓越 • 牛津剑桥准备 • 通往剑桥与牛津成功的路径",
      leading_universities: "领先大学",
      oxbridge_full: "牛津剑桥"
    },
    stats: {
      oxbridge_aaa: "A*A*A",
      russell_aaa: "A*AA",
      russell_entry: "罗素集团入学"
    },
    university: {
      oxbridge_title: "{{childName}}的牛津剑桥STEM卓越",
      oxbridge_text: "我们的STEM课程为牛津与剑桥的申请提供卓越准备。{{childName}}将发展顶尖大学看重的分析思维、问题解决与学术严谨，并获得面向竞争性申请与面试的专项支持。"
    }
  });
})();
