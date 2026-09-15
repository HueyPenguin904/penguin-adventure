import { Container, Graphics, Text, Circle } from 'pixi.js';
import { GAME } from '../config/constants.js';

/**
 * TouchControls - on-screen buttons for mobile devices
 * Creates left/right arrows and a jump button
 */
export class TouchControls {
  constructor(scene, keys) {
    this.scene = scene;
    this.keys = keys; // Reference to the keys object from LevelScene

    this.container = new Container();
    this.container.eventMode = 'static';
    this.container.interactiveChildren = true;
    this.buttons = [];

    // Debug text to show touch status
    this.debugText = new Text({
      text: 'Touch: waiting...',
      style: { fontSize: 14, fill: 0x00ff00 }
    });
    this.debugText.x = 10;
    this.debugText.y = 60;
    this.container.addChild(this.debugText);
    this.touchCount = 0;

    this.createControls();

    // Check if we're on mobile
    this.isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Always show on mobile, hide on desktop by default
    this.container.visible = this.isMobile;

    // Global touch debug - listen on the whole scene
    if (scene.app && scene.app.canvas) {
      scene.app.canvas.addEventListener('touchstart', (e) => {
        this.debugText.text = `Canvas touch: ${e.touches.length} @ (${Math.round(e.touches[0].clientX)}, ${Math.round(e.touches[0].clientY)})`;
      });
    }
  }

  createControls() {
    const buttonSize = 100; // Even bigger buttons!
    const padding = 20;
    const bottomY = GAME.HEIGHT - buttonSize - padding;

    // Left button (bottom left)
    this.leftBtn = this.createButton(
      padding,
      bottomY,
      buttonSize,
      '◀',
      () => { this.keys.left = true; },
      () => { this.keys.left = false; }
    );

    // Right button (next to left)
    this.rightBtn = this.createButton(
      padding + buttonSize + 20,
      bottomY,
      buttonSize,
      '▶',
      () => { this.keys.right = true; },
      () => { this.keys.right = false; }
    );

    // Jump button (bottom right)
    this.jumpBtn = this.createButton(
      GAME.WIDTH - buttonSize - padding,
      bottomY,
      buttonSize,
      '▲',
      () => { this.keys.jump = true; },
      () => { this.keys.jump = false; }
    );

    this.container.addChild(this.leftBtn);
    this.container.addChild(this.rightBtn);
    this.container.addChild(this.jumpBtn);
  }

  createButton(x, y, size, label, onDown, onUp) {
    const button = new Container();
    button.x = x;
    button.y = y;

    // Semi-transparent circle background
    const bg = new Graphics();
    bg.circle(size / 2, size / 2, size / 2);
    bg.fill({ color: 0x000000, alpha: 0.4 });
    bg.stroke({ width: 3, color: 0xffffff, alpha: 0.6 });
    button.addChild(bg);

    // Arrow/label text
    const text = new Text({
      text: label,
      style: {
        fontFamily: 'Arial, sans-serif',
        fontSize: 36,
        fill: 0xffffff,
        fontWeight: 'bold',
      }
    });
    text.anchor.set(0.5);
    text.x = size / 2;
    text.y = size / 2;
    button.addChild(text);

    // Make it interactive with explicit hit area
    button.eventMode = 'static';
    button.cursor = 'pointer';
    button.hitArea = new Circle(size / 2, size / 2, size / 2);

    // Direct touch handling - no delays!
    const pressButton = () => {
      console.log('Button pressed:', label);
      this.touchCount++;
      this.debugText.text = `Touch: ${label} (${this.touchCount})`;
      button.scale.set(0.85);
      bg.alpha = 0.8;
      onDown();
    };

    const releaseButton = () => {
      button.scale.set(1.0);
      bg.alpha = 0.4;
      onUp();
    };

    // Use pointer events for fastest response
    button.on('pointerdown', pressButton);
    button.on('pointerup', releaseButton);
    button.on('pointerupoutside', releaseButton);
    button.on('pointercancel', releaseButton);

    this.buttons.push({ button, bg, onUp });

    return button;
  }

  // Show/hide controls
  show() {
    this.container.visible = true;
  }

  hide() {
    this.container.visible = false;
  }

  // Reset all buttons (useful when scene changes)
  reset() {
    for (const { button, bg, onUp } of this.buttons) {
      button.scale.set(1.0);
      bg.alpha = 0.4;
      onUp();
    }
  }

  destroy() {
    this.reset();
    this.container.destroy({ children: true });
  }
}
