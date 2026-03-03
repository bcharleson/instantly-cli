import { describe, it, expect } from 'vitest';
import { accountMappingsGetCommand } from '../../src/commands/account-mappings/get.js';

describe('Account-Campaign Mappings CommandDefinitions', () => {
  it('account_mappings_get has correct structure', () => {
    expect(accountMappingsGetCommand.name).toBe('account_mappings_get');
    expect(accountMappingsGetCommand.group).toBe('account-mappings');
    expect(accountMappingsGetCommand.subcommand).toBe('get');
    expect(accountMappingsGetCommand.endpoint.method).toBe('GET');
    expect(accountMappingsGetCommand.endpoint.path).toBe('/account-campaign-mappings/{email}');
    expect(accountMappingsGetCommand.paginated).toBe(true);
  });

  it('uses email in path', () => {
    expect(accountMappingsGetCommand.fieldMappings.email).toBe('path');
    expect(accountMappingsGetCommand.cliMappings.args?.[0].required).toBe(true);
    expect(accountMappingsGetCommand.cliMappings.args?.[0].field).toBe('email');
  });

  it('has a description', () => {
    expect(accountMappingsGetCommand.description).toBeTruthy();
    expect(accountMappingsGetCommand.description.length).toBeGreaterThan(10);
  });

  it('inputSchema validates correctly', () => {
    const result = accountMappingsGetCommand.inputSchema.safeParse({ email: 'user@example.com', limit: 10 });
    expect(result.success).toBe(true);
  });
});
