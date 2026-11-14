'use strict';
/* ====== תוכן ====== */
var C = window.BAKU_CONTENT;
function verNum(v){var m=String(v||'').match(/^(\d{4})-(\d\d)-(\d\d)\.(\d+)/);return m?(+m[1]*1e8+ +m[2]*1e6+ +m[3]*1e4+ +m[4]):0;}
(function(){var s=store.get('content',null);if(s&&s.meta&&verNum(s.meta.version)>verNum(C.meta.version))C=s;})();
var HOTELS = C.hotels;
function bindContent(){HOTELS=C.hotels;}
function sightById(id){for(var i=0;i<C.sights.length;i++)if(C.sights[i].id===id)return C.sights[i];}
function sightsAt(id){return C.sights.filter(function(x){return x.st===id;});}
function hotelsAt(id){return HOTELS.filter(function(x){return x.st===id;});}

state.sub = store.get('sub','stations');
state.sf = 'all'; state.sq=''; state.hf='all'; state.sfav = store.get('sfav',[]); state.chk = store.get('chk',[]);
state.lh=false; state.ls=false;

var MENU = [
 ['map','🗺️','מפת העיר','Xəritə','linear-gradient(135deg,#00B4D8,#0077B6)'],
 ['sights','📸','אתרים ומקומות','Görməli yerlər','linear-gradient(135deg,#FF8A00,#FF3D00)'],
 ['hotels','🏨','מלונות מומלצים','Otellər','linear-gradient(135deg,#8E2DE2,#4A00E0)'],
 ['transport','🚇','תחבורה ומחירים','Nəqliyyat','linear-gradient(135deg,#E8212B,#B1006B)'],
 ['restaurants','🍽️','מסעדות מומלצות','Restoranlar','linear-gradient(135deg,#F7971E,#D9480F)'],
 ['food','🥘','אוכל ומאכלים','Yeməklər','linear-gradient(135deg,#43CEA2,#185A9D)'],
 ['shop','🛍️','קניות','Alış-veriş','linear-gradient(135deg,#F953C6,#B91D73)'],
 ['markets','🧺','שווקים','Bazarlar','linear-gradient(135deg,#7BC043,#2E7D32)'],
 ['tips','💡','טיפים','Məsləhətlər','linear-gradient(135deg,#FDC830,#F37335)'],
 ['itin','🧭','מסלולים מומלצים','Marşrutlar','linear-gradient(135deg,#1FA2FF,#12D8FA 60%,#A6FFCB)'],
 ['events','🎭','אירועים ותרבות','Tədbirlər','linear-gradient(135deg,#FF6B6B,#C44569)'],
 ['info','🎒','מידע חיוני לתייר','Vacib məlumat','linear-gradient(135deg,#5B86E5,#36D1DC)']
];
function menuItem(k){for(var i=0;i<MENU.length;i++)if(MENU[i][0]===k)return MENU[i];}

/* ====== עזרים ====== */
function ltr(s){return '<span class="ltr">'+esc(s)+'</span>';}
function ul(a){return '<ul class="tips">'+a.map(function(t){return '<li>'+esc(t)+'</li>';}).join('')+'</ul>';}
function effTxt(n){return n>=3?'מאתגר (גבעה או מדרגות)':n===2?'בינוני (קצת עליות/מדרגות)':'קל, מישורי';}
function kidsTxt(n){return n>=2?'מצוין לילדים':n===1?'מתאים לילדים':'פחות מתאים לילדים קטנים';}
function gimg(q){return 'https://www.google.com/search?tbm=isch&q='+encodeURIComponent(q);}
function money(lo,hi){return hi?('$'+lo+'–$'+hi):('מ‑$'+lo);}
var AREAS={old:'העיר העתיקה',sea:'הטיילת והים',center:'מרכז העיר',hill:'הגבעה (נוף)',hac:'מרכז היידר אלייב',out:'מחוץ לעיר'};
function stBtn(id){var s=SBY[id];return s?'<button class="pill btnlike" data-st="'+id+'">🚇 '+esc(s.he)+'</button>':'';}
function toast(msg,ms){var t=$('#toast');t.textContent=msg;t.style.display='block';clearTimeout(toast.t);toast.t=setTimeout(function(){t.style.display='none';},ms||4200);}
function openSheet(html){var sh=$('#sheet');sh.innerHTML='<div class="grab"></div>'+html;sh.style.display='block';$('#sheetBg').style.display='block';sh.scrollTop=0;}

