/**
 * User: werkn-development
 * Date: Sat Aug 10 10:38:15 MST 2019
 * frog-enemy.js
 *
 * EnemyManager is used to store and manage instances of Enemy(s) within our game. 
 */

import FrogEnemy from "../units/frog-enemy.js";
import FrogBossEnemy from "../units/bosses/frog-boss-enemy.js";

export default class EnemyManager {

	constructor(scene) {
		this.scene = scene;
		this.enemies = [];

		//some enemies need to have their static count reset between scenes
		//do that here
		FrogBossEnemy.frogsRemaining = 0;
	}

	update() {
		for (var i = this.enemies.length-1; i >= 0; i--) {
			this.enemies[i].update();

			if (this.enemies[i].dead) {

				console.log("Destroying enemy...");
				this.enemies[i].destroy();

				//remove the enemy from the array, its been collected/destroyed
				this.enemies.splice(i,1);
			} else {
				//manually check for player and enemy collisions
				this.scene.physics.world.overlap(this.scene.player.sprite, this.enemies[i].sprite, function(player, enemy) {
					if (player.state == "normal") {
						if(enemy.body.touching.up && player.body.touching.down) {	
							console.log("Player jumped on enemy!"); 
							enemy.state = "dying"; 
							//disable enemy body so we don't hit it again
							enemy.body.setEnable(false);
							player.setVelocityY(-350);
						} else  {
							console.log("Player was killed by enemy!"); 
							player.state = "dying";
						}
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
