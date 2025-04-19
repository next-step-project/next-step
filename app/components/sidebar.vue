<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

const user = useSupabaseUser();

const items: NavigationMenuItem[][] = [[{
  label: 'Topic 1',
  active: true,
}], [{
  label: 'Feedback',
  icon: 'i-lucide-message-circle',
  to: 'https://github.com/nuxt-ui-pro/dashboard',
  target: '_blank',
}, {
  label: 'Help & Support',
  icon: 'i-lucide-info',
  to: 'https://github.com/nuxt/ui-pro',
  target: '_blank',
}]];
</script>

<template>
  <UPageAside>
    <UDashboardSidebar collapsible resizable :ui="{ footer: 'border-t border-(--ui-border)' }">
      <template #header="{ collapsed }">
        <LogoPro :collapsed="collapsed" class="h-5 w-auto shrink-0" />
      </template>

      <template #default="{ collapsed }">
        <UButton
          :label="collapsed ? undefined : 'Search...'"
          icon="i-lucide-search"
          color="neutral"
          variant="outline"
          block
          :square="collapsed"
        >
          <template v-if="!collapsed" #trailing>
            <div class="flex items-center gap-0.5 ms-auto">
              <UKbd value="meta" variant="subtle" />
              <UKbd value="K" variant="subtle" />
            </div>
          </template>
        </UButton>

        <UNavigationMenu
          :collapsed="collapsed"
          :items="items[0]"
          orientation="vertical"
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="items[1]"
          orientation="vertical"
          class="mt-auto"
        />
      </template>

      <template #footer="{ collapsed }">
        <UButton
          :avatar="{ text: getUserName(user!).slice(0, 1) }"
          :label="getUserName(user!)"
          color="neutral"
          variant="ghost"
          class="w-full"
          :block="collapsed"
        />
      </template>
    </UDashboardSidebar>
  </UPageAside>
</template>