/* ====== בית ====== */
function skyline(){
  return '<svg class="skyline" viewBox="0 0 360 110" aria-hidden="true" preserveAspectRatio="xMidYMax slice">'+
   '<path d="M0 90q45-14 90 0t90 0t90 0t90 0v20H0z" fill="rgba(255,255,255,.18)"/>'+
   '<path d="M60 100C48 70 66 56 74 28c6 22 24 34 18 72z" fill="#FFB300"/><path d="M98 100c-14-34 12-52 24-76c10 30 32 46 18 76z" fill="#FF7043"/><path d="M146 100c-8-30 8-44 20-62c4 22 20 34 12 62z" fill="#E53935"/>'+
   '<rect x="230" y="40" width="24" height="60" fill="rgba(255,255,255,.55)"/><path d="M226 40h32l-4-10h-24z" fill="rgba(255,255,255,.7)"/>'+
   '<rect x="270" y="70" width="60" height="30" fill="rgba(255,255,255,.35)"/><path d="M280 70a20 20 0 0 1 40 0z" fill="rgba(255,255,255,.5)"/></svg>';
}
function viewHome(){
  var h='<div class="hero"><div class="herotxt"><div class="az ltr">Xoş gəlmisiniz</div><h1>ברוכים הבאים לבאקו</h1><div class="sub">עיר האש והרוחות על הים הכספי · מדריך מלא למטייל, עובד גם בלי אינטרנט</div></div>'+skyline()+'</div>';
  h+='<div class="alert"><b>לפני שמזמינים:</b> יש הנחיות מסע של המל״ל בנוגע לאזרבייג׳ן. <a href="#" data-go="info">קראו ובדקו את הגרסה העדכנית</a>.</div>';
  h+='<div class="tilegrid">'+MENU.map(function(m,i){return '<button class="tile" data-go="'+m[0]+'" style="background:'+m[4]+'"><span class="n">'+(i+1)+'</span><span class="ic">'+m[1]+'</span><b>'+m[2]+'</b><span class="az ltr">'+m[3]+'</span></button>';}).join('')+'</div>';
  var fav=state.sfav.map(sightById).filter(Boolean);
  if(fav.length) h+='<h2>⭐ השמורים שלי</h2><div class="tiles">'+fav.map(function(x){return '<div class="mini" data-sight="'+x.id+'">'+ART.svg(x.art,x.col)+'<b>'+esc(x.he)+'</b><span class="ltr">'+esc(x.en)+'</span></div>';}).join('')+'</div>';
  h+='<div class="card refresh"><div class="row"><div class="grow"><b>עדכון מידע והמלצות</b><div class="mute small">גרסת תוכן '+esc(C.meta.updated)+'</div></div><button class="btn" data-refresh="1">🔄 רענון</button></div></div>';
  h+='<div class="foot">המידע נאסף עד '+esc(C.meta.updated)+' ממקורות פומביים. מחירים, שעות ופתיחות משוערים ועשויים להשתנות.</div>';
  return h;
}

