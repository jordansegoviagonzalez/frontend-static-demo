export function bindChatInput(root, { onSend }) {
  const textarea = root.querySelector("[data-astro-input]");
  const button = root.querySelector("[data-astro-send]");
  if (!textarea || !button) return;

  function adjustHeight() {
    textarea.style.height = 'auto'; // Reset to recalculate
    textarea.style.height = Math.min(textarea.scrollHeight, 140) + 'px'; // Cap at 140px
  }

  function send() {
    const text = textarea.value.trim();
    if (!text) return;
    textarea.value = "";
    textarea.style.height = 'auto'; // Reset height after send
    onSend(text);
  }

  button.addEventListener("click", send);

  textarea.addEventListener("input", adjustHeight);

  textarea.addEventListener("keydown", (evt) => {
    if (evt.key === "Enter" && !evt.shiftKey) {
      evt.preventDefault();
      send();
    }
    // Small timeout to allow paste to update value before resizing
    setTimeout(adjustHeight, 0); 
  });
}
