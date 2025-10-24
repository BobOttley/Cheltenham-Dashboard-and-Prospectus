/**
 * PEN i18n Loader
 * Lightweight internationalization system for Cheltenham College Prospectus
 */

(function() {
  'use strict';

  // Dictionary storage: { moduleName: { lang: { key: value } } }
  const DICT = {};
  
  // Current language (default: English)
  let currentLang = 'en';

  /**
   * Register translations for a module
   * @param {string} lang - Language code (e.g., 'en', 'zh-Hans', 'es')
   * @param {string} moduleName - Module identifier
   * @param {object} translations - Translation object
   */
  function registerTranslations(lang, moduleName, translations) {
    if (!DICT[moduleName]) {
      DICT[moduleName] = {};
    }
    DICT[moduleName][lang] = translations;
    console.debug(`[i18n] Registered: ${moduleName}.${lang}`);
  }

  /**
   * Get translation for a key
   * @param {string} key - Translation key in format 'moduleName.path.to.key'
   * @param {object} vars - Variables to interpolate (e.g., {childName: 'Alice'})
   * @returns {string} Translated string or empty string if not found
   */
  function translate(key, vars = {}) {
    // Parse key: 'moduleName.section.key'
    const parts = key.split('.');
    if (parts.length < 2) {
      console.warn(`[i18n] Invalid key format: ${key}`);
      return '';
    }

    const moduleName = parts[0];
    const path = parts.slice(1);

    // Get module dictionary
    const moduleDict = DICT[moduleName];
    if (!moduleDict) {
      console.warn(`[i18n] Module not found: ${moduleName}`);
      return '';
    }

    // Get language dictionary (fallback to English)
    const langDict = moduleDict[currentLang] || moduleDict['en'];
    if (!langDict) {
      console.warn(`[i18n] No translations for: ${moduleName}.${currentLang}`);
      return '';
    }

    // Navigate to translation value
    let value = langDict;
    for (const part of path) {
      if (value && typeof value === 'object') {
        value = value[part];
      } else {
        console.warn(`[i18n] Translation not found: ${key}`);
        return '';
      }
    }

    // Handle missing translation
    if (value === undefined || value === null) {
      console.warn(`[i18n] Translation not found: ${key}`);
      return '';
    }

    // Convert to string
    let result = String(value);

    // Interpolate variables: {{varName}} -> value
    if (vars && typeof vars === 'object') {
      result = result.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
        return vars.hasOwnProperty(varName) ? String(vars[varName]) : match;
      });
    }

    return result;
  }

  /**
   * Set current language
   * @param {string} lang - Language code
   */
  function setLanguage(lang) {
    currentLang = lang || 'en';
    console.log(`[i18n] Language set to: ${currentLang}`);
    
    // Store in localStorage
    try {
      localStorage.setItem('prospectus_lang', currentLang);
    } catch (e) {
      console.warn('[i18n] Could not save language to localStorage');
    }

    // Dispatch event for UI updates
    window.dispatchEvent(new CustomEvent('languagechange', { 
      detail: { language: currentLang } 
    }));
  }

  /**
   * Get current language
   * @returns {string} Current language code
   */
  function getLanguage() {
    return currentLang;
  }

  /**
   * Initialize language from URL, localStorage, or default
   */
  function initLanguage() {
    // Priority: URL param > localStorage > window.PROSPECTUS_LANG > default
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    
    let lang = 'en';
    
    if (urlLang) {
      lang = urlLang;
    } else if (window.PROSPECTUS_LANG) {
      lang = window.PROSPECTUS_LANG;
    } else {
      try {
        const stored = localStorage.getItem('prospectus_lang');
        if (stored) lang = stored;
      } catch (e) {
        // localStorage unavailable
      }
    }

    setLanguage(lang);
  }

  // Export public API
  window.PEN_I18N = {
    registerTranslations,
    t: translate,
    setLanguage,
    getLanguage,
    version: '1.0.0'
  };

  // Auto-initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguage);
  } else {
    initLanguage();
  }

  console.log('[i18n] Loader initialized');
})();
