import type { SupabaseClient } from '@supabase/supabase-js';
import type { MergeDeep } from 'type-fest';
import type { Tables } from '~/types/database.types';

export type FullTopic = MergeDeep<
  Tables<'topics'>,
  {
    tasks: Tables<'tasks'>[]
    timeline_nodes: Tables<'timeline_nodes'>[]
  }
>;

export async function createTopic(supa: SupabaseClient) {
  const { data } = await supa
    .from('topics')
    .insert({
      title: 'New Topic',
      description: '',
    })
    .select('id')
    .single()
    .throwOnError();

  return data.id;
}

export function deleteTopic(supa: SupabaseClient, id: string) {
  return supa
    .from('topics')
    .delete()
    .eq('id', id)
    .throwOnError();
}
