import { Container, Graphics, Text } from 'pixi.js';
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
    this.buttons = [];

    this.createControls();

    // Check if we're on mobile
    this.isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Always show on mobile, hide on desktop by default
    this.container.visible = this.isMobile;
  }

  createControls() {
    const buttonSize = 90; // Bigger buttons = easier to hit
    const padding = 25;
    const bottomY = GAME.HEIGHT - buttonSize - padding;

    // Left button (bottom left)
    this.leftBtn = this.createButton(
      padding,
      bottomY,
      buttonSize,
      '←',
      () => { this.keys.left = true; },
      () => { this.keys.left = false; }
    );

    // Right button (next to left)
    this.rightBtn = this.createButton(
      padding + buttonSize + 15,
      bottomY,
      buttonSize,
      '→',
      () => { this.keys.right = true; },
      () => { this.keys.right = false; }
    );

    // Jump button (bottom right)
    this.jumpBtn = this.createButton(
      GAME.WIDTH - buttonSize - padding,
      bottomY,
      buttonSize,
      '↑',
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

    // Make it interactive
    button.eventMode = 'static';
    button.cursor = 'pointer';

    // Touch/mouse events - with scale feedback
    const pressButton = (e) => {
      if (e) e.stopPropagation();
      button.scale.set(0.9); // Shrink slightly when pressed
      bg.alpha = 0.7;
      onDown();
    };

    const releaseButton = () => {
      button.scale.set(1.0); // Back to normal
      bg.alpha = 0.4;
      onUp();
    };

    button.on('pointerdown', pressButton);
    button.on('pointerup', releaseButton);
    button.on('pointerupoutside', releaseButton);
    button.on('touchend', releaseButton);
    button.on('touchendoutside', releaseButton);
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
