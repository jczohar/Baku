/* ===== גרסה 2: התאמה אישית, גוגל מפות, מזג אוויר, "אני אבוד", תמונות מוויקיפדיה ===== */
var viewCityMapOld = viewCityMap;
state.mine = store.get('mine', {});
state.onlyK = {};
state.myh = store.get('myh', null);
state.cm = {q:'Baku, Azerbaijan', label:'באקו', mode:'g'};

/* ביטויים עם הגייה (לטינית) */
C.langExt = [
  ['Salam','שלום','sa-LAM'],
  ['Bəli / Xeyr','כן / לא','ba-LI / kheyr'],
  ['Təşəkkür edirəm','תודה','ta-sha-KUR e-di-RAM'],
  ['Bağışlayın','סליחה','ba-ghish-la-YIN'],
  ['Neçəyədir?','כמה זה עולה?','ne-cha-ya-DIR'],
  ['Haradadır …?','איפה נמצא …?','ha-ra-da-DIR'],
  ['Su','מים','su'],
  ['Hesab, zəhmət olmasa','חשבון בבקשה','he-SAB, zah-MAT ol-ma-SA'],
  ['Zəhmət olmasa','בבקשה','zah-MAT ol-ma-SA'],
  ['Məni bura aparın','קחו אותי לכאן','ma-NI bu-RA a-pa-RIN'],
  ['Metro haradadır?','איפה המטרו?','met-RO ha-ra-da-DIR'],
  ['Kömək edin','תעזרו לי','ko-MAK e-DIN'],
  ['İngiliscə danışırsınız?','אתם מדברים אנגלית?','in-gi-lis-JA da-nish-ir-si-NIZ'],
  ['Çox sağ olun','תודה רבה','chokh sa-GH o-LUN'],
  ['Sağol','ביי / תודה','sa-GHOL']
];

/* ---- סימון מה מעניין ---- */
function mkey(k,id){return k+':'+id;}
function mval(k,id){return state.mine[mkey(k,id)]||0;}
function setMine(k,id,v){var key=mkey(k,id);if(v)state.mine[key]=v;else delete state.mine[key];store.set('mine',state.mine);}
function vis(k,id){var v=mval(k,id),m=state.onlyK[k]||'all';return m==='mine'?v===1:m==='hidden'?v===-1:v!==-1;}
function countK(k,ids){var s=0,h=0;ids.forEach(function(i){var v=mval(k,i);if(v===1)s++;if(v===-1)h++;});return {s:s,h:h};}
function fltBar(k,ids){
  var c=countK(k,ids),m=state.onlyK[k]||'all';
  return '<div class="chips"><button class="chip'+(m==='all'?' on':'')+'" data-only="'+k+'|all">הכל</button><button class="chip'+(m==='mine'?' on':'')+'" data-only="'+k+'|mine">⭐ מעניינים אותי ('+c.s+')</button>'+(c.h?'<button class="chip'+(m==='hidden'?' on':'')+'" data-only="'+k+'|hidden">🚫 הוסתרו ('+c.h+')</button>':'')+'</div>'+
   '<div class="mute small">סמנו ⭐ מה שמעניין. ”לא מעניין“ מעלים את המקום מהרשימה, ואפשר להחזיר אותו בכל רגע.</div>';
}
function markBar(k,id){
  var v=mval(k,id);
  return '<div class="mbar">'+(v===-1?'<button class="mb" data-mark="'+k+'|'+id+'|0">↩ החזר לרשימה</button>':'<button class="mb'+(v===1?' on':'')+'" data-mark="'+k+'|'+id+'|'+(v===1?0:1)+'">'+(v===1?'⭐ מעניין אותי':'☆ מעניין אותי')+'</button><button class="mb no" data-mark="'+k+'|'+id+'|-1">🚫 לא מעניין</button>')+'</div>';
}
function emptyMsg(k){var m=state.onlyK[k]||'all';return '<div class="card mute">'+(m==='mine'?'עוד לא סימנתם כלום. חזרו ל”הכל“ וסמנו ⭐ ליד מה שמעניין.':m==='hidden'?'לא הסתרתם כלום.':'אין מה להציג. ייתכן שהסתרתם הכול.')+'</div>';}
function rerender(){var y=window.scrollY;render();window.scrollTo(0,y);}
function poolSights(){
  var all=C.sights.filter(function(x){return mval('s',x.id)!==-1;});
  var mine=all.filter(function(x){return mval('s',x.id)===1;});
  return mine.length>=2?mine:all;
}

/* ---- קישורי גוגל מפות ---- */
function gq(x){return x.ll?(x.ll[0]+','+x.ll[1]):((x.q||x.en||x.n)+' Baku');}
function gDir(q,mode){return 'https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(q)+'&travelmode='+(mode||'transit');}
function gSearch(q){return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q);}
function navBtns(q,name){
  return '<a class="btn sm" target="_blank" rel="noopener" href="'+gDir(q,'transit')+'">🧭 נווט (תחבורה ציבורית)</a><a class="btn sm sec" target="_blank" rel="noopener" href="'+gDir(q,'walking')+'">🚶 ברגל</a><a class="btn sm sec" target="_blank" rel="noopener" href="'+gSearch(q)+'">🗺️ בגוגל מפות</a>'+(name?'<button class="btn sm sec" data-drv="'+esc(name)+'">🚕 הראה לנהג</button>':'');
}

