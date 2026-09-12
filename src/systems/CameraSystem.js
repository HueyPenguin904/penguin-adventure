import { CAMERA, GAME } from '../config/constants.js';

/**
 * CameraSystem - follows the player smoothly.
 * Moves the world layer to simulate camera movement.
 */
export class CameraSystem {
  constructor(scene) {
    this.scene = scene;
    this.targetX = 0;
    this.targetY = 0;
    this.currentX = 0;
    this.currentY = 0;
  }

  follow(x, y) {
    this.targetX = x - GAME.WIDTH / 2;
    this.targetY = y - GAME.HEIGHT / 2;

    this.currentX += (this.targetX - this.currentX) * CAMERA.LERP;
    this.currentY += (this.targetY - this.currentY) * CAMERA.LERP;

    if (this.currentX < 0) this.currentX = 0;
    if (this.currentY > 0) this.currentY = 0;

    this.scene.worldLayer.x = -this.currentX;
    this.scene.worldLayer.y = -this.currentY;
    this.scene.entityLayer.x = -this.currentX;
    this.scene.entityLayer.y = -this.currentY;
    this.scene.foregroundLayer.x = -this.currentX;
    this.scene.foregroundLayer.y = -this.currentY;

    if (this.scene.backgroundLayer.children.length > 0) {
      this.scene.backgroundLayer.x = -this.currentX * 0.3;
      this.scene.backgroundLayer.y = -this.currentY * 0.3;
    }
  }
}
