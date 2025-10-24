(function(){
  if (!window.PEN_I18N || typeof PEN_I18N.registerTranslations !== 'function') {
    console.warn('[final_hero.i18n] PEN_I18N.registerTranslations not found. Load js/loader.js first.');
    return;
  }
  const R = window.PEN_I18N.registerTranslations;

  // English (default)
  R('en', 'final_hero', {
    placeholders: {
      child: "child"
    },
    ui: {
      click_to_mute: "CLICK TO MUTE",
      click_to_unmute: "CLICK TO UNMUTE"
    },
    visions: {
      oxbridge_academic: "{{childName}}, picture yourself among the intellectual elite at Oxbridge, debating philosophy in historic halls, conducting groundbreaking research, and joining the ranks of Nobel laureates and world leaders. Your journey starts here, where we'll nurture your academic brilliance and prepare you for the world's most prestigious universities.",
      leadership_activities: "{{childName}}, imagine yourself as Head of College, leading school initiatives, inspiring your peers, and developing the confidence and skills that will define your future. At Cheltenham, leadership isn't taught—it's discovered, nurtured, and celebrated in every aspect of school life.",
      boarding: "{{childName}}, boarding at Cheltenham means waking up in a community that becomes your second home, building friendships that will last a lifetime, and experiencing the independence and maturity that comes from living alongside peers who share your ambitions and values.",
      default: "{{childName}}, your time at Cheltenham will be transformative. Here, you'll discover talents you never knew you had, push boundaries you thought were fixed, and become the person you're destined to be—confident, compassionate, and ready to make your mark on the world."
    },
    conclusions: {
      pastoral_high: "The friendships, support, and sense of belonging shown in this video are waiting for {{childName}}. In our House system, every student finds their place, their voice, and their people.",
      leadership_activities_high: "Every position of responsibility, every captaincy, every initiative you've just seen represents opportunity. Next year, that could be {{childName}}—captaining teams, organizing events, mentoring younger students.",
      academic_high: "Every academic achievement celebrated in this video represents hours of dedication and inspired teaching. {{childName}} will join this tradition of excellence.",
      default: "This video captures what makes Cheltenham College extraordinary. For {{childName}}, it represents not just the next chapter, but the beginning of an exceptional journey."
    },
    taglines: {
      oxbridge_academic: "Where Oxbridge dreams take flight and academic excellence knows no limits",
      leadership_activities: "Where future leaders discover their voice and learn to inspire others",
      boarding: "Where boarding life creates lasting bonds and memories that define you"
    }
  });

  // zh-Hans (Chinese Simplified)
  R('zh-Hans', 'final_hero', {
    placeholders: {
      child: "孩子"
    },
    ui: {
      click_to_mute: "点击静音",
      click_to_unmute: "点击取消静音"
    },
    visions: {
      oxbridge_academic: "{{childName}},想象您自己置身于牛津剑桥的知识精英之中,在历史悠久的殿堂里辩论哲学,进行开创性的研究,并加入诺贝尔奖获得者和世界领导人的行列。您的旅程从这里开始,我们将在这里培养您的学术才华,并为您进入世界上最负盛名的大学做好准备。",
      leadership_activities: "{{childName}},想象您自己成为学院院长,领导学校倡议,激励同龄人,并培养将定义您未来的信心和技能。在切尔滕纳姆,领导力不是被教授的——它是在学校生活的各个方面被发现、培养和庆祝的。",
      boarding: "{{childName}},在切尔滕纳姆寄宿意味着在一个成为您第二个家的社区中醒来,建立将持续一生的友谊,并体验与分享您抱负和价值观的同龄人一起生活所带来的独立性和成熟度。",
      default: "{{childName}},您在切尔滕纳姆的时光将是变革性的。在这里,您将发现您从未知道自己拥有的才能,突破您认为是固定的界限,并成为您注定要成为的人——自信、富有同情心,并准备好在世界上留下您的印记。"
    },
    conclusions: {
      pastoral_high: "这段视频中展示的友谊、支持和归属感正等待着 {{childName}}。在我们的学院系统中,每个学生都能找到自己的位置、声音和伙伴。",
      leadership_activities_high: "您刚刚看到的每一个责任职位、每一个队长职位、每一项倡议都代表着机会。明年,那可能就是 {{childName}} - 担任队长、组织活动、指导年轻学生。",
      academic_high: "这段视频中庆祝的每一项学术成就都代表着数小时的奉献和富有启发性的教学。{{childName}} 将加入这一卓越传统。",
      default: "这段视频捕捉了切尔滕纳姆学院的非凡之处。对于 {{childName}} 来说,这不仅代表着下一章,而且代表着一段非凡旅程的开始。"
    },
    taglines: {
      oxbridge_academic: "牛津剑桥梦想在这里起飞,学术卓越无极限",
      leadership_activities: "未来的领导者在这里发现自己的声音并学会激励他人",
      boarding: "寄宿生活在这里创造永恒的纽带和定义您的回忆"
    }
  });
})();