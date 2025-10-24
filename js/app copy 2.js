/* ====== CHELTENHAM COLLEGE PROSPECTUS - UNIFIED APP.JS ======
 * Combined module loading with translation support
 * ========================================================== */

// Utility functions
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// Global context
let CTX = {};

// Module registry - modules register themselves here
window.MODULES = window.MODULES || {};

// Language mapping from URL param to file suffix
const LANG_MAP = {
  'en': '',  // English has no suffix
  'es': '_es',
  'fr': '_fr',
  'de': '_de',
  'zh-Hans': '_zh',
  'it': '_it'
};

/* ====== Context Loading ====== */
async function loadProspectusContext() {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if (!id) return null;

  try {
    const res = await fetch(`/api/enquiry/${id}`);
    if (!res.ok) return null;

    const json = await res.json();
    if (!json || !json.success) return null;

    const ctx = json.data || {};
    window.PROSPECTUS_CTX = ctx;
    window.PENAI_FAMILY_ID = id;
    
    try {
      localStorage.setItem('enquiryFormData', JSON.stringify(ctx));
    } catch (e) {
      console.warn('localStorage unavailable');
    }
    
    return ctx;
  } catch (e) {
    console.error('Failed to load context:', e);
    return null;
  }
}

/* ====== Global Personalization ====== */
function personaliseGlobals(ctx) {
  if (!ctx) return;
  
  // Apply child name globally
  $$('.child-name').forEach(el => {
    const name = (ctx.childName || '').trim();
    if (name && !name.startsWith('[')) {
      el.textContent = name;
    }
  });
  
  // Apply parent name globally
  $$('.parent-name').forEach(el => {
    const name = (ctx.parentName || '').trim();
    if (name && !name.startsWith('[')) {
      el.textContent = name;
    }
  });
  
  // Apply family name globally
  $$('.family-name').forEach(el => {
    const name = (ctx.familyName || '').trim();
    if (name && !name.startsWith('[')) {
      el.textContent = name;
    }
  });
}

/* ====== Visibility Rules ====== */
function visibleByRules(el, ctx) {
  const rules = el.getAttribute('data-visible-when');
  if (!rules) return true;

  try {
    const parsed = JSON.parse(rules);
    
    for (const [key, values] of Object.entries(parsed)) {
      const ctxValue = ctx[key];
      
      if (Array.isArray(values)) {
        if (Array.isArray(ctxValue)) {
          if (!values.some(v => ctxValue.includes(v))) return false;
        } else {
          if (!values.includes(ctxValue)) return false;
        }
      }
    }
    
    return true;
  } catch (e) {
    console.warn('Invalid visibility rules:', rules);
    return true;
  }
}

/* ====== Lazy Asset Hydration ====== */
function hydrateLazyAssets(root = document) {
  // Images
  root.querySelectorAll('img[data-src]').forEach(img => {
    img.src = img.getAttribute('data-src');
    img.removeAttribute('data-src');
  });
  
  // Videos
  root.querySelectorAll('video[data-src]').forEach(video => {
    video.src = video.getAttribute('data-src');
    video.removeAttribute('data-src');
    video.load();
  });
  
  // Video sources
  root.querySelectorAll('source[data-src]').forEach(source => {
    source.src = source.getAttribute('data-src');
    source.removeAttribute('data-src');
    const video = source.closest('video');
    if (video) video.load();
  });
}

/* ====== Module Loading with Translation Support ====== */
async function fetchModuleHTML(key) {
  const lang = window.PROSPECTUS_LANG || 'en';
  const suffix = LANG_MAP[lang] || '';
  
  try {
    // If not English, try translated version first
    if (suffix) {
      const translatedPath = `/modules/${key}${suffix}.html`;
      const translatedRes = await fetch(translatedPath, { credentials: 'same-origin' });
      
      if (translatedRes.ok) {
        console.log(`[i18n] ✓ Loaded ${key}${suffix}.html`);
        return await translatedRes.text();
      } else {
        console.warn(`[i18n] ⚠ ${key}${suffix}.html not found, falling back to English`);
      }
    }
    
    // Fallback to English
    const englishPath = `/modules/${key}.html`;
    const res = await fetch(englishPath, { credentials: 'same-origin' });
    
    if (!res.ok) return null;
    
    if (suffix) {
      console.log(`[i18n] → Loaded ${key}.html (English fallback)`);
    } else {
      console.log(`[i18n] ✓ Loaded ${key}.html`);
    }
    
    return await res.text();
  } catch (e) {
    console.error(`Failed to fetch HTML for ${key}:`, e);
    return null;
  }
}

