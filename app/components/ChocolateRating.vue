<template>
  <div class="flex flex-col items-center gap-6 px-6 py-20  rounded-box shadow-lg bg-orange-600/50">
    <template v-if="!submitted">
      <h2 class="text-xl md:text-5xl font-bold text-yellow-950">¿Ya probaste los chocolates Poley?</h2>
      <p class="text-lg md:text-xl text-base-content">¿Qué calificación les darías?</p>
      <div class="flex flex-wrap justify-center gap-3 mt-4">
        <button
          v-for="n in 5"
          :key="n"
          class="btn btn-xl btn-circle text-6xl transition-transform duration-150 hover:scale-125 focus:scale-125 flex items-center justify-center"
          :class="rating === n ? 'btn-neutral text-orange-600 scale-125' : 'btn-ghost'"
          @click="rate(n)"
          :aria-label="`Calificación ${n}`"
        >
          <IconifyIcon class="!text-xl" :icon="icons[n-1]" />
        </button>
      </div>
    </template>
    <div v-else class="alert alert-success mt-4 text-lg md:text-2xl font-semibold text-center">¡Gracias por tu calificación y por tu compra!</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Icon as IconifyIcon } from '@iconify/vue'
import PocketBase from 'pocketbase'


const rating = ref(null)
const submitted = ref(false)
const icons = [
  'icon-park-twotone:disappointed-face',
  'icon-park-twotone:neutral-face',
  'icon-park-twotone:smiling-face',
  'icon-park-twotone:grinning-face-with-squinting-eyes',
  'icon-park-twotone:astonished-face',
]

const pb = new PocketBase('https://abrir.pockethost.io')
// Map rating value to record id in PocketBase (replace with your actual record ids)
const ratingRecordIds = [
  '6mszgiaml4313s3', // record id for rating 0
  '5kxr1q7lqvrbi9q', // record id for rating 1
  'i9bydqiqkmmmcpk', // record id for rating 2
  'ymoapyxa6sl52b0', // record id for rating 3
  'v3aejo12sciijde', // record id for rating 4
]

async function rate(val) {
  rating.value = val
  try {
    const recId = ratingRecordIds[val]
    const rec = await pb.collection('poleyrating').getOne(recId)
    const newValue = (rec.value || 0) + 1
    await pb.collection('poleyrating').update(recId, { value: newValue })
    submitted.value = true

  } catch (e) {
    alert('Error enviando tu calificación')
  }
}
</script>

<style scoped>
.btn-circle {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  font-size: 1.5rem;
  box-shadow: 0 2px 8px 0 #0002;
}
.btn-circle :deep(svg) {
  font-size: 2.5rem;
  width: 3rem;
  height: 3rem;
}
</style>
