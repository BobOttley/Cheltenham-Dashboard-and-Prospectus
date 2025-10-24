#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const config = require('./translate-config');

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function translateText(text, targetLang = config.TARGET_LANG) {
  const response = await fetch('https://api.deepl.com/v2/translate', {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${config.DEEPL_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: [text],
      target_lang: targetLang,
      preserve_formatting: true,
      tag_handling: 'html'
    })
  });
  
  const data = await response.json();
  return data.translations[0].text;
}

async function translateHtml(htmlPath, targetLang) {
  console.log(`HTML: ${path.basename(htmlPath)}`);
  const html = fs.readFileSync(htmlPath, 'utf-8');
  const translated = await translateText(html, targetLang);
  return translated;
}

function extractTranslatableText(str) {
  // Extract just the text, replace ${...} with placeholders
  const placeholders = [];
  
  // Replace ${...} with numbered placeholders
  let processed = str.replace(/\$\{[^}]+\}/g, (match) => {
    const index = placeholders.length;
    placeholders.push(match);
    return `__VAR${index}__`;
  });
  
  return { text: processed, placeholders };
}

function restorePlaceholders(translated, placeholders) {
  let result = translated;
  placeholders.forEach((original, index) => {
    result = result.replace(`__VAR${index}__`, original);
  });
  return result;
}

async function translateJs(jsPath, targetLang) {
  console.log(`JS: ${path.basename(jsPath)}`);
  
  let js = fs.readFileSync(jsPath, 'utf-8');
  const translations = [];
  
  // Find all template literals (backtick strings)
  const templateRegex = /`([^`]+)`/g;
  let match;
  const templates = [];
  
  while ((match = templateRegex.exec(js)) !== null) {
    const content = match[1];
    
    // Skip if too short or looks like code
    if (content.length < 15) continue;
    if (!content.includes(' ')) continue;
    
    const { text, placeholders } = extractTranslatableText(content);
    
    templates.push({
      original: match[0],
      content: content,
      text: text,
      placeholders: placeholders
    });
  }
  
  // Find all quoted strings
  const quotedRegex = /(['"])([^\1]{15,}?)\1/g;
  const quoted = [];
  
  while ((match = quotedRegex.exec(js)) !== null) {
    const content = match[2];
    
    // Skip selectors, URLs, etc
    if (content.startsWith('.') || content.startsWith('#')) continue;
    if (content.startsWith('http')) continue;
    if (content.includes('data-')) continue;
    if (!content.includes(' ')) continue;
    
    quoted.push({
      original: match[0],
      content: content,
      quote: match[1]
    });
  }
  
  console.log(`  Found ${templates.length} template literals, ${quoted.length} quoted strings`);
  
  // Translate template literals
  for (const t of templates) {
    const translated = await translateText(t.text, targetLang);
    const restored = restorePlaceholders(translated, t.placeholders);
    translations.push({
      find: t.original,
      replace: `\`${restored}\``
    });
  }
  
  // Translate quoted strings
  for (const q of quoted) {
    const translated = await translateText(q.content, targetLang);
    translations.push({
      find: q.original,
      replace: `${q.quote}${translated}${q.quote}`
    });
  }
  
  // Apply translations
  let result = js;
  translations.forEach(t => {
    const escaped = t.find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    result = result.replace(new RegExp(escaped, 'g'), t.replace);
  });
  
  console.log(`  Translated ${translations.length} strings`);
  return result;
}

async function main() {
  console.log('\nTRANSLATING TO', config.TARGET_LANG);
  
  const htmlDir = path.join(config.OUTPUT_DIR, 'modules');
  const jsDir = path.join(config.OUTPUT_DIR, 'js', 'modules');
  
  fs.mkdirSync(htmlDir, { recursive: true });
  fs.mkdirSync(jsDir, { recursive: true });
  
  const lang = config.TARGET_LANG.toLowerCase();
  
  for (const [name, paths] of Object.entries(config.MODULES)) {
    console.log(`\n${name}:`);
    
    if (fs.existsSync(paths.html)) {
      const translated = await translateHtml(paths.html, config.TARGET_LANG);
      const output = path.join(htmlDir, `${name}.${lang}.html`);
      fs.writeFileSync(output, translated, 'utf8');
      console.log(`  ✓ ${output}`);
    }
    
    if (fs.existsSync(paths.js)) {
      const translated = await translateJs(paths.js, config.TARGET_LANG);
      const output = path.join(jsDir, `${name}.${lang}.js`);
      fs.writeFileSync(output, translated, 'utf8');
      console.log(`  ✓ ${output}`);
    }
  }
  
  console.log('\nDONE\n');
}

main().catch(err => {
  console.error('ERROR:', err.message);
  process.exit(1);
});
