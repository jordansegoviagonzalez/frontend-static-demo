import { userService } from "../../core/userService.js";

export function renderLoginScreen(root) {
  let isRegisterMode = false;

  function render() {
    const title = isRegisterMode ? "Create an account" : "Sign in to Unlimited Intelligence.";
    const subTitle = isRegisterMode ? "Join us today" : "Welcome back";
    const actionBtnText = isRegisterMode ? "Sign Up" : "Sign In";
    const switchText = isRegisterMode ? "Already have an account?" : "Don’t have an account?";
    const switchLinkText = isRegisterMode ? "Sign in" : "Sign up";

    root.innerHTML = `
      <section class="astro-screen astro-two-column">
        <div class="astro-card astro-flex-col" style="max-width: 480px; width: 100%;">
          <header class="astro-screen-header">
            <div>
              <h2 class="astro-screen-title">${title}</h2>
              <p style="font-size: 0.82rem; color: rgba(190,200,255,0.8);">
                ${subTitle}
              </p>
            </div>
          </header>

          <div class="astro-flex-col" style="gap: 0.5rem; margin-bottom: 1rem;">
            <button class="astro-btn astro-btn-social" data-login-social="google">
              <span style="margin-right: 0.5rem;">G</span> ${isRegisterMode ? "Sign up" : "Sign in"} with Google
            </button>
            <button class="astro-btn astro-btn-social" data-login-social="apple">
              <span style="margin-right: 0.5rem;"></span> ${isRegisterMode ? "Sign up" : "Sign in"} with Apple
            </button>
            <button class="astro-btn astro-btn-social" data-login-social="microsoft">
              <span style="margin-right: 0.5rem;">M</span> ${isRegisterMode ? "Sign up" : "Sign in"} with Microsoft
            </button>
          </div>

          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; color: rgba(190,200,255,0.5); font-size: 0.75rem;">
            <div style="flex: 1; height: 1px; background: rgba(190,200,255,0.2);"></div>
            OR
            <div style="flex: 1; height: 1px; background: rgba(190,200,255,0.2);"></div>
          </div>

          <form class="astro-flex-col" data-auth-form>
            ${isRegisterMode ? `
            <div class="astro-field">
              <label class="astro-label" for="auth-name">Name</label>
              <input id="auth-name" name="name" class="astro-input" autocomplete="name" placeholder="Your Name" />
              <div class="astro-error-text" data-error-name></div>
            </div>` : ""}

            <div class="astro-field">
              <label class="astro-label" for="auth-email">Email</label>
              <input id="auth-email" name="email" type="email" class="astro-input" autocomplete="email" placeholder="name@example.com" />
              <div class="astro-error-text" data-error-email></div>
            </div>

            <div class="astro-field">
              <label class="astro-label" for="auth-password">Password</label>
              <input id="auth-password" name="password" type="password" class="astro-input" autocomplete="${isRegisterMode ? 'new-password' : 'current-password'}" placeholder="••••••••" />
              <div class="astro-error-text" data-error-password></div>
            </div>

            <button type="submit" class="astro-btn astro-btn-primary" style="width: 100%; margin-top: 0.5rem;">
              ${actionBtnText}
            </button>

            ${!isRegisterMode ? `
            <div style="text-align: center; margin-top: 0.5rem;">
              <button type="button" class="astro-nav-link" data-forgot-password style="font-size: 0.8rem;">Forgot Password?</button>
            </div>` : ""}

            <div style="text-align: center; margin-top: 1rem; font-size: 0.8rem; color: rgba(190,200,255,0.8);">
              ${switchText} <button type="button" class="astro-nav-link" data-switch-mode>${switchLinkText}</button>
            </div>
          </form>

          <div style="margin-top: 1.5rem; text-align: center; font-size: 0.7rem; color: rgba(190,200,255,0.5); line-height: 1.4;">
            By signing ${isRegisterMode ? "up" : "in"}, you agree to the <a href="#" style="color: rgba(190,200,255,0.7);">Terms of Service</a> and <a href="#" style="color: rgba(190,200,255,0.7);">Privacy Policy</a>.
          </div>
        </div>
      </section>
    `;

    bindEvents();
  }

  function bindEvents() {
    const form = root.querySelector("[data-auth-form]");
    const switchBtn = root.querySelector("[data-switch-mode]");
    const forgotBtn = root.querySelector("[data-forgot-password]");
    const socialBtns = root.querySelectorAll("[data-login-social]");

    const nameInput = root.querySelector("#auth-name");
    const emailInput = root.querySelector("#auth-email");
    const passwordInput = root.querySelector("#auth-password");
    
    const nameError = root.querySelector("[data-error-name]");
    const emailError = root.querySelector("[data-error-email]");
    const passwordError = root.querySelector("[data-error-password]");

    if (switchBtn) {
      switchBtn.addEventListener("click", () => {
        isRegisterMode = !isRegisterMode;
        render();
      });
    }

    if (forgotBtn) {
      forgotBtn.addEventListener("click", () => {
        alert("Forgot password flow would trigger here.");
      });
    }

    socialBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const provider = btn.getAttribute("data-login-social");
        alert(`Redirecting to ${provider} authentication...`);
      });
    });

    form.addEventListener("submit", async (evt) => {
      evt.preventDefault();
      if (nameError) nameError.textContent = "";
      emailError.textContent = "";
      passwordError.textContent = "";

      const email = emailInput.value;
      const password = passwordInput.value;
      const name = nameInput ? nameInput.value : null;

      try {
        if (isRegisterMode) {
          await userService.register({ name, email, password });
        } else {
          await userService.login({ email, password });
        }
        window.location.hash = "#chat";
      } catch (err) {
        const errors = err.validationErrors || {};
        if (isRegisterMode && errors.name && nameError) nameError.textContent = errors.name;
        if (errors.email) emailError.textContent = errors.email;
        if (errors.password) passwordError.textContent = errors.password;
        
        if (!errors.name && !errors.email && !errors.password) {
          // General error fallback
          if (emailError) emailError.textContent = err.message || "Authentication failed.";
        }
      }
    });
  }

  // Initial render
  render();
}
