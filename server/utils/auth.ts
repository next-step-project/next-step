import type { User } from '@supabase/supabase-js';

export function requiresLogin(user: User | null) {
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'You must be logged in to access this resource.',
    });
  }
  return user;
}
