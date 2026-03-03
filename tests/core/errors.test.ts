import { describe, it, expect } from 'vitest';
import {
  InstantlyError,
  AuthError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  ServerError,
  formatError,
} from '../../src/core/errors.js';

describe('Error classes', () => {
  it('InstantlyError has code and statusCode', () => {
    const err = new InstantlyError('test', 'TEST_CODE', 400);
    expect(err.message).toBe('test');
    expect(err.code).toBe('TEST_CODE');
    expect(err.statusCode).toBe(400);
    expect(err.name).toBe('InstantlyError');
  });

  it('AuthError defaults to 401', () => {
    const err = new AuthError('bad key');
    expect(err.code).toBe('AUTH_ERROR');
    expect(err.statusCode).toBe(401);
  });

  it('NotFoundError defaults to 404', () => {
    const err = new NotFoundError('missing');
    expect(err.code).toBe('NOT_FOUND');
    expect(err.statusCode).toBe(404);
  });

  it('ValidationError defaults to 422', () => {
    const err = new ValidationError('bad input');
    expect(err.code).toBe('VALIDATION_ERROR');
    expect(err.statusCode).toBe(422);
  });

  it('RateLimitError tracks retryAfter', () => {
    const err = new RateLimitError('slow down', 10);
    expect(err.code).toBe('RATE_LIMIT');
    expect(err.retryAfter).toBe(10);
  });

  it('ServerError accepts custom status code', () => {
    const err = new ServerError('bad gateway', 502);
    expect(err.code).toBe('SERVER_ERROR');
    expect(err.statusCode).toBe(502);
  });
});

describe('formatError', () => {
  it('formats InstantlyError with code', () => {
    const result = formatError(new AuthError('Invalid API key'));
    expect(result).toEqual({ message: 'Invalid API key', code: 'AUTH_ERROR' });
  });

  it('formats timeout InstantlyError', () => {
    const result = formatError(new InstantlyError('Request timed out after 30s: GET /test', 'TIMEOUT'));
    expect(result.code).toBe('TIMEOUT');
    expect(result.message).toContain('timed out');
  });

  it('formats raw AbortError as TIMEOUT', () => {
    const err = new Error('The operation was aborted');
    err.name = 'AbortError';
    const result = formatError(err);
    expect(result.code).toBe('TIMEOUT');
    expect(result.message).toContain('timed out');
  });

  it('formats abort message without AbortError name as TIMEOUT', () => {
    const err = new Error('This operation was aborted');
    const result = formatError(err);
    expect(result.code).toBe('TIMEOUT');
  });

  it('formats ECONNREFUSED as NETWORK_ERROR', () => {
    const err = new Error('connect ECONNREFUSED 127.0.0.1:443');
    const result = formatError(err);
    expect(result.code).toBe('NETWORK_ERROR');
  });

  it('formats ENOTFOUND as NETWORK_ERROR', () => {
    const err = new Error('getaddrinfo ENOTFOUND api.instantly.ai');
    const result = formatError(err);
    expect(result.code).toBe('NETWORK_ERROR');
  });

  it('formats generic Error as UNKNOWN_ERROR', () => {
    const result = formatError(new Error('something broke'));
    expect(result).toEqual({ message: 'something broke', code: 'UNKNOWN_ERROR' });
  });

  it('formats non-Error values as UNKNOWN_ERROR', () => {
    const result = formatError('string error');
    expect(result).toEqual({ message: 'string error', code: 'UNKNOWN_ERROR' });
  });

  it('formats null/undefined as UNKNOWN_ERROR', () => {
    expect(formatError(null).code).toBe('UNKNOWN_ERROR');
    expect(formatError(undefined).code).toBe('UNKNOWN_ERROR');
  });
});
