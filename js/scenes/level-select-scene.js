/**
 * A class that extends Phaser.Scene and wraps up the core logic for the platformer level.
 *
 */
export default class LevelSelectScene extends Phaser.Scene {
    constructor(config) {
        if (config) {
            super(config);
        } else {
            super({key: 'level_select'});
        }
    }

    preload() {
       // this.load.scenePlugin({
         //   key: "rexuiplugin",
        //    url: "./js/plugins/rexuiplugin.min.js",
        //    sceneKey: 'rexUI'
        //});
    }

    create() {
        // You can access the game's config to read the width & height
        const { width, height } = this.sys.game.config;

        // In v3, you can chain many methods, so you can create text and configure it in one "line"
        this.add
            .text(width / 2, height * 0.1, "Level Select", {
                font: "64px monospace",
                color: "white"
            })
            .setOrigin(0.5, 0.5)
            .setShadow(5, 5, "#5588EE", 0, true, true);
/*
        var dialog = this.rexUI.add.dialog({
            x: width / 2,
            y: height * 0.60,
            width: width / 3,

            background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x1565c0),

            choices: [
                this.createLabel(this, "Level 1: In to the Deep"),
                this.createLabel(this, "Level 2: Fathom This"),
                this.createLabel(this, "Level 3: Lecture of !@##"),
                this.createLabel(this, "Level 4: Draft Proposal"),
                this.createLabel(this, "Level 5: Final Fight"),
            ],

            actions: [
                this.createLabel(this, 'Return to Title Screen'),
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
                    this.scene.start("game");
                } else if (groupName === "actions") {
                    //return to title screen button
                    if (index == 0) {
                        this.scene.start('title_screen');
                        //return to game
                    } else if (index == 1) {
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

    }

    update(time, delta) {
    }

    createLabel = function (scene, text) {
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
    */

    this.scene.start('game');
    }
}