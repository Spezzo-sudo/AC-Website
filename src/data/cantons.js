// No legal assertions: add evidence and review dates before changing status.
export const cantons = [
 ['AG','Aargau'],['AI','Appenzell Innerrhoden'],['AR','Appenzell Ausserrhoden'],['BE','Bern'],['BL','Basel-Landschaft'],['BS','Basel-Stadt'],['FR','Fribourg / Freiburg'],['GE','Genève'],['GL','Glarus'],['GR','Graubünden / Grigioni'],['JU','Jura'],['LU','Luzern'],['NE','Neuchâtel'],['NW','Nidwalden'],['OW','Obwalden'],['SG','St. Gallen'],['SH','Schaffhausen'],['SO','Solothurn'],['SZ','Schwyz'],['TG','Thurgau'],['TI','Ticino'],['UR','Uri'],['VD','Vaud'],['VS','Valais / Wallis'],['ZG','Zug'],['ZH','Zürich']
].map(([code,name])=>({code,name,status:'unverified',sources:[],reviewedAt:null,municipalities:[]}));
