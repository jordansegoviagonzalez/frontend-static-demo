export function bindChatInput(root, { onSend }) {
  const textarea = root.querySelector("[data-astro-input]");
  const button = root.querySelector("[data-astro-send]");
  if (!textarea || !button) return;

  function send() {
    const text = textarea.value.trim();
    if (!text) return;
    textarea.value = "";
    onSend(text);
  }

  button.addEventListener("click", send);

  textarea.addEventListener("keydown", (evt) => {
    if (evt.key === "Enter" && !evt.shiftKey) {
      evt.preventDefault();
      send();
    }
  });
}
