<template>
  <div>
    <header>
        <h1 class="w-80 mx-w-full mx-auto my-8">
            <img src="assets/images/poley-octo.webp" ref="octo" alt="Poley Rocks Logo" class="w-full"/>
            <img src="assets/images/poley-text.svg" alt="Poley Rocks Logo" class="w-full -mt-16 relative z-10"/>
        </h1>
    </header>
  </div>
</template>


<script setup>
    const octo = useTemplateRef("octo")
    const keyframes = [
      { transform: 'translateY(40px) rotateZ(0)' },
      { transform: 'translateY(0) rotateZ(-1deg)'},
      { transform: 'translateY(40px)  rotateZ(0)' },

    ]
    const { animate } = useAnimate(octo, keyframes, { duration: 3000, iterations: Infinity, easing: 'cubic-bezier(0.33, 0.33, 0.66, 0.66)' })
</script>