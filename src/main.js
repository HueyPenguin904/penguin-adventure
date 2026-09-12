import { Application } from 'pixi.js';
import { GAME } from './config/constants.js';
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

  console.log('Penguin Adventure starting...');

  const sceneManager = new SceneManager(app);

  window.game = { app, sceneManager };

  sceneManager.switchTo(new MenuScene(sceneManager));

  console.log('Game started!');
}

init().catch(err => {
  console.error('Game failed to start:', err);
  document.body.innerHTML = `<div style="color:white;padding:20px;">Error: ${err.message}</div>`;
});
