/* מסלולים מומלצים לפי מספר ימים והרכב הנוסעים */
function todayISO(){var d=new Date();return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);}
var IT_DEF={days:3,start:'',adults:2,kids:0,kidAge:'6_12',seniors:0,hotel:'fs',pace:'normal',walk:'mid',visit:'couple',budget:'mid',mobility:'none',arrive:'afternoon',depart:'afternoon',interests:[]};
state.it=Object.assign({},IT_DEF,store.get('it',{}));
if(!state.it.start)state.it.start=todayISO();
state.itOut=null;
var IT_INT=[['history','🏰 היסטוריה'],['photo','📷 צילום ונופים'],['food','🍽️ אוכל'],['shopping','🛍️ קניות'],['nature','🌿 טבע'],['culture','🎨 תרבות ואמנות'],['romance','💞 רומנטי'],['night','🌙 ערב ולילה'],['relax','☕ רגוע']];
var AREA_OF_HOTEL={fs:'sea',fm:'hill',hl:'sea',jw:'center',sh:'sea',mb:'sea',b19:'old',sc:'center',ag:'sea'};
var HM={old:'old',sea:'sea',center:'center',hill:'hill'};
/* זמני נסיעה משוערים בדקות במונית בין אזורים */
var TAXI={old:{old:5,sea:8,center:10,hill:12,hac:20,abs:45,gob:60},sea:{old:8,sea:5,center:7,hill:10,hac:18,abs:45,gob:60},center:{old:10,sea:7,center:5,hill:10,hac:15,abs:40,gob:55},hill:{old:12,sea:10,center:10,hill:5,hac:15,abs:45,gob:60},hac:{old:20,sea:18,center:15,hill:15,hac:5,abs:40,gob:55}};
var ORDER={old:['old','maiden','palace'],sea:['sea','venice','eye','flag','carpet'],center:['nizami','fountain','tazapir'],hill:['funi','highland','flame'],hac:['hac'],abs:['ateshgah','yanardag'],gob:['gobustan','mud']};
var CLUSTER_NAME={old:'העיר העתיקה',sea:'הטיילת והים',center:'מרכז העיר',hill:'הגבעה והנוף',hac:'מרכז היידר אלייב',abs:'חצי האי אבשרון (אש)',gob:'גובוסטן ורי הבוץ'};
function clusterOf(x){
  if(x.area==='out')return (x.id==='ateshgah'||x.id==='yanardag')?'abs':'gob';
  if(x.id==='carpet'||x.id==='flag')return 'sea';
  if(x.id==='tazapir'||x.id==='nizami'||x.id==='fountain')return 'center';
  return x.area;
}
function hotelAreaKey(){
  var h=state.it.hotel;
  if(HM[h.replace('area:','')]&&h.indexOf('area:')===0)return h.replace('area:','');
  return AREA_OF_HOTEL[h]||'sea';
}
function hotelObj(){for(var i=0;i<HOTELS.length;i++)if(HOTELS[i].id===state.it.hotel)return HOTELS[i];}
function pd(iso){var p=iso.split('-');return new Date(+p[0],+p[1]-1,+p[2]);}
function dmy(d){return ('0'+d.getDate()).slice(-2)+'/'+('0'+(d.getMonth()+1)).slice(-2)+'/'+d.getFullYear();}
var DAYN=['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];
var DLEN=[9.7,10.7,11.9,13.1,14.2,14.8,14.5,13.5,12.3,11.1,10.0,9.5];
function sunsetMin(d){var L=DLEN[d.getMonth()];return Math.round((12.67+L/2)*60);}
function hhmm(m){m=Math.round(m/5)*5;return ('0'+Math.floor(m/60)%24).slice(-2)+':'+('0'+(m%60)).slice(-2);}
function transfer(a,b){return (TAXI[a]&&TAXI[a][b])||(a===b?5:25);}

function viewItin(){
  var s=state.it;
  function sel(id,opts,val){return '<select data-itf="'+id+'">'+opts.map(function(o){return '<option value="'+o[0]+'"'+(String(val)===String(o[0])?' selected':'')+'>'+o[1]+'</option>';}).join('')+'</select>';}
  function num(id,min,max){return '<input type="number" data-itf="'+id+'" min="'+min+'" max="'+max+'" value="'+s[id]+'" inputmode="numeric">';}
  var hotelOpts=[['area:old','עדיין לא בחרתי: העיר העתיקה'],['area:sea','עדיין לא בחרתי: הטיילת והים'],['area:center','עדיין לא בחרתי: מרכז העיר'],['area:hill','עדיין לא בחרתי: הגבעה (נוף)']].concat(HOTELS.map(function(x){return [x.id,x.n+' ('+x.stars+'★)'];}));
  var h='<h2 class="first">מסלולים מומלצים</h2><div class="mute small">ענו על כמה שאלות והמסלול יותאם לכם: מי מטייל, איפה המלון, כמה ללכת ומה מעניין אתכם.</div>';
  h+='<div class="card wiz">'+
   '<div class="grid2"><div><label>כמה ימים</label>'+sel('days',[1,2,3,4,5,6,7,8,9,10].map(function(n){return [n,n+(n===1?' יום':' ימים')];}),s.days)+'</div><div><label>תאריך הגעה</label><input type="date" data-itf="start" value="'+esc(s.start)+'"></div></div>'+
   '<div class="grid3"><div><label>מבוגרים</label>'+num('adults',1,10)+'</div><div><label>ילדים</label>'+num('kids',0,8)+'</div><div><label>מבוגרים 65+</label>'+num('seniors',0,10)+'</div></div>'+
   (s.kids>0?'<label>גיל הילדים</label>'+sel('kidAge',[['u6','עד גיל 6 (גם עגלה)'],['6_12','6 עד 12'],['teen','נוער']],s.kidAge):'')+
   '<label>המלון או אזור הלינה</label>'+sel('hotel',hotelOpts,s.hotel)+
   '<div class="grid2"><div><label>קצב הטיול</label>'+sel('pace',[['relaxed','רגוע'],['normal','רגיל'],['full','עמוס']],s.pace)+'</div><div><label>נוחות הליכה ועליות</label>'+sel('walk',[['low','מעדיפים מעט הליכה, בלי עליות'],['mid','סביר'],['high','אין בעיה']],s.walk)+'</div></div>'+
   '<div class="grid2"><div><label>אופי הביקור</label>'+sel('visit',[['couple','זוג'],['family','משפחה עם ילדים'],['friends','חברים'],['solo','לבד'],['seniors','קבוצת גיל הזהב']],s.visit)+'</div><div><label>תקציב</label>'+sel('budget',[['eco','חסכוני'],['mid','בינוני'],['lux','גבוה']],s.budget)+'</div></div>'+
   '<div class="grid2"><div><label>הגעה ביום הראשון</label>'+sel('arrive',[['morning','בבוקר'],['afternoon','אחר הצהריים'],['evening','בערב']],s.arrive)+'</div><div><label>יציאה ביום האחרון</label>'+sel('depart',[['morning','בבוקר'],['afternoon','אחר הצהריים'],['evening','בערב']],s.depart)+'</div></div>'+
   '<label>מגבלות תנועה</label>'+sel('mobility',[['none','אין'],['stroller','עגלת ילדים'],['limited','קושי בהליכה או במדרגות'],['wheelchair','כיסא גלגלים']],s.mobility)+
   '<label>מה מעניין אתכם (אפשר לבחור כמה)</label><div class="chips wrapchips">'+IT_INT.map(function(i){return '<button type="button" class="chip'+(s.interests.indexOf(i[0])>=0?' on':'')+'" data-it="'+i[0]+'">'+i[1]+'</button>';}).join('')+'</div>'+
   '<button class="btn big" data-itgen="1">✨ בנו לי מסלול</button></div>';
  h+='<div id="itout">'+(state.itOut?renderItin(state.itOut):'')+'</div>';
  return h;
}
function itField(el){
  var k=el.dataset.itf,v=el.value;
  if(el.type==='number'){v=Math.max(+el.min,Math.min(+el.max,parseInt(v,10)||0));}
  else if(k==='days')v=+v;
  state.it[k]=v;store.set('it',state.it);
  if(k==='kids'||k==='visit'){/* מציג שאלת גיל כשיש ילדים */var o=state.itOut;render();state.itOut=o;}
}
function itToggle(btn){
  var k=btn.dataset.it,a=state.it.interests,i=a.indexOf(k);
  if(i>=0)a.splice(i,1);else a.push(k);
  btn.classList.toggle('on');store.set('it',state.it);
}
function itAfter(){}
function itinAfter(){}

/* ניקוד אתר לפי הנוסעים */
function scoreSight(x){
  var s=state.it,sc=3,why=[];
  var young=s.kids>0&&s.kidAge==='u6', kidsAny=s.kids>0||s.visit==='family';
  var tagMap={photo:['photo','views'],history:['history'],food:['food'],shopping:['shopping'],nature:['nature'],culture:['culture','religion'],romance:['romance','views'],night:['night'],relax:['relax']};
  s.interests.forEach(function(i){(tagMap[i]||[]).forEach(function(t){if(x.tags.indexOf(t)>=0)sc+=1.5;});});
  if(kidsAny){sc+=(x.kids-1)*1.5;if(young&&x.kids===0)sc-=3;}
  if(s.visit==='romance'||s.interests.indexOf('romance')>=0)if(x.tags.indexOf('romance')>=0)sc+=1;
  var lowWalk=s.walk==='low'||s.visit==='seniors'||s.seniors>0||s.mobility==='limited'||s.mobility==='wheelchair'||s.mobility==='stroller'||young;
  if(lowWalk){sc-=(x.eff-1)*1.2;}
  if(s.mobility==='wheelchair'&&(x.id==='old'||x.id==='maiden'||x.id==='palace'))sc-=3;
  if(s.mobility==='stroller'||young){if(x.id==='maiden')sc-=2;}
  if(['old','maiden','sea','flame','hac'].indexOf(x.id)>=0)sc+=1.5; /* האתרים המזוהים ביותר עם העיר */
  if(x.area==='out'){sc-=1;if(s.days<3)sc-=3;if(s.interests.indexOf('nature')>=0||s.interests.indexOf('history')>=0)sc+=1.5;if(young||s.mobility!=='none')sc-=1;}
  return sc;
}
function dayCapacity(i,n,start,out){
  var s=state.it,pace=s.pace,startMin=pace==='full'?9*60:pace==='relaxed'?10.5*60:10*60,endMin=pace==='full'?20*60:pace==='relaxed'?17.5*60:19*60;
  var note='';
  if(i===0){var a=s.arrive;var m=a==='morning'?11*60:a==='afternoon'?15*60:19*60;if(n>1||a==='evening'){startMin=Math.max(startMin,m);}}
  if(i===n-1&&n>1){var d=s.depart;if(d==='morning'){endMin=startMin;note='יום יציאה: הכינו זמן לארוז ולהגיע לשדה. אפשר לצאת לקפה ליד המלון.';}else if(d==='afternoon')endMin=Math.min(endMin,13*60);else endMin=Math.min(endMin,17*60);}
  var cap=Math.max(0,(endMin-startMin)/60);
  if(i===0&&cap<1.2&&!note)note='יום הגעה: התמקמות במלון, ארוחת ערב וטיול קצר ושטוח בטיילת.';
  if(cap>6)cap-=1; /* ארוחת צהריים */
  return {start:startMin,end:endMin,cap:cap,note:note};
}
function pickRest(areaKey,day){
  var s=state.it,lv=s.budget==='eco'?[1,2]:s.budget==='lux'?[3,2]:[2,3];
  var near={old:['icher'],sea:['sahil'],center:['sahil','28may'],hill:['sahil'],hac:['narimanov','sahil']}[areaKey]||['sahil'];
  var c=C.restaurants.filter(function(r){return near.indexOf(r.st)>=0&&r.level<=(s.budget==='lux'?3:s.budget==='eco'?2:3);});
  if(!c.length)c=C.restaurants;
  c.sort(function(a,b){var pa=lv.indexOf(a.level),pb=lv.indexOf(b.level);return (pa<0?9:pa)-(pb<0?9:pb);});
  return c[day%c.length];
}
function itGenerate(){
  if(typeof loadWeather==='function'&&!(window._lastWx&&window._lastWx.d))try{loadWeather();}catch(e){}
  var s=state.it,n=s.days,startD=pd(s.start);
  var young=s.kids>0&&s.kidAge==='u6';
  var cands=(window.poolSights?poolSights():C.sights).map(function(x){return {x:x,sc:scoreSight(x),cl:clusterOf(x)};}).filter(function(c){return c.sc>1.5;});
  var cl={};cands.forEach(function(c){(cl[c.cl]=cl[c.cl]||[]).push(c);});
  var cls=Object.keys(cl).map(function(k){
    var arr=cl[k].sort(function(a,b){return ORDER[k].indexOf(a.x.id)-ORDER[k].indexOf(b.x.id);});
    var tot=arr.reduce(function(a,c){return a+c.sc;},0),time=arr.reduce(function(a,c){return a+c.x.dur;},0);
    return {k:k,arr:arr,tot:tot,time:time,avg:tot/arr.length};
  });
  cls.sort(function(a,b){return b.avg-a.avg;});
  var hk=hotelAreaKey();
  /* מתחילים באזור הקרוב למלון כדי לחסוך נסיעות */
  cls.sort(function(a,b){var pa=(a.k===hk?1:0),pb=(b.k===hk?1:0);return (b.avg+pb*0.8)-(a.avg+pa*0.8);});
  var days=[];for(var i=0;i<n;i++){var c=dayCapacity(i,n);days.push({i:i,date:new Date(startD.getTime()+i*86400000),cap:c.cap,start:c.start,end:c.end,note:c.note,items:[],used:0,area:null});}
  var dropped=[];
  var di=0;
  cls.forEach(function(g){
    var queue=g.arr.slice();
    while(queue.length){
      var d=days[di];
      if(d&&d.cap<1.2){di++;continue;}
      if(!d){queue.forEach(function(q){dropped.push(q.x);});queue=[];break;}
      var cur=queue[0],extra=d.items.length?transfer(d.area||g.k,g.k)/60:0;
      var out=g.k==='abs'||g.k==='gob';
      if(out&&d.items.length&&d.items[0].cl!==g.k){di++;continue;}
      if(d.used+extra+cur.x.dur<=d.cap+0.25||(!d.items.length&&d.cap>=1.2&&!out)){
        d.items.push({x:cur.x,cl:g.k});d.used+=cur.x.dur+extra+(out&&d.items.length===0?2:0);d.area=g.k;queue.shift();
      }else if(!d.items.length){queue.shift();dropped.push(cur.x);}
      else di++;
    }
    /* אחרי אשכול רחוק, ממשיכים ליום הבא */
    if(g.k==='abs'||g.k==='gob')di++;
  });
  /* סדר ובניית ציר זמן */
  var sun=sunsetMin(startD);
  days.forEach(function(d){
    d.sun=sunsetMin(d.date);
    d.items.sort(function(a,b){return (a.x.tags.indexOf('night')>=0?1:0)-(b.x.tags.indexOf('night')>=0?1:0);});
    var t=d.start,prev=hk,lunch=false;
    d.timeline=[];
    d.items.forEach(function(it,ix){
      var legMin=transfer(prev,it.cl);
      if(it.cl==='abs'||it.cl==='gob')legMin=transfer(prev,it.cl);
      if(ix===0&&it.cl===hk)legMin=Math.min(legMin,10);
      if(ix>0&&it.cl===prev)legMin=10;
      var mode=legMin>12||s.walk==='low'||s.mobility!=='none'||young||s.seniors>0?'מונית (Bolt או Yango)':'ברגל או במונית קצרה';
      t+=legMin;
      if(!lunch&&t>=12.75*60&&d.cap>4){d.timeline.push({lunch:true,t:t,rest:pickRest(prev,d.i)});t+=60;lunch=true;}
      var tm=t;t+=it.x.dur*60;
      d.timeline.push({x:it.x,t:tm,end:t,leg:legMin,mode:mode,cl:it.cl,from:prev,first:ix===0,late:tm>d.sun-30&&it.x.tags.indexOf('night')<0&&it.x.area!=='out'});
      prev=it.cl;
    });
    if(!lunch&&d.cap>4&&d.items.length)d.timeline.push({lunch:true,t:t,rest:pickRest(prev,d.i)});
    d.dinner=pickRest(d.area||hk,d.i+1);
    d.endT=t;
  });
  state.itOut={days:days,dropped:dropped,hk:hk,hotel:hotelObj(),sets:JSON.parse(JSON.stringify(s)),gen:dmy(new Date())};
  var o=$('#itout');if(o){o.innerHTML=renderItin(state.itOut);o.scrollIntoView({behavior:'smooth'});}
}
function renderItin(o){
  var s=o.sets,h='';
  var summ=s.adults+' מבוגרים'+(s.kids?', '+s.kids+' ילדים':'')+(s.seniors?', מתוכם '+s.seniors+' בני 65+':'');
  var start=pd(s.start),endD=new Date(start.getTime()+(s.days-1)*86400000);
  h+='<div class="card sumcard"><h3>המסלול שלכם</h3><div class="small">'+esc(summ)+' · '+s.days+' ימים · '+dmy(start)+(s.days>1?' – '+dmy(endD):'')+'</div><div class="small">לינה: '+esc(o.hotel?o.hotel.n:('אזור '+AREAS[o.hk]))+'</div></div>';
  var notes=[];
  var m=start.getMonth();
  if(m>=10||m<=2)notes.push('בחורף האור קצר: שקיעה בערך ב‑'+hhmm(sunsetMin(start))+'. תכננו אתרים חיצוניים לשעות היום, ונקודות תצפית ולילה לסוף היום. כדאי לקחת מעיל.');
  if(m>=5&&m<=8)notes.push('בקיץ חם מאוד בצהריים: מתכננים הליכה בבוקר או אחר הצהריים מאוחר.');
  if(s.kids>0&&s.kidAge==='u6')notes.push('עם ילדים קטנים הורדתי אתרים עם מדרגות רבות וקצב הליכה ארוך, והוספתי הפסקות.');
  if(s.walk==='low'||s.seniors>0||s.mobility!=='none')notes.push('התאמתי להליכה מועטה: ברוב המעברים מומלצת מונית. את הגבעה (מגדלי הלהבה) כדאי לעלות במונית או בפוניקולר.');
  if(s.mobility==='wheelchair')notes.push('העיר העתיקה משופעת ומרוצפת באבן ולכן קשה לכיסא גלגלים. אין לי מידע מאומת על נגישות כל אתר, כדאי לבדוק מראש.');
  if(o.hk==='hill')notes.push('המלון על הגבעה: כל יציאה היא עם מונית, לכן תכננתי פחות מעברים ביום.');
  notes.push('שעות הפתיחה והמחירים משוערים. מוזיאונים וחלק מהאתרים סגורים בימי שני.');
  h+='<div class="card tipbox">'+ul(notes)+'</div>';
  o.days.forEach(function(d){
    var wxLine='';
    try{
      var wx=window._lastWx&&window._lastWx.d;
      if(wx&&wx.time){
        var iso=d.date.getFullYear()+'-'+('0'+(d.date.getMonth()+1)).slice(-2)+'-'+('0'+d.date.getDate()).slice(-2);
        var wi=wx.time.indexOf(iso);
        if(wi>=0){
          var WXmap=window.WX||{0:['☀️','בהיר'],1:['🌤️','בהיר ברובו'],2:['⛅','מעונן חלקית'],3:['☁️','מעונן'],61:['🌧️','גשם'],63:['🌧️','גשם'],80:['🌦️','ממטרים'],95:['⛈️','סערה']};
          var w=WXmap[wx.weather_code[wi]]||['🌡️',''];
          wxLine='<div class="small" style="margin:4px 0 8px">'+w[0]+' '+esc(w[1])+' · מקס '+Math.round(wx.temperature_2m_max[wi])+'° / מינ '+Math.round(wx.temperature_2m_min[wi])+'°'+(wx.precipitation_sum[wi]>=1?' · ☔ '+Math.round(wx.precipitation_sum[wi])+' מ״מ':'')+'</div>';
        }
      }
    }catch(e){}
    h+='<div class="card dayc"><div class="dayh"><span class="dn">יום '+(d.i+1)+'</span><span>יום '+DAYN[d.date.getDay()]+', '+dmy(d.date)+'</span></div>'+wxLine;
    if(d.note)h+='<div class="small mute">'+esc(d.note)+'</div>';
    if(!d.timeline.length&&!d.note)h+='<div class="small mute">יום חופשי: מנוחה, קניות או בית קפה. אפשר להחליט במקום.</div>';
    var firstLeg=d.timeline.filter(function(z){return z.x;})[0];
    d.timeline.forEach(function(z){
      if(z.lunch){h+='<div class="tl meal"><span class="tm">'+hhmm(z.t)+'</span><div class="tb"><b>🍴 ארוחת צהריים</b><div class="small">הצעה: '+esc(z.rest.n)+' · '+esc(z.rest.cat)+' ('+esc(z.rest.area)+')</div></div></div>';return;}
      var x=z.x;
      h+='<div class="tl"><span class="tm">'+hhmm(z.t)+'</span><div class="tb">'+
       (z.leg>0&&!z.first?'<div class="leg small mute">'+(z.leg<=10?'🚶 ':'🚕 ')+'עד '+z.leg+' דקות, '+esc(z.mode)+'</div>':'')+
       (z.first&&z.leg>0?'<div class="leg small mute">🚕 מהמלון: כ‑'+z.leg+' דקות, '+esc(z.mode)+'</div>':'')+
       '<div class="row" data-sight="'+x.id+'" style="cursor:pointer"><div class="thumb">'+ART.svg(x.art,x.col)+'</div><div class="grow"><b>'+esc(x.he)+'</b><div class="ltr small mute">'+esc(x.en)+' · '+esc(x.az)+'</div><div class="small">כ‑'+x.dur+' שעות · '+esc(effTxt(x.eff).split(' (')[0])+'</div></div></div>'+
       (x.tip?'<div class="small mute">💡 '+esc(x.tip)+'</div>':'')+(z.late?'<div class="small warnt">⚠️ בשעה הזו כבר עלול להיות חשוך. אפשר להקדים.</div>':'')+
       (z.first&&x.st&&o.hotel&&o.hotel.st&&o.hotel.st!==x.st&&SBY[x.st]&&SBY[o.hotel.st]?'<div class="small"><button class="pill btnlike" data-from="s:'+o.hotel.st+'">🚇 אפשר גם מטרו: מ'+esc(SBY[o.hotel.st].he)+'</button></div>':'')+
       '</div></div>';
    });
    if(d.dinner&&(d.items.length||d.i===0))h+='<div class="tl meal"><span class="tm">'+hhmm(Math.max(d.endT+30,19*60))+'</span><div class="tb"><b>🌙 ארוחת ערב וטיול ערב</b><div class="small">הצעה: '+esc(d.dinner.n)+' · '+esc(d.dinner.cat)+'. אחר כך טיול רגוע בכיכר המזרקות או בטיילת (שטוח).</div></div></div>';
    h+='</div>';
  });
  if(o.dropped.length)h+='<div class="card small"><b>לא נכנסו בגלל מספר הימים:</b> '+o.dropped.map(function(x){return esc(x.he);}).join(', ')+'. אפשר להוסיף יום, או לשנות את תחומי העניין.</div>';
  h+='<div class="card small"><b>אם יורד גשם:</b> מרכזי קניות (Park Bulvar, Port Baku, Deniz Mall), מרכז היידר אלייב, מוזיאון השטיחים, בתי קפה בעיר העתיקה וספא במלון.</div>';
  h+='<div class="row wrap"><button class="btn sec" data-itcopy="1">📋 העתקת המסלול</button><button class="btn sec" data-itgen="1">🔄 בנייה מחדש</button></div>';
  h+='<div class="foot">המסלול הוא הצעה לפי כללים פשוטים (קרבה בין אתרים, זמן ביקור, מאמץ והרכב הנוסעים). זמני הנסיעה משוערים.</div>';
  return h;
}
function itCopy(){
  var o=state.itOut;if(!o)return;
  var t='מסלול לבאקו\n';
  o.days.forEach(function(d){
    t+='\nיום '+(d.i+1)+' ('+dmy(d.date)+')\n';
    d.timeline.forEach(function(z){t+=(z.lunch?hhmm(z.t)+' ארוחת צהריים: '+z.rest.n:hhmm(z.t)+' '+z.x.he+' / '+z.x.en)+'\n';});
    if(d.dinner&&d.items.length)t+='ערב: '+d.dinner.n+'\n';
  });
  var done=function(){toast('המסלול הועתק.');};
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(done,function(){toast('לא הצלחתי להעתיק.');});
  else toast('ההעתקה לא נתמכת במכשיר זה.');
}
