/**
 * Simple, dependency-free Markdown parser for Astro AI.
 * Handles: Code blocks, inline code, bold, italic, and bullet lists.
 */
export function parseMarkdown(text) {
  if (!text) return "";

  // 1. Code Blocks: ```code```
  // We handle this first to avoid parsing internal markdown
  let html = text.replace(/```(\w*)([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre class="astro-code-block"><div class="astro-code-header">${lang || 'code'}</div><code>${escapeHtml(code.trim())}</code></pre>`;
  });

  // 2. Inline Code: `code`
  html = html.replace(/`([^"]+)`/g, '<code class="astro-inline-code">$1</code>');

  // 3. Bold: **text**
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // 4. Italic: *text*
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // 5. Unordered Lists: - item or * item
  // We use a simple regex to wrap lines starting with - or * in <li>
  // Note: This is a basic implementation. Nested lists aren't supported.
  html = html.replace(/(?:^|\n)(?:[-*])\s+(.+)/g, '<ul><li>$1</li></ul>');
  
  // Cleanup: Merge adjacent </ul><ul> to fix list spacing
  html = html.replace(/<\/ul>\s*<ul>/g, '');

  // 6. Line breaks (convert remaining newlines to <br>, but not inside <pre>)
  // This is tricky with regex alone. A safer bet for now is to trust the layout or uses CSS whitespace.
  // But let's simple replace \n with <br> ONLY if not inside pre tags.
  // For simplicity in this "Senior" MVP, we'll rely on CSS `white-space: pre-wrap` for the main text,
  // but since we are inserting HTML tags, we should probably default to formatting.
  
  // Let's replace \n with <br> for non-list/non-code areas? 
  // actually, let's just let CSS handle the wrapping for now, except for the explicit lists.
  
  return html;
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
