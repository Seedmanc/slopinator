import Phaser from "phaser";
import Reaction from "./Reaction";
export default class Dislike extends Reaction {
     static readonly BaseDmg = 0.1;
     readonly gravity = 1000;
     body : Phaser.Physics.Arcade.Body;
     speed = 600;
     constructor(scene, x: number, y: number) {
         super(scene, x, y, 'dislike')
     }

    launch(sx,sy, tx,ty, high) {
        this.body.setGravityY(this.gravity)
        let angles  = this.getAirToGroundAngle(sx, sy, tx,ty, this.speed, this.body.gravity.y)
        console.log(angles)
        this.scene.physics.velocityFromAngle( Phaser.Math.RadToDeg(angles[high]), this.speed, this.body.velocity);
    }

    /**
     * Calculates launch angle in radians to hit a target (tx, ty) from (sx, sy),
     * including targets below or directly underneath the shooter.
     */
    private getAirToGroundAngle(sx,sy, tx, ty, speed, gravity): number[] {
        const dx = tx - sx;
        const dy = sy - ty; // Negative when target is below shooter in Phaser (+Y down)

        // Edge case: Target is almost directly above or below (avoid division by zero)
        if (Math.abs(dx) < 0.001) {
            if (ty >= sy) {
                return [Math.PI / 2]; // Shoot straight down (90 deg in Phaser)
            }
        }

        const v2 = speed * speed;
        const v4 = v2 * v2;
        const x2 = dx * dx;

        const root = v4 - gravity * (gravity * x2 + 2 * dy * v2);

        if (root < 0) {
            return null; // Target out of range
        }

        const sqrtRoot = Math.sqrt(root);
        const gx = gravity * dx;

        // For an attack plane, use the direct (low) trajectory
        let angle = -Math.atan((v2 - sqrtRoot) / gx);

        // Adjust quadrant if target is to the left of the plane
        if (dx < 0) {
            angle += Math.PI;
        }

        const lowAngle = -Math.atan((v2 - sqrtRoot) / gx);
        const highAngle = -Math.atan((v2 + sqrtRoot) / gx);

        // Adjust quadrant if firing to the left (dx < 0)
        const offset = dx < 0 ? Math.PI : 0;

        return [  highAngle + offset,lowAngle + offset];
    }
}
