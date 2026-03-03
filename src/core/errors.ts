export class InstantlyError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
  ) {
    super(message);
    this.name = 'InstantlyError';
  }
}

export class AuthError extends InstantlyError {
  constructor(message: string) {
    super(message, 'AUTH_ERROR', 401);
    this.name = 'AuthError';
  }
}

export class NotFoundError extends InstantlyError {
  constructor(message: string) {
    super(message, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends InstantlyError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 422);
    this.name = 'ValidationError';
  }
}

export class RateLimitError extends InstantlyError {
  public retryAfter?: number;

  constructor(message: string, retryAfter?: number) {
    super(message, 'RATE_LIMIT', 429);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

export class ServerError extends InstantlyError {
  constructor(message: string, statusCode: number = 500) {
    super(message, 'SERVER_ERROR', statusCode);
    this.name = 'ServerError';
  }
}

export function formatError(error: unknown): { message: string; code: string } {
  if (error instanceof InstantlyError) {
    return { message: error.message, code: error.code };
  }
  if (error instanceof Error) {
    return { message: error.message, code: 'UNKNOWN_ERROR' };
  }
  return { message: String(error), code: 'UNKNOWN_ERROR' };
}
