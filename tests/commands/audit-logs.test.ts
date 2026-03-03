import { describe, it, expect } from 'vitest';
import { auditLogsListCommand } from '../../src/commands/audit-logs/list.js';

describe('Audit Logs CommandDefinitions', () => {
  it('audit_logs_list has correct structure', () => {
    expect(auditLogsListCommand.name).toBe('audit_logs_list');
    expect(auditLogsListCommand.group).toBe('audit-logs');
    expect(auditLogsListCommand.subcommand).toBe('list');
    expect(auditLogsListCommand.endpoint.method).toBe('GET');
    expect(auditLogsListCommand.endpoint.path).toBe('/audit-logs');
    expect(auditLogsListCommand.paginated).toBe(true);
  });

  it('has query field mappings for date filters', () => {
    expect(auditLogsListCommand.fieldMappings.start_date).toBe('query');
    expect(auditLogsListCommand.fieldMappings.end_date).toBe('query');
    expect(auditLogsListCommand.fieldMappings.activity_type).toBe('query');
    expect(auditLogsListCommand.fieldMappings.search).toBe('query');
  });

  it('has a description', () => {
    expect(auditLogsListCommand.description).toBeTruthy();
    expect(auditLogsListCommand.description.length).toBeGreaterThan(10);
  });

  it('inputSchema validates correctly', () => {
    const result = auditLogsListCommand.inputSchema.safeParse({ limit: 50 });
    expect(result.success).toBe(true);
  });

  it('inputSchema rejects invalid limit', () => {
    const result = auditLogsListCommand.inputSchema.safeParse({ limit: 2000 });
    expect(result.success).toBe(false);
  });
});
