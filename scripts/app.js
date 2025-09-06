document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const navLinks = document.querySelector(".nav-links");
  const profileImg = document.querySelector(".profile-img");
  const sections = document.querySelectorAll("section");
  const navAnchors = document.querySelectorAll(".nav-links a");

  // 1. Theme Toggle
  const currentTheme = localStorage.getItem("theme") || "light";
  document.body.setAttribute("data-theme", currentTheme);

  themeToggle.addEventListener("click", () => {
    const newTheme =
      document.body.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  });

  // 2. Mobile Menu Toggle
  mobileMenuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    const icon = mobileMenuToggle.querySelector("i");
    icon.classList.toggle("fa-bars");
    icon.classList.toggle("fa-xmark");
  });

  // 3. Close mobile menu when a link is clicked
  navAnchors.forEach(link => {
      link.addEventListener('click', () => {
          if (navLinks.classList.contains('open')) {
              navLinks.classList.remove('open');
              const icon = mobileMenuToggle.querySelector("i");
              icon.classList.add("fa-bars");
              icon.classList.remove("fa-xmark");
          }
      });
  });

  // 4. Active Link Highlighting on Scroll
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5, // Section is 50% in view
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navAnchors.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    observer.observe(section);
  });
  
  // 5. Profile image error handling
  profileImg.onerror = function () {
    this.src = "assets/images/fallback-profile.jpg";
    this.alt = "Missing profile image";
  };
  
  // 6. Lazy Loading for QR codes
  const lazyImages = [].slice.call(document.querySelectorAll(".lazy-load"));
  if ("IntersectionObserver" in window) {
    let lazyImageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.classList.remove("lazy-load");
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });
    lazyImages.forEach((lazyImage) => {
      lazyImageObserver.observe(lazyImage);
    });
  }
});
