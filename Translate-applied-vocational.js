#!/usr/bin/env node

/**
 * TRANSLATE: applied_vocational.html to Chinese
 * 
 * - Complete sentences (no fragments)
 * - All user-facing text including attributes
 * - Proper nouns preserved (BTEC, AQA, OCR, etc.)
 * - No bilingual mess
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const MODULES_DIR = './modules';  // UPDATE THIS PATH
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;

// Proper nouns - DO NOT TRANSLATE
const PRESERVE_TERMS = [
  'BTEC',
  'OCR',
  'AQA',
  'Cheltenham College',
  'Cheltenham',
  'Russell Group',
  'Cambridge Technical',
  'A Level',
  'A Levels',
  'Holly Brooke',
  'Jonathon Morton',
  'Tricia Norman',
  'Rebecca Faulkner',
  'Sixth Form',
  'Newton\'s Laws',
  'Oxbridge'
];

console.log('\n🇨🇳 TRANSLATING: applied_vocational.html → Chinese\n');

/**
 * Extract ALL text comprehensively
 */
function extractAllText(html) {
  const cheerio = require('cheerio');
  const $ = cheerio.load(html, { decodeEntities: false, xmlMode: false });
  
  const textsToTranslate = [];
  const replacements = [];
  let index = 0;
  
  // 1. TEXT CONTENT - complete elements only
  $('h1, h2, h3, h4, h5, h6, p, li, td, th, label, button, a, span, div').each((i, elem) => {
    const $elem = $(elem);
    
    if ($elem.closest('script, style').length > 0) return;
    if ($elem.hasClass('no-translate')) return;
    
    // Skip if has child elements with text
    if ($elem.children().length > 0) {
      const childrenWithText = $elem.children().filter((i, child) => {
        return $(child).text().trim().length > 0;
      }).length;
      if (childrenWithText > 0) return;
    }
    
    const fullText = $elem.text().trim();
    if (!fullText || fullText.length < 2) return;
    if (fullText.match(/^[{}\[\]<>()]+$/) || fullText.startsWith('data-')) return;
    
    textsToTranslate.push(fullText);
    replacements.push({ type: 'text', element: $elem, index: index++ });
  });
  
  // 2. ATTRIBUTES
  const attributes = ['aria-label', 'title', 'alt', 'placeholder', 'data-fallback', 'data-filter'];
  
  $('*').each((i, elem) => {
    const $elem = $(elem);
    attributes.forEach(attr => {
      const value = $elem.attr(attr);
      if (value && value.trim() && value.length > 2) {
        if (value.startsWith('http') || value.startsWith('data:')) return;
        
        textsToTranslate.push(value);
        replacements.push({ 
          type: 'attribute', 
          element: $elem, 
          attr: attr,
          index: index++ 
        });
      }
    });
  });
  
  return { texts: textsToTranslate, replacements, $ };
}

/**
 * Apply translations
 */
function applyTranslations($, replacements, translations) {
  replacements.forEach(r => {
    const translation = translations[r.index];
    if (!translation) return;
    
    if (r.type === 'text') {
      r.element.text(translation);
    } else if (r.type === 'attribute') {
      r.element.attr(r.attr, translation);
    }
  });
  
  return $.html();
}

/**
 * Protect proper nouns
 */
function protectProperNouns(texts) {
  return texts.map(text => {
    let protected = text;
    PRESERVE_TERMS.forEach((term, i) => {
      const marker = `###PRESERVE${i}###`;
      protected = protected.replace(new RegExp(term, 'gi'), marker);
    });
    return protected;
  });
}

/**
 * Restore proper nouns
 */
function restoreProperNouns(texts) {
  return texts.map(text => {
    let restored = text;
    PRESERVE_TERMS.forEach((term, i) => {
      const marker = `###PRESERVE${i}###`;
      restored = restored.replace(new RegExp(marker, 'g'), term);
    });
    return restored;
  });
}

/**
 * Translate via DeepL
 */
