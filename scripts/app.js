document.addEventListener("DOMContentLoaded", () => {
  // Theme Toggle
  const themeToggle = document.getElementById("themeToggle");
  const currentTheme = localStorage.getItem("theme") || "light";
  document.body.setAttribute("data-theme", currentTheme);
  const profileImg = document.querySelector(".profile-img");

  // Profile image error handling
  profileImg.onerror = function () {
    this.src = "/assets/images/fallback-profile.jpg";
    this.alt = "Missing profile image";
  };

  themeToggle.addEventListener("click", () => {
    const newTheme =
      document.body.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  });

  // Section Transitions
  document.querySelectorAll(".section-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = btn.classList.contains("home_link")
        ? "#home"
        : btn.classList.contains("projects_link")
        ? "#projects"
        : btn.classList.contains("skills_link")
        ? "#skills"
        : "#contact";

      const targetSection = document.querySelector(targetId);
      const currentSection = document.querySelector(".active-section");

      if (targetSection && targetSection !== currentSection) {
        // Add exit animation to current section
        currentSection.classList.add("exit-section");

        // After exit animation completes
        setTimeout(() => {
          currentSection.classList.remove("active-section", "exit-section");
          targetSection.classList.add("active-section");

          // Reset animations for grid items
          const gridItems = targetSection.querySelectorAll(
            ".projects-grid > *, .skills-grid > *, .social-container > *"
          );
          gridItems.forEach((item) => {
            item.style.animation = "none";
            item.offsetHeight; // Trigger reflow
            item.style.animation = "";
          });
        }, 500); // Match this with your exit animation duration
      }
    });
  });

  // Lazy Loading
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

  // Hover Effects
  function addHoverEffects() {
    document.querySelectorAll(".project-card, .skill-item").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--x", `${x}px`);
        card.style.setProperty("--y", `${y}px`);
      });
    });
  }
  addHoverEffects();

  // Initialization
  document.querySelector("#home").classList.add("active-section");
});
