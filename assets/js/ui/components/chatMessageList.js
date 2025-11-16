export function renderChatMessages(container, messages) {
  container.innerHTML = "";
  if (!Array.isArray(messages) || messages.length === 0) {
    const empty = document.createElement("div");
    empty.style.fontSize = "0.84rem";
    empty.style.color = "rgba(190, 200, 255, 0.75)";
    empty.textContent = "Ask Astro anything to start a new conversation.";
    container.appendChild(empty);
    return;
  }

  messages.forEach(msg => {
    const row = document.createElement("div");
    row.className = `astro-msg-row ${msg.role === "user" ? "user" : "assistant"}`;

    const bubble = document.createElement("div");
    bubble.className = `astro-msg-bubble ${msg.role === "user" ? "user" : "assistant"}`;
    bubble.textContent = msg.text;

    row.appendChild(bubble);
    container.appendChild(row);
  });

  container.scrollTop = container.scrollHeight;
}
