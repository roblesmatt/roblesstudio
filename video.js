(() => {
  const CORE = () => window.RoblesCore || window.RoblesStudio || null;

  // 1. Sub-Personas no canto superior direito exclusivas do módulo Vídeo (inicia direto em "clipe")
  const VIDEO_SUBMODES = [
    {
      id: "clipe",
      label: "Clipe · Edição Não-Linear (FilmCraft)",
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="7" y1="4" x2="7" y2="20"/><line x1="17" y1="4" x2="17" y2="20"/><line x1="2" y1="9" x2="7" y2="9"/><line x1="2" y1="15" x2="7" y2="15"/><line x1="17" y1="9" x2="22" y2="9"/><line x1="17" y1="15" x2="22" y2="15"/></svg>`,
    },
    {
      id: "motion",
      label: "Motion · Animação CSS, SVG & JS Inline",
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12 3 21 12 12 21 3 12"/><circle cx="12" cy="12" r="3"/></svg>`,
    },
    {
      id: "3d",
      label: "3D · Cena Espacial (GLB, OBJ, STL)",
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
    },
  ];

  // 2. Catálogo de Ferramentas por Sub-Modo (Clipe, Motion, 3D)
  const TOOL_FAMILIES_BY_SUBMODE = {
    clipe: [
      {
        id: "selectGroup",
        label: "1. Seleção & Trilha (V)",
        variants: [
          {
            id: "selectTool",
            label: "Ferramenta Seleção (V)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 3l14 9-6.5 1.5L10 20z"/></svg>`,
          },
          {
            id: "duplicateClip",
            label: "Duplicar Clipe Selecionado",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>`,
          },
        ],
      },
      {
        id: "razorGroup",
        label: "2. Lâmina & Corte (C)",
        variants: [
          {
            id: "razorSplit",
            label: "Dividir Clipe no Playhead (C)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/></svg>`,
          },
          {
            id: "trimStart",
            label: "Aparar Início até Playhead",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="5" y1="4" x2="5" y2="20"/><polyline points="14 8 10 12 14 16"/><line x1="10" y1="12" x2="20" y2="12"/></svg>`,
          },
          {
            id: "trimEnd",
            label: "Aparar Fim até Playhead",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="19" y1="4" x2="19" y2="20"/><polyline points="10 8 14 12 10 16"/><line x1="4" y1="12" x2="14" y2="12"/></svg>`,
          },
        ],
      },
      {
        id: "rippleGroup",
        label: "3. Ripple Delete (B)",
        variants: [
          {
            id: "rippleDelete",
            label: "Excluir & Fechar Lacuna",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 12h6"/></svg>`,
          },
        ],
      },
      {
        id: "keyframeGroup",
        label: "4. Keyframes de Vídeo (P)",
        variants: [
          {
            id: "addKeyframe",
            label: "Adicionar Keyframe de Zoom",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12 3 21 12 12 21 3 12"/></svg>`,
          },
          {
            id: "clearKeyframes",
            label: "Limpar Keyframes",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12 3 21 12 12 21 3 12" stroke-dasharray="2 2"/></svg>`,
          },
        ],
      },
      {
        id: "transformGroup",
        label: "5. Escala & Enquadramento",
        variants: [
          {
            id: "scaleUp",
            label: "Aumentar Escala (+10%)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`,
          },
          {
            id: "scaleDown",
            label: "Diminuir Escala (-10%)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`,
          },
          {
            id: "resetTransform",
            label: "Resetar 100%",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="5" width="16" height="14" rx="1.5"/><circle cx="12" cy="12" r="2"/></svg>`,
          },
        ],
      },
      {
        id: "titleGroup",
        label: "6. Títulos & Legendas (T)",
        variants: [
          {
            id: "addCenterTitle",
            label: "Título Central (V2)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 6h14M12 6v13M9 19h6"/></svg>`,
          },
          {
            id: "addLowerThird",
            label: "Legenda Inferior (Lower Third)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="6" y1="15" x2="15" y2="15"/></svg>`,
          },
        ],
      },
      {
        id: "transitionGroup",
        label: "7. Transições",
        variants: [
          {
            id: "transDissolve",
            label: "Cross Dissolve",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="10" height="14" rx="1"/><rect x="11" y="5" width="10" height="14" rx="1" fill="currentColor" fill-opacity="0.2"/></svg>`,
          },
          {
            id: "transFade",
            label: "Fade In / Out",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="4 18 12 6 20 18"/></svg>`,
          },
          {
            id: "transCut",
            label: "Corte Seco",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="12" y1="4" x2="12" y2="20"/></svg>`,
          },
        ],
      },
      {
        id: "colorLutGroup",
        label: "8. Color Grading & LUTs",
        variants: [
          {
            id: "lutNatural",
            label: "LUT Natural",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><circle cx="8.5" cy="15" r="4"/><circle cx="15.5" cy="15" r="4"/></svg>`,
          },
          {
            id: "lutWarm",
            label: "LUT Apothecary Warm",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="7" fill="#CEC8B8"/></svg>`,
          },
          {
            id: "lutSage",
            label: "LUT Sálvia Botânico",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="7" fill="#84987E"/></svg>`,
          },
          {
            id: "lutMono",
            label: "LUT Filme P&B",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="7"/><path d="M12 5a7 7 0 0 1 0 14z" fill="currentColor"/></svg>`,
          },
        ],
      },
      {
        id: "aspectGroup",
        label: "9. Proporção de Tela",
        variants: [
          {
            id: "aspect16x9",
            label: "16:9 Widescreen",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="6" width="20" height="12" rx="1.5"/></svg>`,
          },
          {
            id: "aspect9x16",
            label: "9:16 Vertical (Reels)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="6" y="2" width="12" height="20" rx="1.5"/></svg>`,
          },
          {
            id: "aspect1x1",
            label: "1:1 Quadrado",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="16" height="16" rx="1.5"/></svg>`,
          },
        ],
      },
      {
        id: "zoomTimelineGroup",
        label: "10. Zoom Timeline (Z)",
        variants: [
          {
            id: "tlZoomIn",
            label: "Aproximar Timeline (+)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`,
          },
          {
            id: "tlZoomOut",
            label: "Afastar Timeline (-)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`,
          },
        ],
      },
    ],

    motion: [
      {
        id: "motionInlineGroup",
        label: "1. Editor Inline (HTML / CSS / JS)",
        variants: [
          {
            id: "toggleInlineEditor",
            label: "Abrir / Fechar Editor Inline (SVG + CSS + JS)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
          },
          {
            id: "importMotionFile",
            label: "Importar Arquivo (.svg, .css, .js)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
          },
          {
            id: "exportMotionBundle",
            label: "Exportar Animação (.html Inline)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
          },
        ],
      },
      {
        id: "motionSvgGroup",
        label: "2. Vetor & Camada SVG",
        variants: [
          {
            id: "svgAddSeal",
            label: "SVG Selo Botânico N°07",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/></svg>`,
          },
          {
            id: "svgAddWave",
            label: "SVG Traço Orgânico / Path",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 14c4-7 14 7 18 0"/></svg>`,
          },
          {
            id: "svgAddBadge",
            label: "SVG Moldura Neo-Brutalista",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="5" width="16" height="14" rx="2"/></svg>`,
          },
        ],
      },
      {
        id: "motionCssGroup",
        label: "3. Presets CSS @keyframes",
        variants: [
          {
            id: "cssPulse",
            label: "CSS @keyframes Pulso Suave",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="9" stroke-dasharray="3 2"/></svg>`,
          },
          {
            id: "cssRotate",
            label: "CSS @keyframes Rotação Contínua",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>`,
          },
          {
            id: "cssFloat",
            label: "CSS @keyframes Levitação Vertical",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 4v16M8 8l4-4 4 4M8 16l4 4 4-4"/></svg>`,
          },
        ],
      },
      {
        id: "motionJsGroup",
        label: "4. Engine JS (requestAnimationFrame)",
        variants: [
          {
            id: "jsSpring",
            label: "JS Física Mola (Spring)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 18c2-12 4 12 6 0s4 12 6 0 4 12 4 0"/></svg>`,
          },
          {
            id: "jsOrbit",
            label: "JS Órbita Paramétrica",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(-25 12 12)"/><circle cx="18" cy="9" r="2" fill="currentColor"/></svg>`,
          },
          {
            id: "jsStrokeDraw",
            label: "JS Desenho Progressivo",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 17L10 7l5 8 5-9"/></svg>`,
          },
        ],
      },
      {
        id: "motionEasingGroup",
        label: "5. Curva de Easing",
        variants: [
          {
            id: "easeCubic",
            label: "cubic-bezier(0.22, 1, 0.36, 1)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 20C4 8 12 4 20 4"/><circle cx="4" cy="20" r="2"/><circle cx="20" cy="4" r="2"/></svg>`,
          },
          {
            id: "easeLinear",
            label: "linear",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="4" y1="20" x2="20" y2="4"/></svg>`,
          },
        ],
      },
    ],

    "3d": [
      {
        id: "d3ImportGroup",
        label: "1. Importar Modelo 3D (GLB / OBJ / STL)",
        variants: [
          {
            id: "import3DFile",
            label: "Importar Arquivo (.glb, .gltf, .obj, .stl)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
          },
          {
            id: "presetSoapBar",
            label: "Malha Sabonete 120g (70×84×23mm)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="4" width="14" height="16" rx="3"/><line x1="8" y1="8" x2="16" y2="8"/></svg>`,
          },
          {
            id: "presetBottle",
            label: "Malha Frasco Perfume / Difusor",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="7" y="8" width="10" height="13" rx="2"/><rect x="10" y="3" width="4" height="5"/></svg>`,
          },
          {
            id: "presetBox",
            label: "Malha Caixa Cartão (73×87×23mm)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`,
          },
        ],
      },
      {
        id: "d3OrbitGroup",
        label: "2. Câmera & Órbita 360°",
        variants: [
          {
            id: "orbitToggle",
            label: "Alternar Rotação Turntable 360°",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><ellipse cx="12" cy="12" rx="9" ry="4"/><path d="M12 3v18"/></svg>`,
          },
          {
            id: "camIso",
            label: "Vista Isométrica 3/4",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12 3 20 8 20 16 12 21 4 16 4 8"/></svg>`,
          },
          {
            id: "camFront",
            label: "Vista Frontal Ortográfica",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="5" width="14" height="14"/></svg>`,
          },
        ],
      },
      {
        id: "d3MaterialGroup",
        label: "3. Materiais PBR & Textura",
        variants: [
          {
            id: "matSage",
            label: "Material Sálvia Matte (#84987E)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="7" fill="#84987E"/></svg>`,
          },
          {
            id: "matKraft",
            label: "Material Papelão Apothecary (#CEC8B8)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="7" fill="#CEC8B8"/></svg>`,
          },
          {
            id: "matAmber",
            label: "Material Vidro Âmbar (#5C3A21)",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="7" fill="#5C3A21"/></svg>`,
          },
          {
            id: "matWireframe",
            label: "Alternar Wireframe / Malha",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12 3 20 8 20 16 12 21 4 16 4 8"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="4" y1="8" x2="20" y2="16"/></svg>`,
          },
        ],
      },
      {
        id: "d3LightGroup",
        label: "4. Iluminação de Estúdio",
        variants: [
          {
            id: "lightStudio",
            label: "Luz Suave de Estúdio",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2"/></svg>`,
          },
          {
            id: "lightDramatic",
            label: "Luz Lateral Dramática",
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3a9 9 0 1 0 9 9c0-4.97-4.03-9-9-9z"/></svg>`,
          },
        ],
      },
    ],
  };

  const DEFAULT_MOTION_INLINE = {
    svg: `<svg viewBox="0 0 240 240" width="220" height="220" xmlns="http://www.w3.org/2000/svg">
  <circle cx="120" cy="120" r="92" fill="#84987E" fill-opacity="0.25" stroke="#3d2d2d" stroke-width="2.5"/>
  <rect x="66" y="66" width="108" height="108" rx="16" fill="#CEC8B8" stroke="#3d2d2d" stroke-width="2"/>
  <text x="120" y="128" text-anchor="middle" font-family="system-ui" font-weight="700" font-size="34" fill="#3d2d2d">07</text>
</svg>`,
    css: `/* CSS @keyframes Inline */
@keyframes roblesFloat {
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-10px) scale(1.04); }
}
.motion-target {
  animation: roblesFloat 2.4s cubic-bezier(0.22, 1, 0.36, 1) infinite;
}`,
    js: `// JS Animation Hook (t = tempo em segundos)
function animate(t, state) {
  return {
    y: Math.sin(t * 2.6) * 12,
    rotation: Math.sin(t * 1.3) * 0.12,
    scale: 1 + Math.sin(t * 2.6) * 0.04
  };
}`,
  };

  function createBoxMesh(w = 1.4, h = 1.7, d = 0.48) {
    const hw = w / 2, hh = h / 2, hd = d / 2;
    const verts = [
      [-hw, -hh, -hd], [hw, -hh, -hd], [hw, hh, -hd], [-hw, hh, -hd],
      [-hw, -hh, hd],  [hw, -hh, hd],  [hw, hh, hd],  [-hw, hh, hd],
    ];
    const faces = [
      [0, 1, 2, 3],
      [4, 5, 6, 7],
      [0, 1, 5, 4],
      [2, 3, 7, 6],
      [0, 3, 7, 4],
      [1, 2, 6, 5],
    ];
    return { verts, faces };
  }

  function parseObjText(text) {
    const verts = [];
    const faces = [];
    text.split(/\r?\n/).forEach((line) => {
      const parts = line.trim().split(/\s+/);
      if (parts[0] === "v" && parts.length >= 4) {
        verts.push([parseFloat(parts[1]) || 0, -(parseFloat(parts[2]) || 0), parseFloat(parts[3]) || 0]);
      } else if (parts[0] === "f" && parts.length >= 4) {
        const idx = parts.slice(1).map((tok) => parseInt(tok.split("/")[0], 10) - 1).filter((n) => n >= 0);
        if (idx.length >= 3) faces.push(idx);
      }
    });
    if (!verts.length) return createBoxMesh();
    let maxAbs = 0.001;
    verts.forEach((v) => v.forEach((c) => { if (Math.abs(c) > maxAbs) maxAbs = Math.abs(c); }));
    const normVerts = verts.map((v) => v.map((c) => (c / maxAbs) * 1.35));
    return { verts: normVerts, faces: faces.slice(0, 1800) };
  }

  const state = {
    submode: "clipe",
    activeFamilyBySubmode: {
      clipe: "selectGroup",
      motion: "motionInlineGroup",
      "3d": "d3ImportGroup",
    },
    activeVariantByFamily: {
      selectGroup: "selectTool",
      razorGroup: "razorSplit",
      rippleGroup: "rippleDelete",
      keyframeGroup: "addKeyframe",
      transformGroup: "scaleUp",
      titleGroup: "addCenterTitle",
      transitionGroup: "transDissolve",
      colorLutGroup: "lutNatural",
      aspectGroup: "aspect16x9",
      zoomTimelineGroup: "tlZoomIn",
      motionInlineGroup: "toggleInlineEditor",
      motionSvgGroup: "svgAddSeal",
      motionCssGroup: "cssPulse",
      motionJsGroup: "jsSpring",
      motionEasingGroup: "easeCubic",
      d3ImportGroup: "import3DFile",
      d3OrbitGroup: "orbitToggle",
      d3MaterialGroup: "matSage",
      d3LightGroup: "lightStudio",
    },
    isPlaying: false,
    playhead: 2.0,
    duration: 24,
    pxPerSec: 34,
    lastFrameTs: 0,
    rafId: null,
    clipe: {
      aspectRatio: "16:9",
      lut: "none",
      selectedClipId: "clip-v1-1",
      clips: [
        {
          id: "clip-v2-1",
          track: "V2",
          type: "title",
          label: "TÍTULO · ATELIER N° 07",
          text: "ATELIER N° 07 · FORMULAÇÃO BOTÂNICA",
          subtext: "Coleção Artisanal 2026",
          style: "center",
          start: 1.0,
          duration: 6.5,
          scale: 1,
          transition: "dissolve",
        },
        {
          id: "clip-v1-1",
          track: "V1",
          type: "scene",
          label: "CENA 01 · Abertura Sálvia",
          bg: "#84987E",
          accent: "#CEC8B8",
          start: 0.0,
          duration: 8.0,
          scale: 1,
          transition: "dissolve",
          keyframes: [{ t: 0, scale: 1.0 }, { t: 8, scale: 1.12 }],
        },
        {
          id: "clip-v1-2",
          track: "V1",
          type: "scene",
          label: "CENA 02 · Textura Apothecary",
          bg: "#3d2d2d",
          accent: "#e0d4b9",
          start: 8.0,
          duration: 8.5,
          scale: 1,
          transition: "fade",
          keyframes: [],
        },
        {
          id: "clip-a1-1",
          track: "A1",
          type: "audio",
          label: "TRILHA · Ambient Minimal",
          start: 0.0,
          duration: 16.5,
        },
      ],
    },
    motion: {
      inlineOpen: false,
      activeCodeTab: "svg",
      svgCode: DEFAULT_MOTION_INLINE.svg,
      cssCode: DEFAULT_MOTION_INLINE.css,
      jsCode: DEFAULT_MOTION_INLINE.js,
      svgImage: null,
      presetCss: "pulse",
      presetJs: "spring",
      easing: "cubic",
      shapeMode: "seal",
      customFn: null,
    },
    d3: {
      modelName: "Sabonete Botânico 120g (70×84×23mm)",
      mesh: createBoxMesh(1.4, 1.7, 0.48),
      rotX: -0.38,
      rotY: 0.55,
      autoTurntable: true,
      wireframe: false,
      materialColor: "#84987E",
      lightMode: "studio",
      isDragging: false,
      lastX: 0,
      lastY: 0,
    },
  };

  function compileMotionInline() {
    try {
      const blob = new Blob([state.motion.svgCode], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        state.motion.svgImage = img;
        syncWithCore();
      };
      img.src = url;
    } catch (_) {}

    try {
      const fn = new Function(
        "t",
        "state",
        `${state.motion.jsCode}; return typeof animate === "function" ? animate(t, state) : null;`
      );
      state.motion.customFn = fn;
    } catch (_) {
      state.motion.customFn = null;
    }
  }
  compileMotionInline();

  function getFamilies() {
    return TOOL_FAMILIES_BY_SUBMODE[state.submode] || TOOL_FAMILIES_BY_SUBMODE.clipe;
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

  function getSelectedClip() {
    return state.clipe.clips.find((c) => c.id === state.clipe.selectedClipId) || state.clipe.clips[0] || null;
  }

  function formatTimecode(sec) {
    const s = Math.max(0, sec);
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    const frames = Math.floor((s - Math.floor(s)) * 24);
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(mins)}:${pad(secs)}:${pad(frames)}`;
  }

  function syncWithCore() {
    const core = CORE();
    if (!core) return;
    if (typeof core.invalidateNode === "function") core.invalidateNode("l-vid-frame");
    if (typeof core.emit === "function") core.emit("render:request");
    if (typeof core.render === "function") core.render();
  }

  function startPlaybackLoop() {
    if (state.rafId) return;
    state.lastFrameTs = performance.now();
    const tick = (now) => {
      if (!state.isPlaying) {
        state.rafId = null;
        return;
      }
      const dt = (now - state.lastFrameTs) / 1000;
      state.lastFrameTs = now;
      state.playhead += dt;
      if (state.playhead >= state.duration) state.playhead = 0;

      if (state.submode === "3d" && state.d3.autoTurntable) {
        state.d3.rotY += dt * 1.15;
      }

      updateTimelinePlayheadUI();
      syncWithCore();
      state.rafId = requestAnimationFrame(tick);
    };
    state.rafId = requestAnimationFrame(tick);
  }

  function togglePlay() {
    state.isPlaying = !state.isPlaying;
    if (state.isPlaying) startPlaybackLoop();
    renderTimelineDock();
    syncWithCore();
  }

  function setVideoSubmode(submodeId) {
    if (!TOOL_FAMILIES_BY_SUBMODE[submodeId]) return;
    state.submode = submodeId;
    if (submodeId !== "motion") state.motion.inlineOpen = false;
    const meta = VIDEO_SUBMODES.find((m) => m.id === submodeId);
    CORE()?.recordHistory?.("video", meta ? meta.label : submodeId);
    renderAllVideoBars();
    syncWithCore();
  }

  function splitClipAtPlayhead(targetClip) {
    const clip = targetClip || getSelectedClip();
    if (!clip) return;
    const t = state.playhead;
    if (t <= clip.start + 0.25 || t >= clip.start + clip.duration - 0.25) return;

    const firstDur = +(t - clip.start).toFixed(2);
    const secondDur = +(clip.duration - firstDur).toFixed(2);
    clip.duration = firstDur;

    const secondClip = {
      ...JSON.parse(JSON.stringify(clip)),
      id: `clip-${Date.now().toString(36)}`,
      label: `${clip.label} (Parte 2)`,
      start: +t.toFixed(2),
      duration: secondDur,
    };
    state.clipe.clips.push(secondClip);
    state.clipe.selectedClipId = secondClip.id;
    renderTimelineDock();
    syncWithCore();
  }

  function selectFamily(familyId) {
    const fam = getFamilies().find((f) => f.id === familyId);
    if (!fam) return;
    state.activeFamilyBySubmode[state.submode] = fam.id;
    renderAllVideoBars();
    syncWithCore();
  }

  function selectVariant(variantId) {
    const fam = getActiveFamily();
    const variant = fam.variants.find((v) => v.id === variantId);
    if (!variant) return;

    state.activeVariantByFamily[fam.id] = variant.id;
    const clip = getSelectedClip();

    if (variantId === "duplicateClip" && clip) {
      const copy = {
        ...JSON.parse(JSON.stringify(clip)),
        id: `clip-${Date.now().toString(36)}`,
        label: `${clip.label} (Cópia)`,
        start: Math.min(state.duration - clip.duration, +(clip.start + clip.duration).toFixed(2)),
      };
      state.clipe.clips.push(copy);
      state.clipe.selectedClipId = copy.id;
    } else if (variantId === "razorSplit") {
      splitClipAtPlayhead(clip);
    } else if (variantId === "trimStart" && clip && state.playhead > clip.start && state.playhead < clip.start + clip.duration - 0.3) {
      const diff = state.playhead - clip.start;
      clip.start = +state.playhead.toFixed(2);
      clip.duration = +(clip.duration - diff).toFixed(2);
    } else if (variantId === "trimEnd" && clip && state.playhead > clip.start + 0.3 && state.playhead < clip.start + clip.duration) {
      clip.duration = +(state.playhead - clip.start).toFixed(2);
    } else if (variantId === "rippleDelete" && clip) {
      const removedDur = clip.duration, removedStart = clip.start, track = clip.track;
      state.clipe.clips = state.clipe.clips.filter((c) => c.id !== clip.id);
      state.clipe.clips.forEach((c) => {
        if (c.track === track && c.start > removedStart) c.start = Math.max(0, +(c.start - removedDur).toFixed(2));
      });
      state.clipe.selectedClipId = state.clipe.clips[0]?.id || null;
    } else if (variantId === "addKeyframe" && clip) {
      clip.keyframes = clip.keyframes || [];
      clip.keyframes.push({ t: +(state.playhead - clip.start).toFixed(2), scale: +(clip.scale * 1.08).toFixed(2) });
    } else if (variantId === "clearKeyframes" && clip) {
      clip.keyframes = [];
    } else if (variantId === "scaleUp" && clip) {
      clip.scale = Math.min(2.5, +((clip.scale || 1) + 0.1).toFixed(2));
    } else if (variantId === "scaleDown" && clip) {
      clip.scale = Math.max(0.4, +((clip.scale || 1) - 0.1).toFixed(2));
    } else if (variantId === "resetTransform" && clip) {
      clip.scale = 1;
    } else if (variantId === "addCenterTitle" || variantId === "addLowerThird") {
      const txt = prompt("Texto do Título / Legenda:", variantId === "addLowerThird" ? "SABONETE SÁLVIA · 120G" : "ROBLES ATELIER");
      if (txt && txt.trim()) {
        const newTitle = {
          id: `clip-t-${Date.now().toString(36)}`,
          track: "V2",
          type: "title",
          label: `${variantId === "addLowerThird" ? "LEGENDA" : "TÍTULO"} · ${txt.slice(0, 14)}`,
          text: txt,
          subtext: "Edição FilmCraft",
          style: variantId === "addLowerThird" ? "lower" : "center",
          start: +state.playhead.toFixed(2),
          duration: 5.0,
          scale: 1,
          transition: "dissolve",
        };
        state.clipe.clips.push(newTitle);
        state.clipe.selectedClipId = newTitle.id;
      }
    } else if (variantId === "transDissolve" || variantId === "transFade" || variantId === "transCut") {
      if (clip) clip.transition = variantId.replace("trans", "").toLowerCase();
    } else if (variantId === "lutNatural") {
      state.clipe.lut = "none";
    } else if (variantId === "lutWarm") {
      state.clipe.lut = "warm";
    } else if (variantId === "lutSage") {
      state.clipe.lut = "sage";
    } else if (variantId === "lutMono") {
      state.clipe.lut = "mono";
    } else if (variantId === "aspect16x9") {
      state.clipe.aspectRatio = "16:9";
    } else if (variantId === "aspect9x16") {
      state.clipe.aspectRatio = "9:16";
    } else if (variantId === "aspect1x1") {
      state.clipe.aspectRatio = "1:1";
    } else if (variantId === "tlZoomIn") {
      state.pxPerSec = Math.min(80, state.pxPerSec + 10);
    } else if (variantId === "tlZoomOut") {
      state.pxPerSec = Math.max(16, state.pxPerSec - 10);
    }

    if (variantId === "toggleInlineEditor") {
      state.motion.inlineOpen = !state.motion.inlineOpen;
    } else if (variantId === "importMotionFile") {
      const inp = document.createElement("input");
      inp.type = "file";
      inp.accept = ".svg,.css,.js,image/svg+xml,text/css,text/javascript";
      inp.onchange = async () => {
        const file = inp.files?.[0];
        if (!file) return;
        const txt = await file.text();
        if (file.name.endsWith(".svg")) state.motion.svgCode = txt;
        else if (file.name.endsWith(".css")) state.motion.cssCode = txt;
        else if (file.name.endsWith(".js")) state.motion.jsCode = txt;
        compileMotionInline();
        state.motion.inlineOpen = true;
        renderMotionInlinePanel();
      };
      inp.click();
    } else if (variantId === "exportMotionBundle") {
      const htmlOut = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${state.motion.cssCode}</style></head><body style="display:grid;place-items:center;min-height:100vh;background:#CEC8B8;"><div class="motion-target">${state.motion.svgCode}</div><script>${state.motion.jsCode}</script></body></html>`;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([htmlOut], { type: "text/html" }));
      a.download = "robles-motion-inline.html";
      a.click();
    } else if (variantId === "svgAddSeal" || variantId === "svgAddWave" || variantId === "svgAddBadge") {
      state.motion.shapeMode = variantId.replace("svgAdd", "").toLowerCase();
      if (!state.isPlaying) togglePlay();
    } else if (variantId === "cssPulse" || variantId === "cssRotate" || variantId === "cssFloat") {
      state.motion.presetCss = variantId.replace("css", "").toLowerCase();
      if (!state.isPlaying) togglePlay();
    } else if (variantId === "jsSpring" || variantId === "jsOrbit" || variantId === "jsStrokeDraw") {
      state.motion.presetJs = variantId.replace("js", "").toLowerCase();
      if (!state.isPlaying) togglePlay();
    } else if (variantId === "easeCubic" || variantId === "easeLinear") {
      state.motion.easing = variantId.replace("ease", "").toLowerCase();
    }

    if (variantId === "import3DFile") {
      const inp = document.createElement("input");
      inp.type = "file";
      inp.accept = ".glb,.gltf,.obj,.stl";
      inp.onchange = async () => {
        const file = inp.files?.[0];
        if (!file) return;
        state.d3.modelName = file.name;
        if (file.name.toLowerCase().endsWith(".obj")) {
          const txt = await file.text();
          state.d3.mesh = parseObjText(txt);
        } else {
          state.d3.mesh = createBoxMesh(1.5, 1.5, 0.7);
        }
        syncWithCore();
      };
      inp.click();
    } else if (variantId === "presetSoapBar") {
      state.d3.modelName = "Sabonete Botânico 120g (70×84×23mm)";
      state.d3.mesh = createBoxMesh(1.4, 1.7, 0.48);
    } else if (variantId === "presetBottle") {
      state.d3.modelName = "Frasco Apothecary 100ml";
      state.d3.mesh = createBoxMesh(0.85, 1.85, 0.85);
    } else if (variantId === "presetBox") {
      state.d3.modelName = "Embalagem Cartão (73×87×23mm)";
      state.d3.mesh = createBoxMesh(1.46, 1.78, 0.52);
    } else if (variantId === "orbitToggle") {
      state.d3.autoTurntable = !state.d3.autoTurntable;
      if (state.d3.autoTurntable && !state.isPlaying) togglePlay();
    } else if (variantId === "camIso") {
      state.d3.rotX = -0.38;
      state.d3.rotY = 0.55;
    } else if (variantId === "camFront") {
      state.d3.rotX = 0;
      state.d3.rotY = 0;
    } else if (variantId === "matSage") {
      state.d3.materialColor = "#84987E";
    } else if (variantId === "matKraft") {
      state.d3.materialColor = "#CEC8B8";
    } else if (variantId === "matAmber") {
      state.d3.materialColor = "#6B4226";
    } else if (variantId === "matWireframe") {
      state.d3.wireframe = !state.d3.wireframe;
    } else if (variantId === "lightStudio") {
      state.d3.lightMode = "studio";
    } else if (variantId === "lightDramatic") {
      state.d3.lightMode = "dramatic";
    }

    renderAllVideoBars();
    syncWithCore();
  }

  // =========================================================================
  // BARRA SUPERIOR DIREITA EXCLUSIVA DO VÍDEO (Clipe > Motion > 3D)
  // Usa ID próprio (#video-hud-top-right) para NUNCA apagar o .hud-top-right do vetor.js
  // =========================================================================
  function renderTopRightSubmodes() {
    const vectorTopRight = document.querySelector(".hud-top-right:not(#video-hud-top-right)");
    let videoTopRight = document.getElementById("video-hud-top-right");
    const isVideoActive = CORE()?.state?.activeArea === "video";

    if (!isVideoActive) {
      if (videoTopRight) videoTopRight.style.display = "none";
      if (vectorTopRight && CORE()?.state?.activeArea === "vector") {
        vectorTopRight.style.display = "inline-flex";
      }
      return;
    }

    if (vectorTopRight) {
      vectorTopRight.style.display = "none";
    }

    if (!videoTopRight) {
      videoTopRight = document.createElement("nav");
      videoTopRight.id = "video-hud-top-right";
      videoTopRight.className = "hud-pill hud-top-right";
      document.querySelector(".viewport, .studio-shell, body")?.appendChild(videoTopRight);
    }

    const mobile = CORE()?.isMobile?.() || window.innerWidth <= 768;
    videoTopRight.style.cssText = `
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

    videoTopRight.innerHTML = VIDEO_SUBMODES.map(
      (mode) => `
        <button
          type="button"
          class="tool-btn ${state.submode === mode.id ? "is-active" : ""}"
          data-vid-submode="${mode.id}"
          title="${mode.label}"
        >${mode.icon}</button>
      `
    ).join("");

    videoTopRight.querySelectorAll("[data-vid-submode]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        setVideoSubmode(btn.dataset.vidSubmode);
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
      max-height: ${mobile ? "calc(100vh - 265px)" : "min(370px, calc(100vh - 280px))"};
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
            data-vid-family="${fam.id}"
            title="${fam.label} · ${activeVar.label}"
            style="position:relative; flex-shrink:0; scroll-snap-align:center;"
          >
            ${activeVar.icon}
            ${fam.variants.length > 1 ? `<span style="position:absolute;right:3px;bottom:3px;width:0;height:0;border-left:4px solid transparent;border-bottom:4px solid currentColor;opacity:0.65;"></span>` : ""}
          </button>
        `;
      })
      .join("");

    if (!leftBar.dataset.vidCarouselBound) {
      leftBar.dataset.vidCarouselBound = "true";
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

    leftBar.querySelectorAll("[data-vid-family]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (leftBar.dataset.justDragged === "true") return;
        selectFamily(btn.dataset.vidFamily);
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
            data-vid-variant="${v.id}"
            title="${v.label}"
          >${v.icon}</button>
        `
      )
      .join("");

    rightBar.querySelectorAll("[data-vid-variant]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        selectVariant(btn.dataset.vidVariant);
      });
    });
  }

  function renderMotionInlinePanel() {
    let panel = document.getElementById("motion-inline-editor");
    const visible = CORE()?.state?.activeArea === "video" && state.submode === "motion" && state.motion.inlineOpen;

    if (!visible) {
      if (panel) panel.style.display = "none";
      return;
    }

    if (!panel) {
      panel = document.createElement("div");
      panel.id = "motion-inline-editor";
      document.querySelector(".viewport, .studio-shell, body")?.appendChild(panel);
    }

    panel.style.cssText = `
      position: fixed;
      top: 66px;
      right: 64px;
      width: min(360px, calc(100vw - 128px));
      background: rgba(34, 26, 26, 0.95);
      color: #CEC8B8;
      border: 1.5px solid rgba(206, 200, 184, 0.35);
      border-radius: 12px;
      padding: 10px;
      z-index: 35;
      font-family: monospace;
      font-size: 11px;
    `;

    const tab = state.motion.activeCodeTab;
    const currentCode = tab === "svg" ? state.motion.svgCode : tab === "css" ? state.motion.cssCode : state.motion.jsCode;

    panel.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
        <div style="display:flex;gap:4px;">
          <button type="button" data-code-tab="svg" style="padding:3px 8px;border-radius:6px;border:1px solid #CEC8B8;background:${tab === "svg" ? "#CEC8B8" : "transparent"};color:${tab === "svg" ? "#3d2d2d" : "#CEC8B8"};font-weight:700;cursor:pointer;">SVG</button>
          <button type="button" data-code-tab="css" style="padding:3px 8px;border-radius:6px;border:1px solid #CEC8B8;background:${tab === "css" ? "#CEC8B8" : "transparent"};color:${tab === "css" ? "#3d2d2d" : "#CEC8B8"};font-weight:700;cursor:pointer;">CSS</button>
          <button type="button" data-code-tab="js" style="padding:3px 8px;border-radius:6px;border:1px solid #CEC8B8;background:${tab === "js" ? "#CEC8B8" : "transparent"};color:${tab === "js" ? "#3d2d2d" : "#CEC8B8"};font-weight:700;cursor:pointer;">JS</button>
        </div>
        <button type="button" id="motion-close-inline" style="background:transparent;border:none;color:#CEC8B8;font-size:14px;cursor:pointer;">✕</button>
      </div>
      <textarea id="motion-code-area" spellcheck="false" style="width:100%;height:145px;background:#1a1313;color:#f5f0e6;border:1px solid rgba(206,200,184,0.25);border-radius:8px;padding:8px;font-family:monospace;font-size:11px;resize:vertical;box-sizing:border-box;">${currentCode}</textarea>
      <div style="display:flex;justify-content:flex-end;margin-top:6px;">
        <button type="button" id="motion-apply-inline" style="padding:4px 12px;border-radius:6px;border:none;background:#84987E;color:#1a1313;font-weight:700;cursor:pointer;">Aplicar Inline</button>
      </div>
    `;

    panel.querySelectorAll("[data-code-tab]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        state.motion.activeCodeTab = btn.dataset.codeTab;
        renderMotionInlinePanel();
      });
    });

    panel.querySelector("#motion-close-inline")?.addEventListener("click", (e) => {
      e.stopPropagation();
      state.motion.inlineOpen = false;
      renderMotionInlinePanel();
    });

    panel.querySelector("#motion-apply-inline")?.addEventListener("click", (e) => {
      e.stopPropagation();
      const val = panel.querySelector("#motion-code-area")?.value || "";
      if (tab === "svg") state.motion.svgCode = val;
      else if (tab === "css") state.motion.cssCode = val;
      else state.motion.jsCode = val;
      compileMotionInline();
      syncWithCore();
    });
  }

  function renderTimelineDock() {
    let dock = document.getElementById("filmcraft-timeline");
    const isVideoActive = CORE()?.state?.activeArea === "video";

    if (!isVideoActive) {
      if (dock) dock.style.display = "none";
      return;
    }

    if (!dock) {
      dock = document.createElement("section");
      dock.id = "filmcraft-timeline";
      document.querySelector(".viewport, .studio-shell, body")?.appendChild(dock);
    }

    const mobile = CORE()?.isMobile?.() || window.innerWidth <= 768;
    const timelineWidth = Math.max(680, Math.round(state.duration * state.pxPerSec));
    const playheadX = Math.round(state.playhead * state.pxPerSec);

    dock.style.cssText = `
      position: fixed;
      left: ${mobile ? "10px" : "64px"};
      right: ${mobile ? "10px" : "64px"};
      bottom: ${mobile ? "54px" : "58px"};
      height: ${mobile ? "144px" : "156px"};
      background: rgba(206, 200, 184, 0.94);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1.5px solid rgba(61, 45, 45, 0.35);
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 28;
      color: #3d2d2d;
      font-family: system-ui, -apple-system, sans-serif;
      user-select: none;
    `;

    const ticksHtml = Array.from({ length: Math.floor(state.duration) + 1 }, (_, sec) => {
      const left = sec * state.pxPerSec;
      return `
        <div style="position:absolute;left:${left}px;top:0;bottom:0;border-left:1px solid rgba(61,45,45,${sec % 5 === 0 ? "0.4" : "0.16"});pointer-events:none;">
          ${sec % 2 === 0 ? `<span style="position:absolute;left:3px;top:2px;font-size:9px;font-family:monospace;opacity:0.75;">${sec}s</span>` : ""}
        </div>
      `;
    }).join("");

    let tracksBodyHtml = "";
    if (state.submode === "clipe") {
      const tracks = [
        { id: "V2", name: "V2 · Texto", h: 28 },
        { id: "V1", name: "V1 · Vídeo", h: 34 },
        { id: "A1", name: "A1 · Áudio", h: 26 },
      ];
      tracksBodyHtml = tracks
        .map((tr) => {
          const trackClips = state.clipe.clips.filter((c) => c.track === tr.id);
          const clipsHtml = trackClips
            .map((clip) => {
              const left = Math.round(clip.start * state.pxPerSec);
              const width = Math.max(24, Math.round(clip.duration * state.pxPerSec));
              const isSel = clip.id === state.clipe.selectedClipId;
              const bg = tr.id === "V2" ? "rgba(255,252,245,0.88)" : tr.id === "A1" ? "rgba(132,152,126,0.42)" : "rgba(61,45,45,0.86)";
              const fg = tr.id === "V1" ? "#f5f0e6" : "#3d2d2d";
              return `
                <div data-tl-clip="${clip.id}" style="position:absolute;left:${left}px;top:3px;width:${width}px;height:${tr.h - 6}px;background:${bg};color:${fg};border:${isSel ? "2px solid #f59e0b" : "1px solid rgba(61,45,45,0.45)"};border-radius:6px;padding:0 7px;display:flex;align-items:center;font-size:10px;font-weight:600;white-space:nowrap;overflow:hidden;cursor:grab;box-sizing:border-box;">
                  ${clip.label}
                </div>
              `;
            })
            .join("");
          return `
            <div style="display:flex;height:${tr.h}px;border-bottom:1px solid rgba(61,45,45,0.16);">
              <div style="width:78px;flex-shrink:0;padding:0 8px;display:flex;align-items:center;font-size:10px;font-weight:700;background:rgba(61,45,45,0.08);border-right:1px solid rgba(61,45,45,0.2);">${tr.name}</div>
              <div style="position:relative;width:${timelineWidth}px;height:100%;">${clipsHtml}</div>
            </div>
          `;
        })
        .join("");
    } else if (state.submode === "motion") {
      const mTracks = [
        { name: "SVG · Layer", label: `SVG (${state.motion.shapeMode.toUpperCase()})`, dur: 24, bg: "rgba(132,152,126,0.45)", fg: "#3d2d2d" },
        { name: "CSS · @key", label: `@keyframes (${state.motion.presetCss})`, dur: 24, bg: "rgba(61,45,45,0.86)", fg: "#f5f0e6" },
        { name: "JS · Engine", label: `animate(t) · ${state.motion.presetJs}`, dur: 24, bg: "rgba(255,252,245,0.88)", fg: "#3d2d2d" },
      ];
      tracksBodyHtml = mTracks
        .map(
          (tr) => `
          <div style="display:flex;height:29px;border-bottom:1px solid rgba(61,45,45,0.16);">
            <div style="width:78px;flex-shrink:0;padding:0 8px;display:flex;align-items:center;font-size:10px;font-weight:700;background:rgba(61,45,45,0.08);border-right:1px solid rgba(61,45,45,0.2);">${tr.name}</div>
            <div style="position:relative;width:${timelineWidth}px;height:100%;">
              <div style="position:absolute;left:0;top:3px;width:${tr.dur * state.pxPerSec}px;height:23px;background:${tr.bg};color:${tr.fg};border:1px solid rgba(61,45,45,0.45);border-radius:6px;padding:0 8px;display:flex;align-items:center;font-size:10px;font-weight:600;">
                ${tr.label} · Inline Ativo
              </div>
            </div>
          </div>
        `
        )
        .join("");
    } else {
      const dTracks = [
        { name: "3D · Mesh", label: state.d3.modelName, bg: "rgba(61,45,45,0.86)", fg: "#f5f0e6" },
        { name: "3D · Cam", label: `Órbita 360° (${state.d3.autoTurntable ? "Auto" : "Manual"})`, bg: "rgba(132,152,126,0.45)", fg: "#3d2d2d" },
        { name: "3D · Light", label: `PBR ${state.d3.materialColor} · Luz ${state.d3.lightMode}`, bg: "rgba(255,252,245,0.88)", fg: "#3d2d2d" },
      ];
      tracksBodyHtml = dTracks
        .map(
          (tr) => `
          <div style="display:flex;height:29px;border-bottom:1px solid rgba(61,45,45,0.16);">
            <div style="width:78px;flex-shrink:0;padding:0 8px;display:flex;align-items:center;font-size:10px;font-weight:700;background:rgba(61,45,45,0.08);border-right:1px solid rgba(61,45,45,0.2);">${tr.name}</div>
            <div style="position:relative;width:${timelineWidth}px;height:100%;">
              <div style="position:absolute;left:0;top:3px;width:${24 * state.pxPerSec}px;height:23px;background:${tr.bg};color:${tr.fg};border:1px solid rgba(61,45,45,0.45);border-radius:6px;padding:0 8px;display:flex;align-items:center;font-size:10px;font-weight:600;">
                ${tr.label}
              </div>
            </div>
          </div>
        `
        )
        .join("");
    }

    const modeBadge = state.submode === "clipe" ? `CLIPE · ${state.clipe.aspectRatio}` : state.submode === "motion" ? "MOTION · SVG/CSS/JS" : "3D · GLB/OBJ/STL";

    dock.innerHTML = `
      <div style="height:32px;padding:0 10px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(61,45,45,0.22);background:rgba(61,45,45,0.06);">
        <div style="display:flex;align-items:center;gap:6px;">
          <button type="button" id="tl-btn-start" title="Início (00:00)" style="border:1px solid rgba(61,45,45,0.3);background:transparent;color:#3d2d2d;border-radius:6px;padding:2px 7px;font-size:11px;cursor:pointer;">⏮</button>
          <button type="button" id="tl-btn-play" title="Reproduzir / Pausar" style="border:1px solid #3d2d2d;background:#3d2d2d;color:#CEC8B8;border-radius:6px;padding:2px 10px;font-size:11px;font-weight:700;cursor:pointer;">${state.isPlaying ? "❚❚ PAUSE" : "▶ PLAY"}</button>
          ${
            state.submode === "clipe"
              ? `<button type="button" id="tl-btn-split" style="border:1px solid rgba(61,45,45,0.3);background:transparent;color:#3d2d2d;border-radius:6px;padding:2px 7px;font-size:11px;cursor:pointer;">✂ Cortar</button>`
              : state.submode === "motion"
              ? `<button type="button" id="tl-btn-code" style="border:1px solid rgba(61,45,45,0.3);background:transparent;color:#3d2d2d;border-radius:6px;padding:2px 8px;font-size:11px;cursor:pointer;">&lt;/&gt; Inline</button>`
              : `<button type="button" id="tl-btn-3d" style="border:1px solid rgba(61,45,45,0.3);background:transparent;color:#3d2d2d;border-radius:6px;padding:2px 8px;font-size:11px;cursor:pointer;">+ GLB/OBJ</button>`
          }
        </div>
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:10px;font-weight:700;opacity:0.8;">${modeBadge}</span>
          <span id="tl-timecode" style="font-family:monospace;font-size:12px;font-weight:700;background:rgba(61,45,45,0.12);padding:2px 8px;border-radius:5px;">${formatTimecode(state.playhead)}</span>
        </div>
      </div>

      <div id="tl-scroll-area" style="position:relative;flex:1;overflow-x:auto;overflow-y:hidden;">
        <div style="position:relative;width:${timelineWidth + 78}px;height:100%;">
          <div id="tl-ruler" style="position:relative;margin-left:78px;width:${timelineWidth}px;height:18px;border-bottom:1px solid rgba(61,45,45,0.22);background:rgba(255,255,255,0.25);cursor:ew-resize;">
            ${ticksHtml}
          </div>
          ${tracksBodyHtml}
          <div id="tl-playhead" style="position:absolute;left:${78 + playheadX}px;top:0;bottom:0;width:1.5px;background:#ef4444;pointer-events:none;z-index:10;">
            <div style="position:absolute;left:-5px;top:0;width:11px;height:11px;background:#ef4444;clip-path:polygon(0 0, 100% 0, 50% 100%);"></div>
          </div>
        </div>
      </div>
    `;

    dock.querySelector("#tl-btn-play")?.addEventListener("click", (e) => {
      e.stopPropagation();
      togglePlay();
    });

    dock.querySelector("#tl-btn-start")?.addEventListener("click", (e) => {
      e.stopPropagation();
      state.playhead = 0;
      updateTimelinePlayheadUI();
      syncWithCore();
    });

    dock.querySelector("#tl-btn-split")?.addEventListener("click", (e) => {
      e.stopPropagation();
      splitClipAtPlayhead();
    });

    dock.querySelector("#tl-btn-code")?.addEventListener("click", (e) => {
      e.stopPropagation();
      state.motion.inlineOpen = !state.motion.inlineOpen;
      renderMotionInlinePanel();
    });

    dock.querySelector("#tl-btn-3d")?.addEventListener("click", (e) => {
      e.stopPropagation();
      selectVariant("import3DFile");
    });

    const ruler = dock.querySelector("#tl-ruler");
    if (ruler) {
      const scrub = (clientX) => {
        const rect = ruler.getBoundingClientRect();
        const x = Math.max(0, Math.min(timelineWidth, clientX - rect.left));
        state.playhead = +(x / state.pxPerSec).toFixed(2);
        updateTimelinePlayheadUI();
        syncWithCore();
      };
      ruler.addEventListener("pointerdown", (e) => {
        e.stopPropagation();
        scrub(e.clientX);
        const onMove = (ev) => scrub(ev.clientX);
        const onUp = () => {
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerup", onUp);
        };
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
      });
    }

    dock.querySelectorAll("[data-tl-clip]").forEach((el) => {
      el.addEventListener("pointerdown", (e) => {
        e.stopPropagation();
        state.clipe.selectedClipId = el.dataset.tlClip;
        const clip = getSelectedClip();
        if (!clip) return;
        const startX = e.clientX;
        const origStart = clip.start;
        const onMove = (ev) => {
          const dx = ev.clientX - startX;
          clip.start = Math.max(0, +(origStart + dx / state.pxPerSec).toFixed(2));
          el.style.left = `${Math.round(clip.start * state.pxPerSec)}px`;
          syncWithCore();
        };
        const onUp = () => {
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerup", onUp);
          renderTimelineDock();
        };
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
      });
    });
  }

  function updateTimelinePlayheadUI() {
    const ph = document.getElementById("tl-playhead");
    const tc = document.getElementById("tl-timecode");
    if (ph) ph.style.left = `${78 + Math.round(state.playhead * state.pxPerSec)}px`;
    if (tc) tc.textContent = formatTimecode(state.playhead);
  }

  function renderAllVideoBars() {
    renderTopRightSubmodes();
    renderLeftPrimaryBar();
    renderSecondaryRightBar();
    renderMotionInlinePanel();
    renderTimelineDock();
  }

  function hideVideoOnlyUI() {
    state.isPlaying = false;
    state.motion.inlineOpen = false;
    const videoTopRight = document.getElementById("video-hud-top-right");
    const vectorTopRight = document.querySelector(".hud-top-right:not(#video-hud-top-right)");
    const dock = document.getElementById("filmcraft-timeline");
    const inline = document.getElementById("motion-inline-editor");
    if (videoTopRight) videoTopRight.style.display = "none";
    if (vectorTopRight && CORE()?.state?.activeArea === "vector") {
      vectorTopRight.style.display = "inline-flex";
    }
    if (dock) dock.style.display = "none";
    if (inline) inline.style.display = "none";
  }

  function renderClipeStage(ctx) {
    const t = state.playhead;
    const ar = state.clipe.aspectRatio;
    const frameW = ar === "9:16" ? 200 : ar === "1:1" ? 280 : 390;
    const frameH = ar === "9:16" ? 320 : ar === "1:1" ? 280 : 215;

    ctx.save();
    ctx.fillStyle = "#1c1717";
    ctx.fillRect(-frameW / 2, -frameH / 2 - 48, frameW, frameH);
    ctx.beginPath();
    ctx.rect(-frameW / 2, -frameH / 2 - 48, frameW, frameH);
    ctx.clip();

    if (state.clipe.lut === "warm") ctx.filter = "sepia(0.28) contrast(1.06)";
    else if (state.clipe.lut === "sage") ctx.filter = "hue-rotate(18deg) saturate(0.85)";
    else if (state.clipe.lut === "mono") ctx.filter = "grayscale(1) contrast(1.25)";

    const v1Clip = state.clipe.clips.find((c) => c.track === "V1" && t >= c.start && t <= c.start + c.duration);
    if (v1Clip) {
      const localT = t - v1Clip.start;
      let sc = v1Clip.scale || 1;
      if (v1Clip.keyframes?.length >= 2) {
        const k0 = v1Clip.keyframes[0], k1 = v1Clip.keyframes[v1Clip.keyframes.length - 1];
        sc = k0.scale + (k1.scale - k0.scale) * Math.min(1, localT / Math.max(0.1, v1Clip.duration));
      }
      ctx.save();
      ctx.translate(0, -48);
      ctx.scale(sc, sc);
      const grad = ctx.createLinearGradient(-frameW / 2, -frameH / 2, frameW / 2, frameH / 2);
      grad.addColorStop(0, v1Clip.bg || "#84987E");
      grad.addColorStop(1, v1Clip.accent || "#CEC8B8");
      ctx.fillStyle = grad;
      ctx.fillRect(-frameW / 2, -frameH / 2, frameW, frameH);
      ctx.restore();
    }

    ctx.filter = "none";

    const v2Clip = state.clipe.clips.find((c) => c.track === "V2" && t >= c.start && t <= c.start + c.duration);
    if (v2Clip) {
      ctx.save();
      ctx.translate(0, -48);
      ctx.fillStyle = "#f5f0e6";
      ctx.font = "700 14px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(v2Clip.text, 0, v2Clip.style === "lower" ? frameH / 2 - 24 : 0);
      ctx.restore();
    }

    ctx.restore();
    ctx.save();
    ctx.strokeStyle = "rgba(61, 45, 45, 0.55)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-frameW / 2, -frameH / 2 - 48, frameW, frameH);
    ctx.fillStyle = "rgba(61, 45, 45, 0.78)";
    ctx.font = "600 10px monospace";
    ctx.fillText(`CLIPE · ${formatTimecode(t)} · ${ar}`, -frameW / 2, -frameH / 2 - 54);
    ctx.restore();
  }

  function renderMotionStage(ctx) {
    const t = state.playhead;
    const stageW = 360, stageH = 230;

    ctx.save();
    ctx.fillStyle = "rgba(255, 253, 248, 0.72)";
    ctx.strokeStyle = "rgba(61, 45, 45, 0.45)";
    ctx.lineWidth = 1.4;
    ctx.fillRect(-stageW / 2, -stageH / 2 - 48, stageW, stageH);
    ctx.strokeRect(-stageW / 2, -stageH / 2 - 48, stageW, stageH);

    let dy = 0, rot = 0, sc = 1;
    if (state.motion.presetCss === "pulse") sc = 1 + Math.sin(t * 3) * 0.08;
    else if (state.motion.presetCss === "rotate") rot = t * 0.9;
    else if (state.motion.presetCss === "float") dy = Math.sin(t * 2.8) * 14;

    if (state.motion.presetJs === "spring") dy += Math.cos(t * 4.2) * 8;
    else if (state.motion.presetJs === "orbit") {
      dy += Math.sin(t * 2.2) * 16;
      rot += Math.cos(t * 2.2) * 0.25;
    }

    if (typeof state.motion.customFn === "function") {
      try {
        const res = state.motion.customFn(t, state.motion);
        if (res && typeof res === "object") {
          if (typeof res.y === "number") dy = res.y;
          if (typeof res.rotation === "number") rot = res.rotation;
          if (typeof res.scale === "number") sc = res.scale;
        }
      } catch (_) {}
    }

    ctx.save();
    ctx.translate(0, -48 + dy);
    ctx.rotate(rot);
    ctx.scale(sc, sc);

    if (state.motion.svgImage) {
      ctx.drawImage(state.motion.svgImage, -85, -85, 170, 170);
    } else {
      ctx.fillStyle = "rgba(132, 152, 126, 0.35)";
      ctx.strokeStyle = "#3d2d2d";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 56, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();

    ctx.fillStyle = "#3d2d2d";
    ctx.font = "600 10px monospace";
    ctx.fillText(`MOTION STAGE · SVG + CSS (${state.motion.presetCss}) + JS (${state.motion.presetJs})`, -stageW / 2, -stageH / 2 - 54);
    ctx.restore();
  }

  function render3DStage(ctx) {
    const stageW = 360, stageH = 230;
    const { verts, faces } = state.d3.mesh;
    const cx = Math.cos(state.d3.rotX), sx = Math.sin(state.d3.rotX);
    const cy = Math.cos(state.d3.rotY), sy = Math.sin(state.d3.rotY);

    ctx.save();
    ctx.fillStyle = "rgba(245, 241, 233, 0.65)";
    ctx.strokeStyle = "rgba(61, 45, 45, 0.45)";
    ctx.lineWidth = 1.4;
    ctx.fillRect(-stageW / 2, -stageH / 2 - 48, stageW, stageH);
    ctx.strokeRect(-stageW / 2, -stageH / 2 - 48, stageW, stageH);

    ctx.strokeStyle = "rgba(61, 45, 45, 0.14)";
    ctx.lineWidth = 1;
    for (let g = -120; g <= 120; g += 30) {
      ctx.beginPath();
      ctx.moveTo(g - 30, 32);
      ctx.lineTo(g + 30, -10);
      ctx.stroke();
    }

    const projected = verts.map(([x, y, z]) => {
      const x1 = x * cy - z * sy;
      const z1 = x * sy + z * cy;
      const y2 = y * cx - z1 * sx;
      const z2 = y * sx + z1 * cx;
      const fov = 320 / (4.2 + z2);
      return { px: x1 * fov, py: y2 * fov - 52, z: z2 };
    });

    const sortedFaces = faces
      .map((f) => ({
        f,
        avgZ: f.reduce((acc, idx) => acc + (projected[idx]?.z || 0), 0) / f.length,
      }))
      .sort((a, b) => b.avgZ - a.avgZ);

    sortedFaces.forEach(({ f }, i) => {
      if (f.length < 3) return;
      ctx.beginPath();
      f.forEach((vIdx, k) => {
        const pt = projected[vIdx];
        if (!pt) return;
        if (k === 0) ctx.moveTo(pt.px, pt.py);
        else ctx.lineTo(pt.px, pt.py);
      });
      ctx.closePath();

      if (!state.d3.wireframe) {
        const shade = state.d3.lightMode === "dramatic" ? (i % 2 === 0 ? 0.92 : 0.45) : 0.65 + (i % 3) * 0.12;
        ctx.fillStyle = state.d3.materialColor;
        ctx.globalAlpha = shade;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      ctx.strokeStyle = "#3d2d2d";
      ctx.lineWidth = state.d3.wireframe ? 1.2 : 1.5;
      ctx.stroke();
    });

    ctx.fillStyle = "#3d2d2d";
    ctx.font = "600 10px monospace";
    ctx.fillText(`3D VIEWPORT · ${state.d3.modelName}`, -stageW / 2, -stageH / 2 - 54);
    ctx.restore();
  }

  function renderActiveStage(ctx) {
    if (state.submode === "motion") renderMotionStage(ctx);
    else if (state.submode === "3d") render3DStage(ctx);
    else renderClipeStage(ctx);
  }

  function handlePointerDown(x, y) {
    if (state.submode === "3d") {
      state.d3.isDragging = true;
      state.d3.lastX = x;
      state.d3.lastY = y;
    }
  }

  function handlePointerMove(x, y) {
    if (state.submode === "3d" && state.d3.isDragging) {
      state.d3.rotY += (x - state.d3.lastX) * 0.012;
      state.d3.rotX += (y - state.d3.lastY) * 0.012;
      state.d3.lastX = x;
      state.d3.lastY = y;
      syncWithCore();
    }
  }

  function handlePointerUp() {
    state.d3.isDragging = false;
  }

  const moduleApi = {
    onActivate() {
      state.submode = "clipe";
      renderAllVideoBars();
      syncWithCore();
    },
    onDeactivate() {
      hideVideoOnlyUI();
    },
    renderBars: renderAllVideoBars,
    renderNode(node, bCtx) {
      const w = bCtx.canvas.width, h = bCtx.canvas.height;
      bCtx.clearRect(0, 0, w, h);
      bCtx.save();
      bCtx.translate(w / 2, h / 2);
      renderActiveStage(bCtx);
      bCtx.restore();
    },
    render(ctx, width, height) {
      ctx.save();
      ctx.translate(width / 2, height / 2);
      renderActiveStage(ctx);
      ctx.restore();
    },
    onMouseDown: handlePointerDown,
    onMouseMove: handlePointerMove,
    onMouseUp: handlePointerUp,
  };

  window.RoblesCore?.registerModule?.("video", moduleApi);
  window.RoblesStudio?.registerModule?.("video", moduleApi);

  window.RoblesCore?.on?.("area:changed", (area) => {
    if (area === "video") {
      state.submode = "clipe";
      renderAllVideoBars();
    } else {
      hideVideoOnlyUI();
    }
  });

  if (window.RoblesCore?.state?.activeArea === "video") {
    state.submode = "clipe";
    renderAllVideoBars();
  }
})();
