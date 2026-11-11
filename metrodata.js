/* מפת המטרו. כל תחנה: x, y, צד התווית. המפה סכמטית ולא בקנה מידה */
var MP = {
  icher:[100,770,'b'], sahil:[170,725,'t'], '28may':[260,668,'l'], ganjlik:[360,628,'t'], narimanov:[470,600,'b'],
  bakmil:[560,520,'t'], ulduz:[560,600,'b'], koroglu:[640,600,'t'], garagarayev:[720,600,'b'], neftchilar:[800,600,'t'],
  khalglar:[880,600,'b'], ahmedli:[960,600,'t'], hazi:[1040,600,'b'],
  nizami:[240,560,'l'], elmlar:[200,490,'l'], inshaatchilar:[160,420,'l'], '20yanvar':[140,350,'l'], memar:[120,280,'t'],
  nasimi:[110,210,'l'], azadliq:[110,140,'l'], darnagul:[110,70,'l'],
  jafar:[300,735,'b'], khatai:[390,775,'r'],
  avtovagzal:[230,300,'b'], '8noyabr':[340,280,'t'], khojasan:[450,250,'r']
};
var OX = 80, MAPW = 1180, MAPH = 860;
var AIRP = [700, 440];
function mapLineSel(){return (state.filter==='red'||state.filter==='green'||state.filter==='purple')?state.filter:'all';}
function hotelsAt(id){return HOTELS.filter(function(h){return h.st===id;});}
function sightsAt(id){return SIGHTS.filter(function(x){return x.st===id;});}
var MV = {s:1.15,x:0,y:0,init:false};
function P(id){var m=MP[id];return [m[0]+OX,m[1]];}
function pathOf(ids){return ids.map(function(id,i){var p=P(id);return (i?'L':'M')+p[0]+' '+p[1];}).join(' ');}
function linePath(ids,color,L,extra){
  var op=(mapLineSel()==='all'||mapLineSel()===L)?1:0.18;
  return '<path d="'+pathOf(ids)+'" fill="none" stroke="'+color+'" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" opacity="'+op+'"'+(extra||'')+'/>';
}
function mapSvg(){
  var sel=mapLineSel(), s='<svg id="mapSvg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="מפת המטרו"><g id="mapG">';
  s+=linePath(RED,LINES.red.c,'red');
  s+=linePath(['narimanov','bakmil'],LINES.red.c,'red');
  s+=linePath(GREEN,LINES.green.c,'green');
  s+=linePath(SHUTTLE,LINES.green.c,'green');
  s+=linePath(PURPLE,LINES.purple.c,'purple');
  var n=P('nizami'), m=P('28may'), j=P('jafar');
  if(state.done){
    s+='<path d="M'+n[0]+' '+n[1]+' L'+j[0]+' '+j[1]+'" fill="none" stroke="'+LINES.green.c+'" stroke-width="7" stroke-linecap="round" opacity="'+((sel==='all'||sel==='green')?1:0.18)+'"/>';
  } else {
    s+='<path d="M'+n[0]+' '+n[1]+' L'+m[0]+' '+m[1]+'" fill="none" stroke="#E08A00" stroke-width="6" stroke-dasharray="3 10" stroke-linecap="round"/>';
    s+='<g><rect x="'+(n[0]-4)+'" y="'+((n[1]+m[1])/2-13)+'" width="92" height="26" rx="8" fill="#FFF4E0" stroke="#E08A00"/><text x="'+(n[0]+42)+'" y="'+((n[1]+m[1])/2+5)+'" font-size="12" text-anchor="middle" fill="#7A4300">🚌 אקספרס M1–M3</text></g>';
  }
  s+='<path d="M'+m[0]+' '+m[1]+' L'+j[0]+' '+j[1]+'" fill="none" stroke="#7B8794" stroke-width="4" stroke-dasharray="2 6" stroke-linecap="round"/>';
  /* שדה התעופה */
  var ax=AIRP[0]+OX, ay=AIRP[1], k=P('koroglu');
  s+='<path d="M'+ax+' '+ay+' L'+k[0]+' '+k[1]+'" fill="none" stroke="#7B8794" stroke-width="3" stroke-dasharray="8 6"/>';
  s+='<path d="M'+ax+' '+ay+' L'+(300+OX)+' 520 L'+m[0]+' '+m[1]+'" fill="none" stroke="#7B8794" stroke-width="3" stroke-dasharray="8 6"/>';
  s+='<g><rect x="'+(ax-58)+'" y="'+(ay-16)+'" width="116" height="32" rx="10" fill="var(--card)" stroke="#7B8794"/><text x="'+ax+'" y="'+(ay+5)+'" font-size="13" text-anchor="middle" style="fill:var(--ink)">✈️ שדה התעופה</text></g>';
  s+='<text x="'+(ax-110)+'" y="'+(ay+95)+'" font-size="12" text-anchor="middle" style="fill:var(--mute)">אוטובוס H1</text>';
  /* תחנות */
  STATIONS.forEach(function(st){
    var p=P(st.id), side=MP[st.id][2], w=st.he.length*6.6, tx=p[0], ty=p[1], inter=st.lines.length>1||st.id==='jafar';
    if(side==='r'){tx=p[0]+16+w/2;ty=p[1]+5;}
    else if(side==='l'){tx=p[0]-16-w/2;ty=p[1]+5;}
    else if(side==='b'){ty=p[1]+28;}
    else {ty=p[1]-18;}
    var on=(sel==='all'||st.lines.indexOf(sel)>=0), col=LINES[st.lines[0]].c;
    s+='<g class="sn" data-st="'+st.id+'" opacity="'+(on?1:0.25)+'"><circle cx="'+p[0]+'" cy="'+p[1]+'" r="22" fill="transparent"/>'+
      '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+(inter?11:8)+'" style="fill:var(--card);stroke:'+(inter?'var(--ink)':col)+'" stroke-width="'+(inter?4:4)+'"/>'+
      '<text class="nm" x="'+tx+'" y="'+ty+'">'+esc(st.he)+'</text>';
    if(state.lh && hotelsAt(st.id).length) s+='<text class="mk" x="'+(p[0]+17)+'" y="'+(p[1]-12)+'">🏨</text>';
    if(state.ls && sightsAt(st.id).length) s+='<text class="mk" x="'+(p[0]-17)+'" y="'+(p[1]-12)+'">📸</text>';
    s+='</g>';
  });
  return s+'</g></svg>';
}
function applyMv(){var g=$('#mapG');if(g)g.setAttribute('transform','translate('+MV.x+','+MV.y+') scale('+MV.s+')');}
function initMap(){
  var w=$('#mapWrap'); if(!w) return;
  var W=w.clientWidth||360,H=w.clientHeight||480;
  if(!MV.init){MV.s=1.15;MV.x=W/2-(260+OX)*MV.s;MV.y=H/2-650*MV.s;MV.init=true;}
  applyMv();
}
function fitMap(){
  var w=$('#mapWrap'); if(!w) return;
  var W=w.clientWidth||360,H=w.clientHeight||480, s=Math.min(W/MAPW,H/MAPH);
  MV.s=s;MV.x=(W-MAPW*s)/2;MV.y=(H-MAPH*s)/2;applyMv();
}
function zoomAt(cx,cy,k){
  var w=$('#mapWrap'); if(!w) return;
  var r=w.getBoundingClientRect(), px=cx-r.left, py=cy-r.top, ns=Math.max(0.3,Math.min(3.5,MV.s*k)), f=ns/MV.s;
  MV.x=px-(px-MV.x)*f;MV.y=py-(py-MV.y)*f;MV.s=ns;applyMv();
}
function viewStations(){
  var h='<div class="chips" id="fchips">'+
    ['all|הכל','red|אדום','green|ירוק','purple|סגול','fav|⭐ שלי'].map(function(x){var p=x.split('|');return '<button class="chip'+(state.filter===p[0]?' on':'')+'" data-f="'+p[0]+'">'+p[1]+'</button>';}).join('')+'</div>';
  h+='<div class="chips"><button class="chip'+(state.view==='map'?' on':'')+'" data-v="map">🗺️ מפה</button><button class="chip'+(state.view==='list'?' on':'')+'" data-v="list">📋 רשימה</button>'+
    (state.view==='map'?'<button class="chip'+(state.lh?' on':'')+'" data-lay="lh">🏨 מלונות</button><button class="chip'+(state.ls?' on':'')+'" data-lay="ls">📸 אתרים</button>':'')+'</div>';
  if(state.view==='map'){
    h+=bannerWorks();
    h+='<div id="mapWrap">'+mapSvg()+'<div class="mapctl"><button data-mz="in" aria-label="הגדלה">+</button><button data-mz="out" aria-label="הקטנה">−</button><button data-mz="fit" aria-label="כל המפה">⤢</button></div></div>';
    h+='<div class="legend"><span><i style="border-color:'+LINES.red.c+'"></i>אדום</span><span><i style="border-color:'+LINES.green.c+'"></i>ירוק</span><span><i style="border-color:'+LINES.purple.c+'"></i>סגול</span>'+
      '<span><i style="border-color:#E08A00;border-top-style:dotted"></i>מקטע ללא רכבת (אוטובוס)</span><span><i style="border-color:#7B8794;border-top-style:dotted"></i>מעבר רגלי / H1</span></div>'+
      '<div class="mute small">לחצו על תחנה לפרטים. גוררים כדי לזוז, וצובטים או לוחצים על + ו‑ − כדי להגדיל. עיגול עבה הוא תחנת החלפה. המפה סכמטית ואינה בקנה מידה.</div>';
  } else {
    var q=state.q.trim().toLowerCase();
    h+='<input type="search" id="q" placeholder="חיפוש תחנה בעברית או באנגלית" value="'+esc(state.q)+'">';
    var list=STATIONS.filter(function(s){
      if(state.filter==='fav'&&!isFav(s.id))return false;
      if(state.filter!=='all'&&state.filter!=='fav'&&s.lines.indexOf(state.filter)<0)return false;
      if(q&&(s.he+' '+s.az+' '+s.id).toLowerCase().indexOf(q)<0)return false;
      return true;
    });
    h+='<div style="margin-top:10px">'+(list.length?list.map(stationRow).join(''):'<div class="mute">לא נמצאו תחנות.</div>')+'</div>';
  }
  h+='<div class="foot">27 תחנות לפי הספירה הרשמית. מעמר אג׳אמי נספרת פעמיים כי היא שייכת לשני קווים, ולכן כאן מוצגות 26 תחנות שונות. סדר התחנות בקו הסגול משוער.</div>';
  return h;
}
