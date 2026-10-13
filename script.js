// Draws the honeycomb lattice behind the header.
// On page load a glow spreads outward from one atom, shell by shell,
// like message passing in a graph neural network. You don't need to edit this file.
(function () {
  const canvas = document.getElementById("lattice");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let nodes = [], edges = [], hops = [], start = null;

  function css(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function build() {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const a = 34;                                   // bond length in pixels
    const ax = 1.5 * a, ay = Math.sqrt(3) / 2 * a;
    const small = w < 681;                          // phones: tuck the glow into the top-right corner
    const cx = small ? w - 60 : w - 120, cy = small ? 110 : h * 0.5;
    nodes = [];
    for (let m = -30; m <= 30; m++) for (let n = -30; n <= 30; n++) {
      const x = cx + (m + n) * ax, y = cy + (m - n) * ay;
      [[x, y, 0], [x + a, y, 1]].forEach(p => {
        if (p[0] > -a && p[0] < w + a && p[1] > -a && p[1] < h + a) nodes.push(p);
      });
    }
    edges = [];
    const adj = nodes.map(() => []);
    for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
      const d = Math.hypot(nodes[i][0] - nodes[j][0], nodes[i][1] - nodes[j][1]);
      if (Math.abs(d - a) < 1) { edges.push([i, j]); adj[i].push(j); adj[j].push(i); }
    }
    // breadth-first search: how many bonds each atom is from the start atom
    let hub = 0, best = Infinity;
    nodes.forEach((p, i) => { const d = Math.hypot(p[0] - cx, p[1] - cy); if (d < best) { best = d; hub = i; } });
    hops = nodes.map(() => Infinity); hops[hub] = 0;
    let q = [hub];
    while (q.length) { const nq = []; for (const u of q) for (const v of adj[u]) if (hops[v] === Infinity) { hops[v] = hops[u] + 1; nq.push(v); } q = nq; }
  }

  function draw(t) {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);
    const rule = css("--rule"), teal = css("--teal"), amber = css("--amber");
    // the glow front moves one shell every 260 ms, then settles at 3 shells
    const front = reduce ? 3 : Math.min(3, t / 260);
    const lit = i => hops[i] <= front;

    ctx.lineWidth = 1.2;
    for (const [i, j] of edges) {
      const on = lit(i) && lit(j);
      ctx.strokeStyle = on ? teal : rule;
      ctx.globalAlpha = on ? 0.9 : 1;
      ctx.beginPath(); ctx.moveTo(nodes[i][0], nodes[i][1]); ctx.lineTo(nodes[j][0], nodes[j][1]); ctx.stroke();
    }
    nodes.forEach((p, i) => {
      const on = lit(i);
      ctx.globalAlpha = 1;
      ctx.fillStyle = on ? (p[2] ? amber : teal) : rule;
      ctx.beginPath(); ctx.arc(p[0], p[1], on ? (hops[i] === 0 ? 6 : 4.5) : 3.2, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  function frame(ts) {
    if (start === null) start = ts;
    const t = ts - start;
    draw(t);
    if (!reduce && t < 1000) requestAnimationFrame(frame);
  }

  function reset() { build(); draw(Infinity); }
  build();
  requestAnimationFrame(frame);
  window.addEventListener("resize", reset);
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", reset);
})();
