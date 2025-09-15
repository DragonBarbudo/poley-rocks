<template>
  <footer class="w-full bg-base-200 py-8 flex flex-col items-center gap-6 mt-12 border-t-2 border-base-300">
    <div class="text-xl md:text-2xl font-bold text-yellow-950 text-center">
      Gracias por visitarnos y comprar nuestros chocolates!<br>
      Nos volveremos a ver prónto.
    </div>
    <div class="flex flex-col md:flex-row gap-8 items-center justify-center mt-4">
      <div class="card bg-base-100 w-96 shadow-sm">
        <figure>
          <img src="/youtube.webp" alt="YouTube" class="w-full h-48 object-contain bg-white p-4" />
        </figure>
        <div class="card-body">
          <h2 class="card-title">YouTube</h2>
          <p>Visita nuestro canal de YouTube</p>
          <div class="card-actions justify-end">
            <a href="https://www.youtube.com/@wichiwichi" target="_blank" rel="noopener" class="btn btn-neutral text-lg">Ir a YouTube</a>
          </div>
        </div>
      </div>
      <div class="card bg-base-100 w-96 shadow-sm">
        <figure>
          <img src="/roblox.webp" alt="Roblox" class="w-full h-48 object-contain bg-white p-4" />
        </figure>
        <div class="card-body">
          <h2 class="card-title">Roblox</h2>
          <p>Encuentra nuestros juegos de Roblox</p>
          <div class="card-actions justify-end">
            <a href="https://www.roblox.com/es/communities/246048984/Poley-Games#!/about" target="_blank" rel="noopener" class="btn btn-neutral text-lg">Ir a Roblox</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// No script needed
</script>

<style scoped>
footer {
  z-index: 10;
}
</style>
