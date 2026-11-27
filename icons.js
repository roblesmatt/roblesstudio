// icons.js — Biblioteca Central de Ícones Retro Coloridos (Robles Studio)
// Paleta base: contorno #2D2323 | acentos #E06D53 (coral), #E6B84C (mostarda),
// #5B9BD5 (azul retro), #63B097 (menta/petróleo), #9B7EDE (lilás), #CEC8B8 (creme)

(() => {
  const retroSvg = (body, size = 16) =>
    `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

  const applySvgSize = (svgMarkup, size = 16) => {
    if (!size) return svgMarkup;
    if (/width="[^"]*"/i.test(svgMarkup)) {
      return svgMarkup.replace(/width="[^"]*"/i, `width="${size}"`).replace(/height="[^"]*"/i, `height="${size}"`);
    }
    return svgMarkup.replace("<svg", `<svg width="${size}" height="${size}"`);
  };

  const resolveIcon = (value, size = 16, alt = "") => {
    if (!value || typeof value !== "string") return "";
    const trimmed = value.trim();
    if (!trimmed) return "";

    if (trimmed.startsWith("<svg")) {
      return applySvgSize(trimmed, size);
    }

    return `<img src="${trimmed}" alt="${alt}" width="${size}" height="${size}" loading="lazy" decoding="async" style="width:${size}px;height:${size}px;object-fit:contain;display:block;pointer-events:none;" />`;
  };

  const BASE_ICONS = {
    // =========================================================================
    // SUB-MODOS (BARRA SUPERIOR DIREITA)
    // =========================================================================
    sub3dParametric: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polygon points="12 2 21 7 12 12 3 7" fill="#E6B84C" stroke="#2D2323" stroke-width="1.6" stroke-linejoin="round"/><polygon points="3 7 12 12 12 22 3 17" fill="#5B9BD5" stroke="#2D2323" stroke-width="1.6" stroke-linejoin="round"/><polygon points="21 7 12 12 12 22 21 17" fill="#63B097" stroke="#2D2323" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
    sub3dHardSurface: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polygon points="12 2 21 7 21 17 12 22 3 17 3 7" fill="#9B7EDE" stroke="#2D2323" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 2v20M3 7l18 10M21 7L3 17" stroke="#FAF6EE" stroke-width="1.3"/></svg>`,
    sub3dSculpt: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 3c4.97 0 9 3.58 9 8 0 2.5-1.2 4.7-3.2 6.2-.8.6-1.3 1.5-1.3 2.5V21H7.5v-1.3c0-1-.5-1.9-1.3-2.5C4.2 15.7 3 13.5 3 11c0-4.42 4.03-8 9-8z" fill="#E06D53" stroke="#2D2323" stroke-width="1.6"/><path d="M8 11c1.5-1.5 6.5-1.5 8 0" stroke="#FAF6EE" stroke-width="1.6" stroke-linecap="round"/></svg>`,
    sub3dRender: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="5" fill="#E6B84C" stroke="#2D2323" stroke-width="1.6"/><path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="#E06D53" stroke-width="2" stroke-linecap="round"/></svg>`,

    subPxManip: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2.5" fill="#5B9BD5" stroke="#2D2323" stroke-width="1.6"/><circle cx="8.5" cy="8.5" r="2" fill="#E6B84C"/><path d="M21 16l-5-5-6 6-2-2-5 6h18z" fill="#63B097" stroke="#2D2323" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
    subPxPhoto: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill="#CEC8B8" stroke="#2D2323" stroke-width="1.6"/><circle cx="12" cy="12" r="4.5" fill="#5B9BD5" stroke="#2D2323" stroke-width="1.4"/><path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83M16.62 12l-5.74 9.94" stroke="#2D2323" stroke-width="1.3"/></svg>`,
    subPxPaint: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z" fill="#5B9BD5" stroke="#2D2323" stroke-width="1.6"/><path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7" fill="#E06D53" stroke="#2D2323" stroke-width="1.6" stroke-linejoin="round"/></svg>`,

    subVidClip: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="2" fill="#E6B84C" stroke="#2D2323" stroke-width="1.6"/><rect x="7" y="4" width="10" height="16" fill="#5B9BD5" stroke="#2D2323" stroke-width="1.5"/><path d="M2 9h5M2 15h5M17 9h5M17 15h5" stroke="#2D2323" stroke-width="1.5"/></svg>`,
    subVidMotion: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polygon points="12 2.5 21.5 12 12 21.5 2.5 12" fill="#E06D53" stroke="#2D2323" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="12" r="3.5" fill="#E6B84C" stroke="#2D2323" stroke-width="1.4"/></svg>`,

    // =========================================================================
    // AÇÕES GLOBAIS, UI, GAVETAS E RODAPÉ
    // =========================================================================
    undo: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 14L4 9l5-5" stroke="#E06D53" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" stroke="#2D2323" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    redo: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 14l5-5-5-5" stroke="#63B097" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13" stroke="#2D2323" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    copy: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="11" height="11" rx="2" fill="#5B9BD5" stroke="#2D2323" stroke-width="1.6"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" fill="#CEC8B8" stroke="#2D2323" stroke-width="1.6"/></svg>`,
    paste: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" fill="#CEC8B8" stroke="#2D2323" stroke-width="1.6"/><rect x="8" y="2" width="8" height="4" rx="1" fill="#E6B84C" stroke="#2D2323" stroke-width="1.5"/></svg>`,
    duplicate: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="8" y="8" width="12" height="12" rx="2" fill="#63B097" stroke="#2D2323" stroke-width="1.6"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" fill="#CEC8B8" stroke="#2D2323" stroke-width="1.5"/><path d="M14 11v6M11 14h6" stroke="#FAF6EE" stroke-width="2" stroke-linecap="round"/></svg>`,
    snap: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 14V9a6 6 0 1 1 12 0v5" stroke="#E06D53" stroke-width="2.2" stroke-linecap="round"/><rect x="4" y="14" width="4.5" height="5" rx="1" fill="#5B9BD5" stroke="#2D2323" stroke-width="1.5"/><rect x="15.5" y="14" width="4.5" height="5" rx="1" fill="#E6B84C" stroke="#2D2323" stroke-width="1.5"/></svg>`,

    layers: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polygon points="12 2.5 21.5 7.5 12 12.5 2.5 7.5" fill="#E6B84C" stroke="#2D2323" stroke-width="1.5" stroke-linejoin="round"/><polygon points="2.5 12 12 17 21.5 12" fill="#5B9BD5" stroke="#2D2323" stroke-width="1.5" stroke-linejoin="round"/><polygon points="2.5 16.5 12 21.5 21.5 16.5" fill="#63B097" stroke="#2D2323" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
    measures: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="12" rx="2" fill="#CEC8B8" stroke="#2D2323" stroke-width="1.6"/><path d="M7 6v4M12 6v5M17 6v4" stroke="#E06D53" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    history: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill="#FAF6EE" stroke="#2D2323" stroke-width="1.6"/><path d="M12 7v5l3.5 2" stroke="#5B9BD5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    historyCounter: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M16 4l4 4L8 20H4v-4L16 4z" fill="#E6B84C" stroke="#2D2323" stroke-width="1.7" stroke-linejoin="round"/></svg>`,
    historyStep: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="6" fill="#63B097" stroke="#2D2323" stroke-width="1.7"/></svg>`,

    eye: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" fill="#FAF6EE" stroke="#2D2323" stroke-width="1.7"/><circle cx="12" cy="12" r="3" fill="#5B9BD5" stroke="#2D2323" stroke-width="1.4"/></svg>`,
    eyeOff: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-6.4 0-10-7-10-7a18.45 18.45 0 0 1 5.06-5.94" stroke="#2D2323" stroke-width="1.7" stroke-linecap="round"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 5c6.4 0 10 7 10 7a18.5 18.5 0 0 1-2.16 3.19" stroke="#2D2323" stroke-width="1.7" stroke-linecap="round"/><line x1="2" y1="2" x2="22" y2="22" stroke="#E06D53" stroke-width="2" stroke-linecap="round"/></svg>`,
    trash: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 6l-1 14H6L5 6h14z" fill="#E06D53" stroke="#2D2323" stroke-width="1.6" stroke-linejoin="round"/><path d="M3 6h18M9 6V4h6v2" stroke="#2D2323" stroke-width="1.6" stroke-linecap="round"/></svg>`,
    plus: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill="#63B097" stroke="#2D2323" stroke-width="1.6"/><path d="M12 8v8M8 12h8" stroke="#FAF6EE" stroke-width="2.1" stroke-linecap="round"/></svg>`,
    save: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" fill="#5B9BD5" stroke="#2D2323" stroke-width="1.6" stroke-linejoin="round"/><rect x="8" y="4" width="7" height="5" fill="#FAF6EE" stroke="#2D2323" stroke-width="1.3"/><rect x="7" y="13" width="10" height="7" rx="1" fill="#E6B84C" stroke="#2D2323" stroke-width="1.3"/></svg>`,
    gear: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="7" fill="#CEC8B8" stroke="#2D2323" stroke-width="1.7"/><circle cx="12" cy="12" r="3" fill="#E06D53" stroke="#2D2323" stroke-width="1.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" stroke="#2D2323" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    exportIcon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" fill="#CEC8B8" stroke="#2D2323" stroke-width="1.6" stroke-linecap="round"/><path d="M12 3v11m0 0-4-4m4 4 4-4" stroke="#63B097" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    bridge: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7" stroke="#E06D53" stroke-width="2.2" stroke-linecap="round"/><path d="M8 7h9v9" stroke="#5B9BD5" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

    // =========================================================================
    // COMUNS (IMPORTAR / EXPORTAR / ESCALA / RESET / SELEÇÃO / CORES)
    // =========================================================================
    ioImport: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" fill="#CEC8B8" stroke="#2D2323" stroke-width="1.6" stroke-linecap="round"/><path d="M12 15V4m0 0-4 4m4-4 4 4" stroke="#63B097" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    ioExport: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" fill="#CEC8B8" stroke="#2D2323" stroke-width="1.6" stroke-linecap="round"/><path d="M12 3v11m0 0-4-4m4 4 4-4" stroke="#E06D53" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    scaleUp: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="2.5" fill="#CEC8B8" stroke="#2D2323" stroke-width="1.5"/><path d="M14 4h6v6M10 20H4v-6M20 4l-6 6M4 20l6-6" stroke="#63B097" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    scaleDown: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="2.5" fill="#CEC8B8" stroke="#2D2323" stroke-width="1.5"/><path d="M4 14h6v6M20 10h-6V4M14 10l6-6M4 20l6-6" stroke="#E06D53" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    resetCycle: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" fill="#E6B84C" fill-opacity="0.3"/><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="#2D2323" stroke-width="1.8" stroke-linecap="round"/><path d="M3 3v5h5" stroke="#E06D53" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    selectPointer: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 3l14 9-6.5 1.5L10 20z" fill="#5B9BD5" stroke="#2D2323" stroke-width="1.7" stroke-linejoin="round"/></svg>`,
    plusCircle: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" fill="#63B097" stroke="#2D2323" stroke-width="1.6"/><path d="M12 8.5v7M8.5 12h7" stroke="#FAF6EE" stroke-width="2" stroke-linecap="round"/></svg>`,
    minusCircle: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="6.5" fill="#E06D53" stroke="#2D2323" stroke-width="1.6"/><path d="M9 12h6" stroke="#FAF6EE" stroke-width="2" stroke-linecap="round"/></svg>`,
    eraserRetro: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" fill="#F29CB7" stroke="#2D2323" stroke-width="1.6" stroke-linejoin="round"/><path d="M8.5 9.5l6 6" stroke="#2D2323" stroke-width="1.5"/><path d="M22 21H7" stroke="#5B9BD5" stroke-width="2" stroke-linecap="round"/></svg>`,

    // =========================================================================
    // MÓDULO 3D (3d.js)
    // =========================================================================
    primSoapBar: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="5" y="3.5" width="14" height="17" rx="3.5" fill="#84987E" stroke="#2D2323" stroke-width="1.6"/><rect x="7.5" y="6.5" width="9" height="11" rx="1.5" stroke="#FAF6EE" stroke-width="1.3"/></svg>`,
    primCardBox: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polygon points="12 2.5 20.5 7.5 12 12.5 3.5 7.5" fill="#E6D8BE" stroke="#2D2323" stroke-width="1.5" stroke-linejoin="round"/><polygon points="3.5 7.5 12 12.5 12 21.5 3.5 16.5" fill="#CEC8B8" stroke="#2D2323" stroke-width="1.5" stroke-linejoin="round"/><polygon points="20.5 7.5 12 12.5 12 21.5 20.5 16.5" fill="#B5AD99" stroke="#2D2323" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
    primCube: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="4.5" y="4.5" width="15" height="15" rx="2" fill="#5B9BD5" stroke="#2D2323" stroke-width="1.6"/><rect x="7" y="7" width="5" height="5" rx="1" fill="#FAF6EE" fill-opacity="0.45"/></svg>`,
    primCylinder: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 6v12c0 1.66 3.13 3 7 3s7-1.34 7-3V6" fill="#B86B4B" stroke="#2D2323" stroke-width="1.6"/><ellipse cx="12" cy="6" rx="7" ry="3" fill="#E6B84C" stroke="#2D2323" stroke-width="1.6"/></svg>`,
    cadExtrudePlus: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="1.5" fill="#5B9BD5" stroke="#2D2323" stroke-width="1.6"/><path d="M12 11V3m0 0-3.5 3.5M12 3l3.5 3.5" stroke="#E06D53" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    cadExtrudeMinus: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="1.5" fill="#CEC8B8" stroke="#2D2323" stroke-width="1.6"/><path d="M12 3v8m0 0-3.5-3.5M12 11l3.5-3.5" stroke="#5B9BD5" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    cadEdgeFillet: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 19V4h15" stroke="#9A948A" stroke-width="1.5" stroke-dasharray="2.5 2"/><path d="M4 19V10a6 6 0 0 1 6-6h9" stroke="#E06D53" stroke-width="2.8" stroke-linecap="round"/></svg>`,
    cadDebossSeven: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="2.5" fill="#CEC8B8" stroke="#2D2323" stroke-width="1.6"/><path d="M9 8h6l-4 8" stroke="#E06D53" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    cadResetView: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" fill="#E6B84C" stroke="#2D2323" stroke-width="1.6"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="#5B9BD5" stroke-width="2" stroke-linecap="round"/></svg>`,

    hsSelFaces: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polygon points="12 3 20 8 20 16 12 21 4 16 4 8" fill="#CEC8B8" stroke="#2D2323" stroke-width="1.5"/><polygon points="12 3 20 8 12 13 4 8" fill="#E6B84C" stroke="#2D2323" stroke-width="1.5"/></svg>`,
    hsSelEdges: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polygon points="12 3 20 8 20 16 12 21 4 16 4 8" fill="#CEC8B8" stroke="#2D2323" stroke-width="1.5"/><path d="M12 13v8M4 8l8 5 8-5" stroke="#E06D53" stroke-width="2.4" stroke-linecap="round"/></svg>`,
    hsSelVertices: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="5" y="5" width="14" height="14" fill="#5B9BD5" fill-opacity="0.25" stroke="#2D2323" stroke-width="1.5"/><circle cx="5" cy="5" r="2.3" fill="#E6B84C" stroke="#2D2323" stroke-width="1.2"/><circle cx="19" cy="5" r="2.3" fill="#E6B84C" stroke="#2D2323" stroke-width="1.2"/><circle cx="19" cy="19" r="2.3" fill="#E6B84C" stroke="#2D2323" stroke-width="1.2"/><circle cx="5" cy="19" r="2.3" fill="#E6B84C" stroke="#2D2323" stroke-width="1.2"/></svg>`,
    hsSubdivideMesh: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3.5" y="3.5" width="17" height="17" rx="1.5" fill="#63B097" stroke="#2D2323" stroke-width="1.6"/><path d="M12 3.5v17M3.5 12h17" stroke="#FAF6EE" stroke-width="1.6"/></svg>`,
    hsBevelPoly: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polygon points="8 3 16 3 21 8 21 16 16 21 8 21 3 16 3 8" fill="#9B7EDE" stroke="#2D2323" stroke-width="1.6"/></svg>`,
    hsToggleWire: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill="#5B9BD5" fill-opacity="0.2" stroke="#2D2323" stroke-width="1.6"/><ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#5B9BD5" stroke-width="1.5"/><ellipse cx="12" cy="12" rx="3.5" ry="9" stroke="#E06D53" stroke-width="1.5"/></svg>`,
    hsTaperTop: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polygon points="7.5 4 16.5 4 20 20 4 20" fill="#E6B84C" stroke="#2D2323" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
    hsTwistMesh: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 4c6 4 6 12 12 16" stroke="#E06D53" stroke-width="2.2" stroke-linecap="round"/><path d="M18 4c-6 4-6 12-12 16" stroke="#5B9BD5" stroke-width="2.2" stroke-linecap="round"/></svg>`,

    brushClay: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 18c2.5-8.5 13.5-8.5 16 0H4z" fill="#E06D53" stroke="#2D2323" stroke-width="1.6" stroke-linejoin="round"/><line x1="3" y1="19.5" x2="21" y2="19.5" stroke="#2D2323" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    brushInflate: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="6.5" fill="#9B7EDE" stroke="#2D2323" stroke-width="1.6"/><path d="M12 5V2M12 22v-3M5 12H2M22 12h-3" stroke="#E6B84C" stroke-width="2" stroke-linecap="round"/></svg>`,
    brushCarve: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 6c3.5 9 12.5 9 16 0H4z" fill="#5B9BD5" stroke="#2D2323" stroke-width="1.6" stroke-linejoin="round"/><line x1="3" y1="4.5" x2="21" y2="4.5" stroke="#2D2323" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    brushSmooth: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 13c4-4 6 4 9 0s5 4 9 0" stroke="#63B097" stroke-width="2.6" stroke-linecap="round"/></svg>`,
    sculptSphereBase: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" fill="#D48C70" stroke="#2D2323" stroke-width="1.6"/><circle cx="9.2" cy="9" r="2.2" fill="#FAF6EE" fill-opacity="0.55"/></svg>`,
    sculptSoapOrganic: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="4" y="5" width="16" height="14" rx="5.5" fill="#84987E" stroke="#2D2323" stroke-width="1.6"/></svg>`,
    scSymmetryToggle: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><line x1="12" y1="3" x2="12" y2="21" stroke="#E06D53" stroke-width="1.8" stroke-dasharray="2.5 2"/><polygon points="8.5 7 3.5 12 8.5 17" fill="#5B9BD5" stroke="#2D2323" stroke-width="1.4"/><polygon points="15.5 7 20.5 12 15.5 17" fill="#63B097" stroke="#2D2323" stroke-width="1.4"/></svg>`,

    rtToggleSamples: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="#E6B84C" stroke="#2D2323" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
    shSageMatte: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" fill="#84987E" stroke="#2D2323" stroke-width="1.6"/></svg>`,
    shAmberGlass: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" fill="#7A4824" stroke="#2D2323" stroke-width="1.6"/><circle cx="9.5" cy="9.5" r="2" fill="#E6B84C"/></svg>`,
    shApothecaryBeige: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" fill="#CEC8B8" stroke="#2D2323" stroke-width="1.6"/></svg>`,
    shBrushedGold: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" fill="#D4AF37" stroke="#2D2323" stroke-width="1.6"/><path d="M8 8l8 8" stroke="#FAF6EE" stroke-width="1.5"/></svg>`,
    hdriStudioWarm: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill="#CEC8B8" stroke="#2D2323" stroke-width="1.6"/><circle cx="12" cy="12" r="4.5" fill="#E6B84C" stroke="#2D2323" stroke-width="1.4"/></svg>`,
    hdriDramaticNoir: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill="#2D2323" stroke="#2D2323" stroke-width="1.6"/><path d="M12 3a9 9 0 0 0 0 18z" fill="#E6B84C"/></svg>`,
    rtCameraTurntable: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="13" rx="8.5" ry="4" fill="#5B9BD5" fill-opacity="0.3" stroke="#2D2323" stroke-width="1.5"/><path d="M16 10l4 3-4 3" stroke="#E06D53" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

    // =========================================================================
    // MÓDULO PIXEL (pixel.js)
    // =========================================================================
    brush: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z" fill="#5B9BD5" stroke="#2D2323" stroke-width="1.6"/><path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7" fill="#E06D53" stroke="#2D2323" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
    pcNewCanvas: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="2.5" fill="#FAF6EE" stroke="#2D2323" stroke-width="1.6"/><path d="M12 8v8M8 12h8" stroke="#63B097" stroke-width="2.2" stroke-linecap="round"/></svg>`,
    pcMarqueeRect: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="4.5" y="4.5" width="15" height="15" fill="#5B9BD5" fill-opacity="0.25" stroke="#2D2323" stroke-width="1.6" stroke-dasharray="3 2"/><rect x="2.5" y="2.5" width="3" height="3" fill="#63B097" stroke="#2D2323" stroke-width="1"/></svg>`,
    pcCropToSel: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 2v14a2 2 0 0 0 2 2h14" stroke="#E06D53" stroke-width="2.2" stroke-linecap="round"/><path d="M18 22V8a2 2 0 0 0-2-2H2" stroke="#5B9BD5" stroke-width="2.2" stroke-linecap="round"/></svg>`,
    pcClearSel: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="2" fill="#CEC8B8" stroke="#2D2323" stroke-width="1.6"/><path d="M9 9l6 6M15 9l-6 6" stroke="#E06D53" stroke-width="2.2" stroke-linecap="round"/></svg>`,
    pcMoveLayer: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20" stroke="#5B9BD5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    pcFlipH: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><line x1="12" y1="3" x2="12" y2="21" stroke="#2D2323" stroke-width="1.6" stroke-dasharray="2.5 2"/><polygon points="8.5 7 3 12 8.5 17" fill="#E6B84C" stroke="#2D2323" stroke-width="1.4"/><polygon points="15.5 7 21 12 15.5 17" fill="#5B9BD5" stroke="#2D2323" stroke-width="1.4"/></svg>`,
    pcBlurBrush: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2.7l5.66 5.66a8 8 0 1 1-11.32 0z" fill="#5B9BD5" stroke="#2D2323" stroke-width="1.6"/><circle cx="10" cy="14" r="2" fill="#FAF6EE" fill-opacity="0.65"/></svg>`,
    pcLiquify: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 12c3-6 6 6 9 0s6 6 9 0" stroke="#9B7EDE" stroke-width="2.5" stroke-linecap="round"/></svg>`,
    pcInvertColors: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill="#FAF6EE" stroke="#2D2323" stroke-width="1.6"/><path d="M12 3a9 9 0 0 1 0 18z" fill="#2D2323"/></svg>`,
    pcPixelate: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="7" height="7" fill="#E06D53" stroke="#2D2323" stroke-width="1.3"/><rect x="13" y="4" width="7" height="7" fill="#E6B84C" stroke="#2D2323" stroke-width="1.3"/><rect x="4" y="13" width="7" height="7" fill="#5B9BD5" stroke="#2D2323" stroke-width="1.3"/><rect x="13" y="13" width="7" height="7" fill="#63B097" stroke="#2D2323" stroke-width="1.3"/></svg>`,

    lcExpDown: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="7" fill="#5B9BD5" stroke="#2D2323" stroke-width="1.6"/><line x1="8.5" y1="12" x2="15.5" y2="12" stroke="#FAF6EE" stroke-width="2" stroke-linecap="round"/></svg>`,
    lcContrastUp: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill="#E6B84C" stroke="#2D2323" stroke-width="1.6"/><path d="M12 3v18a9 9 0 0 0 0-18z" fill="#2D2323"/></svg>`,
    lcContrastDown: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill="#CEC8B8" stroke="#2D2323" stroke-width="1.6"/><path d="M5 17C9 14 15 10 19 7" stroke="#5B9BD5" stroke-width="2.2" stroke-linecap="round"/></svg>`,
    lcWarmUp: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" fill="#E06D53" stroke="#2D2323" stroke-width="1.6"/></svg>`,
    lcCoolDown: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" stroke="#5B9BD5" stroke-width="2.1" stroke-linecap="round"/></svg>`,
    lcSatUp: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8.5" r="4.2" fill="#E06D53" stroke="#2D2323" stroke-width="1.3"/><circle cx="8.5" cy="15" r="4.2" fill="#E6B84C" stroke="#2D2323" stroke-width="1.3"/><circle cx="15.5" cy="15" r="4.2" fill="#5B9BD5" stroke="#2D2323" stroke-width="1.3"/></svg>`,
    lcSatDown: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" fill="#CEC8B8" stroke="#2D2323" stroke-width="1.6" stroke-dasharray="3 2"/></svg>`,
    lcPresetApothecary: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="3" fill="#CEC8B8" stroke="#2D2323" stroke-width="1.6"/></svg>`,
    lcPresetBotanical: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="3" fill="#84987E" stroke="#2D2323" stroke-width="1.6"/></svg>`,
    lcPresetMono: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="3" fill="#3d2d2d" stroke="#2D2323" stroke-width="1.6"/></svg>`,
    lcVignetteToggle: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="2.5" fill="#2D2323" stroke="#2D2323" stroke-width="1.6"/><circle cx="12" cy="12" r="5.5" fill="#FAF6EE"/></svg>`,

    krPencilHB: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M16 4l4 4L8 20H4v-4L16 4z" fill="#E6B84C" stroke="#2D2323" stroke-width="1.6" stroke-linejoin="round"/><path d="M14.5 5.5l4 4" fill="#F29CB7" stroke="#2D2323" stroke-width="1.6"/></svg>`,
    krCharcoal: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 20L19 5l2 2L6 22H4v-2z" fill="#4A4242" stroke="#2D2323" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
    krInkPen: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 19l7-7 3 3-7 7-3-3z" fill="#E06D53" stroke="#2D2323" stroke-width="1.6"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" fill="#CEC8B8" stroke="#2D2323" stroke-width="1.6" stroke-linejoin="round"/><circle cx="10" cy="10" r="1.4" fill="#2D2323"/></svg>`,
    krWatercolorEdge: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" fill="#63B097" fill-opacity="0.45" stroke="#5B9BD5" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="#63B097"/></svg>`,
    krWaterBlender: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" fill="#5B9BD5" stroke="#2D2323" stroke-width="1.5"/><path d="M16 19c2.2 0 4-1.8 4-4 0-2-2.5-4.5-4-6.5-1.5 2-4 4.5-4 6.5 0 2.2 1.8 4 4 4z" fill="#63B097" stroke="#2D2323" stroke-width="1.5"/></svg>`,
    krRgbaBristle: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 6h16" stroke="#E06D53" stroke-width="2.2" stroke-linecap="round"/><path d="M4 10h16" stroke="#E6B84C" stroke-width="2.2" stroke-linecap="round"/><path d="M4 14h16" stroke="#63B097" stroke-width="2.2" stroke-linecap="round"/><path d="M4 18h16" stroke="#5B9BD5" stroke-width="2.2" stroke-linecap="round"/></svg>`,
    krRgbaAirbrush: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" fill="#9B7EDE" fill-opacity="0.35" stroke="#2D2323" stroke-width="1.4" stroke-dasharray="1.5 2.5"/><circle cx="12" cy="12" r="3.5" fill="#9B7EDE"/></svg>`,
    krColorDarkBrown: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" fill="#3d2d2d" stroke="#2D2323" stroke-width="1.6"/></svg>`,
    krColorTerracotta: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" fill="#B86B4B" stroke="#2D2323" stroke-width="1.6"/></svg>`,
    krColorCustom: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" fill="#E6B84C" stroke="#2D2323" stroke-width="1.6"/><path d="M12 3.5a8.5 8.5 0 0 1 8.5 8.5H12z" fill="#E06D53"/><path d="M12 20.5A8.5 8.5 0 0 1 3.5 12H12z" fill="#5B9BD5"/><circle cx="12" cy="12" r="3" fill="#FAF6EE" stroke="#2D2323" stroke-width="1.3"/></svg>`,

    // =========================================================================
    // MÓDULO VÍDEO (video.js)
    // =========================================================================
    timeline: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2.5" y="4" width="19" height="16" rx="2" fill="#E6B84C" stroke="#2D2323" stroke-width="1.6"/><polygon points="10 8.5 16 12 10 15.5 10 8.5" fill="#E06D53" stroke="#2D2323" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
    vidDuplicate: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="11" height="11" rx="2" fill="#CEC8B8" stroke="#2D2323" stroke-width="1.5"/><rect x="9" y="9" width="11" height="11" rx="2" fill="#5B9BD5" stroke="#2D2323" stroke-width="1.6"/></svg>`,
    vidRazor: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="6" cy="6" r="3" fill="#E06D53" stroke="#2D2323" stroke-width="1.5"/><circle cx="6" cy="18" r="3" fill="#E06D53" stroke="#2D2323" stroke-width="1.5"/><line x1="20" y1="4" x2="8.12" y2="15.88" stroke="#2D2323" stroke-width="1.8" stroke-linecap="round"/><line x1="14.47" y1="14.48" x2="20" y2="20" stroke="#2D2323" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    vidTrimStart: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><line x1="5" y1="4" x2="5" y2="20" stroke="#E06D53" stroke-width="2.4" stroke-linecap="round"/><polyline points="14 8 10 12 14 16" stroke="#5B9BD5" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><line x1="10" y1="12" x2="20" y2="12" stroke="#5B9BD5" stroke-width="2.2" stroke-linecap="round"/></svg>`,
    vidTrimEnd: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><line x1="19" y1="4" x2="19" y2="20" stroke="#E06D53" stroke-width="2.4" stroke-linecap="round"/><polyline points="10 8 14 12 10 16" stroke="#5B9BD5" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><line x1="4" y1="12" x2="14" y2="12" stroke="#5B9BD5" stroke-width="2.2" stroke-linecap="round"/></svg>`,
    vidRippleDelete: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 6l-1 14H6L5 6h14z" fill="#E06D53" stroke="#2D2323" stroke-width="1.6" stroke-linejoin="round"/><path d="M3 6h18M9 12h6" stroke="#FAF6EE" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    vidKeyframeAdd: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polygon points="12 3 21 12 12 21 3 12" fill="#E6B84C" stroke="#2D2323" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
    vidKeyframeClear: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polygon points="12 3 21 12 12 21 3 12" fill="#CEC8B8" stroke="#2D2323" stroke-width="1.6" stroke-dasharray="2.5 2"/></svg>`,
    vidTitleCenter: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="2.5" fill="#5B9BD5" fill-opacity="0.22" stroke="#5B9BD5" stroke-width="1.6"/><path d="M7 7.5h10M12 7.5v9.5M9.5 17h5" stroke="#2D2323" stroke-width="2" stroke-linecap="round"/></svg>`,
    vidLowerThird: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="2" fill="#CEC8B8" stroke="#2D2323" stroke-width="1.6"/><rect x="5.5" y="13.5" width="11" height="3.5" rx="1" fill="#E6B84C" stroke="#2D2323" stroke-width="1.2"/></svg>`,
    vidTransDissolve: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="10" height="14" rx="1.5" fill="#5B9BD5" stroke="#2D2323" stroke-width="1.5"/><rect x="11" y="5" width="10" height="14" rx="1.5" fill="#E6B84C" fill-opacity="0.75" stroke="#2D2323" stroke-width="1.5"/></svg>`,
    vidTransFade: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polygon points="3.5 18.5 12 5.5 20.5 18.5" fill="#63B097" stroke="#2D2323" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
    vidTransCut: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="4" y="5" width="7" height="14" fill="#5B9BD5" stroke="#2D2323" stroke-width="1.4"/><rect x="13" y="5" width="7" height="14" fill="#E06D53" stroke="#2D2323" stroke-width="1.4"/></svg>`,
    vidAspect16x9: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="6" width="20" height="12" rx="2" fill="#5B9BD5" fill-opacity="0.3" stroke="#2D2323" stroke-width="1.6"/></svg>`,
    vidAspect9x16: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="6" y="2" width="12" height="20" rx="2" fill="#E06D53" fill-opacity="0.3" stroke="#2D2323" stroke-width="1.6"/></svg>`,
    vidAspect1x1: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="2" fill="#63B097" fill-opacity="0.3" stroke="#2D2323" stroke-width="1.6"/></svg>`,
    vidZoomIn: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7.5" fill="#CEC8B8" stroke="#2D2323" stroke-width="1.6"/><path d="M21 21l-4.35-4.35" stroke="#E06D53" stroke-width="2.2" stroke-linecap="round"/><path d="M11 8v6M8 11h6" stroke="#63B097" stroke-width="2" stroke-linecap="round"/></svg>`,
    vidZoomOut: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7.5" fill="#CEC8B8" stroke="#2D2323" stroke-width="1.6"/><path d="M21 21l-4.35-4.35" stroke="#E06D53" stroke-width="2.2" stroke-linecap="round"/><path d="M8 11h6" stroke="#E06D53" stroke-width="2" stroke-linecap="round"/></svg>`,

    // Motion Inline
    motCodeEditor: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2.5" y="4" width="19" height="16" rx="2.5" fill="#2D2323" stroke="#2D2323" stroke-width="1.5"/><polyline points="15 16 19 12 15 8" stroke="#E6B84C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="9 8 5 12 9 16" stroke="#63B097" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    motSvgSeal: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" fill="#63B097" stroke="#2D2323" stroke-width="1.6"/><circle cx="12" cy="12" r="4" fill="#E6B84C" stroke="#2D2323" stroke-width="1.4"/></svg>`,
    motSvgWave: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 14c4-8 14 8 18 0" stroke="#E06D53" stroke-width="2.6" stroke-linecap="round"/></svg>`,
    motSvgBadge: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="4" y="5" width="16" height="14" rx="2.5" fill="#CEC8B8" stroke="#2D2323" stroke-width="1.8"/></svg>`,
    motCssPulse: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#5B9BD5" stroke-width="1.5" stroke-dasharray="3 2"/><circle cx="12" cy="12" r="5" fill="#E06D53" stroke="#2D2323" stroke-width="1.5"/></svg>`,
    motCssFloat: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 4v16M8 8l4-4 4 4M8 16l4 4 4-4" stroke="#63B097" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    motJsSpring: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 18c2-12 4 12 6 0s4 12 6 0 4 12 4 0" stroke="#9B7EDE" stroke-width="2.2" stroke-linecap="round"/></svg>`,
    motJsOrbit: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(-25 12 12)" stroke="#5B9BD5" stroke-width="1.7"/><circle cx="18" cy="9" r="2.5" fill="#E6B84C" stroke="#2D2323" stroke-width="1.2"/></svg>`,
    motJsStrokeDraw: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 17L10 7l5 8 5-9" stroke="#E06D53" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="20" cy="6" r="2.2" fill="#63B097"/></svg>`,
    motEaseCubic: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 20C4 8 12 4 20 4" stroke="#5B9BD5" stroke-width="2.2" stroke-linecap="round"/><circle cx="4" cy="20" r="2.3" fill="#E06D53" stroke="#2D2323" stroke-width="1.2"/><circle cx="20" cy="4" r="2.3" fill="#E6B84C" stroke="#2D2323" stroke-width="1.2"/></svg>`,
    motEaseLinear: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><line x1="4" y1="20" x2="20" y2="4" stroke="#63B097" stroke-width="2.2" stroke-linecap="round"/></svg>`,

    // Vídeo 3D Viewport
    vid3dBottle: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="7" y="8" width="10" height="13" rx="2.5" fill="#7A4824" stroke="#2D2323" stroke-width="1.6"/><rect x="10" y="3" width="4" height="5" rx="1" fill="#E6B84C" stroke="#2D2323" stroke-width="1.4"/></svg>`,
    vid3dCamFront: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="5" y="5" width="14" height="14" rx="1.5" fill="#CEC8B8" stroke="#2D2323" stroke-width="1.6"/></svg>`,
  };

  const VECTOR_ICONS = {
    // 01-move.js — Mover, Seleção, Profundidade, Laço, Eixo, Pivô, Nós
    move: retroSvg(`<path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20" stroke="#5B9BD5" stroke-width="2"/>`),
    selectDeep: retroSvg(`<polygon points="12 3 21 8 12 13 3 8" fill="#E6B84C" stroke="#2D2323" stroke-width="1.5"/><polyline points="3 13 12 18 21 13" stroke="#5B9BD5" stroke-width="2"/><polyline points="3 18 12 23 21 18" stroke="#63B097" stroke-width="2"/>`),
    selectLasso: retroSvg(`<path d="M7 14c-3-1.5-4-4.5-2-7 2.5-3 9.5-3.5 13-1 3.5 2.5 3 7.5-1 9.5-3.5 1.8-8 1-10-1.5z" fill="#9B7EDE" fill-opacity="0.3" stroke="#2D2323" stroke-width="1.6"/><circle cx="8" cy="16" r="2.2" fill="#E6B84C" stroke="#2D2323" stroke-width="1.3"/><path d="M8 18.2c0 1.8 1.5 2.8 3.5 2.8" stroke="#E06D53" stroke-width="2"/>`),
    moveAxis: retroSvg(`<path d="M12 3v18M3 12h18" stroke="#2D2323" stroke-width="1.8"/><path d="M9 6l3-3 3 3M9 18l3 3 3-3" stroke="#E06D53" stroke-width="2"/><path d="M6 9l-3 3 3 3M18 9l3 3-3 3" stroke="#5B9BD5" stroke-width="2"/>`),
    pan: retroSvg(`<path d="M18 11V6a2 2 0 0 0-4 0v4" fill="#CEC8B8" stroke="#2D2323" stroke-width="1.6"/><path d="M14 10V4a2 2 0 0 0-4 0v6" fill="#CEC8B8" stroke="#2D2323" stroke-width="1.6"/><path d="M10 10.5V6a2 2 0 0 0-4 0v8" fill="#CEC8B8" stroke="#2D2323" stroke-width="1.6"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" fill="#E6B84C" stroke="#2D2323" stroke-width="1.6"/>`),
    select: retroSvg(`<path d="M5 3l14 9-6.5 1.5L10 20z" fill="#E6B84C" stroke="#2D2323" stroke-width="1.6"/>`),
    pivot: retroSvg(`<path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="#E06D53" stroke-width="2"/><circle cx="12" cy="12" r="3.5" fill="#63B097" stroke="#2D2323" stroke-width="1.5"/>`),
    nodes: retroSvg(`<rect x="5" y="5" width="14" height="14" fill="#CEC8B8" fill-opacity="0.45" stroke="#2D2323" stroke-width="1.5"/><circle cx="5" cy="5" r="2.3" fill="#E06D53" stroke="#2D2323" stroke-width="1.2"/><circle cx="19" cy="5" r="2.3" fill="#E6B84C" stroke="#2D2323" stroke-width="1.2"/><circle cx="19" cy="19" r="2.3" fill="#63B097" stroke="#2D2323" stroke-width="1.2"/><circle cx="5" cy="19" r="2.3" fill="#5B9BD5" stroke="#2D2323" stroke-width="1.2"/>`),

    // Submodos e Caneta / Texto
    pen: retroSvg(`<path d="M12 19l7-7 3 3-7 7-3-3z" fill="#E06D53" stroke="#2D2323" stroke-width="1.6"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" fill="#5B9BD5" stroke="#2D2323" stroke-width="1.6"/><circle cx="10.5" cy="10.5" r="1.8" fill="#E6B84C" stroke="#2D2323" stroke-width="1.2"/>`),
    text: retroSvg(`<rect x="3" y="4" width="18" height="16" rx="2" fill="#CEC8B8" stroke="#2D2323" stroke-width="1.5"/><path d="M7 8h10M12 8v9M9.5 17h5" stroke="#E06D53" stroke-width="2.1"/>`),

    // 02-artboard.js — Prancheta, Ajustar, Girar, Formatos, Página, Guias
    artboard: retroSvg(`<path d="M5 2v6M2 5h6" stroke="#E06D53" stroke-width="2"/><path d="M11 4h3M17 4h2a1 1 0 0 1 1 1v2M20 11v3M20 17v2a1 1 0 0 1-1 1h-2M13 20h-3M7 20H5a1 1 0 0 1-1-1v-2" stroke="#2D2323" stroke-width="1.6"/><rect x="8.5" y="8.5" width="7" height="7" rx="1" fill="#5B9BD5" stroke="#2D2323" stroke-width="1.5"/>`),
    artboardFit: retroSvg(`<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" stroke="#63B097" stroke-width="2.2"/><rect x="8.5" y="8.5" width="7" height="7" rx="1" fill="#E6B84C" stroke="#2D2323" stroke-width="1.5"/>`),
    artboardFlip: retroSvg(`<rect x="3" y="7" width="9.5" height="13.5" rx="1.5" fill="#5B9BD5" stroke="#2D2323" stroke-width="1.5"/><path d="M15.5 4h3a2 2 0 0 1 2 2v3" stroke="#E06D53" stroke-width="2"/><path d="M17.5 2l-2 2 2 2" stroke="#E06D53" stroke-width="2"/><rect x="16.5" y="13.5" width="4.5" height="7" rx="1" fill="#E6B84C" stroke="#2D2323" stroke-width="1.4"/>`),
    artboardPresets: retroSvg(`<rect x="3" y="4" width="11.5" height="16" rx="1.5" fill="#CEC8B8" stroke="#2D2323" stroke-width="1.5"/><rect x="14.5" y="8" width="6.5" height="12" rx="1.5" fill="#63B097" stroke="#2D2323" stroke-width="1.5"/>`),
    pageAdd: retroSvg(`<rect x="5" y="3" width="14" height="18" rx="1.8" fill="#FAF6EE" stroke="#2D2323" stroke-width="1.6"/><path d="M12 9v6M9 12h6" stroke="#63B097" stroke-width="2.2"/>`),
    guides: retroSvg(`<rect x="3" y="3" width="18" height="18" rx="1.8" fill="#FAF6EE" stroke="#2D2323" stroke-width="1.5"/><line x1="9" y1="3" x2="9" y2="21" stroke="#5B9BD5" stroke-width="1.5" stroke-dasharray="2.5 2"/><line x1="3" y1="9" x2="21" y2="9" stroke="#E06D53" stroke-width="1.5" stroke-dasharray="2.5 2"/>`),

    // 03-corner.js — Cantos / Fillet / Chanfro / Côncavo / Zerar
    corner: retroSvg(`<path d="M5 19V5h14" stroke="#2D2323" stroke-width="1.6"/><path d="M5 5l5.5 5.5" stroke="#E06D53" stroke-width="2"/><path d="M6.5 10.5h4v-4" stroke="#E06D53" stroke-width="2"/><path d="M11.5 19a7.5 7.5 0 0 1 7.5-7.5" stroke="#63B097" stroke-width="2.4"/><circle cx="13.5" cy="13.5" r="2.4" fill="#E6B84C" stroke="#2D2323" stroke-width="1.3"/>`),
    cornerRound: retroSvg(`<path d="M4 20V11a7 7 0 0 1 7-7h9" stroke="#63B097" stroke-width="2.6"/><circle cx="8.5" cy="8.5" r="2.2" fill="#E6B84C" stroke="#2D2323" stroke-width="1.2"/>`),
    cornerChamfer: retroSvg(`<path d="M5 19V11l6-6h8" stroke="#E6B84C" stroke-width="2.6"/><circle cx="8" cy="8" r="2.2" fill="#E06D53" stroke="#2D2323" stroke-width="1.2"/>`),
    cornerInverted: retroSvg(`<path d="M5 19v-7a7 7 0 0 0 7-7h7" stroke="#9B7EDE" stroke-width="2.6"/><circle cx="10" cy="10" r="2.2" fill="#5B9BD5" stroke="#2D2323" stroke-width="1.2"/>`),
    cornerReset: retroSvg(`<path d="M5 19V5h14" stroke="#2D2323" stroke-width="1.8"/><rect x="3.2" y="3.2" width="4" height="4" fill="#E06D53" stroke="#2D2323" stroke-width="1.2"/>`),

    // 04-contour.js — Contorno, Espessura, Tracejado, Junção, Alinhamento, Posição
    contour: retroSvg(`<circle cx="11" cy="13" r="4.2" fill="#E06D53" stroke="#2D2323" stroke-width="1.5"/><circle cx="11" cy="13" r="8.2" stroke="#5B9BD5" stroke-width="1.8" stroke-dasharray="2.5 2.5"/><path d="M16 4h4v4M20 4l-4.5 4.5" stroke="#E6B84C" stroke-width="2.1"/>`),
    contourDuplicate: retroSvg(`<rect x="7" y="7" width="10" height="10" rx="2" fill="#E6B84C" stroke="#2D2323" stroke-width="1.5"/><rect x="3" y="3" width="18" height="18" rx="4" stroke="#63B097" stroke-width="1.8" stroke-dasharray="3 2"/>`),
    strokeStyleCycle: retroSvg(`<line x1="4" y1="18" x2="20" y2="6" stroke="#E06D53" stroke-width="2.6" stroke-dasharray="4 3"/>`),
    strokeWidthStep: retroSvg(`<line x1="4" y1="7" x2="20" y2="7" stroke="#5B9BD5" stroke-width="1.4"/><line x1="4" y1="12" x2="20" y2="12" stroke="#E6B84C" stroke-width="2.6"/><line x1="4" y1="17" x2="20" y2="17" stroke="#E06D53" stroke-width="4.2"/>`),
    strokeJoinCycle: retroSvg(`<path d="M5 19V9a4 4 0 0 1 4-4h10" stroke="#63B097" stroke-width="2.2"/><path d="M9 19v-8a2 2 0 0 1 2-2h8" stroke="#5B9BD5" stroke-width="1.8"/>`),
    strokeAlignOrderCycle: retroSvg(`<rect x="4" y="4" width="11" height="11" rx="1.5" fill="#E6B84C" stroke="#2D2323" stroke-width="1.5"/><rect x="9" y="9" width="11" height="11" rx="1.5" fill="#5B9BD5" fill-opacity="0.7" stroke="#2D2323" stroke-width="1.5"/>`),
    contourPositionCycle: retroSvg(`<circle cx="12" cy="12" r="3.2" fill="#E6B84C" stroke="#2D2323" stroke-width="1.4"/><path d="M12 2v4M12 18v4" stroke="#E06D53" stroke-width="2"/><path d="M2 12h4M18 12h4" stroke="#5B9BD5" stroke-width="2"/>`),
    contourStroke: retroSvg(`<rect x="4" y="5" width="16" height="14" rx="2" fill="#CEC8B8" fill-opacity="0.35" stroke="#2D2323" stroke-width="2.2"/><rect x="8.5" y="9.5" width="7" height="5" rx="1" fill="#5B9BD5" stroke="#2D2323" stroke-width="1.2"/>`),
    contourDash: retroSvg(`<line x1="3" y1="12" x2="8.5" y2="12" stroke="#E06D53" stroke-width="2.4"/><line x1="11" y1="12" x2="15.5" y2="12" stroke="#E6B84C" stroke-width="2.4"/><line x1="18" y1="12" x2="21.5" y2="12" stroke="#5B9BD5" stroke-width="2.4"/>`),
    contourFill: retroSvg(`<path d="M12 3l8 9-8 9-8-9z" fill="#9B7EDE" stroke="#2D2323" stroke-width="1.6"/><circle cx="12" cy="12" r="2.5" fill="#E6B84C"/>`),
  };

  window.RoblesIcons = {
    ...(window.RoblesIcons || {}),
    ...BASE_ICONS,
    vector: VECTOR_ICONS,
    retroSvg,
    resolveIcon,
    get: (key, group = null, size = 16, alt = "") => {
      const raw = group ? window.RoblesIcons?.[group]?.[key] : window.RoblesIcons?.[key];
      return resolveIcon(raw, size, alt || key);
    },
  };
})();