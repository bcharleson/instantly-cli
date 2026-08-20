import { ValidationError } from './errors.js';

export const DELAY_UNITS = ['minutes', 'hours', 'days'] as const;
export type DelayUnit = (typeof DELAY_UNITS)[number];
export type SequenceKind = 'campaign' | 'subsequence';

/**
 * Agent-facing copy for MCP, Zod, and --help.
 * delay on step N waits before step N+1. First email does not wait. Pass delay_unit.
 */
export const SEQUENCE_DELAY_HINT =
  'delay on step N waits before step N+1. First email does not wait (it sends on the campaign schedule). ' +
  'Pass delay_unit (minutes|hours|days); omitted delay_unit is set to days. ' +
  'Instantly uses only sequences[0] — extra sequence elements are rejected. ' +
  'A multi-step sequence with delay 0 or missing delay on a non-last step is rejected (follow-up would send the same day). ' +
  'Last step delay may be 0. email_gap is minutes between individual sends (rate limit), not the step gap. ' +
  'pre_delay / pre_delay_unit apply only to subsequences.';

export interface SequenceTimelineEntry {
  email: number;
  when: string;
  note: string;
}

export interface SequenceTimeline {
  summary: string;
  emails: SequenceTimelineEntry[];
}

function asRecord(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new ValidationError(`${label} must be an object`);
  }
  return { ...(value as Record<string, unknown>) };
}

function parseDelay(value: unknown, label: string): number {
  if (value === undefined || value === null || value === '') {
    throw new ValidationError(
      `${label} must be a number. delay on step N waits before step N+1. ` +
        'First email does not wait. Do not omit delay on a multi-step sequence ' +
        '(that would send the follow-up the same day). Last step delay may be 0.',
    );
  }
  const delay = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(delay)) {
    throw new ValidationError(`${label} must be a number`);
  }
  if (delay < 0) {
    throw new ValidationError(`${label} cannot be negative`);
  }
  return delay;
}

function parseDelayUnit(value: unknown, label: string): { unit: DelayUnit; defaulted: boolean } {
  if (value === undefined || value === null || value === '') {
    return { unit: 'days', defaulted: true };
  }
  if (typeof value !== 'string' || !DELAY_UNITS.includes(value as DelayUnit)) {
    throw new ValidationError(`${label} must be one of: minutes, hours, days`);
  }
  return { unit: value as DelayUnit, defaulted: false };
}

/**
 * Fail-closed Instantly sequence rules. Does not invent delay day values.
 * Defaults only omitted delay_unit to days.
 */
export function validateAndNormalizeSequences(
  sequences: unknown,
  kind: SequenceKind,
): Record<string, unknown>[] {
  if (!Array.isArray(sequences) || sequences.length === 0) {
    throw new ValidationError(
      'sequences must be a non-empty array. Instantly uses only sequences[0].',
    );
  }
  if (sequences.length > 1) {
    throw new ValidationError(
      `Instantly uses only sequences[0] (${sequences.length} elements were sent). ` +
        'Remove extra sequence objects — they are not a second branch.',
    );
  }

  const sequence = asRecord(sequences[0], 'sequences[0]');

  if (kind === 'campaign' && (sequence.pre_delay != null || sequence.pre_delay_unit != null)) {
    throw new ValidationError(
      'pre_delay / pre_delay_unit apply only to subsequences. ' +
        'The first campaign email sends on the campaign schedule and does not wait on pre_delay or step[0].delay.',
    );
  }

  if (!Array.isArray(sequence.steps) || sequence.steps.length === 0) {
    throw new ValidationError('sequences[0].steps must be a non-empty array of email steps');
  }

  const multi = sequence.steps.length >= 2;
  const steps = sequence.steps.map((rawStep, index) => {
    const step = asRecord(rawStep, `step[${index}]`);
    const label = `step[${index}].delay`;

    if (step.type !== undefined && step.type !== 'email') {
      throw new ValidationError(`step[${index}].type must be "email"`);
    }
    if (!Array.isArray(step.variants) || step.variants.length === 0) {
      throw new ValidationError(`step[${index}].variants is required (non-empty array)`);
    }

    const delay = parseDelay(step.delay, label);
    const isLast = index === sequence.steps.length - 1;
    if (multi && !isLast && delay === 0) {
      throw new ValidationError(
        `${label} is 0. delay on step N waits before step N+1; ` +
          `a 0 delay would send Email ${index + 2} the same day as Email ${index + 1}. ` +
          'Set a positive delay (and delay_unit). Last step delay may be 0.',
      );
    }

    const { unit } = parseDelayUnit(step.delay_unit, `step[${index}].delay_unit`);
    return {
      ...step,
      type: 'email',
      delay,
      delay_unit: unit,
    };
  });

  return [{ ...sequence, steps }];
}

export function buildSequenceTimeline(
  sequences: Record<string, unknown>[],
  kind: SequenceKind,
): SequenceTimeline {
  const sequence = sequences[0] ?? {};
  const steps = Array.isArray(sequence.steps) ? sequence.steps as Record<string, unknown>[] : [];
  const emails: SequenceTimelineEntry[] = [];

  if (kind === 'subsequence') {
    const pre = sequence.pre_delay;
    const preUnit = sequence.pre_delay_unit ?? 'days';
    emails.push(
      pre != null && pre !== ''
        ? {
            email: 1,
            when: `+${pre} ${preUnit} after trigger`,
            note: 'pre_delay applies only to subsequences',
          }
        : {
            email: 1,
            when: 'on subsequence trigger',
            note: 'Set pre_delay / pre_delay_unit to wait before the first subsequence email',
          },
    );
  } else {
    emails.push({
      email: 1,
      when: 'on campaign schedule',
      note: 'First email does not wait on step[0].delay',
    });
  }

  for (let index = 0; index < Math.max(0, steps.length - 1); index++) {
    const step = steps[index] ?? {};
    emails.push({
      email: index + 2,
      when: `+${step.delay} ${step.delay_unit} after Email ${index + 1}`,
      note: `step[${index}].delay waits before step[${index + 1}]`,
    });
  }

  return {
    summary: emails.map((entry) => `Email ${entry.email}: ${entry.when}`).join('; '),
    emails,
  };
}

export function withSequenceTimeline<T>(
  result: T,
  sequences: Record<string, unknown>[],
  kind: SequenceKind,
): T | (T & { sequence_timeline: SequenceTimeline }) {
  const sequence_timeline = buildSequenceTimeline(sequences, kind);
  if (result && typeof result === 'object' && !Array.isArray(result)) {
    return { ...(result as Record<string, unknown>), sequence_timeline } as T & {
      sequence_timeline: SequenceTimeline;
    };
  }
  return { result, sequence_timeline } as T & { sequence_timeline: SequenceTimeline };
}
