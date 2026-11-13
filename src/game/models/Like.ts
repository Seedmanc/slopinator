import Phaser from "phaser";
import Reaction from "./Reaction";

export default class Like extends Reaction {
     static readonly BaseDmg = 0.1;
     constructor(scene, x: number, y: number) {
         super(scene, x, y, 'like')
     }
    launch(...args) {
         this.scene.physics.velocityFromAngle(Phaser.Math.Between(0, 180), this.speed, this.body.velocity)
     }
}
