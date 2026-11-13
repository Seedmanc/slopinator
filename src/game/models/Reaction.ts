import Phaser from "phaser";
import {Game} from "../scenes/Game";

export default abstract class Reaction extends Phaser.GameObjects.Text {
     static readonly BaseDmg = 0.1;
     body : Phaser.Physics.Arcade.Body;
     static dislike = ['💢', '😡', '🚫', '👎'];
     static like = ['💖','👍','❦','👌'];
     speed = 400;

     protected constructor(public scene: Game, x: number, y: number, type: 'like'|'dislike') {
         super(scene, x, y, Phaser.Math.RND.pick(Reaction[type]), {})
         this.setOrigin(0.5);
         scene.add.existing(this);
         scene.physics.add.existing(this);
     }

     enableBody(_, x, y, ...args) {
         this.body.setEnable(true)
         this.setActive(true);
         this.setVisible(true);
         this.body.x = x;
         this.body.y = y;
     }
     disableBody(...args) {
         this.setActive(false);
         this.setVisible(false);
         this.body.enable = false;
         this.body.stop();
     }
    abstract launch(...args)
}
