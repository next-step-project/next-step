import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';
import { z } from 'zod';

const Body = z.object({
  id: z.string().uuid(),
});

export default defineEventHandler(async (ev) => {
  const body = await readValidatedBody(ev, Body.parse);
  const user = requiresLogin(await serverSupabaseUser(ev));
  const supa = await serverSupabaseClient(ev);

  // Verify ownership
  const owner = await supa
    .from('topics')
    .select('owner')
    .eq('id', body.id)
    .limit(1)
    .throwOnError();
  if (owner.data[0]?.owner !== user.id)
    throw createError({ status: 404, message: 'Task not found' });

  // Query timeline_nodes for the given topic
  const timelineResponse = await supa
    .from('timeline_nodes')
    .select('*')
    .eq('topic_id', body.id);
  if (timelineResponse.error) {
    console.error('Error querying timeline_nodes:', timelineResponse.error);
    throw createError({ status: 500, message: 'Failed to query timeline_nodes' });
  }
  
  // Query tasks for the given topic
  const tasksResponse = await supa
    .from('tasks')
    .select('*')
    .eq('topic_id', body.id)
    .throwOnError();
  
  // Concatenate timeline_nodes and tasks info
  const timelineText = timelineResponse.data
    .map((node: any) => `${node.title}: ${node.description}`)
    .join('\n');
  const tasksText = tasksResponse.data
    .map((task: any) => `${task.title}: ${task.description} (Status: ${task.status})`)
    .join('\n');
  const contentForDeepseek = timelineText + '\n' + tasksText;
  
  return contentForDeepseek;
});
