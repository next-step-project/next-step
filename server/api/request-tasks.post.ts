import process from 'node:process';
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';
import { ChatDeepSeek } from '@langchain/deepseek';
import { z } from 'zod';
import ModelResponseSchema from './model-response.schema.json';

const Body = z.object({
  id: z.string().uuid(),
});

const model = new ChatDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY, // Default value.
  model: 'deepseek-chat',
});

export default defineEventHandler(async (ev) => {
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

  const res = await model.invoke([{
    role: 'system',
    content: `You are a helper assistant. You need to help users break down a big goal into several executable small tasks.
You may have given suggestions to users before.
You will receive the following information:
- User's major goals
- Description
- Progress
- Existing tasks
You must suggest tasks that are:
1. Small, clear, and executable, like KRs.
2. Related to the user's major goals and description
3. Standing neutral and friendly
4. Not using markdown
You must NOT suggest tasks that are:
1. Repeat the same task, including the same task with different wording
2. Already in the tasks table
3. Already rejected by the user
4. Not executable or off-topic
5. Too broad or vague
You must respond with a list of tasks in the following JSON format:
\`\`\`json
${JSON.stringify(ModelResponseSchema, null, 2)}
\`\`\`
Current time is ${new Date().toISOString()}.`,
  }, {
    role: 'user',
    content: JSON.stringify(data[0]),
  }]);

  return res.content;
});
