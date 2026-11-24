(() => {
  const STUDIO = () => window.RoblesStudio || null;

  const PRIMARY_LAYOUT_TOOLS = [
    {
      id: "frame",
      label: "Prancheta",
      title: "Ferramenta Primária · Prancheta & Artboard",
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 21V9"/></svg>`,
      defaultSecondary: "fr-fit",
      presets: [
        {
          id: "lay-editorial-1440",
          label: "Editorial",
          title: "Prancheta · Editorial 1440×900 em tom areia/grafite",
          boardBg: "rgba(206, 200, 184, 0.14)",
          boardStroke: "#cec8b8",
          blockFill: "rgba(245, 158, 11, 0.22)",
          blockStroke: "#f59e0b",
          cols: 12,
          gap: 16,
          showGuides: true,
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><rect width="26" height="18" rx="3" fill="#1C1917"/><rect x="4" y="3" width="18" height="12" rx="1.5" fill="#CEC8B8" fill-opacity="0.22" stroke="#CEC8B8" stroke-width="1.2"/><line x1="10" y1="3" x2="10" y2="15" stroke="#F59E0B" stroke-width="0.9" stroke-dasharray="1.5 1.5"/></svg>`,
        },
        {
          id: "lay-social-45",
          label: "Vertical",
          title: "Prancheta · Formato Vertical 4:5",
          boardBg: "rgba(132, 152, 126, 0.14)",
          boardStroke: "#84987e",
          blockFill: "rgba(56, 189, 248, 0.22)",
          blockStroke: "#38bdf8",
          cols: 6,
          gap: 12,
          showGuides: true,
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><rect width="26" height="18" rx="3" fill="#18181B"/><rect x="8" y="2.5" width="10" height="13" rx="1.5" fill="#84987E" fill-opacity="0.26" stroke="#84987E" stroke-width="1.2"/><rect x="10" y="5" width="6" height="4" fill="#38BDF8" fill-opacity="0.5"/></svg>`,
        },
        {
          id: "lay-kiosk-wide",
          label: "Panorâmico",
          title: "Prancheta · Vitrine / Panorâmico",
          boardBg: "rgba(245, 158, 11, 0.12)",
          boardStroke: "#fbbf24",
          blockFill: "rgba(251, 191, 36, 0.25)",
          blockStroke: "#fbbf24",
          cols: 8,
          gap: 14,
          showGuides: true,
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><rect width="26" height="18" rx="3" fill="#1E1B18"/><rect x="3" y="4.5" width="20" height="9" rx="1.5" fill="#FBBF24" fill-opacity="0.18" stroke="#FBBF24" stroke-width="1.2"/></svg>`,
        },
      ],
      secondary: [
        { id: "fr-fit", label: "Enquadrar", icon: "⊡" },
        { id: "fr-wider", label: "Ampliar", icon: "⤢" },
        { id: "fr-compact", label: "Compactar", icon: "⤡" },
        { id: "fr-center", label: "Centralizar", icon: "⊕" },
      ],
    },
    {
      id: "blocks",
      label: "Blocos",
      title: "Ferramenta Primária · Blocos & Módulos de Layout",
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="5" rx="1.5"/><rect x="13" y="10" width="8" height="11" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/></svg>`,
      defaultSecondary: "blk-add",
      presets: [
        {
          id: "blk-bento",
          label: "Bento",
          title: "Blocos · Grade Bento Modular",
          boardBg: "rgba(255, 255, 255, 0.04)",
          boardStroke: "rgba(255,255,255,0.25)",
          blockFill: "rgba(245, 158, 11, 0.24)",
          blockStroke: "#f59e0b",
          cols: 12,
          gap: 14,
          showGuides: true,
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><rect width="26" height="18" rx="3" fill="#18181B"/><rect x="4" y="3.5" width="9" height="11" rx="1.5" fill="#F59E0B" fill-opacity="0.45" stroke="#F59E0B" stroke-width="1.1"/><rect x="15" y="3.5" width="7" height="5" rx="1.5" fill="#60A5FA" fill-opacity="0.45" stroke="#60A5FA" stroke-width="1.1"/><rect x="15" y="10" width="7" height="4.5" rx="1.5" fill="#34D399" fill-opacity="0.45" stroke="#34D399" stroke-width="1.1"/></svg>`,
        },
        {
          id: "blk-editorial",
          label: "Colunas",
          title: "Blocos · Colunas Editoriais",
          boardBg: "rgba(206, 200, 184, 0.12)",
          boardStroke: "#cec8b8",
          blockFill: "rgba(132, 152, 126, 0.26)",
          blockStroke: "#84987e",
          cols: 6,
          gap: 16,
          showGuides: true,
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><rect width="26" height="18" rx="3" fill="#1C1917"/><rect x="4" y="3.5" width="5.5" height="11" rx="1" fill="#84987E" fill-opacity="0.4" stroke="#84987E" stroke-width="1.1"/><rect x="11" y="3.5" width="5.5" height="11" rx="1" fill="#84987E" fill-opacity="0.4" stroke="#84987E" stroke-width="1.1"/><rect x="18" y="3.5" width="4" height="11" rx="1" fill="#CEC8B8" fill-opacity="0.3" stroke="#CEC8B8" stroke-width="1.1"/></svg>`,
        },
      ],
      secondary: [
        { id: "blk-add", label: "Novo Bloco", icon: "+" },
        { id: "blk-next", label: "Próximo Bloco", icon: "⇥" },
        { id: "blk-dup", label: "Duplicar", icon: "⧉" },
        { id: "blk-del", label: "Remover", icon: "🗑" },
      ],
    },
    {
      id: "grid",
      label: "Grades",
      title: "Ferramenta Primária · Grades, Colunas & Guias",
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 3h18v18H3z"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg>`,
      defaultSecondary: "grd-cols-add",
      presets: [
        {
          id: "grd-12-col",
          label: "12 Col",
          title: "Grades · Sistema de 12 Colunas",
          boardBg: "rgba(59, 130, 246, 0.08)",
          boardStroke: "#60a5fa",
          blockFill: "rgba(59, 130, 246, 0.16)",
          blockStroke: "#60a5fa",
          cols: 12,
          gap: 12,
          showGuides: true,
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><rect width="26" height="18" rx="3" fill="#0F172A"/><line x1="7" y1="3" x2="7" y2="15" stroke="#60A5FA" stroke-width="1"/><line x1="11" y1="3" x2="11" y2="15" stroke="#60A5FA" stroke-width="1"/><line x1="15" y1="3" x2="15" y2="15" stroke="#60A5FA" stroke-width="1"/><line x1="19" y1="3" x2="19" y2="15" stroke="#60A5FA" stroke-width="1"/></svg>`,
        },
        {
          id: "grd-4-col",
          label: "4 Col",
          title: "Grades · 4 Módulos Amplos",
          boardBg: "rgba(245, 158, 11, 0.08)",
          boardStroke: "#f59e0b",
          blockFill: "rgba(245, 158, 11, 0.16)",
          blockStroke: "#f59e0b",
          cols: 4,
          gap: 18,
          showGuides: true,
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><rect width="26" height="18" rx="3" fill="#1C1917"/><line x1="9.5" y1="3" x2="9.5" y2="15" stroke="#F59E0B" stroke-width="1.2"/><line x1="16.5" y1="3" x2="16.5" y2="15" stroke="#F59E0B" stroke-width="1.2"/></svg>`,
        },
      ],
      secondary: [
        { id: "grd-cols-add", label: "+ Colunas", icon: "⫶+" },
        { id: "grd-cols-sub", label: "- Colunas", icon: "⫶-" },
        { id: "grd-toggle", label: "Guias On/Off", icon: "⊞" },
        { id: "grd-gap", label: "Espaçamento", icon: "↔" },
      ],
    },
    {
      id: "measure",
      label: "Respiro",
      title: "Ferramenta Primária · Margens, Sangria & Cotas",
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 6H3M21 18H3M6 6v12M18 6v12"/><path d="M9 12h6"/></svg>`,
      defaultSecondary: "msr-padding-plus",
      presets: [
        {
          id: "msr-generous",
          label: "Respiro",
          title: "Respiro · Margens Amplas & Cotas",
          boardBg: "rgba(16, 185, 129, 0.08)",
          boardStroke: "#34d399",
          blockFill: "rgba(16, 185, 129, 0.18)",
          blockStroke: "#34d399",
          cols: 8,
          gap: 20,
          showGuides: true,
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><rect width="26" height="18" rx="3" fill="#0D1F1A"/><rect x="6" y="5" width="14" height="8" rx="1" stroke="#34D399" stroke-width="1.2" stroke-dasharray="2 1.5"/><path d="M3 9H6M20 9H23" stroke="#6EE7B7" stroke-width="1.2"/></svg>`,
        },
      ],
      secondary: [
        { id: "msr-padding-plus", label: "Margem +", icon: "⤢" },
        { id: "msr-padding-minus", label: "Margem -", icon: "⤡" },
        { id: "msr-labels", label: "Cotas On/Off", icon: "📏" },
      ],
    },
  ];

  const state = {
    primaryId: PRIMARY_LAYOUT_TOOLS[0].id,
    presetIdByPrimary: {
      frame: "lay-editorial-1440",
      blocks: "blk-bento",
      grid: "grd-12-col",
      measure: "msr-generous",
    },
    secondaryIdByPrimary: {
      frame: "fr-fit",
      blocks: "blk-add",
      grid: "grd-cols-add",
      measure: "msr-padding-plus",
    },
    board: { x: 150, y: 100, w: 500, h: 340, padding: 20 },
    blocks: [
      { id: "b1", label: "HERO / CAPA", rx: 0.04, ry: 0.06, rw: 0.54, rh: 0.54 },
      { id: "b2", label: "MÓDULO A", rx: 0.62, ry: 0.06, rw: 0.32, rh: 0.25 },
      { id: "b3", label: "MÓDULO B", rx: 0.62, ry: 0.35, rw: 0.32, rh: 0.25 },
      { id: "b4", label: "RODAPÉ / FAIXA", rx: 0.04, ry: 0.65, rw: 0.9, rh: 0.26 },
    ],
    selectedBlockIndex: 0,
    showMeasureLabels: true,
    dragMode: null,
    dragOffset: { x: 0, y: 0 },
    undoStack: [],
    redoStack: [],
  };

  function getPrimaryTool() {
    return PRIMARY_LAYOUT_TOOLS.find((t) => t.id === state.primaryId) || PRIMARY_LAYOUT_TOOLS[0];
  }

  function getActivePreset() {
    const primary = getPrimaryTool();
    const chosenId = state.presetIdByPrimary[primary.id] || primary.presets[0].id;
    return primary.presets.find((p) => p.id === chosenId) || primary.presets[0];
  }

  function getActiveSecondaryId() {
    const primary = getPrimaryTool();
    return state.secondaryIdByPrimary[primary.id] || primary.defaultSecondary;
  }

  function snapshot() {
    state.undoStack.push(
      JSON.stringify({
        board: state.board,
        blocks: state.blocks,
        selectedBlockIndex: state.selectedBlockIndex,
      })
    );
    if (state.undoStack.length > 40) state.undoStack.shift();
    state.redoStack = [];
  }

  function restoreSnapshot(raw) {
    const parsed = JSON.parse(raw);
    state.board = parsed.board;
    state.blocks = parsed.blocks || [];
    state.selectedBlockIndex = parsed.selectedBlockIndex ?? 0;
  }

  function setPrimaryTool(primaryId) {
    const tool = PRIMARY_LAYOUT_TOOLS.find((t) => t.id === primaryId);
    if (!tool) return;
    state.primaryId = tool.id;
    state.dragMode = null;

    STUDIO()?.recordHistory?.("layout", `Layout · ${tool.label}`);
    renderAllLayoutBars();
    STUDIO()?.render?.();
  }

  function applyPreset(presetId) {
    const primary = getPrimaryTool();
    const preset = primary.presets.find((p) => p.id === presetId);
    if (!preset) return;

    state.presetIdByPrimary[primary.id] = preset.id;
    if (presetId === "lay-social-45") {
      state.board.w = 340;
      state.board.h = 425;
    } else if (presetId === "lay-kiosk-wide") {
      state.board.w = 560;
      state.board.h = 280;
    } else if (presetId === "lay-editorial-1440") {
      state.board.w = 500;
      state.board.h = 340;
    }

    STUDIO()?.recordHistory?.("layout", `Predefinição (${primary.label}): ${preset.label}`);
    renderTopCenterPresets();
    STUDIO()?.render?.();
  }

  function runSecondaryAction(secId) {
    const primary = getPrimaryTool();
    const sec = primary.secondary.find((s) => s.id === secId);
    if (!sec) return;

    state.secondaryIdByPrimary[primary.id] = sec.id;
    const preset = getActivePreset();
    const studio = STUDIO();
    const { width = 800, height = 600 } = studio?.getCanvasSize?.() || {};
    const curBlock = state.blocks[state.selectedBlockIndex];

    snapshot();

    if (secId === "fr-fit") {
      state.board.x = Math.round((width - state.board.w) / 2);
      state.board.y = Math.round((height - state.board.h) / 2);
    } else if (secId === "fr-wider") {
      state.board.w = Math.min(920, state.board.w + 40);
      state.board.h = Math.min(640, state.board.h + 24);
    } else if (secId === "fr-compact") {
      state.board.w = Math.max(240, state.board.w - 40);
      state.board.h = Math.max(200, state.board.h - 24);
    } else if (secId === "fr-center") {
      state.board.x = Math.round((width - state.board.w) / 2);
      state.board.y = Math.round((height - state.board.h) / 2);
    } else if (secId === "blk-add") {
      const idx = state.blocks.length + 1;
      state.blocks.push({
        id: `blk-${Date.now().toString(36)}`,
        label: `BLOCO ${idx}`,
        rx: 0.08 + ((idx * 0.14) % 0.5),
        ry: 0.12 + ((idx * 0.18) % 0.5),
        rw: 0.26,
        rh: 0.22,
      });
      state.selectedBlockIndex = state.blocks.length - 1;
    } else if (secId === "blk-next" && state.blocks.length > 0) {
      state.selectedBlockIndex = (state.selectedBlockIndex + 1) % state.blocks.length;
    } else if (secId === "blk-dup" && curBlock) {
      state.blocks.push({
        ...curBlock,
        id: `blk-${Date.now().toString(36)}`,
        label: `${curBlock.label} CÓPIA`,
        rx: Math.min(0.7, curBlock.rx + 0.04),
        ry: Math.min(0.7, curBlock.ry + 0.04),
      });
      state.selectedBlockIndex = state.blocks.length - 1;
    } else if (secId === "blk-del" && curBlock && state.blocks.length > 1) {
      state.blocks.splice(state.selectedBlockIndex, 1);
      state.selectedBlockIndex = Math.max(0, state.selectedBlockIndex - 1);
    } else if (secId === "grd-cols-add") {
      preset.cols = Math.min(24, (preset.cols || 12) + 2);
      preset.showGuides = true;
    } else if (secId === "grd-cols-sub") {
      preset.cols = Math.max(2, (preset.cols || 12) - 2);
      preset.showGuides = true;
    } else if (secId === "grd-toggle") {
      preset.showGuides = !preset.showGuides;
    } else if (secId === "grd-gap") {
      preset.gap = preset.gap >= 28 ? 10 : (preset.gap || 14) + 6;
    } else if (secId === "msr-padding-plus") {
      state.board.padding = Math.min(56, state.board.padding + 6);
    } else if (secId === "msr-padding-minus") {
      state.board.padding = Math.max(4, state.board.padding - 6);
    } else if (secId === "msr-labels") {
      state.showMeasureLabels = !state.showMeasureLabels;
    }

    studio?.recordHistory?.("layout", `${primary.label} · ${sec.label}`);
    renderSecondaryRightBar();
    studio?.render?.();
  }

  function renderLeftPrimaryBar() {
    const leftBar = document.querySelector(".hud-left");
    if (!leftBar) return;

    leftBar.innerHTML = PRIMARY_LAYOUT_TOOLS.map(
      (tool) => `
        <button
          type="button"
          class="tool-btn ${state.primaryId === tool.id ? "is-active" : ""}"
          data-lay-primary="${tool.id}"
          title="${tool.title}"
        >${tool.icon}</button>
      `
    ).join("");

    leftBar.querySelectorAll("[data-lay-primary]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        setPrimaryTool(btn.dataset.layPrimary);
      });
    });
  }

  function renderTopCenterPresets() {
    const centerBar = document.querySelector(".hud-top-center");
    if (!centerBar) return;

    const primary = getPrimaryTool();
    const activePreset = getActivePreset();

    centerBar.innerHTML = primary.presets
      .map((p) => {
        const isAct = p.id === activePreset.id;
        return `
          <button
            type="button"
            class="tool-btn ${isAct ? "is-active" : ""}"
            data-lay-preset="${p.id}"
            title="${p.title}"
            style="
              width: auto;
              height: 36px;
              padding: 3px 8px;
              gap: 6px;
              display: inline-flex;
              align-items: center;
              white-space: nowrap;
            "
          >
            <span style="display:inline-flex;align-items:center;border-radius:4px;overflow:hidden;border:1px solid rgba(255,255,255,0.16);flex-shrink:0;">
              ${p.previewSvg}
            </span>
            <span style="font-size:10.5px;font-weight:600;">${p.label}</span>
          </button>
        `;
      })
      .join("");

    centerBar.querySelectorAll("[data-lay-preset]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        applyPreset(btn.dataset.layPreset);
      });
    });
  }

  function renderSecondaryRightBar() {
    const rightBar = document.querySelector(".hud-right");
    if (!rightBar) return;

    const primary = getPrimaryTool();
    const activeSecId = getActiveSecondaryId();

    rightBar.innerHTML = primary.secondary
      .map(
        (sec) => `
          <button
            type="button"
            class="tool-btn ${activeSecId === sec.id ? "is-active" : ""}"
            data-lay-sec="${sec.id}"
            title="${sec.label} (${primary.label})"
          >${sec.icon}</button>
        `
      )
      .join("");

    rightBar.querySelectorAll("[data-lay-sec]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        runSecondaryAction(btn.dataset.laySec);
      });
    });
  }

  function renderAllLayoutBars() {
    renderLeftPrimaryBar();
    renderTopCenterPresets();
    renderSecondaryRightBar();
  }

  function render(ctx) {
    const preset = getActivePreset();
    const { x, y, w, h, padding } = state.board;

    ctx.save();
    ctx.fillStyle = preset.boardBg;
    ctx.strokeStyle = preset.boardStroke;
    ctx.lineWidth = 1.6;
    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);

    if (padding > 0) {
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 3]);
      ctx.strokeRect(x + padding, y + padding, Math.max(10, w - padding * 2), Math.max(10, h - padding * 2));
      ctx.setLineDash([]);
    }

    if (preset.showGuides && preset.cols > 1) {
      const innerW = Math.max(10, w - padding * 2);
      const colW = innerW / preset.cols;
      ctx.strokeStyle = "rgba(96, 165, 250, 0.16)";
      ctx.lineWidth = 1;
      for (let c = 1; c < preset.cols; c++) {
        const gx = x + padding + c * colW;
        ctx.beginPath();
        ctx.moveTo(gx, y);
        ctx.lineTo(gx, y + h);
        ctx.stroke();
      }
    }

    state.blocks.forEach((blk, idx) => {
      const bx = x + blk.rx * w;
      const by = y + blk.ry * h;
      const bw = blk.rw * w;
      const bh = blk.rh * h;
      const isSel = idx === state.selectedBlockIndex;

      ctx.fillStyle = preset.blockFill;
      ctx.strokeStyle = isSel ? "#f59e0b" : preset.blockStroke;
      ctx.lineWidth = isSel ? 2.2 : 1.3;
      ctx.fillRect(bx, by, bw, bh);
      ctx.strokeRect(bx, by, bw, bh);

      ctx.fillStyle = "#ffffff";
      ctx.font = "600 10px system-ui, -apple-system, sans-serif";
      ctx.fillText(blk.label, bx + 8, by + 16);

      if (state.showMeasureLabels) {
        ctx.fillStyle = "rgba(216,216,220,0.75)";
        ctx.font = "10px monospace";
        ctx.fillText(`${Math.round(bw)}×${Math.round(bh)}`, bx + 8, by + bh - 8);
      }
    });

    if (state.showMeasureLabels) {
      ctx.fillStyle = "rgba(216,216,220,0.85)";
      ctx.font = "11px monospace";
      ctx.fillText(`${Math.round(w)} × ${Math.round(h)} px · ${preset.cols} col`, x, y - 8);
    }

    ctx.restore();
  }

  function onMouseDown(x, y) {
    const { x: bx0, y: by0, w, h } = state.board;

    for (let i = state.blocks.length - 1; i >= 0; i--) {
      const blk = state.blocks[i];
      const rx = bx0 + blk.rx * w;
      const ry = by0 + blk.ry * h;
      const rw = blk.rw * w;
      const rh = blk.rh * h;
      if (x >= rx && x <= rx + rw && y >= ry && y <= ry + rh) {
        snapshot();
        state.selectedBlockIndex = i;
        state.dragMode = "block";
        state.dragOffset = { x: x - rx, y: y - ry };
        STUDIO()?.render?.();
        return;
      }
    }

    if (x >= bx0 && x <= bx0 + w && y >= by0 && y <= by0 + h) {
      snapshot();
      state.dragMode = "board";
      state.dragOffset = { x: x - bx0, y: y - by0 };
    }
  }

  function onMouseMove(x, y) {
    if (!state.dragMode) return;
    const { x: bx0, y: by0, w, h } = state.board;

    if (state.dragMode === "board") {
      state.board.x = x - state.dragOffset.x;
      state.board.y = y - state.dragOffset.y;
      STUDIO()?.render?.();
    } else if (state.dragMode === "block") {
      const blk = state.blocks[state.selectedBlockIndex];
      if (!blk) return;
      const newLeft = x - state.dragOffset.x;
      const newTop = y - state.dragOffset.y;
      blk.rx = Math.max(0, Math.min(1 - blk.rw, (newLeft - bx0) / w));
      blk.ry = Math.max(0, Math.min(1 - blk.rh, (newTop - by0) / h));
      STUDIO()?.render?.();
    }
  }

  function onMouseUp() {
    if (state.dragMode) {
      state.dragMode = null;
      STUDIO()?.recordHistory?.("layout", `Layout atualizado (${getActivePreset().label})`);
    }
  }

  function undo() {
    if (state.undoStack.length === 0) return;
    state.redoStack.push(
      JSON.stringify({
        board: state.board,
        blocks: state.blocks,
        selectedBlockIndex: state.selectedBlockIndex,
      })
    );
    restoreSnapshot(state.undoStack.pop());
    STUDIO()?.render?.();
  }

  function redo() {
    if (state.redoStack.length === 0) return;
    state.undoStack.push(
      JSON.stringify({
        board: state.board,
        blocks: state.blocks,
        selectedBlockIndex: state.selectedBlockIndex,
      })
    );
    restoreSnapshot(state.redoStack.pop());
    STUDIO()?.render?.();
  }

  window.RoblesStudio?.registerModule("layout", {
    onActivate() {
      renderAllLayoutBars();
    },
    onDeactivate() {
      state.dragMode = null;
    },
    renderBars() {
      renderAllLayoutBars();
    },
    render,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    undo,
    redo,
  });
})();