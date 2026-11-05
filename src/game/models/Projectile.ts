import Phaser from "phaser";
import K from "../const/ResourceKeys";

export default   class Projectile extends Phaser.Physics.Arcade.Image {
      constructor(   scene: Phaser.Scene, x: number, y: number  ) {
        super(scene, x, y, K.Projectile)
// @ts-ignore
          scene.add.existing(this); //Type argument cannot be inferred from usage
          // @ts-ignore
          scene.physics.add.existing(this) //same

          // @ts-ignore
          this.body.setCollideWorldBounds(true, 0, 0, true); //this has no effect, only the line at Game.ts works

    }


}
