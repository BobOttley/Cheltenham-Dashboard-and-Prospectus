// key_statistics.i18n.dict.js
(function(){
  if (!window.PEN_I18N || typeof PEN_I18N.registerTranslations !== 'function') {
    console.warn('[key_statistics.i18n] PEN_I18N.registerTranslations not found. Load js/loader.js first.');
    return;
  }
  const R = window.PEN_I18N.registerTranslations;

  // English
  R('en', 'key_statistics', {
    title: {
      by_numbers: "Key Statistics",
      for_child: "— for {{childName}}"
    },
    subtitle: {
      excellence: "Excellence measured in achievements, opportunities, and {{childName}}'s success."
    }
  });

  // Chinese (Simplified)
  R('zh-Hans', 'key_statistics', {
    title: {
      by_numbers: "关键数据",
      for_child: "——为{{childName}}"
    },
    subtitle: {
      excellence: "卓越体现在成就、机遇与{{childName}}的成功之中。"
    }
  });
})();