/* ---- תמונות ומידע מוויקיפדיה (נטען במכשיר של המשתמש) ---- */
var WKQ=[],WKBUSY=false;
function wikiGet(q,cb){
  var c=store.get('wk',{});
  if(c[q]!==undefined){cb(c[q]||null);return;}
  if(navigator.onLine===false){cb(null);return;}
  var u='https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch='+encodeURIComponent(q)+'&gsrlimit=1&prop=pageimages%7Cextracts&piprop=thumbnail&pithumbsize=720&exintro=1&explaintext=1&exchars=700&format=json&origin=*';
  fetch(u).then(function(r){return r.json();}).then(function(j){
    var pg=j&&j.query&&j.query.pages?j.query.pages[Object.keys(j.query.pages)[0]]:null,res=null;
    if(pg){var words=q.toLowerCase().replace(/[^a-z ]/g,' ').split(/\s+/).filter(function(w){return w.length>=4&&w!=='baku';});
      var ok=!words.length||words.some(function(w){return pg.title.toLowerCase().indexOf(w)>=0;});
      if(ok)res={t:pg.title,img:pg.thumbnail&&pg.thumbnail.source||'',ex:pg.extract||''};}
    var cc=store.get('wk',{});cc[q]=res||0;store.set('wk',cc);cb(res);
  }).catch(function(){cb(null);});
}
function hydrate(){
  Array.prototype.forEach.call(document.querySelectorAll('[data-wq]:not([data-wd])'),function(el){el.setAttribute('data-wd','1');WKQ.push(el);});
  if(!WKBUSY)nextWk();
}
function nextWk(){
  var el=WKQ.shift();if(!el){WKBUSY=false;return;}WKBUSY=true;
  if(!document.body.contains(el)){nextWk();return;}
  wikiGet(el.getAttribute('data-wq'),function(r){
    if(r&&document.body.contains(el)){
      if(r.img&&!el.querySelector('img.ph')){var im=document.createElement('img');im.className='ph';im.alt='';im.loading='lazy';im.src=r.img;im.onerror=function(){im.remove();};el.appendChild(im);el.classList.add('hasimg');}
      var tgt=el.getAttribute('data-wx');if(tgt&&r.ex){var t=document.getElementById(tgt);if(t){t.innerHTML='<b>📖 מוויקיפדיה (באנגלית)</b><div class="ltr small">'+esc(r.ex)+'</div><div class="mute small">תמונה ומידע: Wikipedia / Wikimedia Commons. ייתכנו אי דיוקים, והאתר הרשמי קובע.</div>';t.style.display='block';}}
    }
    setTimeout(nextWk,120);
  });
}

