(() => {
  const CORE = () => window.RoblesCore || window.RoblesStudio || null;
  const iconOrFallback = (key, group, fallback) =>
    window.RoblesIcons?.get?.(key, group) || fallback;

  // 1. Sub-Personas no canto superior direito ao ativar "Vetor"
  const VECTOR_SUBMODES = [
    {
      id: "normal",
      label: "Normal · Prancheta Vetorial",
      description: "Edição vetorial livre com prancheta e camadas.",
      icon: iconOrFallback(
        "pen",
        "vector",
        `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><circle cx="11" cy="11" r="2"/></svg>`
      ),
    },
    {
      id: "typography",
      label: "Tipografia · Estúdio de Fontes",
      description: "Desenho de glifos com guias métricas tipográficas.",
      icon: iconOrFallback(
        "text",
        "vector",
        `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 6h14M12 6v13M8 19h8"/><line x1="3" y1="10" x2="21" y2="10" stroke-dasharray="2 2" opacity="0.65"/></svg>`
      ),
    },
    {
      id: "layout",
      label: "Layout · Diagramação & Páginas",
      description: "Composição editorial com colunas, margens e sangria.",
      icon: iconOrFallback(
        "artboard",
        "vector",
        `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="3" width="16" height="18" rx="1.5"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="4" y1="9" x2="20" y2="9"/></svg>`
      ),
    },
  ];

  const GLYPHS = ["A", "B", "C", "G", "N", "R", "S", "&", "7"];

  // 2. Workspaces isolados para cada sub-modo
  const workspaces = {
    normal: {
      activeFamilyId: "moveGroup",
      activeVariantByFamily: {},
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
      activeFamilyId: "moveGroup",
      activeVariantByFamily: {},
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
      activeFamilyId: "moveGroup",
      activeVariantByFamily: {},
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

  // 3. Estado compartilhado entre todas as ferramentas modulares
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
    showNodeHandles: false,
    showOriginPivot: false,
    undoStack: [],
    redoStack: [],
  };

  function ws() {
    return workspaces[state.submode];
  }

  // Lê apenas as ferramentas registradas externamente em js/vetor/*.js
  function getFamilies() {
    const registered = window.RoblesVectorTools || [];
    return registered
      .filter((t) => !t.submodes || t.submodes.includes(state.submode))
      .slice()
      .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  }

  function getActiveFamily() {
    const list = getFamilies();
    if (list.length === 0) return null;
    return list.find((f) => f.id === ws().activeFamilyId) || list[0];
  }

  function getActiveVariantForFamily(family) {
    if (!family || !Array.isArray(family.variants) || family.variants.length === 0) return null;
    const chosenId = ws().activeVariantByFamily[family.id] || family.variants[0].id;
    return family.variants.find((v) => v.id === chosenId) || family.variants[0];
  }

  function getCurrentToolId() {
    const fam = getActiveFamily();
    return getActiveVariantForFamily(fam)?.id || null;
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

  function renderTooltipMarkup(item) {
    return `
      <span class="tool-tip">
        <img src="${item?.preview || ""}" alt="" />
        <span class="tool-tip-body">
          <strong class="tool-tip-title">${item?.label || ""}</strong>
          <span class="tool-tip-desc">${item?.description || ""}</span>
        </span>
      </span>
    `;
  }

  // Contexto injetado em cada ferramenta modular
  function createToolContext() {
    return {
      core: CORE(),
      state,
      ws: ws(),
      workspaces,
      glyphs: GLYPHS,
      toolId: getCurrentToolId(),
      getSelectedPath: () => ws().paths[ws().selectedIndex] || null,
      snapshot,
      sync: syncWithCore,
      renderBars: renderAllVectorBars,
      getPathBounds,
      hitTestPath,
      buildPolygonPoints,
    };
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
    fam.onSelectFamily?.(createToolContext());
    renderAllVectorBars();
    syncWithCore();
  }

  function selectVariant(variantId) {
    const fam = getActiveFamily();
    if (!fam) return;
    const variant = fam.variants.find((v) => v.id === variantId);
    if (!variant) return;

    ws().activeVariantByFamily[fam.id] = variant.id;
    if (typeof variant.onAction === "function") {
      variant.onAction(createToolContext());
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
          class="tool-btn hud-persona-btn ${state.submode === mode.id ? "is-active" : ""}"
          data-vec-submode="${mode.id}"
        >
          ${mode.icon}
          ${renderTooltipMarkup(mode)}
        </button>
      `
    ).join("");

    topRightBar.querySelectorAll("[data-vec-submode]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        setVectorSubmode(btn.dataset.vecSubmode);
      });
    });
  }

  // Barra Esquerda: Ferramentas primárias carregadas (dados lidos dos módulos)
  function renderLeftPrimaryBar() {
    const leftBar = document.querySelector(".hud-left");
    if (!leftBar) return;

    const mobile = CORE()?.isMobile?.() || window.innerWidth <= 768;
    const families = getFamilies();
    const activeFam = getActiveFamily();
    const needsScroll = families.length > 8;

    leftBar.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 6px 4px;
      top: ${mobile ? "56px" : "68px"};
      left: ${mobile ? "10px" : "14px"};
      max-height: ${mobile ? "calc(100vh - 130px)" : "min(460px, calc(100vh - 150px))"};
      overflow-y: ${needsScroll ? "auto" : "visible"};
      overflow-x: visible;
      scroll-snap-type: y mandatory;
      scroll-behavior: smooth;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    `;

    if (!document.getElementById("hud-left-carousel-style")) {
      const styleEl = document.createElement("style");
      styleEl.id = "hud-left-carousel-style";
      styleEl.textContent = `.hud-left::-webkit-scrollbar { display: none; }`;
      document.head.appendChild(styleEl);
    }

    leftBar.innerHTML = families
      .map((fam) => {
        const activeVar = getActiveVariantForFamily(fam);
        const isSelected = activeFam?.id === fam.id;
        return `
          <button
            type="button"
            class="tool-btn ${isSelected ? "is-active" : ""}"
            data-vec-family="${fam.id}"
            style="position:relative; flex-shrink:0; scroll-snap-align:center;"
          >
            ${activeVar?.icon || ""}
            ${renderTooltipMarkup(fam)}
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
        if (needsScroll) btn.scrollIntoView({ block: "center", behavior: "smooth" });
      });
    });
  }

  // Barra Direita: Ferramentas secundárias da família selecionada
  function renderSecondaryRightBar() {
    let rightBar = document.querySelector(".hud-right");
    if (!rightBar) {
      rightBar = document.createElement("aside");
      rightBar.className = "hud-pill hud-right";
      document.querySelector(".viewport, .studio-shell, body")?.appendChild(rightBar);
    }

    const fam = getActiveFamily();
    if (!fam) {
      rightBar.innerHTML = "";
      return;
    }

    const activeVar = getActiveVariantForFamily(fam);
    rightBar.innerHTML = fam.variants
      .map(
        (v) => `
          <button
            type="button"
            class="tool-btn ${activeVar?.id === v.id ? "is-active" : ""}"
            data-vec-variant="${v.id}"
          >
            ${v.icon}
            ${renderTooltipMarkup(v)}
          </button>
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
      }
      ctx.restore();
    });

    getActiveFamily()?.renderOverlay?.(ctx, createToolContext());
  }

  function handlePointerDown(x, y, meta) {
    state.dragStart = { x, y };
    state.dragLast = { x, y };
    getActiveFamily()?.onPointerDown?.(x, y, createToolContext(), meta);
  }

  function handlePointerMove(x, y, meta) {
    if (!state.dragStart) return;
    const dx = x - state.dragLast.x;
    const dy = y - state.dragLast.y;
    state.dragLast = { x, y };
    getActiveFamily()?.onPointerMove?.(x, y, createToolContext(), { dx, dy }, meta);
  }

  function handlePointerUp() {
    if (!state.dragStart) return;
    getActiveFamily()?.onPointerUp?.(state.dragLast?.x || 0, state.dragLast?.y || 0, createToolContext());
    state.dragStart = null;
    state.draggedNodeIdx = -1;
    syncWithCore();
  }

  let vectorClipboard = null;

  function cloneVectorItem(source, offset = 0) {
    if (!source) return null;
    const imgRef = source.imgEl || null;
    const copy = JSON.parse(
      JSON.stringify(source, (key, val) => (key === "imgEl" ? undefined : val))
    );
    if (imgRef) copy.imgEl = imgRef;
    copy.id = `item-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;
    if (offset !== 0) {
      if (copy.type === "text" || copy.type === "arcText") {
        copy.x = (copy.x || 0) + offset;
        copy.y = (copy.y || 0) + offset;
      }
      if (Array.isArray(copy.points)) {
        copy.points = copy.points.map((p) => ({ x: p.x + offset, y: p.y + offset }));
      }
    }
    return copy;
  }

  function restoreVectorPaths(serialized) {
    const parsed = JSON.parse(serialized);
    const oldMap = new Map((ws().paths || []).filter((p) => p.imgEl).map((p) => [p.id, p.imgEl]));
    parsed.forEach((p) => {
      if (oldMap.has(p.id)) p.imgEl = oldMap.get(p.id);
    });
    ws().paths = parsed;
    ws().selectedIndex = Math.min(ws().selectedIndex, Math.max(0, parsed.length - 1));
  }

  function handleVectorCommand(cmd) {
    const current = ws().paths[ws().selectedIndex];
    if (cmd === "undo" && state.undoStack.length > 0) {
      state.redoStack.push(JSON.stringify(ws().paths));
      restoreVectorPaths(state.undoStack.pop());
      CORE()?.recordHistory?.("vector", "Desfazer");
    } else if (cmd === "redo" && state.redoStack.length > 0) {
      state.undoStack.push(JSON.stringify(ws().paths));
      restoreVectorPaths(state.redoStack.pop());
      CORE()?.recordHistory?.("vector", "Refazer");
    } else if (cmd === "copy" && current) {
      vectorClipboard = cloneVectorItem(current, 0);
      CORE()?.recordHistory?.("vector", "Copiado");
    } else if (cmd === "paste" && vectorClipboard) {
      snapshot();
      const pasted = cloneVectorItem(vectorClipboard, 24);
      ws().paths.push(pasted);
      ws().selectedIndex = ws().paths.length - 1;
      vectorClipboard = cloneVectorItem(pasted, 0);
      CORE()?.recordHistory?.("vector", "Colado");
    } else if (cmd === "duplicate" && current) {
      snapshot();
      const dup = cloneVectorItem(current, 20);
      ws().paths.push(dup);
      ws().selectedIndex = ws().paths.length - 1;
      CORE()?.recordHistory?.("vector", "Duplicado");
    }
    syncWithCore();
  }

  const moduleApi = {
    onCommand: handleVectorCommand,
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

  window.addEventListener("keydown", (e) => {
    if (CORE()?.state?.activeArea !== "vector") return;
    if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;

    const key = e.key.toLowerCase();
    if (!e.ctrlKey && !e.metaKey && !e.altKey) {
      const byShortcut = getFamilies().find((f) => f.shortcut?.toLowerCase() === key);
      if (byShortcut) {
        e.preventDefault();
        selectFamily(byShortcut.id);
        return;
      }
    }

    getActiveFamily()?.onKeyDown?.(e, createToolContext());
  });

  if (window.RoblesCore?.state?.activeArea === "vector") {
    state.submode = "normal";
    renderAllVectorBars();
  }
})();