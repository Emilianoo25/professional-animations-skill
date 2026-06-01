---
name: professional-animations
description: Apply award-winning GSAP animation patterns (SVG build-in, split text, particles, magnetic buttons, fly-to-cart, scroll reveal) to any HTML page. Based on Awwwards/Codrops research.
---

# Professional Web Animations — Agent Skill

## Overview

This skill turns a flat, static HTML page into a cinematic, award-winning experience using GSAP.
Based on research from Codrops, Awwwards, siteinspire, land-book, and proven implementations.

**Announce at start:** "I'm using the Professional Animations skill. I'll analyze the page, identify opportunities, and apply award-winning GSAP patterns."

---

## When to Use

- User asks to "animate", "improve", "polish", or "make professional" a web page
- Landing pages with static logos or hero sections
- E-commerce sites needing micro-interactions
- Any site where the first impression is underwhelming
- Portfolio projects that need to stand out

## When NOT to Use

- Simple utility tools (dashboards, admin panels)
- Sites where animation conflicts with accessibility (respect `prefers-reduced-motion`)
- Backends / server-side code

---

## The Golden Rules of Professional Animation

### 1. Easing is Everything
Bad animations use `ease` or `linear`. Great animations use:
```javascript
// Bounce into position (bricks, cards, logos)
ease: "back.out(1.6)"

// Elastic return (magnetic buttons, badges)
ease: "elastic.out(1, 0.4)"

// Cinematic smooth (page transitions, reveals)
ease: "power3.out"

// Stagger into view (text, lists)
ease: "power2.out"

// Explode outward (exit animations)
ease: "power3.in"
```

### 2. Stagger Creates Life
Never animate everything at once. Stagger by 0.05–0.12s:
```javascript
gsap.from(elements, {
  opacity: 0, y: 30,
  stagger: { amount: 0.5, from: "center" }, // from center = arch effect
  stagger: 0.07,                             // uniform = text cascade
  stagger: { amount: 0.4, from: "edges" },   // from edges = dramatic
})
```

### 3. Sequence with Delay, Not setTimeout
```javascript
// BAD
setTimeout(() => animate(), 1000)

// GOOD
gsap.from(element, { opacity: 0, delay: 1.0 })

// BEST — use GSAP Timeline
gsap.timeline()
  .from(logo,     { scale: 0, duration: 0.5 })
  .from(subtitle, { opacity: 0, y: 16, duration: 0.4 }, "-=0.1")
  .from(button,   { opacity: 0, y: 16, duration: 0.4 }, "-=0.1")
```

### 4. SVG Elements are First-Class Citizens
Always add this CSS to SVG children before animating:
```css
.animated-svg-element {
  transform-box: fill-box;
  transform-origin: center;
}
```

### 5. GPU-Friendly Properties Only
```
✅ transform (translate, scale, rotate)
✅ opacity
❌ width, height, top, left, margin (cause layout thrash)
```

---

## Pattern Library

### PATTERN 1: SVG Shape Build-In
Reveals an SVG logo by having its pieces fly into position from scale:0.

**Best for:** Brand logos, icons, arch shapes, any SVG made of multiple elements.

```javascript
function buildAndReveal(svgId, delay = 0.15) {
  const svg = document.getElementById(svgId);
  if (!svg || !window.gsap) return;

  const shapes = [...svg.querySelectorAll("polygon, rect, circle, path")];
  gsap.from(shapes, {
    opacity: 0,
    scale: 0,
    duration: 0.5,
    stagger: { amount: 0.5, from: "center" },
    ease: "back.out(1.6)",
    delay,
  });
}
```

**Key parameters:**
- `from: "center"` → center pieces appear first (arch effect)
- `from: "edges"` → outer pieces appear first (dramatic frame)
- `from: "random"` → chaotic burst

---

### PATTERN 2: Split Text Entrance
Breaks text into individual characters/words and animates each independently.

**Best for:** Hero headlines, brand names, section titles.

```javascript
function splitTextReveal(selector, mode = "chars", delay = 0.5) {
  const el = document.querySelector(selector);
  if (!el || !window.gsap) return;

  const text = el.textContent.trim();
  const units = mode === "chars" ? [...text] : text.split(" ");

  el.innerHTML = units
    .map(u => `<span class="st-unit" style="display:inline-block">${u}</span>`)
    .join(mode === "words" ? " " : "");

  gsap.from(el.querySelectorAll(".st-unit"), {
    y: -55,
    opacity: 0,
    rotateX: 90,
    duration: 0.6,
    stagger: 0.07,
    ease: "back.out(1.7)",
    delay,
  });
}

// Usage:
// splitTextReveal("h1.hero-title", "chars", 0.7)   → letter by letter
// splitTextReveal(".section-name", "words", 0.3)   → word by word
```

