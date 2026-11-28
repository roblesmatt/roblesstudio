// icons.js — Biblioteca Central de Ícones Minimalistas Adaptativos (Robles Studio)
// Inativo: traço minimalista preto/grafite (#2D2323)
// Selecionado / Ativo / Hover: bloco escuro (#434039), borda sutil (#7E6337) e ícone branco (#FAF6EE)

(() => {
  const STYLE_ID = "robles-icons-minimal-black-white";

  const injectStyles = () => {
    if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      svg.rs-icon {
        display: block;
        pointer-events: none;
        color: #2D2323;
        transition: color 0.14s ease, background-color 0.14s ease, border-color 0.14s ease;
      }

      svg.rs-icon .rs-fill {
        fill: currentColor;
      }

      svg.rs-icon .rs-soft {
        fill: currentColor;
        fill-opacity: 0.16;
      }

      /* Estado INATIVO: ícone preto */
      svg.rs-icon {
        color: #2D2323;
      }

      /* Estado SELECIONADO / ATIVO / HOVER: bloco escuro com borda e ícone branco */
      button:hover,
      button.active,
      button.is-active,
      button.selected,
      button[aria-pressed="true"],
      button[aria-selected="true"],
      .active > button,
      .is-active > button,
      .selected > button,
      [data-active="true"],
      [data-selected="true"] {
        background-color: #434039;
        border-color: #7E6337;
        border-radius: 7px;
      }

      button:hover svg.rs-icon,
      button.active svg.rs-icon,
      button.is-active svg.rs-icon,
      button.selected svg.rs-icon,
      button[aria-pressed="true"] svg.rs-icon,
      button[aria-selected="true"] svg.rs-icon,
      .active > svg.rs-icon,
      .is-active > svg.rs-icon,
      .selected > svg.rs-icon,
      [data-active="true"] svg.rs-icon,
      [data-selected="true"] svg.rs-icon,
      .active svg.rs-icon,
      .is-active svg.rs-icon,
      .selected svg.rs-icon,
      svg.rs-icon.is-active,
      svg.rs-icon.active,
      svg.rs-icon.selected {
        color: #FAF6EE;
      }
    `;
    document.head.appendChild(style);
  };

  injectStyles();

  const retroSvg = (body, size = 16, active = false) => {
    const activeCls = active ? " is-active" : "";
    return `<svg class="rs-icon${activeCls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  };

  const applySvgSize = (svgMarkup, size = 16) => {
    if (!size) return svgMarkup;
    if (/width="[^"]*"/i.test(svgMarkup)) {
      return svgMarkup
        .replace(/width="[^"]*"/i, `width="${size}"`)
        .replace(/height="[^"]*"/i, `height="${size}"`);
    }
    return svgMarkup.replace("<svg", `<svg width="${size}" height="${size}"`);
  };

  const resolveIcon = (value, size = 16, alt = "", active = false) => {
    if (!value || typeof value !== "string") return "";
    const trimmed = value.trim();
    if (!trimmed) return "";

    if (trimmed.startsWith("<svg")) {
      let out = applySvgSize(trimmed, size);
      if (active && !/\bis-active\b/.test(out)) {
        out = out.replace('class="rs-icon', 'class="rs-icon is-active');
      }
      return out;
    }

    return `<img src="${trimmed}" alt="${alt}" width="${size}" height="${size}" loading="lazy" decoding="async" style="width:${size}px;height:${size}px;object-fit:contain;display:block;pointer-events:none;" />`;
  };

  const BASE_ICONS = {
    // =========================================================================
    // SUB-MODOS (BARRA SUPERIOR DIREITA)
    // =========================================================================
    sub3dParametric: retroSvg(`<polygon class="rs-soft" points="12 3 20.5 7.8 12 12.5 3.5 7.8"/><polygon points="12 3 20.5 7.8 20.5 16.2 12 21 3.5 16.2 3.5 7.8"/><polyline points="3.5 7.8 12 12.5 20.5 7.8"/><line x1="12" y1="12.5" x2="12" y2="21"/>`),
    sub3dHardSurface: retroSvg(`<polygon points="12 3 20.5 7.8 20.5 16.2 12 21 3.5 16.2 3.5 7.8"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="3.5" y1="7.8" x2="20.5" y2="16.2"/><line x1="20.5" y1="7.8" x2="3.5" y2="16.2"/>`),
    sub3dSculpt: retroSvg(`<path class="rs-soft" d="M12 3.5c4.7 0 8.5 3.4 8.5 7.6 0 2.4-1.1 4.5-3 5.9-.8.6-1.2 1.4-1.2 2.4v1.1H7.7v-1.1c0-1-.4-1.8-1.2-2.4-1.9-1.4-3-3.5-3-5.9 0-4.2 3.8-7.6 8.5-7.6Z"/><path d="M8.5 11.5c1.8-1.3 5.2-1.3 7 0"/>`),
    sub3dRender: retroSvg(`<circle class="rs-soft" cx="12" cy="12" r="4.5"/><path d="M12 2.5v2.5M12 19v2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M2.5 12H5M19 12h2.5M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/>`),

    subPxManip: retroSvg(`<rect x="3.5" y="4" width="17" height="16" rx="2.5"/><circle cx="8.8" cy="8.8" r="1.3"/><polyline points="4 17.5 10 11.5 14.5 16 17.5 13 20.5 16"/>`),
    subPxPhoto: retroSvg(`<circle cx="12" cy="12" r="8.5"/><circle class="rs-soft" cx="12" cy="12" r="3.8"/><line x1="12" y1="3.5" x2="15.2" y2="8.8"/><line x1="20.2" y1="10" x2="15.8" y2="12"/><line x1="16.8" y1="19" x2="13.6" y2="15.4"/><line x1="7.2" y1="19" x2="8.8" y2="14"/><line x1="3.8" y1="10" x2="8.2" y2="12"/><line x1="7.2" y1="5" x2="10.4" y2="8.6"/>`),
    subPxPaint: retroSvg(`<path d="M18.2 3.2 14 7.4l-1.5-1.5L8.2 10.2l5.6 5.6 4.3-4.3-1.5-1.5 4.2-4.2a1.8 1.8 0 0 0-2.6-2.6Z"/><path class="rs-soft" d="M9.5 11.5c-2 2-3.5 2.5-6 3l5.5 6.3c1.8-.8 4.8-3.8 5.5-5.5"/>`),

    subVidClip: retroSvg(`<rect x="3" y="4.5" width="18" height="15" rx="2"/><line x1="7.5" y1="4.5" x2="7.5" y2="19.5"/><line x1="16.5" y1="4.5" x2="16.5" y2="19.5"/><line x1="3" y1="9.5" x2="7.5" y2="9.5"/><line x1="3" y1="14.5" x2="7.5" y2="14.5"/><line x1="16.5" y1="9.5" x2="21" y2="9.5"/><line x1="16.5" y1="14.5" x2="21" y2="14.5"/>`),
    subVidMotion: retroSvg(`<polygon class="rs-soft" points="12 3.5 20.5 12 12 20.5 3.5 12"/><circle cx="12" cy="12" r="2.8"/>`),

    // =========================================================================
    // AÇÕES GLOBAIS, UI, GAVETAS E RODAPÉ
    // =========================================================================
    undo: retroSvg(`<polyline points="9 14 4 9 9 4"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>`),
    redo: retroSvg(`<polyline points="15 14 20 9 15 4"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/>`),
    copy: retroSvg(`<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>`),
    paste: retroSvg(`<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect class="rs-soft" x="8" y="2" width="8" height="4" rx="1"/>`),
    duplicate: retroSvg(`<rect x="8.5" y="8.5" width="11.5" height="11.5" rx="2"/><path d="M15.5 8.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7.5a2 2 0 0 0 2 2h2.5"/><line x1="14.25" y1="11.5" x2="14.25" y2="17"/><line x1="11.5" y1="14.25" x2="17" y2="14.25"/>`),
    snap: retroSvg(`<path d="M6 14V9a6 6 0 0 1 12 0v5"/><line x1="4" y1="14" x2="8.5" y2="14"/><line x1="15.5" y1="14" x2="20" y2="14"/><path d="M4 14v2.5a2.25 2.25 0 0 0 4.5 0V14M15.5 14v2.5a2.25 2.25 0 0 0 4.5 0V14"/>`),

    layers: retroSvg(`<polygon points="12 3 21 7.8 12 12.6 3 7.8"/><polyline points="3 12.2 12 17 21 12.2"/><polyline points="3 16.6 12 21.4 21 16.6"/>`),
    measures: retroSvg(`<rect x="3" y="7" width="18" height="10" rx="2"/><line x1="7.5" y1="7" x2="7.5" y2="10.5"/><line x1="12" y1="7" x2="12" y2="12"/><line x1="16.5" y1="7" x2="16.5" y2="10.5"/>`),
    history: retroSvg(`<circle cx="12" cy="12" r="8.5"/><polyline points="12 7.5 12 12 15.2 14"/>`),
    historyCounter: retroSvg(`<path d="M16 4l4 4L8 20H4v-4L16 4z"/>`, 13),
    historyStep: retroSvg(`<circle class="rs-soft" cx="12" cy="12" r="6.5"/>`, 14),

    eye: retroSvg(`<path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5-9.5-6.5-9.5-6.5Z"/><circle cx="12" cy="12" r="2.8"/>`, 13),
    eyeOff: retroSvg(`<path d="M17.9 17.9A10.7 10.7 0 0 1 12 19c-6 0-9.5-7-9.5-7a18.2 18.2 0 0 1 5-5.8"/><path d="M9.9 5.2A9.2 9.2 0 0 1 12 5c6 0 9.5 7 9.5 7a18.2 18.2 0 0 1-2.1 3.1"/><line x1="3" y1="3" x2="21" y2="21"/>`, 13),
    trash: retroSvg(`<polyline points="4 6.5 20 6.5"/><path d="M18.5 6.5l-1 13.5H6.5l-1-13.5"/><path d="M9.5 6.5V4.5h5v2"/>`, 14),
    plus: retroSvg(`<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>`, 13),
    save: retroSvg(`<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>`, 15),
    gear: retroSvg(`<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>`, 15),
    exportIcon: retroSvg(`<path d="M5 15v3.5A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V15"/><line x1="12" y1="3.5" x2="12" y2="14.5"/><polyline points="8 10.5 12 14.5 16 10.5"/>`, 15),
    bridge: retroSvg(`<line x1="6.5" y1="17.5" x2="17.5" y2="6.5"/><polyline points="8.5 6.5 17.5 6.5 17.5 15.5"/>`, 13),

    // =========================================================================
    // COMUNS (IMPORTAR / EXPORTAR / ESCALA / RESET / SELEÇÃO / CORES)
    // =========================================================================
    ioImport: retroSvg(`<path d="M5 15v3.5A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V15"/><line x1="12" y1="14.5" x2="12" y2="4"/><polyline points="8 8 12 4 16 8"/>`),
    ioExport: retroSvg(`<path d="M5 15v3.5A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V15"/><line x1="12" y1="3.5" x2="12" y2="14.5"/><polyline points="8 10.5 12 14.5 16 10.5"/>`),
    scaleUp: retroSvg(`<polyline points="14 4.5 19.5 4.5 19.5 10"/><polyline points="10 19.5 4.5 19.5 4.5 14"/><line x1="19.5" y1="4.5" x2="14" y2="10"/><line x1="4.5" y1="19.5" x2="10" y2="14"/>`),
    scaleDown: retroSvg(`<polyline points="10 10 4.5 10 4.5 4.5"/><polyline points="14 14 19.5 14 19.5 19.5"/><line x1="4.5" y1="10" x2="10" y2="4.5"/><line x1="19.5" y1="14" x2="14" y2="19.5"/>`),
    resetCycle: retroSvg(`<path d="M4 12a8 8 0 1 0 2.4-5.7L4 8.7"/><polyline points="4 4 4 8.7 8.7 8.7"/>`),
    selectPointer: retroSvg(`<path class="rs-soft" d="M5.5 4.2l13.8 8.8-6.4 1.5L9.5 20.5 5.5 4.2Z"/>`),
    plusCircle: retroSvg(`<circle cx="12" cy="12" r="8.5"/><line x1="12" y1="8.5" x2="12" y2="15.5"/><line x1="8.5" y1="12" x2="15.5" y2="12"/>`),
    minusCircle: retroSvg(`<circle cx="12" cy="12" r="8.5"/><line x1="8.5" y1="12" x2="15.5" y2="12"/>`),
    eraserRetro: retroSvg(`<path d="M7.5 20.5l-3.7-3.7a2.1 2.1 0 0 1 0-3l8.8-8.8a2.1 2.1 0 0 1 3 0l4.5 4.5a2.1 2.1 0 0 1 0 3l-7.6 8H7.5Z"/><line x1="9" y1="10" x2="14.5" y2="15.5"/><line x1="12" y1="20.5" x2="20.5" y2="20.5"/>`),

    // =========================================================================
    // MÓDULO 3D (3d.js)
    // =========================================================================
    primSoapBar: retroSvg(`<rect x="5.5" y="3.5" width="13" height="17" rx="4"/><rect x="8" y="6.5" width="8" height="11" rx="1.8"/>`),
    primCardBox: retroSvg(`<polygon points="12 3 20 7.6 12 12.2 4 7.6"/><polyline points="4 12.2 12 16.8 20 12.2"/><polyline points="4 16.4 12 21 20 16.4"/>`),
    primCube: retroSvg(`<rect x="4.5" y="4.5" width="15" height="15" rx="2.5"/>`),
    primCylinder: retroSvg(`<path d="M5.5 6.5v11c0 1.6 2.9 3 6.5 3s6.5-1.4 6.5-3v-11"/><ellipse cx="12" cy="6.5" rx="6.5" ry="3"/>`),
    cadExtrudePlus: retroSvg(`<rect x="5" y="12" width="14" height="7.5" rx="2"/><line x1="12" y1="12" x2="12" y2="4"/><polyline points="8.5 7.5 12 4 15.5 7.5"/>`),
    cadExtrudeMinus: retroSvg(`<rect x="5" y="12" width="14" height="7.5" rx="2"/><line x1="12" y1="4" x2="12" y2="12"/><polyline points="8.5 8.5 12 12 15.5 8.5"/>`),
    cadEdgeFillet: retroSvg(`<path d="M5 19V5h14" stroke-dasharray="2.5 2"/><path d="M5 19v-8.5A5.5 5.5 0 0 1 10.5 5H19"/>`),
    cadDebossSeven: retroSvg(`<rect x="4.5" y="4.5" width="15" height="15" rx="2.5"/><polyline points="9 8.5 15 8.5 11 16"/>`),
    cadResetView: retroSvg(`<circle cx="12" cy="12" r="3.8"/><line x1="12" y1="3" x2="12" y2="6.2"/><line x1="12" y1="17.8" x2="12" y2="21"/><line x1="3" y1="12" x2="6.2" y2="12"/><line x1="17.8" y1="12" x2="21" y2="12"/>`),

    hsSelFaces: retroSvg(`<polygon points="12 3 20 8 20 16 12 21 4 16 4 8"/><polygon class="rs-soft" points="12 3 20 8 12 13 4 8"/>`),
    hsSelEdges: retroSvg(`<polygon points="12 3 20 8 20 16 12 21 4 16 4 8"/><polyline points="4 8 12 13 20 8"/><line x1="12" y1="13" x2="12" y2="21"/>`),
    hsSelVertices: retroSvg(`<rect x="5.5" y="5.5" width="13" height="13" rx="1.5"/><circle class="rs-soft" cx="5.5" cy="5.5" r="2"/><circle class="rs-soft" cx="18.5" cy="5.5" r="2"/><circle class="rs-soft" cx="18.5" cy="18.5" r="2"/><circle class="rs-soft" cx="5.5" cy="18.5" r="2"/>`),
    hsSubdivideMesh: retroSvg(`<rect x="4" y="4" width="16" height="16" rx="2"/><line x1="12" y1="4" x2="12" y2="20"/><line x1="4" y1="12" x2="20" y2="12"/>`),
    hsBevelPoly: retroSvg(`<polygon points="8 3.5 16 3.5 20.5 8 20.5 16 16 20.5 8 20.5 3.5 16 3.5 8"/>`),
    hsToggleWire: retroSvg(`<circle cx="12" cy="12" r="8.5"/><ellipse cx="12" cy="12" rx="8.5" ry="3.4"/><ellipse cx="12" cy="12" rx="3.4" ry="8.5"/>`),
    hsTaperTop: retroSvg(`<polygon points="8 4.5 16 4.5 19.5 19.5 4.5 19.5"/>`),
    hsTwistMesh: retroSvg(`<path d="M6.5 4.5c5.5 4 5.5 11 11 15"/><path d="M17.5 4.5c-5.5 4-5.5 11-11 15"/>`),

    brushClay: retroSvg(`<path d="M4.5 18c2.2-8 12.8-8 15 0h-15Z"/><line x1="3.5" y1="20" x2="20.5" y2="20"/>`),
    brushInflate: retroSvg(`<circle cx="12" cy="12" r="5.5"/><line x1="12" y1="2.5" x2="12" y2="4.8"/><line x1="12" y1="19.2" x2="12" y2="21.5"/><line x1="2.5" y1="12" x2="4.8" y2="12"/><line x1="19.2" y1="12" x2="21.5" y2="12"/>`),
    brushCarve: retroSvg(`<path d="M4.5 6c2.2 8 12.8 8 15 0h-15Z"/><line x1="3.5" y1="4" x2="20.5" y2="4"/>`),
    brushSmooth: retroSvg(`<path d="M3.5 12.5c3.8-3.8 5.8 3.8 8.5 0s4.7 3.8 8.5 0"/>`),
    sculptSphereBase: retroSvg(`<circle cx="12" cy="12" r="8.5"/>`),
    sculptSoapOrganic: retroSvg(`<rect x="4" y="5.5" width="16" height="13" rx="5.5"/>`),
    scSymmetryToggle: retroSvg(`<line x1="12" y1="3" x2="12" y2="21" stroke-dasharray="2.5 2"/><polyline points="9 8 5 12 9 16"/><polyline points="15 8 19 12 15 16"/>`),

    rtToggleSamples: retroSvg(`<polygon points="13 2.5 4.5 13.5 12 13.5 11 21.5 19.5 10.5 12 10.5 13 2.5"/>`),
    shSageMatte: retroSvg(`<circle cx="12" cy="12" r="8"/>`),
    shAmberGlass: retroSvg(`<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.5"/>`),
    shApothecaryBeige: retroSvg(`<circle class="rs-soft" cx="12" cy="12" r="8"/>`),
    shBrushedGold: retroSvg(`<circle cx="12" cy="12" r="8"/><line x1="8.5" y1="8.5" x2="15.5" y2="15.5"/>`),
    hdriStudioWarm: retroSvg(`<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.8"/>`),
    hdriDramaticNoir: retroSvg(`<circle cx="12" cy="12" r="8.5"/><path class="rs-soft" d="M12 3.5a8.5 8.5 0 0 0 0 17V3.5Z"/>`),
    rtCameraTurntable: retroSvg(`<ellipse cx="12" cy="12.5" rx="8.5" ry="4"/><polyline points="16 9.5 19.5 12.5 16 15.5"/>`),

    // =========================================================================
    // MÓDULO PIXEL (pixel.js)
    // =========================================================================
    brush: retroSvg(`<path d="M18.2 3.2 14 7.4l-1.5-1.5L8.2 10.2l5.6 5.6 4.3-4.3-1.5-1.5 4.2-4.2a1.8 1.8 0 0 0-2.6-2.6Z"/><path d="M9.5 11.5c-2 2-3.5 2.5-6 3l5.5 6.3c1.8-.8 4.8-3.8 5.5-5.5"/>`),
    pcNewCanvas: retroSvg(`<rect x="4.5" y="4.5" width="15" height="15" rx="2.5"/><line x1="12" y1="8.5" x2="12" y2="15.5"/><line x1="8.5" y1="12" x2="15.5" y2="12"/>`),
    pcMarqueeRect: retroSvg(`<rect x="4.5" y="4.5" width="15" height="15" rx="1.5" stroke-dasharray="3 2.5"/>`),
    pcCropToSel: retroSvg(`<path d="M6.5 3v12.5A2 2 0 0 0 8.5 17.5H21"/><path d="M17.5 21V8.5a2 2 0 0 0-2-2H3"/>`),
    pcClearSel: retroSvg(`<rect x="4.5" y="4.5" width="15" height="15" rx="2.5"/><line x1="9.2" y1="9.2" x2="14.8" y2="14.8"/><line x1="14.8" y1="9.2" x2="9.2" y2="14.8"/>`),
    pcMoveLayer: retroSvg(`<polyline points="6 9 3 12 6 15"/><polyline points="9 6 12 3 15 6"/><polyline points="15 18 12 21 9 18"/><polyline points="18 9 21 12 18 15"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="12" y1="3" x2="12" y2="21"/>`),
    pcFlipH: retroSvg(`<line x1="12" y1="3.5" x2="12" y2="20.5" stroke-dasharray="2.5 2"/><polyline points="8.5 8 4.5 12 8.5 16"/><polyline points="15.5 8 19.5 12 15.5 16"/>`),
    pcBlurBrush: retroSvg(`<path class="rs-soft" d="M12 3l5.3 5.3a7.5 7.5 0 1 1-10.6 0L12 3Z"/><path d="M12 3l5.3 5.3a7.5 7.5 0 1 1-10.6 0L12 3Z"/>`),
    pcLiquify: retroSvg(`<path d="M3.5 12c2.8-5 5.6 5 8.5 0s5.7 5 8.5 0"/>`),
    pcInvertColors: retroSvg(`<circle cx="12" cy="12" r="8.5"/><path class="rs-soft" d="M12 3.5a8.5 8.5 0 0 1 0 17V3.5Z"/><line x1="12" y1="3.5" x2="12" y2="20.5"/>`),
    pcPixelate: retroSvg(`<rect x="4.5" y="4.5" width="6.5" height="6.5" rx="1"/><rect class="rs-soft" x="13" y="4.5" width="6.5" height="6.5" rx="1"/><rect class="rs-soft" x="4.5" y="13" width="6.5" height="6.5" rx="1"/><rect x="13" y="13" width="6.5" height="6.5" rx="1"/>`),

    lcExpDown: retroSvg(`<circle cx="12" cy="12" r="8"/><line x1="8.5" y1="12" x2="15.5" y2="12"/>`),
    lcContrastUp: retroSvg(`<circle cx="12" cy="12" r="8.5"/><path class="rs-soft" d="M12 3.5a8.5 8.5 0 0 0 0 17V3.5Z"/><line x1="12" y1="3.5" x2="12" y2="20.5"/>`),
    lcContrastDown: retroSvg(`<circle cx="12" cy="12" r="8.5"/><line x1="7" y1="16.5" x2="17" y2="7.5"/>`),
    lcWarmUp: retroSvg(`<path d="M14 14.5V5a2 2 0 0 0-4 0v9.5a4 4 0 1 0 4 0Z"/>`),
    lcCoolDown: retroSvg(`<line x1="12" y1="3" x2="12" y2="21"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="5.6" y1="5.6" x2="18.4" y2="18.4"/><line x1="18.4" y1="5.6" x2="5.6" y2="18.4"/>`),
    lcSatUp: retroSvg(`<circle cx="12" cy="8.8" r="3.8"/><circle cx="8.8" cy="14.5" r="3.8"/><circle cx="15.2" cy="14.5" r="3.8"/>`),
    lcSatDown: retroSvg(`<circle cx="12" cy="12" r="8" stroke-dasharray="2.5 2"/>`),
    lcPresetApothecary: retroSvg(`<rect x="4.5" y="4.5" width="15" height="15" rx="2.5"/>`),
    lcPresetBotanical: retroSvg(`<rect class="rs-soft" x="4.5" y="4.5" width="15" height="15" rx="2.5"/>`),
    lcPresetMono: retroSvg(`<rect x="4.5" y="4.5" width="15" height="15" rx="2.5"/><line x1="4.5" y1="19.5" x2="19.5" y2="4.5"/>`),
    lcVignetteToggle: retroSvg(`<rect x="4" y="4.5" width="16" height="15" rx="2.5"/><circle cx="12" cy="12" r="4.2"/>`),

    krPencilHB: retroSvg(`<path d="M16 4l4 4L8.5 19.5H4.5v-4L16 4Z"/><line x1="14.5" y1="5.5" x2="18.5" y2="9.5"/>`),
    krCharcoal: retroSvg(`<path class="rs-soft" d="M4.5 19.5L18.5 5.5l2 2L6.5 21.5h-2v-2Z"/><path d="M4.5 19.5L18.5 5.5l2 2L6.5 21.5h-2v-2Z"/>`),
    krInkPen: retroSvg(`<path d="M17.5 13l-1.5-7-13-3 3 13 7 1.5 4.5-4.5Z"/><circle cx="10.2" cy="10.2" r="1.4"/>`),
    krWatercolorEdge: retroSvg(`<circle class="rs-soft" cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.5"/>`),
    krWaterBlender: retroSvg(`<path d="M8 16.5c2 0 3.6-1.6 3.6-3.6 0-1.8-2.2-4.2-3.6-6-1.4 1.8-3.6 4.2-3.6 6 0 2 1.6 3.6 3.6 3.6Z"/><path d="M16 19c1.9 0 3.4-1.5 3.4-3.4 0-1.7-2-3.9-3.4-5.6-1.4 1.7-3.4 3.9-3.4 5.6 0 1.9 1.5 3.4 3.4 3.4Z"/>`),
    krRgbaBristle: retroSvg(`<line x1="4.5" y1="6.8" x2="19.5" y2="6.8"/><line x1="4.5" y1="10.3" x2="19.5" y2="10.3"/><line x1="4.5" y1="13.8" x2="19.5" y2="13.8"/><line x1="4.5" y1="17.3" x2="19.5" y2="17.3"/>`),
    krRgbaAirbrush: retroSvg(`<circle cx="12" cy="12" r="8" stroke-dasharray="1.8 2.4"/><circle cx="12" cy="12" r="3.5"/>`),
    krColorDarkBrown: retroSvg(`<circle class="rs-soft" cx="12" cy="12" r="8"/>`),
    krColorTerracotta: retroSvg(`<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2.2"/>`),
    krColorCustom: retroSvg(`<circle cx="12" cy="12" r="8"/><line x1="12" y1="4" x2="12" y2="12"/><line x1="12" y1="12" x2="19.5" y2="14.5"/>`),

    // =========================================================================
    // MÓDULO VÍDEO (video.js)
    // =========================================================================
    timeline: retroSvg(`<rect x="3" y="4.5" width="18" height="15" rx="2"/><polygon class="rs-soft" points="10 8.8 15.5 12 10 15.2 10 8.8"/>`),
    vidDuplicate: retroSvg(`<rect x="4" y="4" width="10.5" height="10.5" rx="2"/><rect x="9.5" y="9.5" width="10.5" height="10.5" rx="2"/>`),
    vidRazor: retroSvg(`<circle cx="6.5" cy="6.5" r="2.5"/><circle cx="6.5" cy="17.5" r="2.5"/><line x1="19.5" y1="4.5" x2="8.4" y2="15.6"/><line x1="13.5" y1="13.5" x2="19.5" y2="19.5"/>`),
    vidTrimStart: retroSvg(`<line x1="5.5" y1="4.5" x2="5.5" y2="19.5"/><polyline points="13.5 8.5 10 12 13.5 15.5"/><line x1="10" y1="12" x2="19.5" y2="12"/>`),
    vidTrimEnd: retroSvg(`<line x1="18.5" y1="4.5" x2="18.5" y2="19.5"/><polyline points="10.5 8.5 14 12 10.5 15.5"/><line x1="4.5" y1="12" x2="14" y2="12"/>`),
    vidRippleDelete: retroSvg(`<polyline points="4 6.5 20 6.5"/><path d="M18.5 6.5l-1 13.5H6.5l-1-13.5"/><line x1="9.5" y1="12.5" x2="14.5" y2="12.5"/>`),
    vidKeyframeAdd: retroSvg(`<polygon points="12 3.5 20 12 12 20.5 4 12"/>`),
    vidKeyframeClear: retroSvg(`<polygon points="12 3.5 20 12 12 20.5 4 12" stroke-dasharray="2.5 2"/>`),
    vidTitleCenter: retroSvg(`<rect x="4.5" y="4.5" width="15" height="15" rx="2"/><line x1="8" y1="8.5" x2="16" y2="8.5"/><line x1="12" y1="8.5" x2="12" y2="16.5"/><line x1="9.8" y1="16.5" x2="14.2" y2="16.5"/>`),
    vidLowerThird: retroSvg(`<rect x="4" y="4.5" width="16" height="15" rx="2"/><rect class="rs-soft" x="6.5" y="13.5" width="10.5" height="3.5" rx="1"/>`),
    vidTransDissolve: retroSvg(`<rect x="3.5" y="5.5" width="9.5" height="13" rx="1.5"/><rect x="11" y="5.5" width="9.5" height="13" rx="1.5" stroke-dasharray="2.5 2"/>`),
    vidTransFade: retroSvg(`<polygon points="4 18.5 12 5.5 20 18.5"/>`),
    vidTransCut: retroSvg(`<rect x="4" y="5.5" width="6.5" height="13" rx="1.5"/><rect x="13.5" y="5.5" width="6.5" height="13" rx="1.5"/>`),
    vidAspect16x9: retroSvg(`<rect x="2.5" y="6.5" width="19" height="11" rx="2"/>`),
    vidAspect9x16: retroSvg(`<rect x="6.5" y="2.5" width="11" height="19" rx="2"/>`),
    vidAspect1x1: retroSvg(`<rect x="4.5" y="4.5" width="15" height="15" rx="2"/>`),
    vidZoomIn: retroSvg(`<circle cx="11" cy="11" r="7"/><line x1="20.5" y1="20.5" x2="16" y2="16"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>`),
    vidZoomOut: retroSvg(`<circle cx="11" cy="11" r="7"/><line x1="20.5" y1="20.5" x2="16" y2="16"/><line x1="8" y1="11" x2="14" y2="11"/>`),

    // Motion Inline
    motCodeEditor: retroSvg(`<rect x="3" y="4.5" width="18" height="15" rx="2"/><polyline points="15 15 18 12 15 9"/><polyline points="9 9 6 12 9 15"/>`),
    motSvgSeal: retroSvg(`<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.5"/>`),
    motSvgWave: retroSvg(`<path d="M3.5 13.5c4-7 13 7 17 0"/>`),
    motSvgBadge: retroSvg(`<rect x="4.5" y="5.5" width="15" height="13" rx="2"/>`),
    motCssPulse: retroSvg(`<circle cx="12" cy="12" r="8" stroke-dasharray="2.5 2"/><circle cx="12" cy="12" r="4"/>`),
    motCssFloat: retroSvg(`<line x1="12" y1="4" x2="12" y2="20"/><polyline points="8.5 7.5 12 4 15.5 7.5"/><polyline points="8.5 16.5 12 20 15.5 16.5"/>`),
    motJsSpring: retroSvg(`<path d="M4.5 17.5c1.8-10.5 3.6 10.5 5.4 0s3.6 10.5 5.4 0 3.2 10.5 4.2 0"/>`),
    motJsOrbit: retroSvg(`<ellipse cx="12" cy="12" rx="8.5" ry="3.6" transform="rotate(-24 12 12)"/><circle cx="17.5" cy="9.5" r="2"/>`),
    motJsStrokeDraw: retroSvg(`<path d="M4 17l6-9.5 4.8 7.5L20 6.5"/><circle cx="20" cy="6.5" r="1.8"/>`),
    motEaseCubic: retroSvg(`<path d="M4.5 19.5C4.5 8 12 4.5 19.5 4.5"/><circle cx="4.5" cy="19.5" r="2"/><circle cx="19.5" cy="4.5" r="2"/>`),
    motEaseLinear: retroSvg(`<line x1="4.5" y1="19.5" x2="19.5" y2="4.5"/>`),

    // Vídeo 3D Viewport
    vid3dBottle: retroSvg(`<rect x="7.5" y="8.5" width="9" height="12" rx="2"/><rect x="10" y="3.5" width="4" height="5" rx="1"/>`),
    vid3dCamFront: retroSvg(`<rect x="5" y="5" width="14" height="14" rx="2"/>`),
  };

  const VECTOR_ICONS = {
    // 01-move.js
    move: retroSvg(`<polyline points="6 9 3 12 6 15"/><polyline points="9 6 12 3 15 6"/><polyline points="15 18 12 21 9 18"/><polyline points="18 9 21 12 18 15"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="12" y1="3" x2="12" y2="21"/>`),
    selectDeep: retroSvg(`<polygon points="12 3 20.5 7.8 12 12.6 3.5 7.8"/><polyline points="3.5 12.6 12 17.4 20.5 12.6"/><polyline points="3.5 17 12 21.8 20.5 17"/>`),
    selectLasso: retroSvg(`<path d="M7 14c-2.8-1.4-3.7-4.2-1.8-6.5 2.3-2.8 8.8-3.2 12-1 3.2 2.3 2.8 7-.9 8.8-3.2 1.6-7.4.9-9.3-1.3Z"/><circle cx="8" cy="16" r="2"/><path d="M8 18c0 1.6 1.4 2.5 3.2 2.5"/>`),
    moveAxis: retroSvg(`<line x1="12" y1="3.5" x2="12" y2="20.5"/><line x1="3.5" y1="12" x2="20.5" y2="12"/><polyline points="9.2 6.2 12 3.5 14.8 6.2"/><polyline points="9.2 17.8 12 20.5 14.8 17.8"/>`),
    pan: retroSvg(`<path d="M18 11V6a2 2 0 0 0-4 0v4M14 10V4a2 2 0 0 0-4 0v6M10 10.5V6a2 2 0 0 0-4 0v8M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.9-6-2.3l-3.6-3.6a2 2 0 0 1 2.8-2.8L7 15"/>`),
    select: retroSvg(`<path d="M5.5 4.2l13.8 8.8-6.4 1.5L9.5 20.5 5.5 4.2Z"/>`),
    pivot: retroSvg(`<line x1="12" y1="2.5" x2="12" y2="6.5"/><line x1="12" y1="17.5" x2="12" y2="21.5"/><line x1="2.5" y1="12" x2="6.5" y2="12"/><line x1="17.5" y1="12" x2="21.5" y2="12"/><circle cx="12" cy="12" r="3"/>`),
    nodes: retroSvg(`<rect x="5.5" y="5.5" width="13" height="13"/><rect class="rs-soft" x="3.5" y="3.5" width="4" height="4"/><rect class="rs-soft" x="16.5" y="3.5" width="4" height="4"/><rect class="rs-soft" x="16.5" y="16.5" width="4" height="4"/><rect class="rs-soft" x="3.5" y="16.5" width="4" height="4"/>`),

    // Submodos e Caneta / Texto
    pen: retroSvg(`<path d="M17.5 13l-1.5-7-13-3 3 13 7 1.5 4.5-4.5Z"/><circle cx="10.2" cy="10.2" r="1.4"/>`),
    text: retroSvg(`<line x1="6.5" y1="6.5" x2="17.5" y2="6.5"/><line x1="12" y1="6.5" x2="12" y2="18.5"/><line x1="9.2" y1="18.5" x2="14.8" y2="18.5"/>`),

    // 02-artboard.js
    artboard: retroSvg(`<line x1="5" y1="2.5" x2="5" y2="8"/><line x1="2.5" y1="5.2" x2="7.8" y2="5.2"/><rect x="8.5" y="8.5" width="11" height="11" rx="1.5"/>`),
    artboardFit: retroSvg(`<polyline points="4.5 9 4.5 4.5 9 4.5"/><polyline points="19.5 9 19.5 4.5 15 4.5"/><polyline points="4.5 15 4.5 19.5 9 19.5"/><polyline points="19.5 15 19.5 19.5 15 19.5"/><rect x="8.8" y="8.8" width="6.4" height="6.4" rx="1"/>`),
    artboardFlip: retroSvg(`<rect x="3.5" y="7" width="9" height="13" rx="1.5"/><path d="M15 4h3a2 2 0 0 1 2 2v3"/><polyline points="17.8 2 15 4 17.8 6"/><rect x="16" y="13.5" width="4.5" height="6.5" rx="1"/>`),
    artboardPresets: retroSvg(`<rect x="3.5" y="4" width="11" height="16" rx="1.5"/><rect x="14.5" y="8.5" width="6" height="11.5" rx="1.5"/>`),
    pageAdd: retroSvg(`<rect x="5" y="3" width="14" height="18" rx="1.5"/><line x1="12" y1="9" x2="12" y2="15"/><line x1="9" y1="12" x2="15" y2="12"/>`),
    guides: retroSvg(`<rect x="3.5" y="3.5" width="17" height="17" rx="1.5"/><line x1="9" y1="3.5" x2="9" y2="20.5" stroke-dasharray="2.5 2"/><line x1="3.5" y1="9" x2="20.5" y2="9" stroke-dasharray="2.5 2"/>`),

    // 03-corner.js
    corner: retroSvg(`<path d="M5.5 19V5.5H19" stroke-dasharray="2 2"/><path d="M11.5 19a7.5 7.5 0 0 1 7.5-7.5"/><circle cx="13.5" cy="13.5" r="1.8"/>`),
    cornerRound: retroSvg(`<path d="M4.5 19.5v-8A7 7 0 0 1 11.5 4.5h8"/><circle cx="9" cy="9" r="1.8"/>`),
    cornerChamfer: retroSvg(`<path d="M5 19v-8l6-6h8"/><circle cx="8.5" cy="8.5" r="1.8"/>`),
    cornerInverted: retroSvg(`<path d="M5 19v-7a7 7 0 0 0 7-7h7"/><circle cx="10.5" cy="10.5" r="1.8"/>`),
    cornerReset: retroSvg(`<path d="M5.5 19V5.5H19"/><rect x="3.8" y="3.8" width="3.5" height="3.5"/>`),

    // 04-contour.js
    contour: retroSvg(`<circle cx="11.5" cy="12.5" r="3.8"/><circle cx="11.5" cy="12.5" r="7.8" stroke-dasharray="2.5 2.2"/>`),
    contourDuplicate: retroSvg(`<rect x="7.5" y="7.5" width="9" height="9" rx="1.5"/><rect x="3.5" y="3.5" width="17" height="17" rx="3.5" stroke-dasharray="3 2"/>`),
    strokeStyleCycle: retroSvg(`<line x1="4.5" y1="18" x2="19.5" y2="6" stroke-dasharray="4 3"/>`),
    strokeWidthStep: retroSvg(`<line x1="4.5" y1="7" x2="19.5" y2="7" stroke-width="1.3"/><line x1="4.5" y1="12" x2="19.5" y2="12" stroke-width="2.1"/><line x1="4.5" y1="17" x2="19.5" y2="17" stroke-width="3"/>`),
    strokeJoinCycle: retroSvg(`<path d="M5 19V9a4 4 0 0 1 4-4h10"/><path d="M9.5 19v-7.5a2 2 0 0 1 2-2H19"/>`),
    strokeAlignOrderCycle: retroSvg(`<rect x="4" y="4" width="10.5" height="10.5" rx="1.5"/><rect class="rs-soft" x="9.5" y="9.5" width="10.5" height="10.5" rx="1.5"/>`),
    contourPositionCycle: retroSvg(`<circle cx="12" cy="12" r="3"/><line x1="12" y1="2.5" x2="12" y2="6.5"/><line x1="12" y1="17.5" x2="12" y2="21.5"/><line x1="2.5" y1="12" x2="6.5" y2="12"/><line x1="17.5" y1="12" x2="21.5" y2="12"/>`),
    contourStroke: retroSvg(`<rect x="4" y="5" width="16" height="14" rx="2"/><rect x="8.5" y="9.5" width="7" height="5" rx="1"/>`),
    contourDash: retroSvg(`<line x1="3.5" y1="12" x2="8.5" y2="12"/><line x1="10.8" y1="12" x2="15.2" y2="12"/><line x1="17.5" y1="12" x2="21" y2="12"/>`),
    contourFill: retroSvg(`<polygon class="rs-soft" points="12 3.5 19.5 12 12 20.5 4.5 12"/><polygon points="12 3.5 19.5 12 12 20.5 4.5 12"/>`),
  };

  window.RoblesIcons = {
    ...(window.RoblesIcons || {}),
    ...BASE_ICONS,
    vector: VECTOR_ICONS,
    retroSvg,
    resolveIcon,
    get: (key, group = null, size = 16, alt = "", active = false) => {
      const raw = group ? window.RoblesIcons?.[group]?.[key] : window.RoblesIcons?.[key];
      return resolveIcon(raw, size, alt || key, active);
    },
  };
})();