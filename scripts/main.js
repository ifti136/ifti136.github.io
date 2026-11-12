import { renderSite } from "./render.js";
import { initTheme, initNav, initProgress, initHeadings, initTilt } from "./effects.js";

async function loadContent() {
  const response = await fetch("data/content.json", { cache: "no-cache" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

function showError(error) {
  console.error(error);
  const main = document.getElementById("site-main");
  const box = document.createElement("div");
  box.className = "container load-error";
  const title = document.createElement("h1");
  title.textContent = "The page content could not be loaded";
  const text = document.createElement("p");
  text.textContent =
    "Check that data/content.json is valid JSON. If you opened index.html straight from your files, run a local server instead (for example: python -m http.server) because browsers block loading data from file:// pages.";
  const detail = document.createElement("pre");
  detail.textContent = String(error && error.message ? error.message : error);
  box.append(title, text, detail);
  main.replaceChildren(box);
}

async function start() {
  let data;
  try {
    data = await loadContent();
    renderSite(data);
  } catch (error) {
    showError(error);
    return;
  }

  initTheme();
  initNav();
  initProgress();
  initHeadings();
  initTilt();

  /* The 3D background is optional: load it after the page is usable. */
  try {
    const { startScene } = await import("./scene.js");
    const canvas = document.getElementById("scene");
    if (canvas && startScene(canvas)) document.body.classList.add("has-scene");
  } catch (error) {
    console.warn("3D background unavailable:", error);
  }

  /* Jump to the section named in the URL once content exists. */
  if (location.hash) {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) target.scrollIntoView();
  }
}

start();
