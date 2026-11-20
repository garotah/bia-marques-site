(() => {
  const S = window.SITE || {};
  const reduzir = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const larga = matchMedia("(min-width: 861px)").matches;

  /* ── Abertura: vídeo em loop, roda sozinho e pausa fora da tela ─────────── */
  const hero = document.querySelector(".hero");
  const video = hero && hero.querySelector(".hero-video");
  if (video && S.video) {
    if (!video.getAttribute("src")) video.src = larga ? S.video.desktop : S.video.celular;
    video.muted = true;

    // Desktop: o vídeo é vertical, então aparece inteiro e o fundo é o mesmo vídeo desfocado
    let fundo = null;
    if (larga) {
      fundo = video.cloneNode();
      fundo.classList.add("hero-fundo");
      fundo.removeAttribute("poster");
      if (fundo.getAttribute("src") !== video.getAttribute("src")) fundo.src = video.src;
      video.parentNode.insertBefore(fundo, video);
    }
    const videos = [video, fundo].filter(Boolean);
    const tocar = () => videos.forEach((v) => v.play().catch(() => {}));
    const pausar = () => videos.forEach((v) => v.pause());

    if (!reduzir) {
      let visivel = true;
      new IntersectionObserver(([e]) => {
        visivel = e.isIntersecting;
        visivel && !document.hidden ? tocar() : pausar();
      }, { threshold: 0.15 }).observe(hero);
      document.addEventListener("visibilitychange", () => (document.hidden ? pausar() : visivel && tocar()));
      tocar();
      // Alguns navegadores só liberam o play depois do primeiro toque
      addEventListener("pointerdown", () => visivel && tocar(), { once: true });
    }
  }

  /* ── Topo, botão flutuante, revelar e ano ───────────────────────────────── */
  const topo = document.querySelector(".topo");
  const flutuante = document.querySelector(".flutuante");
  const aoRolar = () => {
    topo && topo.classList.toggle("rolou", scrollY > 40);
    flutuante && flutuante.classList.toggle("visivel", scrollY > innerHeight * 0.7);
  };
  addEventListener("scroll", aoRolar, { passive: true });
  aoRolar();

  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("visto"); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll(".revelar").forEach((el) => io.observe(el));
  document.querySelectorAll("[data-ano]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ── Links diretos (config.js) ──────────────────────────────────────────── */
  document.querySelectorAll("[data-link]").forEach((a) => {
    const url = (S.links || {})[a.dataset.link];
    if (url) a.href = url; else a.classList.add("oculto");
  });
})();
