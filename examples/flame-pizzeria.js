/**
 * FLAME Pizzería — Reference Implementation
 * All animation patterns applied to a real project.
 * Copy individual sections as needed.
 */

/* ═══════════════════════════════════════════════════════
   1. SVG ARCH BUILD-IN
   Bricks fly from scale:0 into final position with stagger from center.
   Orange strips are included by selecting ALL polygons.
   CSS required: .lbrick { transform-box:fill-box; transform-origin:center }
═══════════════════════════════════════════════════════ */
function buildLogoArch() {
  const svg = document.getElementById("l-arch-svg");
  if (!svg) return;

  // ... (build SVG innerHTML) ...

  if (window.gsap) {
    const allPolygons = [...svg.querySelectorAll("polygon")];
    gsap.from(allPolygons, {
      opacity: 0, scale: 0,
      duration: 0.5,
      stagger: { amount: 0.5, from: "center" },
      ease: "back.out(1.6)",
      delay: 0.15,
    });

    // Flame icon scale-in after bricks settle
    gsap.from("#l-flame", {
      opacity: 0, scale: 0.3,
      duration: 0.7, ease: "back.out(2)", delay: 0.65,
    });

    // Text container (before split runs)
    gsap.from(".l-flame-text", {
      opacity: 0, y: 14,
      duration: 0.5, ease: "power3.out", delay: 0.7,
    });

    // Subtitle + CTA button staggered after text
    gsap.from([".l-sub", "#enter-btn"], {
      opacity: 0, y: 16,
      duration: 0.55, stagger: 0.14,
      ease: "power3.out", delay: 1.0,
    });
  }
}

/* ═══════════════════════════════════════════════════════
   2. EXIT ANIMATION — ALL polygons fly out together
   KEY: use "#l-arch-svg polygon" not just ".lbrick"
   so orange strips leave with the bricks.
═══════════════════════════════════════════════════════ */
function enterOven() {
  const bricks = document.querySelectorAll("#l-arch-svg polygon"); // ← all polygons

  gsap.timeline({ onComplete: showCatalog })
    .to([".l-sub", "#enter-btn"], { opacity: 0, y: 14, duration: 0.22, ease: "power2.in" })
    .to(bricks, {
      opacity: 0, scale: 0.2,
      x: (i) => {
        const angle = (i / bricks.length) * Math.PI - Math.PI / 2;
        return Math.cos(angle) * gsap.utils.random(300, 700);
      },
      y: (i) => {
        const angle = (i / bricks.length) * Math.PI - Math.PI / 2;
        return Math.sin(angle) * gsap.utils.random(200, 500) - 100;
      },
      rotation: () => gsap.utils.random(-480, 480),
      duration: 0.9, ease: "power3.in",
      stagger: { amount: 0.18, from: "edges" },
    }, "-=0.05")
    .to("#l-flame", { scale: 28, opacity: 0.95, duration: 0.75, ease: "power3.in" }, "-=0.85")
    .to("#l-fire",  { opacity: 1, scale: 3, borderRadius: "0%", duration: 0.3, ease: "power2.in" }, "-=0.3")
    .to("#flash",   { opacity: 1, duration: 0.18 }, "-=0.08")
    .to("#landing", { opacity: 0, duration: 0.08 });
}

/* ═══════════════════════════════════════════════════════
   3. SPLIT TEXT — FLAME brand name
   Each character falls from above with rotateX.
═══════════════════════════════════════════════════════ */
function initFlameSplit() {
  const span = document.querySelector(".l-flame-text > span");
  if (!span || !window.gsap) return;

  span.innerHTML = [...span.textContent]
    .map(l => `<span class="fl-char" style="display:inline-block">${l}</span>`)
    .join("");

  gsap.from(".fl-char", {
    y: -55, opacity: 0, rotateX: 90,
    duration: 0.6, stagger: 0.07,
    ease: "back.out(1.7)", delay: 0.55,
  });
}

/* ═══════════════════════════════════════════════════════
   4. PIZZA NAME WORD REVEAL
   Each word slides up when the user switches pizzas.
═══════════════════════════════════════════════════════ */
function revealPizzaName(nombre) {
  const nEl = document.getElementById("hero-nombre");
  nEl.innerHTML = nombre.split(" ")
    .map(w => `<span class="hw" style="display:inline-block">${w}</span>`)
    .join(" ");

  if (window.gsap) {
    gsap.from(nEl.querySelectorAll(".hw"), {
      y: 20, opacity: 0,
      duration: 0.32, stagger: 0.07, ease: "power2.out",
    });
  }
}

