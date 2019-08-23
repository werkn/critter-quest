/**
 * User: werkn-development
 * Date: Fri Aug 23 13:23:37 MST 2019
 * 
 * CreditsScene is part of our Menu system and displayed after
 * the player has completed the game.
 *
 * The player can return to the title screen by hitting ENTER.
 */

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
		const { width, height } = this.sys.game.config;

		//add game completed text
		this.add
			.text(width / 2, height / 2, "Game Completed!\nThanks for playing!", {
				font: "23px monospace",
				color: "white",
				align: "center"
			})
			.setOrigin(0.5, 0.5)
			.setShadow(5, 5, "#5588EE", 0, true, true);

		this.add
			.text(16, 16, 'Press Enter to return to Title Screen.', {
				font: "18px monospace",
				fill: "#ffffff",
				padding: { x: 20, y: 10 },
				backgroundColor: "#000000"
			})
			.setScrollFactor(0);

		this.input.keyboard.once("keydown_ENTER", event => {
			//restart the entire game by forcing a page reload
			window.location.reload(false); 
		});
	}

	update(time, delta) {
	}
}

