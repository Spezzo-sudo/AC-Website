/** Coarse class orientation only. No scores, permits, real-device claims or DOM. */
export const factKeys = ['opening', 'nearOutdoor', 'exteriorWall', 'buildingOutdoor'];
export const defaults = Object.freeze({room:null, area:25, heat:'normal', priority:null,
  noFixed:false, multiRoom:false, budget:'flexible', tenure:'unknown', canton:'', municipality:'',
  inputKw:1, hours:5, days:60, tariff:0.30,
  facts:Object.freeze(Object.fromEntries(factKeys.map(key=>[key,null])))});
export function freshAnswers(){return {...defaults,facts:{...defaults.facts}};}
export const classRequirements = Object.freeze({mobile:['opening'],portableSplit:['opening','nearOutdoor'],fixedMonoblock:['exteriorWall'],split:['buildingOutdoor']});
// Editorial class-level order, not measured device performance. Validate before real recommendations.
const orders={budget:['mobile','portableSplit','fixedMonoblock','split'],quiet:['split','portableSplit','fixedMonoblock','mobile'],efficiency:['split','portableSplit','fixedMonoblock','mobile'],unsure:['mobile','portableSplit','fixedMonoblock','split']};
export function estimateCapacity(area,heat='normal'){
 const size=Number(area);if(!Number.isFinite(size)||size<8||size>120)throw new RangeError('Area must be between 8 and 120 m²');
 const factor={normal:70,sunny:90,roof:110,roofSunny:130}[heat];if(!factor)throw new TypeError('Unknown heat scenario');
 return {low:Math.round(size*factor*.8/100)/10,high:Math.round(size*factor*1.2/100)/10,wattsPerM2:factor};
}
export function energyCost(inputKw,hours,days,tariff){
 const values=[inputKw,hours,days,tariff].map(Number);
 if(values.some(v=>!Number.isFinite(v)||v<0))throw new RangeError('Non-negative finite values required');
 return Math.round(values.reduce((a,b)=>a*b,1)*100)/100;
}
export function parseAnswers(raw){
 const result=freshAnswers();if(!raw||typeof raw!=='object')return result;
 const enums={room:['bedroom','living','office'],heat:['normal','sunny','roof','roofSunny'],priority:Object.keys(orders),budget:['under1000','under3000','flexible'],tenure:['rent','own','unknown']};
 for(const [key,values]of Object.entries(enums))if(values.includes(raw[key]))result[key]=raw[key];
 for(const [key,min,max]of [['area',8,120],['inputKw',.1,10],['hours',1,24],['days',1,365],['tariff',.05,1]])if(raw[key]!==null&&raw[key]!==''&&Number.isFinite(Number(raw[key]))&&Number(raw[key])>=min&&Number(raw[key])<=max)result[key]=Number(raw[key]);
 result.noFixed=raw.noFixed===true;result.multiRoom=raw.multiRoom===true;
 for(const key of factKeys)if(['yes','no','unknown'].includes(raw.facts?.[key]))result.facts[key]=raw.facts[key];
 if(typeof raw.canton==='string'&&/^[A-Z]{2}$/.test(raw.canton))result.canton=raw.canton;
 if(typeof raw.municipality==='string')result.municipality=raw.municipality.slice(0,80);
 return result;
}
export function resolvedFacts(raw){
 const {facts}=parseAnswers(raw),sources=Object.fromEntries(factKeys.map(key=>[key,facts[key]===null?null:'user']));
 // A near-room place is evidence of a general outdoor possibility, never of installation approval.
 // Recompute from the current raw answers every time; never overwrite an explicit user answer.
 if(facts.nearOutdoor==='yes'&&facts.buildingOutdoor===null){facts.buildingOutdoor='yes';sources.buildingOutdoor='derived';}
 return {facts,sources};
}
export function decide(raw){
 const a=parseAnswers(raw),{facts,sources}=resolvedFacts(a),order=orders[a.priority]||orders.unsure;
 const classes=Object.fromEntries(Object.entries(classRequirements).map(([type,requirements])=>{
  const intentExcluded=a.noFixed&&['split','fixedMonoblock'].includes(type);
  const blocked= requirements.find(key=>facts[key]==='no');
  const unresolved=requirements.filter(key=>facts[key]!=='yes');
  return [type,{type,status:intentExcluded||blocked?'excluded':unresolved.length?'pending':'plausible',unresolved,blockedBy:intentExcluded?'noFixed':blocked||null}];
 }));
 const base={facts,sources,classes,order,primary:null,alternative:null,check:null};
 if(!a.room||!a.priority)return {...base,status:'incomplete'};
 if(a.multiRoom||a.area>80)return {...base,status:'professional',check:'planningCheck'};
 const available=order.filter(type=>classes[type].status!=='excluded');
 if(!available.length)return {...base,status:'noRoute',check:'noRouteCheck'};
 const primary=available.find(type=>classes[type].status==='plausible')||available[0];
 const higherOpen=order.slice(0,order.indexOf(primary)).find(type=>classes[type].status==='pending');
 let alternative=higherOpen||available.find(type=>type!==primary)||null;
 if(a.priority==='unsure')alternative=[...available].reverse().find(type=>type!==primary)||null;
 const primaryPending=classes[primary].status==='pending';
 const status=a.priority==='unsure'?'compare':primaryPending?'unclear':higherOpen?'conditional':'clear';
 const check=primaryPending?classes[primary].unresolved[0]:['split','fixedMonoblock'].includes(primary)?'fixedCheck':primary==='portableSplit'?'portableCheck':'mobileCheck';
 return {...base,status,primary,alternative,check};
}
/** At most one unanswered fact that would promote a better class. Caller caps optional questions at two. */
export function nextRefinement(raw){
 const a=parseAnswers(raw),d=decide(a);
 if(['incomplete','professional','noRoute','compare'].includes(d.status))return null;
 const top=d.classes[d.primary].status==='pending'?d.order.indexOf(d.primary)+1:d.order.indexOf(d.primary);
 for(const type of d.order.slice(0,top)){
  const row=d.classes[type];
  if(row.status!=='pending'||row.unresolved.length!==1)continue;
  const key=row.unresolved[0];
  if(d.facts[key]===null)return key;
 }
 return null;
}
export function recommendType(raw){return decide(raw).primary;}
export function rankProducts(raw,products,{includeDemo=false}={}){
 const a=parseAnswers(raw),d=decide(a);if(!d.primary)return [];
 const requiredKw=estimateCapacity(a.area,a.heat).high;
 const limit={under1000:1000,under3000:3000}[a.budget]??Infinity;
 return products.filter(p=>includeDemo?p.availability==='demo'||p.swissDeliveryVerified&&p.availability==='inStock':p.swissDeliveryVerified&&p.availability==='inStock')
  .filter(p=>[d.primary,d.alternative].includes(p.type)&&d.classes[p.type]?.status!=='excluded')
  .filter(p=>Number.isFinite(p.capacity)&&p.capacity>=requiredKw)
  .filter(p=>p.price==null||Number.isFinite(p.price)&&p.price<limit)
  .map(p=>({...p,preferred:p.type===d.primary,matchKind:p.type===d.primary?'primary':'alternative',conditional:d.classes[p.type].status==='pending',budgetStatus:p.price==null?'unknown':'within',requiredKw}))
  .sort((a,b)=>Number(b.preferred)-Number(a.preferred));
}
