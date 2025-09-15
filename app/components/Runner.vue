<template>
    <div class="w-full relative z-50">
        <canvas ref="canvasEl" class="border border-black w-full block" style="aspect-ratio: 8/3;"/>
    </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import kaplay from 'kaplay';
const canvasEl = ref();
let k = null;
let resizeObserver = null;

function resizeGame() {
    const parent = canvasEl.value.parentElement;
    const width = parent.offsetWidth;
    const height = Math.round(width * 3 / 8); // 8:3 aspect ratio
    canvasEl.value.width = width;
    canvasEl.value.height = height;
    if (k && k.resize) k.resize(width, height);
}

onMounted(() => {
    resizeGame();
    k = kaplay({ canvas: canvasEl.value, width: canvasEl.value.width, height: canvasEl.value.height });

    const FLOOR_HEIGHT = 48;
    const JUMP_FORCE = 1200;
    const SPEED = 480;

    k.setBackground(141, 183, 255);
    k.loadSprite("bean", "/runner/poley64.png");
    k.loadSprite("enemy1", "/runner/enemy1.png");

    k.scene("game", () => {

        k.setGravity(4000);

        const player = k.add([
            k.sprite("bean"),
            k.pos(80, 40),
            k.area(),
            k.body(),
        ]);

        k.add([
            k.rect(k.width(), FLOOR_HEIGHT),
            k.outline(4),
            k.pos(0, k.height()),
            k.anchor("botleft"),
            k.area(),
            k.body({ isStatic: true }),
            k.color(132, 101, 236),
        ]);

        // Double jump logic
        let jumps = 0;
        const MAX_JUMPS = 2;

        function jump() {
            if (jumps < MAX_JUMPS) {
                player.jump(JUMP_FORCE);
                jumps++;
            }
        }

        // Reset jumps when grounded
        player.onUpdate(() => {
            if (player.isGrounded()) {
                jumps = 0;
            }
        });

        k.onKeyPress("space", jump);
        k.onClick(jump);

        function spawnTree() {
            k.add([
                k.sprite("enemy1"),
                k.area(),
                k.outline(4),
                k.pos(k.width(), k.height() - FLOOR_HEIGHT),
                k.anchor("botleft"),
                k.color(238, 143, 203),
                k.move(k.LEFT, SPEED),
                k.offscreen({ destroy: true }),
                "tree",
            ]);
            k.wait(k.rand(0.5, 1.5), spawnTree);
        }

        spawnTree();

        player.onCollide("tree", () => {
            k.go("lose", score);
            k.burp();
            k.addKaboom(player.pos);
        });

        let score = 0;
        const scoreLabel = k.add([
            k.text(score.toString()),
            k.pos(24, 24),
        ]);

        k.onUpdate(() => {
            score++;
            scoreLabel.text = score.toString();
        });
    });

    k.scene("lose", (score) => {
        k.add([
            k.sprite("bean"),
            k.pos(k.width() / 2, k.height() / 2 - 64),
            k.scale(2),
            k.anchor("center"),
        ]);

        k.add([
            k.text(score),
            k.pos(k.width() / 2, k.height() / 2 + 64),
            k.scale(2),
            k.anchor("center"),
        ]);

        k.onKeyPress("space", () => k.go("game"));
        k.onClick(() => k.go("game"));
    });

    k.go("game");

    // Observe parent width for responsiveness
    resizeObserver = new ResizeObserver(resizeGame);
    resizeObserver.observe(canvasEl.value.parentElement);
});

onBeforeUnmount(() => {
    if (resizeObserver && canvasEl.value?.parentElement) {
        resizeObserver.unobserve(canvasEl.value.parentElement);
    }
});


</script>