async function loadModuleCSS(key) {
  // Check if CSS already loaded
  if (document.querySelector(`link[data-module="${key}"]`)) {
    console.debug(`[CSS] Already loaded: ${key}`);
    return;
  }
  
  try {
    const res = await fetch(`/css/${key}.css`, { method: 'HEAD' });
    if (!res.ok) return;
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `/css/${key}.css?v=${Date.now()}`;
    link.setAttribute('data-module', key);
    document.head.appendChild(link);
    
    console.log(`[CSS] ✓ Loaded: ${key}.css`);
  } catch (e) {
    console.debug(`[CSS] No CSS file for: ${key}`);
  }
}

async function loadModuleJS(key) {
  // Check if JS already loaded
  if (document.querySelector(`script[data-module="${key}"]`)) {
    console.debug(`[JS] Already loaded: ${key}`);
    return;
  }
  
  try {
    const res = await fetch(`/js/modules/${key}.js`, { method: 'HEAD' });
    if (!res.ok) return;
    
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `/js/modules/${key}.js?v=${Date.now()}`;
      script.setAttribute('data-module', key);
      script.onload = () => {
        console.log(`[JS] ✓ Loaded: ${key}.js`);
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  } catch (e) {
    console.debug(`[JS] No JS file for: ${key}`);
  }
}

async function mountPlaceholder(ph) {
  const key = ph.getAttribute('data-mod');
  if (!key) return;

  // Check visibility rules
  const required = ph.hasAttribute('data-required');
  if (!required && !visibleByRules(ph, CTX)) {
    ph.remove();
    return;
  }

  // Load HTML, CSS, and JS in parallel
  const [html] = await Promise.all([
    fetchModuleHTML(key),
    loadModuleCSS(key),
    loadModuleJS(key)
  ]);
  
  if (!html) {
    ph.remove();
    console.info(`Skipped missing module: ${key}`);
    return;
  }

  // Create module section
  const tmp = document.createElement('div');
  tmp.innerHTML = html.trim();
  const section = tmp.firstElementChild;

  if (!(section && section.matches('.mod'))) {
    const wrap = document.createElement('section');
    wrap.className = `mod mod--${key}`;
    wrap.dataset.mod = key;
    wrap.innerHTML = html;
    ph.replaceWith(wrap);
    hydrateLazyAssets(wrap);
    
    // Wait a tick for module JS to register, then initialize
    setTimeout(() => {
      if (window.MODULES[key]) {
        window.MODULES[key](wrap, CTX);
      }
    }, 50);
    
    track('module-mounted', { key });
    return;
  }

  ph.replaceWith(section);
  hydrateLazyAssets(section);
  
  // Wait a tick for module JS to register, then initialize
  setTimeout(() => {
    if (window.MODULES[key]) {
      window.MODULES[key](section, CTX);
    }
  }, 50);
  
  track('module-mounted', { key });
}

function track(event, data = {}) {
  console.debug('[track]', event, data);
}

/* ====== Intersection Observer for Lazy Loading ====== */
function initObserver() {
  const phs = $$('.placeholder');
  
  if (!('IntersectionObserver' in window)) {
    // Fallback for older browsers
    phs.forEach(ph => mountPlaceholder(ph));
    return;
  }
  
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const ph = entry.target;
        io.unobserve(ph);
        mountPlaceholder(ph);
      }
    });
  }, {
    root: null,
    rootMargin: '200px 0px',
    threshold: 0.01
  });

  // Sort by priority and observe
  phs
    .sort((a, b) => (parseInt(a.dataset.priority || 50) - parseInt(b.dataset.priority || 50)))
    .forEach(ph => io.observe(ph));
}

/* ====== Initialize on DOM Ready ====== */
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Initializing Cheltenham College Prospectus');
  
  // Set HTML lang attribute for CSS language-specific rules
  const lang = window.PROSPECTUS_LANG || 'en';
  document.documentElement.setAttribute('lang', lang);
  console.log(`🌍 Language: ${lang}`);
  
  // Load context
  CTX = await loadProspectusContext() || {};
  
  // Apply global personalization
  personaliseGlobals(CTX);
  
  // Start lazy loading modules
  initObserver();
  
  console.log('✅ Prospectus initialized');
});