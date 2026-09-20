// Browser checks never send WhatsApp messages.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 const root=process.env.PBV_TEST_URL||'http://127.0.0.1:8765';
 const results=[];fs.mkdirSync('artifacts',{recursive:true});
 const baseline=fs.readFileSync('qa-baseline/index.html','utf8');
 const current=fs.readFileSync('index.html','utf8');
 assert.equal(current.replace('<a data-i18n="navHospitals" href="soggiorni-ospedali.html">Soggiorni vicino agli ospedali</a>',''),baseline,'Only the navigation link may change on the homepage');
 for(const width of [390,768,1440]){
  const context=await browser.newContext({viewport:{width,height:900}});
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const lang of ['it','en','de']){
   const file='soggiorni-ospedali'+(lang==='it'?'':'-'+lang)+'.html';
   await page.goto(root+'/'+file);await page.evaluate(()=>document.fonts.ready);
   assert.equal(await page.locator('html').getAttribute('lang'),lang);
   assert.equal(await page.locator('h1').count(),1);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${width}/${lang}`);
   const source=await page.content();assert(!/Via Bellavista|tel:|maps\/|609500|400101|6655|undefined/.test(source));
   assert.equal(await page.locator('.features article').count(),3);
   const mapLinks=await page.locator('.hospital-map-link').evaluateAll(aa=>aa.map(a=>({text:a.textContent.trim(),href:a.href,target:a.target,rel:a.rel})));
   assert.equal(mapLinks.length,3);assert.equal(new Set(mapLinks.map(a=>a.text)).size,3);assert(mapLinks.every(a=>a.href.startsWith('https://www.google.com/maps/search/')&&a.target==='_blank'&&a.rel.includes('noopener')));for(const name of ['Businco','Microcitemico','Brotzu'])assert(mapLinks.some(a=>a.text.includes(name)),`named map button ${name}`);
   assert.equal(await page.locator('.rate-grid article').count(),4);
   const rateText=await page.locator('.hospital-rates').innerText();
   for(const rate of (lang==='en'?['€70','€65','€61.75','€58.50']:['70 €','65 €','61,75 €','58,50 €']))assert(rateText.includes(rate),`missing rate ${rate} in ${lang}`);
   const text=await page.locator('main').innerText();for(const word of ['Businco','Microcitemico','Brotzu','3–4','7','14','Angelo','Viviana'])assert(text.includes(word));
   assert.equal(await page.locator('a[href="https://wa.me/393931104422"]').count(),2);
   assert.equal(await page.locator('link[rel="alternate"]').count(),4);
   const access=await page.locator('.hospital-access').boundingBox();assert(access.y<900,'Stair warning in first viewport');
   assert.deepEqual(await page.locator('img').evaluateAll(ii=>ii.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)),[]);
   await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
   const a11y=await page.evaluate(async()=>await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));
   assert.deepEqual(a11y.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],`accessibility ${width}/${lang}`);
   await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.className),'skip-link');await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>document.activeElement.id),'top');
   await page.screenshot({path:`artifacts/hospitals-${width}-${lang}.png`,fullPage:true});
   await page.route('https://wa.me/**',route=>route.fulfill({body:'QA: no message sent'}));
   await page.locator('a[href="https://wa.me/393931104422"]').first().click();await page.waitForURL('https://wa.me/393931104422');
   await page.goto(root+'/'+file);await page.locator('.language-switcher a[lang="en"]').click();assert.equal(await page.locator('html').getAttribute('lang'),'en');
   results.push(`${width}/${lang}: content, privacy exclusions, layout, accessibility, keyboard, languages, WhatsApp PASS`);
  }
  assert.deepEqual(errors,[]);await context.close();
 }
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();
 for(const lang of ['it','en','de']){await page.goto(root+'/soggiorni-ospedali'+(lang==='it'?'':'-'+lang)+'.html');assert.equal(await page.locator('html').getAttribute('lang'),lang);assert.equal(await page.locator('h1').count(),1);}
 results.push('IT/EN/DE available without JavaScript; homepage content byte-identical except navigation link');
 fs.writeFileSync('artifacts/results.txt',results.join('\n'));console.log(results.join('\n'));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
