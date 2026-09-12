import { Container } from 'pixi.js';

/**
 * BaseScene - all scenes extend this.
 * Provides common structure for init, update, destroy.
 */
export class BaseScene {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.container = new Container();
  }

  async init() {
    // Override in subclass to set up the scene
  }

  update(delta) {
    // Override in subclass for per-frame updates
  }

  destroy() {
    this.container.destroy({ children: true });
  }

  get app() {
    return this.sceneManager.app;
  }

  get width() {
    return this.sceneManager.width;
  }

  get height() {
    return this.sceneManager.height;
  }
}
