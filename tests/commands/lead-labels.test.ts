import { describe, it, expect } from 'vitest';
import { leadLabelsListCommand } from '../../src/commands/lead-labels/list.js';
import { leadLabelsGetCommand } from '../../src/commands/lead-labels/get.js';
import { leadLabelsCreateCommand } from '../../src/commands/lead-labels/create.js';
import { leadLabelsUpdateCommand } from '../../src/commands/lead-labels/update.js';
import { leadLabelsDeleteCommand } from '../../src/commands/lead-labels/delete.js';
import { leadLabelsTestAiCommand } from '../../src/commands/lead-labels/test-ai.js';

describe('Lead Labels CommandDefinitions', () => {
  it('lead_labels_list has correct structure', () => {
    expect(leadLabelsListCommand.name).toBe('lead_labels_list');
    expect(leadLabelsListCommand.group).toBe('lead-labels');
    expect(leadLabelsListCommand.endpoint.method).toBe('GET');
    expect(leadLabelsListCommand.endpoint.path).toBe('/lead-labels');
    expect(leadLabelsListCommand.paginated).toBe(true);
  });

  it('lead_labels_get requires id in path', () => {
    expect(leadLabelsGetCommand.endpoint.path).toBe('/lead-labels/{id}');
    expect(leadLabelsGetCommand.fieldMappings.id).toBe('path');
  });

  it('lead_labels_create sends body fields', () => {
    expect(leadLabelsCreateCommand.endpoint.method).toBe('POST');
    expect(leadLabelsCreateCommand.fieldMappings.label).toBe('body');
    expect(leadLabelsCreateCommand.fieldMappings.interest_status_label).toBe('body');
  });

  it('lead_labels_update uses PATCH', () => {
    expect(leadLabelsUpdateCommand.endpoint.method).toBe('PATCH');
    expect(leadLabelsUpdateCommand.fieldMappings.id).toBe('path');
  });

  it('lead_labels_delete supports reassigned_status', () => {
    expect(leadLabelsDeleteCommand.endpoint.method).toBe('DELETE');
    expect(leadLabelsDeleteCommand.fieldMappings.reassigned_status).toBe('body');
  });

  it('lead_labels_test-ai posts reply text', () => {
    expect(leadLabelsTestAiCommand.endpoint.method).toBe('POST');
    expect(leadLabelsTestAiCommand.endpoint.path).toBe('/lead-labels/ai-reply-label');
    expect(leadLabelsTestAiCommand.fieldMappings.reply_text).toBe('body');
  });

  it('all lead-label commands have descriptions', () => {
    const commands = [
      leadLabelsListCommand, leadLabelsGetCommand, leadLabelsCreateCommand,
      leadLabelsUpdateCommand, leadLabelsDeleteCommand, leadLabelsTestAiCommand,
    ];
    for (const cmd of commands) {
      expect(cmd.description).toBeTruthy();
      expect(cmd.description.length).toBeGreaterThan(10);
    }
  });
});
