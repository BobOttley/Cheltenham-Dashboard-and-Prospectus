/* Hero module initialiser (FULL) */
MODULES['hero'] = (root, ctx) => {
  // Personal text
  $$('.child-name', root).forEach(el => el.textContent = ctx.childName);
  $$('.parent-name', root).forEach(el => el.textContent = ctx.parentName);
  $$('.family-name', root).forEach(el => el.textContent = ctx.familyName);

  // Lazy assets inside this module
  hydrateLazyAssets(root);

  // Notes (academic, sport, pastoral)
  const setAcademicNote = () => {
    const el = $('.academic-interest-note', root);
    if(!el) return;
    const ai = ctx.academicInterests || [];
    let note = '';
    if (ai.includes('sciences')){
      note = "Comprendo el interés de ${ctx.childName} por las Ciencias - nuestros laboratorios están equipados al nivel universitario y nuestro departamento de Ciencias tiene un historial excepcional, con muchos alumnos que estudian Medicina, Ingeniería y Ciencias Naturales en las mejores universidades.";
    } else if (ai.includes('mathematics')){
      note = "Para un alumno con los intereses matemáticos de ${ctx.childName}, nuestro entorno desde el primer día y las oportunidades de ampliación, incluidos los retos UKMT, proporcionan el entorno perfecto para sobresalir.";
    } else if (ai.includes('languages')){
      note = "el interés de ${ctx.childName} por los idiomas florecerá aquí con nuestra oferta de francés, español, alemán y mandarín, además de intercambios regulares y viajes de inmersión.";
    } else if (ai.includes('humanities')){
      note = "Nuestros departamentos de Humanidades serían perfectos para ${ctx.childName}: desde la Sociedad de Historia de Morley hasta las excursiones de Geografía, damos vida a estas asignaturas.";
    } else if (ai.includes('arts')){
      note = "los intereses creativos de ${ctx.childName} encajan a la perfección con nuestro excepcional departamento de Arte y nuestros espacios dedicados al estudio.";
    }
    el.textContent = note;
  };
  const setSportNote = () => {
    const el = $('.sport-interest-note', root);
    if(!el) return;
    const acts = ctx.activities || [];
    el.textContent = acts.includes('sports')
      ? "Veo que ${ctx.childName} está interesado en el deporte - con más de 30 deportes que se ofrecen y el entrenamiento de profesionales, incluyendo olímpicos e internacionales, cada alumno encuentra su pasión."
      : '';
  };
  const setPastoralNote = () => {
    const el = $('.pastoral-priority-note', root);
    if(!el) return;
    if (ctx?.priorities?.pastoral === 3){
      el.textContent = "Me complace especialmente que valore tanto la atención pastoral: con nuestro programa de bienestar Floreat, el personal de la Casa que vive in situ y una proporción de tutores de 1:8, el bienestar de ${ctx.childName} siempre será nuestra prioridad.";
    } else if (ctx.boardingPreference && ctx.boardingPreference.includes('Boarding')){
      el.textContent = "Como familia en régimen de internado, le tranquilizará saber que nuestro personal de la Casa vive in situ con sus familias, creando un verdadero hogar lejos del hogar.";
    } else {
      el.textContent = '";
    }
  };
  setAcademicNote(); setSportNote(); setPastoralNote();

  // UI wiring: audio + scroll hint + overlay shift
  const video = $(".hero-video"raíz);
  const btn = $("#audioToggle"raíz);
  const icono = $("#audioIcon"raíz);
  const overlay = $("#heroOverlay"raíz);
  const scrollInd = $("#scrollIndicator"raíz);
  let isMuted = true;

  function setIcon(){
  if(icon) icon.textContent = isMuted ?"Click to unmute' : 'Click to mute";
  }

  if(video){ video.muted = isMuted; }
  if(btn){
   btn.addEventListener("click", () => {
      isMuted = !isMuted;
      if(video) video.muted = isMuted;
     setIcon();
    });
  }
  setIcon();

  if(scrollInd){
    setTimeout(()=> scrollInd.classList.add("show"), 13000);
    scrollInd.addEventListener("click", () => window.scrollTo({top: window.innerHeight, behavior:"smooth"}));
  }
  if(overlay){
    setTimeout(()=> overlay.classList.add("move-bottom"), 12000);
  }

  // Auto-mute en scroll
  function handleScroll(){
    if (window.scrollY > 50 && video && !video.muted){
      isMuted = true; video.muted = true; setIcon();
    }
  }
  window.addEventListener("scroll', handleScroll, {passive:true});
};