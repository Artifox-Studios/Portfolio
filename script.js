const canvas = document.getElementById('snowCanvas');
const ctx = canvas.getContext && canvas.getContext('2d');
if (!ctx) { console.warn('Canvas 2D no disponible.'); } 

let W = window.innerWidth;
let H = window.innerHeight;
function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
window.addEventListener('resize', resize, { passive:true });
resize();

const BASE_COUNT = 120;
const STORM_COUNT = 520;
let targetCount = BASE_COUNT;
let flakes = [];
function initFlakes(n) {
  flakes = [];
  for (let i=0;i<n;i++){
    flakes.push({ x:Math.random()*W, y:Math.random()*H, r:0.8+Math.random()*3.2, speed:0.3+Math.random()*1.6, drift:(Math.random()-0.5)*1.8 });
  }
}
initFlakes(BASE_COUNT);

const foxSvg = document.getElementById('foxSvg');

function step(){
  ctx.clearRect(0,0,W,H);
  if(flakes.length<targetCount){
    const add = Math.min(8,targetCount-flakes.length);
    for(let i=0;i<add;i++){
      flakes.push({x:Math.random()*W, y:-10-Math.random()*100, r:0.8+Math.random()*3.2, speed:0.6+Math.random()*2.6, drift:(Math.random()-0.5)*2});
    }
  } else if(flakes.length>targetCount){ flakes.length = Math.max(targetCount,flakes.length-10); }

  for(let i=0;i<flakes.length;i++){
    const f=flakes[i];
    ctx.beginPath();
    ctx.fillStyle='rgba(255,255,255,0.95)';
    ctx.arc(f.x,f.y,f.r,0,Math.PI*2);
    ctx.fill();
    f.y+=f.speed;
    f.x+=Math.sin(f.y*0.008)*f.drift+Math.cos(f.y*0.004)*0.2;
    if(f.y>H+6){ f.y=-8-Math.random()*60; f.x=Math.random()*W; }
    if(f.x>W+10) f.x=-20; if(f.x<-20) f.x=W+10;
  }

  requestAnimationFrame(step);
}
step();

let lastActivity=Date.now(), stormStarted=false, overlayOpacity=0;
function startStorm(){ if(stormStarted) return; stormStarted=true; targetCount=STORM_COUNT; foxSvg.classList.add('show'); }
function stopStorm(){ if(!stormStarted) return; stormStarted=false; targetCount=BASE_COUNT; foxSvg.classList.remove('show'); overlayOpacity=0; }
function markActivity(){ lastActivity=Date.now(); if(stormStarted) stopStorm(); }
['mousemove','mousedown','touchstart','keydown','scroll'].forEach(e=>{ window.addEventListener(e,markActivity,{passive:true}); });
setInterval(()=>{
  if(Date.now()-lastActivity>=7000 && !stormStarted) startStorm();
},800);
(function overlayLoop(){
  if(stormStarted && overlayOpacity<0.55){ overlayOpacity=Math.min(0.55,overlayOpacity+0.007); }
  else if(!stormStarted && overlayOpacity>0){ overlayOpacity=Math.max(0,overlayOpacity-0.02); }
  if(overlayOpacity>0.002){ ctx.fillStyle=`rgba(255,255,255,${overlayOpacity*0.22})`; ctx.fillRect(0,0,W,H); }
  requestAnimationFrame(overlayLoop);
})();
