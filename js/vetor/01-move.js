(() => {
  window.RoblesVectorTools = window.RoblesVectorTools || [];

  function pointInPolygon(pt, vs) {
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      const xi = vs[i].x, yi = vs[i].y;
      const xj = vs[j].x, yj = vs[j].y;
      const intersect = ((yi > pt.y) !== (yj > pt.y)) &&
        (pt.x < ((xj - xi) * (pt.y - yi)) / (yj - yi + 1e-9) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
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
  }

  function getHitStack(x, y, ctx) {
    const list = ctx.ws.paths || [];
    const hits = [];
    for (let i = list.length - 1; i >= 0; i--) {
      const b = ctx.getPathBounds(list[i]);
      if (x >= b.minX - 12 && x <= b.maxX + 12 && y >= b.minY - 12 && y <= b.maxY + 12) {
        hits.push(i);
      }
    }
    return hits;
  }

  // Retorna a superfície ativa (Prancheta no modo Normal, Página no modo Layout)
  function getActiveArtboard(ctx) {
    if (ctx.state.submode === "layout") {
      return ctx.workspaces?.layout?.page || null;
    }
    if (ctx.state.submode === "normal") {
      const ab = ctx.workspaces?.normal?.artboard;
      return ab && ab.visible ? ab : null;
    }
    return null;
  }

  function getArtboardBounds(ab) {
    const cx = ab.x || 0;
    const cy = ab.y || 0;
    const hw = ab.width / 2;
    const hh = ab.height / 2;
    return {
      minX: cx - hw,
      maxX: cx + hw,
      minY: cy - hh,
      maxY: cy + hh,
      cx,
      cy,
    };
  }

  // Detecta clique no rótulo superior ou na moldura externa da prancheta
  function hitTestArtboardHeaderOrBorder(x, y, ab) {
    if (!ab) return false;
    const b = getArtboardBounds(ab);
    // Área do título acima da prancheta
    const inHeader = x >= b.minX - 4 && x <= b.minX + 180 && y >= b.minY - 22 && y <= b.minY + 4;
    // Borda da prancheta (tolerância de 8px)
    const onHorizontalEdge = x >= b.minX - 8 && x <= b.maxX + 8 && (Math.abs(y - b.minY) <= 8 || Math.abs(y - b.maxY) <= 8);
    const onVerticalEdge = y >= b.minY - 8 && y <= b.maxY + 8 && (Math.abs(x - b.minX) <= 8 || Math.abs(x - b.maxX) <= 8);
    return inHeader || onHorizontalEdge || onVerticalEdge;
  }

  const moveToolFamily = {
    id: "moveGroup",
    shortcut: "v",
    submodes: ["normal", "typography", "layout"],
    order: 1,
    label: "Mover & Selecionar",
    description: "Move objetos, pranchetas inteiras, perfura camadas ou cria seleções livres.",
    preview: "",

    variants: [
      {
        id: "move",
        label: "Mover Livre (V)",
        description: "Arrasta objetos ou clique na borda/título da prancheta para movê-la com toda a arte.",
        preview: "",
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 3l14 9-6.5 1.5L10 20z"/></svg>`,
      },
      {
        id: "selectDeep",
        label: "Seleção em Profundidade",
        description: "Cada toque no mesmo ponto atravessa a pilha e seleciona o objeto de baixo.",
        preview: "",
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12 3 21 8 12 13 3 8"/><polyline points="3 13 12 18 21 13"/><polyline points="3 18 12 23 21 18"/></svg>`,
      },
      {
        id: "selectLasso",
        label: "Laço de Seleção Livre",
        description: "Desenha um contorno à mão livre para capturar e mover vários objetos de uma vez.",
        preview: "",
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M7 14c-3-1.5-4-4.5-2-7 2.5-3 9.5-3.5 13-1 3.5 2.5 3 7.5-1 9.5-3.5 1.8-8 1-10-1.5z"/><circle cx="8" cy="16" r="2"/><path d="M8 18c0 2 1.5 3 3.5 3"/></svg>`,
      },
      {
        id: "moveAxis",
        label: "Mover com Eixo Travado",
        description: "Trava o arrasto de objetos ou pranchetas no eixo horizontal (X) ou vertical (Y).",
        preview: "",
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 3v18M3 12h18"/><path d="M9 6l3-3 3 3M9 18l3 3 3-3M6 9l-3 3 3 3M18 9l3 3-3 3"/></svg>`,
      },
    ],

    onPointerDown(x, y, ctx) {
      const mode = ctx.toolId;

      if (mode === "selectLasso") {
        ctx.state._lassoPoints = [{ x, y }];
        ctx.state._moveCanDrag = false;
        ctx.state._movingArtboard = false;
        ctx.sync();
        return;
      }

      if (mode === "selectDeep") {
        ctx.state._movingArtboard = false;
        const stack = getHitStack(x, y, ctx);
        if (stack.length > 0) {
          const prev = ctx.state._deepClick;
          const sameSpot = prev && Math.hypot(prev.x - x, prev.y - y) < 10;
          const step = sameSpot ? (prev.step + 1) % stack.length : 0;
          ctx.state._deepClick = { x, y, step };
          ctx.ws.selectedIndex = stack[step];
          ctx.state._lassoSelected = null;
          ctx.snapshot();
          ctx.state._moveCanDrag = true;
          ctx.state._moveDidDrag = false;
        } else {
          ctx.state._deepClick = null;
          ctx.state._moveCanDrag = false;
        }
        ctx.sync();
        return;
      }

      // 1º Prioridade: Verifica se clicou diretamente em um objeto vetorial
      const hit = ctx.hitTestPath(x, y);
      if (hit >= 0) {
        ctx.ws.selectedIndex = hit;
        if (!Array.isArray(ctx.state._lassoSelected) || !ctx.state._lassoSelected.includes(hit)) {
          ctx.state._lassoSelected = null;
        }
        ctx.snapshot();
        ctx.state._movingArtboard = false;
        ctx.state._moveCanDrag = true;
        ctx.state._moveDidDrag = false;
        ctx.state._axisLock = null;
        ctx.state._axisStart = { x, y };
        ctx.sync();
        return;
      }

      // 2º Prioridade: Verifica se clicou no título ou na borda da Prancheta para movê-la inteira
      const ab = getActiveArtboard(ctx);
      if (ab && hitTestArtboardHeaderOrBorder(x, y, ab)) {
        const abBounds = getArtboardBounds(ab);
        // Captura todos os objetos que estão dentro da prancheta para viajarem junto com ela
        const insideIndices = [];
        (ctx.ws.paths || []).forEach((p, idx) => {
          const b = ctx.getPathBounds(p);
          if (b.cx >= abBounds.minX && b.cx <= abBounds.maxX && b.cy >= abBounds.minY && b.cy <= abBounds.maxY) {
            insideIndices.push(idx);
          }
        });

        ctx.snapshot();
        ctx.state._movingArtboard = true;
        ctx.state._artboardChildren = insideIndices;
        ctx.state._lassoSelected = null;
        ctx.state._moveCanDrag = true;
        ctx.state._moveDidDrag = false;
        ctx.state._axisLock = null;
        ctx.state._axisStart = { x, y };
        ctx.sync();
        return;
      }

      // Clicou no vazio: limpa seleções auxiliares
      ctx.state._movingArtboard = false;
      ctx.state._moveCanDrag = false;
      ctx.state._lassoSelected = null;
      ctx.sync();
    },

    onPointerMove(x, y, ctx, delta) {
      const mode = ctx.toolId;

      if (mode === "selectLasso" && Array.isArray(ctx.state._lassoPoints)) {
        ctx.state._lassoPoints.push({ x, y });
        ctx.sync();
        return;
      }

      if (!ctx.state._moveCanDrag) return;

      let dx = delta.dx;
      let dy = delta.dy;

      // Trava ortogonal no eixo predominante (funciona tanto para objetos quanto para prancheta)
      if (mode === "moveAxis" && ctx.state._axisStart) {
        const totalX = Math.abs(x - ctx.state._axisStart.x);
        const totalY = Math.abs(y - ctx.state._axisStart.y);
        if (!ctx.state._axisLock && (totalX > 4 || totalY > 4)) {
          ctx.state._axisLock = totalX >= totalY ? "x" : "y";
        }
        if (ctx.state._axisLock === "x") dy = 0;
        if (ctx.state._axisLock === "y") dx = 0;
      }

      if (dx === 0 && dy === 0) return;
      ctx.state._moveDidDrag = true;

      // Caso A: Movendo a Prancheta inteira + os objetos dentro dela
      if (ctx.state._movingArtboard) {
        const ab = getActiveArtboard(ctx);
        if (ab) {
          ab.x = (ab.x || 0) + dx;
          ab.y = (ab.y || 0) + dy;
          (ctx.state._artboardChildren || []).forEach((idx) => {
            translatePath(ctx.ws.paths[idx], dx, dy);
          });
        }
        ctx.sync();
        return;
      }

      // Caso B: Movendo grupo selecionado pelo Laço
      const group = ctx.state._lassoSelected;
      if (Array.isArray(group) && group.length > 1) {
        group.forEach((idx) => translatePath(ctx.ws.paths[idx], dx, dy));
        ctx.sync();
        return;
      }

      // Caso C: Movendo objeto individual selecionado
      const current = ctx.getSelectedPath();
      if (current) {
        translatePath(current, dx, dy);
        ctx.sync();
      }
    },

    onPointerUp(x, y, ctx) {
      if (ctx.toolId === "selectLasso" && Array.isArray(ctx.state._lassoPoints)) {
        const poly = ctx.state._lassoPoints;
        if (poly.length >= 3) {
          const matched = [];
          (ctx.ws.paths || []).forEach((p, idx) => {
            const b = ctx.getPathBounds(p);
            if (pointInPolygon({ x: b.cx, y: b.cy }, poly)) matched.push(idx);
          });
          if (matched.length > 0) {
            ctx.ws.selectedIndex = matched[matched.length - 1];
            ctx.state._lassoSelected = matched;
            ctx.core?.recordHistory?.("vector", `${matched.length} objeto(s) no laço`);
          } else {
            ctx.state._lassoSelected = [];
          }
        }
        ctx.state._lassoPoints = null;
        ctx.sync();
        return;
      }

      // Finaliza movimento da Prancheta
      if (ctx.state._movingArtboard) {
        if (ctx.state._moveDidDrag) {
          ctx.core?.recordHistory?.("vector", "Mover prancheta");
        }
        ctx.state._movingArtboard = false;
        ctx.state._artboardChildren = null;
        ctx.state._moveDidDrag = false;
        ctx.state._moveCanDrag = false;
        ctx.state._axisLock = null;
        return;
      }

      // Snap magnético ao soltar (ao grid ou ao centro da prancheta), se Ajuste estiver ativo
      const current = ctx.getSelectedPath();
      if (ctx.state._moveDidDrag && current && ctx.core?.state?.settings?.snapEnabled) {
        const b = ctx.getPathBounds(current);
        const ab = getActiveArtboard(ctx);
        const abCx = ab?.x || 0;
        const abCy = ab?.y || 0;

        // Imã para o centro exato da prancheta (tolerância de 8px)
        if (Math.abs(b.cx - abCx) <= 8 && Math.abs(b.cy - abCy) <= 8) {
          translatePath(current, abCx - b.cx, abCy - b.cy);
        } else {
          const snapStep = 10;
          const targetX = Math.round(b.cx / snapStep) * snapStep;
          const targetY = Math.round(b.cy / snapStep) * snapStep;
          const sdx = targetX - b.cx;
          const sdy = targetY - b.cy;
          if (Math.abs(sdx) <= 4 && Math.abs(sdy) <= 4) {
            translatePath(current, sdx, sdy);
          }
        }
      }

      if (ctx.state._moveDidDrag) {
        ctx.core?.recordHistory?.("vector", "Mover objeto");
      }

      ctx.state._moveDidDrag = false;
      ctx.state._moveCanDrag = false;
      ctx.state._axisLock = null;
    },

    renderOverlay(ctx, toolCtx) {
      // Destaque sutil na prancheta quando ela está sendo arrastada
      if (toolCtx.state._movingArtboard) {
        const ab = getActiveArtboard(toolCtx);
        if (ab) {
          const b = getArtboardBounds(ab);
          ctx.save();
          ctx.strokeStyle = "#f59e0b";
          ctx.lineWidth = 2;
          ctx.strokeRect(b.minX, b.minY, ab.width, ab.height);
          ctx.restore();
        }
      }

      // Desenha o contorno do laço de seleção livre
      const lasso = toolCtx.state._lassoPoints;
      if (Array.isArray(lasso) && lasso.length > 1) {
        ctx.save();
        ctx.strokeStyle = "#f59e0b";
        ctx.fillStyle = "rgba(245, 158, 11, 0.12)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        lasso.forEach((pt, i) => (i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)));
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      // Destaque extra para múltiplos itens capturados pelo laço
      const group = toolCtx.state._lassoSelected;
      if (Array.isArray(group) && group.length > 1) {
        ctx.save();
        ctx.strokeStyle = "rgba(245, 158, 11, 0.7)";
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        group.forEach((idx) => {
          const item = toolCtx.ws.paths[idx];
          if (!item) return;
          const b = toolCtx.getPathBounds(item);
          ctx.strokeRect(b.minX - 4, b.minY - 4, b.maxX - b.minX + 8, b.maxY - b.minY + 8);
        });
        ctx.restore();
      }

      // Guia visual do eixo travado durante o arrasto ortogonal
      if (toolCtx.toolId === "moveAxis" && toolCtx.state._axisLock && toolCtx.state._axisStart) {
        const s = toolCtx.state._axisStart;
        ctx.save();
        ctx.strokeStyle = "#0ea5e9";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        if (toolCtx.state._axisLock === "x") {
          ctx.moveTo(-2000, s.y);
          ctx.lineTo(2000, s.y);
        } else {
          ctx.moveTo(s.x, -2000);
          ctx.lineTo(s.x, 2000);
        }
        ctx.stroke();
        ctx.restore();
      }
    },

    onKeyDown(e, ctx) {
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) return;
      e.preventDefault();
      const step = e.shiftKey ? 10 : 1;
      const dx = e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
      const dy = e.key === "ArrowUp" ? -step : e.key === "ArrowDown" ? step : 0;

      // Move grupo do laço ou item selecionado via setas do teclado
      const group = ctx.state._lassoSelected;
      if (Array.isArray(group) && group.length > 1) {
        ctx.snapshot();
        group.forEach((idx) => translatePath(ctx.ws.paths[idx], dx, dy));
        ctx.sync();
        return;
      }

      const current = ctx.getSelectedPath();
      if (!current) return;
      ctx.snapshot();
      translatePath(current, dx, dy);
      ctx.sync();
    },
  };

  window.RoblesVectorTools.push(moveToolFamily);
})();