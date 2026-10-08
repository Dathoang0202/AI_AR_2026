// Real API/browser check. Start both services; provide PLAYWRIGHT_MODULE if it is not installed locally.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium, expect } = require(process.env.PLAYWRIGHT_MODULE || '@playwright/test');
const web = process.env.TEST_WEB_URL || 'http://localhost:3000';
const api = process.env.TEST_API_URL || 'http://localhost:8081/api/v1';
const output = path.resolve(__dirname, '../node_modules/.cache');
const examples = [
 ['Viên Lĩnh','vien-linh','#365B66','male'], ['Đối Khâm','doi-kham','#A47A91','female'],
 ['Cổ Mãn','co-man','#677D68','male'], ['Bổ Tử','bo-tu','#1A365D','male'],
 ['Côn Miện','con-mien','#292524','male'], ['Hoàng Bào','hoang-bao','#D4AF37','male'],
 ['Phượng Bào','phuong-bao','#8D3025','female'], ['Yếm','ao-yem','#B95F66','female'],
 ['Trấn Thủ','tran-thu','#677D68','male'], ['Biền Phục','bien-phuc','#403D52','male'],
 ['Mãng Bào','mang-bao','#1E4D2B','male'], ['Vạt Hò','vat-ho','#895B3F','male'],
 ['Ngự Lâm','ngu-lam','#8D3025','male'], ['Thụ Khâm','thu-kham','#365B66','male'],
];

