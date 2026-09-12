import { Graphics, Container, BlurFilter, ColorMatrixFilter } from 'pixi.js';

/**
 * LightingSystem - creates warm, Ori-like atmospheric lighting.
 * Uses layered graphics with blur for soft glow effects.
 */
export class LightingSystem {
  constructor(scene) {
    this.scene = scene;
    this.lights = [];

    this.ambientColor = 0x1a1a2e;
    this.ambientBrightness = 0.3;

    this.lightLayer = new Container();
    this.lightLayer.blendMode = 'add';

    this.vignetteLayer = this.createVignette();
  }

  createVignette() {
    const vignette = new Graphics();
    const w = this.scene.width;
    const h = this.scene.height;

    const gradient = vignette.context;
    vignette.rect(0, 0, w, h);
    vignette.fill({ color: 0x000000, alpha: 0 });

    return vignette;
  }

  setAmbient(color, brightness) {
    this.ambientColor = color;
    this.ambientBrightness = brightness;
  }

  addLight(x, y, color, intensity, radius) {
    const lightContainer = new Container();

    const outerGlow = new Graphics();
    outerGlow.circle(0, 0, radius * 1.5);
    outerGlow.fill({ color: color, alpha: intensity * 0.15 });

    const midGlow = new Graphics();
    midGlow.circle(0, 0, radius);
    midGlow.fill({ color: color, alpha: intensity * 0.3 });

    const innerGlow = new Graphics();
    innerGlow.circle(0, 0, radius * 0.5);
    innerGlow.fill({ color: 0xffffff, alpha: intensity * 0.5 });

    lightContainer.addChild(outerGlow);
    lightContainer.addChild(midGlow);
    lightContainer.addChild(innerGlow);

    lightContainer.filters = [new BlurFilter({ strength: 8 })];

    lightContainer.x = x;
    lightContainer.y = y;

    this.lightLayer.addChild(lightContainer);

    const light = {
      x,
      y,
      color,
      intensity,
      radius,
      time: Math.random() * Math.PI * 2,
      container: lightContainer,
      outerGlow,
      midGlow,
      innerGlow,
    };

    this.lights.push(light);
    return light;
  }

  addPlayerLight(player) {
    const lightContainer = new Container();

    const warmGlow = new Graphics();
    warmGlow.circle(0, 0, 60);
    warmGlow.fill({ color: 0x4ecdc4, alpha: 0.2 });

    const coreGlow = new Graphics();
    coreGlow.circle(0, 0, 30);
    coreGlow.fill({ color: 0xf1faee, alpha: 0.15 });

    lightContainer.addChild(warmGlow);
    lightContainer.addChild(coreGlow);
    lightContainer.filters = [new BlurFilter({ strength: 12 })];

    this.lightLayer.addChild(lightContainer);

    this.playerLight = {
      container: lightContainer,
      warmGlow,
      coreGlow,
      player,
    };

    return this.playerLight;
  }

  removeLight(light) {
    const index = this.lights.indexOf(light);
    if (index > -1) {
      this.lightLayer.removeChild(light.container);
      this.lights.splice(index, 1);
    }
  }

  update(delta) {
    this.lights.forEach(light => {
      light.time += delta;

      const flicker = 0.85 + Math.sin(light.time * 3) * 0.15;
      const drift = Math.sin(light.time * 2) * 0.05;

      light.outerGlow.scale.set(flicker + drift);
      light.midGlow.scale.set(flicker);
      light.innerGlow.alpha = 0.5 + Math.sin(light.time * 5) * 0.2;
    });

    if (this.playerLight) {
      this.playerLight.container.x = this.playerLight.player.sprite.x;
      this.playerLight.container.y = this.playerLight.player.sprite.y;
    }
  }
}