/* ====== אתרים ====== */
var SF=[['all','הכל'],['fav','⭐ שמורים'],['old','העיר העתיקה'],['sea','טיילת וים'],['center','מרכז'],['hill','גבעה ונוף'],['hac','היידר אלייב'],['out','מחוץ לעיר']];
function sightCard(x){
  var h='<div class="scard" data-sight="'+x.id+'"><div class="artwrap">'+ART.svg(x.art,x.col)+(x.photo?'<img src="'+esc(x.photo)+'" alt="" loading="lazy" onerror="this.remove()">':'')+'<span class="area">'+esc(AREAS[x.area]||'')+'</span><button class="fav" data-fav="'+x.id+'" aria-label="שמירה">'+(state.sfav.indexOf(x.id)>=0?'★':'☆')+'</button></div>'+
   '<div class="sbody"><h3>'+esc(x.he)+'</h3><div class="en ltr">'+esc(x.en)+'</div><div class="az ltr">'+esc(x.az)+'</div><p>'+esc(x.d)+'</p>'+
   '<div class="pills"><span class="pill">'+esc(effTxt(x.eff).split(' (')[0])+'</span><span class="pill">'+esc(kidsTxt(x.kids))+'</span><span class="pill">⏱ כ‑'+x.dur+' שעות</span></div></div></div>';
  return h;
}
function viewSights(){
  var h='<h2 class="first">אתרים ומקומות מעניינים</h2><div class="mute small">מבחר שמדגיש טבע, אדריכלות, נופים ומקומות שאפשר ליהנות מהם, ופחות מוזיאונים. שמות באנגלית ובאזרית ליד כל אתר.</div>';
  h+='<div class="chips">'+SF.map(function(c){return '<button class="chip'+(state.sf===c[0]?' on':'')+'" data-sf="'+c[0]+'">'+c[1]+'</button>';}).join('')+'</div>';
  h+='<input type="search" id="sq" placeholder="חיפוש (עברית, English, Azərbaycan)" value="'+esc(state.sq)+'">';
  var q=state.sq.trim().toLowerCase();
  var list=C.sights.filter(function(x){
    if(state.sf==='fav'&&state.sfav.indexOf(x.id)<0)return false;
    if(state.sf!=='all'&&state.sf!=='fav'&&x.area!==state.sf)return false;
    if(q&&(x.he+' '+x.en+' '+x.az).toLowerCase().indexOf(q)<0)return false;
    return true;
  });
  h+='<div class="sgrid">'+(list.length?list.map(sightCard).join(''):'<div class="mute">לא נמצאו אתרים.</div>')+'</div>';
  h+='<div class="foot">האיורים בכרטיסים מקוריים ואינם צילומים אמיתיים. בלחיצה על אתר יש קישור לחיפוש תמונות.</div>';
  return h;
}
function nv(t){return t?esc(t):'<span class="mute">לא אימתתי, בדקו לפני הביקור</span>';}
function visitTable(x){
  var gm='https://www.google.com/maps/search/'+encodeURIComponent((x.q||x.en)+' Baku');
  var r=[];
  r.push(['💳 כניסה',x.paid===false?'<b class="okt">חינם</b> · '+esc(x.fee):x.paid?'<b class="warnt">בתשלום</b> · '+nv(x.fee):nv(x.price)]);
  if(x.disc)r.push(['🏷️ הנחות',esc(x.disc)]);
  r.push(['🎁 חינם / ימים חופשיים',nv(x.free)]);
  r.push(['🕒 שעות',esc(x.hrs)]);
  r.push(['📅 ימי סגירה',nv(x.closed)]);
  r.push(['🎟️ איפה קונים כרטיס',nv(x.buy)]);
  r.push(['⏳ לרכוש מראש?',nv(x.adv)]);
  r.push(['📍 כתובת',nv(x.addr)+' · <a target="_blank" rel="noopener" href="'+gm+'">פתיחה במפות</a>']);
  r.push(['📞 טלפון',x.tel?'<a class="ltr" href="tel:'+esc(x.tel.replace(/\s/g,''))+'">'+esc(x.tel)+'</a>':'<span class="mute">לא מצאתי מספר מאומת</span>']);
  r.push(['🌐 אתר',x.web?'<a class="ltr" target="_blank" rel="noopener" href="'+esc(x.web)+'">'+esc(x.web.replace(/^https?:\/\//,'').replace(/\/$/,''))+'</a>':'<span class="mute">אין אתר רשמי שמצאתי</span>']);
  r.push(['🧭 איך מגיעים',esc(x.how||x.walk)+(x.st?' · '+stBtn(x.st):'')]);
  r.push(['⏱️ זמן ביקור','כ‑'+x.dur+' שעות']);
  r.push(['🚶 מאמץ',esc(effTxt(x.eff))]);
  r.push(['👨‍👩‍👧 ילדים',esc(kidsTxt(x.kids))]);
  return '<table class="facts">'+r.map(function(z){return '<tr><th>'+z[0]+'</th><td>'+z[1]+'</td></tr>';}).join('')+'</table>';
}
function openSight(id){
  var x=sightById(id);if(!x)return;
  var h='<div class="artwrap big">'+ART.svg(x.art,x.col)+(x.photo?'<img src="'+esc(x.photo)+'" alt="" onerror="this.remove()">':'')+'</div>'+
   '<h3 style="font-size:21px;margin-top:10px">'+esc(x.he)+'</h3><div class="ltr en">'+esc(x.en)+'</div><div class="ltr az">'+esc(x.az)+'</div>'+
   '<p>'+esc(x.d)+'</p>'+(x.hist?'<div class="hist"><b>📜 היסטוריה קצרה</b><div>'+esc(x.hist)+'</div></div>':'')+(x.tip?'<div class="tipbox">💡 '+esc(x.tip)+'</div>':'')+
   visitTable(x)+
   '<div class="row wrap" style="margin-top:12px"><button class="btn" data-onmap="'+x.id+'">📍 במפה</button><a class="btn sec" target="_blank" rel="noopener" href="'+gimg((x.q||x.en)+' Baku')+'">🖼️ תמונות</a><button class="btn sec" data-fav="'+x.id+'" id="sfavBtn">'+(state.sfav.indexOf(x.id)>=0?'★ שמור':'☆ שמירה')+'</button><button class="btn sec" id="closeSheet">סגירה</button></div>'+
   '<div class="mute small" style="margin-top:8px">המחירים נאספו ממקורות פומביים ועלולים להשתנות. שדות שכתוב בהם ”לא אימתתי“ לא נמצאו במקור אמין, לכן בדקו באתר או בטלפון לפני הביקור.</div>';
  openSheet(h);
}

/* ====== מלונות ====== */
function hotelCard(x){
  var bf=x.stars===5?60:30, rate=parseFloat(state.usdIls)||0, stn=SBY[x.st];
  var wb=x.hi?('$'+(x.lo+bf)+'–$'+(x.hi+bf)):('מ‑$'+(x.lo+bf));
  var ils=rate>0?(' · בערך '+(x.hi?('₪'+Math.round((x.lo+bf)*rate)+'–₪'+Math.round((x.hi+bf)*rate)):('מ‑₪'+Math.round((x.lo+bf)*rate)))):'';
  var g=x.stars===5?'linear-gradient(135deg,#8E2DE2,#4A00E0)':'linear-gradient(135deg,#00B4D8,#0077B6)';
  return '<div class="card hotel"><div class="hhead" style="background:'+g+'"><div class="stars">'+(x.stars===5?'★★★★★':'★★★★')+'</div><h3>'+esc(x.n)+'</h3><div class="small">'+esc(x.area)+'</div>'+(x.rate?'<span class="score">'+x.rate+'</span>':'')+'</div>'+
   '<div class="small" style="margin-top:8px">📍 '+(stn?'תחנה קרובה: <b>'+esc(stn.he)+'</b> · ':'')+esc(x.walk)+'</div>'+
   '<div class="small">🚶 '+esc(x.effort||'')+'</div>'+
   '<div class="hprice"><div>ללילה בחדר זוגי: <b>'+money(x.lo,x.hi)+'</b></div><div>עם ארוחת בוקר לשניים: <b>'+wb+'</b>'+ils+'</div>'+
   '<div class="mute small">התוספת לארוחת בוקר (כ‑'+bf+' דולר לזוג) היא הערכה, למקרה שהיא לא כלולה. הטווחים נאספו לנובמבר ועשויים להשתנות.</div></div>'+
   '<b class="small">למה כדאי:</b>'+ul(x.why)+'<div class="small"><span class="pill">מתאים ל: '+esc(x.best)+'</span></div>'+
   '<div class="row wrap" style="margin-top:8px"><button class="btn sm" data-hmap="'+x.id+'">📍 במפה</button>'+(stn?'<button class="btn sm sec" data-to="s:'+stn.id+'">איך מגיעים</button>':'')+'<a class="btn sm sec" target="_blank" rel="noopener" href="'+gimg(x.n+' Baku')+'">🖼️ תמונות</a></div></div>';
}
function viewHotels(){
  var h='<h2 class="first">מלונות מומלצים</h2><div class="mute small">מלונות 4 ו‑5 כוכבים במרכז או קרוב לתחנות מטרו, עם הסבר לכל בחירה. המחירים הם טווחים משוערים בדולרים.</div>';
  h+='<div class="chips">'+[['all','הכל'],['5','5 כוכבים'],['4','4 כוכבים'],['old','ליד העיר העתיקה והטיילת']].map(function(c){return '<button class="chip'+(state.hf===c[0]?' on':'')+'" data-hf="'+c[0]+'">'+c[1]+'</button>';}).join('')+'</div>';
  h+='<div class="card"><label for="ils" style="margin:0">שער דולר בשקלים (אופציונלי, להצגת מחירים גם בשקלים)</label><input type="number" step="0.01" min="0" id="ils" inputmode="decimal" value="'+esc(state.usdIls)+'"></div>';
  var list=HOTELS.filter(function(x){return state.hf==='5'?x.stars===5:state.hf==='4'?x.stars===4:state.hf==='old'?(x.st==='icher'||x.st==='sahil'):true;});
  h+=list.map(hotelCard).join('');
  h+='<div class="card"><h3>איך לבחור</h3><ul class="tips small"><li><b>הכי נוח להליכה ולמטרו:</b> מלונות ליד איצ׳רי שהר וסאחיל.</li><li><b>הכי יפה ורומנטי:</b> Fairmont במגדלי הלהבה, אבל מתכננים מונית או פוניקולר.</li><li><b>הכי משתלם:</b> Sheraton Intourist, Marriott Boulevard ו‑Sapphire City.</li><li>חורף הוא עונה נמוכה ולכן המחירים לרוב נמוכים משיא הקיץ. בסופי שבוע ובאירועים גדולים הם עולים.</li></ul></div>';
  h+='<div class="card"><h3>עוד שווה לבדוק</h3>'+ul(C.hotelsMore)+'</div>';
  h+='<div class="foot">הדירוגים והמחירים נאספו מאתרי השוואה (KAYAK, Travelmyth ועוד) והם הערכה. ההסברים הם שיקול דעת שלי ולא פרסום.</div>';
  return h;
}

/* ====== תחבורה ====== */
var TSUB=[['stations','🗺️','מפת מטרו ותחנות'],['route','🧭','מסלול מנקודה לנקודה'],['lines','🚉','קווים ותחנות סופיות'],['tickets','🎫','כרטיסים ומחירים'],['other','🚕','מונית, אוטובוס ושדה תעופה']];
function viewLines(){
  var defs=[['red','איצ׳רי שהר (İçərişəhər)','חזי אסלנוב (Həzi Aslanov)',RED.concat(['bakmil'])],['green','דרנגול (Dərnəgül)','ניזאמי (Nizami)',GREEN],['purple','ממר אג׳אמי (Memar Əcəmi)','חוג׳סן (Xocəsən)',PURPLE]];
  var h='<h2 class="first">הקווים והתחנות הסופיות</h2><div class="mute small">בשילוט הרכבת מופיע שם התחנה הסופית של הכיוון. כך יודעים לאיזה צד לעלות.</div>';
  defs.forEach(function(d){
    var L=LINES[d[0]];
    h+='<div class="card" style="border-top:6px solid '+L.c+'"><h3 style="color:'+L.c+'">'+L.n+'</h3><div class="termrow"><div><span class="mute small">קצה אחד</span><br><b>'+d[1]+'</b></div><div class="arr">⇄</div><div><span class="mute small">קצה שני</span><br><b>'+d[2]+'</b></div></div>';
    h+='<details><summary>כל התחנות ('+d[3].length+')</summary><div class="strip">'+d[3].map(function(id){return stripRow(id,{line:d[0]});}).join('')+'</div></details></div>';
  });
  h+='<div class="card" style="border-top:6px solid '+LINES.green.c+'"><h3>הקו הקצר: ג׳עפר ג׳באר׳לי ⇄ חטאי</h3><div class="small">שתי תחנות בלבד (Cəfər Cabbarlı, Xətai). נחשב כחלק מהקו הירוק ומשמש להגעה לאזור חטאי. ג׳עפר ג׳באר׳לי מחוברת במעבר רגלי פנימי לתחנת 28 במאי.</div></div>';
  h+=bannerWorks();
  h+='<div class="foot">27 תחנות לפי הספירה הרשמית. סדר התחנות בקו הסגול משוער.</div>';
  return h;
}
function viewOther(){
  return '<h2 class="first">מונית, אוטובוס ושדה התעופה</h2>'+
  '<div class="card"><h3>🚕 מוניות</h3>'+ul(['הזמינו דרך Bolt או Yango כדי לראות מחיר מראש.','נסיעה קצרה במרכז העיר עולה לפי מקור אחד בערך 2 עד 4 אירו.','מהשדה לעיר: בערך 10 עד 35 ₼ לפי השעה והאפליקציה. סכמו על מחיר לפני שנוסעים.'])+'</div>'+
  '<div class="card"><h3>🚌 אוטובוסים</h3>'+ul(['אוטובוס H1 משדה התעופה: 1.30 ₼, כ‑30 עד 40 דקות, מסיים ליד תחנת 28 במאי.','בין ניזאמי ל‑28 במאי נוסעים אוטובוסי אקספרס M1 עד M6 בזמן שהעבודות נמשכות.','משלמים באותו כרטיס BakıKart.'])+'</div>'+
  '<div class="card"><h3>🚡 פוניקולר</h3>'+ul(['עולה מהטיילת לפארק הגבוה, ופותר את העלייה בלי מאמץ.','בדקו מחיר ושעות בקופה.'])+'</div>'+
  '<div class="card"><h3>🚶 ברגל</h3>'+ul(['המרכז, הטיילת והעיר העתיקה קרובים זה לזה. העיר העתיקה משופעת ומרוצפת.','הטיילת שטוחה ונוחה גם לעגלה.'])+'</div>'+
  '<div class="card"><h3>✈️ משדה התעופה (היידר אלייב)</h3><div class="small">אין מטרו בשדה. האוטובוס H1 או מונית. פרטים בלשונית ”כרטיסים ומחירים“.</div></div>';
}
function viewTransport(){
  var h='<div class="chips">'+TSUB.map(function(t){return '<button class="chip'+(state.sub===t[0]?' on':'')+'" data-sub="'+t[0]+'">'+t[1]+' '+t[2]+'</button>';}).join('')+'</div>';
  var body={stations:viewStations,route:viewPlan,lines:viewLines,tickets:viewTickets,other:viewOther}[state.sub];
  return h+body();
}

/* ====== מסעדות ====== */
function viewRest(){
  var h='<h2 class="first">מסעדות מומלצות</h2><div class="mute small">מבחר שמופיע במדריכים ובביקורות. מחירים הם הערכה גסה לאדם, ללא משקאות. בדקו תפריט ושעות לפני שמגיעים.</div>';
  h+='<div class="card"><h3>רמות מחיר (הערכה)</h3><ul class="tips small"><li><span class="lv">₼</span> אוכל פשוט, קוטאב ודוכנים: כ‑5 עד 12 ₼</li><li><span class="lv">₼₼</span> מסעדה אזרית רגילה: כ‑20 עד 40 ₼</li><li><span class="lv">₼₼₼</span> מסעדה מעוצבת או עם נוף: כ‑50 ₼ ומעלה</li></ul></div>';
  h+=C.restaurants.map(function(r){
    var stn=SBY[r.st];
    return '<div class="card rest"><div class="row"><div class="grow"><h3>'+esc(r.n)+'</h3><div class="ltr mute small">'+esc(r.az)+'</div></div><div class="lv">'+new Array(r.level+1).join('₼')+'</div></div>'+
     '<div class="small mute">'+esc(r.cat)+' · '+esc(r.area)+'</div><p class="small">'+esc(r.d)+'</p><div class="small">🍴 כדאי להזמין: '+esc(r.order)+'</div>'+
     '<div class="row wrap" style="margin-top:8px">'+(stn?stBtn(r.st):'')+'<a class="pill btnlike" target="_blank" rel="noopener" href="https://www.google.com/maps/search/'+encodeURIComponent(r.n+' Baku')+'">📍 מפות גוגל</a></div></div>';
  }).join('');
  return h;
}
function viewFood(){
  var h='<h2 class="first">אוכל ומאכלים אופייניים</h2><div class="mute small">המטבח האזרי מתבסס על בשר צלוי, אורז בזעפרן, עשבי תיבול וקינוחים עם אגוזים.</div>';
  h+=C.dishes.map(function(d){return '<div class="card dish"><div class="emo">'+d.e+'</div><div class="grow"><h3>'+esc(d.he)+'</h3><div class="ltr mute small">'+esc(d.en)+' · '+esc(d.az)+'</div><p class="small">'+esc(d.d)+'</p></div></div>';}).join('');
  h+='<div class="card"><h3>הערות לאוכלים מיוחדים</h3>'+ul(['צמחונים: קוטאב עשבים, דולמה צמחונית וסלטים. כדאי לשאול אם בושל בציר בשר.','כשרות: אין לי מידע מאומת על מסעדות כשרות בעיר. בררו מראש.','מים: עדיף לשתות מים מבקבוק.'])+'</div>';
  return h;
}
function viewShop(){
  var S=C.shop, h='<h2 class="first">קניות</h2><div class="mute small">קניונים, רחובות קניות וחנויות מזכרות.</div>';
  h+=S.places.map(function(p){return '<div class="card"><div class="row"><div class="grow"><h3>'+esc(p.n)+'</h3><div class="ltr mute small">'+esc(p.az)+'</div></div><span class="pill">'+esc(p.type)+'</span></div><p class="small">'+esc(p.d)+'</p>'+(SBY[p.st]?stBtn(p.st):'')+'</div>';}).join('');
  h+='<h2>מה כדאי לקנות</h2><div class="sgrid2">'+S.buy.map(function(b){return '<div class="card"><div class="emo2">'+b.e+'</div><b>'+esc(b.n)+'</b><div class="small mute">'+esc(b.d)+'</div></div>';}).join('')+'</div>';
  h+='<div class="card"><h3>טיפים לקניות</h3>'+ul(S.tips)+'</div>';
  return h;
}
function viewMarkets(){
  var h='<h2 class="first">שווקים</h2><div class="mute small">שווקי אוכל, מזכרות ופשפשים. שעות משוערות.</div>';
  h+=C.markets.map(function(m){return '<div class="card"><h3>'+esc(m.he)+'</h3><div class="ltr mute small">'+esc(m.n)+' · '+esc(m.az)+'</div><div class="small">📍 '+esc(m.loc)+'</div><div class="small">🕒 '+esc(m.hrs)+'</div><p class="small"><b>מה יש:</b> '+esc(m.sells)+'</p><div class="tipbox">💡 '+esc(m.tip)+'</div>'+(m.st?stBtn(m.st):'')+'</div>';}).join('');
  return h;
}
function viewTips(){
  var h='<h2 class="first">טיפים</h2>';
  h+=C.tips.map(function(t,i){return '<details class="card"'+(i===0?' open':'')+'><summary><span class="emo2">'+t.e+'</span> '+esc(t.t)+'</summary>'+ul(t.items)+'</details>';}).join('');
  return h;
}
function viewEvents(){
  var h='<h2 class="first">אירועים, קונצרטים וספורט</h2>';
  h+='<div class="mute small">אין לי מקור חי ומאומת לרשימת אירועים בזמן אמת. להלן האתרים הרשמיים והמומלצים לרכישת כרטיסים וללוח אירועים עדכני בבאקו:</div>';
  h+='<div class="card"><b>🎟️ רכישת כרטיסים ולוח אירועים</b><div class="row wrap" style="margin-top:8px">'+
    '<a class="btn sm" target="_blank" rel="noopener" href="https://iticket.az/en/events">iTicket – כל האירועים</a>'+
    '<a class="btn sm sec" target="_blank" rel="noopener" href="https://www.bandsintown.com/c/baku-azerbaijan">Bandsintown – הופעות</a>'+
    '<a class="btn sm sec" target="_blank" rel="noopener" href="https://www.ticketmaster.az/">Ticketmaster Azerbaijan</a>'+
    '</div><div class="small mute" style="margin-top:8px">iTicket הוא הפלטפורמה המרכזית בבאקו לקונצרטים, תיאטרון, ספורט ואירועי תרבות.</div></div>';
  h+='<div class="card"><b>🏟️ מקומות מרכזיים</b><ul class="tips small">'+
    '<li><b>Heydar Aliyev Palace / Center</b> – קונצרטים ואירועי תרבות גדולים</li>'+
    '<li><b>Baku Olympic Stadium</b> – משחקי כדורגל ואירועי ספורט</li>'+
    '<li><b>Azerbaijan State Academic Opera and Ballet Theatre</b> – אופרה ובalet</li>'+
    '<li><b>Philharmonic Hall</b> – קונצרטים קלאסיים</li>'+
    '<li><b>Fountain Square & Nizami</b> – אירועי רחוב והופעות קטנות בערב</li>'+
    '</ul></div>';
  h+='<div class="card tipbox"><b>💡 טיפ</b><div class="small">בדקו אתרים אלה כמה ימים לפני הנסיעה. בעונת החגים והקיץ יש יותר הופעות. כרטיסים לאירועים גדולים כדאי לקנות מראש.</div></div>';
  h+='<div class="foot">המידע כללי. תמיד אמתו תאריכים ומחירים באתר הרשמי לפני רכישה.</div>';
  return h;
}
function viewInfo(){
  var h='<h2 class="first">מידע חיוני לתייר</h2>';
  h+=C.info.map(function(s){return '<details class="card"'+(s.open?' open':'')+'><summary>'+esc(s.t)+'</summary>'+ul(s.items)+'</details>';}).join('');
  h+='<details class="card" open><summary>שפה וביטויים שימושיים</summary><div class="small">השפה הרשמית אזרית. רוסית נפוצה אצל מבוגרים ואנגלית בתיירות. לחצו 🔊 להשמעה (הגייה משוערת).</div>'+
    '<table class="facts"><tr><th>עברית</th><th class="ltr">Azərbaycan</th><th class="ltr">הגייה</th><th></th></tr>'+
    (C.langExt||C.lang).map(function(l){
      var az=l[0], he=l[1], ph=l.length>=3?l[2]:'';
      return '<tr><td>'+esc(he)+'</td><td class="ltr">'+esc(az)+'</td><td class="ltr mute">'+esc(ph||'—')+'</td><td><button class="btn sm sec" data-speak="'+esc(az)+'" type="button" aria-label="השמע">🔊</button></td></tr>';
    }).join('')+'</table></details>';
  h+='<details class="card"><summary>רשימת הכנות לפני הנסיעה</summary><div class="mute small">הסימונים נשמרים בטלפון.</div>'+C.prep.map(function(t,i){return '<label class="chk"><input type="checkbox" data-chk="'+i+'"'+(state.chk.indexOf(i)>=0?' checked':'')+'><span>'+esc(t)+'</span></label>';}).join('')+'</details>';
  h+='<details class="card"><summary>מקורות</summary><ul class="tips small">'+C.sources.map(function(s){return '<li><a href="'+esc(s[1])+'" target="_blank" rel="noopener">'+esc(s[0])+'</a></li>';}).join('')+'</ul></details>';
  h+='<div class="foot">המידע נאסף עד '+esc(C.meta.updated)+' והוא כללי בלבד. לפני נסיעה בדקו באתרים הרשמיים.</div>';
  return h;
}

/* ====== מעטפת ====== */
var VIEWS={home:viewHome,map:function(){return viewCityMap();},sights:viewSights,hotels:viewHotels,transport:viewTransport,restaurants:viewRest,food:viewFood,shop:viewShop,markets:viewMarkets,tips:viewTips,itin:function(){return viewItin();},events:viewEvents,info:viewInfo};
var NAV=[['home','🏠','בית'],['map','🗺️','מפה'],['sights','📸','אתרים'],['itin','🧭','מסלולים'],['menu','☰','תפריט']];
function renderNav(){
  $('#nav').innerHTML=NAV.map(function(t){return '<button data-tab="'+t[0]+'" class="'+(state.tab===t[0]?'on':'')+'"><span class="ic">'+t[1]+'</span>'+t[2]+'</button>';}).join('');
}
function renderBar(){
  var b=$('#menubar');if(!b)return;
  b.innerHTML='<button data-go="home" class="'+(state.tab==='home'?'on':'')+'">🏠 בית</button>'+MENU.map(function(m,i){return '<button data-go="'+m[0]+'" class="'+(state.tab===m[0]?'on':'')+'">'+m[1]+' '+m[2]+'</button>';}).join('');
  var on=b.querySelector('.on');if(on&&on.scrollIntoView)try{b.scrollLeft=on.offsetLeft-b.clientWidth/2+on.clientWidth/2;}catch(e){}
}
function renderDrawer(){
  $('#drawer').innerHTML='<div class="dhead"><b>תפריט</b><button id="closeDrawer" class="x" aria-label="סגירה">✕</button></div>'+
   '<button class="ditem" data-go="home"><span>🏠</span> בית</button>'+MENU.map(function(m,i){return '<button class="ditem" data-go="'+m[0]+'"><span>'+m[1]+'</span> '+(i+1)+'. '+m[2]+'</button>';}).join('')+
   '<button class="ditem" data-refresh="1"><span>🔄</span> רענון מידע והמלצות</button>';
}
function render(){
  if(!VIEWS[state.tab])state.tab='home';
  renderNav();renderBar();
  document.body.dataset.screen=state.tab;
  var t=state.tab==='home'?'':'<div class="crumb" style="--c:'+(menuItem(state.tab)?menuItem(state.tab)[4]:'#888')+'"><button class="x" data-go="home" aria-label="בית">‹</button> '+(menuItem(state.tab)?menuItem(state.tab)[1]+' '+menuItem(state.tab)[2]:'')+'</div>';
  $('#view').innerHTML=t+VIEWS[state.tab]();
  if(state.tab==='transport'){
    if(state.sub==='route')renderPlan();
    if(state.sub==='tickets')updConv();
    if(state.sub==='stations'&&state.view==='map')initMap();
  }
  if(state.tab==='map')initCityMap();
  if(state.tab==='itin')itinAfter();
  window.scrollTo(0,0);
}
function go(tab){
  if(tab==='menu'){openDrawer();return;}
  closeDrawer();closeSheet();state.tab=tab;store.set('tab',tab);render();
}
function openDrawer(){renderDrawer();$('#drawer').classList.add('open');$('#drawerBg').style.display='block';}
function closeDrawer(){$('#drawer').classList.remove('open');$('#drawerBg').style.display='none';}

/* מקומות בתחנה: חלון תחנה משתמש ב‑openStation של המטרו */

/* ====== רענון ====== */
function refreshAll(){
  if(navigator.onLine===false){toast('אין חיבור לאינטרנט. המידע השמור במכשיר ממשיך לעבוד. נסו שוב כשיש רשת.');return;}
  var btn=$('#refreshBtn'); if(btn)btn.classList.add('spin');
  var done=function(){if(btn)btn.classList.remove('spin');};
  fetch('content.json?v='+Date.now(),{cache:'no-store'}).then(function(r){if(!r.ok)throw new Error('http');return r.json();}).then(function(j){
    var newer=j&&j.meta&&verNum(j.meta.version)>verNum(C.meta.version);
    if(newer){store.set('content',j);C=j;bindContent();render();}
    var swp=(navigator.serviceWorker&&navigator.serviceWorker.getRegistration)?navigator.serviceWorker.getRegistration().then(function(r){return r&&r.update();}).catch(function(){}):Promise.resolve();
    return swp.then(function(){
      done();
      openSheet('<h3>'+(newer?'המידע עודכן':'המידע כבר עדכני')+'</h3><p>'+(newer?'התקבלה גרסה חדשה של המלצות, מחירים ומידע: '+esc(C.meta.updated)+'.':'הגרסה שלכם היא מ‑'+esc(C.meta.updated)+' ואין חדשה יותר באתר.')+'</p>'+
       '<div class="tipbox">איך זה עובד: הכפתור מושך מהאתר שבו האפליקציה מותקנת את קובץ המידע האחרון ובודק גם אם יצאה גרסה חדשה של האפליקציה. הוא לא מחפש באינטרנט בעצמו. כדי שיתווספו המלצות חדשות, צריך לעדכן את קובץ התוכן בשרת (למשל לבקש מ‑Claude להפיק גרסה חדשה) ולהעלות אותו.</div>'+
       '<div class="row" style="margin-top:12px"><button class="btn" id="closeSheet">סגירה</button></div>');
    });
  }).catch(function(){
    done();toast('לא הצלחתי להביא מידע חדש כרגע. המידע השמור ממשיך לעבוד.');
  });
}

/* ====== אירועים ====== */
var DRAG={moved:false};
function speakAz(txt){
  if(!window.speechSynthesis){toast('השמעה לא נתמכת במכשיר זה');return;}
  try{
    window.speechSynthesis.cancel();
    var u=new SpeechSynthesisUtterance(txt);
    u.lang='az-AZ';
    u.rate=0.9;
    var voices=window.speechSynthesis.getVoices();
    var az=voices.filter(function(v){return v.lang.indexOf('az')===0||v.lang.indexOf('tr')===0;})[0];
    if(az)u.voice=az;
    window.speechSynthesis.speak(u);
  }catch(e){toast('לא הצלחתי להשמיע');}
}
document.addEventListener('click',function(ev){
  var t=ev.target.closest('[data-tab],[data-go],[data-st],[data-f],[data-v],[data-ready],[data-from],[data-to],[data-sub],[data-sf],[data-hf],[data-sight],[data-fav],[data-onmap],[data-hmap],[data-refresh],[data-lay],[data-mz],[data-it],[data-itgen],[data-itcopy],[data-lyr],[data-locate],[data-speak],#swap,#closeSheet,#sheetBg,#closeDrawer,#drawerBg,#menuBtn');
  if(!t) return;
  if(DRAG.moved&&t.closest('#mapWrap')){DRAG.moved=false;return;}
  var d=t.dataset;
  if(t.tagName==='A'&&t.getAttribute('href')==='#')ev.preventDefault();
  if(t.id==='closeSheet'||t.id==='sheetBg'){closeSheet();return;}
  if(t.id==='closeDrawer'||t.id==='drawerBg'){closeDrawer();return;}
  if(t.id==='menuBtn'){openDrawer();return;}
  if(t.id==='swap'){var x=state.from;state.from=state.to;state.to=x;store.set('from',state.from);store.set('to',state.to);render();return;}
  if(d.refresh){closeDrawer();refreshAll();return;}
  if(d.speak!==undefined){speakAz(d.speak);return;}
  if(d.fav){ev.stopPropagation();var i=state.sfav.indexOf(d.fav);if(i>=0)state.sfav.splice(i,1);else state.sfav.push(d.fav);store.set('sfav',state.sfav);
    if(t.id==='sfavBtn'){t.textContent=i>=0?'☆ שמירה':'★ שמור';}else{t.textContent=i>=0?'☆':'★';}return;}
  if(d.sight){openSight(d.sight);return;}
  if(d.onmap){closeSheet();state.focus={k:'s',id:d.onmap};go('map');return;}
  if(d.hmap){state.focus={k:'h',id:d.hmap};go('map');return;}
  if(d.tab){go(d.tab);return;}
  if(d.go){go(d.go);return;}
  if(d.sub){state.sub=d.sub;store.set('sub',d.sub);render();return;}
  if(d.st){openStation(d.st);return;}
  if(d.sf){state.sf=d.sf;render();return;}
  if(d.hf){state.hf=d.hf;render();return;}
  if(d.f){state.filter=d.f;render();return;}
  if(d.v){state.view=d.v;render();return;}
  if(d.lay){state[d.lay]=!state[d.lay];render();return;}
  if(d.mz){var w=$('#mapWrap');if(!w)return;var r=w.getBoundingClientRect();if(d.mz==='fit')fitMap();else zoomAt(r.left+r.width/2,r.top+r.height/2,d.mz==='in'?1.4:1/1.4);return;}
  if(d.ready!==undefined){
    var rd=READY[+d.ready];var cv=function(v){return v.indexOf(':')>0?v:'s:'+v;};
    state.from=cv(rd.s);state.to=cv(rd.e);store.set('from',state.from);store.set('to',state.to);state.sub='route';store.set('sub','route');go('transport');return;
  }
  if(d.from){state.from=d.from;store.set('from',state.from);closeSheet();state.sub='route';store.set('sub','route');go('transport');return;}
  if(d.to){state.to=d.to;store.set('to',state.to);closeSheet();state.sub='route';store.set('sub','route');go('transport');return;}
  if(d.lyr){state.lyr=state.lyr||{s:true,h:true};state.lyr[d.lyr]=!state.lyr[d.lyr];render();return;}
  if(d.locate!==undefined){locateMe();return;}
  if(d.it!==undefined){itToggle(t);return;}
  if(d.itgen!==undefined){itGenerate();return;}
  if(d.itcopy!==undefined){itCopy();return;}
});
document.addEventListener('change',function(ev){
  var el=ev.target;
  if(el.id==='from'){state.from=el.value;store.set('from',el.value);renderPlan();}
  else if(el.id==='to'){state.to=el.value;store.set('to',el.value);renderPlan();}
  else if(el.id==='done'){state.done=el.checked;store.set('done',el.checked);renderPlan();}
  else if(el.dataset&&el.dataset.chk!==undefined){var i=+el.dataset.chk,k=state.chk.indexOf(i);if(el.checked&&k<0)state.chk.push(i);if(!el.checked&&k>=0)state.chk.splice(k,1);store.set('chk',state.chk);}
  else if(el.dataset&&el.dataset.itf){itField(el);}
});
document.addEventListener('input',function(ev){
  var el=ev.target;
  if(el.id==='q'||el.id==='sq'){var key=el.id==='q'?'q':'sq';state[key]=el.value;var pos=el.selectionStart;render();var n=$('#'+el.id);if(n){n.focus();try{n.setSelectionRange(pos,pos);}catch(e){}}}
  else if(el.id==='ils'){state.usdIls=el.value;store.set('usdIls',el.value);if(state.tab==='transport')updConv();else if(state.tab==='hotels'){var p=el.selectionStart;render();var n2=$('#ils');if(n2){n2.focus();try{n2.setSelectionRange(p,p);}catch(e){}}}}
  else if(el.id==='azn'){updConv();}
});

/* התקנה */
var deferred=null;
window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();deferred=e;$('#installBtn').style.display='inline-block';});
$('#installBtn').addEventListener('click',function(){if(!deferred)return;deferred.prompt();deferred.userChoice.then(function(){deferred=null;$('#installBtn').style.display='none';});});
window.addEventListener('appinstalled',function(){$('#installBtn').style.display='none';});
if('serviceWorker' in navigator && location.protocol.indexOf('http')===0){
  window.addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){});});
}
if(window.speechSynthesis){
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged=function(){window.speechSynthesis.getVoices();};
}

