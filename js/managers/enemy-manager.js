import FrogEnemy from "../units/frog-enemy.js";

export default class EnemyManager {

	constructor(scene) {
		this.scene = scene;
		this.enemies = [];
	}

	update() {
		var i;
		for (i = this.enemies.length-1; i >= 0; i--) {
			if (this.enemies[i].dead) {

				console.log("Destroying enemy...");
				this.enemies[i].destroy();

				//remove the enemy from the array, its been collected/destroyed
				this.enemies.splice(i,1);
			} else {
				this.enemies[i].update();
				//manually check for player and enemy collisions
				this.scene.physics.world.overlap(this.scene.player.sprite, this.enemies[i].sprite, function(player, enemy) {
					if(enemy.body.touching.up && player.body.touching.down) {	
						console.log("Player jumped on enemy!"); 
						enemy.name = "dead"; 
						//disable enemy body so we don't hit it again
						enemy.body.setEnable(false);
						player.setVelocityY(-350);
						//TODO: Add enemy.die();
					} else  {
						console.log("Player was killed by enemy!"); 
						//TODO: Add player.die();
					}
				}, null, this);

			}
		}

	}

	destroy() {
		//delete reference to enemies 
		this.enemies = null;
	}
	
	add(enemy) {
		this.enemies.push(enemy);
	}

	remove(name) {
		this.enemies = this.enemies.filter(function(enemy) { return enemy.name != name; });
	}

}
