(() => {
  const CORE = () => window.RoblesCore || window.RoblesStudio || null;

  // 1. Os 4 Sub-Modos na barra superior direita exclusiva do 3D
  const D3_SUBMODES = [
    {
      id: "parametricos",
      label: "Paramétricos · Área CAD & Medidas Reais (SolidCraft)",
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
    },
    {
      id: "hardsurface",
      label: "Hard Surface · Viewport Poligonal & Gizmo (Valence3D)",
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12 2 21 7 21 17 12 22 3 17 3 7"/><line x1="12" y1="2" x2="12" y2="22"/><line x1="3" y1="7" x2="21" y2="17"/><line x1="21" y1="7" x2="3" y2="17"/></svg>`,
    },
    {
      id: "escultura",
      label: "Escultura · Estúdio MatCap & Malha Viva (Nomad Sculpt)",
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3c4.97 0 9 3.58 9 8 0 2.5-1.2 4.7-3.2 6.2-.8.6-1.3 1.5-1.3 2.5V21H7.5v-1.3c0-1-.5-1.9-1.3-2.5C4.2 15.7 3 13.5 3 11c0-4.42 4.03-8 9-8z"/><path d="M8 11c1.5-1.5 6.5-1.5 8 0"/></svg>`,
    },
    {
      id: "renderizacao",
      label: "Renderização · Palco Ray-Tracing & Câmera (Blender Cycles)",
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="5"/><path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>`,
    },
  ];

  // 2. Ferramentas Primárias (.hud-left) e Secundárias (.hud-right) por Contexto
  const TOOL_FAMILIES_BY_SUBMODE = {
    parametricos: [
      {
        id: "cadPrimitivesGroup",
        label: "1. Sólidos Paramétricos (SolidCraft)",
        variants: [
          {
            id: "primSoapBar",
            label: "Sabonete 120g (70×84×23mm)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="4" width="14" height="16" rx="3"/><line x1="8" y1="8" x2="16" y2="8"/></svg>`,
          },
          {
            id: "primCardBox",
            label: "Caixa Cartão (73×87×23mm)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`,
          },
          {
            id: "primCube",
            label: "Cubo Paramétrico (60×60×60mm)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="16" height="16" rx="1.5"/></svg>`,
          },
          {
            id: "primCylinder",
            label: "Frasco Cilíndrico 100ml (Ø52×95mm)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v14c0 1.66 3.13 3 7 3s7-1.34 7-3V5"/></svg>`,
          },
        ],
      },
      {
        id: "cadExtrudeGroup",
        label: "2. Cotas, Extrusão & Fillet",
        variants: [
          {
            id: "cadExtrudePlus",
            label: "Extrudar Espessura (+4mm)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="10" width="14" height="10" rx="1"/><path d="M12 10V3m0 0-3 3m3-3 3 3"/></svg>`,
          },
          {
            id: "cadExtrudeMinus",
            label: "Reduzir Espessura (-4mm)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="10" width="14" height="10" rx="1"/><path d="M12 3v7m0 0-3-3m3 3 3-3"/></svg>`,
          },
          {
            id: "cadEdgeFillet",
            label: "Edge Fillet / Chanfro Paramétrico",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19V9a5 5 0 0 1 5-5h10"/><path d="M4 19h15V4" stroke-dasharray="2 2"/></svg>`,
          },
          {
            id: "cadDebossSeven",
            label: "Alternar Baixo-Relevo '7' (Deboss)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 8h6l-4 8"/></svg>`,
          },
          {
            id: "cadToggleDims",
            label: "Mostrar / Ocultar Cotas em mm",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 12h20M5 9v6M19 9v6"/></svg>`,
          },
        ],
      },
      {
        id: "cadTransformGroup",
        label: "3. Vistas Técnicas & Escala",
        variants: [
          {
            id: "cadViewIso",
            label: "Vista Isométrica 3/4",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12 3 20 8 20 16 12 21 4 16 4 8"/></svg>`,
          },
          {
            id: "cadViewFront",
            label: "Elevação Frontal (Ortográfica)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="5" width="14" height="14"/></svg>`,
          },
          {
            id: "cadScaleUp",
            label: "Zoom / Escala (+12%)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`,
          },
        ],
      },
      {
        id: "cadIoGroup",
        label: "4. Importar / Exportar CAD (.OBJ)",
        variants: [
          {
            id: "ioImportObj",
            label: "Importar Arquivo 3D (.OBJ, .STL, .GLB)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
          },
          {
            id: "ioExportObj",
            label: "Exportar Malha CAD (.OBJ)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
          },
        ],
      },
    ],

    hardsurface: [
      {
        id: "hsSelectModeGroup",
        label: "1. Sub-Objetos Poligonais (Valence3D)",
        variants: [
          {
            id: "hsSelObject",
            label: "Modo Objeto + Gizmo XYZ",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 3l14 9-6.5 1.5L10 20z"/></svg>`,
          },
          {
            id: "hsSelFaces",
            label: "Modo Polígonos / Faces",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12 3 20 8 20 16 12 21 4 16 4 8"/><polygon points="12 3 20 8 12 13 4 8" fill="currentColor" fill-opacity="0.35"/></svg>`,
          },
          {
            id: "hsSelEdges",
            label: "Modo Edge Loops / Arestas",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12 3 20 8 20 16 12 21 4 16 4 8"/><line x1="12" y1="13" x2="12" y2="21" stroke-width="2.6"/></svg>`,
          },
          {
            id: "hsSelVertices",
            label: "Modo Vértices",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="5" width="14" height="14"/><circle cx="5" cy="5" r="2" fill="currentColor"/><circle cx="19" cy="5" r="2" fill="currentColor"/><circle cx="19" cy="19" r="2" fill="currentColor"/><circle cx="5" cy="19" r="2" fill="currentColor"/></svg>`,
          },
        ],
      },
      {
        id: "hsSubdivGroup",
        label: "2. Topologia & Subdivisão",
        variants: [
          {
            id: "hsSubdivideMesh",
            label: "Subdividir Malha (Catmull-Clark +1)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="3" y1="12" x2="21" y2="12"/></svg>`,
          },
          {
            id: "hsBevelPoly",
            label: "Bevel Poligonal",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="8 3 16 3 21 8 21 16 16 21 8 21 3 16 3 8"/></svg>`,
          },
          {
            id: "hsToggleGizmo",
            label: "Mostrar / Ocultar Gizmo 3D",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="12" y1="12" x2="12" y2="3"/><line x1="12" y1="12" x2="20" y2="17"/><line x1="12" y1="12" x2="4" y2="17"/></svg>`,
          },
        ],
      },
      {
        id: "hsDeformGroup",
        label: "3. Modificadores Hard-Surface",
        variants: [
          {
            id: "hsTaperTop",
            label: "Taper Industrial (Afinar Topo)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="7 4 17 4 20 20 4 20"/></svg>`,
          },
          {
            id: "hsTwistMesh",
            label: "Twist Axial (+15°)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 4c6 4 6 12 12 16"/><path d="M18 4c-6 4-6 12-12 16"/></svg>`,
          },
          {
            id: "hsResetTopo",
            label: "Reconstruir Malha Base",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`,
          },
        ],
      },
    ],

    escultura: [
      {
        id: "scBrushesGroup",
        label: "1. Pincéis de Escultura (Nomad Sculpt)",
        variants: [
          {
            id: "brushClay",
            label: "Clay / Argila (Adicionar Volume)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 17c3-7 13-7 16 0"/><line x1="3" y1="19" x2="21" y2="19"/></svg>`,
          },
          {
            id: "brushInflate",
            label: "Inflate / Inflar Superfície",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="7"/><path d="M12 5V2M12 22v-3M5 12H2M22 12h-3"/></svg>`,
          },
          {
            id: "brushCarve",
            label: "Crease / Escavar Sulco",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7c4 8 12 8 16 0"/><line x1="3" y1="5" x2="21" y2="5"/></svg>`,
          },
          {
            id: "brushSmooth",
            label: "Smooth / Suavizar Argila",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 13c4-3 6 3 9 0s5 3 9 0"/></svg>`,
          },
        ],
      },
      {
        id: "scBaseClayGroup",
        label: "2. Bloco Base & MatCap",
        variants: [
          {
            id: "sculptSphereBase",
            label: "Esfera de Argila (Alta Densidade)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/></svg>`,
          },
          {
            id: "sculptSoapOrganic",
            label: "Bloco Retangular Orgânico",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="5" width="16" height="14" rx="5"/></svg>`,
          },
          {
            id: "sculptRotate90",
            label: "Girar Peça na Bancada (+45°)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>`,
          },
        ],
      },
      {
        id: "scBrushSettingsGroup",
        label: "3. Raio & Simetria Espelhada",
        variants: [
          {
            id: "scRadiusUp",
            label: "Aumentar Anel do Pincel (+)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8"/><line x1="12" y1="9" x2="12" y2="15"/><line x1="9" y1="12" x2="15" y2="12"/></svg>`,
          },
          {
            id: "scRadiusDown",
            label: "Diminuir Anel do Pincel (-)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="5"/><line x1="9" y1="12" x2="15" y2="12"/></svg>`,
          },
          {
            id: "scSymmetryToggle",
            label: "Alternar Simetria Espelhada (Eixo X)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="12" y1="3" x2="12" y2="21" stroke-dasharray="2 2"/><path d="M8 7l-4 5 4 5M16 7l4 5-4 5"/></svg>`,
          },
        ],
      },
    ],

    renderizacao: [
      {
        id: "rtEngineGroup",
        label: "1. Motor Ray-Tracing (Blender Cycles)",
        variants: [
          {
            id: "rtTraceNow",
            label: "Renderizar Traçado de Raios (Cycles)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="5"/><path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3"/></svg>`,
          },
          {
            id: "rtToggleSamples",
            label: "Alternar Amostras (Preview 1x / Final 2x)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
          },
          {
            id: "rtExportRenderPng",
            label: "Salvar Imagem Renderizada (.PNG)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
          },
        ],
      },
      {
        id: "rtShadersGroup",
        label: "2. Shaders PBR & Reflexos",
        variants: [
          {
            id: "shSageMatte",
            label: "Shader Sálvia Matte (Roughness 0.72)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="7" fill="#84987E"/></svg>`,
          },
          {
            id: "shAmberGlass",
            label: "Shader Vidro Âmbar Especular (IOR 1.52)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="7" fill="#6B4226"/></svg>`,
          },
          {
            id: "shApothecaryBeige",
            label: "Shader Cerâmica Apothecary (#CEC8B8)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="7" fill="#CEC8B8"/></svg>`,
          },
          {
            id: "shBrushedGold",
            label: "Shader Latão / Ouro Escovado",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="7" fill="#C9A25B"/></svg>`,
          },
        ],
      },
      {
        id: "rtHdriGroup",
        label: "3. Câmera & Iluminação HDRI",
        variants: [
          {
            id: "hdriStudioWarm",
            label: "HDRI Estúdio Apothecary Warm",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></svg>`,
          },
          {
            id: "hdriDramaticNoir",
            label: "HDRI Contraste Editorial (Rim Light)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3a9 9 0 1 0 9 9c0-4.97-4.03-9-9-9z"/></svg>`,
          },
          {
            id: "rtCameraTurntable",
            label: "Girar Câmera de Estúdio (+30°)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>`,
          },
        ],
      },
    ],
  };

  // =========================================================================
  // GERADORES DE MALHA POR CONTEXTO
  // =========================================================================
  function buildBoxMesh(w = 1.4, h = 1.68, d = 0.46) {
    const hw = w / 2, hh = h / 2, hd = d / 2;
    return {
      verts: [
        [-hw, -hh, -hd], [hw, -hh, -hd], [hw, hh, -hd], [-hw, hh, -hd],
        [-hw, -hh, hd],  [hw, -hh, hd],  [hw, hh, hd],  [-hw, hh, hd],
      ],
      faces: [
        [0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4],
        [2, 3, 7, 6], [0, 3, 7, 4], [1, 2, 6, 5],
      ],
    };
  }

  function buildCylinderMesh(r = 0.65, h = 1.75, segs = 18) {
    const verts = [], faces = [], hh = h / 2;
    for (let i = 0; i < segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      verts.push([Math.cos(a) * r, -hh, Math.sin(a) * r]);
      verts.push([Math.cos(a) * r, hh, Math.sin(a) * r]);
    }
    const topCap = [], botCap = [];
    for (let i = 0; i < segs; i++) {
      const n = (i + 1) % segs;
      const t0 = i * 2, b0 = i * 2 + 1, t1 = n * 2, b1 = n * 2 + 1;
      faces.push([t0, t1, b1, b0]);
      topCap.push(t0);
      botCap.unshift(b0);
    }
    faces.push(topCap, botCap);
    return { verts, faces };
  }

  function buildSculptSphereMesh(r = 1.05, rings = 15, segs = 24) {
    const verts = [], faces = [];
    for (let y = 0; y <= rings; y++) {
      const phi = (y / rings) * Math.PI;
      for (let x = 0; x <= segs; x++) {
        const theta = (x / segs) * Math.PI * 2;
        verts.push([
          -r * Math.cos(theta) * Math.sin(phi),
          r * Math.cos(phi),
          r * Math.sin(theta) * Math.sin(phi),
        ]);
      }
    }
    for (let y = 0; y < rings; y++) {
      for (let x = 0; x < segs; x++) {
        const a = y * (segs + 1) + x;
        const b = a + segs + 1;
        faces.push([a, b, b + 1, a + 1]);
      }
    }
    return { verts, faces };
  }

  function subdivideQuadMesh(mesh) {
    const newVerts = [...mesh.verts.map((v) => [...v])];
    const newFaces = [];
    const edgeMidCache = new Map();
    const getMid = (i1, i2) => {
      const key = i1 < i2 ? `${i1}_${i2}` : `${i2}_${i1}`;
      if (edgeMidCache.has(key)) return edgeMidCache.get(key);
      const v1 = newVerts[i1], v2 = newVerts[i2];
      const idx = newVerts.length;
      newVerts.push([(v1[0] + v2[0]) / 2, (v1[1] + v2[1]) / 2, (v1[2] + v2[2]) / 2]);
      edgeMidCache.set(key, idx);
      return idx;
    };
    mesh.faces.forEach((f) => {
      if (f.length === 4) {
        const [a, b, c, d] = f;
        const ab = getMid(a, b), bc = getMid(b, c), cd = getMid(c, d), da = getMid(d, a);
        const centerIdx = newVerts.length;
        newVerts.push([
          (newVerts[a][0] + newVerts[b][0] + newVerts[c][0] + newVerts[d][0]) / 4,
          (newVerts[a][1] + newVerts[b][1] + newVerts[c][1] + newVerts[d][1]) / 4,
          (newVerts[a][2] + newVerts[b][2] + newVerts[c][2] + newVerts[d][2]) / 4,
        ]);
        newFaces.push([a, ab, centerIdx, da], [ab, b, bc, centerIdx], [centerIdx, bc, c, cd], [da, centerIdx, cd, d]);
      } else {
        newFaces.push(f);
      }
    });
    return { verts: newVerts, faces: newFaces };
  }

  function parseObjText(text) {
    const verts = [], faces = [];
    text.split(/\r?\n/).forEach((line) => {
      const parts = line.trim().split(/\s+/);
      if (parts[0] === "v" && parts.length >= 4) {
        verts.push([parseFloat(parts[1]) || 0, -(parseFloat(parts[2]) || 0), parseFloat(parts[3]) || 0]);
      } else if (parts[0] === "f" && parts.length >= 4) {
        const idx = parts.slice(1).map((tok) => parseInt(tok.split("/")[0], 10) - 1).filter((n) => n >= 0);
        if (idx.length >= 3) faces.push(idx);
      }
    });
    if (!verts.length) return buildBoxMesh();
    let maxAbs = 0.001;
    verts.forEach((v) => v.forEach((c) => { if (Math.abs(c) > maxAbs) maxAbs = Math.abs(c); }));
    return { verts: verts.map((v) => v.map((c) => (c / maxAbs) * 1.35)), faces: faces.slice(0, 2200) };
  }

  function exportMeshToObj(mesh, name = "robles-3d-model") {
    const lines = [`# Robles 3D Export - ${name}`];
    mesh.verts.forEach(([x, y, z]) => lines.push(`v ${x.toFixed(4)} ${(-y).toFixed(4)} ${z.toFixed(4)}`));
    mesh.faces.forEach((f) => lines.push(`f ${f.map((i) => i + 1).join(" ")}`));
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/plain" }));
    a.download = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.obj`;
    a.click();
  }

  // Buffer do Motor Ray-Tracing (Blender Cycles)
  const RT_W = 420;
  const RT_H = 300;
  const rtCanvas = document.createElement("canvas");
  rtCanvas.width = RT_W;
  rtCanvas.height = RT_H;
  const rtCtx = rtCanvas.getContext("2d");

  const state = {
    submode: "parametricos",
    activeFamilyBySubmode: {
      parametricos: "cadPrimitivesGroup",
      hardsurface: "hsSelectModeGroup",
      escultura: "scBrushesGroup",
      renderizacao: "rtEngineGroup",
    },
    activeVariantByFamily: {
      cadPrimitivesGroup: "primSoapBar",
      cadExtrudeGroup: "cadExtrudePlus",
      cadTransformGroup: "cadViewIso",
      cadIoGroup: "ioImportObj",
      hsSelectModeGroup: "hsSelObject",
      hsSubdivGroup: "hsSubdivideMesh",
      hsDeformGroup: "hsTaperTop",
      scBrushesGroup: "brushClay",
      scBaseClayGroup: "sculptSphereBase",
      scBrushSettingsGroup: "scRadiusUp",
      rtEngineGroup: "rtTraceNow",
      rtShadersGroup: "shSageMatte",
      rtHdriGroup: "hdriStudioWarm",
    },
    modelName: "Sabonete Botânico 120g",
    primitiveType: "soap",
    mmW: 70,
    mmH: 84,
    mmD: 23,
    dimW: 1.4,
    dimH: 1.68,
    dimD: 0.46,
    scale: 1.0,
    mesh: buildBoxMesh(1.4, 1.68, 0.46),
    debossSeven: true,
    showDimensions: true,
    rotX: -0.36,
    rotY: 0.54,
    // Hard Surface
    hsSelectMode: "object",
    showGizmo: true,
    // Escultura (Nomad Sculpt)
    sculpt: {
      brush: "brushClay",
      radius: 40,
      strength: 0.055,
      symmetryX: true,
      cursorX: 0,
      cursorY: 0,
      hasCursor: false,
    },
    // Renderização (Ray-Tracing)
    renderEngine: {
      materialHex: "#84987E",
      roughness: 0.68,
      metallic: 0.08,
      hdri: "warm",
      highSamples: false,
      needsTrace: true,
    },
    isDragging: false,
    lastX: 0,
    lastY: 0,
  };

  function getFamilies() {
    return TOOL_FAMILIES_BY_SUBMODE[state.submode] || TOOL_FAMILIES_BY_SUBMODE.parametricos;
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

  function syncWithCore() {
    const core = CORE();
    if (!core) return;
    if (typeof core.invalidateNode === "function") core.invalidateNode("l-3d-frame");
    if (typeof core.emit === "function") core.emit("render:request");
    if (typeof core.render === "function") core.render();
  }

  // =========================================================================
  // TROCA DE CONTEXTO REAL DA ÁREA DE TRABALHO (Os 4 Ícones)
  // =========================================================================
  function set3DSubmode(submodeId) {
    if (!TOOL_FAMILIES_BY_SUBMODE[submodeId]) return;
    state.submode = submodeId;

    if (submodeId === "parametricos") {
      // Restaura ambiente CAD paramétrico com medidas exatas
      state.primitiveType = "soap";
      state.modelName = "Sabonete Botânico 120g";
      state.mmW = 70; state.mmH = 84; state.mmD = 23;
      state.dimW = 1.4; state.dimH = 1.68; state.dimD = 0.46;
      state.mesh = buildBoxMesh(1.4, 1.68, 0.46);
      state.debossSeven = true;
      state.showDimensions = true;
      state.rotX = -0.36;
      state.rotY = 0.54;
    } else if (submodeId === "hardsurface") {
      // Transforma a área de trabalho em viewport poligonal subdividido (Valence3D)
      state.mesh = subdivideQuadMesh(buildBoxMesh(1.38, 1.56, 0.62));
      state.modelName = "Malha Hard-Surface Subdividida";
      state.debossSeven = false;
      state.showGizmo = true;
    } else if (submodeId === "escultura") {
      // Transforma a área de trabalho em bancada de argila orgânica (Nomad Sculpt)
      state.mesh = buildSculptSphereMesh(1.06, 15, 24);
      state.modelName = "Argila Orgânica (Nomad Sculpt)";
      state.debossSeven = false;
    } else if (submodeId === "renderizacao") {
      // Transforma a área de trabalho em estúdio Ray-Tracing (Blender Cycles)
      state.renderEngine.needsTrace = true;
      runRayTracer();
    }

    const meta = D3_SUBMODES.find((m) => m.id === submodeId);
    CORE()?.recordHistory?.("3d", meta ? meta.label : submodeId);
    renderAll3DBars();
    syncWithCore();
  }

  function selectFamily(familyId) {
    const fam = getFamilies().find((f) => f.id === familyId);
    if (!fam) return;
    state.activeFamilyBySubmode[state.submode] = fam.id;
    renderAll3DBars();
    syncWithCore();
  }

  function selectVariant(variantId) {
    const fam = getActiveFamily();
    const variant = fam.variants.find((v) => v.id === variantId);
    if (!variant) return;

    state.activeVariantByFamily[fam.id] = variant.id;

    // 1. PARAMÉTRICOS
    if (variantId === "primSoapBar") {
      state.primitiveType = "soap";
      state.modelName = "Sabonete Botânico 120g";
      state.mmW = 70; state.mmH = 84; state.mmD = 23;
      state.dimW = 1.4; state.dimH = 1.68; state.dimD = 0.46;
      state.debossSeven = true;
      state.mesh = buildBoxMesh(1.4, 1.68, 0.46);
    } else if (variantId === "primCardBox") {
      state.primitiveType = "box";
      state.modelName = "Caixa Cartão Kraft";
      state.mmW = 73; state.mmH = 87; state.mmD = 23;
      state.dimW = 1.46; state.dimH = 1.74; state.dimD = 0.46;
      state.debossSeven = false;
      state.mesh = buildBoxMesh(1.46, 1.74, 0.46);
    } else if (variantId === "primCube") {
      state.primitiveType = "cube";
      state.modelName = "Cubo Técnico";
      state.mmW = 60; state.mmH = 60; state.mmD = 60;
      state.dimW = 1.25; state.dimH = 1.25; state.dimD = 1.25;
      state.debossSeven = false;
      state.mesh = buildBoxMesh(1.25, 1.25, 1.25);
    } else if (variantId === "primCylinder") {
      state.primitiveType = "cylinder";
      state.modelName = "Frasco Cilíndrico 100ml";
      state.mmW = 52; state.mmH = 95; state.mmD = 52;
      state.debossSeven = false;
      state.mesh = buildCylinderMesh(0.62, 1.78, 18);
    } else if (variantId === "cadExtrudePlus") {
      state.mmD += 4;
      state.dimD = Math.min(2.2, +(state.dimD + 0.14).toFixed(2));
      state.mesh = buildBoxMesh(state.dimW, state.dimH, state.dimD);
    } else if (variantId === "cadExtrudeMinus") {
      state.mmD = Math.max(8, state.mmD - 4);
      state.dimD = Math.max(0.2, +(state.dimD - 0.14).toFixed(2));
      state.mesh = buildBoxMesh(state.dimW, state.dimH, state.dimD);
    } else if (variantId === "cadEdgeFillet") {
      state.mesh = subdivideQuadMesh(state.mesh);
      state.mesh.verts = state.mesh.verts.map(([x, y, z]) => [x * 0.94, y * 0.94, z * 0.94]);
    } else if (variantId === "cadDebossSeven") {
      state.debossSeven = !state.debossSeven;
    } else if (variantId === "cadToggleDims") {
      state.showDimensions = !state.showDimensions;
    } else if (variantId === "cadViewIso") {
      state.rotX = -0.36; state.rotY = 0.54;
    } else if (variantId === "cadViewFront") {
      state.rotX = 0; state.rotY = 0;
    } else if (variantId === "cadScaleUp") {
      state.scale = Math.min(2.0, +(state.scale + 0.12).toFixed(2));
    } else if (variantId === "ioImportObj") {
      const inp = document.createElement("input");
      inp.type = "file";
      inp.accept = ".obj,.stl,.glb,.gltf";
      inp.onchange = async () => {
        const file = inp.files?.[0];
        if (!file) return;
        state.modelName = file.name;
        state.debossSeven = false;
        if (file.name.toLowerCase().endsWith(".obj")) {
          state.mesh = parseObjText(await file.text());
        } else {
          state.mesh = buildBoxMesh(1.45, 1.45, 0.75);
        }
        syncWithCore();
      };
      inp.click();
    } else if (variantId === "ioExportObj") {
      exportMeshToObj(state.mesh, state.modelName);
    }

    // 2. HARD SURFACE
    if (variantId === "hsSelObject") state.hsSelectMode = "object";
    else if (variantId === "hsSelFaces") state.hsSelectMode = "faces";
    else if (variantId === "hsSelEdges") state.hsSelectMode = "edges";
    else if (variantId === "hsSelVertices") state.hsSelectMode = "vertices";
    else if (variantId === "hsSubdivideMesh") {
      if (state.mesh.faces.length < 700) state.mesh = subdivideQuadMesh(state.mesh);
    } else if (variantId === "hsBevelPoly") {
      state.mesh = subdivideQuadMesh(state.mesh);
      state.mesh.verts = state.mesh.verts.map(([x, y, z]) => [x * 0.92, y * 0.95, z * 0.92]);
    } else if (variantId === "hsToggleGizmo") {
      state.showGizmo = !state.showGizmo;
    } else if (variantId === "hsTaperTop") {
      state.mesh.verts = state.mesh.verts.map(([x, y, z]) => {
        const factor = y < 0 ? 0.82 : 1.04;
        return [x * factor, y, z * factor];
      });
    } else if (variantId === "hsTwistMesh") {
      state.mesh.verts = state.mesh.verts.map(([x, y, z]) => {
        const ang = y * 0.35;
        return [x * Math.cos(ang) - z * Math.sin(ang), y, x * Math.sin(ang) + z * Math.cos(ang)];
      });
    } else if (variantId === "hsResetTopo") {
      state.mesh = subdivideQuadMesh(buildBoxMesh(1.38, 1.56, 0.62));
    }

    // 3. ESCULTURA
    if (["brushClay", "brushInflate", "brushCarve", "brushSmooth"].includes(variantId)) {
      state.sculpt.brush = variantId;
    } else if (variantId === "sculptSphereBase") {
      state.mesh = buildSculptSphereMesh(1.06, 15, 24);
    } else if (variantId === "sculptSoapOrganic") {
      state.mesh = subdivideQuadMesh(subdivideQuadMesh(buildBoxMesh(1.4, 1.68, 0.48)));
    } else if (variantId === "sculptRotate90") {
      state.rotY += Math.PI / 4;
    } else if (variantId === "scRadiusUp") {
      state.sculpt.radius = Math.min(88, state.sculpt.radius + 12);
    } else if (variantId === "scRadiusDown") {
      state.sculpt.radius = Math.max(16, state.sculpt.radius - 12);
    } else if (variantId === "scSymmetryToggle") {
      state.sculpt.symmetryX = !state.sculpt.symmetryX;
    }

    // 4. RENDERIZAÇÃO
    if (variantId === "rtTraceNow") {
      runRayTracer();
    } else if (variantId === "rtToggleSamples") {
      state.renderEngine.highSamples = !state.renderEngine.highSamples;
      runRayTracer();
    } else if (variantId === "rtExportRenderPng") {
      runRayTracer();
      const a = document.createElement("a");
      a.href = rtCanvas.toDataURL("image/png");
      a.download = "robles-cycles-raytrace.png";
      a.click();
    } else if (variantId === "shSageMatte") {
      state.renderEngine.materialHex = "#84987E";
      state.renderEngine.roughness = 0.72;
      runRayTracer();
    } else if (variantId === "shAmberGlass") {
      state.renderEngine.materialHex = "#7A4824";
      state.renderEngine.roughness = 0.12;
      runRayTracer();
    } else if (variantId === "shApothecaryBeige") {
      state.renderEngine.materialHex = "#CEC8B8";
      state.renderEngine.roughness = 0.55;
      runRayTracer();
    } else if (variantId === "shBrushedGold") {
      state.renderEngine.materialHex = "#C9A25B";
      state.renderEngine.roughness = 0.22;
      runRayTracer();
    } else if (variantId === "hdriStudioWarm") {
      state.renderEngine.hdri = "warm";
      runRayTracer();
    } else if (variantId === "hdriDramaticNoir") {
      state.renderEngine.hdri = "noir";
      runRayTracer();
    } else if (variantId === "rtCameraTurntable") {
      state.rotY += Math.PI / 6;
      runRayTracer();
    }

    CORE()?.recordHistory?.("3d", `${fam.label} → ${variant.label}`);
    renderAll3DBars();
    syncWithCore();
  }

  // =========================================================================
  // MOTOR RAY-TRACING (Blender Cycles)
  // =========================================================================
  function hexToRgb(hex) {
    const num = parseInt(hex.replace("#", ""), 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }

  function runRayTracer() {
    const step = state.renderEngine.highSamples ? 1 : 2;
    const imgData = rtCtx.createImageData(RT_W, RT_H);
    const data = imgData.data;

    const [mr, mg, mb] = hexToRgb(state.renderEngine.materialHex);
    const rough = state.renderEngine.roughness;
    const isNoir = state.renderEngine.hdri === "noir";

    const lx = -0.52, ly = -0.68, lz = 0.51;
    const cy = Math.cos(state.rotY), sy = Math.sin(state.rotY);

    const rx = 0.72 * state.scale;
    const ry = 0.86 * state.scale;
    const rz = (state.primitiveType === "cylinder" ? 0.65 : Math.max(0.28, state.dimD * 0.65)) * state.scale;

    for (let py = 0; py < RT_H; py += step) {
      for (let px = 0; px < RT_W; px += step) {
        const u = ((px / RT_W) * 2 - 1) * (RT_W / RT_H);
        const v = (py / RT_H) * 2 - 1;

        let rox = 0, roy = -0.25, roz = 3.2;
        let rdx = u * 0.58, rdy = v * 0.58 + 0.08, rdz = -1.0;
        const rLen = Math.hypot(rdx, rdy, rdz);
        rdx /= rLen; rdy /= rLen; rdz /= rLen;

        const rRox = rox * cy + roz * sy;
        const rRoz = -rox * sy + roz * cy;
        const rRdx = rdx * cy + rdz * sy;
        const rRdz = -rdx * sy + rdz * cy;

        let hitT = Infinity, nx = 0, ny = 0, nz = 0, hitType = "bg";

        if (rdy > 0.001) {
          const tFloor = (0.92 - roy) / rdy;
          if (tFloor > 0 && tFloor < hitT) {
            hitT = tFloor; nx = 0; ny = -1; nz = 0; hitType = "floor";
          }
        }

        if (state.primitiveType === "cylinder") {
          const ocx = rRox / rx, ocy = roy / ry, ocz = rRoz / rz;
          const ddx = rRdx / rx, ddy = rdy / ry, ddz = rRdz / rz;
          const a = ddx * ddx + ddy * ddy + ddz * ddz;
          const b = 2 * (ocx * ddx + ocy * ddy + ocz * ddz);
          const c = ocx * ocx + ocy * ocy + ocz * ocz - 1;
          const disc = b * b - 4 * a * c;
          if (disc > 0) {
            const tObj = (-b - Math.sqrt(disc)) / (2 * a);
            if (tObj > 0 && tObj < hitT) {
              hitT = tObj; hitType = "obj";
              const hx = rRox + rRdx * tObj, hy = roy + rdy * tObj, hz = rRoz + rRdz * tObj;
              nx = hx / (rx * rx); ny = hy / (ry * ry); nz = hz / (rz * rz);
              const nLen = Math.hypot(nx, ny, nz) || 1;
              nx /= nLen; ny /= nLen; nz /= nLen;
            }
          }
        } else {
          const invX = 1 / (rRdx || 1e-6), invY = 1 / (rdy || 1e-6), invZ = 1 / (rRdz || 1e-6);
          const t1 = (-rx - rRox) * invX, t2 = (rx - rRox) * invX;
          const t3 = (-ry - roy) * invY, t4 = (ry - roy) * invY;
          const t5 = (-rz - rRoz) * invZ, t6 = (rz - rRoz) * invZ;
          const tmin = Math.max(Math.min(t1, t2), Math.min(t3, t4), Math.min(t5, t6));
          const tmax = Math.min(Math.max(t1, t2), Math.max(t3, t4), Math.max(t5, t6));
          if (tmax >= 0 && tmin <= tmax && tmin > 0 && tmin < hitT) {
            hitT = tmin; hitType = "obj";
            const eps = 1e-3;
            const hx = rRox + rRdx * tmin, hy = roy + rdy * tmin, hz = rRoz + rRdz * tmin;
            if (Math.abs(hx - rx) < eps) { nx = 1; ny = 0; nz = 0; }
            else if (Math.abs(hx + rx) < eps) { nx = -1; ny = 0; nz = 0; }
            else if (Math.abs(hy - ry) < eps) { nx = 0; ny = 1; nz = 0; }
            else if (Math.abs(hy + ry) < eps) { nx = 0; ny = -1; nz = 0; }
            else if (Math.abs(hz - rz) < eps) { nx = 0; ny = 0; nz = 1; }
            else { nx = 0; ny = 0; nz = -1; }
          }
        }

        let rCol = 0, gCol = 0, bCol = 0;
        if (hitType === "bg") {
          const grad = 1 - Math.abs(v) * 0.28;
          rCol = (isNoir ? 24 : 44) * grad;
          gCol = (isNoir ? 22 : 40) * grad;
          bCol = (isNoir ? 22 : 38) * grad;
        } else if (hitType === "floor") {
          const fx = rRox + rRdx * hitT, fz = rRoz + rRdz * hitT;
          const distCenter = Math.hypot(fx, fz);
          const shadowSoft = distCenter < 1.35 ? 0.45 + (distCenter / 1.35) * 0.55 : 1.0;
          const fade = Math.max(0.18, 1 - distCenter * 0.14);
          rCol = (isNoir ? 52 : 210) * shadowSoft * fade;
          gCol = (isNoir ? 48 : 204) * shadowSoft * fade;
          bCol = (isNoir ? 48 : 190) * shadowSoft * fade;
        } else {
          const diff = Math.max(0.15, nx * lx + ny * ly + nz * lz);
          const hx = lx - rRdx, hy = ly - rdy, hz = lz - rRdz;
          const hLen = Math.hypot(hx, hy, hz) || 1;
          const ndoth = Math.max(0, (nx * hx + ny * hy + nz * hz) / hLen);
          const spec = Math.pow(ndoth, Math.max(4, (1 - rough) * 64)) * (1 - rough * 0.72) * 175;
          const rim = Math.pow(1 - Math.abs(nx * rRdx + ny * rdy + nz * rRdz), 2.2) * (isNoir ? 85 : 42);
          rCol = Math.min(255, mr * diff + spec + rim);
          gCol = Math.min(255, mg * diff + spec + rim);
          bCol = Math.min(255, mb * diff + spec + rim);
        }

        for (let dy = 0; dy < step && py + dy < RT_H; dy++) {
          for (let dx = 0; dx < step && px + dx < RT_W; dx++) {
            const idx = ((py + dy) * RT_W + (px + dx)) * 4;
            data[idx] = rCol; data[idx + 1] = gCol; data[idx + 2] = bCol; data[idx + 3] = 255;
          }
        }
      }
    }
    rtCtx.putImageData(imgData, 0, 0);
    state.renderEngine.needsTrace = false;
  }

  // =========================================================================
  // BARRAS SUPERIOR DIREITA, ESQUERDA E DIREITA
  // =========================================================================
  function renderTopRightSubmodes() {
    const vectorTopRight = document.querySelector(".hud-top-right:not(#d3-hud-top-right):not(#video-hud-top-right):not(#pixel-hud-top-right)");
    const videoTopRight = document.getElementById("video-hud-top-right");
    const pixelTopRight = document.getElementById("pixel-hud-top-right");
    let d3TopRight = document.getElementById("d3-hud-top-right");
    const is3DActive = CORE()?.state?.activeArea === "3d";

    if (!is3DActive) {
      if (d3TopRight) d3TopRight.style.display = "none";
      if (vectorTopRight && CORE()?.state?.activeArea === "vector") {
        vectorTopRight.style.display = "inline-flex";
      }
      return;
    }

    if (vectorTopRight) vectorTopRight.style.display = "none";
    if (videoTopRight) videoTopRight.style.display = "none";
    if (pixelTopRight) pixelTopRight.style.display = "none";

    if (!d3TopRight) {
      d3TopRight = document.createElement("nav");
      d3TopRight.id = "d3-hud-top-right";
      d3TopRight.className = "hud-pill hud-top-right";
      document.querySelector(".viewport, .studio-shell, body")?.appendChild(d3TopRight);
    }

    const mobile = CORE()?.isMobile?.() || window.innerWidth <= 768;
    d3TopRight.style.cssText = `
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

    d3TopRight.innerHTML = D3_SUBMODES.map(
      (mode) => `
        <button
          type="button"
          class="tool-btn ${state.submode === mode.id ? "is-active" : ""}"
          data-d3-submode="${mode.id}"
          title="${mode.label}"
        >${mode.icon}</button>
      `
    ).join("");

    d3TopRight.querySelectorAll("[data-d3-submode]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        set3DSubmode(btn.dataset.d3Submode);
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

    const families = getFamilies();
    leftBar.innerHTML = families
      .map((fam) => {
        const activeVar = getActiveVariantForFamily(fam);
        const isSelected = state.activeFamilyBySubmode[state.submode] === fam.id;
        return `
          <button
            type="button"
            class="tool-btn ${isSelected ? "is-active" : ""}"
            data-d3-family="${fam.id}"
            title="${fam.label} · ${activeVar.label}"
            style="position:relative; flex-shrink:0; scroll-snap-align:center;"
          >
            ${activeVar.icon}
            ${fam.variants.length > 1 ? `<span style="position:absolute;right:3px;bottom:3px;width:0;height:0;border-left:4px solid transparent;border-bottom:4px solid currentColor;opacity:0.65;"></span>` : ""}
          </button>
        `;
      })
      .join("");

    leftBar.querySelectorAll("[data-d3-family]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        selectFamily(btn.dataset.d3Family);
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
            data-d3-variant="${v.id}"
            title="${v.label}"
          >${v.icon}</button>
        `
      )
      .join("");

    rightBar.querySelectorAll("[data-d3-variant]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        selectVariant(btn.dataset.d3Variant);
      });
    });
  }

  function renderAll3DBars() {
    renderTopRightSubmodes();
    renderLeftPrimaryBar();
    renderSecondaryRightBar();
  }

  // =========================================================================
  // RENDERIZAÇÃO DA ÁREA DE TRABALHO REAL POR CONTEXTO
  // =========================================================================
  function projectPoint([x, y, z], cx, sx, cy, sy, scale) {
    const sx1 = x * scale, sy1 = y * scale, sz1 = z * scale;
    const x1 = sx1 * cy - sz1 * sy;
    const z1 = sx1 * sy + sz1 * cy;
    const y2 = sy1 * cx - z1 * sx;
    const z2 = sy1 * sx + z1 * cx;
    const fov = 350 / (4.3 + z2);
    return { px: x1 * fov, py: y2 * fov, z: z2 };
  }

  function render3DViewport(ctx) {
    // -----------------------------------------------------------------------
    // CONTEXTO 4: RENDERIZAÇÃO (Estúdio Escuro + Ray-Tracing + Safe Frames)
    // -----------------------------------------------------------------------
    if (state.submode === "renderizacao") {
      if (state.renderEngine.needsTrace) runRayTracer();
      ctx.save();
      // Fundo de estúdio fotográfico
      ctx.fillStyle = "#181616";
      ctx.fillRect(-260, -190, 520, 380);

      // Quadro Ray-Traced
      ctx.drawImage(rtCanvas, -RT_W / 2, -RT_H / 2, RT_W, RT_H);

      // Guias de Câmera / Safe Frames (Regra dos Terços)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
      ctx.lineWidth = 1;
      ctx.strokeRect(-RT_W / 2 + 18, -RT_H / 2 + 14, RT_W - 36, RT_H - 28);
      ctx.beginPath();
      ctx.moveTo(-RT_W / 6, -RT_H / 2); ctx.lineTo(-RT_W / 6, RT_H / 2);
      ctx.moveTo(RT_W / 6, -RT_H / 2);  ctx.lineTo(RT_W / 6, RT_H / 2);
      ctx.stroke();

      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-RT_W / 2, -RT_H / 2, RT_W, RT_H);

      ctx.fillStyle = "#e5e0d5";
      ctx.font = "600 10px monospace";
      ctx.textAlign = "center";
      ctx.fillText(
        `CYCLES RAY-TRACING · ${state.renderEngine.highSamples ? "FINAL 2X" : "PREVIEW 1X"} · ROUGH ${state.renderEngine.roughness}`,
        0,
        -RT_H / 2 - 12
      );
      ctx.restore();
      return;
    }

    const cx = Math.cos(state.rotX), sx = Math.sin(state.rotX);
    const cy = Math.cos(state.rotY), sy = Math.sin(state.rotY);

    ctx.save();

    // -----------------------------------------------------------------------
    // FUNDO E AMBIENTE ESPECÍFICO DE CADA CONTEXTO
    // -----------------------------------------------------------------------
    if (state.submode === "hardsurface") {
      // Viewport técnico escuro estilo Valence3D
      ctx.fillStyle = "#1e1f24";
      ctx.fillRect(-260, -190, 520, 380);
    } else if (state.submode === "escultura") {
      // Bancada de escultura com vinheta suave estilo Nomad Sculpt
      const bgGrad = ctx.createRadialGradient(0, 0, 30, 0, 0, 260);
      bgGrad.addColorStop(0, "#3a3533");
      bgGrad.addColorStop(1, "#221f1e");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(-260, -190, 520, 380);
    }

    // Grade Espacial adaptada ao tema claro (Paramétricos) ou escuro (Hard Surface / Escultura)
    const isDarkViewport = state.submode === "hardsurface" || state.submode === "escultura";
    ctx.strokeStyle = isDarkViewport ? "rgba(255, 255, 255, 0.08)" : "rgba(61, 45, 45, 0.15)";
    ctx.lineWidth = 1;
    for (let g = -1.6; g <= 1.601; g += 0.4) {
      const a1 = projectPoint([g, 0.95, -1.6], cx, sx, cy, sy, 1);
      const a2 = projectPoint([g, 0.95, 1.6], cx, sx, cy, sy, 1);
      ctx.beginPath(); ctx.moveTo(a1.px, a1.py); ctx.lineTo(a2.px, a2.py); ctx.stroke();

      const b1 = projectPoint([-1.6, 0.95, g], cx, sx, cy, sy, 1);
      const b2 = projectPoint([1.6, 0.95, g], cx, sx, cy, sy, 1);
      ctx.beginPath(); ctx.moveTo(b1.px, b1.py); ctx.lineTo(b2.px, b2.py); ctx.stroke();
    }

    // Eixo de Simetria Espelhada visível no modo ESCULTURA
    if (state.submode === "escultura" && state.sculpt.symmetryX) {
      const symTop = projectPoint([0, -1.25, 0], cx, sx, cy, sy, 1);
      const symBot = projectPoint([0, 1.15, 0], cx, sx, cy, sy, 1);
      ctx.strokeStyle = "rgba(245, 158, 11, 0.55)";
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(symTop.px, symTop.py); ctx.lineTo(symBot.px, symBot.py); ctx.stroke();
      ctx.setLineDash([]);
    }

    // Projeção da Malha 3D
    const { verts, faces } = state.mesh;
    const projected = verts.map((v) => projectPoint(v, cx, sx, cy, sy, state.scale));

    const sortedFaces = faces
      .map((f, idx) => ({
        f,
        idx,
        avgZ: f.reduce((acc, vIdx) => acc + (projected[vIdx]?.z || 0), 0) / f.length,
      }))
      .sort((a, b) => b.avgZ - a.avgZ);

    const fillPalette =
      state.submode === "escultura"
        ? "#b98e78" // MatCap Argila Terracota
        : state.submode === "hardsurface"
        ? "#64748b" // Cinza Poligonal Técnico
        : "#84987E"; // Sálvia Paramétrico SolidCraft

    sortedFaces.forEach(({ f, idx }) => {
      if (f.length < 3) return;
      ctx.beginPath();
      f.forEach((vIdx, k) => {
        const pt = projected[vIdx];
        if (!pt) return;
        if (k === 0) ctx.moveTo(pt.px, pt.py);
        else ctx.lineTo(pt.px, pt.py);
      });
      ctx.closePath();

      const shade = 0.72 + (idx % 5) * 0.05;
      ctx.fillStyle = fillPalette;
      ctx.globalAlpha = Math.min(1, shade);
      ctx.fill();
      ctx.globalAlpha = 1;

      if (state.submode === "hardsurface") {
        ctx.strokeStyle =
          state.hsSelectMode === "faces" || state.hsSelectMode === "edges" ? "#f59e0b" : "#cbd5e1";
        ctx.lineWidth = state.hsSelectMode === "edges" ? 1.5 : 0.9;
        ctx.stroke();
      } else if (state.submode === "escultura") {
        ctx.strokeStyle = "rgba(61, 45, 45, 0.16)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      } else {
        ctx.strokeStyle = "#3d2d2d";
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }

      // Baixo-relevo '7' exclusivo do contexto Paramétrico
      if (state.submode === "parametricos" && state.debossSeven && idx === 1 && f.length === 4) {
        const p0 = projected[f[0]], p1 = projected[f[1]], p2 = projected[f[2]], p3 = projected[f[3]];
        if (p0 && p1 && p2 && p3) {
          const midX = (p0.px + p1.px + p2.px + p3.px) / 4;
          const midY = (p0.py + p1.py + p2.py + p3.py) / 4;
          ctx.save();
          ctx.strokeStyle = "rgba(61, 45, 45, 0.55)";
          ctx.lineWidth = 1.5;
          ctx.strokeRect(midX - 24 * state.scale, midY - 30 * state.scale, 48 * state.scale, 60 * state.scale);
          ctx.fillStyle = "rgba(61, 45, 45, 0.75)";
          ctx.font = `700 ${Math.round(20 * state.scale)}px system-ui, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("7", midX, midY + 2);
          ctx.restore();
        }
      }
    });

    // -----------------------------------------------------------------------
    // OVERLAYS INTERATIVOS ESPECÍFICOS DE CADA ÁREA DE TRABALHO
    // -----------------------------------------------------------------------
    // A) Cotas Dimensionais em mm no contexto PARAMÉTRICOS
    if (state.submode === "parametricos" && state.showDimensions) {
      ctx.save();
      ctx.strokeStyle = "#c0392b";
      ctx.fillStyle = "#c0392b";
      ctx.lineWidth = 1;
      ctx.font = "600 10px monospace";
      ctx.textAlign = "center";
      ctx.beginPath();
      ctx.moveTo(-75, 118); ctx.lineTo(75, 118);
      ctx.moveTo(-75, 113); ctx.lineTo(-75, 123);
      ctx.moveTo(75, 113); ctx.lineTo(75, 123);
      ctx.stroke();
      ctx.fillText(`L: ${state.mmW}mm · A: ${state.mmH}mm · P: ${state.mmD}mm`, 0, 132);
      ctx.restore();
    }

    // B) Vértices e Gizmo 3D no contexto HARD SURFACE
    if (state.submode === "hardsurface") {
      if (state.hsSelectMode === "vertices") {
        ctx.fillStyle = "#f59e0b";
        projected.forEach((pt) => {
          ctx.beginPath(); ctx.arc(pt.px, pt.py, 2.8, 0, Math.PI * 2); ctx.fill();
        });
      }
      if (state.showGizmo) {
        const o = projectPoint([0, 0, 0], cx, sx, cy, sy, 1);
        const gx = projectPoint([0.65, 0, 0], cx, sx, cy, sy, 1);
        const gy = projectPoint([0, -0.65, 0], cx, sx, cy, sy, 1);
        const gz = projectPoint([0, 0, 0.65], cx, sx, cy, sy, 1);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#ef4444"; ctx.beginPath(); ctx.moveTo(o.px, o.py); ctx.lineTo(gx.px, gx.py); ctx.stroke();
        ctx.strokeStyle = "#22c55e"; ctx.beginPath(); ctx.moveTo(o.px, o.py); ctx.lineTo(gy.px, gy.py); ctx.stroke();
        ctx.strokeStyle = "#3b82f6"; ctx.beginPath(); ctx.moveTo(o.px, o.py); ctx.lineTo(gz.px, gz.py); ctx.stroke();
      }
    }

    // C) Anel dinâmico do pincel seguindo o ponteiro no contexto ESCULTURA
    if (state.submode === "escultura" && state.sculpt.hasCursor) {
      ctx.save();
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(state.sculpt.cursorX, state.sculpt.cursorY, state.sculpt.radius, 0, Math.PI * 2);
      ctx.stroke();
      if (state.sculpt.symmetryX) {
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(-state.sculpt.cursorX, state.sculpt.cursorY, state.sculpt.radius, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    // HUD Superior Contextual
    ctx.fillStyle = isDarkViewport ? "#f1f5f9" : "rgba(61, 45, 45, 0.85)";
    ctx.font = "600 10px monospace";
    ctx.textAlign = "center";
    const hudTitle =
      state.submode === "parametricos"
        ? `SOLIDCRAFT CAD · ${state.modelName} (${state.mmW}×${state.mmH}×${state.mmD}mm)`
        : state.submode === "hardsurface"
        ? `VALENCE3D HARD SURFACE · ${state.mesh.faces.length} POLYS · MODO ${state.hsSelectMode.toUpperCase()}`
        : `NOMAD SCULPT · PINCEL ${state.sculpt.brush.replace("brush", "").toUpperCase()} · SIMETRIA ${state.sculpt.symmetryX ? "ON" : "OFF"}`;
    ctx.fillText(hudTitle, 0, -162);

    ctx.restore();
  }

    function applySculptStroke(pointerX, pointerY, penData = {}) {
    const cx = Math.cos(state.rotX), sx = Math.sin(state.rotX);
    const cy = Math.cos(state.rotY), sy = Math.sin(state.rotY);
    const { brush, radius, strength, symmetryX } = state.sculpt;

    // Se for caneta (Apple Pencil / Stylus), multiplica a intensidade pela pressão
    const pressureFactor =
      penData.pointerType === "pen"
        ? Math.max(0.15, (penData.pressure ?? 0.5) * 1.7)
        : 1;

    state.mesh.verts = state.mesh.verts.map(([vx, vy, vz]) => {
      const pt = projectPoint([vx, vy, vz], cx, sx, cy, sy, state.scale);
      const dist = Math.hypot(pt.px - pointerX, pt.py - pointerY);
      const symPt = symmetryX ? projectPoint([-vx, vy, vz], cx, sx, cy, sy, state.scale) : null;
      const distSym = symPt ? Math.hypot(symPt.px - pointerX, symPt.py - pointerY) : Infinity;

      const minDist = Math.min(dist, distSym);
      if (minDist > radius) return [vx, vy, vz];

      const falloff = Math.cos((minDist / radius) * (Math.PI / 2));
      const len = Math.hypot(vx, vy, vz) || 1;
      const nx = vx / len, ny = vy / len, nz = vz / len;

      if (brush === "brushClay" || brush === "brushInflate") {
        const amt = strength * pressureFactor * falloff;
        return [vx + nx * amt, vy + ny * amt, vz + nz * amt];
      }
      if (brush === "brushCarve") {
        const amt = strength * pressureFactor * falloff;
        return [vx - nx * amt, vy - ny * amt, vz - nz * amt];
      }
      if (brush === "brushSmooth") {
        const pull = 1 - 0.045 * pressureFactor * falloff;
        return [vx * pull, vy * pull, vz * pull];
      }
      return [vx, vy, vz];
    });
  }

  function handlePointerDown(x, y, penData = {}) {
    state.isDragging = true;
    state.lastX = x;
    state.lastY = y;
    if (state.submode === "escultura") {
      state.sculpt.cursorX = x;
      state.sculpt.cursorY = y;
      state.sculpt.hasCursor = true;
      applySculptStroke(x, y, penData);
      syncWithCore();
    }
  }

  function handlePointerMove(x, y, penData = {}) {
    if (state.submode === "escultura") {
      state.sculpt.cursorX = x;
      state.sculpt.cursorY = y;
      state.sculpt.hasCursor = true;
      if (state.isDragging) applySculptStroke(x, y, penData);
      syncWithCore();
      return;
    }
    if (!state.isDragging) return;
    state.rotY += (x - state.lastX) * 0.013;
    state.rotX += (y - state.lastY) * 0.013;
    state.lastX = x;
    state.lastY = y;
    if (state.submode === "renderizacao") {
      state.renderEngine.needsTrace = true;
    }
    syncWithCore();
  }


  function handlePointerDown(x, y) {
    state.isDragging = true;
    state.lastX = x;
    state.lastY = y;
    if (state.submode === "escultura") {
      state.sculpt.cursorX = x;
      state.sculpt.cursorY = y;
      state.sculpt.hasCursor = true;
      applySculptStroke(x, y);
      syncWithCore();
    }
  }

  function handlePointerMove(x, y) {
    if (state.submode === "escultura") {
      state.sculpt.cursorX = x;
      state.sculpt.cursorY = y;
      state.sculpt.hasCursor = true;
      if (state.isDragging) applySculptStroke(x, y);
      syncWithCore();
      return;
    }
    if (!state.isDragging) return;
    state.rotY += (x - state.lastX) * 0.013;
    state.rotX += (y - state.lastY) * 0.013;
    state.lastX = x;
    state.lastY = y;
    if (state.submode === "renderizacao") {
      state.renderEngine.needsTrace = true;
    }
    syncWithCore();
  }

  function handlePointerUp() {
    state.isDragging = false;
  }

  function hide3DOnlyUI() {
    const d3TopRight = document.getElementById("d3-hud-top-right");
    const vectorTopRight = document.querySelector(".hud-top-right:not(#d3-hud-top-right):not(#video-hud-top-right):not(#pixel-hud-top-right)");
    if (d3TopRight) d3TopRight.style.display = "none";
    if (vectorTopRight && CORE()?.state?.activeArea === "vector") {
      vectorTopRight.style.display = "inline-flex";
    }
  }

  const moduleApi = {
    onActivate() {
      state.submode = "parametricos";
      renderAll3DBars();
      syncWithCore();
    },
    onDeactivate() {
      hide3DOnlyUI();
    },
    renderBars: renderAll3DBars,
    renderNode(node, bCtx) {
      const w = bCtx.canvas.width, h = bCtx.canvas.height;
      bCtx.clearRect(0, 0, w, h);
      bCtx.save();
      bCtx.translate(w / 2, h / 2);
      render3DViewport(bCtx);
      bCtx.restore();
    },
    render(ctx, width, height) {
      ctx.save();
      ctx.translate(width / 2, height / 2);
      render3DViewport(ctx);
      ctx.restore();
    },
    onMouseDown: handlePointerDown,
    onMouseMove: handlePointerMove,
    onMouseUp: handlePointerUp,
  };

  window.RoblesCore?.registerModule?.("3d", moduleApi);
  window.RoblesStudio?.registerModule?.("3d", moduleApi);

  window.RoblesCore?.on?.("area:changed", (area) => {
    if (area === "3d") {
      state.submode = "parametricos";
      renderAll3DBars();
    } else {
      hide3DOnlyUI();
    }
  });

  if (window.RoblesCore?.state?.activeArea === "3d") {
    state.submode = "parametricos";
    renderAll3DBars();
  }
})();
