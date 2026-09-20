// Browser QA: intercept WhatsApp so the test never sends a guest enquiry.
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES ? process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright' : 'playwright');
const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.PBV_CHROMIUM?{executablePath:process.env.PBV_CHROMIUM,args:['--no-sandbox','--disable-dev-shm-usage','--no-zygote','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']}: {})});
 const root=process.env.PBV_TEST_URL||'http://127.0.0.1:8765';
 const results=[];const evidence=process.env.PBV_QA_DIR||'/tmp/pbv-qa';fs.mkdirSync(evidence,{recursive:true});
 for(const width of [390,768,1440]) {
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});const page=await context.newPage();const errors=[],external=[];
  page.on('pageerror',error=>errors.push(String(error)));
  page.on('request',request=>{if(!request.url().startsWith(root))external.push(request.url())});
  await page.goto(root);await page.evaluate(()=>document.fonts.ready);
  for(const lang of ['it','en','de']){
   await page.click(`[data-lang="${lang}"]`);
   assert.equal(await page.getAttribute('html','lang'),lang);
   assert.equal(await page.locator('#spiagge .destination-card').count(),5);
   assert.equal(await page.locator('#cagliari .destination-card').count(),4);
   assert.equal(await page.locator('#bookingForm input').count(),4);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`overflow ${width}/${lang}`);
   const missing=await page.locator('[data-i18n]').evaluateAll(nodes=>nodes.filter(n=>!n.textContent.trim()||n.textContent==='undefined').length); assert.equal(missing,0);
   await page.screenshot({path:path.join(evidence,`${width}-${lang}-hero.png`)});
   if(width!==768){await page.locator('#prenota').screenshot({style:'.site-header { visibility: hidden; }',path:path.join(evidence,`${width}-${lang}-form.png`)});await page.evaluate(()=>scrollTo(0,0));}
   results.push(`${width}px ${lang}: layout, translations, cards and form OK`);
  }
  // Request every lazy image, then wait for loading to finish before checking decoding.
  await page.locator('img').evaluateAll(nodes=>nodes.forEach(n=>n.loading='eager'));
  await page.waitForFunction(()=>[...document.images].every(img=>img.complete),null,{timeout:5000});
  const broken=await page.locator('img').evaluateAll(nodes=>nodes.filter(n=>!n.naturalWidth).map(n=>n.src)); assert.deepEqual(broken,[]);
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
  await context.close();
 }
 const context=await browser.newContext();const page=await context.newPage();await page.goto(root);
 let requests=[];await page.route('https://wa.me/**',async route=>{requests.push(route.request().url());await route.fulfill({body:'WhatsApp intercepted by test'});});
 for(const lang of ['it','en','de']){
  await page.goto(root);await page.click(`[data-lang="${lang}"]`);
  await page.fill('[name="fullName"]','QA Test');await page.fill('[name="arrival"]','2099-08-01');await page.fill('[name="departure"]','2099-08-02');
  for(const guests of ['3','0','1.5']){await page.fill('[name="guests"]',guests);await page.click('[type="submit"]');assert.equal(requests.length,0);}
  await page.fill('[name="guests"]','2');await page.fill('[name="departure"]','2099-08-01');await page.click('[type="submit"]');assert.equal(requests.length,0);
  await page.fill('[name="departure"]','2099-08-02');await page.click('[type="submit"]');await page.waitForURL('https://wa.me/**');assert.equal(requests.length,1);const url=new URL(requests[0]);assert.equal(url.pathname,'/393931104422');assert.ok(url.searchParams.get('text').includes('QA Test'));requests=[];
  results.push(`${lang}: invalid inputs blocked; one WhatsApp navigation intercepted, never sent`);
 }
 for(const file of ['guida.html','consigli.html','privacy.html','ospiti%20(1).html','blocco-recensioni.html']){
  await page.goto(`${root}/${file}`);for(const lang of ['it','en','de']){await page.click(`[data-lang="${lang}"]`);assert.equal(await page.locator('html').getAttribute('lang'),lang);assert.equal(await page.locator('main').evaluate(el=>el.textContent.includes('undefined')),false);}
 }
 const nojs=await browser.newContext({javaScriptEnabled:false});const fallback=await nojs.newPage();await fallback.goto(root);assert.equal(await fallback.locator('#foto img').count(),10);assert.ok(await fallback.locator('#concierge').textContent());results.push('No JavaScript: house photos and main content present in source');
 await browser.close();fs.writeFileSync(path.join(evidence,'results.json'),JSON.stringify(results,null,2));console.log(results.join('\n'));
})().catch(error=>{console.error(error);process.exit(1)});
