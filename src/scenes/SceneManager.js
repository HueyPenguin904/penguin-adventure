/**
 * SceneManager handles switching between scenes and the game loop.
 * Scenes are things like: MenuScene, Level1Scene, MemoryScene
 */
export class SceneManager {
  constructor(app) {
    this.app = app;
    this.currentScene = null;
    this.lastTime = performance.now();

    this.app.ticker.add(this.update.bind(this));
  }

  async switchTo(newScene) {
    if (this.currentScene) {
      this.currentScene.destroy();
      this.app.stage.removeChildren();
    }

    this.currentScene = newScene;

    await this.currentScene.init();

    this.app.stage.addChild(this.currentScene.container);
  }

  update(ticker) {
    const delta = ticker.deltaMS / 1000;

    if (this.currentScene && this.currentScene.update) {
      this.currentScene.update(delta);
    }
  }

  get width() {
    return this.app.screen.width;
  }

  get height() {
    return this.app.screen.height;
  }
}
