(() => {
  const ICONS = {
    vector: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><circle cx="11" cy="11" r="2"/></svg>`,
    pixel: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="6" height="6"/><rect x="15" y="3" width="6" height="6"/><rect x="9" y="9" width="6" height="6"/><rect x="3" y="15" width="6" height="6"/><rect x="15" y="15" width="6" height="6"/></svg>`,
    video: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><polygon points="10 9 16 12 10 15 10 9" fill="currentColor"/></svg>`,
    cube3d: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
    hand: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 11V6a2 2 0 0 0-4 0v4"/><path d="M14 10V4a2 2 0 0 0-4 0v6"/><path d="M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>`,
    select: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4l7.07 17 2.51-7.39L21 11.07z"/></svg>`,
    layers: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
    measures: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 6H3M21 18H3M6 6v12M18 6v12"/><path d="M9 12h6"/></svg>`,
    historyTab: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/></svg>`,
    eye: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
    eyeOff: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-6.4 0-10-7-10-7a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 5c6.4 0 10 7 10 7a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`,
    trash: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>`,
    plus: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    save: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`,
    gear: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    exportIcon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
    bridge: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>`,
  };

  const AREAS = [
    { id: "vector", label: "Vetor", unit: "px", icon: ICONS.vector, title: "Área de Vetor" },
    { id: "pixel", label: "Pixel", unit: "cel", icon: ICONS.pixel, title: "Área de Pixel" },
    { id: "video", label: "Vídeo", unit: "px", icon: ICONS.video, title: "Área de Vídeo" },
    { id: "3d", label: "3D", unit: "u", icon: ICONS.cube3d, title: "Área 3D" },
  ];

  const PRESETS_BY_AREA = {
    vector: ["Traço Limpo", "Curva Bezier", "Grade Vetor"],
    pixel: ["Pixel 1px", "Dither Suave", "Grade Cel"],
    video: ["1080p 30fps", "4K 60fps", "Corte Rápido"],
    "3d": ["Paramétrico", "Escultura", "Hard Surface"],
  };

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
      dirty: true,
      cacheCanvas: createCacheCanvas(512, 512),
      payload: {},
      ...raw,
    };

    if (!node.payload || Object.keys(node.payload).length === 0) {
      if (node.area === "vector") {
        node.payload = {
          paths: [{
            closed: true,
            fill: "rgba(56, 189, 248, 0.25)",
            stroke: "#38bdf8",
            strokeWidth: 3,
            points: [
              { x: -110, y: -70 }, { x: 110, y: -70 }, { x: 140, y: 0 },
              { x: 110, y: 70 }, { x: -110, y: 70 }, { x: -140, y: 0 },
            ],
          }],
        };
      } else if (node.area === "pixel") {
        node.payload = {
          cellSize: 16,
          strokes: [
            { x: -64, y: -32, color: "#22c55e" }, { x: -48, y: -32, color: "#22c55e" },
            { x: -32, y: -16, color: "#eab308" }, { x: -16, y: 0, color: "#eab308" },
            { x: 0, y: 16, color: "#22c55e" }, { x: 16, y: 16, color: "#22c55e" },
          ],
        };
      } else if (node.area === "video") {
        node.payload = { duration: 10, fps: 30, playing: true, videoEl: null };
      } else if (node.area === "3d") {
        node.payload = { shape: "box", dimensions: { w: 4.0, h: 2.2, d: 3.0 }, color: "#f59e0b", textureLayerId: "l-vec-path" };
      }
    }

    if (Array.isArray(node.children)) node.children = node.children.map(hydrateSceneNode);
    if (Array.isArray(node.sublayers)) node.sublayers = node.sublayers.map(hydrateSceneNode);
    return node;
  }

  const state = {
    activeArea: "3d",
    activePreset: "Paramétrico",
    activeLeftAction: "transform",
    activeSecondaryAction: "tf-move",
    activeBottomDrawer: null,
    activeHistoryTab: "3d",
    selectedLayerId: "l-param-base",
    historyEntries: [],
    settings: { showGrid: true, snapEnabled: true, exportScale: 1, liveSync2Dto3D: true },
    timeline: { currentTime: 0, fps: 30, playing: true, lastTick: performance.now() },
    defaultCamera: { yaw: -0.62, pitch: 0.48, zoom: 42, panX: 0, panY: 0 },
    camera: { yaw: -0.62, pitch: 0.48, zoom: 42, panX: 0, panY: 0 },
    camera2D: { zoom: 1, panX: 0, panY: 0 },
    measuresByArea: {
      vector: { scale: 100, offsetX: 0, offsetY: 0, rotation: 0 },
      pixel: { scale: 100, offsetX: 0, offsetY: 0, rotation: 0 },
      video: { scale: 100, offsetX: 0, offsetY: 0, rotation: 0 },
      "3d": { scale: 100, offsetX: 0, offsetY: 0, rotation: 0 },
    },
    layersTree: [
      {
        id: "grp-3d", name: "3D · Modelo Principal", meta: "3 Layers", kind: "group", area: "3d",
        expanded: true, visible: true, swatch: "linear-gradient(135deg,#f59e0b,#ef4444)",
        children: [
          {
            id: "l-param-base", name: "Cubo Paramétrico", meta: "Textura: Vetor Vivo", kind: "item", area: "3d",
            visible: true, swatch: "linear-gradient(135deg,#f59e0b,#d97706)",
            payload: { shape: "box", dimensions: { w: 4.0, h: 2.2, d: 3.0 }, color: "#f59e0b", textureLayerId: "l-vec-path" },
          },
          {
            id: "l-sculpt-mesh", name: "Volume Escultura", meta: "Malha Orgânica", kind: "item", area: "3d",
            visible: true, swatch: "linear-gradient(135deg,#fb923c,#f59e0b)",
            payload: { shape: "prism", dimensions: { w: 2.2, h: 2.8, d: 2.2 }, color: "#fb923c", textureLayerId: "l-px-canvas" },
          },
          {
            id: "l-hard-part", name: "Peça Hard Surface", meta: "Chanfro & Encaixe", kind: "item", area: "3d",
            visible: true, swatch: "linear-gradient(135deg,#60a5fa,#3b82f6)",
            payload: { shape: "plate", dimensions: { w: 4.6, h: 0.45, d: 3.6 }, color: "#3b82f6", textureLayerId: null },
          },
        ],
      },
      {
        id: "grp-2d", name: "Vetor, Pixel & Vídeo", meta: "3 Layers", kind: "group", area: "vector",
        expanded: true, visible: true, swatch: "linear-gradient(135deg,#ec4899,#6366f1)",
        children: [
          { id: "l-vec-path", name: "Traçado Vetorial", meta: "Curvas Editáveis", kind: "item", area: "vector", visible: true, swatch: "linear-gradient(135deg,#38bdf8,#818cf8)" },
          { id: "l-px-canvas", name: "Grade de Pixels", meta: "64 × 40 cel", kind: "item", area: "pixel", visible: true, swatch: "linear-gradient(135deg,#22c55e,#eab308)" },
          { id: "l-video-track", name: "Faixa de Vídeo", meta: "1920 × 1080 · 30fps", kind: "item", area: "video", visible: true, swatch: "linear-gradient(135deg,#ef4444,#f97316)" },
        ],
      },
    ].map(hydrateSceneNode),
  };

  const modules = {};
  const listeners = new Map();

  const RoblesCore = {
    ICONS,
    AREAS,
    PRESETS_BY_AREA,
    state,
    modules,
    hydrateSceneNode,

    registerModule(areaId, moduleApi) {
      modules[areaId] = moduleApi;
      this.invalidateAll();
    },

    on(event, fn) {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event).add(fn);
      return () => listeners.get(event)?.delete(fn);
    },

    emit(event, payload) {
      listeners.get(event)?.forEach((fn) => fn(payload));
    },

    isMobile() {
      return window.innerWidth <= 768;
    },

    getAreaMeta(id = state.activeArea) {
      return AREAS.find((a) => a.id === id) || AREAS[3];
    },

    findLayer(id, list = state.layersTree) {
      for (const node of list) {
        if (node.id === id) return node;
        if (node.children) {
          const f = this.findLayer(id, node.children);
          if (f) return f;
        }
        if (node.sublayers) {
          const fs = this.findLayer(id, node.sublayers);
          if (fs) return fs;
        }
      }
      return null;
    },

    deleteLayer(id, list = state.layersTree) {
      for (let i = list.length - 1; i >= 0; i--) {
        if (list[i].id === id) { list.splice(i, 1); return true; }
        if (list[i].children && this.deleteLayer(id, list[i].children)) return true;
        if (list[i].sublayers && this.deleteLayer(id, list[i].sublayers)) return true;
      }
      return false;
    },

    walkLayers(fn, list = state.layersTree) {
      for (const node of list) {
        fn(node);
        if (node.children) this.walkLayers(fn, node.children);
        if (node.sublayers) this.walkLayers(fn, node.sublayers);
      }
    },

    invalidateNode(id) {
      const node = this.findLayer(id);
      if (!node) return;
      node.dirty = true;
      this.emit("render:request");
    },

    invalidateAll() {
      this.walkLayers((n) => { n.dirty = true; });
      this.emit("render:request");
    },

    recordHistory(areaOrTab, label) {
      const tab = areaOrTab === "pixel" ? "sketch" : areaOrTab;
      const time = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      state.historyEntries.unshift({ id: `${Date.now()}`, tab, label, time });
      if (state.historyEntries.length > 80) state.historyEntries.length = 80;
      this.emit("ui:update");
    },

    setActiveArea(nextArea) {
      if (!AREAS.some((a) => a.id === nextArea)) return;
      state.activeArea = nextArea;
      state.activeHistoryTab = nextArea === "pixel" ? "sketch" : nextArea;
      state.activePreset = (PRESETS_BY_AREA[nextArea] || PRESETS_BY_AREA["3d"])[0];

      if (nextArea === "3d") {
        state.selectedLayerId = "l-param-base";
      } else {
        const map = { pixel: "l-px-canvas", video: "l-video-track", vector: "l-vec-path" };
        state.selectedLayerId = map[nextArea] || "l-vec-path";
      }

      this.invalidateAll();
      this.emit("area:changed", nextArea);
      this.emit("ui:update");
    },

    setPreset(preset) {
      state.activePreset = preset;
      this.recordHistory(state.activeArea, `Preset · ${preset}`);
      this.emit("ui:update");
      this.emit("render:request");
    },

    bindTextureTo3D(sourceId, target3DId = "l-param-base") {
      const target = this.findLayer(target3DId);
      const source = this.findLayer(sourceId);
      if (!target || !source) return;
      target.payload.textureLayerId = source.id;
      target.meta = `Textura: ${source.name}`;
      this.recordHistory("3d", `Textura 3D: ${source.name} → ${target.name}`);
      this.emit("render:request");
    },

    convertNode(id, targetArea) {
      const node = this.findLayer(id);
      if (!node) return;

      if (node.area === "vector" && targetArea === "3d") {
        const grp3d = this.findLayer("grp-3d");
        const new3D = hydrateSceneNode({
          id: `3d-ext-${Date.now().toString(36)}`,
          name: `Extrusão · ${node.name}`,
          meta: "Extrudado do Vetor",
          kind: "item",
          area: "3d",
          visible: true,
          swatch: "linear-gradient(135deg,#38bdf8,#f59e0b)",
          payload: { shape: "extruded", dimensions: { w: 3.2, h: 1.4, d: 2.4 }, textureLayerId: node.id },
        });
        grp3d.children.unshift(new3D);
        grp3d.meta = `${grp3d.children.length} Layers`;
        this.recordHistory("3d", `Extrusão 2D→3D: ${node.name}`);
        this.setActiveArea("3d");
        state.selectedLayerId = new3D.id;
      } else if (node.area === "3d" && targetArea === "vector") {
        const grp2d = this.findLayer("grp-2d");
        const newVec = hydrateSceneNode({
          id: `vec-proj-${Date.now().toString(36)}`,
          name: `Projeção · ${node.name}`,
          meta: "Vetor extraído do 3D",
          kind: "item",
          area: "vector",
          visible: true,
          swatch: "linear-gradient(135deg,#f59e0b,#38bdf8)",
        });
        grp2d.children.unshift(newVec);
        grp2d.meta = `${grp2d.children.length} Layers`;
        this.recordHistory("vector", `Projeção 3D→Vetor: ${node.name}`);
        this.setActiveArea("vector");
        state.selectedLayerId = newVec.id;
      } else if (node.area === "vector" && targetArea === "pixel") {
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
        this.recordHistory("pixel", `Subcamada Pixel em ${node.name}`);
        this.emit("render:request");
      } else if (node.area === "pixel" && targetArea === "vector") {
        const grp2d = this.findLayer("grp-2d");
        const vectorized = hydrateSceneNode({
          id: `vec-trace-${Date.now().toString(36)}`,
          name: `Traçado · ${node.name}`,
          meta: "Vetorizado de Pixel",
          kind: "item",
          area: "vector",
          visible: true,
          swatch: "linear-gradient(135deg,#22c55e,#818cf8)",
        });
        grp2d.children.unshift(vectorized);
        grp2d.meta = `${grp2d.children.length} Layers`;
        this.recordHistory("vector", `Vetorizado Pixel→Vetor: ${node.name}`);
        this.setActiveArea("vector");
        state.selectedLayerId = vectorized.id;
      }
    },
  };

  window.RoblesCore = RoblesCore;
})();
