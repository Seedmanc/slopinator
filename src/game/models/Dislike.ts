import Phaser from "phaser";
import Reaction from "./Reaction";
import Vector2Like = Phaser.Types.Math.Vector2Like;
import {BaseSpeed} from "../scenes/Game";

export default class Dislike extends Reaction {
     static readonly BaseDmg = 0.1;
     readonly gravity = 10*BaseSpeed;
     bgColor = 'magenta'
     speed = 3.5*BaseSpeed;

     constructor(scene, x: number, y: number) {
         super(scene, x, y, 'dislike')
     }

    launch(src: Vector2Like, {x, y}: Vector2Like, high = 0) {
        this.enableBody(src)
        this.body.setGravityY(this.gravity)
        const {angles,speed}  = this.getAirToGroundAngle(src, x,y, this.speed, this.body.gravity.y, this.scene.player.body.halfWidth)
        let angle = angles[high];
        const maxH = this.speed**2 * Math.sin(angle)**2/(2*this.gravity)
        if (maxH > this.body.position.y)
            angle = angles[0]
        this.scene.physics.velocityFromAngle(Phaser.Math.RadToDeg(angle), speed, this.body.velocity);
    }

    private getAirToGroundAngle({x,y}, tx,ty, speed, gravity, tol) {
        const dx = tx - x; const dy = y - ty;
        if (Math.abs(dx) <= tol)
            return {angles:[Math.PI/2, Math.PI/2], speed:0};
        speed = speed * Phaser.Math.Clamp((Math.abs(dx)-200)/200+0.5,0.66,1.4)
        const v2 = speed ** 2; const v4 = speed ** 4;
        const x2 = dx * dx;
        let root = v4 - gravity * (gravity * x2 + 2 * dy * v2);
        if (root < 0) root = 0;
        const sqrtRoot = Math.sqrt(root);
        const gx = gravity * dx;
        const offset = dx < 0 ?
            Math.PI : 0;
        const lowAngle =-Math.atan((v2 - sqrtRoot) / gx) + offset;
        let highAngle = -Math.atan((v2 + sqrtRoot) / gx) + offset;
        return {angles:[lowAngle, highAngle], speed};
    }
}
