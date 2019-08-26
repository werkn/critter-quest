export default class Switch {

	constructor(scene, x, y, name) {
		this.scene = scene;

		const anims = scene.anims;

		// Create the physics-based sprite that we will move around and animate
		this.sprite = scene.physics.add
			.sprite(x, y, "atlas", "item-pickup-1.png")
		this.sprite.setImmovable(true);	
		this.sprite.body.setAllowGravity(false); //sprite should be immobile

		this.toggleTiles = []; //tiles that are controlled by this switch
		this.sprite.name = name;
		//from Tiled our switch object has the name 'Switch_N' grab
		//the N portion which is the id use to toggle tiles on and off.
		this.switchId = name.split("_")[1]; 
		this.sprite.state = "normal";
	}

	toggleAllTiles() {
		for (var i = 0; i < this.toggleTiles.length; i++) {
				this.toggleTiles[i].toggle();
		}
	}

	update() {
		if (this.sprite.state == "toggle") {
			console.log(this);
			this.toggleAllTiles();
			this.sprite.state = "normal";
		}
	}

	destroy() {
		this.sprite.destroy();
	}
}

