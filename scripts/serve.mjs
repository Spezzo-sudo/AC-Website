import {createServer} from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import {resolve, extname, sep} from 'node:path';
const args=process.argv.slice(2);
const root=process.cwd(), port=Number(process.env.PORT || (args.includes('--port')?args[args.indexOf('--port')+1]:5173));
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.json':'application/json'};
createServer(async(req,res)=>{try {const path=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(path!==root&&!path.startsWith(root+sep)){res.writeHead(403).end();return;} const file=(await stat(path)).isDirectory()?resolve(path,'index.html'):path;res.setHeader('Content-Type',mime[extname(file)]||'application/octet-stream');res.setHeader('X-Content-Type-Options','nosniff');res.end(await readFile(file));}catch{res.writeHead(404).end('Not found');}}).listen(port,'0.0.0.0',()=>console.log(`Local: http://localhost:${port}`));
