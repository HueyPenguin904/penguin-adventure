import { Graphics, Text, Container, BlurFilter } from 'pixi.js';
import { LevelScene } from '../LevelScene.js';
import { MemorySpark } from '../../entities/MemorySpark.js';

/**
 * Level 1: Ember's Woods
 *
 * A fox who burned too bright helping others.
 * Now she sits dim in a hollow tree, forgetting who she was.
 *
 * Objective: Find 3 memory sparks that show her past self.
 */
export default class Level1 extends LevelScene {
  async setup() {
    this.createBackground();

    this.player.setPosition(100, 500);

    this.memoriesCollected = 0;
    this.totalMemories = 3;

    this.createGround();
    this.createPlatforms();
    this.createTrees();
    this.createMemorySparks();
    this.createUI();
    this.showIntro();

    this.particles.createDust(50);
    this.particles.createFireflies(25);

    this.lighting.setAmbient(0x1a1a2e, 0.25);
    this.lighting.addPlayerLight(this.player);
  }

  showIntro() {
    // Pause player controls during intro
    this.introActive = true;

    // Hide touch controls during intro
    if (this.touchControls) {
      this.touchControls.container.visible = false;
    }

    const introContainer = new Container();

    // Full black overlay (starts opaque, will fade)
    const overlay = new Graphics();
    overlay.rect(0, 0, this.width, this.height);
    overlay.fill({ color: 0x000000 });
    introContainer.addChild(overlay);

    // Story lines that will fade in one by one
    const lines = [
      { text: "The world has gone cold.", delay: 500, y: -60 },
      { text: "Not from ice...", delay: 2000, y: -20 },
      { text: "...from loneliness.", delay: 3500, y: 20 },
      { text: "But somewhere in these woods,\nthere's a fox who forgot how to shine.", delay: 5500, y: 80 },
    ];

    const textContainer = new Container();
    textContainer.x = this.width / 2;
    textContainer.y = this.height / 2;
    introContainer.addChild(textContainer);

    // Create all text elements (hidden initially)
    const textElements = lines.map(line => {
      const text = new Text({
        text: line.text,
        style: {
          fontFamily: 'Georgia, serif',
          fontSize: 28,
          fill: 0xf1faee,
          align: 'center',
        },
      });
      text.anchor.set(0.5);
      text.y = line.y;
      text.alpha = 0;
      textContainer.addChild(text);
      return { text, delay: line.delay };
    });

    // Controls hint (shows later)
    const controls = new Text({
      text: "← → to move  |  SPACE to jump",
      style: {
        fontFamily: 'Arial, sans-serif',
        fontSize: 18,
        fill: 0x888888,
        align: 'center',
      },
    });
    controls.anchor.set(0.5);
    controls.x = this.width / 2;
    controls.y = this.height - 120;
    controls.alpha = 0;
    introContainer.addChild(controls);

    // Tap to begin (shows last)
    const tapText = new Text({
      text: "[ Tap anywhere to begin ]",
      style: {
        fontFamily: 'Georgia, serif',
        fontSize: 22,
        fill: 0xffaa00,
        align: 'center',
      },
    });
    tapText.anchor.set(0.5);
    tapText.x = this.width / 2;
    tapText.y = this.height - 70;
    tapText.alpha = 0;
    introContainer.addChild(tapText);

    this.uiLayer.addChild(introContainer);

    // Fade in each line with delays
    textElements.forEach(({ text, delay }) => {
      setTimeout(() => {
        this.fadeIn(text, 1000);
      }, delay);
    });

    // Show controls after story
    setTimeout(() => {
      this.fadeIn(controls, 800);
    }, 8000);

    // Show tap prompt and enable interaction
    setTimeout(() => {
      this.fadeIn(tapText, 800);

      // Pulse animation for tap text
      const pulseInterval = setInterval(() => {
        if (tapText.destroyed) {
          clearInterval(pulseInterval);
          return;
        }
        tapText.alpha = 0.6 + Math.sin(Date.now() * 0.003) * 0.4;
      }, 50);

      // Enable tap to start
      overlay.eventMode = 'static';
      overlay.cursor = 'pointer';
      overlay.on('pointerdown', () => {
        clearInterval(pulseInterval);
        this.fadeOutIntro(introContainer, overlay);
      });
    }, 9000);
  }

  fadeIn(element, duration) {
    const startTime = Date.now();
    const tick = () => {
      if (element.destroyed) return;
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      element.alpha = progress;
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };
    tick();
  }

