/**
 * A class that extends Phaser.Scene and wraps up the core logic for the platformer level.
 */
export default class GameOverScene extends Phaser.Scene {
    constructor(config) {
        if (config) {
            super(config);
        } else {
            super({key: 'game_over'});
        }
    }

    preload() {
    }

    create() {
        // You can access the game's config to read the width & height
        const { width, height } = this.sys.game.config;

        // In v3, you can chain many methods, so you can create text and configure it in one "line"
        this.add
            .text(width / 2, height / 2, "Game Over", {
                font: "64px monospace",
                color: "white"
            })
            .setOrigin(0.5, 0.5)
            .setShadow(5, 5, "#5588EE", 0, true, true);

        // Help text that has a "fixed" position on the screen
        this.add
            .text(16, 16, 'Press Enter to return to level select.', {
                font: "18px monospace",
                fill: "#ffffff",
                padding: { x: 20, y: 10 },
                backgroundColor: "#000000"
            })
            .setScrollFactor(0);

        // Debug graphics
        this.input.keyboard.once("keydown_ENTER", event => {

            //doc here on scene management:
            //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scenemanager/#start-scene
            //scene.scene.start will launch new scene and shutdown
            //current scene

            //player has died, return to title screen and reset their game
			this.resetGame();
            this.scene.start('title_screen');
        });
    }

	resetGame() {
	    //TODO: clear level states
		this.sys.game.lives = undefined;
		this.sys.game.gems = undefined;
		this.sys.game.hp = undefined;
	}

    update(time, delta) {
    }
}
