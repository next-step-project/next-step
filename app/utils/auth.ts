import type { User } from '@supabase/supabase-js';

export function getUserName(user: User): string {
  return user.user_metadata.full_name || user.email?.split('@')[0];
}
