import { userService } from "../../core/userService.js";

export function renderProfileScreen(root) {
  const current = userService.getCurrentUser();

  root.innerHTML = `
    <section class="astro-screen astro-two-column">
      <div class="astro-card astro-flex-col">
        <header class="astro-screen-header">
          <div>
            <h2 class="astro-screen-title">Profile</h2>
            <p style="font-size: 0.82rem; color: rgba(190,200,255,0.8);">
              Update your display name for Astro Lite. Accounts here are demo-only and live
              in your browser storage.
            </p>
          </div>
        </header>

        <form class="astro-flex-col" data-profile-form>
          <div class="astro-field">
            <label class="astro-label" for="prof-name">Name</label>
            <input id="prof-name" name="name" class="astro-input" value="${current ? current.name : ""}" />
            <div class="astro-error-text" data-error-name></div>
          </div>

          <div class="astro-field">
            <label class="astro-label">Email</label>
            <input class="astro-input" value="${current ? current.email : "Guest"}" disabled />
          </div>

          <div class="astro-flex-row" style="flex-wrap: wrap;">
            <button type="submit" class="astro-btn astro-btn-primary">
              Save profile
            </button>
            <button type="button" class="astro-btn astro-btn-secondary" data-logout>
              Log out
            </button>
          </div>
        </form>
      </div>

      <div class="astro-card">
        <p style="font-size: 0.84rem; color: rgba(190,200,255,0.82);">
          In a full production system, this screen would connect to a user profile service
          and update records in your database. Astro Lite keeps the same structure but uses
          <code>localStorage</code> so you can deploy everything as a static app.
        </p>
      </div>
    </section>
  `;

  const form = root.querySelector("[data-profile-form]");
  const logoutBtn = root.querySelector("[data-logout]");
  const nameInput = root.querySelector("#prof-name");
  const nameError = root.querySelector("[data-error-name]");

  form.addEventListener("submit", (evt) => {
    evt.preventDefault();
    nameError.textContent = "";
    try {
      userService.updateProfile({ name: nameInput.value });
      window.alert("Profile updated.");
    } catch (err) {
      const errors = err.validationErrors || {};
      if (errors.name) nameError.textContent = errors.name;
    }
  });

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      userService.logout();
      window.location.hash = "#home";
    });
  }
}
