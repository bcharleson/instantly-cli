import { describe, it, expect } from 'vitest';
import { backgroundJobsListCommand } from '../../src/commands/background-jobs/list.js';

describe('Background Jobs CommandDefinitions', () => {
  it('background_jobs_list has correct structure', () => {
    expect(backgroundJobsListCommand.name).toBe('background_jobs_list');
    expect(backgroundJobsListCommand.group).toBe('background-jobs');
    expect(backgroundJobsListCommand.subcommand).toBe('list');
    expect(backgroundJobsListCommand.endpoint.method).toBe('GET');
    expect(backgroundJobsListCommand.endpoint.path).toBe('/background-jobs');
    expect(backgroundJobsListCommand.paginated).toBe(true);
  });

  it('has query field mappings for filters', () => {
    expect(backgroundJobsListCommand.fieldMappings.status).toBe('query');
    expect(backgroundJobsListCommand.fieldMappings.type).toBe('query');
    expect(backgroundJobsListCommand.fieldMappings.entity_type).toBe('query');
    expect(backgroundJobsListCommand.fieldMappings.limit).toBe('query');
  });

  it('inputSchema validates correctly', () => {
    const result = backgroundJobsListCommand.inputSchema.safeParse({ limit: 20 });
    expect(result.success).toBe(true);
  });

  it('has a description', () => {
    expect(backgroundJobsListCommand.description).toBeTruthy();
    expect(backgroundJobsListCommand.description.length).toBeGreaterThan(10);
  });
});