/* ---- מזג אוויר (Open-Meteo, נטען מהמכשיר) ---- */
var WX={0:['☀️','בהיר'],1:['🌤️','בהיר ברובו'],2:['⛅','מעונן חלקית'],3:['☁️','מעונן'],45:['🌫️','ערפל'],48:['🌫️','ערפל'],51:['🌦️','טפטוף'],53:['🌦️','טפטוף'],55:['🌦️','טפטוף'],61:['🌧️','גשם'],63:['🌧️','גשם'],65:['🌧️','גשם חזק'],71:['❄️','שלג'],73:['❄️','שלג'],75:['❄️','שלג'],80:['🌦️','ממטרים'],81:['🌦️','ממטרים'],82:['⛈️','ממטרים חזקים'],95:['⛈️','סערה'],96:['⛈️','סערה'],99:['⛈️','סערה']};
function wxGet(cb){
  var c=store.get('wx',null);
  if(c&&Date.now()-c.t<90*60*1000){cb(c.d,c.cur,c.t,false);return;}
  fetch('https://api.open-meteo.com/v1/forecast?latitude=40.37&longitude=49.85&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=Asia%2FBaku&forecast_days=5').then(function(r){return r.json();}).then(function(j){
    store.set('wx',{t:Date.now(),d:j.daily,cur:j.current});cb(j.daily,j.current,Date.now(),false);
  }).catch(function(){if(c)cb(c.d,c.cur,c.t,true);else cb(null,null,null,true);});
}
function wxHtml(d,cur,t,old){
  if(!d)return '<div class="mute small">אין חיבור כרגע ולא נשמרה תחזית. נסו שוב כשיש רשת.</div>';
  var h='';
  if(cur){
    var cw=WX[cur.weather_code]||['🌡️',''];
    h+='<div class="wxnow"><div class="wxi big">'+cw[0]+'</div><div><div class="small mute">עכשיו</div><b class="wxtemp">'+Math.round(cur.temperature_2m)+'°</b><div class="small">'+esc(cw[1])+(cur.wind_speed_10m?' · 💨 '+Math.round(cur.wind_speed_10m)+' קמ״ש':'')+(cur.relative_humidity_2m?' · 💧 '+cur.relative_humidity_2m+'%':'')+'</div></div></div>';
  }
  h+='<div class="wxrow">';
  d.time.forEach(function(day,i){
    var w=WX[d.weather_code[i]]||['🌡️',''],dt=new Date(day+'T12:00:00');
    h+='<div class="wxd"><div class="small">'+(i===0?'היום':'יום '+DAYN[dt.getDay()])+'</div><div class="wxi">'+w[0]+'</div><b>'+Math.round(d.temperature_2m_max[i])+'°</b><div class="mute small">'+Math.round(d.temperature_2m_min[i])+'°</div><div class="small">'+esc(w[1])+'</div>'+(d.precipitation_sum[i]>=1?'<div class="small">☔ '+Math.round(d.precipitation_sum[i])+' מ״מ</div>':'')+(d.precipitation_probability_max&&d.precipitation_probability_max[i]>=40?'<div class="small mute">סיכוי גשם '+d.precipitation_probability_max[i]+'%</div>':'')+'</div>';
  });
  h+='</div>';
  var mx=d.temperature_2m_max[0],tips=[];
  tips.push(mx<10?'קר: מעיל חם':mx<18?'מעיל קל ושכבות':mx<27?'נעים: בגדים קלים וחולצה ארוכה לערב':'חם: בגדים קלים, כובע ומים');
  if(d.precipitation_sum.slice(0,2).some(function(p){return p>=1;}))tips.push('קחו מטרייה');
  h+='<div class="small" style="margin-top:6px">👕 היום: '+tips.join(' · ')+'</div>';
  if(old)h+='<div class="mute small">התחזית נשמרה ב‑'+dmy(new Date(t))+', ואין חיבור לעדכון.</div>';
  return h;
}
window._lastWx={d:null,cur:null};
function loadWeather(){var el=$('#wxbox');if(!el)return;wxGet(function(d,cur,t,old){window._lastWx={d:d,cur:cur};var e=$('#wxbox');if(e)e.innerHTML=wxHtml(d,cur,t,old);});}

/* ---- המלון שלי, נהג, אני אבוד ---- */
function myHotelName(){return state.myh&&state.myh.n;}
function openMyHotel(){
  var cur=state.myh||{};
  openSheet('<h3>🏨 המלון שלי</h3><div class="small mute">בחרו את המלון כדי לקבל ניווט חזרה בלחיצה אחת, וכרטיס להראות לנהג.</div>'+
   '<label>בחירה מהרשימה</label><select id="myhSel"><option value="">בחרו…</option>'+HOTELS.map(function(h){return '<option value="'+h.id+'"'+(cur.id===h.id?' selected':'')+'>'+esc(h.n)+'</option>';}).join('')+'</select>'+
   '<label>או הקלידו שם המלון באנגלית</label><input type="text" id="myhTxt" placeholder="Hotel name" value="'+esc(cur.id?'':cur.n||'')+'" dir="ltr" style="width:100%;padding:10px;border-radius:10px;border:1px solid var(--line);background:var(--card);color:var(--ink);font-size:16px">'+
   '<div class="row" style="margin-top:12px"><button class="btn" data-myhsave="1">שמירה</button><button class="btn sec" id="closeSheet">סגירה</button></div>');
}
function showDriver(name){
  var q=name||myHotelName();
  if(!q){openMyHotel();return;}
  openSheet('<h3>🚕 להראות לנהג</h3><div class="drv"><div class="az ltr big">Zəhmət olmasa, məni bura aparın:</div><div class="dn2 ltr">'+esc(q)+', Bakı</div><div class="az ltr">Qiyməti əvvəlcədən deyin, zəhmət olmasa.</div></div>'+
   '<div class="small mute">בעברית: ”בבקשה, קחו אותי לכאן“ ו”בבקשה אמרו את המחיר מראש“. מומלץ להזמין באפליקציית Bolt או Yango, שם המחיר ידוע מראש.</div>'+
   '<div class="row wrap" style="margin-top:10px"><a class="btn sm" target="_blank" rel="noopener" href="'+gSearch(q+' Baku')+'">🗺️ הצגה בגוגל מפות</a><button class="btn sm sec" id="closeSheet">סגירה</button></div>');
}
function openSOS(){
  var near=function(q,ic,t){return '<a class="sosb" target="_blank" rel="noopener" href="'+gSearch(q)+'"><span>'+ic+'</span>'+t+'</a>';};
  var hq=myHotelName();
  openSheet('<h3>🆘 אני אבוד או צריך עזרה</h3><div class="small mute">הכפתורים פותחים את גוגל מפות לפי המיקום הנוכחי שלכם.</div>'+
   '<div class="sosg">'+(hq?'<a class="sosb main" target="_blank" rel="noopener" href="'+gDir(hq+' Baku','transit')+'"><span>🏨</span>חזרה למלון</a><a class="sosb main" target="_blank" rel="noopener" href="'+gDir(hq+' Baku','walking')+'"><span>🚶</span>למלון ברגל</a><button class="sosb main" data-drv="'+esc(hq)+'"><span>🚕</span>הראה לנהג</button>':'<button class="sosb main" data-myh="1"><span>🏨</span>בחרו את המלון שלי</button>')+
   near('metro station near me','🚇','תחנת מטרו קרובה')+near('bus stop near me','🚌','תחנת אוטובוס')+near('ATM near me','🏧','כספומט')+near('pharmacy near me','💊','בית מרקחת')+near('toilet near me','🚻','שירותים')+near('hospital near me','🏥','בית חולים')+near('restaurant near me','🍽️','מסעדה')+near('cafe near me','☕','בית קפה')+'</div>'+
   '<div class="card" style="margin-top:10px"><b>חירום</b><div class="row wrap" style="margin-top:6px"><a class="btn sm" href="tel:112">📞 112 חירום כללי</a><a class="btn sm sec" href="tel:102">102 משטרה</a><a class="btn sm sec" href="tel:103">103 אמבולנס</a></div><div class="mute small">מספרים לפי המקורות שמצאתי. אמתו לפני הנסיעה.</div></div>'+
   '<div class="card"><b>משפטים שיעזרו</b><table class="facts">'+C.lang.concat([['Metro haradadır?','איפה המטרו?'],['Bu ünvana necə gedə bilərəm?','איך מגיעים לכתובת הזו?'],['Kömək edin, zəhmət olmasa','תעזרו לי בבקשה'],['İngiliscə danışırsınız?','אתם מדברים אנגלית?']]).map(function(l){return '<tr><td class="ltr">'+esc(l[0])+'</td><td>'+esc(l[1])+'</td></tr>';}).join('')+'</table></div>'+
   '<button class="btn sec" id="closeSheet" style="width:100%">סגירה</button>');
}

