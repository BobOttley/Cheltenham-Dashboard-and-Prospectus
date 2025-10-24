// house_system.i18n.dict.js
(function(){
  if (!window.PEN_I18N || typeof window.PEN_I18N.registerTranslations !== 'function') {
    console.warn('[house_system.i18n] PEN_I18N.registerTranslations not found. Load js/loader.js first.');
    return;
  }
  const R = window.PEN_I18N.registerTranslations;

  // English (default)
  R('en', 'house_system', {
    placeholders: {
      your_child: "your child"
    },
    notes: {
      pastoral_high: "I'm pleased you value pastoral care so highly—{{childName}}'s wellbeing will always be our first priority."
    },
    ui: {
      click_for_sound: "🔊 Click for sound",
      click_to_mute: "🔇 Click to mute"
    }
  });

  // Chinese (Simplified) zh-Hans
  R('zh-Hans', 'house_system', {
    placeholders: {
      your_child: "您的孩子"
    },
    notes: {
      pastoral_high: "我很高兴您如此重视牧养关怀——{{childName}}的福祉将永远是我们的首要任务。"
    },
    ui: {
      click_for_sound: "🔊 点击开启声音",
      click_to_mute: "🔇 点击静音"
    }
  });
})();