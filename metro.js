'use strict';

/* ---------- נתונים ---------- */
var LINES = {
  red:    {n:'הקו האדום', c:'#E8212B'},
  green:  {n:'הקו הירוק', c:'#00A55A'},
  purple: {n:'הקו הסגול', c:'#8E177C'}
};

function st(id,he,az,lines,note,near){return {id:id,he:he,az:az,lines:lines,note:note||'',near:near||[]};}

var STATIONS = [
  st('icher','איצ׳רי שהר','İçərişəhər',['red'],'סוף הקו האדום. התחנה הנוחה ביותר לעיר העתיקה. היציאה היא מבנה זכוכית מודרני ליד חומות העיר.',
    ['העיר העתיקה (אתר אונסק״ו) – ממש ליד','מגדל הבתולה – כ‑3 עד 10 דקות הליכה','ארמון השירוואנשאים – כ‑10 דקות הליכה','הטיילת על שפת הים – ירידה קצרה מהחומות','ונציה הקטנה – 10 עד 15 דקות הליכה']),
  st('sahil','סאחיל','Sahil',['red'],'תחנה מרכזית לתיירים: מכאן יורדים לטיילת ולכיכר המזרקות.',
    ['הטיילת (Baku Boulevard) – כ‑5 דקות הליכה','ונציה הקטנה ומוזיאון השטיחים – לאורך הטיילת','כיכר המזרקות ורחוב ניזאמי – הליכה קצרה','מוזיאון ניזאמי לספרות אזרבייג׳ן – ליד כיכר המזרקות','מסעדות Dolma ו‑Firuze ברחוב ניזאמי']),
  st('28may','28 במאי','28 May',['red','green'],'צומת התחבורה הגדול של העיר: תחנת הרכבת המרכזית, אוטובוס H1 משדה התעופה ומעבר רגלי לתחנת ג׳עפר ג׳באר׳לי. כרגע אין רכבות בין התחנה הזו לניזאמי (ראו הודעת העבודות).',
    ['תחנת הרכבת המרכזית – ליד','גן Samad Vurgun – ליד (שם נמצאות עכשיו עצירות אוטובוסים)','כיכר המזרקות ורחוב ניזאמי – הליכה','אוטובוס H1 לשדה התעופה – יוצא מהאזור']),
  st('ganjlik','גנג׳ליק','Gənclik',['red'],'אזור קניות ואצטדיון.',
    ['קניון Ganjlik Mall','אצטדיון טופיק בהרמוב','אוטובוסי אקספרס M5 ו‑M6 לקו הירוק']),
  st('narimanov','נרימן נרימנוב','Nəriman Nərimanov',['red'],'תחנת פיצול: משם יוצא הענף הקצר לבקמיל.',
    ['מרכז היידר אלייב (הבניין של זהה חדיד) – הליכה של 10 עד 20 דקות לפי אחד המקורות, או מונית קצרה']),
  st('bakmil','בקמיל','Bakmil',['red'],'ענף קצר מנרימן נרימנוב. לפי מקור אחד הרכבת מגיעה לשם רק כ‑2 פעמים בשעה, כדאי לבדוק לפני שמגיעים.',
    ['אזור מגורים, אין אטרקציות עיקריות']),
  st('ulduz','אולדוז','Ulduz',['red'],'',['אזור מגורים ומסחר, אין אטרקציות עיקריות לתייר']),
  st('koroglu','קורוגלו','Koroğlu',['red'],'צומת אוטובוסים חשוב. אוטובוס H1 משדה התעופה עוצר כאן לפני 28 במאי.',
    ['עצירה של אוטובוס H1 משדה התעופה','אוטובוס אקספרס M4 לתחנת 20 בינואר']),
  st('garagarayev','קרה קראייב','Qara Qarayev',['red'],'',['אזור מגורים, אין אטרקציות עיקריות לתייר']),
  st('neftchilar','נפטצ׳ילר','Neftçilər',['red'],'',['אזור מגורים. התחנה מעוצבת בסגנון התקופה הסובייטית']),
  st('khalglar','חלקלר דוסטלוגו','Xalqlar Dostluğu',['red'],'',['אזור מגורים, אין אטרקציות עיקריות לתייר']),
  st('ahmedli','אחמדלי','Əhmədli',['red'],'',['אזור מגורים, אין אטרקציות עיקריות לתייר']),
  st('hazi','חאג׳י אסלנוב','Həzi Aslanov',['red'],'סוף הקו, בצד המזרחי של העיר.',['אזור תעשייה ומגורים, אין אטרקציות עיקריות']),
  st('nizami','ניזאמי','Nizami',['green'],'אחת התחנות היפות במערכת: פסיפסים ותאורה שנוצרו בהשראת המשורר ניזאמי גנג׳אווי. כרגע זו התחנה האחרונה בקו הירוק לכיוון מרכז העיר.',
    ['תחנה לצילום ולהתרשמות מהעיצוב','אוטובוסי אקספרס M2 ו‑M3 ל‑28 במאי']),
  st('elmlar','אלמלר אקדמיאסי','Elmlər Akademiyası',['green'],'',
    ['האקדמיה הלאומית למדעים','אוטובוסי אקספרס M1 ל‑28 במאי ו‑M6 לגנג׳ליק']),
  st('inshaatchilar','אינשאתצ׳ילר','İnşaatçılar',['green'],'',['אוטובוס אקספרס M2 ל‑28 במאי']),
  st('20yanvar','20 בינואר','20 Yanvar',['green'],'',['אוטובוסי אקספרס M3, M4 ו‑M5']),
  st('memar','מעמר אג׳אמי','Memar Əcəmi',['green','purple'],'תחנת החלפה בין הקו הירוק לקו הסגול. בשני הקווים התחנה נקראת באותו שם.',['החלפה לקו הסגול']),
  st('nasimi','נאסימי','Nəsimi',['green'],'',['אזור מגורים ומסחר']),
  st('azadliq','אזדליג פרוספקטי','Azadlıq Prospekti',['green'],'',['אזור מגורים ומסחר']),
  st('darnagul','דרנגול','Dərnəgül',['green'],'סוף הקו הירוק בצפון מערב העיר.',['אזור מגורים, אין אטרקציות עיקריות']),
  st('jafar','ג׳עפר ג׳באר׳לי','Cəfər Cabbarlı',['green'],'ליד תחנת הרכבת. מכאן יש מעבר רגלי פנימי אל תחנת 28 במאי. משם נוסעת רכבת קצרה (”שאטל“) אל חטאי.',
    ['מעבר רגלי לתחנת 28 במאי','תחנת הרכבת המרכזית – קרובה']),
  st('khatai','חטאי','Xətai',['green'],'סוף הקו הקצר מג׳עפר ג׳באר׳לי.',['מוזיאון לאמנות מודרנית (Museum of Modern Art)']),
  st('avtovagzal','אבטוואגזל','Avtovağzal',['purple'],'השם פירושו ”תחנת אוטובוסים“. הקו הסגול קצר (4 תחנות) והרכבות בו פחות תכופות, בקיץ 2026 כל כ‑8 דקות.',
    ['אזור התחנה המרכזית']),
  st('8noyabr','8 בנובמבר','8 Noyabr',['purple'],'',['אנדרטה ליום 8 בנובמבר (יום הניצחון) באזור התחנה']),
  st('khojasan','חוג׳סן','Xocəsən',['purple'],'סוף הקו הסגול, ליד מחסן הרכבות.',['אזור מגורים ותחזוקה, אין אטרקציות עיקריות'])
];
var SBY = {}; STATIONS.forEach(function(s){SBY[s.id]=s;});

