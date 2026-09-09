// Runs the actual browser handler in a DOM adapter; no messages are sent.
const {test}=require('node:test'); const assert=require('node:assert/strict');
const vm=require('node:vm'); const fs=require('node:fs'); const path=require('node:path');
const root=path.join(__dirname,'..');
function setup(language='it', storageThrows=false) {
 const handlers={}; const buttons=['it','en','de'].map(lang=>({dataset:{lang},classList:{toggle(){}},setAttribute(){},addEventListener(type,fn){this.click=fn}}));
 const message={}; const fields={};
 for (const key of ['arrival','departure']) fields[key]={value:'',addEventListener(){}};
 const form={querySelector:()=>({disabled:true}),elements:fields,checkValidity:()=>true,reportValidity(){},addEventListener(type,fn){handlers[type]=fn}};
 const document={documentElement:{},querySelector:q=>q==='#bookingForm'?form:message,querySelectorAll:q=>q==='[data-lang]'?buttons:[]};
 const urls=[]; const context=vm.createContext({document,window:{location:{assign:url=>urls.push(url)},addEventListener(){}},localStorage:{getItem(){if(storageThrows)throw Error();return language},setItem(){if(storageThrows)throw Error()}},FormData:class {constructor(){return Object.entries(form.payload)}},Date});
 vm.runInContext(fs.readFileSync(path.join(root,'i18n.js'),'utf8'),context); vm.runInContext(fs.readFileSync(path.join(root,'script.js'),'utf8'),context);
 function submit(payload){form.payload={fullName:'Test & ospite',arrival:'2099-08-01',departure:'2099-08-02',guests:'2',notes:'',...payload}; handlers.submit({preventDefault(){}});return urls;}
 return {submit,urls,document,buttons,fields};
}
for(const language of ['it','en','de'])test(`single valid WhatsApp request in ${language}`,()=>{
 const x=setup(language); const urls=x.submit({notes:'Richiesta? & + ü'}); assert.equal(urls.length,1);const u=new URL(urls[0]);assert.equal(u.origin,'https://wa.me');assert.equal(u.pathname,'/393931104422');const text=u.searchParams.get('text');assert.ok(text.includes('Richiesta? & + ü'));assert.ok(text.includes('Test & ospite'));assert.ok(!text.includes('Telefono:'));assert.equal(x.document.documentElement.lang,language);
});
for(const guests of ['0','3','1.5','-1','abc',''])test(`reject guests ${guests}`,()=>assert.equal(setup().submit({guests}).length,0));
for(const dates of [{arrival:'2099-08-02',departure:'2099-08-02'},{arrival:'2099-08-03',departure:'2099-08-02'},{arrival:'2020-01-01'},{arrival:''},{departure:''},{arrival:'2099-02-30'}])test(`reject dates ${JSON.stringify(dates)}`,()=>assert.equal(setup().submit(dates).length,0));
test('reject whitespace name',()=>assert.equal(setup().submit({fullName:'   '}).length,0));
test('storage unavailable does not block the form',()=>assert.equal(setup('it',true).submit().length,1));
test('today is accepted in local timezone',()=>{
 const local=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
 const today=new Date();const tomorrow=new Date();tomorrow.setDate(tomorrow.getDate()+1);
 const x=setup();assert.equal(x.fields.arrival.min,local(today));assert.equal(x.submit({arrival:local(today),departure:local(tomorrow),guests:'1'}).length,1);
});
test('switching language repeatedly does not add submits',()=>{const x=setup();for(let i=0;i<9;i++)x.buttons[i%3].click();assert.equal(x.submit().length,1)});
