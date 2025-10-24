(function(){
  if (!window.PEN_I18N || typeof PEN_I18N.registerTranslations !== 'function') {
    console.warn('[upper_school.i18n] PEN_I18N.registerTranslations not found. Load js/loader.js first.');
    return;
  }
  const R = window.PEN_I18N.registerTranslations;

  // English (default)
  R('en', 'upper_school', {
    placeholders: {
      child_name: '[Child\'s Name]'
    },
    pronouns: {
      her: 'her',
      his: 'his',
      she: 'she',
      he: 'he'
    },
    welcome: {
      prefix: 'Discover how our Upper School will prepare {{childName}} for',
      oxbridge: 'Oxbridge success through rigorous academics and comprehensive support.',
      russell_group: 'Russell Group university success through rigorous academics and comprehensive support.',
      international: 'international university opportunities and global career pathways.',
      general: 'university success and beyond through exceptional teaching and support.'
    },
    academic: {
      stem: '{{childName}}\'s academic journey will leverage {{possessive}} strengths in sciences and mathematics. The combination of rigorous A Levels in these subjects provides the perfect foundation for competitive university applications, particularly for STEM courses at leading universities.',
      humanities: '{{childName}}\'s academic pathway will build on {{possessive}} interests in humanities, developing the analytical writing and critical thinking skills highly valued by universities. Essay-based A Levels provide excellent preparation for {{possessive}} chosen field.',
      arts: '{{childName}}\'s creative talents will flourish through specialized A Level study in the arts, combined with academic rigour that prepares students for leading creative courses at top universities.',
      general: '{{childName}}\'s academic journey will be tailored to maximize {{possessive}} potential and prepare them for university success through careful subject selection and exceptional teaching support.'
    },
    epq: {
      sciences: '{{childName}}\'s EPQ project will develop essential research skills while exploring {{possessive}} scientific interests in depth. Recent projects have included cutting-edge topics like CRISPR gene editing, sustainable energy solutions, and AI applications, perfect for demonstrating academic capability to universities.',
      humanities: '{{childName}}\'s EPQ project will develop essential research skills while exploring {{possessive}} passion for humanities through in-depth historical, philosophical, or literary research. This independent study demonstrates the intellectual curiosity that universities seek.',
      leadership: '{{childName}}\'s EPQ project will develop essential research skills while exploring leadership themes or social impact topics that align with {{possessive}} interests. This demonstrates both academic capability and personal values to university admissions teams.',
      general: '{{childName}}\'s EPQ project will develop essential research skills while exploring {{possessive}} personal interests in depth, demonstrating the independent learning skills that universities highly value.'
    },
    university: {
      oxbridge: '{{childName}}\'s university journey will be supported by comprehensive guidance specifically tailored for Oxbridge applications. With dedicated support from Mrs Jo Wintle, our Oxbridge Coordinator, {{childName}} will receive mock interview preparation and specialized guidance for entrance assessments.',
      russell_group: '{{childName}}\'s university journey will be supported by comprehensive guidance focused on securing places at leading Russell Group universities. Our track record shows consistent success at universities like Bath, Bristol, Durham, and Exeter, exactly the calibre that {{childName}} is targeting.',
      international: '{{childName}}\'s university journey will be supported by comprehensive guidance for prestigious international institutions. Mr Nick Nelson provides expert guidance for applications to universities in the USA, Canada, Europe, and Asia.',
      general: '{{childName}}\'s university journey will be supported by comprehensive guidance tailored to {{possessive}} aspirations, ensuring that {{pronoun}} achieves a place at {{possessive}} first-choice university.'
    },
    floreat: {
      leadership: '{{childName}}\'s personal development journey will build on {{possessive}} leadership interests, developing the emotional intelligence and ethical foundation essential for future leadership roles while preparing for university independence.',
      pastoral: '{{childName}}\'s personal development journey will provide comprehensive wellbeing support during this crucial transition period, ensuring that {{pronoun}} develops the resilience and life skills necessary for university success.',
      general: '{{childName}}\'s personal development journey will prepare them for the challenges and opportunities of university life through practical skills development and personal growth opportunities.'
    },
    results: {
      oxbridge: '{{childName}} will join our graduates at the most prestigious universities. While Oxbridge remains highly competitive, our annual success rate of 4-6 offers from 25 applications demonstrates the quality of our preparation. {{childName}} will also have excellent chances at other leading universities.',
      russell_group: '{{childName}} will join our graduates at leading Russell Group universities that align with {{possessive}} academic goals. Our strongest relationships with Bath, Bristol, Durham, and Exeter match perfectly with typical Russell Group aspirations.',
      general: '{{childName}} will join our graduates at universities that align with {{possessive}} academic goals and career aspirations, benefiting from our extensive network and proven track record.'
    },
    intros: {
      academic: 'Our rigorous academic structure will provide {{childName}} with the perfect foundation to achieve top grades and competitive university admission.',
      epq: 'The EPQ will showcase {{childName}}\'s independent research capabilities, providing crucial differentiation for competitive university applications.',
      university: 'Our comprehensive university support will guide {{childName}} to secure offers from target Russell Group universities.',
      floreat: 'Floreat will develop {{childName}}\'s leadership capabilities and personal resilience for university challenges and future success.',
      results: 'Join our successful graduates at the prestigious universities that match {{childName}}\'s ambitious aspirations.'
    }
  });
  // ES (Spanish)
  R('es', 'upper_school', {
    placeholders: {
      child_name: '[Nombre del Niño]'
    },
    pronouns: {
      her: 'su',
      his: 'su',
      she: 'ella',
      he: 'él'
    },
    welcome: {
      prefix: 'Descubra cómo nuestra Upper School preparará a {{childName}} para',
      oxbridge: 'el éxito en Oxbridge a través de académicos rigurosos y apoyo integral.',
      russell_group: 'el éxito en universidades del Russell Group a través de académicos rigurosos y apoyo integral.',
      international: 'oportunidades universitarias internacionales y trayectorias profesionales globales.',
      general: 'el éxito universitario y más allá a través de enseñanza y apoyo excepcionales.'
    },
    academic: {
      stem: 'El viaje académico de {{childName}} aprovechará {{possessive}} fortalezas en ciencias y matemáticas. La combinación de A Levels rigurosos en estas materias proporciona la base perfecta para aplicaciones universitarias competitivas, particularmente para cursos STEM en universidades líderes.',
      humanities: 'La trayectoria académica de {{childName}} se basará en {{possessive}} intereses en humanidades, desarrollando las habilidades de escritura analítica y pensamiento crítico altamente valoradas por las universidades. Los A Levels basados en ensayos proporcionan una excelente preparación para {{possessive}} campo elegido.',
      arts: 'Los talentos creativos de {{childName}} florecerán a través del estudio especializado de A Level en las artes, combinado con rigor académico que prepara a los estudiantes para cursos creativos líderes en las mejores universidades.',
      general: 'El viaje académico de {{childName}} se adaptará para maximizar {{possessive}} potencial y preparar{{le}} para el éxito universitario a través de una cuidadosa selección de materias y apoyo de enseñanza excepcional.'
    },
    epq: {
      sciences: 'El proyecto EPQ de {{childName}} desarrollará habilidades de investigación esenciales mientras explora {{possessive}} intereses científicos en profundidad. Proyectos recientes han incluido temas de vanguardia como edición genética CRISPR, soluciones de energía sostenible y aplicaciones de IA, perfectos para demostrar capacidad académica a las universidades.',
      humanities: 'El proyecto EPQ de {{childName}} desarrollará habilidades de investigación esenciales mientras explora {{possessive}} pasión por las humanidades a través de investigación histórica, filosófica o literaria en profundidad. Este estudio independiente demuestra la curiosidad intelectual que las universidades buscan.',
      leadership: 'El proyecto EPQ de {{childName}} desarrollará habilidades de investigación esenciales mientras explora temas de liderazgo o impacto social que se alinean con {{possessive}} intereses. Esto demuestra tanto capacidad académica como valores personales a los equipos de admisión universitaria.',
      general: 'El proyecto EPQ de {{childName}} desarrollará habilidades de investigación esenciales mientras explora {{possessive}} intereses personales en profundidad, demostrando las habilidades de aprendizaje independiente que las universidades valoran mucho.'
    },
    university: {
      oxbridge: 'El viaje universitario de {{childName}} será apoyado por orientación integral específicamente adaptada para aplicaciones a Oxbridge. Con apoyo dedicado de la Sra. Jo Wintle, nuestra Coordinadora de Oxbridge, {{childName}} recibirá preparación de entrevistas simuladas y orientación especializada para evaluaciones de ingreso.',
      russell_group: 'El viaje universitario de {{childName}} será apoyado por orientación integral enfocada en asegurar plazas en las principales universidades del Russell Group. Nuestro historial muestra éxito consistente en universidades como Bath, Bristol, Durham y Exeter, exactamente el calibre que {{childName}} está buscando.',
      international: 'El viaje universitario de {{childName}} será apoyado por orientación integral para instituciones internacionales prestigiosas. El Sr. Nick Nelson proporciona orientación experta para aplicaciones a universidades en EE.UU., Canadá, Europa y Asia.',
      general: 'El viaje universitario de {{childName}} será apoyado por orientación integral adaptada a {{possessive}} aspiraciones, asegurando que {{pronoun}} logre un lugar en {{possessive}} universidad de primera elección.'
    },
    floreat: {
      leadership: 'El viaje de desarrollo personal de {{childName}} se basará en {{possessive}} intereses de liderazgo, desarrollando la inteligencia emocional y la base ética esenciales para futuros roles de liderazgo mientras se prepara para la independencia universitaria.',
      pastoral: 'El viaje de desarrollo personal de {{childName}} proporcionará apoyo integral de bienestar durante este período de transición crucial, asegurando que {{pronoun}} desarrolle la resiliencia y las habilidades para la vida necesarias para el éxito universitario.',
      general: 'El viaje de desarrollo personal de {{childName}} preparará {{possessiveLe}} para los desafíos y oportunidades de la vida universitaria a través del desarrollo de habilidades prácticas y oportunidades de crecimiento personal.'
    },
    results: {
      oxbridge: '{{childName}} se unirá a nuestros graduados en las universidades más prestigiosas. Aunque Oxbridge sigue siendo altamente competitivo, nuestra tasa de éxito anual de 4-6 ofertas de 25 aplicaciones demuestra la calidad de nuestra preparación. {{childName}} también tendrá excelentes oportunidades en otras universidades líderes.',
      russell_group: '{{childName}} se unirá a nuestros graduados en las principales universidades del Russell Group que se alinean con {{possessive}} objetivos académicos. Nuestras relaciones más fuertes con Bath, Bristol, Durham y Exeter coinciden perfectamente con las aspiraciones típicas del Russell Group.',
      general: '{{childName}} se unirá a nuestros graduados en universidades que se alinean con {{possessive}} objetivos académicos y aspiraciones profesionales, beneficiándose de nuestra extensa red y historial comprobado.'
    },
    intros: {
      academic: 'Nuestra estructura académica rigurosa proporcionará a {{childName}} la base perfecta para lograr las mejores calificaciones y admisión universitaria competitiva.',
      epq: 'El EPQ mostrará las capacidades de investigación independiente de {{childName}}, proporcionando diferenciación crucial para aplicaciones universitarias competitivas.',
      university: 'Nuestro apoyo universitario integral guiará a {{childName}} para asegurar ofertas de universidades objetivo del Russell Group.',
      floreat: 'Floreat desarrollará las capacidades de liderazgo y resiliencia personal de {{childName}} para desafíos universitarios y éxito futuro.',
      results: 'Únase a nuestros graduados exitosos en las prestigiosas universidades que coinciden con las ambiciosas aspiraciones de {{childName}}.'
    }
  });

  // FR (French)
  R('fr', 'upper_school', {
    placeholders: {
      child_name: '[Nom de l\'Enfant]'
    },
    pronouns: {
      her: 'ses',
      his: 'ses',
      she: 'elle',
      he: 'il'
    },
    welcome: {
      prefix: 'Découvrez comment notre Upper School préparera {{childName}} pour',
      oxbridge: 'le succès à Oxbridge grâce à des études rigoureuses et un soutien complet.',
      russell_group: 'le succès dans les universités du Russell Group grâce à des études rigoureuses et un soutien complet.',
      international: 'les opportunités universitaires internationales et les parcours de carrière mondiaux.',
      general: 'le succès universitaire et au-delà grâce à un enseignement et un soutien exceptionnels.'
    },
    academic: {
      stem: 'Le parcours académique de {{childName}} tirera parti de {{possessive}} forces en sciences et mathématiques. La combinaison de A Levels rigoureux dans ces matières fournit la base parfaite pour les candidatures universitaires compétitives, en particulier pour les cours STEM dans les universités de premier plan.',
      humanities: 'Le parcours académique de {{childName}} s\'appuiera sur {{possessive}} intérêts pour les humanités, en développant les compétences en rédaction analytique et en pensée critique hautement valorisées par les universités. Les A Levels basés sur des essais offrent une excellente préparation pour {{possessive}} domaine choisi.',
      arts: 'Les talents créatifs de {{childName}} s\'épanouiront grâce à l\'étude spécialisée de A Level dans les arts, combinée à la rigueur académique qui prépare les étudiants aux cours créatifs de premier plan dans les meilleures universités.',
      general: 'Le parcours académique de {{childName}} sera adapté pour maximiser {{possessive}} potentiel et le préparer pour le succès universitaire grâce à une sélection minutieuse des matières et un soutien pédagogique exceptionnel.'
    },
    epq: {
      sciences: 'Le projet EPQ de {{childName}} développera des compétences de recherche essentielles tout en explorant {{possessive}} intérêts scientifiques en profondeur. Les projets récents ont inclus des sujets de pointe comme l\'édition génétique CRISPR, les solutions d\'énergie durable et les applications d\'IA, parfaits pour démontrer la capacité académique aux universités.',
      humanities: 'Le projet EPQ de {{childName}} développera des compétences de recherche essentielles tout en explorant {{possessive}} passion pour les humanités à travers des recherches historiques, philosophiques ou littéraires approfondies. Cette étude indépendante démontre la curiosité intellectuelle que les universités recherchent.',
      leadership: 'Le projet EPQ de {{childName}} développera des compétences de recherche essentielles tout en explorant des thèmes de leadership ou d\'impact social qui s\'alignent avec {{possessive}} intérêts. Cela démontre à la fois la capacité académique et les valeurs personnelles aux équipes d\'admission universitaires.',
      general: 'Le projet EPQ de {{childName}} développera des compétences de recherche essentielles tout en explorant {{possessive}} intérêts personnels en profondeur, démontrant les compétences d\'apprentissage indépendant que les universités valorisent hautement.'
    },
    university: {
      oxbridge: 'Le parcours universitaire de {{childName}} sera soutenu par des conseils complets spécifiquement adaptés aux candidatures à Oxbridge. Avec le soutien dédié de Mme Jo Wintle, notre Coordinatrice Oxbridge, {{childName}} recevra une préparation aux entretiens simulés et des conseils spécialisés pour les évaluations d\'entrée.',
      russell_group: 'Le parcours universitaire de {{childName}} sera soutenu par des conseils complets axés sur l\'obtention de places dans les principales universités du Russell Group. Notre bilan montre un succès constant dans des universités comme Bath, Bristol, Durham et Exeter, exactement le calibre que {{childName}} vise.',
      international: 'Le parcours universitaire de {{childName}} sera soutenu par des conseils complets pour les institutions internationales prestigieuses. M. Nick Nelson fournit des conseils d\'expert pour les candidatures aux universités aux États-Unis, au Canada, en Europe et en Asie.',
      general: 'Le parcours universitaire de {{childName}} sera soutenu par des conseils complets adaptés à {{possessive}} aspirations, en s\'assurant qu\'{{pronoun}} obtienne une place à {{possessive}} université de premier choix.'
    },
    floreat: {
      leadership: 'Le parcours de développement personnel de {{childName}} s\'appuiera sur {{possessive}} intérêts pour le leadership, en développant l\'intelligence émotionnelle et les fondements éthiques essentiels pour les futurs rôles de leadership tout en se préparant à l\'indépendance universitaire.',
      pastoral: 'Le parcours de développement personnel de {{childName}} fournira un soutien complet au bien-être pendant cette période de transition cruciale, en s\'assurant qu\'{{pronoun}} développe la résilience et les compétences de vie nécessaires au succès universitaire.',
      general: 'Le parcours de développement personnel de {{childName}} le préparera aux défis et opportunités de la vie universitaire grâce au développement de compétences pratiques et aux opportunités de croissance personnelle.'
    },
    results: {
      oxbridge: '{{childName}} rejoindra nos diplômés dans les universités les plus prestigieuses. Bien qu\'Oxbridge reste hautement compétitif, notre taux de réussite annuel de 4-6 offres sur 25 candidatures démontre la qualité de notre préparation. {{childName}} aura également d\'excellentes chances dans d\'autres universités de premier plan.',
      russell_group: '{{childName}} rejoindra nos diplômés dans les principales universités du Russell Group qui s\'alignent avec {{possessive}} objectifs académiques. Nos relations les plus solides avec Bath, Bristol, Durham et Exeter correspondent parfaitement aux aspirations typiques du Russell Group.',
      general: '{{childName}} rejoindra nos diplômés dans des universités qui s\'alignent avec {{possessive}} objectifs académiques et aspirations professionnelles, en bénéficiant de notre vaste réseau et de notre bilan éprouvé.'
    },
    intros: {
      academic: 'Notre structure académique rigoureuse fournira à {{childName}} la base parfaite pour obtenir les meilleures notes et une admission universitaire compétitive.',
      epq: 'L\'EPQ mettra en valeur les capacités de recherche indépendante de {{childName}}, fournissant une différenciation cruciale pour les candidatures universitaires compétitives.',
      university: 'Notre soutien universitaire complet guidera {{childName}} pour obtenir des offres d\'universités cibles du Russell Group.',
      floreat: 'Floreat développera les capacités de leadership et la résilience personnelle de {{childName}} pour les défis universitaires et le succès futur.',
      results: 'Rejoignez nos diplômés qui réussissent dans les universités prestigieuses qui correspondent aux aspirations ambitieuses de {{childName}}.'
    }
  });

  // DE (German)
  R('de', 'upper_school', {
    placeholders: {
      child_name: '[Name des Kindes]'
    },
    pronouns: {
      her: 'ihre',
      his: 'seine',
      she: 'sie',
      he: 'er'
    },
    welcome: {
      prefix: 'Entdecken Sie, wie unsere Upper School {{childName}} vorbereiten wird für',
      oxbridge: 'Oxbridge-Erfolg durch rigorose Akademiker und umfassende Unterstützung.',
      russell_group: 'Russell Group Universitätserfolg durch rigorose Akademiker und umfassende Unterstützung.',
      international: 'internationale Universitätsmöglichkeiten und globale Karrierewege.',
      general: 'Universitätserfolg und darüber hinaus durch außergewöhnlichen Unterricht und Unterstützung.'
    },
    academic: {
      stem: '{{childName}}s akademische Reise wird {{possessive}} Stärken in Naturwissenschaften und Mathematik nutzen. Die Kombination rigoroser A Levels in diesen Fächern bietet die perfekte Grundlage für wettbewerbsfähige Universitätsbewerbungen, insbesondere für STEM-Kurse an führenden Universitäten.',
      humanities: '{{childName}}s akademischer Weg wird auf {{possessive}} Interessen an Geisteswissenschaften aufbauen und die analytischen Schreib- und kritischen Denkfähigkeiten entwickeln, die von Universitäten hoch geschätzt werden. Essay-basierte A Levels bieten eine ausgezeichnete Vorbereitung für {{possessive}} gewähltes Feld.',
      arts: '{{childName}}s kreative Talente werden durch spezialisiertes A Level-Studium in den Künsten gedeihen, kombiniert mit akademischer Strenge, die Studenten auf führende Kreativkurse an Top-Universitäten vorbereitet.',
      general: '{{childName}}s akademische Reise wird maßgeschneidert, um {{possessive}} Potenzial zu maximieren und sie/ihn auf Universitätserfolg durch sorgfältige Fächerwahl und außergewöhnliche Unterrichtsunterstützung vorzubereiten.'
    },
    epq: {
      sciences: '{{childName}}s EPQ-Projekt wird wesentliche Forschungsfähigkeiten entwickeln, während es {{possessive}} wissenschaftliche Interessen vertieft erforscht. Aktuelle Projekte umfassten hochmoderne Themen wie CRISPR-Genbearbeitung, nachhaltige Energielösungen und KI-Anwendungen, perfekt um akademische Fähigkeiten bei Universitäten zu demonstrieren.',
      humanities: '{{childName}}s EPQ-Projekt wird wesentliche Forschungsfähigkeiten entwickeln, während es {{possessive}} Leidenschaft für Geisteswissenschaften durch vertiefte historische, philosophische oder literarische Forschung erforscht. Diese unabhängige Studie demonstriert die intellektuelle Neugier, die Universitäten suchen.',
      leadership: '{{childName}}s EPQ-Projekt wird wesentliche Forschungsfähigkeiten entwickeln, während es Führungsthemen oder soziale Auswirkungsthemen erforscht, die mit {{possessive}} Interessen übereinstimmen. Dies demonstriert sowohl akademische Fähigkeit als auch persönliche Werte bei Universitätszulassungsteams.',
      general: '{{childName}}s EPQ-Projekt wird wesentliche Forschungsfähigkeiten entwickeln, während es {{possessive}} persönliche Interessen vertieft erforscht und die unabhängigen Lernfähigkeiten demonstriert, die Universitäten hoch schätzen.'
    },
    university: {
      oxbridge: '{{childName}}s Universitätsreise wird durch umfassende Beratung speziell für Oxbridge-Bewerbungen unterstützt. Mit engagierter Unterstützung von Frau Jo Wintle, unserer Oxbridge-Koordinatorin, wird {{childName}} Probeinerview-Vorbereitung und spezialisierte Anleitung für Aufnahmeprüfungen erhalten.',
      russell_group: '{{childName}}s Universitätsreise wird durch umfassende Beratung unterstützt, die sich auf die Sicherung von Plätzen an führenden Russell Group-Universitäten konzentriert. Unsere Erfolgsbilanz zeigt konsistenten Erfolg an Universitäten wie Bath, Bristol, Durham und Exeter - genau das Kaliber, das {{childName}} anstrebt.',
      international: '{{childName}}s Universitätsreise wird durch umfassende Beratung für prestigeträchtige internationale Institutionen unterstützt. Herr Nick Nelson bietet Expertenberatung für Bewerbungen an Universitäten in den USA, Kanada, Europa und Asien.',
      general: '{{childName}}s Universitätsreise wird durch umfassende Beratung unterstützt, die auf {{possessive}} Bestrebungen zugeschnitten ist und sicherstellt, dass {{pronoun}} einen Platz an {{possessive}} Erst-Wahl-Universität erreicht.'
    },
    floreat: {
      leadership: '{{childName}}s persönliche Entwicklungsreise wird auf {{possessive}} Führungsinteressen aufbauen und die emotionale Intelligenz und ethische Grundlage entwickeln, die für zukünftige Führungsrollen wesentlich sind, während sie sich auf die Universitätsunabhängigkeit vorbereitet.',
      pastoral: '{{childName}}s persönliche Entwicklungsreise wird umfassende Wohlbefindensunterstützung während dieser entscheidenden Übergangszeit bieten und sicherstellen, dass {{pronoun}} die Resilienz und Lebenskompetenzen entwickelt, die für Universitätserfolg erforderlich sind.',
      general: '{{childName}}s persönliche Entwicklungsreise wird sie/ihn auf die Herausforderungen und Möglichkeiten des Universitätslebens durch praktische Kompetenzentwicklung und persönliche Wachstumschancen vorbereiten.'
    },
    results: {
      oxbridge: '{{childName}} wird sich unseren Absolventen an den renommiertesten Universitäten anschließen. Während Oxbridge hochkompetitiv bleibt, demonstriert unsere jährliche Erfolgsquote von 4-6 Angeboten aus 25 Bewerbungen unsere Vorbereitungsqualität. {{childName}} wird auch ausgezeichnete Chancen an anderen führenden Universitäten haben.',
      russell_group: '{{childName}} wird sich unseren Absolventen an führenden Russell Group-Universitäten anschließen, die mit {{possessive}} akademischen Zielen übereinstimmen. Unsere stärksten Beziehungen zu Bath, Bristol, Durham und Exeter passen perfekt zu typischen Russell Group-Bestrebungen.',
      general: '{{childName}} wird sich unseren Absolventen an Universitäten anschließen, die mit {{possessive}} akademischen Zielen und Karrierebestrebungen übereinstimmen und von unserem umfangreichen Netzwerk und bewährten Erfolgsbilanz profitieren.'
    },
    intros: {
      academic: 'Unsere rigorose akademische Struktur wird {{childName}} die perfekte Grundlage bieten, um Spitzennoten und wettbewerbsfähige Universitätszulassung zu erreichen.',
      epq: 'Das EPQ wird {{childName}}s unabhängige Forschungsfähigkeiten präsentieren und entscheidende Differenzierung für wettbewerbsfähige Universitätsbewerbungen bieten.',
      university: 'Unsere umfassende Universitätsunterstützung wird {{childName}} anleiten, Angebote von Ziel-Russell Group-Universitäten zu sichern.',
      floreat: 'Floreat wird {{childName}}s Führungsfähigkeiten und persönliche Resilienz für Universitätsherausforderungen und zukünftigen Erfolg entwickeln.',
      results: 'Schließen Sie sich unseren erfolgreichen Absolventen an den renommierten Universitäten an, die {{childName}}s ehrgeizigen Bestrebungen entsprechen.'
    }
  });

  // zh-Hans (Chinese Simplified)
  R('zh-Hans', 'upper_school', {
    placeholders: {
      child_name: '[孩子姓名]'
    },
    pronouns: {
      her: '她的',
      his: '他的',
      she: '她',
      he: '他'
    },
    welcome: {
      prefix: '了解我们的Upper School如何为{{childName}}准备',
      oxbridge: '通过严格的学术和全面的支持实现牛剑成功。',
      russell_group: '通过严格的学术和全面的支持实现罗素集团大学成功。',
      international: '国际大学机会和全球职业道路。',
      general: '通过卓越的教学和支持实现大学成功及更多。'
    },
    academic: {
      stem: '{{childName}}的学术之旅将利用{{possessive}}在科学和数学方面的优势。在这些科目中严格的A Level组合为竞争性大学申请提供了完美的基础，特别是对于顶尖大学的STEM课程。',
      humanities: '{{childName}}的学术道路将建立在{{possessive}}对人文学科的兴趣之上，培养大学高度重视的分析性写作和批判性思维技能。基于论文的A Level为{{possessive}}选择的领域提供了出色的准备。',
      arts: '{{childName}}的创意才能将通过艺术专业A Level学习蓬勃发展，结合学术严谨性，为学生在顶尖大学的领先创意课程做好准备。',
      general: '{{childName}}的学术之旅将量身定制，通过仔细的科目选择和卓越的教学支持，最大化{{possessive}}潜力并为{{possessive}}大学成功做准备。'
    },
    epq: {
      sciences: '{{childName}}的EPQ项目将培养基本的研究技能，同时深入探索{{possessive}}科学兴趣。最近的项目包括CRISPR基因编辑、可持续能源解决方案和人工智能应用等前沿主题，非常适合向大学展示学术能力。',
      humanities: '{{childName}}的EPQ项目将培养基本的研究技能，同时通过深入的历史、哲学或文学研究探索{{possessive}}对人文学科的热情。这种独立研究展示了大学寻求的智力好奇心。',
      leadership: '{{childName}}的EPQ项目将培养基本的研究技能，同时探索与{{possessive}}兴趣一致的领导力主题或社会影响主题。这向大学招生团队展示了学术能力和个人价值观。',
      general: '{{childName}}的EPQ项目将培养基本的研究技能，同时深入探索{{possessive}}个人兴趣，展示大学高度重视的独立学习技能。'
    },
    university: {
      oxbridge: '{{childName}}的大学之旅将得到专门为牛剑申请量身定制的全面指导的支持。在我们的牛剑协调员Jo Wintle女士的专门支持下，{{childName}}将获得模拟面试准备和入学评估的专业指导。',
      russell_group: '{{childName}}的大学之旅将得到全面指导的支持，重点是在顶尖的罗素集团大学获得名额。我们的记录显示在巴斯、布里斯托尔、杜伦和埃克塞特等大学的持续成功，正是{{childName}}所追求的水平。',
      international: '{{childName}}的大学之旅将得到针对著名国际院校的全面指导的支持。Nick Nelson先生为申请美国、加拿大、欧洲和亚洲的大学提供专家指导。',
      general: '{{childName}}的大学之旅将得到根据{{possessive}}抱负量身定制的全面指导的支持，确保{{pronoun}}在{{possessive}}首选大学获得名额。'
    },
    floreat: {
      leadership: '{{childName}}的个人发展之旅将建立在{{possessive}}领导力兴趣之上，培养未来领导角色所需的情商和道德基础，同时为大学独立做准备。',
      pastoral: '{{childName}}的个人发展之旅将在这个关键过渡期提供全面的福祉支持，确保{{pronoun}}培养大学成功所需的韧性和生活技能。',
      general: '{{childName}}的个人发展之旅将通过实践技能发展和个人成长机会为{{possessive}}大学生活的挑战和机遇做准备。'
    },
    results: {
      oxbridge: '{{childName}}将加入我们在最负盛名大学的毕业生行列。虽然牛剑仍然竞争激烈，但我们每年从25份申请中获得4-6份录取的成功率证明了我们的准备质量。{{childName}}在其他顶尖大学也将有出色的机会。',
      russell_group: '{{childName}}将加入我们在与{{possessive}}学术目标一致的顶尖罗素集团大学的毕业生行列。我们与巴斯、布里斯托尔、杜伦和埃克塞特的最牢固关系与典型的罗素集团抱负完美匹配。',
      general: '{{childName}}将加入我们在与{{possessive}}学术目标和职业抱负一致的大学的毕业生行列，受益于我们广泛的网络和经过验证的记录。'
    },
    intros: {
      academic: '我们严格的学术结构将为{{childName}}提供完美的基础，以获得顶尖成绩和竞争性大学录取。',
      epq: 'EPQ将展示{{childName}}的独立研究能力，为竞争性大学申请提供关键的差异化。',
      university: '我们全面的大学支持将指导{{childName}}获得目标罗素集团大学的录取。',
      floreat: 'Floreat将培养{{childName}}的领导能力和个人韧性，以应对大学挑战和未来成功。',
      results: '加入我们在与{{childName}}雄心勃勃的抱负相匹配的著名大学的成功毕业生行列。'
    }
  });

  // IT (Italian)
  R('it', 'upper_school', {
    placeholders: {
      child_name: '[Nome del Bambino]'
    },
    pronouns: {
      her: 'suoi',
      his: 'suoi',
      she: 'lei',
      he: 'lui'
    },
    welcome: {
      prefix: 'Scopri come la nostra Upper School preparerà {{childName}} per',
      oxbridge: 'il successo a Oxbridge attraverso studi rigorosi e supporto completo.',
      russell_group: 'il successo nelle università del Russell Group attraverso studi rigorosi e supporto completo.',
      international: 'opportunità universitarie internazionali e percorsi di carriera globali.',
      general: 'il successo universitario e oltre attraverso insegnamento e supporto eccezionali.'
    },
    academic: {
      stem: 'Il percorso accademico di {{childName}} sfrutterà i {{possessive}} punti di forza nelle scienze e nella matematica. La combinazione di A Level rigorosi in queste materie fornisce la base perfetta per candidature universitarie competitive, in particolare per corsi STEM nelle università di punta.',
      humanities: 'Il percorso accademico di {{childName}} si baserà sui {{possessive}} interessi per le scienze umane, sviluppando le capacità di scrittura analitica e pensiero critico altamente valorizzate dalle università. Gli A Level basati su saggi offrono un\'eccellente preparazione per il {{possessive}} campo scelto.',
      arts: 'I talenti creativi di {{childName}} fioriranno attraverso lo studio specializzato di A Level nelle arti, combinato con il rigore accademico che prepara gli studenti ai corsi creativi di punta nelle migliori università.',
      general: 'Il percorso accademico di {{childName}} sarà personalizzato per massimizzare il {{possessive}} potenziale e prepararl* per il successo universitario attraverso un\'attenta selezione delle materie e un supporto didattico eccezionale.'
    },
    epq: {
      sciences: 'Il progetto EPQ di {{childName}} svilupperà competenze di ricerca essenziali esplorando i {{possessive}} interessi scientifici in profondità. I progetti recenti hanno incluso argomenti all\'avanguardia come l\'editing genetico CRISPR, soluzioni energetiche sostenibili e applicazioni AI, perfetti per dimostrare capacità accademica alle università.',
      humanities: 'Il progetto EPQ di {{childName}} svilupperà competenze di ricerca essenziali esplorando la {{possessive}} passione per le scienze umane attraverso ricerche storiche, filosofiche o letterarie approfondite. Questo studio indipendente dimostra la curiosità intellettuale che le università cercano.',
      leadership: 'Il progetto EPQ di {{childName}} svilupperà competenze di ricerca essenziali esplorando temi di leadership o impatto sociale che si allineano con i {{possessive}} interessi. Questo dimostra sia la capacità accademica che i valori personali ai team di ammissione universitaria.',
      general: 'Il progetto EPQ di {{childName}} svilupperà competenze di ricerca essenziali esplorando i {{possessive}} interessi personali in profondità, dimostrando le capacità di apprendimento indipendente che le università valorizzano molto.'
    },
    university: {
      oxbridge: 'Il percorso universitario di {{childName}} sarà supportato da una guida completa specificamente adattata per le candidature a Oxbridge. Con il supporto dedicato della Sig.ra Jo Wintle, nostra Coordinatrice Oxbridge, {{childName}} riceverà preparazione per interviste simulate e guida specializzata per le valutazioni di ammissione.',
      russell_group: 'Il percorso universitario di {{childName}} sarà supportato da una guida completa focalizzata sulla garanzia di posti nelle principali università del Russell Group. Il nostro track record mostra un successo costante in università come Bath, Bristol, Durham ed Exeter, esattamente il calibro che {{childName}} sta puntando.',
      international: 'Il percorso universitario di {{childName}} sarà supportato da una guida completa per istituzioni internazionali prestigiose. Il Sig. Nick Nelson fornisce guida esperta per candidature a università negli Stati Uniti, Canada, Europa e Asia.',
      general: 'Il percorso universitario di {{childName}} sarà supportato da una guida completa adattata alle {{possessive}} aspirazioni, assicurando che {{pronoun}} ottenga un posto nella {{possessive}} università di prima scelta.'
    },
    floreat: {
      leadership: 'Il percorso di sviluppo personale di {{childName}} si baserà sui {{possessive}} interessi per la leadership, sviluppando l\'intelligenza emotiva e la base etica essenziali per futuri ruoli di leadership mentre si prepara per l\'indipendenza universitaria.',
      pastoral: 'Il percorso di sviluppo personale di {{childName}} fornirà un supporto completo al benessere durante questo periodo di transizione cruciale, assicurando che {{pronoun}} sviluppi la resilienza e le competenze di vita necessarie per il successo universitario.',
      general: 'Il percorso di sviluppo personale di {{childName}} lo preparerà per le sfide e le opportunità della vita universitaria attraverso lo sviluppo di competenze pratiche e opportunità di crescita personale.'
    },
    results: {
      oxbridge: '{{childName}} si unirà ai nostri laureati nelle università più prestigiose. Mentre Oxbridge rimane altamente competitivo, il nostro tasso di successo annuale di 4-6 offerte su 25 candidature dimostra la qualità della nostra preparazione. {{childName}} avrà anche eccellenti possibilità in altre università di punta.',
      russell_group: '{{childName}} si unirà ai nostri laureati nelle principali università del Russell Group che si allineano con i {{possessive}} obiettivi accademici. Le nostre relazioni più forti con Bath, Bristol, Durham ed Exeter corrispondono perfettamente alle aspirazioni tipiche del Russell Group.',
      general: '{{childName}} si unirà ai nostri laureati in università che si allineano con i {{possessive}} obiettivi accademici e aspirazioni professionali, beneficiando della nostra vasta rete e del track record comprovato.'
    },
    intros: {
      academic: 'La nostra struttura accademica rigorosa fornirà a {{childName}} la base perfetta per ottenere voti eccellenti e ammissione universitaria competitiva.',
      epq: 'L\'EPQ mostrerà le capacità di ricerca indipendente di {{childName}}, fornendo una differenziazione cruciale per candidature universitarie competitive.',
      university: 'Il nostro supporto universitario completo guiderà {{childName}} per ottenere offerte dalle università target del Russell Group.',
      floreat: 'Floreat svilupperà le capacità di leadership e la resilienza personale di {{childName}} per le sfide universitarie e il successo futuro.',
      results: 'Unisciti ai nostri laureati di successo nelle università prestigiose che corrispondono alle ambiziose aspirazioni di {{childName}}.'
    }
  });
})();