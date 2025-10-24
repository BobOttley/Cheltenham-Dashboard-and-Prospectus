// HTML-aware translator: block-level translation with inline token preservation + MutationObserver
(function() {
  // Cache translations: key = `${text}__${lang}`
  const cache = Object.create(null);
  const current = { lang: 'en' };

  // Which blocks to translate (safe across your modules)
  const BLOCK_SELECTOR = [
    'p', 'h1','h2','h3','h4','li',
    '.hero-welcome', '.hero-tagline', '.hero-additional-text',
    '.welcome-text', '.cta-title', '.cta-subtitle'
  ].join(',');

  // Elements we treat as inline to preserve (kept as-is, content translated)
  const INLINE_KEEP = new Set(['SPAN','EM','I','STRONG','B','SMALL','SUP','SUB','U','A']);
  const SELF_CLOSING = new Set(['BR','HR','IMG']);

  // Build tokenised string for a block element, preserving inline HTML
  function tokeniseElement(el) {
    // Walk child nodes and build a string with tokens
    const tokens = [];     // [{type:'text', value}, {type:'html', html}]
    const htmlMap = [];    // index -> original html snippet
    let buf = '';

    function flushText() {
      if (!buf) return;
      tokens.push({ type:'text', value: buf });
      buf = '';
    }

    function walk(node) {
      if (node.nodeType === 3) { // text
        buf += node.textContent;
        return;
      }
      if (node.nodeType !== 1) return; // not element

      const tag = node.tagName;
      if (SELF_CLOSING.has(tag)) {
        flushText();
        const outer = node.outerHTML;
        const i = htmlMap.push(outer) - 1;
        tokens.push({ type:'token', value: `[[HTML_${i}]]` });
        return;
      }

      if (INLINE_KEEP.has(tag)) {
        // Keep the tag, but translate its inner text content
        // Represent the whole element as a token to avoid spacing loss
        flushText();
        const outer = node.outerHTML;
        const i = htmlMap.push(outer) - 1;
        tokens.push({ type:'token', value: `[[HTML_${i}]]` });
        return;
      }

      // For block-ish children, dive deeper (paragraphs inside paragraphs are rare)
      // but safest is to treat unknowns as inline here:
      // We’ll still tokenise unknown elements to avoid mangling.
      flushText();
      const outer = node.outerHTML;
      const j = htmlMap.push(outer) - 1;
      tokens.push({ type:'token', value: `[[HTML_${j}]]` });
    }

    // Iterate children
    for (const child of Array.from(el.childNodes)) walk(child);
    flushText();

    // Join into one string to translate
    const plain = tokens.map(t => t.type === 'text' ? t.value : t.value).join('');

    return { plain, htmlMap, tokens };
  }

  // Re-apply personalisation safely using the latest context (no placeholders)
function reapplyPersonalisation() {
  try {
    const ctx = window.PROSPECTUS_CTX || {};
    const set = (sel, value, fallback) => {
      const v = (value || '').toString().trim();
      document.querySelectorAll(sel).forEach(el => {
        const f = el.getAttribute('data-fallback') || fallback || '';
        el.textContent = v || f || el.textContent;
      });
    };
    set('.child-name', ctx.childName, 'your child');
    set('.parent-name', ctx.parentName, '');
    set('.family-name', ctx.familyName, '');
  } catch(_) {}
}


  // Rebuild element innerHTML from translated string + htmlMap
  function detokeniseInto(el, translated, htmlMap) {
    const restored = translated.replace(/\[\[HTML_(\d+)]]/g, (_, i) => htmlMap[Number(i)] || '');
    el.innerHTML = restored;
  }

  // Collect all eligible blocks under root
  function collectBlocks(root = document.body) {
    return Array.from(root.querySelectorAll(BLOCK_SELECTOR))
      .filter(el => !el.closest('.no-translate'));
  }

  // Translate an array of blocks, preserving markup
  async function translateBlocks(blocks, targetLang) {
    // Build payloads
    const payloads = blocks.map(el => tokeniseElement(el));
    const texts = payloads.map(p => p.plain);

    // Apply cache immediately where possible
    const toSendIdx = [];
    const outStrings = new Array(blocks.length);

    texts.forEach((txt, i) => {
      const key = `${txt}__${targetLang}`;
      if (cache[key]) {
        outStrings[i] = cache[key];
      } else {
        toSendIdx.push(i);
      }
    });

    // Fetch only for non-cached
    if (toSendIdx.length) {
      const sendTexts = toSendIdx.map(i => texts[i]);
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ texts: sendTexts, targetLang })
      });

      if (!res.ok) {
        const body = await res.text().catch(()=> '');
        console.error('Translate fetch failed', { status: res.status, body });
        alert(`Translation failed (${res.status}). Check server logs.`);
        return;
      }

      const data = await res.json();
      if (!data?.translations || !Array.isArray(data.translations)) {
        console.error('Unexpected translate response', data);
        alert('Translation failed (unexpected response).');
        return;
      }

      data.translations.forEach((tr, k) => {
        const i = toSendIdx[k];
        const key = `${texts[i]}__${targetLang}`;
        cache[key] = tr;
        outStrings[i] = tr;
      });
    }

    // Stitch results back
    blocks.forEach((el, i) => {
      const { htmlMap } = payloads[i];
      detokeniseInto(el, outStrings[i], htmlMap);
    });
    // Ensure names are still present even if translation rebuilt innerHTML
    reapplyPersonalisation();
  }

  // Public API
  async function setLanguage(targetLang) {
    if (!targetLang || targetLang === 'en') {
      // Restore originals by reloading the page once (simplest + safest for all modules)
      localStorage.setItem('lang', 'en');
      location.reload();
      return;
    }
    current.lang = targetLang;
    localStorage.setItem('lang', targetLang);

    const blocks = collectBlocks();
    if (blocks.length) await translateBlocks(blocks, targetLang);
  }

  // MutationObserver: translate newly inserted blocks automatically (debounced)
