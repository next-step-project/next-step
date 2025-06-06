<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

const route = useRoute('/topic/[id]');
const supa = useSupabaseClient();
const user = useSupabaseUser();

const links = ref<[NavigationMenuItem[], NavigationMenuItem[]]>([[], [{
  label: 'New Topic',
  icon: 'i-lucide-plus',
  onSelect: async () => navigateTo(`/topic/${await createTopic(supa)}`),
}/* , {  label: 'Feedback',  icon: 'i-lucide-message-circle',  to: 'https://github.com/nuxt-ui-pro/dashboard',  target: '_blank',} */]]);

const groups = computed(() => [{
  id: 'links',
  label: 'Go to',
  items: links.value.flat().map((item) => {
    return typeof item.to === 'string' && item.to.startsWith('/topic/')
      ? { ...item, icon: 'i-lucide-target', active: route.path === item.to }
      : item;
  }),
}, {
  id: 'code',
  label: 'About',
  items: [{
    id: 'source',
    label: 'View Source Code',
    icon: 'i-simple-icons-github',
    to: 'https://github.com/next-step-project/next-step',
    target: '_blank',
  }],
}]);

onMounted(async () => {
  if (!user.value)
    return;
  links.value[0] = (await listTopics(supa)).map(topic => ({
    label: topic.title,
    icon: 'i-lucide-target',
    to: `/topic/${topic.id}`,
  }));
});
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      resizable
      class="bg-(--ui-bg-elevated)/25"
      :ui="{ footer: 'lg:border-t lg:border-(--ui-border)' }"
    >
      <template #header>
        <UButton
          color="neutral"
          variant="ghost"
          block
          class="text-2xl bg-transparent!"
          to="/"
        >
          <img src="../assets/brand.png" alt="NextStep">
        </UButton>
      </template>

      <template #default>
        <UDashboardSearchButton class="bg-transparent ring-(--ui-border)" />

        <UNavigationMenu :items="links[0]" orientation="vertical" />

        <UNavigationMenu
          :items="links[1]"
          orientation="vertical"
          class="mt-auto"
        />
      </template>

      <template #footer>
        <UUser
          :name="getUserName(user)"
          :avatar="{ text: getUserName(user).slice(0, 1) }"
        />
      </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups />

    <slot />
  </UDashboardGroup>
</template>
