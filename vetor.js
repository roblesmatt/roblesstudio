(() => {
  const STUDIO = () => window.RoblesStudio || null;

  const PRIMARY_VECTOR_TOOLS = [
    {
      id: "pen",
      label: "Caneta",
      title: "Ferramenta Primária · Caneta & Traçados",
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><circle cx="11" cy="11" r="2"/></svg>`,
      defaultSecondary: "pen-smooth",
      presets: [
        {
          id: "pen-botanical",
          label: "Botânica",
          title: "Caneta · Traço Botânico Orgânico + Papel",
          fill: "rgba(132, 152, 126, 0.22)",
          stroke: "#3d2d2d",
          lineWidth: 2,
          dash: [],
          cornerRadius: 4,
          texture: "paper-grain",
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><rect width="26" height="18" rx="3" fill="#CEC8B8"/><path d="M5 13C9 6 15 12 21 5" stroke="#3d2d2d" stroke-width="1.8" stroke-linecap="round"/><circle cx="19" cy="6" r="2.5" fill="#84987E"/></svg>`,
        },
        {
          id: "pen-riso",
          label: "Riso",
          title: "Caneta · Risografia + Pontilhado Halftone",
          fill: "rgba(239, 68, 68, 0.22)",
          stroke: "#1d4ed8",
          lineWidth: 2.3,
          dash: [],
          cornerRadius: 6,
          texture: "halftone",
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><rect width="26" height="18" rx="3" fill="#F4EFE6"/><path d="M5 12C10 4 16 14 21 6" stroke="#1D4ED8" stroke-width="2.2" stroke-linecap="round"/><circle cx="18" cy="12" r="1.2" fill="#EF4444"/><circle cx="21" cy="12" r="1.2" fill="#EF4444"/></svg>`,
        },
        {
          id: "pen-blueprint",
          label: "Técnico",
          title: "Caneta · Linha Técnica Tracejada",
          fill: "rgba(56, 189, 248, 0.14)",
          stroke: "#38bdf8",
          lineWidth: 1.5,
          dash: [5, 3],
          cornerRadius: 0,
          texture: "blueprint-grid",
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><rect width="26" height="18" rx="3" fill="#0F172A"/><path d="M4 13L12 5L16 10L22 4" stroke="#38BDF8" stroke-width="1.5" stroke-dasharray="3 2"/></svg>`,
        },
      ],
      secondary: [
        { id: "pen-smooth", label: "Suavizar Traço", icon: "〰" },
        { id: "pen-close", label: "Fechar Caminho", icon: "⬟" },
        { id: "pen-reverse", label: "Inverter Sentido", icon: "⇄" },
        { id: "pen-clear-draft", label: "Limpar Rascunho", icon: "✕" },
      ],
    },
    {
      id: "shapes",
      label: "Formas",
      title: "Ferramenta Primária · Formas Geométricas",
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="10" height="10" rx="1.5"/><circle cx="16" cy="15" r="5"/></svg>`,
      defaultSecondary: "shape-rect",
      presets: [
        {
          id: "shape-brutal",
          label: "Brutal",
          title: "Formas · Neo-Brutalismo + Hachura",
          fill: "rgba(250, 204, 21, 0.34)",
          stroke: "#111111",
          lineWidth: 2.6,
          dash: [],
          cornerRadius: 0,
          texture: "offset-hatch",
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><rect width="26" height="18" rx="3" fill="#E6E2D8"/><rect x="8" y="5" width="11" height="9" fill="#111111"/><rect x="6" y="3" width="11" height="9" fill="#FACC15" stroke="#111111" stroke-width="1.5"/></svg>`,
        },
        {
          id: "shape-apothecary",
          label: "Sálvia",
          title: "Formas · Apothecary Sálvia + Grão",
          fill: "rgba(132, 152, 126, 0.28)",
          stroke: "#3d2d2d",
          lineWidth: 2,
          dash: [],
          cornerRadius: 8,
          texture: "paper-grain",
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><rect width="26" height="18" rx="3" fill="#CEC8B8"/><rect x="6" y="4" width="9" height="9" rx="3" fill="#84987E" stroke="#3d2d2d" stroke-width="1.3"/><circle cx="17" cy="11" r="4" fill="#C47D5A" stroke="#3d2d2d" stroke-width="1.2"/></svg>`,
        },
        {
          id: "shape-engraving",
          label: "Gravura",
          title: "Formas · Gravura + Entalhe",
          fill: "rgba(24, 24, 27, 0.2)",
          stroke: "#18181b",
          lineWidth: 2.2,
          dash: [],
          cornerRadius: 2,
          texture: "cross-hatch",
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><rect width="26" height="18" rx="3" fill="#EAE6DC"/><polygon points="13,3 21,14 5,14" fill="#27272A" fill-opacity="0.2" stroke="#18181B" stroke-width="1.4"/><path d="M9 14L15 8" stroke="#18181B" stroke-width="1.1"/></svg>`,
        },
      ],
      secondary: [
        { id: "shape-rect", label: "Modo Retângulo", icon: "▭" },
        { id: "shape-ellipse", label: "Modo Elipse", icon: "◯" },
        { id: "shape-round", label: "Arredondar Cantos", icon: "◜" },
        { id: "shape-duplicate", label: "Duplicar Forma", icon: "⧉" },
      ],
    },
    {
      id: "node",
      label: "Seleção",
      title: "Ferramenta Primária · Selecionar, Mover & Editar",
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4l7.07 17 2.51-7.39L21 11.07z"/></svg>`,
      defaultSecondary: "sel-next",
      presets: [
        {
          id: "sel-highlight",
          label: "Âmbar",
          title: "Seleção · Destaque Âmbar Limpo",
          fill: "rgba(245, 158, 11, 0.24)",
          stroke: "#f59e0b",
          lineWidth: 2.2,
          dash: [],
          cornerRadius: 4,
          texture: "paper-grain",
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><rect width="26" height="18" rx="3" fill="#18181B"/><rect x="6" y="4" width="14" height="10" stroke="#F59E0B" stroke-width="1.5"/><circle cx="6" cy="4" r="1.8" fill="#FFF"/><circle cx="20" cy="14" r="1.8" fill="#FFF"/></svg>`,
        },
        {
          id: "sel-mesh",
          label: "Aquarela",
          title: "Seleção · Aguada & Malha Suave",
          fill: "rgba(168, 85, 247, 0.22)",
          stroke: "#a855f7",
          lineWidth: 1.8,
          dash: [],
          cornerRadius: 10,
          texture: "wash-dots",
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><rect width="26" height="18" rx="3" fill="#1E1B2E"/><ellipse cx="13" cy="9" rx="7" ry="4.5" fill="#A855F7" fill-opacity="0.35" stroke="#C084FC" stroke-width="1.4"/></svg>`,
        },
      ],
      secondary: [
        { id: "sel-next", label: "Próximo Vetor", icon: "⇥" },
        { id: "sel-nudge-up", label: "Mover Cima", icon: "↑" },
        { id: "sel-nudge-right", label: "Mover Direita", icon: "→" },
        { id: "sel-delete", label: "Excluir Vetor", icon: "🗑" },
      ],
    },
    {
      id: "warp",
      label: "Textura",
      title: "Ferramenta Primária · Texturas & Acabamento Vetorial",
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="6" height="6"/><rect x="15" y="3" width="6" height="6"/><rect x="9" y="9" width="6" height="6"/><rect x="3" y="15" width="6" height="6"/><rect x="15" y="15" width="6" height="6"/></svg>`,
      defaultSecondary: "tex-grain",
      presets: [
        {
          id: "tex-halftone",
          label: "Halftone",
          title: "Textura · Pontilhado Halftone",
          fill: "rgba(59, 130, 246, 0.22)",
          stroke: "#60a5fa",
          lineWidth: 2,
          dash: [],
          cornerRadius: 4,
          texture: "halftone",
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><rect width="26" height="18" rx="3" fill="#172554"/><circle cx="8" cy="6" r="1.3" fill="#93C5FD"/><circle cx="13" cy="6" r="1.3" fill="#93C5FD"/><circle cx="18" cy="6" r="1.3" fill="#93C5FD"/><circle cx="10.5" cy="11" r="1.3" fill="#93C5FD"/><circle cx="15.5" cy="11" r="1.3" fill="#93C5FD"/></svg>`,
        },
        {
          id: "tex-hatch",
          label: "Hachura",
          title: "Textura · Hachura Cruzada",
          fill: "rgba(245, 158, 11, 0.2)",
          stroke: "#fbbf24",
          lineWidth: 2,
          dash: [],
          cornerRadius: 4,
          texture: "cross-hatch",
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><rect width="26" height="18" rx="3" fill="#27272A"/><path d="M5 14L14 5M11 14L20 5M7 5L16 14M13 5L21 13" stroke="#FBBF24" stroke-width="1.2"/></svg>`,
        },
        {
          id: "tex-paper",
          label: "Papel",
          title: "Textura · Fibra & Grão de Papel",
          fill: "rgba(163, 177, 138, 0.28)",
          stroke: "#d6d3d1",
          lineWidth: 2,
          dash: [],
          cornerRadius: 6,
          texture: "paper-grain",
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><rect width="26" height="18" rx="3" fill="#CEC8B8"/><circle cx="7" cy="6" r="1" fill="#3d2d2d"/><circle cx="15" cy="5" r="1.2" fill="#3d2d2d"/><circle cx="20" cy="11" r="1" fill="#3d2d2d"/><circle cx="11" cy="13" r="1.2" fill="#3d2d2d"/></svg>`,
        },
      ],
      secondary: [
        { id: "tex-grain", label: "Grão Papel", icon: "░" },
        { id: "tex-halftone", label: "Halftone", icon: "⋮" },
        { id: "tex-hatch", label: "Hachura", icon: "⟋" },
        { id: "tex-none", label: "Sem Textura", icon: "○" },
      ],
    },
  ];

  const state = {
    primaryId: PRIMARY_VECTOR_TOOLS[0].id,
    presetIdByPrimary: {
      pen: "pen-botanical",
      shapes: "shape-brutal",
      node: "sel-highlight",
      warp: "tex-halftone",
    },
    secondaryIdByPrimary: {
      pen: "pen-smooth",
      shapes: "shape-rect",
      node: "sel-next",
      warp: "tex-grain",
    },
    shapeSubmode: "rect",
    paths: [
      {
        id: "demo-shape-1",
        tool: "rect",
        points: [
          { x: 260, y: 180 },
          { x: 460, y: 180 },
          { x: 460, y: 310 },
          { x: 260, y: 310 },
        ],
        closed: true,
      },
    ],
    draftPoints: [],
    dragStart: null,
    selectedIndex: 0,
    undoStack: [],
    redoStack: [],
  };

  function getPrimaryTool() {
    return PRIMARY_VECTOR_TOOLS.find((t) => t.id === state.primaryId) || PRIMARY_VECTOR_TOOLS[0];
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
    state.undoStack.push(JSON.stringify(state.paths));
    if (state.undoStack.length > 40) state.undoStack.shift();
    state.redoStack = [];
  }

  function syncExtrusion() {
    const studio = STUDIO();
    if (studio && typeof studio.setExtrudedVectors === "function") {
      studio.setExtrudedVectors(state.paths);
    }
  }

  function setPrimaryTool(primaryId) {
    const tool = PRIMARY_VECTOR_TOOLS.find((t) => t.id === primaryId);
    if (!tool) return;
    state.primaryId = tool.id;
    state.draftPoints = [];
    state.dragStart = null;

    if (!state.presetIdByPrimary[tool.id] && tool.presets[0]) {
      state.presetIdByPrimary[tool.id] = tool.presets[0].id;
    }
    if (!state.secondaryIdByPrimary[tool.id] && tool.secondary[0]) {
      state.secondaryIdByPrimary[tool.id] = tool.secondary[0].id;
    }

    const studio = STUDIO();
    studio?.recordHistory?.("vector", `Ferramenta Vetor: ${tool.label}`);
    renderAllVectorBars();
    studio?.render?.();
  }

  function applyPreset(presetId) {
    const primary = getPrimaryTool();
    const preset = primary.presets.find((p) => p.id === presetId);
    if (!preset) return;

    state.presetIdByPrimary[primary.id] = preset.id;
    const studio = STUDIO();
    studio?.recordHistory?.("vector", `Predefinição (${primary.label}): ${preset.label}`);
    renderTopCenterPresets();
    studio?.render?.();
  }

  function runSecondaryAction(secId) {
    const primary = getPrimaryTool();
    const sec = primary.secondary.find((s) => s.id === secId);
    if (!sec) return;

    state.secondaryIdByPrimary[primary.id] = sec.id;
    const current = state.paths[state.selectedIndex];
    const studio = STUDIO();

    if (secId === "pen-close" && state.draftPoints.length >= 2) {
      snapshot();
      state.paths.push({
        id: `pen-${Date.now().toString(36)}`,
        tool: "pen",
        closed: true,
        points: [...state.draftPoints],
      });
      state.draftPoints = [];
      state.selectedIndex = state.paths.length - 1;
    } else if (secId === "pen-clear-draft") {
      state.draftPoints = [];
    } else if (secId === "pen-reverse" && current?.points?.length) {
      snapshot();
      current.points = [...current.points].reverse();
    } else if (secId === "pen-smooth" && current?.points?.length >= 3) {
      snapshot();
      current.points = current.points.map((pt, i, arr) => {
        const prev = arr[(i - 1 + arr.length) % arr.length];
        const next = arr[(i + 1) % arr.length];
        return {
          x: +(prev.x * 0.25 + pt.x * 0.5 + next.x * 0.25).toFixed(1),
          y: +(prev.y * 0.25 + pt.y * 0.5 + next.y * 0.25).toFixed(1),
        };
      });
    } else if (secId === "shape-rect") {
      state.shapeSubmode = "rect";
    } else if (secId === "shape-ellipse") {
      state.shapeSubmode = "ellipse";
    } else if (secId === "shape-round" && current?.points?.length) {
      snapshot();
      const cx = current.points.reduce((acc, p) => acc + p.x, 0) / current.points.length;
      const cy = current.points.reduce((acc, p) => acc + p.y, 0) / current.points.length;
      current.points = current.points.map((p) => ({
        x: +(cx + (p.x - cx) * 0.92).toFixed(1),
        y: +(cy + (p.y - cy) * 0.92).toFixed(1),
      }));
    } else if (secId === "shape-duplicate" && current) {
      snapshot();
      const clone = {
        ...current,
        id: `dup-${Date.now().toString(36)}`,
        points: current.points.map((p) => ({ x: p.x + 24, y: p.y + 24 })),
      };
      state.paths.push(clone);
      state.selectedIndex = state.paths.length - 1;
    } else if (secId === "sel-next" && state.paths.length > 0) {
      state.selectedIndex = (state.selectedIndex + 1) % state.paths.length;
    } else if (secId === "sel-nudge-up" && current) {
      snapshot();
      current.points = current.points.map((p) => ({ x: p.x, y: p.y - 12 }));
    } else if (secId === "sel-nudge-right" && current) {
      snapshot();
      current.points = current.points.map((p) => ({ x: p.x + 12, y: p.y }));
    } else if (secId === "sel-delete" && current && state.paths.length > 1) {
      snapshot();
      state.paths.splice(state.selectedIndex, 1);
      state.selectedIndex = Math.max(0, state.selectedIndex - 1);
    } else if (secId === "tex-grain") {
      getActivePreset().texture = "paper-grain";
    } else if (secId === "tex-halftone") {
      getActivePreset().texture = "halftone";
    } else if (secId === "tex-hatch") {
      getActivePreset().texture = "cross-hatch";
    } else if (secId === "tex-none") {
      getActivePreset().texture = "none";
    }

    syncExtrusion();
    studio?.recordHistory?.("vector", `${primary.label} · ${sec.label}`);
    renderSecondaryRightBar();
    studio?.render?.();
  }

  function renderLeftPrimaryBar() {
    const leftBar = document.querySelector(".hud-left");
    if (!leftBar) return;

    leftBar.innerHTML = PRIMARY_VECTOR_TOOLS.map(
      (tool) => `
        <button
          type="button"
          class="tool-btn ${state.primaryId === tool.id ? "is-active" : ""}"
          data-vec-primary="${tool.id}"
          title="${tool.title}"
        >${tool.icon}</button>
      `
    ).join("");

    leftBar.querySelectorAll("[data-vec-primary]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        setPrimaryTool(btn.dataset.vecPrimary);
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
            data-vec-preset="${p.id}"
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

    centerBar.querySelectorAll("[data-vec-preset]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        applyPreset(btn.dataset.vecPreset);
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
            data-vec-sec="${sec.id}"
            title="${sec.label} (${primary.label})"
          >${sec.icon}</button>
        `
      )
      .join("");

    rightBar.querySelectorAll("[data-vec-sec]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        runSecondaryAction(btn.dataset.vecSec);
      });
    });
  }

  function renderAllVectorBars() {
    renderLeftPrimaryBar();
    renderTopCenterPresets();
    renderSecondaryRightBar();
  }

  function drawShapePath(ctx, path) {
    if (!path.points || path.points.length === 0) return;
    ctx.beginPath();
    path.points.forEach((pt, idx) => {
      if (idx === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    if (path.closed) ctx.closePath();
  }

  function drawPresetTextureOverPath(ctx, path, preset) {
    if (!path.points || path.points.length < 2 || preset.texture === "none") return;

    const xs = path.points.map((p) => p.x);
    const ys = path.points.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    ctx.save();
    drawShapePath(ctx, path);
    ctx.clip();

    if (preset.texture === "halftone") {
      ctx.fillStyle = preset.stroke;
      ctx.globalAlpha = 0.24;
      for (let y = minY; y <= maxY; y += 8) {
        for (let x = minX; x <= maxX; x += 8) {
          ctx.beginPath();
          ctx.arc(x + ((y / 8) % 2) * 4, y, 1.35, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (preset.texture === "cross-hatch" || preset.texture === "offset-hatch") {
      ctx.strokeStyle = preset.stroke;
      ctx.globalAlpha = 0.26;
      ctx.lineWidth = 1.1;
      for (let d = -Math.max(maxX - minX, maxY - minY); d <= maxX - minX + (maxY - minY); d += 7) {
        ctx.beginPath();
        ctx.moveTo(minX + d, minY);
        ctx.lineTo(minX + d + (maxY - minY), maxY);
        ctx.stroke();
      }
    } else if (preset.texture === "paper-grain" || preset.texture === "wash-dots") {
      ctx.fillStyle = preset.stroke;
      ctx.globalAlpha = 0.15;
      for (let i = 0; i < 48; i++) {
        const gx = minX + ((i * 37) % Math.max(1, maxX - minX));
        const gy = minY + ((i * 53) % Math.max(1, maxY - minY));
        ctx.fillRect(gx, gy, 1.5, 1.5);
      }
    } else if (preset.texture === "blueprint-grid") {
      ctx.strokeStyle = preset.stroke;
      ctx.globalAlpha = 0.22;
      ctx.lineWidth = 0.8;
      for (let x = minX; x <= maxX; x += 14) {
        ctx.beginPath();
        ctx.moveTo(x, minY);
        ctx.lineTo(x, maxY);
        ctx.stroke();
      }
      for (let y = minY; y <= maxY; y += 14) {
        ctx.beginPath();
        ctx.moveTo(minX, y);
        ctx.lineTo(maxX, y);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  function render(ctx, width, height) {
    const preset = getActivePreset();

    if (preset.texture === "blueprint-grid") {
      ctx.save();
      ctx.strokeStyle = "rgba(56, 189, 248, 0.08)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();
    }

    state.paths.forEach((path, idx) => {
      ctx.save();
      drawShapePath(ctx, path);
      if (path.closed) {
        ctx.fillStyle = preset.fill;
        ctx.fill();
      }
      ctx.strokeStyle = idx === state.selectedIndex ? "#f59e0b" : preset.stroke;
      ctx.lineWidth = idx === state.selectedIndex ? preset.lineWidth + 0.8 : preset.lineWidth;
      ctx.setLineDash(preset.dash || []);
      ctx.stroke();
      ctx.restore();

      if (path.closed) {
        drawPresetTextureOverPath(ctx, path, preset);
      }
    });

    if (state.draftPoints.length > 0) {
      ctx.save();
      ctx.strokeStyle = preset.stroke;
      ctx.lineWidth = preset.lineWidth;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      state.draftPoints.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();
      ctx.restore();
    }
  }

  function onMouseDown(x, y) {
    if (state.primaryId === "pen") {
      state.draftPoints.push({ x, y });
      STUDIO()?.render?.();
      return;
    }

    snapshot();
    state.dragStart = { x, y };

    if (state.primaryId === "node" || state.primaryId === "warp") {
      state.selectedIndex = state.paths.length > 0 ? (state.selectedIndex + 1) % state.paths.length : -1;
      STUDIO()?.render?.();
      return;
    }

    const newPath = {
      id: `vec-${Date.now().toString(36)}`,
      tool: state.shapeSubmode,
      closed: true,
      points: [
        { x, y },
        { x, y },
        { x, y },
        { x, y },
      ],
    };
    state.paths.push(newPath);
    state.selectedIndex = state.paths.length - 1;
    STUDIO()?.render?.();
  }

  function onMouseMove(x, y) {
    if (!state.dragStart || state.primaryId !== "shapes") return;
    const current = state.paths[state.selectedIndex];
    if (!current) return;

    const x0 = state.dragStart.x;
    const y0 = state.dragStart.y;

    if (state.shapeSubmode === "rect") {
      current.points = [
        { x: x0, y: y0 },
        { x, y: y0 },
        { x, y },
        { x: x0, y },
      ];
    } else if (state.shapeSubmode === "ellipse") {
      const cx = (x0 + x) / 2;
      const cy = (y0 + y) / 2;
      const rx = Math.abs(x - x0) / 2 || 4;
      const ry = Math.abs(y - y0) / 2 || 4;
      const pts = [];
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * Math.PI * 2;
        pts.push({ x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry });
      }
      current.points = pts;
    }

    STUDIO()?.render?.();
  }

  function onMouseUp() {
    if (state.dragStart) {
      state.dragStart = null;
      syncExtrusion();
      STUDIO()?.recordHistory?.("vector", `Vetor criado (${getActivePreset().label})`);
    }
  }

  function onDblClick() {
    if (state.primaryId === "pen" && state.draftPoints.length >= 2) {
      snapshot();
      state.paths.push({
        id: `pen-${Date.now().toString(36)}`,
        tool: "pen",
        closed: state.draftPoints.length >= 3,
        points: [...state.draftPoints],
      });
      state.draftPoints = [];
      state.selectedIndex = state.paths.length - 1;
      syncExtrusion();
      STUDIO()?.recordHistory?.("vector", `Traço concluído (${getActivePreset().label})`);
      STUDIO()?.render?.();
    }
  }

  function undo() {
    if (state.undoStack.length === 0) return;
    state.redoStack.push(JSON.stringify(state.paths));
    state.paths = JSON.parse(state.undoStack.pop());
    syncExtrusion();
    STUDIO()?.render?.();
  }

  function redo() {
    if (state.redoStack.length === 0) return;
    state.undoStack.push(JSON.stringify(state.paths));
    state.paths = JSON.parse(state.redoStack.pop());
    syncExtrusion();
    STUDIO()?.render?.();
  }

  window.RoblesStudio?.registerModule("vector", {
    onActivate() {
      renderAllVectorBars();
      syncExtrusion();
    },
    onDeactivate() {
      state.draftPoints = [];
      state.dragStart = null;
    },
    renderBars() {
      renderAllVectorBars();
    },
    render,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onDblClick,
    undo,
    redo,
  });
})();