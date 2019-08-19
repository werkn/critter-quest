export default class CreditsScene extends Phaser.Scene {
    constructor(config) {
        if (config) {
            super(config);
        } else {
            super({key: 'credits'});
        }
    }

    preload() {
    }

    create() {
        // You can access the game's config to read the width & height
        const { width, height } = this.sys.game.config;

        // In v3, you can chain many methods, so you can create text and configure it in one "line"
        this.add
            .text(width / 2, height / 2, "Game Completed!\nThanks for playing!", {
                font: "23px monospace",
                color: "white"
            })
            .setOrigin(0.5, 0.5)
            .setShadow(5, 5, "#5588EE", 0, true, true);

        // Help text that has a "fixed" position on the screen
        this.add
            .text(16, 16, 'Press Enter to return to Title Screen.', {
                font: "18px monospace",
                fill: "#ffffff",
                padding: { x: 20, y: 10 },
                backgroundColor: "#000000"
            })
            .setScrollFactor(0);

        this.input.keyboard.once("keydown_ENTER", event => {
//            this.scene.start('title_screen');
			window.location.reload(false); 
        });
    }

    update(time, delta) {
    }
}

