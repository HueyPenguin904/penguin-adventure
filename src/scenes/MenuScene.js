import { Container, Text, Graphics, BlurFilter } from 'pixi.js';
import { BaseScene } from './BaseScene.js';
import { LEVELS } from '../config/levels.js';

export class MenuScene extends BaseScene {
  async init() {
    try {
      console.log('MenuScene: creating background...');
      this.createBackground();
      console.log('MenuScene: background done');

      console.log('MenuScene: creating title...');
      this.createTitle();
      console.log('MenuScene: title done');

      console.log('MenuScene: creating play button...');
      this.createPlayButton();
      console.log('MenuScene: play button done');

      console.log('MenuScene: setting up input...');
      this.setupInput();
      console.log('MenuScene: input done');

      this.time = 0;
      console.log('MenuScene: fully initialized!');
    } catch (err) {
      console.error('MenuScene init error:', err);
      throw err;
    }
  }

  createBackground() {
    const bg = new Graphics();
    bg.rect(0, 0, this.width, this.height);
    bg.fill({ color: 0x0d1b2a });
    this.container.addChild(bg);

    const gradient = new Graphics();
    gradient.rect(0, this.height * 0.5, this.width, this.height * 0.5);
    gradient.fill({ color: 0x1b263b, alpha: 0.8 });
    this.container.addChild(gradient);

    this.stars = [];
    for (let i = 0; i < 100; i++) {
      const star = new Graphics();
      const size = 0.5 + Math.random() * 2;
      star.circle(0, 0, size);
      star.fill({ color: 0xffffff, alpha: 0.2 + Math.random() * 0.6 });
      star.x = Math.random() * this.width;
      star.y = Math.random() * this.height * 0.6;
      this.stars.push({ sprite: star, phase: Math.random() * Math.PI * 2 });
      this.container.addChild(star);
    }

    const moonContainer = new Container();

    const moonGlow = new Graphics();
    moonGlow.circle(0, 0, 100);
    moonGlow.fill({ color: 0x4ecdc4, alpha: 0.12 });
    moonGlow.filters = [new BlurFilter({ strength: 20 })];

    const moonGlow2 = new Graphics();
    moonGlow2.circle(0, 0, 60);
    moonGlow2.fill({ color: 0xf1faee, alpha: 0.2 });
    moonGlow2.filters = [new BlurFilter({ strength: 10 })];

    const moonCore = new Graphics();
    moonCore.circle(0, 0, 35);
    moonCore.fill({ color: 0xf1faee, alpha: 0.95 });

    moonContainer.addChild(moonGlow);
    moonContainer.addChild(moonGlow2);
    moonContainer.addChild(moonCore);
    moonContainer.x = this.width - 150;
    moonContainer.y = 120;
    this.container.addChild(moonContainer);
    this.moon = moonContainer;

    const hillFar = new Graphics();
    hillFar.moveTo(0, this.height);
    hillFar.quadraticCurveTo(this.width * 0.3, this.height - 100, this.width * 0.6, this.height);
    hillFar.lineTo(0, this.height);
    hillFar.fill({ color: 0x112240 });
    this.container.addChild(hillFar);

    const hillNear = new Graphics();
    hillNear.moveTo(this.width * 0.4, this.height);
    hillNear.quadraticCurveTo(this.width * 0.7, this.height - 80, this.width, this.height - 30);
    hillNear.lineTo(this.width, this.height);
    hillNear.lineTo(this.width * 0.4, this.height);
    hillNear.fill({ color: 0x1a3050 });
    this.container.addChild(hillNear);

    for (let i = 0; i < 8; i++) {
      const tree = new Graphics();
      const x = 80 + i * (this.width - 160) / 7 + (Math.random() - 0.5) * 40;
      const height = 60 + Math.random() * 40;
      const width = 20 + Math.random() * 15;

      tree.moveTo(x, this.height);
      tree.lineTo(x + width / 2, this.height - height);
      tree.lineTo(x + width, this.height);
      tree.closePath();
      tree.fill({ color: 0x0a1628, alpha: 0.8 });

      this.container.addChild(tree);
    }

    this.floatingParticles = [];
    for (let i = 0; i < 20; i++) {
      const particle = new Graphics();
      particle.circle(0, 0, 2 + Math.random() * 2);
      particle.fill({ color: 0xffcc00, alpha: 0.3 + Math.random() * 0.3 });
      particle.filters = [new BlurFilter({ strength: 2 })];
      particle.x = Math.random() * this.width;
      particle.y = this.height * 0.5 + Math.random() * this.height * 0.4;

      this.floatingParticles.push({
        sprite: particle,
        baseY: particle.y,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.4,
      });
      this.container.addChild(particle);
    }
  }

