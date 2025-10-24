(function(){
  if (!window.PEN_I18N || typeof PEN_I18N.registerTranslations !== 'function') {
    console.warn('[third_form_sciences.i18n] PEN_I18N.registerTranslations not found. Load js/loader.js first.');
    return;
  }
  const R = window.PEN_I18N.registerTranslations;

  // EN (English)
  R('en', 'third_form_sciences', {
    placeholders: {
      child_name: '[Child Name]',
      parent_name: '[Parent Name]',
      family_name: '[Family Name]'
    },
    pronouns: {
      her: 'her',
      his: 'his',
      she: 'she',
      he: 'he'
    },
    welcome: {
      prefix: 'Discover how our STEM programme',
      sciences_and_math: 'will build on your strong interests in both sciences and mathematics, developing the analytical skills essential for top university entrance',
      sciences: 'will develop your scientific understanding through practical investigation and analytical thinking',
      mathematics: 'will strengthen your mathematical problem-solving abilities and logical thinking skills',
      academic_priority: 'will provide the rigorous academic foundation essential for university success',
      general: 'will develop your analytical thinking and problem-solving skills across all four core STEM subjects'
    },
    mathematics: {
      interest: 'In our Mathematics programme, {{childName}} will excel in {{possessive}} mathematical studies through our ability-grouped system, with opportunities for early IGCSE entry and progression to Further Mathematics.',
      academic: 'In our Mathematics programme, {{childName}} will develop the logical thinking and problem-solving skills essential for academic excellence across all subjects.',
      general: 'In our Mathematics programme, {{childName}} will develop analytical thinking skills through challenging problem-solving in our supportive ability-grouped system.'
    },
    mathematics_pathway: {
      strong_interest: 'With {{childName}}\'s strong mathematical interests and high academic priorities, {{pronoun}} will likely be placed in our top set, working towards early IGCSE entry in Fourth Form and aiming for Grade 9 achievement.',
      interest: '{{childName}}\'s mathematical interests suggest {{pronoun}} will thrive in our advanced sets, with regular assessment ensuring optimal challenge and progression.',
      academic: 'With {{childName}}\'s high academic priorities, our ability-grouped system will ensure {{pronoun}} receives appropriate mathematical challenge while building solid foundations.',
      general: 'Based on {{childName}}\'s mathematical background and interests, {{pronoun}} will be placed in the most appropriate set to challenge and support {{possessive}} development.'
    },
    biology: {
      sciences: 'In our Biology programme, {{childName}} will explore the fascinating complexity of life through hands-on investigation, developing the scientific enquiry skills essential for advanced study.',
      outdoors: 'In our Biology programme, {{childName}} will connect classroom learning with the natural world through fieldwork and ecological investigations.',
      general: 'In our Biology programme, {{childName}} will explore the fascinating world of living organisms through hands-on investigation and scientific discovery.'
    },
    chemistry: {
      sciences: 'In our Chemistry programme, {{childName}} will master the central science that connects physics and biology, developing laboratory skills essential for scientific careers.',
      academic: 'In our Chemistry programme, {{childName}} will develop rigorous analytical thinking through the systematic study of matter and its interactions.',
      general: 'In our Chemistry programme, {{childName}} will discover how matter works at the molecular level while developing essential laboratory skills.'
    },
    physics: {
      math_and_sciences: 'In our Physics programme, {{childName}} will excel in applying mathematical skills to understand the fundamental laws governing the universe.',
      sciences: 'In our Physics programme, {{childName}} will discover the elegant mathematical relationships governing natural phenomena through hands-on investigation.',
      technology: 'In our Physics programme, {{childName}} will explore how physics principles apply to modern technology and engineering applications.',
      general: 'In our Physics programme, {{childName}} will discover the fundamental laws governing everything from motion to energy through mathematical analysis.'
    }
  });

  // ES (Spanish)
  R('es', 'third_form_sciences', {
    placeholders: {
      child_name: '[Nombre del Niño]',
      parent_name: '[Nombre de los Padres]',
      family_name: '[Nombre de la Familia]'
    },
    pronouns: {
      her: 'su',
      his: 'su',
      she: 'ella',
      he: 'él'
    },
    welcome: {
      prefix: 'Descubra cómo nuestro programa STEM',
      sciences_and_math: 'se basará en sus fuertes intereses tanto en ciencias como en matemáticas, desarrollando las habilidades analíticas esenciales para el ingreso a las mejores universidades',
      sciences: 'desarrollará su comprensión científica a través de la investigación práctica y el pensamiento analítico',
      mathematics: 'fortalecerá sus habilidades de resolución de problemas matemáticos y pensamiento lógico',
      academic_priority: 'proporcionará la base académica rigurosa esencial para el éxito universitario',
      general: 'desarrollará su pensamiento analítico y habilidades de resolución de problemas en las cuatro asignaturas STEM principales'
    },
    mathematics: {
      interest: 'En nuestro programa de Matemáticas, {{childName}} sobresaldrá en {{possessive}} estudios matemáticos a través de nuestro sistema de agrupación por habilidad, con oportunidades para la entrada temprana al IGCSE y progresión a Matemáticas Adicionales.',
      academic: 'En nuestro programa de Matemáticas, {{childName}} desarrollará el pensamiento lógico y las habilidades de resolución de problemas esenciales para la excelencia académica en todas las asignaturas.',
      general: 'En nuestro programa de Matemáticas, {{childName}} desarrollará habilidades de pensamiento analítico a través de la resolución de problemas desafiantes en nuestro sistema de apoyo por habilidad.'
    },
    mathematics_pathway: {
      strong_interest: 'Con los fuertes intereses matemáticos de {{childName}} y altas prioridades académicas, {{pronoun}} probablemente será colocado en nuestro grupo superior, trabajando hacia la entrada temprana al IGCSE en Fourth Form y apuntando al logro de Grado 9.',
      interest: 'Los intereses matemáticos de {{childName}} sugieren que {{pronoun}} prosperará en nuestros grupos avanzados, con evaluación regular asegurando desafío y progresión óptimos.',
      academic: 'Con las altas prioridades académicas de {{childName}}, nuestro sistema de agrupación por habilidad asegurará que {{pronoun}} reciba el desafío matemático apropiado mientras construye bases sólidas.',
      general: 'Basado en los antecedentes matemáticos e intereses de {{childName}}, {{pronoun}} será colocado en el grupo más apropiado para desafiar y apoyar {{possessive}} desarrollo.'
    },
    biology: {
      sciences: 'En nuestro programa de Biología, {{childName}} explorará la fascinante complejidad de la vida a través de la investigación práctica, desarrollando las habilidades de investigación científica esenciales para el estudio avanzado.',
      outdoors: 'En nuestro programa de Biología, {{childName}} conectará el aprendizaje en el aula con el mundo natural a través del trabajo de campo e investigaciones ecológicas.',
      general: 'En nuestro programa de Biología, {{childName}} explorará el fascinante mundo de los organismos vivos a través de la investigación práctica y el descubrimiento científico.'
    },
    chemistry: {
      sciences: 'En nuestro programa de Química, {{childName}} dominará la ciencia central que conecta física y biología, desarrollando habilidades de laboratorio esenciales para carreras científicas.',
      academic: 'En nuestro programa de Química, {{childName}} desarrollará pensamiento analítico riguroso a través del estudio sistemático de la materia y sus interacciones.',
      general: 'En nuestro programa de Química, {{childName}} descubrirá cómo funciona la materia a nivel molecular mientras desarrolla habilidades de laboratorio esenciales.'
    },
    physics: {
      math_and_sciences: 'En nuestro programa de Física, {{childName}} sobresaldrá en aplicar habilidades matemáticas para comprender las leyes fundamentales que gobiernan el universo.',
      sciences: 'En nuestro programa de Física, {{childName}} descubrirá las elegantes relaciones matemáticas que gobiernan los fenómenos naturales a través de la investigación práctica.',
      technology: 'En nuestro programa de Física, {{childName}} explorará cómo los principios de la física se aplican a la tecnología moderna y las aplicaciones de ingeniería.',
      general: 'En nuestro programa de Física, {{childName}} descubrirá las leyes fundamentales que gobiernan todo, desde el movimiento hasta la energía, a través del análisis matemático.'
    }
  });

  // FR (French)
  R('fr', 'third_form_sciences', {
    placeholders: {
      child_name: '[Nom de l\'Enfant]',
      parent_name: '[Nom des Parents]',
      family_name: '[Nom de Famille]'
    },
    pronouns: {
      her: 'ses',
      his: 'ses',
      she: 'elle',
      he: 'il'
    },
    welcome: {
      prefix: 'Découvrez comment notre programme STEM',
      sciences_and_math: 's\'appuiera sur vos forts intérêts pour les sciences et les mathématiques, en développant les compétences analytiques essentielles pour l\'entrée dans les meilleures universités',
      sciences: 'développera votre compréhension scientifique par l\'investigation pratique et la pensée analytique',
      mathematics: 'renforcera vos capacités de résolution de problèmes mathématiques et vos compétences de pensée logique',
      academic_priority: 'fournira les bases académiques rigoureuses essentielles au succès universitaire',
      general: 'développera votre pensée analytique et vos compétences en résolution de problèmes dans les quatre matières STEM principales'
    },
    mathematics: {
      interest: 'Dans notre programme de Mathématiques, {{childName}} excellera dans {{possessive}} études mathématiques grâce à notre système de groupes de niveau, avec des opportunités d\'entrée anticipée au IGCSE et de progression vers les Mathématiques Supplémentaires.',
      academic: 'Dans notre programme de Mathématiques, {{childName}} développera la pensée logique et les compétences de résolution de problèmes essentielles à l\'excellence académique dans toutes les matières.',
      general: 'Dans notre programme de Mathématiques, {{childName}} développera des compétences de pensée analytique grâce à la résolution de problèmes stimulants dans notre système de soutien par niveau.'
    },
    mathematics_pathway: {
      strong_interest: 'Avec les forts intérêts mathématiques de {{childName}} et les hautes priorités académiques, {{pronoun}} sera probablement placé dans notre groupe supérieur, travaillant vers une entrée anticipée au IGCSE en Fourth Form et visant la note 9.',
      interest: 'Les intérêts mathématiques de {{childName}} suggèrent que {{pronoun}} s\'épanouira dans nos groupes avancés, avec une évaluation régulière assurant un défi et une progression optimaux.',
      academic: 'Avec les hautes priorités académiques de {{childName}}, notre système de groupes de niveau assurera que {{pronoun}} reçoive le défi mathématique approprié tout en construisant des bases solides.',
      general: 'Sur la base des antécédents mathématiques et des intérêts de {{childName}}, {{pronoun}} sera placé dans le groupe le plus approprié pour défier et soutenir {{possessive}} développement.'
    },
    biology: {
      sciences: 'Dans notre programme de Biologie, {{childName}} explorera la complexité fascinante de la vie par l\'investigation pratique, en développant les compétences d\'enquête scientifique essentielles aux études avancées.',
      outdoors: 'Dans notre programme de Biologie, {{childName}} reliera l\'apprentissage en classe au monde naturel par le travail de terrain et les investigations écologiques.',
      general: 'Dans notre programme de Biologie, {{childName}} explorera le monde fascinant des organismes vivants par l\'investigation pratique et la découverte scientifique.'
    },
    chemistry: {
      sciences: 'Dans notre programme de Chimie, {{childName}} maîtrisera la science centrale qui relie la physique et la biologie, en développant les compétences de laboratoire essentielles aux carrières scientifiques.',
      academic: 'Dans notre programme de Chimie, {{childName}} développera une pensée analytique rigoureuse par l\'étude systématique de la matière et de ses interactions.',
      general: 'Dans notre programme de Chimie, {{childName}} découvrira comment la matière fonctionne au niveau moléculaire tout en développant des compétences de laboratoire essentielles.'
    },
    physics: {
      math_and_sciences: 'Dans notre programme de Physique, {{childName}} excellera dans l\'application des compétences mathématiques pour comprendre les lois fondamentales qui régissent l\'univers.',
      sciences: 'Dans notre programme de Physique, {{childName}} découvrira les élégantes relations mathématiques qui régissent les phénomènes naturels par l\'investigation pratique.',
      technology: 'Dans notre programme de Physique, {{childName}} explorera comment les principes de la physique s\'appliquent à la technologie moderne et aux applications d\'ingénierie.',
      general: 'Dans notre programme de Physique, {{childName}} découvrira les lois fondamentales qui régissent tout, du mouvement à l\'énergie, par l\'analyse mathématique.'
    }
  });

  // DE (German)
  R('de', 'third_form_sciences', {
    placeholders: {
      child_name: '[Name des Kindes]',
      parent_name: '[Name der Eltern]',
      family_name: '[Familienname]'
    },
    pronouns: {
      her: 'ihre',
      his: 'seine',
      she: 'sie',
      he: 'er'
    },
    welcome: {
      prefix: 'Entdecken Sie, wie unser STEM-Programm',
      sciences_and_math: 'auf Ihren starken Interessen sowohl in Naturwissenschaften als auch in Mathematik aufbauen wird und die analytischen Fähigkeiten entwickelt, die für den Zugang zu Top-Universitäten wesentlich sind',
      sciences: 'Ihr wissenschaftliches Verständnis durch praktische Untersuchung und analytisches Denken entwickeln wird',
      mathematics: 'Ihre mathematischen Problemlösungsfähigkeiten und logischen Denkfähigkeiten stärken wird',
      academic_priority: 'die rigorose akademische Grundlage bieten wird, die für den Universitätserfolg wesentlich ist',
      general: 'Ihr analytisches Denken und Ihre Problemlösungsfähigkeiten in allen vier Kern-STEM-Fächern entwickeln wird'
    },
    mathematics: {
      interest: 'In unserem Mathematikprogramm wird {{childName}} in {{possessive}} mathematischen Studien durch unser Leistungssystem hervorragen, mit Möglichkeiten für frühen IGCSE-Eintritt und Fortschritt zu Zusatzmathematik.',
      academic: 'In unserem Mathematikprogramm wird {{childName}} das logische Denken und die Problemlösungsfähigkeiten entwickeln, die für akademische Exzellenz in allen Fächern wesentlich sind.',
      general: 'In unserem Mathematikprogramm wird {{childName}} analytische Denkfähigkeiten durch herausforderndes Problemlösen in unserem unterstützenden Leistungssystem entwickeln.'
    },
    mathematics_pathway: {
      strong_interest: 'Mit {{childName}}s starken mathematischen Interessen und hohen akademischen Prioritäten wird {{pronoun}} wahrscheinlich in unsere oberste Gruppe eingestuft und arbeitet auf frühen IGCSE-Eintritt in der Fourth Form hin und zielt auf Note 9 ab.',
      interest: '{{childName}}s mathematische Interessen deuten darauf hin, dass {{pronoun}} in unseren fortgeschrittenen Gruppen gedeihen wird, mit regelmäßiger Bewertung, die optimale Herausforderung und Fortschritt sicherstellt.',
      academic: 'Mit {{childName}}s hohen akademischen Prioritäten wird unser Leistungssystem sicherstellen, dass {{pronoun}} die angemessene mathematische Herausforderung erhält, während solide Grundlagen aufgebaut werden.',
      general: 'Basierend auf {{childName}}s mathematischem Hintergrund und Interessen wird {{pronoun}} in die am besten geeignete Gruppe eingestuft, um {{possessive}} Entwicklung zu fördern und zu unterstützen.'
    },
    biology: {
      sciences: 'In unserem Biologieprogramm wird {{childName}} die faszinierende Komplexität des Lebens durch praktische Untersuchung erforschen und die wissenschaftlichen Untersuchungsfähigkeiten entwickeln, die für fortgeschrittene Studien wesentlich sind.',
      outdoors: 'In unserem Biologieprogramm wird {{childName}} Klassenzimmerlernen mit der natürlichen Welt durch Feldarbeit und ökologische Untersuchungen verbinden.',
      general: 'In unserem Biologieprogramm wird {{childName}} die faszinierende Welt lebender Organismen durch praktische Untersuchung und wissenschaftliche Entdeckung erforschen.'
    },
    chemistry: {
      sciences: 'In unserem Chemieprogramm wird {{childName}} die zentrale Wissenschaft meistern, die Physik und Biologie verbindet, und Laborfähigkeiten entwickeln, die für wissenschaftliche Karrieren wesentlich sind.',
      academic: 'In unserem Chemieprogramm wird {{childName}} rigoroses analytisches Denken durch systematisches Studium der Materie und ihrer Wechselwirkungen entwickeln.',
      general: 'In unserem Chemieprogramm wird {{childName}} entdecken, wie Materie auf molekularer Ebene funktioniert, während wesentliche Laborfähigkeiten entwickelt werden.'
    },
    physics: {
      math_and_sciences: 'In unserem Physikprogramm wird {{childName}} darin hervorragen, mathematische Fähigkeiten anzuwenden, um die fundamentalen Gesetze zu verstehen, die das Universum regieren.',
      sciences: 'In unserem Physikprogramm wird {{childName}} die eleganten mathematischen Beziehungen entdecken, die natürliche Phänomene durch praktische Untersuchung regieren.',
      technology: 'In unserem Physikprogramm wird {{childName}} erforschen, wie physikalische Prinzipien auf moderne Technologie und Ingenieuranwendungen angewendet werden.',
      general: 'In unserem Physikprogramm wird {{childName}} die fundamentalen Gesetze entdecken, die alles von Bewegung bis Energie durch mathematische Analyse regieren.'
    }
  });

  // zh-Hans (Chinese Simplified)
  R('zh-Hans', 'third_form_sciences', {
    placeholders: {
      child_name: '[孩子姓名]',
      parent_name: '[家长姓名]',
      family_name: '[家庭姓名]'
    },
    pronouns: {
      her: '她的',
      his: '他的',
      she: '她',
      he: '他'
    },
    welcome: {
      prefix: '了解我们的STEM课程如何',
      sciences_and_math: '在您对科学和数学的强烈兴趣基础上，培养进入顶尖大学所需的分析技能',
      sciences: '通过实践调查和分析思维发展您的科学理解',
      mathematics: '加强您的数学问题解决能力和逻辑思维技能',
      academic_priority: '提供大学成功所需的严格学术基础',
      general: '在所有四门核心STEM学科中培养您的分析思维和问题解决技能'
    },
    mathematics: {
      interest: '在我们的数学课程中，{{childName}}将通过我们的能力分组系统在{{possessive}}数学学习中脱颖而出，有机会提前参加IGCSE考试并进入附加数学课程。',
      academic: '在我们的数学课程中，{{childName}}将培养对所有科目的学术卓越至关重要的逻辑思维和问题解决技能。',
      general: '在我们的数学课程中，{{childName}}将通过我们支持性能力分组系统中的挑战性问题解决来培养分析思维技能。'
    },
    mathematics_pathway: {
      strong_interest: '凭借{{childName}}对数学的强烈兴趣和高学术优先级，{{pronoun}}可能会被分配到我们的顶级组，朝着Fourth Form的提前IGCSE入学努力，目标是获得9级成绩。',
      interest: '{{childName}}对数学的兴趣表明{{pronoun}}将在我们的高级组中茁壮成长，定期评估确保最佳挑战和进步。',
      academic: '凭借{{childName}}的高学术优先级，我们的能力分组系统将确保{{pronoun}}获得适当的数学挑战，同时建立坚实的基础。',
      general: '根据{{childName}}的数学背景和兴趣，{{pronoun}}将被分配到最合适的组别，以挑战和支持{{possessive}}的发展。'
    },
    biology: {
      sciences: '在我们的生物课程中，{{childName}}将通过实践调查探索生命的迷人复杂性，培养高级学习所需的科学探究技能。',
      outdoors: '在我们的生物课程中，{{childName}}将通过实地考察和生态调查将课堂学习与自然世界联系起来。',
      general: '在我们的生物课程中，{{childName}}将通过实践调查和科学发现探索生物有机体的迷人世界。'
    },
    chemistry: {
      sciences: '在我们的化学课程中，{{childName}}将掌握连接物理和生物的核心科学，培养科学职业所需的实验室技能。',
      academic: '在我们的化学课程中，{{childName}}将通过系统研究物质及其相互作用来培养严谨的分析思维。',
      general: '在我们的化学课程中，{{childName}}将发现物质在分子水平上如何工作，同时培养基本的实验室技能。'
    },
    physics: {
      math_and_sciences: '在我们的物理课程中，{{childName}}将擅长运用数学技能来理解支配宇宙的基本法则。',
      sciences: '在我们的物理课程中，{{childName}}将通过实践调查发现支配自然现象的优雅数学关系。',
      technology: '在我们的物理课程中，{{childName}}将探索物理原理如何应用于现代技术和工程应用。',
      general: '在我们的物理课程中，{{childName}}将通过数学分析发现支配从运动到能量的一切的基本法则。'
    }
  });

  // IT (Italian)
  R('it', 'third_form_sciences', {
    placeholders: {
      child_name: '[Nome del Bambino]',
      parent_name: '[Nome dei Genitori]',
      family_name: '[Nome di Famiglia]'
    },
    pronouns: {
      her: 'suoi',
      his: 'suoi',
      she: 'lei',
      he: 'lui'
    },
    welcome: {
      prefix: 'Scopri come il nostro programma STEM',
      sciences_and_math: 'si baserà sui tuoi forti interessi sia nelle scienze che nella matematica, sviluppando le capacità analitiche essenziali per l\'ingresso nelle migliori università',
      sciences: 'svilupperà la tua comprensione scientifica attraverso l\'indagine pratica e il pensiero analitico',
      mathematics: 'rafforzerà le tue capacità di risoluzione di problemi matematici e le competenze di pensiero logico',
      academic_priority: 'fornirà la base accademica rigorosa essenziale per il successo universitario',
      general: 'svilupperà il tuo pensiero analitico e le capacità di risoluzione dei problemi in tutte e quattro le materie STEM principali'
    },
    mathematics: {
      interest: 'Nel nostro programma di Matematica, {{childName}} eccellerà nei {{possessive}} studi matematici attraverso il nostro sistema di gruppi per livello, con opportunità di ingresso anticipato all\'IGCSE e progressione verso Matematica Aggiuntiva.',
      academic: 'Nel nostro programma di Matematica, {{childName}} svilupperà il pensiero logico e le capacità di risoluzione dei problemi essenziali per l\'eccellenza accademica in tutte le materie.',
      general: 'Nel nostro programma di Matematica, {{childName}} svilupperà capacità di pensiero analitico attraverso la risoluzione di problemi stimolanti nel nostro sistema di supporto per livello.'
    },
    mathematics_pathway: {
      strong_interest: 'Con i forti interessi matematici di {{childName}} e le alte priorità accademiche, {{pronoun}} sarà probabilmente inserito nel nostro gruppo superiore, lavorando verso l\'ingresso anticipato all\'IGCSE in Fourth Form e puntando al voto 9.',
      interest: 'Gli interessi matematici di {{childName}} suggeriscono che {{pronoun}} prospererà nei nostri gruppi avanzati, con valutazione regolare che assicura sfida e progressione ottimali.',
      academic: 'Con le alte priorità accademiche di {{childName}}, il nostro sistema di gruppi per livello assicurerà che {{pronoun}} riceva la sfida matematica appropriata costruendo basi solide.',
      general: 'Basato sul background matematico e gli interessi di {{childName}}, {{pronoun}} sarà inserito nel gruppo più appropriato per sfidare e supportare {{possessive}} sviluppo.'
    },
    biology: {
      sciences: 'Nel nostro programma di Biologia, {{childName}} esplorerà l\'affascinante complessità della vita attraverso l\'indagine pratica, sviluppando le capacità di indagine scientifica essenziali per lo studio avanzato.',
      outdoors: 'Nel nostro programma di Biologia, {{childName}} collegherà l\'apprendimento in classe con il mondo naturale attraverso il lavoro sul campo e le indagini ecologiche.',
      general: 'Nel nostro programma di Biologia, {{childName}} esplorerà l\'affascinante mondo degli organismi viventi attraverso l\'indagine pratica e la scoperta scientifica.'
    },
    chemistry: {
      sciences: 'Nel nostro programma di Chimica, {{childName}} padroneggerà la scienza centrale che collega fisica e biologia, sviluppando capacità di laboratorio essenziali per carriere scientifiche.',
      academic: 'Nel nostro programma di Chimica, {{childName}} svilupperà un pensiero analitico rigoroso attraverso lo studio sistematico della materia e delle sue interazioni.',
      general: 'Nel nostro programma di Chimica, {{childName}} scoprirà come funziona la materia a livello molecolare sviluppando capacità di laboratorio essenziali.'
    },
    physics: {
      math_and_sciences: 'Nel nostro programma di Fisica, {{childName}} eccellerà nell\'applicare capacità matematiche per comprendere le leggi fondamentali che governano l\'universo.',
      sciences: 'Nel nostro programma di Fisica, {{childName}} scoprirà le eleganti relazioni matematiche che governano i fenomeni naturali attraverso l\'indagine pratica.',
      technology: 'Nel nostro programma di Fisica, {{childName}} esplorerà come i principi della fisica si applicano alla tecnologia moderna e alle applicazioni ingegneristiche.',
      general: 'Nel nostro programma di Fisica, {{childName}} scoprirà le leggi fondamentali che governano tutto, dal movimento all\'energia, attraverso l\'analisi matematica.'
    }
  });
})();