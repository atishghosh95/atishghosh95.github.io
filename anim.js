// =====================================================================
// Research animations used on the Research section and the
// "Research explained" page. Any <canvas class="anim" data-anim="NAME">
// on a page is animated automatically, where NAME is one of:
//   dft, aimd, namd, hop, gnn, pv, water, nrr, electro, spin,
//   battery, thermo, qd, gas (flagship GaS NRR story), eqc (E(q)C-GNN story), bcof (B-aza-COF NRR story)
// To add an animation to a page, copy one such <canvas> line.
// You don't need to edit this file.
// =====================================================================
(function () {
  const W = 440, H = 300;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  let C = {};
  const readColors = () => {
    C = { ink: css("--ink"), muted: css("--muted"), teal: css("--teal"), amber: css("--amber"),
          rule: css("--rule"), paper: css("--paper"), blue: css("--blue"), rose: css("--rose") };
  };
  readColors();

  // ---------- helpers ----------
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const prog = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
  const lerp = (a, b, k) => a + (b - a) * k;
  const fade = (t, a, b, c, d) => Math.min(prog(t, a, b), 1 - prog(t, c, d));   // fade in a→b, out c→d

  function dot(c, x, y, r, fill, alpha = 1, stroke, sw = 1.3) {
    if (alpha <= 0) return;
    c.globalAlpha = alpha; c.beginPath(); c.arc(x, y, r, 0, 7);
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.lineWidth = sw; c.strokeStyle = stroke; c.stroke(); }
    c.globalAlpha = 1;
  }
  function glow(c, x, y, r, color, alpha) {
    if (alpha <= 0) return;
    const g = c.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color); g.addColorStop(1, "transparent");
    c.globalAlpha = alpha; c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.globalAlpha = 1;
  }
  function line(c, x1, y1, x2, y2, color, w = 1.5, alpha = 1, dash) {
    if (alpha <= 0) return;
    c.globalAlpha = alpha; c.strokeStyle = color; c.lineWidth = w; c.setLineDash(dash || []);
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); c.setLineDash([]); c.globalAlpha = 1;
  }
  function poly(c, pts, color, w = 1.5, alpha = 1, close = false) {
    c.globalAlpha = alpha; c.strokeStyle = color; c.lineWidth = w; c.beginPath();
    pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]));
    if (close) c.closePath(); c.stroke(); c.globalAlpha = 1;
  }
  function rect(c, x, y, w, h, fill, alpha = 1, stroke) {
    c.globalAlpha = alpha;
    if (fill) { c.fillStyle = fill; c.fillRect(x, y, w, h); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = 1.3; c.strokeRect(x, y, w, h); }
    c.globalAlpha = 1;
  }
  function text(c, s, x, y, color, size = 12, align = "left", alpha = 1, weight = 500) {
    if (alpha <= 0) return;
    c.globalAlpha = alpha; c.fillStyle = color; c.textAlign = align; c.textBaseline = "middle";
    c.font = `${weight} ${size}px "Public Sans", Arial, sans-serif`; c.fillText(s, x, y); c.globalAlpha = 1;
  }
  function head(c, x, y, ang, color, s = 7, alpha = 1) {
    c.globalAlpha = alpha; c.fillStyle = color; c.beginPath(); c.moveTo(x, y);
    c.lineTo(x - s * Math.cos(ang - .45), y - s * Math.sin(ang - .45));
    c.lineTo(x - s * Math.cos(ang + .45), y - s * Math.sin(ang + .45)); c.closePath(); c.fill(); c.globalAlpha = 1;
  }
  function arrow(c, x1, y1, x2, y2, color, w = 1.6, alpha = 1) {
    line(c, x1, y1, x2, y2, color, w, alpha); head(c, x2, y2, Math.atan2(y2 - y1, x2 - x1), color, 7, alpha);
  }
  function photon(c, x1, y1, x2, y2, k, color, alpha = 1) {   // wavy light arrow, drawn up to fraction k
    const L = Math.hypot(x2 - x1, y2 - y1), a = Math.atan2(y2 - y1, x2 - x1), n = Math.floor(L * clamp(k, 0, 1));
    if (n < 3 || alpha <= 0) return;
    c.globalAlpha = alpha; c.strokeStyle = color; c.lineWidth = 1.7; c.beginPath();
    for (let i = 0; i <= n; i++) {
      const w = Math.sin(i / 4) * 4;
      const px = x1 + Math.cos(a) * i - Math.sin(a) * w, py = y1 + Math.sin(a) * i + Math.cos(a) * w;
      i ? c.lineTo(px, py) : c.moveTo(px, py);
    }
    c.stroke(); c.globalAlpha = 1;
    head(c, x1 + Math.cos(a) * n, y1 + Math.sin(a) * n, a, color, 7, alpha);
  }
  function electron(c, x, y, a = 1, label = true) {
    glow(c, x, y, 15, C.teal, .4 * a); dot(c, x, y, 5.5, C.teal, a);
    if (label) text(c, "e⁻", x + 9, y - 9, C.teal, 11, "left", a);
  }
  function hole(c, x, y, a = 1, label = true) {
    dot(c, x, y, 5.5, C.paper, a, C.amber, 2);
    if (label) text(c, "h⁺", x + 9, y + 10, C.amber, 11, "left", a);
  }
  function sun(c, x, y, t, r = 18) {
    glow(c, x, y, r * 2.4, C.amber, .35);
    dot(c, x, y, r, C.amber, .95);
    for (let i = 0; i < 10; i++) {
      const a = i / 10 * 6.283 + t * .3;
      line(c, x + Math.cos(a) * (r + 5), y + Math.sin(a) * (r + 5), x + Math.cos(a) * (r + 12), y + Math.sin(a) * (r + 12), C.amber, 2, .8);
    }
  }
  // a stream of rising bubbles from (x, y0): one every 1/rate seconds, starting at time t0
  function bubbles(c, x, y0, yTop, t, t0, rate, color, label, seed = 0) {
    if (t < t0) return;
    const n = Math.floor((t - t0) * rate);
    for (let k = Math.max(0, n - 12); k <= n; k++) {
      const age = t - (t0 + k / rate), y = y0 - age * 42;
      if (age < 0 || y < yTop) continue;
      const x2 = x + Math.sin(age * 4 + k * 1.7 + seed) * 5 + ((k * 37 + seed) % 15) - 7;
      const r = 3.5 + Math.min(age, 1.5) * 2;
      dot(c, x2, y, r, null, 1 - prog(y, y0 - 40, yTop) * .2, color, 1.4);
      if (label && k % 3 === 0 && age > .8) text(c, label, x2 + r + 4, y, color, 10, "left", .85);
    }
  }
  function caption(c, s, a = 1) { text(c, s, 16, 20, C.ink, 13, "left", a); }

  // ===================================================================
  const S = {};

  // shared: a row of stage chips under the caption
  function chipRow(c, names, k) {
    let x = 16;
    names.forEach((s, i) => {
      c.font = '600 11px "Public Sans", Arial, sans-serif';
      const w = c.measureText(s).width + 16, on = i === k, done = i < k;
      c.globalAlpha = 1; c.fillStyle = on ? C.ink : "transparent"; c.strokeStyle = on ? C.ink : C.rule; c.lineWidth = 1;
      c.beginPath(); c.roundRect ? c.roundRect(x, 36, w, 20, 10) : c.rect(x, 36, w, 20); c.fill(); c.stroke();
      text(c, s, x + w / 2, 46.5, on ? C.paper : done ? C.teal : C.muted, 11, "center", 1, 600);
      x += w + 5;
    });
  }

  // ---------- DFT on a real system: the holey C2N monolayer ----------
  S.dft = (() => {
    const r = 11, d = 3.464 * r, cx0 = 40, cy0 = 70;
    const atoms = [], bonds = [];
    const a1 = [1.5 * d, Math.sqrt(3) / 2 * d], a2 = [1.5 * d, -Math.sqrt(3) / 2 * d];
    const inBox = (x, y) => x > 8 && x < 274 && y > 72 && y < 274;
    const add = (x, y, el) => { if (inBox(x, y) && !atoms.some(a => Math.hypot(a[0] - x, a[1] - y) < 2)) atoms.push([x, y, el]); };
    for (let m = -6; m <= 6; m++) for (let n = -6; n <= 6; n++) {
      const A = [cx0 + m * a1[0] + n * a2[0], cy0 + 110 + m * a1[1] + n * a2[1]];
      [[A, [0, 120, 240]], [[A[0] + d, A[1]], [180, 300, 60]]].forEach(([P, dirs]) => {
        for (let k = 0; k < 6; k++) { const an = (30 + 60 * k) * Math.PI / 180; add(P[0] + r * Math.cos(an), P[1] + r * Math.sin(an), "C"); }
        dirs.forEach(deg => {
          const u = [Math.cos(deg * Math.PI / 180), Math.sin(deg * Math.PI / 180)], Q = [P[0] + 1.732 * r * u[0], P[1] + 1.732 * r * u[1]];
          add(Q[0] - r * u[1], Q[1] + r * u[0], "N"); add(Q[0] + r * u[1], Q[1] - r * u[0], "N");
        });
      });
    }
    for (let i = 0; i < atoms.length; i++) for (let j = i + 1; j < atoms.length; j++)
      if (Math.hypot(atoms[i][0] - atoms[j][0], atoms[i][1] - atoms[j][1]) < r * 1.08) bonds.push([i, j]);
    return {
      dur: 8,
      draw(c, t) {
        const n = Math.min(12, Math.floor(prog(t, .4, 5.2) * 12)), k = n / 12;
        const spread = lerp(34, 13, ease(k));
        atoms.forEach(a => glow(c, a[0], a[1], spread, C.teal, lerp(.05, .22, k)));
        bonds.forEach(([i, j]) => line(c, atoms[i][0], atoms[i][1], atoms[j][0], atoms[j][1], C.muted, 1.5, .6));
        atoms.forEach(a => dot(c, a[0], a[1], a[2] === "N" ? 4.2 : 3.6, a[2] === "N" ? C.blue : C.muted, .95));
        text(c, "C₂N monolayer (top view)", 140, 292, C.muted, 11, "center");
        const words = ["guess", "solve", "improve"], cur = Math.floor(t / .42) % 3;
        words.forEach((w, i) => text(c, w, 16 + i * 66, 48, i === cur && n < 12 ? C.amber : C.muted, 12, "left", 1, i === cur && n < 12 ? 600 : 500));
        text(c, "→", 60, 48, C.muted, 12); text(c, "→", 126, 48, C.muted, 12);
        // right panel: convergence, then results
        const X0 = 296, X1 = 424, Y0 = 82, Y1 = 186;
        line(c, X0, Y1, X1, Y1, C.muted, 1); line(c, X0, Y1, X0, Y0 - 8, C.muted, 1);
        text(c, "energy", X0 + 4, Y0 - 14, C.muted, 11); text(c, "attempt", X1, Y1 + 12, C.muted, 11, "right");
        const E = i => 1 - Math.exp(-i / 2.4) + .35 * Math.cos(i * 2.1) * Math.exp(-i / 1.8);
        const pts = []; for (let i = 0; i <= n; i++) pts.push([lerp(X0 + 8, X1 - 4, i / 12), lerp(Y0, Y1 - 8, E(i) / 1.25)]);
        if (pts.length > 1) poly(c, pts, C.amber, 1.6); pts.forEach(p => dot(c, p[0], p[1], 2.8, C.amber));
        const out = ["structure ✓", "charge density ✓", "band gap ✓", "where Li/O₂ bind ✓"];
        out.forEach((s, i) => text(c, s, X0, 214 + i * 18, C.ink, 12, "left", prog(t, 5.3 + i * .35, 5.7 + i * .35)));
        caption(c, n < 12 ? `DFT step ${n + 1}: solving for C₂N's electrons` : "Converged: now we know how C₂N behaves");
      }
    };
  })();

  // ---------- AIMD on a real system: g-CN / WTe2 heterostructure ----------
  S.aimd = (() => {
    const N = 16, sx = 26, x0 = 18;
    const rows = [  // y, element, colour key, x offset
      [104, "cn", 0], [150, "Te", 13], [170, "W", 0], [190, "Te", 13]];
    return {
      dur: 10,
      draw(c, t) {
        const pos = rows.map(([y, el, off], ri) => Array.from({ length: N }, (_, i) => {
          const a = el === "cn" ? 4.5 : 3, ph = i * 1.9 + ri * 2.7;
          return [x0 + i * sx + off + a * Math.sin(t * (6 + (i % 3)) + ph), y + a * 1.1 * Math.cos(t * (7 + (i % 4)) + ph * 1.3), el, i];
        }));
        // bonds
        for (let i = 0; i + 1 < N; i++) line(c, pos[0][i][0], pos[0][i][1], pos[0][i + 1][0], pos[0][i + 1][1], C.muted, 1.6, .6);
        for (let i = 0; i < N; i++) {
          [pos[1], pos[3]].forEach(row => {
            line(c, pos[2][i][0], pos[2][i][1], row[i][0], row[i][1], C.muted, 1.4, .5);
            if (i + 1 < N) line(c, pos[2][i + 1][0], pos[2][i + 1][1], row[i][0], row[i][1], C.muted, 1.4, .5);
          });
        }
        pos[0].forEach(p => dot(c, p[0], p[1], 6, p[3] % 3 === 1 ? C.muted : C.blue, .95));
        pos[1].concat(pos[3]).forEach(p => dot(c, p[0], p[1], 6.5, C.amber, .9));
        pos[2].forEach(p => dot(c, p[0], p[1], 7.5, C.rose, .9));
        text(c, "g-CN layer", 16, 80, C.ink, 12); text(c, "WTe₂ layer", 16, 216, C.ink, 12);
        line(c, 300, 114, 300, 140, C.muted, 1, .8, [2, 3]); text(c, "van der Waals gap", 306, 127, C.muted, 10);
        // force arrow on one g-CN atom
        const p = pos[0][7], fx = (x0 + 7 * sx - p[0]) * 5, fy = (104 - p[1]) * 5;
        if (Math.hypot(fx, fy) > 6) arrow(c, p[0], p[1], p[0] + fx, p[1] + fy, C.teal, 2);
        // energy trace
        const X0 = 30, X1 = 300, Y0 = 236, Y1 = 280, ps = 5 * prog(t, 0, 9.4);
        line(c, X0, Y1, X1, Y1, C.muted, 1); line(c, X0, Y1, X0, Y0, C.muted, 1);
        text(c, "energy", X0 + 4, Y0 - 6, C.muted, 10); text(c, "time (ps)", X1, Y1 + 11, C.muted, 10, "right");
        const pts = [];
        for (let k = 0; k <= 160 * ps / 5; k++) { const s = k / 160, e = Math.exp(-s * 25) * .8 + .12 * Math.sin(k * 1.7) * Math.sin(k * .31) + .05 * Math.sin(k * 3.3); pts.push([lerp(X0, X1, s), lerp(Y0 + 22, Y0 + 6, -e) ]); }
        if (pts.length > 1) poly(c, pts, C.amber, 1.4);
        text(c, `${ps.toFixed(2)} ps`, 424, 246, C.ink, 13, "right", 1, 600);
        text(c, "300 K", 424, 266, C.muted, 12, "right");
        text(c, "stays intact ✓", 424, 286, C.teal, 12, "right", prog(t, 7, 7.6));
        caption(c, "AIMD: every atom moves under forces from DFT, 1 fs at a time");
      }
    };
  })();

  // ---------- E(q)C-GNN story (J. Phys. Chem. Lett. 2025) ----------
  S.eqc = (() => {
    const names = ["AIMD data", "Graph", "Messages", "Predict", "Speed"];
    const ST = [0, 3.8, 7.4, 11.2, 15.2], END = 19.5;
    const R = 34, cx = 150, cy = 172;
    const nodes = [], edges = [];
    for (let k = 0; k < 6; k++) nodes.push([Math.cos(k * Math.PI / 3 + Math.PI / 6) * R, Math.sin(k * Math.PI / 3 + Math.PI / 6) * R, k % 2]);
    for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3 + Math.PI / 6; nodes.push([Math.cos(a) * R * 2, Math.sin(a) * R * 2, (k + 1) % 2]); }
    for (let k = 0; k < 6; k++) { edges.push([k, (k + 1) % 6]); edges.push([k, k + 6]); }
    for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3 + Math.PI / 6 + Math.PI / 6; nodes.push([Math.cos(a) * R * 2.3, Math.sin(a) * R * 2.3, k % 2]); edges.push([6 + k, 12 + k]); edges.push([6 + (k + 1) % 6, 12 + k]); }
    const stage = t => { let k = 0; ST.forEach((s, i) => { if (t >= s) k = i; }); return k; };
    return {
      dur: END,
      draw(c, t) {
        const k = stage(t); chipRow(c, names, k);
        let cap = "";
        if (k === 0) {
          cap = "Step 1: run expensive AIMD on g-CN/WTe₂ at 300 K";
          for (let i = 0; i < 14; i++) {
            const j = Math.sin(t * 7 + i) * 3;
            dot(c, 28 + i * 22, 118 + j, 5.5, i % 3 === 1 ? C.muted : C.blue, .95);
            if (i) line(c, 28 + (i - 1) * 22, 118 + Math.sin(t * 7 + i - 1) * 3, 28 + i * 22, 118 + j, C.muted, 1.4, .6);
            dot(c, 34 + i * 22, 168 + Math.cos(t * 6 + i) * 2.5, 6.5, C.rose, .9);
            dot(c, 23 + i * 22, 152 + Math.sin(t * 5 + i * 2) * 2, 5, C.amber, .85); dot(c, 23 + i * 22, 184 + Math.cos(t * 5 + i * 2) * 2, 5, C.amber, .85);
          }
          text(c, "g-CN", 16, 96, C.ink, 11); text(c, "WTe₂", 16, 206, C.ink, 11);
          const nf = Math.floor(prog(t, .3, 3.4) * 8);
          text(c, "snapshots saved", 424, 230, C.muted, 11, "right");
          for (let f = 0; f < nf; f++) rect(c, 330 + f * 11, 244 - f * 2, 56, 36, C.panel || C.paper, 1, C.muted);
          text(c, `${(5 * prog(t, .3, 3.4)).toFixed(1)} ps of trajectory`, 16, 280, C.ink, 12, "left", 1, 600);
        } else {
          const rot = k === 2 ? ease(prog(t, 8.6, 10.6)) * Math.PI / 3 : k > 2 ? Math.PI / 3 : 0;
          const sc = k >= 3 ? .62 : 1, ox = k >= 3 ? 80 : cx, oy = k >= 3 ? 180 : cy;
          const P = nodes.map(n => [ox + sc * (n[0] * Math.cos(rot) - n[1] * Math.sin(rot)), oy + sc * (n[0] * Math.sin(rot) + n[1] * Math.cos(rot)), n[2]]);
          const appear = k === 1 ? prog(t, 3.8, 5) : 1;
          edges.forEach(([i, j], q) => line(c, P[i][0], P[i][1], P[j][0], P[j][1], C.muted, 1.8, .6 * clamp(appear * 1.5 - q / edges.length, 0, 1)));
          if (k === 2) {
            const ph = (t * 1.1) % 1;
            edges.forEach(([i, j]) => { dot(c, lerp(P[i][0], P[j][0], ph), lerp(P[i][1], P[j][1], ph), 3, C.amber, .9); dot(c, lerp(P[j][0], P[i][0], ph), lerp(P[j][1], P[i][1], ph), 3, C.amber, .9); });
          }
          P.forEach(p => { if (k === 2) glow(c, p[0], p[1], 16, C.teal, .3); dot(c, p[0], p[1], 7 * sc + 1, p[2] ? C.muted : C.blue, appear); });
          if (k === 1) {
            const p0 = P[6];
            text(c, "(x, y, z)", p0[0] + 12, p0[1] - 2, C.teal, 12, "left", prog(t, 5.2, 5.7), 600);
            text(c, "atoms → nodes, bonds → edges", 424, 90, C.ink, 12, "right", prog(t, 4.6, 5.2));
            text(c, "input: only atom coordinates", 424, 110, C.teal, 12, "right", prog(t, 5.4, 6));
            cap = "Step 2: turn every snapshot into a graph";
          }
          if (k === 2) {
            rect(c, 296, 96, 128, 58, C.paper, .95, C.rule);
            text(c, "predicted energy", 306, 112, C.muted, 11);
            rect(c, 306, 128, 104, 9, C.teal, .9);
            text(c, t > 8.6 ? "rotated → same answer ✓" : "", 424, 172, C.teal, 11, "right", prog(t, 9.4, 10));
            cap = t < 8.6 ? "Step 3: atoms pass messages to neighbours" : "Equivariant: rotating the material doesn't fool it";
          }
          if (k === 3) {
            cap = "Step 4: predictions match AIMD within ±3%";
            const X0 = 160, X1 = 424, Y0 = 82, Y1 = 196, s = prog(t, 11.4, 14);
            line(c, X0, Y1, X1, Y1, C.muted, 1); line(c, X0, Y1, X0, Y0, C.muted, 1);
            text(c, "energy", X0 + 4, Y0 - 6, C.muted, 10); text(c, "time", X1, Y1 + 11, C.muted, 10, "right");
            const f = q => .5 + .18 * Math.sin(q * 23) * Math.sin(q * 5.1) + .08 * Math.sin(q * 61);
            const a = [], g = [];
            for (let q = 0; q <= 120 * s; q++) { const u = q / 120; a.push([lerp(X0, X1, u), lerp(Y1, Y0, f(u))]); g.push([lerp(X0, X1, u), lerp(Y1, Y0, f(u) + .025 * Math.sin(q * 1.3))]); }
            if (a.length > 1) { poly(c, a, C.muted, 2.2, .8); c.setLineDash([4, 3]); poly(c, g, C.teal, 1.8); c.setLineDash([]); }
            line(c, X0 + 8, 214, X0 + 26, 214, C.muted, 2.2); text(c, "AIMD", X0 + 32, 214, C.muted, 11);
            line(c, X0 + 80, 214, X0 + 98, 214, C.teal, 1.8, 1, [4, 3]); text(c, "E(q)C-GNN", X0 + 104, 214, C.teal, 11);
            ["potential energy", "kinetic energy", "entropy", "force variation"].forEach((w, i) => text(c, w + " ✓", X0 + (i % 2) * 140, 240 + Math.floor(i / 2) * 20, C.ink, 12, "left", prog(t, 12.6 + i * .4, 13 + i * .4)));
          }
          if (k === 4) {
            cap = "Step 5: several orders of magnitude faster";
            const s = prog(t, 15.4, 18.6);
            text(c, "AIMD (DFT every step)", 160, 108, C.muted, 12);
            rect(c, 160, 118, 250, 12, C.rule); rect(c, 160, 118, 250 * s * .01, 12, C.muted);
            text(c, "E(q)C-GNN", 160, 152, C.teal, 12, "left", 1, 600);
            rect(c, 160, 162, 250, 12, C.rule); rect(c, 160, 162, 250 * Math.min(1, s * 4), 12, C.teal);
            text(c, "trained and run on a single desktop CPU", 160, 200, C.ink, 12, "left", prog(t, 16.4, 17));
            text(c, "→ longer simulations, bigger systems", 160, 220, C.teal, 12, "left", prog(t, 17, 17.6));
          }
        }
        caption(c, cap);
        if (t > END - .6) rect(c, 0, 0, W, H, C.paper, prog(t, END - .6, END));
      }
    };
  })();

  // ---------- NAMD: an excited electron walks down an energy staircase ----------
  S.namd = {
    dur: 8,
    draw(c, t) {
      const levels = [62, 82, 102, 122, 142, 162, 182], vb = 240;
      levels.forEach(y => line(c, 70, y, 210, y, C.ink, 1.4, .55));
      line(c, 70, vb, 210, vb, C.ink, 1.4, .55); line(c, 70, vb + 18, 210, vb + 18, C.ink, 1.4, .55);
      text(c, "energy levels", 140, 280, C.muted, 11, "center");
      line(c, 40, 260, 40, 50, C.muted, 1.2); head(c, 40, 46, -Math.PI / 2, C.muted); text(c, "energy", 46, 46, C.muted, 11);
      // light lifts electron
      photon(c, 230, 280, 150, vb + 2, prog(t, 0, .7), C.amber, 1 - prog(t, .9, 1.3));
      if (t > .7 && t < 1.4) line(c, 140, vb, 140, levels[0], C.amber, 1.5, 1 - prog(t, 1, 1.4), [4, 3]);
      if (t < .7) { dot(c, 140, vb, 5.5, C.teal); return; }
      hole(c, 140, vb);
      const step = clamp(Math.floor((t - 1.2) / .65), 0, levels.length - 1);
      const into = (t - 1.2) / .65 - step;
      let y = levels[step];
      if (t > 1.2 && step < levels.length - 1 && into > .7) y = lerp(levels[step], levels[step + 1], ease((into - .7) / .3));
      electron(c, 140 + (step % 2 ? 10 : -10), y);
      // each step down shakes the atoms (heat)
      const heat = clamp(step / (levels.length - 1), 0, 1);
      for (let s = 0; s < step; s++) {
        const ts = 1.2 + .65 * s + .65, k = prog(t, ts, ts + .9);
        if (k > 0 && k < 1) photon(c, 215, levels[s] + 10, 300, 150, k, C.rose, 1 - k);
      }
      for (let i = 0; i < 5; i++) {
        const ax = 320 + i * 24 + Math.sin(t * 9 + i) * (1 + 6 * heat), ay = 150 + Math.cos(t * 7 + i * 2) * (1 + 5 * heat);
        if (i) line(c, 320 + (i - 1) * 24, 150, ax, ay, C.muted, 1.4, .5);
        dot(c, ax, ay, 7, C.blue, .85);
      }
      text(c, "atoms heat up", 368, 185, C.rose, 11, "center", .3 + .7 * heat);
      caption(c, step < levels.length - 1 ? "The electron steps down, losing energy as heat" : "Electron at the bottom: energy lost as heat");
      text(c, `${Math.round(prog(t, 1.2, 1.2 + .65 * 6.3) * 400)} fs`, 424, 274, C.ink, 12, "right");
    }
  };

  // ---------- surface hopping ----------
  S.hop = (() => {
    const X0 = 58, X1 = 420, Y0 = 60, Y1 = 262;
    const V1 = q => 2.2 * (q - .28) ** 2, V2 = q => 2.2 * (q - .74) ** 2 + .08, cc = .045;
    const Eu = q => (V1(q) + V2(q)) / 2 + Math.sqrt(((V1(q) - V2(q)) / 2) ** 2 + cc * cc);
    const El = q => (V1(q) + V2(q)) / 2 - Math.sqrt(((V1(q) - V2(q)) / 2) ** 2 + cc * cc);
    const X = q => lerp(X0, X1, (q - .04) / .92), Y = E => lerp(Y1, Y0, E / .9), qx = .5136, tHop = 3.1;
    const qOf = t => t < 1.2 ? .28 : t < tHop ? lerp(.28, qx, Math.pow(prog(t, 1.2, tHop), 1.6))
      : .74 - (.74 - qx) * Math.cos(2.6 * (t - tHop)) * Math.exp(-(t - tHop) / 2.4);
    const curve = (c, f) => {
      c.strokeStyle = C.ink; c.lineWidth = 2; c.beginPath(); let first = true;
      for (let i = 0; i <= 120; i++) { const q = .04 + .92 * i / 120, y = Y(f(q)); if (y < Y0 - 12) { first = true; continue; } first ? c.moveTo(X(q), y) : c.lineTo(X(q), y); first = false; }
      c.stroke();
    };
    return {
      dur: 9,
      draw(c, t) {
        line(c, X0 - 12, Y1 + 8, X0 - 12, Y0 - 14, C.muted, 1.2); head(c, X0 - 12, Y0 - 18, -Math.PI / 2, C.muted);
        line(c, X0 - 12, Y1 + 8, X1, Y1 + 8, C.muted, 1.2); head(c, X1 + 4, Y1 + 8, 0, C.muted);
        text(c, "energy", X0 - 4, Y0 - 18, C.muted, 11); text(c, "atom positions", X1, Y1 + 22, C.muted, 11, "right");
        curve(c, Eu); curve(c, El);
        text(c, "excited state", X(.86) - 14, Y(Eu(.86)) + 4, C.ink, 12, "right");
        text(c, "ground state", X(.3), Y(El(.3)) - 16, C.ink, 12, "center");
        if (t < 1.4) {
          const k = prog(t, .2, 1);
          photon(c, X(.28) - 70, Y(Eu(.28)) - 30, X(.28) - 8, Y(Eu(.28)) - 4, k, C.amber);
          line(c, X(.28), Y(0), X(.28), lerp(Y(0), Y(Eu(.28)), k), C.amber, 1.5, 1, [4, 3]);
        }
        if (t < .6) { dot(c, X(.28), Y(0) - 7, 7, C.teal); caption(c, "Light lifts the system to the excited state"); return; }
        if (t >= tHop && t < tHop + 1.4) {
          const k = prog(t, tHop, tHop + 1.4);
          line(c, X(qx), Y(Eu(qx)), X(qx), Y(El(qx)), C.amber, 2, 1 - k, [3, 3]);
          glow(c, X(qx), (Y(Eu(qx)) + Y(El(qx))) / 2, 34, C.amber, .55 * (1 - k));
          text(c, "hop!", X(qx) + 10, Y(Eu(qx)) - 14, C.amber, 13, "left", 1 - k);
        }
        for (let k = 10; k >= 1; k--) { const tt = t - k * .06, q = qOf(tt); dot(c, X(q), Y(tt < tHop ? Eu(q) : El(q)) - 7, 5, C.teal, .05 * (11 - k)); }
        const q = qOf(t), y = Y(t < tHop ? Eu(q) : El(q));
        glow(c, X(q), y - 7, 20, C.teal, .45); dot(c, X(q), y - 7, 7, C.teal);
        caption(c, t < tHop ? "Atoms roll downhill on the excited-state surface" : "Where the surfaces nearly touch, it hops down");
      }
    };
  })();

  // ---------- GNN: message passing, then a speed race ----------
  S.gnn = {
    dur: 8,
    draw(c, t) {
      const N = [[70, 110], [130, 80], [190, 110], [190, 175], [130, 205], [70, 175], [250, 80], [250, 205]];
      const E = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [2, 6], [3, 7]];
      E.forEach(([i, j]) => line(c, N[i][0], N[i][1], N[j][0], N[j][1], C.muted, 2, .55));
      const round = Math.floor(t / 1.1), ph = (t % 1.1) / 1.1;
      if (round < 3) E.forEach(([i, j]) => {
        const a = N[i], b = N[j];
        dot(c, lerp(a[0], b[0], ph), lerp(a[1], b[1], ph), 3.5, C.amber, .9);
        dot(c, lerp(b[0], a[0], ph), lerp(b[1], a[1], ph), 3.5, C.amber, .9);
      });
      N.forEach(p => { glow(c, p[0], p[1], 18, C.teal, round < 3 ? .25 + .2 * Math.sin(ph * 3.14) : .35); dot(c, p[0], p[1], 9, C.teal); });
      text(c, "atoms = dots, bonds = lines", 160, 236, C.muted, 11, "center");
      // prediction box
      const k = prog(t, 3.3, 3.9);
      arrow(c, 280, 145, 312, 145, C.ink, 1.6, k);
      rect(c, 318, 112, 108, 66, C.paper, k, C.rule);
      text(c, "energy ✓", 330, 132, C.ink, 12, "left", k); text(c, "forces ✓", 330, 156, C.ink, 12, "left", k);
      // race
      const r = prog(t, 4, 8);
      text(c, "DFT", 16, 256, C.muted, 12); text(c, "GNN", 16, 280, C.teal, 12, "left", 1, 600);
      rect(c, 56, 250, 300, 10, C.rule); rect(c, 56, 274, 300, 10, C.rule);
      rect(c, 56, 250, 300 * r * .1, 10, C.muted); rect(c, 56, 274, 300 * Math.min(1, r * 1.3), 10, C.teal);
      text(c, `${Math.round(r * 1000)} steps`, 424, 280, C.teal, 11, "right");
      text(c, `${Math.round(r * 10)} steps`, 424, 256, C.muted, 11, "right");
      caption(c, round < 3 ? `Message passing, round ${round + 1}: atoms share information` : "Trained on DFT, then simulates far faster");
    }
  };

  // ---------- photovoltaics ----------
  S.pv = {
    dur: 8,
    draw(c, t) {
      sun(c, 52, 64, t);
      rect(c, 110, 130, 210, 42, C.teal, .16); rect(c, 110, 172, 210, 42, C.amber, .16); rect(c, 110, 130, 210, 84, null, 1, C.muted);
      text(c, "top layer collects electrons (e⁻)", 196, 120, C.teal, 11); text(c, "bottom layer collects holes (h⁺)", 110, 226, C.amber, 11);
      const wire = [[320, 135], [390, 135], [390, 209], [320, 209]];
      poly(c, wire, C.muted, 2);
      // bulb
      const lit = prog(t, 2.2, 3.4);
      glow(c, 390, 172, 34, C.amber, .7 * lit);
      dot(c, 390, 172, 13, C.paper, 1, C.ink, 1.6); dot(c, 390, 172, 8, C.amber, lit);
      text(c, "bulb", 408, 172, C.muted, 11);
      // photons create pairs
      [0, 1, 2, 3].forEach(i => {
        const t0 = .2 + i * 1.3, hx = 150 + i * 42;
        photon(c, 70, 90, hx, 168, prog(t, t0, t0 + .6), C.amber, 1 - prog(t, t0 + .7, t0 + 1));
        const k = prog(t, t0 + .6, t0 + 1.6);
        if (t > t0 + .6) {
          if (k < 1) { electron(c, hx, lerp(172, 138, ease(k)), 1, i === 0); hole(c, hx, lerp(172, 206, ease(k)), 1, i === 0); }
          else { hole(c, hx, 206, .6, false); }
        }
      });
      // current in the wire
      if (t > 1.8) for (let k = 0; k < 6; k++) {
        const s = ((t - 1.8) * .35 + k / 6) % 1, L = [70, 74, 70], tot = 214;
        let d = s * tot, p;
        if (d < 70) p = [320 + d, 135]; else if (d < 144) p = [390, 135 + d - 70]; else p = [390 - (d - 144), 209];
        dot(c, p[0], p[1], 3.5, C.teal, .9);
      }
      caption(c, t < 2 ? "Light frees an electron and leaves a hole" : "Separated charges flow as electric current");
    }
  };

  // ---------- photocatalytic water splitting ----------
  S.water = {
    dur: 10,
    draw(c, t) {
      sun(c, 400, 52, t, 15);
      rect(c, 0, 110, W, 190, C.blue, .08); text(c, "water", 16, 126, C.blue, 11, "left", .8);
      // catalyst sheet
      for (let i = 0; i < 12; i++) {
        const x = 60 + i * 28, y = 230 + (i % 2) * 10;
        if (i) line(c, 60 + (i - 1) * 28, 230 + ((i - 1) % 2) * 10, x, y, C.muted, 2, .7);
        dot(c, x, y, 6, i % 3 ? C.muted : C.blue, .9);
      }
      text(c, "2D photocatalyst sheet", 220, 262, C.muted, 11, "center");
      [0, 1, 2].forEach(i => { const t0 = .2 + i * .9; photon(c, 380, 72, 170 + i * 70, 222, prog(t, t0, t0 + .9), C.amber, 1 - prog(t, t0 + 1, t0 + 1.4)); });
      // water molecules drifting in
      for (let i = 0; i < 5; i++) {
        const ph = ((t * .12 + i / 5) % 1), x = 80 + i * 70 + Math.sin(t + i) * 8, y = lerp(140, 205, ph);
        dot(c, x, y, 6, C.rose, .8 - ph * .5); dot(c, x - 7, y + 4, 3.5, C.paper, .8 - ph * .5, C.ink); dot(c, x + 7, y + 4, 3.5, C.paper, .8 - ph * .5, C.ink);
      }
      bubbles(c, 130, 215, 118, t, 1.6, 2.4, C.teal, "H₂", 1);
      bubbles(c, 310, 215, 118, t, 1.8, 1.2, C.rose, "O₂", 7);
      text(c, "hydrogen fuel", 130, 98, C.teal, 12, "center", prog(t, 3, 3.5));
      text(c, "oxygen", 310, 98, C.rose, 12, "center", prog(t, 3, 3.5));
      caption(c, "Sunlight splits water: 2 H₂O → 2 H₂ + O₂");
    }
  };

  // ---------- photocatalytic nitrogen reduction on a COF ----------
  S.nrr = (() => {
    const a = 38, cx = 214, cy = 205, nodes = [], bonds = [];
    for (let m = -6; m <= 6; m++) for (let n = -6; n <= 6; n++) {
      const x = cx + (m + n) * 1.5 * a, y = cy + (m - n) * Math.sqrt(3) / 2 * a;
      [[x, y], [x + a, y]].forEach(p => { if (p[0] > -20 && p[0] < 460 && p[1] > 120 && p[1] < 320) nodes.push(p); });
    }
    for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++)
      if (Math.abs(Math.hypot(nodes[i][0] - nodes[j][0], nodes[i][1] - nodes[j][1]) - a) < 1) bonds.push([i, j]);
    let hub = 0, best = 1e9;
    nodes.forEach((p, i) => { const d = Math.hypot(p[0] - cx, p[1] - cy); if (d < best) { best = d; hub = i; } });
    const B0 = nodes[hub], NA = [B0[0], B0[1] - 30], NB = [B0[0], B0[1] - 54], Hs = [40, 80];
    const Hl = [{ t: 2, n: "B", d: [-14, -7] }, { t: 2.7, n: "B", d: [14, -7] }, { t: 3.4, n: "B", d: [0, -16] },
                { t: 4.9, n: "A", d: [-14, -6] }, { t: 5.6, n: "A", d: [14, -6] }, { t: 6.3, n: "A", d: [0, -16] }];
    return {
      dur: 10,
      draw(c, t) {
        bonds.forEach(([i, j]) => line(c, nodes[i][0], nodes[i][1], nodes[j][0], nodes[j][1], C.muted, 2, .5));
        nodes.forEach((p, i) => { if (i !== hub) dot(c, p[0], p[1], 4.5, (Math.round(p[0] / a * 3) + Math.round(p[1] / a * 3)) % 3 ? C.muted : C.blue, .7); });
        glow(c, B0[0], B0[1], 26, C.rose, .35); dot(c, B0[0], B0[1], 7.5, C.rose); text(c, "boron", B0[0] + 12, B0[1] + 12, C.rose, 11);
        if (t < 2.2) { photon(c, 420, 50, B0[0] + 40, B0[1] - 18, prog(t, 0, 1.2), C.amber, 1 - prog(t, 1.6, 2.2)); }
        const kin = ease(prog(t, .2, 1.6)), off = [lerp(150, 0, kin), lerp(-150, 0, kin)], rot = lerp(1.2, 0, kin);
        const mid = [(NA[0] + NB[0]) / 2, (NA[1] + NB[1]) / 2];
        const rp = p => [mid[0] + (p[0] - mid[0]) * Math.cos(rot) - (p[1] - mid[1]) * Math.sin(rot) + off[0], mid[1] + (p[0] - mid[0]) * Math.sin(rot) + (p[1] - mid[1]) * Math.cos(rot) + off[1]];
        const pA = rp(NA), pB = rp(NB);
        const drift = (t0, p) => { const k = prog(t, t0, t0 + 1.6); return [p[0] + 70 * k, p[1] - 90 * k, 1 - k]; };
        const dB = t > 4 ? drift(4, pB) : [pB[0], pB[1], 1], dA = t > 6.9 ? drift(6.9, pA) : [pA[0], pA[1], 1];
        if (t < 4) { const o = t < 2 ? 3 : t < 2.7 ? 2 : 1; for (let k = 0; k < o; k++) { const s = (k - (o - 1) / 2) * 3.4; line(c, pA[0] + s, pA[1], pB[0] + s, pB[1], C.blue, 1.6); } }
        if (kin >= 1 && t < 6.9) line(c, B0[0], B0[1], pA[0], pA[1], C.rose, 2, .9);
        Hl.forEach(h => {
          if (t < h.t - .7) return;
          const base = h.n === "B" ? dB : dA; if (base[2] <= 0) return;
          const k = ease(prog(t, h.t - .7, h.t)), x = lerp(Hs[0], base[0] + h.d[0], k), y = lerp(Hs[1], base[1] + h.d[1], k);
          if (k >= 1) line(c, base[0], base[1], x, y, C.muted, 1.4, base[2]);
          dot(c, x, y, 4.5, C.paper, base[2], C.ink);
        });
        dot(c, dB[0], dB[1], 7, C.blue, dB[2]); dot(c, dA[0], dA[1], 7, C.blue, dA[2]);
        if (t > 4) text(c, "NH₃", dB[0] + 12, dB[1] - 14, C.ink, 12, "left", dB[2]);
        if (t > 6.9) text(c, "NH₃", dA[0] + 12, dA[1] - 14, C.ink, 12, "left", dA[2]);
        if (t > 1.2 && t < 7) text(c, "H⁺ + e⁻", Hs[0], Hs[1] - 16, C.muted, 11, "center", fade(t, 1.2, 1.8, 6.4, 7));
        if (t < 1.7) text(c, "N₂", pB[0] + 12, pB[1], C.blue, 12);
        caption(c, t < 1.7 ? "Nitrogen gas (N₂) lands on a boron site" : t < 6.9 ? "Hydrogen is added one atom at a time" : "Ammonia (NH₃) for fertiliser is released");
        if (t > 8.6) rect(c, 0, 0, W, H, C.paper, prog(t, 8.6, 10));
      }
    };
  })();

  // ---------- electrocatalysis: splitting water with electricity ----------
  S.electro = {
    dur: 10,
    draw(c, t) {
      const cat = t > 5;
      rect(c, 50, 120, 340, 165, C.blue, .08, C.muted);
      // battery
      rect(c, 196, 34, 48, 24, C.paper, 1, C.ink); text(c, "−", 204, 46, C.ink, 14, "center"); text(c, "+", 236, 46, C.ink, 14, "center");
      poly(c, [[196, 46], [120, 46], [120, 100]], C.muted, 2); poly(c, [[244, 46], [320, 46], [320, 100]], C.muted, 2);
      // electrodes
      rect(c, 110, 100, 20, 150, C.muted, .8); rect(c, 310, 100, 20, 150, C.muted, .8);
      if (cat) for (let i = 0; i < 9; i++) dot(c, 304, 140 + i * 13, 4, C.rose, prog(t, 5, 5.6));
      text(c, "H₂ side", 120, 296 - 6, C.muted, 11, "center"); text(c, "O₂ side", 320, 296 - 6, C.muted, 11, "center");
      // electrons in the wire: from O2 electrode through battery to H2 electrode
      const path = [[320, 100], [320, 46], [244, 46], [196, 46], [120, 46], [120, 100]];
      const seg = []; let tot = 0;
      for (let i = 1; i < path.length; i++) { const L = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]); seg.push(L); tot += L; }
      const speed = cat ? .45 : .15;
      for (let k = 0; k < 6; k++) {
        let d = ((t * speed + k / 6) % 1) * tot, i = 0;
        while (d > seg[i]) { d -= seg[i]; i++; }
        const a = path[i], b = path[i + 1], f = d / seg[i];
        dot(c, lerp(a[0], b[0], f), lerp(a[1], b[1], f), 3.5, C.teal, .9);
      }
      const r = cat ? 1 : .35;
      bubbles(c, 148, 245, 128, t, .5, 2 * r * 1.6, C.teal, "H₂", 2);
      bubbles(c, 280, 245, 128, t, .7, 1 * r * 1.6, C.rose, "O₂", 5);
      text(c, cat ? "with a good catalyst (pink atoms)" : "plain electrode", 220, 88, cat ? C.rose : C.muted, 12, "center");
      caption(c, cat ? "A catalyst makes the reaction much faster" : "Electricity splits water, but slowly");
    }
  };

  // ---------- spintronics: a one-way door for spin ----------
  S.spin = {
    dur: 8,
    draw(c, t) {
      rect(c, 190, 110, 90, 90, C.teal, .12, C.muted);
      text(c, "half-metal", 235, 222, C.ink, 12, "center"); text(c, "lets only ↑ through", 235, 238, C.muted, 11, "center");
      for (let k = 0; k < 10; k++) {
        const up = k % 2 === 0, s = ((t * .16 + k / 10) % 1), y = 155 + ((k * 13) % 30) - 15;
        let x = lerp(10, 440, s), a = 1;
        if (!up) { const hit = (180 - 10) / 430; if (s > hit) { x = 180 - (s - hit) * 430 * .8; a = 1 - (s - hit) * 4; } }
        if (a <= 0) continue;
        const col = up ? C.teal : C.amber;
        dot(c, x, y, 11, col, a * .95);
        arrow(c, x, y + (up ? 7 : -7), x, y + (up ? -8 : 8), C.paper, 2.4, a);
      }
      text(c, "↑ spin up", 16, 270, C.teal, 12); text(c, "↓ spin down", 110, 270, C.amber, 12);
      text(c, "out: all ↑", 424, 270, C.teal, 12, "right");
      caption(c, "Electrons are tiny magnets: spin up or spin down");
    }
  };

  // ---------- battery ----------
  S.battery = {
    dur: 12,
    draw(c, t) {
      const charging = t > 6, tt = charging ? t - 6 : t;
      // anode: stacked 2D sheets
      for (let i = 0; i < 6; i++) line(c, 60, 120 + i * 26, 160, 120 + i * 26, C.muted, 3, .8);
      text(c, "2D anode", 110, 274, C.muted, 11, "center");
      // cathode lattice
      for (let i = 0; i < 5; i++) for (let j = 0; j < 6; j++) dot(c, 290 + i * 22, 120 + j * 26, 4, C.blue, .6);
      text(c, "cathode", 334, 274, C.muted, 11, "center");
      rect(c, 168, 108, 104, 150, C.amber, .06); text(c, "electrolyte", 220, 274, C.muted, 11, "center");
      // circuit
      poly(c, [[110, 112], [110, 60], [334, 60], [334, 112]], C.muted, 2);
      if (!charging) {
        glow(c, 222, 60, 26, C.amber, .7 * prog(tt, .5, 1.2)); dot(c, 222, 60, 11, C.paper, 1, C.ink, 1.6); dot(c, 222, 60, 6, C.amber, prog(tt, .5, 1.2));
      } else { rect(c, 204, 48, 36, 24, C.paper, 1, C.ink); text(c, "plug", 222, 60, C.ink, 11, "center"); }
      for (let k = 0; k < 5; k++) {
        const s = ((tt * .4 + k / 5) % 1), d = (charging ? 1 - s : s) * 328;
        const p = d < 52 ? [110, 112 - d] : d < 276 ? [110 + d - 52, 60] : [334, 60 + d - 276];
        dot(c, p[0], p[1], 3.5, C.teal, .9);
      }
      // lithium ions
      for (let i = 0; i < 6; i++) {
        const k = ease(prog(tt, .3 + i * .5, 1.8 + i * .5));
        const a = [75 + (i % 3) * 35, 133 + (i % 5) * 26], b = [301 + (i % 3) * 33, 133 + (i % 5) * 26];
        const from = charging ? b : a, to = charging ? a : b;
        const x = lerp(from[0], to[0], k), y = lerp(from[1], to[1], k) - Math.sin(k * 3.14) * 18;
        dot(c, x, y, 7, C.rose); text(c, "+", x, y + 1, C.paper, 10, "center", 1, 700);
      }
      text(c, "Li⁺ ion", 16, 290, C.rose, 11);
      caption(c, charging ? "Charging: lithium ions return to the anode" : "Using the battery: ions move, electrons power the bulb");
    }
  };

  // ---------- thermoelectric ----------
  S.thermo = {
    dur: 8,
    draw(c, t) {
      const g = c.createLinearGradient(90, 0, 350, 0);
      g.addColorStop(0, C.rose); g.addColorStop(1, C.blue);
      c.globalAlpha = .25; c.fillStyle = g; c.fillRect(90, 140, 260, 60); c.globalAlpha = 1;
      rect(c, 90, 140, 260, 60, null, 1, C.muted);
      // flame and snowflake
      for (let i = 0; i < 3; i++) {
        const fx = 50 + i * 10, h = 24 + 8 * Math.sin(t * 9 + i * 2);
        c.fillStyle = C.amber; c.globalAlpha = .9; c.beginPath(); c.moveTo(fx - 6, 205); c.quadraticCurveTo(fx, 205 - h * 1.4, fx + 6, 205); c.fill(); c.globalAlpha = 1;
      }
      text(c, "hot", 60, 222, C.rose, 12, "center");
      for (let i = 0; i < 3; i++) { const a = i * 1.047; line(c, 390 - 12 * Math.cos(a), 170 - 12 * Math.sin(a), 390 + 12 * Math.cos(a), 170 + 12 * Math.sin(a), C.blue, 2); }
      text(c, "cold", 390, 222, C.blue, 12, "center");
      const build = prog(t, 0, 5);
      for (let k = 0; k < 14; k++) {
        const s = (t * (.18 + (k % 3) * .04) + k / 14) % 1, x = lerp(100, 340, Math.pow(s, lerp(1, .4, build)));
        dot(c, x, 155 + (k * 11 % 32), 4, C.teal, .85);
      }
      // voltmeter
      poly(c, [[95, 140], [95, 70], [180, 70]], C.muted, 1.6); poly(c, [[345, 140], [345, 70], [260, 70]], C.muted, 1.6);
      c.strokeStyle = C.ink; c.lineWidth = 1.6; c.beginPath(); c.arc(220, 80, 36, Math.PI, 0); c.stroke();
      const ang = Math.PI + Math.PI * (.12 + .7 * ease(build));
      arrow(c, 220, 80, 220 + 30 * Math.cos(ang), 80 + 30 * Math.sin(ang), C.amber, 2);
      text(c, "voltage", 220, 96, C.ink, 11, "center");
      caption(c, "Heat on one side pushes charges to the cold side");
    }
  };

  // ---------- quantum dot → dye energy transfer ----------
  S.qd = {
    dur: 8,
    draw(c, t) {
      const q = [130, 160], d = [320, 160];
      const qGlow = fade(t, .9, 1.3, 2.4, 3.2), dGlow = fade(t, 3.2, 3.6, 7, 7.8);
      glow(c, q[0], q[1], 70, C.teal, .6 * qGlow);
      dot(c, q[0], q[1], 42, C.paper, 1, C.ink, 1.6);
      for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) {
        const x = q[0] + i * 11 + (j % 2) * 5, y = q[1] + j * 10;
        if (Math.hypot(x - q[0], y - q[1]) < 36) dot(c, x, y, 3, (i + j) % 2 ? C.amber : C.muted, .8);
      }
      text(c, "quantum dot", q[0], 224, C.ink, 12, "center"); text(c, "(a few nanometres)", q[0], 240, C.muted, 11, "center");
      glow(c, d[0], d[1], 60, C.rose, .6 * dGlow);
      const ring = [];
      for (let i = 0; i < 6; i++) ring.push([d[0] - 19 + 22 * Math.cos(i * 1.047 + .5236), d[1] + 22 * Math.sin(i * 1.047 + .5236)]);
      const ring2 = ring.map(p => [p[0] + 38.1, p[1]]);
      poly(c, ring, C.ink, 2, 1, true); poly(c, ring2, C.ink, 2, 1, true);
      text(c, "dye molecule", d[0] + 2, 224, C.ink, 12, "center");
      photon(c, 20, 60, q[0] - 32, q[1] - 30, prog(t, .1, .9), C.blue, 1 - prog(t, 1, 1.4));
      // energy hand-off rings
      if (t > 2.2 && t < 3.6) for (let k = 0; k < 3; k++) {
        const s = ((t - 2.2) * 1.2 + k / 3) % 1, x = lerp(q[0] + 45, d[0] - 45, s);
        c.globalAlpha = 1 - s; c.strokeStyle = C.teal; c.lineWidth = 2; c.beginPath(); c.arc(x, d[1], 10, -1, 1); c.stroke(); c.globalAlpha = 1;
      }
      photon(c, d[0] + 30, d[1] - 30, 420, 50, prog(t, 4.6, 5.6), C.rose, 1 - prog(t, 6.2, 6.8));
      caption(c, t < 2.2 ? "The quantum dot catches light" : t < 4 ? "It hands the energy to the dye, like a relay race" : "The dye glows with a new colour");
    }
  };

  // ---------- flagship: photocatalytic NRR on S-vacancy GaS (ACS Catal. 2026) ----------
  S.gas = (() => {
    const ST = [  // stage name, start time
      ["DFT", 0], ["AIMD", 3.6], ["GNN", 7.2], ["Light", 11.6], ["NRR", 14.8], ["NAMD", 20.6]];
    const END = 25.5, VAC = 5;
    const cols = 10, X = i => 30 + i * 42;
    const yS1 = 196, yG1 = 218, yG2 = 244, yS2 = 266;
    function stageOf(t) { let k = 0; ST.forEach((s, i) => { if (t >= s[1]) k = i; }); return k; }
    function chips(c, k) {
      let x = 16;
      ST.forEach((s, i) => {
        c.font = '600 11px "Public Sans", Arial, sans-serif';
        const w = c.measureText(s[0]).width + 16, on = i === k, done = i < k;
        c.globalAlpha = 1; c.fillStyle = on ? C.ink : "transparent"; c.strokeStyle = on ? C.ink : C.rule; c.lineWidth = 1;
        c.beginPath(); c.roundRect ? c.roundRect(x, 36, w, 20, 10) : c.rect(x, 36, w, 20); c.fill(); c.stroke();
        text(c, s[0], x + w / 2, 46.5, on ? C.paper : done ? C.teal : C.muted, 11, "center", 1, 600);
        x += w + 5;
      });
    }
    function sheet(c, t, amp, vac, gaGlow) {
      const j = (i, row) => [Math.sin(t * 8.3 + i * 1.7 + row) * amp, Math.cos(t * 7.1 + i * 2.3 + row * 1.3) * amp];
      const P = { s1: [], g1: [], g2: [], s2: [] };
      for (let i = 0; i < cols; i++) {
        let d = j(i, 0); P.s1.push([X(i) + d[0], yS1 + d[1]]);
        d = j(i, 1); P.g1.push([X(i) + 21 + d[0], yG1 + d[1]]);
        d = j(i, 2); P.g2.push([X(i) + 21 + d[0], yG2 + d[1]]);
        d = j(i, 3); P.s2.push([X(i) + d[0], yS2 + d[1]]);
      }
      const L = (a, b, al = .55) => line(c, a[0], a[1], b[0], b[1], C.muted, 1.6, al);
      for (let i = 0; i < cols; i++) {
        const sa = i === VAC ? 1 - vac : 1;
        if (i > 0) L(P.s1[i], P.g1[i - 1], .55 * sa); L(P.s1[i], P.g1[i], .55 * sa);
        L(P.g1[i], P.g2[i]);
        L(P.g2[i], P.s2[i]); if (i + 1 < cols) L(P.g2[i], P.s2[i + 1]);
      }
      for (let i = 0; i < cols; i++) {
        const exposed = (i === VAC - 1 || i === VAC);
        if (exposed && gaGlow > 0) glow(c, P.g1[i][0], P.g1[i][1], 20, C.teal, .55 * gaGlow);
        dot(c, P.g1[i][0], P.g1[i][1], 7, C.blue, .9); dot(c, P.g2[i][0], P.g2[i][1], 7, C.blue, .9);
        dot(c, P.s2[i][0], P.s2[i][1], 6, C.amber, .9);
        if (i === VAC) {
          dot(c, P.s1[i][0], P.s1[i][1], 6, C.amber, .9 * (1 - vac));
          if (vac > 0) { c.setLineDash([3, 3]); dot(c, X(i), yS1, 8, null, vac, C.amber, 1.4); c.setLineDash([]); }
        } else dot(c, P.s1[i][0], P.s1[i][1], 6, C.amber, .9);
      }
      return P;
    }
    function legend(c) {
      dot(c, 22, 288, 5, C.blue, .9); text(c, "Ga", 31, 288, C.muted, 10);
      dot(c, 56, 288, 5, C.amber, .9); text(c, "S", 65, 288, C.muted, 10);
      dot(c, 84, 288, 5, C.teal, .9); text(c, "N", 93, 288, C.muted, 10);
      dot(c, 112, 288, 4, C.paper, 1, C.ink); text(c, "H", 121, 288, C.muted, 10);
    }
    function bandBox(c, a, eUp, holeOn, recomb) {   // small band diagram, top right
      const x0 = 318, y0 = 70, w = 104, h = 92;
      rect(c, x0, y0, w, h, C.paper, .9 * a, C.rule);
      line(c, x0 + 14, y0 + 24, x0 + w - 14, y0 + 24, C.ink, 2, a); text(c, "CB", x0 + w - 12, y0 + 16, C.muted, 10, "right", a);
      line(c, x0 + 14, y0 + 72, x0 + w - 14, y0 + 72, C.ink, 2, a); text(c, "VB", x0 + w - 12, y0 + 82, C.muted, 10, "right", a);
      text(c, "2.35 eV", x0 + 18, y0 + 48, C.muted, 10, "left", a);
      const ey = lerp(y0 + 72, y0 + 24, eUp);
      if (recomb > 0) { const yy = lerp(y0 + 24, y0 + 72, recomb); dot(c, x0 + 70, yy, 5, C.teal, a); }
      else dot(c, x0 + 70, ey, 5, C.teal, a);
      if (holeOn) dot(c, x0 + 70, y0 + 72, 5, C.paper, a, C.amber, 2);
    }
    return {
      dur: END,
      draw(c, t) {
        const k = stageOf(t);
        chips(c, k);
        legend(c);
        const amp = k === 1 ? 2.6 : .7;
        const vac = prog(t, 9.8, 10.8), gaGlow = k >= 2 ? prog(t, 10.4, 11) : 0;
        if (k === 0) {   // DFT: electron cloud converges over the sheet
          const q = prog(t, .3, 3);
          for (let i = 0; i < cols; i++) glow(c, X(i) + 21, (yG1 + yG2) / 2, lerp(60, 26, q), C.teal, lerp(.12, .32, q));
        }
        const P = sheet(c, t, amp, vac, gaGlow);
        let cap = "";
        if (k === 0) {
          cap = "DFT: build a GaS sheet and compute its electrons";
          text(c, "band gap 3.24 eV", 424, 82, C.ink, 12, "right", prog(t, 1.6, 2.2));
          text(c, `step ${Math.min(14, Math.floor(prog(t, .2, 3) * 14) + 1)}`, 424, 100, C.muted, 11, "right");
        } else if (k === 1) {
          cap = "AIMD: shake it at room temperature, 300 K";
          text(c, `${(prog(t, 3.6, 7.2) * 5).toFixed(1)} ps`, 424, 82, C.ink, 12, "right");
          text(c, "sheet stays intact ✓", 424, 100, C.teal, 12, "right", prog(t, 5.5, 6.2));
        } else if (k === 2) {
          // N2 probes Ga site then S site, attention lines to surface atoms
          const site = t < 8.6 ? 0 : 1, m = site ? ease(prog(t, 8.6, 9.1)) : 0;
          const nx = lerp(P.g1[VAC - 1][0] + 4, X(VAC), m), ny = 140;
          const targets = [P.s1[VAC - 1], P.s1[VAC], P.s1[VAC + 1], P.g1[VAC - 1], P.g1[VAC]];
          if (t < 9.8) targets.forEach((p, i) => {
            const d = Math.hypot(p[0] - nx, p[1] - ny), wgt = site ? 3.4 - d / 40 : 1.6 - d / 60;
            line(c, nx, ny + 6, p[0], p[1], C.amber, Math.max(.6, wgt), .45 + .15 * Math.sin(t * 6 + i));
          });
          if (t < 9.8) {
            dot(c, nx - 8, ny, 6.5, C.teal); dot(c, nx + 8, ny, 6.5, C.teal); line(c, nx - 3, ny - 2, nx + 3, ny - 2, C.paper, 1.4); line(c, nx - 3, ny + 2, nx + 3, ny + 2, C.paper, 1.4);
            rect(c, 300, 70, 124, 46, C.paper, .9, C.rule);
            text(c, "attention score", 310, 84, C.muted, 10);
            text(c, site ? "over S: 3.26 % ↑" : "over Ga: 2.78 %", 310, 102, site ? C.teal : C.ink, 12, "left", 1, 600);
          } else {
            text(c, "remove one S", X(VAC), 160, C.amber, 12, "center", prog(t, 9.8, 10.3));
            text(c, "→ exposed Ga atoms grab N₂", X(VAC), 176, C.teal, 12, "center", prog(t, 10.6, 11.1));
          }
          cap = t < 9.8 ? "GNN: an attention model finds where N₂ interacts most" : "So we make a sulfur vacancy (V-GaS)";
        } else if (k === 3) {
          cap = "Light: sunlight creates electrons in V-GaS";
          photon(c, 120, 72, X(VAC) - 30, yS1 - 8, prog(t, 11.6, 12.5), C.amber, 1 - prog(t, 13, 13.6));
          bandBox(c, prog(t, 11.8, 12.2), ease(prog(t, 12.5, 13.1)), t > 12.5, 0);
          text(c, "photo-voltage U = 0.70 V", 424, 176, C.ink, 11, "right", prog(t, 13.2, 13.8));
        } else if (k === 4) {
          cap = t < 15.6 ? "NRR: N₂ lies flat in the vacancy" : t < 20 ? "Hydrogen adds one by one, every step downhill" : "Two NH₃ molecules leave";
          // side-on N2 above the vacancy
          const k0 = ease(prog(t, 14.8, 15.6)), bx = X(VAC), by = lerp(110, 176, k0);
          const nA = [bx - 9, by], nB = [bx + 9, by];
          const leave = (t0, p) => { const q = prog(t, t0, t0 + 1.3); return [p[0] + 50 * q, p[1] - 90 * q, 1 - q]; };
          const B = t > 17.8 ? leave(17.8, nB) : [nB[0], nB[1], 1], A = t > 20 ? leave(20, nA) : [nA[0], nA[1], 1];
          if (t < 17.8) { const o = t < 16.2 ? 3 : t < 16.8 ? 2 : 1; for (let q = 0; q < o; q++) { const s = (q - (o - 1) / 2) * 3.2; line(c, nA[0], nA[1] + s, nB[0], nB[1] + s, C.teal, 1.5); } }
          if (k0 >= 1 && t < 20) { line(c, nA[0], nA[1], P.g1[VAC - 1][0], P.g1[VAC - 1][1], C.teal, 1.4, .6, [3, 3]); line(c, nB[0], nB[1], P.g1[VAC][0], P.g1[VAC][1], C.teal, 1.4, .6, [3, 3]); }
          const H = [[16.2, "B", [8, -10]], [16.8, "B", [14, 2]], [17.4, "B", [2, -15]], [18.4, "A", [-8, -10]], [19, "A", [-14, 2]], [19.6, "A", [-2, -15]]];
          H.forEach(([th, n, d]) => {
            if (t < th - .5) return;
            const base = n === "B" ? B : A; if (base[2] <= 0) return;
            const q = ease(prog(t, th - .5, th)), x = lerp(40, base[0] + d[0], q), y = lerp(84, base[1] + d[1], q);
            if (q >= 1) line(c, base[0], base[1], x, y, C.muted, 1.3, base[2]);
            dot(c, x, y, 4, C.paper, base[2], C.ink);
          });
          dot(c, B[0], B[1], 6.5, C.teal, B[2]); dot(c, A[0], A[1], 6.5, C.teal, A[2]);
          if (t > 17.8) text(c, "NH₃", B[0] + 12, B[1] - 10, C.ink, 12, "left", B[2]);
          if (t > 20) text(c, "NH₃", A[0] + 12, A[1] - 10, C.ink, 12, "left", A[2]);
          text(c, "H⁺ + e⁻", 40, 70, C.muted, 11, "center", fade(t, 15.4, 15.8, 19.8, 20.3));
          text(c, "N₂", bx, by - 16, C.teal, 12, "center", 1 - prog(t, 15.6, 16));
          // mini energy staircase going downhill
          const steps = [0, -.2, -.5, -.6, -1.1, -1.3, -1.7], n = Math.min(6, Math.floor(prog(t, 15.4, 20.4) * 7));
          const sx = 330, sy = 78;
          text(c, "energy under light", 424, 68, C.muted, 10, "right");
          for (let i = 0; i <= n; i++) line(c, sx + i * 14, sy + 20 - steps[i] * 30, sx + i * 14 + 10, sy + 20 - steps[i] * 30, C.teal, 2.4);
          for (let i = 1; i <= n; i++) line(c, sx + i * 14 - 4, sy + 20 - steps[i - 1] * 30, sx + i * 14, sy + 20 - steps[i] * 30, C.teal, 1, .5, [2, 2]);
        } else {
          cap = "NAMD: the electron survives long enough to react";
          const r = prog(t, 20.6, 24.6);
          bandBox(c, 1, 1, true, prog(t, 24.2, 24.9));
          text(c, "electron lifetime", 16, 84, C.muted, 11);
          text(c, "V-GaS", 16, 104, C.teal, 12, "left", 1, 600);
          rect(c, 70, 98, 160, 10, C.rule); rect(c, 70, 98, 160 * r, 10, C.teal);
          text(c, `${(4.06 * r).toFixed(2)} ns`, 238, 104, C.teal, 12, "left", 1, 600);
          text(c, "TiO₂", 16, 126, C.muted, 12);
          rect(c, 70, 120, 160, 10, C.rule); rect(c, 70, 120, 1.5, 10, C.muted);
          text(c, "~0.5 ps", 238, 126, C.muted, 12);
          text(c, "about 8,000× longer", 70, 148, C.ink, 12, "left", prog(t, 23, 23.6));
        }
        caption(c, cap);
        if (t > END - .7) rect(c, 0, 0, W, H, C.paper, prog(t, END - .7, END));
      }
    };
  })();

  // ---------- B-aza-COF story (J. Phys. Chem. Lett. 2024) ----------
  S.bcof = (() => {
    const names = ["Design", "Light", "N₂ binds", "NRR", "NAMD"];
    const ST = [0, 3.8, 7, 10, 15.8], END = 20;
    const a = 34, cx = 200, cy = 240, nodes = [], bonds = [];
    for (let m = -7; m <= 7; m++) for (let n = -7; n <= 7; n++) {
      const x = cx + (m + n) * 1.5 * a, y = cy + (m - n) * Math.sqrt(3) / 2 * a;
      [[x, y], [x + a, y]].forEach(p => { if (p[0] > -20 && p[0] < 460 && p[1] > 186 && p[1] < 320) nodes.push(p); });
    }
    for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++)
      if (Math.abs(Math.hypot(nodes[i][0] - nodes[j][0], nodes[i][1] - nodes[j][1]) - a) < 1) bonds.push([i, j]);
    let hub = 0, best = 1e9;
    nodes.forEach((p, i) => { const d = Math.hypot(p[0] - cx, p[1] - cy); if (d < best) { best = d; hub = i; } });
    const B0 = nodes[hub];
    const stage = t => { let k = 0; ST.forEach((s, i) => { if (t >= s) k = i; }); return k; };
    function band(c, x0, y0, e, alpha = 1, hot = 0) {   // small band diagram with an electron at level e (0 = CBM, 1 = high)
      rect(c, x0, y0, 120, 100, C.paper, .9 * alpha, C.rule);
      [0, 1, 2, 3].forEach(i => line(c, x0 + 16, y0 + 18 + i * 9, x0 + 104, y0 + 18 + i * 9, C.ink, 1.2, (i === 3 ? 1 : .4) * alpha));
      line(c, x0 + 16, y0 + 80, x0 + 104, y0 + 80, C.ink, 1.6, alpha);
      text(c, "CB", x0 + 108, y0 + 45, C.muted, 10, "right", alpha); text(c, "VB", x0 + 108, y0 + 90, C.muted, 10, "right", alpha);
      text(c, "1.53 eV", x0 + 20, y0 + 64, C.muted, 10, "left", alpha);
      const ey = y0 + 45 - e * 27;
      glow(c, x0 + 70, ey, 12, C.teal, .5 * alpha * hot); dot(c, x0 + 70, ey, 4.5, C.teal, alpha);
      dot(c, x0 + 70, y0 + 80, 4.5, C.paper, alpha, C.amber, 2);
    }
    return {
      dur: END,
      draw(c, t) {
        const k = stage(t); chipRow(c, names, k);
        bonds.forEach(([i, j]) => line(c, nodes[i][0], nodes[i][1], nodes[j][0], nodes[j][1], C.muted, 2, .5));
        nodes.forEach((p, i) => { if (i !== hub) dot(c, p[0], p[1], 4.5, (Math.round(p[0] / a * 3) + Math.round(p[1] / a * 3)) % 3 ? C.muted : C.blue, .7); });
        // boron arrives in the design stage
        const bin = ease(prog(t, .6, 2));
        const bx = B0[0], by = lerp(B0[1] - 90, B0[1], bin);
        if (t > .6) { glow(c, bx, by, 26, C.rose, .35 * bin); dot(c, bx, by, 7.5, C.rose); text(c, "B", bx + 12, by + 11, C.rose, 12); }
        let cap = "";
        if (k === 0) {
          cap = "Design: anchor a boron atom in the aza-COF";
          text(c, "aza-COF band gap 1.97 eV", 424, 82, C.muted, 12, "right", prog(t, .3, .9));
          text(c, "+ boron → 1.53 eV, absorbs more light", 424, 102, C.ink, 12, "right", prog(t, 2.2, 2.8));
          text(c, "boron held strongly (5.54 eV) ✓", 424, 122, C.teal, 12, "right", prog(t, 2.6, 3.2));
        }
        if (k === 1) {
          cap = "Light: hot electrons cool down to the band edge";
          photon(c, 40, 70, bx - 20, B0[1] - 20, prog(t, 3.8, 4.5), C.amber, 1 - prog(t, 4.8, 5.3));
          const e = t < 4.5 ? 0 : 1 - ease(prog(t, 4.7, 6.4));
          band(c, 300, 70, t < 4.5 ? -1.3 : e, prog(t, 3.9, 4.2), 1 - prog(t, 5.8, 6.6));
          text(c, "reduction power U = 0.63 V", 424, 186, C.ink, 11, "right", prog(t, 6, 6.6));
        }
        // N2 + hydrogens
        if (k >= 2) {
          const kin = ease(prog(t, 7, 8.2));
          const NA = [bx, B0[1] - 28], NB = [bx, B0[1] - 54 - (t > 8.4 && t < 10 ? 3 : 0)];
          const off = [lerp(160, 0, kin), lerp(-140, 0, kin)], rot = lerp(1.1, 0, kin), mid = [(NA[0] + NB[0]) / 2, (NA[1] + NB[1]) / 2];
          const rp = p => [mid[0] + (p[0] - mid[0]) * Math.cos(rot) - (p[1] - mid[1]) * Math.sin(rot) + off[0], mid[1] + (p[0] - mid[0]) * Math.sin(rot) + (p[1] - mid[1]) * Math.cos(rot) + off[1]];
          const pA = rp(NA), pB = rp(NB);
          const drift = (t0, p) => { const q = prog(t, t0, t0 + 1.4); return [p[0] + 70 * q, p[1] - 80 * q, 1 - q]; };
          const dB = t > 12.4 ? drift(12.4, pB) : [pB[0], pB[1], 1], dA = t > 14.6 ? drift(14.6, pA) : [pA[0], pA[1], 1];
          if (t < 12.4) { const o = t < 10.4 ? 3 : t < 11 ? 2 : 1; for (let q = 0; q < o; q++) { const s = (q - (o - 1) / 2) * 3.4; line(c, pA[0] + s, pA[1], pB[0] + s, pB[1], C.blue, 1.6); } }
          if (kin >= 1 && t < 14.6) line(c, bx, B0[1], pA[0], pA[1], C.rose, 2, .9);
          if (k === 2 && kin >= 1) {   // charge flows from COF to N2
            for (let q = 0; q < 3; q++) { const s = ((t * 1.3 + q / 3) % 1); dot(c, bx + 8, lerp(B0[1] - 4, pB[1], s), 2.6, C.teal, 1 - s * .6); }
            text(c, "0.68 e⁻ flow into N₂", bx + 16, pB[1] + 8, C.teal, 12, "left", prog(t, 8.4, 8.9));
            text(c, "N≡N bond weakens", bx + 16, pB[1] + 26, C.ink, 12, "left", prog(t, 8.8, 9.3));
            text(c, "end-on binding, −1.05 eV", 424, 82, C.ink, 12, "right", prog(t, 8.2, 8.7));
            cap = "N₂ binds end-on to boron";
          }
          const Hl = [[10.4, "B", [-14, -7]], [11, "B", [14, -7]], [11.6, "B", [0, -16]], [12.9, "A", [-14, -6]], [13.5, "A", [14, -6]], [14.1, "A", [0, -16]]];
          Hl.forEach(([th, n, d]) => {
            if (t < th - .5) return;
            const base = n === "B" ? dB : dA; if (base[2] <= 0) return;
            const q = ease(prog(t, th - .5, th)), x = lerp(40, base[0] + d[0], q), y = lerp(90, base[1] + d[1], q);
            if (q >= 1) line(c, base[0], base[1], x, y, C.muted, 1.4, base[2]);
            dot(c, x, y, 4.5, C.paper, base[2], C.ink);
          });
          dot(c, dB[0], dB[1], 7, C.blue, dB[2]); dot(c, dA[0], dA[1], 7, C.blue, dA[2]);
          if (t < 8.4) text(c, "N₂", pB[0] + 12, pB[1], C.blue, 12);
          if (t > 12.4) text(c, "NH₃", dB[0] + 12, dB[1] - 14, C.ink, 12, "left", dB[2]);
          if (t > 14.6) text(c, "NH₃", dA[0] + 12, dA[1] - 14, C.ink, 12, "left", dA[2]);
          if (k === 3) {
            cap = t < 12.4 ? "NRR: H⁺ + e⁻ added to the outer N first (distal path)" : t < 14.6 ? "First NH₃ leaves, then the inner N is hydrogenated" : "Two NH₃ released";
            text(c, "H⁺ + e⁻", 40, 74, C.muted, 11, "center", fade(t, 10, 10.4, 14.2, 14.6));
            const steps = [0, -.3, -.5, -.9, -1.0, -1.4, -1.7], n = Math.min(6, Math.floor(prog(t, 10, 15.2) * 7));
            text(c, "energy with light (U = 0.63 V)", 424, 70, C.muted, 10, "right");
            for (let i = 0; i <= n; i++) line(c, 330 + i * 14, 98 - steps[i] * 22, 340 + i * 14, 98 - steps[i] * 22, C.teal, 2.4);
            for (let i = 1; i <= n; i++) line(c, 330 + i * 14 - 4, 98 - steps[i - 1] * 22, 330 + i * 14, 98 - steps[i] * 22, C.teal, 1, .5, [2, 2]);
            text(c, "every step downhill ✓", 424, 150, C.teal, 11, "right", prog(t, 14.6, 15.2));
          }
        }
        if (k === 4) {
          cap = "NAMD: electrons live long enough to do the job";
          const r = prog(t, 16, 18.6);
          rect(c, 14, 64, 300, 80, C.paper, .92, C.rule);
          text(c, "time for electrons to reach N₂", 24, 80, C.muted, 11);
          rect(c, 24, 88, 200, 9, C.rule); rect(c, 24, 88, 200 * .25 * Math.min(1, r * 3), 9, C.muted);
          text(c, "~0.5 ps", 232, 93, C.muted, 11);
          text(c, "electron–hole lifetime in B-aza-COF", 24, 112, C.teal, 11, "left", 1, 600);
          rect(c, 24, 120, 200, 9, C.rule); rect(c, 24, 120, 200 * r, 9, C.teal);
          text(c, `${(2 * r).toFixed(2)} ps`, 232, 125, C.teal, 11, "left", 1, 600);
        }
        caption(c, cap);
        if (t > END - .6) rect(c, 0, 0, W, H, C.paper, prog(t, END - .6, END));
      }
    };
  })();

  // ---------- one-line animated career journey (explained.html) ----------
  document.querySelectorAll(".jline").forEach(box => {
    const stops = Array.from(box.querySelectorAll("li")), out = box.querySelector(".jline-text"), fill = box.querySelector(".jline-fill");
    let cur = 0, timer = null;
    function show(i) {
      cur = i;
      stops.forEach((s, k) => { s.classList.toggle("on", k === i); s.classList.toggle("past", k < i); });
      fill.style.width = (i / (stops.length - 1) * 100) + "%";
      out.innerHTML = "<strong>" + stops[i].dataset.year + ": " + stops[i].dataset.title + ".</strong> " + stops[i].dataset.text;
    }
    function play() { clearInterval(timer); if (!reduce) timer = setInterval(() => show((cur + 1) % stops.length), 3800); }
    stops.forEach((s, i) => s.querySelector("button").addEventListener("click", () => { show(i); play(); }));
    show(0); play();
  });

  // ===================================================================
  // player: animates every <canvas data-anim> while it's on screen
  // ===================================================================
  const items = Array.from(document.querySelectorAll("canvas[data-anim]"))
    .filter(cv => S[cv.dataset.anim])
    .map(cv => ({ cv, ctx: cv.getContext("2d"), s: S[cv.dataset.anim], vis: false, t0: null, w: 0 }));

  function render(it, t) {
    const dpr = window.devicePixelRatio || 1, w = it.cv.clientWidth;
    if (!w) return;
    if (w !== it.w) { it.w = w; it.cv.width = w * dpr; it.cv.height = w * H / W * dpr; }
    it.ctx.setTransform(it.cv.width / W, 0, 0, it.cv.height / H, 0, 0);
    it.ctx.clearRect(0, 0, W, H);
    it.s.draw(it.ctx, t);
  }
  const still = it => render(it, it.s.dur * .6);

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      const it = items.find(i => i.cv === e.target);
      it.vis = e.isIntersecting;
      if (it.vis && it.t0 === null) it.t0 = performance.now();
      if (it.vis && reduce) still(it);
    }), { rootMargin: "100px" });
    items.forEach(it => io.observe(it.cv));
  } else items.forEach(it => { it.vis = true; it.t0 = performance.now(); });

  function frame(now) {
    if (!document.hidden) items.forEach(it => {
      if (!it.vis || it.t0 === null) return;
      render(it, ((now - it.t0) / 1000) % it.s.dur);
    });
    requestAnimationFrame(frame);
  }
  if (reduce) items.forEach(still); else requestAnimationFrame(frame);
  window.ResearchAnim = { scenes: S, W, H };

  const redrawStill = () => { readColors(); items.forEach(it => { it.w = 0; if (reduce) still(it); }); };
  window.addEventListener("resize", redrawStill);
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", redrawStill);
})();
