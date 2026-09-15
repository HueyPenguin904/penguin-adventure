import { Container, Graphics, Text, BlurFilter, Rectangle } from 'pixi.js';

/**
 * CutsceneSystem - Handles cinematic story moments
 *
 * Features:
 * - Letterbox black bars for cinematic feel
 * - Centered story text with typewriter
 * - Fade transitions
 * - Memory flashback scenes
 */
export class CutsceneSystem {
  constructor(scene) {
    this.scene = scene;
    this.container = new Container();
    this.isActive = false;

    this.setupUI();
    scene.uiLayer.addChild(this.container);
    this.container.visible = false;
  }

  setupUI() {
    const width = this.scene.width;
    const height = this.scene.height;

    // Full black background
    this.background = new Graphics();
    this.background.rect(0, 0, width, height);
    this.background.fill({ color: 0x000000 });
    this.container.addChild(this.background);

    // Letterbox bars
    this.topBar = new Graphics();
    this.topBar.rect(0, 0, width, 80);
    this.topBar.fill({ color: 0x000000 });
    this.container.addChild(this.topBar);

    this.bottomBar = new Graphics();
    this.bottomBar.rect(0, height - 80, width, 80);
    this.bottomBar.fill({ color: 0x000000 });
    this.container.addChild(this.bottomBar);

    // Center text container
    this.textContainer = new Container();
    this.textContainer.x = width / 2;
    this.textContainer.y = height / 2;
    this.container.addChild(this.textContainer);

    // Tap to continue at bottom
    this.tapText = new Text({
      text: '[ tap to continue ]',
      style: {
        fontFamily: 'Georgia, serif',
        fontSize: 16,
        fill: 0x666666,
      },
    });
    this.tapText.anchor.set(0.5);
    this.tapText.x = width / 2;
    this.tapText.y = height - 100;
    this.tapText.visible = false;
    this.container.addChild(this.tapText);

    // Make clickable - explicit hitArea for PixiJS v8
    this.background.eventMode = 'static';
    this.background.cursor = 'pointer';
    this.background.hitArea = new Rectangle(0, 0, width, height);
    this.background.on('pointerdown', () => this.onTap());
  }

  playIntro(onComplete) {
    const storyBeats = [
      {
        lines: [
          { text: 'The world has gone cold.', delay: 0, y: -40 },
        ],
        duration: 2500,
      },
      {
        lines: [
          { text: 'Not from ice...', delay: 0, y: -20 },
          { text: '...from loneliness.', delay: 800, y: 20 },
        ],
        duration: 3000,
      },
      {
        lines: [
          { text: 'Hearts that once burned bright', delay: 0, y: -40 },
          { text: 'have forgotten their warmth.', delay: 1000, y: 0 },
        ],
        duration: 3500,
      },
      {
        lines: [
          { text: 'But somewhere in these woods,', delay: 0, y: -30 },
          { text: 'there\'s a fox who forgot how to shine.', delay: 1200, y: 20 },
        ],
        duration: 4000,
      },
      {
        lines: [
          { text: 'Maybe...', delay: 0, y: -30, size: 28 },
          { text: 'a little penguin can help her remember.', delay: 1000, y: 20, size: 24 },
        ],
        duration: 3500,
      },
    ];

    this.playSequence(storyBeats, onComplete);
  }

  playMemoryFlashback(memoryText, onComplete) {
    // Golden/warm tint for memories
    this.background.clear();
    this.background.rect(0, 0, this.scene.width, this.scene.height);
    this.background.fill({ color: 0x1a1408, alpha: 0.95 });

    const storyBeats = [
      {
        lines: [
          { text: '✨ A Memory Returns ✨', delay: 0, y: -60, size: 20, color: 0xffd93d },
        ],
        duration: 1500,
      },
      {
        lines: [
          { text: memoryText, delay: 0, y: 0, size: 26, color: 0xfff8e7 },
        ],
        duration: 3000,
      },
    ];

    this.playSequence(storyBeats, () => {
      // Reset background color
      this.background.clear();
      this.background.rect(0, 0, this.scene.width, this.scene.height);
      this.background.fill({ color: 0x000000 });
      if (onComplete) onComplete();
    });
  }

  playEmberAwakening(onComplete) {
    this.background.clear();
    this.background.rect(0, 0, this.scene.width, this.scene.height);
    this.background.fill({ color: 0x0d0a05, alpha: 0.95 });

    const storyBeats = [
      {
        lines: [
          { text: 'The fox stirs.', delay: 0, y: 0, size: 28 },
        ],
        duration: 2000,
      },
      {
        lines: [
          { text: 'Her eyes flutter open...', delay: 0, y: -20, size: 26 },
          { text: 'and she sees the warmth you brought.', delay: 1200, y: 20, size: 26 },
        ],
        duration: 3500,
      },
    ];

    this.playSequence(storyBeats, () => {
      this.background.clear();
      this.background.rect(0, 0, this.scene.width, this.scene.height);
      this.background.fill({ color: 0x000000 });
      if (onComplete) onComplete();
    });
  }

