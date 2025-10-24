(function () {
  if (!window.PEN_I18N || typeof PEN_I18N.registerTranslations !== 'function') {
    console.warn('[sports.i18n] PEN_I18N.registerTranslations not found. Load js/loader.js first.');
    return;
  }
  const R = window.PEN_I18N.registerTranslations;

  // EN (English)
  R('en', 'sports', {
    placeholders: {
      child: 'Child'
    },
    ui: {
      click_to_mute: 'CLICK TO MUTE',
      click_to_unmute: 'CLICK TO UNMUTE',
      show_more: 'Show more sports',
      hide_details: 'Hide sports details'
    },
    gender_rugby: {
      tab: 'RUGBY',
      title: 'RUGBY AT CHELTENHAM',
      hero_title: 'Strength, Strategy, Success',
      subtitle: 'Elite Rugby Programme with International Recognition',
      stat1: '15+',
      label1: 'Teams',
      stat2: '12',
      label2: 'Pitches',
      stat3: '2',
      label3: 'Annual Tours'
    },
    gender_netball: {
      tab: 'NETBALL',
      title: 'NETBALL AT CHELTENHAM',
      hero_title: 'Precision, Power, Performance',
      subtitle: 'Elite Netball Programme with National Recognition',
      stat1: '12',
      label1: 'Teams',
      stat2: '6',
      label2: 'Courts'
    },
    personal: {
      interest_note_sports: '{{childName}}, with your passion for sport already evident, ',
      interest_note_general: '{{childName}}, ',
      highlight_default: 'Hockey • Athletics • Tennis • Plus many more sports to explore'
    },
    sports: {
      hockey_title: 'Hockey Excellence',
      hockey_details: '{{childName}}, you\'ll train on our two Olympic-standard water-based Astro pitches alongside 20+ teams of passionate players. With professional coaching from former internationals, you\'ll develop advanced stick skills, tactical awareness and game intelligence. Regular fixtures against top schools like Millfield and Marlborough, plus appearances at National Finals, will challenge you at the highest level.',
      hockey_highlight: 'U18 National Finals 2024 • Perfect for {{childName}}',

      athletics_title: 'Athletics Programme',
      athletics_details: '{{childName}}, our athletics facilities will be your training ground for excellence. Whether you excel in sprints, middle distance, throwing or jumping, our specialist coaches will develop your technique through biomechanical analysis. You\'ll compete at prestigious events including the English Schools Championships and ISA Championships.',
      athletics_highlight: '3 National medallists • County champions • Ideal for {{childName}}',

      tennis_title: 'Tennis Development',
      tennis_details: '{{childName}}, with 12 hard courts, 6 grass courts and 4 indoor courts at your disposal, you\'ll have year-round opportunities to perfect your game. Our LTA-licensed coaches provide both individual and group coaching tailored to your skill level.',
      tennis_highlight: 'National Schools finalists • LTA Regional Centre',

      rugby_title: 'Rugby Excellence',
      rugby_details: '{{childName}}, you\'ll join 15+ teams from U13 to 1st XV competing at the highest level. Twelve full-size pitches including floodlit training areas provide the perfect environment for your development.',
      rugby_highlight: 'U18 National champions • England internationals',

      netball_title: 'Netball Excellence',
      netball_details: '{{childName}}, you\'ll compete with 12 teams from U13 to 1st VII at regional and national level. Six outdoor courts and indoor facilities provide year-round training opportunities.',
      netball_highlight: 'Regional champions • National Top 10',

      cricket_title: 'Cricket Excellence',
      cricket_details: '{{childName}}, you\'ll train on our professional-standard cricket square with 12 pitches. The indoor cricket centre with bowling machines and video analysis provides year-round development.',
      cricket_highlight: 'County Cup winners • MCC coaching',

      swimming_title: 'Swimming Excellence',
      swimming_details: '{{childName}}, you\'ll train in our heated 25m six-lane indoor pool with electronic timing systems. Daily squad training from 6:30am develops competitive swimming skills.',
      swimming_highlight: 'Regional champions • 8 county swimmers',

      rowing_title: 'Rowing Excellence',
      rowing_details: '{{childName}}, our state-of-the-art boathouse on the River Severn houses a fleet of 50+ boats. Compete at Henley Royal Regatta and the National Schools\' Regatta.',
      rowing_highlight: 'Henley qualifiers • GB junior pipeline',

      squash_title: 'Squash Excellence',
      squash_details: '{{childName}}, you\'ll train on four glass-backed championship courts in our dedicated squash centre. Professional coaching from former PSA tour players provides individual support.',
      squash_highlight: 'Top 10 UK school • County training venue',

      badminton_title: 'Badminton Excellence',
      badminton_details: '{{childName}}, you\'ll compete in our four-court sports hall with specialist badminton flooring. Teams compete in National Schools Championships and county leagues.',
      badminton_highlight: 'County champions • Regional finals',

      basketball_title: 'Basketball Excellence',
      basketball_details: '{{childName}}, you\'ll play on indoor courts with professional hoops and electronic scoreboards. Boys’ and girls’ teams compete in regional leagues with American-style coaching methods.',
      basketball_highlight: 'Regional league winners • National Schools qualifiers',

      football_title: 'Football Excellence',
      football_details: '{{childName}}, you\'ll train on our 3G all-weather pitch and multiple grass pitches. FA-qualified coaches including UEFA B licence holders provide expert guidance.',
      football_highlight: 'ISFA regional champions • County Cup semi-finals',

      cross_country_title: 'Cross Country Excellence',
      cross_country_details: '{{childName}}, you\'ll train on beautiful countryside routes with specialist distance coaching. Our winter programme builds endurance and mental toughness.',
      cross_country_highlight: 'County champions • Regional competitors',

      golf_title: 'Golf Excellence',
      golf_details: '{{childName}}, you\'ll benefit from partnerships with Cotswold Hills and Lilley Brook Golf Clubs. PGA professional coaching with video analysis and TrackMan technology.',
      golf_highlight: 'ISGA finals • 3 county players',

      equestrian_title: 'Equestrian Excellence',
      equestrian_details: '{{childName}}, comprehensive programme covering show jumping, eventing, dressage and polo. Partnership with local BHS-approved centres. NSEA competitions including Schools Championships at Hickstead.',
      equestrian_highlight: 'NSEA national qualifiers • Hickstead competitors',

      clay_shooting_title: 'Clay Shooting Excellence',
      clay_shooting_details: '{{childName}}, partnership with top-tier local shooting grounds. CPSA-qualified instruction across all disciplines. Compete at the Schools Challenge and NSRA championships.',
      clay_shooting_highlight: 'Schools Challenge finalists • CPSA registered',

      polo_title: 'Polo Excellence',
      polo_details: '{{childName}}, introduction to polo at Edgeworth Polo Club. HPA coaching with horses provided. Compete in SUPA schools tournaments.',
      polo_highlight: 'SUPA tournament players • HPA affiliated',

      water_polo_title: 'Water Polo Excellence',
      water_polo_details: '{{childName}}, train in our 25m pool with dedicated equipment. Boys’ and girls’ squads competing in regional leagues.',
      water_polo_highlight: 'Regional league • National Schools competition',

      volleyball_title: 'Volleyball Excellence',
      volleyball_details: '{{childName}}, indoor volleyball in sports hall with competition-standard nets. Teams compete in National Schools competitions.',
      volleyball_highlight: 'Regional competitors • Fastest-growing sport',

      ultimate_title: 'Ultimate Frisbee Excellence',
      ultimate_details: '{{childName}}, mixed teams competing in schools tournaments. Participate in UK Ultimate junior tournaments.',
      ultimate_highlight: 'National Schools tournament • Inclusive Sport Award',

      lacrosse_title: 'Lacrosse Excellence',
      lacrosse_details: '{{childName}}, you\'ll join our growing lacrosse programme with specialist coaching and competitive fixtures against other schools.',
      lacrosse_highlight: 'Growing programme • Competitive fixtures',

      rounders_title: 'Rounders Excellence',
      rounders_details: '{{childName}}, summer-term sport with teams from U13 to 1st IX. Participation in county tournaments including Lady Taverners competitions.',
      rounders_highlight: 'County tournament winners • Regional finals'
    }
  });

  // zh-Hans (Chinese – Simplified)
  R('zh-Hans', 'sports', {
    placeholders: {
      child: '孩子'
    },
    ui: {
      click_to_mute: '点击静音',
      click_to_unmute: '点击取消静音',
      show_more: '显示更多运动项目',
      hide_details: '隐藏运动详情'
    },
    gender_rugby: {
      tab: '橄榄球',
      title: '切尔滕纳姆橄榄球',
      hero_title: '力量、策略、成功',
      subtitle: '具有国际认可的精英橄榄球课程',
      stat1: '15+',
      label1: '球队',
      stat2: '12',
      label2: '场地',
      stat3: '2',
      label3: '年度巡回赛'
    },
    gender_netball: {
      tab: '无板篮球',
      title: '切尔滕纳姆无板篮球',
      hero_title: '精准、力量、表现',
      subtitle: '具有全国认可的精英无板篮球课程',
      stat1: '12',
      label1: '球队',
      stat2: '6',
      label2: '场地'
    },
    personal: {
      interest_note_sports: '{{childName}}，您对运动的热情已经显而易见，',
      interest_note_general: '{{childName}}，',
      highlight_default: '曲棍球・田径・网球・还有更多运动等您探索'
    },
    sports: {
      hockey_title: '曲棍球卓越',
      hockey_details: '{{childName}}，您将在我们两个奥林匹克标准的水基人工草地球场上与20多支充满热情的球队一起训练。在前国际球员的专业指导下，您将培养高级球棍技能、战术意识和比赛智慧。定期与米尔菲尔德和马尔伯勒等顶级学校的比赛，以及全国决赛的亮相，将在最高水平上挑战您。',
      hockey_highlight: 'U18全国决赛2024・非常适合{{childName}}',

      athletics_title: '田径课程',
      athletics_details: '{{childName}}，我们的田径设施将成为您追求卓越的训练场。无论您在短跑、中距离、投掷还是跳跃方面表现出色，我们的专业教练都会通过生物力学分析提升您的技术。您将参加包括英格兰学校锦标赛和ISA锦标赛在内的著名赛事。',
      athletics_highlight: '3名全国奖牌得主・郡冠军・非常适合{{childName}}',

      tennis_title: '网球发展',
      tennis_details: '{{childName}}，凭借12个硬地球场、6个草地球场和4个室内球场，您将全年都有机会精进球技。我们的LTA认证教练提供根据您水平量身定制的个人与团体指导。',
      tennis_highlight: '全国学校赛决赛选手・LTA地区中心',

      rugby_title: '橄榄球卓越',
      rugby_details: '{{childName}}，您将加入从U13到第一XV的15支以上球队，在最高水平上竞争。包括照明训练区在内的12个全尺寸球场为您的发展提供理想环境。',
      rugby_highlight: 'U18全国冠军・英格兰国家队梯队',

      netball_title: '无板篮球卓越',
      netball_details: '{{childName}}，您将与从U13到第一VII的12支球队在地区与全国层面竞争。6个室外球场及室内设施提供全年训练机会。',
      netball_highlight: '地区冠军・全国前10名',

      cricket_title: '板球卓越',
      cricket_details: '{{childName}}，您将在拥有12个投球区的专业标准板球场训练。配备投球机与视频分析的室内板球中心，全年持续提升。',
      cricket_highlight: '郡杯冠军・MCC指导',

      swimming_title: '游泳卓越',
      swimming_details: '{{childName}}，您将在配备电子计时系统的25米六泳道恒温室内泳池训练。每日清晨6:30开始的队伍训练将塑造竞技游泳能力。',
      swimming_highlight: '地区冠军・8名郡游泳选手',

      rowing_title: '赛艇卓越',
      rowing_details: '{{childName}}，我们位于塞文河畔的先进船库拥有50多艘船只。可参加亨利皇家赛艇会与全国学校赛艇赛。',
      rowing_highlight: '亨利资格赛选手・GB青少年梯队',

      squash_title: '壁球卓越',
      squash_details: '{{childName}}，您将在四片玻璃背板锦标赛球场训练。前PSA巡回赛球员提供专业一对一指导。',
      squash_highlight: '英国前十学校・郡级训练基地',

      badminton_title: '羽毛球卓越',
      badminton_details: '{{childName}}，在具备专业羽毛球地板的四场馆进行训练与比赛。队伍参加全国学校锦标赛与郡联赛。',
      badminton_highlight: '郡冠军・地区决赛',

      basketball_title: '篮球卓越',
      basketball_details: '{{childName}}，在配有专业篮筐与电子记分牌的室内球场训练与比赛。男、女队采用美式训练理念参与地区联赛。',
      basketball_highlight: '地区联赛冠军・全国学校赛资格',

      football_title: '足球卓越',
      football_details: '{{childName}}，您将在3G全天候球场与多块草地球场训练。FA认证教练（含UEFA B执照）提供专业指导。',
      football_highlight: 'ISFA地区冠军・郡杯四强',

      cross_country_title: '越野跑卓越',
      cross_country_details: '{{childName}}，在风景优美的乡间路线进行专业耐力训练。冬季训练计划专注于体能与心理韧性。',
      cross_country_highlight: '郡冠军・地区强队',

      golf_title: '高尔夫卓越',
      golf_details: '{{childName}}，与Cotswold Hills与Lilley Brook高尔夫俱乐部深度合作。PGA专业教练结合视频分析与TrackMan技术。',
      golf_highlight: 'ISGA总决赛・3名郡代表',

      equestrian_title: '马术卓越',
      equestrian_details: '{{childName}}，课程涵盖场地障碍、三项赛、盛装舞步与马球。与当地BHS认证中心合作。参与NSEA赛事，包括希克斯特德学校锦标赛。',
      equestrian_highlight: 'NSEA全国资格・希克斯特德参赛',

      clay_shooting_title: '飞碟射击卓越',
      clay_shooting_details: '{{childName}}，与顶级本地射击场合作。CPSA资格教练覆盖各类项目。可参加Schools Challenge与NSRA锦标赛。',
      clay_shooting_highlight: 'Schools Challenge决赛・CPSA注册',

      polo_title: '马球卓越',
      polo_details: '{{childName}}，在Edgeworth马球俱乐部入门马球。HPA教练提供马匹与训练。参加学校级SUPA赛事。',
      polo_highlight: 'SUPA赛事球员・HPA附属',

      water_polo_title: '水球卓越',
      water_polo_details: '{{childName}}，在配备专用器材的25米泳池训练。男女队参与地区联赛并争取全国赛资格。',
      water_polo_highlight: '地区联赛・全国学校赛',

      volleyball_title: '排球卓越',
      volleyball_details: '{{childName}}，在设有比赛标准球网的室内场馆训练与参赛。队伍参加全国学校级赛事。',
      volleyball_highlight: '地区强队・增长最快的运动',

      ultimate_title: '极限飞盘卓越',
      ultimate_details: '{{childName}}，混合队伍参加校际赛事，并参与UK Ultimate青少年锦标赛。',
      ultimate_highlight: '全国学校锦标赛・包容性运动奖',

      lacrosse_title: '长曲棍球卓越',
      lacrosse_details: '{{childName}}，加入不断扩大的长曲棍球项目，接受专业训练并与兄弟学校进行竞技对抗。',
      lacrosse_highlight: '项目稳步增长・高水平对抗',

      rounders_title: '圆场棒球卓越',
      rounders_details: '{{childName}}，夏季学期重点项目，队伍从U13至第一IX。参加郡级赛事，包括Lady Taverners比赛。',
      rounders_highlight: '郡赛事冠军・地区决赛'
    }
  });
})();
