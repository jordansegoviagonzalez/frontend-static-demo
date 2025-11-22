import { userService } from "../../core/userService.js";

export function renderRegisterScreen(root) {
  root.innerHTML = `
    <section class="astro-screen astro-two-column">
      <div class="astro-card astro-flex-col">
        <header class="astro-screen-header">
          <div>
            <h2 class="astro-screen-title">Create an account</h2>
            <p style="font-size: 0.82rem; color: rgba(190,200,255,0.8);">
            This registration flow is part of a demo version of Astro AI. 
            It’s meant to show how the application will look and feel once the full product is finished. It does not create real accounts or store personal information.
            </p>
          </div>
        </header>

        <form class="astro-flex-col" data-register-form>
          <div class="astro-field">
            <label class="astro-label" for="reg-name">Name</label>
            <input id="reg-name" name="name" class="astro-input" autocomplete="name" />
            <div class="astro-error-text" data-error-name></div>
          </div>

          <div class="astro-field">
            <label class="astro-label" for="reg-email">Email</label>
            <input id="reg-email" name="email" type="email" class="astro-input" autocomplete="email" />
            <div class="astro-error-text" data-error-email></div>
          </div>

          <div class="astro-field">
            <label class="astro-label" for="reg-password">Password</label>
            <input id="reg-password" name="password" type="password" class="astro-input" autocomplete="new-password" />
            <div class="astro-error-text" data-error-password></div>
          </div>

          <button type="submit" class="astro-btn astro-btn-primary">
            Create account
          </button>

          <p style="font-size: 0.78rem; color: rgba(190,200,255,0.78); margin-top: 0.35rem;">
            Already have an account?
            <button type="button" class="astro-nav-link" data-register-login>Sign in</button>
          </p>
        </form>
      </div>

      <div class="astro-card">
        <p style="font-size: 0.84rem; color: rgba(190,200,255,0.82);">
          This registration screen is for demo purposes only. 
          Astro AI doesn’t create real accounts or store your personal data here — 
          it simply lets you try the chat UI and talk to the AI model. 
          Please avoid entering personal information.
        </p>
      </div>
    </section>
  `;

  const form = root.querySelector("[data-register-form]");
  const loginBtn = root.querySelector("[data-register-login]");

  const nameInput = root.querySelector("#reg-name");
  const emailInput = root.querySelector("#reg-email");
  const passwordInput = root.querySelector("#reg-password");

  const nameError = root.querySelector("[data-error-name]");
  const emailError = root.querySelector("[data-error-email]");
  const passwordError = root.querySelector("[data-error-password]");

  form.addEventListener("submit", (evt) => {
    evt.preventDefault();
    nameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";

    const name = nameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
      userService.register({ name, email, password });
      window.location.hash = "#chat";
    } catch (err) {
      const errors = err.validationErrors || {};
      if (errors.name) nameError.textContent = errors.name;
      if (errors.email) emailError.textContent = errors.email;
      if (errors.password) passwordError.textContent = errors.password;
    }
  });

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      window.location.hash = "#login";
    });
  }
}
