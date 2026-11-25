(() => {
  const Core = window.RoblesCore;
  if (!Core) return;

  const topLeftNav = document.querySelector(".hud-top-left");
  const topCenterNav = document.querySelector(".hud-top-center");

  function renderPersonasPanel() {
    const container = topLeftNav || topCenterNav;
    if (!container) return;

    if (topLeftNav) {
      const mobile = Core.isMobile();
      topLeftNav.style.flexDirection = "row";
      topLeftNav.style.left = mobile ? "10px" : "14px";
      topLeftNav.style.top = mobile ? "10px" : "14px";
    }

    // Oculta o painel central de presets/submenus
    if (topLeftNav && topCenterNav) {
      topCenterNav.style.display = "none";
      topCenterNav.innerHTML = "";
    }

    container.innerHTML = Core.AREAS.map(
      (a) => `
      <button type="button" class="tool-btn ${Core.state.activeArea === a.id ? "is-active" : ""}" data-area="${a.id}" title="${a.title}">
        ${a.icon}
      </button>`
    ).join("");

    container.querySelectorAll("[data-area]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        Core.setActiveArea(btn.dataset.area);
      });
    });
  }

  Core.on("ui:update", renderPersonasPanel);
  window.addEventListener("resize", renderPersonasPanel);
  renderPersonasPanel();
})();
