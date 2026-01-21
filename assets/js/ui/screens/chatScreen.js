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
        <div class="astro-model-selector-wrapper">
          <button class="astro-model-trigger" data-model-trigger>
            <span class="astro-model-name" data-current-model-name>Astro Beta</span>
            <svg class="astro-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          
          <div class="astro-model-dropdown" hidden data-model-dropdown>
            <button class="astro-model-option active" data-model-id="gemma-2b">
              <div class="astro-opt-row">
                <span>Astro Beta</span>
                <span class="astro-tag">Free</span>
              </div>
              <span class="astro-opt-desc">Great for everyday tasks. Fast.</span>
            </button>
            
            <button class="astro-model-option" data-model-id="gpt-4" disabled>
              <div class="astro-opt-row">
                <span>Astro Pro</span>
                <svg class="astro-lock-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <span class="astro-opt-desc">Complex reasoning & coding. Upgrade to unlock.</span>
            </button>
          </div>
        </div>
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
            spellcheck="true"
            autocorrect="on"
            autocapitalize="sentences"
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

  // -- Model Selector Logic --
  const trigger = root.querySelector("[data-model-trigger]");
  const dropdown = root.querySelector("[data-model-dropdown]");
  
  if (trigger && dropdown) {
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.hidden = !dropdown.hidden;
    });

    document.addEventListener("click", (e) => {
      if (!dropdown.hidden && !trigger.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.hidden = true;
      }
    });
  }
  // -- End Model Selector Logic --

  bindChatInput(root, {
    onSend: async (text) => {
      // Generate ID upfront to prevent double-rendering (optimistic vs real)
      const tempId = Math.random().toString(36).slice(2) + Date.now().toString(36);
      
      renderChatMessages(messagesEl, [
        ...session.messages,
        { role: "user", text, id: tempId }
      ]);

      showThinking();
      try {
        const result = await chatService.sendMessage({ 
          sessionId: session.id, 
          userText: text,
          userMessageId: tempId 
        });
        // Pass streamId to trigger the typing animation for the new AI message
        renderChatMessages(messagesEl, result.session.messages, { streamId: result.reply.id });
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
