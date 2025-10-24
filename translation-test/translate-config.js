// Translation Test Configuration
// Update these paths to match your project structure

module.exports = {
  // Your DeepL API Key
  DEEPL_API_KEY: '7c63efb1-0398-4724-869c-48bd9ba21b3e',
  
  // Target language for testing (ES = Spanish, FR = French, DE = German)
  TARGET_LANG: 'ES',
  
  // Modules to translate
  MODULES: {
    hero: {
      html: '../modules/hero.html',
      js: '../js/modules/hero.js'
    },
    house_system: {
      html: '../modules/house_system.html',
      js: '../js/modules/house_system.js'
    }
  },
  
  // Output directory
  OUTPUT_DIR: './translated-modules-test',
  
  // Test context (for test page)
  TEST_CONTEXT: {
    childName: 'Carlos',
    familyName: 'García',
    parentName: 'María García',
    gender: 'male',
    boardingPreference: 'Full Boarding',
    academicInterests: ['sciences', 'mathematics'],
    activities: ['sports', 'leadership'],
    priorities: { academic: 3, pastoral: 2, activities: 3 },
    universityAspirations: 'Oxford or Cambridge'
  }
};
