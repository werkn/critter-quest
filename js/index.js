import TitleScreenScene from "./scenes/title-screen-scene.js";
import LevelSelectScene from "./scenes/level-select-scene.js";
import PlatformerScene from "./scenes/platformer-scene.js";
import InGameMenuScene from "./scenes/in-game-menu-scene.js";
import GameOverScene from "./scenes/game-over-scene.js";

const config = {
	// eslint-disable-next-line no-undef
	type: Phaser.AUTO,
	width: 640,
	height: 480,
	parent: "game-container",
	pixelArt: true,
	backgroundColor: "#1d212d",
	audio: {
    	disableWebAudio: true
	},
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 1000.0 }
		}
	},
	scene: [TitleScreenScene, LevelSelectScene, InGameMenuScene, PlatformerScene, GameOverScene]
};

const game = new Phaser.Game(config);
