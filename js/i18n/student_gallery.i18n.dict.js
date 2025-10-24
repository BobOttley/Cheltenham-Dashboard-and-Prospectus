(function(){
  if (!window.PEN_I18N || typeof PEN_I18N.registerTranslations !== 'function') {
    console.warn('[student_gallery.i18n] PEN_I18N.registerTranslations not found. Load js/loader.js first.');
    return;
  }
  const R = window.PEN_I18N.registerTranslations;

  // EN (English)
  R('en', 'student_gallery', {
    placeholders: {
      your_child: 'your child'
    },
    journey: {
      boarding: 'As a boarding student, you\'ll experience the full richness of our community life.',
      day: 'As a day student, you\'ll enjoy the best of both worlds: our vibrant school community and your life at home.'
    },
    community: {
      wellbeing: '- with wellbeing at the heart of everything we do.',
      boarding_immersive: '- perfect for students seeking a truly immersive educational experience.',
      academic_excellence: '- where academic excellence drives everything we do.'
    },
    academic: {
      sciences_oxbridge: 'With your interests in Sciences and Oxbridge ambitions, our university-standard laboratories will support your goals.',
      sciences_general: 'With your interest in Sciences, you\'ll love our specialist research resources.',
      mathematics: 'For mathematical interests like yours, our academic support team provides extension opportunities.',
      humanities: 'Our Humanities departments will perfectly support your interests.'
    },
    sport: {
      hockey: 'As someone interested in hockey, you\'ll love our astroturf pitches and excellent reputation.',
      athletics: 'With your interests in athletics, our track and field facilities will help you excel.',
      rugby: 'Our rugby programme has produced internationals - perfect for developing your skills.',
      general: 'With your sporting interests, you\'ll thrive with our professional coaching.'
    },
    pastoral: {
      high_priority: 'Since pastoral care matters to you, you\'ll appreciate our exceptional House staff.',
      boarding_family: 'As a boarding family, our House staff live on campus creating a real home environment.'
    },
    testimonial: {
      leadership: 'This student\'s experience with leadership opportunities aligns with your interests.',
      boarding: 'This perfectly captures the boarding experience you\'re considering.'
    }
  });

  // ES (Spanish)
  R('es', 'student_gallery', {
    placeholders: {
      your_child: 'su hijo'
    },
    journey: {
      boarding: 'Como estudiante interno, experimentará la riqueza completa de nuestra vida comunitaria.',
      day: 'Como estudiante externo, disfrutará lo mejor de ambos mundos: nuestra vibrante comunidad escolar y su vida en casa.'
    },
    community: {
      wellbeing: '- con el bienestar en el centro de todo lo que hacemos.',
      boarding_immersive: '- perfecto para estudiantes que buscan una experiencia educativa verdaderamente inmersiva.',
      academic_excellence: '- donde la excelencia académica impulsa todo lo que hacemos.'
    },
    academic: {
      sciences_oxbridge: 'Con sus intereses en Ciencias y ambiciones de Oxbridge, nuestros laboratorios de nivel universitario apoyarán sus objetivos.',
      sciences_general: 'Con su interés en Ciencias, le encantarán nuestros recursos de investigación especializados.',
      mathematics: 'Para intereses matemáticos como los suyos, nuestro equipo de apoyo académico proporciona oportunidades de extensión.',
      humanities: 'Nuestros departamentos de Humanidades apoyarán perfectamente sus intereses.'
    },
    sport: {
      hockey: 'Como alguien interesado en hockey, le encantarán nuestros campos de césped artificial y excelente reputación.',
      athletics: 'Con sus intereses en atletismo, nuestras instalaciones de pista y campo le ayudarán a sobresalir.',
      rugby: 'Nuestro programa de rugby ha producido internacionales: perfecto para desarrollar sus habilidades.',
      general: 'Con sus intereses deportivos, prosperará con nuestro entrenamiento profesional.'
    },
    pastoral: {
      high_priority: 'Dado que el cuidado pastoral es importante para usted, apreciará nuestro excepcional personal de House.',
      boarding_family: 'Como familia interna, nuestro personal de House vive en el campus creando un verdadero ambiente hogareño.'
    },
    testimonial: {
      leadership: 'La experiencia de este estudiante con oportunidades de liderazgo se alinea con sus intereses.',
      boarding: 'Esto captura perfectamente la experiencia de internado que está considerando.'
    }
  });

  // FR (French)
  R('fr', 'student_gallery', {
    placeholders: {
      your_child: 'votre enfant'
    },
    journey: {
      boarding: 'En tant qu\'élève pensionnaire, vous découvrirez toute la richesse de notre vie communautaire.',
      day: 'En tant qu\'élève externe, vous profiterez du meilleur des deux mondes : notre communauté scolaire dynamique et votre vie à la maison.'
    },
    community: {
      wellbeing: '- avec le bien-être au cœur de tout ce que nous faisons.',
      boarding_immersive: '- parfait pour les élèves recherchant une expérience éducative vraiment immersive.',
      academic_excellence: '- où l\'excellence académique guide tout ce que nous faisons.'
    },
    academic: {
      sciences_oxbridge: 'Avec vos intérêts en Sciences et vos ambitions pour Oxbridge, nos laboratoires de niveau universitaire soutiendront vos objectifs.',
      sciences_general: 'Avec votre intérêt pour les Sciences, vous adorerez nos ressources de recherche spécialisées.',
      mathematics: 'Pour des intérêts mathématiques comme les vôtres, notre équipe de soutien académique offre des opportunités d\'extension.',
      humanities: 'Nos départements d\'Humanités soutiendront parfaitement vos intérêts.'
    },
    sport: {
      hockey: 'En tant que personne intéressée par le hockey, vous adorerez nos terrains en gazon synthétique et notre excellente réputation.',
      athletics: 'Avec vos intérêts en athlétisme, nos installations de piste et de terrain vous aideront à exceller.',
      rugby: 'Notre programme de rugby a produit des internationaux : parfait pour développer vos compétences.',
      general: 'Avec vos intérêts sportifs, vous vous épanouirez avec notre coaching professionnel.'
    },
    pastoral: {
      high_priority: 'Puisque la pastorale est importante pour vous, vous apprécierez notre personnel de House exceptionnel.',
      boarding_family: 'En tant que famille pensionnaire, notre personnel de House vit sur place en créant un véritable environnement familial.'
    },
    testimonial: {
      leadership: 'L\'expérience de cet élève avec les opportunités de leadership correspond à vos intérêts.',
      boarding: 'Cela capture parfaitement l\'expérience du pensionnat que vous envisagez.'
    }
  });

  // DE (German)
  R('de', 'student_gallery', {
    placeholders: {
      your_child: 'Ihr Kind'
    },
    journey: {
      boarding: 'Als Internatsschüler werden Sie den vollen Reichtum unseres Gemeinschaftslebens erleben.',
      day: 'Als Tagesschüler genießen Sie das Beste aus beiden Welten: unsere lebendige Schulgemeinschaft und Ihr Zuhause.'
    },
    community: {
      wellbeing: '- mit Wohlbefinden im Mittelpunkt von allem, was wir tun.',
      boarding_immersive: '- perfekt für Schüler, die eine wirklich immersive Bildungserfahrung suchen.',
      academic_excellence: '- wo akademische Exzellenz alles antreibt, was wir tun.'
    },
    academic: {
      sciences_oxbridge: 'Mit Ihren Interessen an Naturwissenschaften und Oxbridge-Ambitionen werden unsere Labore auf universitärem Niveau Ihre Ziele unterstützen.',
      sciences_general: 'Mit Ihrem Interesse an Naturwissenschaften werden Sie unsere spezialisierten Forschungsressourcen lieben.',
      mathematics: 'Für mathematische Interessen wie Ihre bietet unser akademisches Unterstützungsteam Erweiterungsmöglichkeiten.',
      humanities: 'Unsere Geisteswissenschaften werden Ihre Interessen perfekt unterstützen.'
    },
    sport: {
      hockey: 'Als jemand, der an Hockey interessiert ist, werden Sie unsere Kunstrasenplätze und unseren ausgezeichneten Ruf lieben.',
      athletics: 'Mit Ihren Interessen an Leichtathletik werden unsere Lauf- und Feldanlagen Ihnen helfen, zu glänzen.',
      rugby: 'Unser Rugby-Programm hat Nationalspieler hervorgebracht: perfekt, um Ihre Fähigkeiten zu entwickeln.',
      general: 'Mit Ihren sportlichen Interessen werden Sie mit unserem professionellen Coaching gedeihen.'
    },
    pastoral: {
      high_priority: 'Da Ihnen die seelsorgerische Betreuung wichtig ist, werden Sie unser außergewöhnliches House-Personal schätzen.',
      boarding_family: 'Als Internatsfamilie lebt unser House-Personal vor Ort und schafft eine echte häusliche Umgebung.'
    },
    testimonial: {
      leadership: 'Die Erfahrung dieses Schülers mit Führungsmöglichkeiten stimmt mit Ihren Interessen überein.',
      boarding: 'Dies erfasst perfekt die Internatserfahrung, die Sie in Betracht ziehen.'
    }
  });

  // zh-Hans (Chinese Simplified)
  R('zh-Hans', 'student_gallery', {
    placeholders: {
      your_child: '您的孩子'
    },
    journey: {
      boarding: '作为寄宿学生，您将体验我们社区生活的全部丰富性。',
      day: '作为走读学生，您将享受两全其美：我们充满活力的学校社区和您的家庭生活。'
    },
    community: {
      wellbeing: '- 我们所做的一切都以福祉为核心。',
      boarding_immersive: '- 非常适合寻求真正沉浸式教育体验的学生。',
      academic_excellence: '- 学术卓越推动我们所做的一切。'
    },
    academic: {
      sciences_oxbridge: '凭借您对科学的兴趣和牛剑抱负，我们的大学标准实验室将支持您的目标。',
      sciences_general: '凭借您对科学的兴趣，您会喜欢我们专业的研究资源。',
      mathematics: '对于像您这样的数学兴趣，我们的学术支持团队提供拓展机会。',
      humanities: '我们的人文学科部门将完美支持您的兴趣。'
    },
    sport: {
      hockey: '作为对曲棍球感兴趣的人，您会喜欢我们的人工草地球场和卓越声誉。',
      athletics: '凭借您对田径的兴趣，我们的径赛和田赛设施将帮助您脱颖而出。',
      rugby: '我们的橄榄球项目培养了国际球员：非常适合发展您的技能。',
      general: '凭借您的运动兴趣，您将在我们的专业指导下茁壮成长。'
    },
    pastoral: {
      high_priority: '由于关顾辅导对您很重要，您会欣赏我们出色的学院员工。',
      boarding_family: '作为寄宿家庭，我们的学院员工住在校园内，营造真正的家庭环境。'
    },
    testimonial: {
      leadership: '这位学生在领导力机会方面的经验与您的兴趣相符。',
      boarding: '这完美地捕捉了您正在考虑的寄宿体验。'
    }
  });

  // IT (Italian)
  R('it', 'student_gallery', {
    placeholders: {
      your_child: 'suo figlio'
    },
    journey: {
      boarding: 'Come studente convittore, sperimenterai la piena ricchezza della nostra vita comunitaria.',
      day: 'Come studente esterno, godrai del meglio di entrambi i mondi: la nostra vibrante comunità scolastica e la tua vita a casa.'
    },
    community: {
      wellbeing: '- con il benessere al centro di tutto ciò che facciamo.',
      boarding_immersive: '- perfetto per gli studenti che cercano un\'esperienza educativa veramente immersiva.',
      academic_excellence: '- dove l\'eccellenza accademica guida tutto ciò che facciamo.'
    },
    academic: {
      sciences_oxbridge: 'Con i tuoi interessi in Scienze e ambizioni per Oxbridge, i nostri laboratori di livello universitario sosterranno i tuoi obiettivi.',
      sciences_general: 'Con il tuo interesse per le Scienze, amerai le nostre risorse di ricerca specializzate.',
      mathematics: 'Per interessi matematici come i tuoi, il nostro team di supporto accademico offre opportunità di approfondimento.',
      humanities: 'I nostri dipartimenti di Scienze Umane sosterranno perfettamente i tuoi interessi.'
    },
    sport: {
      hockey: 'Come qualcuno interessato all\'hockey, amerai i nostri campi in erba sintetica e l\'eccellente reputazione.',
      athletics: 'Con i tuoi interessi nell\'atletica, le nostre strutture di pista e campo ti aiuteranno a eccellere.',
      rugby: 'Il nostro programma di rugby ha prodotto internazionali: perfetto per sviluppare le tue abilità.',
      general: 'Con i tuoi interessi sportivi, prospererai con il nostro coaching professionale.'
    },
    pastoral: {
      high_priority: 'Poiché la cura pastorale è importante per te, apprezzerai il nostro eccezionale staff di House.',
      boarding_family: 'Come famiglia convittrice, il nostro staff di House vive nel campus creando un vero ambiente domestico.'
    },
    testimonial: {
      leadership: 'L\'esperienza di questo studente con opportunità di leadership è in linea con i tuoi interessi.',
      boarding: 'Questo cattura perfettamente l\'esperienza del convitto che stai considerando.'
    }
  });
})();