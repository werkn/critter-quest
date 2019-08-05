/**
* User: werkn-development
* Date: Sun Aug  4 17:52:52 MST 2019
* HudOverlayScene is used to draw the game HUD system on-top of platformer-scene,
* it has the following layout:
*  --------------------------------
*  | Kit    <3 <3 <3       99xGem |
*  |   x5                         |
*  |                              |
*  |                              |
*  |                              |
*  |                              |
*  --------------------------------
*  Where top-left = Lives
*  	 <3       = Cherries / HP
*  	 99xGem   = # of Gems
*/

import TextButton from "../ui/button.js";

export default class HudOverlayScene extends Phaser.Scene {
    constructor(config) {
        if (config) {
            super(config);
        } else {
            super({ key: 'hud_overlay' });
        }
    }

    //get scene init data
    init(data) {
        if (data) {
            this.currentScene = data.sceneName;
        } else {
            console.log("Must provide level when loading platformer-scene.js.");
        }
    }

    preload() {}

    create() {
        // You can access the game's config to read the width & height
        const { width, height } = this.sys.game.config;

        //add hud text for lives
	this.add
            .text(width * 0.1, height * 0.05, "Kit x 5", {
                font: "16px monospace",
                color: "white"
            })
            .setOrigin(0.5, 0.5)
            .setShadow(5, 5, "#5588EE", 0, true, true);

        //add hud text for gems 
	this.add
            .text(width * 0.9, height * 0.05, "99 x Gem(s)", {
                font: "16px monospace",
                color: "white"
            })
            .setOrigin(0.5, 0.5)
            .setShadow(5, 5, "#5588EE", 0, true, true);

	//move the HudOverlayScene over top of the currentScene (likely platformer-scene)
        this.scene.moveAbove(this.currentScene);
    }

    update(time, delta) {}

}