/* ---- בית ---- */
function todayIdeas(){
  var d=window._lastWx&&window._lastWx.d, cur=window._lastWx&&window._lastWx.cur;
  var rain=d&&d.precipitation_sum&&d.precipitation_sum[0]>=1;
  var cold=d&&d.temperature_2m_max&&d.temperature_2m_max[0]<12;
  var hot=d&&d.temperature_2m_max&&d.temperature_2m_max[0]>=28;
  var ideas=[];
  if(rain){
    ideas.push({e:'🏛️',t:'מרכז היידר אלייב',d:'מושלם ליום גשום – אדריכלות מרהיבה ומוזיאונים בפנים.',id:'hac'});
    ideas.push({e:'🧶',t:'מוזיאון השטיחים',d:'מבנה ייחודי + אוסף שטיחים עולמי, הכל מקורה.',id:'carpet'});
    ideas.push({e:'🛍️',t:'קניונים',d:'Park Bulvar, Port Baku או Deniz Mall – קניות וקפה בלי להירטב.',go:'shop'});
  } else if(cold){
    ideas.push({e:'🏰',t:'העיר העתיקה + תה חם',d:'סמטאות + בית תה מסורתי. הביאו מעיל.',id:'old'});
    ideas.push({e:'🔥',t:'מגדלי הלהבה בשקיעה',d:'האור היפה ביותר בחורף הוא בשעות אחר הצהריים המאוחרות.',id:'flame'});
  } else {
    ideas.push({e:'🌊',t:'הטיילת + ונציה הקטנה',d:'טיול שטוח ונעים לאורך הים. מתאים לכל הגילאים.',id:'sea'});
    ideas.push({e:'🏰',t:'העיר העתיקה + מגדל הבתולה',d:'הלב ההיסטורי. עדיף בבוקר לפני העומס.',id:'old'});
    ideas.push({e:'🔥',t:'מגדלי הלהבה + פארק גבוה',d:'תצפית מדהימה, במיוחד לקראת שקיעה.',id:'flame'});
  }
  if(hot) ideas.unshift({e:'☕',t:'בתי קפה ומקומות מקורים',d:'חפשו צל ומזגן בצהריים. הטיילת נעימה יותר בערב.',go:'restaurants'});
  var day=new Date().getDay();
  if(day===0||day===6) ideas.push({e:'🧺',t:'שווקים',d:'סוף שבוע – שוק טאזה או השוק הירוק שווים ביקור בבוקר.',go:'markets'});
  var mine=poolSights().filter(function(x){return mval('s',x.id)===1;}).slice(0,2);
  mine.forEach(function(x){ideas.push({e:'⭐',t:x.he,d:'סימנתם כמעניין. היום זמן טוב לבקר.',id:x.id});});
  return ideas.slice(0,5);
}
function openTodayIdeas(){
  var ideas=todayIdeas();
  var h='<h3>✨ מה עושים היום?</h3><div class="small mute">המלצות לפי מזג האוויר, היום בשבוע והמקומות שסימנתם ⭐. לחצו על הצעה לפרטים או לניווט.</div>';
  ideas.forEach(function(it){
    h+='<div class="card" style="cursor:pointer" '+(it.id?'data-sight="'+it.id+'"':it.go?'data-go="'+it.go+'"':'')+'><div class="row"><span style="font-size:28px">'+it.e+'</span><div class="grow"><b>'+esc(it.t)+'</b><div class="small">'+esc(it.d)+'</div></div></div></div>';
  });
  h+='<div class="row wrap" style="margin-top:8px"><button class="btn" data-go="itin">🧭 בנו מסלול מלא</button><button class="btn sec" id="closeSheet">סגירה</button></div>';
  openSheet(h);
}
function viewHome2(){
  var h='<div class="hero slim"><div class="herotxt"><div class="az ltr">Xoş gəlmisiniz</div><h1>ברוכים הבאים לבאקו</h1><div class="sub">מדריך מלא למטייל · עובד גם בלי אינטרנט</div></div>'+skyline()+'</div>';
  h+='<div class="card"><div class="row"><b class="grow">☀️ מזג האוויר בבאקו</b><span class="mute small">'+dmy(new Date())+'</span></div><div id="wxbox"><div class="mute small">טוען תחזית…</div></div></div>';
  h+='<button class="btn big" data-today="1" style="margin-bottom:10px">✨ מה עושים היום?</button>';
  h+='<div class="row2"><button class="bigb" data-myh="1"><span>🏨</span><b>'+(myHotelName()?esc(myHotelName()):'המלון שלי')+'</b><small>'+(myHotelName()?'שינוי':'בחרו כדי לנווט חזרה')+'</small></button><button class="bigb sos" data-sos="1"><span>🆘</span><b>אני אבוד</b><small>עזרה ומה קרוב אליי</small></button></div>';
  if(myHotelName())h+='<div class="row wrap" style="margin-bottom:10px"><a class="btn sm" target="_blank" rel="noopener" href="'+gDir(myHotelName()+' Baku','transit')+'">🧭 נווט חזרה למלון</a><button class="btn sm sec" data-drv="'+esc(myHotelName())+'">🚕 הראה לנהג</button></div>';
  h+='<div class="alert"><b>לפני שמזמינים:</b> יש הנחיות מסע של המל״ל לגבי אזרבייג׳ן. <a href="#" data-go="info">קראו ובדקו את הגרסה העדכנית</a>.</div>';
  h+='<div class="tilegrid">'+MENU.map(function(m,i){return '<button class="tile" data-go="'+m[0]+'" style="background:'+m[4]+'"><span class="n">'+(i+1)+'</span><span class="ic">'+m[1]+'</span><b>'+m[2]+'</b><span class="az ltr">'+m[3]+'</span></button>';}).join('')+'</div>';
  h+='<div class="card refresh"><div class="row"><div class="grow"><b>עדכון מידע והמלצות</b><div class="mute small">גרסת תוכן '+esc(C.meta.updated)+'</div></div><button class="btn" data-refresh="1">🔄 רענון</button></div></div>';
  return h;
}

