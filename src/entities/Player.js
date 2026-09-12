import { Container, Graphics } from 'pixi.js';
import { PHYSICS } from '../config/constants.js';

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

    // Draw a cute penguin with graphics (no image needed!)
    // Body - black oval
    const body = new Graphics();
    body.ellipse(0, 0, this.width / 2.2, this.height / 2);
    body.fill({ color: 0x1a1a2e });
    container.addChild(body);

    // Belly - white oval
    const belly = new Graphics();
    belly.ellipse(0, 5, this.width / 3, this.height / 2.5);
    belly.fill({ color: 0xf1faee });
    container.addChild(belly);

    // Left eye
    const leftEye = new Graphics();
    leftEye.circle(-10, -15, 8);
    leftEye.fill({ color: 0xffffff });
    const leftPupil = new Graphics();
    leftPupil.circle(-10, -15, 4);
    leftPupil.fill({ color: 0x1a1a2e });
    container.addChild(leftEye);
    container.addChild(leftPupil);

    // Right eye
    const rightEye = new Graphics();
    rightEye.circle(10, -15, 8);
    rightEye.fill({ color: 0xffffff });
    const rightPupil = new Graphics();
    rightPupil.circle(10, -15, 4);
    rightPupil.fill({ color: 0x1a1a2e });
    container.addChild(rightEye);
    container.addChild(rightPupil);

    // Beak - orange triangle
    const beak = new Graphics();
    beak.moveTo(0, -5);
    beak.lineTo(-8, 5);
    beak.lineTo(8, 5);
    beak.closePath();
    beak.fill({ color: 0xff9500 });
    container.addChild(beak);

    // Feet - orange
    const leftFoot = new Graphics();
    leftFoot.ellipse(-15, this.height / 2 - 5, 12, 6);
    leftFoot.fill({ color: 0xff9500 });
    const rightFoot = new Graphics();
    rightFoot.ellipse(15, this.height / 2 - 5, 12, 6);
    rightFoot.fill({ color: 0xff9500 });
    container.addChild(leftFoot);
    container.addChild(rightFoot);

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
    // Smooth acceleration instead of instant full speed
    if (keys.left) {
      this.vx -= PHYSICS.PLAYER_ACCEL;
      if (this.vx < -PHYSICS.PLAYER_SPEED) this.vx = -PHYSICS.PLAYER_SPEED;
      this.sprite.scale.x = -1;
    } else if (keys.right) {
      this.vx += PHYSICS.PLAYER_ACCEL;
      if (this.vx > PHYSICS.PLAYER_SPEED) this.vx = PHYSICS.PLAYER_SPEED;
      this.sprite.scale.x = 1;
    } else {
      // Smooth deceleration
      this.vx *= PHYSICS.FRICTION;
      if (Math.abs(this.vx) < 1) this.vx = 0;
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
