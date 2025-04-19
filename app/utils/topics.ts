import type { SupabaseClient } from "@supabase/supabase-js"

export async function createTopic(supa: SupabaseClient) {
  const { data } = await supa
    .from('topics')
    .insert({
      title: 'New Topic',
      description: '',
    })
    .select('id')
    .single()
    .throwOnError()

  return data.id;
}
