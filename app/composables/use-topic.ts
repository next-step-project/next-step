import type { FullTopic } from '~/utils/topics';

export default async (supa: Supa, id: string) => {
  const data = ref<FullTopic>((await supa
    .from('topics')
    .select('*, tasks(*), timeline_nodes(*)')
    .eq('id', id)
    .single()
    .throwOnError()
  ).data);

  const syncTopic = async () => {
    return await supa.from('topics')
      .update({
        title: data.value.title,
        description: data.value.description,
      })
      .eq('id', id)
      .throwOnError();
  };

  const syncTimelineNode = async (id: string) => {
    const node = toRaw(data.value.timeline_nodes.find(t => t.id === id));
    if (node) {
      await supa.from('timeline_nodes')
        .update({
          title: node.title,
          time: node.time,
          topic_id: node.topic_id,
        })
        .eq('id', id)
        .throwOnError();
    } else {
      await supa.from('timeline_nodes')
        .delete()
        .eq('id', id)
        .throwOnError();
    }
  };

  const addTimelineNode = async () => {
    const { data: n } = await supa.from('timeline_nodes')
      .insert({
        title: '',
        topic_id: id,
      })
      .select('*')
      .throwOnError();
    data.value.timeline_nodes.push(n[0]!);
  };

  const syncTask = async (id: string) => {
    const task = toRaw(data.value.tasks.find(t => t.id === id));
    if (task) {
      await supa.from('tasks')
        .upsert(task)
        .eq('id', id)
        .throwOnError();
    } else {
      await supa.from('tasks')
        .delete()
        .eq('id', id)
        .throwOnError();
    }
  };

  return { data, syncTopic, syncTimelineNode, addTimelineNode, syncTask };
};
