import { describe, it, expect } from 'vitest';
import { bodyToHtml, isHtml, ensureHtml } from '../../src/core/format.js';

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
