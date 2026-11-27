(() => {
  const Core = window.RoblesCore;
  if (!Core) return;

  // Catálogo individual por contexto: "area:submode"
  const CONTEXT_DATA = {
    "vector:normal": {
      title: "Vetor · Normal",
      presets: [
        {
          id: "vec-norm-card",
          category: "Rótulos & Cards",
          name: "Card Botânico 1080",
          meta: "Moldura + Título · Prancheta",
          action: () => {
            Core.recordHistory("vector", "Preset inserido: Card Botânico 1080");
            Core.emit("render:request");
          },
        },
        {
          id: "vec-norm-badge",
          category: "Selos",
          name: "Selo Central com Margem",
          meta: "Base geométrica · Vetor",
          action: () => {
            Core.recordHistory("vector", "Preset inserido: Selo Central com Margem");
            Core.emit("render:request");
          },
        },
      ],
      extras: [
        {
          id: "vec-norm-align-center",
          group: "Portas & Utilitários",
          name: "Centralizar na Prancheta",
          desc: "Alinha seleção ao centro da prancheta ativa",
          action: () => Core.dispatchCommand("snap"),
        },
        {
          id: "vec-norm-to-3d",
          group: "Portas & Utilitários",
          name: "Enviar Seleção para 3D",
          desc: "Gera extrusão paramétrica a partir do vetor",
          action: () => {
            if (Core.state.selectedLayerId) Core.convertNode(Core.state.selectedLayerId, "3d");
          },
        },
      ],
    },

    "vector:typography": {
      title: "Vetor · Tipografia",
      presets: [
        {
          id: "vec-typo-display",
          category: "Métricas",
          name: "Caixa Alta Display",
          meta: "Cap Height + Baseline · Glifo",
          action: () => {
            Core.recordHistory("vector", "Preset tipográfico: Caixa Alta Display");
            Core.emit("render:request");
          },
        },
        {
          id: "vec-typo-serif",
          category: "Métricas",
          name: "Haste Serifada Editorial",
          meta: "Proporção clássica · Glifo",
          action: () => {
            Core.recordHistory("vector", "Preset tipográfico: Haste Serifada Editorial");
            Core.emit("render:request");
          },
        },
      ],
      extras: [
        {
          id: "vec-typo-guides",
          group: "Guias & Glifos",
          name: "Alternar Barra de Palavra",
          desc: "Exibe ou oculta a faixa de teste tipográfico",
          action: () => Core.recordHistory("vector", "Barra de palavra alternada"),
        },
      ],
    },

    "vector:layout": {
      title: "Vetor · Layout",
      presets: [
        {
          id: "vec-lay-2col",
          category: "Páginas",
          name: "Editorial 2 Colunas",
          meta: "Cabeçalho + Bloco de Imagem",
          action: () => {
            Core.recordHistory("vector", "Preset de layout: Editorial 2 Colunas");
            Core.emit("render:request");
          },
        },
        {
          id: "vec-lay-pack",
          category: "Embalagens",
          name: "Folha Rótulo & Dieline",
          meta: "Margem de corte e sangria",
          action: () => {
            Core.recordHistory("vector", "Preset de layout: Folha Rótulo & Dieline");
            Core.emit("render:request");
          },
        },
      ],
      extras: [
        {
          id: "vec-lay-bleed",
          group: "Impressão & Grade",
          name: "Inspecionar Sangria (Bleed)",
          desc: "Verifica limites de margem e corte da página",
          action: () => Core.recordHistory("vector", "Inspeção de sangria executada"),
        },
      ],
    },
  };

  function getContextKey() {
    const area = Core.state.activeArea || "vector";
    if (area === "vector") {
      // Tenta obter submodo atual caso exposto ou usa fallback normal
      const activeSub = document.querySelector(".hud-top-right .tool-btn.is-active")?.dataset?.vecSubmode || "normal";
      return `vector:${activeSub}`;
    }
    return `${area}:default`;
  }

  function getContextData() {
    const key = getContextKey();
    if (CONTEXT_DATA[key]) return { key, ...CONTEXT_DATA[key] };
    const meta = Core.getAreaMeta(Core.state.activeArea);
    return {
      key,
      title: `${meta?.label || "Contexto"} · Local`,
      presets: [
        {
          id: `${key}-base-preset`,
          category: "Padrão",
          name: `Layout Base · ${meta?.label || "Área"}`,
          meta: "Estrutura inicial da área ativa",
          action: () => {
            Core.recordHistory(Core.state.activeArea, `Preset aplicado · ${meta?.label || "Área"}`);
            Core.emit("render:request");
          },
        },
      ],
      extras: [
        {
          id: `${key}-base-extra`,
          group: "Ferramentas Avulsas",
          name: "Centralizar Vista",
          desc: "Ajusta o enquadramento atual",
          action: () => Core.view?.resetView?.(),
        },
      ],
    };
  }

  let panelEl = null;
  let activeMode = null; // "presets" | "extras"
  let activeSubTab = "all";
  let searchQuery = "";

  function ensurePanel() {
    if (panelEl) return;
    panelEl = document.createElement("aside");
    panelEl.id = "robles-context-drawer";
    panelEl.className = "rset-wrap rctx-wrap";
    panelEl.style.display = "none";
    (document.querySelector(".viewport, .studio-shell, body") || document.body).appendChild(panelEl);
  }

  function renderPanel() {
    if (!panelEl || !activeMode) return;
    const ctx = getContextData();
    const q = searchQuery.trim().toLowerCase();

    const isPresets = activeMode === "presets";
    const sourceList = isPresets ? ctx.presets : ctx.extras;
    const subCategories = Array.from(
      new Set(sourceList.map((item) => (isPresets ? item.category : item.group)).filter(Boolean))
    );
    const tabs = ["all", ...subCategories];
    if (!tabs.includes(activeSubTab)) activeSubTab = "all";

    const filtered = sourceList.filter((item) => {
      const cat = isPresets ? item.category : item.group;
      const matchTab = q ? true : activeSubTab === "all" || cat === activeSubTab;
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        (item.meta && item.meta.toLowerCase().includes(q)) ||
        (item.desc && item.desc.toLowerCase().includes(q));
      return matchTab && matchSearch;
    });

    panelEl.innerHTML = `
      <div class="rset-card">
        <div class="rset-top-tabs" style="grid-template-columns: repeat(2, 1fr);">
          <button type="button" class="rset-main-tab ${isPresets ? "is-active" : ""}" data-ctx-mode="presets">Presets</button>
          <button type="button" class="rset-main-tab ${!isPresets ? "is-active" : ""}" data-ctx-mode="extras">Ferramentas Avulsas</button>
        </div>

        <div class="rset-header">
          <span class="rset-title">${isPresets ? "Presets" : "Ferramentas Avulsas"} · ${ctx.title}</span>
          <button type="button" class="rset-close" data-close title="Fechar">✕</button>
        </div>

        <div class="rset-search-wrap">
          <input type="search" class="rset-search" placeholder="${isPresets ? "Pesquisar preset..." : "Pesquisar ferramenta..."}" value="${searchQuery.replace(/"/g, "&quot;")}" />
        </div>

        ${
          !q && tabs.length > 1
            ? `<div class="rset-sub-tabs">
                ${tabs
                  .map(
                    (t) => `
                  <button type="button" class="rset-sub-tab ${activeSubTab === t ? "is-active" : ""}" data-ctx-sub="${t}">
                    ${t === "all" ? "Tudo" : t}
                  </button>
                `
                  )
                  .join("")}
              </div>`
            : ""
        }

        <div class="rset-scroll">
          ${
            filtered.length === 0
              ? `<div class="rset-empty">Nada encontrado neste contexto.</div>`
              : `
                <div class="rset-group">
                  <div class="rset-group-title">${isPresets ? "Inserir na área de trabalho" : "Ações e portas deste contexto"}</div>
                  <div class="rset-group-box">
                    ${filtered
                      .map(
                        (item, i) => `
                      <div class="rset-row">
                        <div class="rset-row-text">
                          <div class="rset-row-label">${item.name}</div>
                          <div class="rset-row-note">${isPresets ? item.meta || "" : item.desc || ""}</div>
                        </div>
                        <button type="button" class="rset-action-btn" data-run-ctx="${i}">
                          ${isPresets ? "Inserir" : "Abrir"}
                        </button>
                      </div>
                    `
                      )
                      .join("")}
                  </div>
                </div>
              `
          }
        </div>
      </div>
    `;

    panelEl.querySelector("[data-close]")?.addEventListener("click", close);

    panelEl.querySelector(".rset-search")?.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderPanel();
      const inp = panelEl.querySelector(".rset-search");
      if (inp) {
        inp.focus();
        inp.setSelectionRange(inp.value.length, inp.value.length);
      }
    });

    panelEl.querySelectorAll("[data-ctx-mode]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeMode = btn.dataset.ctxMode;
        activeSubTab = "all";
        renderPanel();
      });
    });

    panelEl.querySelectorAll("[data-ctx-sub]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeSubTab = btn.dataset.ctxSub;
        renderPanel();
      });
    });

    panelEl.querySelectorAll("[data-run-ctx]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = filtered[Number(btn.dataset.runCtx)];
        if (typeof item?.action === "function") item.action();
      });
    });
  }

  function openMode(mode) {
    window.RoblesSettings?.close?.();
    window.RoblesExport?.close?.();
    ensurePanel();

    if (activeMode === mode && panelEl.style.display !== "none") {
      close();
      return;
    }

    activeMode = mode;
    activeSubTab = "all";
    panelEl.style.display = "flex";
    renderPanel();
  }

  function close() {
    activeMode = null;
    if (panelEl) panelEl.style.display = "none";
  }

  // Vincula aos dois primeiros ícones da barra inferior direita (camadas/presets e medidas/avulsas)
  document.addEventListener(
    "click",
    (e) => {
      const bottomRight = e.target.closest?.(".hud-bottom-right, #core-bottom-right-bar");
      if (!bottomRight) return;

      const btn = e.target.closest?.("button, .tool-btn");
      if (!btn) return;

      const actionAttr = (btn.dataset.drawer || btn.dataset.action || btn.dataset.footer || "").toLowerCase();
      if (actionAttr.includes("preset") || actionAttr.includes("layer") || actionAttr === "layers") {
        e.preventDefault();
        e.stopImmediatePropagation();
        openMode("presets");
        return;
      }

      if (actionAttr.includes("extra") || actionAttr.includes("tool") || actionAttr.includes("measure") || actionAttr === "measures") {
        e.preventDefault();
        e.stopImmediatePropagation();
        openMode("extras");
        return;
      }

      // Fallback pela posição: 1º botão = presets, 2º botão = ferramentas avulsas, 3º = histórico global
      const buttons = Array.from(bottomRight.querySelectorAll("button, .tool-btn"));
      const idx = buttons.indexOf(btn);
      if (idx === 0) {
        e.preventDefault();
        e.stopImmediatePropagation();
        openMode("presets");
      } else if (idx === 1) {
        e.preventDefault();
        e.stopImmediatePropagation();
        openMode("extras");
      } else if (idx >= 2) {
        close();
      }
    },
    true
  );

  // Fecha ao clicar fora
  document.addEventListener("click", (e) => {
    if (!panelEl || panelEl.style.display === "none") return;
    if (panelEl.contains(e.target)) return;
    if (e.target.closest?.(".hud-bottom-right, #core-bottom-right-bar")) return;
    close();
  });

  window.RoblesContextPanels = {
    openPresets: () => openMode("presets"),
    openExtras: () => openMode("extras"),
    close,
    registerContext: (contextKey, data) => {
      CONTEXT_DATA[contextKey] = { ...CONTEXT_DATA[contextKey], ...data };
      if (panelEl && panelEl.style.display !== "none") renderPanel();
    },
  };
})();