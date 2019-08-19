import TextButton from "../ui/button.js";

/**
 * A class that extends Phaser.Scene and provides our level selection screen.
 *
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
        // You can access the game's config to read the width & height
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

		//if level(s) state isn't set, initialize it
		if (this.sys.game.levelState == undefined) {
			//true = unlocked, false = locked
			this.sys.game.levelState = {
				"1": true,
				"2": false,
				"3": false,
				"4": false,
				"5": false,
			};
		}

        //add level select buttons
        this.level1Button = new TextButton(this,
            this.sys.canvas.width * 0.5, this.sys.canvas.height * 0.35,
            '(1) Level 1: Unlocked / Time: NOT ATTEMPTED',
            (this.sys.game.levelState["1"]) ? unlockedStyle : lockedStyle,
            //key:'game' = platformer-scene.js
            //we provide scene data (level to load) that can be read from init(data) { ... }
            this.startLevel, "1");

        this.level2Button = new TextButton(this,
            this.sys.canvas.width * 0.5, this.sys.canvas.height * 0.40,
            '(2) Level 2: LOCKED',
            (this.sys.game.levelState["2"]) ? unlockedStyle : lockedStyle,
            this.startLevel, "2");

        this.level3Button = new TextButton(this,
            this.sys.canvas.width * 0.5, this.sys.canvas.height * 0.45,
            '(3) Level 3: LOCKED',
            (this.sys.game.levelState["3"]) ? unlockedStyle : lockedStyle,
            this.startLevel, "3");

        this.level4Button = new TextButton(this,
            this.sys.canvas.width * 0.5, this.sys.canvas.height * 0.50,
            '(4) Level 4: LOCKED',
            (this.sys.game.levelState["4"]) ? unlockedStyle : lockedStyle,
            this.startLevel, "4");

        this.level5Button = new TextButton(this,
            this.sys.canvas.width * 0.5, this.sys.canvas.height * 0.55,
            '(5) Level 5: LOCKED',
            (this.sys.game.levelState["5"]) ? unlockedStyle : lockedStyle,
            this.startLevel, "5");

        //add buttons to scene
        this.add.existing(this.level1Button);
        this.add.existing(this.level2Button);
        this.add.existing(this.level3Button);
        this.add.existing(this.level4Button);
        this.add.existing(this.level5Button);

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
    }

	startLevel(scene, level) {
		if (scene.sys.game.levelState[level]) {
            scene.scene.start("level"+level);
		} else {
			console.log("Level is locked");
		}
	}

    update(time, delta) { }
}
