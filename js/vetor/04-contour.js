(() => {
  window.RoblesVectorTools = window.RoblesVectorTools || [];

  const CONTOUR_MAIN_ICON = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11.5" cy="12.5" r="4" fill="currentColor"/>
      <path d="M11.5 3.5a9 9 0 0 0-9 9 9 9 0 0 0 9 9 9 9 0 0 0 9-9" stroke-dasharray="2.5 2.5"/>
      <path d="M16.5 4.5h4v4"/>
      <path d="M20.5 4.5l-4.5 4.5"/>
    </svg>
  `;

  // Toast superior discreto para feedback imediato nos ciclos e no scrubbing
  function showCycleBadge(text) {
    let badge = document.getElementById("robles-cycle-toast");
    if (!badge) {
      badge = document.createElement("div");
      badge.id = "robles-cycle-toast";
      Object.assign(badge.style, {
        position: "fixed",
        top: "58px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: "120",
        padding: "5px 12px",
        borderRadius: "999px",
        background: "rgba(24, 22, 21, 0.92)",
        border: "1px solid rgba(245, 158, 11, 0.45)",
        color: "#f59e0b",
        font: "700 11px/1 ui-monospace, monospace",
        pointerEvents: "none",
        transition: "opacity 0.2s ease",
        boxShadow: "0 6px 18px rgba(0,0,0,0.28)",
      });
      document.body.appendChild(badge);
    }
    badge.textContent = text;
    badge.style.opacity = "1";
    clearTimeout(badge._timer);
    badge._timer = setTimeout(() => {
      badge.style.opacity = "0";
    }, 1200);
  }

  function computeOffsetPolygon(points, offset) {
    if (!Array.isArray(points) || points.length < 3 || Math.abs(offset) < 0.5) {
      return points.map((p) => ({ x: p.x, y: p.y }));
    }
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const a = points[i];
      const b = points[(i + 1) % points.length];
      area += (b.x - a.x) * (b.y + a.y);
    }
    const sign = area >= 0 ? 1 : -1;
    const n = points.length;
    const result = [];

    for (let i = 0; i < n; i++) {
      const prev = points[(i - 1 + n) % n];
      const curr = points[i];
      const next = points[(i + 1) % n];

      const e1x = curr.x - prev.x, e1y = curr.y - prev.y;
      const e2x = next.x - curr.x, e2y = next.y - curr.y;
      const l1 = Math.hypot(e1x, e1y) || 1;
      const l2 = Math.hypot(e2x, e2y) || 1;

      const n1x = (e1y / l1) * sign;
      const n1y = (-e1x / l1) * sign;
      const n2x = (e2y / l2) * sign;
      const n2y = (-e2x / l2) * sign;

      let bx = n1x + n2x;
      let by = n1y + n2y;
      const bl = Math.hypot(bx, by) || 1;
      bx /= bl;
      by /= bl;

      const dot = Math.max(0.35, n1x * bx + n1y * by);
      const dist = offset / dot;

      result.push({ x: curr.x + bx * dist, y: curr.y + by * dist });
    }
    return result;
  }

  function cloneAsOffsetShape(source, offsetPx) {
    if (!source || !Array.isArray(source.points) || source.points.length < 3) return null;
    return {
      id: `contour-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
      type: "shape",
      closed: true,
      opacity: 1,
      fill: offsetPx > 0 ? "rgba(245, 158, 11, 0.14)" : "rgba(255, 255, 255, 0.45)",
      stroke: source.stroke || "#3d2d2d",
      strokeWidth: source.strokeWidth || 2,
      dash: [],
      cornerRadius: Math.max(0, (source.cornerRadius || 0) + (offsetPx > 0 ? offsetPx * 0.5 : -offsetPx * 0.5)),
      gradient: "none",
      points: computeOffsetPolygon(source.points, offsetPx),
    };
  }

  function translatePath(path, dx, dy) {
    if (!path) return;
    if (path.type === "text" || path.type === "arcText") {
      path.x = (path.x || 0) + dx;
      path.y = (path.y || 0) + dy;
    }
    if (Array.isArray(path.points)) {
      path.points = path.points.map((p) => ({ x: p.x + dx, y: p.y + dy }));
    }
    if (Array.isArray(path._baseAlignPoints)) {
      path._baseAlignPoints = path._baseAlignPoints.map((p) => ({ x: p.x + dx, y: p.y + dy }));
    }
  }

  // =========================================================================
  // NÍVEL 2: SCRUBBING (Arrastar dedo/Apple Pencil sobre o botão da barra direita)
  // =========================================================================
  function bindButtonScrubbing(ctx) {
    const rightBar = document.querySelector(".hud-right");
    if (!rightBar) return;

    rightBar.style.display = "flex";
    rightBar.style.flexDirection = "column";
    rightBar.style.gridTemplateColumns = "";
    rightBar.style.overflow = "visible";

    const scrubTargets = ["strokeWidthStep", "contourInteractive"];
    scrubTargets.forEach((variantId) => {
      const btn = rightBar.querySelector(`[data-vec-variant="${variantId}"]`);
      if (!btn || btn.dataset.scrubBound === "true") return;
      btn.dataset.scrubBound = "true";

      btn.addEventListener("pointerdown", (e) => {
        const sel = ctx.getSelectedPath();
        if (!sel) return;

        const startX = e.clientX;
        const startWidth = sel.strokeWidth ?? 2;
        const startOffset = ctx.state._lastContourOffset || 0;
        const basePts = Array.isArray(sel.points) ? sel.points.map((p) => ({ x: p.x, y: p.y })) : null;
        let didScrub = false;

        const onMove = (ev) => {
          const dx = ev.clientX - startX;
          if (!didScrub && Math.abs(dx) < 6) return;

          if (!didScrub) {
            didScrub = true;
            ctx.snapshot();
          }

          if (variantId === "strokeWidthStep") {
            const nextW = Math.max(0, Math.min(24, Math.round((startWidth + dx * 0.12) * 10) / 10));
            if (nextW > 0 && (!sel.stroke || sel.stroke === "transparent")) {
              sel.stroke = ctx.state.activeStroke || "#3d2d2d";
            }
            sel.strokeWidth = nextW;
            showCycleBadge(`Largura: ${nextW.toFixed(1)} pt`);
          } else if (variantId === "contourInteractive" && basePts && basePts.length >= 3) {
            const nextOff = Math.max(-60, Math.min(120, Math.round(startOffset + dx * 0.5)));
            ctx.state._lastContourOffset = nextOff;
            sel.points = computeOffsetPolygon(basePts, nextOff);
            sel._baseAlignPoints = sel.points.map((p) => ({ x: p.x, y: p.y }));
            showCycleBadge(`Offset: ${nextOff > 0 ? "+" + nextOff : nextOff} px`);
          }

          ctx.sync();
        };

        const onUp = () => {
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerup", onUp);
          if (didScrub) {
            btn.dataset.suppressClick = "true";
            setTimeout(() => {
              btn.dataset.suppressClick = "false";
            }, 60);
          }
        };

        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
      });
    });
  }

  // =========================================================================
  // NÍVEL 3: BOTTOM SHEET CENTRAL (Estilo Histórico + Sliders em Barras Verticais)
  // =========================================================================
  function syncContourSheet(ctx) {
    let sheet = document.getElementById("robles-contour-sheet");
    const isContourActive = ctx.ws?.activeFamilyId === "contourGroup";

    if (!isContourActive || !ctx.state._contourSheetOpen) {
      if (sheet) sheet.style.display = "none";
      return;
    }

    if (!sheet) {
      sheet = document.createElement("div");
      sheet.id = "robles-contour-sheet";
      sheet.className = "robles-bottom-sheet";
      document.body.appendChild(sheet);
    }

    const current = ctx.getSelectedPath();
    const b = current ? ctx.getPathBounds(current) : { cx: 0, cy: 0 };
    const sw = current ? (current.strokeWidth ?? 2.2) : 2.2;
    const miter = current ? (current.miterLimit ?? 1.5) : 1.5;
    const offsetVal = ctx.state._lastContourOffset || 0;
    const styleMode = !current || sw === 0 ? "none" : (current.dash?.length ? (current.dash[0] < 3 ? "dot" : "dash") : "solid");
    const joinMode = current?.lineJoin || "round";

    const swPct = Math.max(0, Math.min(100, (sw / 24) * 100));
    const offPct = Math.max(0, Math.min(100, ((offsetVal + 40) / 100) * 100));

    sheet.style.display = "flex";
    sheet.innerHTML = `
      <div class="rbs-tabs">
        <button type="button" class="rbs-tab ${styleMode === "solid" ? "is-active" : ""}" data-style="solid">Sólido</button>
        <button type="button" class="rbs-tab ${styleMode === "dash" ? "is-active" : ""}" data-style="dash">Tracejado</button>
        <button type="button" class="rbs-tab ${styleMode === "dot" ? "is-active" : ""}" data-style="dot">Pontilhado</button>
        <button type="button" class="rbs-tab ${styleMode === "none" ? "is-active" : ""}" data-style="none">Sem</button>
      </div>

      <div class="rbs-header">
        <span class="rbs-title">Contorno &amp; Traçado</span>
        <button type="button" class="rbs-close-btn" data-action="close">Fechar</button>
      </div>

      <div class="rbs-grid">
        <div class="rbs-field">
          <div class="rbs-label-row">
            <span>Largura</span>
            <span class="rbs-val" id="rbs-val-sw">${Number(sw).toFixed(1)} pt</span>
          </div>
          <input class="rbs-tick-slider" type="range" min="0" max="24" step="0.1" value="${sw}" style="--pct:${swPct}%" data-prop="strokeWidth">
        </div>

        <div class="rbs-field">
          <div class="rbs-label-row">
            <span>Offset Paralelo</span>
            <span class="rbs-val" id="rbs-val-off">${offsetVal > 0 ? "+" + offsetVal : offsetVal} px</span>
          </div>
          <input class="rbs-tick-slider" type="range" min="-40" max="60" step="1" value="${offsetVal}" style="--pct:${offPct}%" data-prop="offset">
        </div>

        <div class="rbs-field">
          <div class="rbs-label-row">
            <span>Junção / Mitra</span>
            <span class="rbs-val">${miter}</span>
          </div>
          <div class="rbs-inline">
            <select data-prop="joinMode">
              <option value="round" ${joinMode === "round" ? "selected" : ""}>Redonda</option>
              <option value="bevel" ${joinMode === "bevel" ? "selected" : ""}>Chanfro</option>
              <option value="miter" ${joinMode === "miter" ? "selected" : ""}>Mitra</option>
            </select>
            <input class="rbs-num" type="number" step="0.5" min="1" max="10" value="${miter}" data-prop="miterLimit">
          </div>
        </div>

        <div class="rbs-field">
          <div class="rbs-label-row">
            <span>Posição X / Y</span>
            <span class="rbs-val">${Math.round(b.cx)}, ${Math.round(b.cy)}</span>
          </div>
          <div class="rbs-inline">
            <input class="rbs-num" type="number" step="1" value="${Math.round(b.cx)}" data-prop="posX">
            <input class="rbs-num" type="number" step="1" value="${Math.round(b.cy)}" data-prop="posY">
          </div>
        </div>
      </div>
    `;

    sheet.querySelectorAll("[data-style]").forEach((tab) => {
      tab.onclick = () => {
        const sel = ctx.getSelectedPath();
        if (!sel) return;
        const m = tab.dataset.style;
        ctx.snapshot();
        if (m === "none") {
          sel.strokeWidth = 0;
        } else {
          if (!sel.stroke || sel.stroke === "transparent") sel.stroke = ctx.state.activeStroke || "#3d2d2d";
          if (!sel.strokeWidth || sel.strokeWidth <= 0) sel.strokeWidth = 2.2;
          sel.dash = m === "dash" ? [6, 4] : m === "dot" ? [1.5, 4.5] : [];
        }
        syncContourSheet(ctx);
        ctx.sync();
      };
    });

    sheet.querySelectorAll("input, select").forEach((el) => {
      const handler = (e) => {
        const sel = ctx.getSelectedPath();
        if (!sel) return;
        const prop = e.target.dataset.prop;

        if (prop === "strokeWidth") {
          const val = parseFloat(e.target.value) || 0;
          e.target.style.setProperty("--pct", `${(val / 24) * 100}%`);
          if (val > 0 && (!sel.stroke || sel.stroke === "transparent")) sel.stroke = ctx.state.activeStroke || "#3d2d2d";
          sel.strokeWidth = val;
          const lbl = sheet.querySelector("#rbs-val-sw");
          if (lbl) lbl.textContent = `${val.toFixed(1)} pt`;
        } else if (prop === "offset" && Array.isArray(sel.points)) {
          const val = parseFloat(e.target.value) || 0;
          e.target.style.setProperty("--pct", `${((val + 40) / 100) * 100}%`);
          if (!sel._baseOffsetPts) sel._baseOffsetPts = sel.points.map((p) => ({ x: p.x, y: p.y }));
          ctx.state._lastContourOffset = val;
          sel.points = computeOffsetPolygon(sel._baseOffsetPts, val);
          const lbl = sheet.querySelector("#rbs-val-off");
          if (lbl) lbl.textContent = `${val > 0 ? "+" + val : val} px`;
        } else if (prop === "joinMode") {
          sel.lineJoin = e.target.value;
        } else if (prop === "miterLimit") {
          sel.miterLimit = parseFloat(e.target.value) || 1.5;
        } else if (prop === "posX") {
          const val = parseFloat(e.target.value) || 0;
          const curB = ctx.getPathBounds(sel);
          translatePath(sel, val - curB.cx, 0);
        } else if (prop === "posY") {
          const val = parseFloat(e.target.value) || 0;
          const curB = ctx.getPathBounds(sel);
          translatePath(sel, 0, val - curB.cy);
        }
        ctx.sync();
      };
      el.oninput = handler;
      el.onchange = handler;
    });

    sheet.querySelector('[data-action="close"]').onclick = () => {
      ctx.state._contourSheetOpen = false;
      syncContourSheet(ctx);
      ctx.sync();
    };
  }

  function isClickSuppressed(variantId) {
    const btn = document.querySelector(`.hud-right [data-vec-variant="${variantId}"]`);
    return btn?.dataset.suppressClick === "true";
  }

  const contourToolFamily = {
    id: "contourGroup",
    shortcut: "o",
    submodes: ["normal", "typography", "layout"],
    order: 4,
    label: "Contornar & Traçado",
    description: "Toque para ciclar, deslize sobre o botão para ajustar fino ou toque em •••.",
    preview: "",

    variants: [
      {
        id: "contourInteractive",
        label: "Contorno Paralelo (O)",
        description: "Arraste na tela (ou deslize sobre este ícone) para expandir/contrair o contorno.",
        preview: "",
        icon: CONTOUR_MAIN_ICON,
      },
      {
        id: "contourDuplicate",
        label: "Gerar Contorno (+14px / -12px)",
        description: "1º toque cria contorno externo (+14px); 2º toque cria moldura interna (-12px).",
        preview: "",
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="7" y="7" width="10" height="10" rx="2"/><rect x="3" y="3" width="18" height="18" rx="4" stroke-dasharray="3 2"/></svg>`,
        onAction(ctx) {
          const current = ctx.getSelectedPath();
          if (!current || !Array.isArray(current.points) || current.points.length < 3) return;
          const offsets = [14, -12];
          const step = (ctx.state._contourGenStep || 0) % offsets.length;
          ctx.state._contourGenStep = step + 1;

          const val = offsets[step];
          const copy = cloneAsOffsetShape(current, val);
          if (!copy) return;

          ctx.snapshot();
          if (val > 0) {
            const idx = Math.max(0, ctx.ws.selectedIndex);
            ctx.ws.paths.splice(idx, 0, copy);
            ctx.ws.selectedIndex = idx;
          } else {
            ctx.ws.paths.push(copy);
            ctx.ws.selectedIndex = ctx.ws.paths.length - 1;
          }
          showCycleBadge(val > 0 ? "Contorno Externo (+14px)" : "Moldura Interna (-12px)");
          ctx.sync();
        },
      },
      {
        id: "strokeStyleCycle",
        label: "Estilo · Sólido / Tracejado / Sem",
        description: "Toque repetidamente para alternar entre Sólido, Tracejado, Pontilhado e Sem Contorno.",
        preview: "",
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="3.5 3.5"><line x1="5" y1="19" x2="19" y2="5"/></svg>`,
        onAction(ctx) {
          const current = ctx.getSelectedPath();
          if (!current) return;
          ctx.snapshot();
          if ((current.strokeWidth ?? 2) === 0 || current.stroke === "transparent") {
            current.stroke = ctx.state.activeStroke || "#3d2d2d";
            current.strokeWidth = 2.2;
            current.dash = [];
            showCycleBadge("Estilo: Linha Sólida");
          } else if (!current.dash || current.dash.length === 0) {
            current.dash = [6, 4];
            showCycleBadge("Estilo: Tracejado [6, 4]");
          } else if (current.dash[0] === 6) {
            current.dash = [1.5, 4.5];
            current.lineCap = "round";
            showCycleBadge("Estilo: Pontilhado");
          } else {
            current.strokeWidth = 0;
            current.dash = [];
            showCycleBadge("Estilo: Sem Contorno (0 pt)");
          }
          ctx.sync();
        },
      },
      {
        id: "strokeWidthStep",
        label: "Largura · Toque ou Deslize (pt)",
        description: "Toque para alternar (0 a 8 pt) ou arraste para os lados para ajuste decimal fino.",
        preview: "",
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round"><line x1="4" y1="7" x2="20" y2="7" stroke-width="1.2"/><line x1="4" y1="12" x2="20" y2="12" stroke-width="2.4"/><line x1="4" y1="17" x2="20" y2="17" stroke-width="4"/></svg>`,
        onAction(ctx) {
          if (isClickSuppressed("strokeWidthStep")) return;
          const current = ctx.getSelectedPath();
          if (!current) return;
          ctx.snapshot();
          const steps = [0, 1, 2.5, 5, 8];
          const cur = current.strokeWidth ?? 2;
          const next = steps.find((s) => s > cur + 0.1) ?? steps[0];
          if (next > 0 && (!current.stroke || current.stroke === "transparent")) {
            current.stroke = ctx.state.activeStroke || "#3d2d2d";
          }
          current.strokeWidth = next;
          showCycleBadge(`Largura: ${next} pt`);
          ctx.sync();
        },
      },
      {
        id: "strokeJoinCycle",
        label: "Tampa & Junção (Mitra 1.5)",
        description: "Toque repetidamente para alternar cantos entre Redondo, Chanfro e Mitra 1.5.",
        preview: "",
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19V9a4 4 0 0 1 4-4h10"/><path d="M9 19v-8a2 2 0 0 1 2-2h8"/></svg>`,
        onAction(ctx) {
          const current = ctx.getSelectedPath();
          if (!current) return;
          ctx.snapshot();
          const order = ["round", "bevel", "miter"];
          const labels = { round: "Redonda", bevel: "Chanfrada", miter: "Mitra (1.5)" };
          const next = order[(order.indexOf(current.lineJoin || "round") + 1) % order.length];
          current.lineJoin = next;
          current.lineCap = next === "miter" ? "square" : next === "bevel" ? "butt" : "round";
          current.miterLimit = 1.5;
          showCycleBadge(`Junção: ${labels[next]}`);
          ctx.sync();
        },
      },
      {
        id: "strokeAlignOrderCycle",
        label: "Alinhar & Ordem do Traço",
        description: "Alterna Centro, Interno, Externo e Traço Atrás do preenchimento.",
        preview: "",
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="11" height="11" rx="1.5" fill="currentColor" fill-opacity="0.25"/><rect x="9" y="9" width="11" height="11" rx="1.5"/></svg>`,
        onAction(ctx) {
          const current = ctx.getSelectedPath();
          if (!current || !Array.isArray(current.points) || current.points.length < 3) return;
          ctx.snapshot();
          const states = ["center-front", "inside", "outside", "center-behind"];
          const labels = {
            "center-front": "Alinhar: Centro (Frente)",
            "inside": "Alinhar: Interno",
            "outside": "Alinhar: Externo",
            "center-behind": "Ordem: Traço Atrás",
          };
          const curState = current._cycleAlignState || "center-front";
          const nextState = states[(states.indexOf(curState) + 1) % states.length];
          current._cycleAlignState = nextState;

          const sw = current.strokeWidth || 2.2;
          if (!current._baseAlignPoints) {
            current._baseAlignPoints = current.points.map((p) => ({ x: p.x, y: p.y }));
          }

          if (nextState === "inside") {
            current.points = computeOffsetPolygon(current._baseAlignPoints, -sw * 0.5);
            current.strokeBehind = false;
          } else if (nextState === "outside") {
            current.points = computeOffsetPolygon(current._baseAlignPoints, sw * 0.5);
            current.strokeBehind = false;
          } else if (nextState === "center-behind") {
            current.points = current._baseAlignPoints.map((p) => ({ x: p.x, y: p.y }));
            current.strokeBehind = true;
          } else {
            current.points = current._baseAlignPoints.map((p) => ({ x: p.x, y: p.y }));
            current.strokeBehind = false;
          }

          showCycleBadge(labels[nextState]);
          ctx.sync();
        },
      },
      {
        id: "contourPositionCycle",
        label: "Posição · Centro & Cantos",
        description: "Toque repetidamente para ancorar o objeto no Centro ou nos 4 cantos da prancheta.",
        preview: "",
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>`,
        onAction(ctx) {
          const current = ctx.getSelectedPath();
          if (!current) return;
          const b = ctx.getPathBounds(current);
          const objW = b.maxX - b.minX;
          const objH = b.maxY - b.minY;

          const ab = ctx.state.submode === "layout"
            ? ctx.workspaces?.layout?.page
            : ctx.workspaces?.normal?.artboard;

          const ax = ab?.x || 0;
          const ay = ab?.y || 0;
          const hw = (ab?.width || 340) / 2 - 20;
          const hh = (ab?.height || 340) / 2 - 20;

          const anchors = [
            { name: "Centro (0, 0)", x: ax, y: ay },
            { name: "Topo Esquerdo", x: ax - hw + objW / 2, y: ay - hh + objH / 2 },
            { name: "Topo Direito", x: ax + hw - objW / 2, y: ay - hh + objH / 2 },
            { name: "Base Direita", x: ax + hw - objW / 2, y: ay + hh - objH / 2 },
            { name: "Base Esquerda", x: ax - hw + objW / 2, y: ay + hh - objH / 2 },
          ];

          const step = (ctx.state._posCycleStep || 0) % anchors.length;
          ctx.state._posCycleStep = step + 1;
          const target = anchors[step];

          ctx.snapshot();
          translatePath(current, target.x - b.cx, target.y - b.cy);
          showCycleBadge(`Posição: ${target.name}`);
          ctx.sync();
        },
      },
      {
        id: "contourMoreSheet",
        label: "Mais Ajustes (•••)",
        description: "Abre o painel numérico para digitar Largura, Offset, Mitra e Posição X/Y exatos.",
        preview: "",
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>`,
        onAction(ctx) {
          ctx.state._contourSheetOpen = !ctx.state._contourSheetOpen;
          syncContourSheet(ctx);
          ctx.sync();
        },
      },
    ],

    onPointerDown(x, y, ctx) {
      const hit = ctx.hitTestPath(x, y);
      if (hit >= 0) ctx.ws.selectedIndex = hit;
      const current = ctx.getSelectedPath();
      if (!current || !Array.isArray(current.points) || current.points.length < 3) {
        ctx.state._contourDrag = null;
        ctx.sync();
        return;
      }
      const b = ctx.getPathBounds(current);
      ctx.snapshot();
      ctx.state._contourDrag = {
        basePoints: current.points.map((p) => ({ x: p.x, y: p.y })),
        cx: b.cx,
        cy: b.cy,
        startDist: Math.hypot(x - b.cx, y - b.cy),
        offset: 0,
      };
      ctx.sync();
    },

    onPointerMove(x, y, ctx) {
      const drag = ctx.state._contourDrag;
      const current = ctx.getSelectedPath();
      if (!drag || !current) return;
      const offset = Math.round(Math.hypot(x - drag.cx, y - drag.cy) - drag.startDist);
      drag.offset = Math.max(-60, Math.min(120, offset));
      ctx.state._lastContourOffset = drag.offset;
      current.points = computeOffsetPolygon(drag.basePoints, drag.offset);
      current._baseAlignPoints = current.points.map((p) => ({ x: p.x, y: p.y }));
      ctx.sync();
    },

    onPointerUp(x, y, ctx) {
      if (ctx.state._contourDrag) {
        ctx.state._contourDrag = null;
        ctx.sync();
      }
    },

    renderOverlay(ctx, toolCtx) {
      bindButtonScrubbing(toolCtx);
      syncContourSheet(toolCtx);

      const current = toolCtx.getSelectedPath();
      if (!current || !Array.isArray(current.points) || current.points.length < 3) return;

      const drag = toolCtx.state._contourDrag;
      const b = toolCtx.getPathBounds(current);

      ctx.save();
      if (drag && Array.isArray(drag.basePoints)) {
        ctx.strokeStyle = "rgba(61, 45, 45, 0.45)";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        drag.basePoints.forEach((pt, i) => (i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)));
        ctx.closePath();
        ctx.stroke();
        ctx.setLineDash([]);

        const sign = drag.offset > 0 ? `+${drag.offset}` : `${drag.offset}`;
        ctx.fillStyle = "#1c1917";
        ctx.fillRect(b.cx - 42, b.minY - 26, 84, 18);
        ctx.fillStyle = "#f59e0b";
        ctx.font = "700 10px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`Offset: ${sign}px`, b.cx, b.minY - 14);
      } else {
        const previewPts = computeOffsetPolygon(current.points, 8);
        ctx.strokeStyle = "rgba(245, 158, 11, 0.65)";
        ctx.lineWidth = 1.2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        previewPts.forEach((pt, i) => (i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)));
        ctx.closePath();
        ctx.stroke();
        ctx.setLineDash([]);
      }
      ctx.restore();
    },
  };

  window.RoblesVectorTools.push(contourToolFamily);
})();