  createTitle() {
    const titleContainer = new Container();
    titleContainer.x = this.width / 2;
    titleContainer.y = this.height * 0.28;

    const titleGlow = new Text({
      text: 'Penguin Adventure',
      style: {
        fontFamily: 'Georgia, serif',
        fontSize: 68,
        fill: 0x4ecdc4,
        align: 'center',
      },
    });
    titleGlow.anchor.set(0.5);
    titleGlow.filters = [new BlurFilter({ strength: 8 })];
    titleGlow.alpha = 0.5;
    titleContainer.addChild(titleGlow);

    const title = new Text({
      text: 'Penguin Adventure',
      style: {
        fontFamily: 'Georgia, serif',
        fontSize: 68,
        fill: 0xf1faee,
        align: 'center',
      },
    });
    title.anchor.set(0.5);
    titleContainer.addChild(title);

    this.container.addChild(titleContainer);
    this.titleContainer = titleContainer;

    const subtitle = new Text({
      text: 'A story about warmth in cold places',
      style: {
        fontFamily: 'Georgia, serif',
        fontSize: 22,
        fill: 0xa8dadc,
        align: 'center',
      },
    });
    subtitle.anchor.set(0.5);
    subtitle.x = this.width / 2;
    subtitle.y = this.height * 0.28 + 55;
    this.container.addChild(subtitle);
  }

  createPlayButton() {
    const button = new Container();
    button.x = this.width / 2;
    button.y = this.height * 0.55;
    button.eventMode = 'static';
    button.cursor = 'pointer';

    const glow = new Graphics();
    glow.roundRect(-135, -40, 270, 80, 40);
    glow.fill({ color: 0x4ecdc4, alpha: 0.2 });
    glow.filters = [new BlurFilter({ strength: 10 })];
    button.addChild(glow);
    this.buttonGlow = glow;

    const bg = new Graphics();
    bg.roundRect(-120, -30, 240, 60, 30);
    bg.fill({ color: 0x457b9d });
    button.addChild(bg);
    this.buttonBg = bg;

    const border = new Graphics();
    border.roundRect(-120, -30, 240, 60, 30);
    border.stroke({ color: 0x4ecdc4, width: 2, alpha: 0.6 });
    button.addChild(border);

    const text = new Text({
      text: '✨ Begin Journey',
      style: {
        fontFamily: 'Georgia, serif',
        fontSize: 26,
        fill: 0xf1faee,
      },
    });
    text.anchor.set(0.5);
    button.addChild(text);

    button.on('pointerover', () => {
      this.buttonBg.clear();
      this.buttonBg.roundRect(-120, -30, 240, 60, 30);
      this.buttonBg.fill({ color: 0x1d3557 });
      this.buttonGlow.alpha = 1;
    });

    button.on('pointerout', () => {
      this.buttonBg.clear();
      this.buttonBg.roundRect(-120, -30, 240, 60, 30);
      this.buttonBg.fill({ color: 0x457b9d });
      this.buttonGlow.alpha = 0.5;
    });

    button.on('pointerdown', () => this.startGame());

    this.container.addChild(button);
    this.playButton = button;

    const hint = new Text({
      text: 'Press SPACE or click to start',
      style: {
        fontFamily: 'Georgia, serif',
        fontSize: 16,
        fill: 0x6c757d,
        align: 'center',
      },
    });
    hint.anchor.set(0.5);
    hint.x = this.width / 2;
    hint.y = this.height * 0.65;
    this.container.addChild(hint);

    const controls = new Text({
      text: '← → or A D to move  •  SPACE to jump',
      style: {
        fontFamily: 'Georgia, serif',
        fontSize: 14,
        fill: 0x495057,
        align: 'center',
      },
    });
    controls.anchor.set(0.5);
    controls.x = this.width / 2;
    controls.y = this.height - 40;
    this.container.addChild(controls);
  }

  setupInput() {
    this.handleKey = (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        this.startGame();
      }
    };
    window.addEventListener('keydown', this.handleKey);
  }

  update(delta) {
    this.time += delta * 0.02;

    this.stars?.forEach(s => {
      s.phase += delta * 0.02;
      s.sprite.alpha = 0.15 + Math.sin(s.phase) * 0.35;
    });

    if (this.moon) {
      this.moon.children[0].scale.set(1 + Math.sin(this.time * 0.3) * 0.08);
    }

    this.floatingParticles?.forEach(p => {
      p.phase += p.speed * delta * 0.02;
      p.sprite.y = p.baseY + Math.sin(p.phase) * 15;
      p.sprite.alpha = 0.2 + Math.sin(p.phase * 1.5) * 0.2;
    });

    if (this.titleContainer) {
      this.titleContainer.y = this.height * 0.28 + Math.sin(this.time * 0.5) * 3;
    }

    if (this.buttonGlow) {
      const pulse = 0.3 + Math.sin(this.time * 2) * 0.2;
      this.buttonGlow.alpha = pulse;
    }
  }

  async startGame() {
    const firstLevel = LEVELS.find(l => l.unlocked);
    if (!firstLevel) return;

    const module = await firstLevel.module();
    const LevelClass = module.default;
    this.sceneManager.switchTo(new LevelClass(this.sceneManager, firstLevel));
  }

  destroy() {
    window.removeEventListener('keydown', this.handleKey);
    super.destroy();
  }
}
