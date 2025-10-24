(function(){
  if (!window.PEN_I18N || typeof PEN_I18N.registerTranslations !== 'function') {
    console.warn('[third_form_creative_arts.i18n] PEN_I18N.registerTranslations not found. Load js/loader.js first.');
    return;
  }
  const R = window.PEN_I18N.registerTranslations;

  // EN (English)
  R('en', 'third_form_creative_arts', {
    placeholders: {
      child_name: '[Child Name]',
      parent_name: '[Parent Name]',
      family_name: '[Family Name]'
    },
    pronouns: {
      her: 'her',
      his: 'his'
    },
    welcome: {
      prefix: 'Discover how our Creative Arts and Design programme will nurture your',
      arts_interest: 'artistic talent and creative vision',
      arts_activity: 'creative interests and practical skills',
      general: 'creative potential and design thinking abilities',
      suffix: ', preparing you for GCSE study and beyond.'
    },
    art: {
      strong_interest: 'In our Art programme, {{childName}} will develop {{possessive}} artistic vision through hands-on exploration of Fine Art, Ceramics, and Printmaking. With your strong interest in the arts, you\'ll thrive in our supportive creative environment where risk-taking and experimentation are encouraged.',
      arts_priority: 'In our Art programme, {{childName}} will discover {{possessive}} creative potential through structured exploration of different artistic media. Our three-specialist rotation ensures comprehensive exposure to various creative techniques.',
      general: 'In our Art programme, {{childName}} will develop creative confidence through structured exploration of different artistic media, building essential skills for visual communication and personal expression.'
    },
    design_tech: {
      tech_interest: 'In our Design Technology programme, {{childName}} will excel in practical problem-solving, developing {{possessive}} technical skills through real-world design challenges. Your interest in technology and design makes this programme particularly exciting for your development.',
      academic: 'In our Design Technology programme, {{childName}} will develop practical skills while learning to solve real-world problems through innovative design. The programme\'s focus on GCSE preparation aligns perfectly with your academic priorities.',
      general: 'In our Design Technology programme, {{childName}} will develop practical skills while learning to solve real-world problems through innovative design, building confidence in both textiles and resistant materials.'
    }
  });

  // ES (Spanish)
  R('es', 'third_form_creative_arts', {
    placeholders: {
      child_name: '[Nombre del Niño]',
      parent_name: '[Nombre de los Padres]',
      family_name: '[Nombre de la Familia]'
    },
    pronouns: {
      her: 'su',
      his: 'su'
    },
    welcome: {
      prefix: 'Descubra cómo nuestro programa de Artes Creativas y Diseño nutrirá su',
      arts_interest: 'talento artístico y visión creativa',
      arts_activity: 'intereses creativos y habilidades prácticas',
      general: 'potencial creativo y habilidades de pensamiento de diseño',
      suffix: ', preparándole para el estudio GCSE y más allá.'
    },
    art: {
      strong_interest: 'En nuestro programa de Arte, {{childName}} desarrollará {{possessive}} visión artística a través de la exploración práctica de Bellas Artes, Cerámica y Grabado. Con su fuerte interés en las artes, prosperará en nuestro entorno creativo de apoyo donde se fomenta la toma de riesgos y la experimentación.',
      arts_priority: 'En nuestro programa de Arte, {{childName}} descubrirá {{possessive}} potencial creativo a través de la exploración estructurada de diferentes medios artísticos. Nuestra rotación de tres especialistas asegura una exposición integral a varias técnicas creativas.',
      general: 'En nuestro programa de Arte, {{childName}} desarrollará confianza creativa a través de la exploración estructurada de diferentes medios artísticos, construyendo habilidades esenciales para la comunicación visual y la expresión personal.'
    },
    design_tech: {
      tech_interest: 'En nuestro programa de Tecnología de Diseño, {{childName}} sobresaldrá en la resolución práctica de problemas, desarrollando {{possessive}} habilidades técnicas a través de desafíos de diseño del mundo real. Su interés en la tecnología y el diseño hace que este programa sea particularmente emocionante para su desarrollo.',
      academic: 'En nuestro programa de Tecnología de Diseño, {{childName}} desarrollará habilidades prácticas mientras aprende a resolver problemas del mundo real a través del diseño innovador. El enfoque del programa en la preparación para GCSE se alinea perfectamente con sus prioridades académicas.',
      general: 'En nuestro programa de Tecnología de Diseño, {{childName}} desarrollará habilidades prácticas mientras aprende a resolver problemas del mundo real a través del diseño innovador, construyendo confianza tanto en textiles como en materiales resistentes.'
    }
  });

  // FR (French)
  R('fr', 'third_form_creative_arts', {
    placeholders: {
      child_name: '[Nom de l\'Enfant]',
      parent_name: '[Nom des Parents]',
      family_name: '[Nom de Famille]'
    },
    pronouns: {
      her: 'sa',
      his: 'sa'
    },
    welcome: {
      prefix: 'Découvrez comment notre programme d\'Arts Créatifs et Design nourrira votre',
      arts_interest: 'talent artistique et vision créative',
      arts_activity: 'intérêts créatifs et compétences pratiques',
      general: 'potentiel créatif et capacités de pensée design',
      suffix: ', vous préparant aux études GCSE et au-delà.'
    },
    art: {
      strong_interest: 'Dans notre programme d\'Art, {{childName}} développera {{possessive}} vision artistique à travers l\'exploration pratique des Beaux-Arts, de la Céramique et de la Gravure. Avec votre fort intérêt pour les arts, vous vous épanouirez dans notre environnement créatif où la prise de risques et l\'expérimentation sont encouragées.',
      arts_priority: 'Dans notre programme d\'Art, {{childName}} découvrira {{possessive}} potentiel créatif à travers l\'exploration structurée de différents médiums artistiques. Notre rotation de trois spécialistes assure une exposition complète à diverses techniques créatives.',
      general: 'Dans notre programme d\'Art, {{childName}} développera une confiance créative à travers l\'exploration structurée de différents médiums artistiques, en construisant des compétences essentielles pour la communication visuelle et l\'expression personnelle.'
    },
    design_tech: {
      tech_interest: 'Dans notre programme de Technologie de Design, {{childName}} excellera dans la résolution pratique de problèmes, en développant {{possessive}} compétences techniques à travers des défis de design du monde réel. Votre intérêt pour la technologie et le design rend ce programme particulièrement passionnant pour votre développement.',
      academic: 'Dans notre programme de Technologie de Design, {{childName}} développera des compétences pratiques tout en apprenant à résoudre des problèmes du monde réel grâce à un design innovant. L\'accent du programme sur la préparation au GCSE s\'aligne parfaitement avec vos priorités académiques.',
      general: 'Dans notre programme de Technologie de Design, {{childName}} développera des compétences pratiques tout en apprenant à résoudre des problèmes du monde réel grâce à un design innovant, en construisant la confiance dans les textiles et les matériaux résistants.'
    }
  });

  // DE (German)
  R('de', 'third_form_creative_arts', {
    placeholders: {
      child_name: '[Name des Kindes]',
      parent_name: '[Name der Eltern]',
      family_name: '[Familienname]'
    },
    pronouns: {
      her: 'ihre',
      his: 'seine'
    },
    welcome: {
      prefix: 'Entdecken Sie, wie unser Programm für Kreative Künste und Design Ihr',
      arts_interest: 'künstlerisches Talent und kreative Vision',
      arts_activity: 'kreative Interessen und praktische Fähigkeiten',
      general: 'kreatives Potenzial und Design-Thinking-Fähigkeiten',
      suffix: ' fördern wird und Sie auf das GCSE-Studium und darüber hinaus vorbereitet.'
    },
    art: {
      strong_interest: 'In unserem Kunstprogramm wird {{childName}} {{possessive}} künstlerische Vision durch praktische Erkundung von Bildender Kunst, Keramik und Druckgrafik entwickeln. Mit Ihrem starken Interesse an Kunst werden Sie in unserer unterstützenden kreativen Umgebung gedeihen, in der Risikobereitschaft und Experimentieren gefördert werden.',
      arts_priority: 'In unserem Kunstprogramm wird {{childName}} {{possessive}} kreatives Potenzial durch strukturierte Erkundung verschiedener künstlerischer Medien entdecken. Unsere Rotation von drei Spezialisten gewährleistet umfassende Einblicke in verschiedene kreative Techniken.',
      general: 'In unserem Kunstprogramm wird {{childName}} kreatives Selbstvertrauen durch strukturierte Erkundung verschiedener künstlerischer Medien entwickeln und wesentliche Fähigkeiten für visuelle Kommunikation und persönlichen Ausdruck aufbauen.'
    },
    design_tech: {
      tech_interest: 'In unserem Design-Technologie-Programm wird {{childName}} bei praktischer Problemlösung hervorragen und {{possessive}} technische Fähigkeiten durch reale Designherausforderungen entwickeln. Ihr Interesse an Technologie und Design macht dieses Programm für Ihre Entwicklung besonders aufregend.',
      academic: 'In unserem Design-Technologie-Programm wird {{childName}} praktische Fähigkeiten entwickeln und lernen, reale Probleme durch innovatives Design zu lösen. Der Fokus des Programms auf GCSE-Vorbereitung passt perfekt zu Ihren akademischen Prioritäten.',
      general: 'In unserem Design-Technologie-Programm wird {{childName}} praktische Fähigkeiten entwickeln und lernen, reale Probleme durch innovatives Design zu lösen und Vertrauen in Textilien und widerstandsfähige Materialien aufbauen.'
    }
  });

  // zh-Hans (Chinese Simplified)
  R('zh-Hans', 'third_form_creative_arts', {
    placeholders: {
      child_name: '[孩子姓名]',
      parent_name: '[家长姓名]',
      family_name: '[家庭姓名]'
    },
    pronouns: {
      her: '她的',
      his: '他的'
    },
    welcome: {
      prefix: '了解我们的创意艺术与设计课程如何培养您的',
      arts_interest: '艺术才能和创意视野',
      arts_activity: '创意兴趣和实践技能',
      general: '创意潜力和设计思维能力',
      suffix: '，为您的GCSE学习及以后做准备。'
    },
    art: {
      strong_interest: '在我们的艺术课程中，{{childName}}将通过美术、陶艺和版画的实践探索来发展{{possessive}}艺术视野。凭借您对艺术的强烈兴趣，您将在我们支持性的创意环境中茁壮成长，那里鼓励冒险和实验。',
      arts_priority: '在我们的艺术课程中，{{childName}}将通过对不同艺术媒介的结构化探索来发现{{possessive}}创意潜力。我们的三位专家轮换确保全面接触各种创意技术。',
      general: '在我们的艺术课程中，{{childName}}将通过对不同艺术媒介的结构化探索来培养创意信心，建立视觉传达和个人表达的基本技能。'
    },
    design_tech: {
      tech_interest: '在我们的设计技术课程中，{{childName}}将擅长实践问题解决，通过现实世界的设计挑战来发展{{possessive}}技术技能。您对技术和设计的兴趣使这个课程对您的发展特别令人兴奋。',
      academic: '在我们的设计技术课程中，{{childName}}将发展实践技能，同时学习通过创新设计解决现实世界的问题。该课程对GCSE准备的关注与您的学术优先级完美契合。',
      general: '在我们的设计技术课程中，{{childName}}将发展实践技能，同时学习通过创新设计解决现实世界的问题，在纺织品和抗性材料方面建立信心。'
    }
  });

  // IT (Italian)
  R('it', 'third_form_creative_arts', {
    placeholders: {
      child_name: '[Nome del Bambino]',
      parent_name: '[Nome dei Genitori]',
      family_name: '[Nome di Famiglia]'
    },
    pronouns: {
      her: 'sua',
      his: 'suo'
    },
    welcome: {
      prefix: 'Scopri come il nostro programma di Arti Creative e Design nutrirà il tuo',
      arts_interest: 'talento artistico e visione creativa',
      arts_activity: 'interessi creativi e competenze pratiche',
      general: 'potenziale creativo e capacità di pensiero progettuale',
      suffix: ', preparandoti per lo studio GCSE e oltre.'
    },
    art: {
      strong_interest: 'Nel nostro programma di Arte, {{childName}} svilupperà {{possessive}} visione artistica attraverso l\'esplorazione pratica di Belle Arti, Ceramica e Incisione. Con il tuo forte interesse per le arti, prospererai nel nostro ambiente creativo di supporto dove il prendere rischi e la sperimentazione sono incoraggiati.',
      arts_priority: 'Nel nostro programma di Arte, {{childName}} scoprirà {{possessive}} potenziale creativo attraverso l\'esplorazione strutturata di diversi mezzi artistici. La nostra rotazione di tre specialisti assicura un\'esposizione completa a varie tecniche creative.',
      general: 'Nel nostro programma di Arte, {{childName}} svilupperà fiducia creativa attraverso l\'esplorazione strutturata di diversi mezzi artistici, costruendo competenze essenziali per la comunicazione visiva e l\'espressione personale.'
    },
    design_tech: {
      tech_interest: 'Nel nostro programma di Tecnologia del Design, {{childName}} eccellerà nella risoluzione pratica dei problemi, sviluppando {{possessive}} competenze tecniche attraverso sfide di design del mondo reale. Il tuo interesse per la tecnologia e il design rende questo programma particolarmente entusiasmante per il tuo sviluppo.',
      academic: 'Nel nostro programma di Tecnologia del Design, {{childName}} svilupperà competenze pratiche imparando a risolvere problemi del mondo reale attraverso il design innovativo. L\'attenzione del programma sulla preparazione al GCSE si allinea perfettamente con le tue priorità accademiche.',
      general: 'Nel nostro programma di Tecnologia del Design, {{childName}} svilupperà competenze pratiche imparando a risolvere problemi del mondo reale attraverso il design innovativo, costruendo fiducia sia nei tessuti che nei materiali resistenti.'
    }
  });
})();