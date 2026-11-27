(() => {
  const Core = window.RoblesCore;
  if (!Core) return;

  window.RoblesInspectorModules = window.RoblesInspectorModules || {};

  let selectedIdx = null;
  let drawerOpenForSelected = false;
  let moreMenuOpen = false;
  let editingNameIdx = null;
  let editingParamsIdx = null;

  const PERSONA_MAP = {
    vector: "vector",
    pixel: "pixel",
    sketch: "pixel",
    video: "video",
    "3d": "3d",
  };

  const DEFAULT_PARAMS_BY_AREA = {
    vector: { strokeWidth: 3, scale: 100 },
    pixel: { cellSize: 16, scale: 100 },
    video: { fps: 30, duration: 10 },
    "3d": { w: 4.0, h: 2.2, d: 3.0 },
  };

  function formatTimeNow() {
    return new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  function getHistoryArray() {
    if (!Core.state) return [];
    if (!Array.isArray(Core.state.historyEntries)) {
      Core.state.historyEntries = [];
    }
    return Core.state.historyEntries;
  }

  function normalizeItem(item, idx, fallbackArea = null) {
    const activeArea =
      fallbackArea && PERSONA_MAP[fallbackArea]
        ? PERSONA_MAP[fallbackArea]
        : Core.state?.activeArea || "vector";

    if (!item || typeof item !== "object") {
      return {
        id: `hist-${idx}`,
        label: String(item || "Aberto · Novo projeto"),
        tab: activeArea,
        area: activeArea,
        layerId: Core.state?.selectedLayerId || null,
        visible: true,
        isolated: false,
        plane: "XY",
        params: { ...(DEFAULT_PARAMS_BY_AREA[activeArea] || { valor: 1 }) },
        time: formatTimeNow(),
      };
    }

    const resolvedArea = PERSONA_MAP[item.area] || PERSONA_MAP[item.tab] || activeArea;
    const baseParams = DEFAULT_PARAMS_BY_AREA[resolvedArea] || { escala: 100 };
    const rawParams =
      item.params && typeof item.params === "object" && Object.keys(item.params).length > 0
        ? { ...item.params }
        : { ...baseParams };

    return {
      id: item.id || `hist-${idx}`,
      label: item.label || item.text || item.name || "Operação",
      tab: item.tab || resolvedArea,
      area: resolvedArea,
      layerId: item.layerId || Core.state?.selectedLayerId || null,
      visible: item.visible !== false,
      isolated: Boolean(item.isolated),
      plane: item.plane || "XY",
      params: rawParams,
      time: item.time || "",
    };
  }

  function syncPersonaOnly(item) {
    if (!item) return;
    const targetArea = PERSONA_MAP[item.area] || PERSONA_MAP[item.tab];
    if (targetArea && Core.state?.activeArea !== targetArea) {
      Core.setActiveArea?.(targetArea);
    }
  }

  function commitHistory(nextEntries, eventName = "history:update", syncItem = null) {
    if (!Core.state) return;
    Core.state.historyEntries = nextEntries.slice(0, 80);
    if (syncItem) {
      syncPersonaOnly(syncItem);
      Core.applyHistoryEdit?.(syncItem);
    }
    Core.emit?.(eventName, { historyEntries: Core.state.historyEntries, item: syncItem });
    Core.emit?.("ui:update");
    Core.emit?.("render:request");
  }

  window.RoblesInspectorModules.history = {
    getHeader() {
      const entries = getHistoryArray();
      return {
        title: "Histórico",
        counter: `✎ ${Math.max(1, entries.length)}`,
      };
    },

    render(ctx = {}) {
      const entries = getHistoryArray();
      const activeArea =
        ctx.filterArea && PERSONA_MAP[ctx.filterArea]
          ? PERSONA_MAP[ctx.filterArea]
          : Core.state?.activeArea || "vector";

      if (entries.length === 0) {
        return `
          <div class="history-step-row" data-select-idx="0">
            <span class="history-step-left">
              <span class="history-step-caret">○</span>
              <span>Aberto · Novo projeto</span>
            </span>
            <span class="history-step-ref">${formatTimeNow()}</span>
          </div>
        `;
      }

      if (selectedIdx !== null && selectedIdx >= entries.length) {
        selectedIdx = null;
        drawerOpenForSelected = false;
      }

      const hasSelection = selectedIdx !== null && entries[selectedIdx] !== undefined;
      const current = hasSelection ? normalizeItem(entries[selectedIdx], selectedIdx, activeArea) : null;

      const rowsHtml = entries
        .map((raw, idx) => {
          const item = normalizeItem(raw, idx, activeArea);
          const isSel = hasSelection && idx === selectedIdx && drawerOpenForSelected;
          const isRenaming = editingNameIdx === idx;

          const labelHtml = isRenaming
            ? `<input type="text" class="rset-input" data-rename-input="${idx}" value="${item.label.replace(/"/g, "&quot;")}" style="width: 118px; padding: 2px 6px;" />`
            : `<span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.label}</span>`;

          const statusTag = !item.visible ? "Oculto" : item.isolated ? "Isolado" : item.time || "";

          return `
            <div
              class="history-step-row"
              data-select-idx="${idx}"
              style="${isSel ? "background: rgba(0, 0, 0, 0.08);" : ""}"
            >
              <span class="history-step-left" style="min-width: 0; flex: 1;">
                <span class="history-step-caret">${isSel ? "▸" : "○"}</span>
                ${labelHtml}
              </span>
              <span class="history-step-ref" style="margin-left: 6px; padding-right: 2px; flex-shrink: 0;">${statusTag}</span>
            </div>
          `;
        })
        .join("");

      const paramsDrawerHtml =
        hasSelection && drawerOpenForSelected && editingParamsIdx === selectedIdx
          ? `
            <div class="history-step-row" style="flex-direction: column; align-items: stretch; gap: 6px; padding-top: 8px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span class="history-step-ref">PARÂMETROS · ${current.area.toUpperCase()}</span>
                <button type="button" class="rset-action-btn" data-close-params style="padding: 2px 8px; font-size: 11px;">OK</button>
              </div>
              ${Object.entries(current.params)
                .map(
                  ([key, val]) => `
                  <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
                    <span class="history-step-ref" style="font-size: 12px;">${key}</span>
                    <input
                      type="text"
                      class="rset-input"
                      data-param-key="${key}"
                      value="${String(val).replace(/"/g, "&quot;")}"
                      style="width: 84px; padding: 2px 6px; font-size: 12px;"
                    />
                  </div>
                `
                )
                .join("")}
            </div>
          `
          : "";

      const actionDrawerHtml =
        hasSelection && drawerOpenForSelected
          ? `
          <div class="history-step-row" style="justify-content: space-between; gap: 4px; padding-top: 8px; margin-top: 4px; border-top: 1px solid rgba(0, 0, 0, 0.14); cursor: default; flex-wrap: nowrap;">
            <button type="button" class="rset-action-btn" data-act="edit" style="padding: 4px 6px; font-size: 11px; flex: 1; white-space: nowrap;">✎ Editar</button>
            <button type="button" class="rset-action-btn" data-act="show" style="padding: 4px 6px; font-size: 11px; flex: 1; white-space: nowrap;">${current.visible ? "Ocultar" : "Mostrar"}</button>
            <button type="button" class="rset-action-btn" data-act="isolate" style="padding: 4px 6px; font-size: 11px; flex: 1; white-space: nowrap;">${current.isolated ? "Livre" : "Isolar"}</button>
            <button type="button" class="rset-action-btn" data-act="more" style="padding: 4px 6px; font-size: 11px; flex: 0 0 auto; white-space: nowrap;">•••</button>
          </div>
          ${paramsDrawerHtml}
          ${
            moreMenuOpen
              ? `
            <div style="display:flex; flex-direction:column; gap:2px; padding-top:6px;">
              <div class="history-step-row" data-menu-act="rename" style="padding: 5px 4px;">
                <span class="history-step-left"><span style="font-size:12px;">Renomear</span></span>
              </div>
              <div class="history-step-row" data-menu-act="plane" style="padding: 5px 4px;">
                <span class="history-step-left"><span style="font-size:12px;">Redefinir Plano</span></span>
                <span class="history-step-ref">${current.plane}</span>
              </div>
              <div class="history-step-row" data-menu-act="delete" style="padding: 5px 4px;">
                <span class="history-step-left"><span style="font-size:12px; color:#b91c1c;">Deletar</span></span>
              </div>
            </div>
          `
              : ""
          }
        `
          : "";

      return `
        ${rowsHtml}
        ${actionDrawerHtml}
      `;
    },

    bindEvents(container, rerender, ctx = {}) {
      const activeArea =
        ctx.filterArea && PERSONA_MAP[ctx.filterArea]
          ? PERSONA_MAP[ctx.filterArea]
          : Core.state?.activeArea || "vector";

      container.querySelectorAll("[data-select-idx]").forEach((row) => {
        row.addEventListener("click", (e) => {
          if (e.target.closest?.("[data-rename-input]")) return;
          e.stopPropagation();

          const nextIdx = Number(row.dataset.selectIdx);
          if (selectedIdx === nextIdx && drawerOpenForSelected) {
            drawerOpenForSelected = false;
            selectedIdx = null;
            editingParamsIdx = null;
            moreMenuOpen = false;
            editingNameIdx = null;
            rerender();
            return;
          }

          selectedIdx = nextIdx;
          drawerOpenForSelected = true;
          moreMenuOpen = false;
          editingNameIdx = null;
          editingParamsIdx = null;

          const entries = getHistoryArray();
          const normalized = normalizeItem(entries[selectedIdx], selectedIdx, activeArea);
          syncPersonaOnly(normalized);
          Core.emit?.("history:select", { index: selectedIdx, item: normalized });
          rerender();
        });
      });

      container.querySelector("[data-act='edit']")?.addEventListener("click", (e) => {
        e.stopPropagation();
        if (selectedIdx === null) return;
        moreMenuOpen = false;
        drawerOpenForSelected = true;
        editingParamsIdx = editingParamsIdx === selectedIdx ? null : selectedIdx;
        Core.emit?.("history:edit", { index: selectedIdx });
        rerender();
        const firstParam = container.querySelector("[data-param-key]");
        if (firstParam) {
          firstParam.focus();
          firstParam.select();
        }
      });

      container.querySelector("[data-close-params]")?.addEventListener("click", (e) => {
        e.stopPropagation();
        editingParamsIdx = null;
        rerender();
      });

      container.querySelectorAll("[data-param-key]").forEach((input) => {
        const applyParam = () => {
          if (selectedIdx === null) return;
          const key = input.dataset.paramKey;
          const entries = getHistoryArray().slice();
          if (!entries[selectedIdx]) return;
          const item = normalizeItem(entries[selectedIdx], selectedIdx, activeArea);
          const rawVal = input.value;
          const numVal = Number(rawVal);
          const nextVal = rawVal.trim() !== "" && !Number.isNaN(numVal) ? numVal : rawVal;
          const updated = {
            ...(typeof entries[selectedIdx] === "object" ? entries[selectedIdx] : { label: item.label }),
            params: { ...item.params, [key]: nextVal },
          };
          entries[selectedIdx] = updated;
          commitHistory(entries, "history:param:change", normalizeItem(updated, selectedIdx, activeArea));
        };

        input.addEventListener("click", (e) => e.stopPropagation());
        input.addEventListener("change", () => {
          applyParam();
          rerender();
        });
        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            applyParam();
            editingParamsIdx = null;
            rerender();
          }
        });
      });

      container.querySelector("[data-act='show']")?.addEventListener("click", (e) => {
        e.stopPropagation();
        if (selectedIdx === null) return;
        const entries = getHistoryArray().slice();
        if (!entries[selectedIdx]) return;
        const item = normalizeItem(entries[selectedIdx], selectedIdx, activeArea);
        const updated = {
          ...(typeof entries[selectedIdx] === "object" ? entries[selectedIdx] : { label: item.label }),
          visible: !item.visible,
        };
        entries[selectedIdx] = updated;
        commitHistory(entries, "history:visibility", normalizeItem(updated, selectedIdx, activeArea));
        rerender();
      });

      container.querySelector("[data-act='isolate']")?.addEventListener("click", (e) => {
        e.stopPropagation();
        if (selectedIdx === null) return;
        const entries = getHistoryArray().slice();
        if (!entries[selectedIdx]) return;
        const item = normalizeItem(entries[selectedIdx], selectedIdx, activeArea);
        const nextIsolated = !item.isolated;
        const updated = {
          ...(typeof entries[selectedIdx] === "object" ? entries[selectedIdx] : { label: item.label }),
          isolated: nextIsolated,
        };
        entries[selectedIdx] = updated;
        Core.emit?.("history:isolate", { index: selectedIdx, isolated: nextIsolated, item: updated });
        commitHistory(entries, "history:isolate", normalizeItem(updated, selectedIdx, activeArea));
        rerender();
      });

      container.querySelector("[data-act='more']")?.addEventListener("click", (e) => {
        e.stopPropagation();
        moreMenuOpen = !moreMenuOpen;
        rerender();
      });

      container.querySelector("[data-menu-act='rename']")?.addEventListener("click", (e) => {
        e.stopPropagation();
        if (selectedIdx === null) return;
        moreMenuOpen = false;
        editingNameIdx = selectedIdx;
        rerender();
        const inp = container.querySelector(`[data-rename-input="${selectedIdx}"]`);
        if (inp) {
          inp.focus();
          inp.select();
        }
      });

      container.querySelectorAll("[data-rename-input]").forEach((inp) => {
        const commitRename = () => {
          const idx = Number(inp.dataset.renameInput);
          const entries = getHistoryArray().slice();
          const val = inp.value.trim();
          if (entries[idx] && val) {
            const updated =
              typeof entries[idx] === "object"
                ? { ...entries[idx], label: val, text: val, name: val }
                : val;
            entries[idx] = updated;
            commitHistory(entries, "history:rename", normalizeItem(updated, idx, activeArea));
          }
          editingNameIdx = null;
          rerender();
        };

        inp.addEventListener("click", (e) => e.stopPropagation());
        inp.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commitRename();
          } else if (e.key === "Escape") {
            editingNameIdx = null;
            rerender();
          }
        });
        inp.addEventListener("blur", commitRename);
      });

      container.querySelector("[data-menu-act='plane']")?.addEventListener("click", (e) => {
        e.stopPropagation();
        if (selectedIdx === null) return;
        const planes = ["XY", "XZ", "YZ"];
        const entries = getHistoryArray().slice();
        if (!entries[selectedIdx]) return;
        const item = normalizeItem(entries[selectedIdx], selectedIdx, activeArea);
        const nextPlane = planes[(planes.indexOf(item.plane) + 1) % planes.length];
        const updated = {
          ...(typeof entries[selectedIdx] === "object" ? entries[selectedIdx] : { label: item.label }),
          plane: nextPlane,
        };
        entries[selectedIdx] = updated;
        commitHistory(entries, "history:plane", normalizeItem(updated, selectedIdx, activeArea));
        rerender();
      });

      container.querySelector("[data-menu-act='delete']")?.addEventListener("click", (e) => {
        e.stopPropagation();
        if (selectedIdx === null) return;
        const entries = getHistoryArray().slice();
        if (!entries[selectedIdx]) return;
        entries.splice(selectedIdx, 1);
        moreMenuOpen = false;
        editingNameIdx = null;
        editingParamsIdx = null;
        drawerOpenForSelected = false;
        selectedIdx = null;
        commitHistory(entries, "history:delete");
        rerender();
      });
    },
  };
})();