/* גרירה וצביטה במפת המטרו */
(function(){
  var pts={},start=null,pinch=0;
  document.addEventListener('pointerdown',function(e){var w=e.target.closest&&e.target.closest('#mapWrap');if(!w||e.target.closest('.mapctl'))return;pts[e.pointerId]={x:e.clientX,y:e.clientY};start={x:e.clientX,y:e.clientY,mx:MV.x,my:MV.y};DRAG.moved=false;pinch=0;});
  document.addEventListener('pointermove',function(e){
    if(!pts[e.pointerId])return; var w=$('#mapWrap'); if(!w)return;
    var ids=Object.keys(pts);
    if(ids.length===2){
      pts[e.pointerId]={x:e.clientX,y:e.clientY};var a=pts[ids[0]],b=pts[ids[1]],dd=Math.hypot(a.x-b.x,a.y-b.y);
      if(pinch){zoomAt((a.x+b.x)/2,(a.y+b.y)/2,dd/pinch);}pinch=dd;DRAG.moved=true;return;
    }
    var dx=e.clientX-start.x,dy=e.clientY-start.y;
    if(!DRAG.moved&&Math.hypot(dx,dy)<6)return;
    DRAG.moved=true;MV.x=start.mx+dx;MV.y=start.my+dy;applyMv();
  });
  function up(e){delete pts[e.pointerId];pinch=0;if(!Object.keys(pts).length)setTimeout(function(){DRAG.moved=false;},50);}
  document.addEventListener('pointerup',up);document.addEventListener('pointercancel',up);
  document.addEventListener('wheel',function(e){var w=e.target.closest&&e.target.closest('#mapWrap');if(!w)return;e.preventDefault();zoomAt(e.clientX,e.clientY,e.deltaY<0?1.15:1/1.15);},{passive:false});
})();
