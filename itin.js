/* מסלולים מומלצים לפי מספר ימים והרכב הנוסעים */
function todayISO(){var d=new Date();return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);}
var IT_DEF={days:3,start:'',adults:2,kids:0,kidAge:'6_12',seniors:0,hotel:'fs',pace:'normal',walk:'mid',visit:'couple',budget:'mid',mobility:'none',arrive:'afternoon',depart:'afternoon',interests:[]};
state.it=Object.assign({},IT_DEF,store.get('it',{}));
if(!state.it.start)state.it.start=todayISO();
state.itOut=store.get('itOut',null);
if(state.itOut&&state.itOut.days){state.itOut.days.forEach(function(d){if(typeof d.date==='string')d.date=new Date(d.date);});}
state.itSaved=store.get('itSaved',[]); /* [{id,name,saved,data}] */
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
  var h=state.it.hotel||'';
  if(h.indexOf('area_st:')===0){
    var st=h.slice(8);
    var map={icher:'old',sahil:'sea',jafar:'center','28may':'center',narimanov:'hac'};
    return map[st]||'sea';
  }
  if(h.indexOf('area:')===0){
    var a=h.replace('area:','');
    return HM[a]||a||'sea';
  }
  return AREA_OF_HOTEL[h]||'sea';
}
function hotelLabel(){
  var h=state.it.hotel||'';
  if(h.indexOf('area_st:')===0){var st=h.slice(8);return 'קרוב לתחנת '+(SBY[st]?SBY[st].he:st);}
  if(h.indexOf('area:')===0){var a=h.replace('area:','');return 'אזור '+(AREAS[a]||a);}
  var ho=hotelObj();return ho?ho.n:h;
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
  function sel(id,opts,val){return '<select data-itf="'+id+'">'+opts.map(function(o){var dis=!o[0]&&String(o[1]).indexOf('──')===0;return '<option value="'+o[0]+'"'+(dis?' disabled':'')+(String(val)===String(o[0])&&o[0]?' selected':'')+'>'+o[1]+'</option>';}).join('')+'</select>';}
  function num(id,min,max){return '<input type="number" data-itf="'+id+'" min="'+min+'" max="'+max+'" value="'+s[id]+'" inputmode="numeric">';}
  function stName(id){var st=SBY&&SBY[id];return st?st.he:id;}
  var hotelOpts=[];
  hotelOpts.push(['','── אזורים ──']);
  hotelOpts.push(['area:old','אזור: העיר העתיקה']);
  hotelOpts.push(['area:sea','אזור: הטיילת והים']);
  hotelOpts.push(['area:center','אזור: מרכז העיר']);
  hotelOpts.push(['area:hill','אזור: הגבעה (נוף)']);
  hotelOpts.push(['','── לפי תחנת מטרו ──']);
  var bySt={};HOTELS.forEach(function(x){if(!x.st)return;(bySt[x.st]=bySt[x.st]||[]).push(x);});
  Object.keys(bySt).forEach(function(st){
    hotelOpts.push(['area_st:'+st,'קרוב לתחנה: '+stName(st)]);
  });
  hotelOpts.push(['','── מלונות מומלצים ──']);
  HOTELS.forEach(function(x){
    var sn=x.st?(' · מטרו '+stName(x.st)):'';
    hotelOpts.push([x.id,x.n+' ('+x.stars+'★) · '+esc(x.area||'')+sn]);
  });
  var h='<h2 class="first">מסלולים מומלצים</h2><div class="mute small">ענו על כמה שאלות והמסלול יותאם לכם. אפשר לשמור, לערוך, לשנות תחבורה ולצרף קישורים.</div>';
  if(state.itSaved&&state.itSaved.length){
    h+='<div class="card"><b>📁 מסלולים שמורים</b><div class="small mute">טעינה או מחיקה</div>';
    state.itSaved.forEach(function(sv,i){
      h+='<div class="row" style="margin-top:8px;gap:8px;align-items:center;flex-wrap:wrap"><button class="btn sm grow" data-itload="'+i+'" style="text-align:start">📂 '+esc(sv.name)+' <span class="mute small">('+esc(sv.saved)+')</span></button><button class="btn sm sec" data-itdel="'+i+'" type="button">🗑️ מחק</button></div>';
    });
    h+='</div>';
  }
  h+='<div class="card wiz">'+
   '<div class="grid2"><div><label>כמה ימים</label>'+sel('days',[1,2,3,4,5,6,7,8,9,10].map(function(n){return [n,n+(n===1?' יום':' ימים')];}),s.days)+'</div>'+
   '<div><label>תאריך הגעה</label><div class="datepick"><span class="dateico" aria-hidden="true">📅</span><input type="date" data-itf="start" value="'+esc(s.start)+'" lang="he-IL" min="2024-01-01" max="2035-12-31" title="בחירת תאריך"></div><div class="mute small" style="margin-top:4px">'+esc(s.start?dmy(pd(s.start)):'')+'</div></div></div>'+
   '<div class="grid3"><div><label>מבוגרים</label>'+num('adults',1,10)+'</div><div><label>ילדים</label>'+num('kids',0,8)+'</div><div><label>מבוגרים 65+</label>'+num('seniors',0,10)+'</div></div>'+
   (s.kids>0?'<label>גיל הילדים</label>'+sel('kidAge',[['u6','עד גיל 6 (גם עגלה)'],['6_12','6 עד 12'],['teen','נוער']],s.kidAge):'')+
   '<label>המלון / אזור לינה / קרבה לתחנה</label>'+sel('hotel',hotelOpts,s.hotel)+
   '<div class="mute small">אפשר לבחור אזור כללי, קרבה לתחנת מטרו, או מלון ספציפי מהרשימה.</div>'+
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
      var modeKey=legMin>12||s.walk==='low'||s.mobility!=='none'||young||s.seniors>0?'taxi':'walk';
      var mode=modeKey==='taxi'?'מונית (Bolt או Yango)':'ברגל או במונית קצרה';
      t+=legMin;
      if(!lunch&&t>=12.75*60&&d.cap>4){d.timeline.push({lunch:true,t:t,rest:pickRest(prev,d.i)});t+=60;lunch=true;}
      var tm=t;t+=it.x.dur*60;
      d.timeline.push({x:it.x,t:tm,end:t,leg:legMin,mode:mode,modeKey:modeKey,cl:it.cl,from:prev,first:ix===0,late:tm>d.sun-30&&it.x.tags.indexOf('night')<0&&it.x.area!=='out'});
      prev=it.cl;
    });
    if(!lunch&&d.cap>4&&d.items.length)d.timeline.push({lunch:true,t:t,rest:pickRest(prev,d.i)});
    d.dinner=pickRest(d.area||hk,d.i+1);
    d.endT=t;
  });
  state.itOut={days:days,dropped:dropped,hk:hk,hotel:hotelObj(),hotelLabel:hotelLabel(),links:[],sets:JSON.parse(JSON.stringify(s)),gen:dmy(new Date())};
  itPersistOut();
  var o=$('#itout');if(o){o.innerHTML=renderItin(state.itOut);o.scrollIntoView({behavior:'smooth'});}
}
function renderItin(o){
  var s=o.sets,h='';
  var summ=s.adults+' מבוגרים'+(s.kids?', '+s.kids+' ילדים':'')+(s.seniors?', מתוכם '+s.seniors+' בני 65+':'');
  var start=pd(s.start),endD=new Date(start.getTime()+(s.days-1)*86400000);
  h+='<div class="card sumcard"><h3>המסלול שלכם</h3><div class="small">'+esc(summ)+' · '+s.days+' ימים · '+dmy(start)+(s.days>1?' – '+dmy(endD):'')+'</div><div class="small">לינה: '+esc(o.hotelLabel||(o.hotel?o.hotel.n:('אזור '+(AREAS[o.hk]||o.hk))))+'</div></div>';
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
    h+='<div class="card dayc"><div class="dayh"><span class="dn">יום '+(d.i+1)+'</span><span><b>'+DAYN[d.date.getDay()]+'</b> · '+dmy(d.date)+'</span></div>'+(wxLine||'<div class="small mute" style="margin:4px 0 8px">🌤️ אין תחזית לתאריך זה (רק לימים הקרובים)</div>');
    if(d.note)h+='<div class="small mute">'+esc(d.note)+'</div>';
    if(!d.timeline.length&&!d.note)h+='<div class="small mute">יום חופשי: מנוחה, קניות או בית קפה. אפשר להחליט במקום.</div>';
    var firstLeg=d.timeline.filter(function(z){return z.x;})[0];
    var itemIdx=0;
    d.timeline.forEach(function(z){
      if(z.lunch){h+='<div class="tl meal"><span class="tm">'+hhmm(z.t)+'</span><div class="tb"><b>🍴 ארוחת צהריים</b><div class="small">הצעה: '+esc(z.rest.n)+' · '+esc(z.rest.cat)+' ('+esc(z.rest.area)+')</div></div></div>';return;}
      var x=z.x, myIdx=itemIdx++;
      var modes=[['walk','🚶 ברגל'],['taxi','🚕 מונית (Bolt/Yango)'],['transit','🚇 תחבורה ציבורית'],['mix','🚕+🚶 משולב']];
      var modeSel='<select data-itmode="'+d.i+':'+myIdx+'" class="modesel">'+modes.map(function(m){return '<option value="'+m[0]+'"'+( (z.modeKey||'')===m[0] || (!z.modeKey && ((z.mode||'').indexOf('מונית')>=0?m[0]==='taxi':(z.mode||'').indexOf('ברגל')>=0?m[0]==='walk':m[0]==='taxi')) ?' selected':'')+'>'+m[1]+'</option>';}).join('')+'</select>';
      h+='<div class="tl"><span class="tm">'+hhmm(z.t)+'</span><div class="tb">'+
       ((z.leg>0||z.first)?'<div class="leg small" style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:4px"><span class="mute">הגעה:</span> '+modeSel+(z.leg?'<span class="mute">· כ‑'+z.leg+' דק\'</span>':'')+'</div>':'')+
       '<div class="row"><div class="row grow" data-sight="'+x.id+'" style="cursor:pointer;min-width:0"><div class="thumb">'+ART.svg(x.art,x.col)+'</div><div class="grow"><b>'+esc(x.he)+'</b><div class="ltr small mute">'+esc(x.en)+' · '+esc(x.az)+'</div><div class="small">כ‑'+x.dur+' שעות · '+esc(effTxt(x.eff).split(' (')[0])+'</div></div></div>'+
       '<button class="btn sm sec" data-itrm="'+d.i+':'+myIdx+'" title="הסר מהמסלול" type="button">✕</button></div>'+
       (x.tip?'<div class="small mute">💡 '+esc(x.tip)+'</div>':'')+(z.late?'<div class="small warnt">⚠️ בשעה הזו כבר עלול להיות חשוך. אפשר להקדים.</div>':'')+
       (z.first&&x.st&&o.hotel&&o.hotel.st&&o.hotel.st!==x.st&&SBY[x.st]&&SBY[o.hotel.st]?'<div class="small"><button class="pill btnlike" data-from="s:'+o.hotel.st+'">🚇 אפשר גם מטרו: מ'+esc(SBY[o.hotel.st].he)+'</button></div>':'')+
       '</div></div>';
    });
    if(d.dinner&&(d.items.length||d.i===0))h+='<div class="tl meal"><span class="tm">'+hhmm(Math.max(d.endT+30,19*60))+'</span><div class="tb"><b>🌙 ארוחת ערב וטיול ערב</b><div class="small">הצעה: '+esc(d.dinner.n)+' · '+esc(d.dinner.cat)+'. אחר כך טיול רגוע בכיכר המזרקות או בטיילת (שטוח).</div></div></div>';
    h+='<div class="row wrap" style="margin-top:10px"><button class="btn sm" data-itmap="'+d.i+'" type="button">🗺️ יום זה במפה</button></div>';
    h+='</div>';
  });
  h+='<div class="card"><b>🗺️ מפה ושיתוף</b><div class="row wrap" style="margin-top:8px">'+
    '<button class="btn" data-itmap="-1" type="button">🗺️ כל המסלול במפה</button>'+
    '<button class="btn sec" data-itprint="1" type="button">🖨️ הדפסה / PDF</button>'+
    '<button class="btn sec" data-itfile="1" type="button">⬇️ שמירה לקובץ</button>'+
    '<button class="btn sec" data-itshare="1" type="button">📤 שיתוף</button>'+
    '</div><div class="small mute" style="margin-top:6px">הדפסה: בחרו «שמירה כ‑PDF» בחלון ההדפסה. שיתוף עובד בטלפונים תומכים.</div></div>';
  if(o.dropped&&o.dropped.length)h+='<div class="card small"><b>לא נכנסו בגלל מספר הימים:</b> '+o.dropped.map(function(x){return esc(x.he);}).join(', ')+'. אפשר להוסיף יום, או לשנות את תחומי העניין.</div>';
  h+='<div class="card small"><b>אם יורד גשם:</b> מרכזי קניות (Park Bulvar, Port Baku, Deniz Mall), מרכז היידר אלייב, מוזיאון השטיחים, בתי קפה בעיר העתיקה וספא במלון.</div>';
  if(!o.links)o.links=[];
  h+='<div class="card"><b>🔗 קישורים למסמכים ותמונות</b><div class="small mute">הוסיפו קישור + תיאור (Google Drive, תמונות, PDF וכו\').</div>';
  o.links.forEach(function(L,li){
    h+='<div class="row" style="margin-top:8px;gap:8px;align-items:center;flex-wrap:wrap"><a class="btn sm grow" href="'+esc(L.url)+'" target="_blank" rel="noopener" style="text-align:start">'+esc(L.title||L.url)+'</a><button class="btn sm sec" data-itlinkdel="'+li+'" type="button">🗑️</button></div>';
  });
  h+='<div class="grid2" style="margin-top:10px"><div><label>תיאור</label><input type="text" id="itLinkTitle" placeholder="למשל: מפת מלון" style="width:100%;padding:10px;border-radius:10px;border:1px solid var(--line);background:var(--card);color:var(--ink);font-size:15px;font-family:inherit"></div><div><label>קישור (URL)</label><input type="url" id="itLinkUrl" placeholder="https://..." dir="ltr" style="width:100%;padding:10px;border-radius:10px;border:1px solid var(--line);background:var(--card);color:var(--ink);font-size:15px;font-family:inherit"></div></div>';
  h+='<button class="btn sm" data-itlinkadd="1" style="margin-top:8px" type="button">➕ הוסף קישור</button></div>';
  h+='<div class="card"><label>שם לשמירת המסלול</label><input type="text" id="itSaveName" placeholder="למשל: משפחה נובמבר" value="" style="width:100%;padding:10px;border-radius:10px;border:1px solid var(--line);background:var(--card);color:var(--ink);font-size:16px;font-family:inherit"><div class="row wrap" style="margin-top:10px"><button class="btn" data-itsave="1">💾 שמירת מסלול</button><button class="btn sec" data-itcopy="1">📋 העתקה</button><button class="btn sec" data-itgen="1">🔄 בנייה מחדש</button></div></div>';
  h+='<div class="foot">✕ מסיר אתר · מפה ליום או לכל המסלול · הדפסה ל‑PDF · שמירה ושיתוף.</div>';
  return h;
}
function itPersistOut(){try{store.set('itOut',state.itOut);}catch(e){}}
function itRemoveItem(dayI, itemI){
  var o=state.itOut;if(!o||!o.days[dayI])return;
  var d=o.days[dayI], count=0, newTl=[];
  d.timeline.forEach(function(z){
    if(z.lunch){newTl.push(z);return;}
    if(count===itemI){count++;return;}
    newTl.push(z);count++;
  });
  d.timeline=newTl;
  d.items=d.timeline.filter(function(z){return z.x;}).map(function(z){return {x:z.x,cl:z.cl};});
  itPersistOut();
  var el=$('#itout');if(el)el.innerHTML=renderItin(o);
  toast('הוסר מהמסלול');
}
function itSaveCurrent(){
  var o=state.itOut;if(!o){toast('אין מסלול לשמירה');return;}
  var name=(($('#itSaveName')||{}).value||'').trim();
  if(!name){toast('הקלידו שם למסלול');return;}
  state.itSaved=state.itSaved||[];
  /* שמירת תאריכים כמחרוזת ISO ליציבות */
  var copy=JSON.parse(JSON.stringify(o,function(k,v){if(v instanceof Date)return v.toISOString();return v;}));
  state.itSaved.unshift({id:'it_'+Date.now(),name:name,saved:dmy(new Date()),data:copy});
  if(state.itSaved.length>12)state.itSaved=state.itSaved.slice(0,12);
  store.set('itSaved',state.itSaved);
  toast('המסלול נשמר: '+name);
  render();
}
function itLoadSaved(i){
  var sv=(state.itSaved||[])[i];if(!sv)return;
  state.itOut=JSON.parse(JSON.stringify(sv.data));
  state.itOut.days.forEach(function(d){if(typeof d.date==='string')d.date=new Date(d.date);});
  itPersistOut();
  if(sv.data.sets){state.it=Object.assign({},state.it,sv.data.sets);store.set('it',state.it);}
  toast('נטען: '+sv.name);
  render();
  setTimeout(function(){var el=$('#itout');if(el)el.scrollIntoView({behavior:'smooth'});},80);
}
function itDeleteSaved(i){
  if(!state.itSaved||!state.itSaved[i])return;
  var n=state.itSaved[i].name;
  state.itSaved.splice(i,1);
  store.set('itSaved',state.itSaved);
  toast('נמחק: '+n);
  render();
}
function itSetMode(dayI,itemI,key){
  var o=state.itOut;if(!o||!o.days[dayI])return;
  var labels={walk:'ברגל',taxi:'מונית (Bolt או Yango)',transit:'תחבורה ציבורית',mix:'משולב'};
  var count=0;
  o.days[dayI].timeline.forEach(function(z){
    if(z.lunch)return;
    if(count===itemI){z.modeKey=key;z.mode=labels[key]||key;}
    count++;
  });
  itPersistOut();
}
function itAddLink(){
  var o=state.itOut;if(!o)return;
  var title=(($('#itLinkTitle')||{}).value||'').trim();
  var url=(($('#itLinkUrl')||{}).value||'').trim();
  if(!url){toast('הזינו קישור');return;}
  if(!/^https?:\/\//i.test(url))url='https://'+url;
  o.links=o.links||[];
  o.links.push({title:title||url,url:url});
  itPersistOut();
  var el=$('#itout');if(el)el.innerHTML=renderItin(o);
  toast('קישור נוסף');
}
function itDelLink(i){
  var o=state.itOut;if(!o||!o.links)return;
  o.links.splice(i,1);
  itPersistOut();
  var el=$('#itout');if(el)el.innerHTML=renderItin(o);
}
function itPlacesForDay(d){
  var places=[];
  var cache=(typeof geoCache==='function'?geoCache():store.get('geo',{}))||{};
  (d.timeline||[]).forEach(function(z){
    if(!z.x)return;
    var x=z.x;
    var ll=x.ll||cache['s'+x.id]||null;
    places.push({
      he:x.he, en:x.en||'', id:x.id,
      q:(x.q||x.en||x.he)+' Baku',
      ll:ll,
      t:z.t, mode:z.mode||'', modeKey:z.modeKey||''
    });
  });
  return places;
}
function itAllPlaces(dayI){
  var o=state.itOut;if(!o)return [];
  if(dayI>=0&&o.days[dayI])return itPlacesForDay(o.days[dayI]);
  var all=[];
  o.days.forEach(function(d){all=all.concat(itPlacesForDay(d));});
  return all;
}
function itGmapsUrl(places){
  if(!places.length)return null;
  function enc(p){return encodeURIComponent(p.ll? (p.ll[0]+','+p.ll[1]) : p.q);}
  if(places.length===1)return 'https://www.google.com/maps/search/?api=1&query='+enc(places[0]);
  var origin=enc(places[0]), dest=enc(places[places.length-1]);
  var wps=places.slice(1,-1).map(enc).join('|');
  return 'https://www.google.com/maps/dir/?api=1&origin='+origin+'&destination='+dest+(wps?'&waypoints='+wps:'')+'&travelmode=walking';
}
function itShowMap(dayI){
  var places=itAllPlaces(dayI);
  if(!places.length){toast('אין נקודות להצגה ביום זה');return;}
  state.itRoute={dayI:dayI,places:places,title:dayI>=0?('יום '+(dayI+1)):'כל המסלול'};
  store.set('itRoute',state.itRoute);
  var url=itGmapsUrl(places);
  if(url)window.open(url,'_blank','noopener');
  /* גם במפת האפליקציה */
  try{
    if(typeof go==='function'){
      state.focus=places[0].ll?{k:'s',id:places[0].id}:null;
      go('map');
      setTimeout(function(){itDrawRouteOnMap();},400);
    }
  }catch(e){}
  toast('נפתחה מפה: '+places.length+' נקודות · '+state.itRoute.title);
}
function itDrawRouteOnMap(){
  var r=state.itRoute;if(!r||!r.places||!window.L||!window.CM)return;
  try{
    if(window._itLayer){CM.removeLayer(window._itLayer);window._itLayer=null;}
    var layer=L.layerGroup();
    var latlngs=[];
    r.places.forEach(function(p,i){
      if(!p.ll)return;
      latlngs.push(p.ll);
      var m=L.marker(p.ll,{title:(i+1)+'. '+p.he}).bindPopup('<b>'+(i+1)+'. '+esc(p.he)+'</b><br>'+esc(p.en||'')+(p.mode?'<br>'+esc(p.mode):''));
      layer.addLayer(m);
    });
    if(latlngs.length>=2)layer.addLayer(L.polyline(latlngs,{color:'#E5195E',weight:4,opacity:0.85}));
    layer.addTo(CM);window._itLayer=layer;
    if(latlngs.length)CM.fitBounds(L.latLngBounds(latlngs).pad(0.2));
  }catch(e){}
}
function itTextFull(){
  var o=state.itOut;if(!o)return '';
  var t='מסלול לבאקו · יוצר: יעקב זוהר\n';
  t+='לינה: '+(o.hotelLabel||(o.hotel&&o.hotel.n)||'')+'\n';
  t+='נוצר: '+(o.gen||'')+'\n';
  o.days.forEach(function(d){
    var dd=d.date instanceof Date?d.date:new Date(d.date);
    t+='\n—— יום '+(d.i+1)+' · '+DAYN[dd.getDay()]+' · '+dmy(dd)+' ——\n';
    d.timeline.forEach(function(z){
      if(z.lunch){t+=hhmm(z.t)+' ארוחת צהריים: '+(z.rest&&z.rest.n||'')+'\n';return;}
      t+=hhmm(z.t)+' '+z.x.he+' / '+(z.x.en||'')+(z.mode?' · '+z.mode:'')+'\n';
    });
    if(d.dinner&&d.items&&d.items.length)t+='ערב: '+d.dinner.n+'\n';
  });
  if(o.links&&o.links.length){
    t+='\nקישורים:\n';
    o.links.forEach(function(L){t+='- '+(L.title||'')+': '+L.url+'\n';});
  }
  return t;
}
function itPrint(){
  var o=state.itOut;if(!o){toast('אין מסלול');return;}
  var html='<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><title>מסלול באקו</title>';
  html+='<style>body{font-family:system-ui,Segoe UI,Arial,sans-serif;padding:24px;color:#111;line-height:1.45;max-width:800px;margin:auto}h1{color:#7B2FF7}h2{margin-top:1.4em;border-bottom:2px solid #E5195E;padding-bottom:4px}.day{margin:18px 0;page-break-inside:avoid}.item{margin:6px 0 6px 12px}.t{color:#666;font-variant-numeric:tabular-nums}.mute{color:#666;font-size:14px}@media print{button{display:none}}</style></head><body>';
  html+='<h1>מסלול לבאקו</h1><div class="mute">יוצר: יעקב זוהר · לינה: '+esc(o.hotelLabel||(o.hotel&&o.hotel.n)||'')+'</div>';
  o.days.forEach(function(d){
    var dd=d.date instanceof Date?d.date:new Date(d.date);
    html+='<div class="day"><h2>יום '+(d.i+1)+' · '+DAYN[dd.getDay()]+' · '+dmy(dd)+'</h2>';
    d.timeline.forEach(function(z){
      if(z.lunch){html+='<div class="item"><span class="t">'+hhmm(z.t)+'</span> 🍴 ארוחת צהריים: '+esc(z.rest&&z.rest.n||'')+'</div>';return;}
      html+='<div class="item"><span class="t">'+hhmm(z.t)+'</span> <b>'+esc(z.x.he)+'</b> <span class="mute">'+esc(z.x.en||'')+'</span>'+(z.mode?' · '+esc(z.mode):'')+'</div>';
    });
    html+='</div>';
  });
  if(o.links&&o.links.length){
    html+='<h2>קישורים</h2><ul>';
    o.links.forEach(function(L){html+='<li>'+esc(L.title||'')+' — '+esc(L.url)+'</li>';});
    html+='</ul>';
  }
  html+='<p class="mute">להדפסה כ‑PDF: בחלון ההדפסה בחרו מדפסת «Save as PDF» / «שמירה כ‑PDF».</p>';
  html+='<script>window.onload=function(){setTimeout(function(){window.print();},200);}<\\/script></body></html>';
  var w=window.open('','_blank');
  if(!w){toast('יש לאפשר חלונות קופצים להדפסה');return;}
  w.document.write(html);w.document.close();
}
function itSaveFile(){
  var o=state.itOut;if(!o){toast('אין מסלול');return;}
  var text=itTextFull();
  var blob=new Blob([text],{type:'text/plain;charset=utf-8'});
  var a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='baku-itinerary-'+todayISO()+'.txt';
  document.body.appendChild(a);a.click();a.remove();
  setTimeout(function(){URL.revokeObjectURL(a.href);},1500);
  toast('הקובץ נשמר');
}
function itShare(){
  var o=state.itOut;if(!o){toast('אין מסלול');return;}
  var text=itTextFull();
  if(navigator.share){
    navigator.share({title:'מסלול באקו',text:text}).then(function(){toast('שותף');}).catch(function(){});
    return;
  }
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(function(){toast('הועתק ללוח – אפשר להדביק בוואטסאפ');});
    return;
  }
  toast('שיתוף לא נתמך – השתמשו בהעתקה או בשמירה לקובץ');
}
function itCopy(){
  var o=state.itOut;if(!o)return;
  var t=itTextFull();
  var done=function(){toast('המסלול הועתק.');};
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(done,function(){toast('לא הצלחתי להעתיק.');});
  else toast('ההעתקה לא נתמכת במכשיר זה.');
}
