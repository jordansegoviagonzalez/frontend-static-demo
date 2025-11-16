import { initRouter, updateNavFromHash } from "./router.js";

function bindNavButtons() {
  const buttons = document.querySelectorAll("[data-nav-target]");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-nav-target") || "#home";
      window.location.hash = target;
    });
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("app-root");
  bindNavButtons();
  initRouter(root);

  if (!window.location.hash) {
    window.location.hash = "#home";
  } else {
    updateNavFromHash();
  }
});
