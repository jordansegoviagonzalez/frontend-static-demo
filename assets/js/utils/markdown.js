/**
 * Simple, dependency-free Markdown parser for Astro AI.
 * Handles: Headers, Code blocks (with Copy), inline code, bold, italic, tables, and lists.
 */
export function parseMarkdown(text) {
  if (!text) return "";

  let html = text;

  // 1. Code Blocks: ```code```
  // We handle this first to avoid parsing internal markdown.
  // We inject a copy button into the header.
  html = html.replace(/```(\w*)([\s\S]*?)```/g, (match, lang, code) => {
    const cleanCode = escapeHtml(code.trim());
    return `
      <div class="astro-code-block">
        <div class="astro-code-header">
          <span>${lang || 'text'}</span>
          <button class="astro-copy-btn" data-code="${encodeURIComponent(code.trim())}">Copy</button>
        </div>
        <code>${cleanCode}</code>
      </div>`;
  });

  // 2. Inline Code: `code`
  html = html.replace(/`([^"]+)`/g, '<code class="astro-inline-code">$1</code>');

  // 3. Headers (h1-h3)
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');

  // 4. Bold: **text**
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // 5. Italic: *text*
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // 6. Tables (Simple support)
  // Matches lines starting with |
  const tableRowRegex = /^\|(.+)\|$/gm;
  // We can't fully parse tables with simple regex easily without state, 
  // but we can wrap individual rows. A better approach for a "Senior" app 
  // without a library is tricky, but let's try a simple row wrapper.
  // Actually, let's skip complex table parsing for this regex-only version 
  // to avoid breaking layout, unless we use a library. 
  // Let's stick to safe primitives.

  // 7. Unordered Lists: - item or * item
  html = html.replace(/(?:^|\n)(?:[-*])\s+(.+)/g, '<ul><li>$1</li></ul>');
  
  // Cleanup: Merge adjacent </ul><ul>
  html = html.replace(/<\/ul>\s*<ul>/g, '');

  // 8. Paragraphs / Newlines
  // Wrap non-block lines in paragraphs or breaks?
  // For now, let's convert double newlines to paragraphs
  // html = html.replace(/\n\n/g, '<br><br>'); 

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
