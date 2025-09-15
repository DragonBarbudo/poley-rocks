<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
    <div v-for="(img, i) in images" :key="i" class="rounded-box overflow-hidden shadow-lg bg-base-200">
      <figure>
        <img :src="img.src" :alt="img.alt" class="w-full h-48 object-cover" />
      </figure>
      <div class="p-2 text-center">
        <span class="text-sm text-base-content">{{ img.alt }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const images = [
    { src: '/gallery/6.webp', alt: 'Chocolates Poley.' },
    { src: '/gallery/4.webp', alt: 'Poley de vacaciones.' },
    { src: '/gallery/5.webp', alt: 'Poley en Querétaro.' },
    { src: '/gallery/1.webp', alt: 'Poley con los aztecas.' },
    { src: '/gallery/2.webp', alt: 'Poley en la época medieval.' },
    { src: '/gallery/3.webp', alt: 'Poley en lugares históricos.' },
    { src: '/gallery/7.webp', alt: 'Poley en la música.' },
    { src: '/gallery/8.webp', alt: 'Poley a la vanguardia.' },
];
</script>

<style scoped>
/* Optional: add custom styles if needed */
</style>
