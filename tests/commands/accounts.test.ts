import { describe, it, expect } from 'vitest';
import { accountsListCommand } from '../../src/commands/accounts/list.js';
import { accountsGetCommand } from '../../src/commands/accounts/get.js';
import { accountsCreateCommand } from '../../src/commands/accounts/create.js';
import { accountsWarmupEnableCommand } from '../../src/commands/accounts/warmup-enable.js';
import { accountsTestVitalsCommand } from '../../src/commands/accounts/test-vitals.js';

describe('Account CommandDefinitions', () => {
  it('accounts_list uses GET with query params', () => {
    expect(accountsListCommand.endpoint.method).toBe('GET');
    expect(accountsListCommand.endpoint.path).toBe('/accounts');
    expect(accountsListCommand.fieldMappings.limit).toBe('query');
    expect(accountsListCommand.paginated).toBe(true);
  });

  it('accounts_get uses path param', () => {
    expect(accountsGetCommand.endpoint.path).toBe('/accounts/{id}');
    expect(accountsGetCommand.fieldMappings.id).toBe('path');
  });

  it('accounts_create sends SMTP/IMAP config in body', () => {
    expect(accountsCreateCommand.endpoint.method).toBe('POST');
    expect(accountsCreateCommand.fieldMappings.smtp_host).toBe('body');
    expect(accountsCreateCommand.fieldMappings.imap_host).toBe('body');
  });

  it('accounts_warmup_enable sends account_ids in body', () => {
    expect(accountsWarmupEnableCommand.endpoint.method).toBe('POST');
    expect(accountsWarmupEnableCommand.endpoint.path).toBe('/accounts/warmup/enable');
    expect(accountsWarmupEnableCommand.fieldMappings.account_ids).toBe('body');
  });

  it('accounts_test_vitals sends POST with email in body', () => {
    expect(accountsTestVitalsCommand.endpoint.method).toBe('POST');
    expect(accountsTestVitalsCommand.endpoint.path).toBe('/accounts/test/vitals');
    expect(accountsTestVitalsCommand.fieldMappings.email).toBe('body');
  });
});
