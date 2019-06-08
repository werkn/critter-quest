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
            '(1) Level 1: XXXX',
            { fill: '#0f0', align: 'center' },
            //key:'game' = platformer-scene.js
            //we provide scene data (level to load) that can be read from init(data) { ... }
            () => this.scene.start("game", { level: 1 }));

        this.level2Button = new TextButton(this,
            this.sys.canvas.width * 0.5, this.sys.canvas.height * 0.40,
            '(2) Level 2: XXXX',
            { fill: '#0f0', align: 'center' },
            () => this.scene.start("game", { level: 2 }));

        this.level3Button = new TextButton(this,
            this.sys.canvas.width * 0.5, this.sys.canvas.height * 0.45,
            '(3) Level 3: XXXX',
            { fill: '#0f0', align: 'center' },
            () => this.scene.start("game", { level: 3 }));

        this.level4Button = new TextButton(this,
            this.sys.canvas.width * 0.5, this.sys.canvas.height * 0.50,
            '(4) Level 4: XXXX',
            { fill: '#0f0', align: 'center' },
            () => this.scene.start("game", { level: 4 }));

        this.level5Button = new TextButton(this,
            this.sys.canvas.width * 0.5, this.sys.canvas.height * 0.55,
            '(5) Level 5: XXXX',
            { fill: '#0f0', align: 'center' },
            () => this.scene.start("game", { level: 5 }));

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
            this.scene.start("game", { level: 1 });
        });
        this.input.keyboard.on("keydown_TWO", event => {
            this.scene.start("game", { level: 2 });
        });
        this.input.keyboard.on("keydown_THREE", event => {
            this.scene.start("game", { level: 3 });
        });
        this.input.keyboard.on("keydown_FOUR", event => {
            this.scene.start("game", { level: 4 });
        });
        this.input.keyboard.on("keydown_FIVE", event => {
            this.scene.start("game", { level: 5 });
        });
    }

    update(time, delta) { }
}