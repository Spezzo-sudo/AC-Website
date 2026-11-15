import {readdir,readFile,access} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {spawnSync} from 'node:child_process';
async function files(dir){return (await Promise.all((await readdir(dir,{withFileTypes:true})).map(d=>d.isDirectory()?files(`${dir}/${d.name}`):`${dir}/${d.name}`))).flat();}
let failed=false;
for(const file of (await files('src')).filter(f=>f.endsWith('.js'))){const check=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});if(check.status){console.error(check.stderr);failed=true;}const text=await readFile(file,'utf8');for(const [,path] of text.matchAll(/from\s+['"]([^'"]+)['"]/g)){if(path.startsWith('.'))try{await access(resolve(dirname(file),path));}catch{console.error(`${file}: missing ${path}`);failed=true;}}}
for(const path of ['index.html','src/styles.css','public/room.svg','public/favicon.svg'])await access(path);
if(failed)process.exit(1);console.log('Syntax, module imports and entry assets OK.');