/* מקומות מפורסמים -> תחנה קרובה */
var PLACES = [
  {id:'old',   he:'העיר העתיקה / מגדל הבתולה / ארמון השירוואנשאים', st:'icher', walk:'הליכה קצרה, 3 עד 10 דקות'},
  {id:'blvd',  he:'הטיילת / ונציה הקטנה / מוזיאון השטיחים',        st:'sahil', walk:'כ‑5 דקות הליכה (איצ׳רי שהר קרובה גם כן)'},
  {id:'fount', he:'כיכר המזרקות ורחוב ניזאמי',                      st:'sahil', walk:'הליכה קצרה'},
  {id:'hac',   he:'מרכז היידר אלייב',                                st:'narimanov', walk:'10 עד 20 דקות הליכה או מונית קצרה'},
  {id:'moma',  he:'מוזיאון לאמנות מודרנית',                          st:'khatai', walk:'ליד התחנה'},
  {id:'rail',  he:'תחנת הרכבת המרכזית',                              st:'28may', walk:'ליד התחנה'},
  {id:'bus',   he:'התחנה המרכזית לאוטובוסים',                        st:'avtovagzal', walk:'באזור התחנה'},
  {id:'flame', he:'מגדלי הלהבה (תצפית)',                             st:'sahil', walk:'מהטיילת עולים ברכבל או במונית'}
];

/* קשתות הגרף */
var BASE_EDGES = [];
function chain(line, arr){for(var i=0;i<arr.length-1;i++)BASE_EDGES.push({a:arr[i],b:arr[i+1],line:line,type:'rail',w:1});}
var RED = ['icher','sahil','28may','ganjlik','narimanov','ulduz','koroglu','garagarayev','neftchilar','khalglar','ahmedli','hazi'];
var GREEN = ['darnagul','azadliq','nasimi','memar','20yanvar','inshaatchilar','elmlar','nizami'];
var SHUTTLE = ['jafar','khatai'];
var PURPLE = ['memar','avtovagzal','8noyabr','khojasan'];
chain('red',RED); chain('red',['narimanov','bakmil']);
chain('green',GREEN); chain('green',SHUTTLE); chain('purple',PURPLE);
BASE_EDGES.push({a:'28may',b:'jafar',line:'walk',type:'walk',w:3,label:'מעבר רגלי פנימי בין שתי התחנות'});

var BUS_EDGES = [
  {a:'nizami',b:'28may',line:'bus',type:'bus',w:8,label:'M2 / M3'},
  {a:'inshaatchilar',b:'28may',line:'bus',type:'bus',w:8,label:'M2'},
  {a:'20yanvar',b:'28may',line:'bus',type:'bus',w:8,label:'M3'},
  {a:'elmlar',b:'28may',line:'bus',type:'bus',w:8,label:'M1'},
  {a:'20yanvar',b:'koroglu',line:'bus',type:'bus',w:8,label:'M4'},
  {a:'20yanvar',b:'ganjlik',line:'bus',type:'bus',w:8,label:'M5'},
  {a:'elmlar',b:'ganjlik',line:'bus',type:'bus',w:8,label:'M6'}
];
var AIR_EDGES = [
  {a:'airport',b:'28may',line:'bus',type:'bus',w:10,label:'H1',air:true},
  {a:'airport',b:'koroglu',line:'bus',type:'bus',w:9,label:'H1',air:true}
];
var DIRS = {
  red:    {chain:RED,    lo:'İçərişəhər (איצ׳רי שהר)', hi:'Həzi Aslanov (חאג׳י אסלנוב)'},
  green:  {chain:GREEN,  lo:'Dərnəgül (דרנגול)',        hi:'Nizami (ניזאמי)'},
  shuttle:{chain:SHUTTLE,lo:'Cəfər Cabbarlı (ג׳עפר ג׳באר׳לי)', hi:'Xətai (חטאי)'}
};

