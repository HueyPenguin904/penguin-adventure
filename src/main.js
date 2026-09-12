import { Application, Assets } from 'pixi.js';
import { GAME } from './config/constants.js';
import { SPRITES, BACKGROUNDS } from './config/assets.js';
import { SceneManager } from './scenes/SceneManager.js';
import { MenuScene } from './scenes/MenuScene.js';

async function init() {
  const app = new Application();

  await app.init({
    width: GAME.WIDTH,
    height: GAME.HEIGHT,
    backgroundColor: GAME.BACKGROUND_COLOR,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });

  document.getElementById('game-container').appendChild(app.canvas);

  // Load all game assets
  console.log('Loading assets...');

  const assetsToLoad = {
    penguin: SPRITES.penguin,
    ember: SPRITES.ember,
    memory_spark: SPRITES.memory_spark,
    level1_far: BACKGROUNDS.level1_far,
    level1_mid: BACKGROUNDS.level1_mid,
  };

  await Assets.load(Object.values(assetsToLoad));
  console.log('Assets loaded!');

  const sceneManager = new SceneManager(app);

  window.game = { app, sceneManager };

  sceneManager.switchTo(new MenuScene(sceneManager));
}

init().catch(console.error);
