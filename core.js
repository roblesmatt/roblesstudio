(() => {
  const canvas = document.getElementById("scene-canvas");
  const ctx = canvas.getContext("2d");

  const topLeftNav = document.querySelector(".hud-top-left");
  const topCenterNav = document.querySelector(".hud-top-center");
  const topRightNav = document.querySelector(".hud-top-right");
  const leftSidebar = document.querySelector(".hud-left");
  let rightSidebar = document.querySelector(".hud-right");
  let bottomLeftBarEl = document.getElementById("core-bottom-left-bar") || document.querySelector(".hud-bottom-left");

  // =========================================================================
  // 1. LIMPEZA DE WIDGETS LEGADOS
  // =========================================================================
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

  // =========================================================================
  // 2. ÍCONES E CONSTANTES DO STUDIO
  // =========================================================================
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
    bridge: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>`,
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

  const BLEND_MODES = ["Pass Through", "Normal", "Multiply", "Screen"];

  const BLEND_MAP = {
    "Pass Through": "source-over",
    Normal: "source-over",
    Multiply: "multiply",
    Screen: "screen",
  };

  // =========================================================================
  // 3. UNIFIED SCENE NODE FACTORY (A Ponte entre Vetor, Pixel, Layout, Vídeo e 3D)
  // =========================================================================
  function createCacheCanvas(w = 512, h = 512) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    return c;
  }

  function hydrateSceneNode(raw) {
    const node = {
      opacity: 100,
      blendMode: "Normal",
      transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 },
      dirty: true,
      cacheCanvas: createCacheCanvas(512, 512),
      payload: {},
      ...raw,
    };

    if (!node.payload || Object.keys(node.payload).length === 0) {
      if (node.area === "vector") {
        node.payload = {
          paths: [
            {
              closed: true,
              fill: "rgba(56, 189, 248, 0.25)",
              stroke: "#38bdf8",
              strokeWidth: 3,
              points: [
                { x: -110, y: -70 },
                { x: 110, y: -70 },
                { x: 140, y: 0 },
                { x: 110, y: 70 },
                { x: -110, y: 70 },
                { x: -140, y: 0 },
              ],
            },
          ],
        };
      } else if (node.area === "pixel") {
        node.payload = {
          cellSize: 16,
          strokes: [
            { x: -64, y: -32, color: "#22c55e" },
            { x: -48, y: -32, color: "#22c55e" },
            { x: -32, y: -16, color: "#eab308" },
            { x: -16, y: 0, color: "#eab308" },
            { x: 0, y: 16, color: "#22c55e" },
            { x: 16, y: 16, color: "#22c55e" },
          ],
        };
      } else if (node.area === "layout") {
        node.payload = {
          width: 480,
          height: 320,
          bg: "#18181b",
          linkedLayerIds: ["l-vec-path", "l-px-canvas", "l-video-track"],
        };
      } else if (node.area === "video") {
        node.payload = {
          duration: 10,
          fps: 30,
          playing: true,
          accentColor: "#f97316",
          videoEl: null,
        };
      } else if (node.area === "3d") {
        node.payload = {
          shape: "box",
          dimensions: { w: 4.0, h: 2.2, d: 3.0 },
          color: "#f59e0b",
          textureLayerId: "l-layout-grid",
          extrudedFromId: null,
          profilePoints: null,
        };
      }
    }

    if (Array.isArray(node.children)) {
      node.children = node.children.map(hydrateSceneNode);
    }
    if (Array.isArray(node.sublayers)) {
      node.sublayers = node.sublayers.map(hydrateSceneNode);
    }
    return node;
  }

  // =========================================================================
  // 4. ESTADO CENTRAL DO STUDIO
  // =========================================================================
  const modules = {};
  const listeners = new Map();

  let activeArea = "3d";
  let activePreset = "Paramétrico";
  let activeLeftAction = "transform";
  let activeSecondaryAction = "tf-move";
  let active3DView = "solid";
  let active3DWorkspace = "parametric";

  const timeline = {
    currentTime: 0,
    fps: 30,
    playing: true,
    lastTick: performance.now(),
  };

  const appSettings = {
    showGrid: true,
    snapEnabled: true,
    autoSave: false,
    exportScale: 1,
    liveSync2Dto3D: true,
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
          meta: "Textura: Layout Vivo",
          kind: "item",
          area: "3d",
          visible: true,
          swatch: "linear-gradient(135deg,#f59e0b,#d97706)",
          payload: {
            shape: "box",
            dimensions: { w: 4.0, h: 2.2, d: 3.0 },
            color: "#f59e0b",
            textureLayerId: "l-layout-grid",
          },
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
          payload: {
            shape: "prism",
            dimensions: { w: 2.2, h: 2.8, d: 2.2 },
            color: "#fb923c",
            textureLayerId: "l-vec-path",
          },
        },
        {
          id: "l-hard-part",
          name: "Peça Hard Surface",
          meta: "Chanfro & Encaixe",
          kind: "item",
          area: "3d",
          visible: true,
          swatch: "linear-gradient(135deg,#60a5fa,#3b82f6)",
          payload: {
            shape: "plate",
            dimensions: { w: 4.6, h: 0.45, d: 3.6 },
            color: "#3b82f6",
            textureLayerId: null,
          },
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
          id: "l-layout-grid",
          name: "Prancheta Layout",
          meta: "Composição Viva → 3D",
          kind: "item",
          area: "layout",
          visible: true,
          swatch: "linear-gradient(135deg,#a855f7,#ec4899)",
          payload: {
            width: 480,
            height: 320,
            bg: "#16161a",
            linkedLayerIds: ["l-vec-path", "l-px-canvas", "l-video-track"],
          },
        },
        {
          id: "l-vec-path",
          name: "Traçado Vetorial",
          meta: "Curvas Editáveis",
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
  ].map(hydrateSceneNode);

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
  const camera2D = { zoom: 1, panX: 0, panY: 0 };

  let isDragging = false;
  let isPanning = false;
  let isPaintingOrDrawing = false;
  let lastX = 0;
  let lastY = 0;

  // =========================================================================
  // 5. UTILITÁRIOS DE BUSCA E ÁRVORE
  // =========================================================================
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

  function walkLayers(fn, list = layersTree) {
    for (const node of list) {
      fn(node);
      if (node.children) walkLayers(fn, node.children);
      if (node.sublayers) walkLayers(fn, node.sublayers);
    }
  }

  // =========================================================================
  // 6. MOTOR DE RENDERIZAÇÃO DE NÓS (VETOR, PIXEL, VÍDEO, LAYOUT -> BUFFER)
  // =========================================================================
  function updateNodeBuffer(node) {
    if (!node || !node.cacheCanvas) return;
    const bCanvas = node.cacheCanvas;
    const bCtx = bCanvas.getContext("2d");
    const w = bCanvas.width;
    const h = bCanvas.height;

    if (modules[node.area] && typeof modules[node.area].renderNode === "function") {
      modules[node.area].renderNode(node, bCtx, timeline.currentTime);
      node.dirty = false;
      return;
    }

    bCtx.clearRect(0, 0, w, h);
    bCtx.save();
    bCtx.translate(w / 2, h / 2);

    const m = measuresByArea[node.area] || { scale: 100, offsetX: 0, offsetY: 0, rotation: 0 };
    bCtx.translate(m.offsetX, m.offsetY);
    bCtx.rotate((m.rotation * Math.PI) / 180);
    const sc = (m.scale || 100) / 100;
    bCtx.scale(sc, sc);

    if (node.area === "vector") {
      const paths = node.payload?.paths || [];
      paths.forEach((p) => {
        if (!p.points || p.points.length === 0) return;
        bCtx.beginPath();
        p.points.forEach((pt, idx) => {
          if (idx === 0) bCtx.moveTo(pt.x, pt.y);
          else bCtx.lineTo(pt.x, pt.y);
        });
        if (p.closed) bCtx.closePath();
        if (p.fill) {
          bCtx.fillStyle = p.fill;
          bCtx.fill();
        }
        bCtx.strokeStyle = p.stroke || "#38bdf8";
        bCtx.lineWidth = p.strokeWidth || 2.5;
        bCtx.stroke();

        if (activeArea === "vector" && selectedLayerId === node.id) {
          p.points.forEach((pt) => {
            bCtx.fillStyle = "#ffffff";
            bCtx.strokeStyle = "#0ea5e9";
            bCtx.lineWidth = 1.5;
            bCtx.fillRect(pt.x - 4, pt.y - 4, 8, 8);
            bCtx.strokeRect(pt.x - 4, pt.y - 4, 8, 8);
          });
        }
      });
    } else if (node.area === "pixel") {
      const cell = node.payload?.cellSize || 16;
      const strokes = node.payload?.strokes || [];
      strokes.forEach((st) => {
        bCtx.fillStyle = st.color || "#22c55e";
        bCtx.fillRect(st.x, st.y, cell, cell);
      });
    } else if (node.area === "video") {
      const vid = node.payload?.videoEl;
      if (vid && vid.readyState >= 2) {
        bCtx.drawImage(vid, -200, -112, 400, 225);
      } else {
        const t = timeline.currentTime;
        const grad = bCtx.createLinearGradient(-180, -100, 180, 100);
        grad.addColorStop(0, "rgba(239, 68, 68, 0.35)");
        grad.addColorStop(0.5 + 0.3 * Math.sin(t * 2), "rgba(249, 115, 22, 0.45)");
        grad.addColorStop(1, "rgba(245, 158, 11, 0.35)");
        bCtx.fillStyle = grad;
        bCtx.fillRect(-180, -100, 360, 200);

        bCtx.strokeStyle = "#fb923c";
        bCtx.lineWidth = 3;
        bCtx.beginPath();
        for (let x = -160; x <= 160; x += 8) {
          const y = Math.sin(x * 0.04 + t * 5) * 28;
          if (x === -160) bCtx.moveTo(x, y);
          else bCtx.lineTo(x, y);
        }
        bCtx.stroke();

        bCtx.fillStyle = "rgba(255,255,255,0.85)";
        bCtx.font = "600 12px monospace";
        bCtx.fillText(`REC · ${t.toFixed(2)}s`, -165, -76);
      }
    } else if (node.area === "layout") {
      const lw = node.payload?.width || 440;
      const lh = node.payload?.height || 290;
      bCtx.fillStyle = node.payload?.bg || "#16161a";
      bCtx.fillRect(-lw / 2, -lh / 2, lw, lh);

      bCtx.save();
      bCtx.beginPath();
      bCtx.rect(-lw / 2, -lh / 2, lw, lh);
      bCtx.clip();

      const linked = node.payload?.linkedLayerIds || [];
      linked.forEach((childId) => {
        const child = findLayerNode(childId);
        if (child && child.visible && child.cacheCanvas) {
          if (child.dirty || child.area === "video") updateNodeBuffer(child);
          bCtx.save();
          bCtx.globalAlpha = (child.opacity ?? 100) / 100;
          bCtx.globalCompositeOperation = BLEND_MAP[child.blendMode] || "source-over";
          bCtx.drawImage(child.cacheCanvas, -w / 2, -h / 2);
          bCtx.restore();
        }
      });
      bCtx.restore();

      bCtx.strokeStyle = "rgba(168, 85, 247, 0.75)";
      bCtx.lineWidth = 2;
      bCtx.strokeRect(-lw / 2, -lh / 2, lw, lh);
    }

    if (Array.isArray(node.sublayers)) {
      node.sublayers.forEach((sub) => {
        if (!sub.visible || sub.kind === "mask") return;
        if (sub.dirty) updateNodeBuffer(sub);
        bCtx.drawImage(sub.cacheCanvas, -w / 2, -h / 2);
      });
    }

    bCtx.restore();
    node.dirty = false;
  }

  // =========================================================================
  // 7. ROBLES BRIDGE — COMUNICAÇÃO BIDIRECIONAL ENTRE AS 5 PERSONAS
  // =========================================================================
  const RoblesBridge = {
    getState() {
      return {
        activeArea,
        activePreset,
        selectedLayerId,
        layersTree,
        camera,
        camera2D,
        timeline,
      };
    },

    on(event, handler) {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event).add(handler);
      return () => listeners.get(event)?.delete(handler);
    },

    emit(event, payload) {
      listeners.get(event)?.forEach((fn) => {
        try {
          fn(payload);
        } catch (err) {
          console.error(`[RoblesBridge:${event}]`, err);
        }
      });
    },

    registerModule(areaId, moduleApi) {
      modules[areaId] = moduleApi;
      this.invalidateAll();
    },

    getNode(id) {
      return findLayerNode(id);
    },

    invalidateNode(id) {
      const node = findLayerNode(id);
      if (!node) return;
      node.dirty = true;

      walkLayers((n) => {
        if (n.area === "layout" && n.payload?.linkedLayerIds?.includes(id)) {
          n.dirty = true;
        }
      });

      this.emit("node:updated", node);
      render();
    },

    invalidateAll() {
      walkLayers((n) => {
        n.dirty = true;
      });
      render();
    },

    bindTextureTo3D(sourceLayerId, target3DLayerId = "l-param-base") {
      const target3D = findLayerNode(target3DLayerId);
      const source = findLayerNode(sourceLayerId);
      if (!target3D || target3D.area !== "3d" || !source) return false;

      target3D.payload.textureLayerId = source.id;
      target3D.meta = `Textura: ${source.name}`;
      recordHistory("3d", `Textura 3D vinculada: ${source.name} → ${target3D.name}`);
      renderBottomDrawer();
      render();
      return true;
    },

    convertNode(id, targetArea) {
      const node = findLayerNode(id);
      if (!node) return null;

      if ((node.area === "vector" || node.area === "layout") && targetArea === "3d") {
        const grp3d = findLayerNode("grp-3d");
        const pts = node.payload?.paths?.[0]?.points || [
          { x: -80, y: -60 },
          { x: 80, y: -60 },
          { x: 80, y: 60 },
          { x: -80, y: 60 },
        ];
        const new3D = hydrateSceneNode({
          id: `3d-ext-${Date.now().toString(36)}`,
          name: `Extrusão · ${node.name}`,
          meta: "Extrudado do Vetor",
          kind: "item",
          area: "3d",
          visible: true,
          swatch: "linear-gradient(135deg,#38bdf8,#f59e0b)",
          payload: {
            shape: "extruded",
            dimensions: { w: 3.2, h: 1.4, d: 2.4 },
            color: "#38bdf8",
            textureLayerId: node.id,
            extrudedFromId: node.id,
            profilePoints: pts.map((p) => ({ x: p.x / 50, z: p.y / 50 })),
          },
        });
        grp3d.children.unshift(new3D);
        grp3d.meta = `${grp3d.children.length} Layers`;
        selectedLayerId = new3D.id;
        recordHistory("3d", `Extrusão 2D→3D: ${node.name}`);
        setActiveArea("3d");
        return new3D;
      }

      if (node.area === "3d" && targetArea === "vector") {
        const grp2d = findLayerNode("grp-2d");
        const dims = node.payload?.dimensions || { w: 3, h: 2, d: 3 };
        const scale = 45;
        const projectedPts = project3DBoxOutline(dims, scale);
        const newVec = hydrateSceneNode({
          id: `vec-proj-${Date.now().toString(36)}`,
          name: `Projeção · ${node.name}`,
          meta: "Vetor extraído do 3D",
          kind: "item",
          area: "vector",
          visible: true,
          swatch: "linear-gradient(135deg,#f59e0b,#38bdf8)",
          payload: {
            paths: [
              {
                closed: true,
                fill: "rgba(245, 158, 11, 0.16)",
                stroke: "#f59e0b",
                strokeWidth: 2.5,
                points: projectedPts,
              },
            ],
          },
        });
        grp2d.children.unshift(newVec);
        grp2d.meta = `${grp2d.children.length} Layers`;
        selectedLayerId = newVec.id;
        recordHistory("vector", `Projeção 3D→Vetor: ${node.name}`);
        setActiveArea("vector");
        return newVec;
      }

      if (node.area === "vector" && targetArea === "pixel") {
        updateNodeBuffer(node);
        const subPixel = hydrateSceneNode({
          id: `sub-px-${Date.now().toString(36)}`,
          name: `Pintura Pixel (${node.name})`,
          meta: "Subcamada Raster",
          kind: "item",
          area: "pixel",
          visible: true,
          swatch: "linear-gradient(135deg,#22c55e,#38bdf8)",
        });
        node.sublayers = node.sublayers || [];
        node.sublayers.unshift(subPixel);
        node.dirty = true;
        recordHistory("pixel", `Subcamada Pixel criada em ${node.name}`);
        renderBottomDrawer();
        render();
        return subPixel;
      }

      if (node.area === "pixel" && targetArea === "vector") {
        const strokes = node.payload?.strokes || [];
        const pts = strokes.length
          ? strokes.map((s) => ({ x: s.x + 8, y: s.y + 8 }))
          : [
              { x: -60, y: -60 },
              { x: 60, y: -60 },
              { x: 60, y: 60 },
              { x: -60, y: 60 },
            ];
        const grp2d = findLayerNode("grp-2d");
        const vectorized = hydrateSceneNode({
          id: `vec-trace-${Date.now().toString(36)}`,
          name: `Traçado · ${node.name}`,
          meta: "Vetorizado de Pixel",
          kind: "item",
          area: "vector",
          visible: true,
          swatch: "linear-gradient(135deg,#22c55e,#818cf8)",
          payload: {
            paths: [
              {
                closed: false,
                fill: null,
                stroke: "#4ade80",
                strokeWidth: 4,
                points: pts,
              },
            ],
          },
        });
        grp2d.children.unshift(vectorized);
        grp2d.meta = `${grp2d.children.length} Layers`;
        selectedLayerId = vectorized.id;
        recordHistory("vector", `Vetorizado Pixel→Vetor: ${node.name}`);
        setActiveArea("vector");
        return vectorized;
      }

      return null;
    },

    attachVideo(videoElement, layerId = "l-video-track") {
      const node = findLayerNode(layerId);
      if (!node) return;
      node.payload.videoEl = videoElement;
      node.dirty = true;
      render();
    },
  };

  window.RoblesCore = RoblesBridge;

  // =========================================================================
  // 8. UI / HUD — BARRAS LATERAIS, INFERIORES E POPOVERS
  // =========================================================================
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
    document.querySelector(".viewport, .studio-shell, body")?.appendChild(el);
    rightSidebar = el;
    return el;
  }

  function renderRightSidebar() {
    const sb = ensureRightSidebar();
    if (!sb) return;
    const tools = SECONDARY_TOOLS_BY_PRIMARY[activeLeftAction] || SECONDARY_TOOLS_BY_PRIMARY.transform;
    sb.innerHTML = tools
      .map(
        (t) => `
        <button type="button" class="tool-btn ${activeSecondaryAction === t.id ? "is-active" : ""}" data-sec="${t.id}" title="${t.label}" style="font-size:13px;">
          ${t.icon}
        </button>`
      )
      .join("");

    sb.querySelectorAll("[data-sec]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        activeSecondaryAction = btn.dataset.sec;
        if (activeSecondaryAction === "pan-fit") {
          Object.assign(camera, defaultCamera);
          Object.assign(camera2D, { zoom: 1, panX: 0, panY: 0 });
        }
        renderRightSidebar();
        render();
      });
    });
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
        <span>Sincronia Viva 2D ↔ 3D</span>
        <input type="checkbox" data-set-sync ${appSettings.liveSync2Dto3D ? "checked" : ""} style="accent-color:#f59e0b;cursor:pointer;" />
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

    pop.querySelector("[data-set-sync]")?.addEventListener("change", (e) => {
      appSettings.liveSync2Dto3D = e.target.checked;
      render();
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
      link.download = `robles-studio-${activeArea}-${Date.now()}.png`;
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
        <button type="button" class="tool-btn" data-footer="save" title="Salvar Projeto">${CORE_ICONS.save}</button>
        <button type="button" class="tool-btn" data-footer="settings" title="Configurações">${CORE_ICONS.gear}</button>
        <button type="button" class="tool-btn" data-footer="export" title="Exportar PNG">${CORE_ICONS.exportIcon}</button>
      `;
      el.querySelectorAll("[data-footer]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const act = btn.dataset.footer;
          const areaMeta = getAreaMeta(activeArea);
          if (act === "save") {
            try {
              const snapshot = JSON.stringify({ activeArea, activePreset, measuresByArea });
              localStorage.setItem("robles_studio_autosave", snapshot);
            } catch (_) {}
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
      document.querySelector(".viewport, .studio-shell, body")?.appendChild(el);
      bottomLeftBarEl = el;
    }

    forceHorizontalBottomLeftStyle(bottomLeftBarEl);
    return bottomLeftBarEl;
  }

  function applyLayoutPositions() {
    const mobile = isMobileViewport();

    if (topLeftNav) {
      topLeftNav.style.flexDirection = "row";
      topLeftNav.style.left = mobile ? "10px" : "14px";
      topLeftNav.style.top = mobile ? "10px" : "14px";
    }

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
        bottomDrawerEl.style.width = "296px";
        bottomDrawerEl.style.maxHeight = "490px";
      }
    }
  }

  // =========================================================================
  // 9. NAVEGAÇÃO ENTRE PERSONAS (LATERAL SUPERIOR ESQUERDA) + PRESETS (CENTRO)
  // =========================================================================
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

  function setActiveArea(nextArea) {
    if (!AREAS.some((a) => a.id === nextArea)) return;
    activeArea = nextArea;
    syncContextsOnAreaChange(nextArea);
    renderTopNav();
    renderBottomDrawer();
    RoblesBridge.invalidateAll();
    RoblesBridge.emit("area:changed", nextArea);
  }

  function renderTopNav() {
    // 1. Personas na lateral superior esquerda (.hud-top-left)
    const personaContainer = topLeftNav || topCenterNav;
    if (personaContainer) {
      personaContainer.innerHTML = AREAS.map(
        (a) => `
        <button type="button" class="tool-btn ${activeArea === a.id ? "is-active" : ""}" data-area="${a.id}" title="${a.title}">
          ${a.icon}
        </button>`
      ).join("");

      personaContainer.querySelectorAll("[data-area]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          setActiveArea(btn.dataset.area);
        });
      });
    }

    // 2. Presets no topo central (.hud-top-center)
    const presetContainer = topLeftNav ? topCenterNav : topRightNav;
    if (presetContainer) {
      const presets = PRESETS_BY_AREA[activeArea] || [];
      presetContainer.innerHTML = presets
        .map(
          (p) => `
          <button type="button" class="tool-btn ${activePreset === p ? "is-active" : ""}" data-preset="${p}" style="width:auto;padding:0 10px;font-size:11px;font-weight:600;white-space:nowrap;">
            ${p}
          </button>`
        )
        .join("");

      presetContainer.querySelectorAll("[data-preset]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          activePreset = btn.dataset.preset;
          recordHistory(activeArea, `Preset · ${activePreset}`);
          renderTopNav();
          render();
        });
      });
    }
  }

  // =========================================================================
  // 10. HISTÓRICO E CAMADAS
  // =========================================================================
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

  function addNewLayer() {
    const targetGroup =
      layersTree.find((g) => (activeArea === "3d" ? g.area === "3d" : g.area === "vector")) ||
      layersTree[0];
    if (!targetGroup) return;

    const areaMeta = getAreaMeta(activeArea);
    const count = (targetGroup.children?.length || 0) + 1;
    const newLayer = hydrateSceneNode({
      id: `lyr-${Date.now().toString(36)}`,
      name: `${areaMeta.label} · Camada ${count}`,
      meta: activeArea === "3d" ? "Objeto 3D" : `Camada ${areaMeta.label}`,
      kind: "item",
      area: activeArea,
      visible: true,
      swatch: "linear-gradient(135deg,#f59e0b,#ec4899)",
    });

    targetGroup.children = targetGroup.children || [];
    targetGroup.children.unshift(newLayer);
    targetGroup.meta = `${targetGroup.children.length} Layers`;
    targetGroup.expanded = true;
    selectedLayerId = newLayer.id;
    recordHistory(activeArea, `Nova camada: ${newLayer.name}`);
    renderBottomDrawer();
    render();
  }

  // =========================================================================
  // 11. DRAWERS INFERIORES (CAMADAS + BRIDGE | MEDIDAS | HISTÓRICO)
  // =========================================================================
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
      <button type="button" class="tool-btn" data-brmode="layers" title="Camadas & StudioLink">${CORE_ICONS.layers}</button>
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

    document.querySelector(".viewport, .studio-shell, body")?.appendChild(bar);
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
      width: 296px;
      max-height: 490px;
      z-index: 32;
      font-size: 12px;
      color: #fff;
      overflow-y: auto;
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
    const indentPx = depth * 14;

    let html = `
      <div data-layer-row="${node.id}" style="
        display:flex;align-items:center;justify-content:space-between;gap:6px;
        padding:5px 6px 5px ${6 + indentPx}px;
        border-radius:7px;
        background:${isSelected ? "rgba(245, 158, 11, 0.18)" : "rgba(255,255,255,0.03)"};
        border:1px solid ${isSelected ? "rgba(245, 158, 11, 0.55)" : "transparent"};
        cursor:pointer;
      ">
        <div style="display:flex;align-items:center;gap:6px;min-width:0;flex:1;">
          ${
            hasChildren
              ? `<span data-toggle-expand="${node.id}" style="font-size:10px;opacity:0.75;width:12px;">${node.expanded ? "▾" : "▸"}</span>`
              : `<span style="width:12px;font-size:9px;opacity:0.5;">${node.area === "3d" ? "3D" : "2D"}</span>`
          }
          <span style="width:12px;height:12px;border-radius:3px;flex-shrink:0;background:${node.swatch};"></span>
          <div style="min-width:0;flex:1;">
            <div style="font-size:11px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${node.name}</div>
            <div style="font-size:9.5px;opacity:0.62;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${node.meta || ""}</div>
          </div>
        </div>
        <button type="button" data-toggle-vis="${node.id}" title="Visibilidade" style="background:none;border:none;color:${node.visible ? "#fff" : "rgba(255,255,255,0.3)"};cursor:pointer;padding:2px;">
          ${node.visible ? CORE_ICONS.eye : CORE_ICONS.eyeOff}
        </button>
      </div>
    `;

    if (hasChildren && (node.expanded || q)) {
      node.children.forEach((child) => {
        html += renderLayerRow(child, depth + 1);
      });
    }

    if (hasSubs) {
      node.sublayers.forEach((sub) => {
        html += renderLayerRow(sub, depth + 1);
      });
    }

    return html;
  }

  function renderStudioLinkActions(selectedNode) {
    if (!selectedNode || selectedNode.kind === "group") return "";

    const actions = [];
    if (selectedNode.area === "vector" || selectedNode.area === "layout") {
      actions.push(`<button type="button" data-bridge-act="to-3d" style="flex:1;padding:5px;border-radius:6px;border:1px solid rgba(56,189,248,0.4);background:rgba(56,189,248,0.14);color:#7dd3fc;font-size:10px;font-weight:600;cursor:pointer;">Extrudar → 3D</button>`);
      actions.push(`<button type="button" data-bridge-act="tex-3d" style="flex:1;padding:5px;border-radius:6px;border:1px solid rgba(245,158,11,0.4);background:rgba(245,158,11,0.14);color:#fcd34d;font-size:10px;font-weight:600;cursor:pointer;">Textura no 3D</button>`);
    }
    if (selectedNode.area === "vector") {
      actions.push(`<button type="button" data-bridge-act="to-pixel" style="flex:1;padding:5px;border-radius:6px;border:1px solid rgba(34,197,94,0.4);background:rgba(34,197,94,0.14);color:#86efac;font-size:10px;font-weight:600;cursor:pointer;">+ Camada Pixel</button>`);
    }
    if (selectedNode.area === "pixel") {
      actions.push(`<button type="button" data-bridge-act="to-vector" style="flex:1;padding:5px;border-radius:6px;border:1px solid rgba(129,140,248,0.4);background:rgba(129,140,248,0.14);color:#c7d2fe;font-size:10px;font-weight:600;cursor:pointer;">Vetorizar → Curvas</button>`);
    }
    if (selectedNode.area === "video") {
      actions.push(`<button type="button" data-bridge-act="tex-3d" style="flex:1;padding:5px;border-radius:6px;border:1px solid rgba(249,115,22,0.4);background:rgba(249,115,22,0.14);color:#fdba74;font-size:10px;font-weight:600;cursor:pointer;">Projetar Vídeo no 3D</button>`);
    }
    if (selectedNode.area === "3d") {
      actions.push(`<button type="button" data-bridge-act="to-vector" style="flex:1;padding:5px;border-radius:6px;border:1px solid rgba(56,189,248,0.4);background:rgba(56,189,248,0.14);color:#7dd3fc;font-size:10px;font-weight:600;cursor:pointer;">Extrair Vetor 2D</button>`);
    }

    if (actions.length === 0) return "";

    return `
      <div style="padding:6px;border-radius:7px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);">
        <div style="font-size:9.5px;text-transform:uppercase;letter-spacing:0.05em;opacity:0.65;margin-bottom:5px;display:flex;align-items:center;gap:4px;">
          ${CORE_ICONS.bridge} StudioLink · Conversão Cruzada
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:4px;">
          ${actions.join("")}
        </div>
      </div>
    `;
  }

  function renderBottomDrawer() {
    const drawer = ensureBottomDrawer();
    if (!drawer) return;

    if (!activeBottomDrawer) {
      drawer.style.display = "none";
      return;
    }

    drawer.style.display = "flex";

    if (activeBottomDrawer === "layers") {
      const selectedNode = findLayerNode(selectedLayerId);
      const treeHtml = layersTree.map((g) => renderLayerRow(g, 0)).join("");

      drawer.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:6px;">
          <span style="font-weight:700;font-size:12px;">Camadas & StudioLink</span>
          <div style="display:flex;gap:4px;">
            <button type="button" id="btn-add-layer" title="Nova Camada" style="background:rgba(255,255,255,0.08);border:none;color:#fff;border-radius:5px;padding:3px 6px;cursor:pointer;">${CORE_ICONS.plus}</button>
            <button type="button" id="btn-del-layer" title="Remover Camada" style="background:rgba(255,255,255,0.08);border:none;color:#f87171;border-radius:5px;padding:3px 6px;cursor:pointer;">${CORE_ICONS.trash}</button>
          </div>
        </div>

        <div style="display:flex;gap:6px;align-items:center;">
          <select id="sel-blend-mode" style="flex:1;background:rgba(255,255,255,0.08);color:#fff;border:1px solid rgba(255,255,255,0.12);border-radius:6px;padding:4px 6px;font-size:11px;">
            ${BLEND_MODES.map((m) => `<option value="${m}" ${blendMode === m ? "selected" : ""} style="background:#1c1c20;">${m}</option>`).join("")}
          </select>
          <span style="font-size:11px;opacity:0.8;min-width:34px;text-align:right;">${layerOpacity}%</span>
        </div>

        <input id="inp-layer-search" type="text" value="${layerSearch}" placeholder="Filtrar camadas..." style="background:rgba(0,0,0,0.28);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:5px 8px;color:#fff;font-size:11px;outline:none;" />

        ${renderStudioLinkActions(selectedNode)}

        <div style="display:flex;flex-direction:column;gap:4px;max-height:240px;overflow-y:auto;">
          ${treeHtml}
        </div>
      `;

      drawer.querySelector("#btn-add-layer")?.addEventListener("click", addNewLayer);
      drawer.querySelector("#btn-del-layer")?.addEventListener("click", () => {
        if (selectedLayerId && !selectedLayerId.startsWith("grp-")) {
          deleteLayerNode(selectedLayerId);
          selectedLayerId = "l-param-base";
          renderBottomDrawer();
          render();
        }
      });

      drawer.querySelector("#sel-blend-mode")?.addEventListener("change", (e) => {
        blendMode = e.target.value;
        const n = findLayerNode(selectedLayerId);
        if (n) {
          n.blendMode = blendMode;
          RoblesBridge.invalidateNode(n.id);
        }
      });

      drawer.querySelector("#inp-layer-search")?.addEventListener("input", (e) => {
        layerSearch = e.target.value;
        renderBottomDrawer();
      });

      drawer.querySelectorAll("[data-layer-row]").forEach((row) => {
        row.addEventListener("click", (e) => {
          e.stopPropagation();
          const id = row.dataset.layerRow;
          selectedLayerId = id;
          const node = findLayerNode(id);
          if (node && node.area && node.area !== activeArea && node.kind !== "group") {
            setActiveArea(node.area);
            return;
          }
          renderBottomDrawer();
          render();
        });
      });

      drawer.querySelectorAll("[data-toggle-expand]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const node = findLayerNode(btn.dataset.toggleExpand);
          if (node) node.expanded = !node.expanded;
          renderBottomDrawer();
        });
      });

      drawer.querySelectorAll("[data-toggle-vis]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const node = findLayerNode(btn.dataset.toggleVis);
          if (node) {
            node.visible = !node.visible;
            RoblesBridge.invalidateNode(node.id);
          }
          renderBottomDrawer();
        });
      });

      drawer.querySelectorAll("[data-bridge-act]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const act = btn.dataset.bridgeAct;
          if (!selectedNode) return;
          if (act === "to-3d") RoblesBridge.convertNode(selectedNode.id, "3d");
          else if (act === "to-vector") RoblesBridge.convertNode(selectedNode.id, "vector");
          else if (act === "to-pixel") RoblesBridge.convertNode(selectedNode.id, "pixel");
          else if (act === "tex-3d") RoblesBridge.bindTextureTo3D(selectedNode.id, "l-param-base");
        });
      });
    } else if (activeBottomDrawer === "measures") {
      const m = getCurrentMeasures();
      const areaMeta = getAreaMeta(activeArea);

      drawer.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:6px;">
          <span style="font-weight:700;font-size:12px;">Medidas · ${areaMeta.label} (${areaMeta.unit})</span>
          <button type="button" id="btn-reset-measures" style="background:rgba(255,255,255,0.08);border:none;color:#fff;border-radius:5px;padding:3px 7px;font-size:10px;cursor:pointer;">Resetar</button>
        </div>

        <label style="display:flex;flex-direction:column;gap:3px;font-size:11px;">
          <div style="display:flex;justify-content:space-between;"><span>Escala</span><span>${m.scale}%</span></div>
          <input type="range" id="rng-scale" min="20" max="250" value="${m.scale}" style="accent-color:#f59e0b;" />
        </label>

        <label style="display:flex;flex-direction:column;gap:3px;font-size:11px;">
          <div style="display:flex;justify-content:space-between;"><span>Deslocamento X</span><span>${m.offsetX} ${areaMeta.unit}</span></div>
          <input type="range" id="rng-ox" min="-200" max="200" value="${m.offsetX}" style="accent-color:#f59e0b;" />
        </label>

        <label style="display:flex;flex-direction:column;gap:3px;font-size:11px;">
          <div style="display:flex;justify-content:space-between;"><span>Deslocamento Y</span><span>${m.offsetY} ${areaMeta.unit}</span></div>
          <input type="range" id="rng-oy" min="-200" max="200" value="${m.offsetY}" style="accent-color:#f59e0b;" />
        </label>

        <label style="display:flex;flex-direction:column;gap:3px;font-size:11px;">
          <div style="display:flex;justify-content:space-between;"><span>Rotação</span><span>${m.rotation}°</span></div>
          <input type="range" id="rng-rot" min="-180" max="180" value="${m.rotation}" style="accent-color:#f59e0b;" />
        </label>
      `;

      drawer.querySelector("#btn-reset-measures")?.addEventListener("click", () => {
        measuresByArea[activeArea] = { scale: 100, offsetX: 0, offsetY: 0, rotation: 0 };
        if (activeArea === "3d") camera.zoom = 42;
        RoblesBridge.invalidateAll();
        renderBottomDrawer();
      });

      drawer.querySelector("#rng-scale")?.addEventListener("input", (e) => {
        m.scale = Number(e.target.value);
        if (activeArea === "3d") camera.zoom = (m.scale / 100) * 42;
        RoblesBridge.invalidateAll();
        renderBottomDrawer();
      });

      drawer.querySelector("#rng-ox")?.addEventListener("input", (e) => {
        m.offsetX = Number(e.target.value);
        RoblesBridge.invalidateAll();
        renderBottomDrawer();
      });

      drawer.querySelector("#rng-oy")?.addEventListener("input", (e) => {
        m.offsetY = Number(e.target.value);
        RoblesBridge.invalidateAll();
        renderBottomDrawer();
      });

      drawer.querySelector("#rng-rot")?.addEventListener("input", (e) => {
        m.rotation = Number(e.target.value);
        RoblesBridge.invalidateAll();
        renderBottomDrawer();
      });
    } else if (activeBottomDrawer === "history") {
      const currentTabObj = HISTORY_TABS.find((t) => t.id === activeHistoryTab) || HISTORY_TABS[5];
      const filtered =
        activeHistoryTab === "all"
          ? historyEntries
          : historyEntries.filter((e) => e.tab === activeHistoryTab);

      drawer.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:6px;">
          <span style="font-weight:700;font-size:12px;">Histórico · ${currentTabObj.label}</span>
          <button type="button" id="btn-clear-hist" style="background:rgba(255,255,255,0.08);border:none;color:#f87171;border-radius:5px;padding:3px 7px;font-size:10px;cursor:pointer;">Limpar</button>
        </div>

        <div style="display:flex;gap:4px;flex-wrap:wrap;">
          ${HISTORY_TABS.map(
            (t) => `
            <button type="button" data-htab="${t.id}" style="
              padding:3px 6px;border-radius:5px;border:none;cursor:pointer;font-size:10px;font-weight:600;
              background:${activeHistoryTab === t.id ? "#f59e0b" : "rgba(255,255,255,0.08)"};
              color:${activeHistoryTab === t.id ? "#111" : "#fff"};
            ">${t.label}</button>`
          ).join("")}
        </div>

        <div style="display:flex;flex-direction:column;gap:4px;max-height:260px;overflow-y:auto;">
          ${
            filtered.length === 0
              ? `<div style="opacity:0.55;font-size:11px;padding:12px 4px;text-align:center;">${currentTabObj.emptyText}</div>`
              : filtered
                  .map(
                    (entry) => `
                  <div style="display:flex;align-items:center;justify-content:space-between;padding:5px 7px;border-radius:6px;background:rgba(255,255,255,0.04);font-size:11px;">
                    <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:190px;">${entry.label}</span>
                    <span style="opacity:0.5;font-size:9.5px;">${entry.time}</span>
                  </div>`
                  )
                  .join("")
          }
        </div>
      `;

      drawer.querySelector("#btn-clear-hist")?.addEventListener("click", () => {
        historyEntries = [];
        renderBottomDrawer();
      });

      drawer.querySelectorAll("[data-htab]").forEach((btn) => {
        btn.addEventListener("click", () => {
          activeHistoryTab = btn.dataset.htab;
          renderBottomDrawer();
        });
      });
    }
  }

  // =========================================================================
  // 12. PROJEÇÃO 3D E MAPEAMENTO DE TEXTURAS VIVAS (2D/VÍDEO -> 3D)
  // =========================================================================
  function projectPoint3D(x, y, z, cx, cy) {
    const cosY = Math.cos(camera.yaw);
    const sinY = Math.sin(camera.yaw);
    const cosP = Math.cos(camera.pitch);
    const sinP = Math.sin(camera.pitch);

    const x1 = x * cosY - z * sinY;
    const z1 = x * sinY + z * cosY;

    const y2 = y * cosP - z1 * sinP;
    const z2 = y * sinP + z1 * cosP;

    const perspective = 16 / Math.max(4, 16 + z2);
    const scale = camera.zoom * perspective;

    return {
      x: cx + camera.panX + x1 * scale,
      y: cy + camera.panY - y2 * scale,
      z: z2,
    };
  }

  function project3DBoxOutline(dims, scale = 45) {
    const hw = (dims.w / 2) * scale;
    const hh = (dims.h / 2) * scale;
    return [
      { x: -hw, y: -hh },
      { x: hw, y: -hh },
      { x: hw, y: hh },
      { x: -hw, y: hh },
    ];
  }

  function drawTexturedQuad3D(p0, p1, p2, p3, sourceCanvas) {
    if (!sourceCanvas) return;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.closePath();
    ctx.clip();

    const sw = sourceCanvas.width;
    const sh = sourceCanvas.height;
    const ax = (p1.x - p0.x) / sw;
    const ay = (p1.y - p0.y) / sw;
    const bx = (p3.x - p0.x) / sh;
    const by = (p3.y - p0.y) / sh;

    ctx.transform(ax, ay, bx, by, p0.x, p0.y);
    ctx.drawImage(sourceCanvas, 0, 0);
    ctx.restore();
  }

  function draw3DViewport(w, h) {
    const cx = w / 2;
    const cy = h / 2;

    if (appSettings.showGrid) {
      ctx.lineWidth = 1;
      const gridSize = 8;
      for (let i = -gridSize; i <= gridSize; i++) {
        const a1 = projectPoint3D(i, -1.1, -gridSize, cx, cy);
        const a2 = projectPoint3D(i, -1.1, gridSize, cx, cy);
        ctx.strokeStyle = i === 0 ? "rgba(59, 130, 246, 0.45)" : "rgba(255, 255, 255, 0.06)";
        ctx.beginPath();
        ctx.moveTo(a1.x, a1.y);
        ctx.lineTo(a2.x, a2.y);
        ctx.stroke();

        const b1 = projectPoint3D(-gridSize, -1.1, i, cx, cy);
        const b2 = projectPoint3D(gridSize, -1.1, i, cx, cy);
        ctx.strokeStyle = i === 0 ? "rgba(239, 68, 68, 0.45)" : "rgba(255, 255, 255, 0.06)";
        ctx.beginPath();
        ctx.moveTo(b1.x, b1.y);
        ctx.lineTo(b2.x, b2.y);
        ctx.stroke();
      }
    }

    const grp3d = findLayerNode("grp-3d");
    const items3d = (grp3d?.children || []).filter((n) => n.visible);

    items3d.forEach((node3d, idx) => {
      const dims = node3d.payload?.dimensions || { w: 3, h: 2, d: 3 };
      const offsetX = idx === 0 ? 0 : idx === 1 ? -3.4 : 3.5;
      const hw = dims.w / 2;
      const hh = dims.h / 2;
      const hd = dims.d / 2;

      const verts = [
        projectPoint3D(offsetX - hw, -hh, -hd, cx, cy),
        projectPoint3D(offsetX + hw, -hh, -hd, cx, cy),
        projectPoint3D(offsetX + hw, hh, -hd, cx, cy),
        projectPoint3D(offsetX - hw, hh, -hd, cx, cy),
        projectPoint3D(offsetX - hw, -hh, hd, cx, cy),
        projectPoint3D(offsetX + hw, -hh, hd, cx, cy),
        projectPoint3D(offsetX + hw, hh, hd, cx, cy),
        projectPoint3D(offsetX - hw, hh, hd, cx, cy),
      ];

      const faces = [
        { indices: [4, 5, 6, 7], shade: "rgba(245, 158, 11, 0.22)", textured: true },
        { indices: [3, 2, 6, 7], shade: "rgba(251, 191, 36, 0.28)", textured: true },
        { indices: [1, 5, 6, 2], shade: "rgba(217, 119, 6, 0.18)", textured: false },
        { indices: [0, 4, 7, 3], shade: "rgba(180, 83, 9, 0.16)", textured: false },
        { indices: [0, 1, 2, 3], shade: "rgba(120, 53, 15, 0.14)", textured: false },
      ];

      faces.sort((fa, fb) => {
        const za = fa.indices.reduce((acc, i) => acc + verts[i].z, 0) / 4;
        const zb = fb.indices.reduce((acc, i) => acc + verts[i].z, 0) / 4;
        return zb - za;
      });

      const texNode =
        appSettings.liveSync2Dto3D && node3d.payload?.textureLayerId
          ? findLayerNode(node3d.payload.textureLayerId)
          : null;

      if (texNode && (texNode.dirty || texNode.area === "video" || texNode.area === "layout")) {
        updateNodeBuffer(texNode);
      }

      const isSelected = selectedLayerId === node3d.id;

      faces.forEach((f) => {
        const [i0, i1, i2, i3] = f.indices;
        ctx.beginPath();
        ctx.moveTo(verts[i0].x, verts[i0].y);
        ctx.lineTo(verts[i1].x, verts[i1].y);
        ctx.lineTo(verts[i2].x, verts[i2].y);
        ctx.lineTo(verts[i3].x, verts[i3].y);
        ctx.closePath();

        ctx.fillStyle = isSelected ? f.shade : "rgba(255,255,255,0.06)";
        ctx.fill();

        if (f.textured && texNode && texNode.visible && texNode.cacheCanvas) {
          drawTexturedQuad3D(verts[i3], verts[i2], verts[i1], verts[i0], texNode.cacheCanvas);
        }

        ctx.strokeStyle = isSelected ? "rgba(245, 158, 11, 0.9)" : "rgba(255, 255, 255, 0.25)";
        ctx.lineWidth = isSelected ? 1.6 : 1;
        ctx.stroke();
      });
    });
  }

  function draw2DViewport(w, h) {
    const cx = w / 2 + camera2D.panX;
    const cy = h / 2 + camera2D.panY;

    if (appSettings.showGrid) {
      const step = activeArea === "pixel" ? 16 : 32;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      for (let x = cx % step; x < w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = cy % step; y < h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    }

    const grp2d = findLayerNode("grp-2d");
    const items2d = (grp2d?.children || []).filter((n) => n.visible);

    items2d
      .slice()
      .reverse()
      .forEach((node) => {
        if (activeArea !== "layout" && node.area === "layout") return;
        if (node.dirty || node.area === "video" || node.area === "layout") {
          updateNodeBuffer(node);
        }

        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(camera2D.zoom, camera2D.zoom);
        ctx.globalAlpha = (node.opacity ?? 100) / 100;
        ctx.globalCompositeOperation = BLEND_MAP[node.blendMode] || "source-over";
        ctx.drawImage(
          node.cacheCanvas,
          -node.cacheCanvas.width / 2,
          -node.cacheCanvas.height / 2
        );
        ctx.restore();
      });
  }

  // =========================================================================
  // 13. LOOP PRINCIPAL DE RENDERIZAÇÃO
  // =========================================================================
  function resizeCanvas() {
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || window.innerWidth;
    const height = rect.height || window.innerHeight;
    if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function render() {
    if (!canvas || !ctx) return;
    resizeCanvas();

    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);

    ctx.clearRect(0, 0, w, h);

    if (activeArea === "3d") {
      draw3DViewport(w, h);
    } else {
      draw2DViewport(w, h);
    }

    const areaMeta = getAreaMeta(activeArea);
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
    ctx.font = "500 11px system-ui, -apple-system, sans-serif";
    ctx.fillText(
      `ROBLES STUDIO · ${areaMeta.label.toUpperCase()} (${activePreset}) · StudioLink Ativo`,
      16,
      h - 62
    );
    ctx.restore();
  }

  function startAnimationLoop() {
    function tick(now) {
      const dt = (now - timeline.lastTick) / 1000;
      timeline.lastTick = now;

      if (timeline.playing) {
        timeline.currentTime += dt;
        const videoNode = findLayerNode("l-video-track");
        if (videoNode && videoNode.visible && (activeArea === "video" || activeArea === "layout" || activeArea === "3d")) {
          render();
        }
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // =========================================================================
  // 14. INTERAÇÃO DIRETA NO CANVAS (EDIÇÃO VETOR, PINCEL PIXEL E ÓRBITA 3D)
  // =========================================================================
  function getCanvasLocalCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    return {
      x: (e.clientX - rect.left - w / 2 - camera2D.panX) / camera2D.zoom,
      y: (e.clientY - rect.top - h / 2 - camera2D.panY) / camera2D.zoom,
    };
  }

  function handleCanvasInteractiveDraw(e) {
    const pt = getCanvasLocalCoords(e);

    if (activeArea === "pixel") {
      const pxNode = findLayerNode("l-px-canvas");
      if (pxNode) {
        const cell = pxNode.payload.cellSize || 16;
        const gx = Math.floor(pt.x / cell) * cell;
        const gy = Math.floor(pt.y / cell) * cell;
        const exists = pxNode.payload.strokes.some((s) => s.x === gx && s.y === gy);
        if (!exists) {
          pxNode.payload.strokes.push({ x: gx, y: gy, color: "#22c55e" });
          RoblesBridge.invalidateNode(pxNode.id);
        }
      }
    } else if (activeArea === "vector") {
      const vecNode = findLayerNode("l-vec-path");
      if (vecNode && vecNode.payload?.paths?.[0]) {
        vecNode.payload.paths[0].points.push({
          x: Math.round(pt.x),
          y: Math.round(pt.y),
        });
        RoblesBridge.invalidateNode(vecNode.id);
      }
    }
  }

  if (canvas) {
    canvas.addEventListener("pointerdown", (e) => {
      lastX = e.clientX;
      lastY = e.clientY;

      if (e.button === 1 || e.shiftKey || activeLeftAction === "pan") {
        isPanning = true;
        return;
      }

      if (activeArea === "3d") {
        isDragging = true;
      } else {
        isPaintingOrDrawing = true;
        handleCanvasInteractiveDraw(e);
      }
    });

    window.addEventListener("pointermove", (e) => {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      if (isPanning) {
        if (activeArea === "3d") {
          camera.panX += dx;
          camera.panY += dy;
        } else {
          camera2D.panX += dx;
          camera2D.panY += dy;
        }
        render();
        return;
      }

      if (isDragging && activeArea === "3d") {
        camera.yaw += dx * 0.008;
        camera.pitch = Math.max(-1.4, Math.min(1.4, camera.pitch + dy * 0.008));
        render();
        return;
      }

      if (isPaintingOrDrawing && activeArea === "pixel") {
        handleCanvasInteractiveDraw(e);
      }
    });

    window.addEventListener("pointerup", () => {
      if (isPaintingOrDrawing) {
        recordHistory(activeArea, `Traço editado em ${getAreaMeta(activeArea).label}`);
      }
      isDragging = false;
      isPanning = false;
      isPaintingOrDrawing = false;
    });

    canvas.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        if (activeArea === "3d") {
          camera.zoom = Math.max(12, Math.min(140, camera.zoom - e.deltaY * 0.04));
          measuresByArea["3d"].scale = Math.round((camera.zoom / 42) * 100);
        } else {
          camera2D.zoom = Math.max(0.25, Math.min(4, camera2D.zoom - e.deltaY * 0.001));
        }
        render();
      },
      { passive: false }
    );
  }

  // =========================================================================
  // 15. BARRA LATERAL ESQUERDA E INICIALIZAÇÃO
  // =========================================================================
  if (leftSidebar) {
    const primaryActions = [
      { id: "select", label: "Selecionar", icon: CORE_ICONS.select },
      { id: "pan", label: "Mover Vista", icon: CORE_ICONS.hand },
      { id: "transform", label: "Transformar", icon: CORE_ICONS.vector },
      { id: "align", label: "Alinhar", icon: CORE_ICONS.measures },
      { id: "hierarchy", label: "Hierarquia", icon: CORE_ICONS.layers },
    ];

    leftSidebar.innerHTML = primaryActions
      .map(
        (act) => `
        <button type="button" class="tool-btn ${activeLeftAction === act.id ? "is-active" : ""}" data-left-act="${act.id}" title="${act.label}">
          ${act.icon}
        </button>`
      )
      .join("");

    leftSidebar.querySelectorAll("[data-left-act]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        activeLeftAction = btn.dataset.leftAct;
        leftSidebar.querySelectorAll("[data-left-act]").forEach((b) =>
          b.classList.toggle("is-active", b.dataset.leftAct === activeLeftAction)
        );
        renderRightSidebar();
      });
    });
  }

  window.addEventListener("resize", () => {
    applyLayoutPositions();
    render();
  });

  // Inicialização completa
  ensureBottomLeftBar();
  ensureBottomRightBar();
  ensureBottomDrawer();
  renderTopNav();
  renderRightSidebar();
  applyLayoutPositions();
  RoblesBridge.invalidateAll();
  startAnimationLoop();
})();
