// Integration check: start both services and configure a Gemini key before running.
// This intentionally makes two live Gemini requests; all other calls stay local.
const { chromium, expect } = require(process.env.PLAYWRIGHT_MODULE || '@playwright/test');
const fs = require('node:fs');
const web = process.env.TEST_WEB_URL || 'http://localhost:3000';
const api = process.env.TEST_API_URL || 'http://localhost:8081/api/v1';

(async () => {
 const browser = await chromium.launch({ channel: 'chrome', headless: true });
 try {
  const page = await browser.newPage({viewport:{width:1440,height:1000}});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const data=await (await page.request.get(api+'/cultural-items')).json();
  const items=data.data;
  if(items.length!==35 || items.some(i=>!i.imageUrl)) throw Error('Catalog image coverage incomplete');
  await page.goto(web+'/cultural',{waitUntil:'networkidle'});
  while(await page.locator('.museum-collection-end button').count()) await page.locator('.museum-collection-end button').click();
  await expect(page.locator('.museum-artifact-card')).toHaveCount(35);
  for(const card of await page.locator('.museum-artifact-card').all()) await card.scrollIntoViewIfNeeded();
  await expect.poll(()=>page.locator('.museum-artifact-image > img').evaluateAll(imgs=>imgs.filter(i=>i.complete && i.naturalWidth>0).length)).toBe(35);
  await expect(page.locator('.museum-artifact-image .museum-illustration-label')).toHaveCount(9);
  const remote=await page.locator('.museum-artifact-image img').evaluateAll(imgs=>imgs.filter(i=>new URL(i.src).host!==location.host).map(i=>i.src));
  if(remote.length) throw Error('Images still depend on external hosts');
  await page.screenshot({path:'node_modules/.cache/museum-final-desktop.png',fullPage:true});
  const newNames=['vien-linh-photo','doi-kham-photo','guoc-moc-photo','co-man.svg','phuong-bao.svg','bien-phuc.svg','vat-ho.svg','ngu-lam.svg','thu-kham.svg','mo-qua.svg','hoang-bao-photo','canh-chuon-photo'];
  for(const item of items.filter(i=>newNames.some(n=>i.imageUrl.includes(n)))) {
   await page.goto(`${web}/cultural/${item.id}`,{waitUntil:'networkidle'});
   await expect(page.locator('.museum-detail-image > img')).toBeVisible();
   await expect.poll(()=>page.locator('.museum-detail-image > img').evaluate(i=>i.complete && i.naturalWidth>0)).toBe(true);
   await page.locator('.museum-detail-image').click();
   await expect(page.locator('dialog[open] .museum-lightbox-image img')).toBeVisible();
   if(item.imageUrl.endsWith('.svg')) await expect(page.locator('dialog[open] .museum-illustration-label')).toBeVisible();
   await page.keyboard.press('Escape');
   await page.locator('#tab-sources').click();
   await expect(page.locator('.museum-photo-source').first()).toBeVisible();
  }
  const illustrated=items.find(i=>i.imageUrl.endsWith('/co-man.svg'));
  await page.goto(`${web}/cultural/${illustrated.id}`,{waitUntil:'networkidle'});
  await page.setViewportSize({width:390,height:844});
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Mobile overflow');
  await page.screenshot({path:'node_modules/.cache/museum-final-mobile.png',fullPage:true});
  // Exercise failure recovery using real API data and one failed image request.
  await page.route('**/images/museum/vien-linh-photo.jpg',r=>r.abort());
  const vien=items.find(i=>i.imageUrl.endsWith('/vien-linh-photo.jpg'));
  await page.goto(`${web}/cultural/${vien.id}`,{waitUntil:'networkidle'});
  await expect(page.locator('.museum-detail-image > img')).toHaveAttribute('src','/images/museum/vien-linh.svg');
  await expect(page.locator('.museum-detail-image .museum-illustration-label')).toBeVisible();
  await page.unroute('**/images/museum/vien-linh-photo.jpg');
  await page.setViewportSize({width:1440,height:1000});
  await page.goto(web+'/assistant',{waitUntil:'networkidle'});
  const responsePromise=page.waitForResponse(r=>r.url().endsWith('/assistant/chat') && r.request().method()==='POST',{timeout:45000});
  await page.locator('#assistant-question').fill('Áo Nhật Bình thuộc thời kỳ nào? Trả lời trong 2 câu.');
  await page.locator('#assistant-question').press('Enter');
  const chat=await (await responsePromise).json();
  await expect(page.locator('.assistant-message--assistant')).toHaveCount(1,{timeout:45000});
  if(chat.data.answerMode!=='gemini') throw Error('Real Gemini response unavailable');
  await expect(page.locator('.assistant-answer-mode')).toContainText('Gemini');
  const followupPromise=page.waitForResponse(r=>r.url().endsWith('/assistant/chat') && r.request().method()==='POST',{timeout:45000});
  await page.locator('#assistant-question').fill('Vậy áo này phù hợp với dịp nào? Trả lời trong 2 câu.');
  await page.locator('#assistant-question').press('Enter');
  const followupResponse=await followupPromise;
  const followup=await followupResponse.json();
  const sent=followupResponse.request().postDataJSON();
  if(sent.history.length!==2 || followup.data.conversationId!==chat.data.conversationId) throw Error('History not retained');
  if(followup.data.answerMode!=='gemini') throw Error('Gemini follow-up unavailable');
  await expect(page.locator('.assistant-message--assistant')).toHaveCount(2);
  await page.screenshot({path:'node_modules/.cache/gemini-final-desktop.png',fullPage:true});
  await page.setViewportSize({width:390,height:844});
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Assistant mobile overflow');
  await page.screenshot({path:'node_modules/.cache/gemini-final-mobile.png',fullPage:true});
  if(errors.length) throw Error(JSON.stringify(errors));
  const result={items:35,loadedImages:35,detailPagesChecked:12,illustrationLabels:9,gemini:chat.data.answerMode,followup:followup.data.answerMode,consoleErrors:errors.length};
  fs.writeFileSync('node_modules/.cache/museum-gemini-result.json',JSON.stringify(result,null,2));
  console.log('PASS',JSON.stringify(result));
 } finally {await browser.close();}
})().catch(e=>{console.error(e.message);process.exit(1);});
