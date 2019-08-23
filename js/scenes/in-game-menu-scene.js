/**
* User: werkn-development
* Date: Fri Aug 23 14:04:22 MST 2019
* 
*
*/

import TextButton from "../ui/button.js";

export default class InGameMenuScene extends Phaser.Scene {
    constructor(config) {
        if (config) {
            super(config);
        } else {
            super({ key: 'in_game_menu' });
        }
    }

    //get scene init data
    init(data) {
        if (data) {
            this.currentScene = data.sceneName;
        } else {
            console.log("Must provide level when loading platformer-scene.js.");
        }
    }

    preload() {}

    create() {
        //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/shape-rectangle/
        const background = this.add.rectangle(this.sys.canvas.width / 2,
            this.sys.canvas.height / 2, this.sys.canvas.width, this.sys.canvas.height, 0x6666ff, 0.5);

        // You can access the game's config to read the width & height
        const { width, height } = this.sys.game.config;

		const lockedStyle = { fill: '#f00', align: 'center' };
		const unlockedStyle = { fill: '#0f0', align: 'center' };

        // In v3, you can chain many methods, so you can create text and configure it in one "line"
        this.add
            .text(width / 2, height * 0.2, "In-Game Menu", {
                font: "64px monospace",
                color: "white"
            })
            .setOrigin(0.5, 0.5)
            .setShadow(5, 5, "#5588EE", 0, true, true);

        this.muteButton = new TextButton(this,
            this.sys.canvas.width * 0.5, this.sys.canvas.height * 0.45,
            (this.sound.mute) ? "(a) Audio: Disabled" : "(a) Audio: Enabled",
            unlockedStyle,
			lockedStyle,
			true,
            () => this.updateAudio());
        this.returnToGameButton = new TextButton(this,
            this.sys.canvas.width * 0.5, this.sys.canvas.height * 0.50,
            '(esc) Return to Game',
            unlockedStyle,
			lockedStyle,
			true,
            () => this.returnToGame());
        this.exitToLevelSelectButton = new TextButton(this,
            this.sys.canvas.width * 0.5, this.sys.canvas.height * 0.55,
            '(l) Exit to Level Select',
            unlockedStyle,
			lockedStyle,
			true,
            () => this.returnToLevelSelect());

        this.add.existing(this.muteButton);
        this.add.existing(this.returnToGameButton);
        this.add.existing(this.exitToLevelSelectButton);

        //pause the game scene, and move this scene above it in render order
        this.scene.pause(this.currentScene);
        this.scene.moveAbove(this.currentScene);

        // Help text that has a "fixed" position on the screen
        this.add
            .text(16, 16, 'Press ESC to dismiss window.', {
                font: "18px monospace",
                fill: "#ffffff",
                padding: { x: 20, y: 10 },
                backgroundColor: "#000000"
            })
            .setScrollFactor(0);

        // keybindings
        this.input.keyboard.on("keydown_ESC", event => {
            this.returnToGame();
        });
        this.input.keyboard.on("keydown_A", event => {
            this.updateAudio();
        });
        this.input.keyboard.on("keydown_L", event => {
            this.returnToLevelSelect();
        });
    }

    updateAudio() {
        this.sound.setMute(!this.sound.mute);
        this.muteButton.text = (this.sound.mute) ? "(a) Audio: Disabled" : "(a) Audio: Enabled";
    }

    returnToGame() {
        //stop the in-game menu scene
        this.scene.resume(this.currentScene);
        this.scene.stop();
    }

    returnToLevelSelect() {
        //end current game scene
        this.scene.stop('in_game_menu');
        //remove HUD overlay
	this.scene.stop('hud_overlay');
        this.scene.stop(this.currentScene);


        //launch level select
        this.scene.start("level_select")
    }

    update(time, delta) {}
}
