(() => {
  const canvas = document.getElementById("scene-canvas");
  const ctx = canvas.getContext("2d");

  const topLeftNav = document.querySelector(".hud-top-left");
  const topCenterNav = document.querySelector(".hud-top-center");
  const topRightNav = document.querySelector(".hud-top-right");
  const leftSidebar = document.querySelector(".hud-left");
  let rightSidebar = document.querySelector(".hud-right");
  let bottomLeftBarEl = document.getElementById("core-bottom-left-bar") || document.querySelector(".hud-bottom-left");

  function cleanupLegacyRightWidgets() {
    const axisX = document.querySelector(".axis-x");
    if (axisX) {
      const gizmoContainer = axisX.closest(".axis-gizmo, .gizmo-wrap, .hud-gizmo") || axisX.parentElement;
      if (gizmoContainer && gizmoContainer !== document.body && !gizmoContainer.contains(canvas)) {
        gizmoContainer.remove();
      } else {
        document.querySelectorAll(".axis-x, .axis-y, .axis-z").forEach((el) => el.remove());
      }
    }

    const legacyCamBtn = document.querySelector('[data-camera="home"], [data-camera="frame"], [data-action="focus-grid"]');
    if (legacyCamBtn) {
      const camContainer = legacyCamBtn.closest(".hud-pill, .camera-controls, .hud-right-legacy") || legacyCamBtn.parentElement;
      if (camContainer && camContainer !== document.body && !camContainer.contains(canvas) && !camContainer.classList.contains("hud-right")) {
        camContainer.remove();
      } else {
        document.querySelectorAll('[data-camera="home"], [data-camera="frame"], [data-action="focus-grid"]').forEach((el) => el.remove());
      }
    }

    document.querySelectorAll('[data-action="undo"], [data-action="redo"], [data-action="toggle-history"]').forEach((btn) => {
      const parent = btn.parentElement;
      btn.remove();
      if (
        parent &&
        parent !== document.body &&
        !parent.contains(canvas) &&
        !parent.classList.contains("hud-left") &&
        !parent.classList.contains("hud-right") &&
        parent.id !== "core-bottom-right-bar" &&
        parent.id !== "core-bottom-left-bar" &&
        parent.children.length === 0
      ) {
        parent.remove();
      }
    });
  }

  cleanupLegacyRightWidgets();

  const CORE_ICONS = {
    vector: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><circle cx="11" cy="11" r="2"/></svg>`,
    pixel: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="6" height="6"/><rect x="15" y="3" width="6" height="6"/><rect x="9" y="9" width="6" height="6"/><rect x="3" y="15" width="6" height="6"/><rect x="15" y="15" width="6" height="6"/></svg>`,
    layout: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>`,
    video: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><polygon points="10 9 16 12 10 15 10 9" fill="currentColor"/></svg>`,
    cube3d: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
    hand: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 11V6a2 2 0 0 0-4 0v4"/><path d="M14 10V4a2 2 0 0 0-4 0v6"/><path d="M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>`,
    select: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4l7.07 17 2.51-7.39L21 11.07z"/></svg>`,
    sketchTab: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
    layers: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
    measures: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 6H3M21 18H3M6 6v12M18 6v12"/><path d="M9 12h6"/></svg>`,
    historyTab: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/></svg>`,
    eye: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
    eyeOff: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-6.4 0-10-7-10-7a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 5c6.4 0 10 7 10 7a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`,
    checkCircle: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    moreDots: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="5" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/></svg>`,
    rename: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
    resetPlane: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/></svg>`,
    trash: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>`,
    plus: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    undo: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/></svg>`,
    redo: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m15 14 5-5-5-5"/><path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13"/></svg>`,
    save: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`,
    gear: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    exportIcon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
  };

  const AREAS = [
    { id: "vector", label: "Vetor", unit: "px", icon: CORE_ICONS.vector, title: "Área de Vetor" },
    { id: "pixel", label: "Pixel", unit: "cel", icon: CORE_ICONS.pixel, title: "Área de Pixel" },
    { id: "layout", label: "Layout", unit: "px", icon: CORE_ICONS.layout, title: "Área de Layout" },
    { id: "video", label: "Vídeo", unit: "px", icon: CORE_ICONS.video, title: "Área de Vídeo" },
    { id: "3d", label: "3D", unit: "u", icon: CORE_ICONS.cube3d, title: "Área 3D" },
  ];

  const PRESETS_BY_AREA = {
    vector: ["Traço Limpo", "Curva Bezier", "Grade Vetor"],
    pixel: ["Pixel 1px", "Dither Suave", "Grade Cel"],
    layout: ["1440×900", "1080×1350", "Colunas 12"],
    video: ["1080p 30fps", "4K 60fps", "Corte Rápido"],
    "3d": ["Paramétrico", "Escultura", "Hard Surface"],
  };

  const SECONDARY_TOOLS_BY_PRIMARY = {
    pan: [
      { id: "pan-free", label: "Pan Livre", icon: "✥" },
      { id: "pan-axis", label: "Eixo Travado", icon: "⇄" },
      { id: "pan-fit", label: "Enquadrar", icon: "⊡" },
    ],
    transform: [
      { id: "tf-move", label: "Mover", icon: "⤢" },
      { id: "tf-scale", label: "Escalar", icon: "⤡" },
      { id: "tf-rotate", label: "Girar", icon: "↻" },
      { id: "tf-mirror", label: "Espelhar", icon: "◫" },
    ],
    align: [
      { id: "al-center", label: "Centro", icon: "⊕" },
      { id: "al-grid", label: "Grade", icon: "⊞" },
      { id: "al-snap", label: "Ajuste", icon: "🧲" },
    ],
    hierarchy: [
      { id: "hi-tree", label: "Árvore", icon: "⑂" },
      { id: "hi-group", label: "Agrupar", icon: "❏" },
      { id: "hi-isolate", label: "Isolar", icon: "◎" },
    ],
  };

  const HISTORY_TABS = [
    { id: "vector", label: "Vetores", targetArea: "vector", emptyText: "Nenhum vetor ainda.", icon: CORE_ICONS.vector },
    { id: "sketch", label: "Esboços", targetArea: "pixel", emptyText: "Nenhum esboço ainda.", icon: CORE_ICONS.sketchTab },
    { id: "layout", label: "Layout", targetArea: "layout", emptyText: "Nenhuma ação de Layout ainda.", icon: CORE_ICONS.layout },
    { id: "video", label: "Vídeo", targetArea: "video", emptyText: "Nenhuma ação de Vídeo ainda.", icon: CORE_ICONS.video },
    { id: "3d", label: "Sólidos 3D", targetArea: "3d", emptyText: "Nenhum sólido ainda.", icon: CORE_ICONS.cube3d },
    { id: "all", label: "Tudo", targetArea: null, emptyText: "Nenhuma ação registrada.", icon: CORE_ICONS.historyTab },
  ];

  const MODES_3D_QUICK = [
    { id: "parametric", label: "Paramétrico" },
    { id: "sculpt", label: "Escultura" },
    { id: "hard-surface", label: "Hard Surface" },
  ];

  const BLEND_MODES = ["Pass Through", "Normal", "Multiply", "Screen"];

  const modules = {};
  let activeArea = "3d";
  let activePreset = "Paramétrico";
  let activeLeftAction = "transform";
  let activeSecondaryAction = "tf-move";
  let active3DView = "solid";
  let active3DWorkspace = "parametric";

  const appSettings = {
    showGrid: true,
    snapEnabled: true,
    autoSave: false,
    exportScale: 1,
  };

  let activeBottomDrawer = null;
  let activeHistoryTab = "3d";
  let historyEntries = [];
  let selectedHistoryId = null;
  let moreMenuOpen = false;
  let renamingHistoryId = null;

  let blendMode = "Pass Through";
  let layerOpacity = 100;
  let layerSearch = "";
  let selectedLayerId = "l-param-base";
  let layersTree = [
    {
      id: "grp-3d",
      name: "3D · Modelo Principal",
      meta: "3 Layers",
      kind: "group",
      area: "3d",
      expanded: true,
      visible: true,
      swatch: "linear-gradient(135deg,#f59e0b,#ef4444)",
      children: [
        {
          id: "l-param-base",
          name: "Cubo Paramétrico",
          meta: "4.0 × 2.2 × 3.0 u",
          kind: "item",
          area: "3d",
          visible: true,
          swatch: "linear-gradient(135deg,#f59e0b,#d97706)",
          sublayers: [
            {
              id: "sub-mask-1",
              name: "Grade & Eixos",
              meta: "Máscara / Guia",
              kind: "mask",
              area: "3d",
              visible: true,
              swatch: "linear-gradient(135deg,#ffffff,#3b82f6)",
            },
          ],
        },
        {
          id: "l-sculpt-mesh",
          name: "Volume Escultura",
          meta: "Malha Orgânica",
          kind: "item",
          area: "3d",
          visible: true,
          swatch: "linear-gradient(135deg,#fb923c,#f59e0b)",
        },
        {
          id: "l-hard-part",
          name: "Peça Hard Surface",
          meta: "Chanfro & Encaixe",
          kind: "item",
          area: "3d",
          visible: true,
          swatch: "linear-gradient(135deg,#60a5fa,#3b82f6)",
        },
      ],
    },
    {
      id: "grp-2d",
      name: "Vetor, Pixel, Layout & Vídeo",
      meta: "4 Layers",
      kind: "group",
      area: "vector",
      expanded: true,
      visible: true,
      swatch: "linear-gradient(135deg,#ec4899,#6366f1)",
      children: [
        {
          id: "l-vec-path",
          name: "Traçado Vetorial",
          meta: "1024 × 768 px",
          kind: "item",
          area: "vector",
          visible: true,
          swatch: "linear-gradient(135deg,#38bdf8,#818cf8)",
        },
        {
          id: "l-px-canvas",
          name: "Grade de Pixels",
          meta: "64 × 40 cel",
          kind: "item",
          area: "pixel",
          visible: true,
          swatch: "linear-gradient(135deg,#22c55e,#eab308)",
        },
        {
          id: "l-layout-grid",
          name: "Prancheta Layout",
          meta: "1440 × 900 px",
          kind: "item",
          area: "layout",
          visible: true,
          swatch: "linear-gradient(135deg,#a855f7,#ec4899)",
        },
        {
          id: "l-video-track",
          name: "Faixa de Vídeo",
          meta: "1920 × 1080 · 30fps",
          kind: "item",
          area: "video",
          visible: true,
          swatch: "linear-gradient(135deg,#ef4444,#f97316)",
        },
      ],
    },
  ];

  const measuresByArea = {
    vector: { scale: 100, offsetX: 0, offsetY: 0, rotation: 0 },
    pixel: { scale: 100, offsetX: 0, offsetY: 0, rotation: 0 },
    layout: { scale: 100, offsetX: 0, offsetY: 0, rotation: 0 },
    video: { scale: 100, offsetX: 0, offsetY: 0, rotation: 0 },
    "3d": { scale: 100, offsetX: 0, offsetY: 0, rotation: 0 },
  };

  let bottomRightBarEl = null;
  let bottomDrawerEl = null;
  let settingsPopoverEl = null;

  const defaultCamera = { yaw: -0.62, pitch: 0.48, zoom: 42, panX: 0, panY: 0 };
  const camera = { ...defaultCamera };
  let isDragging = false;
  let isPanning = false;
  let lastX = 0;
  let lastY = 0;
  let extrudedShapes = [];

  function getAreaMeta(areaId = activeArea) {
    return AREAS.find((a) => a.id === areaId) || AREAS[4];
  }

  function getCurrentMeasures() {
    if (!measuresByArea[activeArea]) {
      measuresByArea[activeArea] = { scale: 100, offsetX: 0, offsetY: 0, rotation: 0 };
    }
    return measuresByArea[activeArea];
  }

  function isMobileViewport() {
    return window.innerWidth <= 768;
  }

  function ensureRightSidebar() {
    if (rightSidebar) return rightSidebar;
    const el = document.createElement("aside");
    el.className = "hud-pill hud-right";
    el.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 4px;
      z-index: 29;
    `;
    (document.querySelector(".viewport, .studio-shell, body"))?.appendChild(el);
    rightSidebar = el;
    return el;
  }

  function ensureSettingsPopover() {
    if (settingsPopoverEl) return settingsPopoverEl;
    const pop = document.createElement("div");
    pop.id = "core-app-settings-popover";
    pop.className = "hud-pill";
    pop.style.cssText = `
      bottom: 66px;
      left: 14px;
      display: none;
      flex-direction: column;
      gap: 8px;
      padding: 10px 12px;
      width: 248px;
      z-index: 33;
      font-size: 11px;
      color: #fff;
    `;
    document.querySelector(".viewport, .studio-shell, body")?.appendChild(pop);
    settingsPopoverEl = pop;
    return pop;
  }

  function renderSettingsPopover() {
    const pop = ensureSettingsPopover();
    if (!pop) return;
    const open = pop.dataset.open === "true";
    pop.style.display = open ? "flex" : "none";
    if (!open) return;

    pop.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:6px;border-bottom:1px solid rgba(255,255,255,0.08);font-weight:700;font-size:12px;">
        <span>Configurações do App</span>
        <button type="button" data-close-settings style="background:none;border:none;color:rgba(216,216,220,0.75);cursor:pointer;font-size:13px;">✕</button>
      </div>
      <label style="display:flex;align-items:center;justify-content:space-between;cursor:pointer;">
        <span>Grade e Eixos</span>
        <input type="checkbox" data-set-grid ${appSettings.showGrid ? "checked" : ""} style="accent-color:#f59e0b;cursor:pointer;" />
      </label>
      <label style="display:flex;align-items:center;justify-content:space-between;cursor:pointer;">
        <span>Ajuste / Snap</span>
        <input type="checkbox" data-set-snap ${appSettings.snapEnabled ? "checked" : ""} style="accent-color:#f59e0b;cursor:pointer;" />
      </label>
      <label style="display:flex;align-items:center;justify-content:space-between;cursor:pointer;">
        <span>Escala de Exportação</span>
        <select data-set-scale style="background:rgba(255,255,255,0.08);color:#fff;border:1px solid rgba(255,255,255,0.14);border-radius:5px;padding:2px 6px;font-size:11px;">
          <option value="1" ${appSettings.exportScale === 1 ? "selected" : ""} style="background:#1c1c20;">1x</option>
          <option value="2" ${appSettings.exportScale === 2 ? "selected" : ""} style="background:#1c1c20;">2x</option>
          <option value="3" ${appSettings.exportScale === 3 ? "selected" : ""} style="background:#1c1c20;">3x</option>
        </select>
      </label>
    `;

    pop.querySelector("[data-close-settings]")?.addEventListener("click", () => {
      pop.dataset.open = "false";
      renderSettingsPopover();
    });

    pop.querySelector("[data-set-grid]")?.addEventListener("change", (e) => {
      appSettings.showGrid = e.target.checked;
      recordHistory(activeArea, `Configuração · Grade: ${appSettings.showGrid ? "Ligada" : "Desligada"}`);
      render();
    });

    pop.querySelector("[data-set-snap]")?.addEventListener("change", (e) => {
      appSettings.snapEnabled = e.target.checked;
      recordHistory(activeArea, `Configuração · Snap: ${appSettings.snapEnabled ? "Ligado" : "Desligado"}`);
    });

    pop.querySelector("[data-set-scale]")?.addEventListener("change", (e) => {
      appSettings.exportScale = Number(e.target.value) || 1;
      recordHistory(activeArea, `Configuração · Exportação ${appSettings.exportScale}x`);
    });
  }

  function triggerExport() {
    const areaMeta = getAreaMeta(activeArea);
    try {
      const link = document.createElement("a");
      link.download = `estudio-${activeArea}-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (_) {}
    recordHistory(activeArea, `Exportado · ${areaMeta.label} (${appSettings.exportScale}x)`);
  }

  function forceHorizontalBottomLeftStyle(el) {
    if (!el) return;
    const mobile = isMobileViewport();
    const props = {
      position: "fixed",
      display: "inline-flex",
      "flex-direction": "row",
      "align-items": "center",
      "justify-content": "center",
      width: "auto",
      height: "auto",
      "min-width": "0",
      "min-height": "0",
      bottom: mobile ? "10px" : "14px",
      left: mobile ? "10px" : "14px",
      right: "auto",
      top: "auto",
      gap: mobile ? "2px" : "4px",
      padding: mobile ? "3px" : "4px",
      "z-index": "31",
    };
    Object.entries(props).forEach(([k, v]) => el.style.setProperty(k, v, "important"));
    el.querySelectorAll(".tool-btn").forEach((b) => {
      b.style.setProperty("width", mobile ? "34px" : "38px", "important");
      b.style.setProperty("height", mobile ? "34px" : "38px", "important");
      b.style.setProperty("flex", "0 0 auto", "important");
    });
  }

  function ensureBottomLeftBar() {
    document.querySelectorAll(".hud-bottom-left").forEach((extra) => {
      if (extra.id !== "core-bottom-left-bar") extra.remove();
    });

    if (!bottomLeftBarEl || bottomLeftBarEl.id !== "core-bottom-left-bar") {
      const el = document.createElement("div");
      el.id = "core-bottom-left-bar";
      el.className = "hud-pill hud-bottom-left";
      el.innerHTML = `
        <button type="button" class="tool-btn" data-footer="save" title="Salvar">${CORE_ICONS.save}</button>
        <button type="button" class="tool-btn" data-footer="settings" title="Configurações">${CORE_ICONS.gear}</button>
        <button type="button" class="tool-btn" data-footer="export" title="Exportar">${CORE_ICONS.exportIcon}</button>
      `;
      el.querySelectorAll("[data-footer]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const act = btn.dataset.footer;
          const areaMeta = getAreaMeta(activeArea);
          if (act === "save") {
            recordHistory(activeArea, `Salvo · ${areaMeta.label} (${activePreset})`);
          } else if (act === "settings") {
            const pop = ensureSettingsPopover();
            pop.dataset.open = pop.dataset.open === "true" ? "false" : "true";
            btn.classList.toggle("is-active", pop.dataset.open === "true");
            renderSettingsPopover();
          } else if (act === "export") {
            triggerExport();
          }
        });
      });
      (document.querySelector(".viewport, .studio-shell, body"))?.appendChild(el);
      bottomLeftBarEl = el;
    }

    forceHorizontalBottomLeftStyle(bottomLeftBarEl);
    return bottomLeftBarEl;
  }

  function applyLayoutPositions() {
    const mobile = isMobileViewport();

    if (topCenterNav) {
      topCenterNav.style.flexDirection = "row";
      topCenterNav.style.transform = mobile ? "none" : "translateX(-50%)";
      topCenterNav.style.left = mobile ? "auto" : "50%";
      topCenterNav.style.right = "auto";
      topCenterNav.style.top = mobile ? "10px" : "14px";
    }

    if (rightSidebar) {
      const topRef = topRightNav || topLeftNav;
      const topOffset = topRef ? topRef.offsetTop + topRef.offsetHeight + 10 : mobile ? 56 : 68;
      rightSidebar.style.top = `${Math.max(52, topOffset)}px`;
      rightSidebar.style.right = mobile ? "10px" : "14px";
      rightSidebar.style.left = "auto";
      rightSidebar.style.flexDirection = "column";
    }

    if (bottomLeftBarEl) {
      forceHorizontalBottomLeftStyle(bottomLeftBarEl);
    }

    if (settingsPopoverEl) {
      settingsPopoverEl.style.bottom = mobile ? "56px" : "66px";
      settingsPopoverEl.style.left = mobile ? "10px" : "14px";
    }

    if (bottomRightBarEl) {
      bottomRightBarEl.style.setProperty("display", "inline-flex", "important");
      bottomRightBarEl.style.setProperty("flex-direction", "row", "important");
      bottomRightBarEl.style.setProperty("width", "auto", "important");
      bottomRightBarEl.style.setProperty("height", "auto", "important");
      bottomRightBarEl.style.bottom = mobile ? "10px" : "14px";
      bottomRightBarEl.style.right = mobile ? "10px" : "14px";
      bottomRightBarEl.style.left = "auto";
      bottomRightBarEl.style.top = "auto";
      bottomRightBarEl.style.gap = mobile ? "2px" : "4px";
      bottomRightBarEl.style.padding = mobile ? "3px" : "4px";
      bottomRightBarEl.querySelectorAll(".tool-btn").forEach((b) => {
        b.style.width = mobile ? "34px" : "38px";
        b.style.height = mobile ? "34px" : "38px";
      });
    }

    if (bottomDrawerEl) {
      if (mobile) {
        bottomDrawerEl.style.left = "10px";
        bottomDrawerEl.style.right = "10px";
        bottomDrawerEl.style.bottom = "56px";
        bottomDrawerEl.style.width = "auto";
        bottomDrawerEl.style.maxHeight = "44vh";
      } else {
        bottomDrawerEl.style.left = "auto";
        bottomDrawerEl.style.right = "14px";
        bottomDrawerEl.style.bottom = "66px";
        bottomDrawerEl.style.width = "286px";
        bottomDrawerEl.style.maxHeight = "470px";
      }
    }
  }

  function mapAreaToHistoryTab(areaId) {
    if (areaId === "vector") return "vector";
    if (areaId === "pixel") return "sketch";
    if (areaId === "layout") return "layout";
    if (areaId === "video") return "video";
    if (areaId === "3d") return "3d";
    return "all";
  }

  function syncContextsOnAreaChange(nextArea) {
    activeHistoryTab = mapAreaToHistoryTab(nextArea);
    const areaPresets = PRESETS_BY_AREA[nextArea] || PRESETS_BY_AREA["3d"];
    activePreset = areaPresets[0];

    if (nextArea === "3d") {
      const grp3d = findLayerNode("grp-3d");
      if (grp3d) grp3d.expanded = true;
      selectedLayerId = "l-param-base";
      measuresByArea["3d"].scale = Math.max(20, Math.min(300, Math.round((camera.zoom / 42) * 100)));
    } else {
      const grp2d = findLayerNode("grp-2d");
      if (grp2d) grp2d.expanded = true;
      if (nextArea === "pixel") selectedLayerId = "l-px-canvas";
      else if (nextArea === "layout") selectedLayerId = "l-layout-grid";
      else if (nextArea === "video") selectedLayerId = "l-video-track";
      else selectedLayerId = "l-vec-path";
    }
  }

  function recordHistory(tabOrArea, label, actionMeta = null) {
    const resolvedTab = HISTORY_TABS.some((t) => t.id === tabOrArea)
      ? tabOrArea
      : mapAreaToHistoryTab(tabOrArea);

    const now = new Date();
    const time = now.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    historyEntries.unshift({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      tab: resolvedTab,
      area: activeArea,
      label,
      time,
      hidden: false,
      isolated: false,
      actionMeta,
    });

    if (historyEntries.length > 80) {
      historyEntries.length = 80;
    }

    renderBottomDrawer();
  }

  function getSelectedEntry() {
    return historyEntries.find((item) => item.id === selectedHistoryId) || null;
  }

  function findLayerNode(id, list = layersTree) {
    for (const node of list) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findLayerNode(id, node.children);
        if (found) return found;
      }
      if (node.sublayers) {
        const foundSub = findLayerNode(id, node.sublayers);
        if (foundSub) return foundSub;
      }
    }
    return null;
  }

  function deleteLayerNode(id, list = layersTree) {
    for (let i = list.length - 1; i >= 0; i--) {
      const node = list[i];
      if (node.id === id) {
        list.splice(i, 1);
        return true;
      }
      if (node.children && deleteLayerNode(id, node.children)) return true;
      if (node.sublayers && deleteLayerNode(id, node.sublayers)) return true;
    }
    return false;
  }

  function addNewLayer() {
    const targetGroup =
      layersTree.find((g) => (activeArea === "3d" ? g.area === "3d" : g.area === "vector")) ||
      layersTree[0];
    if (!targetGroup) return;

    const areaMeta = getAreaMeta(activeArea);
    const count = (targetGroup.children?.length || 0) + 1;
    const newLayer = {
      id: `lyr-${Date.now().toString(36)}`,
      name: `${areaMeta.label} · Camada ${count}`,
      meta: activeArea === "3d" ? "Objeto 3D" : `Camada ${areaMeta.label}`,
      kind: "item",
      area: activeArea,
      visible: true,
      swatch: "linear-gradient(135deg,#f59e0b,#ec4899)",
    };

    targetGroup.children = targetGroup.children || [];
    targetGroup.children.unshift(newLayer);
    targetGroup.meta = `${targetGroup.children.length} Layers`;
    targetGroup.expanded = true;
    selectedLayerId = newLayer.id;
    recordHistory(activeArea, `Nova camada: ${newLayer.name}`);
    renderBottomDrawer();
  }

  function ensureBottomRightBar() {
    if (bottomRightBarEl) {
      applyLayoutPositions();
      return bottomRightBarEl;
    }

    const bar = document.createElement("div");
    bar.id = "core-bottom-right-bar";
    bar.className = "hud-pill";
    bar.style.cssText = `
      bottom: 14px;
      right: 14px;
      display: inline-flex;
      flex-direction: row;
      align-items: center;
      gap: 4px;
      padding: 4px;
      z-index: 31;
    `;

    bar.innerHTML = `
      <button type="button" class="tool-btn" data-brmode="layers" title="Camadas">${CORE_ICONS.layers}</button>
      <button type="button" class="tool-btn" data-brmode="measures" title="Medidas — Transformar / Modificar / Editar">${CORE_ICONS.measures}</button>
      <button type="button" class="tool-btn" data-brmode="history" title="Histórico">${CORE_ICONS.historyTab}</button>
    `;

    bar.querySelectorAll("[data-brmode]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const mode = btn.dataset.brmode;
        activeBottomDrawer = activeBottomDrawer === mode ? null : mode;
        if (activeBottomDrawer === "history") {
          activeHistoryTab = mapAreaToHistoryTab(activeArea);
        }
        moreMenuOpen = false;
        renamingHistoryId = null;
        syncBottomRightBarState();
        renderBottomDrawer();
      });
    });

    (document.querySelector(".viewport, .studio-shell, body"))?.appendChild(bar);
    bottomRightBarEl = bar;
    syncBottomRightBarState();
    applyLayoutPositions();
    return bar;
  }

  function syncBottomRightBarState() {
    if (!bottomRightBarEl) return;
    bottomRightBarEl.querySelectorAll("[data-brmode]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.brmode === activeBottomDrawer);
    });
  }

  function ensureBottomDrawer() {
    if (bottomDrawerEl) {
      applyLayoutPositions();
      return bottomDrawerEl;
    }

    const el = document.createElement("aside");
    el.id = "core-bottom-drawer";
    el.className = "hud-pill";
    el.style.cssText = `
      bottom: 66px;
      right: 14px;
      display: none;
      flex-direction: column;
      align-items: stretch;
      gap: 8px;
      padding: 10px;
      width: 286px;
      max-height: 470px;
      z-index: 32;
      font-size: 12px;
    `;
    document.querySelector(".viewport, .studio-shell, body")?.appendChild(el);
    bottomDrawerEl = el;
    applyLayoutPositions();
    return el;
  }

  function renderLayerRow(node, depth = 0) {
    const q = layerSearch.trim().toLowerCase();
    const matchesSelf = !q || node.name.toLowerCase().includes(q) || (node.meta || "").toLowerCase().includes(q);
    const matchingChildren = (node.children || []).filter(
      (c) => !q || c.name.toLowerCase().includes(q) || (c.meta || "").toLowerCase().includes(q)
    );
    const hasChildren = Array.isArray(node.children) && node.children.length > 0;
    const hasSubs = Array.isArray(node.sublayers) && node.sublayers.length > 0;

    if (q && !matchesSelf && matchingChildren.length === 0) return "";

    const isSelected = selectedLayerId === node.id;
    const isAreaMatch = node.area === activeArea;
    const indentPx = depth * 14;

    let html = `
      <div
        data-lrow="${node.id}"
        style="
          display:flex;align-items:center;gap:6px;
          padding:5px 6px 5px ${6 + indentPx}px;
          border-radius:7px;cursor:pointer;
          background:${isSelected ? "rgba(59, 130, 246, 0.28)" : isAreaMatch ? "rgba(245, 158, 11, 0.07)" : "rgba(255,255,255,0.025)"};
          border:1px solid ${isSelected ? "rgba(96, 165, 250, 0.5)" : isAreaMatch ? "rgba(245, 158, 11, 0.22)" : "transparent"};
          opacity:${node.visible ? "1" : "0.45"};
        "
      >
        ${
          hasChildren
            ? `<button type="button" data-ltoggle-exp="${node.id}" style="background:none;border:none;color:rgba(216,216,220,0.8);cursor:pointer;padding:0 2px;font-size:10px;line-height:1;">${node.expanded ? "⌄" : "›"}</button>`
            : `<span style="width:12px;display:inline-block;"></span>`
        }
        <span style="width:24px;height:24px;border-radius:5px;background:${node.swatch || "rgba(255,255,255,0.12)"};border:1px solid rgba(255,255,255,0.18);flex-shrink:0;"></span>
        <span style="flex:1;min-width:0;display:flex;flex-direction:column;gap:1px;">
          <span style="font-size:11px;font-weight:${isSelected || hasChildren ? "600" : "500"};color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${node.name}</span>
          <span style="font-size:10px;color:rgba(216,216,220,0.52);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${node.meta || ""}</span>
        </span>
        <input
          type="checkbox"
          data-lvis="${node.id}"
          ${node.visible ? "checked" : ""}
          title="Visibilidade"
          style="width:14px;height:14px;accent-color:#3b82f6;cursor:pointer;flex-shrink:0;"
        />
      </div>
    `;

    if (hasSubs && node.visible) {
      node.sublayers.forEach((sub) => {
        const subSel = selectedLayerId === sub.id;
        html += `
          <div
            data-lrow="${sub.id}"
            style="
              display:flex;align-items:center;gap:6px;
              padding:4px 6px 4px ${24 + indentPx}px;
              border-radius:7px;cursor:pointer;
              background:${subSel ? "rgba(59, 130, 246, 0.24)" : "transparent"};
              border-left:1px solid rgba(255,255,255,0.16);
              margin-left:${10 + indentPx}px;
              opacity:${sub.visible ? "1" : "0.45"};
            "
          >
            <span style="width:20px;height:20px;border-radius:4px;background:${sub.swatch || "#fff"};border:1px solid rgba(255,255,255,0.2);flex-shrink:0;"></span>
            <span style="flex:1;min-width:0;display:flex;flex-direction:column;">
              <span style="font-size:10.5px;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${sub.name}</span>
              <span style="font-size:9.5px;color:rgba(216,216,220,0.48);">${sub.meta || ""}</span>
            </span>
            <input
              type="checkbox"
              data-lvis="${sub.id}"
              ${sub.visible ? "checked" : ""}
              style="width:13px;height:13px;accent-color:#3b82f6;cursor:pointer;flex-shrink:0;"
            />
          </div>
        `;
      });
    }

    if (hasChildren && (node.expanded || Boolean(q))) {
      node.children.forEach((child) => {
        html += renderLayerRow(child, depth + 1);
      });
    }

    return html;
  }

  function renderLayersContent(el) {
    const areaMeta = getAreaMeta(activeArea);
    const treeHtml = layersTree.map((g) => renderLayerRow(g, 0)).join("");

    el.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;padding-bottom:6px;border-bottom:1px solid rgba(255,255,255,0.08);">
        <select
          data-lblend
          style="background:rgba(255,255,255,0.08);color:#fff;border:1px solid rgba(255,255,255,0.14);border-radius:6px;padding:4px 6px;font-size:11px;outline:none;cursor:pointer;"
        >
          ${BLEND_MODES.map((m) => `<option value="${m}" ${blendMode === m ? "selected" : ""} style="background:#1c1c20;color:#fff;">${m}</option>`).join("")}
        </select>
        <div style="display:flex;align-items:center;gap:6px;font-size:11px;color:rgba(216,216,220,0.85);">
          <span>${areaMeta.label} · ${layerOpacity}%</span>
        </div>
      </div>

      <div style="display:flex;align-items:center;gap:6px;">
        <input
          type="range"
          min="0"
          max="100"
          value="${layerOpacity}"
          data-lopacity
          style="flex:1;accent-color:#3b82f6;cursor:pointer;"
        />
        <button type="button" class="tool-btn" data-ladd title="Nova Camada (${areaMeta.label})" style="width:24px;height:24px;">${CORE_ICONS.plus}</button>
        <button type="button" class="tool-btn" data-ldel title="Excluir Camada Selecionada" style="width:24px;height:24px;">${CORE_ICONS.trash}</button>
      </div>

      <div style="display:flex;flex-direction:column;gap:3px;overflow-y:auto;max-height:${isMobileViewport() ? "150px" : "230px"};padding-right:2px;">
        ${treeHtml || `<div style="padding:10px 2px;color:rgba(216,216,220,0.5);font-size:11px;">Nenhuma camada encontrada.</div>`}
      </div>

      <div style="padding-top:6px;border-top:1px solid rgba(255,255,255,0.08);">
        <input
          type="text"
          placeholder="Buscar camada..."
          value="${layerSearch.replace(/"/g, "&quot;")}"
          data-lsearch
          style="width:100%;background:rgba(255,255,255,0.06);color:#fff;border:1px solid rgba(255,255,255,0.1);border-radius:7px;padding:5px 8px;font-size:11px;outline:none;"
        />
      </div>
    `;

    el.querySelector("[data-lblend]")?.addEventListener("change", (e) => {
      blendMode = e.target.value;
      recordHistory(activeArea, `Mesclagem (${areaMeta.label}): ${blendMode}`);
    });

    el.querySelector("[data-lopacity]")?.addEventListener("input", (e) => {
      layerOpacity = Number(e.target.value);
      const label = el.querySelector("[data-lblend]")?.parentElement?.querySelector("span");
      if (label) label.textContent = `${areaMeta.label} · ${layerOpacity}%`;
      if (canvas) canvas.style.opacity = String(layerOpacity / 100);
    });

    el.querySelector("[data-ladd]")?.addEventListener("click", () => {
      addNewLayer();
    });

    el.querySelector("[data-ldel]")?.addEventListener("click", () => {
      if (!selectedLayerId) return;
      const target = findLayerNode(selectedLayerId);
      if (target && target.kind !== "group") {
        deleteLayerNode(selectedLayerId);
        recordHistory(activeArea, `Camada removida: ${target.name}`);
        selectedLayerId = null;
        renderBottomDrawer();
      }
    });

    el.querySelectorAll("[data-ltoggle-exp]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const grp = findLayerNode(btn.dataset.ltoggleExp);
        if (grp) {
          grp.expanded = !grp.expanded;
          renderBottomDrawer();
        }
      });
    });

    el.querySelectorAll("[data-lvis]").forEach((chk) => {
      chk.addEventListener("change", (e) => {
        e.stopPropagation();
        const node = findLayerNode(chk.dataset.lvis);
        if (node) {
          node.visible = chk.checked;
          recordHistory(node.area || activeArea, `${node.visible ? "Mostrar" : "Ocultar"} camada: ${node.name}`);
          renderBottomDrawer();
        }
      });
    });

    el.querySelectorAll("[data-lrow]").forEach((row) => {
      row.addEventListener("click", (e) => {
        if (e.target.closest("[data-lvis]") || e.target.closest("[data-ltoggle-exp]")) return;
        const id = row.dataset.lrow;
        selectedLayerId = id;
        const node = findLayerNode(id);
        if (node?.area && node.area !== activeArea && AREAS.some((a) => a.id === node.area)) {
          switchArea(node.area);
        } else {
          renderBottomDrawer();
        }
      });
    });

    const searchInput = el.querySelector("[data-lsearch]");
    searchInput?.addEventListener("input", () => {
      layerSearch = searchInput.value;
      renderBottomDrawer();
      el.querySelector("[data-lsearch]")?.focus();
    });
  }

  function applyQuickMode(modeId) {
    if (AREAS.some((a) => a.id === modeId)) {
      switchArea(modeId);
      return;
    }
    if (modeId === "parametric" || modeId === "sculpt" || modeId === "hard-surface") {
      active3DWorkspace = modeId;
      if (activeArea !== "3d") {
        switchArea("3d");
      }
      const mod3d = modules["3d"];
      if (mod3d && typeof mod3d.setWorkspace === "function") {
        mod3d.setWorkspace(modeId);
      } else {
        refreshBars();
        render();
      }
      const found = MODES_3D_QUICK.find((m) => m.id === modeId);
      recordHistory("3d", `Modo 3D: ${found ? found.label : modeId}`, { type: "3d-ws", value: modeId });
      renderBottomDrawer();
    }
  }

  function applyMeasureTransform(type, delta) {
    const m = getCurrentMeasures();
    const areaMeta = getAreaMeta(activeArea);

    if (type === "scale") {
      m.scale = Math.max(20, Math.min(300, m.scale + delta));
      if (activeArea === "3d") {
        camera.zoom = Math.max(14, Math.min(140, +(42 * (m.scale / 100)).toFixed(1)));
      }
      recordHistory(activeArea, `Medidas (${areaMeta.label}) · Escala: ${m.scale}%`);
    } else if (type === "x") {
      m.offsetX += delta;
      if (activeArea === "3d") camera.panX += delta * 2;
      recordHistory(activeArea, `Medidas (${areaMeta.label}) · X: ${m.offsetX} ${areaMeta.unit}`);
    } else if (type === "y") {
      m.offsetY += delta;
      if (activeArea === "3d") camera.panY += delta * 2;
      recordHistory(activeArea, `Medidas (${areaMeta.label}) · Y: ${m.offsetY} ${areaMeta.unit}`);
    } else if (type === "rot") {
      m.rotation = (m.rotation + delta + 360) % 360;
      if (activeArea === "3d") camera.yaw += (delta * Math.PI) / 180;
      recordHistory(activeArea, `Medidas (${areaMeta.label}) · Rotação: ${m.rotation}°`);
    } else if (type === "reset") {
      m.scale = 100;
      m.offsetX = 0;
      m.offsetY = 0;
      m.rotation = 0;
      if (activeArea === "3d") resetActiveCamera();
      recordHistory(activeArea, `Medidas (${areaMeta.label}) resetadas`);
    }
    render();
    renderBottomDrawer();
  }

  function renderMeasuresContent(el) {
    const m = getCurrentMeasures();
    const areaMeta = getAreaMeta(activeArea);

    el.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:6px;border-bottom:1px solid rgba(255,255,255,0.08);font-weight:700;color:#fff;font-size:12px;">
        <span>Medidas · ${areaMeta.label}</span>
        <div style="display:flex;align-items:center;gap:4px;">
          <button type="button" class="tool-btn" data-mhist="undo" title="Desfazer" style="width:24px;height:24px;">${CORE_ICONS.undo}</button>
          <button type="button" class="tool-btn" data-mhist="redo" title="Refazer" style="width:24px;height:24px;">${CORE_ICONS.redo}</button>
        </div>
      </div>

      <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;font-size:11px;color:#fff;">
        <span style="color:rgba(216,216,220,0.75);">Escala</span>
        <div style="display:flex;align-items:center;gap:4px;">
          <button type="button" class="tool-btn" data-mact="scale:-10" style="width:26px;height:26px;font-size:12px;">-</button>
          <span style="min-width:46px;text-align:center;font-family:monospace;background:rgba(255,255,255,0.05);padding:3px 5px;border-radius:5px;">${m.scale}%</span>
          <button type="button" class="tool-btn" data-mact="scale:10" style="width:26px;height:26px;font-size:12px;">+</button>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
        <div style="display:flex;flex-direction:column;gap:4px;background:rgba(255,255,255,0.03);padding:6px;border-radius:7px;">
          <span style="font-size:10px;color:rgba(216,216,220,0.65);">POS X (${areaMeta.unit})</span>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:2px;">
            <button type="button" class="tool-btn" data-mact="x:-10" style="width:22px;height:22px;font-size:11px;">-</button>
            <span style="font-family:monospace;font-size:11px;color:#fff;">${m.offsetX}</span>
            <button type="button" class="tool-btn" data-mact="x:10" style="width:22px;height:22px;font-size:11px;">+</button>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;background:rgba(255,255,255,0.03);padding:6px;border-radius:7px;">
          <span style="font-size:10px;color:rgba(216,216,220,0.65);">POS Y (${areaMeta.unit})</span>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:2px;">
            <button type="button" class="tool-btn" data-mact="y:-10" style="width:22px;height:22px;font-size:11px;">-</button>
            <span style="font-family:monospace;font-size:11px;color:#fff;">${m.offsetY}</span>
            <button type="button" class="tool-btn" data-mact="y:10" style="width:22px;height:22px;font-size:11px;">+</button>
          </div>
        </div>
      </div>

      <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;font-size:11px;color:#fff;">
        <span style="color:rgba(216,216,220,0.75);">Rotação</span>
        <div style="display:flex;align-items:center;gap:4px;">
          <button type="button" class="tool-btn" data-mact="rot:-15" style="width:26px;height:26px;font-size:12px;">-</button>
          <span style="min-width:46px;text-align:center;font-family:monospace;background:rgba(255,255,255,0.05);padding:3px 5px;border-radius:5px;">${m.rotation}°</span>
          <button type="button" class="tool-btn" data-mact="rot:15" style="width:26px;height:26px;font-size:12px;">+</button>
        </div>
      </div>

      <button type="button" class="tool-btn" data-mact="reset:0" style="width:100%;height:26px;font-size:11px;justify-content:center;">Redefinir Medidas</button>
    `;

    el.querySelectorAll("[data-mact]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const [kind, val] = btn.dataset.mact.split(":");
        applyMeasureTransform(kind, Number(val));
      });
    });

    el.querySelectorAll("[data-mhist]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.dataset.mhist === "undo") {
          modules[activeArea]?.undo?.();
          recordHistory(activeArea, "Desfazer");
        } else {
          modules[activeArea]?.redo?.();
          recordHistory(activeArea, "Refazer");
        }
      });
    });
  }

  function renderHistoryContent(el) {
    const currentTabMeta = HISTORY_TABS.find((t) => t.id === activeHistoryTab) || HISTORY_TABS[5];
    const items =
      activeHistoryTab === "all"
        ? historyEntries
        : historyEntries.filter((entry) => entry.tab === activeHistoryTab);

    const selectedEntry = getSelectedEntry();

    const tabsHtml = HISTORY_TABS.map((t) => {
      const isAct = t.id === activeHistoryTab;
      return `
        <button
          type="button"
          class="tool-btn ${isAct ? "is-active" : ""}"
          data-htab="${t.id}"
          title="${t.label}"
          style="flex:1;width:auto;height:28px;"
        >${t.icon}</button>
      `;
    }).join("");

    const quickSwitchHtml =
      activeHistoryTab === "3d"
        ? `
          <div style="display:flex;gap:4px;flex-wrap:wrap;">
            ${MODES_3D_QUICK.map(
              (m) => `
              <button
                type="button"
                class="tool-btn ${activeArea === "3d" && active3DWorkspace === m.id ? "is-active" : ""}"
                data-qswitch="${m.id}"
                style="width:auto;height:24px;padding:0 7px;font-size:10px;"
              >${m.label}</button>
            `
            ).join("")}
          </div>
        `
        : currentTabMeta.targetArea
        ? `
          <button
            type="button"
            class="tool-btn ${activeArea === currentTabMeta.targetArea ? "is-active" : ""}"
            data-qswitch="${currentTabMeta.targetArea}"
            style="width:100%;height:26px;font-size:11px;justify-content:center;"
          >Abrir ${currentTabMeta.label}</button>
        `
        : `
          <div style="display:flex;gap:4px;flex-wrap:wrap;">
            ${AREAS.map(
              (a) => `
              <button
                type="button"
                class="tool-btn ${activeArea === a.id ? "is-active" : ""}"
                data-qswitch="${a.id}"
                title="${a.title}"
                style="width:auto;height:24px;padding:0 7px;font-size:10px;"
              >${a.label}</button>
            `
            ).join("")}
          </div>
        `;

    const listHtml =
      items.length === 0
        ? `<div style="padding:10px 2px;color:rgba(216,216,220,0.52);font-size:11px;">${currentTabMeta.emptyText}</div>`
        : items
            .map((item) => {
              const isSel = item.id === selectedHistoryId;
              const isRenaming = item.id === renamingHistoryId;
              return `
                <div
                  data-hrow-id="${item.id}"
                  style="
                    display:flex;align-items:center;justify-content:space-between;gap:6px;
                    padding:7px 8px;border-radius:8px;cursor:pointer;
                    background:${isSel ? "rgba(37, 99, 235, 0.36)" : "rgba(255,255,255,0.035)"};
                    border:1px solid ${isSel ? "rgba(96, 165, 250, 0.55)" : "rgba(255,255,255,0.05)"};
                    opacity:${item.hidden ? "0.45" : "1"};
                    font-size:11px;color:#fff;
                  "
                >
                  ${
                    isRenaming
                      ? `<input type="text" data-hrename-input="${item.id}" value="${item.label.replace(/"/g, "&quot;")}" style="flex:1;min-width:0;background:rgba(0,0,0,0.45);color:#fff;border:1px solid var(--accent-amber);border-radius:5px;padding:2px 6px;font-size:11px;outline:none;" />`
                      : `<span style="flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:${isSel ? "600" : "400"};">${item.label}</span>`
                  }
                  <button
                    type="button"
                    data-htoggle-vis="${item.id}"
                    title="${item.hidden ? "Mostrar" : "Ocultar"}"
                    style="background:transparent;border:none;color:rgba(216,216,220,0.75);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;padding:2px;flex-shrink:0;"
                  >${item.hidden ? CORE_ICONS.eyeOff : CORE_ICONS.eye}</button>
                </div>
              `;
            })
            .join("");

    const selectionBlockHtml = selectedEntry
      ? `
        <div style="padding-top:6px;border-top:1px solid rgba(255,255,255,0.08);display:flex;flex-direction:column;gap:8px;">
          <div style="font-size:10px;font-weight:700;letter-spacing:0.06em;color:rgba(216,216,220,0.55);">1 SELECIONADO</div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;text-align:center;">
            <button type="button" data-hsel-act="edit" style="display:flex;flex-direction:column;align-items:center;gap:3px;padding:5px 2px;border-radius:7px;background:rgba(255,255,255,0.04);border:1px solid transparent;color:#fff;font-size:10px;cursor:pointer;">
              ${CORE_ICONS.rename}
              <span>Editar</span>
            </button>
            <button type="button" data-hsel-act="toggle-vis" style="display:flex;flex-direction:column;align-items:center;gap:3px;padding:5px 2px;border-radius:7px;background:rgba(255,255,255,0.04);border:1px solid transparent;color:#fff;font-size:10px;cursor:pointer;">
              ${CORE_ICONS.eye}
              <span>${selectedEntry.hidden ? "Mostrar" : "Ocultar"}</span>
            </button>
            <button type="button" data-hsel-act="isolate" style="display:flex;flex-direction:column;align-items:center;gap:3px;padding:5px 2px;border-radius:7px;background:${selectedEntry.isolated ? "var(--accent-amber-bg)" : "rgba(255,255,255,0.04)"};border:1px solid ${selectedEntry.isolated ? "rgba(245,158,11,0.4)" : "transparent"};color:${selectedEntry.isolated ? "var(--accent-amber)" : "#fff"};font-size:10px;cursor:pointer;">
              ${CORE_ICONS.checkCircle}
              <span>Isolar</span>
            </button>
            <button type="button" data-hsel-act="more" style="display:flex;flex-direction:column;align-items:center;gap:3px;padding:5px 2px;border-radius:7px;background:${moreMenuOpen ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)"};border:1px solid transparent;color:#fff;font-size:10px;cursor:pointer;">
              ${CORE_ICONS.moreDots}
              <span>Mais</span>
            </button>
          </div>
          ${
            moreMenuOpen
              ? `
                <div style="display:flex;flex-direction:column;gap:2px;padding:6px;border-radius:9px;background:rgba(24,24,28,0.96);border:1px solid rgba(255,255,255,0.1);">
                  <button type="button" data-hsel-act="rename" style="display:flex;align-items:center;gap:8px;width:100%;padding:7px 8px;border-radius:6px;background:transparent;border:none;color:#fff;font-size:11px;font-weight:500;cursor:pointer;text-align:left;">
                    ${CORE_ICONS.rename}
                    <span>Renomear</span>
                  </button>
                  <button type="button" data-hsel-act="reset-plane" style="display:flex;align-items:center;gap:8px;width:100%;padding:7px 8px;border-radius:6px;background:transparent;border:none;color:#fff;font-size:11px;font-weight:500;cursor:pointer;text-align:left;">
                    ${CORE_ICONS.resetPlane}
                    <span>Redefinir Plano</span>
                  </button>
                  <button type="button" data-hsel-act="delete" style="display:flex;align-items:center;gap:8px;width:100%;padding:7px 8px;border-radius:6px;background:transparent;border:none;color:#f87171;font-size:11px;font-weight:500;cursor:pointer;text-align:left;">
                    ${CORE_ICONS.trash}
                    <span>Deletar</span>
                  </button>
                </div>
              `
              : ""
          }
        </div>
      `
      : "";

    el.innerHTML = `
      <div style="display:flex;gap:3px;padding:3px;border-radius:8px;background:rgba(255,255,255,0.04);">
        ${tabsHtml}
      </div>
      ${quickSwitchHtml}
      <div style="display:flex;align-items:center;justify-content:space-between;padding:2px 2px 6px;border-bottom:1px solid rgba(255,255,255,0.08);font-weight:700;color:#fff;font-size:12px;">
        <span>${currentTabMeta.label}</span>
        <span style="color:rgba(216,216,220,0.7);font-weight:600;">${items.length}</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:4px;overflow-y:auto;max-height:${isMobileViewport() ? "115px" : "150px"};padding-right:2px;">
        ${listHtml}
      </div>
      ${selectionBlockHtml}
    `;

    el.querySelectorAll("[data-htab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeHistoryTab = btn.dataset.htab;
        selectedHistoryId = null;
        moreMenuOpen = false;
        renamingHistoryId = null;
        const tabObj = HISTORY_TABS.find((t) => t.id === activeHistoryTab);
        if (tabObj?.targetArea && activeArea !== tabObj.targetArea) {
          switchArea(tabObj.targetArea);
          return;
        }
        renderBottomDrawer();
      });
    });

    el.querySelectorAll("[data-qswitch]").forEach((btn) => {
      btn.addEventListener("click", () => {
        applyQuickMode(btn.dataset.qswitch);
      });
    });

    el.querySelectorAll("[data-hrow-id]").forEach((row) => {
      row.addEventListener("click", (e) => {
        if (e.target.closest("[data-htoggle-vis]") || e.target.closest("[data-hrename-input]")) return;
        const id = row.dataset.hrowId;
        selectedHistoryId = selectedHistoryId === id ? null : id;
        moreMenuOpen = false;
        renamingHistoryId = null;
        renderBottomDrawer();
      });
    });

    el.querySelectorAll("[data-htoggle-vis]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const item = historyEntries.find((h) => h.id === btn.dataset.htoggleVis);
        if (!item) return;
        item.hidden = !item.hidden;
        renderBottomDrawer();
      });
    });

    const renameInput = el.querySelector("[data-hrename-input]");
    if (renameInput) {
      renameInput.focus();
      renameInput.select();
      const commitRename = () => {
        const item = historyEntries.find((h) => h.id === renamingHistoryId);
        const val = renameInput.value.trim();
        if (item && val) item.label = val;
        renamingHistoryId = null;
        renderBottomDrawer();
      };
      renameInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") commitRename();
        if (e.key === "Escape") {
          renamingHistoryId = null;
          renderBottomDrawer();
        }
      });
      renameInput.addEventListener("blur", commitRename);
    }

    el.querySelectorAll("[data-hsel-act]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = getSelectedEntry();
        if (!item) return;
        const act = btn.dataset.hselAct;

        if (act === "edit") {
          if (item.actionMeta?.type === "3d-ws") {
            applyQuickMode(item.actionMeta.value);
          } else if (item.area && item.area !== activeArea) {
            switchArea(item.area);
          }
          moreMenuOpen = true;
          renderBottomDrawer();
        } else if (act === "toggle-vis") {
          item.hidden = !item.hidden;
          renderBottomDrawer();
        } else if (act === "isolate") {
          item.isolated = !item.isolated;
          renderBottomDrawer();
        } else if (act === "more") {
          moreMenuOpen = !moreMenuOpen;
          renderBottomDrawer();
        } else if (act === "rename") {
          renamingHistoryId = item.id;
          moreMenuOpen = false;
          renderBottomDrawer();
        } else if (act === "reset-plane") {
          resetActiveCamera();
          moreMenuOpen = false;
          renderBottomDrawer();
        } else if (act === "delete") {
          historyEntries = historyEntries.filter((h) => h.id !== item.id);
          selectedHistoryId = null;
          moreMenuOpen = false;
          renamingHistoryId = null;
          renderBottomDrawer();
        }
      });
    });
  }

  function renderBottomDrawer() {
    ensureBottomLeftBar();
    ensureBottomRightBar();
    syncBottomRightBarState();
    const el = ensureBottomDrawer();
    applyLayoutPositions();

    if (!activeBottomDrawer) {
      el.style.display = "none";
      return;
    }

    el.style.display = "flex";
    if (activeBottomDrawer === "measures") {
      renderMeasuresContent(el);
    } else if (activeBottomDrawer === "layers") {
      renderLayersContent(el);
    } else {
      renderHistoryContent(el);
    }
  }

  function toggleHistoryPanel(forceState) {
    if (typeof forceState === "boolean") {
      activeBottomDrawer = forceState ? "history" : null;
    } else {
      activeBottomDrawer = activeBottomDrawer === "history" ? null : "history";
    }
    if (activeBottomDrawer === "history") {
      activeHistoryTab = mapAreaToHistoryTab(activeArea);
    }
    renderBottomDrawer();
  }

  function renderTopLeft() {
    if (!topLeftNav) return;
    topLeftNav.innerHTML = AREAS.map(
      (area) => `
        <button
          type="button"
          class="tool-btn ${activeArea === area.id ? "is-active" : ""}"
          data-area="${area.id}"
          title="${area.title}"
        >${area.icon}</button>
      `
    ).join("");

    topLeftNav.querySelectorAll("[data-area]").forEach((btn) => {
      btn.addEventListener("click", () => switchArea(btn.dataset.area));
    });
  }

  function renderPresetsTopCenter() {
    if (!topCenterNav) return;
    const presets = PRESETS_BY_AREA[activeArea] || PRESETS_BY_AREA["3d"];
    if (!presets.includes(activePreset)) {
      activePreset = presets[0];
    }

    topCenterNav.innerHTML = presets
      .map(
        (preset) => `
          <button
            type="button"
            class="tool-btn ${activePreset === preset ? "is-active" : ""}"
            data-preset="${preset}"
            title="Predefinição: ${preset}"
            style="width:auto;padding:0 10px;font-size:11px;white-space:nowrap;"
          >${preset}</button>
        `
      )
      .join("");

    topCenterNav.querySelectorAll("[data-preset]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activePreset = btn.dataset.preset;
        if (activeArea === "3d") {
          const mapWs = {
            Paramétrico: "parametric",
            Escultura: "sculpt",
            "Hard Surface": "hard-surface",
          };
          if (mapWs[activePreset]) {
            active3DWorkspace = mapWs[activePreset];
            modules["3d"]?.setWorkspace?.(active3DWorkspace);
          }
        }
        recordHistory(activeArea, `Predefinição: ${activePreset}`);
        renderPresetsTopCenter();
      });
    });
  }

  function renderSecondaryRightBar() {
    const side = ensureRightSidebar();
    const list = SECONDARY_TOOLS_BY_PRIMARY[activeLeftAction] || SECONDARY_TOOLS_BY_PRIMARY.transform;
    if (!list.some((item) => item.id === activeSecondaryAction)) {
      activeSecondaryAction = list[0].id;
    }

    side.innerHTML = list
      .map(
        (item) => `
          <button
            type="button"
            class="tool-btn ${activeSecondaryAction === item.id ? "is-active" : ""}"
            data-sec-action="${item.id}"
            title="${item.label} (${activeLeftAction})"
          >${item.icon}</button>
        `
      )
      .join("");

    side.querySelectorAll("[data-sec-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeSecondaryAction = btn.dataset.secAction;
        const found = list.find((item) => item.id === activeSecondaryAction);
        recordHistory(activeArea, `${found ? found.label : activeSecondaryAction} (${getAreaMeta(activeArea).label})`);
        renderSecondaryRightBar();
      });
    });
  }

  function renderFallback3DBars() {
    if (!leftSidebar || !topRightNav) return;

    leftSidebar.innerHTML = `
      <button type="button" class="tool-btn ${activeLeftAction === "pan" ? "is-active" : ""}" data-action="pan" title="Mover câmera">${CORE_ICONS.hand}</button>
      <button type="button" class="tool-btn ${activeLeftAction === "transform" ? "is-active" : ""}" data-action="transform" title="Transformar">${CORE_ICONS.select}</button>
      <button type="button" class="tool-btn ${activeLeftAction === "align" ? "is-active" : ""}" data-action="align" title="Centralizar">⊕</button>
      <button type="button" class="tool-btn ${activeLeftAction === "hierarchy" ? "is-active" : ""}" data-action="hierarchy" title="Estrutura">⑂</button>
    `;

    topRightNav.innerHTML = `
      <button type="button" class="tool-btn ${active3DView === "light" ? "is-active" : ""}" data-view="light" title="Iluminação">☀</button>
      <button type="button" class="tool-btn ${active3DView === "solid" ? "is-active" : ""}" data-view="solid" title="Sólido">▣</button>
      <button type="button" class="tool-btn ${active3DView === "wireframe" ? "is-active" : ""}" data-view="wireframe" title="Malha">❖</button>
      <button type="button" class="tool-btn ${active3DView === "material" ? "is-active" : ""}" data-view="material" title="Material">✺</button>
      <button type="button" class="tool-btn ${active3DView === "environment" ? "is-active" : ""}" data-view="environment" title="Ambiente">✳</button>
      <button type="button" class="tool-btn ${active3DView === "settings" ? "is-active" : ""}" data-view="settings" title="Configurações">⚙</button>
    `;

    leftSidebar.querySelectorAll("[data-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeLeftAction = btn.dataset.action;
        const secList = SECONDARY_TOOLS_BY_PRIMARY[activeLeftAction];
        if (secList && secList[0]) {
          activeSecondaryAction = secList[0].id;
        }
        if (activeLeftAction === "align") {
          camera.panX = 0;
          camera.panY = 0;
          render();
        }
        recordHistory(activeArea, `Ferramenta: ${activeLeftAction}`);
        refreshBars();
      });
    });

    topRightNav.querySelectorAll("[data-view]").forEach((btn) => {
      btn.addEventListener("click", () => {
        active3DView = btn.dataset.view;
        recordHistory(activeArea, `Submenu: ${active3DView}`);
        refreshBars();
        render();
      });
    });
  }

  function refreshBars() {
    cleanupLegacyRightWidgets();
    renderTopLeft();
    const mod = modules[activeArea];
    if (mod && typeof mod.renderBars === "function") {
      mod.renderBars({ leftSidebar, topCenterNav, topRightNav });
    } else {
      renderFallback3DBars();
    }
    renderPresetsTopCenter();
    renderSecondaryRightBar();
    ensureBottomLeftBar();
    ensureBottomRightBar();
    applyLayoutPositions();
    renderBottomDrawer();
  }

  function switchArea(nextArea) {
    const prevMod = modules[activeArea];
    if (prevMod && typeof prevMod.onDeactivate === "function") {
      prevMod.onDeactivate();
    }
    activeArea = nextArea;
    selectedHistoryId = null;
    moreMenuOpen = false;
    renamingHistoryId = null;

    syncContextsOnAreaChange(nextArea);

    const areaObj = getAreaMeta(nextArea);
    recordHistory(nextArea, `Área: ${areaObj.title}`);

    const nextMod = modules[activeArea];
    if (nextMod && typeof nextMod.onActivate === "function") {
      nextMod.onActivate();
    }
    refreshBars();
    render();
  }

  function project3D(x, y, z, width, height) {
    const cosY = Math.cos(camera.yaw);
    const sinY = Math.sin(camera.yaw);
    const cosP = Math.cos(camera.pitch);
    const sinP = Math.sin(camera.pitch);

    const x1 = x * cosY - z * sinY;
    const z1 = x * sinY + z * cosY;
    const y2 = y * cosP - z1 * sinP;
    const z2 = y * sinP + z1 * cosP;

    const fov = 950;
    const scale = fov / (fov + z2 * camera.zoom * 0.45);
    return {
      x: width / 2 + camera.panX + x1 * camera.zoom * scale,
      y: height / 2 + camera.panY - y2 * camera.zoom * scale,
    };
  }

  function renderFallback3D(width, height) {
    if (!appSettings.showGrid) return;
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

    extrudedShapes.forEach((shape) => {
      const base = shape.points.map((pt) => project3D(pt.x, 0, pt.z, width, height));
      const top = shape.points.map((pt) => project3D(pt.x, shape.height, pt.z, width, height));
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 1.8;

      ctx.beginPath();
      base.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      if (shape.closed) ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      top.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      if (shape.closed) ctx.closePath();
      ctx.fillStyle = "rgba(245, 158, 11, 0.16)";
      ctx.fill();
      ctx.stroke();

      for (let i = 0; i < base.length; i++) {
        ctx.beginPath();
        ctx.moveTo(base[i].x, base[i].y);
        ctx.lineTo(top[i].x, top[i].y);
        ctx.stroke();
      }
    });
  }

  function render() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    ctx.clearRect(0, 0, width, height);

    const mod = modules[activeArea];
    if (mod && typeof mod.render === "function") {
      mod.render(ctx, width, height);
    } else {
      renderFallback3D(width, height);
    }
  }

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    applyLayoutPositions();
    render();
  }

  canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const mod = modules[activeArea];
    if (mod && typeof mod.onMouseDown === "function") {
      mod.onMouseDown(x, y, e);
      return;
    }

    isDragging = true;
    isPanning = e.shiftKey || e.button === 2 || activeLeftAction === "pan";
    lastX = e.clientX;
    lastY = e.clientY;
  });

  window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const mod = modules[activeArea];
    if (mod && typeof mod.onMouseMove === "function") {
      mod.onMouseMove(x, y, e);
      return;
    }

    if (!isDragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;

    if (isPanning) {
      camera.panX += dx;
      camera.panY += dy;
    } else {
      camera.yaw += dx * 0.007;
      camera.pitch = Math.max(0.08, Math.min(1.45, camera.pitch + dy * 0.007));
    }
    render();
  });

  window.addEventListener("mouseup", (e) => {
    isDragging = false;
    const mod = modules[activeArea];
    if (mod && typeof mod.onMouseUp === "function") {
      mod.onMouseUp(e);
    }
  });

  canvas.addEventListener("dblclick", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const mod = modules[activeArea];
    if (mod && typeof mod.onDblClick === "function") {
      mod.onDblClick(x, y, e);
    }
  });

  canvas.addEventListener("contextmenu", (e) => e.preventDefault());

  canvas.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const mod = modules[activeArea];
      if (mod && typeof mod.onWheel === "function") {
        mod.onWheel(e);
        return;
      }
      if (mod) return;
      const factor = e.deltaY > 0 ? 0.92 : 1.08;
      camera.zoom = Math.max(14, Math.min(140, camera.zoom * factor));
      render();
    },
    { passive: false }
  );

  function resetActiveCamera() {
    const mod = modules[activeArea];
    if (mod && typeof mod.resetCamera === "function") {
      mod.resetCamera();
      return;
    }
    Object.assign(camera, defaultCamera);
    render();
  }

  window.RoblesStudio = {
    camera,
    measuresByArea,
    appSettings,
    updateAxisGizmo() {},
    recordHistory,
    toggleHistoryPanel,
    addNewLayer,
    setActive3DWorkspace(wsId) {
      active3DWorkspace = wsId;
      renderBottomDrawer();
    },
    registerModule(areaId, mod) {
      modules[areaId] = mod;
      if (activeArea === areaId) {
        if (typeof mod.onActivate === "function") mod.onActivate();
        refreshBars();
        render();
      }
    },
    switchArea,
    refreshBars,
    render,
    getCanvasSize() {
      return { width: canvas.clientWidth || 800, height: canvas.clientHeight || 600 };
    },
    setExtrudedVectors(vectorPaths) {
      const w = canvas.clientWidth || 800;
      const h = canvas.clientHeight || 600;
      extrudedShapes = vectorPaths
        .filter((p) => p.points.length >= 2)
        .map((p) => ({
          closed: p.closed,
          height: 2.0,
          points: p.points.map((pt) => ({
            x: (pt.x - w / 2) / camera.zoom,
            z: (pt.y - h / 2) / camera.zoom,
          })),
        }));
    },
  };

  ensureRightSidebar();
  ensureBottomLeftBar();
  ensureBottomRightBar();
  ensureBottomDrawer();
  ensureSettingsPopover();
  window.addEventListener("resize", resizeCanvas);
  refreshBars();
  resizeCanvas();
})();



