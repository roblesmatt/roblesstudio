(() => {
  'use strict';
  const Core = window.RoblesCore;
  if (!Core) return;
  const canvas = document.getElementById('scene-canvas');
  const ctx = canvas && canvas.getContext('2d');
  if (!ctx) return;
  canvas.style.touchAction = 'none';

  const INK = '#3d2d2d';
  const view = Core.state.camera2D;           // pan / zoom / rotation (rad) da vista 2D e dos módulos
  if (typeof view.rotation !== 'number') view.rotation = 0;

  let W = 0, H = 0, raf = 0;
  let gesture = null, mode = null, spaceDown = false;
  let last = { x: 0, y: 0 };
  const pointers = new Map();
  const warned = new Set();

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const area = () => Core.state.activeArea;
  const mod = () => Core.modules[area()];

  function size() {
    W = canvas.clientWidth || window.innerWidth;
    H = canvas.clientHeight || window.innerHeight;
  }

  /* ------------------------------------------------------------------
     Coordenadas: tela -> espaço da câmera -> espaço local do módulo
     (o módulo desenha em 0,0 = centro; aqui entram pan, zoom, rotação
      da vista e escala/rotação da gaveta "Medidas")
  ------------------------------------------------------------------ */
  function measure() {
    const m = Core.state.measuresByArea[area()] || {};
    return { sc: Math.max(0.05, (m.scale || 100) / 100), rot: ((m.rotation || 0) * Math.PI) / 180 };
  }
  function toCam(sx, sy) {
    const cos = Math.cos(-view.rotation), sin = Math.sin(-view.rotation);
    const dx = sx - W / 2 - view.panX, dy = sy - H / 2 - view.panY;
    return { x: (dx * cos - dy * sin) / view.zoom, y: (dx * sin + dy * cos) / view.zoom };
  }
  function toLocal(sx, sy) {
    const q = toCam(sx, sy), M = measure();
    const cos = Math.cos(-M.rot), sin = Math.sin(-M.rot);
    return { x: (q.x * cos - q.y * sin) / M.sc, y: (q.x * sin + q.y * cos) / M.sc };
  }
  // muda zoom/rotação mantendo o ponto sob (sx, sy) parado na tela
  function anchorZoom(sx, sy, zoom, rotation) {
    const p = toCam(sx, sy);
    view.zoom = clamp(zoom, 0.1, 16);
    view.rotation = rotation;
    const cos = Math.cos(rotation), sin = Math.sin(rotation);
    view.panX = sx - W / 2 - view.zoom * (p.x * cos - p.y * sin);
    view.panY = sy - H / 2 - view.zoom * (p.x * sin + p.y * cos);
  }
  function resetView() {
    view.zoom = 1; view.panX = 0; view.panY = 0; view.rotation = 0;
    schedule();
  }

  function screenXY(e) {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  function info(e) {
    return { pressure: e.pointerType === 'pen' ? (e.pressure || 0.5) : 0.5, pointerType: e.pointerType, tiltX: e.tiltX, tiltY: e.tiltY };
  }
  function callModule(name, a, b, c) {
    const m = mod();
    if (!m || typeof m[name] !== 'function') return;
    try { m[name](a, b, c); } catch (err) {
      const key = area() + name;
      if (!warned.has(key)) { warned.add(key); console.error('[Robles] erro em ' + area() + '.' + name, err); }
    }
  }

  /* ------------------------------------------------------------------
     Desenho
  ------------------------------------------------------------------ */
  function drawGrid() {
    const ctr = toCam(W / 2, H / 2);
    const R = Math.hypot(W, H) / view.zoom / 2;
    let step = 32;
    while ((R * 2) / step > 120) step *= 2;
    const x0 = Math.floor((ctr.x - R) / step) * step, x1 = ctr.x + R;
    const y0 = Math.floor((ctr.y - R) / step) * step, y1 = ctr.y + R;
    ctx.lineWidth = 1 / view.zoom;
    ctx.strokeStyle = 'rgba(61,45,45,0.10)';
    ctx.beginPath();
    for (let x = x0; x <= x1; x += step) { ctx.moveTo(x, y0); ctx.lineTo(x, y1); }
    for (let y = y0; y <= y1; y += step) { ctx.moveTo(x0, y); ctx.lineTo(x1, y); }
    ctx.stroke();
  }

  // Cada área desenha SOMENTE o seu módulo (render do próprio módulo, sem cache 512x512)
  function drawActiveModule() {
    const m = mod();
    const M = measure();
    ctx.save();
    ctx.translate(W / 2 + view.panX, H / 2 + view.panY);
    ctx.rotate(view.rotation);
    ctx.scale(view.zoom, view.zoom);
    ctx.rotate(M.rot);
    ctx.scale(M.sc, M.sc);
    try { m.render(ctx, 0, 0); } catch (err) {
      if (!warned.has('render' + area())) { warned.add('render' + area()); console.error('[Robles] erro em ' + area() + '.render', err); }
    }
    ctx.restore();
  }

  // Fallback quando o módulo não tem render(): camadas em cache da própria área
  function updateNodeBuffer(node) {
    const m = Core.modules[node.area];
    if (m && m.renderNode) { m.renderNode(node, node.cacheCanvas.getContext('2d'), Core.state.timeline.currentTime); node.dirty = false; }
  }
  function drawCachedLayers() {
    const M = measure();
    ctx.save();
    ctx.translate(W / 2 + view.panX, H / 2 + view.panY);
    ctx.rotate(view.rotation);
    ctx.scale(view.zoom, view.zoom);
    ctx.rotate(M.rot);
    ctx.scale(M.sc, M.sc);
    const items = ((Core.findLayer('grp-2d') || {}).children || []).filter((n) => n.visible && n.area === area()).slice().reverse();
    items.forEach((n) => {
      if (n.dirty || area() === 'video') updateNodeBuffer(n);
      ctx.globalAlpha = (n.opacity == null ? 100 : n.opacity) / 100;
      ctx.drawImage(n.cacheCanvas, -n.cacheCanvas.width / 2, -n.cacheCanvas.height / 2);
    });
    ctx.restore();
  }

  // Fallback 3D do core (cubos + textura 2D) quando 3d.js não está carregado
  function project(x, y, z, cx, cy) {
    const c = Core.state.camera;
    const x1 = x * Math.cos(c.yaw) - z * Math.sin(c.yaw), z1 = x * Math.sin(c.yaw) + z * Math.cos(c.yaw);
    const y2 = y * Math.cos(c.pitch) - z1 * Math.sin(c.pitch), z2 = y * Math.sin(c.pitch) + z1 * Math.cos(c.pitch);
    const s = c.zoom * (16 / Math.max(4, 16 + z2));
    return { x: cx + c.panX + x1 * s, y: cy + c.panY - y2 * s, z: z2 };
  }
  function drawFallback3D() {
    const cx = W / 2 + view.panX, cy = H / 2 + view.panY;
    ((Core.findLayer('grp-3d') || {}).children || []).filter((n) => n.visible).forEach((node, idx) => {
      const d = (node.payload && node.payload.dimensions) || { w: 3, h: 2, d: 3 };
      const ox = idx === 0 ? 0 : idx === 1 ? -3.4 : 3.5, hw = d.w / 2, hh = d.h / 2, hd = d.d / 2;
      const v = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]]
        .map((s) => project(ox + s[0] * hw, s[1] * hh, s[2] * hd, cx, cy));
      [[4,5,6,7],[3,2,6,7],[1,5,6,2],[0,4,7,3],[0,1,2,3]].forEach((f) => {
        ctx.beginPath();
        f.forEach((i, k) => (k ? ctx.lineTo(v[i].x, v[i].y) : ctx.moveTo(v[i].x, v[i].y)));
        ctx.closePath();
        ctx.fillStyle = 'rgba(61,45,45,0.06)'; ctx.fill();
        ctx.strokeStyle = 'rgba(61,45,45,0.55)'; ctx.stroke();
      });
    });
  }

  function render() {
    raf = 0;
    const dpr = window.devicePixelRatio || 1;
    size();
    if (canvas.width !== Math.floor(W * dpr) || canvas.height !== Math.floor(H * dpr)) {
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const m = mod();
    if (m && typeof m.render === 'function') drawActiveModule();
    else if (area() === '3d') drawFallback3D();
    else drawCachedLayers();

    ctx.fillStyle = 'rgba(61,45,45,0.55)';
    ctx.font = '500 11px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('ROBLES STUDIO · ' + Core.getAreaMeta().label.toUpperCase() + ' · ' + Core.state.activePreset, 16, H - 62);
  }
  function schedule() { if (!raf) raf = requestAnimationFrame(render); }

  /* ------------------------------------------------------------------
     Gestos de 2 dedos (pan + pinça + rotação)
  ------------------------------------------------------------------ */
  const touchPts = () => [...pointers.values()].filter((p) => p.type === 'touch').slice(0, 2);
  function metrics() {
    const [a, b] = touchPts();
    return { cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2, d: Math.hypot(b.x - a.x, b.y - a.y) || 1, ang: Math.atan2(b.y - a.y, b.x - a.x) };
  }
  function updateGesture() {
    const m = metrics(), g = gesture;
    view.panX += m.cx - g.cx;
    view.panY += m.cy - g.cy;
    anchorZoom(m.cx, m.cy, view.zoom * (m.d / g.d), view.rotation + (m.ang - g.ang));
    gesture = m;
    schedule();
  }

  /* ------------------------------------------------------------------
     Pointer Events: 1 dedo / Pencil / mouse -> módulo. 2 dedos -> vista.
  ------------------------------------------------------------------ */
  function endStroke() {
    if (mode === 'tool') callModule('onMouseUp');
    mode = null;
  }
  canvas.addEventListener('pointerdown', (e) => {
    const penDown = [...pointers.values()].some((p) => p.type === 'pen');
    if (e.pointerType === 'touch' && penDown) return;           // rejeição de palma
    size();
    try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
    const s = screenXY(e);
    pointers.set(e.pointerId, { x: s.x, y: s.y, type: e.pointerType });
    if (touchPts().length >= 2) { endStroke(); gesture = metrics(); mode = 'gesture'; return; }
    last = s;
    if (e.button === 1 || spaceDown) { e.preventDefault(); mode = 'pan'; return; }
    const p = toLocal(s.x, s.y);
    mode = 'tool';
    callModule('onMouseDown', p.x, p.y, info(e));
    schedule();
  });
  canvas.addEventListener('pointermove', (e) => {
    const rec = pointers.get(e.pointerId);
    if (!rec) return;
    const s = screenXY(e);
    rec.x = s.x; rec.y = s.y;
    if (gesture) { updateGesture(); return; }
    const dx = s.x - last.x, dy = s.y - last.y;
    last = s;
    if (mode === 'pan') { view.panX += dx; view.panY += dy; schedule(); }
    else if (mode === 'tool') {
      const p = toLocal(s.x, s.y);
      callModule('onMouseMove', p.x, p.y, info(e));
      schedule();
    }
  });
  function release(e) {
    if (!pointers.has(e.pointerId)) return;
    pointers.delete(e.pointerId);
    try { if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId); } catch (_) {}
    if (gesture) {
      if (touchPts().length < 2) gesture = null;
      mode = null;
      return;
    }
    endStroke();
    schedule();
  }
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());

  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    size();
    const s = screenXY(e);
    if (e.shiftKey || e.altKey) anchorZoom(s.x, s.y, view.zoom, view.rotation + (e.deltaY || e.deltaX) * 0.003);
    else anchorZoom(s.x, s.y, view.zoom * Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0015)), view.rotation);
    schedule();
  }, { passive: false });

  const typing = () => ['INPUT', 'TEXTAREA', 'SELECT'].includes((document.activeElement || {}).tagName);
  window.addEventListener('keydown', (e) => {
    if (typing()) return;
    if (e.code === 'Space') { spaceDown = true; e.preventDefault(); }
    if ((e.ctrlKey || e.metaKey) && e.key === '0') { e.preventDefault(); resetView(); }
  });
  window.addEventListener('keyup', (e) => { if (e.code === 'Space') spaceDown = false; });
  window.addEventListener('blur', () => { spaceDown = false; });

  function tick(now) {
    const tl = Core.state.timeline;
    tl.currentTime += (now - tl.lastTick) / 1000;
    tl.lastTick = now;
    if (tl.playing && ['video', '3d'].includes(area())) schedule();
    requestAnimationFrame(tick);
  }

  Core.view = { toLocal, anchorZoom, resetView };
  Core.on('render:request', schedule);
  Core.on('area:changed', () => { gesture = null; mode = null; schedule(); });
  window.addEventListener('resize', schedule);
  size();
  render();
  requestAnimationFrame(tick);
})();
