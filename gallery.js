// Opens gallery photos full-size. Works with any number of photos;
// you don't need to edit this file when you add or remove photos.
(function () {
  const figs = Array.from(document.querySelectorAll(".gallery figure"));
  const dlg = document.getElementById("viewer");
  const img = document.getElementById("v-img");
  const cap = document.getElementById("v-cap");
  let i = 0;

  function show(n) {
    i = (n + figs.length) % figs.length;
    const src = figs[i].querySelector("img");
    const fc = figs[i].querySelector("figcaption");
    img.src = src.src;
    img.alt = src.alt;
    cap.textContent = fc ? fc.textContent : "";
  }

  figs.forEach((f, n) => {
    f.tabIndex = 0;
    f.setAttribute("role", "button");
    f.addEventListener("click", () => { show(n); dlg.showModal(); });
    f.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(n); dlg.showModal(); } });
  });

  dlg.querySelector(".v-close").onclick = () => dlg.close();
  dlg.querySelector(".v-prev").onclick = () => show(i - 1);
  dlg.querySelector(".v-next").onclick = () => show(i + 1);
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });   // click outside closes
  document.addEventListener("keydown", e => {
    if (!dlg.open) return;
    if (e.key === "ArrowLeft") show(i - 1);
    if (e.key === "ArrowRight") show(i + 1);
  });

  // swipe left/right on phones
  let x0 = null;
  dlg.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
  dlg.addEventListener("touchend", e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(dx < 0 ? i + 1 : i - 1);
    x0 = null;
  });
})();