**Variations:**
```javascript
// Slide up (subtle, elegant)
{ y: 20, opacity: 0, duration: 0.35, stagger: 0.07, ease: "power2.out" }

// Fall from above (dramatic)
{ y: -55, opacity: 0, rotateX: 90, duration: 0.6, stagger: 0.07, ease: "back.out(1.7)" }

// Scramble feel (without plugin) — stagger + blur
{ filter: "blur(8px)", opacity: 0, duration: 0.4, stagger: 0.04, ease: "power2.out" }
```

---

### PATTERN 3: Ember / Particle System
Creates floating glowing particles for fire, magic, or atmospheric effects.
Pure CSS + JS, no canvas needed.

**Best for:** Fire themes, dramatic dark backgrounds, fantasy/restaurant branding.

```javascript
function spawnParticles(containerId, options = {}) {
  const {
    color1 = "#FFD700", color2 = "#FF8C00", color3 = "rgba(255,69,0,.4)",
    minSize = 2, maxSize = 5,
    minDur = 2.5, maxDur = 5,
    spawnRate = 380,     // ms between spawns
    area = { left: 15, right: 85, bottom: 12, height: 28 }, // % of container
  } = options;

  const container = document.getElementById(containerId);
  if (!container) return;

  // Inject styles once
  if (!document.getElementById("particle-styles")) {
    const style = document.createElement("style");
    style.id = "particle-styles";
    style.textContent = `
      .spark {
        position: absolute; border-radius: 50%; pointer-events: none;
        background: radial-gradient(circle at 35% 35%, ${color1}, ${color2}, ${color3});
        box-shadow: 0 0 6px rgba(255,140,0,.5);
        animation: spark-rise var(--dur,3s) ease-out forwards;
      }
      @keyframes spark-rise {
        0%   { transform: translate(0,0) scale(1);    opacity: .85 }
        70%  { opacity: .4 }
        100% { transform: translate(var(--dx,20px),-240px) scale(.1); opacity: 0 }
      }
    `;
    document.head.appendChild(style);
  }

  function spawn() {
    if (container.style.display === "none") return;
    const el = document.createElement("div");
    el.className = "spark";
    const sz  = minSize + Math.random() * (maxSize - minSize);
    const dx  = (Math.random() - .5) * 90;
    const dur = minDur + Math.random() * (maxDur - minDur);
    el.style.cssText = [
      `left:${area.left + Math.random() * (area.right - area.left)}%`,
      `bottom:${area.bottom + Math.random() * area.height}%`,
      `width:${sz}px`, `height:${sz}px`,
      `--dx:${dx}px`, `--dur:${dur}s`,
      `animation-delay:${Math.random() * 1.2}s`,
    ].join(";");
    container.appendChild(el);
    setTimeout(() => el.remove(), (dur + 2) * 1000);
  }

  // Initial burst
  for (let i = 0; i < 14; i++) setTimeout(spawn, i * 150);

  // Continuous
  const iv = setInterval(() => {
    container.style.display === "none" ? clearInterval(iv) : spawn();
  }, spawnRate);

  return iv; // return interval ID so caller can stop it
}

// Usage:
// spawnParticles("landing", { color1: "#FFD700", color2: "#FF8C00" })
// spawnParticles("hero-section", { spawnRate: 200, minSize: 1, maxSize: 3 })
```

---

### PATTERN 4: Magnetic Button
Button that follows the cursor with elastic spring-back. Signature of premium sites.

**Best for:** Primary CTAs, "Enter" buttons, hero actions.

```javascript
function makeMagnetic(selector, strength = 0.28) {
  const btn = document.querySelector(selector);
  if (!btn || !window.gsap) return;

  btn.addEventListener("mousemove", e => {
    const r = btn.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width  / 2);
    const dy = e.clientY - (r.top  + r.height / 2);
    gsap.to(btn, {
      x: dx * strength, y: dy * strength,
      duration: 0.3, ease: "power3.out",
    });
  });

  btn.addEventListener("mouseleave", () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
  });
}

// Usage:
// makeMagnetic("#enter-btn", 0.28)
// makeMagnetic(".hero-cta", 0.35)
```

