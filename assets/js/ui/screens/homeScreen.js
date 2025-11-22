export function renderHomeScreen(root, appState) {
  root.innerHTML = `
    <section class="astro-home">
      <div class="astro-home-inner">

        <div class="astro-home-hero">
          <div class="astro-home-label-row">
            <span class="astro-pill astro-pill-demo">DEMO</span>
          </div>

          <h1 class="astro-home-title">
            WELCOME TO ASTRO AI
          </h1>

          <p class="astro-home-subtitle">
            A Lite demo from our line of AI models you can use straight from your browser.
            
          </p>

          <div class="astro-home-actions">
            <button class="astro-btn astro-btn-primary" data-home-login>
              Login
            </button>
            <button class="astro-btn astro-btn-secondary" data-home-signup>
              Sign up
            </button>
            <button class="astro-btn astro-btn-ghost" data-home-guest>
              Try as guest
            </button>
          </div>

          <p class="astro-home-footnote">
            The purpose of this app is to let you try the chat UI and talk directly to the AI model. 
      
          </p>
          <p class="astro-home-footnote">
            This demo stores everything in your personal browser only for you. 
      
          </p>
        </div>
        Please be mindful of your personal information and avoid saving any sensitive details in your Astro AI history.

        <div class="astro-home-visual">
          <div class="astro-logo-shell">
            <img
              src="assets/img/ASTROAI.png"
              alt="Astro AI logo"
              class="astro-logo"
            />
          </div>
          
        </div>

      </div>
    </section>
  `;

  const loginBtn = root.querySelector("[data-home-login]");
  const signupBtn = root.querySelector("[data-home-signup]");
  const guestBtn = root.querySelector("[data-home-guest]");

  // We let the router do its job by changing the hash.
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