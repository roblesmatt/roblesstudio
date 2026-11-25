(() => {
  const CORE = () => window.RoblesCore || window.RoblesStudio || null;

  // 3 Sub-Personas no canto superior direito quando "Vetor" está ativo
  const VECTOR_SUBMODES = [
    {
      id: "normal",
      label: "Normal · Prancheta Vetorial",
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><circle cx="11" cy="11" r="2"/></svg>`,
    },
    {
      id: "typography",
      label: "Tipografia · Estúdio de Fontes (Affont)",
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 6h14M12 6v13M8 19h8"/><line x1="3" y1="10" x2="21" y2="10" stroke-dasharray="2 2" opacity="0.6"/></svg>`,
    },
    {
      id: "layout",
      label: "Layout · Diagramação & Páginas",
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="3" width="16" height="18" rx="1.5"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="4" y1="9" x2="20" y2="9"/></svg>`,
    },
  ];

  // Catálogo de ferramentas separado por Sub-Modo (Normal, Tipografia, Layout)
  const TOOL_FAMILIES_BY_SUBMODE = {
    normal: [
      {
        id: "selectGroup",
        label: "Seleção",
        variants: [
          {
            id: "move",
            label: "Ferramenta Mover (V)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 3l14 9-6.5 1.5L10 20z"/></svg>`,
          },
          {
            id: "selectNext",
            label: "Alternar Objeto",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="11" height="11" rx="1.5"/><rect x="10" y="10" width="11" height="11" rx="1.5" fill="currentColor" fill-opacity="0.15"/></svg>`,
          },
          {
            id: "duplicate",
            label: "Duplicar Objeto",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>`,
          },
          {
            id: "deleteObj",
            label: "Excluir Objeto",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>`,
          },
        ],
      },
      {
        id: "nodeGroup",
        label: "Nós & Cantos",
        variants: [
          {
            id: "node",
            label: "Ferramenta Nó (A)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 4l12 7-5.5 1.5L9 18z"/><rect x="15" y="15" width="5" height="5"/></svg>`,
          },
          {
            id: "corner",
            label: "Arredondar Canto (C)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 20V10a6 6 0 0 1 6-6h10"/><circle cx="10" cy="10" r="2.2"/></svg>`,
          },
          {
            id: "smoothNodes",
            label: "Suavizar Curva",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 16c4-8 14-8 18 0"/><circle cx="12" cy="10" r="2"/></svg>`,
          },
        ],
      },
      {
        id: "penGroup",
        label: "Caneta & Lápis",
        variants: [
          {
            id: "pen",
            label: "Caneta Bézier (P)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><circle cx="11" cy="11" r="2"/></svg>`,
          },
          {
            id: "pencil",
            label: "Lápis Mão Livre (N)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="M15 5l4 4"/></svg>`,
          },
          {
            id: "penClose",
            label: "Fechar Caminho",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12 3 21 9 18 20 6 20 3 9"/></svg>`,
          },
          {
            id: "strokeWidth",
            label: "Espessura do Traço",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 17C9 13 13 9 20 6" stroke-width="1.4"/><path d="M4 20C9 16 13 13 20 11" stroke-width="2.6"/></svg>`,
          },
        ],
      },
      {
        id: "shapesGroup",
        label: "Formas",
        variants: [
          {
            id: "shapeRect",
            label: "Retângulo (M)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="5" width="16" height="14" rx="1.5"/></svg>`,
          },
          {
            id: "shapeEllipse",
            label: "Elipse / Círculo",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8"/></svg>`,
          },
          {
            id: "shapePoly",
            label: "Hexágono",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12 3 20 7.5 20 16.5 12 21 4 16.5 4 7.5"/></svg>`,
          },
          {
            id: "shapeStar",
            label: "Estrela",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12 3 14.8 8.8 21 9.6 16.5 14 17.6 20.2 12 17.2 6.4 20.2 7.5 14 3 9.6 9.2 8.8"/></svg>`,
          },
        ],
      },
      {
        id: "fillGroup",
        label: "Cor & Gradiente",
        variants: [
          {
            id: "gradLinear",
            label: "Gradiente Linear (G)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="16" height="16" rx="2"/><line x1="6" y1="18" x2="18" y2="6"/></svg>`,
          },
          {
            id: "eyedropper",
            label: "Conta-Gotas (I)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 22l1-1h3l9-9"/><path d="M15 6l3.4-3.4a2.1 2.1 0 1 1 3 3L18 9"/></svg>`,
          },
        ],
      },
      {
        id: "artboardGroup",
        label: "Prancheta & Régua",
        variants: [
          {
            id: "artboard",
            label: "Ajustar Prancheta",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="6" y="6" width="12" height="12" stroke-dasharray="2.5 2"/><path d="M6 2v4M2 6h4M18 2v4M22 6h-4M6 22v-4M2 18h4M18 22v-4M22 18h-4"/></svg>`,
          },
          {
            id: "rulerMeasure",
            label: "Régua de Medição",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`,
          },
        ],
      },
    ],

    // MODO TIPOGRAFIA (Affont - Criação de Fontes e Glifos)
    typography: [
      {
        id: "glyphDrawGroup",
        label: "Desenho de Glifo",
        variants: [
          {
            id: "pen",
            label: "Caneta de Glifo (Traçar Letra)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>`,
          },
          {
            id: "penClose",
            label: "Fechar Contorno do Glifo",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12 3 21 9 18 20 6 20 3 9"/></svg>`,
          },
          {
            id: "shapeRect",
            label: "Haste Retangular (Stem)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="8" y="3" width="8" height="18" rx="1"/></svg>`,
          },
          {
            id: "shapeEllipse",
            label: "Bojo Oval (Bowl)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><ellipse cx="12" cy="12" rx="7" ry="9"/></svg>`,
          },
        ],
      },
      {
        id: "glyphNodeGroup",
        label: "Nós & Curvas Bézier",
        variants: [
          {
            id: "node",
            label: "Editar Pontos do Glifo",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 4l12 7-5.5 1.5L9 18z"/><rect x="15" y="15" width="5" height="5"/></svg>`,
          },
          {
            id: "smoothNodes",
            label: "Suavizar Curva Tipográfica",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 16c4-8 14-8 18 0"/><circle cx="12" cy="10" r="2"/></svg>`,
          },
          {
            id: "corner",
            label: "Serifa / Canto Arredondado",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 20V10a6 6 0 0 1 6-6h10"/></svg>`,
          },
        ],
      },
      {
        id: "glyphMetricsGroup",
        label: "Métricas & Kerning",
        variants: [
          {
            id: "typoNextGlyph",
            label: "Próximo Glifo (A → Z)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 18L10 6l6 12M6 14h8"/><path d="M17 12h4m-2-2l2 2-2 2"/></svg>`,
          },
          {
            id: "typoKerning",
            label: "Ajustar Largura / Kerning",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="4" y1="4" x2="4" y2="20"/><line x1="20" y1="4" x2="20" y2="20"/><path d="M8 12h8M10 9l-2 3 2 3M14 9l2 3-2 3"/></svg>`,
          },
          {
            id: "typoPreviewWord",
            label: "Testar Palavra da Fonte",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M4 12h12M4 17h14"/></svg>`,
          },
        ],
      },
      {
        id: "glyphEditGroup",
        label: "Mover & Transformar",
        variants: [
          {
            id: "move",
            label: "Mover Componente",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 3l14 9-6.5 1.5L10 20z"/></svg>`,
          },
          {
            id: "mirrorH",
            label: "Espelhar Simetria",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="12" y1="3" x2="12" y2="21" stroke-dasharray="2 2"/><polygon points="9 7 4 12 9 17"/><polygon points="15 7 20 12 15 17"/></svg>`,
          },
          {
            id: "deleteObj",
            label: "Limpar Glifo",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>`,
          },
        ],
      },
    ],

    // MODO LAYOUT (Publisher - Diagramação de Página, Colunas e Quadros)
    layout: [
      {
        id: "layoutFramesGroup",
        label: "Quadros & Molduras",
        variants: [
          {
            id: "layoutTextFrame",
            label: "Quadro de Texto Editorial",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M8 8h8M12 8v8"/></svg>`,
          },
          {
            id: "layoutImageFrame",
            label: "Moldura de Imagem (Picture Frame)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="16" rx="1.5"/><line x1="3" y1="4" x2="21" y2="20"/><line x1="21" y1="4" x2="3" y2="20"/></svg>`,
          },
          {
            id: "placeImage",
            label: "Inserir Foto na Moldura",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M21 16l-5-5L5 20"/></svg>`,
          },
        ],
      },
      {
        id: "layoutGridGroup",
        label: "Colunas & Margens",
        variants: [
          {
            id: "layoutCols2",
            label: "Grade 2 Colunas",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="16" rx="1.5"/><line x1="12" y1="4" x2="12" y2="20"/></svg>`,
          },
          {
            id: "layoutCols3",
            label: "Grade 3 Colunas",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="16" rx="1.5"/><line x1="9" y1="4" x2="9" y2="20"/><line x1="15" y1="4" x2="15" y2="20"/></svg>`,
          },
          {
            id: "layoutBleed",
            label: "Alternar Sangria & Guias",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" stroke-dasharray="2 2"/><rect x="6" y="6" width="12" height="12"/></svg>`,
          },
        ],
      },
      {
        id: "layoutPageGroup",
        label: "Páginas & Formatos",
        variants: [
          {
            id: "layoutA4",
            label: "Página A4 Vertical",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="3" width="14" height="18" rx="1.5"/></svg>`,
          },
          {
            id: "layoutSpread",
            label: "Página Dupla (Revista)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="5" width="20" height="14" rx="1.5"/><line x1="12" y1="5" x2="12" y2="19"/></svg>`,
          },
          {
            id: "layoutLabel",
            label: "Rótulo / Embalagem (70×84mm)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="6" y="4" width="12" height="16" rx="2"/><line x1="6" y1="9" x2="18" y2="9"/></svg>`,
          },
        ],
      },
      {
        id: "layoutArrangeGroup",
        label: "Organizar Elementos",
        variants: [
          {
            id: "move",
            label: "Mover Quadro",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 3l14 9-6.5 1.5L10 20z"/></svg>`,
          },
          {
            id: "duplicate",
            label: "Duplicar Bloco",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>`,
          },
          {
            id: "deleteObj",
            label: "Remover Bloco",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>`,
          },
        ],
      },
    ],
  };

  const GLYPHS = ["A", "B", "C", "G", "N", "R", "S", "&", "7"];

  // Estado completamente isolado por Sub-Modo (Normal, Tipografia, Layout)
  const workspaces = {
    normal: {
      activeFamilyId: "selectGroup",
      activeVariantByFamily: {
        selectGroup: "move",
        nodeGroup: "node",
        penGroup: "pen",
        shapesGroup: "shapeRect",
        fillGroup: "gradLinear",
        artboardGroup: "artboard",
      },
      artboard: { visible: true, width: 340, height: 340, label: "Prancheta · 1080×1080" },
      selectedIndex: 0,
      paths: [
        {
          id: "norm-frame",
          type: "shape",
          closed: true,
          fill: "rgba(132, 152, 126, 0.24)",
          stroke: "#3d2d2d",
          strokeWidth: 2.2,
          dash: [],
          cornerRadius: 10,
          gradient: "none",
          points: [
            { x: -100, y: -80 },
            { x: 100, y: -80 },
            { x: 100, y: 80 },
            { x: -100, y: 80 },
          ],
        },
      ],
    },
    typography: {
      activeFamilyId: "glyphDrawGroup",
      activeVariantByFamily: {
        glyphDrawGroup: "pen",
        glyphNodeGroup: "node",
        glyphMetricsGroup: "typoNextGlyph",
        glyphEditGroup: "move",
      },
      glyphIndex: 0,
      advanceWidth: 220,
      previewWord: "ATELIER",
      showWordBar: false,
      selectedIndex: 0,
      paths: [
        // Haste exemplo inicial do glifo 'A'
        {
          id: "glyph-demo-stem",
          type: "shape",
          closed: true,
          fill: "rgba(61, 45, 45, 0.85)",
          stroke: "#3d2d2d",
          strokeWidth: 1.5,
          dash: [],
          cornerRadius: 0,
          gradient: "none",
          points: [
            { x: -12, y: -110 },
            { x: 12, y: -110 },
            { x: 75, y: 70 },
            { x: 48, y: 70 },
            { x: 0, y: -74 },
            { x: -48, y: 70 },
            { x: -75, y: 70 },
          ],
        },
      ],
    },
    layout: {
      activeFamilyId: "layoutFramesGroup",
      activeVariantByFamily: {
        layoutFramesGroup: "layoutTextFrame",
        layoutGridGroup: "layoutCols2",
        layoutPageGroup: "layoutA4",
        layoutArrangeGroup: "move",
      },
      page: { width: 290, height: 390, columns: 2, margin: 22, showBleed: true, label: "Página 1 · A4 Editorial" },
      selectedIndex: 0,
      paths: [
        {
          id: "lay-header",
          type: "textFrame",
          title: "CABEÇALHO EDITORIAL",
          body: "Formulação botânica & design industrial minimalista.",
          fill: "rgba(255,255,255,0.65)",
          stroke: "#3d2d2d",
          points: [
            { x: -122, y: -165 },
            { x: 122, y: -165 },
            { x: 122, y: -95 },
            { x: -122, y: -95 },
          ],
        },
        {
          id: "lay-photo",
          type: "imageFrame",
          fill: "rgba(132, 152, 126, 0.18)",
          stroke: "#3d2d2d",
          points: [
            { x: -122, y: -78 },
            { x: -6, y: -78 },
            { x: -6, y: 95 },
            { x: -122, y: 95 },
          ],
        },
      ],
    },
  };

  const state = {
    submode: "normal", // Sempre inicia direto no "normal" ao selecionar Vetor
    activeFill: "rgba(132, 152, 126, 0.28)",
    activeStroke: "#3d2d2d",
    activeStrokeWidth: 2.2,
    activeDash: [],
    gradientMode: "none",
    rulerLine: null,
    draftPoints: [],
    dragStart: null,
    dragLast: null,
    draggedNodeIdx: -1,
    undoStack: [],
    redoStack: [],
  };

  function ws() {
    return workspaces[state.submode];
  }

  function getFamilies() {
    return TOOL_FAMILIES_BY_SUBMODE[state.submode] || TOOL_FAMILIES_BY_SUBMODE.normal;
  }

  function getActiveFamily() {
    const list = getFamilies();
    return list.find((f) => f.id === ws().activeFamilyId) || list[0];
  }

  function getActiveVariantForFamily(family) {
    const chosenId = ws().activeVariantByFamily[family.id] || family.variants[0].id;
    return family.variants.find((v) => v.id === chosenId) || family.variants[0];
  }

  function getCurrentToolId() {
    return getActiveVariantForFamily(getActiveFamily()).id;
  }

  function snapshot() {
    state.undoStack.push(JSON.stringify(ws().paths));
    if (state.undoStack.length > 40) state.undoStack.shift();
    state.redoStack = [];
  }

  function syncWithCore() {
    const core = CORE();
    if (!core) return;
    if (typeof core.invalidateNode === "function") core.invalidateNode("l-vec-path");
    if (typeof core.emit === "function") core.emit("render:request");
    if (typeof core.render === "function") core.render();
  }

  function getPathBounds(path) {
    if (!path?.points?.length) return { minX: 0, maxX: 0, minY: 0, maxY: 0, cx: 0, cy: 0 };
    const xs = path.points.map((p) => p.x);
    const ys = path.points.map((p) => p.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    return { minX, maxX, minY, maxY, cx: (minX + maxX) / 2, cy: (minY + maxY) / 2 };
  }

  function hitTestPath(x, y) {
    const list = ws().paths;
    for (let i = list.length - 1; i >= 0; i--) {
      const b = getPathBounds(list[i]);
      if (x >= b.minX - 12 && x <= b.maxX + 12 && y >= b.minY - 12 && y <= b.maxY + 12) return i;
    }
    return -1;
  }

  // Troca entre Normal > Tipografia > Layout na barra superior direita
  function setVectorSubmode(submodeId) {
    if (!workspaces[submodeId]) return;
    state.submode = submodeId;
    state.draftPoints = [];
    state.dragStart = null;
    state.draggedNodeIdx = -1;
    state.rulerLine = null;

    const meta = VECTOR_SUBMODES.find((m) => m.id === submodeId);
    CORE()?.recordHistory?.("vector", meta ? meta.label : submodeId);
    renderAllVectorBars();
    syncWithCore();
  }

  function selectFamily(familyId) {
    const fam = getFamilies().find((f) => f.id === familyId);
    if (!fam) return;
    ws().activeFamilyId = fam.id;
    state.draftPoints = [];
    state.dragStart = null;
    state.draggedNodeIdx = -1;
    renderAllVectorBars();
    syncWithCore();
  }

  function selectVariant(variantId) {
    const fam = getActiveFamily();
    const variant = fam.variants.find((v) => v.id === variantId);
    if (!variant) return;

    ws().activeVariantByFamily[fam.id] = variant.id;
    const current = ws().paths[ws().selectedIndex];

    // Ações imediatas compartilhadas
    if (variantId === "selectNext" && ws().paths.length > 0) {
      ws().selectedIndex = (ws().selectedIndex + 1) % ws().paths.length;
    } else if (variantId === "duplicate" && current) {
      snapshot();
      const clone = JSON.parse(JSON.stringify(current));
      clone.id = `dup-${Date.now().toString(36)}`;
      clone.points = clone.points.map((p) => ({ x: p.x + 20, y: p.y + 20 }));
      ws().paths.push(clone);
      ws().selectedIndex = ws().paths.length - 1;
    } else if (variantId === "deleteObj" && current && ws().paths.length > 0) {
      snapshot();
      ws().paths.splice(ws().selectedIndex, 1);
      ws().selectedIndex = Math.max(0, ws().selectedIndex - 1);
    } else if (variantId === "smoothNodes" && current?.points?.length >= 3) {
      snapshot();
      current.points = current.points.map((pt, i, arr) => {
        const prev = arr[(i - 1 + arr.length) % arr.length];
        const next = arr[(i + 1) % arr.length];
        return {
          x: +(prev.x * 0.25 + pt.x * 0.5 + next.x * 0.25).toFixed(1),
          y: +(prev.y * 0.25 + pt.y * 0.5 + next.y * 0.25).toFixed(1),
        };
      });
    } else if (variantId === "penClose") {
      if (state.draftPoints.length >= 2) {
        snapshot();
        ws().paths.push({
          id: `pen-${Date.now().toString(36)}`,
          type: "shape",
          closed: true,
          fill: state.submode === "typography" ? "rgba(61, 45, 45, 0.85)" : state.activeFill,
          stroke: state.activeStroke,
          strokeWidth: state.activeStrokeWidth,
          dash: [],
          cornerRadius: 0,
          gradient: state.gradientMode,
          points: [...state.draftPoints],
        });
        state.draftPoints = [];
        ws().selectedIndex = ws().paths.length - 1;
      } else if (current) {
        snapshot();
        current.closed = !current.closed;
      }
    } else if (variantId === "strokeWidth") {
      state.activeStrokeWidth = state.activeStrokeWidth >= 6 ? 1.5 : state.activeStrokeWidth + 1.5;
      if (current) { snapshot(); current.strokeWidth = state.activeStrokeWidth; }
    } else if (variantId === "mirrorH" && current?.points?.length) {
      snapshot();
      const b = getPathBounds(current);
      current.points = current.points.map((p) => ({ x: +(b.cx - (p.x - b.cx)).toFixed(1), y: p.y }));
    } else if (variantId === "gradLinear") {
      state.gradientMode = state.gradientMode === "linear" ? "none" : "linear";
      if (current) { snapshot(); current.gradient = state.gradientMode; }
    }

    // Ações específicas de Tipografia (Affont)
    else if (variantId === "typoNextGlyph") {
      const tWs = workspaces.typography;
      tWs.glyphIndex = (tWs.glyphIndex + 1) % GLYPHS.length;
    } else if (variantId === "typoKerning") {
      const tWs = workspaces.typography;
      tWs.advanceWidth = tWs.advanceWidth >= 280 ? 160 : tWs.advanceWidth + 30;
    } else if (variantId === "typoPreviewWord") {
      const tWs = workspaces.typography;
      tWs.showWordBar = !tWs.showWordBar;
    }

    // Ações específicas de Layout (Publisher)
    else if (variantId === "layoutCols2") {
      workspaces.layout.page.columns = 2;
    } else if (variantId === "layoutCols3") {
      workspaces.layout.page.columns = 3;
    } else if (variantId === "layoutBleed") {
      workspaces.layout.page.showBleed = !workspaces.layout.page.showBleed;
    } else if (variantId === "layoutA4") {
      Object.assign(workspaces.layout.page, { width: 290, height: 390, label: "Página · A4 Editorial" });
    } else if (variantId === "layoutSpread") {
      Object.assign(workspaces.layout.page, { width: 440, height: 300, label: "Página Dupla · Revista" });
    } else if (variantId === "layoutLabel") {
      Object.assign(workspaces.layout.page, { width: 250, height: 300, label: "Rótulo · 70×84mm" });
    } else if (variantId === "placeImage") {
      const inp = document.createElement("input");
      inp.type = "file";
      inp.accept = "image/*";
      inp.onchange = () => {
        const file = inp.files?.[0];
        if (!file) return;
        const img = new Image();
        img.onload = () => {
          snapshot();
          ws().paths.push({
            id: `img-${Date.now().toString(36)}`,
            type: "imageFrame",
            imgEl: img,
            points: [{ x: -80, y: -80 }, { x: 80, y: -80 }, { x: 80, y: 80 }, { x: -80, y: 80 }],
          });
          ws().selectedIndex = ws().paths.length - 1;
          syncWithCore();
        };
        img.src = URL.createObjectURL(file);
      };
      inp.click();
    }

    renderAllVectorBars();
    syncWithCore();
  }

  // Barra Superior Direita: Normal > Tipografia > Layout (visível quando Vetor está ativo)
  function renderTopRightSubmodes() {
    let topRightBar = document.querySelector(".hud-top-right");
    if (!topRightBar) {
      topRightBar = document.createElement("nav");
      topRightBar.className = "hud-pill hud-top-right";
      document.querySelector(".viewport, .studio-shell, body")?.appendChild(topRightBar);
    }

    const isVectorActive = CORE()?.state?.activeArea === "vector";
    if (!isVectorActive) {
      topRightBar.style.display = "none";
      return;
    }

    const mobile = CORE()?.isMobile?.() || window.innerWidth <= 768;
    topRightBar.style.cssText = `
      position: fixed;
      display: inline-flex;
      flex-direction: row;
      align-items: center;
      top: ${mobile ? "10px" : "14px"};
      right: ${mobile ? "10px" : "14px"};
      gap: ${mobile ? "2px" : "4px"};
      padding: ${mobile ? "3px" : "4px"};
      z-index: 32;
    `;

    topRightBar.innerHTML = VECTOR_SUBMODES.map(
      (mode) => `
        <button
          type="button"
          class="tool-btn ${state.submode === mode.id ? "is-active" : ""}"
          data-vec-submode="${mode.id}"
          title="${mode.label}"
        >${mode.icon}</button>
      `
    ).join("");

    topRightBar.querySelectorAll("[data-vec-submode]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        setVectorSubmode(btn.dataset.vecSubmode);
      });
    });
  }

  // Barra Esquerda: Carrossel deslizante vertical específico do sub-modo ativo
  function renderLeftPrimaryBar() {
    const leftBar = document.querySelector(".hud-left");
    if (!leftBar) return;

    const mobile = CORE()?.isMobile?.() || window.innerWidth <= 768;
    leftBar.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 6px 4px;
      top: ${mobile ? "56px" : "68px"};
      left: ${mobile ? "10px" : "14px"};
      max-height: ${mobile ? "calc(100vh - 130px)" : "min(440px, calc(100vh - 150px))"};
      overflow-y: auto;
      overflow-x: hidden;
      scroll-snap-type: y mandatory;
      scroll-behavior: smooth;
      -webkit-overflow-scrolling: touch;
      touch-action: pan-y;
      scrollbar-width: none;
    `;

    if (!document.getElementById("hud-left-carousel-style")) {
      const styleEl = document.createElement("style");
      styleEl.id = "hud-left-carousel-style";
      styleEl.textContent = `.hud-left::-webkit-scrollbar { display: none; }`;
      document.head.appendChild(styleEl);
    }

    const families = getFamilies();
    leftBar.innerHTML = families
      .map((fam) => {
        const activeVar = getActiveVariantForFamily(fam);
        const isSelected = ws().activeFamilyId === fam.id;
        return `
          <button
            type="button"
            class="tool-btn ${isSelected ? "is-active" : ""}"
            data-vec-family="${fam.id}"
            title="${fam.label} · ${activeVar.label}"
            style="position:relative; flex-shrink:0; scroll-snap-align:center;"
          >
            ${activeVar.icon}
            ${fam.variants.length > 1 ? `<span style="position:absolute;right:3px;bottom:3px;width:0;height:0;border-left:4px solid transparent;border-bottom:4px solid currentColor;opacity:0.65;"></span>` : ""}
          </button>
        `;
      })
      .join("");

    if (!leftBar.dataset.carouselBound) {
      leftBar.dataset.carouselBound = "true";
      let isDown = false, startY = 0, startScrollTop = 0, moved = false;
      leftBar.addEventListener("pointerdown", (e) => {
        if (e.pointerType === "touch") return;
        isDown = true; moved = false; startY = e.clientY; startScrollTop = leftBar.scrollTop;
        leftBar.style.scrollBehavior = "auto";
      });
      window.addEventListener("pointermove", (e) => {
        if (!isDown) return;
        const dy = e.clientY - startY;
        if (Math.abs(dy) > 4) moved = true;
        leftBar.scrollTop = startScrollTop - dy;
      });
      window.addEventListener("pointerup", () => {
        if (!isDown) return;
        isDown = false; leftBar.style.scrollBehavior = "smooth";
        if (moved) {
          leftBar.dataset.justDragged = "true";
          setTimeout(() => { leftBar.dataset.justDragged = "false"; }, 60);
        }
      });
    }

    leftBar.querySelectorAll("[data-vec-family]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (leftBar.dataset.justDragged === "true") return;
        selectFamily(btn.dataset.vecFamily);
        btn.scrollIntoView({ block: "center", behavior: "smooth" });
      });
    });
  }

  // Barra Direita: Variantes correspondentes ao botão selecionado na esquerda
  function renderSecondaryRightBar() {
    let rightBar = document.querySelector(".hud-right");
    if (!rightBar) {
      rightBar = document.createElement("aside");
      rightBar.className = "hud-pill hud-right";
      document.querySelector(".viewport, .studio-shell, body")?.appendChild(rightBar);
    }

    const fam = getActiveFamily();
    const activeVar = getActiveVariantForFamily(fam);

    rightBar.innerHTML = fam.variants
      .map(
        (v) => `
          <button
            type="button"
            class="tool-btn ${activeVar.id === v.id ? "is-active" : ""}"
            data-vec-variant="${v.id}"
            title="${v.label}"
          >${v.icon}</button>
        `
      )
      .join("");

    rightBar.querySelectorAll("[data-vec-variant]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        selectVariant(btn.dataset.vecVariant);
      });
    });
  }

  function renderAllVectorBars() {
    renderTopRightSubmodes();
    renderLeftPrimaryBar();
    renderSecondaryRightBar();
  }

  function traceRoundedPolygon(ctx, points, radius) {
    if (!points || points.length < 2) return;
    if (!radius || radius <= 0 || points.length < 3) {
      ctx.beginPath();
      points.forEach((pt, i) => (i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)));
      return;
    }
    ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
      const prev = points[(i - 1 + points.length) % points.length];
      const curr = points[i];
      const next = points[(i + 1) % points.length];
      const v1x = prev.x - curr.x, v1y = prev.y - curr.y;
      const v2x = next.x - curr.x, v2y = next.y - curr.y;
      const len1 = Math.hypot(v1x, v1y) || 1, len2 = Math.hypot(v2x, v2y) || 1;
      const r = Math.min(radius, len1 * 0.4, len2 * 0.4);
      const p1x = curr.x + (v1x / len1) * r, p1y = curr.y + (v1y / len1) * r;
      const p2x = curr.x + (v2x / len2) * r, p2y = curr.y + (v2y / len2) * r;
      if (i === 0) ctx.moveTo(p1x, p1y);
      else ctx.lineTo(p1x, p1y);
      ctx.quadraticCurveTo(curr.x, curr.y, p2x, p2y);
    }
  }

  // Renderiza o fundo mitigado e a área de trabalho distinta para cada um dos 3 sub-modos
  function renderWorkspaceBackdrop(ctx) {
    if (state.submode === "normal") {
      const ab = workspaces.normal.artboard;
      if (!ab.visible) return;
      ctx.save();
      ctx.fillStyle = "rgba(255, 255, 255, 0.44)";
      ctx.strokeStyle = "rgba(61, 45, 45, 0.35)";
      ctx.lineWidth = 1;
      ctx.fillRect(-ab.width / 2, -ab.height / 2, ab.width, ab.height);
      ctx.strokeRect(-ab.width / 2, -ab.height / 2, ab.width, ab.height);
      ctx.fillStyle = "rgba(61, 45, 45, 0.65)";
      ctx.font = "600 10px system-ui, sans-serif";
      ctx.fillText(ab.label, -ab.width / 2 + 4, -ab.height / 2 - 6);
      ctx.restore();
    } else if (state.submode === "typography") {
      // Estúdio Affont: Célula de Glifo com linhas métricas tipográficas e fundo mitigado
      const tWs = workspaces.typography;
      const hw = tWs.advanceWidth / 2;
      const glyphChar = GLYPHS[tWs.glyphIndex];

      ctx.save();
      // Véu suave mitigando o fundo externo
      ctx.fillStyle = "rgba(248, 245, 238, 0.52)";
      ctx.strokeStyle = "rgba(61, 45, 45, 0.42)";
      ctx.lineWidth = 1.2;
      ctx.fillRect(-hw, -145, tWs.advanceWidth, 270);
      ctx.strokeRect(-hw, -145, tWs.advanceWidth, 270);

      // Glifo fantasma de referência ao fundo
      ctx.fillStyle = "rgba(61, 45, 45, 0.08)";
      ctx.font = "700 220px Georgia, serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(glyphChar, 0, 70);

      // Linhas Métricas da Fonte (Ascender, Cap Height, X-Height, Baseline, Descender)
      const metrics = [
        { y: -125, label: "ASCENDER", color: "rgba(59, 130, 246, 0.55)", dash: [4, 3] },
        { y: -110, label: "CAP HEIGHT", color: "rgba(16, 185, 129, 0.65)", dash: [] },
        { y: -42, label: "X-HEIGHT", color: "rgba(245, 158, 11, 0.65)", dash: [3, 3] },
        { y: 70, label: "BASELINE", color: "rgba(239, 68, 68, 0.8)", dash: [] },
        { y: 112, label: "DESCENDER", color: "rgba(59, 130, 246, 0.55)", dash: [4, 3] },
      ];

      ctx.font = "600 8.5px monospace";
      ctx.textAlign = "left";
      metrics.forEach((m) => {
        ctx.strokeStyle = m.color;
        ctx.lineWidth = 1;
        ctx.setLineDash(m.dash);
        ctx.beginPath();
        ctx.moveTo(-hw - 18, m.y);
        ctx.lineTo(hw + 18, m.y);
        ctx.stroke();
        ctx.fillStyle = m.color;
        ctx.fillText(m.label, hw + 22, m.y + 3);
      });
      ctx.setLineDash([]);

      // Cabeçalho do Glifo + Barra de Teste de Palavra
      ctx.fillStyle = "#3d2d2d";
      ctx.font = "700 10px monospace";
      ctx.fillText(`AFFONT · GLIFO '${glyphChar}' · LARGURA ${tWs.advanceWidth}u`, -hw, -153);

      if (tWs.showWordBar) {
        ctx.fillStyle = "rgba(61, 45, 45, 0.9)";
        ctx.fillRect(-hw, 135, tWs.advanceWidth, 28);
        ctx.fillStyle = "#f5f0e6";
        ctx.font = "600 13px Georgia, serif";
        ctx.textAlign = "center";
        ctx.fillText(`${tWs.previewWord} · ${glyphChar}${glyphChar.toLowerCase()}`, 0, 153);
      }
      ctx.restore();
    } else if (state.submode === "layout") {
      // Estúdio Publisher / Layout: Folha Editorial com Sangria, Margens e Colunas
      const pg = workspaces.layout.page;
      const hw = pg.width / 2, hh = pg.height / 2;

      ctx.save();
      // Sangria externa (Bleed)
      if (pg.showBleed) {
        ctx.strokeStyle = "rgba(239, 68, 68, 0.55)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 3]);
        ctx.strokeRect(-hw - 10, -hh - 10, pg.width + 20, pg.height + 20);
        ctx.setLineDash([]);
      }

      // Papel da Página
      ctx.fillStyle = "rgba(255, 253, 248, 0.72)";
      ctx.strokeStyle = "rgba(61, 45, 45, 0.45)";
      ctx.lineWidth = 1.2;
      ctx.fillRect(-hw, -hh, pg.width, pg.height);
      ctx.strokeRect(-hw, -hh, pg.width, pg.height);

      // Margens e Colunas internas
      const m = pg.margin;
      const innerW = pg.width - m * 2;
      const innerH = pg.height - m * 2;
      const gutter = 12;
      const colW = (innerW - gutter * (pg.columns - 1)) / pg.columns;

      ctx.strokeStyle = "rgba(14, 165, 233, 0.45)";
      ctx.lineWidth = 0.9;
      for (let c = 0; c < pg.columns; c++) {
        const cx = -hw + m + c * (colW + gutter);
        ctx.strokeRect(cx, -hh + m, colW, innerH);
      }

      ctx.fillStyle = "rgba(61, 45, 45, 0.7)";
      ctx.font = "600 10px system-ui, sans-serif";
      ctx.fillText(`${pg.label} · ${pg.columns} Colunas`, -hw + 2, -hh - 14);
      ctx.restore();
    }
  }

  function renderScene(ctx) {
    renderWorkspaceBackdrop(ctx);

    const list = ws().paths;
    list.forEach((path, idx) => {
      const isSel = idx === ws().selectedIndex;
      const b = getPathBounds(path);
      ctx.save();

      if (path.type === "imageFrame") {
        if (path.imgEl) {
          ctx.drawImage(path.imgEl, b.minX, b.minY, b.maxX - b.minX, b.maxY - b.minY);
        } else {
          ctx.fillStyle = path.fill || "rgba(132, 152, 126, 0.16)";
          ctx.strokeStyle = path.stroke || "#3d2d2d";
          ctx.lineWidth = 1.4;
          ctx.fillRect(b.minX, b.minY, b.maxX - b.minX, b.maxY - b.minY);
          ctx.strokeRect(b.minX, b.minY, b.maxX - b.minX, b.maxY - b.minY);
          // X diagonal clássico de moldura de imagem no Affinity Publisher
          ctx.beginPath();
          ctx.moveTo(b.minX, b.minY); ctx.lineTo(b.maxX, b.maxY);
          ctx.moveTo(b.maxX, b.minY); ctx.lineTo(b.minX, b.maxY);
          ctx.stroke();
        }
      } else if (path.type === "textFrame") {
        ctx.fillStyle = path.fill || "rgba(255,255,255,0.6)";
        ctx.strokeStyle = path.stroke || "#3d2d2d";
        ctx.lineWidth = 1.2;
        ctx.fillRect(b.minX, b.minY, b.maxX - b.minX, b.maxY - b.minY);
        ctx.strokeRect(b.minX, b.minY, b.maxX - b.minX, b.maxY - b.minY);
        ctx.fillStyle = "#3d2d2d";
        ctx.font = "700 11px system-ui, sans-serif";
        ctx.fillText(path.title || "QUADRO DE TEXTO", b.minX + 8, b.minY + 18);
        ctx.font = "400 10px system-ui, sans-serif";
        ctx.fillText(path.body || "Texto editorial diagramado...", b.minX + 8, b.minY + 34);
      } else {
        traceRoundedPolygon(ctx, path.points, path.cornerRadius || 0);
        if (path.closed) ctx.closePath();

        if (path.closed) {
          if (path.gradient === "linear") {
            const grad = ctx.createLinearGradient(b.minX, b.minY, b.maxX, b.maxY);
            grad.addColorStop(0, path.fill || state.activeFill);
            grad.addColorStop(1, "rgba(245, 158, 11, 0.38)");
            ctx.fillStyle = grad;
          } else {
            ctx.fillStyle = path.fill || state.activeFill;
          }
          ctx.fill();
        }

        ctx.strokeStyle = path.stroke || state.activeStroke;
        ctx.lineWidth = path.strokeWidth || state.activeStrokeWidth;
        ctx.setLineDash(path.dash || []);
        ctx.stroke();
      }

      if (isSel) {
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 1.2;
        ctx.strokeRect(b.minX - 5, b.minY - 5, b.maxX - b.minX + 10, b.maxY - b.minY + 10);
        ctx.setLineDash([]);

        if (["node", "corner"].includes(getCurrentToolId()) && Array.isArray(path.points)) {
          path.points.forEach((pt) => {
            ctx.fillStyle = "#fff";
            ctx.strokeStyle = "#0ea5e9";
            ctx.lineWidth = 1.5;
            ctx.fillRect(pt.x - 4, pt.y - 4, 8, 8);
            ctx.strokeRect(pt.x - 4, pt.y - 4, 8, 8);
          });
        }
      }
      ctx.restore();
    });

    if (state.draftPoints.length > 0) {
      ctx.save();
      ctx.strokeStyle = state.activeStroke;
      ctx.lineWidth = state.activeStrokeWidth;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      state.draftPoints.forEach((pt, idx) => (idx === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)));
      ctx.stroke();
      ctx.setLineDash([]);
      state.draftPoints.forEach((pt) => {
        ctx.fillStyle = "#f59e0b";
        ctx.fillRect(pt.x - 3.5, pt.y - 3.5, 7, 7);
      });
      ctx.restore();
    }

    if (state.rulerLine) {
      const { x0, y0, x1, y1 } = state.rulerLine;
      const dist = Math.hypot(x1 - x0, y1 - y0).toFixed(1);
      ctx.save();
      ctx.strokeStyle = "#0ea5e9";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      ctx.fillStyle = "#0f172a";
      ctx.fillRect((x0 + x1) / 2 - 28, (y0 + y1) / 2 - 16, 56, 15);
      ctx.fillStyle = "#38bdf8";
      ctx.font = "600 10px monospace";
      ctx.fillText(`${dist}px`, (x0 + x1) / 2 - 20, (y0 + y1) / 2 - 5);
      ctx.restore();
    }
  }

  function buildPolygonPoints(x0, y0, x1, y1, toolId) {
    if (toolId === "shapeRect" || toolId === "layoutTextFrame" || toolId === "layoutImageFrame") {
      return [{ x: x0, y: y0 }, { x: x1, y: y0 }, { x: x1, y: y1 }, { x: x0, y: y1 }];
    }
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    const rx = Math.abs(x1 - x0) / 2 || 4, ry = Math.abs(y1 - y0) / 2 || 4;
    if (toolId === "shapeEllipse") {
      return Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return { x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry };
      });
    }
    if (toolId === "shapePoly") {
      return Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
        return { x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry };
      });
    }
    return Array.from({ length: 10 }, (_, i) => {
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
      const mult = i % 2 === 0 ? 1 : 0.45;
      return { x: cx + Math.cos(a) * rx * mult, y: cy + Math.sin(a) * ry * mult };
    });
  }

  function handlePointerDown(x, y) {
    const toolId = getCurrentToolId();
    state.dragStart = { x, y };
    state.dragLast = { x, y };

    if (toolId === "pen") {
      state.draftPoints.push({ x: Math.round(x), y: Math.round(y) });
      syncWithCore();
      return;
    }

    if (toolId === "rulerMeasure") {
      state.rulerLine = { x0: x, y0: y, x1: x, y1: y };
      syncWithCore();
      return;
    }

    if (toolId === "eyedropper") {
      const hit = hitTestPath(x, y);
      if (hit >= 0) {
        state.activeStroke = ws().paths[hit].stroke || state.activeStroke;
        state.activeFill = ws().paths[hit].fill || state.activeFill;
      }
      return;
    }

    if (toolId === "move" || toolId === "selectNext") {
      const hit = hitTestPath(x, y);
      if (hit >= 0) { ws().selectedIndex = hit; snapshot(); }
      syncWithCore();
      return;
    }

    if (toolId === "node" || toolId === "corner") {
      const current = ws().paths[ws().selectedIndex];
      if (toolId === "corner" && current) {
        snapshot();
        current.cornerRadius = Math.min(48, (current.cornerRadius || 0) + 8);
      } else if (current?.points) {
        const idx = current.points.findIndex((pt) => Math.hypot(pt.x - x, pt.y - y) <= 12);
        if (idx >= 0) { state.draggedNodeIdx = idx; snapshot(); }
      }
      syncWithCore();
      return;
    }

    if (toolId === "pencil") {
      snapshot();
      ws().paths.push({
        id: `pencil-${Date.now().toString(36)}`,
        type: "shape",
        closed: false,
        fill: state.activeFill,
        stroke: state.activeStroke,
        strokeWidth: state.activeStrokeWidth,
        dash: [],
        cornerRadius: 0,
        gradient: "none",
        points: [{ x: Math.round(x), y: Math.round(y) }],
      });
      ws().selectedIndex = ws().paths.length - 1;
      syncWithCore();
      return;
    }

    if (toolId.startsWith("shape") || toolId === "layoutTextFrame" || toolId === "layoutImageFrame") {
      snapshot();
      const itemType = toolId === "layoutTextFrame" ? "textFrame" : toolId === "layoutImageFrame" ? "imageFrame" : "shape";
      ws().paths.push({
        id: `item-${Date.now().toString(36)}`,
        type: itemType,
        title: "NOVO BLOCO",
        body: "Conteúdo diagramado na coluna.",
        closed: true,
        fill: state.submode === "typography" ? "rgba(61, 45, 45, 0.85)" : state.activeFill,
        stroke: state.activeStroke,
        strokeWidth: state.activeStrokeWidth,
        dash: [],
        cornerRadius: 0,
        gradient: state.gradientMode,
        points: [{ x, y }, { x, y }, { x, y }, { x, y }],
      });
      ws().selectedIndex = ws().paths.length - 1;
      syncWithCore();
    }
  }

  function handlePointerMove(x, y) {
    if (!state.dragStart) return;
    const toolId = getCurrentToolId();
    const dx = x - state.dragLast.x, dy = y - state.dragLast.y;
    state.dragLast = { x, y };
    const current = ws().paths[ws().selectedIndex];

    if (toolId === "move" && current) {
      current.points = current.points.map((p) => ({ x: p.x + dx, y: p.y + dy }));
      syncWithCore();
    } else if (toolId === "node" && current && state.draggedNodeIdx >= 0) {
      current.points[state.draggedNodeIdx] = { x: Math.round(x), y: Math.round(y) };
      syncWithCore();
    } else if (toolId === "pencil" && current) {
      current.points.push({ x: Math.round(x), y: Math.round(y) });
      syncWithCore();
    } else if ((toolId.startsWith("shape") || toolId === "layoutTextFrame" || toolId === "layoutImageFrame") && current) {
      current.points = buildPolygonPoints(state.dragStart.x, state.dragStart.y, x, y, toolId);
      syncWithCore();
    } else if (toolId === "artboard") {
      workspaces.normal.artboard.width = Math.max(80, Math.abs(x - state.dragStart.x) * 2);
      workspaces.normal.artboard.height = Math.max(80, Math.abs(y - state.dragStart.y) * 2);
      syncWithCore();
    } else if (toolId === "rulerMeasure" && state.rulerLine) {
      state.rulerLine.x1 = x;
      state.rulerLine.y1 = y;
      syncWithCore();
    }
  }

  function handlePointerUp() {
    if (state.dragStart) {
      state.dragStart = null;
      state.draggedNodeIdx = -1;
      syncWithCore();
    }
  }

  const moduleApi = {
    onActivate() {
      // Sempre inicia direto no sub-modo "normal" ao selecionar Vetor
      state.submode = "normal";
      renderAllVectorBars();
      syncWithCore();
    },
    onDeactivate() {
      state.draftPoints = [];
      state.dragStart = null;
      const topRight = document.querySelector(".hud-top-right");
      if (topRight) topRight.style.display = "none";
    },
    renderBars: renderAllVectorBars,
    renderNode(node, bCtx) {
      const w = bCtx.canvas.width, h = bCtx.canvas.height;
      bCtx.clearRect(0, 0, w, h);
      bCtx.save();
      bCtx.translate(w / 2, h / 2);
      const m = CORE()?.state?.measuresByArea?.vector || { scale: 100, rotation: 0 };
      bCtx.rotate((m.rotation * Math.PI) / 180);
      const sc = (m.scale || 100) / 100;
      bCtx.scale(sc, sc);
      renderScene(bCtx);
      bCtx.restore();
    },
    onPointerDraw: handlePointerDown,
    render(ctx, width, height) {
      ctx.save();
      ctx.translate(width / 2, height / 2);
      renderScene(ctx);
      ctx.restore();
    },
    onMouseDown: handlePointerDown,
    onMouseMove: handlePointerMove,
    onMouseUp: handlePointerUp,
  };

  window.RoblesCore?.registerModule?.("vector", moduleApi);
  window.RoblesStudio?.registerModule?.("vector", moduleApi);

  window.RoblesCore?.on?.("area:changed", (area) => {
    if (area === "vector") {
      state.submode = "normal";
      renderAllVectorBars();
    } else {
      const topRight = document.querySelector(".hud-top-right");
      if (topRight) topRight.style.display = "none";
    }
  });

  if (window.RoblesCore?.state?.activeArea === "vector") {
    state.submode = "normal";
    renderAllVectorBars();
  }
})();
