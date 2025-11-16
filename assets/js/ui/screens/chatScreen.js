import { chatService } from "../../core/chatService.js";
import { sessionService } from "../../core/sessionService.js";
import { renderChatMessages } from "../components/chatMessageList.js";
import { bindChatInput } from "../components/chatInputBar.js";
import { initThinkingIndicator, showThinking, hideThinking } from "../thinkingIndicator.js";

export function renderChatScreen(root, { sessionId } = {}) {
  const session = sessionService.getSessionById(sessionId) || sessionService.createSession({ title: "New chat" });

  root.innerHTML = `
    <section class="astro-screen">
      <header class="astro-screen-header">
        <div>
          <h2 class="astro-screen-title">Chat with Astro</h2>
          <p style="font-size: 0.82rem; color: rgba(190,200,255,0.8);">
            Messages in Astro Lite are stored in your browser only. Connect a real model in <code>config.js</code>
            to turn this into a live AI assistant.
          </p>
        </div>
        <button class="astro-btn astro-btn-secondary" data-open-history>History</button>
      </header>

      <div class="astro-card astro-chat-shell">
        <div class="astro-chat-messages" data-astro-messages></div>

        <div class="astro-thinking" data-astro-thinking>
          <div class="astro-orb-small"></div>
          <div class="astro-thinking-text" data-astro-thinking-text>Thinking</div>
        </div>

        <div class="astro-chat-input-row">
          <textarea
            class="astro-textarea"
            placeholder="Ask Astro anything..."
            data-astro-input
          ></textarea>
          <button class="astro-btn astro-btn-primary astro-chat-send-btn" data-astro-send>Send</button>
        </div>
      </div>
    </section>
  `;

  const messagesEl = root.querySelector("[data-astro-messages]");
  const historyBtn = root.querySelector("[data-open-history]");

  initThinkingIndicator(root);
  renderChatMessages(messagesEl, session.messages);

  bindChatInput(root, {
    onSend: async (text) => {
      renderChatMessages(messagesEl, [
        ...session.messages,
        { role: "user", text }
      ]);

      showThinking();
      try {
        const result = await chatService.sendMessage({ sessionId: session.id, userText: text });
        renderChatMessages(messagesEl, result.session.messages);
      } catch (err) {
        console.error(err);
        const errorMsg = {
          role: "assistant",
          text: "Astro ran into an error talking to the model. Check the console and your config.js settings.",
        };
        renderChatMessages(messagesEl, [...session.messages, errorMsg]);
      } finally {
        hideThinking();
      }
    }
  });

  if (historyBtn) {
    historyBtn.addEventListener("click", () => {
      window.location.hash = "#history";
    });
  }
}
