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
  compatibilityDate: '2025-01-20',
})