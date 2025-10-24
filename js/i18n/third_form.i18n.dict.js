(function(){
  if (!window.PEN_I18N || typeof PEN_I18N.registerTranslations !== 'function') {
    console.warn('[third_form.i18n] PEN_I18N.registerTranslations not found. Load js/loader.js first.');
    return;
  }
  const R = window.PEN_I18N.registerTranslations;

  // EN (English)
  R('en', 'third_form', {
    placeholders: {
      your_child: 'your child',
      parent_name: '[Parent Name]',
      child_name: '[Child\'s Name]'
    },
    pronouns: {
      his: 'his',
      her: 'her',
      he: 'he',
      she: 'she',
      him: 'him'
    },
    welcome: {
      sciences_high: 'provide the rigorous scientific foundation essential for {{pronoun}} university aspirations, with dedicated Biology, Chemistry, and Physics teaching from specialist teachers.',
      mathematics_high: 'challenge {{pronoun}} mathematically through our top-set programme, potentially leading to early IGCSE entry in Fourth Form.',
      humanities: 'develop {{pronoun}} analytical and communication skills through our comprehensive Humanities programme.',
      leadership: 'develop {{pronoun}} leadership potential through our Challenge programme and opportunities for peer mentoring.',
      arts: 'nurture {{pronoun}} creative expression across Art, Music, Design Technology, and Drama.',
      sports: 'provide a balanced academic and sporting programme with Games on Tuesday, Thursday, and Saturday, plus extensive activities.',
      academic_high: 'provide the perfect foundation for {{pronoun}} academic and personal development with rigorous preparation for IGCSE and GCSE studies.',
      general: 'provide the perfect foundation for {{pronoun}} academic and personal development at Cheltenham College.'
    },
    academic: {
      sciences_maths: 'With {{pronoun}} strong interests in both sciences and mathematics, {{childName}} will particularly benefit from our separate science teaching and ability-set system in Maths.',
      sciences: '{{childName}}\'s interest in sciences means {{pronounSubject}} will especially enjoy our dedicated Biology, Chemistry, and Physics lessons with specialist teachers.',
      mathematics: 'With {{pronoun}} mathematical aptitude, {{childName}} will thrive in our ability-set system, with potential for early IGCSE entry.',
      humanities: '{{childName}}\'s interest in humanities will be well-served by our form-based teaching in English, Geography, History, and TPE.',
      high_priority: 'With {{childName}}\'s high academic priorities, you\'ll find Third Form\'s broad curriculum particularly engaging as it provides the foundation for future specialisation.',
      general: 'With {{pronoun}} interests in mind, {{childName}} will find Third Form\'s broad curriculum particularly engaging as it provides the foundation for future specialisation.'
    },
    pathways: {
      sciences_description: '{{childName}} will thrive in our dedicated Science sets across Biology, Chemistry, and Physics. With three separate teachers specializing in each subject, {{pronounSubject}} will develop the deep understanding needed for A-Level success and university applications in STEM fields.',
      maths_high: 'With strong mathematical aptitude, placement in Set 1 Mathematics means {{childName}} could be working toward taking IGCSE Mathematics at the end of Fourth Form, typically achieving Grade 9 before progressing to Additional Mathematics in Fifth Form.',
      maths_general: '{{childName}}\'s mathematical ability will be carefully assessed, with placement in the most appropriate set to ensure {{pronounSubject}} receives optimal challenge and support.',
      leadership_description: '{{childName}}\'s interest in leadership will be naturally developed through our setting system. High-achieving students in top sets often become peer mentors, helping classmates and taking on presentation responsibilities that build confidence and communication skills.',
      oxbridge_title: 'Oxbridge Preparation',
      oxbridge_description: 'With Oxbridge aspirations, the setting system ensures {{childName}} receives the rigorous academic challenge needed for highly competitive applications. Top sets maintain the exceptional pace and depth required for A* grades at A-Level and beyond.',
      russell_title: 'Russell Group Preparation',
      russell_description: 'With Russell Group aspirations, the setting system ensures {{childName}} receives the rigorous academic challenge needed for competitive university applications. Top sets maintain the pace and depth required for A*-A grades at A-Level.'
    },
    form_experience: {
      leadership: 'In {{pronoun}} form group, {{childName}} will excel in collaborative projects, discussions, and presentations that develop the communication skills valued by top universities. The consistent group dynamic allows for taking on informal leadership roles and building confidence in expressing ideas.',
      humanities: 'In {{pronoun}} form group, {{childName}} will engage in collaborative projects, discussions, and presentations about English, Geography, History, and TPE that develop analytical thinking and communication skills.',
      general: 'In {{pronoun}} form group, {{childName}} will engage in collaborative projects, discussions, and presentations that develop the communication skills valued by universities. The consistent group dynamic allows for building confidence in expressing ideas.'
    },
    languages: {
      interest: '{{childName}}\'s interest in languages will be well-served by our comprehensive two-language programme. With German, French, and Spanish all available, {{pronounSubject}} will gain cultural awareness and communication skills valued by employers and universities worldwide.'
    },
    pastoral: {
      message: 'Our comprehensive pastoral care system, including {{pronoun}} dedicated Tutor and the Floreat wellbeing programme, ensures {{childName}} receives the personal support needed to thrive academically and personally.'
    },
    challenge: {
      leadership: 'The Challenge programme offers perfect opportunities for {{childName}} to develop leadership skills through Dragons\' Den presentations, team activities, and public speaking modules.',
      sports: 'The Challenge programme\'s diverse sporting activities including Squash, Rowing, swimming galas, and cross-country events will complement {{childName}}\'s sporting interests perfectly.',
      technology: 'The Challenge programme includes a Coding Day run by experts, plus Dragons\' Den presentations - perfect for developing {{childName}}\'s entrepreneurial and technical skills.',
      general: 'The Challenge programme offers {{childName}} diverse experiences from athletic development to leadership skills and entrepreneurial thinking through Dragons\' Den presentations.'
    },
    highlights: {
      maths: 'With {{childName}}\'s mathematical aptitude, placement in Set 1 Maths could lead to sitting IGCSE at the end of Fourth Form, typically achieving Grade 9, before progressing to Additional Mathematics in Fifth Form - perfect preparation for A-Level Mathematics and Further Mathematics.',
      sports: 'The Challenge programme includes diverse sporting opportunities including Squash and Rowing, plus swimming galas and cross-country events that will complement {{childName}}\'s sporting interests and develop {{pronoun}} athletic abilities further.',
      leadership: 'This programme specifically develops the leadership qualities {{childName}} is interested in, with structured modules in public speaking, presentation skills, and team leadership - all highly valued by universities and employers.'
    },
    support: {
      high_priority: 'Our support programmes, including the Foundation Project Qualification and Skills Programme, ensure {{childName}} develops the sophisticated research and study skills needed to achieve {{pronoun}} full academic potential.',
      general: 'Our support programmes ensure {{childName}} achieves {{pronoun}} full academic potential while developing essential research and study skills through the FPQ and Skills Programme.'
    },
    preparation: {
      oxbridge: 'Third Form begins {{childName}}\'s journey toward Oxbridge, with early career reflection, strategic GCSE planning, and development of the independent learning skills essential for success at the most competitive universities.',
      russell: 'Third Form begins {{childName}}\'s journey toward Russell Group success, with early career reflection and strategic planning for {{pronoun}} academic future.',
      general: 'Third Form begins {{childName}}\'s journey toward university success, with early career reflection and strategic planning for {{pronoun}} academic future.'
    }
  });

  // ES (Spanish)
  R('es', 'third_form', {
    placeholders: {
      your_child: 'su hijo',
      parent_name: '[Nombre del padre]',
      child_name: '[Nombre del niño]'
    },
    pronouns: {
      his: 'su',
      her: 'su',
      he: 'él',
      she: 'ella',
      him: 'él'
    },
    welcome: {
      sciences_high: 'proporcionará la rigurosa base científica esencial para {{pronoun}} aspiraciones universitarias, con enseñanza dedicada de Biología, Química y Física por profesores especialistas.',
      mathematics_high: 'desafiará matemáticamente a través de nuestro programa de primer nivel, potencialmente conduciendo a la entrada temprana de IGCSE en Fourth Form.',
      humanities: 'desarrollará {{pronoun}} habilidades analíticas y de comunicación a través de nuestro programa integral de Humanidades.',
      leadership: 'desarrollará {{pronoun}} potencial de liderazgo a través de nuestro programa Challenge y oportunidades de mentoría entre pares.',
      arts: 'nutrirá {{pronoun}} expresión creativa a través de Arte, Música, Tecnología de Diseño y Drama.',
      sports: 'proporcionará un programa académico y deportivo equilibrado con Games los martes, jueves y sábados, además de extensas actividades.',
      academic_high: 'proporcionará la base perfecta para {{pronoun}} desarrollo académico y personal con preparación rigurosa para estudios IGCSE y GCSE.',
      general: 'proporcionará la base perfecta para {{pronoun}} desarrollo académico y personal en Cheltenham College.'
    },
    academic: {
      sciences_maths: 'Con {{pronoun}} fuertes intereses tanto en ciencias como en matemáticas, {{childName}} se beneficiará particularmente de nuestra enseñanza científica separada y sistema de conjuntos de habilidades en Matemáticas.',
      sciences: 'El interés de {{childName}} en las ciencias significa que {{pronounSubject}} disfrutará especialmente de nuestras lecciones dedicadas de Biología, Química y Física con profesores especialistas.',
      mathematics: 'Con {{pronoun}} aptitud matemática, {{childName}} prosperará en nuestro sistema de conjuntos de habilidades, con potencial para la entrada temprana de IGCSE.',
      humanities: 'El interés de {{childName}} en humanidades será bien atendido por nuestra enseñanza basada en formularios en Inglés, Geografía, Historia y TPE.',
      high_priority: 'Con las altas prioridades académicas de {{childName}}, encontrará el amplio currículo de Third Form particularmente atractivo ya que proporciona la base para la especialización futura.',
      general: 'Con {{pronoun}} intereses en mente, {{childName}} encontrará el amplio currículo de Third Form particularmente atractivo ya que proporciona la base para la especialización futura.'
    },
    pathways: {
      sciences_description: '{{childName}} prosperará en nuestros conjuntos de Ciencias dedicados a través de Biología, Química y Física. Con tres profesores separados especializados en cada materia, {{pronounSubject}} desarrollará la comprensión profunda necesaria para el éxito de A-Level y las solicitudes universitarias en campos STEM.',
      maths_high: 'Con fuerte aptitud matemática, la colocación en el Conjunto 1 de Matemáticas significa que {{childName}} podría estar trabajando hacia tomar IGCSE Mathematics al final de Fourth Form, típicamente logrando Grado 9 antes de progresar a Additional Mathematics en Fifth Form.',
      maths_general: 'La habilidad matemática de {{childName}} será cuidadosamente evaluada, con colocación en el conjunto más apropiado para asegurar que {{pronounSubject}} reciba desafío y apoyo óptimos.',
      leadership_description: 'El interés de {{childName}} en el liderazgo se desarrollará naturalmente a través de nuestro sistema de conjuntos. Los estudiantes de alto rendimiento en los conjuntos superiores a menudo se convierten en mentores de compañeros, ayudando a los compañeros de clase y asumiendo responsabilidades de presentación que construyen confianza y habilidades de comunicación.',
      oxbridge_title: 'Preparación para Oxbridge',
      oxbridge_description: 'Con aspiraciones de Oxbridge, el sistema de conjuntos asegura que {{childName}} reciba el desafío académico riguroso necesario para solicitudes altamente competitivas. Los conjuntos superiores mantienen el ritmo excepcional y la profundidad requerida para calificaciones A* en A-Level y más allá.',
      russell_title: 'Preparación para Russell Group',
      russell_description: 'Con aspiraciones de Russell Group, el sistema de conjuntos asegura que {{childName}} reciba el desafío académico riguroso necesario para solicitudes universitarias competitivas. Los conjuntos superiores mantienen el ritmo y la profundidad requeridos para calificaciones A*-A en A-Level.'
    },
    form_experience: {
      leadership: 'En {{pronoun}} grupo de formulario, {{childName}} sobresaldrá en proyectos colaborativos, discusiones y presentaciones que desarrollan las habilidades de comunicación valoradas por las mejores universidades. La dinámica grupal consistente permite asumir roles de liderazgo informal y construir confianza en expresar ideas.',
      humanities: 'En {{pronoun}} grupo de formulario, {{childName}} participará en proyectos colaborativos, discusiones y presentaciones sobre Inglés, Geografía, Historia y TPE que desarrollan el pensamiento analítico y las habilidades de comunicación.',
      general: 'En {{pronoun}} grupo de formulario, {{childName}} participará en proyectos colaborativos, discusiones y presentaciones que desarrollan las habilidades de comunicación valoradas por las universidades. La dinámica grupal consistente permite construir confianza en expresar ideas.'
    },
    languages: {
      interest: 'El interés de {{childName}} en idiomas será bien atendido por nuestro programa integral de dos idiomas. Con alemán, francés y español todos disponibles, {{pronounSubject}} ganará conciencia cultural y habilidades de comunicación valoradas por empleadores y universidades en todo el mundo.'
    },
    pastoral: {
      message: 'Nuestro sistema integral de cuidado pastoral, incluyendo {{pronoun}} Tutor dedicado y el programa de bienestar Floreat, asegura que {{childName}} reciba el apoyo personal necesario para prosperar académica y personalmente.'
    },
    challenge: {
      leadership: 'El programa Challenge ofrece oportunidades perfectas para que {{childName}} desarrolle habilidades de liderazgo a través de presentaciones de Dragons\' Den, actividades en equipo y módulos de habla pública.',
      sports: 'Las diversas actividades deportivas del programa Challenge, incluyendo Squash, Remo, galas de natación y carreras de campo traviesa, complementarán perfectamente los intereses deportivos de {{childName}}.',
      technology: 'El programa Challenge incluye un Día de Codificación dirigido por expertos, más presentaciones de Dragons\' Den - perfecto para desarrollar las habilidades empresariales y técnicas de {{childName}}.',
      general: 'El programa Challenge ofrece a {{childName}} experiencias diversas desde desarrollo atlético hasta habilidades de liderazgo y pensamiento empresarial a través de presentaciones de Dragons\' Den.'
    },
    highlights: {
      maths: 'Con la aptitud matemática de {{childName}}, la colocación en el Conjunto 1 de Matemáticas podría llevar a tomar IGCSE al final de Fourth Form, típicamente logrando Grado 9, antes de progresar a Additional Mathematics en Fifth Form - preparación perfecta para A-Level Mathematics y Further Mathematics.',
      sports: 'El programa Challenge incluye diversas oportunidades deportivas incluyendo Squash y Remo, más galas de natación y eventos de campo traviesa que complementarán los intereses deportivos de {{childName}} y desarrollarán {{pronoun}} habilidades atléticas más.',
      leadership: 'Este programa desarrolla específicamente las cualidades de liderazgo en las que {{childName}} está interesado, con módulos estructurados en habla pública, habilidades de presentación y liderazgo de equipo - todos altamente valorados por universidades y empleadores.'
    },
    support: {
      high_priority: 'Nuestros programas de apoyo, incluyendo la Foundation Project Qualification y el Skills Programme, aseguran que {{childName}} desarrolle las sofisticadas habilidades de investigación y estudio necesarias para lograr {{pronoun}} pleno potencial académico.',
      general: 'Nuestros programas de apoyo aseguran que {{childName}} logre {{pronoun}} pleno potencial académico mientras desarrolla habilidades esenciales de investigación y estudio a través del FPQ y Skills Programme.'
    },
    preparation: {
      oxbridge: 'Third Form comienza el viaje de {{childName}} hacia Oxbridge, con reflexión temprana de carrera, planificación estratégica de GCSE y desarrollo de las habilidades de aprendizaje independiente esenciales para el éxito en las universidades más competitivas.',
      russell: 'Third Form comienza el viaje de {{childName}} hacia el éxito del Russell Group, con reflexión temprana de carrera y planificación estratégica para {{pronoun}} futuro académico.',
      general: 'Third Form comienza el viaje de {{childName}} hacia el éxito universitario, con reflexión temprana de carrera y planificación estratégica para {{pronoun}} futuro académico.'
    }
  });

  // FR (French)
  R('fr', 'third_form', {
    placeholders: {
      your_child: 'votre enfant',
      parent_name: '[Nom du parent]',
      child_name: '[Nom de l\'enfant]'
    },
    pronouns: {
      his: 'son',
      her: 'sa',
      he: 'il',
      she: 'elle',
      him: 'lui'
    },
    welcome: {
      sciences_high: 'fournira les bases scientifiques rigoureuses essentielles pour {{pronoun}} aspirations universitaires, avec un enseignement dédié de la biologie, de la chimie et de la physique par des enseignants spécialistes.',
      mathematics_high: 'mettra à l\'épreuve mathématiquement grâce à notre programme de premier niveau, conduisant potentiellement à l\'entrée précoce de l\'IGCSE en Fourth Form.',
      humanities: 'développera {{pronoun}} compétences analytiques et de communication grâce à notre programme complet en sciences humaines.',
      leadership: 'développera {{pronoun}} potentiel de leadership grâce à notre programme Challenge et aux opportunités de mentorat par les pairs.',
      arts: 'nourrira {{pronoun}} expression créative à travers l\'art, la musique, la technologie de conception et le théâtre.',
      sports: 'fournira un programme académique et sportif équilibré avec des jeux les mardis, jeudis et samedis, ainsi que de nombreuses activités.',
      academic_high: 'fournira la base parfaite pour {{pronoun}} développement académique et personnel avec une préparation rigoureuse aux études IGCSE et GCSE.',
      general: 'fournira la base parfaite pour {{pronoun}} développement académique et personnel au Cheltenham College.'
    },
    academic: {
      sciences_maths: 'Avec {{pronoun}} forts intérêts à la fois dans les sciences et les mathématiques, {{childName}} bénéficiera particulièrement de notre enseignement scientifique séparé et du système de groupes de compétences en mathématiques.',
      sciences: 'L\'intérêt de {{childName}} pour les sciences signifie que {{pronounSubject}} appréciera particulièrement nos cours dédiés de biologie, chimie et physique avec des enseignants spécialistes.',
      mathematics: 'Avec {{pronoun}} aptitude mathématique, {{childName}} s\'épanouira dans notre système de groupes de compétences, avec un potentiel d\'entrée précoce de l\'IGCSE.',
      humanities: 'L\'intérêt de {{childName}} pour les sciences humaines sera bien servi par notre enseignement basé sur les formulaires en anglais, géographie, histoire et TPE.',
      high_priority: 'Avec les hautes priorités académiques de {{childName}}, vous trouverez le large programme de Third Form particulièrement engageant car il fournit la base pour la spécialisation future.',
      general: 'Avec {{pronoun}} intérêts à l\'esprit, {{childName}} trouvera le large programme de Third Form particulièrement engageant car il fournit la base pour la spécialisation future.'
    },
    pathways: {
      sciences_description: '{{childName}} s\'épanouira dans nos groupes de sciences dédiés à travers la biologie, la chimie et la physique. Avec trois enseignants séparés spécialisés dans chaque matière, {{pronounSubject}} développera la compréhension approfondie nécessaire pour le succès A-Level et les candidatures universitaires dans les domaines STEM.',
      maths_high: 'Avec une forte aptitude mathématique, le placement dans le groupe 1 de mathématiques signifie que {{childName}} pourrait travailler vers la prise de l\'IGCSE Mathematics à la fin de Fourth Form, atteignant généralement la note 9 avant de progresser vers Additional Mathematics en Fifth Form.',
      maths_general: 'L\'aptitude mathématique de {{childName}} sera soigneusement évaluée, avec un placement dans le groupe le plus approprié pour assurer que {{pronounSubject}} reçoive un défi et un soutien optimaux.',
      leadership_description: 'L\'intérêt de {{childName}} pour le leadership se développera naturellement grâce à notre système de groupes. Les élèves très performants dans les groupes supérieurs deviennent souvent des mentors pairs, aidant les camarades de classe et assumant des responsabilités de présentation qui renforcent la confiance et les compétences en communication.',
      oxbridge_title: 'Préparation à Oxbridge',
      oxbridge_description: 'Avec des aspirations Oxbridge, le système de groupes garantit que {{childName}} reçoive le défi académique rigoureux nécessaire pour des candidatures hautement compétitives. Les groupes supérieurs maintiennent le rythme exceptionnel et la profondeur requis pour les notes A* au A-Level et au-delà.',
      russell_title: 'Préparation au Russell Group',
      russell_description: 'Avec des aspirations Russell Group, le système de groupes garantit que {{childName}} reçoive le défi académique rigoureux nécessaire pour des candidatures universitaires compétitives. Les groupes supérieurs maintiennent le rythme et la profondeur requis pour les notes A*-A au A-Level.'
    },
    form_experience: {
      leadership: 'Dans {{pronoun}} groupe de formulaire, {{childName}} excellera dans les projets collaboratifs, les discussions et les présentations qui développent les compétences en communication valorisées par les meilleures universités. La dynamique de groupe cohérente permet d\'assumer des rôles de leadership informel et de renforcer la confiance dans l\'expression des idées.',
      humanities: 'Dans {{pronoun}} groupe de formulaire, {{childName}} s\'engagera dans des projets collaboratifs, des discussions et des présentations sur l\'anglais, la géographie, l\'histoire et le TPE qui développent la pensée analytique et les compétences en communication.',
      general: 'Dans {{pronoun}} groupe de formulaire, {{childName}} s\'engagera dans des projets collaboratifs, des discussions et des présentations qui développent les compétences en communication valorisées par les universités. La dynamique de groupe cohérente permet de renforcer la confiance dans l\'expression des idées.'
    },
    languages: {
      interest: 'L\'intérêt de {{childName}} pour les langues sera bien servi par notre programme complet de deux langues. Avec l\'allemand, le français et l\'espagnol tous disponibles, {{pronounSubject}} acquerra une conscience culturelle et des compétences en communication valorisées par les employeurs et les universités du monde entier.'
    },
    pastoral: {
      message: 'Notre système complet de soins pastoraux, y compris {{pronoun}} Tuteur dédié et le programme de bien-être Floreat, garantit que {{childName}} reçoive le soutien personnel nécessaire pour s\'épanouir académiquement et personnellement.'
    },
    challenge: {
      leadership: 'Le programme Challenge offre des opportunités parfaites pour que {{childName}} développe des compétences en leadership grâce aux présentations Dragons\' Den, aux activités d\'équipe et aux modules de prise de parole en public.',
      sports: 'Les diverses activités sportives du programme Challenge, notamment le squash, l\'aviron, les galas de natation et les courses de cross-country, complèteront parfaitement les intérêts sportifs de {{childName}}.',
      technology: 'Le programme Challenge comprend une journée de codage animée par des experts, ainsi que des présentations Dragons\' Den - parfait pour développer les compétences entrepreneuriales et techniques de {{childName}}.',
      general: 'Le programme Challenge offre à {{childName}} des expériences diverses allant du développement athlétique aux compétences en leadership et à la pensée entrepreneuriale grâce aux présentations Dragons\' Den.'
    },
    highlights: {
      maths: 'Avec l\'aptitude mathématique de {{childName}}, le placement dans le groupe 1 de mathématiques pourrait conduire à passer l\'IGCSE à la fin de Fourth Form, atteignant généralement la note 9, avant de progresser vers Additional Mathematics en Fifth Form - préparation parfaite pour A-Level Mathematics et Further Mathematics.',
      sports: 'Le programme Challenge comprend diverses opportunités sportives notamment le squash et l\'aviron, ainsi que des galas de natation et des événements de cross-country qui complèteront les intérêts sportifs de {{childName}} et développeront {{pronoun}} capacités athlétiques davantage.',
      leadership: 'Ce programme développe spécifiquement les qualités de leadership auxquelles {{childName}} s\'intéresse, avec des modules structurés en prise de parole en public, compétences de présentation et leadership d\'équipe - tous hautement valorisés par les universités et les employeurs.'
    },
    support: {
      high_priority: 'Nos programmes de soutien, y compris la Foundation Project Qualification et le Skills Programme, garantissent que {{childName}} développe les compétences sophistiquées de recherche et d\'étude nécessaires pour atteindre {{pronoun}} plein potentiel académique.',
      general: 'Nos programmes de soutien garantissent que {{childName}} atteigne {{pronoun}} plein potentiel académique tout en développant des compétences essentielles de recherche et d\'étude grâce au FPQ et au Skills Programme.'
    },
    preparation: {
      oxbridge: 'Third Form commence le voyage de {{childName}} vers Oxbridge, avec une réflexion précoce sur la carrière, une planification stratégique du GCSE et le développement des compétences d\'apprentissage indépendant essentielles pour réussir dans les universités les plus compétitives.',
      russell: 'Third Form commence le voyage de {{childName}} vers le succès du Russell Group, avec une réflexion précoce sur la carrière et une planification stratégique pour {{pronoun}} avenir académique.',
      general: 'Third Form commence le voyage de {{childName}} vers le succès universitaire, avec une réflexion précoce sur la carrière et une planification stratégique pour {{pronoun}} avenir académique.'
    }
  });

  // DE (German) - Adding comprehensive translations
  R('de', 'third_form', {
    placeholders: {
      your_child: 'Ihr Kind',
      parent_name: '[Name des Elternteils]',
      child_name: '[Name des Kindes]'
    },
    pronouns: {
      his: 'sein',
      her: 'ihr',
      he: 'er',
      she: 'sie',
      him: 'ihn'
    },
    welcome: {
      sciences_high: 'wird die strenge wissenschaftliche Grundlage liefern, die für {{pronoun}} universitäre Ambitionen unerlässlich ist, mit engagiertem Unterricht in Biologie, Chemie und Physik durch spezialisierte Lehrer.',
      mathematics_high: 'wird mathematisch durch unser Top-Set-Programm herausfordern, möglicherweise führt dies zu einem frühen IGCSE-Eintritt in Fourth Form.',
      humanities: 'wird {{pronoun}} analytische und kommunikative Fähigkeiten durch unser umfassendes Geisteswissenschaftsprogramm entwickeln.',
      leadership: 'wird {{pronoun}} Führungspotenzial durch unser Challenge-Programm und Möglichkeiten für Peer-Mentoring entwickeln.',
      arts: 'wird {{pronoun}} kreativen Ausdruck durch Kunst, Musik, Designtechnologie und Drama fördern.',
      sports: 'wird ein ausgewogenes akademisches und sportliches Programm mit Spielen am Dienstag, Donnerstag und Samstag sowie umfangreichen Aktivitäten bieten.',
      academic_high: 'wird die perfekte Grundlage für {{pronoun}} akademische und persönliche Entwicklung mit strenger Vorbereitung auf IGCSE- und GCSE-Studien bieten.',
      general: 'wird die perfekte Grundlage für {{pronoun}} akademische und persönliche Entwicklung am Cheltenham College bieten.'
    },
    academic: {
      sciences_maths: 'Mit {{pronoun}} starken Interessen sowohl in den Naturwissenschaften als auch in der Mathematik wird {{childName}} besonders von unserem separaten naturwissenschaftlichen Unterricht und dem Fähigkeitsgruppensystem in Mathematik profitieren.',
      sciences: '{{childName}}s Interesse an den Naturwissenschaften bedeutet, dass {{pronounSubject}} besonders unsere engagierten Biologie-, Chemie- und Physikstunden mit spezialisierten Lehrern genießen wird.',
      mathematics: 'Mit {{pronoun}} mathematischen Fähigkeiten wird {{childName}} in unserem Fähigkeitsgruppensystem gedeihen, mit Potenzial für einen frühen IGCSE-Eintritt.',
      humanities: '{{childName}}s Interesse an Geisteswissenschaften wird durch unseren formularbasierten Unterricht in Englisch, Geographie, Geschichte und TPE gut bedient.',
      high_priority: 'Mit {{childName}}s hohen akademischen Prioritäten werden Sie das breite Curriculum von Third Form besonders ansprechend finden, da es die Grundlage für zukünftige Spezialisierung bietet.',
      general: 'Mit {{pronoun}} Interessen im Hinterkopf wird {{childName}} das breite Curriculum von Third Form besonders ansprechend finden, da es die Grundlage für zukünftige Spezialisierung bietet.'
    },
    pathways: {
      sciences_description: '{{childName}} wird in unseren engagierten Naturwissenschaftsgruppen in Biologie, Chemie und Physik gedeihen. Mit drei separaten Lehrern, die auf jedes Fach spezialisiert sind, wird {{pronounSubject}} das tiefe Verständnis entwickeln, das für A-Level-Erfolg und Universitätsbewerbungen in STEM-Bereichen erforderlich ist.',
      maths_high: 'Mit starken mathematischen Fähigkeiten bedeutet die Platzierung in Set 1 Mathematik, dass {{childName}} darauf hinarbeiten könnte, IGCSE Mathematics am Ende von Fourth Form zu absolvieren, typischerweise Note 9 zu erreichen, bevor zu Additional Mathematics in Fifth Form fortgeschritten wird.',
      maths_general: '{{childName}}s mathematische Fähigkeiten werden sorgfältig bewertet, mit Platzierung in der am besten geeigneten Gruppe, um sicherzustellen, dass {{pronounSubject}} optimale Herausforderung und Unterstützung erhält.',
      leadership_description: '{{childName}}s Interesse an Führung wird sich natürlich durch unser Gruppensystem entwickeln. Hochleistende Schüler in Top-Gruppen werden oft zu Peer-Mentoren, helfen Klassenkameraden und übernehmen Präsentationsverantwortlichkeiten, die Vertrauen und Kommunikationsfähigkeiten aufbauen.',
      oxbridge_title: 'Oxbridge-Vorbereitung',
      oxbridge_description: 'Mit Oxbridge-Ambitionen stellt das Gruppensystem sicher, dass {{childName}} die strenge akademische Herausforderung erhält, die für hochkompetitive Bewerbungen erforderlich ist. Top-Gruppen halten das außergewöhnliche Tempo und die Tiefe aufrecht, die für A*-Noten auf A-Level und darüber hinaus erforderlich sind.',
      russell_title: 'Russell Group-Vorbereitung',
      russell_description: 'Mit Russell Group-Ambitionen stellt das Gruppensystem sicher, dass {{childName}} die strenge akademische Herausforderung erhält, die für wettbewerbsfähige Universitätsbewerbungen erforderlich ist. Top-Gruppen halten das Tempo und die Tiefe aufrecht, die für A*-A-Noten auf A-Level erforderlich sind.'
    },
    form_experience: {
      leadership: 'In {{pronoun}} Formulargruppe wird {{childName}} sich in kollaborativen Projekten, Diskussionen und Präsentationen auszeichnen, die die von Top-Universitäten geschätzten Kommunikationsfähigkeiten entwickeln. Die konsistente Gruppendynamik ermöglicht es, informelle Führungsrollen zu übernehmen und Vertrauen beim Ausdrücken von Ideen aufzubauen.',
      humanities: 'In {{pronoun}} Formulargruppe wird {{childName}} sich in kollaborativen Projekten, Diskussionen und Präsentationen über Englisch, Geographie, Geschichte und TPE engagieren, die analytisches Denken und Kommunikationsfähigkeiten entwickeln.',
      general: 'In {{pronoun}} Formulargruppe wird {{childName}} sich in kollaborativen Projekten, Diskussionen und Präsentationen engagieren, die die von Universitäten geschätzten Kommunikationsfähigkeiten entwickeln. Die konsistente Gruppendynamik ermöglicht es, Vertrauen beim Ausdrücken von Ideen aufzubauen.'
    },
    languages: {
      interest: '{{childName}}s Interesse an Sprachen wird durch unser umfassendes Zwei-Sprachen-Programm gut bedient. Mit Deutsch, Französisch und Spanisch, die alle verfügbar sind, wird {{pronounSubject}} kulturelles Bewusstsein und Kommunikationsfähigkeiten gewinnen, die von Arbeitgebern und Universitäten weltweit geschätzt werden.'
    },
    pastoral: {
      message: 'Unser umfassendes pastorales Betreuungssystem, einschließlich {{pronoun}} engagiertem Tutor und dem Floreat-Wellbeing-Programm, stellt sicher, dass {{childName}} die persönliche Unterstützung erhält, die erforderlich ist, um akademisch und persönlich zu gedeihen.'
    },
    challenge: {
      leadership: 'Das Challenge-Programm bietet perfekte Gelegenheiten für {{childName}}, Führungsfähigkeiten durch Dragons\' Den-Präsentationen, Teamaktivitäten und öffentliche Rednermodule zu entwickeln.',
      sports: 'Die vielfältigen sportlichen Aktivitäten des Challenge-Programms, einschließlich Squash, Rudern, Schwimmgalas und Crosslauf-Veranstaltungen, werden {{childName}}s sportliche Interessen perfekt ergänzen.',
      technology: 'Das Challenge-Programm umfasst einen Coding-Tag, der von Experten geleitet wird, plus Dragons\' Den-Präsentationen - perfekt für die Entwicklung von {{childName}}s unternehmerischen und technischen Fähigkeiten.',
      general: 'Das Challenge-Programm bietet {{childName}} vielfältige Erfahrungen von athletischer Entwicklung bis hin zu Führungsfähigkeiten und unternehmerischem Denken durch Dragons\' Den-Präsentationen.'
    },
    highlights: {
      maths: 'Mit {{childName}}s mathematischen Fähigkeiten könnte die Platzierung in Set 1 Mathematik dazu führen, dass IGCSE am Ende von Fourth Form absolviert wird, typischerweise Note 9 erreicht wird, bevor zu Additional Mathematics in Fifth Form fortgeschritten wird - perfekte Vorbereitung für A-Level Mathematics und Further Mathematics.',
      sports: 'Das Challenge-Programm umfasst vielfältige sportliche Möglichkeiten, einschließlich Squash und Rudern, plus Schwimmgalas und Crosslauf-Veranstaltungen, die {{childName}}s sportliche Interessen ergänzen und {{pronoun}} athletische Fähigkeiten weiter entwickeln werden.',
      leadership: 'Dieses Programm entwickelt speziell die Führungsqualitäten, an denen {{childName}} interessiert ist, mit strukturierten Modulen in öffentlichem Reden, Präsentationsfähigkeiten und Teamführung - alle von Universitäten und Arbeitgebern hoch geschätzt.'
    },
    support: {
      high_priority: 'Unsere Unterstützungsprogramme, einschließlich der Foundation Project Qualification und des Skills Programme, stellen sicher, dass {{childName}} die ausgefeilten Forschungs- und Studienfähigkeiten entwickelt, die erforderlich sind, um {{pronoun}} volles akademisches Potenzial zu erreichen.',
      general: 'Unsere Unterstützungsprogramme stellen sicher, dass {{childName}} {{pronoun}} volles akademisches Potenzial erreicht, während wesentliche Forschungs- und Studienfähigkeiten durch das FPQ und Skills Programme entwickelt werden.'
    },
    preparation: {
      oxbridge: 'Third Form beginnt {{childName}}s Reise in Richtung Oxbridge, mit früher Karrierereflexion, strategischer GCSE-Planung und Entwicklung der unabhängigen Lernfähigkeiten, die für den Erfolg an den wettbewerbsfähigsten Universitäten unerlässlich sind.',
      russell: 'Third Form beginnt {{childName}}s Reise in Richtung Russell Group-Erfolg, mit früher Karrierereflexion und strategischer Planung für {{pronoun}} akademische Zukunft.',
      general: 'Third Form beginnt {{childName}}s Reise in Richtung Universitätserfolg, mit früher Karrierereflexion und strategischer Planung für {{pronoun}} akademische Zukunft.'
    }
  });

  // zh-Hans (Chinese Simplified)
  R('zh-Hans', 'third_form', {
    placeholders: {
      your_child: '您的孩子',
      parent_name: '[家长姓名]',
      child_name: '[孩子姓名]'
    },
    pronouns: {
      his: '他的',
      her: '她的',
      he: '他',
      she: '她',
      him: '他'
    },
    welcome: {
      sciences_high: '将为{{pronoun}}大学抱负提供严格的科学基础，由专业教师进行生物学、化学和物理学的专门教学。',
      mathematics_high: '通过我们的顶级课程在数学上进行挑战，可能在第四年级早期进入IGCSE。',
      humanities: '通过我们全面的人文学科课程发展{{pronoun}}分析和沟通技能。',
      leadership: '通过我们的挑战课程和同伴指导机会发展{{pronoun}}领导潜力。',
      arts: '通过艺术、音乐、设计技术和戏剧培养{{pronoun}}创造性表达。',
      sports: '提供平衡的学术和体育课程，周二、周四和周六进行游戏，以及广泛的活动。',
      academic_high: '为{{pronoun}}学术和个人发展提供完美的基础，严格准备IGCSE和GCSE学习。',
      general: '在切尔滕纳姆学院为{{pronoun}}学术和个人发展提供完美的基础。'
    },
    academic: {
      sciences_maths: '凭借{{pronoun}}对科学和数学的浓厚兴趣，{{childName}}将特别受益于我们的独立科学教学和数学能力分组系统。',
      sciences: '{{childName}}对科学的兴趣意味着{{pronounSubject}}将特别喜欢我们由专业教师教授的生物学、化学和物理学专门课程。',
      mathematics: '凭借{{pronoun}}数学能力，{{childName}}将在我们的能力分组系统中茁壮成长，有可能早期进入IGCSE。',
      humanities: '{{childName}}对人文学科的兴趣将通过我们基于表格的英语、地理、历史和TPE教学得到很好的服务。',
      high_priority: '凭借{{childName}}的高学术优先级，您会发现第三年级的广泛课程特别吸引人，因为它为未来的专业化提供了基础。',
      general: '考虑到{{pronoun}}兴趣，{{childName}}会发现第三年级的广泛课程特别吸引人，因为它为未来的专业化提供了基础。'
    },
    pathways: {
      sciences_description: '{{childName}}将在我们专门的生物学、化学和物理学科学组中茁壮成长。有三位专门从事每个学科的独立教师，{{pronounSubject}}将发展A-Level成功和STEM领域大学申请所需的深刻理解。',
      maths_high: '凭借强大的数学能力，在数学第1组中的安置意味着{{childName}}可能正在努力在第四年级结束时参加IGCSE数学考试，通常获得9级，然后在第五年级进入附加数学。',
      maths_general: '{{childName}}的数学能力将被仔细评估，在最合适的组中安置以确保{{pronounSubject}}获得最佳挑战和支持。',
      leadership_description: '{{childName}}对领导力的兴趣将通过我们的分组系统自然发展。顶级组中的高成就学生通常成为同伴导师，帮助同学并承担演示责任，建立信心和沟通技能。',
      oxbridge_title: '牛津剑桥准备',
      oxbridge_description: '凭借牛津剑桥的抱负，分组系统确保{{childName}}获得高度竞争性申请所需的严格学术挑战。顶级组保持A-Level及以上所需的A*成绩的卓越速度和深度。',
      russell_title: '罗素集团准备',
      russell_description: '凭借罗素集团的抱负，分组系统确保{{childName}}获得竞争性大学申请所需的严格学术挑战。顶级组保持A-Level所需的A*-A成绩的速度和深度。'
    },
    form_experience: {
      leadership: '在{{pronoun}}表格组中，{{childName}}将在协作项目、讨论和演示中表现出色，发展顶尖大学重视的沟通技能。一致的团队动态允许承担非正式的领导角色并建立表达想法的信心。',
      humanities: '在{{pronoun}}表格组中，{{childName}}将参与关于英语、地理、历史和TPE的协作项目、讨论和演示，发展分析思维和沟通技能。',
      general: '在{{pronoun}}表格组中，{{childName}}将参与协作项目、讨论和演示，发展大学重视的沟通技能。一致的团队动态允许建立表达想法的信心。'
    },
    languages: {
      interest: '{{childName}}对语言的兴趣将通过我们全面的双语课程得到很好的服务。德语、法语和西班牙语都可用，{{pronounSubject}}将获得雇主和全球大学重视的文化意识和沟通技能。'
    },
    pastoral: {
      message: '我们全面的牧养关怀系统，包括{{pronoun}}专门的导师和Floreat福利计划，确保{{childName}}获得在学术和个人上茁壮成长所需的个人支持。'
    },
    challenge: {
      leadership: '挑战计划为{{childName}}通过龙穴演示、团队活动和公开演讲模块发展领导技能提供了完美的机会。',
      sports: '挑战计划的多样化体育活动，包括壁球、划船、游泳比赛和越野赛事，将完美地补充{{childName}}的体育兴趣。',
      technology: '挑战计划包括由专家主持的编码日，以及龙穴演示 - 非常适合发展{{childName}}的创业和技术技能。',
      general: '挑战计划为{{childName}}提供从运动发展到领导技能和通过龙穴演示的创业思维的多样化体验。'
    },
    highlights: {
      maths: '凭借{{childName}}的数学能力，在数学第1组中的安置可能导致在第四年级结束时参加IGCSE考试，通常获得9级，然后在第五年级进入附加数学 - 为A-Level数学和高等数学做好完美准备。',
      sports: '挑战计划包括多样化的体育机会，包括壁球和划船，以及游泳比赛和越野赛事，将补充{{childName}}的体育兴趣并进一步发展{{pronoun}}运动能力。',
      leadership: '该计划专门发展{{childName}}感兴趣的领导素质，具有公开演讲、演示技能和团队领导的结构化模块 - 所有这些都受到大学和雇主的高度重视。'
    },
    support: {
      high_priority: '我们的支持计划，包括基础项目资格和技能计划，确保{{childName}}发展实现{{pronoun}}全部学术潜力所需的复杂研究和学习技能。',
      general: '我们的支持计划确保{{childName}}通过FPQ和技能计划实现{{pronoun}}全部学术潜力，同时发展基本的研究和学习技能。'
    },
    preparation: {
      oxbridge: '第三年级开始{{childName}}通往牛津剑桥的旅程，早期职业反思，GCSE战略规划，以及发展在最具竞争力的大学取得成功所必需的独立学习技能。',
      russell: '第三年级开始{{childName}}通往罗素集团成功的旅程，早期职业反思和为{{pronoun}}学术未来进行战略规划。',
      general: '第三年级开始{{childName}}通往大学成功的旅程，早期职业反思和为{{pronoun}}学术未来进行战略规划。'
    }
  });

  // IT (Italian)
  R('it', 'third_form', {
    placeholders: {
      your_child: 'suo figlio',
      parent_name: '[Nome del genitore]',
      child_name: '[Nome del bambino]'
    },
    pronouns: {
      his: 'suo',
      her: 'sua',
      he: 'lui',
      she: 'lei',
      him: 'lui'
    },
    welcome: {
      sciences_high: 'fornirà la rigorosa base scientifica essenziale per {{pronoun}} aspirazioni universitarie, con insegnamento dedicato di Biologia, Chimica e Fisica da insegnanti specialisti.',
      mathematics_high: 'sfiderà matematicamente attraverso il nostro programma di primo livello, potenzialmente portando all\'ingresso anticipato dell\'IGCSE nel Fourth Form.',
      humanities: 'svilupperà {{pronoun}} competenze analitiche e comunicative attraverso il nostro programma completo di Discipline Umanistiche.',
      leadership: 'svilupperà {{pronoun}} potenziale di leadership attraverso il nostro programma Challenge e opportunità di mentoring tra pari.',
      arts: 'nutrirà {{pronoun}} espressione creativa attraverso Arte, Musica, Tecnologia del Design e Teatro.',
      sports: 'fornirà un programma accademico e sportivo equilibrato con Giochi martedì, giovedì e sabato, oltre a numerose attività.',
      academic_high: 'fornirà la base perfetta per {{pronoun}} sviluppo accademico e personale con rigorosa preparazione agli studi IGCSE e GCSE.',
      general: 'fornirà la base perfetta per {{pronoun}} sviluppo accademico e personale al Cheltenham College.'
    },
    academic: {
      sciences_maths: 'Con {{pronoun}} forti interessi sia nelle scienze che nella matematica, {{childName}} beneficerà particolarmente del nostro insegnamento scientifico separato e del sistema di gruppi di abilità in Matematica.',
      sciences: 'L\'interesse di {{childName}} per le scienze significa che {{pronounSubject}} apprezzerà particolarmente le nostre lezioni dedicate di Biologia, Chimica e Fisica con insegnanti specialisti.',
      mathematics: 'Con {{pronoun}} attitudine matematica, {{childName}} prospererà nel nostro sistema di gruppi di abilità, con potenziale per l\'ingresso anticipato dell\'IGCSE.',
      humanities: 'L\'interesse di {{childName}} per le discipline umanistiche sarà ben servito dal nostro insegnamento basato sui moduli in Inglese, Geografia, Storia e TPE.',
      high_priority: 'Con le alte priorità accademiche di {{childName}}, troverete il vasto curriculum del Third Form particolarmente coinvolgente poiché fornisce la base per la specializzazione futura.',
      general: 'Con {{pronoun}} interessi in mente, {{childName}} troverà il vasto curriculum del Third Form particolarmente coinvolgente poiché fornisce la base per la specializzazione futura.'
    },
    pathways: {
      sciences_description: '{{childName}} prospererà nei nostri gruppi di Scienze dedicati attraverso Biologia, Chimica e Fisica. Con tre insegnanti separati specializzati in ogni materia, {{pronounSubject}} svilupperà la profonda comprensione necessaria per il successo A-Level e le candidature universitarie nei campi STEM.',
      maths_high: 'Con forte attitudine matematica, il posizionamento nel Gruppo 1 di Matematica significa che {{childName}} potrebbe lavorare verso il sostenimento dell\'IGCSE Mathematics alla fine del Fourth Form, tipicamente raggiungendo il Grado 9 prima di progredire verso Additional Mathematics nel Fifth Form.',
      maths_general: 'L\'abilità matematica di {{childName}} sarà attentamente valutata, con posizionamento nel gruppo più appropriato per assicurare che {{pronounSubject}} riceva sfida e supporto ottimali.',
      leadership_description: 'L\'interesse di {{childName}} per la leadership si svilupperà naturalmente attraverso il nostro sistema di gruppi. Gli studenti ad alto rendimento nei gruppi superiori spesso diventano mentori tra pari, aiutando i compagni di classe e assumendo responsabilità di presentazione che costruiscono fiducia e competenze comunicative.',
      oxbridge_title: 'Preparazione Oxbridge',
      oxbridge_description: 'Con aspirazioni Oxbridge, il sistema di gruppi assicura che {{childName}} riceva la sfida accademica rigorosa necessaria per candidature altamente competitive. I gruppi superiori mantengono il ritmo eccezionale e la profondità richiesti per voti A* all\'A-Level e oltre.',
      russell_title: 'Preparazione Russell Group',
      russell_description: 'Con aspirazioni Russell Group, il sistema di gruppi assicura che {{childName}} riceva la sfida accademica rigorosa necessaria per candidature universitarie competitive. I gruppi superiori mantengono il ritmo e la profondità richiesti per voti A*-A all\'A-Level.'
    },
    form_experience: {
      leadership: 'Nel {{pronoun}} gruppo di modulo, {{childName}} eccellerà in progetti collaborativi, discussioni e presentazioni che sviluppano le competenze comunicative valorizzate dalle migliori università. La dinamica di gruppo coerente permette di assumere ruoli di leadership informale e costruire fiducia nell\'esprimere idee.',
      humanities: 'Nel {{pronoun}} gruppo di modulo, {{childName}} si impegnerà in progetti collaborativi, discussioni e presentazioni su Inglese, Geografia, Storia e TPE che sviluppano il pensiero analitico e le competenze comunicative.',
      general: 'Nel {{pronoun}} gruppo di modulo, {{childName}} si impegnerà in progetti collaborativi, discussioni e presentazioni che sviluppano le competenze comunicative valorizzate dalle università. La dinamica di gruppo coerente permette di costruire fiducia nell\'esprimere idee.'
    },
    languages: {
      interest: 'L\'interesse di {{childName}} per le lingue sarà ben servito dal nostro programma completo di due lingue. Con Tedesco, Francese e Spagnolo tutti disponibili, {{pronounSubject}} acquisirà consapevolezza culturale e competenze comunicative valorizzate da datori di lavoro e università in tutto il mondo.'
    },
    pastoral: {
      message: 'Il nostro sistema completo di cura pastorale, incluso {{pronoun}} Tutor dedicato e il programma di benessere Floreat, assicura che {{childName}} riceva il supporto personale necessario per prosperare accademicamente e personalmente.'
    },
    challenge: {
      leadership: 'Il programma Challenge offre opportunità perfette per {{childName}} di sviluppare competenze di leadership attraverso presentazioni Dragons\' Den, attività di squadra e moduli di public speaking.',
      sports: 'Le diverse attività sportive del programma Challenge, inclusi Squash, Canottaggio, gare di nuoto ed eventi di corsa campestre, complementeranno perfettamente gli interessi sportivi di {{childName}}.',
      technology: 'Il programma Challenge include una Giornata di Codifica condotta da esperti, oltre a presentazioni Dragons\' Den - perfetto per sviluppare le competenze imprenditoriali e tecniche di {{childName}}.',
      general: 'Il programma Challenge offre a {{childName}} esperienze diverse dallo sviluppo atletico alle competenze di leadership e pensiero imprenditoriale attraverso presentazioni Dragons\' Den.'
    },
    highlights: {
      maths: 'Con l\'attitudine matematica di {{childName}}, il posizionamento nel Gruppo 1 di Matematica potrebbe portare al sostenimento dell\'IGCSE alla fine del Fourth Form, tipicamente raggiungendo il Grado 9, prima di progredire verso Additional Mathematics nel Fifth Form - preparazione perfetta per A-Level Mathematics e Further Mathematics.',
      sports: 'Il programma Challenge include diverse opportunità sportive inclusi Squash e Canottaggio, oltre a gare di nuoto ed eventi di corsa campestre che complementeranno gli interessi sportivi di {{childName}} e svilupperanno ulteriormente {{pronoun}} abilità atletiche.',
      leadership: 'Questo programma sviluppa specificamente le qualità di leadership a cui {{childName}} è interessato, con moduli strutturati in public speaking, competenze di presentazione e leadership di squadra - tutti altamente valorizzati da università e datori di lavoro.'
    },
    support: {
      high_priority: 'I nostri programmi di supporto, inclusa la Foundation Project Qualification e il Skills Programme, assicurano che {{childName}} sviluppi le sofisticate competenze di ricerca e studio necessarie per raggiungere {{pronoun}} pieno potenziale accademico.',
      general: 'I nostri programmi di supporto assicurano che {{childName}} raggiunga {{pronoun}} pieno potenziale accademico mentre sviluppa competenze essenziali di ricerca e studio attraverso il FPQ e Skills Programme.'
    },
    preparation: {
      oxbridge: 'Third Form inizia il viaggio di {{childName}} verso Oxbridge, con riflessione precoce sulla carriera, pianificazione strategica del GCSE e sviluppo delle competenze di apprendimento indipendente essenziali per il successo nelle università più competitive.',
      russell: 'Third Form inizia il viaggio di {{childName}} verso il successo del Russell Group, con riflessione precoce sulla carriera e pianificazione strategica per {{pronoun}} futuro accademico.',
      general: 'Third Form inizia il viaggio di {{childName}} verso il successo universitario, con riflessione precoce sulla carriera e pianificazione strategica per {{pronoun}} futuro accademico.'
    }
  });
})();