async function translateToChinese(texts) {
  if (!DEEPL_API_KEY) {
    throw new Error('❌ DEEPL_API_KEY not in .env');
  }
  
  console.log(`📡 Translating ${texts.length} items...\n`);
  
  const protectedTexts = protectProperNouns(texts);
  
  const params = new URLSearchParams();
  protectedTexts.forEach(text => params.append('text', text));
  params.append('target_lang', 'ZH');
  params.append('preserve_formatting', '1');
  
  try {
    const response = await axios.post(
      'https://api.deepl.com/v2/translate',
      params,
      {
        headers: {
          'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout: 60000
      }
    );
    
    const translations = response.data.translations.map(t => t.text);
    return restoreProperNouns(translations);
    
  } catch (error) {
    console.error('❌ DeepL Error:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Main
 */
async function main() {
  console.log('═'.repeat(70));
  console.log('  🇨🇳 APPLIED VOCATIONAL → CHINESE');
  console.log('═'.repeat(70));
  
  // Check cheerio
  try {
    require('cheerio');
  } catch (e) {
    console.log('\n📦 Installing cheerio...');
    require('child_process').execSync('npm install cheerio', { stdio: 'inherit' });
  }
  
  // Read file
  const filePath = path.join(MODULES_DIR, 'applied_vocational.html');
  
  if (!fs.existsSync(filePath)) {
    console.error(`\n❌ Not found: ${filePath}`);
    console.error('Update MODULES_DIR (line 15)\n');
    process.exit(1);
  }
  
  console.log(`\n📁 Reading: ${filePath}`);
  const englishHtml = fs.readFileSync(filePath, 'utf8');
  console.log(`📖 File size: ${englishHtml.length.toLocaleString()} chars`);
  
  // Extract
  const { texts, replacements, $ } = extractAllText(englishHtml);
  console.log(`🔍 Found ${texts.length} items`);
  console.log(`   - ${replacements.filter(r => r.type === 'text').length} text elements`);
  console.log(`   - ${replacements.filter(r => r.type === 'attribute').length} attributes\n`);
  
  // Samples
  console.log('📝 ENGLISH SAMPLES:');
  console.log('─'.repeat(70));
  texts.slice(0, 10).forEach((t, i) => {
    const preview = t.length > 60 ? t.substring(0, 60) + '...' : t;
    const type = replacements[i].type === 'text' ? 'TEXT' : `${replacements[i].attr}`;
    console.log(`${i + 1}. [${type}] "${preview}"`);
  });
  if (texts.length > 10) console.log(`... and ${texts.length - 10} more`);
  
  // Translate
  console.log('\n📡 Sending to DeepL...');
  console.log('🔒 Protecting: BTEC, AQA, OCR, Russell Group, A Level, etc.\n');
  const translations = await translateToChinese(texts);
  console.log('✅ Translation complete!\n');
  
  // Chinese samples
  console.log('🇨🇳 CHINESE SAMPLES:');
  console.log('─'.repeat(70));
  translations.slice(0, 10).forEach((t, i) => {
    const preview = t.length > 60 ? t.substring(0, 60) + '...' : t;
    console.log(`${i + 1}. "${preview}"`);
  });
  if (translations.length > 10) console.log(`... and ${translations.length - 10} more`);
  
  // Apply
  const chineseHtml = applyTranslations($, replacements, translations);
  
  // Save
  const outputPath = path.join(MODULES_DIR, 'applied_vocational.zh.html');
  fs.writeFileSync(outputPath, chineseHtml, 'utf8');
  
  console.log(`\n💾 Saved: ${outputPath}`);
  
  // Stats
  const totalChars = texts.join('').length;
  const cost = (totalChars / 1000000) * 20;
  
  console.log('\n📊 STATISTICS:');
  console.log('─'.repeat(70));
  console.log(`Original:      ${englishHtml.length.toLocaleString()} chars`);
  console.log(`Translated:    ${chineseHtml.length.toLocaleString()} chars`);
  console.log(`Text content:  ${totalChars.toLocaleString()} chars`);
  console.log(`Items:         ${texts.length}`);
  console.log(`Cost:          $${cost.toFixed(4)}`);
  
  // Verify
  console.log('\n✅ VERIFICATION:');
  console.log('─'.repeat(70));
  
  PRESERVE_TERMS.slice(0, 8).forEach(term => {
    if (chineseHtml.includes(term)) {
      console.log(`✅ "${term}" preserved`);
    }
  });
  
  const unexpectedEnglish = (chineseHtml.match(/\b[A-Za-z]{5,}\b/g) || [])
    .filter(word => !PRESERVE_TERMS.some(term => word.includes(term)))
    .filter(word => !['class', 'data', 'src', 'href', 'style'].includes(word.toLowerCase()));
  
  if (unexpectedEnglish.length > 10) {
    console.log(`⚠️  Found ${unexpectedEnglish.length} unexpected English words`);
  } else if (unexpectedEnglish.length > 0) {
    console.log(`⚠️  Minor English words: ${unexpectedEnglish.slice(0, 5).join(', ')}`);
  } else {
    console.log(`✅ No unexpected English text`);
  }
  
  console.log('\n🧪 TEST IT:');
  console.log('─'.repeat(70));
  console.log('1. Check file: cat applied_vocational.zh.html | head -100');
  console.log('2. Verify BTEC preserved: grep "BTEC" applied_vocational.zh.html');
  console.log('3. Test browser: /prospectus?id=test&lang=zh');
  console.log('');
  
  console.log('═'.repeat(70));
  console.log('✅ DONE! Check applied_vocational.zh.html\n');
}

main().catch(error => {
  console.error('\n❌ Failed:', error);
  process.exit(1);
});