import { userService } from "../../core/userService.js";

export function renderLoginScreen(root) {
  root.innerHTML = `
    <section class="astro-screen astro-two-column">
      <div class="astro-card astro-flex-col">
        <header class="astro-screen-header">
          <div>
            <h2 class="astro-screen-title">Sign in</h2>
            <p style="font-size: 0.82rem; color: rgba(190,200,255,0.8);">
              Use a demo account stored in your browser only. No real backend, no passwords sent over the network.
            </p>
          </div>
        </header>

        <form class="astro-flex-col" data-login-form>
          <div class="astro-field">
            <label class="astro-label" for="login-email">Email</label>
            <input id="login-email" name="email" type="email" class="astro-input" autocomplete="email" />
            <div class="astro-error-text" data-error-email></div>
          </div>

          <div class="astro-field">
            <label class="astro-label" for="login-password">Password</label>
            <input id="login-password" name="password" type="password" class="astro-input" autocomplete="current-password" />
            <div class="astro-error-text" data-error-password></div>
          </div>

          <button type="submit" class="astro-btn astro-btn-primary">
            Continue
          </button>

          <button type="button" class="astro-btn astro-btn-secondary" data-login-guest>
            Continue as guest
          </button>

          <p style="font-size: 0.78rem; color: rgba(190,200,255,0.78); margin-top: 0.35rem;">
            New here?
            <button type="button" class="astro-nav-link" data-login-register>Sign up</button>
          </p>
        </form>
      </div>

      <div class="astro-card">
        <p style="font-size: 0.84rem; color: rgba(190,200,255,0.82);">
          This screen demonstrates a typical login flow but uses <code>localStorage</code> instead of a real
          authentication backend. In a production app, this front-end would talk to your auth API instead.
        </p>
      </div>
    </section>
  `;

  const form = root.querySelector("[data-login-form]");
  const guestBtn = root.querySelector("[data-login-guest]");
  const registerBtn = root.querySelector("[data-login-register]");

  const emailInput = root.querySelector("#login-email");
  const passwordInput = root.querySelector("#login-password");
  const emailError = root.querySelector("[data-error-email]");
  const passwordError = root.querySelector("[data-error-password]");

  form.addEventListener("submit", (evt) => {
    evt.preventDefault();
    emailError.textContent = "";
    passwordError.textContent = "";

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
      userService.login({ email, password });
      window.location.hash = "#chat";
    } catch (err) {
      const errors = err.validationErrors || {};
      if (errors.email) emailError.textContent = errors.email;
      if (errors.password) passwordError.textContent = errors.password;
      if (!errors.email && !errors.password) {
        emailError.textContent = "Invalid email or password.";
      }
    }
  });

  if (guestBtn) {
    guestBtn.addEventListener("click", () => {
      window.location.hash = "#chat";
    });
  }

  if (registerBtn) {
    registerBtn.addEventListener("click", () => {
      window.location.hash = "#register";
    });
  }
}
