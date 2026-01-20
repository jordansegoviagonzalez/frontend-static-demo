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

  // Global Copy Handler
  document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("astro-copy-btn")) {
      const btn = e.target;
      const code = decodeURIComponent(btn.getAttribute("data-code"));
      
      try {
        await navigator.clipboard.writeText(code);
        const originalText = btn.textContent;
        btn.textContent = "Copied!";
        btn.style.color = "#7af3ff";
        
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.color = "";
        }, 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
        btn.textContent = "Error";
      }
    }
  });
});