/* ---- אתרים ---- */
function sightCard2(x){
  return '<div class="scard" data-sight="'+x.id+'"><div class="artwrap" data-wq="'+esc((x.wq||x.en)+' Baku')+'">'+ART.svg(x.art,x.col)+(x.photo?'<img class="ph" src="'+esc(x.photo)+'" alt="" loading="lazy" onerror="this.remove()">':'')+'<span class="area">'+esc(AREAS[x.area]||'')+'</span></div>'+
   '<div class="sbody"><h3>'+esc(x.he)+'</h3><div class="en ltr">'+esc(x.en)+' · '+esc(x.az)+'</div><p>'+esc(x.d)+'</p>'+
   '<div class="pills"><span class="pill">'+(x.paid===false?'חינם':x.paid?'💳 '+esc(x.price||'בתשלום'):'')+'</span><span class="pill">⏱ כ‑'+x.dur+' שעות</span><span class="pill">'+esc(effTxt(x.eff).split(' (')[0])+'</span></div></div></div>'+markBar('s',x.id);
}
function viewSights2(){
  var ids=C.sights.map(function(x){return x.id;});
  var h='<div class="mute small">מבחר מצומצם של אתרים שאינם מוזיאונים בעיקר. לחצו על אתר לפרטים.</div>'+fltBar('s',ids);
  h+='<div class="chips">'+SF.filter(function(c){return c[0]!=='fav';}).map(function(c){return '<button class="chip'+(state.sf===c[0]?' on':'')+'" data-sf="'+c[0]+'">'+c[1]+'</button>';}).join('')+'</div>';
  var list=C.sights.filter(function(x){return vis('s',x.id)&&(state.sf==='all'||state.sf==='fav'||x.area===state.sf);});
  h+='<div class="sgrid">'+(list.length?list.map(sightCard2).join(''):emptyMsg('s'))+'</div>';
  return h;
}
function openSight2(id){
  var x=sightById(id);if(!x)return;var q=gq(x);
  var h='<div class="artwrap big" data-wq="'+esc((x.wq||x.en)+' Baku')+'" data-wx="wkx">'+ART.svg(x.art,x.col)+(x.photo?'<img class="ph" src="'+esc(x.photo)+'" alt="" onerror="this.remove()">':'')+'</div>'+
   '<h3 style="font-size:21px;margin-top:10px">'+esc(x.he)+'</h3><div class="ltr en">'+esc(x.en)+'</div><div class="ltr az">'+esc(x.az)+'</div>'+
   '<p>'+esc(x.d)+'</p>'+
   '<div class="ess"><div>💳 <b>'+(x.paid===false?'חינם':x.paid?esc(x.price||'בתשלום'):'—')+'</b></div><div>🕒 '+esc((x.hrs||'').split('. ')[0])+'</div><div>🎟️ '+(x.adv&&x.adv.indexOf('לא חובה')===0?'אין צורך להזמין מראש':x.adv?esc(x.adv.split('.')[0]):'—')+'</div></div>'+
   '<div class="row wrap" style="margin:10px 0">'+navBtns(q,x.q||x.en)+'</div>'+
   (x.hist?'<div class="hist"><b>📜 היסטוריה קצרה</b><div>'+esc(x.hist)+'</div></div>':'')+
   (x.tip?'<div class="tipbox">💡 '+esc(x.tip)+'</div>':'')+
   '<details class="more"><summary>כל הפרטים: כתובת, טלפון, כרטיסים, הנחות</summary>'+visitTable(x)+'</details>'+
   '<div id="wkx" class="hist" style="display:none"></div>'+markBar('s',x.id)+
   '<div class="row wrap" style="margin-top:8px"><a class="btn sm sec" target="_blank" rel="noopener" href="'+gimg((x.q||x.en)+' Baku')+'">🖼️ עוד תמונות</a><button class="btn sm sec" id="closeSheet">סגירה</button></div>'+
   '<div class="mute small" style="margin-top:8px">מחירים ושעות ממקורות פומביים ועלולים להשתנות. ”לא אימתתי“ אומר שלא מצאתי מקור אמין.</div>';
  openSheet(h);hydrate();
}

