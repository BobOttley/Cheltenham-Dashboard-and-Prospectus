(function(){
  if (!window.PEN_I18N || typeof PEN_I18N.registerTranslations !== 'function') {
    console.warn('[sports.i18n] PEN_I18N.registerTranslations not found. Load js/loader.js first.');
    return;
  }
  const R = window.PEN_I18N.registerTranslations;

  // EN (English) - ADDED
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
      highlight_default: 'Hockey • Athletics • Tennis • Plus Many More Sports to Explore'
    },
    sports: {
      hockey_title: 'Hockey Excellence',
      hockey_details: '{{childName}}, you'll train on our two Olympic-standard water-based Astro pitches alongside 20+ teams of passionate players. With professional coaching from former internationals, you'll develop advanced stick skills, tactical awareness and game intelligence. Regular fixtures against top schools like Millfield and Marlborough, plus appearances at National Finals, will challenge you at the highest level.',
      hockey_highlight: 'U18 National Finals 2024 • Perfect for {{childName}}',
      
      athletics_title: 'Athletics Programme',
      athletics_details: '{{childName}}, our athletics facilities will be your training ground for excellence. Whether you excel in sprints, middle distance, throwing or jumping, our specialist coaches will develop your technique through biomechanical analysis. You'll compete at prestigious events including the English Schools Championships and ISA Championships.',
      athletics_highlight: '3 National Medallists • County Champions • Ideal for {{childName}}',
      
      tennis_title: 'Tennis Development',
      tennis_details: '{{childName}}, with 12 hard courts, 6 grass courts and 4 indoor courts at your disposal, you'll have year-round opportunities to perfect your game. Our LTA-licensed coaches provide both individual and group coaching tailored to your skill level.',
      tennis_highlight: 'National Schools Finalists • LTA Regional Centre',
      
      rugby_title: 'Rugby Excellence',
      rugby_details: '{{childName}}, you'll join 15+ teams from U13 to 1st XV competing at the highest level. Twelve full-size pitches including floodlit training areas provide the perfect environment for your development.',
      rugby_highlight: 'U18 National Champions • England Internationals',
      
      netball_title: 'Netball Excellence',
      netball_details: '{{childName}}, you'll compete with 12 teams from U13 to 1st VII at regional and national level. Six outdoor courts and indoor facilities provide year-round training opportunities.',
      netball_highlight: 'Regional Champions • National Top 10',
      
      cricket_title: 'Cricket Excellence',
      cricket_details: '{{childName}}, you'll train on our professional-standard cricket square with 12 pitches. The indoor cricket centre with bowling machines and video analysis provides year-round development.',
      cricket_highlight: 'County Cup Winners • MCC Coaching',
      
      swimming_title: 'Swimming Excellence',
      swimming_details: '{{childName}}, you'll train in our heated 25m six-lane indoor pool with electronic timing systems. Daily squad training from 6:30am develops competitive swimming skills.',
      swimming_highlight: 'Regional Champions • 8 County Swimmers',
      
      rowing_title: 'Rowing Excellence',
      rowing_details: '{{childName}}, our state-of-the-art boathouse on the River Severn houses a fleet of 50+ boats. Compete at Henley Royal Regatta and the National Schools\' Regatta.',
      rowing_highlight: 'Henley Qualifiers • GB Junior Pipeline',
      
      squash_title: 'Squash Excellence',
      squash_details: '{{childName}}, you'll train on four glass-backed championship courts in our dedicated squash centre. Professional coaching from former PSA tour players provides individual support.',
      squash_highlight: 'Top 10 UK School • County Training Venue',
      
      badminton_title: 'Badminton Excellence',
      badminton_details: '{{childName}}, you'll compete in our four-court sports hall with specialist badminton flooring. Teams compete in National Schools Championships and county leagues.',
      badminton_highlight: 'County Champions • Regional Finals',
      
      basketball_title: 'Basketball Excellence',
      basketball_details: '{{childName}}, you'll play on indoor courts with professional hoops and electronic scoreboards. Boys\' and girls\' teams compete in regional leagues with American-style coaching methods.',
      basketball_highlight: 'Regional League Winners • National Schools Qualifiers',
      
      football_title: 'Football Excellence',
      football_details: '{{childName}}, you'll train on our 3G all-weather pitch and multiple grass pitches. FA-qualified coaches including UEFA B licence holders provide expert guidance.',
      football_highlight: 'ISFA Regional Champions • County Cup Semi-Finals',
      
      cross_country_title: 'Cross Country Excellence',
      cross_country_details: '{{childName}}, you'll train on beautiful countryside routes with specialist distance coaching. Our winter programme builds endurance and mental toughness.',
      cross_country_highlight: 'County Champions • Regional Competitors',
      
      golf_title: 'Golf Excellence',
      golf_details: '{{childName}}, you'll benefit from partnerships with Cotswold Hills and Lilley Brook Golf Clubs. PGA professional coaching with video analysis and Trackman technology.',
      golf_highlight: 'ISGA Finals • 3 County Players',
      
      equestrian_title: 'Equestrian Excellence',
      equestrian_details: '{{childName}}, comprehensive programme covering show jumping, eventing, dressage and polo. Partnership with local BHS-approved centres. NSEA competitions including Schools Championships at Hickstead.',
      equestrian_highlight: 'NSEA National Qualifiers • Hickstead Competitors',
      
      clay_shooting_title: 'Clay Shooting Excellence',
      clay_shooting_details: '{{childName}}, partnership with top-tier local shooting grounds. CPSA-qualified instruction across all disciplines. Compete at the Schools Challenge and NSRA championships.',
      clay_shooting_highlight: 'Schools Challenge Finalists • CPSA Registered',
      
      polo_title: 'Polo Excellence',
      polo_details: '{{childName}}, introduction to polo at Edgeworth Polo Club. HPA coaching with horses provided. Compete in SUPA schools tournaments.',
      polo_highlight: 'SUPA Tournament Players • HPA Affiliated',
      
      water_polo_title: 'Water Polo Excellence',
      water_polo_details: '{{childName}}, train in our 25m pool with dedicated equipment. Boys\' and girls\' squads competing in regional leagues.',
      water_polo_highlight: 'Regional League • National Schools Competition',
      
      volleyball_title: 'Volleyball Excellence',
      volleyball_details: '{{childName}}, indoor volleyball in sports hall with competition-standard nets. Teams compete in National Schools competitions.',
      volleyball_highlight: 'Regional Competitors • Fastest Growing Sport',
      
      ultimate_title: 'Ultimate Frisbee Excellence',
      ultimate_details: '{{childName}}, mixed teams competing in schools tournaments. Participate in UK Ultimate Junior tournaments.',
      ultimate_highlight: 'National Schools Tournament • Inclusive Sport Award',
      
      lacrosse_title: 'Lacrosse Excellence',
      lacrosse_details: '{{childName}}, you'll join our growing lacrosse programme with specialist coaching and competitive fixtures against other schools.',
      lacrosse_highlight: 'Growing Programme • Competitive Fixtures',
      
      rounders_title: 'Rounders Excellence',
      rounders_details: '{{childName}}, summer term sport with teams from U13 to 1st IX. Participation in county tournaments including Lady Taverners competitions.',
      rounders_highlight: 'County Tournament Winners • Regional Finals'
    }
  });

