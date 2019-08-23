/**
 * User: werkn-development
 * Date: Fri Aug 23 14:36:04 MST 2019
 * 
 * LevelSelectScene is used to list the available levels for play.
 * 
 * Level save states can also be reset from the scene by pressing 'r'.
 */

import TextButton from "../ui/button.js";
import SaveManager from "../managers/save-manager.js";

/**
 * A class that extends Phaser.Scene and provides our level selection screen.
 */
export default class LevelSelectScene extends Phaser.Scene {
	constructor(config) {
		if (config) {
			super(config);
		} else {
			super({ key: 'level_select' });
		}
	}

	preload() { }

	create() {
		console.log(this.sceneManager);
		const { width, height } = this.sys.game.config;

		const lockedStyle = { fill: '#f00', align: 'center' };
		const unlockedStyle = { fill: '#0f0', align: 'center' };

		this.add
			.text(width / 2, height * 0.2, "Level Select", {
				font: "64px monospace",
				color: "white"
			})
			.setOrigin(0.5, 0.5)
			.setShadow(5, 5, "#5588EE", 0, true, true);

		//add level select buttons
		this.level1Button = new TextButton(this,
			this.sys.canvas.width * 0.5, this.sys.canvas.height * 0.35,
			this.levelStateText(this, "1", "1"),
			unlockedStyle, 
			lockedStyle, 
			this.sys.game.levelState["1"].unlocked,
			this.startLevel, "1");

		this.level2Button = new TextButton(this,
			this.sys.canvas.width * 0.5, this.sys.canvas.height * 0.40,
			this.levelStateText(this, "2", "2"),
			unlockedStyle, 
			lockedStyle, 
			this.sys.game.levelState["2"].unlocked,
			this.startLevel, "2");

		this.level3Button = new TextButton(this,
			this.sys.canvas.width * 0.5, this.sys.canvas.height * 0.45,
			this.levelStateText(this, "3", "3"),
			unlockedStyle, 
			lockedStyle, 
			this.sys.game.levelState["3"].unlocked,
			this.startLevel, "3");

		this.level4Button = new TextButton(this,
			this.sys.canvas.width * 0.5, this.sys.canvas.height * 0.50,
			this.levelStateText(this, "4", "4"),
			unlockedStyle, 
			lockedStyle, 
			this.sys.game.levelState["4"].unlocked,
			this.startLevel, "4");

		this.level5Button = new TextButton(this,
			this.sys.canvas.width * 0.5, this.sys.canvas.height * 0.55,
			this.levelStateText(this, "5", "5"),
			unlockedStyle, 
			lockedStyle, 
			this.sys.game.levelState["5"].unlocked,
			this.startLevel, "5");

		this.resetButton = new TextButton(this,
			this.sys.canvas.width * 0.75, this.sys.canvas.height * 0.80,
			"(r) Reset progress...",
			unlockedStyle, 
			lockedStyle, 
			true,
			() => { SaveManager.eraseSaveGame; window.location.reload(false); } );

		//add buttons to scene
		this.add.existing(this.level1Button);
		this.add.existing(this.level2Button);
		this.add.existing(this.level3Button);
		this.add.existing(this.level4Button);
		this.add.existing(this.level5Button);
		this.add.existing(this.resetButton);

		// keybindings
		this.input.keyboard.on("keydown_ESC", event => {
			this.scene.start("title_screen");
		});
		this.input.keyboard.on("keydown_ONE", event => {
			this.startLevel(this, "1");
		});
		this.input.keyboard.on("keydown_TWO", event => {
			this.startLevel(this, "2");
		});
		this.input.keyboard.on("keydown_THREE", event => {
			this.startLevel(this, "3");
		});
		this.input.keyboard.on("keydown_FOUR", event => {
			this.startLevel(this, "4");
		});
		this.input.keyboard.on("keydown_FIVE", event => {
			this.startLevel(this, "5");
		});
		this.input.keyboard.on("keydown_R", event => {
			SaveManager.eraseSaveGame(); 
			window.location.reload(false);
		});
	}

	//setup our levelStateText (what the text button should say)
	//ex:  '(1) Level 1: Unlocked / Time: NOT ATTEMPTED'
	levelStateText(scene, level, keyBinding) {
		const levelState = scene.sys.game.levelState[level];
		const unlocked = (levelState.unlocked) ? "UNLOCKED" : "LOCKED";
		//levelState.time is initially set to -1, so if its this value
		//we know the level hasn't been attempted
		const time = (levelState.time != -1) ? "Time: " + levelState.time + " seconds" : "Time: NOT COMPLETED";
		const levelText = "(" + keyBinding + ")" 
			+ " Level " + level 
			+ ": " 
			+ unlocked 
			+ " / " 
			+ time ;

		return levelText;
	}

	//try to start the provided level
	startLevel(scene, level) {
		//only load the levle if it's not locked
		if (scene.sys.game.levelState[level].unlocked) {
			scene.scene.start("level"+level);
		} else {
			console.log("Level is locked");
		}
	}

	update(time, delta) { }
}
