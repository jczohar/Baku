/* מפת העיר האינטראקטיבית (Leaflet + OpenStreetMap). המפה דורשת חיבור לאינטרנט להצגת המפה עצמה */
var CM=null, GEOQ=[], GEOBUSY=false;
var ART_EMO={walls:'🏰',tower:'🗼',palace:'🏯',sea:'🌊',venice:'🛶',wheel:'🎡',flag:'🚩',fountain:'⛲',street:'🛍️',flames:'🔥',park:'🌳',funicular:'🚡',wave:'🏛️',mosque:'🕌',carpet:'🧶',fire:'🔥',rock:'🗿',mud:'🌋'};
function geoCache(){return store.get('geo',{});}
function viewCityMap(){
  state.lyr=state.lyr||{s:true,h:true};
  var h='<div class="chips"><button class="chip'+(state.lyr.s?' on':'')+'" data-lyr="s">📸 אתרים</button><button class="chip'+(state.lyr.h?' on':'')+'" data-lyr="h">🏨 מלונות</button><button class="chip" data-locate="1">📍 המיקום שלי</button></div>';
  h+='<div id="cmap" class="cmap"><div class="mapmsg">טוען מפה…</div></div>';
  h+='<div class="mute small" style="margin-top:8px">מפת OpenStreetMap, צריכה אינטרנט. המיקומים משוערים ועלולים להיות סטייה קטנה, לכן בדקו בגוגל מפות או בוויז לפני יציאה. לחיצה על סמן מציגה פרטים. מפת המטרו (גם בלי אינטרנט) נמצאת ב”תחבורה ומחירים“.</div>';
  h+='<div id="mapList" class="card" style="margin-top:10px"></div>';
  return h;
}
function pinIcon(emo,col){return L.divIcon({className:'pinwrap',html:'<div class="pin" style="background:'+col+'">'+emo+'</div>',iconSize:[34,34],iconAnchor:[17,30],popupAnchor:[0,-26]});}
function initCityMap(){
  var el=$('#cmap'); if(!el)return;
  if(CM){try{CM.remove();}catch(e){}CM=null;}
  var items=[];
  if(state.lyr.s)C.sights.forEach(function(x){items.push({k:'s',id:x.id,n:x.he,en:x.en,ll:x.ll,q:x.q||x.en+' Baku',emo:ART_EMO[x.art]||'📍',col:'#E8590C'});});
  if(state.lyr.h)HOTELS.forEach(function(x){items.push({k:'h',id:x.id,n:x.n,en:'',ll:null,q:x.n+', Baku, Azerbaijan',emo:'🏨',col:'#6F2DBD'});});
  var cache=geoCache();
  items.forEach(function(it){if(!it.ll&&cache[it.k+it.id])it.ll=cache[it.k+it.id];});
  var list=$('#mapList');
  if(list)list.innerHTML='<b>רשימה</b><div class="small">'+items.map(function(it){return '<a target="_blank" rel="noopener" href="https://www.google.com/maps/search/'+encodeURIComponent(it.q)+'">'+it.emo+' '+esc(it.n)+'</a>';}).join(' · ')+'</div>';
  if(typeof L==='undefined'){el.innerHTML='<div class="mapmsg">המפה לא נטענה. אפשר לפתוח כל מקום בגוגל מפות מהרשימה למטה.</div>';return;}
  el.innerHTML='';
  CM=L.map(el,{zoomControl:true,attributionControl:true}).setView([40.3755,49.852],13);
  var tl=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap'}).addTo(CM);
  var fails=0;tl.on('tileerror',function(){if(++fails===3&&$('#cmap'))toast('אין חיבור למפה כרגע. אפשר להשתמש ברשימה שמתחת.');});
  var markers={};
  function add(it){
    if(!it.ll||!CM||markers[it.k+it.id])return;
    var m=L.marker(it.ll,{icon:pinIcon(it.emo,it.col),title:it.n}).addTo(CM);
    m.bindPopup('<div class="pop"><b>'+esc(it.n)+'</b>'+(it.en?'<div class="ltr small">'+esc(it.en)+'</div>':'')+(it.k==='s'?'<button class="btn sm" data-sight="'+it.id+'">פרטים</button> ':'')+'<a class="btn sm sec" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination='+it.ll[0]+','+it.ll[1]+'">ניווט</a></div>');
    markers[it.k+it.id]=m;
    if(state.focus&&state.focus.k===it.k&&state.focus.id===it.id){CM.setView(it.ll,16);m.openPopup();state.focus=null;}
  }
  items.forEach(add);
  /* חיפוש מיקום באופן עצל לשאר המקומות */
  items.filter(function(it){return !it.ll;}).forEach(function(it){GEOQ.push({it:it,add:add,map:CM});});
  runGeo();
  if(state.focus){var f=state.focus;var it=items.filter(function(x){return x.k===f.k&&x.id===f.id;})[0];if(it&&!it.ll)toast('מחפש את המיקום…');}
}
function runGeo(){
  if(GEOBUSY||!GEOQ.length||navigator.onLine===false)return;
  var job=GEOQ.shift();
  if(job.map!==CM){runGeo();return;}
  GEOBUSY=true;
  fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&viewbox=49.6,40.6,50.2,40.2&bounded=1&q='+encodeURIComponent(job.it.q),{headers:{'Accept-Language':'en'}}).then(function(r){return r.json();}).then(function(j){
    if(j&&j[0]){var ll=[+j[0].lat,+j[0].lon];job.it.ll=ll;var c=geoCache();c[job.it.k+job.it.id]=ll;store.set('geo',c);job.add(job.it);}
  }).catch(function(){}).then(function(){setTimeout(function(){GEOBUSY=false;runGeo();},1100);});
}
function locateMe(){
  if(!navigator.geolocation||!CM){toast('המיקום אינו זמין במכשיר או שהמפה לא נטענה.');return;}
  navigator.geolocation.getCurrentPosition(function(p){var ll=[p.coords.latitude,p.coords.longitude];L.circleMarker(ll,{radius:9,color:'#fff',weight:3,fillColor:'#1E88E5',fillOpacity:1}).addTo(CM);CM.setView(ll,15);},function(){toast('לא התקבל אישור למיקום.');},{timeout:8000});
}
