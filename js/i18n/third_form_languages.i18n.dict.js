(function(){
  if (!window.PEN_I18N || typeof PEN_I18N.registerTranslations !== 'function') {
    console.warn('[third_form_languages.i18n] PEN_I18N.registerTranslations not found. Load js/loader.js first.');
    return;
  }
  const R = window.PEN_I18N.registerTranslations;

  // EN (English)
  R('en', 'third_form_languages', {
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
      prefix: 'Discover how language learning',
      languages_interest: 'will build on your existing language interests to open a world of cultural understanding and global opportunities',
      humanities_interest: 'will complement your humanities interests while developing cultural awareness and analytical thinking skills',
      international_aspirations: 'will prepare you for international study opportunities and global career prospects',
      general: 'will open a world of cultural understanding and global opportunities'
    },
    french: {
      languages: 'In our French programme, {{childName}} will build on {{possessive}} existing language interests, developing sophisticated communication skills through cultural immersion and authentic experiences in Montpellier.',
      international: 'In our French programme, {{childName}} will develop the cultural awareness and language skills essential for international study and global career opportunities.',
      general: 'In our French programme, {{childName}} will develop sophisticated communication skills while exploring French culture and history through immersive learning experiences.'
    },
    spanish: {
      languages: 'In our Spanish programme, {{childName}} will explore the vibrant cultures of the Spanish-speaking world while developing practical language skills through our immersion experiences in Salamanca.',
      community: 'In our Spanish programme, {{childName}} will connect with diverse Hispanic cultures, perfect for someone interested in community engagement and global understanding.',
      general: 'In our Spanish programme, {{childName}} will explore the rich cultures of Spanish-speaking countries while developing practical language skills for global communication.'
    },
    german: {
      academic_priority: 'In our German programme, {{childName}} will develop systematic thinking skills through structured grammar learning, perfect for someone with strong academic priorities.',
      languages: 'In our German programme, {{childName}} will discover the logical structure of German while exploring German culture through our exchange programmes in Berlin.',
      general: 'In our German programme, {{childName}} will develop systematic thinking skills through structured grammar learning and cultural discovery.'
    },
    latin: {
      classics: 'In our Latin programme, {{childName}} will excel in the rigorous analytical thinking that Latin develops, complementing {{possessive}} interests in classical studies and humanities.',
      academic_priority: 'In our Latin programme, {{childName}} will develop the logical thinking and academic rigour that Latin provides, essential for high academic achievement.',
      general: 'In our Latin programme, {{childName}} will develop rigorous analytical skills while exploring the foundations of Western civilisation through the Cambridge Latin Course.'
    },
    classical: {
      humanities: 'In our Classical Civilisation programme, {{childName}} will explore the foundations of Western culture, perfectly complementing {{possessive}} humanities interests through the study of ancient civilisations.',
      leadership: 'In our Classical Civilisation programme, {{childName}} will study the leadership and governance of ancient civilisations, developing valuable insights for modern leadership roles.',
      general: 'In our Classical Civilisation programme, {{childName}} will explore the foundations of Western culture while developing analytical and interpretative skills through the study of ancient worlds.'
    },
    eal: {
      international: 'In our EAL programme, {{childName}} will develop academic English skills essential for success in international studies while building confidence across all subjects.',
      general: 'In our EAL programme, {{childName}} will develop academic English skills while building confidence for success across all subjects in the British curriculum.'
    }
  });

  // ES (Spanish)
  R('es', 'third_form_languages', {
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
      prefix: 'Descubra cómo el aprendizaje de idiomas',
      languages_interest: 'se basará en sus intereses lingüísticos existentes para abrir un mundo de comprensión cultural y oportunidades globales',
      humanities_interest: 'complementará sus intereses en humanidades mientras desarrolla conciencia cultural y habilidades de pensamiento analítico',
      international_aspirations: 'le preparará para oportunidades de estudio internacional y perspectivas de carrera global',
      general: 'abrirá un mundo de comprensión cultural y oportunidades globales'
    },
    french: {
      languages: 'En nuestro programa de francés, {{childName}} se basará en {{possessive}} intereses lingüísticos existentes, desarrollando habilidades de comunicación sofisticadas a través de inmersión cultural y experiencias auténticas en Montpellier.',
      international: 'En nuestro programa de francés, {{childName}} desarrollará la conciencia cultural y las habilidades lingüísticas esenciales para el estudio internacional y las oportunidades de carrera global.',
      general: 'En nuestro programa de francés, {{childName}} desarrollará habilidades de comunicación sofisticadas mientras explora la cultura e historia francesa a través de experiencias de aprendizaje inmersivas.'
    },
    spanish: {
      languages: 'En nuestro programa de español, {{childName}} explorará las vibrantes culturas del mundo hispanohablante mientras desarrolla habilidades lingüísticas prácticas a través de nuestras experiencias de inmersión en Salamanca.',
      community: 'En nuestro programa de español, {{childName}} se conectará con diversas culturas hispanas, perfecto para alguien interesado en el compromiso comunitario y la comprensión global.',
      general: 'En nuestro programa de español, {{childName}} explorará las ricas culturas de países hispanohablantes mientras desarrolla habilidades lingüísticas prácticas para la comunicación global.'
    },
    german: {
      academic_priority: 'En nuestro programa de alemán, {{childName}} desarrollará habilidades de pensamiento sistemático a través del aprendizaje estructurado de gramática, perfecto para alguien con fuertes prioridades académicas.',
      languages: 'En nuestro programa de alemán, {{childName}} descubrirá la estructura lógica del alemán mientras explora la cultura alemana a través de nuestros programas de intercambio en Berlín.',
      general: 'En nuestro programa de alemán, {{childName}} desarrollará habilidades de pensamiento sistemático a través del aprendizaje estructurado de gramática y el descubrimiento cultural.'
    },
    latin: {
      classics: 'En nuestro programa de latín, {{childName}} sobresaldrá en el riguroso pensamiento analítico que el latín desarrolla, complementando {{possessive}} intereses en estudios clásicos y humanidades.',
      academic_priority: 'En nuestro programa de latín, {{childName}} desarrollará el pensamiento lógico y el rigor académico que el latín proporciona, esencial para el alto rendimiento académico.',
      general: 'En nuestro programa de latín, {{childName}} desarrollará habilidades analíticas rigurosas mientras explora los fundamentos de la civilización occidental a través del Cambridge Latin Course.'
    },
    classical: {
      humanities: 'En nuestro programa de Civilización Clásica, {{childName}} explorará los fundamentos de la cultura occidental, complementando perfectamente {{possessive}} intereses en humanidades a través del estudio de civilizaciones antiguas.',
      leadership: 'En nuestro programa de Civilización Clásica, {{childName}} estudiará el liderazgo y la gobernanza de civilizaciones antiguas, desarrollando conocimientos valiosos para roles de liderazgo moderno.',
      general: 'En nuestro programa de Civilización Clásica, {{childName}} explorará los fundamentos de la cultura occidental mientras desarrolla habilidades analíticas e interpretativas a través del estudio de mundos antiguos.'
    },
    eal: {
      international: 'En nuestro programa de EAL, {{childName}} desarrollará habilidades de inglés académico esenciales para el éxito en estudios internacionales mientras construye confianza en todas las asignaturas.',
      general: 'En nuestro programa de EAL, {{childName}} desarrollará habilidades de inglés académico mientras construye confianza para el éxito en todas las asignaturas del currículo británico.'
    }
  });

  // FR (French)
  R('fr', 'third_form_languages', {
    placeholders: {
      child_name: '[Nom de l\'Enfant]',
      parent_name: '[Nom des Parents]',
      family_name: '[Nom de Famille]'
    },
    pronouns: {
      her: 'ses',
      his: 'ses'
    },
    welcome: {
      prefix: 'Découvrez comment l\'apprentissage des langues',
      languages_interest: 's\'appuiera sur vos intérêts linguistiques existants pour ouvrir un monde de compréhension culturelle et d\'opportunités mondiales',
      humanities_interest: 'complétera vos intérêts en humanités tout en développant la conscience culturelle et les compétences de pensée analytique',
      international_aspirations: 'vous préparera aux opportunités d\'études internationales et aux perspectives de carrière mondiale',
      general: 'ouvrira un monde de compréhension culturelle et d\'opportunités mondiales'
    },
    french: {
      languages: 'Dans notre programme de français, {{childName}} s\'appuiera sur {{possessive}} intérêts linguistiques existants, en développant des compétences de communication sophistiquées grâce à l\'immersion culturelle et aux expériences authentiques à Montpellier.',
      international: 'Dans notre programme de français, {{childName}} développera la conscience culturelle et les compétences linguistiques essentielles pour les études internationales et les opportunités de carrière mondiale.',
      general: 'Dans notre programme de français, {{childName}} développera des compétences de communication sophistiquées tout en explorant la culture et l\'histoire françaises à travers des expériences d\'apprentissage immersives.'
    },
    spanish: {
      languages: 'Dans notre programme d\'espagnol, {{childName}} explorera les cultures vibrantes du monde hispanophone tout en développant des compétences linguistiques pratiques grâce à nos expériences d\'immersion à Salamanque.',
      community: 'Dans notre programme d\'espagnol, {{childName}} se connectera avec diverses cultures hispaniques, parfait pour quelqu\'un intéressé par l\'engagement communautaire et la compréhension mondiale.',
      general: 'Dans notre programme d\'espagnol, {{childName}} explorera les riches cultures des pays hispanophones tout en développant des compétences linguistiques pratiques pour la communication mondiale.'
    },
    german: {
      academic_priority: 'Dans notre programme d\'allemand, {{childName}} développera des compétences de pensée systématique grâce à l\'apprentissage structuré de la grammaire, parfait pour quelqu\'un avec de fortes priorités académiques.',
      languages: 'Dans notre programme d\'allemand, {{childName}} découvrira la structure logique de l\'allemand tout en explorant la culture allemande à travers nos programmes d\'échange à Berlin.',
      general: 'Dans notre programme d\'allemand, {{childName}} développera des compétences de pensée systématique grâce à l\'apprentissage structuré de la grammaire et à la découverte culturelle.'
    },
    latin: {
      classics: 'Dans notre programme de latin, {{childName}} excellera dans la pensée analytique rigoureuse que le latin développe, en complément de {{possessive}} intérêts pour les études classiques et les humanités.',
      academic_priority: 'Dans notre programme de latin, {{childName}} développera la pensée logique et la rigueur académique que le latin fournit, essentielle pour une haute réussite académique.',
      general: 'Dans notre programme de latin, {{childName}} développera des compétences analytiques rigoureuses tout en explorant les fondements de la civilisation occidentale à travers le Cambridge Latin Course.'
    },
    classical: {
      humanities: 'Dans notre programme de Civilisation Classique, {{childName}} explorera les fondements de la culture occidentale, complétant parfaitement {{possessive}} intérêts pour les humanités à travers l\'étude des civilisations anciennes.',
      leadership: 'Dans notre programme de Civilisation Classique, {{childName}} étudiera le leadership et la gouvernance des civilisations anciennes, en développant des connaissances précieuses pour les rôles de leadership modernes.',
      general: 'Dans notre programme de Civilisation Classique, {{childName}} explorera les fondements de la culture occidentale tout en développant des compétences analytiques et interprétatives à travers l\'étude des mondes anciens.'
    },
    eal: {
      international: 'Dans notre programme d\'EAL, {{childName}} développera des compétences en anglais académique essentielles pour la réussite des études internationales tout en renforçant la confiance dans toutes les matières.',
      general: 'Dans notre programme d\'EAL, {{childName}} développera des compétences en anglais académique tout en renforçant la confiance pour la réussite dans toutes les matières du programme britannique.'
    }
  });

  // DE (German)
  R('de', 'third_form_languages', {
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
      prefix: 'Entdecken Sie, wie das Sprachenlernen',
      languages_interest: 'auf Ihren bestehenden Sprachinteressen aufbauen wird, um eine Welt des kulturellen Verständnisses und globaler Möglichkeiten zu eröffnen',
      humanities_interest: 'Ihre Interessen an Geisteswissenschaften ergänzen wird, während es kulturelles Bewusstsein und analytische Denkfähigkeiten entwickelt',
      international_aspirations: 'Sie auf internationale Studienmöglichkeiten und globale Karriereaussichten vorbereiten wird',
      general: 'eine Welt des kulturellen Verständnisses und globaler Möglichkeiten eröffnen wird'
    },
    french: {
      languages: 'In unserem Französischprogramm wird {{childName}} auf {{possessive}} bestehenden Sprachinteressen aufbauen und durch kulturelle Immersion und authentische Erfahrungen in Montpellier anspruchsvolle Kommunikationsfähigkeiten entwickeln.',
      international: 'In unserem Französischprogramm wird {{childName}} das kulturelle Bewusstsein und die Sprachfähigkeiten entwickeln, die für internationales Studium und globale Karrierechancen wesentlich sind.',
      general: 'In unserem Französischprogramm wird {{childName}} anspruchsvolle Kommunikationsfähigkeiten entwickeln, während {{possessive}} französische Kultur und Geschichte durch immersive Lernerfahrungen erforscht.'
    },
    spanish: {
      languages: 'In unserem Spanischprogramm wird {{childName}} die lebendigen Kulturen der spanischsprachigen Welt erkunden, während {{possessive}} durch unsere Immersionserfahrungen in Salamanca praktische Sprachfähigkeiten entwickelt.',
      community: 'In unserem Spanischprogramm wird sich {{childName}} mit vielfältigen hispanischen Kulturen verbinden, perfekt für jemanden, der an gemeinschaftlichem Engagement und globalem Verständnis interessiert ist.',
      general: 'In unserem Spanischprogramm wird {{childName}} die reichen Kulturen spanischsprachiger Länder erkunden, während {{possessive}} praktische Sprachfähigkeiten für globale Kommunikation entwickelt.'
    },
    german: {
      academic_priority: 'In unserem Deutschprogramm wird {{childName}} durch strukturiertes Grammatiklernen systematische Denkfähigkeiten entwickeln, perfekt für jemanden mit starken akademischen Prioritäten.',
      languages: 'In unserem Deutschprogramm wird {{childName}} die logische Struktur des Deutschen entdecken, während {{possessive}} durch unsere Austauschprogramme in Berlin deutsche Kultur erforscht.',
      general: 'In unserem Deutschprogramm wird {{childName}} durch strukturiertes Grammatiklernen und kulturelle Entdeckung systematische Denkfähigkeiten entwickeln.'
    },
    latin: {
      classics: 'In unserem Lateinprogramm wird {{childName}} im rigorosen analytischen Denken, das Latein entwickelt, hervorragen und {{possessive}} Interessen an klassischen Studien und Geisteswissenschaften ergänzen.',
      academic_priority: 'In unserem Lateinprogramm wird {{childName}} das logische Denken und die akademische Strenge entwickeln, die Latein bietet, wesentlich für hohe akademische Leistung.',
      general: 'In unserem Lateinprogramm wird {{childName}} rigorose analytische Fähigkeiten entwickeln, während {{possessive}} die Grundlagen der westlichen Zivilisation durch den Cambridge Latin Course erforscht.'
    },
    classical: {
      humanities: 'In unserem Programm für Klassische Zivilisation wird {{childName}} die Grundlagen der westlichen Kultur erforschen und {{possessive}} Interessen an Geisteswissenschaften durch das Studium antiker Zivilisationen perfekt ergänzen.',
      leadership: 'In unserem Programm für Klassische Zivilisation wird {{childName}} Führung und Regierung antiker Zivilisationen studieren und wertvolle Erkenntnisse für moderne Führungsrollen entwickeln.',
      general: 'In unserem Programm für Klassische Zivilisation wird {{childName}} die Grundlagen der westlichen Kultur erforschen, während {{possessive}} durch das Studium antiker Welten analytische und interpretative Fähigkeiten entwickelt.'
    },
    eal: {
      international: 'In unserem EAL-Programm wird {{childName}} akademische Englischfähigkeiten entwickeln, die für den Erfolg bei internationalen Studien wesentlich sind, während {{possessive}} Selbstvertrauen in allen Fächern aufbaut.',
      general: 'In unserem EAL-Programm wird {{childName}} akademische Englischfähigkeiten entwickeln, während {{possessive}} Selbstvertrauen für den Erfolg in allen Fächern des britischen Lehrplans aufbaut.'
    }
  });

  // zh-Hans (Chinese Simplified)
  R('zh-Hans', 'third_form_languages', {
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
      prefix: '了解语言学习如何',
      languages_interest: '在您现有的语言兴趣基础上，开启文化理解和全球机遇的世界',
      humanities_interest: '补充您的人文兴趣，同时培养文化意识和分析思维技能',
      international_aspirations: '为您准备国际学习机会和全球职业前景',
      general: '开启文化理解和全球机遇的世界'
    },
    french: {
      languages: '在我们的法语课程中，{{childName}}将在{{possessive}}现有语言兴趣的基础上，通过蒙彼利埃的文化沉浸和真实体验培养高级沟通技能。',
      international: '在我们的法语课程中，{{childName}}将培养对国际学习和全球职业机会至关重要的文化意识和语言技能。',
      general: '在我们的法语课程中，{{childName}}将培养高级沟通技能，同时通过沉浸式学习体验探索法国文化和历史。'
    },
    spanish: {
      languages: '在我们的西班牙语课程中，{{childName}}将探索西班牙语世界的充满活力的文化，同时通过我们在萨拉曼卡的沉浸式体验培养实用语言技能。',
      community: '在我们的西班牙语课程中，{{childName}}将与多样的西班牙文化联系，非常适合对社区参与和全球理解感兴趣的人。',
      general: '在我们的西班牙语课程中，{{childName}}将探索西班牙语国家的丰富文化，同时培养全球沟通的实用语言技能。'
    },
    german: {
      academic_priority: '在我们的德语课程中，{{childName}}将通过结构化的语法学习培养系统思维技能，非常适合具有强烈学术优先级的人。',
      languages: '在我们的德语课程中，{{childName}}将发现德语的逻辑结构，同时通过我们的柏林交流项目探索德国文化。',
      general: '在我们的德语课程中，{{childName}}将通过结构化的语法学习和文化发现培养系统思维技能。'
    },
    latin: {
      classics: '在我们的拉丁语课程中，{{childName}}将擅长拉丁语培养的严谨分析思维，补充{{possessive}}对古典研究和人文学科的兴趣。',
      academic_priority: '在我们的拉丁语课程中，{{childName}}将培养拉丁语提供的逻辑思维和学术严谨性，这对高学术成就至关重要。',
      general: '在我们的拉丁语课程中，{{childName}}将培养严谨的分析技能，同时通过剑桥拉丁语课程探索西方文明的基础。'
    },
    classical: {
      humanities: '在我们的古典文明课程中，{{childName}}将探索西方文化的基础，通过古代文明研究完美补充{{possessive}}对人文学科的兴趣。',
      leadership: '在我们的古典文明课程中，{{childName}}将研究古代文明的领导力和治理，培养对现代领导角色有价值的见解。',
      general: '在我们的古典文明课程中，{{childName}}将探索西方文化的基础，同时通过古代世界研究培养分析和解释技能。'
    },
    eal: {
      international: '在我们的EAL课程中，{{childName}}将培养对国际学习成功至关重要的学术英语技能，同时在所有科目中建立信心。',
      general: '在我们的EAL课程中，{{childName}}将培养学术英语技能，同时建立在英国课程所有科目中取得成功的信心。'
    }
  });

  // IT (Italian)
  R('it', 'third_form_languages', {
    placeholders: {
      child_name: '[Nome del Bambino]',
      parent_name: '[Nome dei Genitori]',
      family_name: '[Nome di Famiglia]'
    },
    pronouns: {
      her: 'suoi',
      his: 'suoi'
    },
    welcome: {
      prefix: 'Scopri come l\'apprendimento delle lingue',
      languages_interest: 'si baserà sui tuoi interessi linguistici esistenti per aprire un mondo di comprensione culturale e opportunità globali',
      humanities_interest: 'complementerà i tuoi interessi umanistici sviluppando consapevolezza culturale e capacità di pensiero analitico',
      international_aspirations: 'ti preparerà per opportunità di studio internazionali e prospettive di carriera globali',
      general: 'aprirà un mondo di comprensione culturale e opportunità globali'
    },
    french: {
      languages: 'Nel nostro programma di francese, {{childName}} si baserà sui {{possessive}} interessi linguistici esistenti, sviluppando competenze comunicative sofisticate attraverso l\'immersione culturale e esperienze autentiche a Montpellier.',
      international: 'Nel nostro programma di francese, {{childName}} svilupperà la consapevolezza culturale e le competenze linguistiche essenziali per lo studio internazionale e le opportunità di carriera globali.',
      general: 'Nel nostro programma di francese, {{childName}} svilupperà competenze comunicative sofisticate esplorando la cultura e la storia francese attraverso esperienze di apprendimento immersive.'
    },
    spanish: {
      languages: 'Nel nostro programma di spagnolo, {{childName}} esplorerà le culture vibranti del mondo ispanofono sviluppando competenze linguistiche pratiche attraverso le nostre esperienze di immersione a Salamanca.',
      community: 'Nel nostro programma di spagnolo, {{childName}} si connetterà con diverse culture ispaniche, perfetto per chi è interessato all\'impegno comunitario e alla comprensione globale.',
      general: 'Nel nostro programma di spagnolo, {{childName}} esplorerà le ricche culture dei paesi ispanofoni sviluppando competenze linguistiche pratiche per la comunicazione globale.'
    },
    german: {
      academic_priority: 'Nel nostro programma di tedesco, {{childName}} svilupperà capacità di pensiero sistematico attraverso l\'apprendimento strutturato della grammatica, perfetto per chi ha forti priorità accademiche.',
      languages: 'Nel nostro programma di tedesco, {{childName}} scoprirà la struttura logica del tedesco esplorando la cultura tedesca attraverso i nostri programmi di scambio a Berlino.',
      general: 'Nel nostro programma di tedesco, {{childName}} svilupperà capacità di pensiero sistematico attraverso l\'apprendimento strutturato della grammatica e la scoperta culturale.'
    },
    latin: {
      classics: 'Nel nostro programma di latino, {{childName}} eccellerà nel rigoroso pensiero analitico che il latino sviluppa, complementando i {{possessive}} interessi per gli studi classici e le scienze umane.',
      academic_priority: 'Nel nostro programma di latino, {{childName}} svilupperà il pensiero logico e il rigore accademico che il latino fornisce, essenziale per alte prestazioni accademiche.',
      general: 'Nel nostro programma di latino, {{childName}} svilupperà rigorose capacità analitiche esplorando le fondamenta della civiltà occidentale attraverso il Cambridge Latin Course.'
    },
    classical: {
      humanities: 'Nel nostro programma di Civiltà Classica, {{childName}} esplorerà le fondamenta della cultura occidentale, complementando perfettamente i {{possessive}} interessi umanistici attraverso lo studio delle civiltà antiche.',
      leadership: 'Nel nostro programma di Civiltà Classica, {{childName}} studierà la leadership e la governance delle civiltà antiche, sviluppando intuizioni preziose per ruoli di leadership moderni.',
      general: 'Nel nostro programma di Civiltà Classica, {{childName}} esplorerà le fondamenta della cultura occidentale sviluppando capacità analitiche e interpretative attraverso lo studio dei mondi antichi.'
    },
    eal: {
      international: 'Nel nostro programma di EAL, {{childName}} svilupperà competenze in inglese accademico essenziali per il successo negli studi internazionali costruendo fiducia in tutte le materie.',
      general: 'Nel nostro programma di EAL, {{childName}} svilupperà competenze in inglese accademico costruendo fiducia per il successo in tutte le materie del curriculum britannico.'
    }
  });
})();