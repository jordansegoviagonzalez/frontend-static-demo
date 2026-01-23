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

async function renderRoute() {
  if (!rootEl) return;
  const hash = normalizeHash(window.location.hash);
  const [path, maybeId] = hash.slice(1).split("/"); // remove '#'

  // 1. Start loading the module immediately (Parallel)
  let loadPromise = null;
  switch (path) {
    case "home":
      loadPromise = import("./screens/homeScreen.js").then(m => () => m.renderHomeScreen(rootEl));
      break;
    case "login":
      loadPromise = import("./screens/loginScreen.js").then(m => () => m.renderLoginScreen(rootEl));
      break;
    case "chat":
      loadPromise = import("./screens/chatScreen.js").then(m => () => m.renderChatScreen(rootEl, { sessionId: maybeId || null }));
      break;
    case "history":
      loadPromise = import("./screens/historyScreen.js").then(m => () => m.renderHistoryScreen(rootEl));
      break;
    case "profile":
      loadPromise = import("./screens/profileScreen.js").then(m => () => m.renderProfileScreen(rootEl));
      break;
    default:
      loadPromise = import("./screens/homeScreen.js").then(m => () => m.renderHomeScreen(rootEl));
      break;
  }

  // 2. Exit Animation
  const currentScreen = rootEl.firstElementChild;
  if (currentScreen) {
    currentScreen.classList.remove("astro-fade-in");
    currentScreen.classList.add("astro-fade-out");
    // Wait for animation (250ms matches CSS)
    await new Promise(resolve => setTimeout(resolve, 240));
  }

  // 3. Await the renderer (should be ready by now)
  const renderer = await loadPromise;

  // 4. Swap Content
  rootEl.innerHTML = "";
  if (renderer) renderer();

  // 5. Enter Animation
  if (rootEl.firstElementChild) {
    rootEl.firstElementChild.classList.add("astro-fade-in");
  }

  updateNavFromHash();
}

export function initRouter(root) {
  rootEl = root;
  window.addEventListener("hashchange", renderRoute);
  renderRoute();
}
