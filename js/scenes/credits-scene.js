/**
 * User: werkn-development
 * Date: Fri Aug 23 13:23:37 MST 2019
 * 
 * CreditsScene is part of our Menu system and displayed after
 * the player has completed the game.
 *
 * The player can return to the title screen by hitting ENTER.
 */

import TextButton from "../ui/button.js";

export default class CreditsScene extends Phaser.Scene {
	constructor(config) {
		if (config) {
			super(config);
		} else {
			super({key: 'credits'});
		}
	}

	preload() {
	}

	create() {
		const { width, height } = this.sys.game.config;

		const linkStyle = { 
			align: 'center', 
			fontSize: 18, 
			fontFamily: '"Press Start 2P"',
			fill: 'blue' 
		};
		const lockedStyle = { 
			fill: '#f00', 
			align: 'center', 
			fontSize: 10, 
			strokeThickness: 4,
			stroke: '#000000',
			fontFamily: '"Press Start 2P"'
		};

		this.add
			.text(width / 2, height * 0.2, "Credits", this.sys.game.headingStyle)
			.setOrigin(0.5, 0.5);

		this.add
			.text(width / 2, height * 0.3, "Developed by werkn", this.sys.game.headingStyle)
			.setOrigin(0.5, 0.5);

		this.werknSiteLink = new TextButton(this,
			this.sys.canvas.width * 0.5, this.sys.canvas.height * 0.35,
			'werkn.github.io', 
			linkStyle,
			lockedStyle,
			true,
			() => window.open('https://werkn.github.io','_blank'));

		this.add.existing(this.werknSiteLink);

		this.add
			.text(width / 2, height * 0.4, "Tileset by ansimuz", this.sys.game.headingStyle)
			.setOrigin(0.5, 0.5);
		
		this.ansimuzLink = new TextButton(this,
			this.sys.canvas.width * 0.5, this.sys.canvas.height * 0.45,
			'ansimuz.itch.io', 
			linkStyle,
			lockedStyle,
			true,
			() => window.open('https://ansimuz.itch.io/','_blank'));

		this.add.existing(this.ansimuzLink);

		this.add
			.text(width / 2, height * 0.5, "Music by Pascal Belisle", this.sys.game.headingStyle)
			.setOrigin(0.5, 0.5);
		
		this.pascalLink = new TextButton(this,
			this.sys.canvas.width * 0.5, this.sys.canvas.height * 0.55,
			'soundcloud.com/pascalbelisle', 
			linkStyle,
			lockedStyle,
			true,
			() => window.open('https://soundcloud.com/pascalbelisle','_blank'));

		this.add.existing(this.pascalLink);

		this.add
			.text(width / 2, height * 0.75, '<Press Enter>', {
				fontFamily: '"Press Start 2P", Courier',
				fontSize: 14, 
				strokeThickness: 4,
				stroke: 'yellow',
				fill: "black"
			})
			.setOrigin(0.5, 0.5);

		this.input.keyboard.once("keydown_ENTER", event => {
			//restart the entire game by forcing a page reload
			window.location.reload(false); 
		});
	}

	update(time, delta) {
	}
}

