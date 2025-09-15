
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
    <NuxtRouteAnnouncer />
    <Footer />
</template>

<script setup>
import Footer from '~/components/Footer.vue'
useHead({
  htmlAttrs: {
    'data-theme': 'caramellate'
  },
  script: [
    {
      src: 'https://umami-production-0033e.up.railway.app/script.js',
      defer: true,
      'data-website-id': '45694e13-05a0-419f-9d64-4fcdddfcd55e',
    },
  ],
})
</script>
