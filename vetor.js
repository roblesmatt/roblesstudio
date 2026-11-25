(() => {
  const CORE = () => window.RoblesCore || window.RoblesStudio || null;

  // 1. Sub-Personas no canto superior direito ao ativar "Vetor" (inicia direto em "normal")
  const VECTOR_SUBMODES = [
    {
      id: "normal",
      label: "Normal · Prancheta Vetorial (VectorCraft)",
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><circle cx="11" cy="11" r="2"/></svg>`,
    },
    {
      id: "typography",
      label: "Tipografia · Estúdio de Fontes (Affont)",
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 6h14M12 6v13M8 19h8"/><line x1="3" y1="10" x2="21" y2="10" stroke-dasharray="2 2" opacity="0.65"/></svg>`,
    },
    {
      id: "layout",
      label: "Layout · Diagramação & Páginas",
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="3" width="16" height="18" rx="1.5"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="4" y1="9" x2="20" y2="9"/></svg>`,
    },
  ];

  // 2. Todas as 20 Ferramentas Primárias do VectorCraft no modo Normal + suítes de Tipografia e Layout
  const TOOL_FAMILIES_BY_SUBMODE = {
    normal: [
      {
        id: "moveGroup",
        label: "1. Mover & Selecionar",
        variants: [
          {
            id: "move",
            label: "Ferramenta Mover (V)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 3l14 9-6.5 1.5L10 20z"/></svg>`,
          },
          {
            id: "selectNext",
            label: "Alternar Objeto Selecionado",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="11" height="11" rx="1.5"/><rect x="10" y="10" width="11" height="11" rx="1.5" fill="currentColor" fill-opacity="0.16"/></svg>`,
          },
          {
            id: "duplicate",
            label: "Duplicar Vetor (Ctrl+D)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>`,
          },
          {
            id: "deleteObj",
            label: "Excluir Vetor",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>`,
          },
        ],
      },
      {
        id: "nodeGroup",
        label: "2. Nó (Seleção Direta)",
        variants: [
          {
            id: "node",
            label: "Ferramenta Nó (A)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 4l12 7-5.5 1.5L9 18z"/><rect x="15" y="15" width="5" height="5"/></svg>`,
          },
          {
            id: "smoothNodes",
            label: "Suavizar Nós",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 16c4-8 14-8 18 0"/><circle cx="12" cy="10" r="2"/></svg>`,
          },
          {
            id: "subdivideNodes",
            label: "Subdividir Nós (+Pontos)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="4" y1="12" x2="20" y2="12"/><circle cx="4" cy="12" r="2"/><circle cx="20" cy="12" r="2"/><path d="M12 8v8M8 12h8"/></svg>`,
          },
          {
            id: "penClose",
            label: "Fechar / Abrir Curva",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12 3 21 9 18 20 6 20 3 9"/></svg>`,
          },
        ],
      },
      {
        id: "cornerGroup",
        label: "3. Canto Dinâmico",
        variants: [
          {
            id: "corner",
            label: "Arredondar Canto (+8px) (C)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 20V10a6 6 0 0 1 6-6h10"/><circle cx="10" cy="10" r="2.2"/></svg>`,
          },
          {
            id: "cornerChamfer",
            label: "Chanfrar Cantos",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 20V11l7-7h9"/></svg>`,
          },
          {
            id: "cornerReset",
            label: "Canto Vivo (Raio 0)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 20V5h15"/></svg>`,
          },
        ],
      },
      {
        id: "originGroup",
        label: "4. Ponto de Origem & Rotação",
        variants: [
          {
            id: "originPivot",
            label: "Posicionar Pivô de Origem",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="7" stroke-dasharray="3 2"/><circle cx="12" cy="12" r="2.2" fill="currentColor"/></svg>`,
          },
          {
            id: "rotateCw",
            label: "Girar +15° no Pivô",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>`,
          },
          {
            id: "rotateCcw",
            label: "Girar -15° no Pivô",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`,
          },
        ],
      },
      {
        id: "penGroup",
        label: "5. Caneta Bézier",
        variants: [
          {
            id: "pen",
            label: "Caneta Bézier (P)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><circle cx="11" cy="11" r="2"/></svg>`,
          },
          {
            id: "penClose",
            label: "Concluir & Fechar Traço",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12 3 21 9 18 20 6 20 3 9"/></svg>`,
          },
          {
            id: "penClearDraft",
            label: "Cancelar Rascunho",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>`,
          },
        ],
      },
      {
        id: "pencilGroup",
        label: "6. Lápis Vetorial",
        variants: [
          {
            id: "pencil",
            label: "Lápis Mão Livre (N)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="M15 5l4 4"/></svg>`,
          },
          {
            id: "smoothNodes",
            label: "Suavizar Traço Livre",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 16c4-8 14-8 18 0"/></svg>`,
          },
        ],
      },
      {
        id: "vectorBrushGroup",
        label: "7. Pincel Vetorial",
        variants: [
          {
            id: "vectorBrush",
            label: "Pincel Caligráfico (B)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18.37 2.63L14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z"/><path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7"/></svg>`,
          },
          {
            id: "brushBold",
            label: "Ponta Larga (8px)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8"><path d="M4 18C9 8 15 16 20 6"/></svg>`,
          },
        ],
      },
      {
        id: "strokeWidthGroup",
        label: "8. Largura do Traço",
        variants: [
          {
            id: "strokeWidthUp",
            label: "Engrossar Traço (+1px)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 17C9 13 13 9 20 6" stroke-width="1.4"/><path d="M4 20C9 16 13 13 20 11" stroke-width="2.6"/></svg>`,
          },
          {
            id: "strokeWidthDn",
            label: "Afinar Traço (-1px)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="5" y1="12" x2="19" y2="12" stroke-width="1.2"/></svg>`,
          },
          {
            id: "strokeDash",
            label: "Tracejado Técnico",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="3" y1="12" x2="21" y2="12" stroke-dasharray="3 3"/></svg>`,
          },
        ],
      },
      {
        id: "shapesGroup",
        label: "9. Formas Geométricas",
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
            id: "shapeTriangle",
            label: "Triângulo",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12 4 21 19 3 19"/></svg>`,
          },
          {
            id: "shapePoly",
            label: "Polígono (Hexágono)",
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
        id: "shapeBuilderGroup",
        label: "10. Construtor de Formas",
        variants: [
          {
            id: "sbUnite",
            label: "Unir Formas (S)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="15" cy="9" r="5"/><path d="M9 9a5 5 0 1 0 6 6"/></svg>`,
          },
          {
            id: "sbSubtract",
            label: "Subtrair Forma Frontal",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="8" width="11" height="11"/><rect x="9" y="4" width="11" height="11" stroke-dasharray="2.5 2"/></svg>`,
          },
        ],
      },
      {
        id: "booleanSymmetryGroup",
        label: "11. Simetria & Alinhamento",
        variants: [
          {
            id: "mirrorH",
            label: "Espelhar Horizontal",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="12" y1="3" x2="12" y2="21" stroke-dasharray="2 2"/><polygon points="9 7 4 12 9 17"/><polygon points="15 7 20 12 15 17"/></svg>`,
          },
          {
            id: "mirrorV",
            label: "Espelhar Vertical",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="3" y1="12" x2="21" y2="12" stroke-dasharray="2 2"/><polygon points="7 9 12 4 17 9"/><polygon points="7 15 12 20 17 15"/></svg>`,
          },
          {
            id: "centerObject",
            label: "Centralizar na Prancheta",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>`,
          },
        ],
      },
      {
        id: "gradientGroup",
        label: "12. Gradiente & Preenchimento",
        variants: [
          {
            id: "gradLinear",
            label: "Gradiente Linear (G)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="16" height="16" rx="2"/><line x1="6" y1="18" x2="18" y2="6"/><circle cx="7" cy="17" r="1.8" fill="currentColor"/><circle cx="17" cy="7" r="1.8"/></svg>`,
          },
          {
            id: "gradRadial",
            label: "Gradiente Radial",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>`,
          },
          {
            id: "gradSolid",
            label: "Preenchimento Sólido",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="5" width="14" height="14" rx="2" fill="currentColor" fill-opacity="0.3"/></svg>`,
          },
        ],
      },
      {
        id: "transparencyGroup",
        label: "13. Transparência / Opacidade",
        variants: [
          {
            id: "opacityToggle",
            label: "Alternar Opacidade (100% / 50% / 25%)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/></svg>`,
          },
          {
            id: "toggleFill",
            label: "Alternar Preenchimento / Contorno",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>`,
          },
        ],
      },
      {
        id: "artTextGroup",
        label: "14. Texto Artístico",
        variants: [
          {
            id: "artText",
            label: "Texto Artístico (T)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 6h14M12 6v13M9 19h6"/></svg>`,
          },
          {
            id: "textSizeUp",
            label: "Aumentar Fonte (+4px)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 18L9 6l5 12M6 14h6"/><path d="M18 8v6M15 11h6"/></svg>`,
          },
          {
            id: "textSizeDn",
            label: "Diminuir Fonte (-4px)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 18L9 6l5 12M6 14h6"/><path d="M15 11h6"/></svg>`,
          },
        ],
      },
      {
        id: "pathTextGroup",
        label: "15. Texto em Arco / Caminho",
        variants: [
          {
            id: "arcText",
            label: "Inserir Texto em Arco (Selo)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 16a8 8 0 0 1 16 0"/><path d="M10 6h4M12 6v5"/></svg>`,
          },
        ],
      },
      {
        id: "imageGroup",
        label: "16. Inserir Imagem",
        variants: [
          {
            id: "placeImage",
            label: "Importar Imagem Vetorial",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M21 16l-5-5L5 20"/></svg>`,
          },
          {
            id: "imageOpacity",
            label: "Opacidade da Referência (50%)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="16" height="16" rx="2" stroke-dasharray="2 2"/></svg>`,
          },
        ],
      },
      {
        id: "warpGroup",
        label: "17. Malha de Deformação",
        variants: [
          {
            id: "warpSkew",
            label: "Inclinar / Perspectiva Livre",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="7 5 20 5 17 19 4 19"/></svg>`,
          },
          {
            id: "warpWave",
            label: "Ondular Vértices",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 12c3-5 6 5 9 0s6 5 9 0"/></svg>`,
          },
        ],
      },
      {
        id: "artboardGroup",
        label: "18. Prancheta (Artboard)",
        variants: [
          {
            id: "artboard",
            label: "Redimensionar Prancheta",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="6" y="6" width="12" height="12" stroke-dasharray="2.5 2"/><path d="M6 2v4M2 6h4M18 2v4M22 6h-4M6 22v-4M2 18h4M18 22v-4M22 18h-4"/></svg>`,
          },
          {
            id: "ab1080",
            label: "Prancheta 1:1 (1080×1080)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="5" width="14" height="14" rx="1"/></svg>`,
          },
          {
            id: "abPackage",
            label: "Caixa Sabonete (73×87mm)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="6" y="4" width="12" height="16" rx="1.5"/></svg>`,
          },
        ],
      },
      {
        id: "measureGroup",
        label: "19. Régua & Cotas",
        variants: [
          {
            id: "rulerMeasure",
            label: "Régua de Distância & Ângulo",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/><path d="M13 7l2 2M10 10l2 2M7 13l2 2"/></svg>`,
          },
          {
            id: "rulerClear",
            label: "Limpar Régua",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>`,
          },
        ],
      },
      {
        id: "eyedropperGroup",
        label: "20. Conta-Gotas & Paleta",
        variants: [
          {
            id: "eyedropper",
            label: "Conta-Gotas (I)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 22l1-1h3l9-9"/><path d="M3 21v-3l9-9"/><path d="M15 6l3.4-3.4a2.1 2.1 0 1 1 3 3L18 9"/></svg>`,
          },
          {
            id: "paletteSage",
            label: "Sálvia (#84987E)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="7" fill="#84987E"/></svg>`,
          },
          {
            id: "paletteEspresso",
            label: "Café (#3D2D2D)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="7" fill="#3D2D2D"/></svg>`,
          },
          {
            id: "paletteBeige",
            label: "Bege Apothecary (#CEC8B8)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="7" fill="#CEC8B8"/></svg>`,
          },
        ],
      },
    ],

    // SUB-MODO TIPOGRAFIA (Affont - Criação de Glifos e Métricas)
    typography: [
      {
        id: "glyphDrawGroup",
        label: "Desenho de Glifo",
        variants: [
          {
            id: "pen",
            label: "Caneta Bézier de Glifo",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>`,
          },
          {
            id: "penClose",
            label: "Fechar Contorno do Glifo",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12 3 21 9 18 20 6 20 3 9"/></svg>`,
          },
          {
            id: "shapeRect",
            label: "Haste Vertical (Stem)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="8" y="3" width="8" height="18" rx="1"/></svg>`,
          },
          {
            id: "shapeEllipse",
            label: "Bojo / Contra-Forma (Bowl)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><ellipse cx="12" cy="12" rx="7" ry="9"/></svg>`,
          },
        ],
      },
      {
        id: "glyphNodeGroup",
        label: "Nós & Curvas Tipográficas",
        variants: [
          {
            id: "node",
            label: "Editar Pontos do Glifo",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 4l12 7-5.5 1.5L9 18z"/><rect x="15" y="15" width="5" height="5"/></svg>`,
          },
          {
            id: "smoothNodes",
            label: "Suavizar Curva",
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
        label: "Simetria & Organização",
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

    // SUB-MODO LAYOUT (Diagramação Editorial & Embalagens)
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
        label: "Colunas & Sangria",
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
        label: "Formatos de Página",
        variants: [
          {
            id: "layoutA4",
            label: "Página A4 Editorial",
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
        label: "Organizar Blocos",
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

  // 3. Workspaces isolados para cada sub-modo
  const workspaces = {
    normal: {
      activeFamilyId: "moveGroup",
      activeVariantByFamily: {
        moveGroup: "move",
        nodeGroup: "node",
        cornerGroup: "corner",
        originGroup: "originPivot",
        penGroup: "pen",
        pencilGroup: "pencil",
        vectorBrushGroup: "vectorBrush",
        strokeWidthGroup: "strokeWidthUp",
        shapesGroup: "shapeRect",
        shapeBuilderGroup: "sbUnite",
        booleanSymmetryGroup: "mirrorH",
        gradientGroup: "gradLinear",
        transparencyGroup: "opacityToggle",
        artTextGroup: "artText",
        pathTextGroup: "arcText",
        imageGroup: "placeImage",
        warpGroup: "warpSkew",
        artboardGroup: "artboard",
        measureGroup: "rulerMeasure",
        eyedropperGroup: "eyedropper",
      },
      artboard: { visible: true, width: 340, height: 340, label: "Prancheta Vetorial · 1080×1080" },
      pivot: { x: 0, y: 0 },
      selectedIndex: 0,
      paths: [
        {
          id: "norm-apothecary-card",
          type: "shape",
          closed: true,
          opacity: 1,
          fill: "rgba(132, 152, 126, 0.24)",
          stroke: "#3d2d2d",
          strokeWidth: 2.2,
          dash: [],
          cornerRadius: 12,
          gradient: "none",
          points: [
            { x: -105, y: -85 },
            { x: 105, y: -85 },
            { x: 105, y: 85 },
            { x: -105, y: 85 },
          ],
        },
        {
          id: "norm-brand-text",
          type: "text",
          text: "ATELIER N° 07",
          fontSize: 20,
          opacity: 1,
          x: 0,
          y: 5,
          fill: "#3d2d2d",
          stroke: "#3d2d2d",
          points: [{ x: 0, y: 5 }],
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
        {
          id: "glyph-demo-stem",
          type: "shape",
          closed: true,
          opacity: 1,
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
          opacity: 1,
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
          opacity: 1,
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
    submode: "normal",
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
    if (path.type === "text" || path.type === "arcText") {
      const hw = (path.text?.length || 4) * (path.fontSize || 20) * 0.34;
      const hh = (path.fontSize || 20) * 0.7;
      return { minX: path.x - hw, maxX: path.x + hw, minY: path.y - hh, maxY: path.y + hh, cx: path.x, cy: path.y };
    }
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

    if (variantId === "selectNext" && ws().paths.length > 0) {
      ws().selectedIndex = (ws().selectedIndex + 1) % ws().paths.length;
    } else if (variantId === "duplicate" && current) {
      snapshot();
      const clone = JSON.parse(JSON.stringify(current));
      clone.id = `dup-${Date.now().toString(36)}`;
      if (clone.type === "text" || clone.type === "arcText") { clone.x += 20; clone.y += 20; }
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
    } else if (variantId === "subdivideNodes" && current?.points?.length >= 2) {
      snapshot();
      const nextPts = [];
      for (let i = 0; i < current.points.length; i++) {
        const a = current.points[i];
        const b = current.points[(i + 1) % current.points.length];
        nextPts.push(a, { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
      }
      current.points = nextPts;
    } else if (variantId === "cornerChamfer" && current?.points?.length === 4) {
      snapshot();
      const b = getPathBounds(current);
      const c = 16;
      current.points = [
        { x: b.minX + c, y: b.minY }, { x: b.maxX - c, y: b.minY },
        { x: b.maxX, y: b.minY + c }, { x: b.maxX, y: b.maxY - c },
        { x: b.maxX - c, y: b.maxY }, { x: b.minX + c, y: b.maxY },
        { x: b.minX, y: b.maxY - c }, { x: b.minX, y: b.minY + c },
      ];
    } else if (variantId === "cornerReset" && current) {
      snapshot();
      current.cornerRadius = 0;
    } else if ((variantId === "rotateCw" || variantId === "rotateCcw") && current?.points?.length) {
      snapshot();
      const rad = ((variantId === "rotateCw" ? 15 : -15) * Math.PI) / 180;
      const cos = Math.cos(rad), sin = Math.sin(rad);
      const b = getPathBounds(current);
      const px = workspaces.normal.pivot?.x || b.cx;
      const py = workspaces.normal.pivot?.y || b.cy;
      current.points = current.points.map((p) => ({
        x: +(px + (p.x - px) * cos - (p.y - py) * sin).toFixed(1),
        y: +(py + (p.x - px) * sin + (p.y - py) * cos).toFixed(1),
      }));
    } else if (variantId === "penClose") {
      if (state.draftPoints.length >= 2) {
        snapshot();
        ws().paths.push({
          id: `pen-${Date.now().toString(36)}`,
          type: "shape",
          closed: true,
          opacity: 1,
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
    } else if (variantId === "penClearDraft") {
      state.draftPoints = [];
    } else if (variantId === "brushBold") {
      state.activeStrokeWidth = 8;
      if (current) { snapshot(); current.strokeWidth = 8; }
    } else if ((variantId === "sbUnite" || variantId === "sbSubtract") && ws().paths.length >= 2) {
      snapshot();
      const b1 = getPathBounds(ws().paths[ws().paths.length - 2]);
      const b2 = getPathBounds(ws().paths[ws().paths.length - 1]);
      const minX = variantId === "sbUnite" ? Math.min(b1.minX, b2.minX) : b1.minX;
      const maxX = variantId === "sbUnite" ? Math.max(b1.maxX, b2.maxX) : Math.max(b1.minX + 24, b2.minX);
      const minY = variantId === "sbUnite" ? Math.min(b1.minY, b2.minY) : b1.minY;
      const maxY = variantId === "sbUnite" ? Math.max(b1.maxY, b2.maxY) : b1.maxY;
      ws().paths.splice(ws().paths.length - 2, 2, {
        id: `sb-${Date.now().toString(36)}`,
        type: "shape",
        closed: true,
        opacity: 1,
        fill: state.activeFill,
        stroke: state.activeStroke,
        strokeWidth: state.activeStrokeWidth,
        dash: [],
        cornerRadius: 4,
        gradient: state.gradientMode,
        points: [{ x: minX, y: minY }, { x: maxX, y: minY }, { x: maxX, y: maxY }, { x: minX, y: maxY }],
      });
      ws().selectedIndex = ws().paths.length - 1;
    } else if (variantId === "mirrorH" && current?.points?.length) {
      snapshot();
      const b = getPathBounds(current);
      current.points = current.points.map((p) => ({ x: +(b.cx - (p.x - b.cx)).toFixed(1), y: p.y }));
    } else if (variantId === "mirrorV" && current?.points?.length) {
      snapshot();
      const b = getPathBounds(current);
      current.points = current.points.map((p) => ({ x: p.x, y: +(b.cy - (p.y - b.cy)).toFixed(1) }));
    } else if (variantId === "centerObject" && current) {
      snapshot();
      const b = getPathBounds(current);
      if (current.type === "text" || current.type === "arcText") { current.x = 0; current.y = 0; }
      current.points = current.points.map((p) => ({ x: p.x - b.cx, y: p.y - b.cy }));
    } else if (variantId === "strokeWidthUp") {
      state.activeStrokeWidth = Math.min(16, state.activeStrokeWidth + 1);
      if (current) { snapshot(); current.strokeWidth = state.activeStrokeWidth; }
    } else if (variantId === "strokeWidthDn") {
      state.activeStrokeWidth = Math.max(0.5, state.activeStrokeWidth - 1);
      if (current) { snapshot(); current.strokeWidth = state.activeStrokeWidth; }
    } else if (variantId === "strokeDash") {
      state.activeDash = state.activeDash.length ? [] : [6, 4];
      if (current) { snapshot(); current.dash = [...state.activeDash]; }
    } else if (variantId === "gradLinear" || variantId === "gradRadial" || variantId === "gradSolid") {
      state.gradientMode = variantId === "gradLinear" ? "linear" : variantId === "gradRadial" ? "radial" : "none";
      if (current) { snapshot(); current.gradient = state.gradientMode; }
    } else if (variantId === "opacityToggle" && current) {
      snapshot();
      current.opacity = current.opacity === 1 ? 0.5 : current.opacity === 0.5 ? 0.25 : 1;
    } else if (variantId === "toggleFill" && current) {
      snapshot();
      current.closed = !current.closed;
    } else if ((variantId === "textSizeUp" || variantId === "textSizeDn") && (current?.type === "text" || current?.type === "arcText")) {
      snapshot();
      current.fontSize = Math.max(10, Math.min(72, (current.fontSize || 20) + (variantId === "textSizeUp" ? 4 : -4)));
    } else if (variantId === "imageOpacity" && current) {
      snapshot();
      current.opacity = current.opacity === 1 ? 0.5 : 1;
    } else if (variantId === "warpWave" && current?.points?.length) {
      snapshot();
      current.points = current.points.map((p, i) => ({ x: p.x, y: +(p.y + Math.sin(i * 1.2) * 10).toFixed(1) }));
    } else if (variantId === "ab1080") {
      Object.assign(workspaces.normal.artboard, { visible: true, width: 340, height: 340, label: "Prancheta · 1080×1080" });
    } else if (variantId === "abPackage") {
      Object.assign(workspaces.normal.artboard, { visible: true, width: 260, height: 310, label: "Caixa Sabonete · 73×87mm" });
    } else if (variantId === "rulerClear") {
      state.rulerLine = null;
    } else if (variantId === "paletteSage" || variantId === "paletteEspresso" || variantId === "paletteBeige") {
      const map = {
        paletteSage: { stroke: "#3d2d2d", fill: "rgba(132, 152, 126, 0.34)" },
        paletteEspresso: { stroke: "#3d2d2d", fill: "rgba(61, 45, 45, 0.24)" },
        paletteBeige: { stroke: "#3d2d2d", fill: "rgba(206, 200, 184, 0.55)" },
      };
      state.activeStroke = map[variantId].stroke;
      state.activeFill = map[variantId].fill;
      if (current) { snapshot(); current.stroke = state.activeStroke; current.fill = state.activeFill; }
    } else if (variantId === "typoNextGlyph") {
      workspaces.typography.glyphIndex = (workspaces.typography.glyphIndex + 1) % GLYPHS.length;
    } else if (variantId === "typoKerning") {
      const tWs = workspaces.typography;
      tWs.advanceWidth = tWs.advanceWidth >= 280 ? 160 : tWs.advanceWidth + 30;
    } else if (variantId === "typoPreviewWord") {
      workspaces.typography.showWordBar = !workspaces.typography.showWordBar;
    } else if (variantId === "layoutCols2") {
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
            opacity: 1,
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

  // Barra Superior Direita: Normal > Tipografia > Layout
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

  // Barra Esquerda: Carrossel deslizante vertical com as 20 ferramentas do VectorCraft
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
      max-height: ${mobile ? "calc(100vh - 130px)" : "min(460px, calc(100vh - 150px))"};
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
      const tWs = workspaces.typography;
      const hw = tWs.advanceWidth / 2;
      const glyphChar = GLYPHS[tWs.glyphIndex];

      ctx.save();
      ctx.fillStyle = "rgba(248, 245, 238, 0.52)";
      ctx.strokeStyle = "rgba(61, 45, 45, 0.42)";
      ctx.lineWidth = 1.2;
      ctx.fillRect(-hw, -145, tWs.advanceWidth, 270);
      ctx.strokeRect(-hw, -145, tWs.advanceWidth, 270);

      ctx.fillStyle = "rgba(61, 45, 45, 0.08)";
      ctx.font = "700 220px Georgia, serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(glyphChar, 0, 70);

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
      const pg = workspaces.layout.page;
      const hw = pg.width / 2, hh = pg.height / 2;

      ctx.save();
      if (pg.showBleed) {
        ctx.strokeStyle = "rgba(239, 68, 68, 0.55)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 3]);
        ctx.strokeRect(-hw - 10, -hh - 10, pg.width + 20, pg.height + 20);
        ctx.setLineDash([]);
      }

      ctx.fillStyle = "rgba(255, 253, 248, 0.72)";
      ctx.strokeStyle = "rgba(61, 45, 45, 0.45)";
      ctx.lineWidth = 1.2;
      ctx.fillRect(-hw, -hh, pg.width, pg.height);
      ctx.strokeRect(-hw, -hh, pg.width, pg.height);

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
      ctx.globalAlpha = path.opacity ?? 1;

      if (path.type === "imageFrame") {
        if (path.imgEl) {
          ctx.drawImage(path.imgEl, b.minX, b.minY, b.maxX - b.minX, b.maxY - b.minY);
        } else {
          ctx.fillStyle = path.fill || "rgba(132, 152, 126, 0.16)";
          ctx.strokeStyle = path.stroke || "#3d2d2d";
          ctx.lineWidth = 1.4;
          ctx.fillRect(b.minX, b.minY, b.maxX - b.minX, b.maxY - b.minY);
          ctx.strokeRect(b.minX, b.minY, b.maxX - b.minX, b.maxY - b.minY);
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
      } else if (path.type === "text") {
        ctx.font = `700 ${path.fontSize || 20}px system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = path.fill || state.activeStroke;
        ctx.fillText(path.text || "TEXTO", path.x, path.y);
      } else if (path.type === "arcText") {
        const chars = [...(path.text || "BOTANICAL")];
        const radius = 68;
        ctx.font = `700 ${path.fontSize || 14}px system-ui, sans-serif`;
        ctx.fillStyle = path.fill || state.activeStroke;
        ctx.textAlign = "center";
        chars.forEach((ch, i) => {
          const ang = -Math.PI / 2 + (i - (chars.length - 1) / 2) * 0.22;
          ctx.save();
          ctx.translate(path.x + Math.cos(ang) * radius, path.y + Math.sin(ang) * radius);
          ctx.rotate(ang + Math.PI / 2);
          ctx.fillText(ch, 0, 0);
          ctx.restore();
        });
      } else {
        traceRoundedPolygon(ctx, path.points, path.cornerRadius || 0);
        if (path.closed) ctx.closePath();

        if (path.closed) {
          if (path.gradient === "linear") {
            const grad = ctx.createLinearGradient(b.minX, b.minY, b.maxX, b.maxY);
            grad.addColorStop(0, path.fill || state.activeFill);
            grad.addColorStop(1, "rgba(245, 158, 11, 0.38)");
            ctx.fillStyle = grad;
          } else if (path.gradient === "radial") {
            const r = Math.max(20, (b.maxX - b.minX) * 0.6);
            const grad = ctx.createRadialGradient(b.cx, b.cy, 4, b.cx, b.cy, r);
            grad.addColorStop(0, "rgba(255,255,255,0.65)");
            grad.addColorStop(1, path.fill || state.activeFill);
            ctx.fillStyle = grad;
          } else {
            ctx.fillStyle = path.fill || state.activeFill;
          }
          ctx.fill();
        }

        ctx.strokeStyle = path.stroke || state.activeStroke;
        ctx.lineWidth = path.strokeWidth || state.activeStrokeWidth;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.setLineDash(path.dash || []);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      if (isSel) {
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 1.2;
        ctx.strokeRect(b.minX - 5, b.minY - 5, b.maxX - b.minX + 10, b.maxY - b.minY + 10);
        ctx.setLineDash([]);

        if (["node", "corner", "warpSkew"].includes(getCurrentToolId()) && Array.isArray(path.points)) {
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

    if (getCurrentToolId() === "originPivot" && state.submode === "normal") {
      const pv = workspaces.normal.pivot;
      ctx.save();
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(pv.x, pv.y, 7, 0, Math.PI * 2);
      ctx.moveTo(pv.x - 11, pv.y); ctx.lineTo(pv.x + 11, pv.y);
      ctx.moveTo(pv.x, pv.y - 11); ctx.lineTo(pv.x, pv.y + 11);
      ctx.stroke();
      ctx.restore();
    }

    if (state.rulerLine) {
      const { x0, y0, x1, y1 } = state.rulerLine;
      const dist = Math.hypot(x1 - x0, y1 - y0).toFixed(1);
      const angle = ((Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI).toFixed(1);
      ctx.save();
      ctx.strokeStyle = "#0ea5e9";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      ctx.fillStyle = "#0f172a";
      ctx.fillRect((x0 + x1) / 2 - 42, (y0 + y1) / 2 - 18, 84, 16);
      ctx.fillStyle = "#38bdf8";
      ctx.font = "600 10px monospace";
      ctx.fillText(`${dist}px · ${angle}°`, (x0 + x1) / 2 - 36, (y0 + y1) / 2 - 7);
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
    if (toolId === "shapeTriangle") {
      return [{ x: cx, y: y0 }, { x: x1, y: y1 }, { x: x0, y: y1 }];
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

    if (toolId === "originPivot") {
      workspaces.normal.pivot = { x: Math.round(x), y: Math.round(y) };
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

    if (toolId === "node" || toolId === "corner" || toolId === "warpSkew") {
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

    if (toolId === "artText" || toolId === "arcText") {
      const txt = prompt("Novo texto vetorial:", toolId === "arcText" ? "BOTANICAL · N°07" : "ROBLES");
      if (txt && txt.trim()) {
        snapshot();
        ws().paths.push({
          id: `txt-${Date.now().toString(36)}`,
          type: toolId === "arcText" ? "arcText" : "text",
          text: txt,
          fontSize: toolId === "arcText" ? 13 : 22,
          opacity: 1,
          x: Math.round(x),
          y: Math.round(y),
          fill: state.activeStroke,
          stroke: state.activeStroke,
          points: [{ x: Math.round(x), y: Math.round(y) }],
        });
        ws().selectedIndex = ws().paths.length - 1;
        syncWithCore();
      }
      return;
    }

    if (toolId === "pencil" || toolId === "vectorBrush" || toolId === "brushBold") {
      snapshot();
      ws().paths.push({
        id: `stroke-${Date.now().toString(36)}`,
        type: "shape",
        closed: false,
        opacity: 1,
        fill: state.activeFill,
        stroke: state.activeStroke,
        strokeWidth: toolId === "brushBold" ? 8 : toolId === "vectorBrush" ? Math.max(4, state.activeStrokeWidth * 1.8) : state.activeStrokeWidth,
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
        opacity: 1,
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
      if (current.type === "text" || current.type === "arcText") { current.x += dx; current.y += dy; }
      current.points = current.points.map((p) => ({ x: p.x + dx, y: p.y + dy }));
      syncWithCore();
    } else if (["node", "warpSkew"].includes(toolId) && current && state.draggedNodeIdx >= 0) {
      current.points[state.draggedNodeIdx] = { x: Math.round(x), y: Math.round(y) };
      syncWithCore();
    } else if ((toolId === "pencil" || toolId === "vectorBrush" || toolId === "brushBold") && current) {
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
