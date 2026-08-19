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

/**
 * Instantly campaign/subsequence variant `body` normalizer.
 *
 * Official create-campaign docs: variant body is "Email body HTML. Use
 * `<br/>` tags for delivered email line breaks." Plain `\n` in JSON is
 * collapsed into a run-on paragraph in the sent email.
 *
 * - Already-HTML bodies (`<br`, `<p`, `<div`, …) are left unchanged.
 * - Plain text: normalize `\r\n`/`\r`/`\n`, turn `\n\n` into `</p><p>`,
 *   `\n` into `<br/>`, wrap in `<p>…</p>`.
 */
export function normalizeInstantlyBody(text: string): string {
  if (isHtml(text)) return text;

  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const trimmed = normalized.replace(/^\n+|\n+$/g, '');
  if (!trimmed) return text;

  const html = trimmed
    .split(/\n\n+/)
    .map((paragraph) => paragraph.split('\n').join('<br/>'))
    .join('</p><p>');

  return `<p>${html}</p>`;
}

/**
 * Walk Instantly `sequences[].steps[].variants[].body` (same `body` key the
 * API already uses). Skipped when `textOnly` is true.
 */
export function normalizeSequenceBodies(
  sequences: unknown,
  textOnly = false,
): unknown {
  if (textOnly || !Array.isArray(sequences)) return sequences;

  return sequences.map((sequence) => {
    if (!sequence || typeof sequence !== 'object') return sequence;
    const next = { ...(sequence as Record<string, unknown>) };
    if (!Array.isArray(next.steps)) return next;

    next.steps = next.steps.map((step) => {
      if (!step || typeof step !== 'object') return step;
      const nextStep = { ...(step as Record<string, unknown>) };
      if (typeof nextStep.body === 'string') {
        nextStep.body = normalizeInstantlyBody(nextStep.body);
      }
      if (Array.isArray(nextStep.variants)) {
        nextStep.variants = nextStep.variants.map((variant) => {
          if (!variant || typeof variant !== 'object') return variant;
          const nextVariant = { ...(variant as Record<string, unknown>) };
          if (typeof nextVariant.body === 'string') {
            nextVariant.body = normalizeInstantlyBody(nextVariant.body);
          }
          return nextVariant;
        });
      }
      return nextStep;
    });

    return next;
  });
}
