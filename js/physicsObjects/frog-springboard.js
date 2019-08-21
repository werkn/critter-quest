/**
 * A class that wraps up our frog-springboard logic.
 */
export default class FrogSpringboard {

	constructor(scene, x, y, name) {
		this.scene = scene;

		// Create the enemy's idle animations from the texture atlas. These are stored in the global
		// animation manager so any sprite can access them.
		const anims = scene.anims;
		//FROG IDLE ANIMATION
		anims.create({
			key: "frog-idle",
			frames: anims.generateFrameNames("atlas", {
				prefix: "idle/frog-idle-",
				suffix: '.png',
				start: 1,
				end: 4
			}),
			frameRate: 3,
			repeat: -1
		});

		// Create the physics-based sprite that we will move around and animate
		this.sprite = scene.physics.add
			.sprite(x, y, "atlas", "idle/frog-idle-1.png")
			.setDrag(1000, 0)
			.setMaxVelocity(300, 1000);  //this controls our maximum horizontal speed as well as maximum jump height!

		this.sprite.name = name;
		this.sprite.state = "normal";
		this.sprite.setTint(0x00e5ff);
	}

	update() {
		this.sprite.anims.play("frog-idle", true);
		this.scene.physics.world.overlap(this.scene.player.sprite, this.sprite, function(player, frogSpringboard) {
			if (player.state == "normal") {
				if(frogSpringboard.body.touching.up && player.body.touching.down) {	
					console.log("Player jumped on enemy!"); 
					player.setVelocityY(-850);
				} 
			}
		}, null, this);
	}

	destroy() {
		this.sprite.destroy();
	}
}
