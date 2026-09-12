import { Container, Graphics, Text } from 'pixi.js';

/**
 * DialogSystem - shows character speech bubbles and narration.
 */
export class DialogSystem {
  constructor(scene) {
    this.scene = scene;
    this.dialogContainer = new Container();
    this.scene.uiLayer.addChild(this.dialogContainer);
    this.isShowing = false;
  }

  show(text, speaker = null) {
    this.clear();
    this.isShowing = true;

    const box = new Graphics();
    box.roundRect(100, 500, 1080, 150, 15);
    box.fill({ color: 0x1a1a2e, alpha: 0.9 });
    box.stroke({ color: 0x457b9d, width: 2 });
    this.dialogContainer.addChild(box);

    if (speaker) {
      const speakerText = new Text({
        text: speaker,
        style: {
          fontFamily: 'Georgia, serif',
          fontSize: 20,
          fill: 0xa8dadc,
          fontWeight: 'bold',
        },
      });
      speakerText.x = 130;
      speakerText.y = 520;
      this.dialogContainer.addChild(speakerText);
    }

    const dialogText = new Text({
      text: text,
      style: {
        fontFamily: 'Georgia, serif',
        fontSize: 24,
        fill: 0xf1faee,
        wordWrap: true,
        wordWrapWidth: 1020,
      },
    });
    dialogText.x = 130;
    dialogText.y = speaker ? 550 : 530;
    this.dialogContainer.addChild(dialogText);

    const hint = new Text({
      text: 'Press SPACE to continue',
      style: {
        fontFamily: 'Georgia, serif',
        fontSize: 16,
        fill: 0x6c757d,
      },
    });
    hint.x = 1080;
    hint.y = 620;
    this.dialogContainer.addChild(hint);
  }

  clear() {
    this.dialogContainer.removeChildren();
    this.isShowing = false;
  }
}