let moTimer = null;
const mo = new MutationObserver((muts) => {
  const lang = localStorage.getItem('lang') || 'en';
  if (lang === 'en') return;

  // Collect candidate roots
  const addedRoots = [];
  muts.forEach(m => m.addedNodes && m.addedNodes.forEach(n => {
    if (n.nodeType === 1) addedRoots.push(n);
  }));
  if (!addedRoots.length) return;

  // Debounce to allow module JS to finish personalising (names etc.)
  clearTimeout(moTimer);
  moTimer = setTimeout(async () => {
    const newBlocks = [];
    addedRoots.forEach(r => newBlocks.push(...collectBlocks(r)));
    if (!newBlocks.length) return;

    await translateBlocks(newBlocks, lang);
    reapplyPersonalisation(); // once more for luck
  }, 250);
});


  document.addEventListener('DOMContentLoaded', () => {
    // Insert a simple language dropdown (keep your existing style/position if you like)
    if (!document.getElementById('lang-select')) {
      const html = `
        <select id="lang-select" style="position:fixed;top:20px;right:20px;z-index:9999;padding:8px;border-radius:6px;">
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="es">Español</option>
          <option value="de">Deutsch</option>
          <option value="zh">中文</option>
          <option value="ar">العربية</option>
        </select>
      `;
      document.body.insertAdjacentHTML('afterbegin', html);
      document.getElementById('lang-select').addEventListener('change', (e) => setLanguage(e.target.value));
    }

    // Start observing dynamic insertions (modules)
    mo.observe(document.body, { childList: true, subtree: true });

    // Re-apply saved language after initial paint
    const saved = localStorage.getItem('lang') || 'en';
    const select = document.getElementById('lang-select');
    if (select) select.value = saved;
    if (saved !== 'en') setLanguage(saved);
  });

  // Expose for debugging if needed
  window.__PEN_TRANSLATE__ = { setLanguage };
})();
