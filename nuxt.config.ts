// https://nuxt.com/docs/api/configuration/nuxt-config


export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/main.css'],
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/content',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@vueuse/nuxt'
  ],
  fonts: {
    families: [
       { name: 'Viga', provider: 'google' },
    ]
  },
  plugins: [
      // plugins: []
  ],
  content: {
  
  }
})