/* ---- מלונות, מסעדות, אוכל, קניות, שווקים ---- */
function viewHotels2(){
  var h='<div class="mute small">מלונות 4 ו‑5 כוכבים. מחירים בדולרים ללילה, משוערים.</div>'+fltBar('h',HOTELS.map(function(x){return x.id;}));
  h+='<div class="chips">'+[['all','כל הדירוגים'],['5','5 כוכבים'],['4','4 כוכבים']].map(function(c){return '<button class="chip'+(state.hf===c[0]?' on':'')+'" data-hf="'+c[0]+'">'+c[1]+'</button>';}).join('')+'</div>';
  h+='<div class="card"><label for="ils" style="margin:0">שער דולר בשקלים (להצגת מחיר גם בשקלים)</label><input type="number" step="0.01" min="0" id="ils" inputmode="decimal" value="'+esc(state.usdIls)+'"></div>';
  var list=HOTELS.filter(function(x){return vis('h',x.id)&&(state.hf==='all'||state.hf==='fav'||String(x.stars)===state.hf);});
  h+=list.length?list.map(function(x){
    var hc=hotelCard(x).replace('<div class="card hotel">','<div class="card hotel"><div class="artwrap hot" data-wq="'+esc(x.n)+'"></div>');
    hc=hc.replace(/<div class="row wrap" style="margin-top:8px">/,'<div class="row wrap" style="margin-top:8px"><button class="btn sm" data-setmyh="'+x.id+'">🏨 זה המלון שלי</button><a class="btn sm sec" target="_blank" rel="noopener" href="'+gSearch(x.n+' Baku')+'">🗺️ גוגל מפות</a><button class="btn sm sec" data-drv="'+esc(x.n)+'">🚕 לנהג</button>');
    return hc+markBar('h',x.id);
  }).join(''):emptyMsg('h');
  return h;
}
function rcard(r){
  var stn=SBY[r.st];
  return '<div class="card rest"><div class="row"><div class="grow"><h3>'+esc(r.n)+'</h3><div class="ltr mute small">'+esc(r.az)+'</div></div><div class="lv">'+new Array(r.level+1).join('₼')+'</div></div><div class="small mute">'+esc(r.cat)+' · '+esc(r.area)+'</div><p class="small">'+esc(r.d)+'</p><div class="small">🍴 '+esc(r.order)+'</div>'+
   '<div class="row wrap" style="margin-top:8px">'+navBtns(r.n+' Baku',r.n)+(stn?stBtn(r.st):'')+'</div></div>'+markBar('r',r.n);
}
function viewRest2(){
  var h='<div class="mute small">מחירים הערכה גסה לאדם: ₼ עד 12 · ₼₼ כ‑20 עד 40 · ₼₼₼ מ‑50 ומעלה. בדקו שעות ותפריט בגוגל מפות.</div>'+fltBar('r',C.restaurants.map(function(r){return r.n;}));
  var l=C.restaurants.filter(function(r){return vis('r',r.n);});
  return h+(l.length?l.map(rcard).join(''):emptyMsg('r'));
}
function viewFood2(){
  var h='<div class="mute small">מאכלים אופייניים. סמנו ⭐ מה שרוצים לנסות.</div>'+fltBar('d',C.dishes.map(function(d){return d.he;}));
  var l=C.dishes.filter(function(d){return vis('d',d.he);});
  h+=l.length?l.map(function(d){return '<div class="card dish"><div class="emo">'+d.e+'</div><div class="grow"><h3>'+esc(d.he)+'</h3><div class="ltr mute small">'+esc(d.en)+' · '+esc(d.az)+'</div><p class="small">'+esc(d.d)+'</p>'+markBar('d',d.he)+'</div></div>';}).join(''):emptyMsg('d');
  return h+'<details class="card"><summary>צמחונים, כשרות, מים</summary>'+ul(['צמחונים: קוטאב עשבים, דולמה צמחונית וסלטים. כדאי לשאול אם בושל בציר בשר.','כשרות: אין לי מידע מאומת על מסעדות כשרות בעיר. בררו מראש.','מים: עדיף לשתות מים מבקבוק.'])+'</details>';
}
function viewShop2(){
  var S=C.shop,h='<div class="mute small">קניונים, רחובות קניות וחנויות מזכרות.</div>'+fltBar('p',S.places.map(function(p){return p.n;}));
  var l=S.places.filter(function(p){return vis('p',p.n);});
  h+=l.length?l.map(function(p){return '<div class="card"><div class="row"><div class="grow"><h3>'+esc(p.n)+'</h3><div class="ltr mute small">'+esc(p.az)+'</div></div><span class="pill">'+esc(p.type)+'</span></div><p class="small">'+esc(p.d)+'</p><div class="row wrap">'+navBtns(p.n+' Baku')+(SBY[p.st]?stBtn(p.st):'')+'</div></div>'+markBar('p',p.n);}).join(''):emptyMsg('p');
  h+='<details class="card"><summary>מה כדאי לקנות</summary><div class="sgrid2" style="margin-top:8px">'+S.buy.map(function(b){return '<div><div class="emo2">'+b.e+'</div><b>'+esc(b.n)+'</b><div class="small mute">'+esc(b.d)+'</div></div>';}).join('')+'</div></details>';
  h+='<details class="card"><summary>טיפים לקניות</summary>'+ul(S.tips)+'</details>';
  return h;
}
function viewMarkets2(){
  var h='<div class="mute small">שווקי אוכל, מזכרות ופשפשים. שעות משוערות.</div>'+fltBar('m',C.markets.map(function(m){return m.n;}));
  var l=C.markets.filter(function(m){return vis('m',m.n);});
  return h+(l.length?l.map(function(m){return '<div class="card"><h3>'+esc(m.he)+'</h3><div class="ltr mute small">'+esc(m.n)+' · '+esc(m.az)+'</div><div class="small">📍 '+esc(m.loc)+'</div><div class="small">🕒 '+esc(m.hrs)+'</div><p class="small"><b>מה יש:</b> '+esc(m.sells)+'</p><div class="tipbox">💡 '+esc(m.tip)+'</div><div class="row wrap">'+navBtns(m.n+' Baku')+'</div></div>'+markBar('m',m.n);}).join(''):emptyMsg('m'));
}

