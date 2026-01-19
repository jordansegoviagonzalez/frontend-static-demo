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

  // Simple loading indicator if desired, or just keep previous screen until load
  // rootEl.innerHTML = '<div class="loading-spinner"></div>'; 

  switch (path) {
    case "home": {
      const { renderHomeScreen } = await import("./screens/homeScreen.js");
      rootEl.innerHTML = ""; 
      renderHomeScreen(rootEl);
      if (rootEl.firstElementChild) rootEl.firstElementChild.classList.add("astro-fade-in");
      break;
    }
    case "login": {
      const { renderLoginScreen } = await import("./screens/loginScreen.js");
      rootEl.innerHTML = "";
      renderLoginScreen(rootEl);
      if (rootEl.firstElementChild) rootEl.firstElementChild.classList.add("astro-fade-in");
      break;
    }
    case "register": {
      const { renderRegisterScreen } = await import("./screens/registerScreen.js");
      rootEl.innerHTML = "";
      renderRegisterScreen(rootEl);
      if (rootEl.firstElementChild) rootEl.firstElementChild.classList.add("astro-fade-in");
      break;
    }
    case "chat": {
      const { renderChatScreen } = await import("./screens/chatScreen.js");
      rootEl.innerHTML = "";
      renderChatScreen(rootEl, { sessionId: maybeId || null });
      if (rootEl.firstElementChild) rootEl.firstElementChild.classList.add("astro-fade-in");
      break;
    }
    case "history": {
      const { renderHistoryScreen } = await import("./screens/historyScreen.js");
      rootEl.innerHTML = "";
      renderHistoryScreen(rootEl);
      if (rootEl.firstElementChild) rootEl.firstElementChild.classList.add("astro-fade-in");
      break;
    }
    case "profile": {
      const { renderProfileScreen } = await import("./screens/profileScreen.js");
      rootEl.innerHTML = "";
      renderProfileScreen(rootEl);
      if (rootEl.firstElementChild) rootEl.firstElementChild.classList.add("astro-fade-in");
      break;
    }
    default: {
      const { renderHomeScreen } = await import("./screens/homeScreen.js");
      rootEl.innerHTML = "";
      renderHomeScreen(rootEl);
      if (rootEl.firstElementChild) rootEl.firstElementChild.classList.add("astro-fade-in");
      break;
    }
  }

  updateNavFromHash();
}

export function initRouter(root) {
  rootEl = root;
  window.addEventListener("hashchange", renderRoute);
  renderRoute();
}
