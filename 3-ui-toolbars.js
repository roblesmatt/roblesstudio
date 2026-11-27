(() => {
  const Core = window.RoblesCore;
  if (!Core) return;

  // As barras .hud-left (primárias) e .hud-right (secundárias) pertencem a cada módulo
  // (vetor.js, pixel.js, video.js, 3d.js). Aqui ficam só: ações globais, rodapé e configurações.
  let topCenterBar = document.querySelector(".hud-top-center");
  let bottomLeftBar = document.getElementById("core-bottom-left-bar");
  let settingsPopover = null;

  const getIcon = (key, group, fallback) =>
    window.RoblesIcons?.get?.(key, group) || fallback;

  const SVG = (d) =>
    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;

  const GLOBAL_EDIT_ACTIONS = [
    {
      id: "undo",
      label: "Desfazer (Ctrl+Z)",
      icon: getIcon("undo", undefined, SVG(`<path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>`)),
    },
    {
      id: "paste",
      label: "Colar (Ctrl+V)",
      icon: getIcon("paste", undefined, SVG(`<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/>`)),
    },
    {
      id: "copy",
      label: "Copiar (Ctrl+C)",
      icon: getIcon("copy", undefined, SVG(`<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>`)),
    },
    {
      id: "duplicate",
      label: "Duplicar (Ctrl+D)",
      icon: getIcon("duplicate", undefined, SVG(`<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/><path d="M14 11v6M11 14h6"/>`)),
    },
    {
      id: "snap",
      label: "Ajuste Magnético (Snap)",
      icon: getIcon("snap", undefined, SVG(`<path d="M6 15V9a6 6 0 1 1 12 0v6"/><path d="M6 15h4v4H6z"/><path d="M14 15h4v4h-4z"/>`)),
    },
    {
      id: "redo",
      label: "Refazer (Ctrl+Y)",
      icon: getIcon("redo", undefined, SVG(`<path d="M15 14l5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/>`)),
    },
  ];

  const host = () => document.querySelector(".viewport, .studio-shell, body");

  function renderTopCenterGlobalBar() {
    if (!topCenterBar) {
      topCenterBar = document.createElement("nav");
      topCenterBar.className = "hud-pill hud-top-center";
      topCenterBar.setAttribute("aria-label", "Ações globais de edição");
      host().appendChild(topCenterBar);
    }
    const snapActive = Boolean(Core.state.settings.snapEnabled);

    topCenterBar.innerHTML = GLOBAL_EDIT_ACTIONS.map((act) => `
      <button type="button" class="tool-btn ${act.id === "snap" && snapActive ? "is-active" : ""}"
        data-global-cmd="${act.id}" title="${act.label}">${act.icon}</button>`).join("");

    // arrastar a barra com o mouse (no iPad o scroll nativo já funciona)
    if (!topCenterBar.dataset.dragBound) {
      topCenterBar.dataset.dragBound = "1";
      let down = false, startX = 0, startLeft = 0, moved = false;
      topCenterBar.addEventListener("pointerdown", (e) => {
        if (e.pointerType !== "mouse") return;
        down = true; moved = false; startX = e.clientX; startLeft = topCenterBar.scrollLeft;
      });
      window.addEventListener("pointermove", (e) => {
        if (!down) return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 4) moved = true;
        topCenterBar.scrollLeft = startLeft - dx;
      });
      window.addEventListener("pointerup", () => {
        if (!down) return;
        down = false;
        if (moved) {
          topCenterBar.dataset.justDragged = "1";
          setTimeout(() => { topCenterBar.dataset.justDragged = ""; }, 60);
        }
      });
    }

    topCenterBar.querySelectorAll("[data-global-cmd]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (topCenterBar.dataset.justDragged) return;
        Core.dispatchCommand(btn.dataset.globalCmd);
      });
    });
  }

  function toggleSettingsPopover(force) {
    if (!settingsPopover) {
      settingsPopover = document.createElement("div");
      settingsPopover.className = "hud-pill";
      settingsPopover.style.cssText =
        "bottom:66px;left:66px;display:none;flex-direction:column;align-items:stretch;gap:8px;padding:10px 12px;width:240px;z-index:33;font-size:11px;color:var(--text-icon);";
      host().appendChild(settingsPopover);
    }
    const open = typeof force === "boolean" ? force : settingsPopover.dataset.open !== "true";
    settingsPopover.dataset.open = open ? "true" : "false";
    settingsPopover.style.display = open ? "flex" : "none";
    if (!open) return;

    const s = Core.state.settings;
    settingsPopover.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(0,0,0,0.14);padding-bottom:6px;font-weight:700;">
        <span>Configurações</span>
        <button type="button" data-close style="background:none;border:none;color:inherit;cursor:pointer;font-size:12px;">✕</button>
      </div>
      <label style="display:flex;justify-content:space-between;align-items:center;cursor:pointer;">
        <span>Grade e Eixos</span>
        <input type="checkbox" data-grid ${s.showGrid ? "checked" : ""} style="accent-color:#161515;" />
      </label>
      <label style="display:flex;justify-content:space-between;align-items:center;cursor:pointer;">
        <span>Sincronia Viva 2D ↔ 3D</span>
        <input type="checkbox" data-sync ${s.liveSync2Dto3D ? "checked" : ""} style="accent-color:#161515;" />
      </label>
      <button type="button" data-reset-view style="border:1px solid rgba(0,0,0,0.16);background:rgba(0,0,0,0.06);color:inherit;border-radius:7px;padding:6px;font-size:11px;font-weight:700;cursor:pointer;">Centralizar vista (Ctrl+0)</button>
    `;
    settingsPopover.querySelector("[data-close]").addEventListener("click", () => toggleSettingsPopover(false));
    settingsPopover.querySelector("[data-grid]").addEventListener("change", (e) => { s.showGrid = e.target.checked; Core.emit("render:request"); });
    settingsPopover.querySelector("[data-sync]").addEventListener("change", (e) => { s.liveSync2Dto3D = e.target.checked; Core.emit("render:request"); });
    settingsPopover.querySelector("[data-reset-view]").addEventListener("click", () => Core.view && Core.view.resetView());
  }

  function renderBottomLeftBar() {
    if (bottomLeftBar) return;
    bottomLeftBar = document.createElement("div");
    bottomLeftBar.id = "core-bottom-left-bar";
    bottomLeftBar.className = "hud-pill hud-bottom-left";
    bottomLeftBar.innerHTML = `
      <button type="button" class="tool-btn" data-footer="save" title="Salvar">${getIcon("save", undefined, Core.ICONS.save)}</button>
      <button type="button" class="tool-btn" data-footer="settings" title="Configurações">${getIcon("gear", undefined, Core.ICONS.gear)}</button>
      <button type="button" class="tool-btn" data-footer="export" title="Exportar PNG">${getIcon("exportIcon", undefined, Core.ICONS.exportIcon)}</button>
    `;
    bottomLeftBar.querySelectorAll("[data-footer]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const act = btn.dataset.footer;
        if (act === "save") {
          if (window.RoblesHome?.saveCurrentProject) {
            window.RoblesHome.saveCurrentProject();
          } else {
            try {
              localStorage.setItem(
                "robles_studio_autosave",
                JSON.stringify({
                  activeArea: Core.state.activeArea,
                  measures: Core.state.measuresByArea,
                })
              );
            } catch (_) {}
            Core.recordHistory(Core.state.activeArea, `Salvo · ${Core.getAreaMeta().label}`);
          }
          window.RoblesHome?.show?.();
        } else if (act === "settings") {
          toggleSettingsPopover();
        } else if (act === "export") {
          const canvas = document.getElementById("scene-canvas");
          const link = document.createElement("a");
          link.download = `robles-studio-${Core.state.activeArea}.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();
          Core.recordHistory(Core.state.activeArea, `Exportado · ${Core.getAreaMeta().label}`);
        }
      });
    });
    host().appendChild(bottomLeftBar);
  }

  window.addEventListener("keydown", (e) => {
    if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) return;
    if (!(e.ctrlKey || e.metaKey)) return;
    const k = e.key.toLowerCase();
    const map = { z: e.shiftKey ? "redo" : "undo", y: "redo", c: "copy", v: "paste", d: "duplicate" };
    if (map[k]) {
      e.preventDefault();
      Core.dispatchCommand(map[k]);
    }
  });

  Core.on("ui:update", renderTopCenterGlobalBar);
  renderTopCenterGlobalBar();
  renderBottomLeftBar();

  // No resize, o módulo ativo refaz as próprias barras (esquerda, direita e topo direito)
  window.addEventListener("resize", () => {
    renderTopCenterGlobalBar();
    Core.modules[Core.state.activeArea]?.renderBars?.();
  });
})();