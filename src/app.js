import {translator,locales} from './i18n/messages.js';
import {header,footer,previewBanner} from './components/layout.js';
import {finder} from './components/finder.js';
import {home} from './views/home.js';
import {rules} from './views/rules.js';
import {compare,offerDialog} from './views/compare.js';
import {guide,textPage} from './views/pages.js';
import {result} from './views/result.js';
import {defaults,parseAnswers,energyCost,recommendType,estimateCapacity} from './domain/finder.js';
import {products} from './data/products.js';
import {cantons} from './data/cantons.js';
const app=document.querySelector('#app'), dialogRoot=document.querySelector('#dialog-root');
let locale='de',route='',answers={...defaults},hasResult=false,step=0,activeDialog=null,returnFocus=null,rulesCanton=null;
let t=translator(locale);
function render(){
 const fragment=location.hash.replace(/^#\/?/,'');const [path,query='']=fragment.split('?');const parts=path.split('/');
 locale=locales.includes(parts[0])?parts[0]:'de';route=parts[1]||'';t=translator(locale);const params=new URLSearchParams(query);
 document.querySelector('.skip-link').textContent=t('skip');
 document.documentElement.lang=locale==='de'?'de-CH':locale;document.title=`${route?t(({compare:'navCompare',rules:'navRules',guide:'navGuide',result:'resultTag',about:'about',privacy:'privacy',legal:'legal'})[route]||'navFinder')+' — ':''}klimafinder`;
 let view;switch(route){case 'compare':view=compare(t,params.get('type')||'all',hasResult?answers:null);break;case 'rules':view=rules(t,rulesCanton||answers.canton);break;case 'guide':view=guide(t,params.get('article'));break;case 'result':view=result(t,hasResult?answers:null,locale);break;case 'about':case 'privacy':case 'legal':view=textPage(t,route);break;default:view=home(t,locale);}
 app.innerHTML=`${header(t,locale,route)}<main id="main" tabindex="-1">${view}</main>${footer(t,locale)}${previewBanner(t)}`;
 if(activeDialog)closeDialog(false);window.scrollTo({top:0,behavior:'instant'});document.querySelector('h1')?.focus({preventScroll:true});
}
function openDialog(markup,label,cls=''){
 returnFocus=document.activeElement;dialogRoot.innerHTML=`<dialog class="dialog ${cls}" aria-labelledby="${label}">${markup}</dialog>`;
 activeDialog=dialogRoot.querySelector('dialog');activeDialog.addEventListener('close',()=>{if(activeDialog)closeDialog();});activeDialog.addEventListener('cancel',e=>{e.preventDefault();closeDialog();});activeDialog.addEventListener('click',e=>{if(e.target===activeDialog)closeDialog();});activeDialog.showModal();document.body.classList.add('modal-open');activeDialog.querySelector('[tabindex="-1"],button')?.focus();
}
function closeDialog(restore=true){const old=activeDialog;activeDialog=null;old?.close();dialogRoot.innerHTML='';document.body.classList.remove('modal-open');if(restore&&returnFocus?.isConnected)returnFocus.focus();}
function renderFinder(){if(!activeDialog){openDialog(finder(t,answers,step),'finder-title','finder-dialog');return;}activeDialog.innerHTML=finder(t,answers,step);activeDialog.querySelector('#finder-title')?.focus();}
function startFinder(){step=0;renderFinder();}
function downloadBrief(){if(!hasResult)return;const capacity=estimateCapacity(answers.area,answers.heat);const text=[`KLIMAFINDER — ${t('resultTag')}`,new Date().toISOString().slice(0,10),'',...Object.entries(answers).map(([k,v])=>`${t(({area:'area',budget:'budgetLabel'})[k]||k)}: ${typeof v==='string'?(k==='budget'&&v==='flexible'?t('budgetFlexible'):t(v)):v}`),'',`${t('bestDirection')}: ${t(recommendType(answers))}`,`${t('capacity')}: ${capacity.low}–${capacity.high} kW`,t('assumptions'),t('resultNote'),'',t('ruleChecklist'),...[1,2,3,4].map(n=>'• '+t('rule'+n)),'',t('noLegal'),t('partnerStatus')].join('\n');const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download=`klimafinder-projektbrief-${locale}.txt`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);const toast=document.querySelector('#toast');toast.textContent=t('downloaded');toast.classList.add('visible');setTimeout(()=>toast.classList.remove('visible'),4000);}
function selectCanton(code){if(!cantons.some(c=>c.code===code))return;rulesCanton=code;const oldScroll=window.scrollY;document.querySelector('#main').innerHTML=rules(t,code);window.scrollTo(0,oldScroll);document.querySelector('#rules-canton')?.focus({preventScroll:true});}
document.addEventListener('click',event=>{
 if(event.target.closest('.skip-link')){event.preventDefault();document.querySelector('#main').focus();return;}
 const start=event.target.closest('[data-start]');if(start){event.preventDefault();startFinder();return;}
 if(event.target.closest('[data-close]')){event.preventDefault();closeDialog();return;}
 const menu=event.target.closest('[data-menu]');if(menu){const nav=document.querySelector('.mobile-nav');nav.hidden=!nav.hidden;menu.setAttribute('aria-expanded',String(!nav.hidden));return;}
 const choice=event.target.closest('[data-choice]');if(choice){answers[choice.dataset.choice]=choice.dataset.value;const group=choice.parentElement;group.querySelectorAll('.choice').forEach(button=>{button.classList.toggle('selected',button===choice);button.setAttribute('aria-pressed',String(button===choice));});return;}
 if(event.target.closest('[data-next]')){if(step<4){step++;renderFinder();}else{answers=parseAnswers(answers);hasResult=true;closeDialog(false);const target=`#/${locale}/result`;if(location.hash===target)render();else location.hash=target;}return;}
 if(event.target.closest('[data-back]')){step=Math.max(0,step-1);renderFinder();return;}
 const filter=event.target.closest('[data-filter]');if(filter){const target=`#/${locale}/compare?type=${filter.dataset.filter}`;location.hash=target;return;}
 const offer=event.target.closest('[data-offers]');if(offer){const p=products.find(p=>p.id===offer.dataset.offers);if(p)openDialog(offerDialog(t,p),'offer-title','offers-dialog');return;}
 const canton=event.target.closest('[data-canton]');if(canton){selectCanton(canton.dataset.canton);return;}
 if(event.target.closest('[data-download]'))downloadBrief();
});
document.addEventListener('input',event=>{
 const el=event.target;
 if(activeDialog?.classList.contains('finder-dialog')&&el.name){answers[el.name]=el.type==='range'?Number(el.value):el.value;if(el.name==='area')document.querySelector('#area-output').textContent=el.value;}
 if(el.matches('[data-cost]')){const fields=[...document.querySelectorAll('[data-cost]')];if(fields.some(f=>!f.checkValidity())){document.querySelector('#cost-total').textContent='— CHF';return;}for(const field of fields)answers[field.name]=Number(field.value);const p=products.find(p=>p.type===recommendType(answers));document.querySelector('#cost-total').textContent=`CHF ${energyCost(p.inputKw,answers.hours,answers.days,answers.tariff).toFixed(2)}`;}
});
document.addEventListener('change',event=>{const el=event.target;if(el.id==='language'){const newLocale=el.value;if(locales.includes(newLocale))location.hash=`#/${newLocale}/${route}${location.hash.includes('?')?'?'+location.hash.split('?')[1]:''}`;}if(el.id==='rules-canton')selectCanton(el.value);});
window.addEventListener('hashchange',render);render();
