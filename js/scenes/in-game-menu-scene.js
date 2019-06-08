export default class InGameMenuScene extends Phaser.Scene {
    constructor(config) {
        if (config) {
            super(config);
        } else {
            super({ key: 'in_game_menu' });
        }
    }

    preload() {}

    create() {
        //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/shape-rectangle/
        const background = this.add.rectangle(this.sys.canvas.width / 2,
            this.sys.canvas.height / 2, this.sys.canvas.width, this.sys.canvas.height, 0x6666ff, 0.5);

        //pause the game scene, and move this scene above it in render order
        this.scene.pause('game');
        this.scene.moveAbove('game');

        // You can access the game's config to read the width & height
        const { width, height } = this.sys.game.config;

        // In v3, you can chain many methods, so you can create text and configure it in one "line"
        this.add
            .text(width / 2, height / 2, "In-Game Menu", {
                font: "64px monospace",
                color: "white"
            })
            .setOrigin(0.5, 0.5)
            .setShadow(5, 5, "#5588EE", 0, true, true);
    }

    update(time, delta) {}

}