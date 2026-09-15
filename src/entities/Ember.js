import { Container, Graphics, BlurFilter } from 'pixi.js';

/**
 * Ember - a fox who burned too bright helping others.
 * Now she sits dim in her hollow, forgetting who she was.
 * As memories are returned, her glow grows stronger.
 */
export class Ember {
  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.visible = false;
    this.glowIntensity = 0.2; // Starts dim, grows as memories return
    this.memoriesRestored = 0;

    this.sprite = this.createSprite();
    this.sprite.x = x;
    this.sprite.y = y;
    this.sprite.visible = false;

    this.time = 0;
  }

  createSprite() {
    const container = new Container();

    // Warm glow around Ember (starts very dim)
    this.glowGraphics = new Graphics();
    this.glowGraphics.circle(0, 0, 80);
    this.glowGraphics.fill({ color: 0xff6b35, alpha: 0.1 });
    this.glowGraphics.filters = [new BlurFilter({ strength: 20 })];
    container.addChild(this.glowGraphics);

    // Fox body - sitting pose
    // Main body (orange-red)
    const body = new Graphics();
    body.ellipse(0, 15, 35, 30);
    body.fill({ color: 0xd35400 });
    container.addChild(body);

    // White chest patch
    const chest = new Graphics();
    chest.ellipse(0, 25, 20, 18);
    chest.fill({ color: 0xf5f5dc });
    container.addChild(chest);

    // Head
    const head = new Graphics();
    head.circle(0, -20, 28);
    head.fill({ color: 0xe67e22 });
    container.addChild(head);

    // White face marking
    const facePatch = new Graphics();
    facePatch.ellipse(0, -12, 15, 18);
    facePatch.fill({ color: 0xf5f5dc });
    container.addChild(facePatch);

    // Left ear
    const leftEar = new Graphics();
    leftEar.moveTo(-20, -40);
    leftEar.lineTo(-12, -55);
    leftEar.lineTo(-5, -40);
    leftEar.closePath();
    leftEar.fill({ color: 0xd35400 });
    container.addChild(leftEar);

    // Left ear inner
    const leftEarInner = new Graphics();
    leftEarInner.moveTo(-17, -42);
    leftEarInner.lineTo(-12, -50);
    leftEarInner.lineTo(-8, -42);
    leftEarInner.closePath();
    leftEarInner.fill({ color: 0xffb6c1 });
    container.addChild(leftEarInner);

    // Right ear
    const rightEar = new Graphics();
    rightEar.moveTo(20, -40);
    rightEar.lineTo(12, -55);
    rightEar.lineTo(5, -40);
    rightEar.closePath();
    rightEar.fill({ color: 0xd35400 });
    container.addChild(rightEar);

    // Right ear inner
    const rightEarInner = new Graphics();
    rightEarInner.moveTo(17, -42);
    rightEarInner.lineTo(12, -50);
    rightEarInner.lineTo(8, -42);
    rightEarInner.closePath();
    rightEarInner.fill({ color: 0xffb6c1 });
    container.addChild(rightEarInner);

    // Eyes (tired, half-closed at first)
    this.leftEye = new Graphics();
    this.leftEye.ellipse(-10, -22, 6, 4);
    this.leftEye.fill({ color: 0x2c1810 });
    container.addChild(this.leftEye);

    this.rightEye = new Graphics();
    this.rightEye.ellipse(10, -22, 6, 4);
    this.rightEye.fill({ color: 0x2c1810 });
    container.addChild(this.rightEye);

    // Nose
    const nose = new Graphics();
    nose.circle(0, -8, 5);
    nose.fill({ color: 0x1a1a1a });
    container.addChild(nose);

    // Fluffy tail curled around body
    const tail = new Graphics();
    tail.moveTo(30, 30);
    tail.quadraticCurveTo(55, 10, 45, -10);
    tail.quadraticCurveTo(35, -20, 25, -5);
    tail.quadraticCurveTo(20, 10, 30, 30);
    tail.fill({ color: 0xe67e22 });
    container.addChild(tail);

    // Tail white tip
    const tailTip = new Graphics();
    tailTip.ellipse(42, -8, 8, 6);
    tailTip.fill({ color: 0xf5f5dc });
    container.addChild(tailTip);

    // Front paws
    const leftPaw = new Graphics();
    leftPaw.ellipse(-15, 45, 10, 6);
    leftPaw.fill({ color: 0xd35400 });
    container.addChild(leftPaw);

    const rightPaw = new Graphics();
    rightPaw.ellipse(15, 45, 10, 6);
    rightPaw.fill({ color: 0xd35400 });
    container.addChild(rightPaw);

    return container;
  }

  show() {
    this.visible = true;
    this.sprite.visible = true;
    this.sprite.alpha = 0;

    // Fade in effect
    const fadeIn = () => {
      if (this.sprite.alpha < 1) {
        this.sprite.alpha += 0.02;
        requestAnimationFrame(fadeIn);
      }
    };
    fadeIn();
  }

  hide() {
    this.visible = false;
    this.sprite.visible = false;
  }

  restoreMemory() {
    this.memoriesRestored++;
    // Each memory makes her glow brighter
    this.glowIntensity = 0.2 + (this.memoriesRestored * 0.25);

    // Eyes open wider as she remembers
    if (this.memoriesRestored >= 3) {
      // Fully awake - redraw eyes as circles
      this.leftEye.clear();
      this.leftEye.circle(-10, -22, 6);
      this.leftEye.fill({ color: 0x2c1810 });

      this.rightEye.clear();
      this.rightEye.circle(10, -22, 6);
      this.rightEye.fill({ color: 0x2c1810 });

      // Add eye shine
      const leftShine = new Graphics();
      leftShine.circle(-8, -24, 2);
      leftShine.fill({ color: 0xffffff });
      this.sprite.addChild(leftShine);

      const rightShine = new Graphics();
      rightShine.circle(12, -24, 2);
      rightShine.fill({ color: 0xffffff });
      this.sprite.addChild(rightShine);
    }
  }

  startFollowing(target) {
    this.following = true;
    this.target = target;
    this.followSpeed = 3;
  }

  stopFollowing() {
    this.following = false;
    this.target = null;
  }

  update(delta) {
    if (!this.visible) return;

    this.time += delta * 0.02;

    // Following behavior - walk toward player
    if (this.following && this.target) {
      const dx = this.target.x - this.x;
      const distance = Math.abs(dx);

      if (distance > 80) {
        // Move toward player
        const direction = dx > 0 ? 1 : -1;
        this.x += direction * this.followSpeed * delta;
        this.sprite.x = this.x;

        // Face the right direction
        this.sprite.scale.x = direction;

        // Walking animation
        this.sprite.y = this.y + Math.sin(this.time * 10) * 3;
      } else {
        // Close enough, just idle
        this.sprite.y = this.y;
      }
    }

    // Gentle breathing animation
    this.sprite.scale.y = 1 + Math.sin(this.time * 2) * 0.02;

    // Update glow
    this.glowGraphics.clear();
    this.glowGraphics.circle(0, 0, 80 + Math.sin(this.time * 3) * 5);
    this.glowGraphics.fill({
      color: 0xff6b35,
      alpha: this.glowIntensity * (0.8 + Math.sin(this.time * 2) * 0.2)
    });
  }
}