  fadeOutIntro(introContainer, overlay) {
    // Fade overlay to semi-transparent (reveal the world underneath)
    const startTime = Date.now();
    const duration = 1500;

    const tick = () => {
      if (introContainer.destroyed) return;
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Fade everything out
      introContainer.children.forEach(child => {
        if (child !== overlay) {
          child.alpha = 1 - progress;
        }
      });

      // Fade overlay from black to transparent
      overlay.clear();
      overlay.rect(0, 0, this.width, this.height);
      overlay.fill({ color: 0x000000, alpha: 1 - progress });

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        introContainer.destroy();
        this.introActive = false;
        // Show touch controls now that intro is done
        if (this.touchControls) {
          this.touchControls.container.visible = true;
        }
      }
    };
    tick();
  }

  createBackground() {
    const bgContainer = new Container();

    const sky = new Graphics();
    const skyGradientTop = 0x0d1b2a;
    const skyGradientBottom = 0x1b263b;
    sky.rect(0, 0, 3000, 720);
    sky.fill({ color: skyGradientTop });
    bgContainer.addChild(sky);

    const skyOverlay = new Graphics();
    skyOverlay.rect(0, 300, 3000, 420);
    skyOverlay.fill({ color: skyGradientBottom, alpha: 0.7 });
    bgContainer.addChild(skyOverlay);

    this.stars = [];
    for (let i = 0; i < 80; i++) {
      const star = new Graphics();
      const size = 0.5 + Math.random() * 1.5;
      star.circle(0, 0, size);
      star.fill({ color: 0xffffff, alpha: 0.3 + Math.random() * 0.5 });
      star.x = Math.random() * 3000;
      star.y = Math.random() * 350;
      this.stars.push({ sprite: star, twinkle: Math.random() * Math.PI * 2 });
      bgContainer.addChild(star);
    }

    const moon = new Container();
    const moonGlow = new Graphics();
    moonGlow.circle(0, 0, 80);
    moonGlow.fill({ color: 0x4ecdc4, alpha: 0.15 });
    moonGlow.filters = [new BlurFilter({ strength: 15 })];

    const moonCore = new Graphics();
    moonCore.circle(0, 0, 40);
    moonCore.fill({ color: 0xf1faee, alpha: 0.9 });

    moon.addChild(moonGlow);
    moon.addChild(moonCore);
    moon.x = 2400;
    moon.y = 120;
    bgContainer.addChild(moon);
    this.moon = moon;

    const farTrees = this.createTreeSilhouette(0x0a1628, 0.4, 200);
    farTrees.y = 350;
    bgContainer.addChild(farTrees);
    this.farTrees = farTrees;

    const midTrees = this.createTreeSilhouette(0x112240, 0.6, 150);
    midTrees.y = 400;
    bgContainer.addChild(midTrees);
    this.midTrees = midTrees;

    this.bgContainer = bgContainer;
    this.backgroundLayer.addChild(bgContainer);
  }

  createTreeSilhouette(color, alpha, baseHeight) {
    const container = new Container();

    for (let x = -100; x < 3200; x += 60 + Math.random() * 40) {
      const tree = new Graphics();
      const height = baseHeight + Math.random() * 80;
      const width = 30 + Math.random() * 25;

      tree.moveTo(x, 0);
      tree.lineTo(x + width / 2, -height);
      tree.lineTo(x + width, 0);
      tree.closePath();
      tree.fill({ color, alpha });

      if (Math.random() > 0.6) {
        const trunk = new Graphics();
        trunk.rect(x + width * 0.35, 0, width * 0.3, 30);
        trunk.fill({ color: color, alpha: alpha * 0.8 });
        container.addChild(trunk);
      }

      container.addChild(tree);
    }

    return container;
  }

  createGround() {
    const groundContainer = new Container();
    const worldWidth = 2500;

    const groundBase = new Graphics();
    groundBase.rect(0, 620, worldWidth, 100);
    groundBase.fill({ color: 0x1a1a2e });
    groundContainer.addChild(groundBase);

    const grassLayer = new Graphics();
    grassLayer.rect(0, 615, worldWidth, 10);
    grassLayer.fill({ color: 0x2d5016 });
    groundContainer.addChild(grassLayer);

    for (let x = 0; x < worldWidth; x += 3 + Math.random() * 5) {
      const blade = new Graphics();
      const height = 5 + Math.random() * 12;
      blade.moveTo(x, 618);
      blade.lineTo(x + 1, 618 - height);
      blade.lineTo(x + 2, 618);
      blade.fill({ color: 0x3d6b1e, alpha: 0.7 + Math.random() * 0.3 });
      groundContainer.addChild(blade);
    }

    this.worldLayer.addChild(groundContainer);
    this.player.addCollider({ x: 0, y: 620, width: worldWidth, height: 100 });
  }

  createPlatforms() {
    // Redesigned so ALL platforms are reachable in order!
    // Max jump is ~130 pixels with new physics
    const platforms = [
      // Path to spark 1 (easy, just up from ground)
      { x: 200, y: 520, width: 180, height: 25 },

      // Path to spark 2 (staircase going right and up)
      { x: 450, y: 460, width: 150, height: 25 },
      { x: 650, y: 400, width: 150, height: 25 },

      // Path to spark 3 (continue staircase)
      { x: 850, y: 340, width: 150, height: 25 },
      { x: 1050, y: 280, width: 180, height: 25 },
    ];

    platforms.forEach(p => {
      const platformContainer = new Container();

      const platform = new Graphics();
      platform.roundRect(0, 0, p.width, p.height, 8);
      platform.fill({ color: 0x2d3436 });
      platformContainer.addChild(platform);

      const mossTop = new Graphics();
      mossTop.roundRect(0, 0, p.width, 8, 4);
      mossTop.fill({ color: 0x3d6b1e, alpha: 0.8 });
      platformContainer.addChild(mossTop);

      const highlight = new Graphics();
      highlight.roundRect(5, 3, p.width - 10, 2, 1);
      highlight.fill({ color: 0x4d7c2e, alpha: 0.5 });
      platformContainer.addChild(highlight);

      for (let i = 0; i < 3; i++) {
        const vine = new Graphics();
        const vx = 10 + Math.random() * (p.width - 20);
        const vLength = 15 + Math.random() * 25;
        vine.moveTo(vx, p.height);
        vine.lineTo(vx + (Math.random() - 0.5) * 10, p.height + vLength);
        vine.stroke({ color: 0x2d5016, width: 2, alpha: 0.6 });
        platformContainer.addChild(vine);
      }

      platformContainer.x = p.x;
      platformContainer.y = p.y;

      this.worldLayer.addChild(platformContainer);
      this.player.addCollider({ x: p.x, y: p.y, width: p.width, height: p.height });
    });
  }

  createTrees() {
    const treePositions = [
      { x: 150, scale: 1.2 },
      { x: 450, scale: 0.9 },
      { x: 800, scale: 1.1 },
      { x: 1100, scale: 1 },
      { x: 1400, scale: 1.3 },
      { x: 1700, scale: 0.85 },
      { x: 2000, scale: 1.15 },
    ];

    treePositions.forEach(pos => {
      const tree = this.createTree(pos.scale);
      tree.x = pos.x;
      tree.y = 620;
      this.worldLayer.addChild(tree);
    });
  }

  createTree(scale = 1) {
    const container = new Container();

    const trunk = new Graphics();
    const tw = 25 * scale;
    const th = 120 * scale;
    trunk.rect(-tw / 2, -th, tw, th);
    trunk.fill({ color: 0x3d2914 });

    const barkLine1 = new Graphics();
    barkLine1.moveTo(-tw * 0.3, -th * 0.2);
    barkLine1.lineTo(-tw * 0.2, -th * 0.8);
    barkLine1.stroke({ color: 0x2a1d0d, width: 2 });

    const barkLine2 = new Graphics();
    barkLine2.moveTo(tw * 0.2, -th * 0.3);
    barkLine2.lineTo(tw * 0.15, -th * 0.9);
    barkLine2.stroke({ color: 0x2a1d0d, width: 2 });

    container.addChild(trunk);
    container.addChild(barkLine1);
    container.addChild(barkLine2);

    const foliageLayers = [
      { y: -th - 30, r: 70 * scale, color: 0x1a3d00 },
      { y: -th - 60, r: 55 * scale, color: 0x234d00 },
      { y: -th - 85, r: 40 * scale, color: 0x2d5d10 },
    ];

    foliageLayers.forEach(f => {
      const foliage = new Graphics();
      foliage.circle(0, f.y, f.r);
      foliage.fill({ color: f.color, alpha: 0.9 });
      container.addChild(foliage);
    });

    return container;
  }

  createMemorySparks() {
    this.memorySparks = [];

    // Sparks positioned to be reachable from the platforms!
    const sparkPositions = [
      // Spark 1: Above first platform (easy jump from platform)
      { x: 290, y: 470, memory: 'Ember teaching baby birds to fly' },
      // Spark 2: Above middle platform (reachable with jump)
      { x: 725, y: 350, memory: 'Ember making a lonely rabbit laugh' },
      // Spark 3: Above highest platform
      { x: 1130, y: 230, memory: 'Ember dancing alone in the moonlight' },
    ];

    sparkPositions.forEach(pos => {
      const spark = new MemorySpark(this, pos.x, pos.y, pos.memory);
      this.memorySparks.push(spark);
      this.entityLayer.addChild(spark.sprite);

      this.lighting.addLight(pos.x, pos.y, 0xffaa00, 0.6, 100);
    });
  }

  createUI() {
    const uiContainer = new Container();

    const bg = new Graphics();
    bg.roundRect(10, 10, 180, 40, 10);
    bg.fill({ color: 0x000000, alpha: 0.4 });
    uiContainer.addChild(bg);

    this.memoryCounter = new Text({
      text: `✨ ${this.memoriesCollected}/${this.totalMemories} Memories`,
      style: {
        fontFamily: 'Georgia, serif',
        fontSize: 20,
        fill: 0xf1faee,
      },
    });
    this.memoryCounter.x = 25;
    this.memoryCounter.y = 18;
    uiContainer.addChild(this.memoryCounter);

    this.uiLayer.addChild(uiContainer);
  }

  update(delta) {
    super.update(delta);

    this.time = (this.time || 0) + delta * 0.02;
    this.stars?.forEach(s => {
      s.twinkle += delta * 0.03;
      s.sprite.alpha = 0.2 + Math.sin(s.twinkle) * 0.3;
    });

    if (this.moon) {
      this.moon.children[0].scale.set(1 + Math.sin(this.time * 0.5) * 0.05);
    }

    const cameraX = Math.max(0, this.player.x - this.width / 2);
    if (this.farTrees) this.farTrees.x = -cameraX * 0.2;
    if (this.midTrees) this.midTrees.x = -cameraX * 0.4;
    if (this.moon) this.moon.x = 2400 - cameraX * 0.1;

    this.memorySparks.forEach(spark => {
      spark.update(delta);

      if (!spark.collected && this.checkCollision(this.player, spark)) {
        this.collectMemory(spark);
      }
    });
  }

  checkCollision(player, spark) {
    const px = player.sprite.x;
    const py = player.sprite.y;
    const sx = spark.sprite.x;
    const sy = spark.sprite.y;
    const dist = Math.sqrt((px - sx) ** 2 + (py - sy) ** 2);
    return dist < 50;
  }

  collectMemory(spark) {
    spark.collect();
    this.memoriesCollected++;
    this.memoryCounter.text = `✨ ${this.memoriesCollected}/${this.totalMemories} Memories`;

    this.particles.emit(spark.x, spark.y, {
      count: 20,
      color: 0xffd93d,
      speed: 80,
      lifetime: 1.5,
      size: 4,
    });

    if (this.memoriesCollected >= this.totalMemories) {
      this.onAllMemoriesCollected();
    }
  }

  onAllMemoriesCollected() {
    const overlay = new Graphics();
    overlay.rect(0, 0, this.width, this.height);
    overlay.fill({ color: 0x000000, alpha: 0.5 });
    this.uiLayer.addChild(overlay);

    const completeContainer = new Container();

    const bg = new Graphics();
    bg.roundRect(-200, -60, 400, 120, 20);
    bg.fill({ color: 0x1a1a2e, alpha: 0.9 });
    bg.stroke({ color: 0xffaa00, width: 3, alpha: 0.8 });
    completeContainer.addChild(bg);

    const title = new Text({
      text: '✨ All memories found! ✨',
      style: {
        fontFamily: 'Georgia, serif',
        fontSize: 28,
        fill: 0xffd93d,
        align: 'center',
      },
    });
    title.anchor.set(0.5);
    title.y = -20;
    completeContainer.addChild(title);

    const subtitle = new Text({
      text: 'Ember remembers who she was...',
      style: {
        fontFamily: 'Georgia, serif',
        fontSize: 18,
        fill: 0xf1faee,
        align: 'center',
      },
    });
    subtitle.anchor.set(0.5);
    subtitle.y = 20;
    completeContainer.addChild(subtitle);

    completeContainer.x = this.width / 2;
    completeContainer.y = this.height / 2;
    this.uiLayer.addChild(completeContainer);
  }
}
