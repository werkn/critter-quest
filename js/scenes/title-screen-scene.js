import ParallaxBackground from "../effects/parallax-background.js";

/**
 * A class that extends Phaser.Scene and wraps up the core logic for the platformer level.
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
        //TODO: add preloader loading-bar here...

        //parallax background images
        this.load.image("background-far", "./assets/background/back.png");
        this.load.image("background-middle", "./assets/background/middle.png");

        //load audio
        this.load.audio("music", "./assets/audio/music.ogg");
        this.load.audio("jump", "./assets/audio/jump.wav");
        this.load.audio("coinCollected", "./assets/audio/coin_collected.wav");
    }

    create() {
        // You can access the game's config to read the width & height
        const { width, height } = this.sys.game.config;

        //add parallax background
        this.parallaxBackground = new ParallaxBackground(
            this,
            "background-far",
            "background-middle",
            0.6,
            0.3
        );

        // In v3, you can chain many methods, so you can create text and configure it in one "line"
        this.add
            .text(width / 2, height / 2, "Critter Quest v1.0", {
                font: "64px monospace",
                color: "white"
            })
            .setOrigin(0.5, 0.5)
            .setShadow(5, 5, "#5588EE", 0, true, true);

        //setup audio on the game object, this allows me to access it in any scene
        this.sys.game.soundManager = {};

        this.sys.game.soundManager.music = {};
        this.sys.game.soundManager.musicVolume = 0.75;
        this.sys.game.soundManager.music.inGameMusic = this.sound.add("music");
        //change audio rate (ie: level timer is almost up)
        //this.soundManager.music.inGameMusic.setRate(1.5);
        this.sys.game.soundManager.music.inGameMusic.play();

        this.sys.game.soundManager.sfx = {};
        this.sys.game.soundManager.sfxVolume = 0.75;
        this.sys.game.soundManager.sfx.jump = this.sound.add("jump");
        this.sys.game.soundManager.sfx.coinCollected = this.sound.add("coinCollected");

        this.sys.game.soundManager.updateSettings = function (scene) {
            scene.game.soundManager.music.inGameMusic.setVolume(scene.game.soundManager.musicVolume);
            scene.game.soundManager.sfx.jump.setVolume(scene.game.soundManager.sfxVolume);
            scene.game.soundManager.sfx.coinCollected.setVolume(scene.game.soundManager.sfxVolume);
        }

        // Help text that has a "fixed" position on the screen
        this.add
            .text(16, 16, 'Press Enter to visit Level Select.', {
                font: "18px monospace",
                fill: "#ffffff",
                padding: { x: 20, y: 10 },
                backgroundColor: "#000000"
            })
            .setScrollFactor(0);

        // Debug graphics
        this.input.keyboard.once("keydown_ENTER", event => {

            //doc here on scene management:
            //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scenemanager/#start-scene
            //scene.scene.start will launch new scene and shutdown
            //current scene
            this.scene.start('level_select');
        });
    }

    update(time, delta) {
        this.parallaxBackground.update();
    }
}
