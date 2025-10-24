/**
 * translation.js - Module HTML Translation System
 * Loads language-specific HTML files for modules based on PROSPECTUS_LANG
 */

(function() {
  'use strict';

  // Language mapping from URL param to file suffix
  const LANG_MAP = {
    'en': '',  // English has no suffix
    'es': '_es',
    'fr': '_fr',
    'de': '_de',
    'zh-Hans': '_zh',
    'it': '_it'
  };

  // Function to load translated HTML for a module
  async function loadModuleHTML(moduleName, lang) {
    const suffix = LANG_MAP[lang] || '';
    
    // If requesting a non-English language, try translated version first
    if (suffix) {
      const translatedPath = `/modules/${moduleName}${suffix}.html`;
      
      try {
        const response = await fetch(translatedPath);
        if (response.ok) {
          console.log(`[i18n] ✓ Loaded ${moduleName}${suffix}.html`);
          return await response.text();
        } else {
          console.warn(`[i18n] ⚠ ${moduleName}${suffix}.html not found (${response.status}), falling back to English`);
        }
      } catch (error) {
        console.warn(`[i18n] ⚠ Error fetching ${moduleName}${suffix}.html:`, error.message);
      }
    }
    
    // Fall back to English
    try {
      const englishPath = `/modules/${moduleName}.html`;
      const response = await fetch(englishPath);
      if (!response.ok) {
        throw new Error(`Failed to load ${englishPath}: ${response.status}`);
      }
      if (suffix) {
        console.log(`[i18n] → Loaded ${moduleName}.html (English fallback)`);
      } else {
        console.log(`[i18n] ✓ Loaded ${moduleName}.html (English)`);
      }
      return await response.text();
    } catch (error) {
      console.error(`[i18n] ✗ Failed to load ${moduleName}:`, error);
      return '<div class="error">Failed to load module content</div>';
    }
  }

  // Replace placeholder with translated HTML
  async function loadPlaceholder(placeholder, lang) {
    const moduleName = placeholder.getAttribute('data-mod');
    if (!moduleName) return;

    try {
      const html = await loadModuleHTML(moduleName, lang);
      placeholder.innerHTML = html;
      placeholder.classList.remove('placeholder');
      placeholder.classList.add('mod', `mod--${moduleName}`);
    } catch (error) {
      console.error(`[i18n] Failed to load placeholder ${moduleName}:`, error);
    }
  }

  // Main initialization function
  async function initTranslation() {
    const lang = window.PROSPECTUS_LANG || 'en';
    
    // Find all module placeholders
    const placeholders = document.querySelectorAll('.placeholder[data-mod]');
    
    if (placeholders.length === 0) {
      console.warn('[i18n] No module placeholders found');
      return;
    }

    console.log(`[i18n] Loading ${placeholders.length} modules in language: ${lang}`);

    // Load all placeholders
    const loadPromises = Array.from(placeholders).map(placeholder => 
      loadPlaceholder(placeholder, lang)
    );

    await Promise.all(loadPromises);
    
    console.log('[i18n] All modules loaded, triggering modules:ready event');
    
    // Trigger the modules:ready event that index.html is listening for
    window.dispatchEvent(new CustomEvent('modules:ready'));
  }

  // Wait for DOM to be ready, then load translated modules
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTranslation);
  } else {
    initTranslation();
  }

  // Export for debugging
  window.TRANSLATION_SYSTEM = {
    loadModuleHTML,
    LANG_MAP
  };
})();