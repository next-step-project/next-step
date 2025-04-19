<script setup lang="ts">
const route = useRoute();
const layout = computed(() => {
  return route.path === '/login'
    ? 'special'
    : 'default';
});
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />
    <NuxtLayout :name="layout">
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
