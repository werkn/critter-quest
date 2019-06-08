/**
 * A class that extends Phaser.Scene and wraps up the core logic for the platformer level.
 *
 */
export default class LevelSelectScene extends Phaser.Scene {
    constructor(config) {
        if (config) {
            super(config);
        } else {
            super({ key: 'level_select' });
        }
    }

    preload() { }

    create() {
        // You can access the game's config to read the width & height
        const { width, height } = this.sys.game.config;

        // In v3, you can chain many methods, so you can create text and configure it in one "line"
        this.add
            .text(width / 2, height * 0.1, "Level Select", {
                font: "64px monospace",
                color: "white"
            })
            .setOrigin(0.5, 0.5)
            .setShadow(5, 5, "#5588EE", 0, true, true);

        // Help text that has a "fixed" position on the screen
        this.add
            .text(16, 16, 'Press enter to go to Test Level.', {
                font: "18px monospace",
                fill: "#ffffff",
                padding: { x: 20, y: 10 },
                backgroundColor: "#000000"
            })
            .setScrollFactor(0);

        this.input.keyboard.on("keydown_ENTER", event => {
            this.scene.start("game");
        });
    }

    update(time, delta) { }
}