**Variations:**
```javascript
// Also rotate slightly
gsap.to(btn, {
  x: dx * 0.28, y: dy * 0.28,
  rotateX: -dy * 0.08, rotateY: dx * 0.08,
  duration: 0.3, ease: "power3.out",
});
```

---

### PATTERN 5: Cart / Fly-to-Target Animation
Item flies from source to destination (cart, wishlist, compare).

**Best for:** E-commerce add-to-cart, bookmark, collect interactions.

```javascript
function flyToTarget(sourceEl, targetId, emoji = "🍕") {
  if (!sourceEl || !window.gsap) return;
  const target = document.getElementById(targetId);
  if (!target) return;

  const src = sourceEl.getBoundingClientRect();
  const dst = target.getBoundingClientRect();

  const clone = document.createElement("div");
  clone.textContent = emoji;
  clone.style.cssText = [
    "position:fixed", "z-index:9999", "pointer-events:none",
    "font-size:1.3rem",
    `left:${src.left + src.width  / 2}px`,
    `top:${src.top  + src.height / 2}px`,
    "transform:translate(-50%,-50%)",
  ].join(";");
  document.body.appendChild(clone);

  gsap.to(clone, {
    x: dst.left - src.left + (dst.width  - src.width)  / 2,
    y: dst.top  - src.top  + (dst.height - src.height) / 2,
    scale: 0.15,
    opacity: 0,
    duration: 0.65,
    ease: "power2.in",
    onComplete: () => clone.remove(),
  });
}

// Usage:
// flyToTarget(document.getElementById("add-btn"), "cart-btn", "🛍️")
// flyToTarget(document.querySelector(".product-card"), "wishlist-icon", "❤️")
```

---

### PATTERN 6: Badge / Counter Bounce
Elastic pop when a counter badge updates.

**Best for:** Cart count, notification dot, unread badge.

```javascript
function bounceBadge(badgeId) {
  if (!window.gsap) return;
  requestAnimationFrame(() => {
    const badge = document.getElementById(badgeId);
    if (badge) {
      gsap.fromTo(badge,
        { scale: 1.9 },
        { scale: 1, ease: "elastic.out(1, 0.4)", duration: 0.6 }
      );
    }
  });
}

// Usage: call inside addItem() after updating the badge text
// bounceBadge("cart-count")
```

---

### PATTERN 7: ScrollTrigger Reveal (Stagger)
Elements enter the viewport with a staggered cascade.

**Best for:** Card grids, product lists, feature sections.

**Requires:** ScrollTrigger CDN
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
```

```javascript
function scrollReveal(containerSelector, childSelector, options = {}) {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const { delay = 0, stagger = 0.09, y = 36, duration = 0.5, start = "top 88%" } = options;

  const container = document.querySelector(containerSelector);
  if (!container) return;
  const children = container.querySelectorAll(childSelector);

  gsap.from(children, {
    opacity: 0, y,
    duration, stagger,
    ease: "power2.out",
    delay,
    scrollTrigger: { trigger: container, start },
  });
}

// Usage:
// scrollReveal(".emp-section", ".emp-card")
// scrollReveal(".products-grid", ".product-card", { stagger: 0.06, y: 50 })
// scrollReveal("#features", ".feature-item", { start: "top 75%", stagger: 0.12 })
```

---

### PATTERN 8: Section Entrance (Fade + Slide)
Animate an entire section when it enters the viewport.

```javascript
function sectionReveal(triggerSelector, childrenMap = []) {
  // childrenMap: [{ selector, y, delay, duration }]
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const defaults = { y: 30, delay: 0, duration: 0.6 };

  childrenMap.forEach(item => {
    const opts = { ...defaults, ...item };
    gsap.from(opts.selector, {
      opacity: 0, y: opts.y, duration: opts.duration, delay: opts.delay,
      ease: "power3.out",
      scrollTrigger: { trigger: triggerSelector, start: "top 80%" },
    });
  });
}