/* אתרים */
var SIGHTS = [
  {id:'old',e:'🏰',name:'העיר העתיקה (איצ׳רי שהר)',st:'icher',walk:'ביציאה מהתחנה',price:'כניסה חופשית לסמטאות',hrs:'פתוחה תמיד',time:'חצי יום',
   d:'מתחם מבוצר מימי הביניים, אתר אונסק״ו מאז שנת 2000. סמטאות אבן, שווקים קטנים, בתי תה ומסעדות. הכי נעים בבוקר מוקדם כשיש מעט אנשים.'},
  {id:'maiden',e:'🗼',name:'מגדל הבתולה',st:'icher',walk:'3 עד 10 דקות הליכה בתוך העיר העתיקה',price:'כ‑10 עד 15 ₼ (המקורות שונים)',hrs:'בערך 10:00 עד 18:00, בקיץ עד 19:00',time:'שעה עד שעה וחצי',
   d:'מגדל בן 8 קומות מהמאה ה‑12 עם מוזיאון ומרפסת גג. התצפית מלמעלה על הים ועל מגדלי הלהבה היא הסיבה העיקרית לעלות.'},
  {id:'palace',e:'🕌',name:'ארמון השירוואנשאים',st:'icher',walk:'כ‑10 דקות הליכה בתוך העיר העתיקה',price:'כ‑10 עד 15 ₼ (המקורות שונים)',hrs:'בערך 10:00 עד 18:00, בקיץ עד 19:00',time:'שעה עד שעה וחצי',
   d:'ארמון מהמאה ה‑15 בנקודה הגבוהה ביותר בעיר העתיקה. הוא נמצא ברשימת אונסק״ו. אפשר לשכור מדריך קולי בכ‑5 ₼.'},
  {id:'blvd',e:'🌊',name:'הטיילת (Baku Boulevard)',st:'sahil',walk:'כ‑5 דקות הליכה',price:'חינם (גלגל ענק וסירות בתשלום נפרד)',hrs:'פתוחה תמיד',time:'שעתיים עד שלוש',
   d:'טיילת של כ‑3.75 ק״מ על שפת הים הכספי: גלגל ענק, גנים, בתי קפה, כיכר הדגל, ונציה הקטנה ומוזיאון השטיחים. הכי יפה בשעות אחר הצהריים.'},
  {id:'venice',e:'🛶',name:'ונציה הקטנה',st:'sahil',walk:'כ‑5 דקות הליכה מסאחיל (10 עד 15 מאיצ׳רי שהר)',price:'כניסה חופשית, שייט בגונדולה בתשלום',hrs:'בערך 11:00 עד 21:00',time:'שעה',
   d:'תעלות קטנות וגשרים בתוך הטיילת, עם גונדולות ומסעדה. נחמד לערב רגוע.'},
  {id:'carpet',e:'🧶',name:'מוזיאון השטיחים',st:'sahil',walk:'הליכה לאורך הטיילת',price:'בדקו בקופה',hrs:'קופה: ג׳ עד ו׳ 10:00 עד 18:00, שבת וראשון 11:00 עד 19:00 (סגור בדרך כלל בימי שני)',time:'שעה עד שעה וחצי',
   d:'המבנה בנוי בצורת שטיח מגולגל, והאוסף הוא הגדול בעולם של שטיחים אזריים. הצילום מבחוץ שווה גם בלי להיכנס.'},
  {id:'fount',e:'⛲',name:'כיכר המזרקות ורחוב ניזאמי',st:'sahil',walk:'הליכה קצרה (או מתחנת 28 במאי)',price:'חינם',hrs:'פתוחה תמיד',time:'שעה עד שעתיים',
   d:'כיכר להולכי רגל עם מזרקות, בתי קפה ומסעדות, ולצידה קטע ללא מכוניות ברחוב ניזאמי עם חנויות. מקום טוב לארוחת ערב וטיול ערב.'},
  {id:'hac',e:'🏛️',name:'מרכז היידר אלייב',st:'narimanov',walk:'10 עד 20 דקות הליכה, או מונית קצרה',price:'כ‑15 ₼ למבוגר (תערוכת מכוניות נוספת בכ‑10 ₼)',hrs:'בערך ג׳ עד ו׳ 11:00 עד 19:00, שבת וראשון 11:00 עד 18:00, סגור ביום שני (המקורות שונים, כדאי לבדוק)',time:'שעה וחצי עד שעתיים',
   d:'הבניין המעוגל והזורם של האדריכלית זהה חדיד, אחד הבניינים המצולמים ביותר באזרבייג׳ן. גם מבחוץ זה מרשים, במיוחד בשעת בין ערביים.'},
  {id:'flame',e:'🔥',name:'מגדלי הלהבה',st:'sahil',walk:'רואים אותם מכל הטיילת. לעלייה: פוניקולר או מונית',price:'צפייה מבחוץ חינם',hrs:'מוארים בערב',time:'ערב שלם לצילום',
   d:'שלושה גורדי שחקים בצורת להבות עם מסכי לד. ממש מעל העיר, והתצפית מהגן שמעליהם יפה מאוד בשקיעה.'},
  {id:'moma',e:'🖼️',name:'מוזיאון לאמנות מודרנית',st:'khatai',walk:'ליד התחנה',price:'בדקו בקופה',hrs:'בדקו לפני הנסיעה',time:'שעה עד שעה וחצי',
   d:'אמנות אזרית מתקופת האוונגרד ואמנות בינלאומית. הנסיעה לשם היא דרך 28 במאי, המעבר הרגלי לג׳עפר ג׳באר׳לי והרכבת הקצרה לחטאי.'},
  {id:'trip',e:'🚐',name:'טיולי יום מחוץ למטרו',st:'',walk:'מונית או סיור מאורגן',price:'לפי הסיור',hrs:'',time:'חצי יום',
   d:'גובוסטן (ציורי סלע ופסגות בוץ געשיות) וחצי האי אבשרון (מקדש האש ויאנר דאג). אין להם תחנת מטרו, אז הדרך הנוחה היא סיור או מונית.'}
];

/* אוכל */
var DISHES = [
  {e:'🍚',n:'פלוב (Plov)',d:'אורז עם זעפרן, לרוב עם בשר, ערמונים או פירות יבשים. המנה הלאומית. ”שאה פלוב“ היא הגרסה המפוארת, עטופה בבצק.'},
  {e:'🥟',n:'קוטאב (Qutab)',d:'בצק דק מקופל ומטוגן על פלטה, ממולא בבשר, בעשבים או בדלעת, ומפזרים עליו סומאק. גם אוכל רחוב וגם במסעדות.'},
  {e:'🥬',n:'דולמה (Dolma)',d:'בשר ואורז בעלי גפן או כרוב. יש גם ”דולמה של שלוש אחיות“ מעגבנייה, פלפל וחציל.'},
  {e:'🍢',n:'קבב ולולה קבב',d:'בשר צלוי על האש עם ירקות, לחם ובצל. הגרסה הכי נפוצה בכל מסעדה.'},
  {e:'🍲',n:'פיטי (Piti)',d:'נזיד כבש עם חומוס ותפוחי אדמה, מבושל וגשיש בסיר חרס קטן. אוכלים קודם את המרק עם לחם ואז את התוכן.'},
  {e:'🥣',n:'דובגה (Dovga)',d:'מרק יוגורט קר או חם עם עשבים ואורז. אחד הדברים המעטים שמתאימים לצמחונים, אבל שווה לוודא שלא בושל בציר בשר.'},
  {e:'🥟',n:'דושברה (Dushbara)',d:'כופתאות קטנטנות במרק צלול, מתובלות בחומץ ובנענע.'},
  {e:'🫖',n:'תה בכוסות ארמודו',d:'תה שחור חם בכוסות קטנות בצורת אגס, עם ריבה או סוכר. אפשר לשבת בבית תה בעיר העתיקה שעה שלמה.'}
];
var FOODS = [
  {n:'Dolma',st:'sahil',walk:'ברחוב ניזאמי, ליד העיר העתיקה',t:'אזרית מסורתית',p:'בינוני',d:'מקום פופולרי בין התיירים והמדריכים. לפי ביקורות אפשר לשלם בערך 10 ₼ על דולמה ו‑6 ₼ על סלט רועים.'},
  {n:'Firuze',st:'sahil',walk:'ברחוב ניזאמי 51',t:'אזרית',p:'בינוני',d:'פועלת משנת 1986, פנים מקושט בשטיחים ונחושת. מתאימה לשיתוף מספר מנות על השולחן.'},
  {n:'Nergiz',st:'icher',walk:'בתוך העיר העתיקה',t:'אזרית',p:'בינוני',d:'מומלצת לקבב של שירוואנשאים, פיטי, דולמה ופלוב זעפרן.'},
  {n:'Art Garden',st:'icher',walk:'בתוך העיר העתיקה',t:'אזרית ומשולבת',p:'בינוני עד יקר',d:'בתוך שיירה (קרוואנסראי) מהמאה ה‑15 עם גלריה. מתאימה לארוחת ערב אחרי יום הליכה.'},
  {n:'Sehirli Tendir',st:'icher',walk:'בתוך העיר העתיקה',t:'ארוחת בוקר אזרית',p:'בינוני',d:'ארוחת בוקר אזרית מסורתית מתנור חרס. יש תורים ארוכים, אז כדאי להגיע מוקדם.'},
  {n:'Shirvanshah Museum Restaurant',st:'icher',walk:'בתוך העיר העתיקה',t:'אזרית',p:'בינוני',d:'מסעדה שהיא גם מעין מוזיאון עם עתיקות וצילומים של באקו הישנה.'},
  {n:'Shah Restaurant & Gallery',st:'icher',walk:'בעיר העתיקה (בדקו כתובת)',t:'אזרית',p:'בינוני',d:'מוזיקה חיה, קוטאב ושאה פלוב. פתוחה בערך 10:30 עד 00:00.'},
  {n:'Sky Grill (במלון הילטון)',st:'sahil',walk:'בהילטון ליד התחנה',t:'ארוחה יקרה עם נוף',p:'יקר',d:'נוף פנורמי על העיר, מתאימה לערב מיוחד.'},
  {n:'Darya Fish House',st:'sahil',walk:'ליד הטיילת',t:'דגים',p:'בינוני עד יקר',d:'דגים טריים עם נוף לים הכספי.'},
  {n:'Mari Vanna',st:'sahil',walk:'במרכז העיר',t:'מטבח רוסי',p:'יקר',d:'מטבח רוסי מעודן בעיצוב נוסטלגי.'}
];

