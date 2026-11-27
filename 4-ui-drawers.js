(() => {
  const Core = window.RoblesCore;
  if (!Core) return;

  let barEl = null;
  let drawerEl = null;
  let layerSearch = "";

  const getIcon = (key, group, fallback) =>
    window.RoblesIcons?.get?.(key, group) || fallback;

  function getHistoryTabs() {
    return [
      { id: "vector", label: "Vetor", empty: "Nenhuma ação em Vetor.", icon: Core.ICONS.vector },
      { id: "pixel", label: "Pixel", empty: "Nenhuma ação em Pixel.", icon: Core.ICONS.pixel },
      { id: "video", label: "Vídeo", empty: "Nenhuma ação em Vídeo.", icon: Core.ICONS.video },
      { id: "3d", label: "3D", empty: "Nenhuma ação em 3D.", icon: Core.ICONS.cube3d },
    ];
  }

  function ensureElements() {
    if (!barEl) {
      barEl = document.createElement("div");
      barEl.id = "core-bottom-right-bar";
      barEl.className = "hud-pill";
      barEl.innerHTML = `
        <button type="button" class="tool-btn" data-mode="layers" title="Camadas & StudioLink">${Core.ICONS.layers}</button>
        <button type="button" class="tool-btn" data-mode="measures" title="Medidas">${Core.ICONS.measures}</button>
        <button type="button" class="tool-btn" data-mode="history" title="Histórico">${Core.ICONS.historyTab}</button>
      `;
      barEl.querySelectorAll("[data-mode]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const mode = btn.dataset.mode;
          Core.state.activeBottomDrawer = Core.state.activeBottomDrawer === mode ? null : mode;
          render();
        });
      });
      document.querySelector(".viewport, .studio-shell, body")?.appendChild(barEl);
    }

    if (!drawerEl) {
      drawerEl = document.createElement("aside");
      drawerEl.id = "core-bottom-drawer";
      document.querySelector(".viewport, .studio-shell, body")?.appendChild(drawerEl);
    }

    const mobile = Core.isMobile();
    const isHistory = Core.state.activeBottomDrawer === "history";

    barEl.style.cssText = `
      position:fixed; display:inline-flex; flex-direction:row; align-items:center;
      bottom:${mobile ? "10px" : "14px"}; right:${mobile ? "10px" : "14px"};
      gap:${mobile ? "2px" : "4px"}; padding:${mobile ? "3px" : "4px"}; z-index:31;
    `;

    if (isHistory) {
      drawerEl.className = "history-popover-wrap";
      drawerEl.style.cssText = `
        position:fixed; display:${Core.state.activeBottomDrawer ? "flex" : "none"};
        bottom:${mobile ? "56px" : "66px"}; right:${mobile ? "10px" : "14px"};
        width:${mobile ? "calc(100vw - 20px)" : "284px"}; max-width:300px; z-index:32;
      `;
    } else {
      drawerEl.className = "hud-pill";
      drawerEl.style.cssText = `
        position:fixed; display:${Core.state.activeBottomDrawer ? "flex" : "none"}; flex-direction:column; gap:8px;
        bottom:${mobile ? "56px" : "66px"}; right:${mobile ? "10px" : "14px"}; left:${mobile ? "10px" : "auto"};
        width:${mobile ? "auto" : "284px"}; max-height:460px; padding:12px; z-index:32;
        background:var(--hud-bg); color:var(--text-icon); border:1px solid rgba(0,0,0,0.16);
        border-radius:14px; box-shadow:0 10px 28px rgba(0,0,0,0.14); font-size:12px; overflow-y:auto;
      `;
    }
  }

  function renderLayerRow(node, depth = 0) {
    const q = layerSearch.trim().toLowerCase();
    if (q && !node.name.toLowerCase().includes(q) && node.kind !== "group") return "";

    const isSelected = Core.state.selectedLayerId === node.id;
    let html = `
      <div data-layer-row="${node.id}" style="
        display:flex;align-items:center;justify-content:space-between;gap:6px;
        padding:6px 6px 6px ${6 + depth * 14}px; border-radius:7px; cursor:pointer;
        background:${isSelected ? "rgba(0, 0, 0, 0.1)" : "rgba(0, 0, 0, 0.03)"};
        border:1px solid ${isSelected ? "rgba(0, 0, 0, 0.35)" : "transparent"};
      ">
        <div style="display:flex;align-items:center;gap:6px;min-width:0;flex:1;">
          <span style="width:12px;height:12px;border-radius:3px;flex-shrink:0;background:${node.swatch};"></span>
          <div style="min-width:0;flex:1;">
            <div style="font-size:11.5px;font-weight:600;color:var(--text-icon);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${node.name}</div>
            <div style="font-size:9.5px;opacity:0.65;color:var(--text-icon);">${node.meta || ""}</div>
          </div>
        </div>
        <button type="button" data-toggle-vis="${node.id}" style="background:none;border:none;color:${node.visible ? "var(--text-icon)" : "rgba(0,0,0,0.28)"};cursor:pointer;">
          ${node.visible ? Core.ICONS.eye : Core.ICONS.eyeOff}
        </button>
      </div>
    `;

    (node.children || []).forEach((c) => { html += renderLayerRow(c, depth + 1); });
    (node.sublayers || []).forEach((s) => { html += renderLayerRow(s, depth + 1); });
    return html;
  }

  function render() {
    ensureElements();
    const mode = Core.state.activeBottomDrawer;
    barEl.querySelectorAll("[data-mode]").forEach((b) => b.classList.toggle("is-active", b.dataset.mode === mode));
    if (!mode) return;

    if (mode === "layers") {
      const selNode = Core.findLayer(Core.state.selectedLayerId);
      drawerEl.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(0,0,0,0.14);padding-bottom:8px;font-weight:700;">
          <span>Camadas & StudioLink</span>
          <div style="display:flex;gap:4px;">
            <button type="button" id="btn-add-lyr" style="background:rgba(0,0,0,0.08);border:none;color:var(--text-icon);border-radius:5px;padding:4px 6px;cursor:pointer;">${Core.ICONS.plus}</button>
            <button type="button" id="btn-del-lyr" style="background:rgba(0,0,0,0.08);border:none;color:#b91c1c;border-radius:5px;padding:4px 6px;cursor:pointer;">${Core.ICONS.trash}</button>
          </div>
        </div>
        <input id="inp-lyr-q" type="text" value="${layerSearch}" placeholder="Filtrar camadas..." style="background:rgba(0,0,0,0.06);border:1px solid rgba(0,0,0,0.14);border-radius:7px;padding:6px 8px;color:var(--text-icon);font-size:11px;outline:none;" />
        ${selNode && selNode.kind !== "group" ? `
          <div style="display:flex;gap:4px;flex-wrap:wrap;padding:6px;border-radius:7px;background:rgba(0,0,0,0.05);">
            ${selNode.area === "vector" ? `<button type="button" data-bridge="to-3d" style="flex:1;padding:5px;border-radius:5px;border:none;background:var(--accent-amber-bg);color:#fff;font-size:10px;cursor:pointer;">Extrudar → 3D</button>` : ""}
            ${selNode.area !== "3d" ? `<button type="button" data-bridge="tex-3d" style="flex:1;padding:5px;border-radius:5px;border:none;background:var(--accent-amber-bg);color:#fff;font-size:10px;cursor:pointer;">Textura no 3D</button>` : ""}
            ${selNode.area === "3d" ? `<button type="button" data-bridge="to-vector" style="flex:1;padding:5px;border-radius:5px;border:none;background:var(--accent-amber-bg);color:#fff;font-size:10px;cursor:pointer;">Extrair Vetor 2D</button>` : ""}
          </div>
        ` : ""}
        <div style="display:flex;flex-direction:column;gap:4px;">
          ${Core.state.layersTree.map((g) => renderLayerRow(g)).join("")}
        </div>
      `;

      drawerEl.querySelector("#inp-lyr-q")?.addEventListener("input", (e) => { layerSearch = e.target.value; render(); });
      drawerEl.querySelector("#btn-add-lyr")?.addEventListener("click", () => {
        const grp = Core.findLayer(Core.state.activeArea === "3d" ? "grp-3d" : "grp-2d");
        const n = Core.hydrateSceneNode({ id: `lyr-${Date.now()}`, name: `Nova Camada`, area: Core.state.activeArea, visible: true, swatch: "#161515" });
        grp.children.unshift(n);
        grp.meta = `${grp.children.length} Layers`;
        Core.state.selectedLayerId = n.id;
        Core.recordHistory(Core.state.activeArea, "Nova camada adicionada");
        Core.emit("render:request");
      });
      drawerEl.querySelector("#btn-del-lyr")?.addEventListener("click", () => {
        if (!Core.state.selectedLayerId.startsWith("grp-")) {
          Core.deleteLayer(Core.state.selectedLayerId);
          Core.state.selectedLayerId = "l-vec-path";
          render();
          Core.emit("render:request");
        }
      });
      drawerEl.querySelectorAll("[data-layer-row]").forEach((row) => {
        row.addEventListener("click", () => {
          Core.state.selectedLayerId = row.dataset.layerRow;
          const node = Core.findLayer(Core.state.selectedLayerId);
          if (node && node.kind !== "group" && node.area !== Core.state.activeArea) Core.setActiveArea(node.area);
          else { render(); Core.emit("render:request"); }
        });
      });
      drawerEl.querySelectorAll("[data-toggle-vis]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const node = Core.findLayer(btn.dataset.toggleVis);
          if (node) { node.visible = !node.visible; Core.invalidateNode(node.id); render(); }
        });
      });
      drawerEl.querySelectorAll("[data-bridge]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const act = btn.dataset.bridge;
          if (act === "to-3d") Core.convertNode(selNode.id, "3d");
          else if (act === "to-vector") Core.convertNode(selNode.id, "vector");
          else if (act === "tex-3d") Core.bindTextureTo3D(selNode.id);
        });
      });
    } else if (mode === "measures") {
      const m = Core.state.measuresByArea[Core.state.activeArea];
      const meta = Core.getAreaMeta();
      drawerEl.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(0,0,0,0.14);padding-bottom:8px;font-weight:700;">
          <span>Medidas · ${meta.label}</span>
          <button type="button" id="btn-rst-m" style="background:rgba(0,0,0,0.08);border:none;color:var(--text-icon);border-radius:5px;padding:3px 7px;font-size:10px;cursor:pointer;">Resetar</button>
        </div>
        <label style="display:flex;flex-direction:column;gap:4px;">
          <div style="display:flex;justify-content:space-between;"><span>Escala</span><span>${m.scale}%</span></div>
          <input type="range" id="rng-sc" min="20" max="250" value="${m.scale}" style="accent-color:#161515;" />
        </label>
        <label style="display:flex;flex-direction:column;gap:4px;">
          <div style="display:flex;justify-content:space-between;"><span>Rotação</span><span>${m.rotation}°</span></div>
          <input type="range" id="rng-rt" min="-180" max="180" value="${m.rotation}" style="accent-color:#161515;" />
        </label>
      `;
      drawerEl.querySelector("#btn-rst-m")?.addEventListener("click", () => {
        Core.state.measuresByArea[Core.state.activeArea] = { scale: 100, offsetX: 0, offsetY: 0, rotation: 0 };
        Core.invalidateAll();
        render();
      });
      drawerEl.querySelector("#rng-sc")?.addEventListener("input", (e) => {
        m.scale = Number(e.target.value);
        if (Core.state.activeArea === "3d") Core.state.camera.zoom = (m.scale / 100) * 42;
        Core.invalidateAll();
        render();
      });
      drawerEl.querySelector("#rng-rt")?.addEventListener("input", (e) => {
        m.rotation = Number(e.target.value);
        Core.invalidateAll();
        render();
      });
    } else if (mode === "history") {
      const historyTabs = getHistoryTabs();
      const tabObj = historyTabs.find((t) => t.id === Core.state.activeHistoryTab) || historyTabs[3];
      const list = Core.state.activeHistoryTab === "all"
        ? Core.state.historyEntries
        : Core.state.historyEntries.filter((e) => e.tab === Core.state.activeHistoryTab);

      const counterIcon = getIcon(
        "historyCounter",
        undefined,
        `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>`
      );

      drawerEl.innerHTML = `
        <div class="history-top-toggles">
          <button type="button" class="history-toggle-pill" id="btn-hist-measures" title="Medidas e Parâmetros">{ }</button>
          <button type="button" class="history-toggle-pill is-active" id="btn-hist-layers" title="Camadas">${Core.ICONS.layers}</button>
        </div>

        <div class="history-card">
          <div class="history-tabs-bar">
            ${historyTabs.map((t) => `
              <button
                type="button"
                class="history-tab-btn ${Core.state.activeHistoryTab === t.id ? "is-active" : ""}"
                data-ht="${t.id}"
                title="${t.label}"
              >${t.icon}</button>
            `).join("")}
          </div>

          <div class="history-card-header">
            <span class="history-card-title">Histórico</span>
            <div class="history-card-counter" title="Total de passos">
              ${counterIcon}
              <span>${list.length}</span>
              ${list.length > 0 ? `<button type="button" id="btn-clr-h" title="Limpar histórico" style="background:none;border:none;color:rgba(0,0,0,0.45);cursor:pointer;margin-left:4px;font-size:11px;">✕</button>` : ""}
            </div>
          </div>

          <div class="history-tree-list">
            ${list.length === 0
              ? `<div style="opacity:0.5;text-align:center;padding:16px 8px;font-size:12px;">${tabObj.empty}</div>`
              : list.map((item) => {
                  const isDerived = item.label.includes("→") || item.label.toLowerCase().includes("extru") || item.label.toLowerCase().includes("preset");
                  const stepIcon = item.tab === "3d"
                    ? getIcon(
                        "sub3dHardSurface",
                        undefined,
                        `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`
                      )
                    : getIcon(
                        "historyStep",
                        undefined,
                        `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>`
                      );
                  return `
                    <div class="history-step-row">
                      <div class="history-step-left">
                        <span class="history-step-caret">${isDerived ? "›" : ""}</span>
                        ${stepIcon}
                        <span>${item.label}</span>
                      </div>
                      <span class="history-step-ref">${item.time}</span>
                    </div>
                  `;
                }).join("")
            }
          </div>
        </div>
      `;

      drawerEl.querySelector("#btn-hist-measures")?.addEventListener("click", () => {
        Core.state.activeBottomDrawer = "measures";
        render();
      });
      drawerEl.querySelector("#btn-hist-layers")?.addEventListener("click", () => {
        Core.state.activeBottomDrawer = "layers";
        render();
      });
      drawerEl.querySelector("#btn-clr-h")?.addEventListener("click", () => {
        Core.state.historyEntries = [];
        render();
      });
      drawerEl.querySelectorAll("[data-ht]").forEach((b) =>
        b.addEventListener("click", () => {
          Core.state.activeHistoryTab = b.dataset.ht;
          render();
        })
      );
    }
  }

  Core.on("ui:update", render);
  window.addEventListener("resize", render);
  render();
})();