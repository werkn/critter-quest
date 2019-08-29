/**
 * User: werkn-development
 * Date: Fri Aug 23 13:26:04 MST 2019
 * 
 * GameOverScene is part of our Menu system and displayed after
 * the player has used all their lives.
 *
 * The player can return to the title screen by hitting ENTER.
 */


import SaveManager from "../managers/save-manager.js";

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
		const { width, height } = this.sys.game.config;

		this.add
			.text(width / 2, height * 0.2, "Game Over", this.sys.game.headingStyle)
			.setOrigin(0.5, 0.5);

		this.add
			.text(width / 2, height * 0.5, '<Press Enter>', {
				fontFamily: '"Press Start 2P", Courier',
				fontSize: 18, 
				strokeThickness: 4,
				stroke: '#fff',
				fill: "grey"
			})
			.setOrigin(0.5, 0.5);

		this.input.keyboard.once("keydown_ENTER", event => {

			//player has died, return to title screen and reset their game
			this.resetGame();
			window.location.reload(false); 
		});
	}

	resetGame() {
		//doc here on scene management:
		//https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scenemanager/#start-scene
		//scene.scene.start will launch new scene and shutdown
		//current scene

		this.sys.game.lives = undefined;
		this.sys.game.gems = undefined;

		//true = unlocked, false = locked
		this.sys.game.levelState = undefined; 

		//erase game progress
		SaveManager.eraseSaveGame();
	}

	update(time, delta) {
	}
}
