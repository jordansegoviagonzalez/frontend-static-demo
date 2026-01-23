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
      
      // Start typing effect (Advanced HTML Typing)
      typeHtml(bubble, msg.text, container);
    } else {
      // Instant render with Markdown
      if (msg.type === 'limit') {
         bubble.innerHTML = msg.text; // Trust the text for this specific system type
      } else {
         bubble.innerHTML = parseMarkdown(msg.text);
      }
      row.appendChild(bubble);
      container.appendChild(row);
      newMessagesAdded = true;
    }
  });

  if (newMessagesAdded) {
    container.scrollTop = container.scrollHeight;
  }
}

/**
 * Types out HTML content node-by-node so users see formatted text appearing,
 * rather than raw Markdown syntax.
 */
async function typeHtml(targetElement, rawText, scrollContainer) {
  const html = parseMarkdown(rawText);
  
  // Create a virtual DOM to traverse
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  // Recursive typing function
  await typeNode(tempDiv, targetElement, scrollContainer);
}

async function typeNode(sourceNode, targetNode, scrollContainer) {
  const nodes = Array.from(sourceNode.childNodes);
  
  for (const node of nodes) {
    if (node.nodeType === 3) { 
      // TEXT NODE: Type characters one by one
      const text = node.textContent;
      for (let i = 0; i < text.length; i++) {
        targetNode.textContent += text[i];
        
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
        // Delay between chars (typing speed)
        await new Promise(r => setTimeout(r, 8)); 
      }
    } else if (node.nodeType === 1) {
      // ELEMENT NODE: Create the tag (e.g. <strong>) then recurse
      const element = node.cloneNode(false); // shallow clone (no children yet)
      targetNode.appendChild(element);
      
      // Recurse into children
      await typeNode(node, element, scrollContainer);
    }
  }
}
