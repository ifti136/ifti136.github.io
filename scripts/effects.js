/* Small interaction helpers: theme, nav, progress bar, tilt. No dependencies. */

const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = () => matchMedia("(hover: hover) and (pointer: fine)").matches;

export function initTheme() {
  const root = document.documentElement;
  const button = document.getElementById("themeToggle");
  if (!button) return;
  button.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch (e) {
      /* storage can be blocked; the theme still changes for this visit */
    }
    window.dispatchEvent(new CustomEvent("themechange"));
  });
}

export function initNav() {
  const toggle = document.getElementById("menuToggle");
  const links = document.getElementById("nav-links");
  const bar = document.querySelector(".nav__bar");
  if (!toggle || !links) return;

  const setOpen = (open) => {
    links.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    toggle.firstElementChild.className = open ? "fa-solid fa-xmark" : "fa-solid fa-bars";
  };

  toggle.addEventListener("click", () => setOpen(!links.classList.contains("is-open")));
  links.addEventListener("click", (e) => e.target.closest("a") && setOpen(false));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setOpen(false));
  document.addEventListener("click", (e) => !bar.contains(e.target) && setOpen(false));

  /* Highlight the link for the section that crosses the middle of the screen. */
  const anchors = [...links.querySelectorAll("a[data-section]")];
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        anchors.forEach((a) => a.classList.toggle("is-active", a.dataset.section === entry.target.id));
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  document.querySelectorAll("main > section").forEach((s) => observer.observe(s));
}

export function initProgress() {
  const bar = document.getElementById("progress");
  if (!bar) return;
  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
    ticking = false;
  };
  addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
  update();
}

/* Draws each section's accent rule the first time its heading scrolls into view. */
export function initHeadings() {
  const heads = document.querySelectorAll(".section__head");
  if (!("IntersectionObserver" in window)) {
    heads.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
    { rootMargin: "0px 0px -15% 0px" }
  );
  heads.forEach((el) => observer.observe(el));
}

/* Tilts an element toward the pointer and moves a soft highlight with it. */
export function initTilt() {
  if (reduceMotion() || !finePointer()) return;
  document.querySelectorAll("[data-tilt]").forEach((el) => {
    const max = parseFloat(el.dataset.tiltMax || "5");
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.style.setProperty("--rx", `${((0.5 - py) * max * 2).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${((px - 0.5) * max * 2).toFixed(2)}deg`);
      el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
    });
    el.addEventListener("pointerleave", () => {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    });
  });
}
