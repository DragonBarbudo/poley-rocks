
<template>
<div class="p-5 w-full relative z-50">
    <div class="text-center text-brown-800">
    <div class=" font-bold mb-4 text-xl md:text-3xl">
        Un jueguito con Poley!
    </div>
    <div class="text-lg md:text-xl opacity-70">
        Usa las flechas para moverte o presiona los botones.
    </div>
    </div>
    <div class="w-full  mx-auto rounded-xl overflow-hidden">
        <div>
            
        </div>
    <canvas ref="canvasEl" class="w-full block"/>
    </div>
</div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import kaplay from 'kaplay';
const canvasEl = ref();
let k = null;
let resizeObserver = null;

function isMobile() {
    // Responsive detection: treat as mobile if width < 620px
    return window.innerWidth < 620;
}

function resizeGame() {
    const parent = canvasEl.value.parentElement;
    const width = parent.offsetWidth;
    let height;
    if (isMobile()) {
        height = width; // 1:1 aspect ratio for mobile
    } else {
        height = Math.round(width * 3 / 8); // 8:3 aspect ratio for desktop
    }
    canvasEl.value.width = width;
    canvasEl.value.height = height;
    if (k && k.resize) k.resize(width, height);
}


// Custom kaboom effect function
function addKaboomy(position) {
    // Add the kaboom sprite at the given position
    const kaboom = add([
        sprite("kaboom"),
        pos(position),
        anchor("center"),
        layer("foreground"),
    ]);
    kaboom.play("explode")
    setTimeout(() => {
        destroy(kaboom);
    }, 500); // Adjust time based on animation length

    return kaboom;
}

