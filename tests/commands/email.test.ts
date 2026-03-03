import { describe, it, expect } from 'vitest';
import { emailListCommand } from '../../src/commands/email/list.js';
import { emailGetCommand } from '../../src/commands/email/get.js';
import { emailReplyCommand } from '../../src/commands/email/reply.js';
import { emailForwardCommand } from '../../src/commands/email/forward.js';
import { emailDeleteCommand } from '../../src/commands/email/delete.js';
import { emailMarkReadCommand } from '../../src/commands/email/mark-read.js';
import { emailUnreadCountCommand } from '../../src/commands/email/unread-count.js';

describe('Email CommandDefinitions', () => {
  it('email_list has correct structure', () => {
    expect(emailListCommand.name).toBe('email_list');
    expect(emailListCommand.group).toBe('email');
    expect(emailListCommand.subcommand).toBe('list');
    expect(emailListCommand.endpoint.method).toBe('GET');
    expect(emailListCommand.endpoint.path).toBe('/emails');
    expect(emailListCommand.paginated).toBe(true);
  });

  it('email_list validates limit', () => {
    const valid = emailListCommand.inputSchema.safeParse({ limit: 50 });
    expect(valid.success).toBe(true);

    const invalid = emailListCommand.inputSchema.safeParse({ limit: 200 });
    expect(invalid.success).toBe(false);
  });

  it('email_get requires id as path param', () => {
    expect(emailGetCommand.endpoint.path).toBe('/emails/{id}');
    expect(emailGetCommand.fieldMappings.id).toBe('path');
    expect(emailGetCommand.cliMappings.args?.[0].required).toBe(true);
  });

  it('email_reply posts body fields', () => {
    expect(emailReplyCommand.endpoint.method).toBe('POST');
    expect(emailReplyCommand.endpoint.path).toBe('/emails/reply');
    expect(emailReplyCommand.fieldMappings.reply_to_uuid).toBe('body');
    expect(emailReplyCommand.fieldMappings.eaccount).toBe('body');
    expect(emailReplyCommand.fieldMappings.subject).toBe('body');
  });

  it('email_forward posts body fields', () => {
    expect(emailForwardCommand.endpoint.method).toBe('POST');
    expect(emailForwardCommand.endpoint.path).toBe('/emails/forward');
    expect(emailForwardCommand.fieldMappings.forward_uuid).toBe('body');
    expect(emailForwardCommand.fieldMappings.eaccount).toBe('body');
  });

  it('email_delete uses DELETE method', () => {
    expect(emailDeleteCommand.endpoint.method).toBe('DELETE');
    expect(emailDeleteCommand.endpoint.path).toBe('/emails/{id}');
  });

  it('email_mark-read posts thread-id in path', () => {
    expect(emailMarkReadCommand.endpoint.method).toBe('POST');
    expect(emailMarkReadCommand.fieldMappings.thread_id).toBe('path');
  });

  it('email_unread-count has no required params', () => {
    expect(emailUnreadCountCommand.endpoint.method).toBe('GET');
    const result = emailUnreadCountCommand.inputSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('all email commands have descriptions', () => {
    const commands = [
      emailListCommand, emailGetCommand, emailReplyCommand,
      emailForwardCommand, emailDeleteCommand, emailMarkReadCommand,
      emailUnreadCountCommand,
    ];
    for (const cmd of commands) {
      expect(cmd.description).toBeTruthy();
      expect(cmd.description.length).toBeGreaterThan(10);
    }
  });
});