/* מסלולים מוכנים */
var READY = [
  {t:'יום ראשון: העיר העתיקה והטיילת',s:'icher',e:'sahil',d:'מתחילים באיצ׳רי שהר, עולים למגדל ולארמון, יורדים לטיילת ונגמרים בכיכר המזרקות לארוחת ערב.'},
  {t:'משדה התעופה לעיר העתיקה',s:'a:airport',e:'icher',d:'אוטובוס H1 ל‑28 במאי ואז רכבת לאיצ׳רי שהר.'},
  {t:'מרכז היידר אלייב',s:'sahil',e:'narimanov',d:'מסאחיל לנרימן נרימנוב, ומשם הליכה או מונית קצרה.'},
  {t:'מוזיאון לאמנות מודרנית',s:'icher',e:'khatai',d:'דרך 28 במאי, המעבר הרגלי לג׳עפר ג׳באר׳לי והרכבת הקצרה לחטאי.'}
];

/* ---------- אחסון מקומי ---------- */
var store = {
  get:function(k,d){try{var v=localStorage.getItem('bm_'+k);return v===null?d:JSON.parse(v);}catch(e){return d;}},
  set:function(k,v){try{localStorage.setItem('bm_'+k,JSON.stringify(v));}catch(e){}}
};
var state = {
  tab: store.get('tab','home'),
  fav: store.get('fav',[]),
  filter:'all', q:'', view:'map',
  from: store.get('from',''), to: store.get('to',''),
  done: store.get('done',false),
  usdIls: store.get('usdIls','')
};

/* ---------- עזרים ---------- */
function $(s,r){return (r||document).querySelector(s);}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function dots(s){return s.lines.map(function(l){return '<span class="dot" style="background:'+LINES[l].c+'"></span>';}).join('');}
function fmt(n){return n.toFixed(2);}
var USD = 1.70; /* מנאט לדולר */
function toUsd(a){return a/USD;}
function isFav(id){return state.fav.indexOf(id)>=0;}
function toggleFav(id){var i=state.fav.indexOf(id);if(i>=0)state.fav.splice(i,1);else state.fav.push(id);store.set('fav',state.fav);}

/* ---------- מתכנן מסלול ---------- */
function buildEdges(){
  var e = BASE_EDGES.slice();
  if(state.done){
    e.push({a:'nizami',b:'jafar',line:'green',type:'rail',w:1});
  } else {
    e = e.concat(BUS_EDGES);
  }
  return e.concat(AIR_EDGES);
}
function resolveEnd(v){
  if(!v) return null;
  if(v==='a:airport') return {node:'airport',label:'שדה התעופה',walk:''};
  if(v.indexOf('s:')===0){var s=SBY[v.slice(2)];return s?{node:s.id,label:s.he,walk:''}:null;}
  if(v.indexOf('p:')===0){var p=PLACES.filter(function(x){return x.id===v.slice(2);})[0];return p?{node:p.st,label:p.he,walk:p.walk,place:true}:null;}
  if(SBY[v]) return {node:v,label:SBY[v].he,walk:''};
  return null;
}
function plan(from,to){
  var edges = buildEdges(), adj = {};
  edges.forEach(function(e,i){
    (adj[e.a]=adj[e.a]||[]).push({to:e.b,e:e});
    (adj[e.b]=adj[e.b]||[]).push({to:e.a,e:e});
  });
  var dist = {}, prev = {}, q = [];
  var start = from+'|start';
  dist[start]=0; q.push([0,start]);
  var best=null;
  while(q.length){
    q.sort(function(a,b){return a[0]-b[0];});
    var cur = q.shift(), d=cur[0], key=cur[1];
    if(d>dist[key]) continue;
    var parts = key.split('|'), node=parts[0], pl=parts[1];
    if(node===to){best=key;break;}
    (adj[node]||[]).forEach(function(n){
      var e=n.e, pen=0;
      if(pl!=='start' && pl!==e.line){pen = (RAIL(pl)&&RAIL(e.line))?3:1;}
      var nd=d+e.w+pen, nk=n.to+'|'+e.line;
      if(dist[nk]===undefined||nd<dist[nk]){dist[nk]=nd;prev[nk]={k:key,e:e,from:node,to:n.to};q.push([nd,nk]);}
    });
  }
  if(!best) return null;
  var steps=[], k=best;
  while(prev[k]){steps.unshift(prev[k]);k=prev[k].k;}
  return steps;
}
function RAIL(l){return l==='red'||l==='green'||l==='purple';}
function nm(id){return id==='airport'?'שדה התעופה':SBY[id].he;}

