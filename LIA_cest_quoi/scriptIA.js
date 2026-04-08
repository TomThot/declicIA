/**
 * L'IA c'est quoi - Script de page
 * Gère:
 * - le menu latéral
 * - les sections repliables
 * - les widgets visuels (sigmoïde / interactions pédagogiques)
 */
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
document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll(".collapsible-section");

  sections.forEach((section) => {
    const h2 = section.querySelector("h2");
    if (!h2) return;

    h2.addEventListener("click", function () {
      const isOpening = !section.classList.contains("open");
      section.classList.toggle("open");

      if (h2.id === "neurone" && isOpening) {
        alert(
          "La section suivante engage quelques notions mathématiques mais dans chaque étape, j'ai essayé de donner des exemples concrets. Ne bloquez pas sur les notations. Le formalisme mathématique impressionne mais vous pouvez en faire abstraction.",
        );
      }
    });
  });
});

// Sigmoïde :
const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");
const W = canvas.width,
  H = canvas.height;
const PAD = 40;
const tip = document.getElementById("tip");
const cssVars = getComputedStyle(document.documentElement);
const sigmaColors = {
  grid:
    cssVars.getPropertyValue("--sigma-grid").trim() ||
    "rgba(148, 163, 184, 0.16)",
  axis:
    cssVars.getPropertyValue("--sigma-axis").trim() ||
    "rgba(148, 163, 184, 0.5)",
  label: cssVars.getPropertyValue("--sigma-muted").trim() || "#94a3b8",
  curve: cssVars.getPropertyValue("--sigma-accent").trim() || "#60a5fa",
  point: cssVars.getPropertyValue("--sigma-accent2").trim() || "#f59e0b",
};

let k = 1,
  x0 = 0;

// Mapping
const xMin = -6,
  xMax = 6;
const yMin = -0.1,
  yMax = 1.1;

function toCanvas(x, y) {
  const cx = PAD + ((x - xMin) / (xMax - xMin)) * (W - 2 * PAD);
  const cy = H - PAD - ((y - yMin) / (yMax - yMin)) * (H - 2 * PAD);
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
    ctx.beginPath();
    ctx.moveTo(px, PAD);
    ctx.lineTo(px, H - PAD);
    ctx.stroke();
  }
  for (let gy = 0; gy <= 1; gy += 0.25) {
    const [, py] = toCanvas(0, gy);
    ctx.beginPath();
    ctx.moveTo(PAD, py);
    ctx.lineTo(W - PAD, py);
    ctx.stroke();
  }

  // Axes
  ctx.strokeStyle = sigmaColors.axis;
  ctx.lineWidth = 1.5;
  const [ax0] = toCanvas(0, 0);
  const [ax1] = toCanvas(0, 1);
  const [, ay0] = toCanvas(xMin, 0);
  const [, ay1] = toCanvas(xMax, 0);
  ctx.beginPath();
  ctx.moveTo(PAD, ax1);
  ctx.lineTo(PAD, H - PAD);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(PAD, H - PAD - ((0 - yMin) / (yMax - yMin)) * (H - 2 * PAD));
  ctx.lineTo(W - PAD, H - PAD - ((0 - yMin) / (yMax - yMin)) * (H - 2 * PAD));
  ctx.stroke();

  // Axis labels
  ctx.fillStyle = sigmaColors.label;
  ctx.font = "10px JetBrains Mono";
  ctx.textAlign = "center";
  for (let gx = xMin + 2; gx <= xMax; gx += 2) {
    const [px, py] = toCanvas(gx, yMin);
    ctx.fillText(gx, px, py + 16);
  }
  ctx.textAlign = "right";
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
  ctx.beginPath();
  ctx.moveTo(PAD, py1);
  ctx.lineTo(W - PAD, py1);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(PAD, py0);
  ctx.lineTo(W - PAD, py0);
  ctx.stroke();
  ctx.setLineDash([]);

  // Sigmoid curve with glow
  ctx.lineWidth = 2.5;
  ctx.shadowColor = sigmaColors.curve;
  ctx.shadowBlur = 8;
  ctx.strokeStyle = sigmaColors.curve;
  ctx.beginPath();
  let first = true;
  for (let px = PAD; px <= W - PAD; px++) {
    const x = xMin + ((px - PAD) / (W - 2 * PAD)) * (xMax - xMin);
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
const kSlider = document.getElementById("k");
const x0Slider = document.getElementById("x0");
const kVal = document.getElementById("kVal");
const x0Val = document.getElementById("x0Val");

kSlider.addEventListener("input", () => {
  k = parseFloat(kSlider.value);
  kVal.textContent = k.toFixed(1);
  draw();
});

x0Slider.addEventListener("input", () => {
  x0 = parseFloat(x0Slider.value);
  x0Val.textContent = x0.toFixed(1);
  draw();
});

// Tooltip on hover
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const x = xMin + ((mx - PAD) / (W - 2 * PAD)) * (xMax - xMin);
  if (x < xMin || x > xMax) {
    tip.style.opacity = 0;
    return;
  }
  const y = sigmoid(x);
  document.getElementById("tx").textContent = x.toFixed(3);
  document.getElementById("ty").textContent = y.toFixed(4);
  tip.style.opacity = 1;
  tip.style.left = e.clientX + 12 + "px";
  tip.style.top = e.clientY - 20 + "px";

  // Crosshair dot
  draw();
  const [cpx, cpy] = toCanvas(x, y);
  ctx.beginPath();
  ctx.arc(cpx, cpy, 4, 0, Math.PI * 2);
  ctx.fillStyle = sigmaColors.label;
  ctx.fill();
});

