<script setup lang="ts">
const route = useRoute();

const { data: topic } = useAsyncData(() => useTopic(route.params.id as string));

function generate() {
  $fetch('/api/request-tasks', {
    method: 'post',
    body: { id: topic.value?.id },
  });
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
        <UFormField label="Description" hint="Describe it..." size="xl">
          <UTextarea v-model="topic.description" class="w-full" />
        </UFormField>

        <div class="grid grid-cols-[1fr_auto_1fr] items-center w-full gap-3">
          <UFormField label="Timeline" size="xl" hint="What did you do...">
            todo list
          </UFormField>

          <div class="h-8 border-l ring-inset" />

          <UFormField label="Recommended Tasks" size="xl" :ui="{ label: 'items-start' }">
            <ul>
              <template v-for="(task) in topic.tasks">
                <UCheckbox
                  v-if="task.status === 'pending'"
                  :key="task.id"
                  class="w-full"
                  :default-value="false"
                  as="li"
                  @update:model-value="task.status = 'accepted'"
                >
                  <template #label>
                    <UButton variant="soft" color="neutral" size="xs" icon="lucide:trash-2" />
                    {{ ' ' }}
                    <span class="align-top">{{ task.title }}</span>
                  </template>
                </UCheckbox>
              </template>
            </ul>

            <template #hint>
              <UButton @click="generate">
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
                @update:model-value="(v) => task.status = v ? 'completed' : 'accepted'"
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
