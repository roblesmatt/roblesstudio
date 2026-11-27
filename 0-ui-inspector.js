(() => {
  const Core = window.RoblesCore;
  if (!Core) return;

  window.RoblesInspectorModules = window.RoblesInspectorModules || {};

  let drawerEl = null;
  let isOpen = false;
  let isRendering = false;
  let ignoreCoreSyncUntil = 0;
  let activeAreaTab = "vector";
  let topMode = "layers"; // "history" | "layers" | "style"

  const AREA_TABS = [
    {
      id: "vector",
      label: "Vetor",
      iconKey: "pen",
      fallbackSvg: `<svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M10 2.5L15.5 11l-3.2 6.5H7.7L4.5 11 10 2.5z"/></svg>`,
    },
    {
      id: "pixel",
      label: "Pixel",
      iconKey: "brush",
      fallbackSvg: `<svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="5.5" height="5.5"/><rect x="11.5" y="3" width="5.5" height="5.5"/><rect x="3" y="11.5" width="5.5" height="5.5"/><rect x="11.5" y="11.5" width="5.5" height="5.5"/></svg>`,
    },
    {
      id: "video",
      label: "Vídeo",
      iconKey: "timeline",
      fallbackSvg: `<svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2.5" y="4" width="15" height="12" rx="2"/><polygon points="8.5,7.2 13,10 8.5,12.8" fill="currentColor" stroke="none"/></svg>`,
    },
    {
      id: "3d",
      label: "3D",
      iconKey: "sub3dParametric",
      fallbackSvg: `<svg viewBox="0 0 20 20" width="15" height="15" fill="none"><polygon points="10 2 17.5 6.2 10 10.4 2.5 6.2" fill="#E6B84C" stroke="#2D2323" stroke-width="1.3"/><polygon points="2.5 6.2 10 10.4 10 18 2.5 13.8" fill="#5B9BD5" stroke="#2D2323" stroke-width="1.3"/><polygon points="17.5 6.2 10 10.4 10 18 17.5 13.8" fill="#63B097" stroke="#2D2323" stroke-width="1.3"/></svg>`,
    },
  ];

  function normalizeSvgClone(el) {
    const clone = el.cloneNode(true);
    clone.removeAttribute("id");
    clone.setAttribute("width", "15");
    clone.setAttribute("height", "15");
    clone.style.width = "15px";
    clone.style.height = "15px";
    clone.style.maxWidth = "15px";
    clone.style.maxHeight = "15px";
    clone.style.pointerEvents = "none";
    return clone.outerHTML;
  }

  function getPersonaIconHtml(tab) {
    const aliases = tab.id === "3d" ? ["3d", "three"] : [tab.id];
    for (const idAlias of aliases) {
      const sourceBtn = document.querySelector(
        `.hud-top-left [data-area="${idAlias}"], .hud-top-left [data-persona="${idAlias}"], [data-area="${idAlias}"], [data-persona="${idAlias}"]`
      );
      const mediaEl = sourceBtn?.querySelector?.("svg, img, canvas");
      if (mediaEl) return normalizeSvgClone(mediaEl);
    }
    if (tab.iconKey && typeof window.RoblesIcons?.get === "function") {
      return window.RoblesIcons.get(tab.iconKey, null, 15, tab.label) || tab.fallbackSvg;
    }
    return tab.fallbackSvg;
  }

  function resolveCurrentArea() {
    const raw = Core.state?.activeArea || Core.state?.area || Core.state?.persona || "vector";
    return raw === "sketch" ? "pixel" : raw;
  }

  function resolveCurrentSubMode() {
    return (
      Core.state?.subMode ||
      Core.state?.subPersona ||
      Core.state?.activeSubMode ||
      document.querySelector(".hud-top-right .is-active, [data-submode].is-active")?.dataset?.submode ||
      "normal"
    );
  }

  function syncAreaWithPages(areaId) {
    if (!areaId) return;
    ignoreCoreSyncUntil = Date.now() + 150;

    if (typeof Core.setArea === "function") {
      Core.setArea(areaId);
    } else if (typeof Core.setPersona === "function") {
      Core.setPersona(areaId);
    } else if (Core.state) {
      Core.state.activeArea = areaId;
      Core.state.area = areaId;
    }

    document
      .querySelectorAll(".hud-top-left .tool-btn, [data-area], [data-persona]")
      .forEach((btn) => {
        const target = btn.dataset.area || btn.dataset.persona || btn.dataset.mode || "";
        if (!target) return;
        btn.classList.toggle("is-active", target === areaId);
      });

    Core.emit?.("area:change", { area: areaId });
  }

  function ensureDrawer() {
    if (drawerEl) return;
    drawerEl = document.createElement("aside");
    drawerEl.id = "robles-inspector-drawer";
    drawerEl.className = "rctx-wrap history-popover-wrap";
    drawerEl.style.display = "none";
    drawerEl.style.pointerEvents = "auto";
    (document.querySelector(".viewport, .studio-shell, body") || document.body).appendChild(drawerEl);
  }

  function resolveActiveModule() {
    const mods = window.RoblesInspectorModules || {};
    if (topMode === "history") return mods.history || mods.layers || null;
    if (topMode === "layers") return mods.layers || mods.history || null;
    if (topMode === "style") return mods.style || null;
    return mods.layers || mods.history || null;
  }

  function renderDrawer() {
    if (!drawerEl || !isOpen || isRendering) return;
    isRendering = true;

    try {
      if (topMode !== "history" && topMode !== "layers" && topMode !== "style") {
        topMode = "layers";
      }

      const mod = resolveActiveModule();
      const ctx = {
        areaId: activeAreaTab,
        filterArea: activeAreaTab,
        currentArea: activeAreaTab,
        subMode: resolveCurrentSubMode(),
      };

      const header =
        (typeof mod?.getHeader === "function" ? mod.getHeader(ctx) : null) || {
          title:
            topMode === "history"
              ? "Histórico"
              : topMode === "style"
              ? "Estilo"
              : "Camadas",
          counter: "",
        };

      const bodyRows =
        typeof mod?.render === "function"
          ? mod.render(ctx)
          : `<div class="history-step-row"><span>Módulo não carregado</span></div>`;

      // Ordem exata: 1. Histórico | 2. Camadas | 3. Estilo
      drawerEl.innerHTML = `
        <div class="history-top-toggles">
          <button type="button" class="history-toggle-pill ${topMode === "history" ? "is-active" : ""}" data-top-mode="history" title="Histórico">✎</button>
          <button type="button" class="history-toggle-pill ${topMode === "layers" ? "is-active" : ""}" data-top-mode="layers" title="Camadas">☰</button>
          <button type="button" class="history-toggle-pill ${topMode === "style" ? "is-active" : ""}" data-top-mode="style" title="Estilo">◈</button>
        </div>

        <div class="history-card">
          <div class="history-tabs-bar" style="display:flex;flex-wrap:nowrap;align-items:center;">
            ${AREA_TABS.map(
              (tab) => `
              <button
                type="button"
                class="history-tab-btn ${activeAreaTab === tab.id ? "is-active" : ""}"
                data-area-tab="${tab.id}"
                title="${tab.label}"
                style="flex:1;min-width:0;"
              >
                <span style="display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;pointer-events:none;">${getPersonaIconHtml(tab)}</span>
              </button>
            `
            ).join("")}
          </div>

          <div class="history-card-header">
            <span class="history-card-title">${header.title}</span>
            <span class="history-card-counter">
              <span>${header.counter}</span>
              <button type="button" class="hud-panel-close" data-close title="Fechar">✕</button>
            </span>
          </div>

          <div class="history-tree-list">
            ${bodyRows}
          </div>
        </div>
      `;

      drawerEl.querySelector("[data-close]")?.addEventListener("click", (e) => {
        e.stopPropagation();
        close();
      });

      drawerEl.querySelectorAll("[data-top-mode]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const nextMode = btn.dataset.topMode;
          if (nextMode === "history" || nextMode === "layers" || nextMode === "style") {
            topMode = nextMode;
            renderDrawer();
          }
        });
      });

      drawerEl.querySelectorAll("[data-area-tab]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const nextTab = btn.dataset.areaTab;
          if (!nextTab) return;
          activeAreaTab = nextTab;
          syncAreaWithPages(nextTab);
          renderDrawer();
        });
      });

      const listEl = drawerEl.querySelector(".history-tree-list");
      if (listEl && typeof mod?.bindEvents === "function") {
        mod.bindEvents(listEl, renderDrawer, ctx);
      }
    } finally {
      isRendering = false;
    }
  }

  function open(mode = "layers") {
    window.RoblesSettings?.close?.();
    window.RoblesExport?.close?.();
    window.RoblesImportar?.close?.();
    window.RoblesPresets?.close?.();
    ensureDrawer();

    const current = resolveCurrentArea();
    activeAreaTab = AREA_TABS.some((t) => t.id === current) ? current : "vector";

    if (mode === "history" || mode === "layers" || mode === "style") {
      topMode = mode;
    } else {
      topMode = "layers";
    }

    isOpen = true;
    drawerEl.style.display = "flex";
    renderDrawer();
  }

  function close() {
    isOpen = false;
    if (drawerEl) drawerEl.style.display = "none";
  }

  function toggle(mode = "layers") {
    const normalizedMode =
      mode === "history" || mode === "layers" || mode === "style" ? mode : "layers";
    if (isOpen && topMode === normalizedMode) {
      close();
    } else {
      open(normalizedMode);
    }
  }

  ["area:change", "persona:change", "submode:change", "subpersona:change", "style:change"].forEach(
    (evtName) => {
      Core.on?.(evtName, () => {
        if (!isOpen || isRendering || Date.now() < ignoreCoreSyncUntil) return;
        const current = resolveCurrentArea();
        if (current && AREA_TABS.some((t) => t.id === current)) {
          activeAreaTab = current;
        }
        renderDrawer();
      });
    }
  );

  // Ordem nos botões inferiores direitos: 0 = Histórico, 1 = Camadas, 2 = Estilo
  document.addEventListener(
    "click",
    (e) => {
      const bottomRight = e.target.closest?.(".hud-bottom-right, #core-bottom-right-bar");
      if (!bottomRight) return;

      const btn = e.target.closest?.("button, .tool-btn");
      if (!btn) return;

      const actionAttr = (btn.dataset.drawer || btn.dataset.action || btn.dataset.footer || "").toLowerCase();

      if (actionAttr.includes("history") || actionAttr.includes("histor")) {
        e.preventDefault();
        e.stopImmediatePropagation();
        toggle("history");
        return;
      }
      if (actionAttr.includes("layer") || actionAttr.includes("camad")) {
        e.preventDefault();
        e.stopImmediatePropagation();
        toggle("layers");
        return;
      }
      if (actionAttr.includes("style") || actionAttr.includes("estilo")) {
        e.preventDefault();
        e.stopImmediatePropagation();
        toggle("style");
        return;
      }

      const buttons = Array.from(bottomRight.querySelectorAll("button, .tool-btn"));
      const idx = buttons.indexOf(btn);
      if (idx === 0) {
        e.preventDefault();
        e.stopImmediatePropagation();
        toggle("history");
      } else if (idx === 1) {
        e.preventDefault();
        e.stopImmediatePropagation();
        toggle("layers");
      } else if (idx === 2) {
        e.preventDefault();
        e.stopImmediatePropagation();
        toggle("style");
      }
    },
    true
  );

  document.addEventListener("click", (e) => {
    if (!isOpen || !drawerEl) return;
    if (drawerEl.contains(e.target)) return;
    if (e.target.closest?.(".hud-bottom-right, #core-bottom-right-bar")) return;
    close();
  });

  window.RoblesInspector = {
    open,
    openHistory: () => open("history"),
    openLayers: () => open("layers"),
    openStyle: () => open("style"),
    close,
    toggle,
  };
})();