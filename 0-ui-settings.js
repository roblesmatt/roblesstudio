(() => {
  const Core = window.RoblesCore;
  if (!Core) return;

  const PREFS_KEY = "robles_studio_prefs_v1";

  const defaultPrefs = {
    reopenLastDoc: false,
    limitInitialZoom100: false,
    hideFileExtension: true,
    autoUpdateLinkedAssets: true,
    saveThumbnailsWithDocs: true,
    enablePsdSaveWarning: false,
    normalizePlainTextBreaks: true,
    smartCutPaste: true,
    pasteFillerAsText: true,
    importPsdTextAsEditable: false,
    hapticFeedback: true,
    copyItemsAsSvg: true,
    showTooltips: true,
    compactMobileBars: true,
    stylusPriority: true,
    defaultUnit: "mm",
    defaultCanvasScale: 100,
    scriptsEnabled: true,
  };

  function loadPrefs() {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      return { ...defaultPrefs, ...(raw ? JSON.parse(raw) : {}) };
    } catch (_) {
      return { ...defaultPrefs };
    }
  }

  let prefs = loadPrefs();
  let panelEl = null;
  let activeMainTab = "general";
  let activeSubTab = "documento";
  let searchQuery = "";

  function savePrefs() {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch (_) {}
    Core.emit("ui:update");
    Core.emit("render:request");
  }

  const SECTIONS = [
    {
      mainTab: "general",
      mainLabel: "Geral",
      subTabs: [
        {
          id: "documento",
          label: "Documento",
          groups: [
            {
              title: "Documento",
              items: [
                { type: "toggle", key: "reopenLastDoc", label: "Reabrir documento(s) na inicialização" },
                { type: "toggle", key: "limitInitialZoom100", label: "Limitar zoom inicial a um máximo de 100%" },
                { type: "toggle", key: "hideFileExtension", label: "Ocultar extensão do arquivo" },
                { type: "toggle", key: "autoUpdateLinkedAssets", label: "Atualizar automaticamente recursos vinculados quando modificados externamente" },
                { type: "toggle", key: "saveThumbnailsWithDocs", label: "Salvar miniaturas com documentos" },
                {
                  type: "toggle",
                  key: "enablePsdSaveWarning",
                  label: 'Habilitar "Salvar" para arquivos PSD importados',
                  note: "Aviso: esta opção é recomendada apenas para usuários que queiram usar PSD como um formato de intercâmbio com aplicativos DAM. A incompatibilidade entre formatos externos e nativos pode fazer com que certos recursos sejam rasterizados ou perdidos.",
                },
              ],
            },
          ],
        },
        {
          id: "texto",
          label: "Texto",
          groups: [
            {
              title: "Texto",
              items: [
                { type: "toggle", key: "normalizePlainTextBreaks", label: "Normalizar quebras na cópia de texto simples" },
                { type: "toggle", key: "smartCutPaste", label: "Recortar e colar inteligente" },
                { type: "toggle", key: "pasteFillerAsText", label: "Inserir texto de preenchimento como texto" },
                { type: "toggle", key: "importPsdTextAsEditable", label: "Importar texto PSD como texto ao invés de bitmap" },
              ],
            },
          ],
        },
        {
          id: "diversos",
          label: "Diversos",
          groups: [
            {
              title: "Feedback tátil",
              items: [
                { type: "toggle", key: "hapticFeedback", label: "Ativar feedback tátil" },
              ],
            },
            {
              title: "Diversos",
              items: [
                { type: "toggle", key: "copyItemsAsSvg", label: "Copiar itens como SVG" },
              ],
            },
          ],
        },
      ],
    },
    {
      mainTab: "canvas",
      mainLabel: "Canvas",
      subTabs: [
        {
          id: "grade-snap",
          label: "Grade & Snap",
          groups: [
            {
              title: "Grade e Ajuste",
              items: [
                { type: "coreToggle", path: "settings.showGrid", label: "Exibir grade e eixos no viewport" },
                { type: "coreToggle", path: "settings.snapEnabled", label: "Ativar ajuste magnético (Snap)" },
                { type: "coreToggle", path: "settings.liveSync2Dto3D", label: "Sincronia Viva 2D ↔ 3D" },
              ],
            },
            {
              title: "Unidade e Escala",
              items: [
                {
                  type: "select",
                  key: "defaultUnit",
                  label: "Unidade padrão de medidas",
                  options: [
                    { value: "mm", label: "Milímetros (mm)" },
                    { value: "px", label: "Pixels (px)" },
                    { value: "cm", label: "Centímetros (cm)" },
                    { value: "u", label: "Unidades 3D (u)" },
                  ],
                },
                {
                  type: "number",
                  key: "defaultCanvasScale",
                  label: "Escala base de exportação (%)",
                  min: 25,
                  max: 400,
                },
              ],
            },
          ],
        },
        {
          id: "vista-camera",
          label: "Vista & Câmera",
          groups: [
            {
              title: "Navegação na Cena",
              items: [
                {
                  type: "button",
                  label: "Centralizar vista da câmera (Ctrl+0)",
                  actionLabel: "Centralizar",
                  onClick: () => Core.view?.resetView?.(),
                },
                {
                  type: "button",
                  label: "Redesenhar todas as camadas e caches",
                  actionLabel: "Atualizar",
                  onClick: () => Core.invalidateAll?.(),
                },
              ],
            },
          ],
        },
      ],
    },
    {
      mainTab: "ui",
      mainLabel: "Interface",
      subTabs: [
        {
          id: "hud-dicas",
          label: "HUD & Dicas",
          groups: [
            {
              title: "Interface do Usuário",
              items: [
                { type: "toggle", key: "showTooltips", label: "Exibir cartões de ajuda ao passar o cursor" },
                { type: "toggle", key: "compactMobileBars", label: "Barras compactas em telas estreitas / mobile" },
              ],
            },
          ],
        },
        {
          id: "toque-caneta",
          label: "Caneta & Toque",
          groups: [
            {
              title: "Entrada Tátil e Stylus",
              items: [
                { type: "toggle", key: "stylusPriority", label: "Priorizar traço preciso para caneta/stylus" },
              ],
            },
          ],
        },
      ],
    },
    {
      mainTab: "system",
      mainLabel: "Sistema",
      subTabs: [
        {
          id: "scripts-atalhos",
          label: "Scripts & Atalhos",
          groups: [
            {
              title: "Scripts e Automação",
              items: [
                { type: "toggle", key: "scriptsEnabled", label: "Permitir execução de scripts e ações modulares" },
              ],
            },
            {
              title: "Atalhos Principais",
              items: [
                { type: "info", label: "Desfazer / Refazer", value: "Ctrl+Z / Ctrl+Y" },
                { type: "info", label: "Copiar / Colar / Duplicar", value: "Ctrl+C / Ctrl+V / Ctrl+D" },
              ],
            },
          ],
        },
        {
          id: "cache-dados",
          label: "Cache & Dados",
          groups: [
            {
              title: "Armazenamento e Service Worker",
              items: [
                {
                  type: "button",
                  label: "Limpar caches antigos e recarregar",
                  actionLabel: "Recarregar",
                  onClick: async () => {
                    if ("caches" in window) {
                      const keys = await caches.keys();
                      await Promise.all(keys.map((k) => caches.delete(k)));
                    }
                    location.reload();
                  },
                },
                {
                  type: "button",
                  label: "Restaurar preferências padrão",
                  actionLabel: "Restaurar",
                  onClick: () => {
                    prefs = { ...defaultPrefs };
                    savePrefs();
                    renderPanel();
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  function getCoreValue(path) {
    return path.split(".").reduce((acc, part) => (acc ? acc[part] : undefined), Core.state);
  }

  function setCoreValue(path, val) {
    const parts = path.split(".");
    const last = parts.pop();
    const target = parts.reduce((acc, part) => (acc ? acc[part] : undefined), Core.state);
    if (target && last) {
      target[last] = val;
      savePrefs();
    }
  }

  function getActiveMainSection() {
    return SECTIONS.find((s) => s.mainTab === activeMainTab) || SECTIONS[0];
  }

  function getActiveSubSection(mainSec) {
    return mainSec.subTabs.find((st) => st.id === activeSubTab) || mainSec.subTabs[0];
  }

  function renderItem(item, idx) {
    if (item.type === "toggle") {
      const checked = Boolean(prefs[item.key]);
      return `
        <div class="rset-row">
          <div class="rset-row-text">
            <div class="rset-row-label">${item.label}</div>
            ${item.note ? `<div class="rset-row-note">${item.note}</div>` : ""}
          </div>
          <label class="rset-switch">
            <input type="checkbox" data-pref-toggle="${item.key}" ${checked ? "checked" : ""} />
            <span class="rset-slider"></span>
          </label>
        </div>
      `;
    }

    if (item.type === "coreToggle") {
      const checked = Boolean(getCoreValue(item.path));
      return `
        <div class="rset-row">
          <div class="rset-row-text">
            <div class="rset-row-label">${item.label}</div>
          </div>
          <label class="rset-switch">
            <input type="checkbox" data-core-toggle="${item.path}" ${checked ? "checked" : ""} />
            <span class="rset-slider"></span>
          </label>
        </div>
      `;
    }

    if (item.type === "select") {
      const currentVal = prefs[item.key] ?? "";
      return `
        <div class="rset-row">
          <div class="rset-row-text">
            <div class="rset-row-label">${item.label}</div>
          </div>
          <select class="rset-select" data-pref-select="${item.key}">
            ${item.options
              .map((o) => `<option value="${o.value}" ${o.value === currentVal ? "selected" : ""}>${o.label}</option>`)
              .join("")}
          </select>
        </div>
      `;
    }

    if (item.type === "number") {
      const currentVal = prefs[item.key] ?? 100;
      return `
        <div class="rset-row">
          <div class="rset-row-text">
            <div class="rset-row-label">${item.label}</div>
          </div>
          <input class="rset-input" type="number" data-pref-number="${item.key}" value="${currentVal}" min="${item.min ?? 1}" max="${item.max ?? 9999}" />
        </div>
      `;
    }

    if (item.type === "button") {
      return `
        <div class="rset-row">
          <div class="rset-row-text">
            <div class="rset-row-label">${item.label}</div>
          </div>
          <button type="button" class="rset-action-btn" data-run-action="${idx}">${item.actionLabel || "Executar"}</button>
        </div>
      `;
    }

    return `
      <div class="rset-row">
        <div class="rset-row-text">
          <div class="rset-row-label">${item.label}</div>
        </div>
        <span class="rset-badge">${item.value || ""}</span>
      </div>
    `;
  }

  function renderPanel() {
    if (!panelEl) return;
    const mainSec = getActiveMainSection();
    const subSec = getActiveSubSection(mainSec);
    if (subSec) activeSubTab = subSec.id;

    const q = searchQuery.trim().toLowerCase();
    const allItems = [];
    const groupsToRender = q
      ? SECTIONS.flatMap((m) =>
          m.subTabs.flatMap((st) =>
            st.groups
              .map((g) => ({
                ...g,
                title: `${m.mainLabel} · ${st.label} · ${g.title}`,
                items: g.items.filter(
                  (it) =>
                    it.label.toLowerCase().includes(q) ||
                    (it.note && it.note.toLowerCase().includes(q))
                ),
              }))
              .filter((g) => g.items.length > 0)
          )
        )
      : subSec?.groups || [];

    panelEl.innerHTML = `
      <div class="rset-card">
        <div class="rset-top-tabs">
          ${SECTIONS.map(
            (m) => `
            <button type="button" class="rset-main-tab ${m.mainTab === activeMainTab ? "is-active" : ""}" data-main-tab="${m.mainTab}">
              ${m.mainLabel}
            </button>
          `
          ).join("")}
        </div>

        <div class="rset-header">
          <span class="rset-title">Configurações</span>
          <button type="button" class="rset-close" data-close title="Fechar">✕</button>
        </div>

        <div class="rset-search-wrap">
          <input type="search" class="rset-search" placeholder="Pesquisar..." value="${searchQuery.replace(/"/g, "&quot;")}" />
        </div>

        ${
          !q
            ? `<div class="rset-sub-tabs">
                ${mainSec.subTabs
                  .map(
                    (st) => `
                  <button type="button" class="rset-sub-tab ${st.id === activeSubTab ? "is-active" : ""}" data-sub-tab="${st.id}">
                    ${st.label}
                  </button>
                `
                  )
                  .join("")}
              </div>`
            : ""
        }

        <div class="rset-scroll">
          ${
            groupsToRender.length === 0
              ? `<div class="rset-empty">Nenhuma configuração encontrada.</div>`
              : groupsToRender
                  .map(
                    (grp) => `
                  <div class="rset-group">
                    <div class="rset-group-title">${grp.title}</div>
                    <div class="rset-group-box">
                      ${grp.items
                        .map((it) => {
                          const idx = allItems.length;
                          allItems.push(it);
                          return renderItem(it, idx);
                        })
                        .join("")}
                    </div>
                  </div>
                `
                  )
                  .join("")
          }
        </div>
      </div>
    `;

    panelEl.querySelector("[data-close]")?.addEventListener("click", () => toggle(false));

    panelEl.querySelector(".rset-search")?.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderPanel();
      const input = panelEl.querySelector(".rset-search");
      if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
    });

    panelEl.querySelectorAll("[data-main-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeMainTab = btn.dataset.mainTab;
        const nextMain = getActiveMainSection();
        activeSubTab = nextMain.subTabs[0]?.id || "";
        renderPanel();
      });
    });

    panelEl.querySelectorAll("[data-sub-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeSubTab = btn.dataset.subTab;
        renderPanel();
      });
    });

    panelEl.querySelectorAll("[data-pref-toggle]").forEach((inp) => {
      inp.addEventListener("change", (e) => {
        prefs[e.target.dataset.prefToggle] = e.target.checked;
        savePrefs();
      });
    });

    panelEl.querySelectorAll("[data-core-toggle]").forEach((inp) => {
      inp.addEventListener("change", (e) => {
        setCoreValue(e.target.dataset.coreToggle, e.target.checked);
      });
    });

    panelEl.querySelectorAll("[data-pref-select]").forEach((sel) => {
      sel.addEventListener("change", (e) => {
        prefs[e.target.dataset.prefSelect] = e.target.value;
        savePrefs();
      });
    });

    panelEl.querySelectorAll("[data-pref-number]").forEach((num) => {
      num.addEventListener("change", (e) => {
        prefs[e.target.dataset.prefNumber] = Number(e.target.value) || 100;
        savePrefs();
      });
    });

    panelEl.querySelectorAll("[data-run-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const it = allItems[Number(btn.dataset.runAction)];
        if (typeof it?.onClick === "function") it.onClick();
      });
    });
  }

  function ensurePanel() {
    if (panelEl) return;
    panelEl = document.createElement("aside");
    panelEl.id = "robles-settings-drawer";
    panelEl.className = "rset-wrap";
    panelEl.style.display = "none";
    (document.querySelector(".viewport, .studio-shell, body") || document.body).appendChild(panelEl);
  }

  function isSettingsOpen() {
    return Boolean(panelEl && panelEl.dataset.open === "true" && panelEl.style.display !== "none");
  }

  function toggle(force) {
    ensurePanel();
    const shouldOpen = typeof force === "boolean" ? force : !isSettingsOpen();
    if (shouldOpen) {
      window.RoblesExport?.close?.();
      window.RoblesImportar?.close?.();
      window.RoblesPresets?.close?.();
      window.RoblesContextPanels?.close?.();
    }
    panelEl.dataset.open = shouldOpen ? "true" : "false";
    panelEl.style.display = shouldOpen ? "flex" : "none";
    if (shouldOpen) renderPanel();
  }

  // Intercepta o clique no botão de configurações da barra inferior esquerda
  document.addEventListener(
    "click",
    (e) => {
      const btn = e.target.closest?.('[data-footer="settings"]');
      if (!btn) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      toggle();
    },
    true
  );

  // Fecha ao clicar fora do painel de Configurações
  function handleOutsideInteraction(e) {
    if (!isSettingsOpen() || !panelEl) return;
    const card = panelEl.querySelector(".rset-card") || panelEl;
    if (card.contains(e.target)) return;
    if (e.target.closest?.('[data-footer="settings"]')) return;
    toggle(false);
  }

  document.addEventListener("click", handleOutsideInteraction);
  document.addEventListener("pointerdown", handleOutsideInteraction);

  window.RoblesSettings = {
    toggle,
    open: () => toggle(true),
    close: () => toggle(false),
    getPrefs: () => ({ ...prefs }),
  };
})();