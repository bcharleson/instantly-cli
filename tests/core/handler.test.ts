import { describe, it, expect, vi } from 'vitest';
import { executeCommand } from '../../src/core/handler.js';
import { z } from 'zod';
import type { CommandDefinition } from '../../src/core/types.js';

describe('executeCommand', () => {
  function makeClient() {
    return {
      request: vi.fn().mockResolvedValue({ ok: true }),
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
      paginate: vi.fn(),
    };
  }

  it('maps path params by replacing {field} placeholders', async () => {
    const client = makeClient();
    const cmd = {
      endpoint: { method: 'GET' as const, path: '/campaigns/{id}' },
      fieldMappings: { id: 'path' },
      inputSchema: z.object({ id: z.string() }),
    } as unknown as CommandDefinition;

    await executeCommand(cmd, { id: 'abc-123' }, client);

    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({ path: '/campaigns/abc-123' }),
    );
  });

  it('maps query params into query object', async () => {
    const client = makeClient();
    const cmd = {
      endpoint: { method: 'GET' as const, path: '/campaigns' },
      fieldMappings: { limit: 'query', search: 'query' },
      inputSchema: z.object({ limit: z.number(), search: z.string() }),
    } as unknown as CommandDefinition;

    await executeCommand(cmd, { limit: 10, search: 'test' }, client);

    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({
        query: { limit: 10, search: 'test' },
      }),
    );
  });

  it('maps body params into body object', async () => {
    const client = makeClient();
    const cmd = {
      endpoint: { method: 'POST' as const, path: '/leads' },
      fieldMappings: { email: 'body', campaign_id: 'body' },
      inputSchema: z.object({ email: z.string(), campaign_id: z.string() }),
    } as unknown as CommandDefinition;

    await executeCommand(cmd, { email: 'a@b.com', campaign_id: 'c1' }, client);

    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({
        body: { email: 'a@b.com', campaign_id: 'c1' },
      }),
    );
  });

  it('skips undefined fields', async () => {
    const client = makeClient();
    const cmd = {
      endpoint: { method: 'GET' as const, path: '/campaigns' },
      fieldMappings: { limit: 'query', search: 'query' },
      inputSchema: z.object({ limit: z.number(), search: z.string().optional() }),
    } as unknown as CommandDefinition;

    await executeCommand(cmd, { limit: 10, search: undefined }, client);

    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({
        query: { limit: 10 },
      }),
    );
  });

  it('encodes path params', async () => {
    const client = makeClient();
    const cmd = {
      endpoint: { method: 'GET' as const, path: '/accounts/{email}' },
      fieldMappings: { email: 'path' },
      inputSchema: z.object({ email: z.string() }),
    } as unknown as CommandDefinition;

    await executeCommand(cmd, { email: 'user@example.com' }, client);

    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({ path: '/accounts/user%40example.com' }),
    );
  });

  it('omits body and query when empty', async () => {
    const client = makeClient();
    const cmd = {
      endpoint: { method: 'GET' as const, path: '/workspace' },
      fieldMappings: {},
      inputSchema: z.object({}),
    } as unknown as CommandDefinition;

    await executeCommand(cmd, {}, client);

    expect(client.request).toHaveBeenCalledWith({
      method: 'GET',
      path: '/workspace',
      query: undefined,
      body: undefined,
    });
  });

  it('handles mixed path + query + body params', async () => {
    const client = makeClient();
    const cmd = {
      endpoint: { method: 'PATCH' as const, path: '/campaigns/{id}' },
      fieldMappings: { id: 'path', name: 'body', status: 'query' },
      inputSchema: z.object({ id: z.string(), name: z.string(), status: z.number() }),
    } as unknown as CommandDefinition;

    await executeCommand(cmd, { id: 'c1', name: 'Updated', status: 1 }, client);

    expect(client.request).toHaveBeenCalledWith({
      method: 'PATCH',
      path: '/campaigns/c1',
      query: { status: 1 },
      body: { name: 'Updated' },
    });
  });
});
