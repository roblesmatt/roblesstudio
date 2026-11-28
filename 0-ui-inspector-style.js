(() => {
  const Core = window.RoblesCore;
  if (!Core) return;

  window.RoblesInspectorModules = window.RoblesInspectorModules || {};

  // Estado persistente dos controlos de estilo
  const styleState = {
    // Vetor > Normal & Geral
    fillColor: "#3d2d2d",
    strokeColor: "#161515",
    strokeWidth: 2,
    cornerRadius: 0,
    opacityPct: 100,
    // Efeitos / Filtros (Vetor Normal & Pixel)
    blurPx: 0,
    diffuseGlow: 0,
    noisePct: 0,
    halftoneSize: 0,
    texturePreset: "nenhuma",
    // Ajustes Tonais (Vetor Normal, Pixel & Vídeo)
    brightness: 0,
    contrast: 0,
    saturation: 0,
    temperature: 0,
    exposure: 0,
    lutPreset: "apothecary",
    // Vetor > Tipografia
    fontFamily: "Inter / Sans",
    fontWeight: "600",
    fontSize: 24,
    lineHeight: 1.2,
    letterSpacing: 0,
    textAlign: "left",
    // Vetor > Layouts
    gridColumns: 4,
    gridGap: 12,
    gridMargin: 16,
    layoutAlign: "start",
    showGuides: true,
    // Pixel > Pintura
    brushSize: 14,
    brushFlow: 85,
    brushSmooth: 40,
    paperGrain: 25,
    // Vídeo > Clipe & Motion
    transitionType: "dissolve",
    easingCurve: "cubic-out",
    motionAmplitude: 12,
    // 3D > Modelagem, Sculpt & Render
    material3d: "sage-matte",
    roughness3d: 0.45,
    bevel3d: 2.0,
    wireframe3d: false,
    sculptStrength: 0.5,
    sculptSymmetry: true,
    hdriEnv: "studio-warm",
    renderSamples: 64,
  };

  // Perfis contextuais por Persona > Submenu
  const STYLE_PROFILES = {
    // =========================================================================
    // VETOR
    // =========================================================================
    "vector:normal": {
      title: "Estilo · Vetor Normal",
      sections: [
        {
          heading: "Preenchimento & Traço",
          controls: [
            { type: "color", key: "fillColor", label: "Preenchimento" },
            { type: "color", key: "strokeColor", label: "Contorno" },
            { type: "range", key: "strokeWidth", label: "Espessura", min: 0, max: 32, step: 0.5, unit: "px" },
            { type: "range", key: "cornerRadius", label: "Cantos", min: 0, max: 64, step: 1, unit: "px" },
            { type: "range", key: "opacityPct", label: "Opacidade", min: 0, max: 100, step: 1, unit: "%" },
          ],
        },
        {
          heading: "Ajustes de Cor & Tom",
          controls: [
            { type: "range", key: "brightness", label: "Brilho", min: -100, max: 100, step: 1, unit: "" },
            { type: "range", key: "contrast", label: "Contraste", min: -100, max: 100, step: 1, unit: "" },
            { type: "range", key: "saturation", label: "HSL / Saturação", min: -100, max: 100, step: 1, unit: "" },
            { type: "range", key: "exposure", label: "Exposição", min: -50, max: 50, step: 1, unit: "" },
          ],
        },
        {
          heading: "Efeitos & Textura",
          controls: [
            { type: "range", key: "blurPx", label: "Desfoque Gaussiano", min: 0, max: 40, step: 0.5, unit: "px" },
            { type: "range", key: "diffuseGlow", label: "Brilho Difuso", min: 0, max: 100, step: 1, unit: "%" },
            { type: "range", key: "noisePct", label: "Adicionar Ruído", min: 0, max: 100, step: 1, unit: "%" },
            { type: "range", key: "halftoneSize", label: "Meio-tom", min: 0, max: 24, step: 1, unit: "px" },
            {
              type: "select",
              key: "texturePreset",
              label: "Textura",
              options: [
                { value: "nenhuma", label: "Nenhuma" },
                { value: "papel-algodao", label: "Papel Algodão" },
                { value: "grao-fino", label: "Grão Fino" },
                { value: "linho", label: "Linho Apothecary" },
              ],
            },
          ],
        },
      ],
    },

    "vector:tipografia": {
      title: "Estilo · Tipografia",
      sections: [
        {
          heading: "Caractere & Escala",
          controls: [
            {
              type: "select",
              key: "fontFamily",
              label: "Família",
              options: [
                { value: "Inter / Sans", label: "Sans Geométrica" },
                { value: "Editorial Serif", label: "Serifa Editorial" },
                { value: "Mono Technical", label: "Monoespaçada" },
              ],
            },
            {
              type: "select",
              key: "fontWeight",
              label: "Peso",
              options: [
                { value: "400", label: "Regular (400)" },
                { value: "500", label: "Médio (500)" },
                { value: "600", label: "Semi-Bold (600)" },
                { value: "700", label: "Bold (700)" },
              ],
            },
            { type: "range", key: "fontSize", label: "Tamanho", min: 8, max: 144, step: 1, unit: "px" },
          ],
        },
        {
          heading: "Parágrafo & Ritmo",
          controls: [
            { type: "range", key: "lineHeight", label: "Entrelinha", min: 0.8, max: 2.5, step: 0.05, unit: "x" },
            { type: "range", key: "letterSpacing", label: "Tracking", min: -5, max: 25, step: 0.5, unit: "px" },
            {
              type: "segmented",
              key: "textAlign",
              label: "Alinhamento",
              options: [
                { value: "left", label: "Esq" },
                { value: "center", label: "Centro" },
                { value: "right", label: "Dir" },
              ],
            },
          ],
        },
        {
          heading: "Acabamento do Texto",
          controls: [
            { type: "color", key: "fillColor", label: "Cor do Texto" },
            { type: "range", key: "strokeWidth", label: "Contorno", min: 0, max: 10, step: 0.5, unit: "px" },
            { type: "range", key: "opacityPct", label: "Opacidade", min: 0, max: 100, step: 1, unit: "%" },
          ],
        },
      ],
    },

    "vector:layouts": {
      title: "Estilo · Layouts",
      sections: [
        {
          heading: "Grade & Estrutura",
          controls: [
            { type: "range", key: "gridColumns", label: "Colunas", min: 1, max: 12, step: 1, unit: "" },
            { type: "range", key: "gridGap", label: "Espaçamento (Gap)", min: 0, max: 64, step: 2, unit: "px" },
            { type: "range", key: "gridMargin", label: "Margens", min: 0, max: 96, step: 2, unit: "px" },
            { type: "toggle", key: "showGuides", label: "Exibir Guias" },
          ],
        },
        {
          heading: "Blocos & Superfície",
          controls: [
            {
              type: "segmented",
              key: "layoutAlign",
              label: "Distribuição",
              options: [
                { value: "start", label: "Início" },
                { value: "center", label: "Centro" },
                { value: "between", label: "Distribuir" },
              ],
            },
            { type: "range", key: "cornerRadius", label: "Raio do Bloco", min: 0, max: 48, step: 1, unit: "px" },
            { type: "color", key: "fillColor", label: "Fundo do Bloco" },
            { type: "range", key: "strokeWidth", label: "Borda", min: 0, max: 8, step: 0.5, unit: "px" },
          ],
        },
      ],
    },

    // =========================================================================
    // PIXEL
    // =========================================================================
    "pixel:default": {
      title: "Estilo · Pixel Ajustes",
      sections: [
        {
          heading: "Revelação & Cor",
          controls: [
            { type: "range", key: "exposure", label: "Exposição", min: -50, max: 50, step: 1, unit: "" },
            { type: "range", key: "contrast", label: "Contraste", min: -100, max: 100, step: 1, unit: "" },
            { type: "range", key: "saturation", label: "Saturação", min: -100, max: 100, step: 1, unit: "" },
            { type: "range", key: "temperature", label: "Temperatura", min: -100, max: 100, step: 1, unit: "" },
          ],
        },
        {
          heading: "Filtros & Grão",
          controls: [
            { type: "range", key: "blurPx", label: "Desfoque", min: 0, max: 40, step: 0.5, unit: "px" },
            { type: "range", key: "noisePct", label: "Ruído", min: 0, max: 100, step: 1, unit: "%" },
            { type: "range", key: "halftoneSize", label: "Meio-tom", min: 0, max: 24, step: 1, unit: "px" },
          ],
        },
      ],
    },

    "pixel:pintura": {
      title: "Estilo · Pintura & Pincel",
      sections: [
        {
          heading: "Ponta & Fluxo",
          controls: [
            { type: "color", key: "fillColor", label: "Cor Ativa" },
            { type: "range", key: "brushSize", label: "Tamanho", min: 1, max: 120, step: 1, unit: "px" },
            { type: "range", key: "brushFlow", label: "Fluxo", min: 1, max: 100, step: 1, unit: "%" },
            { type: "range", key: "brushSmooth", label: "Suavização", min: 0, max: 100, step: 1, unit: "%" },
          ],
        },
        {
          heading: "Textura do Papel",
          controls: [
            { type: "range", key: "paperGrain", label: "Granulação", min: 0, max: 100, step: 1, unit: "%" },
            { type: "range", key: "opacityPct", label: "Opacidade", min: 0, max: 100, step: 1, unit: "%" },
          ],
        },
      ],
    },

    // =========================================================================
    // VÍDEO
    // =========================================================================
    "video:default": {
      title: "Estilo · Vídeo Clipe",
      sections: [
        {
          heading: "Composição & Cor",
          controls: [
            {
              type: "select",
              key: "lutPreset",
              label: "Color / LUT",
              options: [
                { value: "apothecary", label: "Apothecary Warm" },
                { value: "botanical", label: "Botanical Sage" },
                { value: "mono-noir", label: "Mono Contraste" },
                { value: "neutro", label: "Neutro" },
              ],
            },
            { type: "range", key: "contrast", label: "Contraste", min: -100, max: 100, step: 1, unit: "" },
            { type: "range", key: "opacityPct", label: "Opacidade", min: 0, max: 100, step: 1, unit: "%" },
          ],
        },
        {
          heading: "Corte & Transição",
          controls: [
            {
              type: "segmented",
              key: "transitionType",
              label: "Transição",
              options: [
                { value: "cut", label: "Corte" },
                { value: "dissolve", label: "Dissolver" },
                { value: "fade", label: "Fade" },
              ],
            },
          ],
        },
      ],
    },

    "video:motion": {
      title: "Estilo · Motion",
      sections: [
        {
          heading: "Aparência & Curva",
          controls: [
            { type: "color", key: "fillColor", label: "Cor do Elemento" },
            {
              type: "select",
              key: "easingCurve",
              label: "Curva (Easing)",
              options: [
                { value: "cubic-out", label: "Cubic Out" },
                { value: "spring", label: "Mola (Spring)" },
                { value: "linear", label: "Linear" },
              ],
            },
            { type: "range", key: "motionAmplitude", label: "Amplitude", min: 0, max: 100, step: 1, unit: "px" },
          ],
        },
      ],
    },

    // =========================================================================
    // 3D
    // =========================================================================
    "3d:default": {
      title: "Estilo · Material 3D",
      sections: [
        {
          heading: "Superfície & Acabamento",
          controls: [
            {
              type: "select",
              key: "material3d",
              label: "Shader",
              options: [
                { value: "sage-matte", label: "Sálvia Fosco" },
                { value: "apothecary-beige", label: "Creme Cerâmico" },
                { value: "amber-glass", label: "Vidro Âmbar" },
                { value: "brushed-gold", label: "Ouro Escovado" },
              ],
            },
            { type: "color", key: "fillColor", label: "Cor Base" },
            { type: "range", key: "roughness3d", label: "Rugosidade", min: 0, max: 1, step: 0.05, unit: "" },
            { type: "range", key: "bevel3d", label: "Fillet / Chanfro", min: 0, max: 10, step: 0.2, unit: "mm" },
            { type: "toggle", key: "wireframe3d", label: "Malha Wireframe" },
          ],
        },
      ],
    },

    "3d:sculpt": {
      title: "Estilo · Escultura 3D",
      sections: [
        {
          heading: "Pincel Orgânico",
          controls: [
            { type: "range", key: "sculptStrength", label: "Força", min: 0.05, max: 1, step: 0.05, unit: "" },
            { type: "range", key: "brushSize", label: "Raio", min: 2, max: 80, step: 1, unit: "px" },
            { type: "toggle", key: "sculptSymmetry", label: "Simetria Eixo X" },
          ],
        },
      ],
    },

    "3d:render": {
      title: "Estilo · Render & Luz",
      sections: [
        {
          heading: "Ambiente & Amostras",
          controls: [
            {
              type: "select",
              key: "hdriEnv",
              label: "Iluminação HDRI",
              options: [
                { value: "studio-warm", label: "Estúdio Quente" },
                { value: "dramatic-noir", label: "Noir Dramático" },
              ],
            },
            { type: "range", key: "renderSamples", label: "Amostras", min: 16, max: 256, step: 16, unit: "spp" },
            { type: "range", key: "exposure", label: "Exposição", min: -50, max: 50, step: 1, unit: "" },
          ],
        },
      ],
    },
  };

  function normalizeSubMode(raw) {
    const val = String(raw || "normal").toLowerCase().trim();
    if (val.includes("tipo") || val.includes("text") || val.includes("font")) return "tipografia";
    if (val.includes("layout") || val.includes("grid") || val.includes("artboard")) return "layouts";
    if (val.includes("pint") || val.includes("paint") || val.includes("sketch")) return "pintura";
    if (val.includes("mot")) return "motion";
    if (val.includes("sculpt") || val.includes("escult")) return "sculpt";
    if (val.includes("rend") || val.includes("luz")) return "render";
    return "normal";
  }

  function resolveProfile(ctx = {}) {
    const area = (ctx.currentArea || Core.state?.activeArea || "vector").toLowerCase();
    const rawSub =
      ctx.subMode ||
      Core.state?.subMode ||
      Core.state?.subPersona ||
      Core.state?.activeSubMode ||
      document.querySelector(".hud-top-right .is-active, [data-submode].is-active")?.dataset?.submode ||
      "normal";

    const sub = normalizeSubMode(rawSub);
    const exactKey = `${area}:${sub}`;
    if (STYLE_PROFILES[exactKey]) return STYLE_PROFILES[exactKey];
    if (STYLE_PROFILES[`${area}:default`]) return STYLE_PROFILES[`${area}:default`];
    return STYLE_PROFILES["vector:normal"];
  }

  function commitStyleChange(key, value, ctx) {
    styleState[key] = value;
    if (Core.state) {
      Core.state.activeStyle = { ...styleState };
    }
    Core.emit?.("style:change", { key, value, style: { ...styleState }, context: ctx });
    Core.emit?.("ui:update");
    Core.emit?.("render:request");
  }

  function formatRulerDisplayValue(val, step) {
    const num = Number(val);
    if (!Number.isFinite(num)) return String(val ?? "");
    const stepStr = String(step ?? 1);
    const decMatch = stepStr.split(".")[1];
    const decimals = decMatch ? Math.min(3, decMatch.length) : 0;
    return decimals > 0 ? num.toFixed(decimals) : String(Math.round(num));
  }

  function renderControl(ctrl) {
    const val = styleState[ctrl.key];

    if (ctrl.type === "color") {
      return `
        <div class="history-step-row" style="justify-content:space-between;align-items:center;cursor:default;">
          <span class="history-step-left"><span style="font-size:12px;">${ctrl.label}</span></span>
          <label style="display:inline-flex;align-items:center;gap:6px;cursor:pointer;">
            <span class="history-step-ref" style="font-size:11px;">${val}</span>
            <input type="color" data-style-key="${ctrl.key}" value="${val}" style="width:22px;height:18px;border:1px solid rgba(0,0,0,0.25);background:transparent;padding:0;cursor:pointer;" />
          </label>
        </div>
      `;
    }

    if (ctrl.type === "range") {
      const min = Number(ctrl.min ?? 0);
      const max = Number(ctrl.max ?? 100);
      const step = Number(ctrl.step ?? 1) || 1;
      const numVal = Number(val ?? min);
      const span = max - min || 1;
      const pct = Math.max(0, Math.min(100, ((numVal - min) / span) * 100));
      const displayNum = formatRulerDisplayValue(numVal, step);

      return `
        <div class="rs-ruler-box" data-ruler-wrap="${ctrl.key}">
          <div class="rs-ruler-head">
            <span class="rs-ruler-label">${ctrl.label}</span>
            <span class="rs-ruler-val" data-style-val="${ctrl.key}">${displayNum}${ctrl.unit || ""}</span>
          </div>
          <div
            class="rs-ruler-track"
            role="slider"
            tabindex="0"
            aria-label="${ctrl.label}"
            aria-valuemin="${min}"
            aria-valuemax="${max}"
            aria-valuenow="${numVal}"
            data-style-key="${ctrl.key}"
            data-style-min="${min}"
            data-style-max="${max}"
            data-style-step="${step}"
            data-style-unit="${ctrl.unit || ""}"
            style="--pct: ${pct.toFixed(2)}%;"
          ></div>
        </div>
      `;
    }

    if (ctrl.type === "select") {
      return `
        <div class="history-step-row" style="justify-content:space-between;align-items:center;gap:8px;cursor:default;">
          <span style="font-size:12px;">${ctrl.label}</span>
          <select data-style-key="${ctrl.key}" class="rset-input" style="max-width:128px;padding:2px 6px;font-size:11px;">
            ${ctrl.options
              .map(
                (opt) =>
                  `<option value="${opt.value}" ${String(val) === String(opt.value) ? "selected" : ""}>${opt.label}</option>`
              )
              .join("")}
          </select>
        </div>
      `;
    }

    if (ctrl.type === "segmented") {
      return `
        <div class="history-step-row" style="flex-direction:column;align-items:stretch;gap:4px;cursor:default;">
          <span style="font-size:12px;">${ctrl.label}</span>
          <div style="display:flex;gap:4px;">
            ${ctrl.options
              .map(
                (opt) => `
                <button
                  type="button"
                  class="rset-action-btn"
                  data-style-seg="${ctrl.key}"
                  data-style-seg-val="${opt.value}"
                  style="flex:1;padding:3px 4px;font-size:11px;${String(val) === String(opt.value) ? "background:#3d2d2d;color:#CEC8B8;" : ""}"
                >${opt.label}</button>
              `
              )
              .join("")}
          </div>
        </div>
      `;
    }

    if (ctrl.type === "toggle") {
      return `
        <div class="history-step-row" style="justify-content:space-between;align-items:center;cursor:default;">
          <span style="font-size:12px;">${ctrl.label}</span>
          <button
            type="button"
            class="rset-action-btn"
            data-style-toggle="${ctrl.key}"
            style="padding:2px 10px;font-size:11px;${val ? "background:#3d2d2d;color:#CEC8B8;" : ""}"
          >${val ? "Ativo" : "Off"}</button>
        </div>
      `;
    }

    return "";
  }

  window.RoblesInspectorModules.style = {
    getState() {
      return { ...styleState };
    },

    getHeader(ctx = {}) {
      const profile = resolveProfile(ctx);
      return {
        title: profile.title,
        counter: "◈",
      };
    },

    render(ctx = {}) {
      const profile = resolveProfile(ctx);
      return profile.sections
        .map(
          (sec) => `
          <div style="padding:6px 6px 2px;font-size:10px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;opacity:0.65;">
            ${sec.heading}
          </div>
          ${sec.controls.map(renderControl).join("")}
        `
        )
        .join("");
    },

    bindEvents(container, rerender, ctx = {}) {
      // Régua segmentada padrão para controlos de valor
      container.querySelectorAll(".rs-ruler-track[data-style-key]").forEach((track) => {
        const key = track.dataset.styleKey;
        const min = Number(track.dataset.styleMin ?? 0);
        const max = Number(track.dataset.styleMax ?? 100);
        const step = Number(track.dataset.styleStep ?? 1) || 1;
        const unit = track.dataset.styleUnit || "";
        const span = max - min || 1;

        const snapToStep = (rawNum) => {
          const clamped = Math.max(min, Math.min(max, rawNum));
          const snapped = min + Math.round((clamped - min) / step) * step;
          return Math.max(min, Math.min(max, Number(snapped.toFixed(4))));
        };

        const applyValueToRuler = (nextVal) => {
          const pct = (((nextVal - min) / span) * 100).toFixed(2);
          track.style.setProperty("--pct", `${pct}%`);
          track.setAttribute("aria-valuenow", String(nextVal));

          const badge = container.querySelector(`[data-style-val="${key}"]`);
          if (badge) {
            badge.textContent = `${formatRulerDisplayValue(nextVal, step)}${unit}`;
          }

          if (styleState[key] !== nextVal) {
            commitStyleChange(key, nextVal, ctx);
          }
        };

        const updateFromClientX = (clientX) => {
          const rect = track.getBoundingClientRect();
          if (!rect.width) return;
          const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
          applyValueToRuler(snapToStep(min + ratio * span));
        };

        track.addEventListener("click", (e) => e.stopPropagation());

        track.addEventListener("pointerdown", (e) => {
          e.preventDefault();
          e.stopPropagation();
          track.focus?.();
          track.setPointerCapture?.(e.pointerId);
          track.dataset.dragging = "1";
          updateFromClientX(e.clientX);
        });

        track.addEventListener("pointermove", (e) => {
          if (track.dataset.dragging !== "1") return;
          e.preventDefault();
          e.stopPropagation();
          updateFromClientX(e.clientX);
        });

        const stopDrag = (e) => {
          if (track.dataset.dragging !== "1") return;
          e.stopPropagation();
          track.dataset.dragging = "0";
          if (track.hasPointerCapture?.(e.pointerId)) {
            track.releasePointerCapture(e.pointerId);
          }
        };

        track.addEventListener("pointerup", stopDrag);
        track.addEventListener("pointercancel", stopDrag);

        track.addEventListener("keydown", (e) => {
          let delta = 0;
          if (e.key === "ArrowRight" || e.key === "ArrowUp") delta = step;
          else if (e.key === "ArrowLeft" || e.key === "ArrowDown") delta = -step;
          else return;

          e.preventDefault();
          e.stopPropagation();
          const current = Number(track.getAttribute("aria-valuenow") ?? styleState[key] ?? min);
          applyValueToRuler(snapToStep(current + delta));
        });
      });

      // Demais controlos (cor, seleção, segmentados, toggles)
      container.querySelectorAll("[data-style-key]:not(.rs-ruler-track)").forEach((el) => {
        const key = el.dataset.styleKey;
        el.addEventListener("click", (e) => e.stopPropagation());
        el.addEventListener("change", () => {
          commitStyleChange(key, el.value, ctx);
          rerender();
        });
      });

      container.querySelectorAll("[data-style-seg]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          commitStyleChange(btn.dataset.styleSeg, btn.dataset.styleSegVal, ctx);
          rerender();
        });
      });

      container.querySelectorAll("[data-style-toggle]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const key = btn.dataset.styleToggle;
          commitStyleChange(key, !styleState[key], ctx);
          rerender();
        });
      });
    },
  };
})();
