// script.js - nieve estable + overlay por inactividad + resize seguro

const canvas = document.getElementById('snowCanvas');
if (!canvas) {
  console.error("No se ha encontrado el canvas #snowCanvas");
} 
const ctx = canvas.getContext && canvas.getContext('2d');
if (!ctx) {
  console.error("No se pudo obtener el contexto 2D del canvas. Revisa el navegador.");
}

// Configuración
let W = 0, H = 0;
let flakes = [];
const BASE_FLAKES = 120;     // cantidad base
const STORM_FLAKES = 420;    // cantidad en inactividad
let targetFlakes = BASE_FLAKES;
let overlayOpacity = 0;      // overlay de nieve que cubre la pantalla (0..1)
let lastActivity = Date.now();
let rafId = null;

// Resize estable (solo cuando cambia tamaño real)
function resize() {
  const newW = window.innerWidth;
  const newH = window.innerHeight;
  if (newW === W && newH === H) return;
  W = canvas.width = newW;
  H = canvas.height = newH;
  rebuildFlakes(); // recalcula posiciones a nuevo tamaño
}

function rebuildFlakes() {
  // Mantén la cantidad actual aproximada en 'targetFlakes'
  const count = Math.max(20, targetFlakes);
  flakes = [];
  for (let i = 0; i < count; i++) {
    flakes.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 0.8 + Math.random() * 3.2,
      speed: 0.4 + Math.random() * 1.2,
      drift: (Math.random() - 0.5) * 1.6
    });
  }
}

// Lógica inactividad
function resetActivity() {
  lastActivity = Date.now();
  // suavemente reducimos overlay y bajamos número de copos si había tormenta
  overlayOpacity = Math.max(0, overlayOpacity - 0.12);
  if (targetFlakes !== BASE_FLAKES) {
    targetFlakes = BASE_FLAKES;
    // desplazamiento leve: rehacer flakes lentamente la próxima vez que resize o en el loop
    if (flakes.length > targetFlakes) {
      flakes.length = targetFlakes;
    }
  }
}

// Eventos de interacción
['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'].forEach(ev =>
  window.addEventListener(ev, resetActivity, { passive: true })
);

// Inicialización
function start() {
  resize();
  targetFlakes = BASE_FLAKES;
  rebuildFlakes();
  if (rafId) cancelAnimationFrame(rafId);
  loop();
}
window.addEventListener('resize', () => {
  // debounce ligero
  clearTimeout(window.__resizeTimeout);
  window.__resizeTimeout = setTimeout(resize, 120);
});

// Dibuja frame
function loop() {
  ctx.clearRect(0, 0, W, H);

  // actualiza e dibuja copos
  for (let i = 0; i < flakes.length; i++) {
    const f = flakes[i];
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.fill();

    f.y += f.speed;
    f.x += Math.sin(f.y * 0.008) * f.drift + Math.cos(f.y * 0.004) * 0.2;

    if (f.y > H + 6) {
      // respawn arriba con posición x aleatoria
      f.y = -8 - Math.random() * 40;
      f.x = Math.random() * W;
    } else if (f.x > W + 10) {
      f.x = -10;
    } else if (f.x < -10) {
      f.x = W + 10;
    }
  }

  // Mantén cantidad de flakes acorde a targetFlakes: añade o recorta lentamente
  if (flakes.length < targetFlakes && flakes.length < 1200) {
    // añade algunos nuevos cada frame hasta alcanzar target
    const addCount = Math.min(6, targetFlakes - flakes.length);
    for (let k = 0; k < addCount; k++) {
      flakes.push({
        x: Math.random() * W,
        y: -10 - Math.random() * 40,
        r: 0.8 + Math.random() * 3.2,
        speed: 0.4 + Math.random() * 1.2,
        drift: (Math.random() - 0.5) * 1.6
      });
    }
  } else if (flakes.length > targetFlakes) {
    // acorta suavemente
    flakes.length = Math.max(targetFlakes, flakes.length - 6);
  }

  // Comprobar inactividad -> si pasa 9s activamos "tormenta" progresiva
  const idle = (Date.now() - lastActivity);
  if (idle > 9000) {
    // aumenta overlay y número de copos
    overlayOpacity = Math.min(1, overlayOpacity + 0.0065);
    targetFlakes = STORM_FLAKES;
  } else {
    // si no está inactivo, reduce overlay suavemente
    overlayOpacity = Math.max(0, overlayOpacity - 0.01);
  }

  // dibuja overlay de nieve (capa blanca translúcida)
  if (overlayOpacity > 0.003) {
    ctx.fillStyle = `rgba(255,255,255,${overlayOpacity * 0.32})`;
    ctx.fillRect(0, 0, W, H);
  }

  rafId = requestAnimationFrame(loop);
}

// comprobación de contexto y arranque
if (ctx) {
  start();
} else {
  // si no hay ctx no hagas nada para no romper la página
  console.warn('Canvas 2D no disponible. La animación de nieve está desactivada.');
}
