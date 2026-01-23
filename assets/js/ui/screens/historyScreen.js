import { sessionService } from "../../core/sessionService.js";
import { userService } from "../../core/userService.js";

export function renderHistoryScreen(root) {
  // -- Auth Check --
  const currentUser = userService.getCurrentUser();
  if (!currentUser) {
    root.innerHTML = `
      <section class="astro-screen">
        <header class="astro-screen-header">
          <h2 class="astro-screen-title">History</h2>
        </header>
        <div class="astro-card" style="text-align: center; padding: 3rem 1rem;">
          <p style="font-size: 1.1rem; margin-bottom: 1.5rem; color: rgba(190,200,255,0.9);">
            Please sign in to view your chat history.
          </p>
          <button class="astro-btn astro-btn-primary" onclick="window.location.hash='#login'">
            Sign In
          </button>
        </div>
      </section>
    `;
    return;
  }
  // -- End Auth Check --

  const sessions = sessionService.getAllSessions();

  const listHtml = sessions.length === 0
    ? `<p style="font-size: 0.84rem; color: rgba(190,200,255,0.8);">
         No sessions yet. Start a new chat and it will appear here.
       </p>`
    : `<div class="astro-session-list" data-session-list></div>`;

  root.innerHTML = `
    <section class="astro-screen">
      <header class="astro-screen-header">
        <div>
          <h2 class="astro-screen-title">History</h2>
          <p style="font-size: 0.82rem; color: rgba(190,200,255,0.8);">
            Sessions are stored only in your browser.
          </p>
        </div>
        <button class="astro-btn astro-btn-primary" data-new-chat>New chat</button>
      </header>

      <div class="astro-card">
        ${listHtml}
      </div>
    </section>
  `;

  const listEl = root.querySelector("[data-session-list]");
  const newChatBtn = root.querySelector("[data-new-chat]");

  if (listEl && sessions.length > 0) {
    sessions.forEach(session => {
      const item = document.createElement("div");
      item.className = "astro-session-item";

      const metaWrap = document.createElement("div");
      const titleEl = document.createElement("div");
      titleEl.className = "astro-session-title";
      titleEl.textContent = session.title || "Untitled chat";

      const metaEl = document.createElement("div");
      metaEl.className = "astro-session-meta";
      const dt = session.updatedAt || session.createdAt;
      metaEl.textContent = new Date(dt).toLocaleString();

      metaWrap.appendChild(titleEl);
      metaWrap.appendChild(metaEl);

      const actions = document.createElement("div");
      actions.className = "astro-session-actions";

      const openBtn = document.createElement("button");
      openBtn.className = "astro-nav-link";
      openBtn.textContent = "Open";
      openBtn.addEventListener("click", (evt) => {
        evt.stopPropagation();
        window.location.hash = `#chat/${session.id}`;
      });

      const renameBtn = document.createElement("button");
      renameBtn.className = "astro-nav-link";
      renameBtn.textContent = "Rename";
      renameBtn.addEventListener("click", (evt) => {
        evt.stopPropagation();
        const next = window.prompt("New title:", session.title || "Untitled chat");
        if (!next) return;
        sessionService.renameSession(session.id, next);
        renderHistoryScreen(root);
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "astro-nav-link";
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", (evt) => {
        evt.stopPropagation();
        const ok = window.confirm("Delete this session? This cannot be undone.");
        if (!ok) return;
        sessionService.deleteSession(session.id);
        renderHistoryScreen(root);
      });

      actions.appendChild(openBtn);
      actions.appendChild(renameBtn);
      actions.appendChild(deleteBtn);

      item.appendChild(metaWrap);
      item.appendChild(actions);

      item.addEventListener("click", () => {
        window.location.hash = `#chat/${session.id}`;
      });

      listEl.appendChild(item);
    });
  }

  if (newChatBtn) {
    newChatBtn.addEventListener("click", () => {
      const session = sessionService.createSession({ title: "New chat" });
      window.location.hash = `#chat/${session.id}`;
    });
  }
}
