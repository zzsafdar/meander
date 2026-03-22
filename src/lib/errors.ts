export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

export class ApiError extends Error {
  readonly statusCode?: number;
  
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

export class GeocodingError extends Error {
  readonly placeName?: string;
  
  constructor(message: string, placeName?: string) {
    super(message);
    this.name = 'GeocodingError';
    this.placeName = placeName;
  }
}

export class RoutingError extends Error {
  readonly mode?: string;
  
  constructor(message: string, mode?: string) {
    super(message);
    this.name = 'RoutingError';
    this.mode = mode;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isGeocodingError(error: unknown): error is GeocodingError {
  return error instanceof GeocodingError;
}

export function isRoutingError(error: unknown): error is RoutingError {
  return error instanceof RoutingError;
}
