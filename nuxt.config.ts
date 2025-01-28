// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  
  devtools: { enabled: true },
  
  css: ['~/assets/css/main.css'],
  
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  nitro: {
    runtimeConfig: {
      MONGODB_URI: process.env.MONGODB_URI
    },
    routeRules: {
      '/**': { cors: true }
    }

  },
  app: {
    head: {
      title: 'Notekeep - Keep your notes organized',
    }
  },

  compatibilityDate: '2025-01-20',
})