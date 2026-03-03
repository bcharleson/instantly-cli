import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { InstantlyClient } from '../../src/core/client.js';

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('InstantlyClient', () => {
  let client: InstantlyClient;

  beforeEach(() => {
    client = new InstantlyClient({
      apiKey: 'test-key',
      baseUrl: 'https://api.test.com/api/v2',
      maxRetries: 0,
    });
    mockFetch.mockReset();
  });

  it('should include Authorization header', async () => {
    mockFetch.mockResolvedValue(new Response(JSON.stringify({ id: '1' }), { status: 200 }));

    await client.get('/campaigns');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/campaigns'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-key',
        }),
      }),
    );
  });

  it('should append query params', async () => {
    mockFetch.mockResolvedValue(new Response(JSON.stringify({ items: [] }), { status: 200 }));

    await client.get('/campaigns', { limit: 10, status: 1 });

    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain('limit=10');
    expect(url).toContain('status=1');
  });

  it('should skip undefined query params', async () => {
    mockFetch.mockResolvedValue(new Response(JSON.stringify({ items: [] }), { status: 200 }));

    await client.get('/campaigns', { limit: 10, search: undefined });

    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain('limit=10');
    expect(url).not.toContain('search');
  });

  it('should send JSON body for POST', async () => {
    mockFetch.mockResolvedValue(new Response(JSON.stringify({ id: 'new' }), { status: 200 }));

    await client.post('/campaigns', { name: 'Test Campaign' });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'Test Campaign' }),
      }),
    );
  });

  it('should throw AuthError on 401', async () => {
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 }),
    );

    await expect(client.get('/campaigns')).rejects.toThrow('Unauthorized');
  });

  it('should throw NotFoundError on 404', async () => {
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify({ message: 'Not found' }), { status: 404 }),
    );

    await expect(client.get('/campaigns/missing')).rejects.toThrow('Not found');
  });

  it('should throw RateLimitError on 429', async () => {
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify({ message: 'Rate limited' }), {
        status: 429,
        headers: { 'retry-after': '5' },
      }),
    );

    await expect(client.get('/campaigns')).rejects.toThrow('Rate limited');
  });

  it('should handle empty response body', async () => {
    mockFetch.mockResolvedValue(new Response('', { status: 200 }));

    const result = await client.delete('/campaigns/123');
    expect(result).toBeUndefined();
  });
});
