// Theme Toggle
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Progress Bar
window.addEventListener("scroll", () => {
  const winScroll =
    document.body.scrollTop || document.documentElement.scrollTop;
  const height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  document.querySelector(".progress-bar").style.width = scrolled + "%";
});

// Share Button
document.querySelector(".share-btn").addEventListener("click", () => {
  if (navigator.share) {
    navigator.share({
      title: "Md. Iftekharul Islam - Social Hub",
      url: window.location.href,
    });
  } else {
    alert("Web Share API not supported in your browser");
  }
});
