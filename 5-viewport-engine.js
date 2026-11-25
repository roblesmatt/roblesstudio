(() => {
  const Core = window.RoblesCore;
  if (!Core) return;

  const canvas = document.getElementById("scene-canvas");
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) return;

  let isDragging = false;
  let isPanning = false;
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  function updateNodeBuffer(node) {
    if (!node || !node.cacheCanvas) return;
    const bCanvas = node.cacheCanvas;
    const bCtx = bCanvas.getContext("2d");

    if (Core.modules[node.area]?.renderNode) {
      Core.modules[node.area].renderNode(node, bCtx, Core.state.timeline.currentTime);
      node.dirty = false;
      return;
    }

    const w = bCanvas.width;
    const h = bCanvas.height;

    bCtx.clearRect(0, 0, w, h);
    bCtx.save();
    bCtx.translate(w / 2, h / 2);

    const m = Core.state.measuresByArea[node.area] || { scale: 100, offsetX: 0, offsetY: 0, rotation: 0 };
    bCtx.rotate((m.rotation * Math.PI) / 180);
    const sc = (m.scale || 100) / 100;
    bCtx.scale(sc, sc);

    if (node.area === "vector") {
      (node.payload?.paths || []).forEach((p) => {
        if (!p.points?.length) return;
        bCtx.beginPath();
        p.points.forEach((pt, idx) => (idx === 0 ? bCtx.moveTo(pt.x, pt.y) : bCtx.lineTo(pt.x, pt.y)));
        if (p.closed) bCtx.closePath();
        if (p.fill) { bCtx.fillStyle = p.fill; bCtx.fill(); }
        bCtx.strokeStyle = p.stroke || "#38bdf8";
        bCtx.lineWidth = p.strokeWidth || 2.5;
        bCtx.stroke();

        if (Core.state.activeArea === "vector" && Core.state.selectedLayerId === node.id) {
          p.points.forEach((pt) => {
            bCtx.fillStyle = "#fff";
            bCtx.strokeStyle = "#0ea5e9";
            bCtx.fillRect(pt.x - 4, pt.y - 4, 8, 8);
            bCtx.strokeRect(pt.x - 4, pt.y - 4, 8, 8);
          });
        }
      });
    } else if (node.area === "pixel") {
      const cell = node.payload?.cellSize || 16;
      (node.payload?.strokes || []).forEach((st) => {
        bCtx.fillStyle = st.color || "#22c55e";
        bCtx.fillRect(st.x, st.y, cell, cell);
      });
    } else if (node.area === "video") {
      const t = Core.state.timeline.currentTime;
      const grad = bCtx.createLinearGradient(-180, -100, 180, 100);
      grad.addColorStop(0, "rgba(239, 68, 68, 0.35)");
      grad.addColorStop(0.5 + 0.3 * Math.sin(t * 2), "rgba(249, 115, 22, 0.45)");
      grad.addColorStop(1, "rgba(245, 158, 11, 0.35)");
      bCtx.fillStyle = grad;
      bCtx.fillRect(-180, -100, 360, 200);

      bCtx.strokeStyle = "#fb923c";
      bCtx.lineWidth = 3;
      bCtx.beginPath();
      for (let x = -160; x <= 160; x += 8) {
        const y = Math.sin(x * 0.04 + t * 5) * 28;
        x === -160 ? bCtx.moveTo(x, y) : bCtx.lineTo(x, y);
      }
      bCtx.stroke();
      bCtx.fillStyle = "rgba(255,255,255,0.85)";
      bCtx.font = "600 12px monospace";
      bCtx.fillText(`REC · ${t.toFixed(2)}s`, -165, -76);
    }

    bCtx.restore();
    node.dirty = false;
  }

  function projectPoint3D(x, y, z, cx, cy) {
    const cam = Core.state.camera;
    const x1 = x * Math.cos(cam.yaw) - z * Math.sin(cam.yaw);
    const z1 = x * Math.sin(cam.yaw) + z * Math.cos(cam.yaw);
    const y2 = y * Math.cos(cam.pitch) - z1 * Math.sin(cam.pitch);
    const z2 = y * Math.sin(cam.pitch) + z1 * Math.cos(cam.pitch);
    const scale = cam.zoom * (16 / Math.max(4, 16 + z2));
    return { x: cx + cam.panX + x1 * scale, y: cy + cam.panY - y2 * scale, z: z2 };
  }

  function drawTexturedQuad3D(p0, p1, p2, p3, sourceCanvas) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.lineTo(p3.x, p3.y);
    ctx.closePath();
    ctx.clip();
    const sw = sourceCanvas.width;
    const sh = sourceCanvas.height;
    ctx.transform((p1.x - p0.x) / sw, (p1.y - p0.y) / sw, (p3.x - p0.x) / sh, (p3.y - p0.y) / sh, p0.x, p0.y);
    ctx.drawImage(sourceCanvas, 0, 0);
    ctx.restore();
  }

  function draw3D(w, h) {
    const cx = w / 2;
    const cy = h / 2;

    if (Core.state.settings.showGrid) {
      ctx.lineWidth = 1;
      for (let i = -8; i <= 8; i++) {
        const a1 = projectPoint3D(i, -1.1, -8, cx, cy), a2 = projectPoint3D(i, -1.1, 8, cx, cy);
        ctx.strokeStyle = i === 0 ? "rgba(59,130,246,0.45)" : "rgba(255,255,255,0.06)";
        ctx.beginPath(); ctx.moveTo(a1.x, a1.y); ctx.lineTo(a2.x, a2.y); ctx.stroke();

        const b1 = projectPoint3D(-8, -1.1, i, cx, cy), b2 = projectPoint3D(8, -1.1, i, cx, cy);
        ctx.strokeStyle = i === 0 ? "rgba(239,68,68,0.45)" : "rgba(255,255,255,0.06)";
        ctx.beginPath(); ctx.moveTo(b1.x, b1.y); ctx.lineTo(b2.x, b2.y); ctx.stroke();
      }
    }

    const items = (Core.findLayer("grp-3d")?.children || []).filter((n) => n.visible);
    items.forEach((node, idx) => {
      const dims = node.payload?.dimensions || { w: 3, h: 2, d: 3 };
      const ox = idx === 0 ? 0 : idx === 1 ? -3.4 : 3.5;
      const hw = dims.w / 2, hh = dims.h / 2, hd = dims.d / 2;
      const v = [
        projectPoint3D(ox - hw, -hh, -hd, cx, cy), projectPoint3D(ox + hw, -hh, -hd, cx, cy),
        projectPoint3D(ox + hw, hh, -hd, cx, cy),  projectPoint3D(ox - hw, hh, -hd, cx, cy),
        projectPoint3D(ox - hw, -hh, hd, cx, cy),  projectPoint3D(ox + hw, -hh, hd, cx, cy),
        projectPoint3D(ox + hw, hh, hd, cx, cy),   projectPoint3D(ox - hw, hh, hd, cx, cy),
      ];

      const faces = [
        { indices: [4, 5, 6, 7], textured: true },
        { indices: [3, 2, 6, 7], textured: true },
        { indices: [1, 5, 6, 2], textured: false },
        { indices: [0, 4, 7, 3], textured: false },
        { indices: [0, 1, 2, 3], textured: false },
      ].sort((a, b) => b.indices.reduce((s, i) => s + v[i].z, 0) - a.indices.reduce((s, i) => s + v[i].z, 0));

      const texNode = Core.state.settings.liveSync2Dto3D && node.payload?.textureLayerId
        ? Core.findLayer(node.payload.textureLayerId)
        : null;
      if (texNode && (texNode.dirty || texNode.area === "video")) updateNodeBuffer(texNode);

      const isSel = Core.state.selectedLayerId === node.id;
      faces.forEach((f) => {
        const [i0, i1, i2, i3] = f.indices;
        ctx.beginPath();
        ctx.moveTo(v[i0].x, v[i0].y); ctx.lineTo(v[i1].x, v[i1].y); ctx.lineTo(v[i2].x, v[i2].y); ctx.lineTo(v[i3].x, v[i3].y);
        ctx.closePath();
        ctx.fillStyle = isSel ? "rgba(245, 158, 11, 0.22)" : "rgba(255,255,255,0.06)";
        ctx.fill();
        if (f.textured && texNode && texNode.visible) drawTexturedQuad3D(v[i3], v[i2], v[i1], v[i0], texNode.cacheCanvas);
        ctx.strokeStyle = isSel ? "rgba(245, 158, 11, 0.9)" : "rgba(255, 255, 255, 0.25)";
        ctx.stroke();
      });
    });
  }

  function draw2D(w, h) {
    const cam2D = Core.state.camera2D;
    const cx = w / 2 + cam2D.panX;
    const cy = h / 2 + cam2D.panY;

    const items = (Core.findLayer("grp-2d")?.children || []).filter((n) => n.visible).slice().reverse();
    items.forEach((node) => {
      if (node.dirty || node.area === "video") updateNodeBuffer(node);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(cam2D.zoom, cam2D.zoom);
      ctx.drawImage(node.cacheCanvas, -node.cacheCanvas.width / 2, -node.cacheCanvas.height / 2);
      ctx.restore();
    });
  }

  function render() {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    Core.state.activeArea === "3d" ? draw3D(w, h) : draw2D(w, h);

    ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
    ctx.font = "500 11px system-ui, sans-serif";
    ctx.fillText(`ROBLES STUDIO · ${Core.getAreaMeta().label.toUpperCase()} (${Core.state.activePreset}) · StudioLink Ativo`, 16, h - 62);
  }

  canvas.addEventListener("pointerdown", (e) => {
  canvas.setPointerCapture(e.pointerId);
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  const pressure = e.pointerType === "pen" ? (e.pressure || 0.5) : 0.5;

  activeModule?.onMouseDown?.(x, y, { pressure, pointerType: e.pointerType, tiltX: e.tiltX, tiltY: e.tiltY });
});

