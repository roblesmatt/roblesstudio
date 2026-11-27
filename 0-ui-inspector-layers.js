(() => {
  const Core = window.RoblesCore;
  if (!Core) return;

  window.RoblesInspectorModules = window.RoblesInspectorModules || {};

  const BLEND_MODES = [
    { value: "normal", label: "Normal" },
    { value: "multiply", label: "Multiplicar" },
    { value: "screen", label: "Divisão" },
    { value: "overlay", label: "Sobrepor" },
    { value: "soft-light", label: "Luz Indireta" },
    { value: "difference", label: "Diferença" },
  ];

  const defaultLayers = [
    {
      id: "lyr-1",
      name: "Rótulo Principal · 120g",
      type: "text",
      area: "vector",
      visible: true,
      locked: false,
      opacity: 100,
      blendMode: "normal",
      fill: "#3d2d2d",
      previewType: "text",
      previewText: "Aa",
    },
    {
      id: "lyr-2",
      name: "Moldura Apothecary",
      type: "shape",
      area: "vector",
      visible: true,
      locked: false,
      opacity: 100,
      blendMode: "normal",
      fill: "#84987E",
      previewType: "rect",
    },
    {
      id: "lyr-3",
      name: "Textura Papel Algodão",
      type: "pixel",
      area: "pixel",
      visible: true,
      locked: false,
      opacity: 85,
      blendMode: "multiply",
      fill: "#CEC8B8",
      previewType: "image",
    },
    {
      id: "lyr-4",
      name: "Clipe Botânico 01",
      type: "video",
      area: "video",
      visible: true,
      locked: false,
      opacity: 100,
      blendMode: "normal",
      fill: "#A67B5B",
      previewType: "video",
    },
    {
      id: "lyr-5",
      name: "Molde Sabonete 70x84",
      type: "mesh",
      area: "3d",
      visible: true,
      locked: false,
      opacity: 100,
      blendMode: "normal",
      fill: "#5B9BD5",
      previewType: "cube",
    },
    {
      id: "lyr-6",
      name: "Fundo Base Creme",
      type: "shape",
      area: "vector",
      visible: true,
      locked: true,
      opacity: 100,
      blendMode: "normal",
      fill: "#FAF6EE",
      previewType: "fill",
    },
  ];

  let thumbTimer = null;
  let draggedLayerId = null;

  function getLayersStore() {
    if (Core.state) {
      if (!Array.isArray(Core.state.layers) || Core.state.layers.length === 0) {
        Core.state.layers = defaultLayers.map((item) => ({ ...item }));
      }
      return Core.state.layers;
    }
    return defaultLayers;
  }

  function getSelectedLayer(layers) {
    const selId = Core.state?.selectedLayerId;
    return layers.find((l) => l.id === selId) || layers[0] || null;
  }

  function selectLayer(layerId) {
    if (Core.state) {
      Core.state.selectedLayerId = layerId;
    }
    Core.emit?.("layer:select", { id: layerId });
    Core.emit?.("layers:update");
    Core.emit?.("render:request");
  }

  function captureSingleLayerThumbnail(layer, fallbackCanvas) {
    if (!layer) return false;

    const source = layer.canvas || layer.offscreenCanvas || fallbackCanvas;
    if (!source || typeof source.width !== "number" || source.width === 0 || source.height === 0) {
      return false;
    }

    try {
      const thumbCanvas = document.createElement("canvas");
      thumbCanvas.width = 52;
      thumbCanvas.height = 40;
      const ctx = thumbCanvas.getContext("2d");
      if (!ctx) return false;

      ctx.clearRect(0, 0, thumbCanvas.width, thumbCanvas.height);

      const b = layer.bounds;
      if (b && b.w > 0 && b.h > 0) {
        ctx.drawImage(
          source,
          Math.max(0, b.x),
          Math.max(0, b.y),
          Math.min(source.width, b.w),
          Math.min(source.height, b.h),
          0,
          0,
          thumbCanvas.width,
          thumbCanvas.height
        );
      } else if (layer.canvas || layer.offscreenCanvas) {
        ctx.drawImage(source, 0, 0, thumbCanvas.width, thumbCanvas.height);
      } else {
        return false;
      }

      const nextUrl = thumbCanvas.toDataURL("image/png", 0.75);
      if (nextUrl && nextUrl !== layer.thumbnailUrl) {
        layer.thumbnailUrl = nextUrl;
        return true;
      }
    } catch (_) {
      // Ignora erros de canvas sem CORS
    }
    return false;
  }

  function scheduleThumbnailRefresh() {
    if (thumbTimer) clearTimeout(thumbTimer);
    thumbTimer = setTimeout(() => {
      const layers = getLayersStore();
      const viewportCanvas = document.querySelector(".viewport canvas, #main-canvas, canvas");
      let changed = false;

      const selected = getSelectedLayer(layers);
      if (selected && captureSingleLayerThumbnail(selected, viewportCanvas)) {
        changed = true;
      }

      for (const layer of layers) {
        if (!layer.thumbnailUrl && captureSingleLayerThumbnail(layer, viewportCanvas)) {
          changed = true;
        }
      }

      if (changed) {
        Core.emit?.("layers:thumbnail-ready");
      }
    }, 160);
  }

  function moveLayerInStack(fromId, toId) {
    if (!fromId || !toId || fromId === toId) return false;
    const layers = getLayersStore();
    const fromIdx = layers.findIndex((l) => l.id === fromId);
    const toIdx = layers.findIndex((l) => l.id === toId);
    if (fromIdx === -1 || toIdx === -1) return false;

    const [moved] = layers.splice(fromIdx, 1);
    layers.splice(toIdx, 0, moved);
    Core.emit?.("layers:reorder", { id: fromId, toIndex: toIdx });
    Core.emit?.("layers:update");
    Core.emit?.("render:request");
    return true;
  }

  function nudgeLayerOrder(layerId, delta) {
    const layers = getLayersStore();
    const idx = layers.findIndex((l) => l.id === layerId);
    if (idx === -1) return false;
    const targetIdx = idx + delta;
    if (targetIdx < 0 || targetIdx >= layers.length) return false;

    const [moved] = layers.splice(idx, 1);
    layers.splice(targetIdx, 0, moved);
    Core.emit?.("layers:reorder", { id: layerId, toIndex: targetIdx });
    Core.emit?.("layers:update");
    Core.emit?.("render:request");
    return true;
  }

  function renderTypeBadge(layer) {
    const t = (layer.type || "shape").toLowerCase();
    if (t === "text" || t === "typography") {
      return `<span style="font-weight:700;font-size:11px;font-family:serif;opacity:0.78;">A</span>`;
    }
    if (t === "pixel" || t === "image") {
      return `
        <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="2" y="2" width="12" height="12" rx="1.5"/>
          <circle cx="5.5" cy="5.5" r="1.2" fill="currentColor"/>
          <path d="M2.5 12l3.5-3.5 2.5 2.5 2-2 3 3"/>
        </svg>
      `;
    }
    if (t === "video") {
      return `
        <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4">
          <rect x="2" y="3" width="12" height="10" rx="1.5"/>
          <polygon points="6.5,5.5 11,8 6.5,10.5" fill="currentColor" stroke="none"/>
        </svg>
      `;
    }
    if (t === "mesh" || t === "3d") {
      return `
        <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4">
          <polygon points="8 1.5 14 5 14 11 8 14.5 2 11 2 5"/>
          <path d="M8 8v6.5M2 5l6 3 6-3"/>
        </svg>
      `;
    }
    return `
      <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4">
        <rect x="2.5" y="2.5" width="5" height="5" rx="0.8"/>
        <polygon points="11.5,2.5 14.5,7.5 8.5,7.5"/>
        <circle cx="11.5" cy="11.5" r="2.5"/>
      </svg>
    `;
  }

  function renderLayerThumbnail(layer) {
    if (layer.thumbnailUrl) {
      return `<img src="${layer.thumbnailUrl}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" />`;
    }

    const fill = layer.fill || "#84987E";
    const type = layer.previewType || layer.type || "rect";

    if (type === "text") {
      return `
        <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#FAF6EE;color:#3d2d2d;font-weight:700;font-size:11px;letter-spacing:-0.02em;">
          ${layer.previewText || "Aa"}
        </div>
      `;
    }

    if (type === "image" || type === "pixel") {
      return `
        <svg width="26" height="20" viewBox="0 0 26 20" fill="none" style="display:block;">
          <rect width="26" height="20" fill="#E6DEC8"/>
          <circle cx="8" cy="6.5" r="2.2" fill="#E06D53"/>
          <path d="M0 17l7.5-7 5 4.5 4.5-4 9 6.5V20H0z" fill="#84987E"/>
        </svg>
      `;
    }

    if (type === "video") {
      return `
        <svg width="26" height="20" viewBox="0 0 26 20" fill="none" style="display:block;">
          <rect width="26" height="20" fill="#3d2d2d"/>
          <rect x="2" y="2" width="2" height="2" fill="#CEC8B8"/>
          <rect x="2" y="6" width="2" height="2" fill="#CEC8B8"/>
          <rect x="2" y="10" width="2" height="2" fill="#CEC8B8"/>
          <rect x="2" y="14" width="2" height="2" fill="#CEC8B8"/>
          <rect x="22" y="2" width="2" height="2" fill="#CEC8B8"/>
          <rect x="22" y="6" width="2" height="2" fill="#CEC8B8"/>
          <rect x="22" y="10" width="2" height="2" fill="#CEC8B8"/>
          <rect x="22" y="14" width="2" height="2" fill="#CEC8B8"/>
          <polygon points="11,6.5 17,10 11,13.5" fill="#FAF6EE"/>
        </svg>
      `;
    }

    if (type === "cube" || type === "mesh" || type === "3d") {
      return `
        <svg width="26" height="20" viewBox="0 0 26 20" fill="none" style="display:block;">
          <rect width="26" height="20" fill="#EDE7D9"/>
          <polygon points="13 3 20 7 13 11 6 7" fill="#E6B84C" stroke="#2D2323" stroke-width="1"/>
          <polygon points="6 7 13 11 13 17 6 13" fill="#5B9BD5" stroke="#2D2323" stroke-width="1"/>
          <polygon points="20 7 13 11 13 17 20 13" fill="#63B097" stroke="#2D2323" stroke-width="1"/>
        </svg>
      `;
    }

    if (type === "fill") {
      return `<div style="width:100%;height:100%;background:${fill};"></div>`;
    }

    return `
      <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background-image:linear-gradient(45deg,rgba(61,45,45,0.08) 25%,transparent 25%),linear-gradient(-45deg,rgba(61,45,45,0.08) 25%,transparent 25%),linear-gradient(45deg,transparent 75%,rgba(61,45,45,0.08) 75%),linear-gradient(-45deg,transparent 75%,rgba(61,45,45,0.08) 75%);background-size:6px 6px;background-position:0 0,0 3px,3px -3px,-3px 0;">
        <span style="width:16px;height:10px;border-radius:2px;background:${fill};border:1px solid rgba(45,35,35,0.45);display:block;"></span>
      </div>
    `;
  }

  function renderEyeIcon(visible) {
    if (window.RoblesIcons?.get) {
      return window.RoblesIcons.get(visible ? "eye" : "eyeOff", null, 13);
    }
    return visible ? "◉" : "○";
  }

  Core.on?.("render:request", scheduleThumbnailRefresh);
  Core.on?.("layers:update", scheduleThumbnailRefresh);

  window.RoblesInspectorModules.layers = {
    captureThumbnail: captureSingleLayerThumbnail,

    getHeader(ctx = {}) {
      const all = getLayersStore();
      const filtered = ctx.filterArea
        ? all.filter((l) => !l.area || l.area === ctx.filterArea || ctx.filterArea === "vector")
        : all;

      return {
        title: "Camadas",
        counter: `${filtered.length}`,
      };
    },

    render(ctx = {}) {
      const allLayers = getLayersStore();
      const layers = ctx.filterArea
        ? allLayers.filter((l) => !l.area || l.area === ctx.filterArea || ctx.filterArea === "vector")
        : allLayers;

      const activeLayer = getSelectedLayer(layers) || getSelectedLayer(allLayers);
      const opacityVal = activeLayer?.opacity ?? 100;
      const blendVal = activeLayer?.blendMode || "normal";
      const isLocked = Boolean(activeLayer?.locked);

      const topControlsBar = `
        <div class="layers-affinity-topbar" style="display:flex;align-items:center;gap:4px;padding:4px 4px 6px;border-bottom:1px solid rgba(61,45,45,0.14);margin-bottom:4px;">
          <label style="display:inline-flex;align-items:center;gap:3px;font-size:10px;background:rgba(61,45,45,0.07);padding:2px 5px;border-radius:5px;border:1px solid rgba(61,45,45,0.14);" title="Opacidade da camada">
            <span style="opacity:0.75;">Opac.</span>
            <input
              type="number"
              min="0"
              max="100"
              value="${opacityVal}"
              data-layer-opacity
              style="width:32px;border:none;background:transparent;font-size:10px;font-weight:600;color:inherit;text-align:right;outline:none;"
            />
            <span style="opacity:0.7;">%</span>
          </label>

          <select
            data-layer-blend
            title="Modo de mesclagem"
            style="flex:1;min-width:0;font-size:10px;padding:2px 4px;border-radius:5px;border:1px solid rgba(61,45,45,0.16);background:rgba(255,255,255,0.45);color:inherit;outline:none;cursor:pointer;"
          >
            ${BLEND_MODES.map(
              (m) =>
                `<option value="${m.value}" ${blendVal === m.value ? "selected" : ""}>${m.label}</option>`
            ).join("")}
          </select>

          <button
            type="button"
            data-layer-lock
            title="${isLocked ? "Desbloquear camada" : "Bloquear camada"}"
            style="width:22px;height:20px;display:inline-flex;align-items:center;justify-content:center;border-radius:5px;border:1px solid rgba(61,45,45,0.16);background:${isLocked ? "#3d2d2d" : "rgba(255,255,255,0.4)"};color:${isLocked ? "#CEC8B8" : "inherit"};cursor:pointer;font-size:10px;"
          >${isLocked ? "🔒" : "🔓"}</button>
        </div>
      `;

      const rowsHtml =
        layers.length === 0
          ? `<div class="history-step-row" style="justify-content:center;opacity:0.65;"><span>Nenhuma camada nesta área</span></div>`
          : layers
              .map((layer) => {
                const isSelected = activeLayer && layer.id === activeLayer.id;
                const rowOpacity = layer.visible === false ? "0.48" : "1";
                return `
                  <div
                    class="history-step-row ${isSelected ? "is-current" : ""}"
                    data-layer-row="${layer.id}"
                    draggable="true"
                    style="display:flex;align-items:center;justify-content:space-between;gap:6px;padding:4px 5px;opacity:${rowOpacity};${isSelected ? "background:rgba(61,45,45,0.13);font-weight:600;" : ""}"
                  >
                    <div style="display:flex;align-items:center;gap:5px;min-width:0;flex:1;">
                      <span style="width:13px;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;cursor:grab;" title="Arrastar para reordenar">
                        ${renderTypeBadge(layer)}
                      </span>

                      <div
                        class="layer-thumb-box"
                        style="width:26px;height:20px;border-radius:3px;overflow:hidden;border:1px solid rgba(45,35,35,0.28);flex-shrink:0;background:#FAF6EE;"
                      >
                        ${renderLayerThumbnail(layer)}
                      </div>

                      <span
                        data-layer-name="${layer.id}"
                        title="${layer.name}"
                        style="font-size:11.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;"
                      >${layer.name}</span>
                    </div>

                    <div style="display:inline-flex;align-items:center;gap:3px;flex-shrink:0;">
                      ${layer.locked ? `<span style="font-size:9px;opacity:0.65;" title="Bloqueada">🔒</span>` : ""}
                      <button
                        type="button"
                        data-layer-vis="${layer.id}"
                        title="${layer.visible === false ? "Mostrar camada" : "Ocultar camada"}"
                        style="width:20px;height:18px;display:inline-flex;align-items:center;justify-content:center;border:none;background:transparent;cursor:pointer;padding:0;opacity:0.85;"
                      >${renderEyeIcon(layer.visible !== false)}</button>
                    </div>
                  </div>
                `;
              })
              .join("");

      const footerActionsBar = `
        <div
          class="history-actions-bar"
          style="display:flex;align-items:center;gap:4px;padding-top:6px;margin-top:6px;border-top:1px solid rgba(61,45,45,0.14);"
        >
          <button
            type="button"
            class="rset-action-btn"
            data-layer-action="add"
            title="Nova Camada"
            style="flex:1;padding:4px 5px;font-size:10.5px;display:inline-flex;align-items:center;justify-content:center;"
          >+ Camada</button>

          <button
            type="button"
            class="rset-action-btn"
            data-layer-action="move-up"
            title="Trazer para frente"
            style="width:24px;padding:4px 0;font-size:10.5px;"
          >↑</button>

          <button
            type="button"
            class="rset-action-btn"
            data-layer-action="move-down"
            title="Enviar para trás"
            style="width:24px;padding:4px 0;font-size:10.5px;"
          >↓</button>

          <button
            type="button"
            class="rset-action-btn"
            data-layer-action="duplicate"
            title="Duplicar Camada"
            style="flex:1;padding:4px 5px;font-size:10.5px;"
          >Duplicar</button>

          <button
            type="button"
            class="rset-action-btn"
            data-layer-action="isolate"
            title="Isolar Camada"
            style="flex:1;padding:4px 5px;font-size:10.5px;"
          >Isolar</button>

          <button
            type="button"
            class="rset-action-btn"
            data-layer-action="delete"
            title="Excluir Camada"
            style="width:24px;padding:4px 0;font-size:10.5px;display:inline-flex;align-items:center;justify-content:center;"
          >🗑</button>
        </div>
      `;

      return `${topControlsBar}${rowsHtml}${footerActionsBar}`;
    },

    bindEvents(container, rerender, ctx = {}) {
      const layers = getLayersStore();
      const activeLayer = getSelectedLayer(layers);

      container.querySelectorAll("[data-layer-row]").forEach((row) => {
        const layerId = row.dataset.layerRow;

        row.addEventListener("click", (e) => {
          if (e.target.closest("button, input, select")) return;
          e.stopPropagation();
          selectLayer(layerId);
          rerender();
        });

        row.addEventListener("dragstart", (e) => {
          draggedLayerId = layerId;
          row.style.opacity = "0.55";
          if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/plain", layerId);
          }
        });

        row.addEventListener("dragover", (e) => {
          e.preventDefault();
          row.style.outline = "1px dashed #3d2d2d";
        });

        row.addEventListener("dragleave", () => {
          row.style.outline = "none";
        });

        row.addEventListener("drop", (e) => {
          e.preventDefault();
          e.stopPropagation();
          row.style.outline = "none";
          const sourceId = draggedLayerId || e.dataTransfer?.getData("text/plain");
          draggedLayerId = null;
          if (moveLayerInStack(sourceId, layerId)) {
            rerender();
          }
        });

        row.addEventListener("dragend", () => {
          draggedLayerId = null;
          const currentStore = getLayersStore();
          const currentLayer = currentStore.find((l) => l.id === layerId);
          row.style.opacity = currentLayer && currentLayer.visible === false ? "0.48" : "1";
          row.style.outline = "none";
        });
      });

      container.querySelectorAll("[data-layer-name]").forEach((labelEl) => {
        labelEl.addEventListener("dblclick", (e) => {
          e.stopPropagation();
          const target = layers.find((l) => l.id === labelEl.dataset.layerName);
          if (!target) return;
          const nextName = window.prompt("Renomear camada:", target.name);
          if (nextName && nextName.trim()) {
            target.name = nextName.trim();
            Core.emit?.("layers:update");
            rerender();
          }
        });
      });

      container.querySelectorAll("[data-layer-vis]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const target = layers.find((l) => l.id === btn.dataset.layerVis);
          if (!target) return;
          target.visible = target.visible === false ? true : false;
          Core.emit?.("layers:update");
          Core.emit?.("render:request");
          rerender();
        });
      });

      const opacityInput = container.querySelector("[data-layer-opacity]");
      if (opacityInput && activeLayer) {
        opacityInput.addEventListener("click", (e) => e.stopPropagation());
        opacityInput.addEventListener("change", () => {
          const clamped = Math.max(0, Math.min(100, Number(opacityInput.value) || 0));
          activeLayer.opacity = clamped;
          Core.emit?.("layers:update");
          Core.emit?.("render:request");
          rerender();
        });
      }

      const blendSelect = container.querySelector("[data-layer-blend]");
      if (blendSelect && activeLayer) {
        blendSelect.addEventListener("click", (e) => e.stopPropagation());
        blendSelect.addEventListener("change", () => {
          activeLayer.blendMode = blendSelect.value;
          Core.emit?.("layers:update");
          Core.emit?.("render:request");
          rerender();
        });
      }

      const lockBtn = container.querySelector("[data-layer-lock]");
      if (lockBtn && activeLayer) {
        lockBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          activeLayer.locked = !activeLayer.locked;
          Core.emit?.("layers:update");
          rerender();
        });
      }

      container.querySelectorAll("[data-layer-action]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const action = btn.dataset.layerAction;

          if (action === "add") {
            const area = ctx.filterArea || Core.state?.activeArea || "vector";
            const newLayer = {
              id: `lyr-${Date.now()}`,
              name: `Camada ${layers.length + 1}`,
              type:
                area === "pixel"
                  ? "pixel"
                  : area === "video"
                  ? "video"
                  : area === "3d"
                  ? "mesh"
                  : "shape",
              area,
              visible: true,
              locked: false,
              opacity: 100,
              blendMode: "normal",
              fill: "#84987E",
              previewType:
                area === "pixel"
                  ? "image"
                  : area === "video"
                  ? "video"
                  : area === "3d"
                  ? "cube"
                  : "rect",
            };
            layers.unshift(newLayer);
            selectLayer(newLayer.id);
            rerender();
            return;
          }

          if (!activeLayer) return;

          if (action === "move-up") {
            if (nudgeLayerOrder(activeLayer.id, -1)) rerender();
          } else if (action === "move-down") {
            if (nudgeLayerOrder(activeLayer.id, 1)) rerender();
          } else if (action === "duplicate") {
            const copy = {
              ...activeLayer,
              id: `lyr-${Date.now()}`,
              name: `${activeLayer.name} (cópia)`,
            };
            const idx = layers.indexOf(activeLayer);
            layers.splice(Math.max(0, idx), 0, copy);
            selectLayer(copy.id);
            rerender();
          } else if (action === "isolate") {
            const othersVisible = layers.some((l) => l.id !== activeLayer.id && l.visible !== false);
            layers.forEach((l) => {
              l.visible = othersVisible ? l.id === activeLayer.id : true;
            });
            Core.emit?.("layers:update");
            Core.emit?.("render:request");
            rerender();
          } else if (action === "delete") {
            if (layers.length <= 1) return;
            const idx = layers.indexOf(activeLayer);
            if (idx !== -1) {
              layers.splice(idx, 1);
              selectLayer(layers[Math.min(idx, layers.length - 1)].id);
              rerender();
            }
          }
        });
      });
    },
  };
})();