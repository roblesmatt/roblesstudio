(() => {
  const Core = window.RoblesCore;
  if (!Core) return;

  const FORMATS = [
    {
      id: "png",
      label: "PNG",
      ext: "png",
      mime: "image/png",
      color: "#22c55e",
      group: "Imagem sem perda / transparência",
      hasQuality: false,
    },
    {
      id: "jpeg",
      label: "JPEG",
      ext: "jpg",
      mime: "image/jpeg",
      color: "#f59e0b",
      group: "Foto / compressão com perdas",
      hasQuality: true,
    },
    {
      id: "webp-best",
      label: "WebP (melhor qualidade)",
      ext: "webp",
      mime: "image/webp",
      color: "#a855f7",
      group: "WebP",
      hasQuality: true,
      defaultQuality: 96,
    },
    {
      id: "webp-high",
      label: "WebP (alta qualidade)",
      ext: "webp",
      mime: "image/webp",
      color: "#a855f7",
      group: "WebP",
      hasQuality: true,
      defaultQuality: 82,
    },
    {
      id: "svg",
      label: "SVG",
      ext: "svg",
      mime: "image/svg+xml",
      color: "#fb923c",
      group: "Vetorial / prancheta",
      hasQuality: false,
    },
    {
      id: "robles-json",
      label: "Robles Projeto (.json)",
      ext: "robles.json",
      mime: "application/json",
      color: "#38bdf8",
      group: "Dados & Estado",
      hasQuality: false,
    },
  ];

  let modalEl = null;
  let isOpen = false;
  let activeFormatId = "png";
  let activeSubTab = "params"; // "params" | "advanced"
  let searchQuery = "";

  const opts = {
    width: 1080,
    height: 1080,
    lockAspect: true,
    resample: "Bilinear",
    area: "Documento inteiro",
    hideHiddenLayers: true,
    quality: 92,
    includeBleed: false,
    matteColor: "#CEC8B8",
  };

  function getSourceCanvas() {
    return document.getElementById("scene-canvas");
  }

  function syncDimensionsFromCanvas() {
    const c = getSourceCanvas();
    if (c && c.width > 0 && c.height > 0) {
      opts.width = Math.min(4096, Math.max(16, Math.round(c.width)));
      opts.height = Math.min(4096, Math.max(16, Math.round(c.height)));
    }
  }

  function getActiveFormat() {
    return FORMATS.find((f) => f.id === activeFormatId) || FORMATS[0];
  }

  function estimateFileSizeLabel(fmt) {
    if (fmt.id === "robles-json") return "~ 12 KB";
    if (fmt.id === "svg") return "~ 8 KB";
    const pxCount = Math.max(1, opts.width * opts.height);
    const factor = fmt.id === "png" ? 1.4 : (opts.quality / 100) * 0.45;
    const kb = Math.max(4, Math.round((pxCount * factor) / 1024));
    return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
  }

  function buildExportCanvas(fmt) {
    const src = getSourceCanvas();
    const out = document.createElement("canvas");
    out.width = Math.max(16, Number(opts.width) || 1080);
    out.height = Math.max(16, Number(opts.height) || 1080);
    const ctx = out.getContext("2d");

    ctx.imageSmoothingEnabled = opts.resample !== "Vizinho mais próximo";
    ctx.imageSmoothingQuality = opts.resample === "Suave" ? "high" : "medium";

    if (fmt.id === "jpeg" || !opts.hideHiddenLayers === false) {
      ctx.fillStyle = opts.matteColor || "#CEC8B8";
      ctx.fillRect(0, 0, out.width, out.height);
    }

    if (src && src.width > 0 && src.height > 0) {
      ctx.drawImage(src, 0, 0, out.width, out.height);
    }

    return out;
  }

  function buildSvgString() {
    const w = Math.max(16, Number(opts.width) || 1080);
    const h = Math.max(16, Number(opts.height) || 1080);
    const src = getSourceCanvas();
    const dataUrl = src ? src.toDataURL("image/png") : "";
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="100%" height="100%" fill="${opts.matteColor || "#CEC8B8"}" />
  ${dataUrl ? `<image href="${dataUrl}" width="${w}" height="${h}" />` : ""}
</svg>`;
  }

  function triggerExport() {
    const fmt = getActiveFormat();
    const baseName = `robles-studio-${Core.state.activeArea || "projeto"}`;

    if (fmt.id === "robles-json") {
      const payload = {
        exportedAt: new Date().toISOString(),
        format: fmt.id,
        options: { ...opts },
        state: {
          activeArea: Core.state.activeArea,
          activePreset: Core.state.activePreset,
          settings: Core.state.settings,
          measuresByArea: Core.state.measuresByArea,
        },
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: fmt.mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${baseName}.${fmt.ext}`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } else if (fmt.id === "svg") {
      const blob = new Blob([buildSvgString()], { type: fmt.mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${baseName}.${fmt.ext}`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } else {
      const outCanvas = buildExportCanvas(fmt);
      const q = fmt.hasQuality ? Math.min(1, Math.max(0.1, Number(opts.quality) / 100)) : undefined;
      const href = q !== undefined ? outCanvas.toDataURL(fmt.mime, q) : outCanvas.toDataURL(fmt.mime);
      const a = document.createElement("a");
      a.download = `${baseName}.${fmt.ext}`;
      a.href = href;
      a.click();
    }

    Core.recordHistory(Core.state.activeArea, `Exportado (${fmt.label}) · ${Core.getAreaMeta().label}`);
    closeModal();
  }

  function renderModal() {
    if (!modalEl || !isOpen) return;
    const fmt = getActiveFormat();
    const q = searchQuery.trim().toLowerCase();
    const filteredFormats = q
      ? FORMATS.filter((f) => f.label.toLowerCase().includes(q) || f.ext.toLowerCase().includes(q))
      : FORMATS;

    const src = getSourceCanvas();
    const previewUrl = src ? src.toDataURL("image/png") : "";

    modalEl.innerHTML = `
      <div class="rexp-dialog" role="dialog" aria-modal="true" aria-label="Exportar">
        <div class="rexp-head">
          <span class="rexp-title">Exportar · ${fmt.label}</span>
          <button type="button" class="rexp-close" data-close title="Fechar">✕</button>
        </div>

        <div class="rexp-body">
          <div class="rexp-formats-col">
            <input type="search" class="rexp-search" placeholder="Pesquisar formato..." value="${searchQuery.replace(/"/g, "&quot;")}" />
            <div class="rexp-format-list">
              ${filteredFormats
                .map(
                  (f) => `
                <button type="button" class="rexp-fmt-btn ${f.id === fmt.id ? "is-active" : ""}" data-fmt="${f.id}">
                  <span class="rexp-fmt-bar" style="background:${f.color};"></span>
                  <span>${f.label}</span>
                </button>
              `
                )
                .join("")}
            </div>
          </div>

          <div class="rexp-preview-col">
            <div class="rexp-preview-stage">
              ${
                previewUrl
                  ? `<img src="${previewUrl}" alt="Prévia da exportação" />`
                  : `<span class="rexp-preview-empty">Sem prévia</span>`
              }
            </div>
            <div class="rexp-preview-caption">
              <span>${opts.width} × ${opts.height} px</span>
              <span>Est.: ${estimateFileSizeLabel(fmt)}</span>
            </div>
          </div>

          <div class="rexp-inspector-col">
            <div class="rexp-subtabs">
              <button type="button" class="rexp-subtab ${activeSubTab === "params" ? "is-active" : ""}" data-subtab="params">Dimensões</button>
              <button type="button" class="rexp-subtab ${activeSubTab === "advanced" ? "is-active" : ""}" data-subtab="advanced">Avançado</button>
            </div>

            ${
              activeSubTab === "params"
                ? `
              <div class="rexp-group">
                <div class="rexp-row">
                  <label for="rexp-w">Largura</label>
                  <input id="rexp-w" type="number" class="rexp-num" value="${opts.width}" min="16" max="8192" />
                </div>
                <div class="rexp-row">
                  <label for="rexp-h">Altura</label>
                  <input id="rexp-h" type="number" class="rexp-num" value="${opts.height}" min="16" max="8192" />
                </div>
                <div class="rexp-row">
                  <span>Bloquear taxa de proporção</span>
                  <label class="rset-switch">
                    <input type="checkbox" data-opt="lockAspect" ${opts.lockAspect ? "checked" : ""} />
                    <span class="rset-slider"></span>
                  </label>
                </div>
                <div class="rexp-row">
                  <label for="rexp-resample">Reclassificar</label>
                  <select id="rexp-resample" class="rexp-select">
                    <option value="Bilinear" ${opts.resample === "Bilinear" ? "selected" : ""}>Bilinear</option>
                    <option value="Suave" ${opts.resample === "Suave" ? "selected" : ""}>Suave</option>
                    <option value="Vizinho mais próximo" ${opts.resample === "Vizinho mais próximo" ? "selected" : ""}>Vizinho mais próximo</option>
                  </select>
                </div>
                <div class="rexp-row">
                  <label for="rexp-area">Área</label>
                  <select id="rexp-area" class="rexp-select">
                    <option value="Documento inteiro" ${opts.area === "Documento inteiro" ? "selected" : ""}>Documento inteiro</option>
                    <option value="Área ativa" ${opts.area === "Área ativa" ? "selected" : ""}>Área ativa</option>
                  </select>
                </div>
              </div>
            `
                : `
              <div class="rexp-group">
                <div class="rexp-row">
                  <span>Não exportar camadas ocultas</span>
                  <label class="rset-switch">
                    <input type="checkbox" data-opt="hideHiddenLayers" ${opts.hideHiddenLayers ? "checked" : ""} />
                    <span class="rset-slider"></span>
                  </label>
                </div>
                <div class="rexp-row">
                  <span>Incluir sangria</span>
                  <label class="rset-switch">
                    <input type="checkbox" data-opt="includeBleed" ${opts.includeBleed ? "checked" : ""} />
                    <span class="rset-slider"></span>
                  </label>
                </div>
                ${
                  fmt.hasQuality
                    ? `
                  <div class="rexp-row">
                    <label for="rexp-q">Qualidade (${opts.quality}%)</label>
                    <input id="rexp-q" type="range" min="10" max="100" value="${opts.quality}" class="rexp-range" />
                  </div>
                `
                    : ""
                }
              </div>
            `
            }
          </div>
        </div>

        <div class="rexp-foot">
          <button type="button" class="robles-home-btn" data-cancel>Cancelar</button>
          <button type="button" class="robles-home-btn is-primary" data-do-export>Exportar...</button>
        </div>
      </div>
    `;

    modalEl.querySelector("[data-close]")?.addEventListener("click", closeModal);
    modalEl.querySelector("[data-cancel]")?.addEventListener("click", closeModal);
    modalEl.querySelector("[data-do-export]")?.addEventListener("click", triggerExport);

    modalEl.querySelector(".rexp-search")?.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderModal();
      const inp = modalEl.querySelector(".rexp-search");
      if (inp) {
        inp.focus();
        inp.setSelectionRange(inp.value.length, inp.value.length);
      }
    });

    modalEl.querySelectorAll("[data-fmt]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeFormatId = btn.dataset.fmt;
        const chosen = getActiveFormat();
        if (typeof chosen.defaultQuality === "number") opts.quality = chosen.defaultQuality;
        renderModal();
      });
    });

    modalEl.querySelectorAll("[data-subtab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeSubTab = btn.dataset.subtab;
        renderModal();
      });
    });

    const wInp = modalEl.querySelector("#rexp-w");
    const hInp = modalEl.querySelector("#rexp-h");
    wInp?.addEventListener("change", (e) => {
      const nextW = Math.max(16, Number(e.target.value) || 1080);
      if (opts.lockAspect && opts.width > 0) {
        opts.height = Math.max(16, Math.round((nextW / opts.width) * opts.height));
      }
      opts.width = nextW;
      renderModal();
    });

    hInp?.addEventListener("change", (e) => {
      const nextH = Math.max(16, Number(e.target.value) || 1080);
      if (opts.lockAspect && opts.height > 0) {
        opts.width = Math.max(16, Math.round((nextH / opts.height) * opts.width));
      }
      opts.height = nextH;
      renderModal();
    });

    modalEl.querySelector("#rexp-resample")?.addEventListener("change", (e) => {
      opts.resample = e.target.value;
      renderModal();
    });

    modalEl.querySelector("#rexp-area")?.addEventListener("change", (e) => {
      opts.area = e.target.value;
      renderModal();
    });

    modalEl.querySelector("#rexp-q")?.addEventListener("input", (e) => {
      opts.quality = Number(e.target.value) || 90;
      renderModal();
    });

    modalEl.querySelectorAll("[data-opt]").forEach((chk) => {
      chk.addEventListener("change", (e) => {
        opts[e.target.dataset.opt] = e.target.checked;
        renderModal();
      });
    });
  }

  function ensureModal() {
    if (modalEl) return;
    modalEl = document.createElement("div");
    modalEl.id = "robles-export-modal";
    modalEl.className = "rexp-backdrop";
    modalEl.style.display = "none";
    document.body.appendChild(modalEl);
  }

  function openModal() {
    window.RoblesSettings?.close?.();
    window.RoblesImportar?.close?.();
    window.RoblesPresets?.close?.();
    ensureModal();
    syncDimensionsFromCanvas();
    isOpen = true;
    modalEl.style.display = "flex";
    renderModal();
  }

  function closeModal() {
    isOpen = false;
    if (modalEl) modalEl.style.display = "none";
  }

  function toggleModal() {
    if (isOpen) {
      closeModal();
    } else {
      openModal();
    }
  }

  // Intercepta o botão Exportar da barra inferior esquerda
  document.addEventListener(
    "click",
    (e) => {
      const btn = e.target.closest?.('[data-footer="export"]');
      if (!btn) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      toggleModal();
    },
    true
  );

  // Fecha ao clicar fora do painel de Exportar (inclusive no canvas ou outras barras)
  document.addEventListener("click", (e) => {
    if (!isOpen || !modalEl) return;
    const dialog = modalEl.querySelector(".rexp-dialog");
    if (dialog && dialog.contains(e.target)) return;
    if (e.target.closest?.('[data-footer="export"]')) return;
    closeModal();
  });

  document.addEventListener("pointerdown", (e) => {
    if (!isOpen || !modalEl) return;
    const dialog = modalEl.querySelector(".rexp-dialog");
    if (dialog && dialog.contains(e.target)) return;
    if (e.target.closest?.('[data-footer="export"]')) return;
    closeModal();
  });

  window.RoblesExport = { open: openModal, close: closeModal, toggle: toggleModal };
})();