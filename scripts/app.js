document.addEventListener("DOMContentLoaded", () => {
  // Theme Toggle
  const themeToggle = document.getElementById("themeToggle");
  const currentTheme = localStorage.getItem("theme") || "light";
  document.body.setAttribute("data-theme", currentTheme);
  const profileImg = document.querySelector(".profile-img");

  // Profile image error handling
  profileImg.onerror = function () {
    // FIXED: Changed path to be relative, not absolute
    this.src = "assets/images/fallback-profile.jpg";
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

  // Lazy Loading (Now used for QR codes in contact section)
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

  // REMOVED: Unused hover effect code that was adding event listeners for no reason.

  // Initialization
  document.querySelector("#home").classList.add("active-section");
});
