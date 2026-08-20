import { describe, it, expect } from 'vitest';
import { ValidationError } from '../../src/core/errors.js';
import {
  SEQUENCE_DELAY_HINT,
  validateAndNormalizeSequences,
  buildSequenceTimeline,
} from '../../src/core/sequences.js';

const variant = { subject: 'Hi', body: 'Hello' };

function steps(...delays: Array<{ delay?: unknown; delay_unit?: unknown }>) {
  return [
    {
      steps: delays.map((item) => ({
        type: 'email',
        variants: [variant],
        ...item,
      })),
    },
  ];
}

describe('SEQUENCE_DELAY_HINT', () => {
  it('documents Instantly delay semantics for agents', () => {
    expect(SEQUENCE_DELAY_HINT).toContain('delay on step N waits before step N+1');
    expect(SEQUENCE_DELAY_HINT).toContain('First email does not wait');
    expect(SEQUENCE_DELAY_HINT).toContain('Pass delay_unit');
    expect(SEQUENCE_DELAY_HINT).toContain('email_gap');
    expect(SEQUENCE_DELAY_HINT).toContain('pre_delay');
  });
});

describe('validateAndNormalizeSequences', () => {
  it('defaults omitted delay_unit to days and does not invent delay values', () => {
    const result = validateAndNormalizeSequences(steps({ delay: 3 }), 'campaign');
    expect(result[0].steps).toEqual([
      expect.objectContaining({ delay: 3, delay_unit: 'days', type: 'email' }),
    ]);
  });

  it('rejects extra sequence elements (Instantly uses only sequences[0])', () => {
    expect(() =>
      validateAndNormalizeSequences([...steps({ delay: 0 }), ...steps({ delay: 0 })], 'campaign'),
    ).toThrow(ValidationError);
    expect(() =>
      validateAndNormalizeSequences([...steps({ delay: 0 }), ...steps({ delay: 0 })], 'campaign'),
    ).toThrow(/only sequences\[0\]/);
  });

  it('rejects missing delay on any step (no silent 3-day fill)', () => {
    expect(() => validateAndNormalizeSequences(steps({}), 'campaign')).toThrow(
      /step\[0\]\.delay must be a number/,
    );
  });

  it('rejects delay 0 on a non-last step of a multi-step sequence', () => {
    expect(() =>
      validateAndNormalizeSequences(steps({ delay: 0 }, { delay: 0 }), 'campaign'),
    ).toThrow(/same day/);
  });

  it('allows last-step delay 0 when a prior step has a positive delay', () => {
    const result = validateAndNormalizeSequences(
      steps({ delay: 2, delay_unit: 'days' }, { delay: 0 }),
      'campaign',
    );
    expect((result[0].steps as Array<{ delay: number }>)[1].delay).toBe(0);
    expect((result[0].steps as Array<{ delay_unit: string }>)[1].delay_unit).toBe('days');
  });

  it('rejects pre_delay on a regular campaign', () => {
    expect(() =>
      validateAndNormalizeSequences(
        [{ pre_delay: 2, pre_delay_unit: 'days', steps: [{ type: 'email', delay: 0, variants: [variant] }] }],
        'campaign',
      ),
    ).toThrow(/only to subsequences/);
  });

  it('allows pre_delay on a subsequence', () => {
    const result = validateAndNormalizeSequences(
      [{ pre_delay: 1, pre_delay_unit: 'days', steps: [{ type: 'email', delay: 0, variants: [variant] }] }],
      'subsequence',
    );
    expect(result[0].pre_delay).toBe(1);
  });
});

describe('buildSequenceTimeline', () => {
  it('echoes Email 1 on schedule and later emails after step delays', () => {
    const sequences = validateAndNormalizeSequences(
      steps({ delay: 3, delay_unit: 'days' }, { delay: 0, delay_unit: 'days' }),
      'campaign',
    );
    const timeline = buildSequenceTimeline(sequences, 'campaign');
    expect(timeline.summary).toBe(
      'Email 1: on campaign schedule; Email 2: +3 days after Email 1',
    );
    expect(timeline.emails[0].note).toContain('does not wait');
  });
});
