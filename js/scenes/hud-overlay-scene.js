/**
 * User: werkn-development
 * Date: Sun Aug 4 17:52:52 MST 2019
 * HudOverlayScene is used to draw the game HUD system on-top of platformer-scene,
 * it has the following layout:
 *  --------------------------------
 *  | Kit                   99xGem |
 *  |   x5             Time: 300   |
 *  |                              |
 *  |                              |
 *  |                              |
 *  |                              |
 *  --------------------------------
 *  Where top-left = Lives
 *  	 99xGem    = # of Gems
 *  	 Time: 300 = Time remaining in sec
 */

export default class HudOverlayScene extends Phaser.Scene {
	constructor(config) {
		if (config) {
			super(config);
		} else {
			super({ key: 'hud_overlay' });
		}
	}

	//get scene init data, specifically we want the name of the current scene
	//so we can place the HUD on top of it using
	//this.scene.moveAbove(currentScene)...
	init(data) {
		if (data) {
			this.currentScene = data.sceneName;
		} else {
			console.log("HUDOverlayScene needs sceneName provided as init data.");
		}
	}

	preload() {}

	create() {
		const { width, height } = this.sys.game.config;

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
		//get time remaining
		const elapsedTime = Math.floor(this.sys.game.gameTimer.getElapsedSeconds());
		this.timeRemaining = this.sys.game.maxLevelTime -elapsedTime; 

		//update all HUD Text
		this.gameTimer.setText("Time: " + this.timeRemaining);
		this.livesText.setText("Kit x " + this.sys.game.lives);
		this.gemsText.setText(this.sys.game.gems + " x Gem");
	}

}
