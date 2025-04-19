import type { User } from '@supabase/supabase-js';

export function getUserName(user: User | null): string {
  return user
    ? user.user_metadata.full_name || user.email?.split('@')[0]
    : '?';
}
