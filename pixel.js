(() => {
  const CORE = () => window.RoblesCore || window.RoblesStudio || null;

  // 1. Sub-Personas no canto superior direito exclusivas do módulo Pixel (inicia em "manipulacao")
  const PIXEL_SUBMODES = [
    {
      id: "manipulacao",
      label: "Manipulação · Composição & Retoque (PhotoCraft)",
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
    },
    {
      id: "fotografia",
      label: "Fotografia · Revelação & Color Grading (LightCraft)",
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><line x1="14.31" y1="8" x2="20.05" y2="17.94"/><line x1="9.69" y1="8" x2="21.17" y2="8"/><line x1="7.38" y1="12" x2="13.12" y2="2.06"/><line x1="9.69" y1="16" x2="3.95" y2="6.06"/><line x1="14.31" y1="16" x2="2.83" y2="16"/><line x1="16.62" y1="12" x2="10.88" y2="21.94"/></svg>`,
    },
    {
      id: "pintura",
      label: "Pintura · Esboço, Aquarela & Pincéis RGBA (Krita)",
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z"/><path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7"/></svg>`,
    },
  ];

  // 2. Catálogo de Ferramentas por Sub-Modo (Manipulação, Fotografia, Pintura)
  const TOOL_FAMILIES_BY_SUBMODE = {
    // ==========================================
    // MODO 1: MANIPULAÇÃO (PhotoCraft)
    // ==========================================
    manipulacao: [
      {
        id: "pcImportGroup",
        label: "1. Imagem & Camada Base",
        variants: [
          {
            id: "pcImportImage",
            label: "Importar Imagem (PNG, JPG, WebP)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
          },
          {
            id: "pcNewCanvas",
            label: "Novo Quadro Limpo (Papel Algodão)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="16" height="16" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,
          },
          {
            id: "pcExportPng",
            label: "Exportar Composição (.PNG)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
          },
        ],
      },
      {
        id: "pcSelectGroup",
        label: "2. Seleção & Recorte (M)",
        variants: [
          {
            id: "pcMarqueeRect",
            label: "Seleção Retangular (M)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="16" height="16" stroke-dasharray="3 2"/></svg>`,
          },
          {
            id: "pcCropToSel",
            label: "Cortar Imagem pela Seleção",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/></svg>`,
          },
          {
            id: "pcClearSel",
            label: "Limpar Seleção",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="16" height="16" rx="1"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>`,
          },
        ],
      },
      {
        id: "pcTransformGroup",
        label: "3. Transformação & Posição (V)",
        variants: [
          {
            id: "pcMoveLayer",
            label: "Mover / Arrastar Camada (V)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/></svg>`,
          },
          {
            id: "pcFlipH",
            label: "Espelhar Horizontal",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="12" y1="3" x2="12" y2="21" stroke-dasharray="2 2"/><polygon points="8 7 3 12 8 17 8 7"/><polygon points="16 7 21 12 16 17 16 7"/></svg>`,
          },
          {
            id: "pcRotate90",
            label: "Rotacionar 90° Horário",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>`,
          },
        ],
      },
      {
        id: "pcRetouchGroup",
        label: "4. Retoque, Carimbo & Borracha",
        variants: [
          {
            id: "pcEraser",
            label: "Borracha de Pixel (E)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/></svg>`,
          },
          {
            id: "pcBlurBrush",
            label: "Pincel Desfoque / Suavizar",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`,
          },
          {
            id: "pcLiquify",
            label: "Liquify / Empurrar Pixels",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 12c3-5 6 5 9 0s6 5 9 0"/></svg>`,
          },
        ],
      },
      {
        id: "pcBlendGroup",
        label: "5. Efeitos & Mesclagem",
        variants: [
          {
            id: "pcInvertColors",
            label: "Inverter Cores (Negativo)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/></svg>`,
          },
          {
            id: "pcPixelate",
            label: "Pixelizar / Mosaico",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="6" height="6"/><rect x="14" y="4" width="6" height="6"/><rect x="4" y="14" width="6" height="6"/><rect x="14" y="14" width="6" height="6"/></svg>`,
          },
        ],
      },
    ],

    // ==========================================
    // MODO 2: FOTOGRAFIA (LightCraft RAW/Tone)
    // ==========================================
    fotografia: [
      {
        id: "lcExposureGroup",
        label: "1. Exposição & Luz",
        variants: [
          {
            id: "lcExpUp",
            label: "Aumentar Exposição (+0.25 EV)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2"/></svg>`,
          },
          {
            id: "lcExpDown",
            label: "Reduzir Exposição (-0.25 EV)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="4"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
          },
          {
            id: "lcResetAll",
            label: "Resetar Revelação (Original)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`,
          },
        ],
      },
      {
        id: "lcContrastGroup",
        label: "2. Contraste & Curvas",
        variants: [
          {
            id: "lcContrastUp",
            label: "Aumentar Contraste (+15%)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 3v18a9 9 0 0 0 0-18z" fill="currentColor"/></svg>`,
          },
          {
            id: "lcContrastDown",
            label: "Suavizar Contraste (-15%)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M4 18C8 14 16 10 20 6"/></svg>`,
          },
        ],
      },
      {
        id: "lcTempGroup",
        label: "3. Balanço de Branco (Kelvin)",
        variants: [
          {
            id: "lcWarmUp",
            label: "Aquecer Temperatura (+K Âmbar)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>`,
          },
          {
            id: "lcCoolDown",
            label: "Esfriar Temperatura (-K Azul)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07"/></svg>`,
          },
        ],
      },
      {
        id: "lcSatGroup",
        label: "4. Saturação & Vibração",
        variants: [
          {
            id: "lcSatUp",
            label: "Aumentar Saturação (+15%)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><circle cx="8.5" cy="15" r="4"/><circle cx="15.5" cy="15" r="4"/></svg>`,
          },
          {
            id: "lcSatDown",
            label: "Dessaturar / Filme Suave (-20%)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8" stroke-dasharray="3 2"/></svg>`,
          },
        ],
      },
      {
        id: "lcPresetsGroup",
        label: "5. Presets LightCraft",
        variants: [
          {
            id: "lcPresetApothecary",
            label: "Preset Apothecary Warm (#CEC8B8)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="16" height="16" rx="3" fill="#CEC8B8"/></svg>`,
          },
          {
            id: "lcPresetBotanical",
            label: "Preset Sálvia Botânico",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="16" height="16" rx="3" fill="#84987E"/></svg>`,
          },
          {
            id: "lcPresetMono",
            label: "Preset Filme P&B Editorial",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="16" height="16" rx="3" fill="#3d2d2d"/></svg>`,
          },
        ],
      },
      {
        id: "lcVignetteGroup",
        label: "6. Vinheta & Óptica",
        variants: [
          {
            id: "lcVignetteToggle",
            label: "Alternar Vinheta de Lente",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="12" cy="12" r="5"/></svg>`,
          },
        ],
      },
    ],

    // ==========================================
    // MODO 3: PINTURA (Krita Engine: Esboço, Aquarela & Pincéis RGBA)
    // ==========================================
    pintura: [
      {
        id: "krSketchGroup",
        label: "1. Pincéis de Esboço (Grafite & Carvão)",
        variants: [
          {
            id: "krPencilHB",
            label: "Lápis Grafite HB (Traço Seco Texturizado)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>`,
          },
          {
            id: "krCharcoal",
            label: "Carvão Artístico (Grão Orgânico)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 20L19 5l2 2L6 22H4v-2z"/></svg>`,
          },
          {
            id: "krInkPen",
            label: "Caneta Nanquim G-Pen (Contorno Preciso)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>`,
          },
        ],
      },
      {
        id: "krWatercolorGroup",
        label: "2. Aquarela (Wet Engine Krita)",
        variants: [
          {
            id: "krWatercolorWash",
            label: "Aquarela Lavagem Úmida (Watercolor Wash)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`,
          },
          {
            id: "krWatercolorEdge",
            label: "Aquarela Borda Pigmentada (Bloom)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4" stroke-dasharray="2 2"/></svg>`,
          },
          {
            id: "krWaterBlender",
            label: "Pincel Água Limpa (Diluir & Mesclar)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/></svg>`,
          },
        ],
      },
      {
        id: "krRgbaGroup",
        label: "3. Pincéis RGBA (Empasto & Cerdas)",
        variants: [
          {
            id: "krRgbaImpasto",
            label: "Pincel RGBA Empasto Óleo/Acrílico",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z"/><path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7"/></svg>`,
          },
          {
            id: "krRgbaBristle",
            label: "Pincel RGBA Cerdas Abertas (Dry Bristle)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="10" x2="20" y2="10"/><line x1="4" y1="14" x2="20" y2="14"/><line x1="4" y1="18" x2="20" y2="18"/></svg>`,
          },
          {
            id: "krRgbaAirbrush",
            label: "Aerógrafo RGBA Suave (Soft Airbrush)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="7" stroke-dasharray="1 3"/></svg>`,
          },
        ],
      },
      {
        id: "krColorGroup",
        label: "4. Paleta & Pigmentos",
        variants: [
          {
            id: "krColorDarkBrown",
            label: "Pigmento Marrom Café (#3d2d2d)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="7" fill="#3d2d2d"/></svg>`,
          },
          {
            id: "krColorSage",
            label: "Pigmento Sálvia Botânico (#84987E)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="7" fill="#84987E"/></svg>`,
          },
          {
            id: "krColorTerracotta",
            label: "Pigmento Terracota (#B86B4B)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="7" fill="#B86B4B"/></svg>`,
          },
          {
            id: "krColorCustom",
            label: "Escolher Cor Livre...",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></svg>`,
          },
        ],
      },
      {
        id: "krSizeGroup",
        label: "5. Tamanho do Pincel & Borracha",
        variants: [
          {
            id: "krBrushPlus",
            label: "Aumentar Pincel (+6px)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8"/><line x1="12" y1="9" x2="12" y2="15"/><line x1="9" y1="12" x2="15" y2="12"/></svg>`,
          },
          {
            id: "krBrushMinus",
            label: "Diminuir Pincel (-6px)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="5"/><line x1="9" y1="12" x2="15" y2="12"/></svg>`,
          },
          {
            id: "krEraser",
            label: "Borracha de Pintura",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/></svg>`,
          },
        ],
      },
    ],
  };

  // Buffer de pixels persistente (camada base + camada de pintura)
  const CANVAS_W = 460;
  const CANVAS_H = 320;
  const paintCanvas = document.createElement("canvas");
  paintCanvas.width = CANVAS_W;
  paintCanvas.height = CANVAS_H;
  const paintCtx = paintCanvas.getContext("2d");

  const state = {
    submode: "manipulacao",
    activeFamilyBySubmode: {
      manipulacao: "pcImportGroup",
      fotografia: "lcExposureGroup",
      pintura: "krSketchGroup",
    },
    activeVariantByFamily: {
      // Manipulação
      pcImportGroup: "pcImportImage",
      pcSelectGroup: "pcMarqueeRect",
      pcTransformGroup: "pcMoveLayer",
      pcRetouchGroup: "pcEraser",
      pcBlendGroup: "pcInvertColors",
      // Fotografia
      lcExposureGroup: "lcExpUp",
      lcContrastGroup: "lcContrastUp",
      lcTempGroup: "lcWarmUp",
      lcSatGroup: "lcSatUp",
      lcPresetsGroup: "lcPresetApothecary",
      lcVignetteGroup: "lcVignetteToggle",
      // Pintura (Krita)
      krSketchGroup: "krPencilHB",
      krWatercolorGroup: "krWatercolorWash",
      krRgbaGroup: "krRgbaImpasto",
      krColorGroup: "krColorDarkBrown",
      krSizeGroup: "krBrushPlus",
    },
    // Estado Manipulação (PhotoCraft)
    pc: {
      baseImage: null,
      offsetX: 0,
      offsetY: 0,
      flipH: false,
      rotation: 0,
      inverted: false,
      pixelated: false,
      selection: null, // { x, y, w, h }
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0,
    },
    // Estado Fotografia (LightCraft)
    lc: {
      exposure: 100,   // % brightness
      contrast: 100,   // % contrast
      saturate: 100,   // % saturate
      warmth: 0,       // sepia %
      hue: 0,          // deg
      grayscale: 0,    // %
      vignette: false,
    },
    // Estado Pintura (Krita Engine)
    kr: {
      brushType: "krPencilHB",
      color: "#3d2d2d",
      size: 14,
      opacity: 0.85,
      isDrawing: false,
      lastX: 0,
      lastY: 0,
    },
  };

  // Inicializa textura sutil de papel algodão no canvas de pintura
  function initPaperBase() {
    paintCtx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    paintCtx.fillStyle = "#FAF7F0";
    paintCtx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  }
  initPaperBase();

  function getFamilies() {
    return TOOL_FAMILIES_BY_SUBMODE[state.submode] || TOOL_FAMILIES_BY_SUBMODE.manipulacao;
  }

  function getActiveFamily() {
    const list = getFamilies();
    const famId = state.activeFamilyBySubmode[state.submode];
    return list.find((f) => f.id === famId) || list[0];
  }

  function getActiveVariantForFamily(family) {
    const chosenId = state.activeVariantByFamily[family.id] || family.variants[0].id;
    return family.variants.find((v) => v.id === chosenId) || family.variants[0];
  }

  function getCurrentToolId() {
    return getActiveVariantForFamily(getActiveFamily()).id;
  }

  function syncWithCore() {
    const core = CORE();
    if (!core) return;
    if (typeof core.invalidateNode === "function") core.invalidateNode("l-px-frame");
    if (typeof core.emit === "function") core.emit("render:request");
    if (typeof core.render === "function") core.render();
  }

  function setPixelSubmode(submodeId) {
    if (!TOOL_FAMILIES_BY_SUBMODE[submodeId]) return;
    state.submode = submodeId;
    const meta = PIXEL_SUBMODES.find((m) => m.id === submodeId);
    CORE()?.recordHistory?.("pixel", meta ? meta.label : submodeId);
    renderAllPixelBars();
    syncWithCore();
  }

  function selectFamily(familyId) {
    const fam = getFamilies().find((f) => f.id === familyId);
    if (!fam) return;
    state.activeFamilyBySubmode[state.submode] = fam.id;
    renderAllPixelBars();
    syncWithCore();
  }

  function selectVariant(variantId) {
    const fam = getActiveFamily();
    const variant = fam.variants.find((v) => v.id === variantId);
    if (!variant) return;

    state.activeVariantByFamily[fam.id] = variant.id;

    // Ações imediatas de MANIPULAÇÃO (PhotoCraft)
    if (variantId === "pcImportImage") {
      const inp = document.createElement("input");
      inp.type = "file";
      inp.accept = "image/*";
      inp.onchange = () => {
        const file = inp.files?.[0];
        if (!file) return;
        const img = new Image();
        img.onload = () => {
          state.pc.baseImage = img;
          state.pc.offsetX = 0;
          state.pc.offsetY = 0;
          syncWithCore();
        };
        img.src = URL.createObjectURL(file);
      };
      inp.click();
    } else if (variantId === "pcNewCanvas") {
      state.pc.baseImage = null;
      state.pc.selection = null;
      initPaperBase();
    } else if (variantId === "pcExportPng") {
      const a = document.createElement("a");
      a.href = paintCanvas.toDataURL("image/png");
      a.download = "robles-pixel-studio.png";
      a.click();
    } else if (variantId === "pcFlipH") {
      state.pc.flipH = !state.pc.flipH;
    } else if (variantId === "pcRotate90") {
      state.pc.rotation = (state.pc.rotation + Math.PI / 2) % (Math.PI * 2);
    } else if (variantId === "pcInvertColors") {
      state.pc.inverted = !state.pc.inverted;
    } else if (variantId === "pcPixelate") {
      state.pc.pixelated = !state.pc.pixelated;
    } else if (variantId === "pcClearSel") {
      state.pc.selection = null;
    }

    // Ações imediatas de FOTOGRAFIA (LightCraft)
    if (variantId === "lcExpUp") state.lc.exposure = Math.min(180, state.lc.exposure + 12);
    else if (variantId === "lcExpDown") state.lc.exposure = Math.max(40, state.lc.exposure - 12);
    else if (variantId === "lcContrastUp") state.lc.contrast = Math.min(180, state.lc.contrast + 14);
    else if (variantId === "lcContrastDown") state.lc.contrast = Math.max(50, state.lc.contrast - 14);
    else if (variantId === "lcWarmUp") state.lc.warmth = Math.min(65, state.lc.warmth + 12);
    else if (variantId === "lcCoolDown") {
      state.lc.warmth = Math.max(0, state.lc.warmth - 12);
      state.lc.hue -= 8;
    } else if (variantId === "lcSatUp") state.lc.saturate = Math.min(200, state.lc.saturate + 16);
    else if (variantId === "lcSatDown") state.lc.saturate = Math.max(0, state.lc.saturate - 18);
    else if (variantId === "lcPresetApothecary") {
      state.lc = { exposure: 104, contrast: 108, saturate: 88, warmth: 26, hue: 0, grayscale: 0, vignette: true };
    } else if (variantId === "lcPresetBotanical") {
      state.lc = { exposure: 102, contrast: 106, saturate: 92, warmth: 8, hue: 14, grayscale: 0, vignette: false };
    } else if (variantId === "lcPresetMono") {
      state.lc = { exposure: 105, contrast: 128, saturate: 0, warmth: 0, hue: 0, grayscale: 100, vignette: true };
    } else if (variantId === "lcVignetteToggle") {
      state.lc.vignette = !state.lc.vignette;
    } else if (variantId === "lcResetAll") {
      state.lc = { exposure: 100, contrast: 100, saturate: 100, warmth: 0, hue: 0, grayscale: 0, vignette: false };
    }

    // Ações imediatas de PINTURA (Krita Engine)
    if (
      variantId.startsWith("krPencil") ||
      variantId.startsWith("krCharcoal") ||
      variantId.startsWith("krInk") ||
      variantId.startsWith("krWatercolor") ||
      variantId.startsWith("krWaterBlender") ||
      variantId.startsWith("krRgba") ||
      variantId === "krEraser"
    ) {
      state.kr.brushType = variantId;
    } else if (variantId === "krColorDarkBrown") {
      state.kr.color = "#3d2d2d";
    } else if (variantId === "krColorSage") {
      state.kr.color = "#84987E";
    } else if (variantId === "krColorTerracotta") {
      state.kr.color = "#B86B4B";
    } else if (variantId === "krColorCustom") {
      const inp = document.createElement("input");
      inp.type = "color";
      inp.value = state.kr.color;
      inp.oninput = () => {
        state.kr.color = inp.value;
      };
      inp.click();
    } else if (variantId === "krBrushPlus") {
      state.kr.size = Math.min(64, state.kr.size + 6);
    } else if (variantId === "krBrushMinus") {
      state.kr.size = Math.max(2, state.kr.size - 6);
    }

    CORE()?.recordHistory?.("pixel", `${fam.label} → ${variant.label}`);
    renderAllPixelBars();
    syncWithCore();
  }

  // =========================================================================
  // BARRA SUPERIOR DIREITA EXCLUSIVA DO PIXEL (Manipulação > Fotografia > Pintura)
  // =========================================================================
  function renderTopRightSubmodes() {
    const vectorTopRight = document.querySelector(".hud-top-right:not(#pixel-hud-top-right)");
    const videoTopRight = document.getElementById("video-hud-top-right");
    let pixelTopRight = document.getElementById("pixel-hud-top-right");
    const isPixelActive = CORE()?.state?.activeArea === "pixel";

    if (!isPixelActive) {
      if (pixelTopRight) pixelTopRight.style.display = "none";
      if (vectorTopRight && CORE()?.state?.activeArea === "vector") {
        vectorTopRight.style.display = "inline-flex";
      }
      return;
    }

    if (vectorTopRight) vectorTopRight.style.display = "none";
    if (videoTopRight) videoTopRight.style.display = "none";

    if (!pixelTopRight) {
      pixelTopRight = document.createElement("nav");
      pixelTopRight.id = "pixel-hud-top-right";
      pixelTopRight.className = "hud-pill hud-top-right";
      document.querySelector(".viewport, .studio-shell, body")?.appendChild(pixelTopRight);
    }

    const mobile = CORE()?.isMobile?.() || window.innerWidth <= 768;
    pixelTopRight.style.cssText = `
      position: fixed;
      display: inline-flex;
      flex-direction: row;
      align-items: center;
      top: ${mobile ? "10px" : "14px"};
      right: ${mobile ? "10px" : "14px"};
      gap: ${mobile ? "2px" : "4px"};
      padding: ${mobile ? "3px" : "4px"};
      z-index: 33;
    `;

    pixelTopRight.innerHTML = PIXEL_SUBMODES.map(
      (mode) => `
        <button
          type="button"
          class="tool-btn ${state.submode === mode.id ? "is-active" : ""}"
          data-px-submode="${mode.id}"
          title="${mode.label}"
        >${mode.icon}</button>
      `
    ).join("");

    pixelTopRight.querySelectorAll("[data-px-submode]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        setPixelSubmode(btn.dataset.pxSubmode);
      });
    });
  }

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
        const isSelected = state.activeFamilyBySubmode[state.submode] === fam.id;
        return `
          <button
            type="button"
            class="tool-btn ${isSelected ? "is-active" : ""}"
            data-px-family="${fam.id}"
            title="${fam.label} · ${activeVar.label}"
            style="position:relative; flex-shrink:0; scroll-snap-align:center;"
          >
            ${activeVar.icon}
            ${fam.variants.length > 1 ? `<span style="position:absolute;right:3px;bottom:3px;width:0;height:0;border-left:4px solid transparent;border-bottom:4px solid currentColor;opacity:0.65;"></span>` : ""}
          </button>
        `;
      })
      .join("");

    leftBar.querySelectorAll("[data-px-family]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        selectFamily(btn.dataset.pxFamily);
        btn.scrollIntoView({ block: "center", behavior: "smooth" });
      });
    });
  }

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
            data-px-variant="${v.id}"
            title="${v.label}"
          >${v.icon}</button>
        `
      )
      .join("");

    rightBar.querySelectorAll("[data-px-variant]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        selectVariant(btn.dataset.pxVariant);
      });
    });
  }

  function renderAllPixelBars() {
    renderTopRightSubmodes();
    renderLeftPrimaryBar();
    renderSecondaryRightBar();
  }

  // =========================================================================
  // MOTOR DE PINCÉIS KRITA (Esboço, Aquarela & Pincéis RGBA)
  // =========================================================================
  function paintKritaStroke(x0, y0, x1, y1) {
    const brush = state.kr.brushType;
    const size = state.kr.size;
    const color = state.kr.color;
    const dist = Math.hypot(x1 - x0, y1 - y0);
    const steps = Math.max(1, Math.ceil(dist / Math.max(1, size * 0.18)));

    paintCtx.save();

    if (brush === "krEraser" || brush === "pcEraser") {
      paintCtx.fillStyle = "#FAF7F0";
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        paintCtx.beginPath();
        paintCtx.arc(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, size * 0.6, 0, Math.PI * 2);
        paintCtx.fill();
      }
      paintCtx.restore();
      return;
    }

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const px = x0 + (x1 - x0) * t;
      const py = y0 + (y1 - y0) * t;

      if (brush === "krPencilHB" || brush === "krCharcoal") {
        const grainCount = brush === "krCharcoal" ? 18 : 8;
        const radius = brush === "krCharcoal" ? size * 0.45 : Math.max(1.2, size * 0.14);
        paintCtx.fillStyle = color;
        paintCtx.globalAlpha = brush === "krCharcoal" ? 0.24 : 0.45;
        for (let g = 0; g < grainCount; g++) {
          const jx = (Math.random() - 0.5) * radius * 2;
          const jy = (Math.random() - 0.5) * radius * 2;
          paintCtx.fillRect(px + jx, py + jy, 1.3, 1.3);
        }
      } else if (brush === "krInkPen") {
        paintCtx.fillStyle = color;
        paintCtx.globalAlpha = 0.95;
        paintCtx.beginPath();
        paintCtx.arc(px, py, Math.max(1.1, size * 0.18), 0, Math.PI * 2);
        paintCtx.fill();
      } else if (brush === "krWatercolorWash" || brush === "krWatercolorEdge") {
        const r = size * 0.85;
        paintCtx.globalAlpha = 0.06;
        paintCtx.fillStyle = color;
        paintCtx.beginPath();
        paintCtx.arc(px, py, r, 0, Math.PI * 2);
        paintCtx.fill();

        if (brush === "krWatercolorEdge") {
          paintCtx.globalAlpha = 0.14;
          paintCtx.strokeStyle = color;
          paintCtx.lineWidth = 1.2;
          paintCtx.beginPath();
          paintCtx.arc(px, py, r, 0, Math.PI * 2);
          paintCtx.stroke();
        }
      } else if (brush === "krWaterBlender") {
        paintCtx.globalAlpha = 0.08;
        paintCtx.fillStyle = "#FAF7F0";
        paintCtx.beginPath();
        paintCtx.arc(px, py, size * 0.9, 0, Math.PI * 2);
        paintCtx.fill();
      } else if (brush === "krRgbaImpasto" || brush === "krRgbaBristle" || brush === "krRgbaAirbrush") {
        if (brush === "krRgbaAirbrush") {
          const grad = paintCtx.createRadialGradient(px, py, 1, px, py, size);
          grad.addColorStop(0, color);
          grad.addColorStop(1, "rgba(250,247,240,0)");
          paintCtx.globalAlpha = 0.16;
          paintCtx.fillStyle = grad;
          paintCtx.beginPath();
          paintCtx.arc(px, py, size, 0, Math.PI * 2);
          paintCtx.fill();
        } else {
          const bristles = brush === "krRgbaBristle" ? 9 : 5;
          paintCtx.strokeStyle = color;
          paintCtx.lineWidth = brush === "krRgbaBristle" ? 1.4 : size * 0.35;
          paintCtx.globalAlpha = brush === "krRgbaBristle" ? 0.35 : 0.65;
          for (let b = 0; b < bristles; b++) {
            const off = ((b / bristles) - 0.5) * size;
            paintCtx.beginPath();
            paintCtx.moveTo(px + off, py - 1);
            paintCtx.lineTo(px + off + 1.5, py + 1);
            paintCtx.stroke();
          }
        }
      }
    }

    paintCtx.restore();
  }

  // =========================================================================
  // RENDERIZAÇÃO DO QUADRO PIXEL NO PALCO CENTRAL
  // =========================================================================
  function renderPixelCanvas(ctx) {
    ctx.save();

    // Aplica filtros fotográficos do LightCraft + efeitos do PhotoCraft
    const filters = [
      `brightness(${state.lc.exposure}%)`,
      `contrast(${state.lc.contrast}%)`,
      `saturate(${state.lc.saturate}%)`,
      `sepia(${state.lc.warmth}%)`,
      `hue-rotate(${state.lc.hue}deg)`,
      `grayscale(${state.lc.grayscale}%)`,
    ];
    if (state.pc.inverted) filters.push("invert(1)");
    ctx.filter = filters.join(" ");

    // Moldura do quadro
    ctx.fillStyle = "#FAF7F0";
    ctx.fillRect(-CANVAS_W / 2, -CANVAS_H / 2, CANVAS_W, CANVAS_H);

    ctx.beginPath();
    ctx.rect(-CANVAS_W / 2, -CANVAS_H / 2, CANVAS_W, CANVAS_H);
    ctx.clip();

    // Camada de Pintura Krita
    ctx.drawImage(paintCanvas, -CANVAS_W / 2, -CANVAS_H / 2, CANVAS_W, CANVAS_H);

    // Camada de Imagem Importada (PhotoCraft)
    if (state.pc.baseImage) {
      ctx.save();
      ctx.translate(state.pc.offsetX, state.pc.offsetY);
      ctx.rotate(state.pc.rotation);
      if (state.pc.flipH) ctx.scale(-1, 1);
      const ratio = Math.min(CANVAS_W / state.pc.baseImage.width, CANVAS_H / state.pc.baseImage.height);
      const iw = state.pc.baseImage.width * ratio;
      const ih = state.pc.baseImage.height * ratio;
      ctx.drawImage(state.pc.baseImage, -iw / 2, -ih / 2, iw, ih);
      ctx.restore();
    }

    ctx.filter = "none";

    // Vinheta óptica LightCraft
    if (state.lc.vignette) {
      const vig = ctx.createRadialGradient(0, 0, CANVAS_W * 0.25, 0, 0, CANVAS_W * 0.65);
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(28,20,20,0.52)");
      ctx.fillStyle = vig;
      ctx.fillRect(-CANVAS_W / 2, -CANVAS_H / 2, CANVAS_W, CANVAS_H);
    }

    // Seleção retangular ativa (PhotoCraft)
    if (state.pc.selection) {
      const s = state.pc.selection;
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 4]);
      ctx.strokeRect(s.x, s.y, s.w, s.h);
      ctx.setLineDash([]);
    }

    ctx.restore();

    // Borda externa & HUD de status
    ctx.save();
    ctx.strokeStyle = "rgba(61, 45, 45, 0.55)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-CANVAS_W / 2, -CANVAS_H / 2, CANVAS_W, CANVAS_H);
    ctx.fillStyle = "rgba(61, 45, 45, 0.78)";
    ctx.font = "600 10px monospace";
    const hudLabel =
      state.submode === "manipulacao"
        ? "PIXEL · PHOTOCRAFT (MANIPULAÇÃO)"
        : state.submode === "fotografia"
        ? `PIXEL · LIGHTCRAFT (EV ${state.lc.exposure}% · C ${state.lc.contrast}%)`
        : `PIXEL · KRITA BRUSH (${state.kr.size}px · ${state.kr.color})`;
    ctx.fillText(hudLabel, -CANVAS_W / 2, -CANVAS_H / 2 - 8);
    ctx.restore();
  }

  // Conversão de coordenada do mouse/toque para o espaço local do quadro (460x320)
  function toCanvasCoords(worldX, worldY) {
    return {
      cx: worldX + CANVAS_W / 2,
      cy: worldY + CANVAS_H / 2,
    };
  }

  function handlePointerDown(x, y) {
    const tool = getCurrentToolId();
    const { cx, cy } = toCanvasCoords(x, y);

    if (state.submode === "pintura" || tool === "pcEraser") {
      state.kr.isDrawing = true;
      state.kr.lastX = cx;
      state.kr.lastY = cy;
      paintKritaStroke(cx, cy, cx, cy);
      syncWithCore();
    } else if (state.submode === "manipulacao") {
      state.pc.isDragging = true;
      state.pc.dragStartX = x;
      state.pc.dragStartY = y;
      if (tool === "pcMarqueeRect") {
        state.pc.selection = { x, y, w: 0, h: 0 };
      }
    }
  }

  function handlePointerMove(x, y) {
    const tool = getCurrentToolId();
    const { cx, cy } = toCanvasCoords(x, y);

    if (state.kr.isDrawing && (state.submode === "pintura" || tool === "pcEraser")) {
      paintKritaStroke(state.kr.lastX, state.kr.lastY, cx, cy);
      state.kr.lastX = cx;
      state.kr.lastY = cy;
      syncWithCore();
    } else if (state.pc.isDragging && state.submode === "manipulacao") {
      if (tool === "pcMoveLayer") {
        state.pc.offsetX += x - state.pc.dragStartX;
        state.pc.offsetY += y - state.pc.dragStartY;
        state.pc.dragStartX = x;
        state.pc.dragStartY = y;
      } else if (tool === "pcMarqueeRect" && state.pc.selection) {
        state.pc.selection.w = x - state.pc.dragStartX;
        state.pc.selection.h = y - state.pc.dragStartY;
      }
      syncWithCore();
    }
  }

  function handlePointerUp() {
    state.kr.isDrawing = false;
    state.pc.isDragging = false;
  }

  function hidePixelOnlyUI() {
    const pixelTopRight = document.getElementById("pixel-hud-top-right");
    const vectorTopRight = document.querySelector(".hud-top-right:not(#pixel-hud-top-right):not(#video-hud-top-right)");
    if (pixelTopRight) pixelTopRight.style.display = "none";
    if (vectorTopRight && CORE()?.state?.activeArea === "vector") {
      vectorTopRight.style.display = "inline-flex";
    }
  }

  const moduleApi = {
    onActivate() {
      state.submode = "manipulacao";
      renderAllPixelBars();
      syncWithCore();
    },
    onDeactivate() {
      hidePixelOnlyUI();
    },
    renderBars: renderAllPixelBars,
    renderNode(node, bCtx) {
      const w = bCtx.canvas.width, h = bCtx.canvas.height;
      bCtx.clearRect(0, 0, w, h);
      bCtx.save();
      bCtx.translate(w / 2, h / 2);
      renderPixelCanvas(bCtx);
      bCtx.restore();
    },
    render(ctx, width, height) {
      ctx.save();
      ctx.translate(width / 2, height / 2);
      renderPixelCanvas(ctx);
      ctx.restore();
    },
    onMouseDown: handlePointerDown,
    onMouseMove: handlePointerMove,
    onMouseUp: handlePointerUp,
  };

  window.RoblesCore?.registerModule?.("pixel", moduleApi);
  window.RoblesStudio?.registerModule?.("pixel", moduleApi);

  window.RoblesCore?.on?.("area:changed", (area) => {
    if (area === "pixel") {
      state.submode = "manipulacao";
      renderAllPixelBars();
    } else {
      hidePixelOnlyUI();
    }
  });

  if (window.RoblesCore?.state?.activeArea === "pixel") {
    state.submode = "manipulacao";
    renderAllPixelBars();
  }
})();
