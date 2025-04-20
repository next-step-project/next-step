import type { Supa } from '~/utils/supabase';
import type { FullTopic } from '~/utils/topics';

async function createTopic(supa: Supa) {
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

export default async (id?: string): Promise<FullTopic> => {
  const supa = useSupabaseClient();
  if (!id)
    id = await createTopic(supa);

  return (await useSupabaseClient()
    .from('topics')
    .select('*, tasks(*), timeline_nodes(*)')
    .eq('id', id!)
    .single()
    .throwOnError()
  ).data;
};
