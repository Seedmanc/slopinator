import Phaser from "phaser";
import Reaction from "./Reaction";
import Vector2Like = Phaser.Types.Math.Vector2Like;

export default class Like extends Reaction {
    bgColor = 'lime'

    constructor(scene, x: number, y: number) {
         super(scene, x, y, 'like')
    }
    launch(pos: Vector2Like) {
        this.enableBody(pos)
        this.scene.physics.velocityFromAngle(Phaser.Math.Between(0, 180), this.speed, this.body.velocity)
    }
}
