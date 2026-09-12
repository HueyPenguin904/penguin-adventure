import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs";

// Initialize Kaboom
kaboom({
    width: 800,
    height: 500,
    background: [135, 206, 235], // Sky blue
    canvas: document.querySelector("canvas") || undefined,
});

// Load sprites using simple shapes for now
loadSprite("penguin", "data:image/svg+xml," + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40">
  <ellipse cx="16" cy="24" rx="14" ry="16" fill="#1a1a2e"/>
  <ellipse cx="16" cy="24" rx="10" ry="12" fill="white"/>
  <circle cx="11" cy="18" r="3" fill="white"/>
  <circle cx="21" cy="18" r="3" fill="white"/>
  <circle cx="11" cy="18" r="1.5" fill="black"/>
  <circle cx="21" cy="18" r="1.5" fill="black"/>
  <polygon points="16,22 13,26 19,26" fill="orange"/>
  <ellipse cx="10" cy="36" rx="4" ry="3" fill="orange"/>
  <ellipse cx="22" cy="36" rx="4" ry="3" fill="orange"/>
</svg>
`));

loadSprite("fish", "data:image/svg+xml," + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="16">
  <ellipse cx="10" cy="8" rx="9" ry="6" fill="#ff6b6b"/>
  <polygon points="20,8 24,2 24,14" fill="#ff6b6b"/>
  <circle cx="5" cy="6" r="2" fill="white"/>
  <circle cx="5" cy="6" r="1" fill="black"/>
</svg>
`));

loadSprite("platform", "data:image/svg+xml," + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="32">
  <rect width="64" height="32" fill="#8fbc8f" rx="4"/>
  <rect y="4" width="64" height="4" fill="#6b8e6b"/>
</svg>
`));

loadSprite("ground", "data:image/svg+xml," + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
  <rect width="64" height="64" fill="#90EE90"/>
  <rect y="0" width="64" height="8" fill="#228B22"/>
</svg>
`));

loadSprite("cloud", "data:image/svg+xml," + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="80" height="40">
  <ellipse cx="25" cy="25" rx="20" ry="12" fill="white" opacity="0.8"/>
  <ellipse cx="45" cy="20" rx="25" ry="15" fill="white" opacity="0.8"/>
  <ellipse cx="60" cy="25" rx="18" ry="10" fill="white" opacity="0.8"/>
</svg>
`));

loadSprite("star", "data:image/svg+xml," + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
  <polygon points="12,2 15,9 22,9 16,14 18,22 12,17 6,22 8,14 2,9 9,9" fill="gold"/>
</svg>
`));

