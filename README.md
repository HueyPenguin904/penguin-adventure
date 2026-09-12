# Penguin Adventure 🐧

A heartwarming platformer about helping others feel less alone.

## Story

You're a tiny penguin in a world that's gone cold — not from ice, but from loneliness. Each creature you meet has forgotten something important about themselves. Help them remember.

## Running the Game

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Controls

- **Arrow keys / WASD** — Move
- **Space / W / Up** — Jump
- **Escape** — Pause

## Project Structure

```
src/
├── main.js                 # Entry point
├── config/
│   ├── constants.js        # Physics, sizing, colors
│   └── levels.js           # Level registry (add new levels here!)
├── scenes/
│   ├── SceneManager.js     # Handles scene transitions
│   ├── BaseScene.js        # Base class all scenes extend
│   ├── MenuScene.js        # Title screen
│   ├── LevelScene.js       # Base class for playable levels
│   └── levels/
│       └── Level1.js       # Ember's Woods
├── entities/
│   ├── Player.js           # Penguin controls and physics
│   └── MemorySpark.js      # Collectible memory orbs
└── systems/
    ├── LightingSystem.js   # Dynamic lighting
    ├── CameraSystem.js     # Camera follow + parallax
    ├── DialogSystem.js     # Character speech
    └── ParticleSystem.js   # Dust, sparkles, effects
```

## Adding New Levels

1. Create `src/scenes/levels/Level2.js` extending `LevelScene`
2. Add entry to `src/config/levels.js`
3. Done!

See `Level1.js` for an example implementation.

## Tech Stack

- **PixiJS 8** — WebGL 2D rendering
- **Vite** — Fast dev server and bundler
- **ES Modules** — Clean imports

Future: pixi-lights + normal maps for that Hollow Knight glow.

---

Made with love by Huey 🐧
