// Gallery page: the photo grid in the middle, two rolling "wheels" of photos
// on the left and right, and a full-size viewer when any photo is clicked.
// Works with any number of photos; you don't need to edit this file.
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- full-size viewer, shared by the grid and both wheels ----------
  const dlg = document.getElementById("viewer");
  const vImg = document.getElementById("v-img");
  const vCap = document.getElementById("v-cap");
  let group = [], i = 0;

  function show(n) {
    i = (n + group.length) % group.length;
    vImg.src = group[i].src; vImg.alt = group[i].alt; vCap.textContent = group[i].caption;
  }
  function open(list, n) { group = list; show(n); dlg.showModal(); }

  dlg.querySelector(".v-close").onclick = () => dlg.close();
  dlg.querySelector(".v-prev").onclick = () => show(i - 1);
  dlg.querySelector(".v-next").onclick = () => show(i + 1);
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
  document.addEventListener("keydown", e => {
    if (!dlg.open) return;
    if (e.key === "ArrowLeft") show(i - 1);
    if (e.key === "ArrowRight") show(i + 1);
  });
  let x0 = null;
  dlg.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
  dlg.addEventListener("touchend", e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(dx < 0 ? i + 1 : i - 1);
    x0 = null;
  });

  function clickable(el, list, n) {
    el.tabIndex = 0; el.setAttribute("role", "button");
    el.addEventListener("click", () => open(list, n));
    el.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(list, n); } });
  }

  // ---------- main grid ----------
  const figs = Array.from(document.querySelectorAll(".gallery figure"));
  const mainList = figs.map(f => {
    const im = f.querySelector("img"), fc = f.querySelector("figcaption");
    return { src: im.src, alt: im.alt, caption: fc ? fc.textContent : "" };
  });
  figs.forEach((f, n) => clickable(f, mainList, n));

  // ---------- rolling wheels ----------
  const wheels = Array.from(document.querySelectorAll(".reel")).map(reel => {
    const win = reel.querySelector(".reel-window");
    const items = Array.from(reel.querySelectorAll(".reel-track img"));
    const list = items.map(im => ({ src: im.dataset.full || im.src, alt: im.alt, caption: im.alt }));
    items.forEach((im, n) => clickable(im, list, n));
    const w = { win, items, offset: 0, paused: false, held: false, speed: reel.classList.contains("reel-right") ? 28 : 32 };
    const btn = reel.querySelector(".reel-toggle");
    if (btn) {
      if (reduce) { w.held = true; btn.textContent = "Play"; btn.setAttribute("aria-pressed", "true"); }
      btn.addEventListener("click", () => {
        w.held = !w.held;
        btn.textContent = w.held ? "Play" : "Pause";
        btn.setAttribute("aria-pressed", String(w.held));
      });
    }
    win.addEventListener("mouseenter", () => { w.paused = true; });
    win.addEventListener("mouseleave", () => { w.paused = false; });
    win.addEventListener("focusin", () => { w.paused = true; });
    win.addEventListener("focusout", () => { w.paused = false; });
    // turn the wheel with the mouse wheel or a finger
    win.addEventListener("wheel", e => { e.preventDefault(); w.offset -= e.deltaY * .6; layout(w); }, { passive: false });
    let ty = null;
    win.addEventListener("touchstart", e => { ty = e.touches[0].clientY; w.paused = true; }, { passive: true });
    win.addEventListener("touchmove", e => { if (ty === null) return; const y = e.touches[0].clientY; w.offset += (y - ty); ty = y; layout(w); }, { passive: true });
    win.addEventListener("touchend", () => { ty = null; w.paused = false; });
    return w;
  });

  function layout(w) {
    const H = w.win.clientHeight, iw = w.win.clientWidth;
    if (!H || !iw) return;
    const ih = iw * .95, gap = 10, step = ih + gap, total = step * w.items.length;
    w.items.forEach((im, k) => {
      let y = ((k * step + w.offset) % total + total) % total - step;
      if (y > H + step) { im.style.visibility = "hidden"; return; }
      const d = clamp((y + ih / 2 - H / 2) / (H / 2), -1.2, 1.2), ad = Math.abs(d);
      im.style.visibility = "visible";
      im.style.height = ih + "px";
      im.style.transform = `translateY(${y}px) rotateX(${(-d * 38).toFixed(2)}deg) scale(${(1 - .14 * ad).toFixed(3)})`;
      im.style.opacity = Math.max(0, 1 - .75 * ad).toFixed(3);
      im.style.zIndex = String(100 - Math.round(ad * 50));
    });
  }
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

  let last = performance.now();
  function frame(now) {
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    wheels.forEach(w => { if (!w.paused && !w.held && !document.hidden) w.offset += w.speed * dt; layout(w); });
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
