(() => {
  const Core = window.RoblesCore;
  if (!Core) return;

  let barEl = null;
  let drawerEl = null;
  let layerSearch = "";

  const HISTORY_TABS = [
    { id: "vector", label: "Vetores", empty: "Nenhum vetor ainda." },
    { id: "sketch", label: "Esboços", empty: "Nenhum esboço ainda." },
    { id: "video", label: "Vídeo", empty: "Nenhuma ação de Vídeo." },
    { id: "3d", label: "Sólidos 3D", empty: "Nenhum sólido ainda." },
    { id: "all", label: "Tudo", empty: "Nenhuma ação registrada." },
  ];

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
      drawerEl.className = "hud-pill";
      document.querySelector(".viewport, .studio-shell, body")?.appendChild(drawerEl);
    }

    const mobile = Core.isMobile();
    barEl.style.cssText = `
      position:fixed; display:inline-flex; flex-direction:row; align-items:center;
      bottom:${mobile ? "10px" : "14px"}; right:${mobile ? "10px" : "14px"};
      gap:${mobile ? "2px" : "4px"}; padding:${mobile ? "3px" : "4px"}; z-index:31;
    `;
    drawerEl.style.cssText = `
      position:fixed; display:${Core.state.activeBottomDrawer ? "flex" : "none"}; flex-direction:column; gap:8px;
      bottom:${mobile ? "56px" : "66px"}; right:${mobile ? "10px" : "14px"}; left:${mobile ? "10px" : "auto"};
      width:${mobile ? "auto" : "296px"}; max-height:460px; padding:10px; z-index:32; color:#fff; font-size:12px; overflow-y:auto;
    `;
  }

  function renderLayerRow(node, depth = 0) {
    const q = layerSearch.trim().toLowerCase();
    if (q && !node.name.toLowerCase().includes(q) && node.kind !== "group") return "";

    const isSelected = Core.state.selectedLayerId === node.id;
    let html = `
      <div data-layer-row="${node.id}" style="
        display:flex;align-items:center;justify-content:space-between;gap:6px;
        padding:5px 6px 5px ${6 + depth * 14}px; border-radius:7px; cursor:pointer;
        background:${isSelected ? "rgba(245, 158, 11, 0.18)" : "rgba(255,255,255,0.03)"};
        border:1px solid ${isSelected ? "rgba(245, 158, 11, 0.55)" : "transparent"};
      ">
        <div style="display:flex;align-items:center;gap:6px;min-width:0;flex:1;">
          <span style="width:12px;height:12px;border-radius:3px;flex-shrink:0;background:${node.swatch};"></span>
          <div style="min-width:0;flex:1;">
            <div style="font-size:11px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${node.name}</div>
            <div style="font-size:9.5px;opacity:0.62;">${node.meta || ""}</div>
          </div>
        </div>
        <button type="button" data-toggle-vis="${node.id}" style="background:none;border:none;color:${node.visible ? "#fff" : "rgba(255,255,255,0.3)"};cursor:pointer;">
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
        <div style="display:flex;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:6px;font-weight:700;">
          <span>Camadas & StudioLink</span>
          <div style="display:flex;gap:4px;">
            <button type="button" id="btn-add-lyr" style="background:rgba(255,255,255,0.08);border:none;color:#fff;border-radius:5px;padding:3px 6px;cursor:pointer;">${Core.ICONS.plus}</button>
            <button type="button" id="btn-del-lyr" style="background:rgba(255,255,255,0.08);border:none;color:#f87171;border-radius:5px;padding:3px 6px;cursor:pointer;">${Core.ICONS.trash}</button>
          </div>
        </div>
        <input id="inp-lyr-q" type="text" value="${layerSearch}" placeholder="Filtrar camadas..." style="background:rgba(0,0,0,0.28);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:5px 8px;color:#fff;font-size:11px;" />
        ${selNode && selNode.kind !== "group" ? `
          <div style="display:flex;gap:4px;flex-wrap:wrap;padding:6px;border-radius:7px;background:rgba(255,255,255,0.04);">
            ${selNode.area === "vector" ? `<button type="button" data-bridge="to-3d" style="flex:1;padding:5px;border-radius:5px;border:none;background:rgba(56,189,248,0.2);color:#7dd3fc;font-size:10px;cursor:pointer;">Extrudar → 3D</button>` : ""}
            ${selNode.area !== "3d" ? `<button type="button" data-bridge="tex-3d" style="flex:1;padding:5px;border-radius:5px;border:none;background:rgba(245,158,11,0.2);color:#fcd34d;font-size:10px;cursor:pointer;">Textura no 3D</button>` : ""}
            ${selNode.area === "3d" ? `<button type="button" data-bridge="to-vector" style="flex:1;padding:5px;border-radius:5px;border:none;background:rgba(56,189,248,0.2);color:#7dd3fc;font-size:10px;cursor:pointer;">Extrair Vetor 2D</button>` : ""}
          </div>
        ` : ""}
        <div style="display:flex;flex-direction:column;gap:4px;">
          ${Core.state.layersTree.map((g) => renderLayerRow(g)).join("")}
        </div>
      `;

      drawerEl.querySelector("#inp-lyr-q")?.addEventListener("input", (e) => { layerSearch = e.target.value; render(); });
      drawerEl.querySelector("#btn-add-lyr")?.addEventListener("click", () => {
        const grp = Core.findLayer(Core.state.activeArea === "3d" ? "grp-3d" : "grp-2d");
        const n = Core.hydrateSceneNode({ id: `lyr-${Date.now()}`, name: `Nova Camada`, area: Core.state.activeArea, visible: true, swatch: "#f59e0b" });
        grp.children.unshift(n);
        grp.meta = `${grp.children.length} Layers`;
        Core.state.selectedLayerId = n.id;
        Core.recordHistory(Core.state.activeArea, "Nova camada adicionada");
        Core.emit("render:request");
      });
      drawerEl.querySelector("#btn-del-lyr")?.addEventListener("click", () => {
        if (!Core.state.selectedLayerId.startsWith("grp-")) {
          Core.deleteLayer(Core.state.selectedLayerId);
          Core.state.selectedLayerId = "l-param-base";
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
        <div style="display:flex;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:6px;font-weight:700;">
          <span>Medidas · ${meta.label}</span>
          <button type="button" id="btn-rst-m" style="background:rgba(255,255,255,0.08);border:none;color:#fff;border-radius:5px;padding:3px 7px;font-size:10px;cursor:pointer;">Resetar</button>
        </div>
        <label style="display:flex;flex-direction:column;gap:3px;">
          <div style="display:flex;justify-content:space-between;"><span>Escala</span><span>${m.scale}%</span></div>
          <input type="range" id="rng-sc" min="20" max="250" value="${m.scale}" style="accent-color:#f59e0b;" />
        </label>
        <label style="display:flex;flex-direction:column;gap:3px;">
          <div style="display:flex;justify-content:space-between;"><span>Rotação</span><span>${m.rotation}°</span></div>
          <input type="range" id="rng-rt" min="-180" max="180" value="${m.rotation}" style="accent-color:#f59e0b;" />
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
      const tabObj = HISTORY_TABS.find((t) => t.id === Core.state.activeHistoryTab) || HISTORY_TABS[4];
      const list = Core.state.activeHistoryTab === "all"
        ? Core.state.historyEntries
        : Core.state.historyEntries.filter((e) => e.tab === Core.state.activeHistoryTab);

      drawerEl.innerHTML = `
        <div style="display:flex;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:6px;font-weight:700;">
          <span>Histórico · ${tabObj.label}</span>
          <button type="button" id="btn-clr-h" style="background:rgba(255,255,255,0.08);border:none;color:#f87171;border-radius:5px;padding:3px 7px;font-size:10px;cursor:pointer;">Limpar</button>
        </div>
        <div style="display:flex;gap:4px;flex-wrap:wrap;">
          ${HISTORY_TABS.map((t) => `<button type="button" data-ht="${t.id}" style="padding:3px 6px;border-radius:5px;border:none;font-size:10px;cursor:pointer;background:${Core.state.activeHistoryTab === t.id ? "#f59e0b" : "rgba(255,255,255,0.08)"};color:${Core.state.activeHistoryTab === t.id ? "#111" : "#fff"};">${t.label}</button>`).join("")}
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;">
          ${list.length === 0 ? `<div style="opacity:0.5;text-align:center;padding:12px;">${tabObj.empty}</div>` : list.map((i) => `<div style="display:flex;justify-content:space-between;padding:5px 7px;background:rgba(255,255,255,0.04);border-radius:6px;"><span>${i.label}</span><span style="opacity:0.5;font-size:9.5px;">${i.time}</span></div>`).join("")}
        </div>
      `;
      drawerEl.querySelector("#btn-clr-h")?.addEventListener("click", () => { Core.state.historyEntries = []; render(); });
      drawerEl.querySelectorAll("[data-ht]").forEach((b) => b.addEventListener("click", () => { Core.state.activeHistoryTab = b.dataset.ht; render(); }));
    }
  }

  Core.on("ui:update", render);
  window.addEventListener("resize", render);
  render();
})();
