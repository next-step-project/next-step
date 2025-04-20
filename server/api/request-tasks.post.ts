import process from 'node:process';
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';
import { ChatDeepSeek } from '@langchain/deepseek';
import { z } from 'zod';
import { Tables } from '~/types/database.types';

const Body = z.object({
  id: z.string().uuid(),
});

const model = new ChatDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY, // Default value.
  model: 'deepseek-chat',
});

export default defineEventHandler(async (ev): Promise<Tables<'tasks'>[]> => {
  const body = await readValidatedBody(ev, Body.parse);
  const user = requiresLogin(await serverSupabaseUser(ev));
  const supa = await serverSupabaseClient(ev);

  // Verify ownership
  const { data } = await (supa
    .from('topics')
    .select('title, description, owner, tasks(title, status), timeline_nodes(title, time)')
    .eq('id', body.id)
    .limit(1)
    .throwOnError()
  );
  if (data[0]?.owner !== user.id)
    throw createError({ status: 404, message: 'Task not found' });

  supa.from('topics')
    .update({ requesting_tasks: true })
    .eq('id', body.id)
    .throwOnError();

  const res = await model.invoke([{
    role: 'system',
    content: `You are a helper assistant. You need to help users guide users to obtain more information through specific actions to assist in decision-making.
You may have given suggestions to users before.
You will receive the following information:
- User's major goals
- Description
- Progress
- Existing tasks
You must suggest tasks that are:
1. Related to the user's major goals and description
2. Standing neutral and friendly
3. Not using markdown
4. Including measurable metric, target value, clear deadline, data source
5. Using the same language as the user
You must NOT suggest tasks that are:
1. Repeat the same task, including the same task with different wording
2. Already in the tasks table
3. Already rejected by the user
4. Not executable or off-topic
5. Too broad or vague
You must respond in JSON without any explanation or markdown.
The JSON should be an array of string, each string is a task.
Correct example:
  Topic: Decide on a new car
  Description: I want to buy a new car, but I don't know which one to choose. I have a budget of $30,000 and I love long-distance travel. I don't care a lot about its appearance.
  Progress: Not started.
  Recommended tasks:
    1. Go to SUV and MPV car comparison websites to get more information in 1 hour.
    2. Contact 3 friends who have bought cars in the past 2 years and ask them about their experiences.
    3. Checkout their negative reviews on the car forums.

Current time is ${new Date().toISOString()}.`,
  }, {
    role: 'user',
    content: JSON.stringify(data[0]),
  }]);
  console.log(res);
  const tasks = JSON.parse(res.text) as string[];
  if (!Array.isArray(tasks))
    throw createError({ status: 500, message: 'Invalid LLM response' });

  return (await supa.from('tasks')
    .insert(tasks.map(title => ({
      title,
      status: 'pending' as const,
      topic_id: body.id,
    })))
    .select('*')
    .throwOnError()
  ).data;
});
