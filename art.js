/* איורים מקוריים לכל אתר (עובדים גם בלי אינטרנט) */
var ART = (function(){
  var K = 'rgba(20,16,40,.82)', K2 = 'rgba(20,16,40,.55)';
  function r(x,y,w,h,f){return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+(f||K)+'"/>';}
  function c(x,y,R,f){return '<circle cx="'+x+'" cy="'+y+'" r="'+R+'" fill="'+(f||K)+'"/>';}
  function p(d,f,extra){return '<path d="'+d+'" fill="'+(f||K)+'" '+(extra||'')+'/>';}
  var ground = r(0,150,320,30);
  var M = {
    walls: ground+r(20,92,280,58)+[0,1,2,3,4,5,6,7,8,9,10,11].map(function(i){return r(20+i*24,82,14,12);}).join('')+r(130,60,60,90,K2)+p('M140 150v-30a20 20 0 0 1 40 0v30z','#FFD27A'),
    tower: ground+r(125,50,70,100)+p('M118 50h84l-10 -16h-64z')+r(108,40,104,12,K2)+r(150,86,20,28,'#FFD27A')+r(150,124,20,26,'#FFD27A'),
    palace: ground+r(40,100,240,50)+p('M60 100l20-30 20 30z')+p('M140 100l20-48 20 48z')+p('M210 100l20-30 20 30z')+r(80,110,16,40,'#FFD27A')+r(152,112,16,38,'#FFD27A')+r(224,110,16,40,'#FFD27A'),
    sea: p('M0 120q40-16 80 0t80 0t80 0t80 0v60H0z')+p('M0 140q40-14 80 0t80 0t80 0t80 0v40H0z',K2)+r(30,100,6,20)+p('M33 70l16 30h-32z'),
    venice: p('M0 130h320v50H0z',K2)+r(20,80,70,50)+r(230,70,70,60)+r(95,100,12,30)+r(215,100,12,30)+p('M120 150q40 22 80 0q-40 -10 -80 0z'),
    wheel: ground+c(160,88,64,'none')+'<circle cx="160" cy="88" r="62" fill="none" stroke="'+K+'" stroke-width="5"/><circle cx="160" cy="88" r="36" fill="none" stroke="'+K2+'" stroke-width="3"/>'+[0,1,2,3,4,5].map(function(i){var a=i*Math.PI/6;return '<line x1="'+(160+62*Math.cos(a))+'" y1="'+(88+62*Math.sin(a))+'" x2="'+(160-62*Math.cos(a))+'" y2="'+(88-62*Math.sin(a))+'" stroke="'+K+'" stroke-width="3"/>';}).join('')+p('M160 88l-30 62h60z',K2),
    flag: ground+r(158,30,4,120)+p('M162 34h90v16h-90z','#E53935')+p('M162 50h90v16h-90z','#43A047')+p('M162 66h90v16h-90z','#1E88E5')+c(194,58,6,'#fff'),
    fountain: ground+r(120,126,80,24)+p('M160 126V70M160 100q-30-30-50-8M160 100q30-30 50-8','none','stroke="'+K+'" stroke-width="5" fill="none"')+c(160,64,6),
    street: ground+r(20,70,80,80)+r(120,50,80,100,K2)+r(220,76,80,74)+[0,1,2].map(function(i){return r(32+i*22,84,10,16,'#FFD27A')+r(132+i*22,66,10,16,'#FFD27A')+r(232+i*22,92,10,16,'#FFD27A');}).join(''),
    flames: ground+p('M60 150C40 100 70 70 85 24c8 40 40 60 30 126z')+p('M130 150C105 90 150 50 170 14c14 50 56 80 30 136z')+p('M205 150c-14-50 14-76 32-100 6 34 32 56 18 100z'),
    park: ground+p('M0 150q80-60 160-20t160 0v40H0z',K2)+[40,100,230,280].map(function(x){return r(x-2,110,4,40)+c(x,100,16);}).join(''),
    funicular: ground+p('M20 150L300 50',"none",'stroke="'+K+'" stroke-width="6"')+p('M150 128l60 -26l-10 -22l-60 26z','#FFD27A','stroke="'+K+'" stroke-width="4"'),
    wave: p('M0 150C60 60 120 120 180 70S280 100 320 60V180H0z')+p('M0 168C70 100 140 150 200 108S290 130 320 100V180H0z',K2),
    mosque: ground+r(60,98,200,52)+p('M110 98a50 50 0 0 1 100 0z')+r(158,26,4,26)+r(36,50,16,100,K2)+r(268,50,16,100,K2)+p('M34 50l10-22l10 22z')+p('M266 50l10-22l10 22z'),
    carpet: ground+'<rect x="40" y="70" width="240" height="80" rx="38" fill="'+K+'"/><rect x="62" y="84" width="196" height="52" rx="26" fill="none" stroke="#FFD27A" stroke-width="4"/>'+p('M160 90l22 20l-22 20l-22-20z','#FFD27A'),
    fire: ground+p('M160 150C110 110 140 78 150 30c20 28 56 50 40 90c-8 18-18 24-30 30z')+p('M160 150c-22-30 0-46 8-68c14 18 28 34 10 58z','#FFD27A'),
    rock: ground+p('M0 150L60 80l40 28l50-60l60 60l40-24l70 66z')+p('M110 130l16-30l16 30z','#FFD27A')+c(200,118,6,'#FFD27A'),
    mud: ground+p('M20 150q40-70 90-26q40-60 100 0q40-30 90 26z')+[0,1,2].map(function(i){return c(110+i*40,92-i*6,4,'#FFD27A');}).join('')
  };
  function svg(key,col,cls){
    var a=col&&col[0]||'#F2B35E', b=col&&col[1]||'#6C3A8C', id='g'+Math.abs(hash(key+a+b));
    return '<svg class="art '+(cls||'')+'" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">'+
      '<defs><linearGradient id="'+id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+a+'"/><stop offset="1" stop-color="'+b+'"/></linearGradient></defs>'+
      '<rect width="320" height="180" fill="url(#'+id+')"/><circle cx="262" cy="46" r="20" fill="#FFF3C4" opacity=".9"/>'+(M[key]||M.walls)+'</svg>';
  }
  function hash(s){var h=0;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return h;}
  return {svg:svg,keys:Object.keys(M)};
})();
