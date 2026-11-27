(() => {
  const Core = window.RoblesCore;
  if (!Core) return;

  const PRESETS_STORAGE_KEY = "robles_context_presets_v2";

  const CONTEXT_PRESETS = {
    "vector:normal": {
      title: "Vetor · Normal",
      items: [
        {
          id: "pre-vec-norm-1",
          category: "Traço & Estilo",
          name: "Traço Fino Editorial",
          meta: "Contorno limpo · Precisão vetorial",
          apply: () => {
            Core.state.activePreset = "Traço Limpo";
            Core.recordHistory("vector", "Preset aplicado · Traço Fino Editorial");
            Core.emit("ui:update");
            Core.emit("render:request");
          },
        },
        {
          id: "pre-vec-norm-2",
          category: "Rótulos",
          name: "Margem Botânica 70×84mm",
          meta: "Proporção de rótulo · Vetor",
          apply: () => {
            Core.recordHistory("vector", "Preset aplicado · Margem Botânica 70×84mm");
            Core.emit("render:request");
          },
        },
      ],
    },

    "vector:typography": {
      title: "Vetor · Tipografia",
      items: [
        {
          id: "pre-vec-typo-1",
          category: "Display",
          name: "Caixa Alta Contraste",
          meta: "Métricas abertas · Glifo",
          apply: () => {
            Core.recordHistory("vector", "Preset tipográfico · Caixa Alta Contraste");
            Core.emit("render:request");
          },
        },
        {
          id: "pre-vec-typo-2",
          category: "Corpo",
          name: "Leitura Compacta",
          meta: "Entrelinha equilibrada · Glifo",
          apply: () => {
            Core.recordHistory("vector", "Preset tipográfico · Leitura Compacta");
            Core.emit("render:request");
          },
        },
      ],
    },

    "vector:layout": {
      title: "Vetor · Layout",
      items: [
        {
          id: "pre-vec-lay-1",
          category: "Embalagens",
          name: "Caixa 73×87×23mm · Base",
          meta: "Estrutura de embalagem · Layout",
          apply: () => {
            Core.recordHistory("vector", "Preset de layout · Caixa 73×87×23mm · Base");
            Core.emit("render:request");
          },
        },
      ],
    },
  };

  function readCustomPresets() {
    try {
      const raw = localStorage.getItem(PRESETS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (_) {
      return {};
    }
  }

  function writeCustomPresets(map) {
    try {
      localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(map));
    } catch (_) {}
  }

  function makeApplyHandler(presetName) {
    return () => {
      Core.recordHistory(Core.state.activeArea, `Preset aplicado · ${presetName}`);
      Core.emit("ui:update");
      Core.emit("render:request");
    };
  }

  function getContextKey() {
    const area = Core.state.activeArea || "vector";
    if (area === "vector") {
      const activeSub =
        document.querySelector(".hud-top-right .tool-btn.is-active")?.dataset?.vecSubmode ||
        "normal";
      return `vector:${activeSub}`;
    }
    return `${area}:default`;
  }

  function getContextBundle() {
    const key = getContextKey();
    const customMap = readCustomPresets();
    const customItems = Array.isArray(customMap[key])
      ? customMap[key].map((item) => ({
          ...item,
          apply: typeof item.apply === "function" ? item.apply : makeApplyHandler(item.name),
        }))
      : [];

    if (CONTEXT_PRESETS[key]) {
      return {
        key,
        title: CONTEXT_PRESETS[key].title,
        items: [...customItems, ...CONTEXT_PRESETS[key].items],
      };
    }

    const meta = Core.getAreaMeta(Core.state.activeArea);
    return {
      key,
      title: `${meta?.label || "Contexto"}`,
      items: [
        ...customItems,
        {
          id: `${key}-base-preset`,
          category: "Padrão",
          name: `Preset Base · ${meta?.label || "Área"}`,
          meta: "Configuração inicial deste contexto",
          apply: makeApplyHandler(`Preset Base · ${meta?.label || "Área"}`),
        },
      ],
    };
  }

  function createPresetEntry(ctxKey, { name, category, meta }) {
    const cleanName = (name || "").trim();
    if (!cleanName) return;

    const map = readCustomPresets();
    if (!Array.isArray(map[ctxKey])) map[ctxKey] = [];

    map[ctxKey].unshift({
      id: `preset-${Date.now().toString(36)}`,
      category: (category || "Personalizados").trim() || "Personalizados",
      name: cleanName,
      meta: (meta || "Preset do contexto").trim() || "Preset do contexto",
      apply: makeApplyHandler(cleanName),
    });

    writeCustomPresets(map);
    renderDrawer();
  }

  let drawerEl = null;
  let isOpen = false;
  let activeCategory = "all";
  let queryText = "";
  let formVisible = false;

  function ensureDrawer() {
    if (drawerEl) return;
    drawerEl = document.createElement("aside");
    drawerEl.id = "robles-presets-drawer";
    drawerEl.className = "rset-wrap rctx-wrap";
    drawerEl.style.display = "none";
    (document.querySelector(".viewport, .studio-shell, body") || document.body).appendChild(drawerEl);
  }

  function renderDrawer() {
    if (!drawerEl || !isOpen) return;
    const bundle = getContextBundle();
    const q = queryText.trim().toLowerCase();

    const categories = Array.from(
      new Set(bundle.items.map((item) => item.category).filter(Boolean))
    );
    const tabs = ["all", ...categories];
    if (!tabs.includes(activeCategory)) activeCategory = "all";

    const visibleItems = bundle.items.filter((item) => {
      const matchCat = q ? true : activeCategory === "all" || item.category === activeCategory;
      const matchQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        (item.meta && item.meta.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });

    drawerEl.innerHTML = `
      <div class="rset-card">
        <div class="rset-header">
          <span class="rset-title">Presets · ${bundle.title}</span>
          <button type="button" class="rset-close" data-close title="Fechar">✕</button>
        </div>

        <div class="rset-search-wrap">
          <input
            type="search"
            class="rset-search"
            placeholder="Pesquisar preset..."
            value="${queryText.replace(/"/g, "&quot;")}"
          />
        </div>

        <div class="rset-sub-tabs" style="justify-content: space-between;">
          <button type="button" class="rset-sub-tab ${formVisible ? "is-active" : ""}" data-toggle-new>
            + Novo preset
          </button>
        </div>

        <div class="rset-group-box" data-new-form style="display: ${formVisible ? "block" : "none"}; padding: 8px; margin-bottom: 8px;">
          <div class="rset-row" style="padding: 4px 0; border: none;">
            <input
              type="text"
              class="rset-input"
              data-preset-name
              placeholder="Nome do preset"
              style="max-width: 100%; width: 100%;"
            />
          </div>
          <div class="rset-row" style="padding: 4px 0; border: none;">
            <input
              type="text"
              class="rset-input"
              data-preset-cat
              placeholder="Categoria"
              value="Personalizados"
              style="max-width: 56%;"
            />
            <button type="button" class="rset-action-btn" data-save-preset>Salvar</button>
          </div>
        </div>

        ${
          !q && tabs.length > 1
            ? `
              <div class="rset-sub-tabs">
                ${tabs
                  .map(
                    (tab) => `
                  <button
                    type="button"
                    class="rset-sub-tab ${activeCategory === tab ? "is-active" : ""}"
                    data-cat-tab="${tab}"
                  >
                    ${tab === "all" ? "Tudo" : tab}
                  </button>
                `
                  )
                  .join("")}
              </div>
            `
            : ""
        }

        <div class="rset-scroll">
          ${
            visibleItems.length === 0
              ? `<div class="rset-empty">Nenhum preset encontrado para este contexto.</div>`
              : `
                <div class="rset-group">
                  <div class="rset-group-title">Presets deste contexto</div>
                  <div class="rset-group-box">
                    ${visibleItems
                      .map(
                        (item, idx) => `
                      <div class="rset-row">
                        <div class="rset-row-text">
                          <div class="rset-row-label">${item.name}</div>
                          <div class="rset-row-note">${item.meta || ""}</div>
                        </div>
                        <button type="button" class="rset-action-btn" data-apply-idx="${idx}">
                          Aplicar
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

    drawerEl.querySelector("[data-close]")?.addEventListener("click", close);

    drawerEl.querySelector(".rset-search")?.addEventListener("input", (e) => {
      queryText = e.target.value;
      renderDrawer();
      const inp = drawerEl.querySelector(".rset-search");
      if (inp) {
        inp.focus();
        inp.setSelectionRange(inp.value.length, inp.value.length);
      }
    });

    drawerEl.querySelector("[data-toggle-new]")?.addEventListener("click", () => {
      formVisible = !formVisible;
      renderDrawer();
      if (formVisible) drawerEl.querySelector("[data-preset-name]")?.focus();
    });

    drawerEl.querySelector("[data-save-preset]")?.addEventListener("click", () => {
      const nameVal = drawerEl.querySelector("[data-preset-name]")?.value || "";
      const catVal = drawerEl.querySelector("[data-preset-cat]")?.value || "Personalizados";
      if (!nameVal.trim()) return;
      formVisible = false;
      createPresetEntry(bundle.key, {
        name: nameVal,
        category: catVal,
        meta: `Contexto: ${bundle.title}`,
      });
    });

    drawerEl.querySelectorAll("[data-cat-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeCategory = btn.dataset.catTab;
        renderDrawer();
      });
    });

    drawerEl.querySelectorAll("[data-apply-idx]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const chosen = visibleItems[Number(btn.dataset.applyIdx)];
        if (typeof chosen?.apply === "function") chosen.apply();
      });
    });
  }

  function open() {
    window.RoblesSettings?.close?.();
    window.RoblesExport?.close?.();
    window.RoblesImportar?.close?.();
    ensureDrawer();
    isOpen = true;
    drawerEl.style.display = "flex";
    renderDrawer();
  }

  function close() {
    isOpen = false;
    formVisible = false;
    if (drawerEl) drawerEl.style.display = "none";
  }

  function toggle() {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }

  // Vincula ao 2º ícone da barra inferior direita (presets por contexto)
  document.addEventListener(
    "click",
    (e) => {
      const bottomRight = e.target.closest?.(".hud-bottom-right, #core-bottom-right-bar");
      if (!bottomRight) return;

      const btn = e.target.closest?.("button, .tool-btn");
      if (!btn) return;

      const actionAttr = (
        btn.dataset.drawer ||
        btn.dataset.action ||
        btn.dataset.footer ||
        ""
      ).toLowerCase();

      if (actionAttr.includes("preset")) {
        e.preventDefault();
        e.stopImmediatePropagation();
        toggle();
        return;
      }

      const buttons = Array.from(bottomRight.querySelectorAll("button, .tool-btn"));
      if (buttons.indexOf(btn) === 1) {
        e.preventDefault();
        e.stopImmediatePropagation();
        toggle();
      } else if (buttons.indexOf(btn) !== 1) {
        close();
      }
    },
    true
  );

  // Fecha ao clicar fora
  document.addEventListener("click", (e) => {
    if (!isOpen || !drawerEl) return;
    if (drawerEl.contains(e.target)) return;
    if (e.target.closest?.(".hud-bottom-right, #core-bottom-right-bar")) return;
    close();
  });

  window.RoblesPresets = {
    open,
    close,
    toggle,
    registerContext: (contextKey, data) => {
      CONTEXT_PRESETS[contextKey] = { ...CONTEXT_PRESETS[contextKey], ...data };
      if (isOpen) renderDrawer();
    },
  };
})();