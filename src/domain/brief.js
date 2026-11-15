import {parseAnswers,decide,estimateCapacity} from './finder.js';
export function createBrief(t,raw){
 const a=parseAnswers(raw),d=decide(a),capacity=estimateCapacity(a.area,a.heat);
 const label=value=>value===null?t('notProvided'):['yes','no','unknown'].includes(value)?t('fact'+value):value;
 const lines=[`KLIMAFINDER — ${t('resultTag')}`,new Date().toISOString().slice(0,10),'',t('status_'+d.status),
  `${t('room')}: ${t(a.room)}`,`${t('area')}: ${a.area} m²`,`${t('priority')}: ${t(a.priority==='unsure'?'unsurePriority':a.priority)}`,
  `${t('noFixed')}: ${t(a.noFixed?'factyes':'factno')}`,'',...['opening','nearOutdoor','exteriorWall','buildingOutdoor'].map(key=>`${t(key)} ${label(a.facts[key])}`),
  '',`${t('bestDirection')}: ${d.primary?t(d.primary):t('status_'+d.status)}`,
  ...(d.alternative?[`${t('alternativeTitle')}: ${t(d.alternative)} (${t(d.classes[d.alternative].status==='pending'?'unresolved':'plausible')})`]:[]),
  `${t('mainCheck')}: ${t(d.check||'orientationHint')}`,
  `${t('capacity')}: ${capacity.low}–${capacity.high} kW`,t('newAssumptions'),t('resultNote'),'',
  `${t('budgetLabel')}: ${t(a.budget==='flexible'?'budgetFlexible':a.budget)}`,`${t('tenure')}: ${t(a.tenure==='unknown'?'notProvided':a.tenure)}`,
  `${t('canton')}: ${a.canton||t('notProvided')}`,`${t('municipality')}: ${a.municipality||t('notProvided')}`,
  '',t('ruleChecklist'),...[1,2,3,4].map(n=>'• '+t('rule'+n)),t('noLegal'),t('partnerStatus')];
 return lines.join('\n');
}
