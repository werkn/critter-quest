export default class Switch {

	constructor(scene, x, y, name) {
		this.scene = scene;

		const anims = scene.anims;

		this.switchToggleKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
		this.delayBetweenToggles = 250; //ms

		// Create the physics-based sprite that we will move around and animate
		this.sprite = scene.physics.add
			.sprite(x, y, "props_atlas", "crank-up.png")
		this.sprite.setImmovable(true);	
		this.sprite.body.setAllowGravity(false); //sprite should be immobile

		this.toggleTiles = []; //tiles that are controlled by this switch
		this.sprite.name = name;
		//from Tiled our switch object has the name 'Switch_N' grab
		//the N portion which is the id use to toggle tiles on and off.
		this.switchId = name.split("_")[1]; 
		this.sprite.state = "normal";
		this.sprite.owner = this ; //reference to our class so we can get it from callbacks 
		this.allowToggle = true;
	}

	toggleAllTiles() {

		if (this.allowToggle) {
			//check we've waited delayBetweenToggles before
			//toggling again
			for (var i = 0; i < this.toggleTiles.length; i++) {
				this.toggleTiles[i].toggle();
			}

			this.allowToggle = false;
			this.scene.time.delayedCall(this.delayBetweenToggles, function() {
				this.allowToggle = true;	
			}, null, this); 
		}
	}

	update() {}

	destroy() {
		this.sprite.destroy();
	}
}

