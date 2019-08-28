/**
* User: werkn-development
* Date: Fri Aug 23 12:20:25 MST 2019
*
* Entry point for our Critter Quest App.
*/

//imports
import TitleScreenScene from "./scenes/title-screen-scene.js";
import LevelSelectScene from "./scenes/level-select-scene.js";
import Level1 from "./scenes/levels/level1.js";
import Level2 from "./scenes/levels/level2.js";
import Level3 from "./scenes/levels/level3.js";
import Level4 from "./scenes/levels/level4.js";
import Level5 from "./scenes/levels/level5.js";
import Level6 from "./scenes/levels/level6.js";
import InGameMenuScene from "./scenes/in-game-menu-scene.js";
import HudOverlayScene from "./scenes/hud-overlay-scene.js";
import GameOverScene from "./scenes/game-over-scene.js";
import CreditsScene from "./scenes/credits-scene.js";

//phaser3 game setup
const config = {
	type: Phaser.AUTO,
	width: 640,
	height: 480,
	parent: "game-container",
	pixelArt: true,
	backgroundColor: "#325762",
	audio: {
    	disableWebAudio: true
	},
	//set physics system
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 1000.0 }
		}
	},

	//scenes to load when app is started
	scene: [
		TitleScreenScene,
		LevelSelectScene,
		InGameMenuScene,
		HudOverlayScene,
		Level1,
		Level2,
		Level3,
		Level4,
		Level5,
		Level6,
		GameOverScene,
		CreditsScene
	]
};

const game = new Phaser.Game(config);