onMounted(() => {
    resizeGame();
    k = kaplay(
        { canvas: canvasEl.value,
            width: canvasEl.value.width,
            height: canvasEl.value.height,
            narrowPhaseCollisionAlgorithm: "sat",
            background: [4, 153, 220],
            buttons: {
                jump: {
                    keyboard: ["space", "up"],
                    gamepad: ["dpad-up"],
                },
                left: {
                    keyboard: ["left", "a"],
                    gamepad:  ["dpad-left"],
                },
                right: {
                    keyboard: ["right", "d"],
                    gamepad: ["dpad-right"],
                },
                leftM: {
                    mouse: ["left"]
                },
                rightM: {
                    mouse: ["left"]
                },
                release: {}
            },
        });



// load assets
loadSprite("poley", "/plataformer/poley.png");
loadSprite("bag", "/plataformer/poley64.png");
loadSprite("enemy1", "/plataformer/enemy1.png");
loadSprite("enemy2", "/plataformer/enemy2.png");
loadSprite("enemy3", "/plataformer/enemy3.png");
loadSprite("enemy4", "/plataformer/enemy4.png");


loadSprite("spike", "/plataformer/poley64.png");
loadSprite("grass", "/plataformer/grass.png");
loadSprite("ocean", "/plataformer/ocean.png");
loadSprite("prize", "/plataformer/block.png");
loadSprite("apple", "/plataformer/powerup2.png", {sliceX: 2, sliceY: 1, anims: { "shine": { from: 0, to: 1, speed: 4, loop: true } } });
loadSprite("portal", "/plataformer/chocolatey.png", {sliceX: 5, sliceY: 2, anims: { "run": { from: 0, to: 9, speed: 10, loop: true } } });
loadSprite("coin", "/plataformer/chocolate.png");

loadSound("coin", "/plataformer/chocolate.mp3");
loadSound("powerup", "/plataformer/powerup.mp3");
loadSound("blip", "/plataformer/blip.mp3");
loadSound("hit", "/plataformer/hit.mp3");
loadSound("portal", "/plataformer/bubble.mp3");

loadSprite("bg", "/plataformer/bg.png");
loadSprite("gameover", "/plataformer/gameover.png");
loadSprite("win", "/plataformer/win.png");
loadSprite("kaboom", "/plataformer/kaboom.png", {sliceX: 4, sliceY: 1, anims: { "explode": { from: 0, to: 3, speed: 8, loop: false } } });



setGravity(3200);

// custom component controlling enemy patrol movement
function customPatrol(speed = 60, dir = 1) {
    return {
        id: "patrol",
        require: ["pos", "area"],
        add() {
            this.on("collide", (obj, col) => {
                if (col.isLeft()) {
                    dir = 1;
                }
                else if (col.isRight()) {
                    dir = -1;
                    setTimeout(() => {
                    this.jump(200)
                }, Math.random()*500);    
                }
                
            });
        },
        update() {
            this.move(speed * dir, 0);
        },
    };
}
function customPatrolJumper(speed = 60, dir = 1) {
    return {
        id: "patrol",
        require: ["pos", "area"],
        add() {
            this.on("collide", (obj, col) => {
                this.jump()
                if (col.isLeft()) {
                    dir = 1;
                }
                else if (col.isRight()) {
                    dir = -1;
                }
            });
        },
        update() {
            this.move(speed * dir, 0);
        },
    };
}

// custom component that makes stuff grow big
function big() {
    let timer = 0;
    let isBig = false;
    let destScale = 1;
    return {
        // component id / name
        id: "big",
        // it requires the scale component
        require: ["scale"],
        // this runs every frame
        update() {
            if (isBig) {
                timer -= dt();
                if (timer <= 0) {
                    this.smallify();
                }
            }
            this.scale = this.scale.lerp(vec2(destScale), dt() * 6);
        },
        // custom methods
        isBig() {
            return isBig;
        },
        smallify() {
            destScale = 1;
            timer = 0;
            isBig = false;
        },
        biggify(time) {
            destScale = 2;
            timer = time;
            isBig = true;
        },
    };
}

// define some constants
const JUMP_FORCE = 1320;
const MOVE_SPEED = 480;
const FALL_DEATH = 2400;

let directionButton = null


setLayers(["background", "game", "foreground"], "game")


const LEVELS = [
    [
        "   $$                  $    $                   $$$$$$$$    =       ",
        "   ==                  ==   ==                ========      =       ",
        "       $$              ==   ==              =========       =       ",
        "       ===       %                         ==========       =       ",
        "                                          ===               =       ",
        "         => 2 2  =   1   1   1     ==     ====        3     @=       ",
        "====================================   ======================       ",
        "--------------------------------------------------------------------",
    ],
    [
        "     $$$$$$                ",
        "     $$$$$$                ",
        "                           ",
        "                =         $",
        "                   =      $",
        "        = $$ 1=            $",
        "  %      ======           $",
        "                      =   $",
        "                      =    ",
        "       2  3    = 4  1 =   @",
        "===========================",
        "---------------------------",
    ],
    [
        "     $    $    $    $     $",
        "     $    $    $    $     $",
        "     $ == $ == $  = $     $",
        "     $    $    $    $    =$",
        "     $    $    $    $   ==$",
        "     $    $    $    $  ===$",
        "     $    $    $    $ ====$",
        "                     =====$",
        "      1 2 3 4 1 2 3 ======@",
        "===========================",
    ],
];

// define what each symbol means in the level graph
const levelConf = {
    tileWidth: 64,
    tileHeight: 64,
    tiles: {
        "=": () => [
            sprite("grass"),
            area(),
            body({ isStatic: true }),
            anchor("bot"),
            offscreen({ hide: true }),
            "platform",
        ],
        "-": () => [
            sprite("ocean"),
            body({ isStatic: true }),
            offscreen({ hide: true }),
            anchor("bot"),
        ],
        "0": () => [
            sprite("bag"),
            area(),
            body({ isStatic: true }),
            offscreen({ hide: true }),
            anchor("bot"),
        ],
        "$": () => [
            sprite("coin"),
            area(),
            pos(0, -9),
            anchor("bot"),
            offscreen({ hide: true }),
            "coin",
        ],
        "%": () => [
            sprite("prize"),
            area(),
            body({ isStatic: true }),
            anchor("bot"),
            offscreen({ hide: true }),
            "prize",
        ],
        "^": () => [
            sprite("spike"),
            area(),
            body({ isStatic: true }),
            anchor("bot"),
            offscreen({ hide: true }),
            "danger",
        ],
        "#": () => [
            sprite("apple"),
            area(),
            anchor("bot"),
            body(),
            offscreen({ hide: true }),
            "apple",
        ],
        "1": () => [
            sprite("enemy1"),
            area(),
            anchor("bot"),
            body(),
            customPatrolJumper(),
            offscreen({ hide: true }),
            "enemy",
        ],
        "2": () => [
            sprite("enemy2"),
            area(),
            anchor("bot"),
            body(),
            customPatrol(),
            offscreen({ hide: true }),
            "enemy",
        ],
        "3": () => [
            sprite("enemy3"),
            area(),
            anchor("bot"),
            body(),
            customPatrol(),
            offscreen({ hide: true }),
            "enemy",
        ],
        "4": () => [
            sprite("enemy4"),
            area(),
            anchor("bot"),
            body(),
            customPatrol(),
            offscreen({ hide: true }),
            "enemy",
        ],
        "@": () => [
            sprite("portal"),
            area({ scale: 0.5 }),
            anchor("bot"),
            pos(0, -12),
            offscreen({ hide: true }),
            "portal",
            {
                add() {
                    if (this.play) this.play("run");
                }
            }
        ],
    },
};




function addButton(
    txt = "start game",
    p = vec2(200, 100),
    f = () => debug.log("hello"),
    directionBtn = null
) {
    // add a parent background object
    const btn = add([
        rect(80, 80, { radius: 8 }),
        pos(p),
        area(),
        scale(1),
        anchor("center"),
        outline(4),
        color(255, 255, 255),
        fixed(),
        layer("foreground"),
    ]);

    // add a child object that displays the text
    btn.add([
        text(txt),
        anchor("center"),
        color(0, 0, 0),
    ]);

    // onHoverUpdate() comes from area() component
    // it runs every frame when the object is being hovered
    btn.onHoverUpdate(() => {
        const t = time() * 10;
        btn.color = hsl2rgb((t / 10) % 1, 0.6, 0.7);
        btn.scale = vec2(1.2);
        setCursor("pointer");
        directionButton = directionBtn
    });

    // onHoverEnd() comes from area() component
    // it runs once when the object stopped being hovered
    btn.onHoverEnd(() => {
        btn.scale = vec2(1);
        btn.color = rgb();
        directionButton = null
    });

    // onClick() comes from area() component
    // it runs once when the object is clicked
    btn.onClick(f);
    return btn;
}

scene("game", ({ levelId, coins } = { levelId: 0, coins: 0 }) => {
    // add level to scene
    const level = addLevel(LEVELS[levelId ?? 0], levelConf);

    let hasApple = false;

    // Play coin animation for all coins
    if (level.getAll) {
        level.getAll("coin").forEach((coin) => {
            if (coin.play) coin.play("run");
        });
    }


    addButton("←", vec2(58, height()-58), () => null, "left");
    addButton("→", vec2(width()-58, height()-58), () => null, "right");
    addButton("↑", vec2((width()/2), height()-58), () => pressButton("jump"));


    // define player object
    const player = add([
        sprite("poley"),
        pos(0, 0),
        area(),
        scale(1),
        // makes it fall to gravity and jumpable
        body(),
        // the custom component we defined above
        big(),
        anchor("bot"),
    ]);

    // action() runs every frame
    player.onUpdate(() => {
        // center camera to player
        setCamPos(player.pos);
        // check fall death
        if (player.pos.y >= FALL_DEATH) {
            go("lose");
        }
    });

    player.onBeforePhysicsResolve((collision) => {
        if (collision.target.is(["platform", "soft"]) && player.isJumping()) {
            collision.preventResolution();
        }
    });

    player.onPhysicsResolve(() => {
        // Set the viewport center to player.pos
        setCamPos(player.pos);
    });

    // if player onCollide with any obj with "danger" tag, lose
    player.onCollide("danger", () => {
        go("lose");
        play("hit");
    });

    player.onCollide("portal", () => {
        play("portal");

        if (levelId + 1 < LEVELS.length) {
            go("game", {
                levelId: levelId + 1,
                coins: coins,
            });
        }
        else {
            go("win");
        }
    });

    player.onGround((l) => {
        if (l.is("enemy")) {
            player.jump(JUMP_FORCE*.7);
            addKaboomy(l.pos);
            destroy(l);
            play("powerup");
        }
    });

    player.onCollide("enemy", (e, col) => {
        // if it's not from the top, die
        if(!player.isBig()){

            if (!col?.isBottom()) {
                go("lose");
                play("hit");
            }
        } else {


            addKaboomy(e.pos);
            destroy(e);
            play("powerup");
        }
        
    });

    

    // grow an apple if player's head bumps into an obj with "prize" tag
    player.onHeadbutt((obj) => {
        if (obj.is("prize") && !hasApple) {
            const apple = level.spawn("#", obj.tilePos.sub(0, 1));
            apple.jump();
            apple.play("shine");
            hasApple = true;
            play("blip");
        }
    });

    // player grows big onCollide with an "apple" obj
    player.onCollide("apple", (a) => {
        destroy(a);
        // as we defined in the big() component
        player.biggify(3);
        hasApple = false;
        play("powerup");
    });

    let coinPitch = 0;

    onUpdate(() => {
        if (coinPitch > 0) {
            coinPitch = Math.max(0, coinPitch - dt() * 100);
        }
    });

    player.onCollide("coin", (c) => {
        destroy(c);
        play("coin", {
            detune: coinPitch,
        });
        coinPitch += 100;
        coins += 1;
        coinsLabel.text = coins;
    });

    const coinsLabel = add([
        text(coins),
        pos(24, 24),
        fixed(),
    ]);

    function jump() {
        // these 2 functions are provided by body() component
        if (player.isGrounded()) {
            player.jump(JUMP_FORCE);
        }
    }

    // jump with space


    //onKeyPress("space", jump);
    onButtonPress("jump", jump)
    onButtonDown("left", () => { player.move(-MOVE_SPEED, 0); })
    onButtonDown("right", () => { player.move(MOVE_SPEED, 0); })
    onButtonDown("release", () => { player.move(0, 0); })
    
    onButtonDown("leftM", () => { if(directionButton=='left'){ player.move(-MOVE_SPEED, 0); } })
    onButtonDown("rightM", () => { if(directionButton=='right'){ player.move(MOVE_SPEED, 0); } })

  

    const background = add([
        sprite("bg"),
        pos(0, 0),
        fixed(),
        layer("background"),

    ]);


});

scene("lose", () => {


    let gameover = add([
        sprite("gameover"),
        pos(0, 0),
        fixed(),
        layer("background"),
        scale(width()/1800)
    ]);


    setTimeout(()=>{
        go("game");
    }, 1500)
});

scene("win", () => {
    let win = add([
        sprite("win"),
        pos(0, 0),
        fixed(),
        layer("background"),
        scale(width()/1800)
    ]);
    setTimeout(()=>{
        go("game");
    }, 1500)
});

go("game");


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