canvas.addEventListener("pointermove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  const pressure = e.pointerType === "pen" ? (e.pressure || 0.5) : 0.5;

  activeModule?.onMouseMove?.(x, y, { pressure, pointerType: e.pointerType, tiltX: e.tiltX, tiltY: e.tiltY });
});

canvas.addEventListener("pointerup", (e) => {
  canvas.releasePointerCapture(e.pointerId);
  activeModule?.onMouseUp?.();
});


  function handleDraw(e) {
    const rect = canvas.getBoundingClientRect();
    const cam2D = Core.state.camera2D;
    const x = (e.clientX - rect.left - rect.width / 2 - cam2D.panX) / cam2D.zoom;
    const y = (e.clientY - rect.top - rect.height / 2 - cam2D.panY) / cam2D.zoom;

    if (Core.modules[Core.state.activeArea]?.onPointerDraw) {
      Core.modules[Core.state.activeArea].onPointerDraw(x, y);
      return;
    }

    if (Core.state.activeArea === "pixel") {
      const px = Core.findLayer("l-px-canvas");
      const gx = Math.floor(x / 16) * 16, gy = Math.floor(y / 16) * 16;
      if (px && !px.payload.strokes.some((s) => s.x === gx && s.y === gy)) {
        px.payload.strokes.push({ x: gx, y: gy, color: "#22c55e" });
        Core.invalidateNode(px.id);
      }
    } else if (Core.state.activeArea === "vector") {
      const vec = Core.findLayer("l-vec-path");
      if (vec?.payload?.paths?.[0]) {
        vec.payload.paths[0].points.push({ x: Math.round(x), y: Math.round(y) });
        Core.invalidateNode(vec.id);
      }
    }
  }

  window.addEventListener("pointermove", (e) => {
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    if (isPanning) {
      const target = Core.state.activeArea === "3d" ? Core.state.camera : Core.state.camera2D;
      target.panX += dx; target.panY += dy;
      render();
    } else if (isDragging && Core.state.activeArea === "3d") {
      Core.state.camera.yaw += dx * 0.008;
      Core.state.camera.pitch = Math.max(-1.4, Math.min(1.4, Core.state.camera.pitch + dy * 0.008));
      render();
    } else if (isDrawing && Core.state.activeArea === "pixel") {
      handleDraw(e);
    }
  });

  window.addEventListener("pointerup", () => {
    if (isDrawing) Core.recordHistory(Core.state.activeArea, `Traço em ${Core.getAreaMeta().label}`);
    isDragging = isPanning = isDrawing = false;
  });

  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    if (Core.state.activeArea === "3d") Core.state.camera.zoom = Math.max(12, Math.min(140, Core.state.camera.zoom - e.deltaY * 0.04));
    else Core.state.camera2D.zoom = Math.max(0.25, Math.min(4, Core.state.camera2D.zoom - e.deltaY * 0.001));
    render();
  }, { passive: false });

  function tick(now) {
    const tl = Core.state.timeline;
    tl.currentTime += (now - tl.lastTick) / 1000;
    tl.lastTick = now;
    if (tl.playing && ["video", "3d"].includes(Core.state.activeArea)) render();
    requestAnimationFrame(tick);
  }

  Core.on("render:request", render);
  window.addEventListener("resize", render);
  render();
  requestAnimationFrame(tick);
})();
