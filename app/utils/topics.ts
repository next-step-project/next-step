import type { MergeDeep } from 'type-fest';
import type { Tables } from '~/types/database.types';

export type FullTopic = MergeDeep<
  Tables<'topics'>,
  {
    tasks: Tables<'tasks'>[]
    timeline_nodes: Tables<'timeline_nodes'>[]
  }
>;

export async function createTopic(supa: Supa) {
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

export function deleteTopic(supa: Supa, id: string) {
  return supa
    .from('topics')
    .delete()
    .eq('id', id)
    .throwOnError();
}

export async function listTopics(supa: Supa) {
  return (await supa
    .from('topics')
    .select('id, title')
    .order('created_at', { ascending: false })
    .throwOnError()
  ).data;
}
