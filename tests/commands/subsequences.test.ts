import { describe, it, expect } from 'vitest';
import { subsequencesListCommand } from '../../src/commands/subsequences/list.js';
import { subsequencesCreateCommand } from '../../src/commands/subsequences/create.js';
import { subsequencesUpdateCommand } from '../../src/commands/subsequences/update.js';
import { subsequencesDeleteCommand } from '../../src/commands/subsequences/delete.js';
import { subsequencesDuplicateCommand } from '../../src/commands/subsequences/duplicate.js';
import { subsequencesPauseCommand } from '../../src/commands/subsequences/pause.js';
import { subsequencesResumeCommand } from '../../src/commands/subsequences/resume.js';
import { subsequencesSendingStatusCommand } from '../../src/commands/subsequences/sending-status.js';

describe('Subsequence CommandDefinitions', () => {
  it('subsequences_list has correct structure', () => {
    expect(subsequencesListCommand.name).toBe('subsequences_list');
    expect(subsequencesListCommand.group).toBe('subsequences');
    expect(subsequencesListCommand.endpoint.method).toBe('GET');
    expect(subsequencesListCommand.endpoint.path).toBe('/subsequences');
    expect(subsequencesListCommand.paginated).toBe(true);
    expect(subsequencesListCommand.fieldMappings.parent_campaign).toBe('query');
  });

  it('subsequences_create sends POST with body fields', () => {
    expect(subsequencesCreateCommand.endpoint.method).toBe('POST');
    expect(subsequencesCreateCommand.endpoint.path).toBe('/subsequences');
    expect(subsequencesCreateCommand.fieldMappings.parent_campaign).toBe('body');
    expect(subsequencesCreateCommand.fieldMappings.name).toBe('body');
    expect(subsequencesCreateCommand.fieldMappings.conditions).toBe('body');
  });

  it('subsequences_update uses PATCH with id in path', () => {
    expect(subsequencesUpdateCommand.endpoint.method).toBe('PATCH');
    expect(subsequencesUpdateCommand.endpoint.path).toBe('/subsequences/{id}');
    expect(subsequencesUpdateCommand.fieldMappings.id).toBe('path');
    expect(subsequencesUpdateCommand.fieldMappings.name).toBe('body');
  });

  it('subsequences_delete uses DELETE', () => {
    expect(subsequencesDeleteCommand.endpoint.method).toBe('DELETE');
    expect(subsequencesDeleteCommand.endpoint.path).toBe('/subsequences/{id}');
    expect(subsequencesDeleteCommand.fieldMappings.id).toBe('path');
  });

  it('subsequences_duplicate sends POST to /subsequences/{id}/duplicate', () => {
    expect(subsequencesDuplicateCommand.endpoint.method).toBe('POST');
    expect(subsequencesDuplicateCommand.endpoint.path).toBe('/subsequences/{id}/duplicate');
    expect(subsequencesDuplicateCommand.fieldMappings.parent_campaign).toBe('body');
  });

  it('subsequences_pause sends POST to pause endpoint', () => {
    expect(subsequencesPauseCommand.endpoint.method).toBe('POST');
    expect(subsequencesPauseCommand.endpoint.path).toBe('/subsequences/{id}/pause');
  });

  it('subsequences_resume sends POST to resume endpoint', () => {
    expect(subsequencesResumeCommand.endpoint.method).toBe('POST');
    expect(subsequencesResumeCommand.endpoint.path).toBe('/subsequences/{id}/resume');
  });

  it('subsequences_sending_status uses GET', () => {
    expect(subsequencesSendingStatusCommand.endpoint.method).toBe('GET');
    expect(subsequencesSendingStatusCommand.endpoint.path).toBe('/subsequences/{id}/sending-status');
    expect(subsequencesSendingStatusCommand.fieldMappings.with_ai_summary).toBe('query');
  });

  it('all subsequence commands have descriptions', () => {
    const commands = [
      subsequencesListCommand,
      subsequencesCreateCommand,
      subsequencesUpdateCommand,
      subsequencesDeleteCommand,
      subsequencesDuplicateCommand,
      subsequencesPauseCommand,
      subsequencesResumeCommand,
      subsequencesSendingStatusCommand,
    ];
    for (const cmd of commands) {
      expect(cmd.description).toBeTruthy();
      expect(cmd.description.length).toBeGreaterThan(10);
    }
  });

  it('list command inputSchema validates correctly', () => {
    const result = subsequencesListCommand.inputSchema.safeParse({ parent_campaign: 'abc-123', limit: 10 });
    expect(result.success).toBe(true);
  });
});
