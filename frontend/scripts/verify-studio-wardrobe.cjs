const {chromium,expect}=require(process.env.PLAYWRIGHT_MODULE || '@playwright/test');
const assert=require('node:assert/strict');
const web=process.env.TEST_WEB_URL || 'http://localhost:3000';
const api=process.env.TEST_API_URL || 'http://localhost:8081/api/v1';
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
 const page=await browser.newPage({viewport:{width:1440,height:960}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const catalog=(await(await page.request.get(api+'/cultural-items')).json()).data;
 const garment=catalog.find(x=>x.name.includes('Bà Ba')),hat=catalog.find(x=>x.name==='Nón Lá'),fan=catalog.find(x=>x.name.includes('Quạt Xếp'));
 assert.ok(garment&&hat&&fan);
 await page.goto(web+'/studio?'+new URLSearchParams({garmentId:garment.id,gender:'female',accessories:JSON.stringify([hat.name,fan.name]),colors:JSON.stringify(['#895B3F'])}),{waitUntil:'networkidle',timeout:60000});
 await expect(page.locator('[data-wardrobe-picker] [data-wardrobe-illustration]')).toHaveCount(22);
 await expect(page.locator('[data-wardrobe-picker] img')).toHaveCount(0);
 await expect(page.locator('[data-wardrobe-picker] [data-mannequin-body]')).toHaveCount(0);
 await expect(page.locator('[data-mannequin] [data-hat-strap]')).toHaveCount(1);
 await expect(page.locator('[data-mannequin] [data-fan-rib]')).toHaveCount(19);
 await page.screenshot({path:'node_modules/.cache/studio-graphic-garments.png',fullPage:true});
 await page.locator('[data-wardrobe-picker] > div').first().locator('button').nth(1).click();
 await expect(page.locator('[data-wardrobe-picker] [data-wardrobe-illustration]')).toHaveCount(13);
 await expect(page.locator('[data-wardrobe-fallback]')).toHaveCount(0);
 await expect(page.locator('[data-wardrobe-picker] img')).toHaveCount(0);
 await page.screenshot({path:'node_modules/.cache/studio-graphic-accessories.png',fullPage:true});
 const preview=page.locator('[data-mannequin]');await preview.screenshot({path:'node_modules/.cache/hat-fan-redesign.png'});
 for(const gender of ['male','female']){await page.locator(`[data-gender="${gender}"]`).click();await expect(preview.locator('[data-garment-kind]')).toHaveAttribute('data-fit',gender);await expect(preview.locator('[data-hat-strap]')).toHaveCount(1);}
 await page.locator(`[data-item-id="${hat.id}"] > button`).click();await expect(preview.locator('[data-headwear-kind="non-la"]')).toHaveCount(0);
 await page.locator(`[data-item-id="${hat.id}"] > button`).click();await expect(preview.locator('[data-headwear-kind="non-la"]')).toHaveCount(1);
 const nextPagePromise=page.waitForEvent('popup');await page.locator(`[data-item-id="${hat.id}"] > a`).click();const museum=await nextPagePromise;await museum.waitForLoadState('networkidle');await expect(museum.locator('.museum-detail-image img')).toHaveAttribute('src','/images/museum/non-la.jpg');await museum.close();
 await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.screenshot({path:'node_modules/.cache/studio-graphic-mobile.png',fullPage:true});

 await page.setViewportSize({width:1440,height:960});
 const openStudio=async (search,gender,accessories=[],occasion='Chụp ảnh di sản / nghệ thuật')=>{
  const item=catalog.find(x=>x.name.includes(search));assert.ok(item,search);
  await page.goto(web+'/studio?'+new URLSearchParams({garmentId:item.id,gender,accessories:JSON.stringify(accessories),occasion,colors:JSON.stringify(['#1A365D'])}),{waitUntil:'networkidle'});
 };
 const check=page.locator('[data-cultural-check]');
 const fix=check.getByRole('button',{name:'Điều chỉnh phối đồ'});
 await openStudio('Phượng Bào','female',['Khăn Mỏ Quạ']);
 await expect(check).toHaveAttribute('data-status','CAUTION');
 await expect(fix).toHaveCount(0);
 await page.locator('[data-gender="male"]').click();
 await expect(check).toHaveAttribute('data-status','NON_COMPLIANT');
 await fix.click();
 await expect(page.locator('[data-mannequin] svg[data-garment-kind]')).toHaveAttribute('data-garment-kind','ao-tac');
 await expect(page.locator('[data-mannequin] svg[data-garment-kind]')).toHaveAttribute('data-color','#1A365D');
 await expect(check).toHaveAttribute('data-status','COMPLIANT');
 await openStudio('Côn Miện','male',['Nón Lá','Guốc Mộc','Hài Cung Đình'],'Dạo phố / Sự kiện văn hóa');
 await expect(check).toHaveAttribute('data-status','NON_COMPLIANT');
 await fix.click();
 await expect(check).toHaveAttribute('data-status','CAUTION');
 await expect(page.locator('[data-mannequin] [data-headwear-kind="non-la"]')).toHaveCount(0);
 await expect(fix).toHaveCount(0);
 await openStudio('Cổ Mãn','male');
 await expect(check).toHaveAttribute('data-status','CAUTION');
 await expect(fix).toHaveCount(0);

 // Context-only recommendations choose new catalog garments and carry accessories into Studio.
 await page.goto(web+'/onboarding?'+new URLSearchParams({gender:'male',occasion:'Chụp ảnh di sản / nghệ thuật',style:'Cổ điển Hoàng gia',region:'Miền Trung (Hoàng gia Huế)'}),{waitUntil:'networkidle'});
 await page.locator('button[type="submit"]').click();
 const royal=catalog.find(x=>x.name==='Hoàng Bào');
 const recommendation=page.locator('[data-recommendation-id]').first();
 await expect(recommendation).toHaveAttribute('data-recommendation-id',String(royal.id));
 await recommendation.getByRole('button',{name:'Mặc thử trong Studio'}).click();
 await page.waitForURL('**/studio?**');
 await expect(page.locator('[data-mannequin] svg[data-garment-kind]')).toHaveAttribute('data-garment-kind','hoang-bao');
 await expect(check).toHaveAttribute('data-status','CAUTION');
 const incoming=JSON.parse(new URL(page.url()).searchParams.get('accessories'));
 assert.ok(incoming.some(x=>x.includes('Đai Ngọc'))&&incoming.some(x=>x.includes('Hài Cung Đình')));
 const svgIds=await page.locator('svg [id]').evaluateAll(nodes=>nodes.map(x=>x.id));
 assert.equal(new Set(svgIds).size,svgIds.length,'Wardrobe and mannequin SVG IDs must not collide');

 // All museum records have an image; illustrations must be visibly identified.
 let photos=0,illustrations=0;
 for(const item of catalog){
  await page.goto(web+'/cultural/'+item.id,{waitUntil:'networkidle'});
  await expect(page.locator('#artifact-title')).toHaveText(item.name);
  const frame=page.locator('.museum-detail-image');
  const img=frame.locator('img');await expect(img).toBeVisible();
  await expect.poll(()=>img.evaluate(el=>el.complete&&el.naturalWidth>0)).toBe(true);
  if(await frame.locator('.museum-illustration-label').count()){
   await expect(frame.locator('.museum-illustration-label')).toBeVisible();illustrations++;
  }else{assert.ok(!(await img.getAttribute('src')).endsWith('.svg'));photos++;}
 }
 assert.equal(photos,26);assert.equal(illustrations,9);
 console.log('PASS: cultural status after gender/context changes, actionable adjustments, new context suggestions to Studio; museum 35 images including 9 labelled illustrations; unique SVG IDs.');

 assert.deepEqual(errors,[]);console.log('PASS: 35 graphic thumbnails; no museum photo/body in wardrobe; hat/fan both genders; select/remove; museum photo retained; mobile.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
