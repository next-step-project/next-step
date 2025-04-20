<script setup lang="ts">
import type { CalendarDate } from '@internationalized/date';
import { DateFormatter, getLocalTimeZone } from '@internationalized/date';

const df = new DateFormatter('en-US', {
  dateStyle: 'medium',
});

const value = defineModel<CalendarDate>();
</script>

<template>
  <UPopover>
    <UButton color="neutral" variant="subtle" icon="i-lucide-calendar" v-bind="$attrs">
      {{ value ? df.format(value.toDate(getLocalTimeZone())) : 'Select a date' }}
    </UButton>

    <template #content>
      <UCalendar v-model="value" class="p-2" />
    </template>
  </UPopover>
</template>