canvas.addEventListener("mouseleave", () => {
  tip.style.opacity = 0;
  draw();
});

draw();

//Gestion de l'erreur chez les LLM
// ===== INIT APRÈS CHARGEMENT DOM =====
window.addEventListener("DOMContentLoaded", () => {
  const graphCanvas = document.getElementById("graph");
  const graphCtx = graphCanvas.getContext("2d");

  const alphaSlider = document.getElementById("alpha");
  const eminSlider = document.getElementById("emin");
  const aSlider = document.getElementById("a");
  let mouseX = null;

  let currentCurve = [];
  let targetCurve = [];

  function computeCurve(alpha, emin, a) {
    let curve = [];

    for (let i = 1; i < 600; i++) {
      let compute = i / 10;
      let error = emin + a * Math.pow(compute, -alpha);
      curve.push({ compute, error });
    }

    return curve;
  }

  function updateValues() {
    document.getElementById("alphaVal").textContent = alphaSlider.value;
    document.getElementById("eminVal").textContent = eminSlider.value;
    document.getElementById("aVal").textContent = aSlider.value;
  }

  function drawGraph(animated = true) {
    const alpha = parseFloat(alphaSlider.value);
    const emin = parseFloat(eminSlider.value);
    const a = parseFloat(aSlider.value);

    updateValues();

    targetCurve = computeCurve(alpha, emin, a);

    if (!animated || currentCurve.length === 0) {
      currentCurve = targetCurve;
    }
  }

  // ===== COULEURS DARK (CSS variables, cohérentes avec la sigmoïde) =====
  const gCss = getComputedStyle(document.documentElement);
  const graphColors = {
    grid:
      gCss.getPropertyValue("--sigma-grid").trim() ||
      "rgba(148, 163, 184, 0.16)",
    axis:
      gCss.getPropertyValue("--sigma-axis").trim() ||
      "rgba(148, 163, 184, 0.5)",
    label: gCss.getPropertyValue("--sigma-muted").trim() || "#94a3b8",
    curve: gCss.getPropertyValue("--sigma-accent").trim() || "#60a5fa",
    asymptote: gCss.getPropertyValue("--sigma-accent2").trim() || "#f59e0b",
    annotation: gCss.getPropertyValue("--sigma-muted").trim() || "#94a3b8",
    tooltip: gCss.getPropertyValue("--sigma-accent").trim() || "#60a5fa",
  };

  function render() {
    const width = graphCanvas.width;
    const height = graphCanvas.height;
    const padding = 50;

    graphCtx.clearRect(0, 0, width, height);

    const maxCompute = 60;
    const maxError = 2.5;

    const logMin = Math.log10(1);
    const logMax = Math.log10(maxCompute);

    const scaleX = (val) => {
      let logVal = Math.log10(Math.max(val, 0.0001));
      return (
        padding +
        ((logVal - logMin) / (logMax - logMin)) * (width - 2 * padding)
      );
    };

    const scaleY = (val) =>
      height - padding - (val / maxError) * (height - 2 * padding);

    // ===== INTERPOLATION =====
    for (let i = 0; i < currentCurve.length; i++) {
      currentCurve[i].error +=
        (targetCurve[i].error - currentCurve[i].error) * 0.1;
    }

    // ===== GRILLE =====
    graphCtx.beginPath();
    for (let i = 0; i <= 6; i++) {
      let x = padding + i * ((width - 2 * padding) / 6);
      graphCtx.moveTo(x, padding);
      graphCtx.lineTo(x, height - padding);
    }
    for (let i = 0; i <= 5; i++) {
      let y = padding + i * ((height - 2 * padding) / 5);
      graphCtx.moveTo(padding, y);
      graphCtx.lineTo(width - padding, y);
    }
    graphCtx.strokeStyle = graphColors.grid;
    graphCtx.lineWidth = 1;
    graphCtx.stroke();

    // ===== AXES =====
    graphCtx.beginPath();
    graphCtx.moveTo(padding, padding);
    graphCtx.lineTo(padding, height - padding);
    graphCtx.lineTo(width - padding, height - padding);
    graphCtx.strokeStyle = graphColors.axis;
    graphCtx.lineWidth = 2;
    graphCtx.stroke();

    // ===== GRADUATIONS =====
    graphCtx.font = "11px Arial";

    // Axe X en log
    const ticks = [1, 2, 5, 10, 20, 50];

    ticks.forEach((value) => {
      let x = scaleX(value);

      graphCtx.beginPath();
      graphCtx.strokeStyle = graphColors.axis;
      graphCtx.lineWidth = 1;
      graphCtx.moveTo(x, height - padding);
      graphCtx.lineTo(x, height - padding + 5);
      graphCtx.stroke();

      graphCtx.fillStyle = graphColors.label;
      graphCtx.fillText(value, x - 10, height - padding + 18);
    });

    // Axe Y (erreur)
    for (let i = 0; i <= 5; i++) {
      let value = (i * maxError) / 5;
      let y = scaleY(value);

      graphCtx.beginPath();
      graphCtx.strokeStyle = graphColors.axis;
      graphCtx.lineWidth = 1;
      graphCtx.moveTo(padding - 5, y);
      graphCtx.lineTo(padding, y);
      graphCtx.stroke();

      graphCtx.fillStyle = graphColors.label;
      graphCtx.fillText(value.toFixed(1), padding - 35, y + 3);
    }

    // ===== COURBE avec glow =====
    graphCtx.beginPath();
    currentCurve.forEach((point, i) => {
      let x = scaleX(point.compute);
      let y = scaleY(point.error);

      if (i === 0) graphCtx.moveTo(x, y);
      else graphCtx.lineTo(x, y);
    });

    graphCtx.shadowColor = graphColors.curve;
    graphCtx.shadowBlur = 8;
    graphCtx.strokeStyle = graphColors.curve;
    graphCtx.lineWidth = 2.5;
    graphCtx.stroke();
    graphCtx.shadowBlur = 0;

    // ===== ASYMPTOTE =====
    const emin = parseFloat(eminSlider.value);

    graphCtx.beginPath();
    graphCtx.moveTo(padding, scaleY(emin));
    graphCtx.lineTo(width - padding, scaleY(emin));
    graphCtx.setLineDash([6, 6]);
    graphCtx.shadowColor = graphColors.asymptote;
    graphCtx.shadowBlur = 6;
    graphCtx.strokeStyle = graphColors.asymptote;
    graphCtx.lineWidth = 1.5;
    graphCtx.stroke();
    graphCtx.setLineDash([]);
    graphCtx.shadowBlur = 0;

    // ===== POINT DYNAMIQUE =====
    const mid = currentCurve[Math.floor(currentCurve.length * 0.7)];
    if (mid) {
      const px = scaleX(mid.compute);
      const py = scaleY(mid.error);

      graphCtx.beginPath();
      graphCtx.arc(px, py, 6, 0, Math.PI * 2);
      graphCtx.fillStyle = graphColors.curve;
      graphCtx.shadowColor = graphColors.curve;
      graphCtx.shadowBlur = 8;
      graphCtx.fill();
      graphCtx.shadowBlur = 0;
    }

    // ===== LABELS =====
    graphCtx.font = "12px Arial";

    graphCtx.fillStyle = graphColors.label;
    graphCtx.fillText("Compute", width / 2 - 30, height - 10);

    graphCtx.save();
    graphCtx.translate(15, height / 2);
    graphCtx.rotate(-Math.PI / 2);
    graphCtx.fillStyle = graphColors.label;
    graphCtx.fillText("Erreur", 0, 0);
    graphCtx.restore();

    graphCtx.fillStyle = graphColors.asymptote;
    graphCtx.fillText("limite", width - 80, scaleY(emin) - 5);

    // ===== INTERACTION SOURIS =====
    if (mouseX !== null && currentCurve.length > 0) {
      let closest = currentCurve.reduce((prev, curr) => {
        let prevX = scaleX(prev.compute);
        let currX = scaleX(curr.compute);
        return Math.abs(currX - mouseX) < Math.abs(prevX - mouseX)
          ? curr
          : prev;
      });

      const px = scaleX(closest.compute);
      const py = scaleY(closest.error);

      graphCtx.beginPath();
      graphCtx.arc(px, py, 5, 0, Math.PI * 2);
      graphCtx.fillStyle = graphColors.tooltip;
      graphCtx.fill();

      graphCtx.fillStyle = graphColors.label;
      const text = `compute: ${closest.compute.toFixed(1)} | erreur: ${closest.error.toFixed(2)}`;
      const textWidth = graphCtx.measureText(text).width;

      let tx = px + 10;
      if (tx + textWidth > width) {
        tx = px - textWidth - 10;
      }

      graphCtx.fillText(text, tx, py - 10);
    }

    // ===== ANNOTATION =====
    graphCtx.fillStyle = graphColors.annotation;
    graphCtx.font = "12px Arial";

    graphCtx.fillText("Zone de gains rapides", scaleX(2), scaleY(1.5));
    graphCtx.fillText("Rendements décroissants", scaleX(15), scaleY(0.6));
    graphCtx.fillText(
      "Plateau / limite",
      scaleX(30),
      scaleY(parseFloat(eminSlider.value) + 0.1),
    );
    requestAnimationFrame(render);
  }

  // ===== EVENTS =====
  alphaSlider.addEventListener("input", () => drawGraph(true));
  eminSlider.addEventListener("input", () => drawGraph(true));
  aSlider.addEventListener("input", () => drawGraph(true));

  graphCanvas.addEventListener("mousemove", (e) => {
    const rect = graphCanvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
  });

  graphCanvas.addEventListener("mouseleave", () => {
    mouseX = null;
  });

  // ===== INIT =====
  drawGraph(false);
  render();
});
