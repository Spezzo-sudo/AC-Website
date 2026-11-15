import test from 'node:test';
import assert from 'node:assert/strict';
import {freshAnswers,estimateCapacity,energyCost,decide,nextRefinement,resolvedFacts,rankProducts,parseAnswers} from '../src/domain/finder.js';
import {createBrief} from '../src/domain/brief.js';
import {products} from '../src/data/products.js';
import {cantons} from '../src/data/cantons.js';
import {locales,dictionaries,translator} from '../src/i18n/messages.js';
import {finder} from '../src/components/finder.js';
import {result} from '../src/views/result.js';
import {compare} from '../src/views/compare.js';
const scenario=(overrides={})=>({...freshAnswers(),room:'living',priority:'budget',...overrides,facts:{...freshAnswers().facts,...overrides.facts}});
const liveProduct=(overrides={})=>({id:'fixture',type:'mobile',capacity:3,price:600,swissDeliveryVerified:true,availability:'inStock',...overrides});
test('a new finder does not invent room, priority or physical answers',()=>{
 const a=freshAnswers();assert.equal(decide(a).status,'incomplete');assert.equal(a.canton,'');assert.ok(Object.values(a.facts).every(v=>v===null));
 const next=freshAnswers();a.facts.opening='yes';assert.equal(next.facts.opening,null);
});
test('capacity combines sun and top floor and rejects invalid areas',()=>{
 assert.deepEqual(estimateCapacity(25),{low:1.4,high:2.1,wattsPerM2:70});
 assert.ok(estimateCapacity(25,'roofSunny').high>estimateCapacity(25,'roof').high);
 for(const value of [0,121,NaN,Infinity,'invalid'])assert.throws(()=>estimateCapacity(value));
});
test('electricity uses electrical input independently of cooling capacity',()=>{
 assert.equal(energyCost(.85,5,60,.3),76.5);assert.equal(energyCost(.85,10,60,.3),153);assert.equal(energyCost(0,5,60,.3),0);
 assert.throws(()=>energyCost(-1,5,60,.3));assert.throws(()=>energyCost(NaN,5,60,.3));
});
test('renter, quiet, outdoor space, no fixed installation: portable split remains first',()=>{
 const d=decide(scenario({priority:'quiet',tenure:'rent',noFixed:true,facts:{opening:'yes',nearOutdoor:'yes'}}));
 assert.equal(d.primary,'portableSplit');assert.equal(d.alternative,'mobile');assert.equal(d.classes.split.status,'excluded');assert.equal(d.check,'portableCheck');
});
test('rental consent does not suppress a plausible class',()=>{
 const a=scenario({priority:'quiet',facts:{opening:'yes',nearOutdoor:'yes'}});
 assert.deepEqual(decide({...a,tenure:'rent'}),decide({...a,tenure:'own'}));assert.equal(decide(a).check,'fixedCheck');
});
test('cheap entry and nearby outdoor space do not force a fixed split',()=>{
 const d=decide(scenario({facts:{opening:'yes',nearOutdoor:'yes',exteriorWall:'yes'}}));assert.equal(d.primary,'mobile');
});
test('an opening alone never confirms a mobile split',()=>{
 const d=decide(scenario({priority:'quiet',facts:{opening:'yes',nearOutdoor:'no',exteriorWall:'no',buildingOutdoor:'no'}}));
 assert.equal(d.primary,'mobile');assert.equal(d.classes.portableSplit.status,'excluded');
});
test('outdoor inference is one-way and never overwrites a user answer',()=>{
 assert.equal(resolvedFacts(scenario({facts:{nearOutdoor:'yes'}})).sources.buildingOutdoor,'derived');
 assert.equal(resolvedFacts(scenario({facts:{nearOutdoor:'no'}})).facts.buildingOutdoor,null);
 assert.equal(resolvedFacts(scenario({facts:{nearOutdoor:'yes',buildingOutdoor:'unknown'}})).facts.buildingOutdoor,'unknown');
});
test('editing the source fact removes stale derived values',()=>{
 const a=scenario({facts:{nearOutdoor:'yes'}});assert.equal(resolvedFacts(a).facts.buildingOutdoor,'yes');
 a.facts.nearOutdoor='no';assert.equal(resolvedFacts(a).facts.buildingOutdoor,null);assert.equal(a.facts.buildingOutdoor,null);
});
test('unknown, unanswered and excluded remain distinct',()=>{
 const open=scenario({priority:'quiet',facts:{opening:'yes',nearOutdoor:'no',exteriorWall:'no'}});
 assert.equal(nextRefinement(open),'buildingOutdoor');
 const unknown=scenario({...open,facts:{...open.facts,buildingOutdoor:'unknown'}});assert.equal(nextRefinement(unknown),null);assert.equal(decide(unknown).classes.split.status,'pending');
 assert.equal(decide(scenario({...open,facts:{...open.facts,buildingOutdoor:'no'}})).classes.split.status,'excluded');
});
test('no confirmed physical route produces no device recommendation',()=>{
 const a=scenario({facts:{opening:'no',nearOutdoor:'no',exteriorWall:'no',buildingOutdoor:'no'}});
 assert.equal(decide(a).status,'noRoute');assert.equal(decide(a).primary,null);assert.deepEqual(rankProducts(a,products,{includeDemo:true}),[]);
});
test('unknown prerequisites produce a visibly provisional result',()=>{
 const d=decide(scenario({priority:'quiet',facts:{opening:'unknown',nearOutdoor:'unknown',exteriorWall:'unknown',buildingOutdoor:'unknown'}}));
 assert.equal(d.status,'unclear');assert.equal(d.classes[d.primary].status,'pending');
});
test('refinement never exists merely to certify runners-up',()=>{
 const a=scenario({facts:{opening:'yes'}});assert.equal(decide(a).primary,'mobile');assert.equal(nextRefinement(a),null);
});
test('undecided visitors get directions to compare without forced extra questions',()=>{
 const a=scenario({priority:'unsure',facts:{opening:'yes',nearOutdoor:'yes'}});assert.equal(decide(a).status,'compare');assert.ok(decide(a).alternative);assert.equal(nextRefinement(a),null);
});
test('multiple rooms or large areas leave the single-room recommendation path',()=>{
 for(const a of [scenario({area:100}),scenario({multiRoom:true})]){assert.equal(decide(a).status,'professional');assert.equal(decide(a).primary,null);assert.deepEqual(rankProducts(a,products,{includeDemo:true}),[]);}
});
test('personal product comparison excludes insufficient capacity without changing the class',()=>{
 const a=scenario({area:50,facts:{opening:'yes'}}),list=[liveProduct({id:'weak',capacity:2.6}),liveProduct({id:'strong',capacity:4.5})];
 assert.deepEqual(rankProducts(a,list).map(p=>p.id),['strong']);assert.equal(decide(a).primary,'mobile');assert.equal(rankProducts(a,products,{includeDemo:true}).length,0);
});
test('production recommendations require verified Swiss stock',()=>{
 const a=scenario({facts:{opening:'yes'}});
 assert.deepEqual(rankProducts(a,products),[]);
 const list=[liveProduct({id:'valid'}),liveProduct({id:'out',availability:'outOfStock'}),liveProduct({id:'not-ch',swissDeliveryVerified:false})];
 assert.deepEqual(rankProducts(a,list).map(p=>p.id),['valid']);
});
test('known price can exclude a product, missing price never claims budget fit',()=>{
 const a=scenario({budget:'under1000',facts:{opening:'yes'}});
 const list=[liveProduct({id:'cheap',price:600}),liveProduct({id:'expensive',price:1400}),liveProduct({id:'unknown',price:null})];
 const rows=rankProducts(a,list);assert.deepEqual(rows.map(p=>p.id),['cheap','unknown']);assert.equal(rows[1].budgetStatus,'unknown');
});
test('personal alternatives are labelled separately and preserve uncertainty',()=>{
 const a=scenario({priority:'quiet',facts:{opening:'yes',nearOutdoor:'no',exteriorWall:'yes',buildingOutdoor:'unknown'}});
 const rows=rankProducts(a,[liveProduct({id:'wall',type:'fixedMonoblock'}),liveProduct({id:'split',type:'split'})]);
 assert.equal(rows[0].matchKind,'primary');assert.equal(rows[1].matchKind,'alternative');assert.equal(rows[1].conditional,true);
});
test('all 26 cantons stay explicitly unverified',()=>{
 assert.equal(cantons.length,26);assert.equal(new Set(cantons.map(c=>c.code)).size,26);assert.ok(cantons.every(c=>c.status==='unverified'&&c.sources.length===0&&c.reviewedAt===null));
});
test('malformed input falls back without turning missing facts into consent',()=>{
 const a=parseAnswers({area:-5,priority:'fake',hours:50,tariff:'NaN',facts:{opening:true,nearOutdoor:'wrong'},municipality:'a'.repeat(90)});
 assert.equal(a.area,25);assert.equal(a.priority,null);assert.equal(a.hours,5);assert.equal(a.facts.opening,null);assert.equal(a.municipality.length,80);
});
test('all languages render every result state without raw missing keys',()=>{
 const scenarios=[scenario({facts:{opening:'yes'}}),scenario({priority:'quiet'}),scenario({priority:'unsure'}),scenario({area:100}),scenario({facts:{opening:'no',nearOutdoor:'no',exteriorWall:'no',buildingOutdoor:'no'}})];
 for(const locale of locales){
  const t=key=>{assert.ok(dictionaries[locale][key],`${locale}.${key}`);return translator(locale)(key);};
  for(const a of scenarios){assert.ok(result(t,a,locale));assert.ok(compare(t,'all',a,locale));assert.ok(createBrief(t,a));}
  for(let step=0;step<4;step++)assert.ok(finder(t,scenarios[0],step));
 }
});
test('municipality is escaped in result and stays plain text in the brief',()=>{
 const a=scenario({municipality:'"><img src=x onerror=alert(1)>',facts:{opening:'yes'}}),t=translator('de');
 assert.ok(!result(t,a,'de').includes('<img src=x'));assert.ok(result(t,a,'de').includes('&lt;img'));assert.ok(createBrief(t,a).includes(a.municipality));
});
test('free comparison has no personal match badges and includes excluded types',()=>{
 const a=scenario({noFixed:true,facts:{opening:'yes'}}),t=translator('de');
 const html=compare(t,'all',a,'de','all');assert.ok(html.includes('Wall Compact'));assert.ok(!html.includes(t('demoFit')));
});
