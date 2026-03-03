import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

export const emailVerificationStatusCommand: CommandDefinition = {
  name: 'email_verification_status',
  group: 'email-verification',
  subcommand: 'status',
  description: 'Check the verification status of an email address.',
  examples: ['instantly email-verification status <email>'],

  inputSchema: z.object({ email: z.string().describe('Email address to check') }),
  cliMappings: { args: [{ field: 'email', name: 'email', required: true }] },
  endpoint: { method: 'GET', path: '/email-verification/{email}' },
  fieldMappings: { email: 'path' },
  handler: (input, client) => executeCommand(emailVerificationStatusCommand, input, client),
};
