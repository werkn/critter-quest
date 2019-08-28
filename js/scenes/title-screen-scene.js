/**
 * User: werkn-development
 * Date: Fri Aug 23 13:28:33 MST 2019
 * 
 * TitleScreen is part of our Menu system and is the first scene 
 * presented to the player.  It configures the SoundManager, and loads
 * all audio resources.
 */

import ParallaxBackground from "../effects/parallax-background.js";

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
		//get game width and height	
		const { width, height } = this.sys.game.config;

		//loading resources tutorial
		//src: https://gamedevacademy.org/creating-a-preloading-screen-in-phaser-3/
		//create loading text
		this.loadingText = this.make.text({
			    x: width / 2,
			    y: height / 2 - 50,
			    text: 'Loading...',
			    style: {
					        font: '20px monospace',
					        fill: '#ffffff'
					    }
		});
		this.loadingText.setOrigin(0.5, 0.5);

		this.load.on('complete', function (context) {
			//remove loading text
			this.scene.loadingText.destroy();
		});

		this.load.on('progress', function (value) {
			this.scene.loadingText.setText("Loading: " + parseInt(value * 100) + "%" + "...");
		});

		//parallax background images
		this.load.image("background-far", "./assets/background/back.png");
		this.load.image("background-middle", "./assets/background/middle.png");

		//load audio
		this.load.audio("music", "./assets/audio/music.ogg");
		this.load.audio("jump", "./assets/audio/jump.wav");
		this.load.audio("coinCollected", "./assets/audio/coin_collected.wav", {
			instances: 4
		});
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
