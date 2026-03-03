import { describe, it, expect } from 'vitest';
import { allCommands } from '../../src/commands/index.js';

describe('Command Registry', () => {
  it('should have all commands with required fields', () => {
    for (const cmd of allCommands) {
      expect(cmd.name, `${cmd.name} missing name`).toBeTruthy();
      expect(cmd.group, `${cmd.name} missing group`).toBeTruthy();
      expect(cmd.subcommand, `${cmd.name} missing subcommand`).toBeTruthy();
      expect(cmd.description, `${cmd.name} missing description`).toBeTruthy();
      expect(cmd.endpoint, `${cmd.name} missing endpoint`).toBeTruthy();
      expect(cmd.endpoint.method, `${cmd.name} missing method`).toBeTruthy();
      expect(cmd.endpoint.path, `${cmd.name} missing path`).toBeTruthy();
      expect(cmd.fieldMappings, `${cmd.name} missing fieldMappings`).toBeDefined();
      expect(cmd.handler, `${cmd.name} missing handler`).toBeTypeOf('function');
      expect(cmd.inputSchema, `${cmd.name} missing inputSchema`).toBeDefined();
    }
  });

  it('should have unique command names', () => {
    const names = allCommands.map((c) => c.name);
    const dupes = names.filter((n, i) => names.indexOf(n) !== i);
    expect(dupes, `Duplicate command names: ${dupes.join(', ')}`).toHaveLength(0);
  });

  it('should have unique group + subcommand combinations', () => {
    const keys = allCommands.map((c) => `${c.group}:${c.subcommand}`);
    const dupes = keys.filter((k, i) => keys.indexOf(k) !== i);
    expect(dupes, `Duplicate group:subcommand: ${dupes.join(', ')}`).toHaveLength(0);
  });

  it('should use valid HTTP methods', () => {
    const validMethods = ['GET', 'POST', 'PATCH', 'DELETE'];
    for (const cmd of allCommands) {
      expect(validMethods, `${cmd.name} uses invalid method ${cmd.endpoint.method}`)
        .toContain(cmd.endpoint.method);
    }
  });

  it('should have fieldMappings only referencing path, query, or body', () => {
    const validLocations = ['path', 'query', 'body'];
    for (const cmd of allCommands) {
      for (const [field, location] of Object.entries(cmd.fieldMappings)) {
        expect(validLocations, `${cmd.name}.${field} has invalid location '${location}'`)
          .toContain(location);
      }
    }
  });

  it('should have path params matching {field} placeholders in endpoint path', () => {
    for (const cmd of allCommands) {
      const pathParams = Object.entries(cmd.fieldMappings)
        .filter(([_, loc]) => loc === 'path')
        .map(([field]) => field);

      for (const param of pathParams) {
        expect(
          cmd.endpoint.path,
          `${cmd.name}: path param '${param}' not found in endpoint path '${cmd.endpoint.path}'`,
        ).toContain(`{${param}}`);
      }
    }
  });

  it('should have endpoint paths starting with /', () => {
    for (const cmd of allCommands) {
      expect(
        cmd.endpoint.path.startsWith('/'),
        `${cmd.name}: path '${cmd.endpoint.path}' must start with /`,
      ).toBe(true);
    }
  });

  it('should have at least 150 commands registered', () => {
    expect(allCommands.length).toBeGreaterThanOrEqual(150);
  });
});
