import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const src=path.join(root,'framework','components');
const dest=path.join(root,'docs','components');
fs.mkdirSync(dest,{recursive:true});
for(const ent of fs.readdirSync(src,{withFileTypes:true})){
  if(!ent.isDirectory())continue;
  const p=path.join(src,ent.name,'COMPONENT.md');
  if(!fs.existsSync(p))continue;
  let value=fs.readFileSync(p,'utf8');
  // VitePress pages are generated, never edited directly.
  value=value.replaceAll('(./component.json)', `(../../framework/components/${ent.name}/component.json)`);
  fs.writeFileSync(path.join(dest,`${ent.name}.md`),value);
}
console.log('Component reference pages synchronized.');
