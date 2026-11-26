(() => {
  const Core = window.RoblesCore;
  if (!Core) return;

  const leftSidebar = document.querySelector(".hud-left");
  let rightSidebar = document.querySelector(".hud-right");
  let topCenterBar = document.querySelector(".hud-top-center");
  let bottomLeftBar = document.getElementById("core-bottom-left-bar");
  let settingsPopover = null;

  const GLOBAL_EDIT_ACTIONS = [
    {
      id: "undo",
      label: "Desfazer (Ctrl+Z)",
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/></svg>`,
    },
    {
      id: "paste",
      label: "Colar (Ctrl+V)",
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>`,
    },
    {
      id: "copy",
      label: "Copiar (Ctrl+C)",
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
    },
    {
      id: "duplicate",
      label: "Duplicar (Ctrl+D)",
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/><path d="M14 11v6M11 14h6"/></svg>`,
    },
    {
      id: "snap",
      label: "Ajuste Magnético (Snap)",
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 15V9a6 6 0 1 1 12 0v6"/><path d="M6 15h4v4H6z"/><path d="M14 15h4v4h-4z"/></svg>`,
    },
    {
      id: "redo",
      label: "Refazer (Ctrl+Y)",
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14l5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/></svg>`,
    },
  ];

  const SECONDARY_TOOLS = {
    pan: [
      { id: "pan-free", label: "Pan Livre", icon: "✥" },
      { id: "pan-axis", label: "Eixo Travado", icon: "⇄" },
      { id: "pan-fit", label: "Enquadrar", icon: "⊡" },
    ],
    transform: [
      { id: "tf-move", label: "Mover", icon: "⤢" },
      { id: "tf-scale", label: "Escalar", icon: "⤡" },
      { id: "tf-rotate", label: "Girar", icon: "↻" },
      { id: "tf-mirror", label: "Espelhar", icon: "◫" },
    ],
    align: [
      { id: "al-center", label: "Centro", icon: "⊕" },
      { id: "al-grid", label: "Grade", icon: "⊞" },
      { id: "al-snap", label: "Ajuste", icon: "🧲" },
    ],
    hierarchy: [
      { id: "hi-tree", label: "Árvore", icon: "⑂" },
      { id: "hi-group", label: "Agrupar", icon: "❏" },
      { id: "hi-isolate", label: "Isolar", icon: "◎" },
    ],
  };

  function renderTopCenterGlobalBar() {
    function renderTopCenterGlobalBar() {
    if (!topCenterBar) {
      topCenterBar = document.createElement("nav");
      topCenterBar.className = "hud-pill hud-top-center";
      topCenterBar.setAttribute("aria-label", "Ações globais de edição");
      document.querySelector(".viewport, .studio-shell, body")?.appendChild(topCenterBar);
    }

    const snapActive = Boolean(Core.state.settings.snapEnabled);

    topCenterBar.innerHTML = GLOBAL_EDIT_ACTIONS.map((act) => {
      const isActive = act.id === "snap" && snapActive;
      return `
        <button
          type="button"
          class="tool-btn ${isActive ? "is-active" : ""}"
          data-global-cmd="${act.id}"
          title="${act.label}"
        >${act.icon}</button>
      `;
    }).join("");

    // Permite arrastar com o mouse além do dedo/Apple Pencil
    if (!topCenterBar.dataset.carouselBound) {
      topCenterBar.dataset.carouselBound = "true";
      let isDown = false, startX = 0, startScrollLeft = 0, moved = false;

      topCenterBar.addEventListener("pointerdown", (e) => {
        if (e.pointerType === "touch") return;
        isDown = true;
        moved = false;
        startX = e.clientX;
        startScrollLeft = topCenterBar.scrollLeft;
        topCenterBar.style.scrollBehavior = "auto";
      });

      window.addEventListener("pointermove", (e) => {
        if (!isDown) return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 4) moved = true;
        topCenterBar.scrollLeft = startScrollLeft - dx;
      });

      window.addEventListener("pointerup", () => {
        if (!isDown) return;
        isDown = false;
        topCenterBar.style.scrollBehavior = "smooth";
        if (moved) {
          topCenterBar.dataset.justDragged = "true";
          setTimeout(() => { topCenterBar.dataset.justDragged = "false"; }, 60);
        }
      });
    }

    topCenterBar.querySelectorAll("[data-global-cmd]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (topCenterBar.dataset.justDragged === "true") return;
        Core.dispatchCommand(btn.dataset.globalCmd);
        renderTopCenterGlobalBar();
      });
    });
  }
    const mobile = Core.isMobile();
    const snapActive = Boolean(Core.state.settings.snapEnabled);

    topCenterBar.style.cssText = `
      position: fixed;
      top: ${mobile ? "52px" : "14px"};
      left: 50%;
      transform: translateX(-50%);
      display: inline-flex;
      flex-direction: row;
      align-items: center;
      gap: ${mobile ? "2px" : "4px"};
      padding: ${mobile ? "3px" : "4px"};
      z-index: 32;
    `;

    topCenterBar.innerHTML = GLOBAL_EDIT_ACTIONS.map((act) => {
      const isActive = act.id === "snap" && snapActive;
      return `
        <button
          type="button"
          class="tool-btn ${isActive ? "is-active" : ""}"
          data-global-cmd="${act.id}"
          title="${act.label}"
        >${act.icon}</button>
      `;
    }).join("");

    topCenterBar.querySelectorAll("[data-global-cmd]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        Core.dispatchCommand(btn.dataset.globalCmd);
        renderTopCenterGlobalBar();
      });
    });
  }

  function renderLeftToolbar() {
    if (!leftSidebar) return;
    const actions = [
      { id: "select", label: "Selecionar", icon: Core.ICONS.select },
      { id: "pan", label: "Mover Vista", icon: Core.ICONS.hand },
      { id: "transform", label: "Transformar", icon: Core.ICONS.vector },
      { id: "align", label: "Alinhar", icon: Core.ICONS.measures },
      { id: "hierarchy", label: "Hierarquia", icon: Core.ICONS.layers },
    ];

    leftSidebar.innerHTML = actions
      .map(
        (act) => `
        <button type="button" class="tool-btn ${Core.state.activeLeftAction === act.id ? "is-active" : ""}" data-left-act="${act.id}" title="${act.label}">
          ${act.icon}
        </button>`
      )
      .join("");

    leftSidebar.querySelectorAll("[data-left-act]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        Core.state.activeLeftAction = btn.dataset.leftAct;
        renderLeftToolbar();
        renderRightToolbar();
      });
    });
  }

  function renderRightToolbar() {
    if (!rightSidebar) {
      rightSidebar = document.createElement("aside");
      rightSidebar.className = "hud-pill hud-right";
      document.querySelector(".viewport, .studio-shell, body")?.appendChild(rightSidebar);
    }

    const mobile = Core.isMobile();
    rightSidebar.style.cssText = `
      display:flex; flex-direction:column; align-items:center; gap:4px; padding:4px; z-index:29;
      top:${mobile ? "56px" : "68px"}; right:${mobile ? "10px" : "14px"}; left:auto;
    `;

    const tools = SECONDARY_TOOLS[Core.state.activeLeftAction] || SECONDARY_TOOLS.transform;
    rightSidebar.innerHTML = tools
      .map(
        (t) => `
        <button type="button" class="tool-btn ${Core.state.activeSecondaryAction === t.id ? "is-active" : ""}" data-sec="${t.id}" title="${t.label}" style="font-size:13px;">
          ${t.icon}
        </button>`
      )
      .join("");

    rightSidebar.querySelectorAll("[data-sec]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        Core.state.activeSecondaryAction = btn.dataset.sec;
        if (Core.state.activeSecondaryAction === "pan-fit") {
          Object.assign(Core.state.camera, Core.state.defaultCamera);
          Object.assign(Core.state.camera2D, { zoom: 1, panX: 0, panY: 0 });
        }
        renderRightToolbar();
        Core.emit("render:request");
      });
    });
  }

  function toggleSettingsPopover(forceState) {
    if (!settingsPopover) {
      settingsPopover = document.createElement("div");
      settingsPopover.className = "hud-pill";
      settingsPopover.style.cssText = `
        bottom:66px; left:66px; display:none; flex-direction:column; gap:8px;
        padding:10px 12px; width:240px; z-index:33; font-size:11px; color:#fff;
      `;
      document.querySelector(".viewport, .studio-shell, body")?.appendChild(settingsPopover);
    }

    const isOpen = typeof forceState === "boolean" ? forceState : settingsPopover.dataset.open !== "true";
    settingsPopover.dataset.open = isOpen ? "true" : "false";
    settingsPopover.style.display = isOpen ? "flex" : "none";
    if (!isOpen) return;

    const s = Core.state.settings;
    settingsPopover.innerHTML = `
      <div style="display:flex;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:6px;font-weight:700;">
        <span>Configurações</span>
        <button type="button" data-close style="background:none;border:none;color:#aaa;cursor:pointer;">✕</button>
      </div>
      <label style="display:flex;justify-content:space-between;cursor:pointer;">
        <span>Grade e Eixos</span>
        <input type="checkbox" data-grid ${s.showGrid ? "checked" : ""} style="accent-color:#f59e0b;" />
      </label>
      <label style="display:flex;justify-content:space-between;cursor:pointer;">
        <span>Sincronia Viva 2D ↔ 3D</span>
        <input type="checkbox" data-sync ${s.liveSync2Dto3D ? "checked" : ""} style="accent-color:#f59e0b;" />
      </label>
    `;

    settingsPopover.querySelector("[data-close]")?.addEventListener("click", () => toggleSettingsPopover(false));
    settingsPopover.querySelector("[data-grid]")?.addEventListener("change", (e) => {
      s.showGrid = e.target.checked;
      Core.emit("render:request");
    });
    settingsPopover.querySelector("[data-sync]")?.addEventListener("change", (e) => {
      s.liveSync2Dto3D = e.target.checked;
      Core.emit("render:request");
    });
  }

  function renderBottomLeftBar() {
    document.querySelectorAll(".hud-bottom-left, .hud-left-bottom, [data-shortcuts]").forEach((el) => {
      if (el.id !== "core-bottom-left-bar") el.remove();
    });

    if (!bottomLeftBar) {
      bottomLeftBar = document.createElement("div");
      bottomLeftBar.id = "core-bottom-left-bar";
      bottomLeftBar.className = "hud-pill hud-bottom-left";
      bottomLeftBar.innerHTML = `
        <button type="button" class="tool-btn" data-footer="save" title="Salvar">${Core.ICONS.save}</button>
        <button type="button" class="tool-btn" data-footer="settings" title="Configurações">${Core.ICONS.gear}</button>
        <button type="button" class="tool-btn" data-footer="export" title="Exportar PNG">${Core.ICONS.exportIcon}</button>
      `;

      bottomLeftBar.querySelectorAll("[data-footer]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const act = btn.dataset.footer;
          if (act === "save") {
            localStorage.setItem("robles_studio_autosave", JSON.stringify({ activeArea: Core.state.activeArea, measures: Core.state.measuresByArea }));
            Core.recordHistory(Core.state.activeArea, `Salvo · ${Core.getAreaMeta().label}`);
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

      document.querySelector(".viewport, .studio-shell, body")?.appendChild(bottomLeftBar);
    }

    const mobile = Core.isMobile();
    bottomLeftBar.style.cssText = `
      position:fixed; display:inline-flex; flex-direction:row; align-items:center;
      bottom:${mobile ? "10px" : "14px"}; left:${mobile ? "10px" : "14px"};
      gap:${mobile ? "2px" : "4px"}; padding:${mobile ? "3px" : "4px"}; z-index:31;
    `;
  }

  window.addEventListener("keydown", (e) => {
    if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
    if (!(e.ctrlKey || e.metaKey)) return;
    const k = e.key.toLowerCase();
    const map = { z: e.shiftKey ? "redo" : "undo", y: "redo", c: "copy", v: "paste", d: "duplicate" };
    if (map[k]) {
      e.preventDefault();
      Core.dispatchCommand(map[k]);
      renderTopCenterGlobalBar();
    }
  });

  Core.on("ui:update", renderTopCenterGlobalBar);

  renderTopCenterGlobalBar();
  renderLeftToolbar();
  renderRightToolbar();
  renderBottomLeftBar();
  window.addEventListener("resize", () => {
    renderTopCenterGlobalBar();
    renderRightToolbar();
    renderBottomLeftBar();
  });
})();