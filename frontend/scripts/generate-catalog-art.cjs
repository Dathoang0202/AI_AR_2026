// Rebuild the face-free catalog drawings from the same geometry used in Studio.
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const root = path.resolve(__dirname, '..');
function loadTs(relative) {
  const filename = path.join(root, relative);
  const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const mod = new Module(filename, module);
  mod.filename = filename;
  mod.paths = Module._nodeModulePaths(path.dirname(filename));
  mod._compile(compiled, filename);
  return mod.exports;
}
const { workbookCatalog } = loadTs('lib/workbookCatalog.ts');
const { WorkbookGarment } = loadTs('components/mannequin/WorkbookGarment.tsx');
const { WorkbookAccessory } = loadTs('components/mannequin/WorkbookLayers.tsx');
const directory = path.join(root, 'public/images/museum');
fs.mkdirSync(directory, { recursive: true });
for (const entry of workbookCatalog) {
  const garment = entry.category === 'GARMENT';
  const id = `catalog-${entry.kind}`;
  const art = renderToStaticMarkup(React.createElement('svg', null, React.createElement(garment ? WorkbookGarment : WorkbookAccessory, {
    kind: entry.kind, male: entry.gender === 'male', color: entry.color, id,
  }))).replace(/^<svg>/, '').replace(/<\/svg>$/, '');
  const short = ['ao-yem', 'tran-thu', 'vat-ho', 'ngu-lam'].includes(entry.kind);
  const viewBox = garment ? short ? '75 108 210 240' : '32 15 296 490' : entry.viewBox;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 700" role="img" aria-labelledby="title">
<title id="title">Việt Phục Studio — minh họa phom dáng ${entry.kind}</title>
<desc>Hình vẽ giản lược từ mô tả danh mục; không phải ảnh hiện vật hoặc bản phục dựng lịch sử.</desc>
<defs><linearGradient id="paper" x2="1" y2="1"><stop stop-color="#F8F3EA"/><stop offset="1" stop-color="#E8DECE"/></linearGradient><radialGradient id="glow"><stop stop-color="#FFFDF7"/><stop offset="1" stop-color="#EFE5D5"/></radialGradient><filter id="shadow" x="-30%" y="-20%" width="160%" height="150%"><feDropShadow dx="0" dy="8" stdDeviation="7" flood-color="#504333" flood-opacity=".18"/></filter></defs>
<path fill="url(#paper)" d="M0 0h600v700H0z"/><path d="M58 642V276a242 242 0 0 1 484 0v366Z" fill="url(#glow)" stroke="#D7C9B5"/>
<path d="M40 660h520M42 676h516" stroke="#D1C0A7"/><ellipse cx="300" cy="626" rx="142" ry="12" fill="#B9A68B" opacity=".16"/>
<svg x="${garment ? 60 : 86}" y="${garment ? 66 : 160}" width="${garment ? 480 : 428}" height="${garment ? 544 : 370}" viewBox="${viewBox}" overflow="visible" filter="url(#shadow)">${art}</svg>
</svg>\n`;
  fs.writeFileSync(path.join(directory, `${entry.kind}.svg`), svg);
}
console.log(`Generated ${workbookCatalog.length} catalog drawings.`);
