/**
 * A class that wraps up our exit/door logic.
 */
export default class Exit {

	constructor(scene, x, y, name) {
		this.scene = scene;

		// Create the enemy's idle animations from the texture atlas. These are stored in the global
		// animation manager so any sprite can access them.
		const anims = scene.anims;
		//EXIT/DOOR IDLE ANIMATION
		anims.create({
			key: "door-idle",
			frames: anims.generateFrameNames("atlas", {
				prefix: "item-feedback-",
				suffix: '.png',
				start: 1,
				end: 4
			}),
			frameRate: 10,
			repeat: -1
		});
		

		// Create the physics-based sprite that we will move around and animate
		this.sprite = scene.physics.add
			.sprite(x, y, "atlas", "item-feedback-1.png")
			.setDrag(1000, 0)
			.setMaxVelocity(300, 1000);  //this controls our maximum horizontal speed as well as maximum jump height!

		this.sprite.name = name;
		this.sprite.state = "normal";
	}

	update() {
		const sprite = this.sprite;

		if (sprite.state == "normal") {
			sprite.anims.play("door-idle", true);
		} 
	}

	destroy() {
		this.sprite.destroy();
	}
}
