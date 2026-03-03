import { describe, it, expect } from 'vitest';
import { apiKeysCreateCommand } from '../../src/commands/api-keys/create.js';

describe('API Keys CommandDefinitions', () => {
  it('api_keys_create has correct structure', () => {
    expect(apiKeysCreateCommand.name).toBe('api_keys_create');
    expect(apiKeysCreateCommand.group).toBe('api-keys');
    expect(apiKeysCreateCommand.subcommand).toBe('create');
    expect(apiKeysCreateCommand.endpoint.method).toBe('POST');
    expect(apiKeysCreateCommand.endpoint.path).toBe('/api-keys');
  });

  it('sends name and scopes in body', () => {
    expect(apiKeysCreateCommand.fieldMappings.name).toBe('body');
    expect(apiKeysCreateCommand.fieldMappings.scopes).toBe('body');
  });

  it('has a description', () => {
    expect(apiKeysCreateCommand.description).toBeTruthy();
    expect(apiKeysCreateCommand.description.length).toBeGreaterThan(10);
  });

  it('inputSchema validates correctly', () => {
    const result = apiKeysCreateCommand.inputSchema.safeParse({ name: 'Test Key', scopes: 'campaigns:read' });
    expect(result.success).toBe(true);
  });
});
