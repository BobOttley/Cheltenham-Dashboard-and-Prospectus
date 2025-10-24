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
      note = `I understand ${ctx.childName}'s interest in the Sciences — our laboratories are equipped to university standard and our Science department has an exceptional track record, with many pupils going on to read Medicine, Engineering and Natural Sciences at top universities.`;
    } else if (ai.includes('mathematics')){
      note = `For a pupil with ${ctx.childName}'s mathematical interests, our setting from day one and extension opportunities including UKMT challenges provide the perfect environment to excel.`;
    } else if (ai.includes('languages')){
      note = `${ctx.childName}'s interest in languages will flourish here with our offering of French, Spanish, German and Mandarin, plus regular exchanges and immersion trips.`;
    } else if (ai.includes('humanities')){
      note = `Our Humanities departments would be perfect for ${ctx.childName} — from the Morley History Society to Geography field trips, we bring these subjects to life.`;
    } else if (ai.includes('arts')){
      note = `${ctx.childName}'s creative interests align perfectly with our exceptional Art department and dedicated studio spaces.`;
    }
    el.textContent = note;
  };
  const setSportNote = () => {
    const el = $('.sport-interest-note', root);
    if(!el) return;
    const acts = ctx.activities || [];
    el.textContent = acts.includes('sports')
      ? `I see ${ctx.childName} is interested in sport — with over 30 sports on offer and coaching from professionals including Olympians and internationals, every pupil finds their passion.`
      : '';
  };
  const setPastoralNote = () => {
    const el = $('.pastoral-priority-note', root);
    if(!el) return;
    if (ctx?.priorities?.pastoral === 3){
      el.textContent = `I'm particularly pleased you value pastoral care so highly — with our Floreat wellbeing programme, dedicated House staff living on-site, and a 1:8 tutor ratio, ${ctx.childName}'s wellbeing will always be our priority.`;
    } else if (ctx.boardingPreference && ctx.boardingPreference.includes('Boarding')){
      el.textContent = `As a boarding family, you'll be reassured to know our House staff live on-site with their families, creating a true home from home.`;
    } else {
      el.textContent = '';
    }
  };
  setAcademicNote(); setSportNote(); setPastoralNote();

  // UI wiring: audio + scroll hint + overlay shift
  const video = $('.hero-video', root);
  const btn = $('#audioToggle', root);
  const icon = $('#audioIcon', root);
  const overlay = $('#heroOverlay', root);
  const scrollInd = $('#scrollIndicator', root);
  let isMuted = true;

  function setIcon(){ 
  if(icon) icon.textContent = isMuted ? 'Click to unmute' : 'Click to mute'; 
  }

  if(video){ video.muted = isMuted; }
  if(btn){
   btn.addEventListener('click', () => {
      isMuted = !isMuted;
      if(video) video.muted = isMuted;
     setIcon();
    });
  }
  setIcon();

  if(scrollInd){
    setTimeout(()=> scrollInd.classList.add('show'), 13000);
    scrollInd.addEventListener('click', () => window.scrollTo({top: window.innerHeight, behavior:'smooth'}));
  }
  if(overlay){
    setTimeout(()=> overlay.classList.add('move-bottom'), 12000);
  }

  // Auto-mute on scroll
  function handleScroll(){
    if (window.scrollY > 50 && video && !video.muted){
      isMuted = true; video.muted = true; setIcon();
    }
  }
  window.addEventListener('scroll', handleScroll, {passive:true});
};