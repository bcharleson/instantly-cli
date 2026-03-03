import { describe, it, expect, vi, beforeEach } from 'vitest';
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

  it('should throw ValidationError on 422', async () => {
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify({ message: 'Invalid email format' }), { status: 422 }),
    );

    await expect(client.post('/leads', { email: 'bad' })).rejects.toThrow('Invalid email format');
  });

  it('should throw ServerError on 500', async () => {
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 }),
    );

    await expect(client.get('/campaigns')).rejects.toThrow('Internal server error');
  });

  it('should throw InstantlyError with TIMEOUT code on AbortError', async () => {
    // Simulate AbortError (Node 18 style — plain Error with name 'AbortError')
    const abortError = new Error('The operation was aborted');
    abortError.name = 'AbortError';
    mockFetch.mockRejectedValue(abortError);

    const err = await client.get('/slow-endpoint').catch((e) => e);
    expect(err.code).toBe('TIMEOUT');
    expect(err.message).toContain('Request timed out');
    expect(err.message).toContain('/slow-endpoint');
  });

  it('should throw InstantlyError with TIMEOUT for aborted message without AbortError name', async () => {
    // Some environments use different error shapes
    const abortError = new Error('This operation was aborted');
    mockFetch.mockRejectedValue(abortError);

    const err = await client.get('/endpoint').catch((e) => e);
    expect(err.code).toBe('TIMEOUT');
    expect(err.message).toContain('Request timed out');
  });

  it('should throw network error for fetch TypeError', async () => {
    mockFetch.mockRejectedValue(new TypeError('fetch failed'));

    const err = await client.get('/campaigns').catch((e) => e);
    expect(err.code).toBe('NETWORK_ERROR');
    expect(err.message).toContain('Network error');
  });

  it('should include Content-Type header only when body is present', async () => {
    mockFetch.mockImplementation(() =>
      Promise.resolve(new Response(JSON.stringify({}), { status: 200 })),
    );

    await client.get('/campaigns');
    const getHeaders = mockFetch.mock.calls[0][1].headers;
    expect(getHeaders['Content-Type']).toBeUndefined();

    mockFetch.mockClear();
    mockFetch.mockImplementation(() =>
      Promise.resolve(new Response(JSON.stringify({}), { status: 200 })),
    );
    await client.post('/campaigns', { name: 'test' });
    const postHeaders = mockFetch.mock.calls[0][1].headers;
    expect(postHeaders['Content-Type']).toBe('application/json');
  });

  it('should parse error from nested error field in response body', async () => {
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify({ error: 'Route not found' }), { status: 404 }),
    );

    await expect(client.get('/bad-route')).rejects.toThrow('Route not found');
  });

  it('should handle non-JSON error response body', async () => {
    mockFetch.mockResolvedValue(
      new Response('Bad Gateway', { status: 502, statusText: 'Bad Gateway' }),
    );

    await expect(client.get('/campaigns')).rejects.toThrow('Bad Gateway');
  });
});

describe('InstantlyClient retries', () => {
  let client: InstantlyClient;

  beforeEach(() => {
    client = new InstantlyClient({
      apiKey: 'test-key',
      baseUrl: 'https://api.test.com/api/v2',
      maxRetries: 2,
    });
    mockFetch.mockReset();
  });

  it('should retry on 429 and succeed', async () => {
    mockFetch
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ message: 'Rate limited' }), {
          status: 429,
          headers: { 'retry-after': '0' },
        }),
      )
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: '1' }), { status: 200 }));

    const result = await client.get<{ id: string }>('/campaigns');
    expect(result.id).toBe('1');
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('should retry on 500 and succeed', async () => {
    mockFetch
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ message: 'Server error' }), { status: 500 }),
      )
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }));

    const result = await client.get<{ ok: boolean }>('/campaigns');
    expect(result.ok).toBe(true);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('should throw after exhausting retries on timeout', async () => {
    const abortError = new Error('The operation was aborted');
    abortError.name = 'AbortError';
    mockFetch.mockRejectedValue(abortError);

    const err = await client.get('/slow').catch((e) => e);
    expect(err.code).toBe('TIMEOUT');
    // maxRetries=2 means 3 total attempts
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it('should not retry on 401', async () => {
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 }),
    );

    await expect(client.get('/campaigns')).rejects.toThrow('Unauthorized');
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should not retry on 404', async () => {
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify({ message: 'Not found' }), { status: 404 }),
    );

    await expect(client.get('/campaigns/bad')).rejects.toThrow('Not found');
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should not retry on 422', async () => {
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify({ message: 'Validation failed' }), { status: 422 }),
    );

    await expect(client.post('/leads', {})).rejects.toThrow('Validation failed');
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