/* ═══════════════════════════════════════════════════════
   5. EMBER PARTICLES
   Floating fire particles over a dark background container.
═══════════════════════════════════════════════════════ */
function spawnEmbers() {
  const landing = document.getElementById("landing");
  if (!landing) return;

  function mk() {
    if (landing.style.display === "none") return;
    const e   = document.createElement("div");
    e.className = "ember";
    const sz  = 2 + Math.random() * 3.5;
    const dx  = (Math.random() - .5) * 90;
    const dur = 2.5 + Math.random() * 2.5;
    e.style.cssText = [
      `left:${15 + Math.random() * 70}%`,
      `bottom:${12 + Math.random() * 28}%`,
      `width:${sz}px`, `height:${sz}px`,
      `--dx:${dx}px`, `--dur:${dur}s`,
      `animation-delay:${Math.random() * 1.2}s`,
    ].join(";");
    landing.appendChild(e);
    setTimeout(() => e.remove(), (dur + 2) * 1000);
  }

  for (let i = 0; i < 14; i++) setTimeout(mk, i * 150);
  const iv = setInterval(() => {
    landing.style.display === "none" ? clearInterval(iv) : mk();
  }, 380);
}

/* CSS required for embers:
.ember {
  position: absolute; border-radius: 50%; pointer-events: none;
  background: radial-gradient(circle at 35% 35%, #FFD700, #FF8C00, rgba(255,69,0,.4));
  box-shadow: 0 0 6px rgba(255,140,0,.5);
  animation: ember-rise var(--dur,3s) ease-out forwards;
}
@keyframes ember-rise {
  0%   { transform: translate(0,0) scale(1);    opacity: .85 }
  70%  { opacity: .4 }
  100% { transform: translate(var(--dx,20px),-240px) scale(.1); opacity: 0 }
}
*/

/* ═══════════════════════════════════════════════════════
   6. MAGNETIC BUTTON
   CTA follows cursor with elastic spring-back.
═══════════════════════════════════════════════════════ */
function initMagneticBtn() {
  const btn = document.getElementById("enter-btn");
  if (!btn || !window.gsap) return;

  btn.addEventListener("mousemove", e => {
    const r  = btn.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width  / 2);
    const dy = e.clientY - (r.top  + r.height / 2);
    gsap.to(btn, { x: dx * 0.28, y: dy * 0.28, duration: 0.3, ease: "power3.out" });
  });

  btn.addEventListener("mouseleave", () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
  });
}

/* ═══════════════════════════════════════════════════════
   7. CART FLY ANIMATION
   Item flies from action button to cart icon.
═══════════════════════════════════════════════════════ */
function flyToCart(sourceEl) {
  if (!sourceEl || !window.gsap) return;
  const cart = document.getElementById("cart-btn");
  if (!cart) return;

  const s = sourceEl.getBoundingClientRect();
  const d = cart.getBoundingClientRect();

  const clone = document.createElement("div");
  clone.textContent = "🍕";
  clone.style.cssText = [
    "position:fixed", "z-index:9999", "pointer-events:none", "font-size:1.3rem",
    `left:${s.left + s.width  / 2}px`,
    `top:${s.top  + s.height / 2}px`,
    "transform:translate(-50%,-50%)",
  ].join(";");
  document.body.appendChild(clone);

  gsap.to(clone, {
    x: d.left - s.left + (d.width  - s.width)  / 2,
    y: d.top  - s.top  + (d.height - s.height) / 2,
    scale: 0.15, opacity: 0,
    duration: 0.65, ease: "power2.in",
    onComplete: () => clone.remove(),
  });
}

/* ═══════════════════════════════════════════════════════
   8. BADGE BOUNCE
   Cart count badge pops elastically when incremented.
═══════════════════════════════════════════════════════ */
function bounceBadge() {
  if (!window.gsap) return;
  requestAnimationFrame(() => {
    const cc = document.getElementById("cart-count");
    if (cc) gsap.fromTo(cc,
      { scale: 1.9 },
      { scale: 1, ease: "elastic.out(1, 0.4)", duration: 0.6 }
    );
  });
}

/* ═══════════════════════════════════════════════════════
   9. SCROLL REVEAL — EMPANADAS CARDS
   Cards cascade in as the section enters the viewport.
═══════════════════════════════════════════════════════ */
function initScrollReveal(slider) {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  gsap.from(slider.querySelectorAll(".emp-card"), {
    opacity: 0, y: 36,
    duration: 0.5, stagger: 0.09, ease: "power2.out",
    scrollTrigger: { trigger: slider, start: "top 88%" },
  });
}

/* ═══════════════════════════════════════════════════════
   INIT ORDER
   Sequence matters: build arch → split text → particles → magnetic
═══════════════════════════════════════════════════════ */
// buildLogoArch();   // creates SVG + starts entrance animation
// initFlameSplit();  // splits FLAME text + animates chars
// spawnEmbers();     // starts particle loop
// initMagneticBtn(); // wires up hover effect
