/**
 * Phaser 3 has no UI support.  Class below implements a basic button.
 * Adapted from: https://snowbillr.github.io/blog//2018-07-03-buttons-in-phaser-3/
 */
export default class TextButton extends Phaser.GameObjects.Text {
  constructor(scene, x, y, text, style, callback, arg) {
    super(scene, x, y, text, style);

    this.setInteractive({ useHandCursor: true })
      .on('pointerover', () => this.enterButtonHoverState())
      .on('pointerout', () => this.enterButtonRestState())
      .on('pointerdown', () => this.enterButtonActiveState())
      .on('pointerup', () => {
        this.enterButtonHoverState();
        callback(scene, arg);
      });

    this.setOrigin(0.5);
  }

  enterButtonHoverState() {
    this.setStyle({ fill: '#ff0' });
  }

  enterButtonRestState() {
    this.setStyle({ fill: '#0f0' });
  }

  enterButtonActiveState() {
    this.setStyle({ fill: '#fff' });
  }
}
