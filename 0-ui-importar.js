(() => {
  const Core = window.RoblesCore;
  if (!Core) return;

  const LAYOUTS_STORAGE_KEY = "robles_import_layouts_v1";

  const CONTEXT_LAYOUTS = {
    "vector:normal": {
      title: "Vetor · Normal",
      items: [
        {
          id: "lay-vec-card",
          category: "Rótulos",
          name: "Layout Rótulo 70×84mm",
          meta: "Margem de segurança + Base · Vetor",
          insert: () => {
            Core.recordHistory("vector", "Layout importado inserido · Layout Rótulo 70×84mm");
            Core.emit("render:request");
          },
        },
        {
          id: "lay-vec-card-1080",
          category: "Social",
          name: "Grade Editorial 1080×1080",
          meta: "Moldura central + Respiro · Vetor",
          insert: () => {
            Core.recordHistory("vector", "Layout importado inserido · Grade Editorial 1080×1080");
            Core.emit("render:request");
          },
        },
      ],
    },

    "vector:typography": {
      title: "Vetor · Tipografia",
      items: [
        {
          id: "lay-typo-specimen",
          category: "Espécime",
          name: "Folha de Métricas & Baseline",
          meta: "Cap Height, X-Height e Descender",
          insert: () => {
            Core.recordHistory("vector", "Layout importado inserido · Folha de Métricas & Baseline");
            Core.emit("render:request");
          },
        },
      ],
    },

    "vector:layout": {
      title: "Vetor · Layout",
      items: [
        {
          id: "lay-pack-dieline",
          category: "Embalagens",
          name: "Dieline 73×87×23mm",
          meta: "Aba, vinco e sangria · Vetor",
          insert: () => {
            Core.recordHistory("vector", "Layout importado inserido · Dieline 73×87×23mm");
            Core.emit("render:request");
          },
        },
        {
          id: "lay-editorial-spread",
          category: "Páginas",
          name: "Página Dupla com Colunas",
          meta: "2 colunas + Margem externa",
          insert: () => {
            Core.recordHistory("vector", "Layout importado inserido · Página Dupla com Colunas");
            Core.emit("render:request");
          },
        },
      ],
    },
  };

  function readSavedLayouts() {
    try {
      const raw = localStorage.getItem(LAYOUTS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (_) {
      return {};
    }
  }

  function writeSavedLayouts(map) {
    try {
      localStorage.setItem(LAYOUTS_STORAGE_KEY, JSON.stringify(map));
    } catch (_) {}
  }

  function makeInsertHandler(layoutName) {
    return () => {
      Core.recordHistory(Core.state.activeArea, `Layout inserido · ${layoutName}`);
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
    const savedMap = readSavedLayouts();
    const userItems = Array.isArray(savedMap[key])
      ? savedMap[key].map((item) => ({
          ...item,
          insert: typeof item.insert === "function" ? item.insert : makeInsertHandler(item.name),
        }))
      : [];

    if (CONTEXT_LAYOUTS[key]) {
      return {
        key,
        title: CONTEXT_LAYOUTS[key].title,
        items: [...userItems, ...CONTEXT_LAYOUTS[key].items],
      };
    }

    const meta = Core.getAreaMeta(Core.state.activeArea);
    return {
      key,
      title: `${meta?.label || "Contexto"}`,
      items: [
        ...userItems,
        {
          id: `${key}-default-layout`,
          category: "Base",
          name: `Layout Base · ${meta?.label || "Área"}`,
          meta: "Estrutura inicial do contexto",
          insert: makeInsertHandler(`Layout Base · ${meta?.label || "Área"}`),
        },
      ],
    };
  }

  function createLayoutEntry(ctxKey, { name, category, meta }) {
    const cleanName = (name || "").trim();
    if (!cleanName) return;

    const map = readSavedLayouts();
    if (!Array.isArray(map[ctxKey])) map[ctxKey] = [];

    map[ctxKey].unshift({
      id: `layout-${Date.now().toString(36)}`,
      category: (category || "Importados").trim() || "Importados",
      name: cleanName,
      meta: (meta || "Layout salvo").trim() || "Layout salvo",
      insert: makeInsertHandler(cleanName),
    });

    writeSavedLayouts(map);
    renderDrawer();
  }

  function importLayoutsFromFile(ctxKey, file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || "[]"));
        const list = Array.isArray(parsed)
          ? parsed
          : Array.isArray(parsed.layouts)
            ? parsed.layouts
            : Array.isArray(parsed.presets)
              ? parsed.presets
              : [];
        if (list.length === 0) return;

        const map = readSavedLayouts();
        if (!Array.isArray(map[ctxKey])) map[ctxKey] = [];

        list.forEach((entry, idx) => {
          const name = (entry.name || entry.title || `Layout ${idx + 1}`).trim();
          map[ctxKey].unshift({
            id: `imp-lay-${Date.now().toString(36)}-${idx}`,
            category: (entry.category || "Importados").trim() || "Importados",
            name,
            meta: (entry.meta || entry.desc || "Importado via JSON").trim(),
            insert: makeInsertHandler(name),
          });
        });

        writeSavedLayouts(map);
        renderDrawer();
      } catch (_) {}
    };
    reader.readAsText(file);
  }

  let drawerEl = null;
  let isOpen = false;
  let activeCategory = "all";
  let queryText = "";
  let formVisible = false;

  function ensureDrawer() {
    if (drawerEl) return;
    drawerEl = document.createElement("aside");
    drawerEl.id = "robles-importar-drawer";
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
          <span class="rset-title">Layouts · ${bundle.title}</span>
          <button type="button" class="rset-close" data-close title="Fechar">✕</button>
        </div>

        <div class="rset-search-wrap">
          <input
            type="search"
            class="rset-search"
            placeholder="Pesquisar layout..."
            value="${queryText.replace(/"/g, "&quot;")}"
          />
        </div>

        <div class="rset-sub-tabs" style="justify-content: space-between;">
          <button type="button" class="rset-sub-tab ${formVisible ? "is-active" : ""}" data-toggle-new>
            + Novo layout
          </button>
          <label class="rset-sub-tab" style="cursor: pointer;">
            Importar .json
            <input type="file" accept=".json" data-file-input style="display: none;" />
          </label>
        </div>

        <div class="rset-group-box" data-new-form style="display: ${formVisible ? "block" : "none"}; padding: 8px; margin-bottom: 8px;">
          <div class="rset-row" style="padding: 4px 0; border: none;">
            <input
              type="text"
              class="rset-input"
              data-layout-name
              placeholder="Nome do layout"
              style="max-width: 100%; width: 100%;"
            />
          </div>
          <div class="rset-row" style="padding: 4px 0; border: none;">
            <input
              type="text"
              class="rset-input"
              data-layout-cat
              placeholder="Categoria"
              value="Importados"
              style="max-width: 56%;"
            />
            <button type="button" class="rset-action-btn" data-save-layout>Salvar</button>
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
              ? `<div class="rset-empty">Nenhum layout encontrado para este contexto.</div>`
              : `
                <div class="rset-group">
                  <div class="rset-group-title">Layouts prontos para inserir</div>
                  <div class="rset-group-box">
                    ${visibleItems
                      .map(
                        (item, idx) => `
                      <div class="rset-row">
                        <div class="rset-row-text">
                          <div class="rset-row-label">${item.name}</div>
                          <div class="rset-row-note">${item.meta || ""}</div>
                        </div>
                        <button type="button" class="rset-action-btn" data-insert-idx="${idx}">
                          Inserir
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
      if (formVisible) drawerEl.querySelector("[data-layout-name]")?.focus();
    });

    drawerEl.querySelector("[data-save-layout]")?.addEventListener("click", () => {
      const nameVal = drawerEl.querySelector("[data-layout-name]")?.value || "";
      const catVal = drawerEl.querySelector("[data-layout-cat]")?.value || "Importados";
      if (!nameVal.trim()) return;
      formVisible = false;
      createLayoutEntry(bundle.key, {
        name: nameVal,
        category: catVal,
        meta: `Contexto: ${bundle.title}`,
      });
    });

    drawerEl.querySelector("[data-file-input]")?.addEventListener("change", (e) => {
      const file = e.target.files?.[0];
      if (file) importLayoutsFromFile(bundle.key, file);
    });

    drawerEl.querySelectorAll("[data-cat-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeCategory = btn.dataset.catTab;
        renderDrawer();
      });
    });

    drawerEl.querySelectorAll("[data-insert-idx]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const chosen = visibleItems[Number(btn.dataset.insertIdx)];
        if (typeof chosen?.insert === "function") chosen.insert();
      });
    });
  }

  function open() {
    window.RoblesSettings?.close?.();
    window.RoblesExport?.close?.();
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

  // Vincula ao 1º ícone da barra inferior direita (layouts de importação por contexto)
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

      if (actionAttr.includes("import") || actionAttr.includes("preset") || actionAttr === "layers") {
        e.preventDefault();
        e.stopImmediatePropagation();
        toggle();
        return;
      }

      const buttons = Array.from(bottomRight.querySelectorAll("button, .tool-btn"));
      if (buttons.indexOf(btn) === 0) {
        e.preventDefault();
        e.stopImmediatePropagation();
        toggle();
      } else if (buttons.indexOf(btn) >= 1) {
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

  window.RoblesImportar = {
    open,
    close,
    toggle,
    registerContext: (contextKey, data) => {
      CONTEXT_LAYOUTS[contextKey] = { ...CONTEXT_LAYOUTS[contextKey], ...data };
      if (isOpen) renderDrawer();
    },
  };
})();