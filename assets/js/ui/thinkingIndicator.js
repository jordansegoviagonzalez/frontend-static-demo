let container = null;
let textEl = null;
let baseText = "Thinking";
let dotCount = 0;
let timerId = null;

export function initThinkingIndicator(root) {
  // Called from chat screen when it renders.
  container = root.querySelector("[data-astro-thinking]");
  textEl = container ? container.querySelector("[data-astro-thinking-text]") : null;
}

export function showThinking() {
  if (!container || !textEl) return;
  container.classList.add("is-visible");
  if (timerId !== null) return;
  timerId = window.setInterval(() => {
    dotCount = (dotCount + 1) % 4;
    textEl.textContent = baseText + ".".repeat(dotCount);
  }, 400);
}

export function hideThinking() {
  if (!container || !textEl) return;
  container.classList.remove("is-visible");
  if (timerId !== null) {
    window.clearInterval(timerId);
    timerId = null;
  }
  textEl.textContent = baseText;
}
