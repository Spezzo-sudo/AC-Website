import {translator,locales} from './i18n/messages.js';
import {header,footer,previewBanner} from './components/layout.js';
import {finder} from './components/finder.js';
import {home} from './views/home.js';
import {rules} from './views/rules.js';
import {compare,offerDialog} from './views/compare.js';
import {guide,textPage} from './views/pages.js';
import {result} from './views/result.js';
import {freshAnswers,parseAnswers,energyCost,nextRefinement} from './domain/finder.js';
import {createBrief} from './domain/brief.js';
import {products} from './data/products.js';
import {cantons} from './data/cantons.js';
const app=document.querySelector('#app'),dialogRoot=document.querySelector('#dialog-root');
let locale='de',route='',answers=freshAnswers(),draft=null,hasResult=false;
let step=0,precision=null,asked=0,activeDialog=null,returnFocus=null,rulesCanton=null;
let t=translator(locale);
function render(){
 const fragment=location.hash.replace(/^#\/?/,''),[path,query='']=fragment.split('?'),parts=path.split('/');
 locale=locales.includes(parts[0])?parts[0]:'de';route=parts[1]||'';t=translator(locale);
 const params=new URLSearchParams(query);document.querySelector('.skip-link').textContent=t('skip');
 document.documentElement.lang=locale==='de'?'de-CH':locale;
 document.title=`${route?t(({compare:'navCompare',rules:'navRules',guide:'navGuide',result:'resultTag',about:'about',privacy:'privacy',legal:'legal'})[route]||'navFinder')+' — ':''}klimafinder`;
 let view;
 switch(route){
  case 'compare':view=compare(t,params.get('type')||'all',hasResult?answers:null,locale,params.get('scope')||'personal');break;
  case 'rules':view=rules(t,rulesCanton||answers.canton||'AG');break;
  case 'guide':view=guide(t,params.get('article'));break;
  case 'result':view=result(t,hasResult?answers:null,locale);break;
  case 'about':case 'privacy':case 'legal':view=textPage(t,route);break;
  default:view=home(t,locale);
 }
 closeDialog(false);app.innerHTML=`${header(t,locale,route)}<main id="main" tabindex="-1">${view}</main>${footer(t,locale)}${previewBanner(t)}`;
 window.scrollTo({top:0,behavior:'instant'});document.querySelector('h1')?.focus({preventScroll:true});
}
function openDialog(markup,label,cls=''){
 returnFocus=document.activeElement;
 dialogRoot.innerHTML=`<dialog class="dialog ${cls}" aria-labelledby="${label}">${markup}</dialog>`;
 const instance=dialogRoot.querySelector('dialog');activeDialog=instance;
 instance.addEventListener('close',()=>{if(activeDialog===instance)closeDialog();});
 instance.addEventListener('cancel',e=>{e.preventDefault();closeDialog();});
 instance.addEventListener('click',e=>{if(e.target===instance)closeDialog();});
 instance.showModal();document.body.classList.add('modal-open');
 instance.querySelector(`#${label}`)?.focus();
}
function closeDialog(restore=true){
 const old=activeDialog;activeDialog=null;draft=null;old?.close();dialogRoot.innerHTML='';
 document.body.classList.remove('modal-open');if(restore&&returnFocus?.isConnected)returnFocus.focus();
}
function renderFinder(error=false){
 const markup=finder(t,draft,step,{precision,asked,error});
 if(!activeDialog){openDialog(markup,'finder-title','finder-dialog');return;}
 activeDialog.innerHTML=markup;activeDialog.querySelector('#finder-title')?.focus();
}
function startFinder(at=0){draft=parseAnswers(answers);step=at;asked=0;precision=null;renderFinder();}
function finishFinder(){
 try{
  const candidate=parseAnswers(draft);
  if(!candidate.room){step=0;precision=null;renderFinder();return;}
  if(!candidate.priority){step=2;precision=null;renderFinder();return;}
  // Render once before committing so errors preserve the draft and the previous valid result.
  result(t,candidate,locale);answers=candidate;hasResult=true;closeDialog(false);
  const target=`#/${locale}/result`;if(location.hash===target)render();else location.hash=target;
 }catch(error){console.error('Finder result could not be created',error);renderFinder(true);}
}
function considerRefinement(){
 const next=asked<2?nextRefinement(draft):null;
 if(next){precision=next;asked++;renderFinder();}else finishFinder();
}
function downloadBrief(){
 if(!hasResult)return;
 const url=URL.createObjectURL(new Blob([createBrief(t,answers)],{type:'text/plain;charset=utf-8'}));
 const link=document.createElement('a');link.href=url;link.download=`klimafinder-projektbrief-${locale}.txt`;link.click();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
 const toast=document.querySelector('#toast');toast.textContent=t('downloaded');toast.classList.add('visible');
 setTimeout(()=>toast.classList.remove('visible'),4000);
}
function selectCanton(code){
 if(!cantons.some(c=>c.code===code))return;
 rulesCanton=code;const scroll=window.scrollY;document.querySelector('#main').innerHTML=rules(t,code);
 window.scrollTo(0,scroll);document.querySelector('#rules-canton')?.focus({preventScroll:true});
}
document.addEventListener('click',event=>{
 if(event.target.closest('.skip-link')){event.preventDefault();document.querySelector('#main').focus();return;}
 const edit=event.target.closest('[data-edit-step]');if(edit){startFinder(Number(edit.dataset.editStep));return;}
 if(event.target.closest('[data-start]')){event.preventDefault();startFinder();return;}
 if(event.target.closest('[data-close]')){event.preventDefault();closeDialog();return;}
 const menu=event.target.closest('[data-menu]');if(menu){const nav=document.querySelector('.mobile-nav');nav.hidden=!nav.hidden;menu.setAttribute('aria-expanded',String(!nav.hidden));return;}
 const choice=event.target.closest('[data-choice]');
 if(choice&&draft){
  draft[choice.dataset.choice]=choice.dataset.value;
  choice.parentElement.querySelectorAll('.choice').forEach(button=>{button.classList.toggle('selected',button===choice);button.setAttribute('aria-pressed',String(button===choice));});
  activeDialog.querySelector('[data-next]').disabled=false;return;
 }
 if(event.target.closest('[data-finish]')&&draft){finishFinder();return;}
 const refinement=event.target.closest('[data-precision]');
 if(refinement&&draft&&precision){draft.facts={...draft.facts,[precision]:refinement.dataset.precision};considerRefinement();return;}
 if(event.target.closest('[data-next]')&&draft){
  if(step===0&&!draft.room||step===2&&!draft.priority)return;
  if(step<3){step++;renderFinder();}else considerRefinement();return;
 }
 if(event.target.closest('[data-back]')&&draft){if(precision)precision=null;else step=Math.max(0,step-1);renderFinder();return;}
 const filter=event.target.closest('[data-filter]');
 if(filter){location.hash=`#/${locale}/compare?type=${filter.dataset.filter}&scope=${filter.dataset.scope}`;return;}
 const offer=event.target.closest('[data-offers]');
 if(offer){const product=products.find(p=>p.id===offer.dataset.offers);if(product)openDialog(offerDialog(t,product),'offer-title','offers-dialog');return;}
 const canton=event.target.closest('[data-canton]');if(canton){selectCanton(canton.dataset.canton);return;}
 if(event.target.closest('[data-download]'))downloadBrief();
});
document.addEventListener('input',event=>{
 const el=event.target;
 if(draft&&activeDialog?.classList.contains('finder-dialog')&&el.name){
  if(el.name.startsWith('fact-')){
   const key=el.name.slice(5);draft.facts={...draft.facts,[key]:el.value};
   el.closest('.fact-answers').querySelectorAll('.fact-option').forEach(label=>label.classList.toggle('selected',label.querySelector('input').checked));
  }else if(['sunny','roof'].includes(el.name)){
   const sun=activeDialog.querySelector('[name="sunny"]').checked,roof=activeDialog.querySelector('[name="roof"]').checked;
   draft.heat=sun&&roof?'roofSunny':sun?'sunny':roof?'roof':'normal';
  }else{draft[el.name]=el.type==='checkbox'?el.checked:el.type==='range'?Number(el.value):el.value;}
  if(el.name==='area')document.querySelector('#area-output').textContent=el.value;
 }
 if(el.matches('[data-cost]')){
  const fields=[...document.querySelectorAll('[data-cost]')];
  if(fields.some(field=>!field.checkValidity())){document.querySelector('#cost-total').textContent='— CHF';return;}
  for(const field of fields)answers[field.name]=Number(field.value);
  document.querySelector('#cost-total').textContent=`CHF ${energyCost(answers.inputKw,answers.hours,answers.days,answers.tariff).toFixed(2)}`;
 }
 if(el.matches('[data-context]'))answers[el.name]=el.value;
});
document.addEventListener('change',event=>{
 const el=event.target;
 if(el.id==='language'&&locales.includes(el.value))location.hash=`#/${el.value}/${route}${location.hash.includes('?')?'?'+location.hash.split('?')[1]:''}`;
 if(el.id==='rules-canton')selectCanton(el.value);
});
window.addEventListener('hashchange',render);render();
