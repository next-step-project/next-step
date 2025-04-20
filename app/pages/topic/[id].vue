<script setup lang="ts">
import type { CalendarDate } from '@internationalized/date';
import type { Tables } from '~/types/database.types';
import { toCalendarDate, getLocalTimeZone, fromDate } from '@internationalized/date';

const route = useRoute();
const supa = useSupabaseClient();

const {
  data: topic,
  syncTopic,
  syncTimelineNode,
  addTimelineNode,
  syncTask,
} = await useTopic(supa, route.params.id as string);
const generating = ref(!!topic.value.requesting_tasks);

async function generate() {
  generating.value = true;
  try {
    const generated = await $fetch('/api/request-tasks', {
      method: 'post',
      body: { id: topic.value?.id },
    });
    topic.value.tasks.push(...generated);
  } catch (e) {
    console.error(e);
  }
  generating.value = false;
}

function removeTimelineNode(id: string) {
  topic.value.timeline_nodes = topic.value.timeline_nodes.filter(n => n.id !== id);
  syncTimelineNode(id);
}

function onPickDate(node: Tables<'timeline_nodes'>, v: CalendarDate) {
  if (!v)
    return;
  node.time = v.toString();
  syncTimelineNode(node.id);
}
</script>

<template>
  <UDashboardPanel id="topic">
    <template #header>
      <UDashboardNavbar :title="topic?.title">
        <template #right>
          <UButton variant="outline" color="neutral">
            Delete Topic
          </UButton>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UForm v-if="topic" class="space-y-4" :state="topic">
        <UFormField label="Description" hint="What's it about? What's your condition?" size="xl">
          <UTextarea v-model="topic.description" class="w-full" autoresize @change="syncTopic()" />
        </UFormField>

        <div class="grid grid-cols-[1fr_auto_1fr] items-start w-full gap-3">
          <UFormField label="Timeline" size="xl" hint="What did you do..." class="flex flex-col">
            <div class="space-y-2">
              <div v-for="node in topic.timeline_nodes" :key="node.id" class="flex items-start gap-2">
                <DatePicker
                  :model-value="toCalendarDate(fromDate(new Date(node.time), getLocalTimeZone()))"
                  class="w-[140px]"
                  size="sm"
                  @update:model-value="(v) => v && onPickDate(node, v)"
                />

                <UTextarea
                  v-model="node.title"
                  autoresize
                  :rows="1"
                  class="flex-grow"
                  placeholder="Description..."
                  size="sm"
                  @change="syncTimelineNode(node.id)"
                />
                
                <UButton
                  icon="i-heroicons-trash"
                  size="sm"
                  color="neutral"
                  square
                  variant="ghost"
                  @click="removeTimelineNode(node.id)"
                />
              </div>
            </div>

            <UButton
              label="Add Node"
              icon="i-heroicons-plus"
              size="sm"
              variant="outline"
              color="neutral"
              class="mt-2 self-start"
              @click="addTimelineNode()"
            />
          </UFormField>

          <div class="h-full border-l border-2 border-(--ui-border-accented) self-stretch mt-6" />

          <UFormField label="Recommended Tasks" size="xl" :ui="{ label: 'items-start' }">
            <ul>
              <template v-for="task in topic.tasks">
                <UCheckbox
                  v-if="task.status === 'pending'"
                  :key="task.id"
                  class="w-full"
                  :default-value="false"
                  as="li"
                  @update:model-value="task.status = 'accepted'; syncTask(task.id)"
                >
                  <template #label>
                    <UButton
                      variant="soft"
                      color="neutral"
                      size="xs"
                      icon="lucide:trash-2"
                      @click="task.status = 'rejected'; syncTask(task.id)"
                    />
                    {{ ' ' }}
                    <span class="align-top">{{ task.title }}</span>
                  </template>
                </UCheckbox>
              </template>
            </ul>

            <template #hint>
              <UButton :loading="generating" @click="generate">
                Generate suggestions
              </UButton>
            </template>
          </UFormField>
        </div>

        <UFormField label="Tasks" size="xl">
          <ul>
            <template v-for="(task) in topic.tasks">
              <UCheckbox
                v-if="task.status === 'accepted' || task.status === 'completed'"
                :key="task.id"
                :default-value="false"
                as="li"
                @update:model-value="(v) => (task.status = v ? 'completed' : 'accepted') && syncTask(task.id)"
              >
                <template #label>
                  <UButton variant="soft" color="neutral" size="xs" icon="lucide:trash-2" />
                  {{ ' ' }}
                  <span class="align-top">{{ task.title }}</span>
                </template>
              </UCheckbox>
            </template>
          </ul>
        </UFormField>
      </UForm>
    </template>
  </UDashboardPanel>
</template>
