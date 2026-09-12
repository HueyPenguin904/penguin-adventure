import { Container, Graphics, BlurFilter } from 'pixi.js';

/**
 * ParticleSystem - floating dust, sparkles, fireflies.
 * Creates that magical Ori/Hollow Knight atmospheric feel.
 */
export class ParticleSystem {
  constructor(scene) {
    this.scene = scene;
    this.container = new Container();
    this.particles = [];
  }

  createDust(count = 40) {
    for (let i = 0; i < count; i++) {
      const sprite = new Graphics();
      const size = 1.5 + Math.random() * 2.5;

      sprite.circle(0, 0, size);
      sprite.fill({ color: 0xffffff, alpha: 0.15 + Math.random() * 0.15 });

      const particle = {
        sprite,
        x: Math.random() * 3000,
        y: Math.random() * 700,
        baseY: 0,
        vx: -0.15 - Math.random() * 0.25,
        drift: Math.random() * Math.PI * 2,
        driftSpeed: 0.3 + Math.random() * 0.7,
        driftAmount: 15 + Math.random() * 25,
        type: 'dust',
      };

      particle.baseY = particle.y;
      sprite.x = particle.x;
      sprite.y = particle.y;

      this.particles.push(particle);
      this.container.addChild(sprite);
    }
  }

  createFireflies(count = 20) {
    for (let i = 0; i < count; i++) {
      const container = new Container();

      const glow = new Graphics();
      glow.circle(0, 0, 10);
      glow.fill({ color: 0xffcc00, alpha: 0.25 });

      const core = new Graphics();
      core.circle(0, 0, 3);
      core.fill({ color: 0xffffaa });

      container.addChild(glow);
      container.addChild(core);
      container.filters = [new BlurFilter({ strength: 2 })];

      const particle = {
        sprite: container,
        glow,
        core,
        x: Math.random() * 3000,
        y: 350 + Math.random() * 250,
        targetX: 0,
        targetY: 0,
        time: Math.random() * Math.PI * 2,
        wanderTime: Math.random() * 3,
        speed: 0.4 + Math.random() * 0.3,
        type: 'firefly',
      };

      particle.targetX = particle.x + (Math.random() - 0.5) * 120;
      particle.targetY = particle.y + (Math.random() - 0.5) * 60;

      container.x = particle.x;
      container.y = particle.y;

      this.particles.push(particle);
      this.container.addChild(container);
    }
  }

  emit(x, y, options = {}) {
    const count = options.count || 10;
    const color = options.color || 0xffd93d;
    const speed = options.speed || 50;
    const lifetime = options.lifetime || 1;
    const size = options.size || 3;

    for (let i = 0; i < count; i++) {
      const sprite = new Graphics();
      sprite.star(0, 0, 4, size * 0.4, size);
      sprite.fill({ color, alpha: 0.9 });
      sprite.x = x;
      sprite.y = y;

      const angle = Math.random() * Math.PI * 2;
      const velocity = speed * (0.5 + Math.random() * 0.5);

      this.particles.push({
        sprite,
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 30,
        life: lifetime,
        maxLife: lifetime,
        type: 'sparkle',
      });

      this.container.addChild(sprite);
    }
  }

  update(delta) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      if (p.type === 'dust') {
        p.x += p.vx * delta;
        p.drift += p.driftSpeed * delta * 0.03;
        p.y = p.baseY + Math.sin(p.drift) * p.driftAmount;

        if (p.x < -30) {
          p.x = 3030;
          p.y = Math.random() * 700;
          p.baseY = p.y;
        }
      } else if (p.type === 'firefly') {
        p.time += delta * 0.05;
        p.wanderTime += delta * 0.05;

        if (p.wanderTime > 2.5) {
          p.targetX = p.x + (Math.random() - 0.5) * 180;
          p.targetY = p.y + (Math.random() - 0.5) * 100;
          p.targetY = Math.max(280, Math.min(620, p.targetY));
          p.wanderTime = 0;
        }

        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        p.x += dx * p.speed * delta * 0.02;
        p.y += dy * p.speed * delta * 0.02;

        const pulse = 0.4 + Math.sin(p.time * 4) * 0.6;
        p.glow.alpha = 0.1 + pulse * 0.35;
        p.core.alpha = 0.4 + pulse * 0.6;
        p.glow.scale.set(0.8 + pulse * 0.4);
      } else if (p.type === 'sparkle') {
        p.x += p.vx * delta;
        p.y += p.vy * delta;
        p.vy += 0.8 * delta;
        p.life -= 0.03 * delta;
        p.sprite.alpha = p.life / p.maxLife;
        p.sprite.rotation += delta * 0.1;

        if (p.life <= 0) {
          this.container.removeChild(p.sprite);
          p.sprite.destroy();
          this.particles.splice(i, 1);
          continue;
        }
      }

      p.sprite.x = p.x;
      p.sprite.y = p.y;
    }
  }

  setWorldOffset(x) {
    this.particles.forEach(p => {
      if (p.type === 'dust' || p.type === 'firefly') {
        p.sprite.x = p.x - x * (p.type === 'firefly' ? 0.5 : 0.3);
      }
    });
  }

  clear() {
    this.particles.forEach(p => {
      this.container.removeChild(p.sprite);
      p.sprite.destroy();
    });
    this.particles = [];
  }
}
