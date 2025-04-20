import type { FullTopic } from '~/utils/topics';

export default async (supa: Supa, id: string) => {
  const data = ref<FullTopic>((await supa
    .from('topics')
    .select('*, tasks(*), timeline_nodes(*)')
    .eq('id', id)
    .single()
    .throwOnError()
  ).data);

  const syncTopic = () => {
    return supa
      .from('topics')
      .update({
        title: data.value.title,
        description: data.value.description,
      })
      .eq('id', id)
      .select('*')
      .throwOnError();
  };

  const syncTimelineNode = (id: string) => {
    const node = toRaw(data.value.timeline_nodes.find(t => t.id === id));
    if (node) {
      return supa.from('timeline_nodes')
        .upsert({
          id: node.id,
          title: node.title,
          time: node.time,
          topic_id: node.topic_id,
        })
        .select('*')
        .throwOnError();
    } else {
      return supa.from('timeline_nodes')
        .delete()
        .eq('id', id)
        .throwOnError();
    }
  };

  const syncTask = (id: string) => {
    const task = toRaw(data.value.tasks.find(t => t.id === id));
    if (task) {
      return supa.from('tasks')
        .upsert(task)
        .eq('id', id)
        .select('*')
        .throwOnError();
    } else {
      return supa.from('tasks')
        .delete()
        .eq('id', id)
        .throwOnError();
    }
  };

  return { data, syncTopic, syncTimelineNode, syncTask };
};
