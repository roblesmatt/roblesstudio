(() => {
  const Core = window.RoblesCore;
  if (!Core) return;

  const INDEX_KEY = "robles_studio_projects_v1";
  const PROJECT_PREFIX = "robles_studio_doc_";

  const TEMPLATES = [
    {
      id: "tpl-packaging-73x87",
      name: "Embalagem 73×87×23mm",
      area: "vector",
      preset: "Traço Limpo",
      sizeLabel: "73 × 87 × 23 mm",
      desc: "Dieline e rótulo com margens limpas para caixas e frascos.",
      accent: "linear-gradient(135deg, #9fb098, #3d2d2d)",
    },
    {
      id: "tpl-square-1080",
      name: "Prancheta 1080×1080",
      area: "vector",
      preset: "Curva Bezier",
      sizeLabel: "1080 × 1080 px",
      desc: "Composição vetorial quadrada para identidade, peças e estudos.",
      accent: "linear-gradient(135deg, #c8be9e, #3f3f37)",
    },
    {
      id: "tpl-pixel-cel",
      name: "Grade Pixel & Textura",
      area: "pixel",
      preset: "Pixel 1px",
      sizeLabel: "64 × 40 cel",
      desc: "Pintura em grelha de píxeis e mapas de superfície.",
      accent: "linear-gradient(135deg, #6b8f71, #272523)",
    },
    {
      id: "tpl-3d-parametric",
      name: "Peça & Molde 3D",
      area: "3d",
      preset: "Paramétrico",
      sizeLabel: "4.0 × 2.2 × 3.0 u",
      desc: "Bloco paramétrico com sincronia 2D ↔ 3D e inspeção de malha.",
      accent: "linear-gradient(135deg, #b89b6a, #161515)",
    },
    {
      id: "tpl-video-1080p",
      name: "Composição Vídeo",
      area: "video",
      preset: "1080p 30fps",
      sizeLabel: "1920 × 1080 · 30fps",
      desc: "Linha temporal e cena em movimento para apresentação.",
      accent: "linear-gradient(135deg, #8c7a6b, #1c1917)",
    },
  ];

  let homeEl = null;
  let activeTab = "home"; // home | recent | templates | favorites
  let currentProjectId = null;

  function loadIndex() {
    try {
      const raw = localStorage.getItem(INDEX_KEY);
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (_) {
      return [];
    }
  }

  function saveIndex(list) {
    try {
      localStorage.setItem(INDEX_KEY, JSON.stringify(list));
    } catch (_) {}
  }

  function captureThumbnail() {
    try {
      const canvas = document.getElementById("scene-canvas");
      if (!canvas || canvas.width === 0 || canvas.height === 0) return "";
      return canvas.toDataURL("image/png", 0.75);
    } catch (_) {
      return "";
    }
  }

  function serializeWorkspaceState(meta = {}) {
    return {
      meta: {
        id: meta.id || `proj-${Date.now().toString(36)}`,
        name: meta.name || "Projeto sem título",
        area: Core.state.activeArea,
        preset: Core.state.activePreset,
        sizeLabel: meta.sizeLabel || "",
        favorite: Boolean(meta.favorite),
        updatedAt: new Date().toISOString(),
      },
      state: {
        activeArea: Core.state.activeArea,
        activePreset: Core.state.activePreset,
        settings: JSON.parse(JSON.stringify(Core.state.settings || {})),
        measuresByArea: JSON.parse(JSON.stringify(Core.state.measuresByArea || {})),
        camera: JSON.parse(JSON.stringify(Core.state.camera || {})),
        camera2D: JSON.parse(JSON.stringify(Core.state.camera2D || {})),
        selectedLayerId: Core.state.selectedLayerId || null,
      },
    };
  }

  function saveCurrentProject(customName) {
    const index = loadIndex();
    const existing = index.find((p) => p.id === currentProjectId);
    const id = existing ? existing.id : `proj-${Date.now().toString(36)}`;
    const name = (customName || existing?.name || `Projeto ${index.length + 1}`).trim() || "Projeto sem título";
    const thumb = captureThumbnail() || existing?.thumbnail || "";

    const doc = serializeWorkspaceState({
      id,
      name,
      sizeLabel: existing?.sizeLabel || "",
      favorite: existing?.favorite || false,
    });

    try {
      localStorage.setItem(PROJECT_PREFIX + id, JSON.stringify(doc));
    } catch (_) {}

    const summary = {
      id,
      name,
      area: doc.meta.area,
      preset: doc.meta.preset,
      sizeLabel: doc.meta.sizeLabel,
      favorite: doc.meta.favorite,
      updatedAt: doc.meta.updatedAt,
      thumbnail: thumb,
    };

    const nextIndex = [summary, ...index.filter((p) => p.id !== id)].slice(0, 40);
    saveIndex(nextIndex);
    currentProjectId = id;
    Core.recordHistory(Core.state.activeArea, `Guardado · ${name}`);
    if (homeEl && homeEl.style.display !== "none") renderHome();
    return summary;
  }

  function openProjectById(id) {
    const index = loadIndex();
    const meta = index.find((p) => p.id === id);
    if (!meta) return;

    try {
      const raw = localStorage.getItem(PROJECT_PREFIX + id);
      const doc = raw ? JSON.parse(raw) : null;
      if (doc?.state) {
        if (doc.state.settings) Object.assign(Core.state.settings, doc.state.settings);
        if (doc.state.measuresByArea) {
          Object.keys(doc.state.measuresByArea).forEach((k) => {
            if (Core.state.measuresByArea[k]) {
              Object.assign(Core.state.measuresByArea[k], doc.state.measuresByArea[k]);
            }
          });
        }
        if (doc.state.camera) Object.assign(Core.state.camera, doc.state.camera);
        if (doc.state.camera2D) Object.assign(Core.state.camera2D, doc.state.camera2D);
        if (doc.state.activePreset) Core.state.activePreset = doc.state.activePreset;
        if (doc.state.selectedLayerId) Core.state.selectedLayerId = doc.state.selectedLayerId;
      }
      currentProjectId = id;
      Core.setActiveArea(meta.area || "vector");
      Core.invalidateAll();
      Core.recordHistory(meta.area || "vector", `Aberto · ${meta.name}`);
      hideHome();
    } catch (_) {}
  }

  function createNewProject({ name, area, preset, sizeLabel }) {
    const id = `proj-${Date.now().toString(36)}`;
    currentProjectId = id;
    if (preset) Core.state.activePreset = preset;
    Core.setActiveArea(area || "vector");
    Core.invalidateAll();

    const thumb = captureThumbnail();
    const doc = serializeWorkspaceState({
      id,
      name: (name || "Novo projeto").trim() || "Novo projeto",
      area: area || "vector",
      preset: preset || Core.state.activePreset,
      sizeLabel: sizeLabel || "",
      favorite: false,
    });

    try {
      localStorage.setItem(PROJECT_PREFIX + id, JSON.stringify(doc));
    } catch (_) {}

    const index = loadIndex();
    saveIndex([
      {
        id,
        name: doc.meta.name,
        area: doc.meta.area,
        preset: doc.meta.preset,
        sizeLabel: doc.meta.sizeLabel,
        favorite: false,
        updatedAt: doc.meta.updatedAt,
        thumbnail: thumb,
      },
      ...index,
    ].slice(0, 40));

    Core.recordHistory(doc.meta.area, `Criado · ${doc.meta.name}`);
    hideHome();
  }

  function toggleFavorite(id) {
    const index = loadIndex();
    const next = index.map((p) => (p.id === id ? { ...p, favorite: !p.favorite } : p));
    saveIndex(next);
    renderHome();
  }

  function deleteProject(id) {
    const index = loadIndex().filter((p) => p.id !== id);
    saveIndex(index);
    try {
      localStorage.removeItem(PROJECT_PREFIX + id);
    } catch (_) {}
    if (currentProjectId === id) currentProjectId = null;
    renderHome();
  }

  function exportProjectFile(id) {
    const index = loadIndex();
    const meta = index.find((p) => p.id === id);
    const raw = id ? localStorage.getItem(PROJECT_PREFIX + id) : null;
    const payload = raw ? JSON.parse(raw) : serializeWorkspaceState(meta || {});
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(payload.meta?.name || "robles-projeto").toLowerCase().replace(/[^a-z0-9-_]+/g, "-")}.robles.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function importProjectFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || "{}"));
        const id = `proj-${Date.now().toString(36)}`;
        const name = parsed.meta?.name ? `${parsed.meta.name} (Importado)` : file.name.replace(/\.json$/i, "");
        const area = parsed.meta?.area || parsed.state?.activeArea || "vector";
        const doc = {
          meta: {
            id,
            name,
            area,
            preset: parsed.meta?.preset || "Traço Limpo",
            sizeLabel: parsed.meta?.sizeLabel || "",
            favorite: false,
            updatedAt: new Date().toISOString(),
          },
          state: parsed.state || {},
        };
        localStorage.setItem(PROJECT_PREFIX + id, JSON.stringify(doc));
        const index = loadIndex();
        saveIndex([
          {
            id,
            name,
            area,
            preset: doc.meta.preset,
            sizeLabel: doc.meta.sizeLabel,
            favorite: false,
            updatedAt: doc.meta.updatedAt,
            thumbnail: "",
          },
          ...index,
        ]);
        renderHome();
      } catch (_) {}
    };
    reader.readAsText(file);
  }

  function formatDate(iso) {
    if (!iso) return "Agora";
    try {
      return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
    } catch (_) {
      return "Recente";
    }
  }

  function openNewProjectModal(prefill = {}) {
    const existingModal = document.getElementById("robles-new-project-modal");
    if (existingModal) existingModal.remove();

    const modal = document.createElement("div");
    modal.id = "robles-new-project-modal";
    modal.className = "robles-home-modal-backdrop";
    modal.innerHTML = `
      <div class="robles-home-modal" role="dialog" aria-modal="true" aria-label="Novo projeto">
        <div class="robles-home-modal-head">
          <strong>Novo projeto</strong>
          <button type="button" class="robles-home-icon-btn" data-close title="Fechar">✕</button>
        </div>
        <div class="robles-home-field">
          <label for="rh-proj-name">Nome do documento</label>
          <input id="rh-proj-name" type="text" value="${prefill.name || ""}" placeholder="Ex.: Sabonete Botânico · Rótulo" />
        </div>
        <div class="robles-home-field">
          <label for="rh-proj-area">Persona inicial</label>
          <select id="rh-proj-area">
            <option value="vector" ${prefill.area === "vector" || !prefill.area ? "selected" : ""}>Vetor</option>
            <option value="pixel" ${prefill.area === "pixel" ? "selected" : ""}>Pixel</option>
            <option value="video" ${prefill.area === "video" ? "selected" : ""}>Vídeo</option>
            <option value="3d" ${prefill.area === "3d" ? "selected" : ""}>3D</option>
          </select>
        </div>
        <div class="robles-home-field">
          <label for="rh-proj-size">Dimensões / Referência</label>
          <input id="rh-proj-size" type="text" value="${prefill.sizeLabel || "1080 × 1080 px"}" placeholder="Ex.: 73 × 87 × 23 mm" />
        </div>
        <div class="robles-home-modal-actions">
          <button type="button" class="robles-home-btn" data-cancel>Cancelar</button>
          <button type="button" class="robles-home-btn is-primary" data-create>Criar e abrir</button>
        </div>
      </div>
    `;

    const close = () => modal.remove();
    modal.querySelector("[data-close]").addEventListener("click", close);
    modal.querySelector("[data-cancel]").addEventListener("click", close);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) close();
    });
    modal.querySelector("[data-create]").addEventListener("click", () => {
      const name = modal.querySelector("#rh-proj-name").value;
      const area = modal.querySelector("#rh-proj-area").value;
      const sizeLabel = modal.querySelector("#rh-proj-size").value;
      close();
      createNewProject({
        name,
        area,
        preset: prefill.preset || (Core.PRESETS_BY_AREA?.[area]?.[0] ?? "Paramétrico"),
        sizeLabel,
      });
    });

    document.body.appendChild(modal);
    setTimeout(() => modal.querySelector("#rh-proj-name")?.focus(), 20);
  }

  function renderProjectCard(proj) {
    const areaMeta = Core.getAreaMeta(proj.area);
    return `
      <article class="robles-proj-card" data-open-proj="${proj.id}">
        <div class="robles-proj-thumb">
          ${
            proj.thumbnail
              ? `<img src="${proj.thumbnail}" alt="${proj.name}" />`
              : `<div class="robles-proj-thumb-empty">${areaMeta?.icon || ""}</div>`
          }
          <button
            type="button"
            class="robles-proj-fav ${proj.favorite ? "is-fav" : ""}"
            data-fav-proj="${proj.id}"
            title="${proj.favorite ? "Remover dos favoritos" : "Favoritar"}"
          >${proj.favorite ? "★" : "☆"}</button>
        </div>
        <div class="robles-proj-meta">
          <div class="robles-proj-title" title="${proj.name}">${proj.name}</div>
          <div class="robles-proj-sub">
            <span>${areaMeta?.label || "Vetor"} · ${formatDate(proj.updatedAt)}</span>
            <span class="robles-proj-actions">
              <button type="button" class="robles-mini-btn" data-export-proj="${proj.id}" title="Exportar .robles.json">↓</button>
              <button type="button" class="robles-mini-btn" data-del-proj="${proj.id}" title="Apagar">✕</button>
            </span>
          </div>
        </div>
      </article>
    `;
  }

  function renderHome() {
    if (!homeEl) return;
    const allProjects = loadIndex();
    const recentProjects = allProjects;
    const favProjects = allProjects.filter((p) => p.favorite);

    const tabs = [
      { id: "home", label: "Início" },
      { id: "recent", label: "Recentes" },
      { id: "templates", label: "Meus modelos" },
      { id: "favorites", label: "Favoritos" },
    ];

    let bodyHtml = "";

    if (activeTab === "home") {
      bodyHtml = `
        <section class="robles-home-section">
          <div class="robles-home-sec-head">
            <h2>Documentos recentes</h2>
            ${
              allProjects.length > 0
                ? `<button type="button" class="robles-link-btn" data-switch-tab="recent">Ver todos (${allProjects.length})</button>`
                : `<span>Nenhum projeto ainda</span>`
            }
          </div>
          ${
            recentProjects.length > 0
              ? `<div class="robles-proj-grid">${recentProjects.slice(0, 6).map(renderProjectCard).join("")}</div>`
              : `<div class="robles-empty-box">
                   <p>Ainda não tens projetos guardados neste dispositivo.</p>
                   <button type="button" class="robles-home-btn is-primary" data-new-proj>+ Novo projeto</button>
                 </div>`
          }
        </section>

        <section class="robles-home-section">
          <div class="robles-home-sec-head">
            <h2>Modelos & Pranchas</h2>
            <span>Arranque rápido</span>
          </div>
          <div class="robles-tpl-grid">
            ${TEMPLATES.map(
              (t) => `
              <article class="robles-tpl-card" data-tpl-id="${t.id}">
                <div class="robles-tpl-banner" style="background:${t.accent};">
                  <span class="robles-tpl-tag">${t.sizeLabel}</span>
                </div>
                <div class="robles-tpl-body">
                  <div class="robles-tpl-title">${t.name}</div>
                  <div class="robles-tpl-desc">${t.desc}</div>
                </div>
              </article>
            `
            ).join("")}
          </div>
        </section>
      `;
    } else if (activeTab === "recent") {
      bodyHtml = `
        <section class="robles-home-section">
          <div class="robles-home-sec-head">
            <h2>Recentes</h2>
            <span>${recentProjects.length} ${recentProjects.length === 1 ? "documento" : "documentos"}</span>
          </div>
          ${
            recentProjects.length > 0
              ? `<div class="robles-proj-grid">${recentProjects.map(renderProjectCard).join("")}</div>`
              : `<div class="robles-empty-box"><p>Sem documentos recentes.</p></div>`
          }
        </section>
      `;
    } else if (activeTab === "templates") {
      bodyHtml = `
        <section class="robles-home-section">
          <div class="robles-home-sec-head">
            <h2>Meus modelos</h2>
            <span>${TEMPLATES.length} modelos</span>
          </div>
          <div class="robles-tpl-grid">
            ${TEMPLATES.map(
              (t) => `
              <article class="robles-tpl-card" data-tpl-id="${t.id}">
                <div class="robles-tpl-banner" style="background:${t.accent};">
                  <span class="robles-tpl-tag">${t.sizeLabel}</span>
                </div>
                <div class="robles-tpl-body">
                  <div class="robles-tpl-title">${t.name}</div>
                  <div class="robles-tpl-desc">${t.desc}</div>
                </div>
              </article>
            `
            ).join("")}
          </div>
        </section>
      `;
    } else if (activeTab === "favorites") {
      bodyHtml = `
        <section class="robles-home-section">
          <div class="robles-home-sec-head">
            <h2>Favoritos</h2>
            <span>${favProjects.length} marcados</span>
          </div>
          ${
            favProjects.length > 0
              ? `<div class="robles-proj-grid">${favProjects.map(renderProjectCard).join("")}</div>`
              : `<div class="robles-empty-box"><p>Marca um projeto com ★ para aparecer aqui.</p></div>`
          }
        </section>
      `;
    }

    homeEl.innerHTML = `
      <header class="robles-home-topbar">
        <div class="robles-home-brand">
          <span class="robles-home-logo">${Core.ICONS?.cube3d || ""}</span>
          <div>
            <div class="robles-home-brand-title">Robles Studio</div>
            <div class="robles-home-brand-sub">Projetos & Espaço de Trabalho</div>
          </div>
        </div>

        <nav class="robles-home-tabs" aria-label="Secções iniciais">
          ${tabs
            .map(
              (tb) => `
              <button
                type="button"
                class="robles-home-tab ${activeTab === tb.id ? "is-active" : ""}"
                data-tab="${tb.id}"
              >${tb.label}</button>
            `
            )
            .join("")}
        </nav>

        <div class="robles-home-actions">
          ${
            currentProjectId
              ? `<button type="button" class="robles-home-btn" data-resume>Continuar atual</button>`
              : `<button type="button" class="robles-home-btn" data-enter-studio>Abrir estúdio</button>`
          }
          <label class="robles-home-btn" title="Importar ficheiro de projeto">
            Importar
            <input type="file" accept=".json,.robles" data-import-file style="display:none;" />
          </label>
          <button type="button" class="robles-home-btn is-primary" data-new-proj>+ Novo projeto</button>
        </div>
      </header>

      <main class="robles-home-main">
        ${bodyHtml}
      </main>
    `;

    homeEl.querySelectorAll("[data-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeTab = btn.dataset.tab;
        renderHome();
      });
    });

    homeEl.querySelectorAll("[data-switch-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeTab = btn.dataset.switchTab;
        renderHome();
      });
    });

    homeEl.querySelectorAll("[data-new-proj]").forEach((btn) => {
      btn.addEventListener("click", () => openNewProjectModal());
    });

    homeEl.querySelector("[data-resume]")?.addEventListener("click", hideHome);
    homeEl.querySelector("[data-enter-studio]")?.addEventListener("click", hideHome);

    homeEl.querySelector("[data-import-file]")?.addEventListener("change", (e) => {
      const f = e.target.files?.[0];
      if (f) importProjectFile(f);
    });

    homeEl.querySelectorAll("[data-tpl-id]").forEach((card) => {
      card.addEventListener("click", () => {
        const tpl = TEMPLATES.find((t) => t.id === card.dataset.tplId);
        if (!tpl) return;
        openNewProjectModal({
          name: tpl.name,
          area: tpl.area,
          preset: tpl.preset,
          sizeLabel: tpl.sizeLabel,
        });
      });
    });

    homeEl.querySelectorAll("[data-open-proj]").forEach((card) => {
      card.addEventListener("click", (e) => {
        if (e.target.closest("[data-fav-proj], [data-export-proj], [data-del-proj]")) return;
        openProjectById(card.dataset.openProj);
      });
    });

    homeEl.querySelectorAll("[data-fav-proj]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleFavorite(btn.dataset.favProj);
      });
    });

    homeEl.querySelectorAll("[data-export-proj]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        exportProjectFile(btn.dataset.exportProj);
      });
    });

    homeEl.querySelectorAll("[data-del-proj]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteProject(btn.dataset.delProj);
      });
    });
  }

  function showHome() {
    if (!homeEl) {
      homeEl = document.createElement("div");
      homeEl.id = "robles-home-screen";
      homeEl.className = "robles-home-screen";
      document.body.appendChild(homeEl);
    }
    homeEl.style.display = "flex";
    renderHome();
  }

  function hideHome() {
    if (homeEl) homeEl.style.display = "none";
    Core.emit("ui:update");
    Core.emit("render:request");
  }

  window.RoblesHome = {
    show: showHome,
    hide: hideHome,
    saveCurrentProject,
    openNewProjectModal,
    getCurrentProjectId: () => currentProjectId,
  };

  // Abre no ecrã inicial ao carregar a aplicação
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", showHome);
  } else {
    showHome();
  }
})();