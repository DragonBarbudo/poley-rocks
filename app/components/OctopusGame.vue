<template>
  <div class="octopus-game-container">
    <canvas ref="canvas" width="800" height="200" @click="onCanvasClick" style="image-rendering: pixelated;"></canvas>
    <div v-if="showMessage" class="octo-message-overlay">{{ message }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Kaplay from 'kaplay'


const canvas = ref(null)
const showMessage = ref(true)
const message = ref('Click to Start')
let game = null
let runner = null
let running = false
let jumpRequested = false
let obstacles = []
let flag = null

function onCanvasClick() {
  if (!running) {
    startGame()
    return
  }
  jumpRequested = true
}

function startGame() {
  showMessage.value = false
  message.value = ''
  running = true
  if (game) game.destroy()
  game = new Kaplay({ canvas: canvas.value, width: 800, height: 200 })
  const scene = new Kaplay.Scene()
  // Ground (simple black line)
  scene.add(new Kaplay.Rect({ x: 0, y: 180, width: 800, height: 20, color: '#000' }))
  // Octopus (player, simple black square)
  runner = new Kaplay.Rect({ x: 40, y: 140, width: 20, height: 20, color: '#000' })
  runner.vy = 0
  runner.jumping = false
  scene.add(runner)
  // Obstacles (simple black squares)
  obstacles = []
  for (let i = 0; i < 3; i++) {
    const ox = 200 + i * 180 + Math.random() * 60
    const obs = new Kaplay.Rect({ x: ox, y: 160, width: 20, height: 20, color: '#000' })
    obstacles.push(obs)
    scene.add(obs)
  }
  // Flag (simple black rectangle)
  flag = new Kaplay.Rect({ x: 700, y: 120, width: 10, height: 60, color: '#000' })
  scene.add(flag)
  // Game loop
  game.onUpdate = () => {
    // Move runner
  runner.x += 4
    // Gravity
    runner.y += runner.vy
    runner.vy += 0.7
    if (runner.y > 140) {
      runner.y = 140
      runner.vy = 0
      runner.jumping = false
    }
    // Jump
    if (jumpRequested && !runner.jumping) {
      runner.vy = -12
      runner.jumping = true
      jumpRequested = false
    }
    // Collisions
    for (const obs of obstacles) {
      if (
        runner.x + runner.width > obs.x &&
        runner.x < obs.x + obs.width &&
        runner.y + runner.height > obs.y &&
        runner.y < obs.y + obs.height
      ) {
        running = false
        showMessage.value = true
        message.value = 'Game Over! Click to Restart'
        game.stop()
      }
    }
    // Win
    if (runner.x + runner.width > flag.x) {
      running = false
      showMessage.value = true
      message.value = 'You Win!'
      game.stop()
    }
  }
  game.start()
}

onMounted(() => {
  showMessage.value = true
  message.value = 'Click to Start'
})
onBeforeUnmount(() => {
  if (game) game.destroy()
})
</script>

<style scoped>
.octopus-game-container {
  position: relative;
  width: 800px;
  height: 200px;
  margin: 32px auto;
}
canvas { background: #fff; display: block; border: 1px solid #000; }
.octo-message-overlay {
  position: absolute;
  left: 0; right: 0; top: 40px;
  text-align: center;
  font-size: 1.5rem;
  z-index: 10;
  font-weight: bold;
  pointer-events: none;
  user-select: none;
}
</style>
