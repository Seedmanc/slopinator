import Phaser from "phaser";
import Reaction from "./Reaction";

export default class Like extends Reaction {
    bgColor = 'lime'

    constructor(scene, x: number, y: number) {
         super(scene, x, y, 'like')
    }
    launch() {
         this.scene.physics.velocityFromAngle(Phaser.Math.Between(0, 180), this.speed, this.body.velocity)
    }
}
