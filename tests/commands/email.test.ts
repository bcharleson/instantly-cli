import { describe, it, expect, vi } from 'vitest';
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

  it('email_list supports --email-type, --eaccount, --campaign-id filters', () => {
    expect(emailListCommand.fieldMappings.email_type).toBe('query');
    expect(emailListCommand.fieldMappings.eaccount).toBe('query');
    expect(emailListCommand.fieldMappings.campaign_id).toBe('query');
    expect(emailListCommand.fieldMappings.is_read).toBe('query');

    const result = emailListCommand.inputSchema.safeParse({
      email_type: 'reply',
      eaccount: 'sender@domain.com',
      campaign_id: 'test-id',
    });
    expect(result.success).toBe(true);
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

  it('email_reply accepts --to for recipient validation', () => {
    const result = emailReplyCommand.inputSchema.safeParse({
      reply_to_uuid: 'test-uuid',
      eaccount: 'me@domain.com',
      subject: 'Re: Hello',
      to: 'lead@example.com',
      body_text: 'Thanks!',
    });
    expect(result.success).toBe(true);
  });

  it('email_reply accepts --skip-validation', () => {
    const result = emailReplyCommand.inputSchema.safeParse({
      reply_to_uuid: 'test-uuid',
      eaccount: 'me@domain.com',
      subject: 'Re: Hello',
      skip_validation: true,
    });
    expect(result.success).toBe(true);
  });

  it('email_reply handler validates recipient when --to is provided', async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValue({
        to_address_email_list: 'wrong@example.com',
        from_address_email: 'wrong@example.com',
        lead_email: 'wrong@example.com',
      }),
      post: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
      request: vi.fn(),
    };

    await expect(
      emailReplyCommand.handler(
        {
          reply_to_uuid: 'test-uuid',
          eaccount: 'me@domain.com',
          subject: 'Re: Hello',
          to: 'intended@example.com',
          body_text: 'Hi',
        },
        mockClient as any,
      ),
    ).rejects.toThrow('Recipient mismatch');

    // Should NOT have called post (reply was aborted)
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it('email_reply handler sends when --to matches', async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValue({
        to_address_email_list: 'lead@example.com',
        from_address_email: 'me@domain.com',
        lead_email: 'lead@example.com',
      }),
      post: vi.fn().mockResolvedValue({ id: 'new-email-id' }),
      patch: vi.fn(),
      delete: vi.fn(),
      request: vi.fn(),
    };

    const result = await emailReplyCommand.handler(
      {
        reply_to_uuid: 'test-uuid',
        eaccount: 'me@domain.com',
        subject: 'Re: Hello',
        to: 'lead@example.com',
        body_text: 'Thanks!',
      },
      mockClient as any,
    );

    expect(mockClient.get).toHaveBeenCalledWith('/emails/test-uuid');
    expect(mockClient.post).toHaveBeenCalledWith('/emails/reply', expect.any(Object));
    expect(result).toEqual(expect.objectContaining({ id: 'new-email-id' }));
  });

  it('email_reply handler skips validation when --skip-validation is set', async () => {
    const mockClient = {
      get: vi.fn(),
      post: vi.fn().mockResolvedValue({ id: 'new-email-id' }),
      patch: vi.fn(),
      delete: vi.fn(),
      request: vi.fn(),
    };

    await emailReplyCommand.handler(
      {
        reply_to_uuid: 'test-uuid',
        eaccount: 'me@domain.com',
        subject: 'Re: Hello',
        to: 'anyone@example.com',
        skip_validation: true,
        body_text: 'Hi',
      },
      mockClient as any,
    );

    // Should NOT have fetched the email for validation
    expect(mockClient.get).not.toHaveBeenCalled();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it('email_forward posts body fields', () => {
    expect(emailForwardCommand.endpoint.method).toBe('POST');
    expect(emailForwardCommand.endpoint.path).toBe('/emails/forward');
    expect(emailForwardCommand.fieldMappings.forward_uuid).toBe('body');
    expect(emailForwardCommand.fieldMappings.eaccount).toBe('body');
  });

  it('email_forward accepts --expect-from for sender validation', () => {
    const result = emailForwardCommand.inputSchema.safeParse({
      forward_uuid: 'test-uuid',
      eaccount: 'me@domain.com',
      to: 'other@domain.com',
      subject: 'Fwd: Hello',
      expect_from: 'original@sender.com',
    });
    expect(result.success).toBe(true);
  });

  it('email_forward handler validates sender when --expect-from is provided', async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValue({
        from_address_email: 'wrong@sender.com',
        to_address_email_list: 'me@domain.com',
      }),
      post: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
      request: vi.fn(),
    };

    await expect(
      emailForwardCommand.handler(
        {
          forward_uuid: 'test-uuid',
          eaccount: 'me@domain.com',
          to: 'other@domain.com',
          subject: 'Fwd: Hello',
          expect_from: 'intended@sender.com',
        },
        mockClient as any,
      ),
    ).rejects.toThrow('Sender mismatch');

    expect(mockClient.post).not.toHaveBeenCalled();
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
