import { describe, it, expect, vi, beforeEach } from 'vitest';
import { output, outputError } from '../../src/core/output.js';

describe('output', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('outputs compact JSON by default', () => {
    output({ id: '1', name: 'Test' });
    expect(consoleSpy).toHaveBeenCalledWith('{"id":"1","name":"Test"}');
  });

  it('outputs pretty JSON with --output pretty', () => {
    output({ id: '1' }, { output: 'pretty' });
    expect(consoleSpy).toHaveBeenCalledWith(JSON.stringify({ id: '1' }, null, 2));
  });

  it('suppresses output with --quiet', () => {
    output({ id: '1' }, { quiet: true });
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  // --fields on a flat object
  it('picks fields from a flat object', () => {
    output({ id: '1', name: 'Test', status: 'active', extra: 'drop' }, { fields: 'id,name' });
    expect(consoleSpy).toHaveBeenCalledWith('{"id":"1","name":"Test"}');
  });

  // --fields on an array
  it('picks fields from each item in an array', () => {
    const data = [
      { id: '1', name: 'A', extra: 'x' },
      { id: '2', name: 'B', extra: 'y' },
    ];
    output(data, { fields: 'id,name' });
    expect(consoleSpy).toHaveBeenCalledWith('[{"id":"1","name":"A"},{"id":"2","name":"B"}]');
  });

  // --fields on a paginated response {items: [...]}
  it('unwraps paginated response and picks fields from items', () => {
    const data = {
      items: [
        { id: '1', name: 'Campaign A', status: 'active', created_at: '2025-01-01' },
        { id: '2', name: 'Campaign B', status: 'paused', created_at: '2025-02-01' },
      ],
      next_starting_after: 'abc-123',
    };
    output(data, { fields: 'id,name,status' });
    const result = JSON.parse(consoleSpy.mock.calls[0][0] as string);
    expect(result).toEqual([
      { id: '1', name: 'Campaign A', status: 'active' },
      { id: '2', name: 'Campaign B', status: 'paused' },
    ]);
  });

  // --fields with nonexistent fields returns empty
  it('returns empty objects when fields do not match', () => {
    output({ id: '1', name: 'Test' }, { fields: 'nonexistent' });
    expect(consoleSpy).toHaveBeenCalledWith('{}');
  });

  // --fields on paginated response with empty items
  it('handles paginated response with empty items array', () => {
    output({ items: [], next_starting_after: null }, { fields: 'id,name' });
    expect(consoleSpy).toHaveBeenCalledWith('[]');
  });

  // --fields trims whitespace
  it('trims whitespace around field names', () => {
    output({ id: '1', name: 'Test' }, { fields: ' id , name ' });
    expect(consoleSpy).toHaveBeenCalledWith('{"id":"1","name":"Test"}');
  });
});

describe('outputError', () => {
  let stderrSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    stderrSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    process.exitCode = undefined as any;
  });

  it('outputs JSON error to stderr by default', () => {
    outputError(new Error('Something broke'));
    expect(stderrSpy).toHaveBeenCalledWith(
      JSON.stringify({ error: 'Something broke', code: 'UNKNOWN_ERROR' }),
    );
    expect(process.exitCode).toBe(1);
  });

  it('outputs human-readable error with --output pretty', () => {
    outputError(new Error('fail'), { output: 'pretty' });
    expect(stderrSpy).toHaveBeenCalledWith('Error: fail');
  });

  it('suppresses error output with --quiet but sets exit code', () => {
    outputError(new Error('fail'), { quiet: true });
    expect(stderrSpy).not.toHaveBeenCalled();
    expect(process.exitCode).toBe(1);
  });
});
