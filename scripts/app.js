// Theme Toggle
const themeToggle = document.getElementById("themeToggle");
const currentTheme = localStorage.getItem("theme") || "light";
document.body.setAttribute("data-theme", currentTheme);

themeToggle.addEventListener("click", () => {
  const newTheme =
    document.body.getAttribute("data-theme") === "dark" ? "light" : "dark";
  document.body.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const navBrand = document.querySelector('.nav-brand');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
        navBrand.style.opacity = '1';
    } else {
        navbar.classList.remove('scrolled');
        navBrand.style.opacity = '0';
    }
});

// Adjust section padding based on navbar height
window.addEventListener('load', () => {
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    document.documentElement.style.setProperty('--navbar-height', `${navbarHeight}px`);
});

// Progress Bar
window.addEventListener("scroll", () => {
  const winScroll =
    document.body.scrollTop || document.documentElement.scrollTop;
  const height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  document.querySelector(".progress-bar").style.width = `${scrolled}%`;
});

// Share Button (if present)
const shareButton = document.querySelector(".share-btn");
if (shareButton) {
  shareButton.addEventListener("click", async () => {
    try {
      await navigator.share({
        title: "Md. Iftekharul Islam - Portfolio",
        url: window.location.href,
      });
    } catch (err) {
      console.log("Sharing cancelled:", err);
    }
  });
}
