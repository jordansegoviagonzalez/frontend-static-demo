export function renderHomeScreen(root, appState) {
  root.innerHTML = `
    <section class="astro-screen astro-hero-screen">
      <div class="astro-hero-content">
        <img src="assets/img/ASTROAI.png" class="astro-hero-logo" alt="Astro AI Astronaut" />

        <div class="astro-pill-row">
          <span class="astro-pill">Public Beta</span>
        </div>

      <p style="font-size: 1.1rem; color: rgba(190,200,255,0.7); max-width: 500px; margin: 0 auto;">
        Secure. Private. Enterprise AI.
      </p>

        <div class="astro-hero-actions">
          <button class="astro-btn astro-btn-primary astro-btn-lg" data-home-guest>
            Start Chatting
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </button>
          <div class="astro-auth-links">
            <button class="astro-link-btn" data-home-login>Login</button>
            <span class="astro-divider">·</span>
            <button class="astro-link-btn" data-home-signup>Sign up</button>
          </div>
        </div>

        <div class="astro-hero-footnote">
          <p>
            Enterprise-grade security. 
            <br>Your data remains private and encrypted.
          </p>
        </div>
      </div>
    </section>
  `;

  const loginBtn = root.querySelector("[data-home-login]");
  const signupBtn = root.querySelector("[data-home-signup]");
  const guestBtn = root.querySelector("[data-home-guest]");

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      window.location.hash = "#login";
    });
  }

  if (signupBtn) {
    signupBtn.addEventListener("click", () => {
      window.location.hash = "#register";
    });
  }

  if (guestBtn) {
    guestBtn.addEventListener("click", () => {
      window.location.hash = "#chat";
    });
  }
}