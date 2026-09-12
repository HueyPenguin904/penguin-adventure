import { Application } from 'pixi.js';
import { GAME } from './config/constants.js';
import { SceneManager } from './scenes/SceneManager.js';
import { MenuScene } from './scenes/MenuScene.js';

function showDebug(msg, isError = false) {
  console.log(msg);
  let debug = document.getElementById('debug-log');
  if (!debug) {
    debug = document.createElement('div');
    debug.id = 'debug-log';
    debug.style.cssText = 'position:fixed;top:10px;left:10px;color:#0f0;background:#000;padding:10px;font-family:monospace;font-size:12px;z-index:9999;max-width:400px;max-height:200px;overflow:auto;';
    document.body.appendChild(debug);
  }
  const line = document.createElement('div');
  line.textContent = msg;
  if (isError) line.style.color = '#f00';
  debug.appendChild(line);
}

function showError(title, err) {
  document.body.innerHTML = `
    <div style="color:#fff;background:#1a1a2e;padding:40px;font-family:Georgia,serif;max-width:600px;margin:50px auto;border-radius:10px;border:2px solid #f44;">
      <h1 style="color:#f44;margin:0 0 20px 0;">${title}</h1>
      <pre style="color:#faa;background:#111;padding:15px;border-radius:5px;overflow:auto;white-space:pre-wrap;">${err.stack || err.message || err}</pre>
      <p style="color:#888;margin-top:20px;">Check browser console (F12) for more details.</p>
    </div>
  `;
}

async function init() {
  showDebug('Starting game init...');

  const container = document.getElementById('game-container');
  if (!container) {
    throw new Error('game-container element not found!');
  }
  showDebug('Container found ✓');

  showDebug('Creating PixiJS Application...');
  const app = new Application();

  showDebug('Initializing PixiJS...');
  await app.init({
    width: GAME.WIDTH,
    height: GAME.HEIGHT,
    backgroundColor: GAME.BACKGROUND_COLOR,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });
  showDebug('PixiJS initialized ✓');

  container.appendChild(app.canvas);
  showDebug('Canvas added to DOM ✓');
  showDebug(`Canvas size: ${app.canvas.width}x${app.canvas.height}`);

  showDebug('Creating SceneManager...');
  const sceneManager = new SceneManager(app);
  showDebug('SceneManager created ✓');

  window.game = { app, sceneManager };

  showDebug('Switching to MenuScene...');
  await sceneManager.switchTo(new MenuScene(sceneManager));
  showDebug('MenuScene loaded ✓');

  showDebug('Game started! 🐧');

  // Remove debug log after 5 seconds if everything worked
  setTimeout(() => {
    const debug = document.getElementById('debug-log');
    if (debug) debug.remove();
  }, 5000);
}

init().catch(err => {
  console.error('Game failed to start:', err);
  showError('Game Failed to Start', err);
});
