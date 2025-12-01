document.addEventListener('DOMContentLoaded', () => {

  /* -------------------
     NIEVE CON PARALLAX
  ------------------- */
  const canvas = document.getElementById('snowCanvas');
  const ctx = canvas.getContext('2d');
  const stormOverlay = document.getElementById('stormOverlay');
  if (!ctx) return console.warn('Canvas 2D no disponible.');

  let W = window.innerWidth;
  let H = window.innerHeight;
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize);
  resize();

  const BASE_COUNT = 120;
  const STORM_COUNT = 520;
  let targetCount = BASE_COUNT;
  let flakes = [];

  function initFlakes(n) {
    flakes = [];
    for (let i = 0; i < n; i++) {
      const size = 0.8 + Math.random() * 3.2;
      flakes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: size,
        speed: 0.3 + size * 0.4, // Parallax: flakes grandes más rápidos
        drift: (Math.random() - 0.5) * 1.8
      });
    }
  }
  initFlakes(BASE_COUNT);

  function step() {
    ctx.clearRect(0, 0, W, H);

    if (flakes.length < targetCount) {
      const add = Math.min(8, targetCount - flakes.length);
      for (let i = 0; i < add; i++) {
        const size = 0.8 + Math.random() * 3.2;
        flakes.push({
          x: Math.random() * W,
          y: -10 - Math.random() * 100,
          r: size,
          speed: 0.3 + size * 0.4,
          drift: (Math.random() - 0.5) * 2
        });
      }
    } else if (flakes.length > targetCount) {
      flakes.length = Math.max(targetCount, flakes.length - 10);
    }

    for (let f of flakes) {
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();

      f.y += f.speed;
      f.x += Math.sin(f.y * 0.008) * f.drift + Math.cos(f.y * 0.004) * 0.2;

      if (f.y > H + 6) { f.y = -8 - Math.random() * 60; f.x = Math.random() * W; }
      if (f.x > W + 10) f.x = -20;
      if (f.x < -20) f.x = W + 10;
    }

    requestAnimationFrame(step);
  }
  step();

  /* -------------------
     ZORRO Y TORMENTA
  ------------------- */
  const foxContainer = document.getElementById('foxContainer');
  const fox = document.createElement('div');
  fox.className = 'fox';
  fox.innerHTML = `<div class="head"><div class="ear1"></div><div class="ear2"></div></div><div class="body"></div><div class="tail"></div>`;
  foxContainer.appendChild(fox);

  let x = -150, dir = 1;
  const foxWidth = 120;
  let vx = 160;
  let jumpAmplitude = Math.min(80, H / 3);
  let jumpPeriod = 1000;
  let lastTime = null;

  let lastActivity = Date.now();
  let active = false;
  let stormStarted = false;

  function markActivity() {
    lastActivity = Date.now();
    if (stormStarted) stopStorm();
  }
  ['mousemove','mousedown','touchstart','keydown','scroll'].forEach(e=>{
    window.addEventListener(e, markActivity, {passive:true});
  });

  function applyTransform(y, currentDir) {
    fox.style.transform = `translateY(${-y}px) translateZ(0) scaleX(${currentDir * -1})`;
    foxContainer.style.left = `${Math.round(x)}px`;
  }

  function startStorm() {
    if (stormStarted) return;
    stormStarted = true;
    targetCount = STORM_COUNT;
    foxContainer.classList.add('show');
    stormOverlay.classList.add('show');
    active = true;
  }

  function stopStorm() {
    if (!stormStarted) return;
    stormStarted = false;
    targetCount = BASE_COUNT;
    foxContainer.classList.remove('show');
    stormOverlay.classList.remove('show');
    active = false;
  }

  function foxLoop(ts) {
    if (!lastTime) lastTime = ts;
    const dt = ts - lastTime;
    lastTime = ts;

    if (!active && Date.now() - lastActivity > 7000) startStorm();

    if (active) {
      x += dir * vx * (dt / 1000);
      const vw = window.innerWidth;
      const leftEdge = -foxWidth - 20;
      const rightEdge = vw - foxWidth + 20;
      if (x >= rightEdge) { dir = -1; x = rightEdge; }
      if (x <= leftEdge) { dir = 1; x = leftEdge; }

      const progress = (performance.now() % jumpPeriod) / jumpPeriod;
      const y = Math.sin(Math.PI * progress) * jumpAmplitude;

      applyTransform(y, dir);
    }

    requestAnimationFrame(foxLoop);
  }

  applyTransform(0, dir);
  requestAnimationFrame(foxLoop);

});
