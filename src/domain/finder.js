export const defaults = {room:'bedroom',area:25,heat:'normal',tenure:'rent',installation:'unsure',canton:'AG',municipality:'',priority:'quiet',budget:'flexible',hours:5,days:60,tariff:0.30};
// EXPLICIT DEMONSTRATION MODEL. Coefficients are editorial assumptions, not a design standard.
export function estimateCapacity(area, heat='normal') {
 const size=Number(area); if(!Number.isFinite(size)||size<8||size>120) throw new RangeError('Area must be between 8 and 120 m²');
 const factor={normal:70,sunny:90,roof:110}[heat]; if(!factor) throw new TypeError('Unknown heat scenario');
 return {low:Math.round(size*factor*0.8/100)/10,high:Math.round(size*factor*1.2/100)/10,wattsPerM2:factor};
}
export function energyCost(inputKw,hours,days,tariff) {
 const values=[inputKw,hours,days,tariff].map(Number);
 if(values.some(v=>!Number.isFinite(v)||v<0)) throw new RangeError('Non-negative finite values required');
 return Math.round(values.reduce((a,b)=>a*b,1)*100)/100;
}
export function recommendType(answers) {
 // Permission uncertainty never becomes automatic approval.
 if(answers.installation!=='yes') return answers.priority==='budget'?'mobile':'portableSplit';
 return 'split';
}
export function rankProducts(answers,products,{includeDemo=false}={}) {
 const type=recommendType(answers);
 return products.filter(p=>includeDemo ? p.availability==='demo'||(p.swissDeliveryVerified&&p.availability==='inStock') : p.swissDeliveryVerified&&p.availability==='inStock')
 .map(p=>({...p,preferred:p.type===type})).sort((a,b)=>Number(b.preferred)-Number(a.preferred));
}
export function parseAnswers(raw) {
 const result={...defaults}; if(!raw||typeof raw!=='object') return result;
 const enums={room:['bedroom','living','office'],heat:['normal','sunny','roof'],tenure:['rent','own'],installation:['no','unsure','yes'],priority:['quiet','efficiency','budget'],budget:['under1000','under3000','flexible']};
 for(const [key,values] of Object.entries(enums)) if(values.includes(raw[key])) result[key]=raw[key];
 for(const [key,min,max] of [['area',8,120],['hours',1,24],['days',1,365],['tariff',0.05,1]]) if(Number.isFinite(Number(raw[key]))&&Number(raw[key])>=min&&Number(raw[key])<=max) result[key]=Number(raw[key]);
 if(typeof raw.canton==='string'&&/^[A-Z]{2}$/.test(raw.canton)) result.canton=raw.canton;
 if(typeof raw.municipality==='string') result.municipality=raw.municipality.slice(0,80);
 return result;
}
