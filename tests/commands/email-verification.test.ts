import { describe, it, expect } from 'vitest';
import { emailVerificationVerifyCommand } from '../../src/commands/email-verification/verify.js';
import { emailVerificationStatusCommand } from '../../src/commands/email-verification/status.js';

describe('Email Verification CommandDefinitions', () => {
  it('email_verification_verify sends POST', () => {
    expect(emailVerificationVerifyCommand.name).toBe('email_verification_verify');
    expect(emailVerificationVerifyCommand.group).toBe('email-verification');
    expect(emailVerificationVerifyCommand.endpoint.method).toBe('POST');
    expect(emailVerificationVerifyCommand.endpoint.path).toBe('/email-verification');
    expect(emailVerificationVerifyCommand.fieldMappings.email).toBe('body');
    expect(emailVerificationVerifyCommand.fieldMappings.webhook_url).toBe('body');
  });

  it('email_verification_status uses GET with email in path', () => {
    expect(emailVerificationStatusCommand.name).toBe('email_verification_status');
    expect(emailVerificationStatusCommand.endpoint.method).toBe('GET');
    expect(emailVerificationStatusCommand.endpoint.path).toBe('/email-verification/{email}');
    expect(emailVerificationStatusCommand.fieldMappings.email).toBe('path');
    expect(emailVerificationStatusCommand.cliMappings.args?.[0].required).toBe(true);
  });

  it('all commands have descriptions', () => {
    const commands = [emailVerificationVerifyCommand, emailVerificationStatusCommand];
    for (const cmd of commands) {
      expect(cmd.description).toBeTruthy();
      expect(cmd.description.length).toBeGreaterThan(10);
    }
  });

  it('verify inputSchema validates correctly', () => {
    const result = emailVerificationVerifyCommand.inputSchema.safeParse({ email: 'test@example.com' });
    expect(result.success).toBe(true);
  });
});
