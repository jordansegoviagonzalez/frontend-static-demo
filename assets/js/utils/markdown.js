/**
 * Simple, dependency-free Markdown parser for Astro AI.
 * Handles: Headers, Code blocks (with Copy), inline code, bold, italic, tables, and lists.
 */
export function parseMarkdown(text) {
  if (!text) return "";

  let html = text;
  const codeBlocks = [];

  // 1. Extract Code Blocks (```...```) to protect them from processing/escaping
  html = html.replace(/```(\w*)([\s\S]*?)```/g, (match, lang, code) => {
    // Save the block
    codeBlocks.push({ lang, code });
    // Return a placeholder
    return `%%%CODEBLOCK_${codeBlocks.length - 1}%%%`;
  });

  // 2. Escape HTML in the rest of the text (The Security Fix)
  // This defangs any <script> tags or other HTML outside of code blocks.
  html = escapeHtml(html);

  // 3. Apply Markdown Formatting (on the safe text)
  
  // Inline Code: `code`
  html = html.replace(/`([^"]+)`/g, '<code class="astro-inline-code">$1</code>');

  // Headers (h1-h3)
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');

  // Bold: **text**
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Italic: *text*
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Lists: - item or * item
  html = html.replace(/(?:^|\n)(?:[-*])\s+(.+)/g, '<ul><li>$1</li></ul>');
  html = html.replace(/<\/ul>\s*<ul>/g, ''); // Merge lists

  // 4. Restore Code Blocks (Safely)
  html = html.replace(/%%%CODEBLOCK_(\d+)%%%/g, (match, index) => {
    const block = codeBlocks[index];
    const cleanCode = escapeHtml(block.code.trim()); // Ensure code content is also escaped for display
    return `
      <div class="astro-code-block">
        <div class="astro-code-header">
          <span>${block.lang || 'text'}</span>
          <button class="astro-copy-btn" data-code="${encodeURIComponent(block.code.trim())}">Copy</button>
        </div>
        <code>${cleanCode}</code>
      </div>`;
  });

  // Convert newlines to breaks for non-block content (optional polish)
  // html = html.replace(/\n/g, '<br>');

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