  playEnding(onComplete) {
    this.background.clear();
    this.background.rect(0, 0, this.scene.width, this.scene.height);
    this.background.fill({ color: 0x000000 });

    const storyBeats = [
      {
        lines: [
          { text: '🔥', delay: 0, y: -80, size: 48 },
          { text: 'Ember remembers.', delay: 500, y: -20, size: 32, color: 0xff6b35 },
        ],
        duration: 3000,
      },
      {
        lines: [
          { text: 'She helped baby birds learn to fly.', delay: 0, y: -40, size: 24 },
          { text: 'She made lonely rabbits laugh.', delay: 1000, y: 0, size: 24 },
          { text: 'She danced alone in the moonlight,', delay: 2000, y: 40, size: 24 },
        ],
        duration: 4500,
      },
      {
        lines: [
          { text: 'just because it felt good.', delay: 0, y: 0, size: 26, color: 0xffd93d },
        ],
        duration: 2500,
      },
      {
        lines: [
          { text: 'She burned so bright for others...', delay: 0, y: -20, size: 24 },
          { text: 'she forgot to save any warmth for herself.', delay: 1200, y: 20, size: 24 },
        ],
        duration: 3500,
      },
      {
        lines: [
          { text: 'But now,', delay: 0, y: -40, size: 26 },
          { text: 'a little penguin reminded her:', delay: 800, y: 0, size: 26 },
        ],
        duration: 3000,
      },
      {
        lines: [
          { text: '"Sometimes the ones who give the most light', delay: 0, y: -30, size: 24, color: 0x74b9ff },
          { text: 'need someone to shine for them."', delay: 1500, y: 20, size: 24, color: 0x74b9ff },
        ],
        duration: 4000,
      },
      {
        lines: [
          { text: 'Level Complete', delay: 0, y: -50, size: 36, color: 0xff6b35 },
          { text: '~ Ember\'s Woods ~', delay: 800, y: 10, size: 22, color: 0xffd93d },
        ],
        duration: 4000,
      },
      {
        lines: [
          { text: 'Thank you for playing 🐧', delay: 0, y: 0, size: 22, color: 0x888888 },
        ],
        duration: 3000,
      },
    ];

    this.playSequence(storyBeats, onComplete);
  }

  playSequence(storyBeats, onComplete) {
    this.container.visible = true;
    this.isActive = true;
    this.scene.dialogueActive = true;
    this.storyBeats = storyBeats;
    this.beatIndex = 0;
    this.sequenceCallback = onComplete;
    this.waitingForTap = false;

    this.showCurrentBeat();
  }

  showCurrentBeat() {
    if (this.beatIndex >= this.storyBeats.length) {
      this.close();
      return;
    }

    const beat = this.storyBeats[this.beatIndex];

    // Clear previous text
    this.textContainer.removeChildren();

    // Create text for each line with delays
    beat.lines.forEach((lineData, index) => {
      const text = new Text({
        text: lineData.text,
        style: {
          fontFamily: 'Georgia, serif',
          fontSize: lineData.size || 28,
          fill: lineData.color || 0xf1faee,
          align: 'center',
        },
      });
      text.anchor.set(0.5);
      text.y = lineData.y || 0;
      text.alpha = 0;

      this.textContainer.addChild(text);

      // Fade in with delay
      setTimeout(() => {
        this.fadeInText(text);
      }, lineData.delay || 0);
    });

    // After duration, show tap prompt
    setTimeout(() => {
      this.waitingForTap = true;
      this.tapText.visible = true;
      this.tapText.alpha = 0;
      this.fadeInText(this.tapText);
    }, beat.duration);
  }

  fadeInText(text) {
    const fadeIn = () => {
      if (text.alpha < 1) {
        text.alpha += 0.05;
        requestAnimationFrame(fadeIn);
      }
    };
    fadeIn();
  }

  onTap() {
    if (!this.isActive) return;

    if (this.waitingForTap) {
      this.waitingForTap = false;
      this.tapText.visible = false;
      this.beatIndex++;

      // Fade out current text
      this.textContainer.children.forEach(child => {
        const fadeOut = () => {
          if (child.alpha > 0) {
            child.alpha -= 0.1;
            requestAnimationFrame(fadeOut);
          }
        };
        fadeOut();
      });

      // Show next beat after brief pause
      setTimeout(() => {
        this.showCurrentBeat();
      }, 400);
    }
  }

  close() {
    this.container.visible = false;
    this.isActive = false;
    this.scene.dialogueActive = false;

    if (this.sequenceCallback) {
      this.sequenceCallback();
      this.sequenceCallback = null;
    }
  }

  update(delta) {
    if (!this.isActive) return;

    // Subtle pulse on tap text
    if (this.tapText.visible && this.waitingForTap) {
      this.tapText.alpha = 0.5 + Math.sin(Date.now() * 0.005) * 0.3;
    }
  }
}
