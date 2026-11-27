(() => {
  window.RoblesVectorTools = window.RoblesVectorTools || [];

  const getIcon = (key, group, fallback) =>
    window.RoblesIcons?.get?.(key, group) || fallback;

  const ARTBOARD_PRESETS = [
    { label: "Quadrado · 1080×1080", width: 340, height: 340 },
    { label: "A4 Retrato · 210×297mm", width: 280, height: 396 },
    { label: "Rótulo · 70×84mm", width: 250, height: 300 },
    { label: "Paisagem · 1920×1080", width: 420, height: 236 },
  ];

  const ARTBOARD_MAIN_ICON = getIcon(
    "artboard",
    "vector",
    `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 2v6M2 5h6"/>
        <path d="M11 4h3M17 4h2a1 1 0 0 1 1 1v2"/>
        <path d="M20 11v3M20 17v2a1 1 0 0 1-1 1h-2"/>
        <path d="M13 20h-3M7 20H5a1 1 0 0 1-1-1v-2"/>
        <rect x="8.5" y="8.5" width="7" height="7" rx="0.8" fill="currentColor" fill-opacity="0.22"/>
      </svg>
    `
  );

  function getTargetSurface(ctx) {
    if (ctx.state.submode === "layout") {
      return ctx.workspaces.layout.page;
    }
    return ctx.workspaces.normal.artboard;
  }

  function rotatePoint90(px, py, cx, cy) {
    const dx = px - cx;
    const dy = py - cy;
    return { x: cx - dy, y: cy + dx };
  }

  const artboardToolFamily = {
    id: "artboardGroup",
    shortcut: "a",
    submodes: ["normal", "layout"],
    order: 2,
    label: "Prancheta & Formato",
    description: "Cria, redimensiona ou ajusta automaticamente os limites da prancheta e página.",
    preview: "",

    variants: [
      {
        id: "artboardDraw",
        label: "Prancheta Livre (A)",
        description: "Arraste na tela para criar uma prancheta ou puxe as alças brancas para redimensionar.",
        preview: "",
        icon: ARTBOARD_MAIN_ICON,
      },
      {
        id: "artboardFit",
        label: "Ajustar à Arte (Auto-Fit)",
        description: "Enquadra a prancheta automaticamente em volta de todos os objetos desenhados.",
        preview: "",
        icon: getIcon(
          "artboardFit",
          "vector",
          `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/><rect x="8" y="8" width="8" height="8" rx="1"/></svg>`
        ),
        onAction(ctx) {
          const paths = ctx.ws.paths || [];
          if (paths.length === 0) return;

          let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
          paths.forEach((p) => {
            const b = ctx.getPathBounds(p);
            minX = Math.min(minX, b.minX);
            minY = Math.min(minY, b.minY);
            maxX = Math.max(maxX, b.maxX);
            maxY = Math.max(maxY, b.maxY);
          });

          const pad = 28;
          const newW = Math.max(80, Math.round(maxX - minX + pad * 2));
          const newH = Math.max(80, Math.round(maxY - minY + pad * 2));

          const target = getTargetSurface(ctx);
          target.visible = true;
          target.x = Math.round((minX + maxX) / 2);
          target.y = Math.round((minY + maxY) / 2);
          target.width = newW;
          target.height = newH;
          target.label = `Ajustada · ${newW}×${newH}`;
          ctx.core?.recordHistory?.("vector", `Prancheta ajustada (${newW}×${newH})`);
          ctx.sync();
        },
      },
      {
        id: "artboardFlip",
        label: "Girar Orientação (90°)",
        description: "Alterna entre Retrato e Paisagem e gira 90° a prancheta junto com a arte.",
        preview: "",
        icon: getIcon(
          "artboardFlip",
          "vector",
          `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="10" height="14" rx="1.5"/><path d="M16 4h3a2 2 0 0 1 2 2v3"/><path d="M18 2l-2 2 2 2"/><path d="M17 14h4v7h-4"/></svg>`
        ),
        onAction(ctx) {
          const target = getTargetSurface(ctx);
          const cx = target.x || 0;
          const cy = target.y || 0;

          // Se for quadrada, converte para formato retangular para a rotação ficar visível
          if (target.width === target.height) {
            target.width = Math.round(target.width * 1.25);
            target.height = Math.round(target.height * 0.8);
          } else {
            const oldW = target.width;
            target.width = target.height;
            target.height = oldW;
          }

          // Rotaciona 90° os objetos que estão dentro da prancheta
          const hw = target.height / 2 + 40;
          const hh = target.width / 2 + 40;
          ctx.snapshot();
          (ctx.ws.paths || []).forEach((p) => {
            const b = ctx.getPathBounds(p);
            if (Math.abs(b.cx - cx) <= hw && Math.abs(b.cy - cy) <= hh) {
              if (p.type === "text" || p.type === "arcText") {
                const r = rotatePoint90(p.x || 0, p.y || 0, cx, cy);
                p.x = r.x;
                p.y = r.y;
              }
              if (Array.isArray(p.points)) {
                p.points = p.points.map((pt) => rotatePoint90(pt.x, pt.y, cx, cy));
              }
            }
          });

          const orient = target.width >= target.height ? "Paisagem" : "Retrato";
          target.label = `${orient} · ${target.width}×${target.height}`;
          ctx.core?.recordHistory?.("vector", `Prancheta girada (${target.width}×${target.height})`);
          ctx.sync();
        },
      },
      {
        id: "artboardPresets",
        label: "Alternar Formatos Padrão",
        description: "Cicla entre Quadrado (1080×1080), A4 Editorial, Rótulo (70×84mm) e 16:9.",
        preview: "",
        icon: getIcon(
          "artboardPresets",
          "vector",
          `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="12" height="16" rx="1.5"/><path d="M15 8h4a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-4"/></svg>`
        ),
        onAction(ctx) {
          const idx = ((ctx.state._abPresetIdx ?? -1) + 1) % ARTBOARD_PRESETS.length;
          ctx.state._abPresetIdx = idx;
          const preset = ARTBOARD_PRESETS[idx];
          const target = getTargetSurface(ctx);
          target.visible = true;
          target.width = preset.width;
          target.height = preset.height;
          target.label = preset.label;
          ctx.core?.recordHistory?.("vector", `Formato: ${preset.label}`);
          ctx.sync();
        },
      },
    ],

    onPointerDown(x, y, ctx) {
      const target = getTargetSurface(ctx);
      const ax = target.x || 0;
      const ay = target.y || 0;
      const minX = ax - target.width / 2;
      const maxX = ax + target.width / 2;
      const minY = ay - target.height / 2;
      const maxY = ay + target.height / 2;
      const tol = 14;

      const nearLeft = Math.abs(x - minX) <= tol && y >= minY - tol && y <= maxY + tol;
      const nearRight = Math.abs(x - maxX) <= tol && y >= minY - tol && y <= maxY + tol;
      const nearTop = Math.abs(y - minY) <= tol && x >= minX - tol && x <= maxX + tol;
      const nearBottom = Math.abs(y - maxY) <= tol && x >= minX - tol && x <= maxX + tol;

      if (nearLeft || nearRight || nearTop || nearBottom) {
        ctx.state._abResize = {
          left: nearLeft,
          right: nearRight,
          top: nearTop,
          bottom: nearBottom,
          minX,
          maxX,
          minY,
          maxY,
        };
        ctx.state._abDraft = null;
      } else {
        ctx.state._abResize = null;
        ctx.state._abDraft = { x0: x, y0: y, x1: x, y1: y };
      }
      ctx.sync();
    },

    onPointerMove(x, y, ctx) {
      const res = ctx.state._abResize;
      if (res) {
        const target = getTargetSurface(ctx);
        let nMinX = res.minX, nMaxX = res.maxX, nMinY = res.minY, nMaxY = res.maxY;
        if (res.left) nMinX = Math.min(x, nMaxX - 50);
        if (res.right) nMaxX = Math.max(x, nMinX + 50);
        if (res.top) nMinY = Math.min(y, nMaxY - 50);
        if (res.bottom) nMaxY = Math.max(y, nMinY + 50);

        target.x = Math.round((nMinX + nMaxX) / 2);
        target.y = Math.round((nMinY + nMaxY) / 2);
        target.width = Math.round(nMaxX - nMinX);
        target.height = Math.round(nMaxY - nMinY);
        target.label = `Prancheta · ${target.width}×${target.height}`;
        ctx.sync();
        return;
      }

      if (!ctx.state._abDraft) return;
      ctx.state._abDraft.x1 = x;
      ctx.state._abDraft.y1 = y;
      ctx.sync();
    },

    onPointerUp(x, y, ctx) {
      if (ctx.state._abResize) {
        const target = getTargetSurface(ctx);
        ctx.core?.recordHistory?.("vector", `Prancheta redimensionada (${target.width}×${target.height})`);
        ctx.state._abResize = null;
        ctx.sync();
        return;
      }

      const draft = ctx.state._abDraft;
      if (!draft) return;

      const w = Math.round(Math.abs(draft.x1 - draft.x0));
      const h = Math.round(Math.abs(draft.y1 - draft.y0));

      if (w >= 40 && h >= 40) {
        const target = getTargetSurface(ctx);
        target.visible = true;
        target.x = Math.round((draft.x0 + draft.x1) / 2);
        target.y = Math.round((draft.y0 + draft.y1) / 2);
        target.width = w;
        target.height = h;
        target.label = `Prancheta · ${w}×${h}`;
        ctx.core?.recordHistory?.("vector", `Nova prancheta (${w}×${h})`);
      }

      ctx.state._abDraft = null;
      ctx.sync();
    },

    renderOverlay(ctx, toolCtx) {
      const target = getTargetSurface(toolCtx);
      const ax = target.x || 0;
      const ay = target.y || 0;
      const hw = target.width / 2;
      const hh = target.height / 2;

      ctx.save();
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(ax - hw, ay - hh, target.width, target.height);

      const handles = [
        [ax - hw, ay - hh], [ax, ay - hh], [ax + hw, ay - hh],
        [ax - hw, ay],                     [ax + hw, ay],
        [ax - hw, ay + hh], [ax, ay + hh], [ax + hw, ay + hh],
      ];
      ctx.fillStyle = "#ffffff";
      handles.forEach(([hx, hy]) => {
        ctx.fillRect(hx - 3.5, hy - 3.5, 7, 7);
        ctx.strokeRect(hx - 3.5, hy - 3.5, 7, 7);
      });

      const draft = toolCtx.state._abDraft;
      if (draft) {
        const x = Math.min(draft.x0, draft.x1);
        const y = Math.min(draft.y0, draft.y1);
        const w = Math.abs(draft.x1 - draft.x0);
        const h = Math.abs(draft.y1 - draft.y0);

        ctx.fillStyle = "rgba(245, 158, 11, 0.12)";
        ctx.strokeStyle = "#f59e0b";
        ctx.setLineDash([4, 3]);
        ctx.fillRect(x, y, w, h);
        ctx.strokeRect(x, y, w, h);
        ctx.setLineDash([]);

        ctx.fillStyle = "#1c1917";
        ctx.font = "700 10px monospace";
        ctx.fillText(`${Math.round(w)} × ${Math.round(h)} px`, x + 6, y - 6);
      }

      ctx.restore();
    },
  };

  window.RoblesVectorTools.push(artboardToolFamily);
})();