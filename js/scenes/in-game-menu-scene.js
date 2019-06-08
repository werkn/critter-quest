export default class InGameMenuScene extends Phaser.Scene {
    constructor(config) {
        if (config) {
            super(config);
        } else {
            super({ key: 'in_game_menu' });
        }
    }

    //install the UI plugin
    preload() {
        //check if we've already loaded the UI plugin
        //if (this.plugins.scenePlugins.indexOf("rexuiplugin") == -1) {
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/plugins/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
        //} else {
        //    console.log("Found entry for rexuiplugin already.")
        //}
    }

    create() {
        //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/shape-rectangle/
        const background = this.add.rectangle(this.sys.canvas.width / 2,
            this.sys.canvas.height / 2, this.sys.canvas.width, this.sys.canvas.height, 0x6666ff, 0.5);

        //pause the game scene, and move this scene above it in render order
        this.scene.pause('game');
        this.scene.moveAbove('game');

        // You can access the game's config to read the width & height
        const { width, height } = this.sys.game.config;

        // In v3, you can chain many methods, so you can create text and configure it in one "line"
        this.add
            .text(width / 2, height / 2, "In-Game Menu", {
                font: "64px monospace",
                color: "white"
            })
            .setOrigin(0.5, 0.5)
            .setShadow(5, 5, "#5588EE", 0, true, true);


        var dialog = this.rexUI.add.dialog({
            x: width / 2,
            y: height / 2,
            width: width / 3,

            background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x1565c0),

            title: createLabel(this, 'Settings').setDraggable(),

            toolbar: [
                createLabel(this, 'X')
            ],

            choices: [
                createLabel(this, (this.sound.mute) ? "Volume: Disabled" : "Volume: Enabled"),
                createSlider(this, 'Music', 0xd50000, 0x9b0000, 0xff5131, this.sys.game.soundManager.musicVolume).setName('music'),
                createSlider(this, 'SFX  ', 0xd50000, 0x9b0000, 0xff5131, this.sys.game.soundManager.sfxVolume).setName('sfx')
            ],

            actions: [
                createLabel(this, 'Return to Level Select'),
                createLabel(this, 'Resume Game'),
            ],

            space: {
                left: 20,
                right: 20,
                top: -20,
                bottom: -20,

                title: 25,
                titleLeft: 30,
                content: 25,
                description: 25,
                descriptionLeft: 20,
                descriptionRight: 20,
                choices: 25,

                toolbarItem: 5,
                choice: 15,
                action: 15,
            },

            expand: {
                title: false,
                // content: false,
                // description: false,
                // choices: false,
                // actions: false,
            },

            align: {
                title: 'left',
                // content: 'left',
                // description: 'left',
                // choices: 'left',
                actions: 'left', // 'center'|'left'|'right'
            },

            click: {
                mode: 'release'
            }
        })
            .layout()
            // .drawBounds(this.add.graphics(), 0xff0000)
            .popUp(1000);

        var tween = this.tweens.add({
            targets: dialog,
            scaleX: 1,
            scaleY: 1,
            ease: 'Bounce', // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 1000,
            repeat: 0, // -1: infinity
            yoyo: false
        });

        this.print = this.add.text(0, 0, '');
        dialog
            .on('button.click', function (button, groupName, index) {
                if (groupName === "choices") {
                    //mute button
                    if (index == 0) {
                        this.sound.setMute(!this.sound.mute);
                        button.text = (this.sound.mute) ? "Volume: Disabled" : "Volume: Enabled";
                    }
                } else if (groupName === "actions") {
                    //return to level select butotn
                    if (index == 0) {
                        this.scene.start('level_select');
                        //return to game
                    } else if (index == 1) {
                        //stop the in-game menu scene
                        this.scene.resume('game');
                        this.scene.stop();
                    }
                } else if (groupName === "toolbar") {
                    //(X) button
                    if (index == 0) {
                        //stop the in-game menu scene
                        this.scene.resume('game');
                        this.scene.stop();
                    }
                }
                this.print.text += groupName + '-' + index + ': ' + button.text + '\n';
            }, this)
            .on('button.over', function (button, groupName, index) {
                button.getElement('background').setStrokeStyle(1, 0xffffff);
            })
            .on('button.out', function (button, groupName, index) {
                button.getElement('background').setStrokeStyle();
            });

        // Debug graphics
        this.input.keyboard.on("keydown_ESC", event => {
            //stop the in-game menu scene
            this.scene.resume('game');
            this.scene.stop();
        });

    }

    update(time, delta) {

    }

}

var createSlider = function(scene, colorText, colorPrimary, colorDark, colorLight, startValue) {
    return scene.rexUI.add.numberBar({
        background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 0, colorDark),

        icon: scene.add.text(0, 0, colorText, {
            fontSize: 18
        }),

        input: 'drag',

        slider: {
            track: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, colorPrimary),
            indicator: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, colorLight),
            input: 'click',
            width: 300, // Fixed width
        },

        space: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,

            icon: 10,
            slider: 10,
        },

        //start value allows us to set the slider position based on current volume when we hide/show the menu
        value: startValue,
        valuechangeCallback: function (newValue, oldValue, slider) {

            if (newValue != oldValue && slider.name == "sfx") {
                slider.scene.sys.game.soundManager.sfxVolume = newValue; console.log("sfx: " + newValue);
            }
            if (newValue != oldValue && slider.name == "music") {
                slider.scene.sys.game.soundManager.musicVolume = newValue; console.log("music: " + newValue);
            }

            slider.scene.game.soundManager.updateSettings(slider.scene)
        }
    })
}

var createLabel = function (scene, text) {
    return scene.rexUI.add.label({
        width: 40, // Minimum width of round-rectangle
        height: 40, // Minimum height of round-rectangle

        background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x5e92f3),

        text: scene.add.text(0, 0, text, {
            fontSize: '24px'
        }),

        space: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10
        }
    });
}