(function(){
  if (!window.PEN_I18N || typeof PEN_I18N.registerTranslations !== 'function') {
    console.warn('[third_form_humanities.i18n] PEN_I18N.registerTranslations not found. Load js/loader.js first.');
    return;
  }
  const R = window.PEN_I18N.registerTranslations;

  // EN (English)
  R('en', 'third_form_humanities', {
    placeholders: {
      child_name: '[Child Name]'
    },
    pronouns: {
      her: 'her',
      his: 'his',
      she: 'she',
      he: 'he'
    },
    welcome: {
      title: '{{childName}}\'s Humanities Journey',
      discover_prefix: 'Discover how our Humanities subjects will develop',
      discover_of: '{{childName}}\'s',
      leadership_skills: 'leadership communication skills and critical thinking abilities essential for',
      general_skills: 'critical thinking and communication skills essential for',
      oxbridge_success: 'Oxbridge success.',
      russell_group_success: 'Russell Group university success.',
      university_success: 'university preparation and future success.'
    },
    english: {
      leadership_title: 'Perfect for {{childName}}\'s Leadership Development',
      leadership_text: 'English will help {{childName}} develop the articulate communication and persuasive writing skills essential for the leadership roles {{pronoun}} is interested in pursuing.',
      drama_title: '{{childName}}\'s Creative Expression Journey',
      drama_text: 'English will nurture {{childName}}\'s dramatic and creative interests while developing the analytical skills needed for academic success.',
      general_title: 'Perfect for {{childName}}\'s Development',
      general_text: 'English will help {{childName}} develop the articulate communication and analytical writing skills that will serve throughout {{possessive}} academic career and in university life.'
    },
    history: {
      title: '{{childName}}\'s Analytical Skills Journey',
      text: 'History will develop {{childName}}\'s critical analysis and evidence evaluation skills, building the intellectual rigour needed for {{possessive}} university aspirations.'
    },
    geography: {
      sciences_title: '{{childName}}\'s Scientific and Analytical Approach',
      sciences_text: 'Geography connects {{childName}}\'s scientific interests with humanities analysis, providing the interdisciplinary skills valued by top universities.',
      general_title: 'Scientific and Analytical Approach',
      general_text: 'Geography combines scientific investigation with analytical skills, bridging science and humanities for {{childName}}\'s comprehensive development.'
    },
    tpe: {
      leadership_title: '{{childName}}\'s Ethical Leadership Development',
      leadership_text: 'TPE develops the ethical reasoning and cultural understanding essential for {{childName}}\'s leadership aspirations and university-level discourse.',
      general_title: 'Ethical Reasoning and Cultural Understanding',
      general_text: 'TPE develops {{childName}}\'s critical thinking about values and ethics, essential skills for leadership and university-level discourse.'
    },
    pathways: {
      university_title: '{{childName}}\'s University Preparation',
      university_oxbridge: 'English will develop {{childName}}\'s critical analysis and essay writing skills essential for Oxbridge applications. {{childName}}\'s strong English grades will demonstrate the communication abilities that Oxford and Cambridge value across all disciplines.',
      university_russell: 'English will develop {{childName}}\'s critical analysis and essay writing skills essential for Russell Group applications. {{childName}}\'s strong English grades will demonstrate the communication abilities that universities value across all disciplines.',
      university_general: 'English will develop {{childName}}\'s critical analysis and essay writing skills essential for university applications. Strong English grades demonstrate the communication abilities that universities value across all disciplines.',
      leadership_title: 'Developing {{childName}}\'s Leadership Communication',
      leadership_text: 'English will develop {{childName}}\'s articulate speaking and persuasive writing skills essential for the leadership roles {{pronoun}} is interested in pursuing. {{childName}} will gain confidence through presentation opportunities that build the communication skills needed for effective leadership.',
      creative_title: '{{childName}}\'s Creative Expression',
      creative_text: 'English\'s creative writing elements, including {{childName}}\'s potential participation in the creative writing prize competition, provide outlets for artistic expression while developing technical writing skills for university success.'
    }
  });

  // ES (Spanish)
  R('es', 'third_form_humanities', {
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
      title: 'El Viaje de Humanidades de {{childName}}',
      discover_prefix: 'Descubra cómo nuestras asignaturas de Humanidades desarrollarán',
      discover_of: 'de {{childName}}',
      leadership_skills: 'las habilidades de comunicación de liderazgo y las capacidades de pensamiento crítico esenciales para',
      general_skills: 'el pensamiento crítico y las habilidades de comunicación esenciales para',
      oxbridge_success: 'el éxito en Oxbridge.',
      russell_group_success: 'el éxito en las universidades del Russell Group.',
      university_success: 'la preparación universitaria y el éxito futuro.'
    },
    english: {
      leadership_title: 'Perfecto para el Desarrollo de Liderazgo de {{childName}}',
      leadership_text: 'El inglés ayudará a {{childName}} a desarrollar las habilidades de comunicación articulada y escritura persuasiva esenciales para los roles de liderazgo que {{pronoun}} está interesado en perseguir.',
      drama_title: 'El Viaje de Expresión Creativa de {{childName}}',
      drama_text: 'El inglés nutrirá los intereses dramáticos y creativos de {{childName}} mientras desarrolla las habilidades analíticas necesarias para el éxito académico.',
      general_title: 'Perfecto para el Desarrollo de {{childName}}',
      general_text: 'El inglés ayudará a {{childName}} a desarrollar las habilidades de comunicación articulada y escritura analítica que servirán a lo largo de {{possessive}} carrera académica y en la vida universitaria.'
    },
    history: {
      title: 'El Viaje de Habilidades Analíticas de {{childName}}',
      text: 'La historia desarrollará las habilidades de análisis crítico y evaluación de evidencia de {{childName}}, construyendo el rigor intelectual necesario para {{possessive}} aspiraciones universitarias.'
    },
    geography: {
      sciences_title: 'El Enfoque Científico y Analítico de {{childName}}',
      sciences_text: 'La geografía une los intereses científicos de {{childName}} con el análisis de humanidades, proporcionando las habilidades interdisciplinarias valoradas por las mejores universidades.',
      general_title: 'Enfoque Científico y Analítico',
      general_text: 'La geografía combina la investigación científica con habilidades analíticas, uniendo ciencia y humanidades para el desarrollo integral de {{childName}}.'
    },
    tpe: {
      leadership_title: 'El Desarrollo de Liderazgo Ético de {{childName}}',
      leadership_text: 'TPE desarrolla el razonamiento ético y la comprensión cultural esenciales para las aspiraciones de liderazgo de {{childName}} y el discurso a nivel universitario.',
      general_title: 'Razonamiento Ético y Comprensión Cultural',
      general_text: 'TPE desarrolla el pensamiento crítico de {{childName}} sobre valores y ética, habilidades esenciales para el liderazgo y el discurso a nivel universitario.'
    },
    pathways: {
      university_title: 'La Preparación Universitaria de {{childName}}',
      university_oxbridge: 'El inglés desarrollará las habilidades de análisis crítico y redacción de ensayos de {{childName}} esenciales para las aplicaciones a Oxbridge. Las sólidas calificaciones de inglés de {{childName}} demostrarán las habilidades de comunicación que Oxford y Cambridge valoran en todas las disciplinas.',
      university_russell: 'El inglés desarrollará las habilidades de análisis crítico y redacción de ensayos de {{childName}} esenciales para las aplicaciones al Russell Group. Las sólidas calificaciones de inglés de {{childName}} demostrarán las habilidades de comunicación que las universidades valoran en todas las disciplinas.',
      university_general: 'El inglés desarrollará las habilidades de análisis crítico y redacción de ensayos de {{childName}} esenciales para las aplicaciones universitarias. Las sólidas calificaciones de inglés demuestran las habilidades de comunicación que las universidades valoran en todas las disciplinas.',
      leadership_title: 'Desarrollando la Comunicación de Liderazgo de {{childName}}',
      leadership_text: 'El inglés desarrollará las habilidades de expresión articulada y escritura persuasiva de {{childName}} esenciales para los roles de liderazgo que {{pronoun}} está interesado en perseguir. {{childName}} ganará confianza a través de oportunidades de presentación que construyen las habilidades de comunicación necesarias para un liderazgo efectivo.',
      creative_title: 'La Expresión Creativa de {{childName}}',
      creative_text: 'Los elementos de escritura creativa del inglés, incluida la posible participación de {{childName}} en el concurso de premios de escritura creativa, proporcionan salidas para la expresión artística mientras desarrollan habilidades técnicas de escritura para el éxito universitario.'
    }
  });

  // FR (French)
  R('fr', 'third_form_humanities', {
    placeholders: {
      child_name: '[Nom de l\'Enfant]'
    },
    pronouns: {
      her: 'son',
      his: 'son',
      she: 'elle',
      he: 'il'
    },
    welcome: {
      title: 'Le Parcours en Humanités de {{childName}}',
      discover_prefix: 'Découvrez comment nos matières d\'Humanités développeront',
      discover_of: 'de {{childName}}',
      leadership_skills: 'les compétences de communication en leadership et les capacités de pensée critique essentielles pour',
      general_skills: 'la pensée critique et les compétences de communication essentielles pour',
      oxbridge_success: 'le succès à Oxbridge.',
      russell_group_success: 'le succès dans les universités du Russell Group.',
      university_success: 'la préparation universitaire et le succès futur.'
    },
    english: {
      leadership_title: 'Parfait pour le Développement du Leadership de {{childName}}',
      leadership_text: 'L\'anglais aidera {{childName}} à développer les compétences de communication articulée et d\'écriture persuasive essentielles pour les rôles de leadership qui {{pronoun}} intéressent.',
      drama_title: 'Le Voyage d\'Expression Créative de {{childName}}',
      drama_text: 'L\'anglais nourrira les intérêts dramatiques et créatifs de {{childName}} tout en développant les compétences analytiques nécessaires au succès académique.',
      general_title: 'Parfait pour le Développement de {{childName}}',
      general_text: 'L\'anglais aidera {{childName}} à développer les compétences de communication articulée et d\'écriture analytique qui serviront tout au long de {{possessive}} carrière académique et dans la vie universitaire.'
    },
    history: {
      title: 'Le Parcours des Compétences Analytiques de {{childName}}',
      text: 'L\'histoire développera les compétences d\'analyse critique et d\'évaluation des preuves de {{childName}}, en construisant la rigueur intellectuelle nécessaire pour {{possessive}} aspirations universitaires.'
    },
    geography: {
      sciences_title: 'L\'Approche Scientifique et Analytique de {{childName}}',
      sciences_text: 'La géographie relie les intérêts scientifiques de {{childName}} à l\'analyse en humanités, fournissant les compétences interdisciplinaires valorisées par les meilleures universités.',
      general_title: 'Approche Scientifique et Analytique',
      general_text: 'La géographie combine l\'investigation scientifique avec des compétences analytiques, reliant science et humanités pour le développement complet de {{childName}}.'
    },
    tpe: {
      leadership_title: 'Le Développement du Leadership Éthique de {{childName}}',
      leadership_text: 'TPE développe le raisonnement éthique et la compréhension culturelle essentiels pour les aspirations de leadership de {{childName}} et le discours de niveau universitaire.',
      general_title: 'Raisonnement Éthique et Compréhension Culturelle',
      general_text: 'TPE développe la pensée critique de {{childName}} sur les valeurs et l\'éthique, compétences essentielles pour le leadership et le discours de niveau universitaire.'
    },
    pathways: {
      university_title: 'La Préparation Universitaire de {{childName}}',
      university_oxbridge: 'L\'anglais développera les compétences d\'analyse critique et de rédaction d\'essais de {{childName}} essentielles pour les candidatures à Oxbridge. Les solides notes d\'anglais de {{childName}} démontreront les capacités de communication qu\'Oxford et Cambridge valorisent dans toutes les disciplines.',
      university_russell: 'L\'anglais développera les compétences d\'analyse critique et de rédaction d\'essais de {{childName}} essentielles pour les candidatures au Russell Group. Les solides notes d\'anglais de {{childName}} démontreront les capacités de communication que les universités valorisent dans toutes les disciplines.',
      university_general: 'L\'anglais développera les compétences d\'analyse critique et de rédaction d\'essais de {{childName}} essentielles pour les candidatures universitaires. De solides notes d\'anglais démontrent les capacités de communication que les universités valorisent dans toutes les disciplines.',
      leadership_title: 'Développer la Communication de Leadership de {{childName}}',
      leadership_text: 'L\'anglais développera les compétences d\'expression articulée et d\'écriture persuasive de {{childName}} essentielles pour les rôles de leadership qui {{pronoun}} intéressent. {{childName}} gagnera en confiance grâce à des opportunités de présentation qui développent les compétences de communication nécessaires pour un leadership efficace.',
      creative_title: 'L\'Expression Créative de {{childName}}',
      creative_text: 'Les éléments d\'écriture créative de l\'anglais, y compris la participation potentielle de {{childName}} au concours de prix d\'écriture créative, fournissent des débouchés pour l\'expression artistique tout en développant des compétences techniques d\'écriture pour le succès universitaire.'
    }
  });

  // DE (German)
  R('de', 'third_form_humanities', {
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
      title: '{{childName}}s Geisteswissenschaften-Reise',
      discover_prefix: 'Entdecken Sie, wie unsere Geisteswissenschaften',
      discover_of: 'von {{childName}}',
      leadership_skills: 'Führungskommunikationsfähigkeiten und kritisches Denkvermögen entwickeln werden, die wesentlich sind für',
      general_skills: 'kritisches Denken und Kommunikationsfähigkeiten entwickeln werden, die wesentlich sind für',
      oxbridge_success: 'den Erfolg in Oxbridge.',
      russell_group_success: 'den Erfolg an Russell Group-Universitäten.',
      university_success: 'die Universitätsvorbereitung und den zukünftigen Erfolg.'
    },
    english: {
      leadership_title: 'Perfekt für {{childName}}s Führungsentwicklung',
      leadership_text: 'Englisch wird {{childName}} helfen, die artikulierte Kommunikation und überzeugenden Schreibfähigkeiten zu entwickeln, die für die Führungsrollen wesentlich sind, die {{pronoun}} anstrebt.',
      drama_title: '{{childName}}s Kreative Ausdrucksreise',
      drama_text: 'Englisch wird {{childName}}s dramatische und kreative Interessen fördern, während es die analytischen Fähigkeiten entwickelt, die für akademischen Erfolg erforderlich sind.',
      general_title: 'Perfekt für {{childName}}s Entwicklung',
      general_text: 'Englisch wird {{childName}} helfen, die artikulierte Kommunikation und analytischen Schreibfähigkeiten zu entwickeln, die während {{possessive}} akademischen Laufbahn und im Universitätsleben dienen werden.'
    },
    history: {
      title: '{{childName}}s Analytische Fähigkeiten-Reise',
      text: 'Geschichte wird {{childName}}s kritische Analyse und Beweisbewertungsfähigkeiten entwickeln und die intellektuelle Strenge aufbauen, die für {{possessive}} Universitätsaspirationen erforderlich ist.'
    },
    geography: {
      sciences_title: '{{childName}}s Wissenschaftlicher und Analytischer Ansatz',
      sciences_text: 'Geographie verbindet {{childName}}s wissenschaftliche Interessen mit geisteswissenschaftlicher Analyse und bietet die interdisziplinären Fähigkeiten, die von Top-Universitäten geschätzt werden.',
      general_title: 'Wissenschaftlicher und Analytischer Ansatz',
      general_text: 'Geographie kombiniert wissenschaftliche Untersuchung mit analytischen Fähigkeiten und verbindet Wissenschaft und Geisteswissenschaften für {{childName}}s umfassende Entwicklung.'
    },
    tpe: {
      leadership_title: '{{childName}}s Ethische Führungsentwicklung',
      leadership_text: 'TPE entwickelt das ethische Denken und kulturelle Verständnis, die für {{childName}}s Führungsaspirationen und den Diskurs auf Universitätsniveau wesentlich sind.',
      general_title: 'Ethisches Denken und Kulturelles Verständnis',
      general_text: 'TPE entwickelt {{childName}}s kritisches Denken über Werte und Ethik, wesentliche Fähigkeiten für Führung und Diskurs auf Universitätsniveau.'
    },
    pathways: {
      university_title: '{{childName}}s Universitätsvorbereitung',
      university_oxbridge: 'Englisch wird {{childName}}s kritische Analyse- und Aufsatzschreibfähigkeiten entwickeln, die für Oxbridge-Bewerbungen wesentlich sind. {{childName}}s starke Englischnoten werden die Kommunikationsfähigkeiten demonstrieren, die Oxford und Cambridge in allen Disziplinen schätzen.',
      university_russell: 'Englisch wird {{childName}}s kritische Analyse- und Aufsatzschreibfähigkeiten entwickeln, die für Russell Group-Bewerbungen wesentlich sind. {{childName}}s starke Englischnoten werden die Kommunikationsfähigkeiten demonstrieren, die Universitäten in allen Disziplinen schätzen.',
      university_general: 'Englisch wird {{childName}}s kritische Analyse- und Aufsatzschreibfähigkeiten entwickeln, die für Universitätsbewerbungen wesentlich sind. Starke Englischnoten demonstrieren die Kommunikationsfähigkeiten, die Universitäten in allen Disziplinen schätzen.',
      leadership_title: 'Entwicklung von {{childName}}s Führungskommunikation',
      leadership_text: 'Englisch wird {{childName}}s artikulierte Sprech- und überzeugenden Schreibfähigkeiten entwickeln, die für die Führungsrollen wesentlich sind, die {{pronoun}} anstrebt. {{childName}} wird durch Präsentationsmöglichkeiten Vertrauen gewinnen, die die für effektive Führung erforderlichen Kommunikationsfähigkeiten aufbauen.',
      creative_title: '{{childName}}s Kreativer Ausdruck',
      creative_text: 'Die kreativen Schreibelemente des Englischunterrichts, einschließlich {{childName}}s potenzieller Teilnahme am Wettbewerb für kreatives Schreiben, bieten Möglichkeiten für künstlerischen Ausdruck und entwickeln gleichzeitig technische Schreibfähigkeiten für den Universitätserfolg.'
    }
  });

  // zh-Hans (Chinese Simplified)
  R('zh-Hans', 'third_form_humanities', {
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
      title: '{{childName}}的人文学科之旅',
      discover_prefix: '了解我们的人文学科如何培养{{childName}}的',
      discover_of: '',
      leadership_skills: '对于以下方面至关重要的领导沟通技能和批判性思维能力:',
      general_skills: '对于以下方面至关重要的批判性思维和沟通技能:',
      oxbridge_success: '牛剑成功。',
      russell_group_success: '罗素集团大学成功。',
      university_success: '大学准备和未来成功。'
    },
    english: {
      leadership_title: '非常适合{{childName}}的领导力发展',
      leadership_text: '英语将帮助{{childName}}培养对于{{pronoun}}有兴趣追求的领导角色至关重要的清晰沟通和有说服力的写作技能。',
      drama_title: '{{childName}}的创意表达之旅',
      drama_text: '英语将培养{{childName}}的戏剧和创意兴趣,同时培养学业成功所需的分析技能。',
      general_title: '非常适合{{childName}}的发展',
      general_text: '英语将帮助{{childName}}培养清晰的沟通和分析性写作技能,这些技能将在{{possessive}}整个学业生涯和大学生活中发挥作用。'
    },
    history: {
      title: '{{childName}}的分析技能之旅',
      text: '历史将培养{{childName}}的批判性分析和证据评估技能,建立{{possessive}}大学抱负所需的智力严谨性。'
    },
    geography: {
      sciences_title: '{{childName}}的科学与分析方法',
      sciences_text: '地理将{{childName}}的科学兴趣与人文分析相结合,提供顶尖大学重视的跨学科技能。',
      general_title: '科学与分析方法',
      general_text: '地理将科学调查与分析技能相结合,为{{childName}}的全面发展搭建科学与人文的桥梁。'
    },
    tpe: {
      leadership_title: '{{childName}}的伦理领导力发展',
      leadership_text: 'TPE培养对于{{childName}}的领导抱负和大学水平讨论至关重要的伦理推理和文化理解。',
      general_title: '伦理推理与文化理解',
      general_text: 'TPE培养{{childName}}关于价值观和伦理的批判性思维,这些是领导力和大学水平讨论的基本技能。'
    },
    pathways: {
      university_title: '{{childName}}的大学准备',
      university_oxbridge: '英语将培养{{childName}}对牛剑申请至关重要的批判性分析和论文写作技能。{{childName}}优异的英语成绩将展示牛津和剑桥在所有学科中重视的沟通能力。',
      university_russell: '英语将培养{{childName}}对罗素集团申请至关重要的批判性分析和论文写作技能。{{childName}}优异的英语成绩将展示大学在所有学科中重视的沟通能力。',
      university_general: '英语将培养{{childName}}对大学申请至关重要的批判性分析和论文写作技能。优异的英语成绩展示大学在所有学科中重视的沟通能力。',
      leadership_title: '培养{{childName}}的领导沟通',
      leadership_text: '英语将培养{{childName}}对于{{pronoun}}有兴趣追求的领导角色至关重要的清晰表达和有说服力的写作技能。{{childName}}将通过演讲机会获得信心,这些机会培养有效领导所需的沟通技能。',
      creative_title: '{{childName}}的创意表达',
      creative_text: '英语的创意写作元素,包括{{childName}}可能参与的创意写作奖比赛,为艺术表达提供出口,同时培养大学成功所需的技术写作技能。'
    }
  });

  // IT (Italian)
  R('it', 'third_form_humanities', {
    placeholders: {
      child_name: '[Nome del Bambino]'
    },
    pronouns: {
      her: 'sua',
      his: 'suo',
      she: 'lei',
      he: 'lui'
    },
    welcome: {
      title: 'Il Percorso in Scienze Umane di {{childName}}',
      discover_prefix: 'Scopri come le nostre materie di Scienze Umane svilupperanno',
      discover_of: 'di {{childName}}',
      leadership_skills: 'le competenze di comunicazione per la leadership e le capacità di pensiero critico essenziali per',
      general_skills: 'il pensiero critico e le competenze di comunicazione essenziali per',
      oxbridge_success: 'il successo a Oxbridge.',
      russell_group_success: 'il successo nelle università del Russell Group.',
      university_success: 'la preparazione universitaria e il successo futuro.'
    },
    english: {
      leadership_title: 'Perfetto per lo Sviluppo della Leadership di {{childName}}',
      leadership_text: 'L\'inglese aiuterà {{childName}} a sviluppare le competenze di comunicazione articolata e scrittura persuasiva essenziali per i ruoli di leadership che {{pronoun}} è interessato a perseguire.',
      drama_title: 'Il Viaggio di Espressione Creativa di {{childName}}',
      drama_text: 'L\'inglese nutrirà gli interessi drammatici e creativi di {{childName}} sviluppando le competenze analitiche necessarie per il successo accademico.',
      general_title: 'Perfetto per lo Sviluppo di {{childName}}',
      general_text: 'L\'inglese aiuterà {{childName}} a sviluppare le competenze di comunicazione articolata e scrittura analitica che serviranno durante {{possessive}} carriera accademica e nella vita universitaria.'
    },
    history: {
      title: 'Il Viaggio delle Competenze Analitiche di {{childName}}',
      text: 'La storia svilupperà le competenze di analisi critica e valutazione delle prove di {{childName}}, costruendo il rigore intellettuale necessario per {{possessive}} aspirazioni universitarie.'
    },
    geography: {
      sciences_title: 'L\'Approccio Scientifico e Analitico di {{childName}}',
      sciences_text: 'La geografia collega gli interessi scientifici di {{childName}} con l\'analisi umanistica, fornendo le competenze interdisciplinari valorizzate dalle migliori università.',
      general_title: 'Approccio Scientifico e Analitico',
      general_text: 'La geografia combina l\'indagine scientifica con competenze analitiche, collegando scienza e scienze umane per lo sviluppo completo di {{childName}}.'
    },
    tpe: {
      leadership_title: 'Lo Sviluppo della Leadership Etica di {{childName}}',
      leadership_text: 'TPE sviluppa il ragionamento etico e la comprensione culturale essenziali per le aspirazioni di leadership di {{childName}} e il discorso a livello universitario.',
      general_title: 'Ragionamento Etico e Comprensione Culturale',
      general_text: 'TPE sviluppa il pensiero critico di {{childName}} su valori ed etica, competenze essenziali per la leadership e il discorso a livello universitario.'
    },
    pathways: {
      university_title: 'La Preparazione Universitaria di {{childName}}',
      university_oxbridge: 'L\'inglese svilupperà le competenze di analisi critica e scrittura di saggi di {{childName}} essenziali per le candidature a Oxbridge. I voti solidi in inglese di {{childName}} dimostreranno le capacità di comunicazione che Oxford e Cambridge valorizzano in tutte le discipline.',
      university_russell: 'L\'inglese svilupperà le competenze di analisi critica e scrittura di saggi di {{childName}} essenziali per le candidature al Russell Group. I voti solidi in inglese di {{childName}} dimostreranno le capacità di comunicazione che le università valorizzano in tutte le discipline.',
      university_general: 'L\'inglese svilupperà le competenze di analisi critica e scrittura di saggi di {{childName}} essenziali per le candidature universitarie. Voti solidi in inglese dimostrano le capacità di comunicazione che le università valorizzano in tutte le discipline.',
      leadership_title: 'Sviluppare la Comunicazione di Leadership di {{childName}}',
      leadership_text: 'L\'inglese svilupperà le competenze di espressione articolata e scrittura persuasiva di {{childName}} essenziali per i ruoli di leadership che {{pronoun}} è interessato a perseguire. {{childName}} acquisirà fiducia attraverso opportunità di presentazione che costruiscono le competenze di comunicazione necessarie per una leadership efficace.',
      creative_title: 'L\'Espressione Creativa di {{childName}}',
      creative_text: 'Gli elementi di scrittura creativa dell\'inglese, inclusa la potenziale partecipazione di {{childName}} al concorso di premio per la scrittura creativa, forniscono sbocchi per l\'espressione artistica sviluppando competenze tecniche di scrittura per il successo universitario.'
    }
  });
})();