/* ---- מפת העיר ---- */
function viewCityMap2(){
  var cm=state.cm,h='<div class="chips"><button class="chip'+(cm.mode==='g'?' on':'')+'" data-cmm="g">🗺️ גוגל מפות</button><button class="chip'+(cm.mode==='l'?' on':'')+'" data-cmm="l">📌 כל הסימונים</button><button class="chip" data-fsmap="1">⛶ מסך מלא</button></div>';
  h+='<div class="card" style="margin-bottom:8px"><b>📍 בחר מקום במפה</b><div class="small mute">בחרו קטגוריה ואז מקום – המפה תתמקד בו. אפשר גם לבנות מסלול.</div>';
  h+='<div class="chips wrapchips" style="margin-top:6px">'+
    '<button class="chip" data-cmq="Baku, Azerbaijan|באקו">עיר</button>'+
    (myHotelName()?'<button class="chip" data-cmq="'+esc(myHotelName()+' Baku')+'|'+esc(myHotelName())+'">🏨 המלון שלי</button>':'')+
    '<button class="chip" data-cmq="İçərişəhər Baku|העיר העתיקה">🏰 עיר עתיקה</button>'+
    '<button class="chip" data-cmq="Baku Boulevard|הטיילת">🌊 טיילת</button>'+
    '<button class="chip" data-cmq="Heydar Aliyev Center Baku|מרכז היידר אלייב">🏛️ היידר אלייב</button>'+
    '<button class="chip" data-cmq="Flame Towers Baku|מגדלי הלהבה">🔥 להבות</button>'+
    '<button class="chip" data-cmq="Fountain Square Baku|כיכר המזרקות">⛲ מזרקות</button>'+
    '</div></div>';
  if(cm.mode==='l')return h+viewCityMapOld();
  h+='<div class="cmap"><iframe title="מפה" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen src="https://maps.google.com/maps?q='+encodeURIComponent(cm.q)+'&z=14&output=embed"></iframe></div>';
  h+='<div class="row wrap" style="margin:8px 0"><b class="grow">📍 '+esc(cm.label)+'</b>'+navBtns(cm.q,cm.label)+'</div>';
  var mine=C.sights.filter(function(x){return mval('s',x.id)===1;}),pool=mine.length?mine:C.sights.filter(function(x){return vis('s',x.id);});
  h+='<div class="mute small">'+(mine.length?'המקומות שסימנתם ⭐':'לחצו על מקום כדי לראות אותו במפה (סמנו ⭐ באתרים כדי לראות כאן רק את שלכם)')+'</div><div class="chips wrapchips">'+pool.map(function(x){return '<button class="chip" data-cmq="'+esc(gq(x))+'|'+esc(x.he)+'">'+esc(x.he)+'</button>';}).join('')+'</div>';
  h+='<div class="mute small">המפה דורשת אינטרנט. המפה של המטרו נמצאת ב”תחבורה ומחירים“ ועובדת גם בלי חיבור.</div>';
  return h;
}