loadSprite("wiggle", "data:image/svg+xml," + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="32">
  <ellipse cx="20" cy="20" rx="18" ry="10" fill="#8B4513"/>
  <ellipse cx="20" cy="20" rx="14" ry="6" fill="#DEB887"/>
  <circle cx="34" cy="16" r="6" fill="#8B4513"/>
  <circle cx="32" cy="14" r="2" fill="black"/>
  <ellipse cx="36" cy="16" rx="3" ry="2" fill="pink"/>
  <path d="M 2 20 Q -5 15 2 10" stroke="#8B4513" stroke-width="3" fill="none"/>
</svg>
`));

// Game state
let score = 0;
let fishCollected = 0;
const TOTAL_FISH = 5;

// Scene: Main Menu
scene("menu", () => {
    add([
        text("🐧 Penguin Adventure 🐧", { size: 36 }),
        pos(width() / 2, 120),
        anchor("center"),
        color(30, 30, 60),
    ]);

    add([
        text("Help Huey find Wiggle!", { size: 24 }),
        pos(width() / 2, 180),
        anchor("center"),
        color(60, 60, 90),
    ]);

    add([
        text("Collect all the fish along the way!", { size: 18 }),
        pos(width() / 2, 220),
        anchor("center"),
        color(80, 80, 110),
    ]);

    const playBtn = add([
        rect(200, 60, { radius: 10 }),
        pos(width() / 2, 320),
        anchor("center"),
        color(100, 200, 100),
        area(),
        "playBtn",
    ]);

    add([
        text("PLAY!", { size: 32 }),
        pos(width() / 2, 320),
        anchor("center"),
        color(255, 255, 255),
    ]);

    onClick("playBtn", () => {
        go("game");
    });

    onKeyPress("space", () => {
        go("game");
    });
});

// Scene: Game
scene("game", () => {
    score = 0;
    fishCollected = 0;

    // Gravity
    setGravity(1200);

    // Background clouds
    for (let i = 0; i < 5; i++) {
        add([
            sprite("cloud"),
            pos(rand(0, 900), rand(20, 150)),
            opacity(0.7),
            z(-1),
            "cloud",
        ]);
    }

    // Level layout
    // @ = player, # = ground, = = platform, f = fish, W = Wiggle (goal)
    const level = [
        "                                                            ",
        "                                                            ",
        "              f                                    W        ",
        "            =====                               =====       ",
        "                                     f                      ",
        "       f              ====         =====                    ",
        "     =====                                        f         ",
        "                  f        =====          =====             ",
        "               =====                                        ",
        "    @                                                       ",
        "################################################################",
    ];

    const levelConfig = {
        tileWidth: 64,
        tileHeight: 32,
        tiles: {
            "@": () => [
                sprite("penguin"),
                area({ shape: new Rect(vec2(0, 0), 28, 38) }),
                body(),
                anchor("center"),
                scale(1.2),
                "player",
            ],
            "#": () => [
                sprite("ground"),
                area(),
                body({ isStatic: true }),
                anchor("center"),
                "ground",
            ],
            "=": () => [
                sprite("platform"),
                area(),
                body({ isStatic: true }),
                anchor("center"),
                "platform",
            ],
            "f": () => [
                sprite("fish"),
                area(),
                anchor("center"),
                "fish",
                { collected: false },
            ],
            "W": () => [
                sprite("wiggle"),
                area(),
                anchor("center"),
                scale(1.5),
                "wiggle",
                "goal",
            ],
        },
    };

    addLevel(level, levelConfig);

    // Get player
    const player = get("player")[0];

    // Camera follows player
    player.onUpdate(() => {
        camPos(player.pos.x, 250);
    });

    // Player movement
    const SPEED = 300;
    const JUMP_FORCE = 550;

    onKeyDown("left", () => {
        player.move(-SPEED, 0);
        player.flipX = true;
    });

    onKeyDown("right", () => {
        player.move(SPEED, 0);
        player.flipX = false;
    });

    onKeyDown("a", () => {
        player.move(-SPEED, 0);
        player.flipX = true;
    });

    onKeyDown("d", () => {
        player.move(SPEED, 0);
        player.flipX = false;
    });

    onKeyPress("space", () => {
        if (player.isGrounded()) {
            player.jump(JUMP_FORCE);
        }
    });

    onKeyPress("up", () => {
        if (player.isGrounded()) {
            player.jump(JUMP_FORCE);
        }
    });

    onKeyPress("w", () => {
        if (player.isGrounded()) {
            player.jump(JUMP_FORCE);
        }
    });

    // Collect fish
    player.onCollide("fish", (fish) => {
        if (!fish.collected) {
            fish.collected = true;
            destroy(fish);
            fishCollected++;
            score += 100;

            // Sparkle effect
            for (let i = 0; i < 5; i++) {
                add([
                    sprite("star"),
                    pos(fish.pos),
                    scale(0.5),
                    opacity(1),
                    lifespan(0.5, { fade: 0.3 }),
                    move(rand(0, 360), rand(50, 150)),
                ]);
            }
        }
    });

    // Reach Wiggle (goal)
    player.onCollide("wiggle", () => {
        go("win", { score, fishCollected });
    });

    // Fall off screen
    player.onUpdate(() => {
        if (player.pos.y > 600) {
            go("lose");
        }
    });

    // UI - Score
    add([
        text("Fish: 0/" + TOTAL_FISH, { size: 24 }),
        pos(20, 20),
        fixed(),
        z(10),
        color(30, 30, 60),
        { update() { this.text = `Fish: ${fishCollected}/${TOTAL_FISH}`; } },
    ]);

    add([
        text("Score: 0", { size: 24 }),
        pos(20, 50),
        fixed(),
        z(10),
        color(30, 30, 60),
        { update() { this.text = `Score: ${score}`; } },
    ]);
});

// Scene: Win
scene("win", ({ score, fishCollected }) => {
    add([
        text("🎉 YOU FOUND WIGGLE! 🎉", { size: 36 }),
        pos(width() / 2, 100),
        anchor("center"),
        color(30, 130, 60),
    ]);

    add([
        sprite("wiggle"),
        pos(width() / 2, 180),
        anchor("center"),
        scale(3),
    ]);

    add([
        sprite("penguin"),
        pos(width() / 2 - 60, 190),
        anchor("center"),
        scale(2),
    ]);

    add([
        text(`Fish Collected: ${fishCollected}/${TOTAL_FISH}`, { size: 24 }),
        pos(width() / 2, 260),
        anchor("center"),
        color(60, 60, 90),
    ]);

    add([
        text(`Final Score: ${score}`, { size: 28 }),
        pos(width() / 2, 300),
        anchor("center"),
        color(30, 30, 60),
    ]);

    const msg = fishCollected === TOTAL_FISH
        ? "PERFECT! You got ALL da fish! 🌟"
        : "Try again to get all da fish!";

    add([
        text(msg, { size: 20 }),
        pos(width() / 2, 350),
        anchor("center"),
        color(100, 100, 130),
    ]);

    add([
        text("Press SPACE to play again!", { size: 20 }),
        pos(width() / 2, 420),
        anchor("center"),
        color(80, 80, 110),
    ]);

    onKeyPress("space", () => {
        go("menu");
    });
});

// Scene: Lose
scene("lose", () => {
    add([
        text("Oh no! You fell! 😢", { size: 36 }),
        pos(width() / 2, 180),
        anchor("center"),
        color(180, 60, 60),
    ]);

    add([
        text("Press SPACE to try again!", { size: 24 }),
        pos(width() / 2, 280),
        anchor("center"),
        color(80, 80, 110),
    ]);

    onKeyPress("space", () => {
        go("game");
    });
});

// Start with menu
go("menu");