function groupSteps(steps){
  var segs=[];
  steps.forEach(function(s){
    var last=segs[segs.length-1];
    var same = last && last.line===s.e.line && last.type===s.e.type && last.label===(s.e.label||'');
    if(same && last.type==='rail'){last.nodes.push(s.to);}
    else {segs.push({line:s.e.line,type:s.e.type,label:s.e.label||'',nodes:[s.from,s.to],air:!!s.e.air});}
  });
  return segs;
}
function direction(seg){
  var a=seg.nodes[0], b=seg.nodes[seg.nodes.length-1];
  if(seg.line==='purple') return '';
  var key = seg.line;
  if(seg.line==='green'){ key = (SHUTTLE.indexOf(a)>=0 && SHUTTLE.indexOf(b)>=0)?'shuttle':'green'; }
  var D=DIRS[key]; if(!D) return '';
  if(key==='red'){
    if(b==='bakmil') return 'Bakmil (בקמיל)';
    if(a==='bakmil') a='narimanov';
  }
  var ia=D.chain.indexOf(a), ib=D.chain.indexOf(b);
  if(ia<0||ib<0) return '';
  return ib>ia?D.hi:D.lo;
}
function renderPlan(){
  var box=$('#planOut'); if(!box) return;
  var f=resolveEnd(state.from), t=resolveEnd(state.to);
  if(!f||!t){box.innerHTML='<div class="mute">בחרו נקודת התחלה ויעד כדי לקבל מסלול.</div>';return;}
  if(f.node===t.node && !f.place && !t.place){box.innerHTML='<div class="mute">נקודת ההתחלה והיעד זהות.</div>';return;}
  var steps = (f.node===t.node)?[]:plan(f.node,t.node);
  if(steps===null){box.innerHTML='<div class="mute">לא נמצא מסלול.</div>';return;}
  var segs=groupSteps(steps), html='', stops=0, entries=0, bus=0, air=0, inRail=false;
  if(f.walk) html+='<div class="step"><div class="ico">🚶</div><div class="grow"><b>מ‑'+esc(f.label)+'</b><div class="mute small">'+esc(f.walk)+' עד תחנת '+esc(SBY[f.node].he)+'</div></div></div>';
  if(!segs.length) html+='<div class="step"><div class="ico">✅</div><div class="grow">שני המקומות קרובים לאותה תחנה, אין צורך במטרו.</div></div>';
  segs.forEach(function(g){
    var from=g.nodes[0], to=g.nodes[g.nodes.length-1], n=g.nodes.length-1;
    if(g.type==='rail'){
      if(!inRail){entries++;inRail=true;}
      stops+=n;
      var dir=direction(g);
      var mid=g.nodes.slice(1,-1).map(nm);
      html+='<div class="step"><div class="ico">🚇</div><div class="grow"><b><span class="dot" style="background:'+LINES[g.line].c+'"></span> '+LINES[g.line].n+'</b>'+
        '<div>'+esc(nm(from))+' ← '+esc(nm(to))+' <span class="tag">'+n+' תחנות</span></div>'+
        (dir?'<div class="mute small">בכיוון <span class="ltr">'+esc(dir)+'</span></div>':'')+
        (mid.length?'<details><summary class="small mute">התחנות בדרך</summary><div class="small">'+mid.map(esc).join(' · ')+'</div></details>':'')+
        '</div></div>';
    } else if(g.type==='walk'){
      html+='<div class="step"><div class="ico">🚶</div><div class="grow"><b>מעבר רגלי</b><div>'+esc(nm(from))+' ← '+esc(nm(to))+'</div><div class="mute small">'+esc(g.label)+'. נשארים בתוך המערכת, בלי לצאת ובלי לשלם שוב.</div></div></div>';
    } else {
      inRail=false;
      if(g.air){air++;html+='<div class="step"><div class="ico">🚌</div><div class="grow"><b>אוטובוס H1 (אקספרס שדה התעופה)</b><div>'+esc(nm(from))+' ← '+esc(nm(to))+'</div><div class="mute small">עולה 1.30 ₼, פועל כל הלילה, ובשעות היום יוצא כל כ‑20 דקות. מחייב כרטיס BakıKart או תשלום באפליקציה.</div></div></div>';}
      else {bus++;html+='<div class="step"><div class="ico">🚌</div><div class="grow"><b>אוטובוס אקספרס '+esc(g.label)+'</b><div>'+esc(nm(from))+' ← '+esc(nm(to))+'</div><div class="mute small">חלק מהסידור הזמני בזמן עבודות הרכבת. תשלום נפרד מהמטרו, בדקו את המחיר בעצירה.</div></div></div>';}
    }
  });
  if(t.walk && !(f.node===t.node && f.place && t.place)) html+='<div class="step"><div class="ico">🚶</div><div class="grow"><b>עד '+esc(t.label)+'</b><div class="mute small">מתחנת '+esc(SBY[t.node].he)+': '+esc(t.walk)+'</div></div></div>';
  var cost = entries*0.6, parts=[];
  if(entries) parts.push('מטרו: '+fmt(cost)+' ₼ ('+entries+(entries>1?' כניסות':' כניסה')+' × 0.60)');
  if(air) parts.push('אוטובוס H1: 1.30 ₼');
  if(bus) parts.push('אוטובוס אקספרס: מחיר נפרד');
  var sum = '<div class="card" style="margin-top:12px"><b>סיכום</b><div class="small">'+(stops?stops+' תחנות מטרו בסך הכל. ':'')+(parts.join(' · ')||'ללא עלות')+'.</div>'+
    ((entries||air)?'<div class="mute small">עלות משוערת בדולרים: כ‑'+fmt(toUsd(cost+(air?1.3:0)))+' $ (בלי אוטובוס אקספרס)</div>':'')+
    '<div class="mute small">מספר התחנות בקו הסגול משוער. אם המצב ברחוב שונה, סמכו על השילוט.</div></div>';
  box.innerHTML = html + sum;
}

