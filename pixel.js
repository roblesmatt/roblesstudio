(() => {
  const STUDIO = () => window.RoblesStudio || null;

  const PRIMARY_PIXEL_TOOLS = [
    {
      id: "brush",
      label: "Pincel",
      title: "Ferramenta Primária · Pincel Master (Pintura & Textura)",
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z"/><path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7"/><path d="M14.5 17.5 4.5 15"/></svg>`,
      defaultSecondary: "px-size-md",
      presets: [
        {
          id: "px-oil-impasto",
          label: "Impasto",
          title: "Pincel · Óleo & Impasto com relevo de pincelada",
          color: "#e07a5f",
          size: 10,
          alpha: 0.92,
          softness: 0.25,
          texture: "impasto",
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><rect width="26" height="18" rx="3" fill="#2A2421"/><path d="M4 13C8 6 14 14 22 5" stroke="#E07A5F" stroke-width="3.6" stroke-linecap="round"/><path d="M6 14C10 9 15 14 20 8" stroke="#F4F1DE" stroke-width="1.2" stroke-linecap="round" opacity="0.7"/></svg>`,
        },
        {
          id: "px-watercolor-wet",
          label: "Aguada",
          title: "Pincel · Aquarela Úmida com borda difusa",
          color: "#38bdf8",
          size: 16,
          alpha: 0.45,
          softness: 0.85,
          texture: "wash",
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><defs><radialGradient id="pxw" cx="50%" cy="50%" r="60%"><stop offset="0%" stop-color="#38BDF8" stop-opacity="0.9"/><stop offset="100%" stop-color="#818CF8" stop-opacity="0.1"/></radialGradient></defs><rect width="26" height="18" rx="3" fill="#172033"/><ellipse cx="13" cy="9" rx="8.5" ry="5.5" fill="url(#pxw)"/></svg>`,
        },
        {
          id: "px-ink-marker",
          label: "Marcador",
          title: "Pincel · Marcador Hard de Ilustração",
          color: "#fbbf24",
          size: 7,
          alpha: 1,
          softness: 0.05,
          texture: "grain",
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><rect width="26" height="18" rx="3" fill="#1C1917"/><path d="M5 13L12 5L15 11L21 5" stroke="#FBBF24" stroke-width="2.6" stroke-linecap="square" stroke-linejoin="miter"/></svg>`,
        },
      ],
      secondary: [
        { id: "px-size-sm", label: "Ponta Fina", icon: "•" },
        { id: "px-size-md", label: "Ponta Média", icon: "◉" },
        { id: "px-size-lg", label: "Ponta Grossa", icon: "⬤" },
        { id: "px-clear-strokes", label: "Limpar Pintura", icon: "⌫" },
      ],
    },
    {
      id: "eraser",
      label: "Borracha",
      title: "Ferramenta Primária · Borracha & Recorte de Pixels",
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/></svg>`,
      defaultSecondary: "er-soft",
      presets: [
        {
          id: "er-soft-edge",
          label: "Suave",
          title: "Borracha · Difusão Suave",
          color: "#18181b",
          size: 18,
          alpha: 0.65,
          softness: 0.9,
          texture: "wash",
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><rect width="26" height="18" rx="3" fill="#27272A"/><circle cx="13" cy="9" r="6" fill="#E4E4E7" fill-opacity="0.35"/><circle cx="13" cy="9" r="3" fill="#E4E4E7" fill-opacity="0.75"/></svg>`,
        },
        {
          id: "er-hard-cut",
          label: "Recorte",
          title: "Borracha · Recorte Seco de Precisão",
          color: "#18181b",
          size: 10,
          alpha: 1,
          softness: 0.05,
          texture: "none",
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><rect width="26" height="18" rx="3" fill="#27272A"/><rect x="7" y="4" width="12" height="10" rx="2" fill="#F4F4F5" stroke="#18181B" stroke-width="1.5"/></svg>`,
        },
      ],
      secondary: [
        { id: "er-soft", label: "Borda Suave", icon: "◔" },
        { id: "er-hard", label: "Borda Dura", icon: "▣" },
        { id: "er-big", label: "Área Ampla", icon: "⤢" },
        { id: "er-undo", label: "Desfazer Apagar", icon: "↶" },
      ],
    },
    {
      id: "marquee",
      label: "Seleção",
      title: "Ferramenta Primária · Seleção Retangular & Máscara",
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-dasharray="3 2"><rect x="3" y="4" width="18" height="16" rx="2"/></svg>`,
      defaultSecondary: "sel-fill",
      presets: [
        {
          id: "sel-editorial-box",
          label: "Quadro",
          title: "Seleção · Quadro Editorial",
          color: "#60a5fa",
          size: 2,
          alpha: 0.2,
          softness: 0,
          texture: "none",
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><rect width="26" height="18" rx="3" fill="#172554"/><rect x="5" y="4" width="16" height="10" stroke="#60A5FA" stroke-width="1.4" stroke-dasharray="2 2"/></svg>`,
        },
        {
          id: "sel-feather-zone",
          label: "Difusa",
          title: "Seleção · Área com Difusão",
          color: "#f472b6",
          size: 2,
          alpha: 0.25,
          softness: 0.7,
          texture: "wash",
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><rect width="26" height="18" rx="3" fill="#2E1065"/><rect x="6" y="4" width="14" height="10" rx="4" fill="#F472B6" fill-opacity="0.25" stroke="#F472B6" stroke-width="1.3" stroke-dasharray="2 2"/></svg>`,
        },
      ],
      secondary: [
        { id: "sel-fill", label: "Preencher Seleção", icon: "▤" },
        { id: "sel-stroke", label: "Contornar Seleção", icon: "▢" },
        { id: "sel-clear", label: "Limpar Seleção", icon: "⬚" },
        { id: "sel-center-box", label: "Centralizar Caixa", icon: "⊕" },
      ],
    },
    {
      id: "bucket",
      label: "Preencher",
      title: "Ferramenta Primária · Balde, Gradiente & Padrões",
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z"/><path d="m5 2 5 5"/><path d="M2 13h15"/><path d="M22 20a2 2 0 1 1-4 0c0-1.6 2-3 2-3s2 1.4 2 3Z"/></svg>`,
      defaultSecondary: "fill-amber",
      presets: [
        {
          id: "fill-warm-amber",
          label: "Âmbar",
          title: "Preenchimento · Âmbar & Ouro",
          color: "#f59e0b",
          size: 12,
          alpha: 0.28,
          softness: 0.2,
          texture: "grain",
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><rect width="26" height="18" rx="3" fill="#292116"/><rect x="5" y="4" width="16" height="10" rx="2" fill="#F59E0B" fill-opacity="0.65"/></svg>`,
        },
        {
          id: "fill-emerald-sage",
          label: "Sálvia",
          title: "Preenchimento · Verde Sálvia Botânico",
          color: "#84987e",
          size: 12,
          alpha: 0.32,
          softness: 0.2,
          texture: "grain",
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><rect width="26" height="18" rx="3" fill="#1E261E"/><rect x="5" y="4" width="16" height="10" rx="2" fill="#84987E" fill-opacity="0.7"/></svg>`,
        },
        {
          id: "fill-cobalt-glow",
          label: "Cobalto",
          title: "Preenchimento · Azul Cobalto",
          color: "#3b82f6",
          size: 12,
          alpha: 0.28,
          softness: 0.2,
          texture: "none",
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><rect width="26" height="18" rx="3" fill="#141E36"/><rect x="5" y="4" width="16" height="10" rx="2" fill="#3B82F6" fill-opacity="0.68"/></svg>`,
        },
      ],
      secondary: [
        { id: "fill-amber", label: "Cor Âmbar", icon: "🟨" },
        { id: "fill-emerald", label: "Cor Sálvia", icon: "🟩" },
        { id: "fill-cobalt", label: "Cor Cobalto", icon: "🟦" },
        { id: "fill-clear", label: "Limpar Preenchimentos", icon: "✕" },
      ],
    },
    {
      id: "adjust",
      label: "Master FX",
      title: "Ferramenta Primária · Ajustes Master, Luz & Textura",
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>`,
      defaultSecondary: "fx-vignette",
      presets: [
        {
          id: "fx-cinema-contrast",
          label: "Cinema",
          title: "Master FX · Contraste & Vinheta Editorial",
          color: "#f59e0b",
          size: 8,
          alpha: 0.35,
          softness: 0.6,
          texture: "grain",
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><defs><radialGradient id="pxv" cx="50%" cy="50%" r="65%"><stop offset="30%" stop-color="#FBBF24" stop-opacity="0.2"/><stop offset="100%" stop-color="#09090B" stop-opacity="0.9"/></radialGradient></defs><rect width="26" height="18" rx="3" fill="#18181B"/><rect width="26" height="18" rx="3" fill="url(#pxv)"/></svg>`,
        },
        {
          id: "fx-film-grain",
          label: "Filme",
          title: "Master FX · Grão Analógico de Filme",
          color: "#e5e7eb",
          size: 6,
          alpha: 0.3,
          softness: 0.3,
          texture: "grain",
          previewSvg: `<svg width="26" height="18" viewBox="0 0 26 18" fill="none"><rect width="26" height="18" rx="3" fill="#27272A"/><circle cx="7" cy="6" r="1.1" fill="#FFF"/><circle cx="14" cy="5" r="1" fill="#FFF"/><circle cx="20" cy="8" r="1.2" fill="#FFF"/><circle cx="10" cy="12" r="1" fill="#FFF"/><circle cx="18" cy="13" r="1.1" fill="#FFF"/></svg>`,
        },
      ],
      secondary: [
        { id: "fx-vignette", label: "Vinheta +", icon: "◎" },
        { id: "fx-grain", label: "Grão +", icon: "∴" },
        { id: "fx-reset", label: "Zerar FX", icon: "↺" },
      ],
    },
  ];

  const state = {
    primaryId: PRIMARY_PIXEL_TOOLS[0].id,
    presetIdByPrimary: {
      brush: "px-oil-impasto",
      eraser: "er-soft-edge",
      marquee: "sel-editorial-box",
      bucket: "fill-warm-amber",
      adjust: "fx-cinema-contrast",
    },
    secondaryIdByPrimary: {
      brush: "px-size-md",
      eraser: "er-soft",
      marquee: "sel-fill",
      bucket: "fill-amber",
      adjust: "fx-vignette",
    },
    strokes: [],
    fills: [],
    selection: { x: 220, y: 150, w: 220, h: 150, active: true },
    vignetteStrength: 0.25,
    grainStrength: 0.35,
    isDrawing: false,
    currentStroke: null,
    undoStack: [],
    redoStack: [],
  };

  function getPrimaryTool() {
    return PRIMARY_PIXEL_TOOLS.find((t) => t.id === state.primaryId) || PRIMARY_PIXEL_TOOLS[0];
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
        strokes: state.strokes,
        fills: state.fills,
        vignetteStrength: state.vignetteStrength,
        grainStrength: state.grainStrength,
      })
    );
    if (state.undoStack.length > 40) state.undoStack.shift();
    state.redoStack = [];
  }

  function restoreSnapshot(raw) {
    const parsed = JSON.parse(raw);
    state.strokes = parsed.strokes || [];
    state.fills = parsed.fills || [];
    state.vignetteStrength = parsed.vignetteStrength ?? 0.25;
    state.grainStrength = parsed.grainStrength ?? 0.35;
  }

  function setPrimaryTool(primaryId) {
    const tool = PRIMARY_PIXEL_TOOLS.find((t) => t.id === primaryId);
    if (!tool) return;
    state.primaryId = tool.id;
    state.isDrawing = false;
    state.currentStroke = null;

    STUDIO()?.recordHistory?.("pixel", `Pixel · ${tool.label}`);
    renderAllPixelBars();
    STUDIO()?.render?.();
  }

  function applyPreset(presetId) {
    const primary = getPrimaryTool();
    const preset = primary.presets.find((p) => p.id === presetId);
    if (!preset) return;

    state.presetIdByPrimary[primary.id] = preset.id;
    STUDIO()?.recordHistory?.("pixel", `Predefinição (${primary.label}): ${preset.label}`);
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

    if (secId === "px-size-sm") preset.size = 5;
    else if (secId === "px-size-md") preset.size = 11;
    else if (secId === "px-size-lg") preset.size = 22;
    else if (secId === "px-clear-strokes") {
      snapshot();
      state.strokes = [];
    } else if (secId === "er-soft") {
      preset.softness = 0.9;
      preset.size = 16;
    } else if (secId === "er-hard") {
      preset.softness = 0.05;
      preset.size = 10;
    } else if (secId === "er-big") {
      preset.size = 28;
    } else if (secId === "er-undo") {
      undo();
      return;
    } else if (secId === "sel-fill") {
      snapshot();
      state.fills.push({
        x: state.selection.x,
        y: state.selection.y,
        w: state.selection.w,
        h: state.selection.h,
        color: preset.color,
        alpha: 0.35,
      });
    } else if (secId === "sel-stroke") {
      snapshot();
      const s = state.selection;
      state.strokes.push({
        color: preset.color,
        size: 3,
        alpha: 0.95,
        erase: false,
        points: [
          { x: s.x, y: s.y },
          { x: s.x + s.w, y: s.y },
          { x: s.x + s.w, y: s.y + s.h },
          { x: s.x, y: s.y + s.h },
          { x: s.x, y: s.y },
        ],
      });
    } else if (secId === "sel-clear") {
      state.selection.active = false;
    } else if (secId === "sel-center-box") {
      state.selection = {
        x: Math.round(width / 2 - 120),
        y: Math.round(height / 2 - 80),
        w: 240,
        h: 160,
        active: true,
      };
    } else if (secId === "fill-amber") {
      snapshot();
      state.fills.push({ x: 0, y: 0, w: width, h: height, color: "#f59e0b", alpha: 0.16 });
    } else if (secId === "fill-emerald") {
      snapshot();
      state.fills.push({ x: 0, y: 0, w: width, h: height, color: "#84987e", alpha: 0.2 });
    } else if (secId === "fill-cobalt") {
      snapshot();
      state.fills.push({ x: 0, y: 0, w: width, h: height, color: "#3b82f6", alpha: 0.16 });
    } else if (secId === "fill-clear") {
      snapshot();
      state.fills = [];
    } else if (secId === "fx-vignette") {
      snapshot();
      state.vignetteStrength = Math.min(0.85, +(state.vignetteStrength + 0.15).toFixed(2));
    } else if (secId === "fx-grain") {
      snapshot();
      state.grainStrength = Math.min(0.9, +(state.grainStrength + 0.15).toFixed(2));
    } else if (secId === "fx-reset") {
      snapshot();
      state.vignetteStrength = 0.25;
      state.grainStrength = 0.35;
    }

    studio?.recordHistory?.("pixel", `${primary.label} · ${sec.label}`);
    renderSecondaryRightBar();
    studio?.render?.();
  }

  function renderLeftPrimaryBar() {
    const leftBar = document.querySelector(".hud-left");
    if (!leftBar) return;

    leftBar.innerHTML = PRIMARY_PIXEL_TOOLS.map(
      (tool) => `
        <button
          type="button"
          class="tool-btn ${state.primaryId === tool.id ? "is-active" : ""}"
          data-px-primary="${tool.id}"
          title="${tool.title}"
        >${tool.icon}</button>
      `
    ).join("");

    leftBar.querySelectorAll("[data-px-primary]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        setPrimaryTool(btn.dataset.pxPrimary);
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
            data-px-preset="${p.id}"
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

    centerBar.querySelectorAll("[data-px-preset]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        applyPreset(btn.dataset.pxPreset);
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
            data-px-sec="${sec.id}"
            title="${sec.label} (${primary.label})"
          >${sec.icon}</button>
        `
      )
      .join("");

    rightBar.querySelectorAll("[data-px-sec]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        runSecondaryAction(btn.dataset.pxSec);
      });
    });
  }

  function renderAllPixelBars() {
    renderLeftPrimaryBar();
    renderTopCenterPresets();
    renderSecondaryRightBar();
  }

  function render(ctx, width, height) {
    state.fills.forEach((f) => {
      ctx.save();
      ctx.globalAlpha = f.alpha ?? 0.25;
      ctx.fillStyle = f.color;
      ctx.fillRect(f.x, f.y, f.w, f.h);
      ctx.restore();
    });

    const allStrokes = state.currentStroke ? [...state.strokes, state.currentStroke] : state.strokes;
    allStrokes.forEach((st) => {
      if (!st.points || st.points.length === 0) return;
      ctx.save();
      ctx.globalCompositeOperation = st.erase ? "destination-out" : "source-over";
      ctx.globalAlpha = st.alpha ?? 0.9;
      ctx.strokeStyle = st.color;
      ctx.lineWidth = st.size;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      st.points.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();
      ctx.restore();
    });

    if (state.selection.active) {
      const { x, y, w, h } = state.selection;
      ctx.save();
      ctx.strokeStyle = "rgba(96, 165, 250, 0.9)";
      ctx.lineWidth = 1.2;
      ctx.setLineDash([5, 4]);
      ctx.strokeRect(x, y, w, h);
      ctx.restore();
    }

    if (state.vignetteStrength > 0) {
      const grad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.25,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.72
      );
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(1, `rgba(0,0,0,${state.vignetteStrength})`);
      ctx.save();
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }

    if (state.grainStrength > 0) {
      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      const step = 28;
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          if (((x * 13 + y * 29) % 7) === 0) {
            ctx.fillRect(x, y, 1.5, 1.5);
          }
        }
      }
      ctx.restore();
    }
  }

  function onMouseDown(x, y) {
    const preset = getActivePreset();

    if (state.primaryId === "marquee") {
      state.selection = { x, y, w: 0, h: 0, active: true };
      state.isDrawing = true;
      STUDIO()?.render?.();
      return;
    }

    if (state.primaryId === "bucket") {
      snapshot();
      const s = state.selection.active && state.selection.w > 6 && state.selection.h > 6
        ? state.selection
        : { x: 0, y: 0, w: STUDIO()?.getCanvasSize?.().width || 800, h: STUDIO()?.getCanvasSize?.().height || 600 };
      state.fills.push({
        x: s.x,
        y: s.y,
        w: s.w,
        h: s.h,
        color: preset.color,
        alpha: preset.alpha ?? 0.3,
      });
      STUDIO()?.recordHistory?.("pixel", `Preenchido · ${preset.label}`);
      STUDIO()?.render?.();
      return;
    }

    snapshot();
    state.isDrawing = true;
    state.currentStroke = {
      color: preset.color,
      size: preset.size,
      alpha: preset.alpha ?? 0.9,
      erase: state.primaryId === "eraser",
      points: [{ x, y }],
    };
    STUDIO()?.render?.();
  }

  function onMouseMove(x, y) {
    if (!state.isDrawing) return;

    if (state.primaryId === "marquee") {
      state.selection.w = x - state.selection.x;
      state.selection.h = y - state.selection.y;
      STUDIO()?.render?.();
      return;
    }

    if (state.currentStroke) {
      state.currentStroke.points.push({ x, y });
      STUDIO()?.render?.();
    }
  }

  function onMouseUp() {
    if (!state.isDrawing) return;
    state.isDrawing = false;

    if (state.primaryId === "marquee") {
      if (state.selection.w < 0) {
        state.selection.x += state.selection.w;
        state.selection.w = Math.abs(state.selection.w);
      }
      if (state.selection.h < 0) {
        state.selection.y += state.selection.h;
        state.selection.h = Math.abs(state.selection.h);
      }
      STUDIO()?.recordHistory?.("pixel", "Seleção atualizada");
      STUDIO()?.render?.();
      return;
    }

    if (state.currentStroke && state.currentStroke.points.length > 0) {
      state.strokes.push(state.currentStroke);
      state.currentStroke = null;
      STUDIO()?.recordHistory?.("pixel", `Traço Pixel (${getActivePreset().label})`);
      STUDIO()?.render?.();
    }
  }

  function undo() {
    if (state.undoStack.length === 0) return;
    state.redoStack.push(
      JSON.stringify({
        strokes: state.strokes,
        fills: state.fills,
        vignetteStrength: state.vignetteStrength,
        grainStrength: state.grainStrength,
      })
    );
    restoreSnapshot(state.undoStack.pop());
    STUDIO()?.render?.();
  }

  function redo() {
    if (state.redoStack.length === 0) return;
    state.undoStack.push(
      JSON.stringify({
        strokes: state.strokes,
        fills: state.fills,
        vignetteStrength: state.vignetteStrength,
        grainStrength: state.grainStrength,
      })
    );
    restoreSnapshot(state.redoStack.pop());
    STUDIO()?.render?.();
  }

  window.RoblesStudio?.registerModule("pixel", {
    onActivate() {
      renderAllPixelBars();
    },
    onDeactivate() {
      state.isDrawing = false;
      state.currentStroke = null;
    },
    renderBars() {
      renderAllPixelBars();
    },
    render,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    undo,
    redo,
  });
})();