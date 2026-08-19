import { describe, it, expect } from 'vitest';
import {
  bodyToHtml,
  isHtml,
  ensureHtml,
  normalizeInstantlyBody,
  normalizeSequenceBodies,
  SEQUENCE_BODY_HINT,
} from '../../src/core/format.js';

describe('bodyToHtml', () => {
  it('wraps single line in <div>', () => {
    expect(bodyToHtml('Hello')).toBe('<div>Hello</div>');
  });

  it('converts multiple lines to <div> blocks', () => {
    expect(bodyToHtml('Hi Sarah,\nHow are you?')).toBe(
      '<div>Hi Sarah,</div><div>How are you?</div>',
    );
  });

  it('converts blank lines to <div><br /></div>', () => {
    expect(bodyToHtml('Hi,\n\nBest')).toBe(
      '<div>Hi,</div><div><br /></div><div>Best</div>',
    );
  });

  it('handles full email body with signature', () => {
    const plain = 'Hi Sarah,\n\nWorth it?\n\nMark';
    expect(bodyToHtml(plain)).toBe(
      '<div>Hi Sarah,</div><div><br /></div><div>Worth it?</div><div><br /></div><div>Mark</div>',
    );
  });

  it('trims leading and trailing whitespace', () => {
    expect(bodyToHtml('  Hello  \n  World  ')).toBe(
      '<div>Hello</div><div>World</div>',
    );
  });

  it('preserves template variables', () => {
    expect(bodyToHtml('Hi {{first_name}},\n\nBest')).toBe(
      '<div>Hi {{first_name}},</div><div><br /></div><div>Best</div>',
    );
  });

  it('preserves spin syntax', () => {
    expect(bodyToHtml('{{RANDOM|Hey|Hi}} there')).toBe(
      '<div>{{RANDOM|Hey|Hi}} there</div>',
    );
  });
});

describe('isHtml', () => {
  it('detects <div> tags', () => {
    expect(isHtml('<div>Hello</div>')).toBe(true);
  });

  it('detects <p> tags', () => {
    expect(isHtml('<p>Hello</p>')).toBe(true);
  });

  it('detects <br> tags', () => {
    expect(isHtml('Hello<br>World')).toBe(true);
  });

  it('detects <br /> self-closing tags', () => {
    expect(isHtml('Hello<br />World')).toBe(true);
  });

  it('detects <table> tags', () => {
    expect(isHtml('<table><tr><td>data</td></tr></table>')).toBe(true);
  });

  it('detects <strong> tags', () => {
    expect(isHtml('<strong>bold</strong>')).toBe(true);
  });

  it('returns false for plain text', () => {
    expect(isHtml('Hello World')).toBe(false);
  });

  it('returns false for template variables that look like tags', () => {
    expect(isHtml('{{first_name}} {{RANDOM|a|b}}')).toBe(false);
  });

  it('is case-insensitive', () => {
    expect(isHtml('<DIV>Hello</DIV>')).toBe(true);
  });
});

describe('ensureHtml', () => {
  it('converts plain text to HTML', () => {
    expect(ensureHtml('Hello\n\nWorld')).toBe(
      '<div>Hello</div><div><br /></div><div>World</div>',
    );
  });

  it('returns already-HTML content unchanged', () => {
    const html = '<div>Hello</div><div><br /></div><div>World</div>';
    expect(ensureHtml(html)).toBe(html);
  });

  it('returns content with <p> tags unchanged', () => {
    const html = '<p>Hello</p><p>World</p>';
    expect(ensureHtml(html)).toBe(html);
  });
});

describe('normalizeInstantlyBody', () => {
  it('wraps a single line in <p>', () => {
    expect(normalizeInstantlyBody('Hello')).toBe('<p>Hello</p>');
  });

  it('turns a single newline into <br/>', () => {
    expect(normalizeInstantlyBody('Hi Sarah,\nHow are you?')).toBe(
      '<p>Hi Sarah,<br/>How are you?</p>',
    );
  });

  it('turns a blank line into a new paragraph', () => {
    expect(normalizeInstantlyBody('Hi Sarah,\n\nWorth a quick chat?')).toBe(
      '<p>Hi Sarah,</p><p>Worth a quick chat?</p>',
    );
  });

  it('normalizes CRLF and CR before converting', () => {
    expect(normalizeInstantlyBody('Hi\r\nthere\r\n\r\nBye')).toBe(
      '<p>Hi<br/>there</p><p>Bye</p>',
    );
    expect(normalizeInstantlyBody('Hi\rthere')).toBe('<p>Hi<br/>there</p>');
  });

  it('leaves HTML bodies unchanged, including <div> and <br/>', () => {
    expect(normalizeInstantlyBody('<div>Hello</div>')).toBe('<div>Hello</div>');
    expect(normalizeInstantlyBody('<p>Hello<br/>World</p>')).toBe('<p>Hello<br/>World</p>');
  });

  it('preserves template variables and spin syntax', () => {
    expect(normalizeInstantlyBody('Hi {{first_name}},\n\n{{RANDOM|Hey|Hi}}')).toBe(
      '<p>Hi {{first_name}},</p><p>{{RANDOM|Hey|Hi}}</p>',
    );
  });
});

describe('normalizeSequenceBodies', () => {
  const sequences = [
    {
      steps: [
        {
          type: 'email',
          variants: [{ subject: 'Hi', body: 'Hello\n\nWorld' }],
        },
      ],
    },
  ];

  it('normalizes variant body in place on the same key', () => {
    const result = normalizeSequenceBodies(sequences) as typeof sequences;
    expect(result[0].steps[0].variants[0].body).toBe('<p>Hello</p><p>World</p>');
    expect(result[0].steps[0].variants[0].subject).toBe('Hi');
    expect(sequences[0].steps[0].variants[0].body).toBe('Hello\n\nWorld');
  });

  it('does not convert when text_only is true', () => {
    const result = normalizeSequenceBodies(sequences, true) as typeof sequences;
    expect(result[0].steps[0].variants[0].body).toBe('Hello\n\nWorld');
  });
});

describe('SEQUENCE_BODY_HINT', () => {
  it('tells agents to pass readable line breaks, not to hand-write tags', () => {
    expect(SEQUENCE_BODY_HINT).toContain('Instantly delivers HTML');
    expect(SEQUENCE_BODY_HINT).toContain('real line breaks');
    expect(SEQUENCE_BODY_HINT).toContain('converts plain-text newlines to <br/>/<p>');
    expect(SEQUENCE_BODY_HINT).toContain('Do not write a run-on string');
    expect(SEQUENCE_BODY_HINT).not.toMatch(/must (use|hand-write|include) <br/i);
    expect(SEQUENCE_BODY_HINT).not.toMatch(/use `<br\/>` tags/i);
  });
});
