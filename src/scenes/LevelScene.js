import { Container } from 'pixi.js';
import { BaseScene } from './BaseScene.js';
import { Player } from '../entities/Player.js';
import { LightingSystem } from '../systems/LightingSystem.js';
import { CameraSystem } from '../systems/CameraSystem.js';
import { DialogSystem } from '../systems/DialogSystem.js';
import { ParticleSystem } from '../systems/ParticleSystem.js';
import { TouchControls } from '../systems/TouchControls.js';

/**
 * LevelScene - base class for all playable levels.
 * Extend this and override setup() to create new levels.
 */
export class LevelScene extends BaseScene {
  constructor(sceneManager, levelData) {
    super(sceneManager);
    this.levelData = levelData;
    this.isPaused = false;
  }

  async init() {
    this.backgroundLayer = new Container();
    this.worldLayer = new Container();
    this.entityLayer = new Container();
    this.foregroundLayer = new Container();
    this.uiLayer = new Container();

    this.container.addChild(this.backgroundLayer);
    this.container.addChild(this.worldLayer);
    this.container.addChild(this.entityLayer);
    this.container.addChild(this.foregroundLayer);
    this.container.addChild(this.uiLayer);

    this.lighting = new LightingSystem(this);
    this.camera = new CameraSystem(this);
    this.dialog = new DialogSystem(this);
    this.particles = new ParticleSystem(this);

    this.player = new Player(this);
    this.entityLayer.addChild(this.player.sprite);

    this.foregroundLayer.addChild(this.particles.container);
    this.foregroundLayer.addChild(this.lighting.lightLayer);

    await this.setup();

    this.setupInput();

    // Add touch controls for mobile (must be after setupInput so this.keys exists)
    this.touchControls = new TouchControls(this, this.keys);
    this.uiLayer.addChild(this.touchControls.container);
  }

  async setup() {
    // Override in subclass to add level-specific content
  }

  setupInput() {
    this.keys = {
      left: false,
      right: false,
      jump: false,
    };

    this.handleKeyDown = (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.keys.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') this.keys.right = true;
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        this.keys.jump = true;
      }
      if (e.code === 'Escape') this.togglePause();
    };

    this.handleKeyUp = (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.keys.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') this.keys.right = false;
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        this.keys.jump = false;
      }
    };

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  update(delta) {
    if (this.isPaused || this.introActive) return;

    this.player.update(delta, this.keys);

    this.camera.follow(this.player.sprite.x, this.player.sprite.y);

    this.lighting.update(delta);
    this.particles.update(delta);
  }

  togglePause() {
    this.isPaused = !this.isPaused;
  }

  destroy() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    if (this.touchControls) {
      this.touchControls.destroy();
    }
    super.destroy();
  }
}
