import process from 'node:process';

const env = process.env.NODE_ENV === 'production'
  ? process.env.ENV ?? 'preview'
  : 'development';
const commit = import.meta.dev
  ? 'DEV'
  : process.env.COMMIT?.slice(0, 7);

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
      title: 'NextStep',
      htmlAttrs: {
        lang: 'en',
      },
      script: [{
        id: 'next-step',
        type: 'application/json',
        innerHTML: JSON.stringify({
          buildTime: Date.now(),
          commit,
          env,
        }),
      }],
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
