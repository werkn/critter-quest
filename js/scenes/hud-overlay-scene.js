/**
 * User: werkn-development
 * Date: Sun Aug  4 17:52:52 MST 2019
 * HudOverlayScene is used to draw the game HUD system on-top of platformer-scene,
 * it has the following layout:
 *  --------------------------------
 *  | Kit    <3 <3 <3       99xGem |
 *  |   x5                         |
 *  |                              |
 *  |                              |
 *  |                              |
 *  |                              |
 *  --------------------------------
 *  Where top-left = Lives
 *  	 <3       = Cherries / HP
 *  	 99xGem   = # of Gems
 */

import TextButton from "../ui/button.js";

export default class HudOverlayScene extends Phaser.Scene {
	constructor(config) {
		if (config) {
			super(config);
		} else {
			super({ key: 'hud_overlay' });
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
		const { width, height } = this.sys.game.config;
		
		// You can access the game's config to read the width & height
		this.gameTimer = this.add
			.text(width * 0.9, height * 0.08, "Time: 180", {
				font: "16px monospace",
				color: "white"
			})
			.setOrigin(0.5, 0.5)
			.setShadow(1, 1, "#5588EE", 0, true, true);

		//add hud text for lives
		this.livesText = this.add
			.text(width * 0.1, height * 0.05, "Kit x " + this.sys.game.lives, {
				font: "16px monospace",
				color: "white"
			})
			.setOrigin(0.5, 0.5)
			.setShadow(1, 1, "#5588EE", 0, true, true);

		//add hud text for gems 
		this.gemsText = this.add
			.text(width * 0.9, height * 0.05, this.sys.game.gems + " x Gem", {
				font: "16px monospace",
				color: "white"
			})
			.setOrigin(0.5, 0.5)
			.setShadow(1, 1, "#5588EE", 0, true, true);

		//move the HudOverlayScene over top of the currentScene (likely platformer-scene)
		this.scene.moveAbove(this.currentScene);
	}

	update(time, delta) {
		this.timeRemaining = this.sys.game.maxLevelTime - Math.floor(this.sys.game.gameTimer.getElapsedSeconds());

//		if (this.timeRemaining == 176) {
//			const { width, height } = this.sys.game.config;
//			this.gameTimer.setPosition(width * 0.5, height * 0.5);
//			this.setFontSize(this.gameTimer.fontSize + 10);
//		}

		this.gameTimer.setText("Time: " + this.timeRemaining);
		this.livesText.setText("Kit x " + this.sys.game.lives);
		this.gemsText.setText(this.sys.game.gems + " x Gem");
	}

}