// Usage:
// sectionReveal(".hero-section", [
//   { selector: ".hero-title",    y: 40, delay: 0 },
//   { selector: ".hero-subtitle", y: 30, delay: 0.15 },
//   { selector: ".hero-cta",      y: 20, delay: 0.3 },
// ])
```

---

## Analysis Process (How to Use This Skill)

### Step 1 — Read the Page
Read the HTML file fully. Identify:
- What appears on first load (landing/hero section)
- What the user interacts with most (buttons, cards, navigation)
- Any SVG assets that can be animated
- Scroll-based sections below the fold

### Step 2 — Audit Current Animations
Check for:
- `animation:` CSS properties → replace with GSAP for control
- `transition:` CSS properties → keep for hover, enhance with GSAP for entrance
- Elements that just "appear" with no entrance → prime targets
- Text that isn't split → opportunity for split text reveal

### Step 3 — Prioritize by Impact
| Priority | Target | Pattern |
|---|---|---|
| 🔴 High | Logo / Hero entrance | SVG Build-In + Split Text |
| 🔴 High | Primary CTA button | Magnetic Button |
| 🟡 Medium | Background atmosphere | Particle System |
| 🟡 Medium | Product selection | Name Reveal on Change |
| 🟡 Medium | Add to cart | Fly-to-Target |
| 🟢 Low | Below-fold sections | ScrollTrigger Reveal |
| 🟢 Low | Notification badges | Badge Bounce |

### Step 4 — Check CDN Requirements
```html
<!-- Always include (core GSAP): -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>

<!-- Add for scroll animations: -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

<!-- Add for smooth scroll (optional, premium feel): -->
<script src="https://cdn.jsdelivr.net/npm/lenis@1/bundled/lenis.min.js"></script>
```

### Step 5 — Implement with Guard
Always guard GSAP calls:
```javascript
if (window.gsap) {
  // animations
}
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  // scroll animations
}
```

### Step 6 — SVG Preparation
Add this CSS to ANY SVG element you plan to animate:
```css
.my-svg-child {
  transform-box: fill-box;
  transform-origin: center;
}
```

### Step 7 — Verify in Browser
After implementing:
1. Start a local server (`python -m http.server 3333`)
2. Open in Chrome
3. Take screenshots mid-animation to verify the sequence
4. Test the full user journey: landing → action → feedback

---

## Timing Reference

| Animation type | Duration | Stagger | Ease |
|---|---|---|---|
| Logo letter reveal | 0.6s | 0.07s | `back.out(1.7)` |
| SVG shape build-in | 0.5s | 0.5s total | `back.out(1.6)` |
| Hero fade-in | 0.7s | — | `power3.out` |
| Scroll reveal | 0.5s | 0.09s | `power2.out` |
| Page transition exit | 0.9s | 0.18s total | `power3.in` |
| Magnetic return | 0.7s | — | `elastic.out(1, 0.4)` |
| Badge bounce | 0.6s | — | `elastic.out(1, 0.4)` |
| Cart fly | 0.65s | — | `power2.in` |
| Text word reveal | 0.32s | 0.07s | `power2.out` |

---

## Common Mistakes

### ❌ Animating layout properties
```javascript
// BAD — causes reflow
gsap.to(el, { width: "200px", left: "50px" })

// GOOD — GPU composited
gsap.to(el, { scaleX: 1.5, x: 50 })
```

### ❌ Forgetting transform-box on SVG
```javascript
// BUG — SVG scales from top-left corner
gsap.from(svgRect, { scale: 0 })

// FIX — add CSS first
// .svgRect { transform-box: fill-box; transform-origin: center; }
```

### ❌ Using JS setTimeout for sequencing
```javascript
// BAD
setTimeout(() => gsap.from(el, ...), 600)

// GOOD
gsap.from(el, { delay: 0.6, ... })
// or use gsap.timeline()
```

### ❌ Same animation on everything
Every element having the exact same `y: 30, opacity: 0` looks like a template.
Vary: direction (y, x, rotateX), scale range, duration, stagger direction.

### ❌ Animating while element is hidden by parent
If a parent has `opacity: 0` set by GSAP, child animations running simultaneously
won't be visible. Delay children until after parent reaches `opacity: 1`.

---

## Real Implementation Reference

See `examples/flame-pizzeria.js` for a complete working implementation of:
- SVG brick arch build-in animation
- FLAME brand split-text with rotateX
- Ember particle system
- Magnetic "Ver menú" button
- Cart fly-to-target animation
- Badge elastic bounce
- ScrollTrigger empanadas reveal
- Exit animation (bricks explode outward + flame fills screen)
