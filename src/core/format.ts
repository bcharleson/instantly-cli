/**
 * Convert plain text email body to Instantly-compatible HTML.
 *
 * Instantly renders email bodies as HTML. Plain text with \n newlines
 * will display as a single unbroken block in recipients' email clients.
 *
 * Conversion rules:
 * - Each line of text → <div>text</div>
 * - Blank lines → <div><br /></div>
 * - Template variables like {{first_name}} and spin syntax {{RANDOM|a|b}} pass through untouched
 *
 * @param text - Plain text email body
 * @returns HTML string safe for Instantly email rendering
 */
export function bodyToHtml(text: string): string {
  return text
    .trim()
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();
      return trimmed === '' ? '<div><br /></div>' : `<div>${trimmed}</div>`;
    })
    .join('');
}

/**
 * Returns true if the string appears to already contain HTML formatting.
 * Checks for common HTML tags used in email bodies.
 */
export function isHtml(text: string): boolean {
  return /<(div|p|br|table|tr|td|span|a|b|i|strong|em|h[1-6])\b/i.test(text);
}

/**
 * Auto-convert plain text to HTML if it doesn't already contain HTML.
 * Returns the original string unchanged if HTML is detected.
 */
export function ensureHtml(text: string): string {
  return isHtml(text) ? text : bodyToHtml(text);
}
