import { SetMetadata } from '@nestjs/common';

// If a mode is not specified, it defaults to 'external' (external JWT authentication).
export type AuthMode = 'external' | 'internal' | 'either';

export const AUTH_MODE_KEY = 'authMode';

/**
 * Marks a route as internal only (requires internal JWT authentication).
 */
export function InternalOnly(): ReturnType<typeof SetMetadata> {
  return SetMetadata(AUTH_MODE_KEY, 'internal');
}

/**
 * Marks a route as either token (requires either internal or external JWT authentication).
 */
export function EitherToken(): ReturnType<typeof SetMetadata> {
  return SetMetadata(AUTH_MODE_KEY, 'either');
}
