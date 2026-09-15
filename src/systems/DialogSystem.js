import { Container, Graphics, Text } from 'pixi.js';

/**
 * DialogSystem - Handles all story text and cutscenes
 *
 * Features:
 * - Typewriter text effect
 * - Speaker names with colored borders
 * - Tap/click to advance or skip typing
 * - Callback when complete
 */
export class DialogSystem {
  constructor(scene) {
    this.scene = scene;
    this.container = new Container();
    this.isActive = false;
    this.isTyping = false;
    this.currentCallback = null;
    this.lines = [];
    this.lineIndex = 0;
    this.charIndex = 0;
    this.typeSpeed = 25;
    this.lastTypeTime = 0;

    this.setupUI();
    scene.uiLayer.addChild(this.container);
    this.container.visible = false;
  }

  setupUI() {
    const width = this.scene.width;
    const height = this.scene.height;

    // Semi-transparent overlay
    this.overlay = new Graphics();
    this.overlay.rect(0, 0, width, height);
    this.overlay.fill({ color: 0x000000, alpha: 0.5 });
    this.overlay.eventMode = 'static';
    this.overlay.cursor = 'pointer';
    this.overlay.on('pointerdown', () => this.onTap());
    this.container.addChild(this.overlay);

    // Dialogue box at bottom
    const boxHeight = 140;
    const boxY = height - boxHeight - 20;
    const boxX = 40;
    const boxWidth = width - 80;

    this.boxY = boxY;
    this.boxX = boxX;
    this.boxWidth = boxWidth;
    this.boxHeight = boxHeight;

    // Box background
    this.dialogueBox = new Graphics();
    this.dialogueBox.roundRect(boxX, boxY, boxWidth, boxHeight, 12);
    this.dialogueBox.fill({ color: 0x0d1b2a, alpha: 0.95 });
    this.dialogueBox.stroke({ color: 0x4ecdc4, width: 2, alpha: 0.8 });
    this.container.addChild(this.dialogueBox);

    // Inner glow
    const innerGlow = new Graphics();
    innerGlow.roundRect(boxX + 3, boxY + 3, boxWidth - 6, boxHeight - 6, 10);
    innerGlow.stroke({ color: 0x4ecdc4, width: 1, alpha: 0.3 });
    this.container.addChild(innerGlow);

    // Speaker name background
    this.speakerBg = new Graphics();
    this.speakerBg.roundRect(boxX + 15, boxY - 18, 120, 36, 8);
    this.speakerBg.fill({ color: 0x1b263b, alpha: 0.95 });
    this.speakerBg.stroke({ color: 0xff6b35, width: 2 });
    this.container.addChild(this.speakerBg);

    // Speaker name text
    this.speakerText = new Text({
      text: '',
      style: {
        fontFamily: 'Georgia, serif',
        fontSize: 18,
        fill: 0xff6b35,
        fontWeight: 'bold',
      },
    });
    this.speakerText.x = boxX + 25;
    this.speakerText.y = boxY - 10;
    this.container.addChild(this.speakerText);

    // Main dialogue text
    this.dialogueText = new Text({
      text: '',
      style: {
        fontFamily: 'Georgia, serif',
        fontSize: 24,
        fill: 0xf1faee,
        wordWrap: true,
        wordWrapWidth: boxWidth - 60,
        lineHeight: 32,
      },
    });
    this.dialogueText.x = boxX + 30;
    this.dialogueText.y = boxY + 25;
    this.container.addChild(this.dialogueText);

    // Continue indicator
    this.continueIndicator = new Container();
    this.continueIndicator.x = boxX + boxWidth - 50;
    this.continueIndicator.y = boxY + boxHeight - 30;

    const arrow = new Graphics();
    arrow.moveTo(0, 0);
    arrow.lineTo(10, 8);
    arrow.lineTo(20, 0);
    arrow.stroke({ color: 0x4ecdc4, width: 3 });
    this.continueIndicator.addChild(arrow);
    this.continueIndicator.visible = false;
    this.container.addChild(this.continueIndicator);

    this.arrowBaseY = this.continueIndicator.y;
    this.animTime = 0;
  }

  show(lines, onComplete) {
    this.lines = lines;
    this.lineIndex = 0;
    this.currentCallback = onComplete;
    this.container.visible = true;
    this.isActive = true;
    this.scene.dialogueActive = true;

    this.showCurrentLine();
  }

  showCurrentLine() {
    if (this.lineIndex >= this.lines.length) {
      this.close();
      return;
    }

    const line = this.lines[this.lineIndex];

    // Update speaker
    if (line.speaker === 'narrator') {
      this.speakerBg.visible = false;
      this.speakerText.text = '';
      this.dialogueText.style.fontStyle = 'italic';
      this.dialogueText.style.fill = 0xadb5bd;
    } else {
      this.speakerBg.visible = true;
      this.speakerText.text = this.getSpeakerName(line.speaker);
      this.dialogueText.style.fontStyle = 'normal';
      this.dialogueText.style.fill = this.getSpeakerColor(line.speaker);

      // Resize speaker background
      const nameWidth = this.speakerText.width + 20;
      this.speakerBg.clear();
      this.speakerBg.roundRect(
        this.boxX + 15,
        this.boxY - 18,
        Math.max(80, nameWidth),
        36,
        8
      );
      this.speakerBg.fill({ color: 0x1b263b, alpha: 0.95 });
      this.speakerBg.stroke({ color: this.getSpeakerBorderColor(line.speaker), width: 2 });
    }

    // Start typewriter
    this.fullText = line.text;
    this.charIndex = 0;
    this.isTyping = true;
    this.continueIndicator.visible = false;
    this.dialogueText.text = '';
    this.lastTypeTime = Date.now();
  }

  getSpeakerName(speaker) {
    const names = {
      'ember': 'Ember',
      'huey': 'Huey',
      'player': 'You',
    };
    return names[speaker] || speaker;
  }

  getSpeakerColor(speaker) {
    const colors = {
      'ember': 0xffd93d,
      'huey': 0x74b9ff,
      'player': 0xf1faee,
    };
    return colors[speaker] || 0xf1faee;
  }

  getSpeakerBorderColor(speaker) {
    const colors = {
      'ember': 0xff6b35,
      'huey': 0x4ecdc4,
      'player': 0x81ecec,
    };
    return colors[speaker] || 0x4ecdc4;
  }

  onTap() {
    if (!this.isActive) return;

    if (this.isTyping) {
      this.dialogueText.text = this.fullText;
      this.isTyping = false;
      this.continueIndicator.visible = true;
    } else {
      this.lineIndex++;
      this.showCurrentLine();
    }
  }

  close() {
    this.container.visible = false;
    this.isActive = false;
    this.scene.dialogueActive = false;

    if (this.currentCallback) {
      this.currentCallback();
      this.currentCallback = null;
    }
  }

  update(delta) {
    if (!this.isActive) return;

    // Typewriter effect
    if (this.isTyping) {
      const now = Date.now();
      if (now - this.lastTypeTime >= this.typeSpeed) {
        this.charIndex++;
        this.dialogueText.text = this.fullText.substring(0, this.charIndex);
        this.lastTypeTime = now;

        if (this.charIndex >= this.fullText.length) {
          this.isTyping = false;
          this.continueIndicator.visible = true;
        }
      }
    }

    // Bounce arrow
    if (this.continueIndicator.visible) {
      this.animTime += delta * 0.1;
      this.continueIndicator.y = this.arrowBaseY + Math.sin(this.animTime) * 5;
    }
  }
}
