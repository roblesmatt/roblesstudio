(() => {
  const Core = window.RoblesCore;
  if (!Core) return;

  const leftSidebar = document.querySelector(".hud-left");
  let rightSidebar = document.querySelector(".hud-right");
  let bottomLeftBar = document.getElementById("core-bottom-left-bar");
  let leftMirrorBar = document.getElementById("core-left-mirror-bar");
  let settingsPopover = null;

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

  // Ferramentas extras da barra inferior esquerda espelhada (logo acima de Salvar/Config/Exportar)
  const MIRROR_LEFT_TOOLS = [
    { id: "undo", label: "Desfazer", icon: "↶" },
    { id: "redo", label: "Refazer", icon: "↷" },
    { id: "snap", label: "Imã / Snap", icon: "🧲", toggle: true },
    { id: "grid", label: "Alternar Grade", icon: "⊞", toggle: true },
    { id: "fit", label: "Centralizar Câmera", icon: "⊡" },
  ];

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
      renderMirrorLeftBar();
      Core.emit("render:request");
    });
    settingsPopover.querySelector("[data-sync]")?.addEventListener("change", (e) => {
      s.liveSync2Dto3D = e.target.checked;
      Core.emit("render:request");
    });
  }

  // Barra vertical espelhada no lado inferior esquerdo (acima de Salvar/Config/Exportar)
  function renderMirrorLeftBar() {
    if (!leftMirrorBar) {
      leftMirrorBar = document.createElement("aside");
      leftMirrorBar.id = "core-left-mirror-bar";
      leftMirrorBar.className = "hud-pill";
      document.querySelector(".viewport, .studio-shell, body")?.appendChild(leftMirrorBar);
    }

    const mobile = Core.isMobile();
    leftMirrorBar.style.cssText = `
      position:fixed; display:flex; flex-direction:column; align-items:center;
      bottom:${mobile ? "56px" : "66px"}; left:${mobile ? "10px" : "14px"};
      gap:${mobile ? "2px" : "4px"}; padding:${mobile ? "3px" : "4px"}; z-index:30;
    `;

    leftMirrorBar.innerHTML = MIRROR_LEFT_TOOLS.map((t) => {
      const isActive =
        (t.id === "grid" && Core.state.settings.showGrid) ||
        (t.id === "snap" && Core.state.settings.snapEnabled);
      return `
        <button type="button" class="tool-btn ${isActive ? "is-active" : ""}" data-mirror="${t.id}" title="${t.label}" style="font-size:13px;">
          ${t.icon}
        </button>`;
    }).join("");

    leftMirrorBar.querySelectorAll("[data-mirror]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const act = btn.dataset.mirror;
        if (act === "grid") {
          Core.state.settings.showGrid = !Core.state.settings.showGrid;
        } else if (act === "snap") {
          Core.state.settings.snapEnabled = !Core.state.settings.snapEnabled;
        } else if (act === "fit") {
          Object.assign(Core.state.camera, Core.state.defaultCamera);
          Object.assign(Core.state.camera2D, { zoom: 1, panX: 0, panY: 0 });
        } else if (act === "undo") {
          Core.recordHistory(Core.state.activeArea, "Desfazer ação");
        } else if (act === "redo") {
          Core.recordHistory(Core.state.activeArea, "Refazer ação");
        }
        renderMirrorLeftBar();
        Core.emit("render:request");
      });
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

  renderLeftToolbar();
  renderRightToolbar();
  renderMirrorLeftBar();
  renderBottomLeftBar();
  window.addEventListener("resize", () => {
    renderRightToolbar();
    renderMirrorLeftBar();
    renderBottomLeftBar();
  });
})();


