import { renderHomeScreen } from "./screens/homeScreen.js";
import { renderLoginScreen } from "./screens/loginScreen.js";
import { renderRegisterScreen } from "./screens/registerScreen.js";
import { renderChatScreen } from "./screens/chatScreen.js";
import { renderHistoryScreen } from "./screens/historyScreen.js";
import { renderProfileScreen } from "./screens/profileScreen.js";

let rootEl = null;

function normalizeHash(hash) {
  if (!hash) return "#home";
  if (hash === "#") return "#home";
  return hash;
}

export function updateNavFromHash() {
  const hash = normalizeHash(window.location.hash);
  const buttons = document.querySelectorAll(".astro-nav-link");
  buttons.forEach(btn => {
    const target = btn.getAttribute("data-nav-target");
    if (target === hash) {
      btn.classList.add("is-active");
    } else {
      btn.classList.remove("is-active");
    }
  });
}

function renderRoute() {
  if (!rootEl) return;
  const hash = normalizeHash(window.location.hash);
  const [path, maybeId] = hash.slice(1).split("/"); // remove '#'

  rootEl.innerHTML = "";

  switch (path) {
    case "home":
      renderHomeScreen(rootEl);
      break;
    case "login":
      renderLoginScreen(rootEl);
      break;
    case "register":
      renderRegisterScreen(rootEl);
      break;
    case "chat":
      renderChatScreen(rootEl, { sessionId: maybeId || null });
      break;
    case "history":
      renderHistoryScreen(rootEl);
      break;
    case "profile":
      renderProfileScreen(rootEl);
      break;
    default:
      renderHomeScreen(rootEl);
      break;
  }

  updateNavFromHash();
}

export function initRouter(root) {
  rootEl = root;
  window.addEventListener("hashchange", renderRoute);
  renderRoute();
}
