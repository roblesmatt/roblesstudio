(() => {
  const Core = window.RoblesCore;
  if (!Core) return;

  const nav = document.querySelector(".hud-top-left");
  if (!nav) return;
function renderPersonasPanel() {
    nav.innerHTML = Core.AREAS.map(
      (a) => `
      <button type="button" class="tool-btn hud-persona-btn ${Core.state.activeArea === a.id ? "is-active" : ""}" data-area="${a.id}" title="${a.title}">
        ${a.icon}
      </button>`
    ).join("");

    nav.querySelectorAll("[data-area]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        Core.setActiveArea(btn.dataset.area);
      });
    });
  }

  Core.on("ui:update", renderPersonasPanel);
  renderPersonasPanel();
})();