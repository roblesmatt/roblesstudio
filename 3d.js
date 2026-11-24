(() => {
  const studio = window.RoblesStudio;
  if (!studio) return;

  const D3_ICONS = {
    parametric: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/><circle cx="11" cy="11" r="1.5"/><circle cx="19" cy="8" r="1.5"/></svg>`,
    sculpt: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3c4.5 0 8 3.2 8 7.5 0 5.5-4.5 10.5-8 10.5S4 16 4 10.5C4 6.2 7.5 3 12 3Z"/><path d="M9 10c1.5-1.5 4.5-1.5 6 0"/></svg>`,
    hardSurface: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M7.5 4.21l9 5.2M7.5 19.79V14.6L3 12"/></svg>`,
    dim: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 6H3M21 18H3M6 6v12M18 6v12"/></svg>`,
    height: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3v18M8 7l4-4 4 4M8 17l4 4 4-4"/></svg>`,
    inflate: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="7"/><path d="M12 8v8M8 12h8"/></svg>`,
    smooth: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 15c3-6 6-6 9 0s6 6 9 0"/></svg>`,
    bevel: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 16V8l4-4h8l4 4v8l-4 4H8l-4-4z"/></svg>`,
    edges: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="16" height="16"/><line x1="4" y1="4" x2="20" y2="20"/></svg>`,
    reset: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`,
  };

  // Submenus preservados exatamente: "parametric" | "sculpt" | "hard-surface"
  const WORKSPACES_3D = [
    {
      id: "parametric",
      label: "Paramétrico",
      alertText: "Área de trabalho 3D: Paramétrico (Open Cascade) — Sweep, Loft e cotas ativas",
    },
    {
      id: "sculpt",
      label: "Escultura",
      alertText: "Área de trabalho 3D: Escultura — Vidro, Madeira, Metal e volume orgânico ativos",
    },
    {
      id: "hard-surface",
      label: "Hard Surface",
      alertText: "Área de trabalho 3D: Hard Surface — Retopologia, chanfro e arestas ativos",
    },
  ];

  // Ferramentas primárias (esquerda) -> Predefinições com miniatura + título (topo central) -> Secundárias (direita)
  const TOOLS_BY_WORKSPACE = {
    parametric: [
      {
        id: "dim",
        title: "Primária · Cotas & Sweep / Loft (Open Cascade)",
        icon: D3_ICONS.dim,
        defaultSecondary: "w-plus",
        presets: [
          {
            id: "oc-sweep",
            label: "Sweep",
            title: "Open Cascade · Varredura (Sweep) Paramétrica",
            modeShape: "sweep",
            stroke: "#38bdf8",
            fill: "rgba(56, 189, 248, 0.14)",
            previewSvg: `<svg width="24" height="16" viewBox="0 0 24 16" fill="none"><rect width="24" height="16" rx="3" fill="#0F172A"/><path d="M4 12C8 4 13 12 20 5" stroke="#38BDF8" stroke-width="1.6" stroke-linecap="round"/><circle cx="20" cy="5" r="2" fill="#FBBF24"/></svg>`,
          },
          {
            id: "oc-loft",
            label: "Loft",
            title: "Open Cascade · Loft Entre Perfis",
            modeShape: "loft",
            stroke: "#f59e0b",
            fill: "rgba(245, 158, 11, 0.16)",
            previewSvg: `<svg width="24" height="16" viewBox="0 0 24 16" fill="none"><rect width="24" height="16" rx="3" fill="#1C1917"/><ellipse cx="8" cy="10" rx="3" ry="2" stroke="#FBBF24" stroke-width="1.2"/><ellipse cx="17" cy="6" rx="4.5" ry="2.8" stroke="#F59E0B" stroke-width="1.3"/></svg>`,
          },
          {
            id: "oc-box",
            label: "CAD Box",
            title: "Open Cascade · Sólido Paramétrico",
            modeShape: "box",
            stroke: "#34d399",
            fill: "rgba(52, 211, 153, 0.14)",
            previewSvg: `<svg width="24" height="16" viewBox="0 0 24 16" fill="none"><rect width="24" height="16" rx="3" fill="#0D1F1A"/><polygon points="12,2.5 18,5.5 18,11.5 12,14.5 6,11.5 6,5.5" stroke="#34D399" stroke-width="1.3"/></svg>`,
          },
        ],
        secondary: [
          { id: "w-minus", label: "-Largura", icon: D3_ICONS.dim },
          { id: "w-plus", label: "+Largura", icon: D3_ICONS.dim },
          { id: "h-minus", label: "-Altura", icon: D3_ICONS.height },
          { id: "h-plus", label: "+Altura", icon: D3_ICONS.height },
        ],
      },
      {
        id: "height",
        title: "Primária · Extrusão & Altura Paramétrica",
        icon: D3_ICONS.height,
        defaultSecondary: "h-plus",
        presets: [
          {
            id: "oc-loft-tall",
            label: "Loft Alto",
            title: "Open Cascade · Loft Vertical",
            modeShape: "loft",
            stroke: "#f59e0b",
            fill: "rgba(245, 158, 11, 0.16)",
            previewSvg: `<svg width="24" height="16" viewBox="0 0 24 16" fill="none"><rect width="24" height="16" rx="3" fill="#1C1917"/><ellipse cx="8" cy="10" rx="3" ry="2" stroke="#FBBF24" stroke-width="1.2"/><ellipse cx="17" cy="6" rx="4.5" ry="2.8" stroke="#F59E0B" stroke-width="1.3"/></svg>`,
          },
          {
            id: "oc-sweep-tall",
            label: "Sweep Alto",
            title: "Open Cascade · Varredura Vertical",
            modeShape: "sweep",
            stroke: "#60a5fa",
            fill: "rgba(96, 165, 250, 0.14)",
            previewSvg: `<svg width="24" height="16" viewBox="0 0 24 16" fill="none"><rect width="24" height="16" rx="3" fill="#0F172A"/><path d="M4 12C8 4 13 12 20 5" stroke="#60A5FA" stroke-width="1.6"/></svg>`,
          },
        ],
        secondary: [
          { id: "h-minus", label: "-Altura", icon: D3_ICONS.height },
          { id: "h-plus", label: "+Altura", icon: D3_ICONS.height },
          { id: "w-plus", label: "+Largura", icon: D3_ICONS.dim },
        ],
      },
    ],

    sculpt: [
      {
        id: "inflate",
        title: "Primária · Inflar Volume & Materiais de Escultura",
        icon: D3_ICONS.inflate,
        defaultSecondary: "vol-plus",
        presets: [
          {
            id: "mat-vidro",
            label: "Vidro",
            title: "Escultura · Material Vidro",
            modeShape: "sculpt",
            stroke: "#bae6fd",
            fill: "rgba(125, 211, 252, 0.22)",
            previewSvg: `<svg width="24" height="16" viewBox="0 0 24 16" fill="none"><rect width="24" height="16" rx="3" fill="#0C1924"/><circle cx="12" cy="8" r="5" fill="#7DD3FC" fill-opacity="0.3" stroke="#BAE6FD" stroke-width="1.3"/></svg>`,
          },
          {
            id: "mat-madeira",
            label: "Madeira",
            title: "Escultura · Material Madeira",
            modeShape: "sculpt",
            stroke: "#fbbf24",
            fill: "rgba(180, 83, 9, 0.24)",
            previewSvg: `<svg width="24" height="16" viewBox="0 0 24 16" fill="none"><rect width="24" height="16" rx="3" fill="#23160C"/><ellipse cx="12" cy="8" rx="6.5" ry="4.2" fill="#B45309" fill-opacity="0.4" stroke="#FBBF24" stroke-width="1.3"/></svg>`,
          },
          {
            id: "mat-metal",
            label: "Metal",
            title: "Escultura · Material Metal",
            modeShape: "sculpt",
            stroke: "#f8fafc",
            fill: "rgba(226, 232, 240, 0.2)",
            previewSvg: `<svg width="24" height="16" viewBox="0 0 24 16" fill="none"><rect width="24" height="16" rx="3" fill="#18181B"/><circle cx="12" cy="8" r="5" fill="#CBD5E1" fill-opacity="0.25" stroke="#F8FAFC" stroke-width="1.3"/></svg>`,
          },
        ],
        secondary: [
          { id: "vol-minus", label: "-Volume", icon: D3_ICONS.inflate },
          { id: "vol-plus", label: "+Volume", icon: D3_ICONS.inflate },
          { id: "smooth-more", label: "Suavizar", icon: D3_ICONS.smooth },
        ],
      },
      {
        id: "smooth",
        title: "Primária · Suavizar Superfície Esculpida",
        icon: D3_ICONS.smooth,
        defaultSecondary: "smooth-more",
        presets: [
          {
            id: "mat-vidro-smooth",
            label: "Vidro",
            title: "Escultura · Vidro Suave",
            modeShape: "sculpt",
            stroke: "#bae6fd",
            fill: "rgba(125, 211, 252, 0.22)",
            previewSvg: `<svg width="24" height="16" viewBox="0 0 24 16" fill="none"><rect width="24" height="16" rx="3" fill="#0C1924"/><circle cx="12" cy="8" r="5" fill="#7DD3FC" fill-opacity="0.3" stroke="#BAE6FD" stroke-width="1.3"/></svg>`,
          },
          {
            id: "mat-madeira-smooth",
            label: "Madeira",
            title: "Escultura · Madeira Suave",
            modeShape: "sculpt",
            stroke: "#fbbf24",
            fill: "rgba(180, 83, 9, 0.24)",
            previewSvg: `<svg width="24" height="16" viewBox="0 0 24 16" fill="none"><rect width="24" height="16" rx="3" fill="#23160C"/><ellipse cx="12" cy="8" rx="6.5" ry="4.2" fill="#B45309" fill-opacity="0.4" stroke="#FBBF24" stroke-width="1.3"/></svg>`,
          },
          {
            id: "mat-metal-smooth",
            label: "Metal",
            title: "Escultura · Metal Suave",
            modeShape: "sculpt",
            stroke: "#f8fafc",
            fill: "rgba(226, 232, 240, 0.2)",
            previewSvg: `<svg width="24" height="16" viewBox="0 0 24 16" fill="none"><rect width="24" height="16" rx="3" fill="#18181B"/><circle cx="12" cy="8" r="5" fill="#CBD5E1" fill-opacity="0.25" stroke="#F8FAFC" stroke-width="1.3"/></svg>`,
          },
        ],
        secondary: [
          { id: "smooth-more", label: "Mais Suave", icon: D3_ICONS.smooth },
          { id: "vol-plus", label: "+Volume", icon: D3_ICONS.inflate },
        ],
      },
    ],

    "hard-surface": [
      {
        id: "bevel",
        title: "Primária · Chanfro & Retopologia (estilo Blender)",
        icon: D3_ICONS.bevel,
        defaultSecondary: "gap-plus",
        presets: [
          {
            id: "retopo-quads",
            label: "Retopo Quads",
            title: "Blender · Retopologia em Quads",
            modeShape: "hard",
            retopo: "quads",
            stroke: "#f59e0b",
            fill: "rgba(245, 158, 11, 0.14)",
            previewSvg: `<svg width="24" height="16" viewBox="0 0 24 16" fill="none"><rect width="24" height="16" rx="3" fill="#18181B"/><rect x="5" y="3" width="14" height="10" stroke="#F59E0B" stroke-width="1.2"/><line x1="12" y1="3" x2="12" y2="13" stroke="#FBBF24" stroke-width="1"/><line x1="5" y1="8" x2="19" y2="8" stroke="#FBBF24" stroke-width="1"/></svg>`,
          },
          {
            id: "retopo-loops",
            label: "Edge Loops",
            title: "Blender · Retopologia Edge Loops",
            modeShape: "hard",
            retopo: "loops",
            stroke: "#38bdf8",
            fill: "rgba(56, 189, 248, 0.14)",
            previewSvg: `<svg width="24" height="16" viewBox="0 0 24 16" fill="none"><rect width="24" height="16" rx="3" fill="#0F172A"/><polygon points="12,2.5 18.5,5.5 18.5,10.5 12,13.5 5.5,10.5 5.5,5.5" stroke="#38BDF8" stroke-width="1.2"/></svg>`,
          },
        ],
        secondary: [
          { id: "gap-minus", label: "-Folga", icon: D3_ICONS.bevel },
          { id: "gap-plus", label: "+Folga", icon: D3_ICONS.bevel },
          { id: "toggle-diag", label: "Diagonais", icon: D3_ICONS.edges },
        ],
      },
      {
        id: "edges",
        title: "Primária · Arestas & Diagonais de Retopologia",
        icon: D3_ICONS.edges,
        defaultSecondary: "toggle-diag",
        presets: [
          {
            id: "retopo-quads-e",
            label: "Retopo Quads",
            title: "Blender · Retopologia em Quads",
            modeShape: "hard",
            retopo: "quads",
            stroke: "#f59e0b",
            fill: "rgba(245, 158, 11, 0.14)",
            previewSvg: `<svg width="24" height="16" viewBox="0 0 24 16" fill="none"><rect width="24" height="16" rx="3" fill="#18181B"/><rect x="5" y="3" width="14" height="10" stroke="#F59E0B" stroke-width="1.2"/><line x1="12" y1="3" x2="12" y2="13" stroke="#FBBF24" stroke-width="1"/><line x1="5" y1="8" x2="19" y2="8" stroke="#FBBF24" stroke-width="1"/></svg>`,
          },
          {
            id: "retopo-loops-e",
            label: "Edge Loops",
            title: "Blender · Retopologia Edge Loops",
            modeShape: "hard",
            retopo: "loops",
            stroke: "#38bdf8",
            fill: "rgba(56, 189, 248, 0.14)",
            previewSvg: `<svg width="24" height="16" viewBox="0 0 24 16" fill="none"><rect width="24" height="16" rx="3" fill="#0F172A"/><polygon points="12,2.5 18.5,5.5 18.5,10.5 12,13.5 5.5,10.5 5.5,5.5" stroke="#38BDF8" stroke-width="1.2"/></svg>`,
          },
        ],
        secondary: [
          { id: "toggle-diag", label: "Diagonais", icon: D3_ICONS.edges },
          { id: "gap-plus", label: "+Folga", icon: D3_ICONS.bevel },
        ],
      },
    ],
  };

  let activeWorkspace3D = "parametric";

  const activeToolByWs = {
    parametric: "dim",
    sculpt: "inflate",
    "hard-surface": "bevel",
  };

  const activePresetByWs = {
    parametric: "oc-sweep",
    sculpt: "mat-vidro",
    "hard-surface": "retopo-quads",
  };

  const activeSecondaryByWs = {
    parametric: "w-plus",
    sculpt: "vol-plus",
    "hard-surface": "gap-plus",
  };

  const paramState = { width: 4.0, height: 2.2, depth: 3.0 };
  const sculptState = { intensity: 0.55, smoothness: 0.5 };
  const hardState = { gap: 1.4, showDiagonals: true };

  let alertEl = null;
  let alertTimer = null;

  let isDragging = false;
  let isPanning = false;
  let lastX = 0;
  let lastY = 0;
  let isModuleActive = false;
  let barObserver = null;
  let isApplyingBars = false;

  function getWorkspaceMeta() {
    return WORKSPACES_3D.find((w) => w.id === activeWorkspace3D) || WORKSPACES_3D[0];
  }

  function getPrimaryToolObj() {
    const list = TOOLS_BY_WORKSPACE[activeWorkspace3D] || TOOLS_BY_WORKSPACE.parametric;
    const tid = activeToolByWs[activeWorkspace3D];
    return list.find((t) => t.id === tid) || list[0];
  }

  function getActivePresetObj() {
    const prim = getPrimaryToolObj();
    const pid = activePresetByWs[activeWorkspace3D];
    return prim.presets.find((p) => p.id === pid) || prim.presets[0];
  }

  function ensureAlertBanner() {
    if (alertEl) return alertEl;
    const el = document.createElement("div");
    el.className = "hud-pill";
    el.style.cssText = `
      top: 66px;
      left: 50%;
      transform: translateX(-50%);
      display: none;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      font-size: 11px;
      font-weight: 600;
      color: #ffffff;
      border-color: rgba(245, 158, 11, 0.4);
      z-index: 30;
      pointer-events: none;
      white-space: nowrap;
    `;
    document.querySelector(".viewport, .studio-shell, body")?.appendChild(el);
    alertEl = el;
    return el;
  }

  function showWorkspaceAlert(meta) {
    const el = ensureAlertBanner();
    el.innerHTML = `
      <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--accent-amber);"></span>
      <span>${meta.alertText}</span>
    `;
    el.style.display = "inline-flex";

    clearTimeout(alertTimer);
    alertTimer = setTimeout(() => {
      if (alertEl) alertEl.style.display = "none";
    }, 2600);
  }

  function project3D(x, y, z, width, height) {
    const cam = studio.camera;
    const cosY = Math.cos(cam.yaw);
    const sinY = Math.sin(cam.yaw);
    const cosP = Math.cos(cam.pitch);
    const sinP = Math.sin(cam.pitch);

    const x1 = x * cosY - z * sinY;
    const z1 = x * sinY + z * cosY;
    const y2 = y * cosP - z1 * sinP;
    const z2 = y * sinP + z1 * cosP;

    const fov = 950;
    const scale = fov / (fov + z2 * cam.zoom * 0.45);
    return {
      x: width / 2 + cam.panX + x1 * cam.zoom * scale,
      y: height / 2 + cam.panY - y2 * cam.zoom * scale,
    };
  }

  function drawGrid(ctx, width, height) {
    const gridHalf = 22;
    for (let i = -gridHalf; i <= gridHalf; i++) {
      if (i === 0) continue;
      const isMajor = i % 5 === 0;
      ctx.strokeStyle = isMajor ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.045)";
      ctx.lineWidth = 1;

      const p1 = project3D(i, 0, -gridHalf, width, height);
      const p2 = project3D(i, 0, gridHalf, width, height);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      const p3 = project3D(-gridHalf, 0, i, width, height);
      const p4 = project3D(gridHalf, 0, i, width, height);
      ctx.beginPath();
      ctx.moveTo(p3.x, p3.y);
      ctx.lineTo(p4.x, p4.y);
      ctx.stroke();
    }

    const xStart = project3D(-gridHalf, 0, 0, width, height);
    const xEnd = project3D(gridHalf, 0, 0, width, height);
    ctx.strokeStyle = "rgba(239, 68, 68, 0.85)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(xStart.x, xStart.y);
    ctx.lineTo(xEnd.x, xEnd.y);
    ctx.stroke();

    const zStart = project3D(0, 0, -gridHalf, width, height);
    const zEnd = project3D(0, 0, gridHalf, width, height);
    ctx.strokeStyle = "rgba(59, 130, 246, 0.85)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(zStart.x, zStart.y);
    ctx.lineTo(zEnd.x, zEnd.y);
    ctx.stroke();
  }

  function drawWireBox(ctx, width, height, cx, cy, cz, sx, sy, sz, strokeColor = "#f59e0b", showDiags = false, fillColor = null) {
    const hx = sx / 2;
    const hz = sz / 2;
    const corners = [
      [cx - hx, cy, cz - hz],
      [cx + hx, cy, cz - hz],
      [cx + hx, cy, cz + hz],
      [cx - hx, cy, cz + hz],
      [cx - hx, cy + sy, cz - hz],
      [cx + hx, cy + sy, cz - hz],
      [cx + hx, cy + sy, cz + hz],
      [cx - hx, cy + sy, cz + hz],
    ].map(([px, py, pz]) => project3D(px, py, pz, width, height));

    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];

    ctx.save();
    if (fillColor) {
      ctx.beginPath();
      [4, 5, 6, 7].forEach((idx, i) => {
        if (i === 0) ctx.moveTo(corners[idx].x, corners[idx].y);
        else ctx.lineTo(corners[idx].x, corners[idx].y);
      });
      ctx.closePath();
      ctx.fillStyle = fillColor;
      ctx.fill();
    }

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1.6;
    edges.forEach(([a, b]) => {
      ctx.beginPath();
      ctx.moveTo(corners[a].x, corners[a].y);
      ctx.lineTo(corners[b].x, corners[b].y);
      ctx.stroke();
    });

    if (showDiags) {
      ctx.strokeStyle = "rgba(245, 158, 11, 0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(corners[4].x, corners[4].y);
      ctx.lineTo(corners[6].x, corners[6].y);
      ctx.moveTo(corners[5].x, corners[5].y);
      ctx.lineTo(corners[7].x, corners[7].y);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawSweepOrLoft(ctx, width, height, preset) {
    const steps = 16;
    const pts = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const y = t * paramState.height;
      const x =
        preset.modeShape === "sweep"
          ? Math.sin(t * Math.PI * 2) * (paramState.width * 0.45)
          : Math.cos(t * Math.PI) * (paramState.width * 0.35);
      const z = (t - 0.5) * paramState.depth;
      pts.push(project3D(x, y, z, width, height));
    }

    ctx.save();
    ctx.strokeStyle = preset.stroke;
    ctx.lineWidth = 2;
    ctx.beginPath();
    pts.forEach((p, idx) => {
      if (idx === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    pts.forEach((p, idx) => {
      if (idx % 3 === 0) {
        const r = preset.modeShape === "loft" ? 10 + Math.sin((idx / steps) * Math.PI) * 14 : 12;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, r, r * 0.55, 0, 0, Math.PI * 2);
        ctx.fillStyle = preset.fill;
        ctx.fill();
        ctx.strokeStyle = preset.stroke;
        ctx.lineWidth = 1.1;
        ctx.stroke();
      }
    });
    ctx.restore();
  }

  function drawSculptBlob(ctx, width, height, preset) {
    const pts = [];
    const steps = 32;
    const wave = sculptState.intensity * (1.2 - sculptState.smoothness * 0.55);
    for (let i = 0; i < steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      const r = 2.3 + Math.sin(a * 3) * wave + Math.cos(a * 2) * (wave * 0.6);
      pts.push(project3D(Math.cos(a) * r, 1.3 + Math.sin(a * 2) * (wave * 0.5), Math.sin(a) * r, width, height));
    }

    ctx.save();
    ctx.beginPath();
    pts.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.closePath();
    ctx.fillStyle = preset.fill || "rgba(245, 158, 11, 0.16)";
    ctx.fill();
    ctx.strokeStyle = preset.stroke || "#f59e0b";
    ctx.lineWidth = 1.8;
    ctx.stroke();
    ctx.restore();
  }

  function applySecondaryAction(secId) {
    activeSecondaryByWs[activeWorkspace3D] = secId;
    if (secId === "w-minus") paramState.width = Math.max(1.2, +(paramState.width - 0.5).toFixed(1));
    if (secId === "w-plus") paramState.width = Math.min(10, +(paramState.width + 0.5).toFixed(1));
    if (secId === "h-minus") paramState.height = Math.max(0.6, +(paramState.height - 0.4).toFixed(1));
    if (secId === "h-plus") paramState.height = Math.min(8, +(paramState.height + 0.4).toFixed(1));
    if (secId === "vol-minus") sculptState.intensity = Math.max(0.15, +(sculptState.intensity - 0.15).toFixed(2));
    if (secId === "vol-plus") sculptState.intensity = Math.min(1.4, +(sculptState.intensity + 0.15).toFixed(2));
    if (secId === "smooth-more") sculptState.smoothness = Math.min(0.95, +(sculptState.smoothness + 0.15).toFixed(2));
    if (secId === "gap-minus") hardState.gap = Math.max(0.4, +(hardState.gap - 0.3).toFixed(1));
    if (secId === "gap-plus") hardState.gap = Math.min(4.5, +(hardState.gap + 0.3).toFixed(1));
    if (secId === "toggle-diag") hardState.showDiagonals = !hardState.showDiagonals;
    apply3DBarsNow();
    studio.render();
  }

  function apply3DBarsNow() {
    const leftSidebar = document.querySelector(".hud-left");
    const topCenterNav = document.querySelector(".hud-top-center");
    const topRightNav = document.querySelector(".hud-top-right");
    const rightSidebar = document.querySelector(".hud-right");
    if (!leftSidebar || !topCenterNav || !topRightNav) return;

    isApplyingBars = true;
    try {
      const wsTools = TOOLS_BY_WORKSPACE[activeWorkspace3D] || TOOLS_BY_WORKSPACE.parametric;
      const curPrim = getPrimaryToolObj();
      const curPreset = getActivePresetObj();
      const curSec = activeSecondaryByWs[activeWorkspace3D] || curPrim.defaultSecondary;

      // 1. Barra esquerda: ferramentas primárias + reset câmera
      leftSidebar.innerHTML = `
        ${wsTools
          .map(
            (t) => `
          <button
            type="button"
            class="tool-btn ${curPrim.id === t.id ? "is-active" : ""}"
            data-d3-tool="${t.id}"
            title="${t.title}"
          >${t.icon}</button>
        `
          )
          .join("")}
        <button type="button" class="tool-btn" data-d3-act="reset-cam" title="Resetar Câmera">${D3_ICONS.reset}</button>
      `;

      // 2. Barra superior do meio: predefinições com imagem de prévia + título ao lado
      topCenterNav.innerHTML = curPrim.presets
        .map((p) => {
          const isAct = p.id === curPreset.id;
          return `
            <button
              type="button"
              class="tool-btn ${isAct ? "is-active" : ""}"
              data-d3-preset="${p.id}"
              title="${p.title}"
              style="width:auto;height:34px;padding:3px 9px 3px 4px;gap:6px;display:inline-flex;align-items:center;white-space:nowrap;"
            >
              <span style="display:inline-flex;align-items:center;border-radius:4px;overflow:hidden;border:1px solid rgba(255,255,255,0.16);flex-shrink:0;">${p.previewSvg}</span>
              <span style="font-size:10.5px;font-weight:700;">${p.label}</span>
            </button>
          `;
        })
        .join("");

      // 3. Barra superior direita: submenus preservados (Paramétrico, Escultura, Hard Surface)
      topRightNav.innerHTML = WORKSPACES_3D.map((ws) => {
        const icon =
          ws.id === "parametric"
            ? D3_ICONS.parametric
            : ws.id === "sculpt"
            ? D3_ICONS.sculpt
            : D3_ICONS.hardSurface;
        return `
          <button
            type="button"
            class="tool-btn ${activeWorkspace3D === ws.id ? "is-active" : ""}"
            data-d3-ws="${ws.id}"
            title="${ws.label}"
          >${icon}</button>
        `;
      }).join("");

      // 4. Barra lateral direita: ferramentas secundárias acompanhando e complementando a primária
      if (rightSidebar) {
        rightSidebar.innerHTML = curPrim.secondary
          .map(
            (s) => `
            <button
              type="button"
              class="tool-btn ${curSec === s.id ? "is-active" : ""}"
              data-d3-sec="${s.id}"
              title="${s.label}"
            >${s.icon}</button>
          `
          )
          .join("");

        rightSidebar.querySelectorAll("[data-d3-sec]").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            applySecondaryAction(btn.dataset.d3Sec);
          });
        });
      }

      leftSidebar.querySelectorAll("[data-d3-tool]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const toolId = btn.dataset.d3Tool;
          activeToolByWs[activeWorkspace3D] = toolId;
          const nextPrim = getPrimaryToolObj();
          if (nextPrim.presets[0]) activePresetByWs[activeWorkspace3D] = nextPrim.presets[0].id;
          activeSecondaryByWs[activeWorkspace3D] = nextPrim.defaultSecondary;
          apply3DBarsNow();
          studio.render();
        });
      });

      topCenterNav.querySelectorAll("[data-d3-preset]").forEach((btn) => {
        btn.addEventListener("click", () => {
          activePresetByWs[activeWorkspace3D] = btn.dataset.d3Preset;
          apply3DBarsNow();
          studio.render();
        });
      });

      topRightNav.querySelectorAll("[data-d3-ws]").forEach((btn) => {
        btn.addEventListener("click", () => {
          activeWorkspace3D = btn.dataset.d3Ws;
          const nextMeta = getWorkspaceMeta();
          showWorkspaceAlert(nextMeta);
          apply3DBarsNow();
          studio.render();
        });
      });

      leftSidebar.querySelector('[data-d3-act="reset-cam"]')?.addEventListener("click", () => {
        studio.camera.yaw = -0.62;
        studio.camera.pitch = 0.48;
        studio.camera.zoom = 42;
        studio.camera.panX = 0;
        studio.camera.panY = 0;
        studio.render();
      });
    } finally {
      isApplyingBars = false;
    }
  }

  function start3DBarGuard() {
    if (barObserver) return;
    const targets = [".hud-top-center", ".hud-right", ".hud-top-right"]
      .map((sel) => document.querySelector(sel))
      .filter(Boolean);
    if (!targets.length) return;

    barObserver = new MutationObserver(() => {
      if (!isModuleActive || isApplyingBars) return;
      const center = document.querySelector(".hud-top-center");
      if (center && !center.querySelector("[data-d3-preset]")) {
        apply3DBarsNow();
      }
    });

    targets.forEach((el) => barObserver.observe(el, { childList: true }));
  }

  function stop3DBarGuard() {
    if (barObserver) {
      barObserver.disconnect();
      barObserver = null;
    }
  }

  studio.registerModule("3d", {
    onActivate() {
      isModuleActive = true;
      ensureAlertBanner();
      showWorkspaceAlert(getWorkspaceMeta());
      apply3DBarsNow();
      start3DBarGuard();
    },

    renderBars() {
      isModuleActive = true;
      apply3DBarsNow();
      start3DBarGuard();
      setTimeout(() => {
        if (isModuleActive) apply3DBarsNow();
      }, 0);
    },

    onDeactivate() {
      isModuleActive = false;
      stop3DBarGuard();
      isDragging = false;
      clearTimeout(alertTimer);
      if (alertEl) alertEl.style.display = "none";
    },

    render(ctx, width, height) {
      drawGrid(ctx, width, height);
      const preset = getActivePresetObj();

      if (activeWorkspace3D === "parametric") {
        if (preset.modeShape === "sweep" || preset.modeShape === "loft") {
          drawSweepOrLoft(ctx, width, height, preset);
        } else {
          drawWireBox(
            ctx,
            width,
            height,
            0,
            0,
            0,
            paramState.width,
            paramState.height,
            paramState.depth,
            preset.stroke || "#f59e0b",
            false,
            preset.fill || null
          );
        }
      } else if (activeWorkspace3D === "sculpt") {
        drawSculptBlob(ctx, width, height, preset);
      } else {
        drawWireBox(
          ctx,
          width,
          height,
          -hardState.gap,
          0,
          0,
          2.4,
          2.6,
          2.4,
          preset.stroke || "#f59e0b",
          hardState.showDiagonals,
          preset.fill || null
        );
        drawWireBox(ctx, width, height, hardState.gap, 0, 0.4, 1.6, 1.4, 1.6, "rgba(255,255,255,0.65)", false);
      }

      studio.updateAxisGizmo?.();
    },

    onMouseDown(x, y, e) {
      isDragging = true;
      isPanning = Boolean(e?.shiftKey || e?.button === 2);
      lastX = e.clientX;
      lastY = e.clientY;
    },

    onMouseMove(x, y, e) {
      if (!isDragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      if (isPanning) {
        studio.camera.panX += dx;
        studio.camera.panY += dy;
      } else {
        studio.camera.yaw += dx * 0.007;
        studio.camera.pitch = Math.max(0.08, Math.min(1.45, studio.camera.pitch + dy * 0.007));
      }
      studio.render();
    },

    onMouseUp() {
      isDragging = false;
    },

    onWheel(e) {
      const factor = e.deltaY > 0 ? 0.92 : 1.08;
      studio.camera.zoom = Math.max(14, Math.min(140, studio.camera.zoom * factor));
      studio.render();
    },
  });
})();