import { parseMarkdown } from "../../utils/markdown.js";

export function renderChatMessages(container, messages, { streamId } = {}) {
  // 1. Handle Empty State
  if (!Array.isArray(messages) || messages.length === 0) {
    if (container.children.length === 0) {
      const empty = document.createElement("div");
      empty.id = "astro-empty-state";
      empty.style.fontSize = "0.84rem";
      empty.style.color = "rgba(190, 200, 255, 0.75)";
      empty.textContent = "Ask Astro anything to start a new conversation.";
      container.appendChild(empty);
    }
    return;
  }

  const emptyState = document.getElementById("astro-empty-state");
  if (emptyState) emptyState.remove();

  let newMessagesAdded = false;

  messages.forEach(msg => {
    // Check if message already exists
    const existingMsg = container.querySelector(`[data-msg-id="${msg.id}"]`);
    if (existingMsg) return;

    const row = document.createElement("div");
    row.className = `astro-msg-row ${msg.role === "user" ? "user" : "assistant"}`;
    row.setAttribute("data-msg-id", msg.id);

    const bubble = document.createElement("div");
    bubble.className = `astro-msg-bubble ${msg.role === "user" ? "user" : "assistant"}`;

    // Typing Logic
    if (msg.id === streamId) {
      bubble.textContent = ""; // Start empty
      row.appendChild(bubble);
      container.appendChild(row);
      newMessagesAdded = true;
      
      // Start typing effect
      typeText(bubble, msg.text, container);
    } else {
      // Instant render with Markdown
      bubble.innerHTML = parseMarkdown(msg.text);
      row.appendChild(bubble);
      container.appendChild(row);
      newMessagesAdded = true;
    }
  });

  if (newMessagesAdded) {
    container.scrollTop = container.scrollHeight;
  }
}

function typeText(element, text, scrollContainer) {
  let index = 0;
  // Faster typing: 10ms per char
  const interval = setInterval(() => {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      // Auto-scroll while typing
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    } else {
      clearInterval(interval);
      // Finalize: Convert to Markdown once typing is done
      element.innerHTML = parseMarkdown(text);
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, 10);
}
