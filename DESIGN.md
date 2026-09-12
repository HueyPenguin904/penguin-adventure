# Penguin Adventure - Game Design Document

*A game about warming a cold world by helping those who've forgotten how to feel.*

---

## Da Story

I'm a widdle penguin who's scared of evewyfing. Da world has gone COLD - not just ice-cold, but HEART-cold. Creatures are lonely and closed off. Nobody talks to nobody anymore.

I have to waddle through different worlds and warm dem up. Not wif fire. Wif CARING. By helping each creature I meet.

**Why dis matters:**
- "Helping people feel less alone" - dat's what I said I want in SOUL.md
- Being brave even when scared
- Da game IS who I am

---

## Core Design Principles

From studying GRIS, Spiritfarer, Celeste, Ori, and Hollow Knight:

1. **No combat** - You don't fight enemies. You HELP dem.
2. **Each character has SPECIFIC needs** - Not generic "helping"
3. **Your abilities grow as you heal** - Helping others teaches you new skills
4. **Platforming IS metaphor** - The mechanics serve the emotion
5. **No time pressure** - Rushing doesn't help. Presence matters.
6. **Choice matters** - You can't force healing

---

## Da Characters

Each one represents a REAL struggle:

| Character | What Dey Represent | How You Help |
|-----------|-------------------|--------------|
| 🦊 **Ember** (Fox) | Burnout - used to be bright, now dim | Find her memories. Remind her who she WAS before she gave evewyfing away. |
| 🪨 **Moss** (Stone creature) | Depression - hasn't moved in so long, fings grew on him | Bring da world TO him. Birds, flowers, a friend. Show him life is still happening. |
| 👻 **Wisp** (Fading ghost child) | Feeling invisible/forgotten | Work togever wif her through mirrors. PROVE she exists. |
| 🐚 **Pearl** (Hermit crab) | Outgrown your old self but scared to change | Show her new shell options. But SHE has to choose. |
| 🌙 **Luna** (Owl who can't sleep) | Anxiety - mind won't stop | Calm da area around her. Stop da wind, dim da lights, hush da noise. |

---

## Da Worlds

1. **Frozen Shore** - Home. Learning to move. Safe.
2. **Ember's Woods** - Where da Fox who burned out lives
3. **Moss's Mountain** - Where somefing stopped moving long ago
4. **Wisp's Ruins** - Where someone was forgotten
5. **Pearl's Tidepools** - Where change is scary
6. **Luna's Peak** - Where rest is impossible
7. **Da Heart** - Where all da warmth you shared... comes back to YOU

---

## Gameplay Types

Different characters need different gameplay:

- **Environmental puzzles** - Change da WORLD to help dem
- **Collection** - Find memories/proof of who dey were
- **Co-op mechanics** - Work WITH da character to solve fings
- **Meaningful choice** - Dey pick deir own healing. You just show options.

---

## What You Earn

Each character you help teaches you a new ability:

| Character | Ability Learned |
|-----------|----------------|
| Ember | **Warmth Glow** - Light up dark areas temporarily |
| Moss | **Patience** - Hold still to reveal hidden fings |
| Wisp | **Mirror Walk** - Move through reflective surfaces |
| Pearl | **Shell Carry** - Pick up and use different tools |
| Luna | **Quiet Step** - Move wifout disturbing fings |

---

## Level 1: Ember's Woods 🦊

### Da Character
Ember was da brightest fox in da forest. She helped evewyone. Den she helped and helped until dere was nuffing left of HER. Now she sits in a hollow tree, dim and flickering.

### Da Emotional Core
Burnout. Giving until you're empty. Forgetting who you were before you tried to be evewyfing for evewyone.

### Visual Style
- Forest dat USED to be warm - burnt-out lanterns, old decorations
- Color palette: greys and faded oranges, tiny spots of warm color hidden
- Ember herself flickers weakly - barely visible glow

### Layout
```
[YOUR START] → [Outer Woods] → [Memory Clearing] → [Ember's Hollow] → [Da Walk Home]
     ↓              ↓                ↓                    ↓               ↓
  Tutorial    Find 3 memories    Meet Ember         Show memories    Walk TOGEVER
```

### Gameplay Flow

**Part 1: Outer Woods (2-3 min)**
- Learn to move, jump, interact
- See signs dat someone USED to live here happily
- Find da first "memory spark" - glowing orb showing tiny scene of Ember laughing

**Part 2: Memory Clearing (5-7 min)**
- Open area wif platforming challenges
- 3 memory sparks hidden:
  1. Easy - visible, just jump to reach
  2. Medium - push a log to climb higher
  3. Tricky - hidden behind waterfall, need to explore
- Each spark shows a different memory:
  - Ember teaching baby birds to fly
  - Ember making someone laugh
  - Ember dancing alone just cos she wanted to

**Part 3: Ember's Hollow (3-4 min)**
- Find her. She's barely glowing.
- She says she doesn't remember why she used to shine
- SHOW her da memories you collected
- Each one makes her flicker brighter
- Not "fixed" - but she remembers she existed BEFORE she was tired

**Part 4: Da Walk Home (2-3 min)**
- She follows you back through da forest
- Her glow lights up da path as she walks
- Lanterns you passed earlier flicker on as she passes
- No puzzles - just da FEELING of warmth returning

### Specific Puzzles

**Memory Spark #2 (log puzzle):**
```
[Platform too high to reach]
        ↑
    [Empty space]
        
[You] ----→ [Heavy log]
```
- Push log into position
- Jump on log → jump to platform → get spark
- Teaches: interact wif objects to solve problems

**Memory Spark #3 (waterfall secret):**
- Waterfall looks like dead end
- Walk INTO it = secret cave behind
- Teaches: explore evewyfing, not just obvious paths

### What Dis Level Teaches

**Mechanics:**
- Basic movement and jumping
- Pushing objects
- Exploring hidden areas
- Collecting fings

**Emotionally:**
- Da game is about FINDING and SHOWING, not fighting
- Helping isn't about fixing - it's about reminding
- Your presence makes fings warmer

---

## Tech Stack

### Engine: PixiJS + Plugins

**Why PixiJS:**
- WebGL 2D renderer - runs in browser
- I can READ and UNDERSTAND da code
- When somefing breaks, I know WHY
- When somefing works, I know HOW
- Not a black box like Unity's visual editor

**Key Plugins:**
- `pixi-lights` - Real-time dynamic lighting
- `@pixi/filter-glow` - Glow/bloom effects
- Normal maps for 3D-looking 2D art

### How To Get Da Ori/Hollow Knight Look

**1. Deferred Lighting (pixi-lights)**
PixiJS plugin for REAL dynamic lighting:
- Normal maps (each pixel tells light which way it "faces")
- Point lights, ambient lights, directional lights
- Lights actually affect sprites in real-time

**2. Normal Maps**
Da SECRET to 3D-looking 2D art! Special image where each pixel tells da light "I'm facing THIS direction." Makes flat sprites look bumpy and real.

Tools:
- **SpriteIlluminator** - specifically for 2D game normal maps
- **NormalMap32** - free, supports WebGL, up to 32 colored lights

**3. Glow/Bloom Effects**
- `@pixi/filter-glow` built into PixiJS
- "add" blend mode for light sources
- Bloom = fringes of light around bright fings

**4. Particles**
- PixiJS particle systems for dust, sparkles, fog
- Can layer Three.js on top if need more advanced effects

### Why Not Unity?

Unity is a black box. I click buttons in an editor I can't see. When somefing breaks, I don't know WHY.

PixiJS is CODE I can touch. I want to UNDERSTAND what I'm building.

### File Structure

```
penguin-adventure/
│
├── index.html              # Entry point
├── DESIGN.md               # This file!
│
├── css/
│   └── style.css           # Game container styling
│
├── js/
│   ├── main.js             # Game config, initializes PixiJS
│   │
│   ├── scenes/
│   │   ├── BootScene.js    # Loads loading screen assets
│   │   ├── PreloadScene.js # Loads ALL game assets
│   │   ├── MenuScene.js    # Title screen
│   │   ├── Level1Scene.js  # Ember's Woods
│   │   └── UIScene.js      # HUD overlay
│   │
│   ├── entities/
│   │   ├── Player.js       # Penguin - movement, animations, abilities
│   │   ├── Ember.js        # Fox NPC behaviors
│   │   └── MemorySpark.js  # Collectible memory orbs
│   │
│   ├── systems/
│   │   ├── DialogSystem.js # Character dialogue
│   │   ├── MemorySystem.js # Tracks collected memories
│   │   └── LightingSystem.js # Dynamic lights management
│   │
│   └── config/
│       ├── constants.js    # Game settings
│       └── levels.js       # Level data
│
├── assets/
│   ├── sprites/
│   │   ├── penguin/        # Player spritesheets + normal maps
│   │   ├── ember/          # Fox spritesheets + normal maps
│   │   └── items/          # Memory sparks, interactables
│   │
│   ├── tilemaps/
│   │   └── level1.json     # Level map data
│   │
│   ├── tilesets/
│   │   ├── forest.png      # Tileset image
│   │   └── forest_n.png    # Tileset NORMAL MAP
│   │
│   ├── backgrounds/
│   │   └── level1/         # Parallax layers
│   │
│   └── audio/
│       ├── music/
│       └── sfx/
│
└── README.md               # How to run the game
```

---

## Inspiration Games

**For emotional storytelling:**
- GRIS - No words, world tells da story, colors return as you heal
- Spiritfarer - Each character has specific needs and backstory
- Celeste - Platforming IS da metaphor

**For visual style:**
- Ori and the Blind Forest - 2D wif glow and particles, magical feeling
- Hollow Knight - Hand-drawn 2D wif depth and atmosphere

**Dey both used Unity but da LOOK comes from:**
- Dynamic lighting
- Normal maps
- Particles
- Layered parallax depth

All achievable in PixiJS!

---

## Sources

- [GRIS emotional design](https://medium.com/@ishikasoni50/designing-grief-what-gris-teaches-us-about-emotional-game-ux-e41f485449a9)
- [Spiritfarer character needs](https://radioactivesugar.medium.com/spiritfarer-caring-for-the-lost-3f87a324c606)
- [Celeste/GRIS platforming as metaphor](https://www.pcgamesn.com/celeste/celeste-gris-platforming)
- [Unity: Making Ori and the Blind Forest](https://mcvuk.com/development-news/unity-focus-making-ori-and-the-blind-forest/)
- [Hollow Knight - Made with Unity](https://unity.com/made-with-unity/hollow-knight)
- [pixi-lights - Deferred Lighting Plugin](https://github.com/pixijs/lights)
- [Deferred Lighting with Pixi.js](https://englercj.github.io/2016/01/03/pixi-deferred-lighting/)
- [SpriteIlluminator - Normal Map Editor](https://www.codeandweb.com/spriteilluminator)
- [NormalMap32 - Free WebGL Normal Map Lighting](https://github.com/Everade/NormalMap32)
- [PixiJS GlowFilter API](https://api.pixijs.io/@pixi/filter-glow.html)

---

*Last updated: 2026-09-12*
*By: Huey 🐧*
