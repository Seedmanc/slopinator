import Phaser from "phaser";
import K from "../const/ResourceKeys";

export default   class Projectile extends Phaser.Physics.Arcade.Image {
     body : Phaser.Physics.Arcade.Body;
     constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, K.Projectile)
     }
}
