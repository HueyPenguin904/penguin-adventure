import { Sprite, Assets, Container, Graphics } from 'pixi.js';
import { PHYSICS } from '../config/constants.js';
import { SPRITES } from '../config/assets.js';

export class Player {
  constructor(scene) {
    this.scene = scene;

    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.grounded = false;

    this.width = 60;
    this.height = 80;

    this.colliders = [];

    this.sprite = this.createSprite();
  }

  createSprite() {
    const container = new Container();

    // Try to load actual sprite, fall back to placeholder
    const texture = Assets.get(SPRITES.penguin);

    if (texture) {
      const penguinSprite = new Sprite(texture);
      penguinSprite.anchor.set(0.5, 0.5);
      penguinSprite.width = this.width;
      penguinSprite.height = this.height;
      container.addChild(penguinSprite);
    } else {
      // Fallback to simple shape
      const body = new Graphics();
      body.ellipse(0, 0, this.width / 2, this.height / 2);
      body.fill({ color: 0x2d3436 });
      container.addChild(body);
    }

    return container;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
    this.sprite.x = x;
    this.sprite.y = y;
  }

  addCollider(rect) {
    this.colliders.push(rect);
  }

  update(delta, keys) {
    if (keys.left) {
      this.vx = -PHYSICS.PLAYER_SPEED;
      this.sprite.scale.x = -1;
    } else if (keys.right) {
      this.vx = PHYSICS.PLAYER_SPEED;
      this.sprite.scale.x = 1;
    } else {
      this.vx *= PHYSICS.FRICTION;
    }

    if (keys.jump && this.grounded) {
      this.vy = -PHYSICS.PLAYER_JUMP;
      this.grounded = false;
    }

    this.vy += PHYSICS.GRAVITY * delta;

    this.x += this.vx * delta;
    this.y += this.vy * delta;

    this.handleCollisions();

    this.sprite.x = this.x;
    this.sprite.y = this.y;
  }

  handleCollisions() {
    this.grounded = false;

    const playerBottom = this.y + this.height / 2;
    const playerTop = this.y - this.height / 2;
    const playerLeft = this.x - this.width / 2;
    const playerRight = this.x + this.width / 2;

    for (const col of this.colliders) {
      const colLeft = col.x;
      const colRight = col.x + col.width;
      const colTop = col.y;
      const colBottom = col.y + col.height;

      if (playerRight > colLeft && playerLeft < colRight) {
        if (playerBottom > colTop && playerBottom < colBottom + 20 && this.vy >= 0) {
          this.y = colTop - this.height / 2;
          this.vy = 0;
          this.grounded = true;
        }
      }
    }

    if (this.x < this.width / 2) this.x = this.width / 2;
  }
}
