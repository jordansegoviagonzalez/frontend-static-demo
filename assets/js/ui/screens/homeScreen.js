export function renderHomeScreen(root) {
  root.innerHTML = `
    <section class="astro-screen astro-two-column">
      <div class="astro-card astro-flex-col">
        <header class="astro-screen-header">
          <div>
            <h1 class="astro-hero-heading">Your tiny cloud AI lab.</h1>
            <p class="astro-hero-subtitle">
              Astro Lite is a front-end–only AI playground. No installs, no backend —
              just a clean UI talking to a cloud model from your browser.
            </p>
          </div>
          <div class="astro-pill">Lite demo</div>
        </header>

        <div class="astro-flex-col" style="margin-top: 0.25rem; gap: 0.75rem;">
          <div class="astro-flex-row" style="flex-wrap: wrap;">
            <button class="astro-btn astro-btn-primary" data-home-login>Login</button>
            <button class="astro-btn astro-btn-secondary" data-home-register>Sign up</button>
            <button class="astro-btn astro-btn-secondary" data-home-guest>Try as guest</button>
          </div>
          <p style="font-size: 0.78rem; color: rgba(190,200,255,0.78); max-width: 28rem;">
            Lite mode uses your browser's local storage only. For real apps, plug Astro into
            a backend API and database — the UI stays the same.
          </p>
        </div>
      </div>

      <div class="astro-card astro-hero-orb-shell">
        <div class="astro-hero-orb"></div>
      </div>
    </section>
  `;

  const loginBtn = root.querySelector("[data-home-login]");
  const registerBtn = root.querySelector("[data-home-register]");
  const guestBtn = root.querySelector("[data-home-guest]");

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      window.location.hash = "#login";
    });
  }

  if (registerBtn) {
    registerBtn.addEventListener("click", () => {
      window.location.hash = "#register";
    });
  }

  if (guestBtn) {
    guestBtn.addEventListener("click", () => {
      window.location.hash = "#chat";
    });
  }
}
