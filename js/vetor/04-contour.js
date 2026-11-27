(() => {
  window.RoblesVectorTools = window.RoblesVectorTools || [];

  const getIcon = (key, group, fallback) =>
    window.RoblesIcons?.get?.(key, group) || fallback;

  const CONTOUR_MAIN_ICON = getIcon(
    "contour",
    "vector",
    `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11.5" cy="12.5" r="4" fill="currentColor"/>
        <path d="M11.5 3.5a9 9 0 0 0-9 9 9 9 0 0 0 9 9 9 9 0 0 0 9-9" stroke-dasharray="2.5 2.5"/>
        <path d="M16.5 4.5h4v4"/>
        <path d="M20.5 4.5l-4.5 4.5"/>
      </svg>
    `
  );

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
    }, 1100);
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

  function applyAlignState(current, nextState) {
    if (!current || !Array.isArray(current.points) || current.points.length < 3) return;
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
  }

  // =========================================================================
  // CÁPSULA LATERAL UNIFICADA (Régua Vertical para Valores + Opções para Modos)
  // =========================================================================
  function syncContourSidePopover(ctx) {
    const rightBar = document.querySelector(".hud-right");
    if (rightBar) {
      rightBar.style.display = "flex";
      rightBar.style.flexDirection = "column";
      rightBar.style.gridTemplateColumns = "";
      rightBar.style.overflow = "visible";
    }

    let pop = document.getElementById("robles-contour-side-popover");
    const isContourActive = ctx.ws?.activeFamilyId === "contourGroup";
    const mode = ctx.state._sidePopoverMode;

    if (!isContourActive || !mode) {
      if (pop) pop.style.display = "none";
      return;
    }

    if (!pop) {
      pop = document.createElement("div");
      pop.id = "robles-contour-side-popover";
      pop.className = "robles-side-popover";
      document.body.appendChild(pop);
    }

    const sel = ctx.getSelectedPath();
    const b = sel ? ctx.getPathBounds(sel) : { cx: 0, cy: 0 };

    // Alinha verticalmente ao botão ativo na barra direita
    const variantMap = {
      offset: "contourInteractive",
      duplicate: "contourDuplicate",
      style: "strokeStyleCycle",
      width: "strokeWidthStep",
      join: "strokeJoinCycle",
      align: "strokeAlignOrderCycle",
      posX: "contourPositionCycle",
      posY: "contourPositionCycle",
      miter: "strokeJoinCycle",
    };
    const anchorBtn = rightBar?.querySelector(`[data-vec-variant="${variantMap[mode] || ""}"]`);
    if (anchorBtn) {
      const btnRect = anchorBtn.getBoundingClientRect();
      const clampedTop = Math.max(135, Math.min(window.innerHeight - 145, btnRect.top + btnRect.height / 2));
      pop.style.top = `${clampedTop}px`;
    } else {
      pop.style.top = "50%";
    }

    pop.style.display = "flex";

    // 1. MODOS COM RÉGUA VERTICAL DE BARRINHAS SEGMENTADAS
    const sliderConfigs = {
      width: {
        unit: "PT",
        min: 0,
        max: 24,
        val: sel?.strokeWidth ?? 2,
        format: (v) => Number(v).toFixed(1),
        apply: (target, ratio) => {
          const nextW = Math.round(ratio * 24 * 10) / 10;
          if (nextW > 0 && (!target.stroke || target.stroke === "transparent")) {
            target.stroke = ctx.state.activeStroke || "#3d2d2d";
          }
          target.strokeWidth = nextW;
          return nextW;
        },
      },
      offset: {
        unit: "PX",
        min: -40,
        max: 60,
        val: ctx.state._lastContourOffset || 0,
        format: (v) => (v > 0 ? `+${Math.round(v)}` : `${Math.round(v)}`),
        apply: (target, ratio) => {
          if (!Array.isArray(target.points)) return 0;
          const nextOff = Math.round(-40 + ratio * 100);
          if (!target._baseOffsetPts) target._baseOffsetPts = target.points.map((p) => ({ x: p.x, y: p.y }));
          ctx.state._lastContourOffset = nextOff;
          target.points = computeOffsetPolygon(target._baseOffsetPts, nextOff);
          target._baseAlignPoints = target.points.map((p) => ({ x: p.x, y: p.y }));
          return nextOff;
        },
      },
      posX: {
        unit: "X",
        min: -180,
        max: 180,
        val: Math.round(b.cx),
        format: (v) => `${Math.round(v)}`,
        apply: (target, ratio) => {
          const nextX = Math.round(-180 + ratio * 360);
          const curB = ctx.getPathBounds(target);
          translatePath(target, nextX - curB.cx, 0);
          return nextX;
        },
      },
      posY: {
        unit: "Y",
        min: -180,
        max: 180,
        val: Math.round(b.cy),
        format: (v) => `${Math.round(v)}`,
        apply: (target, ratio) => {
          const nextY = Math.round(-180 + ratio * 360);
          const curB = ctx.getPathBounds(target);
          translatePath(target, 0, nextY - curB.cy);
          return nextY;
        },
      },
    };

    if (sliderConfigs[mode]) {
      const cfg = sliderConfigs[mode];
      const pct = Math.max(0, Math.min(100, ((cfg.val - cfg.min) / (cfg.max - cfg.min)) * 100));
      const axisToggleHtml = (mode === "posX" || mode === "posY")
        ? `<button type="button" class="rsp-chip" id="rsp-axis-toggle">${mode === "posX" ? "X⇄Y" : "Y⇄X"}</button>`
        : "";

      pop.classList.remove("is-wide");
      pop.innerHTML = `
        <div class="rsp-val" id="rsp-val-num">${cfg.format(cfg.val)}</div>
        <div class="rsp-unit">${cfg.unit}</div>
        <div class="rsp-track" id="rsp-track" style="--pct:${pct}%"></div>
        ${axisToggleHtml}
        <button type="button" class="rsp-close" id="rsp-close">✕</button>
      `;

      const track = pop.querySelector("#rsp-track");
      const valEl = pop.querySelector("#rsp-val-num");

      const handleY = (clientY) => {
        const target = ctx.getSelectedPath();
        if (!target) return;
        const rect = track.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (rect.bottom - clientY) / rect.height));
        track.style.setProperty("--pct", `${ratio * 100}%`);
        const newVal = cfg.apply(target, ratio);
        valEl.textContent = cfg.format(newVal);
        ctx.sync();
      };

      track.onpointerdown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        ctx.snapshot();
        track.setPointerCapture(e.pointerId);
        handleY(e.clientY);
        track.onpointermove = (ev) => handleY(ev.clientY);
        track.onpointerup = () => {
          track.onpointermove = null;
          track.onpointerup = null;
        };
      };

      const axisBtn = pop.querySelector("#rsp-axis-toggle");
      if (axisBtn) {
        axisBtn.onclick = (e) => {
          e.stopPropagation();
          ctx.state._sidePopoverMode = mode === "posX" ? "posY" : "posX";
          syncContourSidePopover(ctx);
        };
      }
    } else {
      // 2. MODOS DE SELEÇÃO RÁPIDA NA CÁPSULA VERTICAL
      pop.classList.add("is-wide");
      let optionsHtml = "";

      if (mode === "duplicate") {
        optionsHtml = `
          <div class="rsp-unit">CÓPIA</div>
          <button type="button" class="rsp-opt" data-dup="14">+14px</button>
          <button type="button" class="rsp-opt" data-dup="28">+28px</button>
          <button type="button" class="rsp-opt" data-dup="-12">-12px</button>
        `;
      } else if (mode === "style") {
        const curStyle = !sel || (sel.strokeWidth ?? 2) === 0 ? "none" : (sel.dash?.length ? (sel.dash[0] < 3 ? "dot" : "dash") : "solid");
        optionsHtml = `
          <div class="rsp-unit">ESTILO</div>
          <button type="button" class="rsp-opt ${curStyle === "solid" ? "is-active" : ""}" data-st="solid">Sólido</button>
          <button type="button" class="rsp-opt ${curStyle === "dash" ? "is-active" : ""}" data-st="dash">Traço</button>
          <button type="button" class="rsp-opt ${curStyle === "dot" ? "is-active" : ""}" data-st="dot">Ponto</button>
          <button type="button" class="rsp-opt ${curStyle === "none" ? "is-active" : ""}" data-st="none">Sem</button>
        `;
      } else if (mode === "join") {
        const curJoin = sel?.lineJoin || "round";
        optionsHtml = `
          <div class="rsp-unit">CANTO</div>
          <button type="button" class="rsp-opt ${curJoin === "round" ? "is-active" : ""}" data-jn="round">Redondo</button>
          <button type="button" class="rsp-opt ${curJoin === "bevel" ? "is-active" : ""}" data-jn="bevel">Chanfro</button>
          <button type="button" class="rsp-opt ${curJoin === "miter" ? "is-active" : ""}" data-jn="miter">Mitra</button>
        `;
      } else if (mode === "align") {
        const curAl = sel?._cycleAlignState || "center-front";
        optionsHtml = `
          <div class="rsp-unit">ORDEM</div>
          <button type="button" class="rsp-opt ${curAl === "center-front" ? "is-active" : ""}" data-al="center-front">Centro</button>
          <button type="button" class="rsp-opt ${curAl === "inside" ? "is-active" : ""}" data-al="inside">Interno</button>
          <button type="button" class="rsp-opt ${curAl === "outside" ? "is-active" : ""}" data-al="outside">Externo</button>
          <button type="button" class="rsp-opt ${curAl === "center-behind" ? "is-active" : ""}" data-al="center-behind">Atrás</button>
        `;
      }

      pop.innerHTML = `${optionsHtml}<button type="button" class="rsp-close" id="rsp-close">✕</button>`;

      pop.querySelectorAll("[data-dup]").forEach((btn) => {
        btn.onclick = (e) => {
          e.stopPropagation();
          const target = ctx.getSelectedPath();
          if (!target || !Array.isArray(target.points) || target.points.length < 3) return;
          const val = parseFloat(btn.dataset.dup);
          const copy = cloneAsOffsetShape(target, val);
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
          showCycleBadge(`Cópia (${val > 0 ? "+" + val : val}px)`);
          ctx.sync();
        };
      });

      pop.querySelectorAll("[data-st]").forEach((btn) => {
        btn.onclick = (e) => {
          e.stopPropagation();
          const target = ctx.getSelectedPath();
          if (!target) return;
          ctx.snapshot();
          const st = btn.dataset.st;
          if (st === "none") {
            target.strokeWidth = 0;
          } else {
            if (!target.stroke || target.stroke === "transparent") target.stroke = ctx.state.activeStroke || "#3d2d2d";
            if (!target.strokeWidth || target.strokeWidth <= 0) target.strokeWidth = 2.2;
            target.dash = st === "dash" ? [6, 4] : st === "dot" ? [1.5, 4.5] : [];
          }
          syncContourSidePopover(ctx);
          ctx.sync();
        };
      });

      pop.querySelectorAll("[data-jn]").forEach((btn) => {
        btn.onclick = (e) => {
          e.stopPropagation();
          const target = ctx.getSelectedPath();
          if (!target) return;
          ctx.snapshot();
          const jn = btn.dataset.jn;
          target.lineJoin = jn;
          target.lineCap = jn === "miter" ? "square" : jn === "bevel" ? "butt" : "round";
          target.miterLimit = 1.5;
          syncContourSidePopover(ctx);
          ctx.sync();
        };
      });

      pop.querySelectorAll("[data-al]").forEach((btn) => {
        btn.onclick = (e) => {
          e.stopPropagation();
          const target = ctx.getSelectedPath();
          if (!target) return;
          ctx.snapshot();
          applyAlignState(target, btn.dataset.al);
          syncContourSidePopover(ctx);
          ctx.sync();
        };
      });
    }

    pop.querySelector("#rsp-close").onclick = (e) => {
      e.stopPropagation();
      ctx.state._sidePopoverMode = null;
      syncContourSidePopover(ctx);
    };
  }

  const contourToolFamily = {
    id: "contourGroup",
    shortcut: "o",
    submodes: ["normal", "typography", "layout"],
    order: 4,
    label: "Contornar & Traçado",
    description: "Todas as ferramentas abrem controles verticais rápidos ao lado da barra direita.",
    preview: "",

    variants: [
      {
        id: "contourInteractive",
        label: "Contorno Paralelo (O)",
        description: "Arraste na tela ou ajuste na régua vertical de Offset (PX).",
        preview: "",
        icon: CONTOUR_MAIN_ICON,
        onAction(ctx) {
          ctx.state._sidePopoverMode = ctx.state._sidePopoverMode === "offset" ? null : "offset";
          syncContourSidePopover(ctx);
          ctx.sync();
        },
      },
      {
        id: "contourDuplicate",
        label: "Gerar Contorno (+14 / +28 / -12px)",
        description: "Abre opções de cópia externa ou moldura interna ao lado.",
        preview: "",
        icon: getIcon(
          "contourDuplicate",
          "vector",
          `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="7" y="7" width="10" height="10" rx="2"/><rect x="3" y="3" width="18" height="18" rx="4" stroke-dasharray="3 2"/></svg>`
        ),
        onAction(ctx) {
          ctx.state._sidePopoverMode = ctx.state._sidePopoverMode === "duplicate" ? null : "duplicate";
          syncContourSidePopover(ctx);
          ctx.sync();
        },
      },
      {
        id: "strokeStyleCycle",
        label: "Estilo · Sólido / Tracejado / Ponto / Sem",
        description: "Cicla o estilo do traço e abre os seletores ao lado.",
        preview: "",
        icon: getIcon(
          "strokeStyleCycle",
          "vector",
          `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="3.5 3.5"><line x1="5" y1="19" x2="19" y2="5"/></svg>`
        ),
        onAction(ctx) {
          const current = ctx.getSelectedPath();
          if (current) {
            ctx.snapshot();
            if ((current.strokeWidth ?? 2) === 0 || current.stroke === "transparent") {
              current.stroke = ctx.state.activeStroke || "#3d2d2d";
              current.strokeWidth = 2.2;
              current.dash = [];
            } else if (!current.dash || current.dash.length === 0) {
              current.dash = [6, 4];
            } else if (current.dash[0] === 6) {
              current.dash = [1.5, 4.5];
            } else {
              current.strokeWidth = 0;
              current.dash = [];
            }
          }
          ctx.state._sidePopoverMode = "style";
          syncContourSidePopover(ctx);
          ctx.sync();
        },
      },
      {
        id: "strokeWidthStep",
        label: "Largura (pt) · Régua Vertical",
        description: "Alterna a espessura e abre a barra vertical de ajuste fino ao lado.",
        preview: "",
        icon: getIcon(
          "strokeWidthStep",
          "vector",
          `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round"><line x1="4" y1="7" x2="20" y2="7" stroke-width="1.2"/><line x1="4" y1="12" x2="20" y2="12" stroke-width="2.4"/><line x1="4" y1="17" x2="20" y2="17" stroke-width="4"/></svg>`
        ),
        onAction(ctx) {
          const current = ctx.getSelectedPath();
          if (current) {
            ctx.snapshot();
            const steps = [1, 2.5, 5, 8, 0];
            const cur = current.strokeWidth ?? 2;
            const next = steps.find((s) => s > cur + 0.1) ?? steps[0];
            if (next > 0 && (!current.stroke || current.stroke === "transparent")) {
              current.stroke = ctx.state.activeStroke || "#3d2d2d";
            }
            current.strokeWidth = next;
          }
          ctx.state._sidePopoverMode = "width";
          syncContourSidePopover(ctx);
          ctx.sync();
        },
      },
      {
        id: "strokeJoinCycle",
        label: "Tampa & Junção (Mitra 1.5)",
        description: "Cicla Redondo, Chanfro e Mitra 1.5 e abre as opções ao lado.",
        preview: "",
        icon: getIcon(
          "strokeJoinCycle",
          "vector",
          `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19V9a4 4 0 0 1 4-4h10"/><path d="M9 19v-8a2 2 0 0 1 2-2h8"/></svg>`
        ),
        onAction(ctx) {
          const current = ctx.getSelectedPath();
          if (current) {
            ctx.snapshot();
            const order = ["round", "bevel", "miter"];
            const next = order[(order.indexOf(current.lineJoin || "round") + 1) % order.length];
            current.lineJoin = next;
            current.lineCap = next === "miter" ? "square" : next === "bevel" ? "butt" : "round";
            current.miterLimit = 1.5;
          }
          ctx.state._sidePopoverMode = "join";
          syncContourSidePopover(ctx);
          ctx.sync();
        },
      },
      {
        id: "strokeAlignOrderCycle",
        label: "Alinhar & Ordem do Traço",
        description: "Alterna Centro, Interno, Externo e Traço Atrás e abre o seletor ao lado.",
        preview: "",
        icon: getIcon(
          "strokeAlignOrderCycle",
          "vector",
          `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="11" height="11" rx="1.5" fill="currentColor" fill-opacity="0.25"/><rect x="9" y="9" width="11" height="11" rx="1.5"/></svg>`
        ),
        onAction(ctx) {
          const current = ctx.getSelectedPath();
          if (current) {
            ctx.snapshot();
            const states = ["center-front", "inside", "outside", "center-behind"];
            const curState = current._cycleAlignState || "center-front";
            const nextState = states[(states.indexOf(curState) + 1) % states.length];
            applyAlignState(current, nextState);
          }
          ctx.state._sidePopoverMode = "align";
          syncContourSidePopover(ctx);
          ctx.sync();
        },
      },
      {
        id: "contourPositionCycle",
        label: "Posição X / Y · Régua Vertical",
        description: "Abre a régua vertical de posição X e Y (com botão X⇄Y) ao lado.",
        preview: "",
        icon: getIcon(
          "contourPositionCycle",
          "vector",
          `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>`
        ),
        onAction(ctx) {
          if (ctx.state._sidePopoverMode === "posX") {
            ctx.state._sidePopoverMode = "posY";
          } else if (ctx.state._sidePopoverMode === "posY") {
            ctx.state._sidePopoverMode = null;
          } else {
            ctx.state._sidePopoverMode = "posX";
          }
          syncContourSidePopover(ctx);
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
      syncContourSidePopover(toolCtx);

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