<template>
  <div class="bubbles-emitter"
    @pointerdown="onEmitterPointerDown"
    @pointerup="onEmitterPointerUp"
    @pointerleave="onEmitterPointerUp"
    @pointercancel="onEmitterPointerUp"
    @pointermove="onEmitterPointerMove"
  >
    <audio ref="bubbleAudio" src="/bubble.mp3" preload="auto" />
    <transition-group name="bubble-fade" tag="div" v-if="isClient">
      <img
        v-for="bubble in bubbles"
        :key="bubble.id"
        :src="bubbleImg"
        class="bubble"
        :style="bubble.style"
        alt="bubble"
      />
    </transition-group>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
const bubbleAudio = ref(null)
let audioCtx = null


import { nextTick } from 'vue'



const bubbleImg = '/bubbles.svg'
const bubbles = ref([])
const isClient = ref(false)
let bubbleId = 0
let interval, burstTimeout, animationFrame
let isPointerDown = false
let pointerBubbleInterval = null
let lastPointer = { x: null, y: null, rect: null }

function randomBetween(min, max) {
  return Math.random() * (max - min) + min
}

function createBubble(x = null, burst = false, yPx = null) {
  const size = randomBetween(14, 36)
  const left = x !== null ? x : randomBetween(0, 100)
  const duration = randomBetween(3, 7)
  const amplitude = randomBetween(20, 60)
  const phase = Math.random() * Math.PI * 2
  const zigzag = Math.random() > 0.5
  const start = performance.now()
  // If yPx is null, start from bottom (-40px), else from yPx px from bottom
  let yStart
  if (yPx === null) {
    yStart = -40
  } else {
    yStart = window.innerHeight - yPx
  }
  const id = bubbleId++
  const bubble = {
    id,
    size,
    left,
    duration,
    amplitude,
    phase,
    zigzag,
    start,
    y: yStart, // px from bottom
    x: left,
    yStart,
    opacity: 0.8,
    style: {
      position: 'absolute',
      bottom: `${yStart}px`,
      left: `${left}%`,
      width: `${size}px`,
      height: 'auto',
      pointerEvents: 'none',
      opacity: 0.8,
      transition: 'opacity 0.5s',
    }
  }
  bubbles.value.push(bubble)
  // If burst, create more bubbles at same x/y
  if (burst) {
    const count = Math.floor(randomBetween(4, 8))
    for (let i = 0; i < count; i++) {
      setTimeout(() => createBubble(left, false, yPx), i * 100)
    }
  }
}


function isBubbleOrButton(target) {
  // Check if the clicked element is a bubble or inside a button
  if (!target) return false
  if (target.classList && target.classList.contains('bubble')) return true
  if (target.closest && target.closest('button, a, .bubble')) return true
  return false
}

function playBubbleSound() {
  if (!bubbleAudio.value) return
  // Use Web Audio API for pitch control
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  const source = audioCtx.createBufferSource()
  fetch(bubbleAudio.value.src)
    .then(res => res.arrayBuffer())
    .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer))
    .then(audioBuffer => {
      source.buffer = audioBuffer
      // Randomize pitch between 0.92 and 1.08
      source.playbackRate.value = 0.1 + Math.random() * 1.16
      source.connect(audioCtx.destination)
      source.start(0)
    })
}

function onEmitterPointerDown(e) {
  if (isBubbleOrButton(e.target)) return
  isPointerDown = true
  const emitter = e.currentTarget
  const rect = emitter.getBoundingClientRect()
  lastPointer.rect = rect
  lastPointer.x = e.clientX
  lastPointer.y = e.clientY
  function emitBubbles() {
    if (!isPointerDown) return
    const x = ((lastPointer.x - rect.left) / rect.width) * 100
    const yPx = lastPointer.y - rect.top
    createBubble(x, true, yPx)
    playBubbleSound()
    pointerBubbleInterval = setTimeout(emitBubbles, 120)
  }
  emitBubbles()
}

function onEmitterPointerMove(e) {
  if (!isPointerDown) return
  if (!lastPointer.rect) return
  lastPointer.x = e.clientX
  lastPointer.y = e.clientY
}

function onEmitterPointerUp() {
  isPointerDown = false
  if (pointerBubbleInterval) {
    clearTimeout(pointerBubbleInterval)
    pointerBubbleInterval = null
  }
}

function randomBurst() {
  const x = randomBetween(10, 90)
  createBubble(x, true)
  burstTimeout = setTimeout(randomBurst, randomBetween(3000, 7000))
}


function animateBubbles(now) {
  const viewportHeight = window.innerHeight
  for (const bubble of bubbles.value) {
    const elapsed = (now - bubble.start) / 1000
    const progress = elapsed / bubble.duration
    // Move up from yStart
    const y = bubble.yStart + progress * (viewportHeight + 40 - bubble.yStart)
    // Zig-zag or wave
    const xOffset = bubble.zigzag
      ? bubble.amplitude * Math.sin(progress * 4 * Math.PI + bubble.phase)
      : bubble.amplitude * Math.cos(progress * 2 * Math.PI + bubble.phase)
    bubble.style.bottom = `${y}px`
    bubble.style.left = `calc(${bubble.left}% + ${xOffset}px)`
    bubble.style.opacity = 0.8 * (1 - progress)
    // Mark for removal if out of viewport or invisible
    if (y > viewportHeight + 40 || bubble.style.opacity <= 0.01) {
      bubble.opacity = 0
    }
  }
  // Remove bubbles that are invisible or out of viewport
  bubbles.value = bubbles.value.filter(b => b.opacity > 0)
  animationFrame = requestAnimationFrame(animateBubbles)
}

onMounted(() => {
  isClient.value = true
  interval = setInterval(() => createBubble(), 400)
  burstTimeout = setTimeout(randomBurst, randomBetween(3000, 7000))
  animationFrame = requestAnimationFrame(animateBubbles)
})

onBeforeUnmount(() => {
  clearInterval(interval)
  clearTimeout(burstTimeout)
  cancelAnimationFrame(animationFrame)
  if (pointerBubbleInterval) clearTimeout(pointerBubbleInterval)
})
</script>

<style scoped>
.bubbles-emitter {
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: auto;
  z-index: 0;
  overflow: hidden;
}
.bubble {
  will-change: transform, opacity;
  opacity: 0.8;
  pointer-events: none;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
/* Keyframes removed: now handled by JS */
.bubble-fade-enter-active, .bubble-fade-leave-active {
  transition: opacity 0.5s;
}
.bubble-fade-enter-from, .bubble-fade-leave-to {
  opacity: 0;
}
</style>
