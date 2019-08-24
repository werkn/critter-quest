/**
 * User: werkn-development
 * Date: Fri Aug 23 13:28:33 MST 2019
 * 
 * TitleScreen is part of our Menu system and is the first scene 
 * presented to the player.  It configures the SoundManager, and loads
 * all audio resources.
 */

import ParallaxBackground from "../effects/parallax-background.js";
import SaveManager from "../managers/save-manager.js";

/**
 * A class that extends Phaser.Scene and wraps up the core logic for the Title Screen.
 */
export default class TitleScreenScene extends Phaser.Scene {
	constructor(config) {
		if (config) {
			super(config);
		} else {
			super({key: 'title_screen'});
		}
	}

	preload() {
		//parallax background images
		this.load.image("background-far", "./assets/background/back.png");
		this.load.image("background-middle", "./assets/background/middle.png");

		//load audio
		this.load.audio("music", "./assets/audio/music.ogg");
		this.load.audio("jump", "./assets/audio/jump.wav");
		this.load.audio("coinCollected", "./assets/audio/coin_collected.wav");
	}

	create() {
		//get game width and height	
		const { width, height } = this.sys.game.config;

		//add parallax background
		this.parallaxBackground = new ParallaxBackground(
			this,
			"background-far",
			"background-middle",
			0.6,
			0.3
		);

		//setyp title text @ center screen
		this.add
			.text(width / 2, height / 2, "Critter Quest", {
				font: "32px monospace",
				color: "white"
			})
			.setOrigin(0.5, 0.5)
			.setShadow(5, 5, "#5588EE", 0, true, true);

		//setup audio on the game object, this allows me to access it in any scene
		this.sys.game.soundManager = {};

		this.sys.game.soundManager.music = {};
		this.sys.game.soundManager.music.inGameMusic = this.sound.add(
			"music", 
			{ 
				loop: true,
				volume: 0.35 
			}
		);
		this.sys.game.soundManager.music.inGameMusic.play();

		this.sys.game.soundManager.sfx = {};
		this.sys.game.soundManager.sfx.jump = this.sound.add("jump", { volume: 0.35 });
		this.sys.game.soundManager.sfx.coinCollected = this.sound.add("coinCollected", { volume: 0.2 });

		//if there is local storage saved game load it
		//if level(s) state isn't set, initialize it
		if (this.sys.game.levelState == undefined) {

			if (!SaveManager.hasSavedGame()) {
				//true = unlocked, false = locked
				this.sys.game.levelState = {
					"1": { unlocked: true, time: -1, hasEndBoss: false },
					"2": { unlocked: false, time: -1, hasEndBoss: false },
					"3": { unlocked: false, time: -1, hasEndBoss: false },
					"4": { unlocked: false, time: -1, hasEndBoss: false },
					//end boss levels do not have a prespawned exit, 
					//the exit is spawned after boss is defeated
					"5": { unlocked: false, time: -1, hasEndBoss: true }
				};

				//perform initial save
				SaveManager.saveGame(this.sys.game.levelState);
			} else {
				SaveManager.loadGame(this);
			}

		}

		this.add
			.text(16, 16, 'Press Enter to visit Level Select.', {
				font: "18px monospace",
				fill: "#ffffff",
				padding: { x: 20, y: 10 },
				backgroundColor: "#000000"
			})
			.setScrollFactor(0);

		//start LevelSelectScene when ENTER is pressed
		this.input.keyboard.once("keydown_ENTER", event => {

			this.scene.start('level_select');
		});
	}

	update(time, delta) {
		this.parallaxBackground.update();
	}
}