/* ---- חיבור לשאר האפליקציה ---- */
openSight=openSight2; viewSights=viewSights2; viewHotels=viewHotels2; viewRest=viewRest2; viewFood=viewFood2; viewShop=viewShop2; viewMarkets=viewMarkets2; viewCityMap=viewCityMap2; viewHome=viewHome2;
VIEWS.home=viewHome2;VIEWS.sights=viewSights2;VIEWS.hotels=viewHotels2;VIEWS.restaurants=viewRest2;VIEWS.food=viewFood2;VIEWS.shop=viewShop2;VIEWS.markets=viewMarkets2;VIEWS.map=viewCityMap2;
(function(){var r0=render;render=function(){r0();if(state.tab==='home')loadWeather();hydrate();};})();
(function(){var r1=renderNav;})();
document.addEventListener('click',function(ev){
  var t=ev.target.closest('[data-mark],[data-only],[data-drv],[data-sos],[data-myh],[data-myhsave],[data-setmyh],[data-cmm],[data-cmq],[data-today],[data-fsmap]');
  if(!t)return;var d=t.dataset;
  if(d.mark){var p=d.mark.split('|');setMine(p[0],p[1],+p[2]);var open=document.getElementById('sheet').style.display==='block';
    if(open&&p[0]==='s'){openSight2(p[1]);}else rerender();return;}
  if(d.only){var q=d.only.split('|');state.onlyK[q[0]]=q[1];rerender();return;}
  if(d.drv!==undefined){showDriver(d.drv);return;}
  if(d.sos!==undefined){openSOS();return;}
  if(d.myh!==undefined){openMyHotel();return;}
  if(d.today!==undefined){openTodayIdeas();return;}
  if(d.setmyh){var h=HOTELS.filter(function(x){return x.id===d.setmyh;})[0];state.myh={id:h.id,n:h.n};store.set('myh',state.myh);toast('נשמר כמלון שלכם: '+h.n);return;}
  if(d.myhsave!==undefined){var s=$('#myhSel').value,tx=$('#myhTxt').value.trim(),hh=HOTELS.filter(function(x){return x.id===s;})[0];
    if(hh)state.myh={id:hh.id,n:hh.n};else if(tx)state.myh={n:tx};else{toast('בחרו מלון או הקלידו שם.');return;}
    store.set('myh',state.myh);closeSheet();render();toast('המלון נשמר.');return;}
  if(d.cmm){state.cm.mode=d.cmm;rerender();return;}
  if(d.cmq){var z=d.cmq.split('|');state.cm.q=z[0];state.cm.label=z[1];rerender();return;}
  if(d.fsmap!==undefined){
    var cm=$('.cmap');if(!cm)return;
    var on=!cm.classList.contains('fs');
    cm.classList.toggle('fs',on);
    var existing=cm.querySelector('.fs-exit');
    if(on){
      if(!existing){
        var btn=document.createElement('button');
        btn.className='fs-exit';
        btn.type='button';
        btn.setAttribute('data-fsmap','1');
        btn.setAttribute('aria-label','יציאה ממסך מלא');
        btn.textContent='✕ יציאה ממסך מלא';
        cm.appendChild(btn);
      }
      if(t.classList.contains('chip'))t.textContent='⛶ מסך מלא';
    }else{
      if(existing)existing.remove();
      document.querySelectorAll('[data-fsmap]').forEach(function(b){if(b.classList.contains('chip'))b.textContent='⛶ מסך מלא';});
    }
    return;
  }
});
document.getElementById('header-sos')&&0;
render();