(async () => {
 const browser = await chromium.launch({channel:'chrome',headless:true});
 const page = await browser.newPage({viewport:{width:1440,height:960}});
 page.setDefaultTimeout(20000);
 const errors = [];
 page.on('pageerror', error => errors.push(error.message));
 const saved = [];
 let headers;
 try {
  const response = await page.request.get(api+'/cultural-items');
  assert.ok(response.ok());
  const catalog = (await response.json()).data;
  const figures=[];
  for (const [search,kind,color,preferredGender] of examples) {
   const item=catalog.find(x=>x.category==='GARMENT' && x.name.includes(search));
   assert.ok(item,search);
   const params = new URLSearchParams({garmentId:String(item.id),gender:preferredGender,colors:JSON.stringify([color])});
   await page.goto(web+'/studio?'+params,{waitUntil:'networkidle',timeout:60000});
   const svg=page.locator('[data-mannequin] svg[data-garment-kind]');
   await expect(svg).toHaveAttribute('data-garment-kind',kind);
   await expect(svg.locator('[data-workbook-garment]')).toHaveAttribute('data-workbook-garment',kind);
   await expect(page.locator('[data-preview-unavailable]')).toHaveCount(0);
   for(const gender of ['male','female']) {
    await page.locator(`[data-gender="${gender}"]`).click();
    await expect(svg).toHaveAttribute('data-fit',gender);
    await expect(svg.locator('[data-garment-cut]')).toHaveAttribute('data-shoulder-width',gender==='male'?'110':'86');
    const geometry=await svg.locator('[data-workbook-garment] path').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('d')).join('|'));
    assert.ok(!/NaN|undefined/.test(geometry));
    assert.ok(geometry.length>300);
    if(gender==='male') item.maleGeometry=geometry;
    else assert.notEqual(geometry,item.maleGeometry,'Garment must fit both shoulder widths: '+kind);
    const missing=await svg.evaluate(root=>Array.from(root.querySelectorAll('*')).flatMap(el=>Array.from(el.attributes).filter(a=>a.value.startsWith('url(#')).map(a=>a.value.slice(5,-1))).filter(id=>!document.getElementById(id)));
    assert.deepEqual(missing,[],'Broken SVG gradients/clips: '+kind);
   }
   await page.locator(`[data-gender="${preferredGender}"]`).click();
   await page.locator('[data-color-swatches] button[aria-label*="#1A365D"]').click();
   await expect(svg).toHaveAttribute('data-color','#1A365D');
   await page.locator('[data-color-swatches] button[aria-label*="#FFFFFF"]').click();
   await expect(svg).toHaveAttribute('data-color','#FFFFFF');
   await page.locator('[data-color-palette] input[maxlength="7"]').fill(color);
   await page.locator('[data-color-palette] button').last().click();
   await expect(svg).toHaveAttribute('data-color',color);
   const file=await page.request.get(web+`/images/museum/${kind}.svg`);
   assert.ok(file.ok(),kind+' catalog drawing');
   const bounds=await svg.evaluate(el=>{const b=el.getBBox();return {x:b.x,y:b.y,right:b.x+b.width,bottom:b.y+b.height}});
   assert.ok(bounds.x>=0&&bounds.right<=360&&bounds.y>=20&&bounds.bottom<=560,kind+' clipped '+JSON.stringify(bounds));
   figures.push({name:item.name,svg:(await svg.evaluate(el=>el.outerHTML)).replaceAll('figure-',`${kind}-figure-`)});
  }
  // Render all the actual browser SVGs together for visual review, with unique IDs.
  const contact=await browser.newPage({viewport:{width:1600,height:1100}});
  await contact.setContent(`<style>*{box-sizing:border-box}body{margin:0;background:#eae5dc;font:14px Arial}.grid{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;padding:18px}.card{background:#faf7f0;border:1px solid #d8cbbb;border-radius:14px;padding:16px;text-align:center}.card svg{height:420px;width:100%}.card p{height:32px;line-height:1.5;color:#49392d}</style><div class="grid">${figures.map(x=>`<div class="card">${x.svg}<p>${x.name}</p></div>`).join('')}</div>`);
  await contact.screenshot({path:path.join(output,'workbook-garments-redesigned.png'),fullPage:true});
  await contact.close();

  // Real save/load verifies the same renderer in a list and a restored studio session.
  const username='garment_'+Date.now();
  const registration=await page.request.post(api+'/auth/register',{data:{username,email:username+'@example.test',password:'Local-preview-check-2026',fullName:'Garment preview check'}});
  assert.equal(registration.status(),201);
  const auth=(await registration.json()).data;
  headers={Authorization:'Bearer '+auth.token};
  for(const index of [1,5,8]) {
   const [search,kind,color,gender]=examples[index];
   const item=catalog.find(x=>x.name.includes(search));
   const record=await page.request.post(api+'/outfits',{headers,data:{name:'Kiểm tra '+item.name,primaryGarment:item.name,gender,colors:[color],accessories:[],occasion:'Chụp ảnh di sản / nghệ thuật',region:'Miền Bắc',style:'Nho nhã Sĩ phu',visibility:'PRIVATE'}});
   assert.ok(record.ok());
   saved.push({...((await record.json()).data),kind});
  }
  await page.addInitScript(auth=>{localStorage.setItem('vietphuc_token',auth.token);localStorage.setItem('vietphuc_user',JSON.stringify(auth))},auth);
  await page.goto(web+'/lookbook',{waitUntil:'networkidle'});
  await expect(page.locator('[data-lookbook-id]')).toHaveCount(3);
  for(const outfit of saved) {
   const svg=page.locator(`[data-lookbook-id="${outfit.id}"] svg[data-garment-kind]`);
   await expect(svg).toHaveAttribute('data-garment-kind',outfit.kind);
   await expect(svg).toHaveAttribute('data-color',outfit.colors[0]);
   await expect(svg).toHaveAttribute('data-fit',outfit.gender);
  }
  const ids=await page.locator('[data-lookbook-id] svg [id]').evaluateAll(nodes=>nodes.map(n=>n.id));
  assert.equal(new Set(ids).size,ids.length,'IDs must be unique across Lookbook cards');
  await page.screenshot({path:path.join(output,'workbook-lookbook-redesigned.png'),fullPage:true});
  await page.locator(`[data-lookbook-id="${saved[1].id}"] a`).first().click();
  await page.waitForURL('**/studio?**');
  await expect(page.locator('svg[data-garment-kind]')).toHaveAttribute('data-garment-kind','hoang-bao');
  await expect(page.locator('svg[data-garment-kind]')).toHaveAttribute('data-color','#D4AF37');
  await page.screenshot({path:path.join(output,'workbook-studio-redesigned.png'),fullPage:true});
  for(const width of [390,320]) {
   await page.setViewportSize({width,height:844});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   const b=await page.locator('[data-mannequin]').boundingBox();
   assert.ok(b.width>200&&b.height>180&&b.x>=0&&b.x+b.width<=width+1);
   await page.locator('[data-mannequin] button[aria-label="Xem cận cảnh"]').click();
   await page.locator('[data-mannequin] button[aria-label="Xem toàn thân"]').click();
  }
  await page.screenshot({path:path.join(output,'workbook-studio-mobile.png'),fullPage:true});
  // Existing models and new accessory layering continue working.
  await page.goto(web+'/studio?garmentId=2',{waitUntil:'networkidle'});
  await expect(page.locator('svg[data-garment-kind]')).toHaveAttribute('data-garment-kind','giao-linh');
  assert.deepEqual(errors,[]);
  console.log('PASS: 14 garment cuts × 2 bodies; palette changes; SVG bounds and references; generated images; real Lookbook persistence/restore; unique IDs; mobile/zoom; existing garment.');
 } finally {
  if(headers) for(const outfit of saved) await page.request.delete(api+'/outfits/'+outfit.id,{headers});
  await browser.close();
 }
})().catch(error=>{console.error(error);process.exitCode=1});
