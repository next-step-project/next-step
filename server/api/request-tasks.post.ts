import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';
import { z } from 'zod';

const Body = z.object({
  id: z.string(),
});

export default defineEventHandler(async (ev) => {
  const body = await readValidatedBody(ev, Body.parse);
  // const user = await serverSupabaseUser(ev);
  const supa = await serverSupabaseClient(ev);

  const taskOwner = await supa
    .from('tasks')
    .select('*')
    .eq('id', body.id)
    .single();

  if (taskOwner.error) {
    console.error('Error querying task owner:', taskOwner.error);
    throw createError({ status: 500, message: 'Failed to query task owner' });
  }

  // todo
});
