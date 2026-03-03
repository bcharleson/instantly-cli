import { describe, it, expect } from 'vitest';
import { webhooksListCommand } from '../../src/commands/webhooks/list.js';
import { webhooksGetCommand } from '../../src/commands/webhooks/get.js';
import { webhooksCreateCommand } from '../../src/commands/webhooks/create.js';
import { webhooksDeleteCommand } from '../../src/commands/webhooks/delete.js';
import { webhooksTestCommand } from '../../src/commands/webhooks/test.js';
import { webhooksEventTypesCommand } from '../../src/commands/webhooks/event-types.js';
import { webhooksResumeCommand } from '../../src/commands/webhooks/resume.js';

describe('Webhooks CommandDefinitions', () => {
  it('webhooks_list has correct structure', () => {
    expect(webhooksListCommand.name).toBe('webhooks_list');
    expect(webhooksListCommand.group).toBe('webhooks');
    expect(webhooksListCommand.endpoint.method).toBe('GET');
    expect(webhooksListCommand.endpoint.path).toBe('/webhooks');
    expect(webhooksListCommand.paginated).toBe(true);
  });

  it('webhooks_get requires id in path', () => {
    expect(webhooksGetCommand.endpoint.path).toBe('/webhooks/{id}');
    expect(webhooksGetCommand.fieldMappings.id).toBe('path');
  });

  it('webhooks_create sends body params', () => {
    expect(webhooksCreateCommand.endpoint.method).toBe('POST');
    expect(webhooksCreateCommand.fieldMappings.target_hook_url).toBe('body');
    expect(webhooksCreateCommand.fieldMappings.event_type).toBe('body');
  });

  it('webhooks_delete uses DELETE method', () => {
    expect(webhooksDeleteCommand.endpoint.method).toBe('DELETE');
  });

  it('webhooks_test sends POST to test endpoint', () => {
    expect(webhooksTestCommand.endpoint.method).toBe('POST');
    expect(webhooksTestCommand.endpoint.path).toBe('/webhooks/{id}/test');
    expect(webhooksTestCommand.fieldMappings.id).toBe('path');
  });

  it('webhooks_event-types uses GET with no required params', () => {
    expect(webhooksEventTypesCommand.endpoint.method).toBe('GET');
    const result = webhooksEventTypesCommand.inputSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('webhooks_resume sends POST with id in path', () => {
    expect(webhooksResumeCommand.endpoint.method).toBe('POST');
    expect(webhooksResumeCommand.endpoint.path).toBe('/webhooks/{id}/resume');
  });

  it('all webhook commands have descriptions', () => {
    const commands = [
      webhooksListCommand, webhooksGetCommand, webhooksCreateCommand,
      webhooksDeleteCommand, webhooksTestCommand, webhooksEventTypesCommand,
      webhooksResumeCommand,
    ];
    for (const cmd of commands) {
      expect(cmd.description).toBeTruthy();
      expect(cmd.description.length).toBeGreaterThan(10);
    }
  });
});
