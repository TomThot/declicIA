const menuToggle = document.querySelector(".menu-toggle");
const menuBar = document.querySelector(".menu");
const sidebar = document.querySelector(".sidebar");

menuToggle.addEventListener("click", (e) => {
  e.stopPropagation(); // Empêche la propagation du clic
  menuBar.classList.toggle("active");
  sidebar.classList.toggle("active");
});

// Fermer la sidebar en cliquant ailleurs
document.addEventListener("click", (e) => {
  // Vérifier si le clic n'est pas sur la sidebar ou le bouton menu
  if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
    menuBar.classList.remove("active");
    sidebar.classList.remove("active");
  }
});

// Empêcher la fermeture si on clique dans la sidebar
sidebar.addEventListener("click", (e) => {
  e.stopPropagation();
});

// fermeture de section par clic sur flèche
document.addEventListener('DOMContentLoaded', function() {
  const sections = document.querySelectorAll('.collapsible-section');
  
  sections.forEach(section => {
    const h2 = section.querySelector('h2');
    
    h2.addEventListener('click', function() {
      section.classList.toggle('open');
    });
  });
});


// Sigmoïde :
 const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const PAD = 40;
  const tip = document.getElementById('tip');
  const cssVars = getComputedStyle(document.documentElement);
  const sigmaColors = {
    grid: cssVars.getPropertyValue('--sigma-grid').trim() || 'rgba(148, 163, 184, 0.16)',
    axis: cssVars.getPropertyValue('--sigma-axis').trim() || 'rgba(148, 163, 184, 0.5)',
    label: cssVars.getPropertyValue('--sigma-muted').trim() || '#94a3b8',
    curve: cssVars.getPropertyValue('--sigma-accent').trim() || '#60a5fa',
    point: cssVars.getPropertyValue('--sigma-accent2').trim() || '#f59e0b'
  };

  let k = 1, x0 = 0;

  // Mapping
  const xMin = -6, xMax = 6;
  const yMin = -0.1, yMax = 1.1;

  function toCanvas(x, y) {
    const cx = PAD + (x - xMin) / (xMax - xMin) * (W - 2 * PAD);
    const cy = H - PAD - (y - yMin) / (yMax - yMin) * (H - 2 * PAD);
    return [cx, cy];
  }

  function sigmoid(x) {
    return 1 / (1 + Math.exp(-k * (x - x0)));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Background grid
    ctx.strokeStyle = sigmaColors.grid;
    ctx.lineWidth = 1;
    for (let gx = xMin; gx <= xMax; gx++) {
      const [px] = toCanvas(gx, 0);
      ctx.beginPath(); ctx.moveTo(px, PAD); ctx.lineTo(px, H - PAD); ctx.stroke();
    }
    for (let gy = 0; gy <= 1; gy += 0.25) {
      const [, py] = toCanvas(0, gy);
      ctx.beginPath(); ctx.moveTo(PAD, py); ctx.lineTo(W - PAD, py); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = sigmaColors.axis;
    ctx.lineWidth = 1.5;
    const [ax0] = toCanvas(0, 0); const [ax1] = toCanvas(0, 1);
    const [, ay0] = toCanvas(xMin, 0); const [, ay1] = toCanvas(xMax, 0);
    ctx.beginPath(); ctx.moveTo(PAD, ax1); ctx.lineTo(PAD, H - PAD); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(PAD, H - PAD - (0 - yMin)/(yMax-yMin)*(H-2*PAD)); ctx.lineTo(W - PAD, H - PAD - (0 - yMin)/(yMax-yMin)*(H-2*PAD)); ctx.stroke();

    // Axis labels
    ctx.fillStyle = sigmaColors.label;
    ctx.font = '10px JetBrains Mono';
    ctx.textAlign = 'center';
    for (let gx = xMin + 2; gx <= xMax; gx += 2) {
      const [px, py] = toCanvas(gx, yMin);
      ctx.fillText(gx, px, py + 16);
    }
    ctx.textAlign = 'right';
    for (let gy = 0; gy <= 1; gy += 0.25) {
      const [px, py] = toCanvas(xMin, gy);
      ctx.fillText(gy.toFixed(2), px - 5, py + 4);
    }

    // Asymptotes dashed
    ctx.setLineDash([4, 6]);
    ctx.strokeStyle = sigmaColors.grid;
    ctx.lineWidth = 1;
    let [, py1] = toCanvas(0, 1);
    let [, py0] = toCanvas(0, 0);
    ctx.beginPath(); ctx.moveTo(PAD, py1); ctx.lineTo(W - PAD, py1); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(PAD, py0); ctx.lineTo(W - PAD, py0); ctx.stroke();
    ctx.setLineDash([]);

    // Sigmoid curve with glow
    ctx.lineWidth = 2.5;
    ctx.shadowColor = sigmaColors.curve;
    ctx.shadowBlur = 8;
    ctx.strokeStyle = sigmaColors.curve;
    ctx.beginPath();
    let first = true;
    for (let px = PAD; px <= W - PAD; px++) {
      const x = xMin + (px - PAD) / (W - 2 * PAD) * (xMax - xMin);
      const y = sigmoid(x);
      const [, py] = toCanvas(x, y);
      first ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      first = false;
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Inflection point
    const [ipx, ipy] = toCanvas(x0, 0.5);
    ctx.beginPath();
    ctx.arc(ipx, ipy, 5, 0, Math.PI * 2);
    ctx.fillStyle = sigmaColors.point;
    ctx.shadowColor = sigmaColors.point;
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // Controls
  const kSlider = document.getElementById('k');
  const x0Slider = document.getElementById('x0');
  const kVal = document.getElementById('kVal');
  const x0Val = document.getElementById('x0Val');

  kSlider.addEventListener('input', () => {
    k = parseFloat(kSlider.value);
    kVal.textContent = k.toFixed(1);
    draw();
  });

  x0Slider.addEventListener('input', () => {
    x0 = parseFloat(x0Slider.value);
    x0Val.textContent = x0.toFixed(1);
    draw();
  });

  // Tooltip on hover
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const x = xMin + (mx - PAD) / (W - 2 * PAD) * (xMax - xMin);
    if (x < xMin || x > xMax) { tip.style.opacity = 0; return; }
    const y = sigmoid(x);
    document.getElementById('tx').textContent = x.toFixed(3);
    document.getElementById('ty').textContent = y.toFixed(4);
    tip.style.opacity = 1;
    tip.style.left = (e.clientX + 12) + 'px';
    tip.style.top = (e.clientY - 20) + 'px';

    // Crosshair dot
    draw();
    const [cpx, cpy] = toCanvas(x, y);
    ctx.beginPath();
    ctx.arc(cpx, cpy, 4, 0, Math.PI * 2);
    ctx.fillStyle = sigmaColors.label;
    ctx.fill();
  });

  canvas.addEventListener('mouseleave', () => { tip.style.opacity = 0; draw(); });

  draw();