/* ---------- מסכים ---------- */
function bannerWorks(){
  if(state.done) return '<div class="card small"><b>העבודות בין ניזאמי ל‑28 במאי סומנו כגמורות.</b> אם עדיין לא, אפשר לבטל בלשונית ”מסלול“.</div>';
  return '<div class="alert"><b>שימו לב: רכבת לא נוסעת כרגע בין ניזאמי ל‑28 במאי.</b><br>'+
    'מאז 15/08/2026 תחנות הקו הירוק (מדרנגול עד ניזאמי) מופרדות מהקו האדום, בגלל חפירת מנהרה חדשה. '+
    'בין התחנות האלה נוסעים אוטובוסי אקספרס (M1 עד M6) באותן שעות של המטרו. לפי ההודעה הרשמית העבודה אמורה להימשך כ‑10 עד 11 חודשים, כלומר עד בערך קיץ 2027, אבל התאריך עלול להשתנות. '+
    'כדאי לבדוק באתר <a class="ltr" href="https://metro.gov.az" target="_blank" rel="noopener">metro.gov.az</a> לפני נסיעה.</div>';
}
function viewHome(){
  var favs = state.fav.map(function(id){return SBY[id];}).filter(Boolean);
  var h = bannerWorks();
  h += '<div class="grid" style="margin-bottom:12px">'+
    '<div class="stat"><div class="n">3</div><div class="l">קווים: אדום, ירוק וסגול</div></div>'+
    '<div class="stat"><div class="n">27</div><div class="l">תחנות לפי הספירה הרשמית</div></div>'+
    '<div class="stat"><div class="n">0.60 ₼</div><div class="l">מחיר נסיעה, קבוע לכל מרחק</div></div>'+
    '<div class="stat"><div class="n">06:00–00:00</div><div class="l">שעות פעילות, כל יום</div></div></div>';
  h += '<div class="card"><h3>מה אפשר לעשות כאן</h3><div class="row" style="flex-wrap:wrap;margin-top:8px">'+
    '<button class="btn" data-go="plan">🧭 תכנון מסלול</button><button class="btn sec" data-go="stations">🗺️ תחנות</button>'+
    '<button class="btn sec" data-go="tickets">🎫 כרטיסים</button></div></div>';
  h += '<h2>מסלולים מוכנים</h2>';
  READY.forEach(function(r,i){
    h += '<div class="card"><h3>'+esc(r.t)+'</h3><div class="mute small">'+esc(r.d)+'</div><div style="margin-top:8px"><button class="btn sm" data-ready="'+i+'">פתח במתכנן</button></div></div>';
  });
  if(favs.length){
    h += '<h2>⭐ התחנות שלי</h2>';
    favs.forEach(function(s){h+=stationRow(s);});
  }
  h += '<div class="foot">המידע נאסף ב‑07/11/2026 ממקורות פומביים. מחירים, שעות ועבודות יכולים להשתנות, ולכן כדאי לוודא באתר הרשמי או במקום.</div>';
  return h;
}
function stationRow(s){
  return '<div class="card" data-st="'+s.id+'" style="cursor:pointer"><div class="row"><div class="grow"><b>'+esc(s.he)+'</b> <span class="mute small ltr">'+esc(s.az)+'</span><div>'+dots(s)+'</div></div><div class="mute">›</div></div></div>';
}
function stripRow(id,extra){
  var s=SBY[id], lc = LINES[extra.line].c;
  return '<div class="st'+(extra.cls?' '+extra.cls:'')+'" data-st="'+id+'" style="--lc:'+lc+'"><span class="rail"><i></i></span><span class="name">'+esc(s.he)+
    (s.lines.length>1?' <span class="badge" style="background:'+LINES[s.lines[1]===extra.line?s.lines[0]:s.lines[1]].c+'">החלפה</span>':'')+
    '<span class="az ltr">'+esc(s.az)+'</span></span></div>';
}
function viewStations(){
  var h='<div class="chips" id="fchips">'+
    ['all|הכל','red|אדום','green|ירוק','purple|סגול','fav|⭐ שלי'].map(function(x){var p=x.split('|');return '<button class="chip'+(state.filter===p[0]?' on':'')+'" data-f="'+p[0]+'">'+p[1]+'</button>';}).join('')+'</div>';
  h+='<div class="chips"><button class="chip'+(state.view==='map'?' on':'')+'" data-v="map">🗺️ מפת קווים</button><button class="chip'+(state.view==='list'?' on':'')+'" data-v="list">📋 רשימה</button></div>';
  if(state.view==='map'){
    h+=bannerWorks();
    h+='<div class="card"><div class="strips">';
    var order = state.filter==='all'||state.filter==='fav' ? ['red','green','purple'] : [state.filter];
    order.forEach(function(L){
      h+='<div class="strip"><h4><span class="dot" style="background:'+LINES[L].c+'"></span>'+LINES[L].n+'</h4>';
      if(L==='red'){
        RED.forEach(function(id){
          h+=stripRow(id,{line:'red'});
          if(id==='narimanov') h+=stripRow('bakmil',{line:'red',cls:'branch'});
        });
      } else if(L==='green'){
        h+= state.done ? '<div class="gap" style="color:var(--ok);border-color:var(--ok);background:transparent">אחרי העבודות: ניזאמי ← ג׳עפר ג׳באר׳לי</div>' : '<div class="gap">מקטע סגור זמנית בין ניזאמי ל‑28 במאי. אוטובוסי אקספרס M1 עד M3.</div>';
        GREEN.slice().reverse().forEach(function(id){h+=stripRow(id,{line:'green'});});
        h+='<div class="mute small" style="margin:6px 0 4px">שאטל קצר נפרד:</div>';
        SHUTTLE.forEach(function(id){h+=stripRow(id,{line:'green'});});
      } else {
        PURPLE.forEach(function(id){h+=stripRow(id,{line:'purple'});});
        h+='<div class="mute small">סדר התחנות בקו הסגול משוער.</div>';
      }
      h+='</div>';
    });
    h+='</div></div>';
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
  h+='<div class="foot">27 תחנות לפי הספירה הרשמית. מעמר אג׳אמי נספרת פעמיים כי היא שייכת לשני קווים, ולכן כאן מוצגות 26 תחנות שונות.</div>';
  return h;
}
function opts(sel){
  var h='<option value="">בחרו…</option><optgroup label="שדה התעופה"><option value="a:airport"'+(sel==='a:airport'?' selected':'')+'>שדה התעופה (היידר אלייב)</option></optgroup>';
  h+='<optgroup label="מקומות מפורסמים">'+PLACES.map(function(p){var v='p:'+p.id;return '<option value="'+v+'"'+(sel===v?' selected':'')+'>'+esc(p.he)+'</option>';}).join('')+'</optgroup>';
  h+='<optgroup label="תחנות">'+STATIONS.map(function(s){var v='s:'+s.id;return '<option value="'+v+'"'+(sel===v?' selected':'')+'>'+esc(s.he)+' · '+esc(s.az)+'</option>';}).join('')+'</optgroup>';
  return h;
}
function viewPlan(){
  var h='<div class="card"><label for="from">מאיפה</label><select id="from">'+opts(state.from)+'</select>'+
    '<div style="text-align:center;margin:6px 0"><button class="btn sec sm" id="swap" type="button">⇅ החלפה</button></div>'+
    '<label for="to">לאן</label><select id="to">'+opts(state.to)+'</select></div>';
  h+='<div id="planOut"></div>';
  h+='<div class="card" style="margin-top:12px"><label style="display:flex;gap:8px;align-items:center;margin:0;color:var(--ink);font-size:14px"><input type="checkbox" id="done"'+(state.done?' checked':'')+'> העבודות בין ניזאמי ל‑28 במאי הסתיימו</label>'+
    '<div class="mute small" style="margin-top:4px">סמנו רק אם ראיתם שהרכבות חזרו לנסוע שם. ברירת המחדל מתייחסת למצב הנוכחי, עם אוטובוסי האקספרס.</div></div>';
  return h;
}
function viewSights(){
  var h='<h2 style="margin-top:4px">אתרים ששווה לבקר בהם</h2><div class="mute small">מסודר לפי נוחות הגישה במטרו. המחירים משוערים ויכולים להשתנות.</div><div style="height:8px"></div>';
  SIGHTS.forEach(function(x){
    var stn = x.st?SBY[x.st]:null;
    h+='<div class="card"><div class="row"><div style="font-size:30px">'+x.e+'</div><div class="grow"><h3>'+esc(x.name)+'</h3>'+
      (stn?'<div class="mute small">תחנה: <b>'+esc(stn.he)+'</b> · '+esc(x.walk)+'</div>':'<div class="mute small">'+esc(x.walk)+'</div>')+'</div></div>'+
      '<div style="margin:8px 0">'+esc(x.d)+'</div>'+
      '<div class="small"><span class="tag">💰 '+esc(x.price)+'</span>'+(x.hrs?'<span class="tag">🕒 '+esc(x.hrs)+'</span>':'')+'<span class="tag">⏱ '+esc(x.time)+'</span></div>'+
      (stn?'<div style="margin-top:8px"><button class="btn sm" data-to="s:'+stn.id+'">איך מגיעים</button></div>':'')+'</div>';
  });
  return h;
}
function viewFood(){
  var h='<h2 style="margin-top:4px">מאכלים שחייבים לטעום</h2>';
  DISHES.forEach(function(x){h+='<div class="card"><div class="row"><div style="font-size:28px">'+x.e+'</div><div class="grow"><h3>'+esc(x.n)+'</h3><div class="mute small" style="color:var(--ink)">'+esc(x.d)+'</div></div></div></div>';});
  h+='<h2>מסעדות</h2><div class="mute small">בחירה לפי מקורות פומביים והמלצות. הדירוג ”בינוני / יקר“ הוא הערכה גסה. כדאי להזמין מקום בסופי שבוע.</div><div style="height:8px"></div>';
  FOODS.forEach(function(x){
    var stn=SBY[x.st];
    h+='<div class="card"><h3>'+esc(x.n)+' <span class="tag">'+esc(x.p)+'</span></h3><div class="mute small">'+esc(x.t)+' · תחנה: <b>'+esc(stn.he)+'</b> · '+esc(x.walk)+'</div>'+
      '<div style="margin-top:6px">'+esc(x.d)+'</div><div style="margin-top:8px"><button class="btn sm" data-to="s:'+stn.id+'">איך מגיעים</button></div></div>';
  });
  h+='<div class="card"><h3>כמה זה עולה</h3><div class="small">מקור אחד מעריך הוצאה יומית על אוכל בכ‑15 עד 40 דולר (כ‑25 עד 70 ₼) לפי סגנון האכילה. מסעדה פשוטה ומקומית, מחוץ לאזור התיירים, יכולה לעלות הרבה פחות.</div></div>';
  h+='<div class="card"><h3>טיפים</h3><ul class="tips small"><li>מנות רבות מיועדות לשיתוף, אז כדאי להזמין כמה מנות לשולחן.</li>'+
    '<li>צמחונים: קוטאב עשבים, דולמה צמחונית ודובגה. כדאי לשאול אם בושל בציר בשר.</li>'+
    '<li>כשרות והלאל: אין לי מידע מאומת על מסעדות כשרות. אם זה חשוב לכם, בררו מראש מול הקהילה היהודית בבאקו.</li>'+
    '<li>מחירים בתפריטים בעיר העתיקה גבוהים בדרך כלל מהממוצע העירוני.</li></ul></div>';
  return h;
}
function viewTickets(){
  var rate=parseFloat(state.usdIls)||0;
  var h='<h2 style="margin-top:4px">כרטיסים, מחירים ומידע שימושי</h2><div class="card">';
  h+='<details open><summary>איך משלמים על המטרו</summary><div class="small">'+
    '<ul class="tips"><li><b>כרטיס BakıKart:</b> כרטיס טעינה לכל התחבורה הציבורית בעיר (מטרו ואוטובוסים). קונים אותו במכונות בכל תחנת מטרו ובכיוסקים.</li>'+
    '<li><b>בלי כרטיס:</b> אפשר לשלם בברקוד QR מהאפליקציה של המטרו, ובתחנות רבות גם בנגיעה בכרטיס אשראי או בטלפון (Apple Pay / Google Pay).</li>'+
    '<li>המכונות מדברות אנגלית, רוסית ואזרית. הן מקבלות מזומן וכרטיס, <b>לא נותנות עודף</b>, אז הביאו שטרות קטנים.</li>'+
    '<li>צמידו את הכרטיס לקורא בשער. אור ירוק והיתרה מופיעה במסך.</li></ul></div></details>';
  h+='<details><summary>טבלת מחירים</summary><table><tr><th>פריט</th><th>מחיר</th></tr>'+
    '<tr><td>נסיעה במטרו (כל מרחק, כולל החלפות)</td><td class="price">0.60 ₼<br><span class="mute small">כ‑'+fmt(toUsd(0.6))+' $ · מ‑01/10/2025</span></td></tr>'+
    '<tr><td>כרטיס BakıKart פלסטיק (דמי כרטיס, לא מוחזרים)</td><td>כ‑2 ₼<br><span class="mute small">דווח שהמחיר עלה, בדקו בעמדה</span></td></tr>'+
    '<tr><td>אוטובוס H1 משדה התעופה</td><td>1.30 ₼</td></tr>'+
    '<tr><td>אוטובוס עירוני רגיל</td><td>תעריף נפרד, בדרך כלל נמוך מהמטרו</td></tr>'+
    '<tr><td>מונית או אפליקציה (Bolt / Yango) משדה התעופה</td><td>בערך 10 עד 35 ₼, תלוי בשעה ובאפליקציה</td></tr>'+
    '<tr><td>מגדל הבתולה / ארמון השירוואנשאים</td><td>כ‑10 עד 15 ₼ לכל אחד</td></tr>'+
    '<tr><td>מרכז היידר אלייב</td><td>כ‑15 ₼</td></tr></table></details>';
  h+='<details><summary>שעות ותדירות</summary><div class="small"><ul class="tips">'+
    '<li>המטרו פועל כל יום בין 06:00 ל‑00:00. בחגים ובאירועים גדולים לפעמים מאריכים.</li>'+
    '<li>בשעות העומס (בערך 07:30 עד 09:30 ו‑17:30 עד 19:30) רכבת כל 2 עד 5 דקות. בשעות רגילות ובסופי שבוע כל 5 עד 7 דקות.</li>'+
    '<li>הקו הסגול: בקיץ 2026 כל כ‑8 דקות.</li>'+
    '<li>בכניסה לתחנות יש בדיקה ביטחונית, כדאי לא לבוא עם תיקים גדולים.</li></ul></div></details>';
  h+='<details><summary>משדה התעופה לעיר</summary><div class="small"><ul class="tips">'+
    '<li>אין תחנת מטרו בשדה התעופה (היידר אלייב, כ‑20 עד 25 ק״מ מהמרכז).</li>'+
    '<li><b>אוטובוס H1:</b> 1.30 ₼, יוצא מחוץ לטרמינלים, עוצר בקורוגלו ומסיים ליד תחנת 28 במאי והרכבת. כ‑30 עד 40 דקות. פועל 24 שעות: כל כ‑20 דקות ביום וכל 45 דקות בלילה. משלמים ב‑BakıKart או באפליקציות תשלום. יש לו עצירה אחרת בדרך חזרה, ליד תחנת הרכבת.</li>'+
    '<li><b>מונית או אפליקציה:</b> כ‑30 עד 40 דקות. אפשר להזמין בדלפק המוניות הרשמי בטרמינל 1 או באפליקציה. כדאי להסכים על מחיר לפני שמתחילים, ולהימנע ממוניות לא רשמיות.</li>'+
    '<li>אם יש לכם מזוודות כבדות, מונית נוחה יותר מהאוטובוס.</li></ul></div></details>';
  h+='<details><summary>מטבע והמרה</summary><div class="small">'+
    '<p>המטבע הוא המנאט (₼, AZN). השער מול הדולר יציב בערך 1.70 מנאט לדולר. כדי לראות גם שקלים, הזינו את שער הדולר היום.</p>'+
    '<label for="ils">שער דולר בשקלים (למשל 3.5)</label><input type="number" step="0.01" min="0" id="ils" value="'+esc(state.usdIls)+'" inputmode="decimal">'+
    '<label for="azn">סכום במנאט</label><input type="number" step="0.01" min="0" id="azn" value="10" inputmode="decimal"><div id="conv" class="price" style="margin-top:8px"></div></div></details>';
  h+='<details><summary>טיפים שימושיים</summary><div class="small"><ul class="tips">'+
    '<li>שמות התחנות מופיעים בלועזית. כדאי להראות לנהגים ולעוברי אורח את הכתיבה האזרית שמוצגת ליד כל תחנה.</li>'+
    '<li>רוסית נפוצה במיוחד בקרב מבוגרים, ואנגלית בתיירות.</li>'+
    '<li>לפני שעולים לרכבת: וודאו את הכיוון לפי השם של התחנה הסופית בשילוט, במיוחד בקו האדום והירוק.</li>'+
    '<li>תנו לנוסעים לצאת לפני שנכנסים, ושמרו על הדברים שלכם בשעות העומס.</li>'+
    '<li>אפליקציות שימושיות: Bolt ו‑Yango למוניות, ואפליקציית המטרו הרשמית ו‑m10 לתשלום.</li></ul></div></details>';
  h+='<details><summary>מקורות ועדכניות</summary><div class="small">'+
    '<p>המידע נאסף ב‑07/11/2026 מאתרים רשמיים (<span class="ltr">metro.gov.az</span>, <span class="ltr">airport.az</span>) ומאתרי מידע לתיירים. במחירי כניסה ובשעות פתיחה יש הבדלים בין המקורות, ולכן הם מסומנים כמשוערים.</p>'+
    '<p>לפני נסיעה בדקו הודעות עדכניות: <a class="ltr" href="https://metro.gov.az/en/route-change" target="_blank" rel="noopener">metro.gov.az/en/route-change</a></p></div></details>';
  h+='</div>';
  return h;
}

var VIEWS={home:viewHome,stations:viewStations,plan:viewPlan,sights:viewSights,food:viewFood,tickets:viewTickets};
var TABS=[['home','🏠','בית'],['stations','🗺️','תחנות'],['plan','🧭','מסלול'],['sights','📸','לבקר'],['food','🍽️','לאכול'],['tickets','🎫','כרטיסים']];

function renderNav(){
  $('#nav').innerHTML=TABS.map(function(t){return '<button data-tab="'+t[0]+'" class="'+(state.tab===t[0]?'on':'')+'"><span class="ic">'+t[1]+'</span>'+t[2]+'</button>';}).join('');
}
function render(){
  renderNav();
  $('#view').innerHTML=VIEWS[state.tab]();
  if(state.tab==='plan') renderPlan();
  if(state.tab==='tickets') updConv();
  window.scrollTo(0,0);
}
function go(tab){state.tab=tab;store.set('tab',tab);render();}

function updConv(){
  var a=parseFloat(($('#azn')||{}).value)||0, r=parseFloat(state.usdIls)||0, out=$('#conv');
  if(!out)return;
  var usd=a/USD, txt=a.toFixed(2)+' ₼ ≈ '+usd.toFixed(2)+' $';
  if(r>0) txt+=' ≈ '+(usd*r).toFixed(2)+' ₪';
  out.textContent=txt;
}

/* ---------- חלון פרטי תחנה ---------- */
function openStation(id){
  var s=SBY[id]; if(!s) return;
  var h='<div class="grab"></div><div class="row"><div class="grow"><h3 style="font-size:20px">'+esc(s.he)+'</h3><div class="mute ltr">'+esc(s.az)+'</div><div style="margin-top:4px">'+
    s.lines.map(function(l){return '<span class="badge" style="background:'+LINES[l].c+';margin:0 0 0 4px">'+LINES[l].n+'</span>';}).join('')+'</div></div>'+
    '<button class="star" id="fav" aria-label="מועדף">'+(isFav(id)?'★':'☆')+'</button></div>';
  if(s.note) h+='<p>'+esc(s.note)+'</p>';
  if(s.near.length) h+='<h3 style="margin-top:12px">בסביבה</h3><ul class="tips">'+s.near.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul>';
  var related = (window.BAKU_CONTENT?C.sights:[]).filter(function(x){return x.st===id;}), foods=FOODS.filter(function(x){return x.st===id;});
  if(related.length) h+='<h3 style="margin-top:12px">אתרים קרובים</h3><div class="tiles">'+related.map(function(x){return '<div class="mini" data-sight="'+x.id+'">'+ART.svg(x.art,x.col)+'<b>'+esc(x.he)+'</b><span class="ltr">'+esc(x.en)+'</span></div>';}).join('')+'</div>';
  var hot = HOTELS.filter(function(x){return x.st===id;});
  if(hot.length) h+='<h3 style="margin-top:10px">מלונות קרובים</h3><div class="small">'+hot.map(function(x){return esc(x.n);}).join(' · ')+'</div>';
  if(foods.length) h+='<h3 style="margin-top:10px">מסעדות קרובות</h3><div class="small">'+foods.map(function(x){return esc(x.n);}).join(' · ')+'</div>';
  h+='<div class="row" style="margin-top:16px;flex-wrap:wrap"><button class="btn" data-from="s:'+id+'">🧭 מסלול מכאן</button><button class="btn sec" data-to="s:'+id+'">מסלול לכאן</button><button class="btn sec" id="closeSheet">סגירה</button></div>';
  var sh=$('#sheet'); sh.innerHTML=h; sh.style.display='block'; $('#sheetBg').style.display='block';
  $('#fav').onclick=function(){toggleFav(id);this.textContent=isFav(id)?'★':'☆';if(state.tab==='home'||state.tab==='stations')render();};
}
function closeSheet(){$('#sheet').style.display='none';$('#sheetBg').style.display='none';}

