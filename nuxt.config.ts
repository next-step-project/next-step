export default defineNuxtConfig({
  compatibilityDate: '2025-04-19',

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxtjs/supabase',
    '@nuxt/ui-pro',
    '@vueuse/nuxt',
  ],

  ssr: false,

  app: {
    head: {
      title: 'Next Step',
      htmlAttrs: {
        lang: 'en',
      },
    },
  },

  css: ['~/assets/main.css'],

  fonts: {
    provider: 'bunny',
    providers: {
      google: false,
    },
  },

  devServer: {
    port: 8108,
  },
});
