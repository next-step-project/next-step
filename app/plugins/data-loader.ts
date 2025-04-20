// https://uvr.esm.is/data-loaders/nuxt.html#nuxt
import { DataLoaderPlugin } from 'unplugin-vue-router/data-loaders';

export default defineNuxtPlugin({
  name: 'data-loaders',
  dependsOn: ['nuxt:router'],
  setup(nuxtApp) {
    nuxtApp.vueApp.use(DataLoaderPlugin, {
      router: nuxtApp.vueApp.config.globalProperties.$router,
      isSSR: import.meta.server,
    });
  },
});
