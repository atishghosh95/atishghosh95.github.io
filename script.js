// =====================================================================
// Header animations: three short scenes of the research, plus a faint
// honeycomb lattice in the background. Scenes change every few seconds;
// visitors can also click the buttons above the animation.
//
// EDIT: the title and caption of each scene are in the SCENES list below
// (search for "title:"). You don't need to touch anything else.
// =====================================================================
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  let C = {};
  function readColors() {
    C = { ink: css("--ink"), muted: css("--muted"), teal: css("--teal"), amber: css("--amber"),
          rule: css("--rule"), paper: css("--paper"), blue: css("--blue"), rose: css("--rose") };
  }
  readColors();

  // ---------- small helpers ----------
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;   // smooth in-out
  const prog = (t, a, b) => clamp((t - a) / (b - a), 0, 1);                  // 0→1 between times a and b
  const lerp = (a, b, t) => a + (b - a) * t;

  function dot(ctx, x, y, r, fill, alpha = 1, stroke) {
    ctx.globalAlpha = alpha; ctx.beginPath(); ctx.arc(x, y, r, 0, 7);
    ctx.fillStyle = fill; ctx.fill();
    if (stroke) { ctx.lineWidth = 1.2; ctx.strokeStyle = stroke; ctx.stroke(); }
    ctx.globalAlpha = 1;
  }
  function glow(ctx, x, y, r, color, alpha) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color); g.addColorStop(1, "transparent");
    ctx.globalAlpha = alpha; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
  }
  function line(ctx, x1, y1, x2, y2, color, w = 1.5, alpha = 1, dash) {
    ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.lineWidth = w;
    ctx.setLineDash(dash || []); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.setLineDash([]); ctx.globalAlpha = 1;
  }
  function text(ctx, s, x, y, color, size = 12, align = "left", alpha = 1, italic = false) {
    ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = "middle";
    ctx.font = `${italic ? "italic " : ""}500 ${size}px "Public Sans", Arial, sans-serif`;
    ctx.fillText(s, x, y); ctx.globalAlpha = 1;
  }
  function arrowHead(ctx, x, y, ang, color, size = 7) {
    ctx.fillStyle = color; ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - size * Math.cos(ang - .45), y - size * Math.sin(ang - .45));
    ctx.lineTo(x - size * Math.cos(ang + .45), y - size * Math.sin(ang + .45));
    ctx.closePath(); ctx.fill();
  }
  function photon(ctx, x1, y1, x2, y2, t, color) {   // wavy hν arrow drawn up to fraction t
    const L = Math.hypot(x2 - x1, y2 - y1), ang = Math.atan2(y2 - y1, x2 - x1);
    const n = Math.floor(L * t);
    if (n < 2) return;
    ctx.strokeStyle = color; ctx.lineWidth = 1.6; ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const s = i, w = Math.sin(s / 4) * 4;
      const px = x1 + Math.cos(ang) * s - Math.sin(ang) * w, py = y1 + Math.sin(ang) * s + Math.cos(ang) * w;
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    ctx.stroke();
    arrowHead(ctx, x1 + Math.cos(ang) * n, y1 + Math.sin(ang) * n, ang, color);
  }

  // =================================================================
  // Scene 1: hot-carrier relaxation and interfacial transfer (NAMD)
  // =================================================================
  const A = (() => {
    const leftCB = [70, 82, 95, 107, 120, 132], rightCB = [118, 132, 146, 160, 174];
    const leftVB = [228, 241, 254, 268, 282], rightVB = [250, 264, 278];
    const LX = [72, 190], RX = [244, 362];
    // electron path: [time, x, y]
    const ePath = [[0.9, 131, 70]];
    let t = 1.2;
    leftCB.forEach((y, i) => { if (i) { ePath.push([t, 131 + (i % 2 ? 9 : -9), y]); t += 0.38; } });
    ePath.push([t + .2, 214, 125], [t + .5, 300, 132]); t += .9;
    rightCB.slice(2).forEach(y => { ePath.push([t, 300 + (y % 4 ? 8 : -8), y]); t += 0.38; });
    const hPath = [[0.9, 131, 282], [1.6, 124, 268], [2.2, 138, 254], [2.8, 128, 241], [3.4, 131, 228]];
    function at(path, tt) {
      if (tt <= path[0][0]) return path[0];
      for (let i = 1; i < path.length; i++) if (tt < path[i][0]) {
        const a = path[i - 1], b = path[i], k = ease(prog(tt, a[0] + (b[0] - a[0]) * .55, b[0]));
        return [tt, lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
      }
      return path[path.length - 1];
    }
    return {
      dur: 8.5,
      title: "Hot-carrier relaxation",
      text: "Non-adiabatic molecular dynamics follows a photoexcited electron as it cools through energy levels and crosses into a neighbouring material within a few hundred femtoseconds.",
      draw(ctx, t) {
        // axis
        line(ctx, 40, 300, 40, 40, C.muted, 1.2); arrowHead(ctx, 40, 36, -Math.PI / 2, C.muted);
        text(ctx, "Energy", 48, 40, C.muted, 11);
        text(ctx, "Material A", 131, 306, C.muted, 11, "center");
        text(ctx, "Material B", 303, 306, C.muted, 11, "center");
        text(ctx, "conduction", 400, 120, C.muted, 10, "center", .9);
        text(ctx, "bands", 400, 133, C.muted, 10, "center", .9);
        text(ctx, "valence", 400, 258, C.muted, 10, "center", .9);
        text(ctx, "bands", 400, 271, C.muted, 10, "center", .9);
        // levels
        leftCB.forEach(y => line(ctx, LX[0], y, LX[1], y, C.ink, 1.4, .55));
        rightCB.forEach(y => line(ctx, RX[0], y, RX[1], y, C.ink, 1.4, .55));
        leftVB.forEach(y => line(ctx, LX[0], y, LX[1], y, C.ink, 1.4, .55));
        rightVB.forEach(y => line(ctx, RX[0], y, RX[1], y, C.ink, 1.4, .55));
        line(ctx, 217, 60, 217, 290, C.rule, 1, 1, [3, 4]);
        // light absorption
        const pk = prog(t, 0, .9);
        if (t < 1.4) photon(ctx, 20, 160, 118, 175, pk, C.amber);
        if (t > .8 && t < 1.6) line(ctx, 131, 280, 131, 72, C.amber, 1.5, 1 - prog(t, 1.1, 1.6), [4, 3]);
        if (t < .9) return;
        // electron with a fading trail
        for (let k = 8; k >= 1; k--) {
          const p = at(ePath, t - k * .05);
          dot(ctx, p[1], p[2], 5.5, C.teal, .07 * (9 - k));
        }
        const e = at(ePath, t);
        glow(ctx, e[1], e[2], 18, C.teal, .45); dot(ctx, e[1], e[2], 6.5, C.teal);
        text(ctx, "e⁻", e[1] + 11, e[2] - 9, C.teal, 12);
        // hole
        const h = at(hPath, t);
        dot(ctx, h[1], h[2], 6.5, C.paper, 1, C.amber); ctx.lineWidth = 2; ctx.strokeStyle = C.amber;
        ctx.beginPath(); ctx.arc(h[1], h[2], 6.5, 0, 7); ctx.stroke();
        text(ctx, "h⁺", h[1] + 11, h[2] + 10, C.amber, 12);
        // clock
        const fs = Math.round(clamp((t - .9) / (ePath[ePath.length - 1][0] - .9), 0, 1) * 600);
        text(ctx, `t = ${fs} fs`, 420, 40, C.ink, 13, "right");
        if (t > ePath[ePath.length - 1][0] + .2)
          text(ctx, "charge separated", 303, 214, C.teal, 12, "center", prog(t, ePath[ePath.length - 1][0] + .2, ePath[ePath.length - 1][0] + .8));
      }
    };
  })();

  // =================================================================
  // Scene 2: fewest-switches surface hopping between two states
  // =================================================================
  const B = (() => {
    const X0 = 58, X1 = 420, Y0 = 52, Y1 = 278;
    const V1 = q => 2.2 * (q - .28) ** 2, V2 = q => 2.2 * (q - .74) ** 2 + .08, c = .045;
    const Eu = q => (V1(q) + V2(q)) / 2 + Math.sqrt(((V1(q) - V2(q)) / 2) ** 2 + c * c);
    const El = q => (V1(q) + V2(q)) / 2 - Math.sqrt(((V1(q) - V2(q)) / 2) ** 2 + c * c);
    const Emax = .9, X = q => lerp(X0, X1, (q - .04) / .92), Y = E => lerp(Y1, Y0, E / Emax);
    const qx = .5136;   // avoided crossing
    const tHop = 3.1;
    function qOf(t) {
      if (t < 1.2) return .28;
      if (t < tHop) return lerp(.28, qx, Math.pow(prog(t, 1.2, tHop), 1.6));
      const s = t - tHop, A0 = .74 - qx, w = 2.6;
      return .74 - A0 * Math.cos(w * s) * Math.exp(-s / 2.4);
    }
    function curve(ctx, f, color, w) {
      ctx.strokeStyle = color; ctx.lineWidth = w; ctx.beginPath();
      for (let i = 0; i <= 120; i++) {
        const q = .04 + .92 * i / 120, y = Y(f(q));
        if (y < Y0 - 10) { ctx.moveTo(X(q), Y0 - 10); continue; }
        i ? ctx.lineTo(X(q), y) : ctx.moveTo(X(q), y);
      }
      ctx.stroke();
    }
    return {
      dur: 9,
      title: "Surface hopping",
      text: "After light absorption the nuclei move on the excited-state surface. Where two surfaces come close, the system can hop down, which is how energy is lost without emitting light.",
      draw(ctx, t) {
        line(ctx, X0 - 12, Y1 + 8, X0 - 12, Y0 - 14, C.muted, 1.2); arrowHead(ctx, X0 - 12, Y0 - 18, -Math.PI / 2, C.muted);
        line(ctx, X0 - 12, Y1 + 8, X1, Y1 + 8, C.muted, 1.2); arrowHead(ctx, X1 + 4, Y1 + 8, 0, C.muted);
        text(ctx, "Energy", X0 - 4, Y0 - 18, C.muted, 11);
        text(ctx, "nuclear coordinate", X1, Y1 + 22, C.muted, 11, "right");
        curve(ctx, Eu, C.ink, 2); curve(ctx, El, C.ink, 2);
        text(ctx, "S₁ (excited)", X(.86) - 14, Y(Eu(.86)) + 4, C.ink, 12, "right");
        text(ctx, "S₀ (ground)", X(.13), Y(El(.13)) + 2, C.ink, 12, "right");
        // excitation
        if (t < 1.4) {
          const k = prog(t, .2, 1);
          photon(ctx, X(.28) - 70, Y(Eu(.28)) - 30, X(.28) - 8, Y(Eu(.28)) - 4, k, C.amber);
          line(ctx, X(.28), Y(0), X(.28), lerp(Y(0), Y(Eu(.28)), k), C.amber, 1.5, 1, [4, 3]);
        }
        const q = qOf(t), onUpper = t < tHop;
        const E = onUpper ? Eu(q) : El(q), x = X(q), y = Y(E);
        if (t < .6) { dot(ctx, X(.28), Y(0), 7, C.teal); return; }
        // hop
        if (t >= tHop && t < tHop + 1.4) {
          const k = prog(t, tHop, tHop + 1.4);
          line(ctx, X(qx), Y(Eu(qx)), X(qx), Y(El(qx)), C.amber, 2, 1 - k, [3, 3]);
          glow(ctx, X(qx), (Y(Eu(qx)) + Y(El(qx))) / 2, 34, C.amber, .55 * (1 - k));
          text(ctx, "hop!", X(qx) + 10, Y(Eu(qx)) - 14, C.amber, 13, "left", 1 - k);
        }
        // ghost trail
        for (let k = 10; k >= 1; k--) {
          const tt = t - k * .06, qq = qOf(tt), up = tt < tHop;
          dot(ctx, X(qq), Y(up ? Eu(qq) : El(qq)) - 7, 5, C.teal, .05 * (11 - k));
        }
        glow(ctx, x, y - 7, 20, C.teal, .45); dot(ctx, x, y - 7, 7, C.teal);
        // population bar
        const p = t < tHop - .4 ? 1 : clamp(1 - prog(t, tHop - .4, tHop + .5), 0, 1);
        const bx = X(.56) - 48;
        text(ctx, "S₁ population", bx, Y0 - 16, C.muted, 11);
        ctx.fillStyle = C.rule; ctx.fillRect(bx, Y0 - 6, 96, 7);
        ctx.fillStyle = C.teal; ctx.fillRect(bx, Y0 - 6, 96 * p, 7);
      }
    };
  })();

  // =================================================================
  // Scene 3: photocatalytic nitrogen reduction on a boron site in a COF
  // =================================================================
  const Cc = (() => {
    const a = 40, cx = 214, cy = 205;
    const nodes = [], bonds = [];
    for (let m = -6; m <= 6; m++) for (let n = -6; n <= 6; n++) {
      const x = cx + (m + n) * 1.5 * a, y = cy + (m - n) * Math.sqrt(3) / 2 * a;
      [[x, y], [x + a, y]].forEach(p => { if (p[0] > -20 && p[0] < 460 && p[1] > 110 && p[1] < 340) nodes.push(p); });
    }
    for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++)
      if (Math.abs(Math.hypot(nodes[i][0] - nodes[j][0], nodes[i][1] - nodes[j][1]) - a) < 1) bonds.push([i, j]);
    let hub = 0, best = 1e9;
    nodes.forEach((p, i) => { const d = Math.hypot(p[0] - cx, p[1] - (cy + 2)); if (d < best) { best = d; hub = i; } });
    const B0 = nodes[hub];
    const NA = [B0[0], B0[1] - 30], NB = [B0[0], B0[1] - 54];   // proximal, distal N
    const Hsrc = [36, 70];
    // H arrival times and where they bind (offsets from their N)
    const H = [
      { t: 2.0, n: "B", d: [-14, -7] }, { t: 2.7, n: "B", d: [14, -7] }, { t: 3.4, n: "B", d: [0, -16] },
      { t: 4.9, n: "A", d: [-14, -6] }, { t: 5.6, n: "A", d: [14, -6] }, { t: 6.3, n: "A", d: [0, -16] },
    ];
    const leave1 = 4.0, leave2 = 6.9;
    return {
      dur: 10,
      title: "Nitrogen reduction on a COF",
      text: "Sunlight drives N₂ fixation at a boron site in a covalent organic framework. N₂ binds, then picks up protons and electrons one at a time until two NH₃ molecules leave.",
      draw(ctx, t) {
        // framework
        bonds.forEach(([i, j]) => line(ctx, nodes[i][0], nodes[i][1], nodes[j][0], nodes[j][1], C.muted, 2, .55));
        nodes.forEach((p, i) => {
          if (i === hub) return;
          const isN = (Math.round(p[0] / a * 3) + Math.round(p[1] / a * 3)) % 3 === 0;
          dot(ctx, p[0], p[1], isN ? 5 : 4.5, isN ? C.blue : C.muted, isN ? .75 : .7);
        });
        glow(ctx, B0[0], B0[1], 26, C.rose, .35);
        dot(ctx, B0[0], B0[1], 7.5, C.rose); text(ctx, "B", B0[0] + 12, B0[1] + 10, C.rose, 12);
        text(ctx, "COF layer", 424, 318, C.muted, 11, "right");
        // sunlight
        if (t < 2.2) {
          const k = prog(t, 0, 1.2), f = 1 - prog(t, 1.6, 2.2);
          ctx.globalAlpha = f; photon(ctx, 420, 40, B0[0] + 40, B0[1] - 18, k, C.amber); ctx.globalAlpha = 1;
          text(ctx, "hν", 410, 60, C.amber, 13, "center", f);
        }
        // N2 approaching
        const kin = ease(prog(t, .2, 1.6));
        const off = [lerp(150, 0, kin), lerp(-150, 0, kin)], rot = lerp(1.2, 0, kin);
        const rotP = (p, cxp, cyp) => [cxp + (p[0] - cxp) * Math.cos(rot) - (p[1] - cyp) * Math.sin(rot),
                                       cyp + (p[0] - cxp) * Math.sin(rot) + (p[1] - cyp) * Math.cos(rot)];
        const mid = [(NA[0] + NB[0]) / 2, (NA[1] + NB[1]) / 2];
        let pA = rotP(NA, mid[0], mid[1]), pB = rotP(NB, mid[0], mid[1]);
        pA = [pA[0] + off[0], pA[1] + off[1]]; pB = [pB[0] + off[0], pB[1] + off[1]];
        // leaving groups drift up and fade
        const drift = (t0, p) => { const k = prog(t, t0, t0 + 1.6); return [p[0] + 70 * k, p[1] - 90 * k, 1 - k]; };
        const dB = t > leave1 ? drift(leave1, pB) : [pB[0], pB[1], 1];
        const dA = t > leave2 ? drift(leave2, pA) : [pA[0], pA[1], 1];
        // bonds
        if (t < leave1) {
          const order = t < 2.0 ? 3 : t < 2.7 ? 2 : 1;
          for (let k = 0; k < order; k++) {
            const s = (k - (order - 1) / 2) * 3.4;
            line(ctx, pA[0] + s, pA[1], pB[0] + s, pB[1], C.blue, 1.6);
          }
        }
        if (kin >= 1 && t < leave2) line(ctx, B0[0], B0[1], pA[0], pA[1], C.rose, 2, .9, t < 1.8 ? [3, 3] : null);
        // hydrogens
        H.forEach(h => {
          if (t < h.t - .7) return;
          const base = h.n === "B" ? dB : dA, gone = base[2];
          if (gone <= 0) return;
          const k = ease(prog(t, h.t - .7, h.t));
          const tx = base[0] + h.d[0], ty = base[1] + h.d[1];
          const x = lerp(Hsrc[0], tx, k), y = lerp(Hsrc[1], ty, k);
          if (k >= 1) line(ctx, base[0], base[1], x, y, C.muted, 1.4, gone);
          dot(ctx, x, y, 4.5, C.paper, gone, C.ink);
        });
        if (dB[2] > 0) dot(ctx, dB[0], dB[1], 7, C.blue, dB[2]);
        if (dA[2] > 0) dot(ctx, dA[0], dA[1], 7, C.blue, dA[2]);
        if (t > leave1) text(ctx, "NH₃", dB[0] + 12, dB[1] - 14, C.ink, 12, "left", dB[2]);
        if (t > leave2) text(ctx, "NH₃", dA[0] + 12, dA[1] - 14, C.ink, 12, "left", dA[2]);
        if (t > 1.2 && t < 7) text(ctx, "H⁺ + e⁻", Hsrc[0], Hsrc[1] - 16, C.muted, 11, "center", prog(t, 1.2, 1.8) * (1 - prog(t, 6.4, 7)));
        // step label
        const step = t < 1.7 ? "1  N₂ adsorbs on the boron site" : t < 6.9 ? "2  proton–electron transfer, one H at a time" : "3  two NH₃ released";
        text(ctx, step, 20, 24, C.ink, 13);
        if (t > 8.6) {
          ctx.globalAlpha = prog(t, 8.6, 10); ctx.fillStyle = C.paper; ctx.fillRect(0, 0, 440, 320); ctx.globalAlpha = 1;
        }
      }
    };
  })();

  const SCENES = [A, B, Cc];

  // ---------- scene player ----------
  const canvas = document.getElementById("scene");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    const buttons = Array.from(document.querySelectorAll(".stage-tabs button"));
    const titleEl = document.getElementById("scene-title"), textEl = document.getElementById("scene-text");
    let cur = 0, t0 = performance.now(), lastSize = 0;

    function size() {
      const dpr = window.devicePixelRatio || 1, w = canvas.clientWidth;
      if (w === lastSize) return; lastSize = w;
      canvas.width = w * dpr; canvas.height = w * 320 / 440 * dpr;
      ctx.setTransform(canvas.width / 440, 0, 0, canvas.height / 320, 0, 0);
    }
    function select(i) {
      cur = i; t0 = performance.now();
      buttons.forEach((b, k) => b.setAttribute("aria-pressed", k === i ? "true" : "false"));
      titleEl.textContent = SCENES[i].title; textEl.textContent = SCENES[i].text;
      if (reduce) render(SCENES[i].dur * .62);
    }
    function render(t) {
      size(); ctx.clearRect(0, 0, 440, 320); SCENES[cur].draw(ctx, t);
    }
    function frame(now) {
      if (!document.hidden) {
        let t = (now - t0) / 1000;
        if (t > SCENES[cur].dur) { select((cur + 1) % SCENES.length); t = 0; }
        render(t);
      }
      requestAnimationFrame(frame);
    }
    buttons.forEach((b, i) => b.addEventListener("click", () => select(i)));
    select(0);
    if (!reduce) requestAnimationFrame(frame);
    window.addEventListener("resize", () => { lastSize = 0; if (reduce) render(SCENES[cur].dur * .62); });
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { readColors(); if (reduce) render(SCENES[cur].dur * .62); });
  }

  // ---------- faint honeycomb in the header background ----------
  const bg = document.getElementById("lattice");
  if (bg) {
    const b = bg.getContext("2d");
    function drawBg() {
      const dpr = window.devicePixelRatio || 1, w = bg.clientWidth, h = bg.clientHeight;
      bg.width = w * dpr; bg.height = h * dpr; b.setTransform(dpr, 0, 0, dpr, 0, 0);
      const a = 34, rule = css("--rule"); b.strokeStyle = rule; b.fillStyle = rule; b.lineWidth = 1;
      for (let m = -40; m <= 40; m++) for (let n = -40; n <= 40; n++) {
        const x = w / 2 + (m + n) * 1.5 * a, y = h / 2 + (m - n) * Math.sqrt(3) / 2 * a;
        if (x < -a || x > w + a || y < -a || y > h + a) continue;
        [[a, 0], [-a / 2, Math.sqrt(3) / 2 * a], [-a / 2, -Math.sqrt(3) / 2 * a]].forEach(([dx, dy]) => {
          b.beginPath(); b.moveTo(x, y); b.lineTo(x + dx, y + dy); b.stroke();
        });
        b.beginPath(); b.arc(x, y, 2.4, 0, 7); b.fill();
        b.beginPath(); b.arc(x + a, y, 2.4, 0, 7); b.fill();
      }
    }
    drawBg();
    window.addEventListener("resize", drawBg);
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", drawBg);
  }
})();
