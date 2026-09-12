import { Graphics, Container, BlurFilter } from 'pixi.js';

export class MemorySpark {
  constructor(scene, x, y, memoryText) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.memoryText = memoryText;
    this.collected = false;

    this.time = Math.random() * Math.PI * 2;
    this.baseY = y;

    this.sprite = this.createSprite();
    this.sprite.x = x;
    this.sprite.y = y;
  }

  createSprite() {
    const container = new Container();

    const outerGlow = new Graphics();
    outerGlow.circle(0, 0, 35);
    outerGlow.fill({ color: 0xff8c00, alpha: 0.15 });
    outerGlow.filters = [new BlurFilter({ strength: 12 })];
    container.addChild(outerGlow);
    this.outerGlow = outerGlow;

    const midGlow = new Graphics();
    midGlow.circle(0, 0, 22);
    midGlow.fill({ color: 0xffaa00, alpha: 0.35 });
    midGlow.filters = [new BlurFilter({ strength: 6 })];
    container.addChild(midGlow);
    this.midGlow = midGlow;

    const core = new Graphics();
    core.circle(0, 0, 12);
    core.fill({ color: 0xffd93d });
    container.addChild(core);
    this.core = core;

    const innerCore = new Graphics();
    innerCore.circle(0, 0, 6);
    innerCore.fill({ color: 0xffffee });
    container.addChild(innerCore);
    this.innerCore = innerCore;

    const highlight = new Graphics();
    highlight.circle(-3, -3, 2);
    highlight.fill({ color: 0xffffff, alpha: 0.8 });
    container.addChild(highlight);

    this.sparkles = [];
    for (let i = 0; i < 4; i++) {
      const sparkle = new Graphics();
      const angle = (i / 4) * Math.PI * 2;
      sparkle.star(0, 0, 4, 1, 2);
      sparkle.fill({ color: 0xffffff, alpha: 0.6 });
      sparkle.x = Math.cos(angle) * 18;
      sparkle.y = Math.sin(angle) * 18;
      sparkle.rotation = angle;
      container.addChild(sparkle);
      this.sparkles.push({ sprite: sparkle, baseAngle: angle });
    }

    return container;
  }

  update(delta) {
    if (this.collected) return;

    this.time += delta * 0.04;

    this.sprite.y = this.baseY + Math.sin(this.time * 2) * 6;

    const pulse = 0.85 + Math.sin(this.time * 3) * 0.15;
    this.outerGlow.scale.set(pulse * 1.1);
    this.midGlow.scale.set(pulse);
    this.core.scale.set(0.95 + Math.sin(this.time * 4) * 0.05);

    this.innerCore.alpha = 0.7 + Math.sin(this.time * 5) * 0.3;

    this.sparkles.forEach((s, i) => {
      const offset = this.time * 0.5 + i * 0.5;
      const dist = 16 + Math.sin(offset * 2) * 4;
      s.sprite.x = Math.cos(s.baseAngle + this.time * 0.3) * dist;
      s.sprite.y = Math.sin(s.baseAngle + this.time * 0.3) * dist;
      s.sprite.alpha = 0.3 + Math.sin(offset * 3) * 0.4;
      s.sprite.scale.set(0.6 + Math.sin(offset * 2) * 0.4);
    });

    this.sprite.rotation = Math.sin(this.time) * 0.05;
  }

  collect() {
    this.collected = true;
    this.sprite.visible = false;
  }
}