(function(){
  if (!window.PEN_I18N || typeof PEN_I18N.registerTranslations !== 'function') {
    console.warn('[sports.i18n] PEN_I18N.registerTranslations not found. Load js/loader.js first.');
    return;
  }
  const R = window.PEN_I18N.registerTranslations;

  // ES (Spanish)
  R('es', 'sports', {
    placeholders: {
      child: 'Niño'
    },
    ui: {
      click_to_mute: 'CLIC PARA SILENCIAR',
      click_to_unmute: 'CLIC PARA ACTIVAR SONIDO',
      show_more: 'Mostrar más deportes',
      hide_details: 'Ocultar detalles deportivos'
    },
    gender_rugby: {
      tab: 'RUGBY',
      title: 'RUGBY EN CHELTENHAM',
      hero_title: 'Fuerza, Estrategia, Éxito',
      subtitle: 'Programa de Rugby de Élite con Reconocimiento Internacional',
      stat1: '15+',
      label1: 'Equipos',
      stat2: '12',
      label2: 'Campos',
      stat3: '2',
      label3: 'Giras Anuales'
    },
    gender_netball: {
      tab: 'NETBALL',
      title: 'NETBALL EN CHELTENHAM',
      interest_note_general: '{{childName}}, ',
      highlight_default: 'Hockey • Atletismo • Tenis • Además Muchos Más Deportes por Explorar'
    },
    sports: {
      hockey_title: 'Excelencia en Hockey',
      hockey_details: '{{childName}}, entrenarás en nuestras dos canchas Astro con base de agua de estándar olímpico junto a más de 20 equipos de jugadores apasionados. Con entrenamiento profesional de ex jugadores internacionales, desarrollarás habilidades avanzadas con el stick, conciencia táctica e inteligencia de juego. Los partidos regulares contra las mejores escuelas como Millfield y Marlborough, además de las apariciones en las Finales Nacionales, te desafiarán al más alto nivel.',
      hockey_highlight: 'Finales Nacionales U18 2024 • Perfecto para {{childName}}',
      
      athletics_title: 'Programa de Atletismo',
      athletics_details: '{{childName}}, nuestras instalaciones de atletismo serán tu campo de entrenamiento para la excelencia. Ya sea que sobresalgas en carreras de velocidad, media distancia, lanzamientos o saltos, nuestros entrenadores especializados desarrollarán tu técnica mediante análisis biomecánico. Competirás en eventos prestigiosos incluyendo los Campeonatos Escolares Ingleses y los Campeonatos ISA.',
      athletics_highlight: '3 Medallistas Nacionales • Campeones de Condado • Ideal para {{childName}}',
      
      tennis_title: 'Desarrollo en Tenis',
      tennis_details: '{{childName}}, con 12 canchas duras, 6 canchas de césped y 4 canchas cubiertas a tu disposición, tendrás oportunidades durante todo el año para perfeccionar tu juego. Nuestros entrenadores con licencia LTA proporcionan entrenamiento individual y grupal adaptado a tu nivel de habilidad.',
      tennis_highlight: 'Finalistas de Escuelas Nacionales • Centro Regional LTA',
      
      rugby_title: 'Excelencia en Rugby',
      rugby_details: '{{childName}}, te unirás a más de 15 equipos desde U13 hasta el 1er XV compitiendo al más alto nivel. Doce campos de tamaño completo incluyendo áreas de entrenamiento con iluminación proporcionan el entorno perfecto para tu desarrollo.',
      rugby_highlight: 'Campeones Nacionales U18 • Internacionales de Inglaterra',
      
      netball_title: 'Excelencia en Netball',
      netball_details: '{{childName}}, competirás con 12 equipos desde U13 hasta el 1er VII a nivel regional y nacional. Seis canchas al aire libre e instalaciones cubiertas proporcionan oportunidades de entrenamiento durante todo el año.',
      netball_highlight: 'Campeones Regionales • Top 10 Nacional',
      
      cricket_title: 'Excelencia en Cricket',
      cricket_details: '{{childName}}, entrenarás en nuestro cuadrado de cricket de estándar profesional con 12 campos. El centro de cricket cubierto con máquinas de lanzamiento y análisis de video proporciona desarrollo durante todo el año.',
      cricket_highlight: 'Ganadores de la Copa del Condado • Entrenamiento MCC',
      
      swimming_title: 'Excelencia en Natación',
      swimming_details: '{{childName}}, entrenarás en nuestra piscina cubierta climatizada de 25m con seis carriles y sistemas de cronometraje electrónico. El entrenamiento diario del equipo desde las 6:30am desarrolla habilidades de natación competitiva.',
      swimming_highlight: 'Campeones Regionales • 8 Nadadores del Condado',
      
      rowing_title: 'Excelencia en Remo',
      rowing_details: '{{childName}}, nuestro cobertizo de botes de última generación en el río Severn alberga una flota de más de 50 botes. Compite en la Regata Real de Henley y la Regata Nacional de Escuelas.',
      rowing_highlight: 'Clasificados para Henley • Pipeline de Juniors GB',
      
      squash_title: 'Excelencia en Squash',
      squash_details: '{{childName}}, entrenarás en cuatro canchas de campeonato con respaldo de vidrio en nuestro centro de squash dedicado. El entrenamiento profesional de ex jugadores del tour PSA proporciona apoyo individual.',
      squash_highlight: 'Top 10 Escuelas del Reino Unido • Sede de Entrenamiento del Condado',
      
      badminton_title: 'Excelencia en Bádminton',
      badminton_details: '{{childName}}, competirás en nuestro polideportivo de cuatro canchas con suelo especializado para bádminton. Los equipos compiten en los Campeonatos Nacionales de Escuelas y ligas del condado.',
      badminton_highlight: 'Campeones del Condado • Finales Regionales',
      
      basketball_title: 'Excelencia en Baloncesto',
      basketball_details: '{{childName}}, jugarás en canchas cubiertas con aros profesionales y marcadores electrónicos. Los equipos de chicos y chicas compiten en ligas regionales con métodos de entrenamiento de estilo americano.',
      basketball_highlight: 'Ganadores de Liga Regional • Clasificados para Escuelas Nacionales',
      
      football_title: 'Excelencia en Fútbol',
      football_details: '{{childName}}, entrenarás en nuestro campo 3G para todo clima y múltiples campos de césped. Entrenadores calificados por la FA incluyendo titulares de licencia UEFA B proporcionan orientación experta.',
      football_highlight: 'Campeones Regionales ISFA • Semifinales de la Copa del Condado',
      
      cross_country_title: 'Excelencia en Cross Country',
      cross_country_details: '{{childName}}, entrenarás en hermosas rutas de campo con entrenamiento especializado de distancia. Nuestro programa de invierno construye resistencia y fortaleza mental.',
      cross_country_highlight: 'Campeones del Condado • Competidores Regionales',
      
      golf_title: 'Excelencia en Golf',
      golf_details: '{{childName}}, te beneficiarás de asociaciones con Cotswold Hills y Lilley Brook Golf Clubs. Entrenamiento profesional PGA con análisis de video y tecnología Trackman.',
      golf_highlight: 'Finales ISGA • 3 Jugadores del Condado',
      
      equestrian_title: 'Excelencia Ecuestre',
      equestrian_details: '{{childName}}, programa integral que cubre salto, concurso completo, doma y polo. Asociación con centros locales aprobados por BHS. Competiciones NSEA incluyendo Campeonatos de Escuelas en Hickstead.',
      equestrian_highlight: 'Clasificados Nacionales NSEA • Competidores de Hickstead',
      
      clay_shooting_title: 'Excelencia en Tiro al Plato',
      clay_shooting_details: '{{childName}}, asociación con campos de tiro locales de primer nivel. Instrucción calificada CPSA en todas las disciplinas. Compite en el Desafío de Escuelas y campeonatos NSRA.',
      clay_shooting_highlight: 'Finalistas del Desafío de Escuelas • Registrado CPSA',
      
      polo_title: 'Excelencia en Polo',
      polo_details: '{{childName}}, introducción al polo en el Club de Polo Edgeworth. Entrenamiento HPA con caballos proporcionados. Compite en torneos SUPA de escuelas.',
      polo_highlight: 'Jugadores de Torneos SUPA • Afiliado HPA',
      
      water_polo_title: 'Excelencia en Waterpolo',
      water_polo_details: '{{childName}}, entrena en nuestra piscina de 25m con equipo dedicado. Equipos de chicos y chicas compitiendo en ligas regionales.',
      water_polo_highlight: 'Liga Regional • Competición Nacional de Escuelas',
      
      volleyball_title: 'Excelencia en Voleibol',
      volleyball_details: '{{childName}}, voleibol bajo techo en polideportivo con redes de estándar de competición. Los equipos compiten en competiciones Nacionales de Escuelas.',
      volleyball_highlight: 'Competidores Regionales • Deporte de Más Rápido Crecimiento',
      
      ultimate_title: 'Excelencia en Ultimate Frisbee',
      ultimate_details: '{{childName}}, equipos mixtos compitiendo en torneos escolares. Participa en torneos Junior de UK Ultimate.',
      ultimate_highlight: 'Torneo Nacional de Escuelas • Premio de Deporte Inclusivo',
      
      lacrosse_title: 'Excelencia en Lacrosse',
      lacrosse_details: '{{childName}}, te unirás a nuestro creciente programa de lacrosse con entrenamiento especializado y partidos competitivos contra otras escuelas.',
      lacrosse_highlight: 'Programa en Crecimiento • Partidos Competitivos',
      
      rounders_title: 'Excelencia en Rounders',
      rounders_details: '{{childName}}, deporte de trimestre de verano con equipos desde U13 hasta el 1er IX. Participación en torneos del condado incluyendo competiciones Lady Taverners.',
      rounders_highlight: 'Ganadores de Torneo del Condado • Finales Regionales'
    }
  });

  // FR (French)
  R('fr', 'sports', {
    placeholders: {
      child: 'Enfant'
    },
    ui: {
      click_to_mute: 'CLIQUER POUR COUPER LE SON',
      click_to_unmute: 'CLIQUER POUR LE SON',
      show_more: 'Afficher plus de sports',
      hide_details: 'Masquer les détails sportifs'
    },
    gender_rugby: {
      tab: 'RUGBY',
      title: 'RUGBY À CHELTENHAM',
      hero_title: 'Force, Stratégie, Succès',
      subtitle: 'Programme de Rugby d\'Élite avec Reconnaissance Internationale',
      stat1: '15+',
      label1: 'Équipes',
      stat2: '12',
      label2: 'Terrains',
      stat3: '2',
      label3: 'Tournées Annuelles'
    },
    gender_netball: {
      tab: 'NETBALL',
      title: 'NETBALL À CHELTENHAM',
      hero_title: 'Précision, Puissance, Performance',
      subtitle: 'Programme de Netball d\'Élite avec Reconnaissance Nationale',
      stat1: '12',
      label1: 'Équipes',
      stat2: '6',
      label2: 'Terrains'
    },
    personal: {
      interest_note_sports: '{{childName}}, avec votre passion pour le sport déjà évidente, ',
      interest_note_general: '{{childName}}, ',
      highlight_default: 'Hockey • Athlétisme • Tennis • Ainsi que Beaucoup d\'Autres Sports à Explorer'
    },
    sports: {
      hockey_title: 'Excellence en Hockey',
      hockey_details: '{{childName}}, vous vous entraînerez sur nos deux terrains Astro à base d\'eau de norme olympique aux côtés de plus de 20 équipes de joueurs passionnés. Avec un coaching professionnel d\'anciens joueurs internationaux, vous développerez des compétences avancées avec le stick, une conscience tactique et une intelligence de jeu. Des matchs réguliers contre les meilleures écoles comme Millfield et Marlborough, ainsi que des apparitions en Finales Nationales, vous mettront au défi au plus haut niveau.',
      hockey_highlight: 'Finales Nationales U18 2024 • Parfait pour {{childName}}',
      
      athletics_title: 'Programme d\'Athlétisme',
      athletics_details: '{{childName}}, nos installations d\'athlétisme seront votre terrain d\'entraînement pour l\'excellence. Que vous excelliez dans les sprints, la demi-distance, les lancers ou les sauts, nos entraîneurs spécialisés développeront votre technique grâce à l\'analyse biomécanique. Vous participerez à des événements prestigieux, notamment les Championnats Scolaires Anglais et les Championnats ISA.',
      athletics_highlight: '3 Médaillés Nationaux • Champions du Comté • Idéal pour {{childName}}',
      
      tennis_title: 'Développement en Tennis',
      tennis_details: '{{childName}}, avec 12 courts en dur, 6 courts en gazon et 4 courts couverts à votre disposition, vous aurez des opportunités toute l\'année pour perfectionner votre jeu. Nos entraîneurs agréés LTA offrent un coaching individuel et en groupe adapté à votre niveau.',
      tennis_highlight: 'Finalistes des Écoles Nationales • Centre Régional LTA',
      
      rugby_title: 'Excellence en Rugby',
      rugby_details: '{{childName}}, vous rejoindrez plus de 15 équipes de U13 au 1er XV en compétition au plus haut niveau. Douze terrains de taille réglementaire, dont des zones d\'entraînement éclairées, offrent l\'environnement parfait pour votre développement.',
      rugby_highlight: 'Champions Nationaux U18 • Internationaux d\'Angleterre',
      
      netball_title: 'Excellence en Netball',
      netball_details: '{{childName}}, vous participerez avec 12 équipes de U13 au 1er VII au niveau régional et national. Six terrains extérieurs et des installations couvertes offrent des opportunités d\'entraînement toute l\'année.',
      netball_highlight: 'Champions Régionaux • Top 10 National',
      
      cricket_title: 'Excellence en Cricket',
      cricket_details: '{{childName}}, vous vous entraînerez sur notre carré de cricket de norme professionnelle avec 12 terrains. Le centre de cricket intérieur avec machines de lancer et analyse vidéo offre un développement toute l\'année.',
      cricket_highlight: 'Vainqueurs de la Coupe du Comté • Coaching MCC',
      
      swimming_title: 'Excellence en Natation',
      swimming_details: '{{childName}}, vous vous entraînerez dans notre piscine intérieure chauffée de 25m à six couloirs avec systèmes de chronométrage électronique. L\'entraînement quotidien de l\'équipe à partir de 6h30 développe les compétences de natation compétitive.',
      swimming_highlight: 'Champions Régionaux • 8 Nageurs du Comté',
      
      rowing_title: 'Excellence en Aviron',
      rowing_details: '{{childName}}, notre hangar à bateaux ultramoderne sur la rivière Severn abrite une flotte de plus de 50 bateaux. Participez à la Régate Royale de Henley et à la Régate Nationale des Écoles.',
      rowing_highlight: 'Qualifiés pour Henley • Pipeline Juniors GB',
      
      squash_title: 'Excellence en Squash',
      squash_details: '{{childName}}, vous vous entraînerez sur quatre courts de championnat à dos de verre dans notre centre de squash dédié. Le coaching professionnel d\'anciens joueurs du circuit PSA offre un soutien individuel.',
      squash_highlight: 'Top 10 des Écoles du Royaume-Uni • Lieu d\'Entraînement du Comté',
      
      badminton_title: 'Excellence en Badminton',
      badminton_details: '{{childName}}, vous participerez dans notre salle de sport à quatre courts avec sol spécialisé pour le badminton. Les équipes participent aux Championnats Nationaux des Écoles et aux ligues du comté.',
      badminton_highlight: 'Champions du Comté • Finales Régionales',
      
      basketball_title: 'Excellence en Basketball',
      basketball_details: '{{childName}}, vous jouerez sur des courts intérieurs avec paniers professionnels et tableaux d\'affichage électroniques. Les équipes de garçons et de filles participent aux ligues régionales avec des méthodes d\'entraînement de style américain.',
      basketball_highlight: 'Vainqueurs de la Ligue Régionale • Qualifiés pour les Écoles Nationales',
      
      football_title: 'Excellence en Football',
      football_details: '{{childName}}, vous vous entraînerez sur notre terrain 3G tous temps et plusieurs terrains en gazon. Des entraîneurs qualifiés FA, dont des titulaires de licence UEFA B, fournissent des conseils d\'experts.',
      football_highlight: 'Champions Régionaux ISFA • Demi-finales de la Coupe du Comté',
      
      cross_country_title: 'Excellence en Cross Country',
      cross_country_details: '{{childName}}, vous vous entraînerez sur de magnifiques parcours de campagne avec un coaching spécialisé en distance. Notre programme d\'hiver développe l\'endurance et la force mentale.',
      cross_country_highlight: 'Champions du Comté • Compétiteurs Régionaux',
      
      golf_title: 'Excellence en Golf',
      golf_details: '{{childName}}, vous bénéficierez de partenariats avec les clubs de golf Cotswold Hills et Lilley Brook. Coaching professionnel PGA avec analyse vidéo et technologie Trackman.',
      golf_highlight: 'Finales ISGA • 3 Joueurs du Comté',
      
      equestrian_title: 'Excellence Équestre',
      equestrian_details: '{{childName}}, programme complet couvrant le saut d\'obstacles, le concours complet, le dressage et le polo. Partenariat avec des centres locaux agréés BHS. Compétitions NSEA, notamment les Championnats des Écoles à Hickstead.',
      equestrian_highlight: 'Qualifiés Nationaux NSEA • Compétiteurs de Hickstead',
      
      clay_shooting_title: 'Excellence en Tir au Plateau',
      clay_shooting_details: '{{childName}}, partenariat avec des champs de tir locaux de premier ordre. Instruction qualifiée CPSA dans toutes les disciplines. Participez au Challenge des Écoles et aux championnats NSRA.',
      clay_shooting_highlight: 'Finalistes du Challenge des Écoles • Enregistré CPSA',
      
      polo_title: 'Excellence en Polo',
      polo_details: '{{childName}}, introduction au polo au Club de Polo d\'Edgeworth. Coaching HPA avec chevaux fournis. Participez aux tournois SUPA des écoles.',
      polo_highlight: 'Joueurs de Tournois SUPA • Affilié HPA',
      
      water_polo_title: 'Excellence en Water-Polo',
      water_polo_details: '{{childName}}, entraînez-vous dans notre piscine de 25m avec équipement dédié. Équipes de garçons et de filles participant aux ligues régionales.',
      water_polo_highlight: 'Ligue Régionale • Compétition Nationale des Écoles',
      
      volleyball_title: 'Excellence en Volleyball',
      volleyball_details: '{{childName}}, volleyball en salle dans une salle de sport avec filets de norme de compétition. Les équipes participent aux compétitions Nationales des Écoles.',
      volleyball_highlight: 'Compétiteurs Régionaux • Sport à la Croissance la Plus Rapide',
      
      ultimate_title: 'Excellence en Ultimate Frisbee',
      ultimate_details: '{{childName}}, équipes mixtes participant à des tournois scolaires. Participez aux tournois Junior de UK Ultimate.',
      ultimate_highlight: 'Tournoi National des Écoles • Prix du Sport Inclusif',
      
      lacrosse_title: 'Excellence en Lacrosse',
      lacrosse_details: '{{childName}}, vous rejoindrez notre programme de lacrosse en pleine croissance avec un coaching spécialisé et des matchs compétitifs contre d\'autres écoles.',
      lacrosse_highlight: 'Programme en Croissance • Matchs Compétitifs',
      
      rounders_title: 'Excellence en Rounders',
      rounders_details: '{{childName}}, sport de trimestre d\'été avec des équipes de U13 au 1er IX. Participation aux tournois du comté, y compris les compétitions Lady Taverners.',
      rounders_highlight: 'Vainqueurs du Tournoi du Comté • Finales Régionales'
    }
  });

  // DE (German)
  R('de', 'sports', {
    placeholders: {
      child: 'Kind'
    },
    ui: {
      click_to_mute: 'KLICKEN ZUM STUMMSCHALTEN',
      click_to_unmute: 'KLICKEN FÜR TON',
      show_more: 'Mehr Sportarten anzeigen',
      hide_details: 'Sportdetails ausblenden'
    },
    gender_rugby: {
      tab: 'RUGBY',
      title: 'RUGBY IN CHELTENHAM',
      hero_title: 'Stärke, Strategie, Erfolg',
      subtitle: 'Elite-Rugby-Programm mit Internationaler Anerkennung',
      stat1: '15+',
      label1: 'Mannschaften',
      stat2: '12',
      label2: 'Spielfelder',
      stat3: '2',
      label3: 'Jahrestouren'
    },
    gender_netball: {
      tab: 'NETBALL',
      title: 'NETBALL IN CHELTENHAM',
      hero_title: 'Präzision, Kraft, Leistung',
      subtitle: 'Elite-Netball-Programm mit Nationaler Anerkennung',
      stat1: '12',
      label1: 'Mannschaften',
      stat2: '6',
      label2: 'Plätze'
    },
    personal: {
      interest_note_sports: '{{childName}}, mit Ihrer bereits offensichtlichen Leidenschaft für Sport, ',
      interest_note_general: '{{childName}}, ',
      highlight_default: 'Hockey • Leichtathletik • Tennis • Sowie Viele Weitere Sportarten zu Entdecken'
    },
    sports: {
      hockey_title: 'Exzellenz im Hockey',
      hockey_details: '{{childName}}, Sie werden auf unseren zwei wasserbasierenden Astro-Plätzen von olympischem Standard neben 20+ Mannschaften leidenschaftlicher Spieler trainieren. Mit professionellem Coaching von ehemaligen internationalen Spielern entwickeln Sie fortgeschrittene Stockfähigkeiten, taktisches Bewusstsein und Spielintelligenz. Regelmäßige Spiele gegen Top-Schulen wie Millfield und Marlborough sowie Auftritte bei Nationalen Finalen fordern Sie auf höchstem Niveau heraus.',
      hockey_highlight: 'U18 Nationale Finalen 2024 • Perfekt für {{childName}}',
      
      athletics_title: 'Leichtathletik-Programm',
      athletics_details: '{{childName}}, unsere Leichtathletikeinrichtungen werden Ihr Trainingsplatz für Exzellenz sein. Ob Sie in Sprints, Mittelstrecke, Wurf oder Sprung hervorragen, unsere spezialisierten Trainer entwickeln Ihre Technik durch biomechanische Analyse. Sie werden an prestigeträchtigen Veranstaltungen teilnehmen, einschließlich der Englischen Schulmeisterschaften und ISA-Meisterschaften.',
      athletics_highlight: '3 Nationale Medaillengewinner • County-Meister • Ideal für {{childName}}',
      
      tennis_title: 'Tennis-Entwicklung',
      tennis_details: '{{childName}}, mit 12 Hartplätzen, 6 Rasenplätzen und 4 Hallenplätzen stehen Ihnen das ganze Jahr über Möglichkeiten zur Verfügung, Ihr Spiel zu perfektionieren. Unsere LTA-lizenzierten Trainer bieten sowohl Individual- als auch Gruppencoaching, das auf Ihr Können zugeschnitten ist.',
      tennis_highlight: 'Nationale Schul-Finalisten • LTA-Regionalzentrum',
      
      rugby_title: 'Exzellenz im Rugby',
      rugby_details: '{{childName}}, Sie werden sich 15+ Mannschaften von U13 bis 1st XV anschließen, die auf höchstem Niveau wetteifern. Zwölf Spielfelder in voller Größe, einschließlich beleuchteter Trainingsbereiche, bieten die perfekte Umgebung für Ihre Entwicklung.',
      rugby_highlight: 'U18 Nationale Meister • England-Nationalspieler',
      
      netball_title: 'Exzellenz im Netball',
      netball_details: '{{childName}}, Sie werden mit 12 Mannschaften von U13 bis 1st VII auf regionaler und nationaler Ebene wetteifern. Sechs Außenplätze und Hallenfacilities bieten ganzjährige Trainingsmöglichkeiten.',
      netball_highlight: 'Regionale Meister • Nationale Top 10',
      
      cricket_title: 'Exzellenz im Cricket',
      cricket_details: '{{childName}}, Sie werden auf unserem professionellen Cricket-Platz mit 12 Pitches trainieren. Das Indoor-Cricket-Zentrum mit Wurfmaschinen und Videoanalyse bietet ganzjährige Entwicklung.',
      cricket_highlight: 'County-Cup-Gewinner • MCC-Coaching',
      
      swimming_title: 'Exzellenz im Schwimmen',
      swimming_details: '{{childName}}, Sie werden in unserem beheizten 25m-Hallenbad mit sechs Bahnen und elektronischen Zeitmesssystemen trainieren. Tägliches Mannschaftstraining ab 6:30 Uhr entwickelt wettbewerbsfähige Schwimmfähigkeiten.',
      swimming_highlight: 'Regionale Meister • 8 County-Schwimmer',
      
      rowing_title: 'Exzellenz im Rudern',
      rowing_details: '{{childName}}, unser hochmodernes Bootshaus am Fluss Severn beherbergt eine Flotte von über 50 Booten. Nehmen Sie an der Henley Royal Regatta und der National Schools\' Regatta teil.',
      rowing_highlight: 'Henley-Qualifikanten • GB-Junioren-Pipeline',
      
      squash_title: 'Exzellenz im Squash',
      squash_details: '{{childName}}, Sie werden auf vier glasrückwandigen Championship-Courts in unserem dedizierten Squash-Zentrum trainieren. Professionelles Coaching von ehemaligen PSA-Tour-Spielern bietet individuelle Unterstützung.',
      squash_highlight: 'Top 10 UK-Schule • County-Trainingsort',
      
      badminton_title: 'Exzellenz im Badminton',
      badminton_details: '{{childName}}, Sie werden in unserer Vier-Court-Sporthalle mit spezialisiertem Badminton-Boden wetteifern. Mannschaften nehmen an Nationalen Schulmeisterschaften und County-Ligen teil.',
      badminton_highlight: 'County-Meister • Regionale Finalen',
      
      basketball_title: 'Exzellenz im Basketball',
      basketball_details: '{{childName}}, Sie werden auf Hallenplätzen mit professionellen Körben und elektronischen Anzeigetafeln spielen. Jungen- und Mädchenmannschaften wetteifern in regionalen Ligen mit amerikanischen Trainingsmethoden.',
      basketball_highlight: 'Regionale Ligasieger • Nationale Schul-Qualifikanten',
      
      football_title: 'Exzellenz im Fußball',
      football_details: '{{childName}}, Sie werden auf unserem 3G-Allwetterplatz und mehreren Rasenplätzen trainieren. FA-qualifizierte Trainer, darunter UEFA-B-Lizenzinhaber, bieten fachkundige Anleitung.',
      football_highlight: 'ISFA-Regionalmeister • County-Cup-Halbfinale',
      
      cross_country_title: 'Exzellenz im Crosslauf',
      cross_country_details: '{{childName}}, Sie werden auf wunderschönen Landschaftsrouten mit spezialisiertem Distanzcoaching trainieren. Unser Winterprogramm baut Ausdauer und mentale Stärke auf.',
      cross_country_highlight: 'County-Meister • Regionale Wettkämpfer',
      
      golf_title: 'Exzellenz im Golf',
      golf_details: '{{childName}}, Sie profitieren von Partnerschaften mit den Golfclubs Cotswold Hills und Lilley Brook. PGA-Professionelles Coaching mit Videoanalyse und Trackman-Technologie.',
      golf_highlight: 'ISGA-Finalen • 3 County-Spieler',
      
      equestrian_title: 'Reitsport-Exzellenz',
      equestrian_details: '{{childName}}, umfassendes Programm mit Springreiten, Vielseitigkeit, Dressur und Polo. Partnerschaft mit lokalen BHS-anerkannten Zentren. NSEA-Wettbewerbe einschließlich Schulmeisterschaften in Hickstead.',
      equestrian_highlight: 'NSEA-Nationale Qualifikanten • Hickstead-Wettkämpfer',
      
      clay_shooting_title: 'Exzellenz im Tontaubenschießen',
      clay_shooting_details: '{{childName}}, Partnerschaft mit erstklassigen lokalen Schießplätzen. CPSA-qualifizierte Anleitung in allen Disziplinen. Wetteifern Sie bei der Schools Challenge und NSRA-Meisterschaften.',
      clay_shooting_highlight: 'Schools-Challenge-Finalisten • CPSA-Registriert',
      
      polo_title: 'Exzellenz im Polo',
      polo_details: '{{childName}}, Einführung in Polo im Edgeworth Polo Club. HPA-Coaching mit bereitgestellten Pferden. Wetteifern Sie bei SUPA-Schulturnieren.',
      polo_highlight: 'SUPA-Turnierspieler • HPA-Angeschlossen',
      
      water_polo_title: 'Exzellenz im Wasserball',
      water_polo_details: '{{childName}}, trainieren Sie in unserem 25m-Pool mit dedizierter Ausrüstung. Jungen- und Mädchenmannschaften wetteifern in regionalen Ligen.',
      water_polo_highlight: 'Regionale Liga • Nationale Schulwettbewerb',
      
      volleyball_title: 'Exzellenz im Volleyball',
      volleyball_details: '{{childName}}, Hallen-Volleyball in der Sporthalle mit wettkampfstandardmäßigen Netzen. Mannschaften wetteifern bei Nationalen Schulwettbewerben.',
      volleyball_highlight: 'Regionale Wettkämpfer • Am Schnellsten Wachsender Sport',
      
      ultimate_title: 'Exzellenz im Ultimate Frisbee',
      ultimate_details: '{{childName}}, gemischte Mannschaften, die bei Schulturnieren wetteifern. Nehmen Sie an UK Ultimate Junior-Turnieren teil.',
      ultimate_highlight: 'Nationales Schulturnier • Inklusiver Sport-Preis',
      
      lacrosse_title: 'Exzellenz im Lacrosse',
      lacrosse_details: '{{childName}}, Sie werden sich unserem wachsenden Lacrosse-Programm mit spezialisiertem Coaching und Wettkampfspielen gegen andere Schulen anschließen.',
      lacrosse_highlight: 'Wachsendes Programm • Wettkampfspiele',
      
      rounders_title: 'Exzellenz im Rounders',
      rounders_details: '{{childName}}, Sommersport mit Mannschaften von U13 bis 1st IX. Teilnahme an County-Turnieren, einschließlich Lady-Taverners-Wettbewerben.',
      rounders_highlight: 'County-Turniersieger • Regionale Finalen'
    }
  });

  // zh-Hans (Chinese Simplified)
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
      highlight_default: '曲棍球 • 田径 • 网球 • 还有更多运动等您探索'
    },
    sports: {
      hockey_title: '曲棍球卓越',
      hockey_details: '{{childName}}，您将在我们两个奥林匹克标准的水基人工草地球场上与20多支充满热情的球队一起训练。在前国际球员的专业指导下，您将培养高级球棍技能、战术意识和比赛智慧。定期与米尔菲尔德和马尔伯勒等顶级学校的比赛，以及全国决赛的亮相，将在最高水平上挑战您。',
      hockey_highlight: 'U18全国决赛2024 • 非常适合{{childName}}',
      
      athletics_title: '田径课程',
      athletics_details: '{{childName}}，我们的田径设施将成为您追求卓越的训练场。无论您在短跑、中距离、投掷还是跳跃方面表现出色，我们的专业教练都将通过生物力学分析来提升您的技术。您将参加包括英格兰学校锦标赛和ISA锦标赛在内的著名赛事。',
      athletics_highlight: '3名全国奖牌得主 • 郡冠军 • 非常适合{{childName}}',
      
      tennis_title: '网球发展',
      tennis_details: '{{childName}}，凭借12个硬地球场、6个草地球场和4个室内球场，您将全年都有机会完善自己的技艺。我们的LTA认证教练提供根据您技能水平量身定制的个人和团体指导。',
      tennis_highlight: '全国学校决赛选手 • LTA地区中心',
      
      rugby_title: '橄榄球卓越',
      rugby_details: '{{childName}}，您将加入从U13到第一XV的15支以上球队，在最高水平上竞争。包括照明训练区在内的12个全尺寸球场为您的发展提供了完美的环境。',
      rugby_highlight: 'U18全国冠军 • 英格兰国际球员',
      
      netball_title: '无板篮球卓越',
      netball_details: '{{childName}}，您将与从U13到第一VII的12支球队在地区和全国层面竞争。6个室外球场和室内设施提供全年训练机会。',
      netball_highlight: '地区冠军 • 全国前10名',
      
      cricket_title: '板球卓越',
      cricket_details: '{{childName}}，您将在我们拥有12个投球区的专业标准板球场上训练。配备投球机和视频分析的室内板球中心提供全年发展机会。',
      cricket_highlight: '郡杯冠军 • MCC指导',
      
      swimming_title: '游泳卓越',
      swimming_details: '{{childName}}，您将在我们配备电子计时系统的25米六泳道温水室内游泳池中训练。从早上6:30开始的每日队伍训练培养竞技游泳技能。',
      swimming_highlight: '地区冠军 • 8名郡游泳运动员',
      
      rowing_title: '赛艇卓越',
      rowing_details: '{{childName}}，我们位于塞文河畔的最先进船库拥有50多艘船只。在亨利皇家赛艇会和全国学校赛艇会上竞争。',
      rowing_highlight: '亨利资格赛选手 • GB青少年梯队',
      
      squash_title: '壁球卓越',
      squash_details: '{{childName}}，您将在我们专用壁球中心的四个玻璃背板锦标赛球场上训练。来自前PSA巡回赛球员的专业指导提供个人支持。',
      squash_highlight: '英国前10名学校 • 郡训练场地',
      
      badminton_title: '羽毛球卓越',
      badminton_details: '{{childName}}，您将在我们配备专业羽毛球地板的四场体育馆中竞争。球队参加全国学校锦标赛和郡联赛。',
      badminton_highlight: '郡冠军 • 地区决赛',
      
      basketball_title: '篮球卓越',
      basketball_details: '{{childName}}，您将在配备专业篮筐和电子记分牌的室内球场上打球。男女球队以美式训练方法参加地区联赛。',
      basketball_highlight: '地区联赛冠军 • 全国学校资格赛',
      
      football_title: '足球卓越',
      football_details: '{{childName}}，您将在我们的3G全天候球场和多个草地球场上训练。包括UEFA B执照持有者在内的FA认证教练提供专业指导。',
      football_highlight: 'ISFA地区冠军 • 郡杯半决赛',
      
      cross_country_title: '越野跑卓越',
      cross_country_details: '{{childName}}，您将在美丽的乡村路线上进行专业的长跑训练。我们的冬季课程培养耐力和心理韧性。',
      cross_country_highlight: '郡冠军 • 地区竞争者',
      
      golf_title: '高尔夫卓越',
      golf_details: '{{childName}}，您将从与科茨沃尔德山和利利布鲁克高尔夫俱乐部的合作中受益。PGA专业指导配合视频分析和Trackman技术。',
      golf_highlight: 'ISGA决赛 • 3名郡球员',
      
      equestrian_title: '马术卓越',
      equestrian_details: '{{childName}}，涵盖障碍赛、三日赛、盛装舞步和马球的综合课程。与当地BHS批准的中心合作。NSEA比赛，包括在希克斯特德举行的学校锦标赛。',
      equestrian_highlight: 'NSEA全国资格赛 • 希克斯特德竞争者',
      
      clay_shooting_title: '飞碟射击卓越',
      clay_shooting_details: '{{childName}}，与当地顶级射击场合作。CPSA资格指导涵盖所有学科。在学校挑战赛和NSRA锦标赛中竞争。',
      clay_shooting_highlight: '学校挑战赛决赛选手 • CPSA注册',
      
      polo_title: '马球卓越',
      polo_details: '{{childName}}，在埃奇沃思马球俱乐部介绍马球。提供马匹的HPA指导。在SUPA学校锦标赛中竞争。',
      polo_highlight: 'SUPA锦标赛球员 • HPA附属',
      
      water_polo_title: '水球卓越',
      water_polo_details: '{{childName}}，在我们配备专用设备的25米游泳池中训练。男女球队参加地区联赛。',
      water_polo_highlight: '地区联赛 • 全国学校比赛',
      
      volleyball_title: '排球卓越',
      volleyball_details: '{{childName}}，在体育馆配备比赛标准网的室内排球。球队参加全国学校比赛。',
      volleyball_highlight: '地区竞争者 • 增长最快的运动',
      
      ultimate_title: '极限飞盘卓越',
      ultimate_details: '{{childName}}，混合球队参加学校锦标赛。参加UK Ultimate青少年锦标赛。',
      ultimate_highlight: '全国学校锦标赛 • 包容性运动奖',
      
      lacrosse_title: '长曲棍球卓越',
      lacrosse_details: '{{childName}}，您将加入我们不断发展的长曲棍球课程，接受专业指导并与其他学校进行竞技比赛。',
      lacrosse_highlight: '成长中的课程 • 竞技比赛',
      
      rounders_title: '圆场棒球卓越',
      rounders_details: '{{childName}}，夏季学期运动，球队从U13到第一IX。参加郡锦标赛，包括Lady Taverners比赛。',
      rounders_highlight: '郡锦标赛冠军 • 地区决赛'
    }
  });

  // IT (Italian)
  R('it', 'sports', {
    placeholders: {
      child: 'Bambino'
    },
    ui: {
      click_to_mute: 'CLICCARE PER DISATTIVARE AUDIO',
      click_to_unmute: 'CLICCARE PER AUDIO',
      show_more: 'Mostra più sport',
      hide_details: 'Nascondi dettagli sportivi'
    },
    gender_rugby: {
      tab: 'RUGBY',
      title: 'RUGBY A CHELTENHAM',
      hero_title: 'Forza, Strategia, Successo',
      subtitle: 'Programma di Rugby d\'Élite con Riconoscimento Internazionale',
      stat1: '15+',
      label1: 'Squadre',
      stat2: '12',
      label2: 'Campi',
      stat3: '2',
      label3: 'Tour Annuali'
    },
    gender_netball: {
      tab: 'NETBALL',
      title: 'NETBALL A CHELTENHAM',
      hero_title: 'Precisione, Potenza, Prestazione',
      subtitle: 'Programma di Netball d\'Élite con Riconoscimento Nazionale',
      stat1: '12',
      label1: 'Squadre',
      stat2: '6',
      label2: 'Campi'
    },
    personal: {
      interest_note_sports: '{{childName}}, con la tua passione per lo sport già evidente, ',
      interest_note_general: '{{childName}}, ',
      highlight_default: 'Hockey • Atletica • Tennis • Inoltre Molti Altri Sport da Esplorare'
    },
    sports: {
      hockey_title: 'Eccellenza nell\'Hockey',
      hockey_details: '{{childName}}, ti allenerai sui nostri due campi Astro a base d\'acqua di standard olimpico insieme a oltre 20 squadre di giocatori appassionati. Con coaching professionale da ex giocatori internazionali, svilupperai abilità avanzate con il bastone, consapevolezza tattica e intelligenza di gioco. Partite regolari contro le migliori scuole come Millfield e Marlborough, oltre a partecipazioni alle Finali Nazionali, ti sfideranno al più alto livello.',
      hockey_highlight: 'Finali Nazionali U18 2024 • Perfetto per {{childName}}',
      
      athletics_title: 'Programma di Atletica',
      athletics_details: '{{childName}}, le nostre strutture di atletica saranno il tuo campo di allenamento per l\'eccellenza. Che tu eccella negli sprint, media distanza, lanci o salti, i nostri allenatori specializzati svilupperanno la tua tecnica attraverso l\'analisi biomeccanica. Competerai in eventi prestigiosi tra cui i Campionati Scolastici Inglesi e i Campionati ISA.',
      athletics_highlight: '3 Medagliati Nazionali • Campioni di Contea • Ideale per {{childName}}',
      
      tennis_title: 'Sviluppo del Tennis',
      tennis_details: '{{childName}}, con 12 campi in cemento, 6 campi in erba e 4 campi coperti a tua disposizione, avrai opportunità tutto l\'anno per perfezionare il tuo gioco. I nostri allenatori con licenza LTA forniscono coaching individuale e di gruppo su misura per il tuo livello di abilità.',
      tennis_highlight: 'Finalisti delle Scuole Nazionali • Centro Regionale LTA',
      
      rugby_title: 'Eccellenza nel Rugby',
      rugby_details: '{{childName}}, ti unirai a oltre 15 squadre da U13 a 1st XV in competizione al più alto livello. Dodici campi a grandezza naturale incluse aree di allenamento illuminate forniscono l\'ambiente perfetto per il tuo sviluppo.',
      rugby_highlight: 'Campioni Nazionali U18 • Internazionali d\'Inghilterra',
      
      netball_title: 'Eccellenza nel Netball',
      netball_details: '{{childName}}, competerai con 12 squadre da U13 a 1st VII a livello regionale e nazionale. Sei campi all\'aperto e strutture coperte forniscono opportunità di allenamento tutto l\'anno.',
      netball_highlight: 'Campioni Regionali • Top 10 Nazionale',
      
      cricket_title: 'Eccellenza nel Cricket',
      cricket_details: '{{childName}}, ti allenerai sul nostro quadrato di cricket di standard professionale con 12 campi. Il centro di cricket coperto con macchine da lancio e analisi video fornisce sviluppo tutto l\'anno.',
      cricket_highlight: 'Vincitori della Coppa di Contea • Coaching MCC',
      
      swimming_title: 'Eccellenza nel Nuoto',
      swimming_details: '{{childName}}, ti allenerai nella nostra piscina coperta riscaldata da 25m a sei corsie con sistemi di cronometraggio elettronico. L\'allenamento quotidiano della squadra dalle 6:30 sviluppa abilità di nuoto competitive.',
      swimming_highlight: 'Campioni Regionali • 8 Nuotatori di Contea',
      
      rowing_title: 'Eccellenza nel Canottaggio',
      rowing_details: '{{childName}}, la nostra rimessa per barche all\'avanguardia sul fiume Severn ospita una flotta di oltre 50 imbarcazioni. Compete alla Henley Royal Regatta e alla National Schools\' Regatta.',
      rowing_highlight: 'Qualificati per Henley • Pipeline Juniores GB',
      
      squash_title: 'Eccellenza nello Squash',
      squash_details: '{{childName}}, ti allenerai su quattro campi da campionato con vetro sul retro nel nostro centro squash dedicato. Coaching professionale da ex giocatori del tour PSA fornisce supporto individuale.',
      squash_highlight: 'Top 10 Scuole del Regno Unito • Sede di Allenamento di Contea',
      
      badminton_title: 'Eccellenza nel Badminton',
      badminton_details: '{{childName}}, competerai nella nostra palestra a quattro campi con pavimento specializzato per badminton. Le squadre competono nei Campionati Nazionali delle Scuole e nelle leghe di contea.',
      badminton_highlight: 'Campioni di Contea • Finali Regionali',
      
      basketball_title: 'Eccellenza nella Pallacanestro',
      basketball_details: '{{childName}}, giocherai su campi coperti con canestri professionali e tabelloni elettronici. Le squadre di ragazzi e ragazze competono nelle leghe regionali con metodi di allenamento in stile americano.',
      basketball_highlight: 'Vincitori della Lega Regionale • Qualificati per le Scuole Nazionali',
      
      football_title: 'Eccellenza nel Calcio',
      football_details: '{{childName}}, ti allenerai sul nostro campo 3G per tutte le stagioni e su più campi in erba. Allenatori qualificati FA tra cui titolari di licenza UEFA B forniscono guida esperta.',
      football_highlight: 'Campioni Regionali ISFA • Semifinali della Coppa di Contea',
      
      cross_country_title: 'Eccellenza nella Corsa Campestre',
      cross_country_details: '{{childName}}, ti allenerai su bellissimi percorsi di campagna con coaching specializzato sulla distanza. Il nostro programma invernale costruisce resistenza e forza mentale.',
      cross_country_highlight: 'Campioni di Contea • Competitori Regionali',
      
      golf_title: 'Eccellenza nel Golf',
      golf_details: '{{childName}}, beneficerai di partnership con i golf club Cotswold Hills e Lilley Brook. Coaching professionale PGA con analisi video e tecnologia Trackman.',
      golf_highlight: 'Finali ISGA • 3 Giocatori di Contea',
      
      equestrian_title: 'Eccellenza Equestre',
      equestrian_details: '{{childName}}, programma completo che copre salto ostacoli, concorso completo, dressage e polo. Partnership con centri locali approvati BHS. Competizioni NSEA inclusi i Campionati delle Scuole a Hickstead.',
      equestrian_highlight: 'Qualificati Nazionali NSEA • Competitori di Hickstead',
      
      clay_shooting_title: 'Eccellenza nel Tiro al Piattello',
      clay_shooting_details: '{{childName}}, partnership con campi di tiro locali di primo livello. Istruzione qualificata CPSA in tutte le discipline. Compete nella Schools Challenge e nei campionati NSRA.',
      clay_shooting_highlight: 'Finalisti della Schools Challenge • Registrato CPSA',
      
      polo_title: 'Eccellenza nel Polo',
      polo_details: '{{childName}}, introduzione al polo all\'Edgeworth Polo Club. Coaching HPA con cavalli forniti. Compete nei tornei SUPA delle scuole.',
      polo_highlight: 'Giocatori di Tornei SUPA • Affiliato HPA',
      
      water_polo_title: 'Eccellenza nella Pallanuoto',
      water_polo_details: '{{childName}}, allenati nella nostra piscina da 25m con attrezzatura dedicata. Squadre di ragazzi e ragazze che competono nelle leghe regionali.',
      water_polo_highlight: 'Lega Regionale • Competizione Nazionale delle Scuole',
      
      volleyball_title: 'Eccellenza nella Pallavolo',
      volleyball_details: '{{childName}}, pallavolo al coperto nella palestra con reti di standard di competizione. Le squadre competono nelle competizioni Nazionali delle Scuole.',
      volleyball_highlight: 'Competitori Regionali • Sport in Più Rapida Crescita',
      
      ultimate_title: 'Eccellenza nell\'Ultimate Frisbee',
      ultimate_details: '{{childName}}, squadre miste che competono in tornei scolastici. Partecipa ai tornei Junior di UK Ultimate.',
      ultimate_highlight: 'Torneo Nazionale delle Scuole • Premio Sport Inclusivo',
      
      lacrosse_title: 'Eccellenza nel Lacrosse',
      lacrosse_details: '{{childName}}, ti unirai al nostro programma di lacrosse in crescita con coaching specializzato e partite competitive contro altre scuole.',
      lacrosse_highlight: 'Programma in Crescita • Partite Competitive',
      
      rounders_title: 'Eccellenza nel Rounders',
      rounders_details: '{{childName}}, sport del trimestre estivo con squadre da U13 a 1st IX. Partecipazione a tornei di contea inclusi i concorsi Lady Taverners.',
      rounders_highlight: 'Vincitori del Torneo di Contea • Finali Regionali'
    }
  });
})();