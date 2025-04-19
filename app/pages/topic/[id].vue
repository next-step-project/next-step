<script setup lang="ts">
import { ref } from 'vue';

const state = ref({
  title: 'Topic 1',
  description: '...',
});
</script>

<template>
  <UDashboardPanel id="topic">
    <template #header>
      <UDashboardNavbar :title="state.title">
        <template #right>
          <UButton variant="outline" color="neutral">
            Delete Topic
          </UButton>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UForm class="space-y-4" :state>
        <UFormField label="Description" hint="Describe it..." size="xl">
          <UTextarea v-model="state.description" class="w-full" />
        </UFormField>

        <div class="grid grid-cols-[1fr_auto_1fr] items-center w-full gap-3">
          <UFormField label="Timeline" size="xl" hint="What did you do...">
            todo
          </UFormField>

          <div class="h-8 border-l ring-inset" />

          <UFormField label="Recommended Tasks" size="xl">
            todo
          </UFormField>
        </div>

        <UFormField label="Tasks" size="xl">
          todo
        </UFormField>
      </UForm>
    </template>
  </UDashboardPanel>
</template>
