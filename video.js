(() => {
  const studio = window.RoblesStudio;
  if (!studio) return;

  const MOTION_ICONS = {
    select: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4l7.07 17 2.51-7.39L21 11.07z"/></svg>`,
    rect: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>`,
    circle: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8"/></svg>`,
    star: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12 3 14.9 8.9 21.4 9.8 16.7 14.4 17.8 20.9 12 17.8 6.2 20.9 7.3 14.4 2.6 9.8 9.1 8.9"/></svg>`,
    keyframe: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12 3 21 12 12 21 3 12"/></svg>`,
    obj3d: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
    play: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="6 4 20 12 6 20 6 4" fill="currentColor"/></svg>`,
    pause: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`,
    stop: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="6" y="6" width="12" height="12"/></svg>`,
    easing: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 20C10 20 14 4 20 4"/><circle cx="4" cy="20" r="2"/><circle cx="20" cy="4" r="2"/></svg>`,
    rotate: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><polyline points="21 3 21 8 16 8"/></svg>`,
    scaleUp: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`,
    duplicate: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>`,
    trash: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>`,
    exportInline: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  };

  // Ferramentas primárias (esquerda) vinculadas a predefinições (topo central) e secundárias (direita)
  const PRIMARY_VIDEO_TOOLS = [
    {
      id: "select",
      label: "Selecionar",
      icon: MOTION_ICONS.select,
      title: "Selecionar e Animar Objeto (V)",
      defaultSecondary: "rot-plus",
      presets: [
        {
          id: "fc-dissolve",
          label: "Dissolve",
          title: "FilmCraft · Transição Dissolve & Movimento Suave",
          color: "#f59e0b",
          fill: "rgba(245, 158, 11, 0.2)",
          easingIdx: 0,
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><rect width="26" height="18" rx="3" fill="#CEC8B8"/><rect x="4" y="4" width="9" height="10" rx="2" fill="#F59E0B" stroke="#3d2d2d" stroke-width="1.3"/><rect x="12" y="4" width="10" height="10" rx="2" fill="#FBBF24" fill-opacity="0.45" stroke="#3d2d2d" stroke-width="1.3" stroke-dasharray="2 1.5"/></svg>`,
        },
        {
          id: "ec-glow-move",
          label: "Glow Move",
          title: "EffectCraft · Movimento Spring & Brilho",
          color: "#38bdf8",
          fill: "rgba(56, 189, 248, 0.22)",
          easingIdx: 2,
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><rect width="26" height="18" rx="3" fill="#1E293B"/><path d="M4 13C9 4 15 14 22 5" stroke="#38BDF8" stroke-width="1.8" stroke-linecap="round"/><circle cx="22" cy="5" r="2.3" fill="#FBBF24"/></svg>`,
        },
        {
          id: "fc-whip-trans",
          label: "Whip Trans",
          title: "FilmCraft · Transição Rápida Linear",
          color: "#f43f5e",
          fill: "rgba(244, 63, 94, 0.2)",
          easingIdx: 1,
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><rect width="26" height="18" rx="3" fill="#27171C"/><path d="M4 13L15 5M10 13L21 5" stroke="#FB7185" stroke-width="1.7" stroke-linecap="round"/></svg>`,
        },
      ],
      secondary: [
        { id: "rot-plus", label: "Girar +45°", icon: MOTION_ICONS.rotate },
        { id: "scale-plus", label: "Escala +", icon: MOTION_ICONS.scaleUp },
        { id: "easing", label: "Curva (Ease/Linear/Spring)", icon: MOTION_ICONS.easing },
        { id: "duplicate", label: "Duplicar Camada", icon: MOTION_ICONS.duplicate },
      ],
    },
    {
      id: "add-rect",
      label: "Caixa",
      icon: MOTION_ICONS.rect,
      title: "Adicionar Retângulo Animável",
      defaultSecondary: "scale-plus",
      presets: [
        {
          id: "ec-card-trans",
          label: "Card Wipe",
          title: "EffectCraft · Transição de Card Âmbar",
          kind: "rect",
          color: "#f59e0b",
          fill: "rgba(245, 158, 11, 0.22)",
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><rect width="26" height="18" rx="3" fill="#CEC8B8"/><rect x="6" y="4" width="14" height="10" rx="2" fill="#F59E0B" stroke="#3d2d2d" stroke-width="1.4"/></svg>`,
        },
        {
          id: "fc-frame-slide",
          label: "Slide Frame",
          title: "FilmCraft · Deslize de Moldura",
          kind: "rect",
          color: "#a78bfa",
          fill: "rgba(167, 139, 250, 0.2)",
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><rect width="26" height="18" rx="3" fill="#1E1833"/><rect x="5" y="3.5" width="16" height="11" rx="2" stroke="#C4B5FD" stroke-width="1.4"/><path d="M8 9H18" stroke="#F59E0B" stroke-width="1.4"/></svg>`,
        },
      ],
      secondary: [
        { id: "scale-plus", label: "Escala +", icon: MOTION_ICONS.scaleUp },
        { id: "rot-plus", label: "Girar +45°", icon: MOTION_ICONS.rotate },
        { id: "delete", label: "Remover Camada", icon: MOTION_ICONS.trash },
      ],
    },
    {
      id: "add-circle",
      label: "Círculo",
      icon: MOTION_ICONS.circle,
      title: "Adicionar Círculo Animável",
      defaultSecondary: "scale-plus",
      presets: [
        {
          id: "ec-iris-pulse",
          label: "Iris Pulse",
          title: "EffectCraft · Pulso Circular & Brilho",
          kind: "circle",
          color: "#38bdf8",
          fill: "rgba(56, 189, 248, 0.22)",
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><rect width="26" height="18" rx="3" fill="#0F172A"/><circle cx="13" cy="9" r="5.5" fill="#38BDF8" fill-opacity="0.35" stroke="#38BDF8" stroke-width="1.4"/><circle cx="13" cy="9" r="2" fill="#E0F2FE"/></svg>`,
        },
        {
          id: "fc-lens-zoom",
          label: "Lens Zoom",
          title: "FilmCraft · Zoom Óptico de Lente",
          kind: "circle",
          color: "#fbbf24",
          fill: "rgba(251, 191, 36, 0.18)",
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><rect width="26" height="18" rx="3" fill="#CEC8B8"/><circle cx="13" cy="9" r="5.5" stroke="#3d2d2d" stroke-width="1.5" stroke-dasharray="3 2"/></svg>`,
        },
      ],
      secondary: [
        { id: "scale-plus", label: "Escala +", icon: MOTION_ICONS.scaleUp },
        { id: "duplicate", label: "Duplicar", icon: MOTION_ICONS.duplicate },
        { id: "delete", label: "Remover", icon: MOTION_ICONS.trash },
      ],
    },
    {
      id: "add-star",
      label: "Estrela",
      icon: MOTION_ICONS.star,
      title: "Adicionar Polígono / Estrela",
      defaultSecondary: "rot-plus",
      presets: [
        {
          id: "ec-star-burst",
          label: "Star Burst",
          title: "EffectCraft · Explosão & Rotação",
          kind: "polygon",
          color: "#fbbf24",
          fill: "rgba(251, 191, 36, 0.24)",
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><rect width="26" height="18" rx="3" fill="#27272A"/><polygon points="13,2.5 15.2,6.8 19.8,7.5 16.4,10.8 17.2,15.4 13,13.2 8.8,15.4 9.6,10.8 6.2,7.5 10.8,6.8" fill="#FBBF24" fill-opacity="0.4" stroke="#FBBF24" stroke-width="1.2"/></svg>`,
        },
      ],
      secondary: [
        { id: "rot-plus", label: "Girar +45°", icon: MOTION_ICONS.rotate },
        { id: "scale-plus", label: "Escala +", icon: MOTION_ICONS.scaleUp },
        { id: "delete", label: "Remover", icon: MOTION_ICONS.trash },
      ],
    },
    {
      id: "keyframe",
      label: "Keyframe",
      icon: MOTION_ICONS.keyframe,
      title: "Gravar Keyframe no Tempo Atual (K)",
      defaultSecondary: "play-toggle",
      presets: [
        {
          id: "fc-key-curve",
          label: "Ease Motion",
          title: "FilmCraft · Curva de Movimento Suave",
          color: "#f59e0b",
          fill: "rgba(245, 158, 11, 0.2)",
          easingIdx: 0,
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><rect width="26" height="18" rx="3" fill="#CEC8B8"/><path d="M4 14C10 14 16 4 22 4" stroke="#3d2d2d" stroke-width="1.6" stroke-linecap="round"/><polygon points="13,5 16,9 13,13 10,9" fill="#F59E0B" stroke="#3d2d2d" stroke-width="1"/></svg>`,
        },
        {
          id: "ec-key-bounce",
          label: "Spring Motion",
          title: "EffectCraft · Movimento com Rebote",
          color: "#34d399",
          fill: "rgba(52, 211, 153, 0.2)",
          easingIdx: 2,
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><rect width="26" height="18" rx="3" fill="#0D1F1A"/><path d="M4 12C8 4 12 14 16 5L22 9" stroke="#34D399" stroke-width="1.6" stroke-linecap="round"/></svg>`,
        },
      ],
      secondary: [
        { id: "play-toggle", label: "Play / Pause", icon: MOTION_ICONS.play },
        { id: "stop-reset", label: "Voltar ao Início", icon: MOTION_ICONS.stop },
        { id: "easing", label: "Curva de Animação", icon: MOTION_ICONS.easing },
      ],
    },
    {
      id: "obj3d",
      label: ".OBJ 3D",
      icon: MOTION_ICONS.obj3d,
      title: "Animar .OBJ 3D na Timeline (estilo Blender)",
      defaultSecondary: "obj-next-mesh",
      presets: [
        {
          id: "obj-turn",
          label: "Turntable",
          title: ".OBJ 3D · Giro Orbital na Timeline",
          objMode: "turntable",
          color: "#f59e0b",
          fill: "rgba(245, 158, 11, 0.16)",
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><rect width="26" height="18" rx="3" fill="#18181B"/><polygon points="13,2.5 19,5.8 19,12.2 13,15.5 7,12.2 7,5.8" fill="#F59E0B" fill-opacity="0.25" stroke="#F59E0B" stroke-width="1.3"/></svg>`,
        },
        {
          id: "obj-float",
          label: "Levitação",
          title: ".OBJ 3D · Flutuação na Timeline",
          objMode: "float",
          color: "#60a5fa",
          fill: "rgba(96, 165, 250, 0.16)",
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><rect width="26" height="18" rx="3" fill="#0F172A"/><polygon points="13,2 18.5,5 18.5,11 13,14 7.5,11 7.5,5" fill="#60A5FA" fill-opacity="0.25" stroke="#60A5FA" stroke-width="1.3"/></svg>`,
        },
      ],
      secondary: [
        { id: "obj-next-mesh", label: "Alternar .OBJ", icon: MOTION_ICONS.obj3d },
        { id: "play-toggle", label: "Play / Pause", icon: MOTION_ICONS.play },
        { id: "rot-plus", label: "Girar +45°", icon: MOTION_ICONS.rotate },
      ],
    },
  ];

  const OBJ_SAMPLES = [
    {
      name: "Frasco_Apothecary.obj",
      vertices: [
        [-0.9, -1.1, -0.6], [0.9, -1.1, -0.6], [0.9, 0.7, -0.6], [-0.9, 0.7, -0.6],
        [-0.9, -1.1, 0.6], [0.9, -1.1, 0.6], [0.9, 0.7, 0.6], [-0.9, 0.7, 0.6],
        [-0.4, 0.7, -0.3], [0.4, 0.7, -0.3], [0.4, 1.2, -0.3], [-0.4, 1.2, -0.3],
        [-0.4, 0.7, 0.3], [0.4, 0.7, 0.3], [0.4, 1.2, 0.3], [-0.4, 1.2, 0.3],
      ],
      edges: [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7],
        [8, 9], [9, 10], [10, 11], [11, 8],
        [12, 13], [13, 14], [14, 15], [15, 12],
        [8, 12], [9, 13], [10, 14], [11, 15],
      ],
    },
    {
      name: "Embalagem_Sabao.obj",
      vertices: [
        [-1.1, -1.3, -0.35], [1.1, -1.3, -0.35], [1.1, 1.3, -0.35], [-1.1, 1.3, -0.35],
        [-1.1, -1.3, 0.35], [1.1, -1.3, 0.35], [1.1, 1.3, 0.35], [-1.1, 1.3, 0.35],
      ],
      edges: [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7],
      ],
    },
  ];

  const EASINGS = ["ease-in-out", "linear", "spring"];
  const DURATION = 4.0;
  let currentTime = 0;
  let isPlaying = false;
  let rafId = null;
  let lastTs = 0;

  let activeTool = "select";
  let activeSubmenuMode = "motion"; // "clip" | "motion"
  let easingIdx = 0;
  let autoKey = true;
  let objMeshIdx = 0;
  let objMode = "turntable";
  let isModuleActive = false;
  let barObserver = null;
  let isApplyingBars = false;

  const presetByPrimary = {
    select: "fc-dissolve",
    "add-rect": "ec-card-trans",
    "add-circle": "ec-iris-pulse",
    "add-star": "ec-star-burst",
    keyframe: "fc-key-curve",
    obj3d: "obj-turn",
  };

  const secondaryByPrimary = {
    select: "rot-plus",
    "add-rect": "scale-plus",
    "add-circle": "scale-plus",
    "add-star": "rot-plus",
    keyframe: "play-toggle",
    obj3d: "obj-next-mesh",
  };

  const STAGE_W = 640;
  const STAGE_H = 360;

  let layers = [
    {
      id: "layer-1",
      name: "Emblema",
      kind: "polygon",
      color: "#f59e0b",
      fill: "rgba(245, 158, 11, 0.18)",
      size: 46,
      keyframes: [
        { t: 0.0, x: 180, y: 180, rot: 0, scale: 0.85, opacity: 1 },
        { t: 2.0, x: 460, y: 180, rot: 180, scale: 1.15, opacity: 1 },
        { t: 4.0, x: 180, y: 180, rot: 360, scale: 0.85, opacity: 1 },
      ],
    },
    {
      id: "layer-2",
      name: "Anel",
      kind: "circle",
      color: "#e5e7eb",
      fill: "none",
      size: 64,
      keyframes: [
        { t: 0.0, x: 320, y: 180, rot: 0, scale: 0.7, opacity: 0.45 },
        { t: 2.0, x: 320, y: 180, rot: 0, scale: 1.25, opacity: 0.9 },
        { t: 4.0, x: 320, y: 180, rot: 0, scale: 0.7, opacity: 0.45 },
      ],
    },
  ];

  let selectedLayerIdx = 0;
  let isDraggingObj = false;
  let isDraggingPlayhead = false;
  let dragOffset = { x: 0, y: 0 };

  function getPrimaryConfig() {
    return PRIMARY_VIDEO_TOOLS.find((t) => t.id === activeTool) || PRIMARY_VIDEO_TOOLS[0];
  }

  function getActivePreset() {
    const primary = getPrimaryConfig();
    const chosen = presetByPrimary[primary.id];
    return primary.presets.find((p) => p.id === chosen) || primary.presets[0];
  }

  function easeProgress(p, mode) {
    if (mode === "linear") return p;
    if (mode === "spring") {
      const c4 = (2 * Math.PI) / 3;
      return p === 0 ? 0 : p === 1 ? 1 : Math.pow(2, -8 * p) * Math.sin((p * 8 - 0.75) * c4) + 1;
    }
    return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
  }

  function sampleLayerAt(layer, t) {
    const kfs = [...layer.keyframes].sort((a, b) => a.t - b.t);
    if (!kfs.length) return { x: STAGE_W / 2, y: STAGE_H / 2, rot: 0, scale: 1, opacity: 1 };
    if (t <= kfs[0].t) return { ...kfs[0] };
    if (t >= kfs[kfs.length - 1].t) return { ...kfs[kfs.length - 1] };

    for (let i = 0; i < kfs.length - 1; i++) {
      const a = kfs[i];
      const b = kfs[i + 1];
      if (t >= a.t && t <= b.t) {
        const span = b.t - a.t || 1;
        const raw = (t - a.t) / span;
        const k = easeProgress(raw, EASINGS[easingIdx]);
        return {
          x: a.x + (b.x - a.x) * k,
          y: a.y + (b.y - a.y) * k,
          rot: a.rot + (b.rot - a.rot) * k,
          scale: a.scale + (b.scale - a.scale) * k,
          opacity: a.opacity + (b.opacity - a.opacity) * k,
        };
      }
    }
    return { ...kfs[0] };
  }

  function setLayerKeyframe(layer, t, patch) {
    const snappedT = Number(t.toFixed(2));
    const current = sampleLayerAt(layer, snappedT);
    const nextState = { ...current, ...patch, t: snappedT };
    const idx = layer.keyframes.findIndex((k) => Math.abs(k.t - snappedT) < 0.06);
    if (idx >= 0) {
      layer.keyframes[idx] = nextState;
    } else {
      layer.keyframes.push(nextState);
      layer.keyframes.sort((a, b) => a.t - b.t);
    }
  }

  function addShapeLayer(kind, preset = null) {
    const id = `layer-${Date.now()}`;
    const names = { rect: "Caixa", circle: "Círculo", polygon: "Estrela" };
    const cx = STAGE_W / 2 + (layers.length % 3) * 26 - 26;
    const cy = STAGE_H / 2;
    layers.push({
      id,
      name: `${names[kind] || "Forma"} ${layers.length + 1}`,
      kind,
      color: preset?.color || "#f59e0b",
      fill: preset?.fill || "rgba(245, 158, 11, 0.16)",
      size: 44,
      keyframes: [
        { t: 0, x: cx, y: cy, rot: 0, scale: 1, opacity: 1 },
        { t: DURATION, x: cx, y: cy, rot: 0, scale: 1, opacity: 1 },
      ],
    });
    selectedLayerIdx = layers.length - 1;
    studio.render();
  }

  function nudgeSelectedTransform(patch) {
    const layer = layers[selectedLayerIdx];
    if (!layer) return;
    const cur = sampleLayerAt(layer, currentTime);
    setLayerKeyframe(layer, currentTime, {
      rot: cur.rot + (patch.rot || 0),
      scale: Math.max(0.2, Math.min(3, cur.scale + (patch.scale || 0))),
      opacity: Math.max(0.1, Math.min(1, cur.opacity + (patch.opacity || 0))),
    });
    studio.render();
  }

  function duplicateLayer() {
    const src = layers[selectedLayerIdx];
    if (!src) return;
    layers.push({
      ...src,
      id: `layer-${Date.now()}`,
      name: `${src.name} Cópia`,
      keyframes: src.keyframes.map((k) => ({ ...k, x: k.x + 28, y: k.y + 28 })),
    });
    selectedLayerIdx = layers.length - 1;
    studio.render();
  }

  function deleteLayer() {
    if (selectedLayerIdx < 0 || !layers[selectedLayerIdx]) return;
    layers.splice(selectedLayerIdx, 1);
    selectedLayerIdx = Math.min(layers.length - 1, selectedLayerIdx);
    studio.render();
  }

  function buildShapeMarkup(layer) {
    const s = layer.size;
    const strokeAttr = `stroke="${layer.color}" stroke-width="2" fill="${layer.fill}"`;
    if (layer.kind === "rect") {
      return `<rect x="${-s}" y="${-s}" width="${s * 2}" height="${s * 2}" rx="6" ${strokeAttr} />`;
    }
    if (layer.kind === "circle") {
      return `<circle cx="0" cy="0" r="${s}" ${strokeAttr} />`;
    }
    const pts = [];
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? s : s * 0.48;
      const ang = (Math.PI / 5) * i - Math.PI / 2;
      pts.push(`${(Math.cos(ang) * r).toFixed(1)},${(Math.sin(ang) * r).toFixed(1)}`);
    }
    return `<polygon points="${pts.join(" ")}" ${strokeAttr} />`;
  }

  function generateInlineBundle() {
    const easing = EASINGS[easingIdx] === "spring" ? "cubic-bezier(0.34, 1.56, 0.64, 1)" : EASINGS[easingIdx];

    const svgSmilLayers = layers
      .map((layer) => {
        const kfs = [...layer.keyframes].sort((a, b) => a.t - b.t);
        const keyTimes = kfs.map((k) => (k.t / DURATION).toFixed(3)).join(";");
        const transVals = kfs.map((k) => `${k.x.toFixed(1)} ${k.y.toFixed(1)}`).join(";");
        const rotVals = kfs.map((k) => `${k.rot.toFixed(1)}`).join(";");
        const scaleVals = kfs.map((k) => `${k.scale.toFixed(2)}`).join(";");
        const opVals = kfs.map((k) => `${k.opacity.toFixed(2)}`).join(";");

        return `  <g id="${layer.id}">
    ${buildShapeMarkup(layer)}
    <animateTransform attributeName="transform" type="translate" dur="${DURATION}s" repeatCount="indefinite" keyTimes="${keyTimes}" values="${transVals}" />
    <animateTransform attributeName="transform" additive="sum" type="rotate" dur="${DURATION}s" repeatCount="indefinite" keyTimes="${keyTimes}" values="${rotVals}" />
    <animateTransform attributeName="transform" additive="sum" type="scale" dur="${DURATION}s" repeatCount="indefinite" keyTimes="${keyTimes}" values="${scaleVals}" />
    <animate attributeName="opacity" dur="${DURATION}s" repeatCount="indefinite" keyTimes="${keyTimes}" values="${opVals}" />
  </g>`;
      })
      .join("\n");

    const svgInline = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${STAGE_W} ${STAGE_H}" width="${STAGE_W}" height="${STAGE_H}" style="background:#1c1c1e">\n${svgSmilLayers}\n</svg>`;

    const cssBlocks = layers
      .map((layer) => {
        const kfs = [...layer.keyframes].sort((a, b) => a.t - b.t);
        const frames = kfs
          .map((k) => {
            const pct = ((k.t / DURATION) * 100).toFixed(1);
            return `  ${pct}% { transform: translate(${k.x.toFixed(1)}px, ${k.y.toFixed(1)}px) rotate(${k.rot.toFixed(1)}deg) scale(${k.scale.toFixed(2)}); opacity: ${k.opacity.toFixed(2)}; }`;
          })
          .join("\n");
        return `@keyframes anim-${layer.id} {\n${frames}\n}\n#${layer.id}-css { animation: anim-${layer.id} ${DURATION}s ${easing} infinite; transform-box: fill-box; transform-origin: center; }`;
      })
      .join("\n\n");

    const cssSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${STAGE_W} ${STAGE_H}" width="${STAGE_W}" height="${STAGE_H}" style="background:#1c1c1e">\n  <style>\n${cssBlocks}\n  </style>\n${layers.map((l) => `  <g id="${l.id}-css">${buildShapeMarkup(l)}</g>`).join("\n")}\n</svg>`;

    const jsScripts = layers
      .map((layer) => {
        const kfs = [...layer.keyframes].sort((a, b) => a.t - b.t);
        const frames = kfs.map((k) => ({
          offset: Number((k.t / DURATION).toFixed(3)),
          transform: `translate(${k.x.toFixed(1)}px, ${k.y.toFixed(1)}px) rotate(${k.rot.toFixed(1)}deg) scale(${k.scale.toFixed(2)})`,
          opacity: Number(k.opacity.toFixed(2)),
        }));
        return `document.getElementById("${layer.id}-js").animate(${JSON.stringify(frames)}, { duration: ${DURATION * 1000}, easing: "${easing}", iterations: Infinity });`;
      })
      .join("\n  ");

    const htmlInline = `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><title>Robles Studio — Inline Motion Export</title></head>
<body style="margin:0;background:#111;display:grid;place-items:center;min-height:100vh;color:#eee;font-family:sans-serif;gap:24px;padding:24px;">
  ${svgInline}
  ${cssSvg}
  <svg id="stage-js" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${STAGE_W} ${STAGE_H}" width="${STAGE_W}" height="${STAGE_H}" style="background:#1c1c1e">
${layers.map((l) => `    <g id="${l.id}-js">${buildShapeMarkup(l)}</g>`).join("\n")}
  </svg>
  <script>
  ${jsScripts}
  </script>
</body>
</html>`;

    const blob = new Blob([htmlInline], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "robles-motion-inline.html";
    a.click();
    URL.revokeObjectURL(url);
  }

  function stepPlayback(ts) {
    if (!isPlaying) return;
    if (!lastTs) lastTs = ts;
    const dt = (ts - lastTs) / 1000;
    lastTs = ts;
    currentTime = (currentTime + dt) % DURATION;
    studio.render();
    rafId = requestAnimationFrame(stepPlayback);
  }

  function togglePlay() {
    isPlaying = !isPlaying;
    lastTs = 0;
    if (isPlaying) {
      rafId = requestAnimationFrame(stepPlayback);
    } else if (rafId) {
      cancelAnimationFrame(rafId);
    }
    applyBarsNow();
  }

  function stopPlayback() {
    isPlaying = false;
    lastTs = 0;
    if (rafId) cancelAnimationFrame(rafId);
    currentTime = 0;
    applyBarsNow();
    studio.render();
  }

  function applyPreset(presetId) {
    const primary = getPrimaryConfig();
    const preset = primary.presets.find((p) => p.id === presetId);
    if (!preset) return;

    presetByPrimary[primary.id] = preset.id;
    if (typeof preset.easingIdx === "number") easingIdx = preset.easingIdx;
    if (preset.objMode) objMode = preset.objMode;

    const curLayer = layers[selectedLayerIdx];
    if (curLayer && primary.id === "select") {
      curLayer.color = preset.color;
      curLayer.fill = preset.fill;
    } else if (preset.kind) {
      addShapeLayer(preset.kind, preset);
    }

    studio.recordHistory?.("video", `Vídeo · ${primary.label} (${preset.label})`);
    applyBarsNow();
    studio.render();
  }

  function applyBarsNow() {
    const leftSidebar = document.querySelector(".hud-left");
    const topCenterNav = document.querySelector(".hud-top-center");
    const topRightNav = document.querySelector(".hud-top-right");
    const rightBar = document.querySelector(".hud-right");
    if (!leftSidebar || !topCenterNav || !topRightNav) return;

    isApplyingBars = true;
    try {
      const primary = getPrimaryConfig();
      const activePreset = getActivePreset();
      const activeSecId = secondaryByPrimary[primary.id] || primary.defaultSecondary;

      // 1. Lateral Esquerda: Ferramentas Primárias
      leftSidebar.innerHTML = PRIMARY_VIDEO_TOOLS.map(
        (t) => `
          <button
            type="button"
            class="tool-btn ${activeTool === t.id ? "is-active" : ""}"
            data-mtool="${t.id}"
            title="${t.title}"
          >${t.icon}</button>
        `
      ).join("");

      // 2. Topo Central: Predefinições com prévia SVG + título ao lado (transições, movimento, FX, .OBJ)
      topCenterNav.innerHTML = primary.presets
        .map((p) => {
          const isAct = p.id === activePreset.id;
          return `
            <button
              type="button"
              class="tool-btn ${isAct ? "is-active" : ""}"
              data-vpreset="${p.id}"
              title="${p.title}"
              style="width:auto;height:36px;padding:3px 9px 3px 4px;gap:7px;display:inline-flex;align-items:center;white-space:nowrap;"
            >
              <span style="display:inline-flex;align-items:center;border-radius:5px;overflow:hidden;border:1px solid rgba(255,255,255,0.16);flex-shrink:0;">
                ${p.previewSvg}
              </span>
              <span style="font-size:10.5px;font-weight:700;">${p.label}</span>
            </button>
          `;
        })
        .join("");

      // 3. Topo Direito: Submenu Clipe e Motion + Exportação Inline
      topRightNav.innerHTML = `
        <button
          type="button"
          class="tool-btn ${activeSubmenuMode === "clip" ? "is-active" : ""}"
          data-vsub="clip"
          title="Submenu Clipe"
          style="width:auto;padding:0 9px;font-size:10.5px;font-weight:600;"
        >Clipe</button>
        <button
          type="button"
          class="tool-btn ${activeSubmenuMode === "motion" ? "is-active" : ""}"
          data-vsub="motion"
          title="Submenu Motion"
          style="width:auto;padding:0 9px;font-size:10.5px;font-weight:600;"
        >Motion</button>
        <button type="button" class="tool-btn is-active" data-mop="export-inline" title="Exportar Inline (SVG + CSS + JS)">${MOTION_ICONS.exportInline}</button>
      `;

      // 4. Lateral Direita: Ferramentas Secundárias acompanhando e complementando a Ferramenta Primária
      if (rightBar) {
        rightBar.innerHTML = primary.secondary
          .map((sec) => {
            const isPlay = sec.id === "play-toggle";
            const iconHtml = isPlay ? (isPlaying ? MOTION_ICONS.pause : MOTION_ICONS.play) : sec.icon;
            const isAct = isPlay ? isPlaying : activeSecId === sec.id;
            return `
              <button
                type="button"
                class="tool-btn ${isAct ? "is-active" : ""}"
                data-vsec="${sec.id}"
                title="${sec.label} (${primary.label})"
              >${iconHtml}</button>
            `;
          })
          .join("");

        rightBar.querySelectorAll("[data-vsec]").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const secId = btn.dataset.vsec;
            secondaryByPrimary[primary.id] = secId;
            if (secId === "play-toggle") togglePlay();
            else if (secId === "stop-reset") stopPlayback();
            else if (secId === "rot-plus") nudgeSelectedTransform({ rot: 45 });
            else if (secId === "scale-plus") nudgeSelectedTransform({ scale: 0.15 });
            else if (secId === "easing") {
              easingIdx = (easingIdx + 1) % EASINGS.length;
              studio.render();
            } else if (secId === "duplicate") duplicateLayer();
            else if (secId === "delete") deleteLayer();
            else if (secId === "obj-next-mesh") {
              objMeshIdx = (objMeshIdx + 1) % OBJ_SAMPLES.length;
              studio.render();
            }
            applyBarsNow();
          });
        });
      }

      leftSidebar.querySelectorAll("[data-mtool]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.dataset.mtool;
          if (id === "add-rect") addShapeLayer("rect", getActivePreset());
          else if (id === "add-circle") addShapeLayer("circle", getActivePreset());
          else if (id === "add-star") addShapeLayer("polygon", getActivePreset());
          else if (id === "keyframe") {
            const l = layers[selectedLayerIdx];
            if (l) setLayerKeyframe(l, currentTime, {});
            studio.render();
          }
          activeTool = id;
          applyBarsNow();
          studio.render();
        });
      });

      topCenterNav.querySelectorAll("[data-vpreset]").forEach((btn) => {
        btn.addEventListener("click", () => applyPreset(btn.dataset.vpreset));
      });

      topRightNav.querySelectorAll("[data-vsub]").forEach((btn) => {
        btn.addEventListener("click", () => {
          activeSubmenuMode = btn.dataset.vsub;
          if (activeSubmenuMode === "clip" && !isPlaying) {
            togglePlay();
          }
          studio.recordHistory?.("video", `Submenu Vídeo: ${activeSubmenuMode.toUpperCase()}`);
          applyBarsNow();
          studio.render();
        });
      });

      topRightNav.querySelector('[data-mop="export-inline"]')?.addEventListener("click", generateInlineBundle);
    } finally {
      isApplyingBars = false;
    }
  }

  function startBarGuard() {
    if (barObserver) return;
    const targets = [".hud-top-center", ".hud-right", ".hud-top-right"]
      .map((sel) => document.querySelector(sel))
      .filter(Boolean);
    if (!targets.length) return;

    barObserver = new MutationObserver(() => {
      if (!isModuleActive || isApplyingBars) return;
      const center = document.querySelector(".hud-top-center");
      if (center && !center.querySelector("[data-vpreset]")) {
        applyBarsNow();
      }
    });

    targets.forEach((el) => barObserver.observe(el, { childList: true }));
  }

  function stopBarGuard() {
    if (barObserver) {
      barObserver.disconnect();
      barObserver = null;
    }
  }

  function getLayoutRects(width, height) {
    const tlLeft = 80;
    const tlW = Math.max(260, width - 160);
    const tlH = 112;
    const tlTop = height - tlH - 20;

    const topSafe = 68;
    const availH = Math.max(160, tlTop - topSafe - 20);
    const scale = Math.min(1, (width - 220) / STAGE_W, availH / STAGE_H);
    const stW = Math.round(STAGE_W * scale);
    const stH = Math.round(STAGE_H * scale);
    const stLeft = Math.floor((width - stW) / 2);
    const stTop = Math.floor(topSafe + (availH - stH) / 2);

    return {
      stage: { left: stLeft, top: stTop, w: stW, h: stH, scale },
      timeline: { left: tlLeft, top: tlTop, w: tlW, h: tlH },
    };
  }

  function drawLayerOnCanvas(ctx, layer, st) {
    ctx.save();
    ctx.translate(st.x, st.y);
    ctx.rotate((st.rot * Math.PI) / 180);
    ctx.scale(st.scale, st.scale);
    ctx.globalAlpha = st.opacity;

    const s = layer.size;
    ctx.strokeStyle = layer.color;
    ctx.fillStyle = layer.fill;
    ctx.lineWidth = 2;

    ctx.beginPath();
    if (layer.kind === "rect") {
      ctx.roundRect(-s, -s, s * 2, s * 2, 6);
    } else if (layer.kind === "circle") {
      ctx.arc(0, 0, s, 0, Math.PI * 2);
    } else {
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? s : s * 0.48;
        const ang = (Math.PI / 5) * i - Math.PI / 2;
        const px = Math.cos(ang) * r;
        const py = Math.sin(ang) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    }

    if (layer.fill !== "none") ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function drawObjOverlayOnStage(ctx) {
    const mesh = OBJ_SAMPLES[objMeshIdx] || OBJ_SAMPLES[0];
    const progress = currentTime / DURATION;
    const rotY = progress * Math.PI * 2;
    const rotX = 0.35;
    const bobY = objMode === "float" ? Math.sin(progress * Math.PI * 2) * 0.18 : 0;
    const sc = objMode === "float" ? 1 + Math.sin(progress * Math.PI * 2) * 0.08 : 1;

    const cx = STAGE_W - 86;
    const cy = 78;
    const rad = 28 * sc;

    const pts = mesh.vertices.map(([vx, vy, vz]) => {
      const x1 = vx * Math.cos(rotY) - vz * Math.sin(rotY);
      const z1 = vx * Math.sin(rotY) + vz * Math.cos(rotY);
      const y2 = (vy + bobY) * Math.cos(rotX) - z1 * Math.sin(rotX);
      const z2 = (vy + bobY) * Math.sin(rotX) + z1 * Math.cos(rotX);
      const p = 3.6 / (3.6 + z2);
      return { x: cx + x1 * rad * p, y: cy - y2 * rad * p };
    });

    ctx.save();
    ctx.fillStyle = "rgba(18, 18, 22, 0.72)";
    ctx.strokeStyle = "rgba(245, 158, 11, 0.45)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(cx - 46, cy - 42, 92, 84, 8);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 1.3;
    mesh.edges.forEach(([a, b]) => {
      ctx.beginPath();
      ctx.moveTo(pts[a].x, pts[a].y);
      ctx.lineTo(pts[b].x, pts[b].y);
      ctx.stroke();
    });

    ctx.fillStyle = "rgba(216,216,220,0.7)";
    ctx.font = "9px monospace";
    ctx.fillText(mesh.name.replace(".obj", ""), cx - 40, cy + 36);
    ctx.restore();
  }

  studio.registerModule("video", {
    onActivate() {
      isModuleActive = true;
      applyBarsNow();
      startBarGuard();
    },

    renderBars() {
      isModuleActive = true;
      applyBarsNow();
      startBarGuard();
    },

    onDeactivate() {
      isModuleActive = false;
      stopBarGuard();
      isPlaying = false;
      lastTs = 0;
      if (rafId) cancelAnimationFrame(rafId);
      isDraggingObj = false;
      isDraggingPlayhead = false;
    },

    render(ctx, width, height) {
      const { stage, timeline } = getLayoutRects(width, height);

      ctx.save();
      ctx.fillStyle = "rgba(255, 255, 255, 0.025)";
      ctx.fillRect(stage.left, stage.top, stage.w, stage.h);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
      ctx.lineWidth = 1;
      ctx.strokeRect(stage.left, stage.top, stage.w, stage.h);

      ctx.save();
      ctx.beginPath();
      ctx.rect(stage.left, stage.top, stage.w, stage.h);
      ctx.clip();
      ctx.translate(stage.left, stage.top);
      ctx.scale(stage.scale, stage.scale);

      layers.forEach((layer, idx) => {
        if (layer.keyframes.length >= 2) {
          ctx.save();
          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = idx === selectedLayerIdx ? "rgba(245, 158, 11, 0.45)" : "rgba(255, 255, 255, 0.12)";
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          layer.keyframes.forEach((k, i) => {
            if (i === 0) ctx.moveTo(k.x, k.y);
            else ctx.lineTo(k.x, k.y);
          });
          ctx.stroke();
          ctx.restore();
        }

        const st = sampleLayerAt(layer, currentTime);
        drawLayerOnCanvas(ctx, layer, st);

        if (idx === selectedLayerIdx) {
          ctx.save();
          ctx.translate(st.x, st.y);
          ctx.setLineDash([3, 3]);
          ctx.strokeStyle = "#fbbf24";
          ctx.lineWidth = 1;
          const box = layer.size * st.scale + 8;
          ctx.strokeRect(-box, -box, box * 2, box * 2);
          ctx.restore();
        }
      });

      if (activeTool === "obj3d" || activeSubmenuMode === "clip") {
        drawObjOverlayOnStage(ctx);
      }

      ctx.restore();

      ctx.fillStyle = "rgba(216, 216, 220, 0.65)";
      ctx.font = "500 11px ui-monospace, SFMono-Regular, monospace";
      ctx.fillText(
        `${activeSubmenuMode.toUpperCase()} · ${currentTime.toFixed(2)}s / ${DURATION.toFixed(1)}s · ${EASINGS[easingIdx]}`,
        stage.left + 10,
        stage.top + 18
      );
      ctx.restore();

      ctx.save();
      ctx.fillStyle = "rgba(30, 30, 34, 0.9)";
      ctx.fillRect(timeline.left, timeline.top, timeline.w, timeline.h);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      ctx.strokeRect(timeline.left, timeline.top, timeline.w, timeline.h);

      const labelColW = 110;
      const trackLeft = timeline.left + labelColW;
      const trackW = Math.max(120, timeline.w - labelColW - 14);

      for (let s = 0; s <= DURATION; s += 0.5) {
        const tx = trackLeft + (s / DURATION) * trackW;
        const isSec = Number.isInteger(s);
        ctx.strokeStyle = isSec ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)";
        ctx.beginPath();
        ctx.moveTo(tx, timeline.top + (isSec ? 12 : 17));
        ctx.lineTo(tx, timeline.top + 24);
        ctx.stroke();
        if (isSec) {
          ctx.fillStyle = "rgba(216, 216, 220, 0.6)";
          ctx.font = "500 10px ui-monospace, SFMono-Regular, monospace";
          ctx.fillText(`${s}s`, tx + 3, timeline.top + 11);
        }
      }

      layers.forEach((layer, idx) => {
        const rowY = timeline.top + 38 + idx * 24;
        if (rowY > timeline.top + timeline.h - 10) return;
        const isSel = idx === selectedLayerIdx;

        ctx.fillStyle = isSel ? "#fbbf24" : "rgba(216, 216, 220, 0.72)";
        ctx.font = "600 11px -apple-system, BlinkMacSystemFont, sans-serif";
        ctx.fillText(layer.name, timeline.left + 12, rowY + 4);

        ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
        ctx.beginPath();
        ctx.moveTo(trackLeft, rowY);
        ctx.lineTo(trackLeft + trackW, rowY);
        ctx.stroke();

        layer.keyframes.forEach((kf) => {
          const kx = trackLeft + (kf.t / DURATION) * trackW;
          ctx.fillStyle = isSel ? "#f59e0b" : "#9ca3af";
          ctx.beginPath();
          ctx.moveTo(kx, rowY - 5);
          ctx.lineTo(kx + 5, rowY);
          ctx.lineTo(kx, rowY + 5);
          ctx.lineTo(kx - 5, rowY);
          ctx.closePath();
          ctx.fill();
        });
      });

      const px = trackLeft + (currentTime / DURATION) * trackW;
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(px, timeline.top);
      ctx.lineTo(px, timeline.top + timeline.h);
      ctx.stroke();

      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.moveTo(px - 5, timeline.top);
      ctx.lineTo(px + 5, timeline.top);
      ctx.lineTo(px, timeline.top + 8);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    },

    onMouseDown(x, y) {
      const { width, height } = studio.getCanvasSize();
      const { stage, timeline } = getLayoutRects(width, height);
      const labelColW = 110;
      const trackLeft = timeline.left + labelColW;
      const trackW = Math.max(120, timeline.w - labelColW - 14);

      if (x >= timeline.left && x <= timeline.left + timeline.w && y >= timeline.top && y <= timeline.top + timeline.h) {
        const rowIdx = Math.floor((y - (timeline.top + 26)) / 24);
        if (rowIdx >= 0 && rowIdx < layers.length) {
          selectedLayerIdx = rowIdx;
        }
        if (x >= trackLeft) {
          currentTime = Math.max(0, Math.min(DURATION, ((x - trackLeft) / trackW) * DURATION));
          isDraggingPlayhead = true;
        }
        studio.render();
        return;
      }

      if (x >= stage.left && x <= stage.left + stage.w && y >= stage.top && y <= stage.top + stage.h) {
        const sx = (x - stage.left) / stage.scale;
        const sy = (y - stage.top) / stage.scale;
        for (let i = layers.length - 1; i >= 0; i--) {
          const st = sampleLayerAt(layers[i], currentTime);
          if (Math.hypot(sx - st.x, sy - st.y) <= layers[i].size * st.scale + 12) {
            selectedLayerIdx = i;
            isDraggingObj = true;
            dragOffset = { x: sx - st.x, y: sy - st.y };
            studio.render();
            return;
          }
        }
      }
    },

    onMouseMove(x, y) {
      const { width, height } = studio.getCanvasSize();
      const { stage, timeline } = getLayoutRects(width, height);
      const labelColW = 110;
      const trackLeft = timeline.left + labelColW;
      const trackW = Math.max(120, timeline.w - labelColW - 14);

      if (isDraggingPlayhead) {
        currentTime = Math.max(0, Math.min(DURATION, ((x - trackLeft) / trackW) * DURATION));
        studio.render();
        return;
      }

      if (isDraggingObj && selectedLayerIdx >= 0 && layers[selectedLayerIdx]) {
        const sx = (x - stage.left) / stage.scale - dragOffset.x;
        const sy = (y - stage.top) / stage.scale - dragOffset.y;
        if (autoKey) {
          setLayerKeyframe(layers[selectedLayerIdx], currentTime, { x: sx, y: sy });
        }
        studio.render();
      }
    },

    onMouseUp() {
      isDraggingObj = false;
      isDraggingPlayhead = false;
    },
  });
})();