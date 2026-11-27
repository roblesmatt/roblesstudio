(() => {
  window.RoblesVectorTools = window.RoblesVectorTools || [];

  const getIcon = (key, group, fallback) =>
    window.RoblesIcons?.get?.(key, group) || fallback;

  // Ícone fiel à referência: canto reto com seta diagonal apontando para o arco com nó circular
  const CORNER_MAIN_ICON = getIcon(
    "corner",
    "vector",
    `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 19V5h14"/>
        <path d="M5 5l5.5 5.5"/>
        <path d="M6.5 10.5h4v-4"/>
        <path d="M11.5 19a7.5 7.5 0 0 1 7.5-7.5"/>
        <circle cx="13.5" cy="13.5" r="2.3" fill="var(--surface, #1c1917)"/>
      </svg>
    `
  );

  function getCornerHandles(path) {
    if (!path || !Array.isArray(path.points) || path.points.length < 3) return [];
    const r = path.cornerRadius || 0;
    const pts = path.points;
    return pts.map((curr, i) => {
      const prev = pts[(i - 1 + pts.length) % pts.length];
      const next = pts[(i + 1) % pts.length];
      const v1x = prev.x - curr.x, v1y = prev.y - curr.y;
      const v2x = next.x - curr.x, v2y = next.y - curr.y;
      const l1 = Math.hypot(v1x, v1y) || 1;
      const l2 = Math.hypot(v2x, v2y) || 1;
      // Vetor bissetriz apontando para o interior do canto
      let bx = v1x / l1 + v2x / l2;
      let by = v1y / l1 + v2y / l2;
      const bl = Math.hypot(bx, by) || 1;
      bx /= bl;
      by /= bl;
      const dist = Math.min(Math.max(10, r * 0.85), Math.min(l1, l2) * 0.45);
      return {
        index: i,
        vx: curr.x,
        vy: curr.y,
        hx: curr.x + bx * dist,
        hy: curr.y + by * dist,
        bx,
        by,
        maxDist: Math.min(l1, l2) * 0.45,
      };
    });
  }

  // Aplica geometria real de Chanfro (corte reto) ou Canto Côncavo (invertido) nos vértices
  function bakeCornerStyle(path, style, amount) {
    if (!path || !Array.isArray(path.points) || path.points.length < 3) return;
    const pts = path.points;
    const nextPts = [];

    for (let i = 0; i < pts.length; i++) {
      const prev = pts[(i - 1 + pts.length) % pts.length];
      const curr = pts[i];
      const next = pts[(i + 1) % pts.length];

      const v1x = prev.x - curr.x, v1y = prev.y - curr.y;
      const v2x = next.x - curr.x, v2y = next.y - curr.y;
      const l1 = Math.hypot(v1x, v1y) || 1;
      const l2 = Math.hypot(v2x, v2y) || 1;
      const d = Math.min(amount, l1 * 0.35, l2 * 0.35);

      const p1 = { x: curr.x + (v1x / l1) * d, y: curr.y + (v1y / l1) * d };
      const p2 = { x: curr.x + (v2x / l2) * d, y: curr.y + (v2y / l2) * d };

      if (style === "chamfer") {
        nextPts.push(p1, p2);
      } else if (style === "inverted") {
        // Arco côncavo para dentro do canto
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        const inX = midX + (midX - curr.x) * 0.65;
        const inY = midY + (midY - curr.y) * 0.65;
        nextPts.push(p1, { x: inX, y: inY }, p2);
      }
    }

    path.points = nextPts;
    path.cornerRadius = 0;
  }

  const cornerToolFamily = {
    id: "cornerGroup",
    shortcut: "c",
    submodes: ["normal", "typography", "layout"],
    order: 3,
    label: "Ferramenta de Canto",
    description: "Arredonda vértices interativamente, aplica chanfros retos ou recortes côncavos.",
    preview: "",

    variants: [
      {
        id: "cornerRound",
        label: "Arredondar Cantos (C)",
        description: "Puxe as alças circulares nos cantos do objeto para ajustar o raio suavemente.",
        preview: "",
        icon: CORNER_MAIN_ICON,
      },
      {
        id: "cornerChamfer",
        label: "Chanfro Reto (45°)",
        description: "Converte os cantos do objeto selecionado em cortes chanfrados diagonais.",
        preview: "",
        icon: getIcon(
          "cornerChamfer",
          "vector",
          `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19V11l6-6h8"/><circle cx="8" cy="8" r="2" fill="var(--surface, #1c1917)"/></svg>`
        ),
        onAction(ctx) {
          const current = ctx.getSelectedPath();
          if (!current || !Array.isArray(current.points) || current.points.length < 3) return;
          const radius = current.cornerRadius > 4 ? current.cornerRadius : 16;
          ctx.snapshot();
          bakeCornerStyle(current, "chamfer", radius);
          ctx.core?.recordHistory?.("vector", `Chanfro aplicado (${Math.round(radius)}px)`);
          ctx.sync();
        },
      },
      {
        id: "cornerInverted",
        label: "Canto Côncavo (Invertido)",
        description: "Cria recorte arqueado interno nos cantos, ideal para rótulos e molduras.",
        preview: "",
        icon: getIcon(
          "cornerInverted",
          "vector",
          `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19v-7a7 7 0 0 0 7-7h7"/><circle cx="10" cy="10" r="2" fill="var(--surface, #1c1917)"/></svg>`
        ),
        onAction(ctx) {
          const current = ctx.getSelectedPath();
          if (!current || !Array.isArray(current.points) || current.points.length < 3) return;
          const radius = current.cornerRadius > 4 ? current.cornerRadius : 16;
          ctx.snapshot();
          bakeCornerStyle(current, "inverted", radius);
          ctx.core?.recordHistory?.("vector", `Canto côncavo (${Math.round(radius)}px)`);
          ctx.sync();
        },
      },
      {
        id: "cornerReset",
        label: "Zerar Cantos (0px)",
        description: "Remove o arredondamento e restaura os vértices retos de 90°.",
        preview: "",
        icon: getIcon(
          "cornerReset",
          "vector",
          `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19V5h14"/><rect x="4" y="4" width="4" height="4" fill="currentColor"/></svg>`
        ),
        onAction(ctx) {
          const current = ctx.getSelectedPath();
          if (!current) return;
          ctx.snapshot();
          current.cornerRadius = 0;
          ctx.core?.recordHistory?.("vector", "Cantos zerados (0px)");
          ctx.sync();
        },
      },
    ],

    onPointerDown(x, y, ctx) {
      // Permite clicar em outro objeto para selecioná-lo diretamente com a ferramenta de canto
      const current = ctx.getSelectedPath();
      if (current && Array.isArray(current.points) && current.points.length >= 3) {
        const handles = getCornerHandles(current);
        const hitHandle = handles.find((h) => Math.hypot(x - h.hx, y - h.hy) <= 14 || Math.hypot(x - h.vx, y - h.vy) <= 14);
        if (hitHandle) {
          ctx.snapshot();
          ctx.state._cornerDrag = {
            handle: hitHandle,
            startRadius: current.cornerRadius || 0,
            startX: x,
            startY: y,
          };
          ctx.sync();
          return;
        }
      }

      const hit = ctx.hitTestPath(x, y);
      if (hit >= 0) {
        ctx.ws.selectedIndex = hit;
        const nextSel = ctx.getSelectedPath();
        if (nextSel && Array.isArray(nextSel.points) && nextSel.points.length >= 3) {
          ctx.snapshot();
          ctx.state._cornerDrag = {
            handle: null,
            startRadius: nextSel.cornerRadius || 0,
            startX: x,
            startY: y,
          };
        }
      } else {
        ctx.state._cornerDrag = null;
      }
      ctx.sync();
    },

    onPointerMove(x, y, ctx) {
      const drag = ctx.state._cornerDrag;
      const current = ctx.getSelectedPath();
      if (!drag || !current || !Array.isArray(current.points)) return;

      let newRadius = drag.startRadius;
      if (drag.handle) {
        // Projeta o movimento na direção da bissetriz interna do canto
        const dx = x - drag.startX;
        const dy = y - drag.startY;
        const proj = dx * drag.handle.bx + dy * drag.handle.by;
        newRadius = Math.max(0, Math.min(80, Math.round(drag.startRadius + proj)));
      } else {
        // Arrasto horizontal livre se clicou no corpo da forma
        const dx = x - drag.startX;
        newRadius = Math.max(0, Math.min(80, Math.round(drag.startRadius + dx * 0.5)));
      }

      current.cornerRadius = newRadius;
      ctx.sync();
    },

    onPointerUp(x, y, ctx) {
      if (ctx.state._cornerDrag) {
        const current = ctx.getSelectedPath();
        if (current) {
          ctx.core?.recordHistory?.("vector", `Raio de canto: ${current.cornerRadius || 0}px`);
        }
        ctx.state._cornerDrag = null;
        ctx.sync();
      }
    },

    renderOverlay(ctx, toolCtx) {
      const current = toolCtx.getSelectedPath();
      if (!current || !Array.isArray(current.points) || current.points.length < 3) return;

      const handles = getCornerHandles(current);
      const radius = current.cornerRadius || 0;

      ctx.save();
      handles.forEach((h) => {
        // Linha guia do vértice até a alça circular
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(h.vx, h.vy);
        ctx.lineTo(h.hx, h.hy);
        ctx.stroke();

        // Alça circular interativa (idêntica ao ícone da ferramenta)
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(h.hx, h.hy, 4.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      // Etiqueta flutuante com o valor do raio durante o arrasto
      if (toolCtx.state._cornerDrag && handles[0]) {
        const b = toolCtx.getPathBounds(current);
        ctx.fillStyle = "#1c1917";
        ctx.fillRect(b.cx - 32, b.minY - 26, 64, 18);
        ctx.fillStyle = "#f59e0b";
        ctx.font = "700 10px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`R: ${radius}px`, b.cx, b.minY - 14);
      }

      ctx.restore();
    },
  };

  window.RoblesVectorTools.push(cornerToolFamily);
})();