/* Hero module initialiser (FULL) */
MODULES['hero'] = (root, ctx) =&gt; { // Texto personal $('.child-name'root).forEach(el =&gt; el.textContent = ctx.childName); $('.parent-name'root).forEach(el =&gt; el.textContent = ctx.parentName); $('.family-name', root).forEach(el =&gt; el.textContent = ctx.familyName); // Lazy assets dentro de este módulo hydrateLazyAssets(root); // Notas (académicas, deportivas, pastorales) const setAcademicNote = () =&gt; { const el = $('.academic-interest-note'raíz); if(!el) return; const ai = ctx.interesesacadémicos || []; let nota = ''; if (ai.includes('sciences')){
      note = `Comprendo el interés de ${ctx.childName} por las Ciencias: nuestros laboratorios están equipados al nivel universitario y nuestro departamento de Ciencias tiene un historial excepcional, con muchos alumnos que estudian Medicina, Ingeniería y Ciencias Naturales en las mejores universidades.`;
    } else if (ai.includes('mathematics')){
      note = `Para un alumno con los intereses matemáticos de ${ctx.childName}, nuestro entorno desde el primer día y las oportunidades de ampliación, incluidos los retos UKMT, proporcionan el ambiente perfecto para sobresalir.`;
    } else if (ai.includes('languages')){
      note = `el interés de ${ctx.childName} por los idiomas florecerá aquí con nuestra oferta de francés, español, alemán y mandarín, además de intercambios regulares y viajes de inmersión.`;
    } else if (ai.includes('humanities')){
      note = `Nuestros departamentos de Humanidades serían perfectos para ${ctx.childName}: desde la Sociedad de Historia de Morley hasta las excursiones de Geografía, damos vida a estas asignaturas.`;
    } else if (ai.includes('arts')){
      note = `los intereses creativos de ${ctx.childName} se alinean perfectamente con nuestro excepcional departamento de Arte y los espacios dedicados al estudio.`;
    }
    el.textContent = note;
  };
  const setSportNote = () => {
    const el = $('.sport-interest-note', root);
    if(!el) return;
    const acts = ctx.activities || [];
    el.textContent = acts.includes('sports')
      ? `Veo que ${ctx.childName} se interesa por el deporte: con más de 30 deportes que se ofrecen y entrenados por profesionales, incluidos olímpicos e internacionales, cada alumno encuentra su pasión.`
      : ''; }; const setNotaPastoral = () =&gt; { const el = $('.pastoral-priority-note', root);
    if(!el) return;
    if (ctx?.priorities?.pastoral === 3){
      el.textContent = `Me complace especialmente que valore tanto la atención pastoral: con nuestro programa de bienestar Floreat, personal de la Casa dedicado que vive in situ y una proporción de tutores de 1:8, el bienestar de ${ctx.childName} siempre será nuestra prioridad.`;
    } else if (ctx.boardingPreference && ctx.boardingPreference.includes('Boarding')){
      el.textContent = `Como familia en régimen de internado, le tranquilizará saber que nuestro personal de la Casa vive in situ con sus familias, creando un verdadero hogar lejos del hogar.`;
    } else {
      el.textContent = ''; } }; setAcademicNote(); setSportNote(); setPastoralNote(); // UI wiring: audio + scroll hint + overlay shift const video = $('.hero-video'raíz); const btn = $('#audioToggle'raíz); const icono = $('#audioIcon'root); const overlay = $('#heroOverlay'raíz); const scrollInd = $('#scrollIndicator'raíz); let isMuted = true; function setIcon(){ if(icono) icon.textContent = isMuted ? 'Click to unmute' : 'Haga clic para silenciar'; 
  }

  if(video){ video.muted = isMuted; }
  if(btn){
   btn.addEventListener('click', () =&gt; { isMuted = !isMuted; if(video) video.muted = isMuted; setIcon(); }); } setIcon(); if(scrollInd){ setTimeout(()=&gt; scrollInd.classList.add('show'), 13000); scrollInd.addEventListener('click', () =&gt; window.scrollTo({top: window.innerHeight, behavior:'smooth'})); } if(overlay){ setTimeout(()=&gt; overlay.classList.add('move-bottom'), 12000); } // Auto-mute on scroll function handleScroll(){ if (window.scrollY &gt; 50 &amp;&amp; video &amp;&amp; !video.muted){ isMuted = true; video.muted = true; setIcon(); } } window.addEventListener('scroll', handleScroll, {passive:true});
};