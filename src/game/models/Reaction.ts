import Phaser from "phaser";
import {BaseSpeed, Game} from "../scenes/Game";

export default abstract class Reaction extends Phaser.GameObjects.Text {
     static readonly BaseDmg = 0.1;
     static dislike = ['💢', '😡', '🚫', '👎'];
     static like = ['💖','👍','👌','🎯'];
     abstract bgColor: string;

     body: Phaser.Physics.Arcade.Body;
     speed = 4*BaseSpeed;

     protected constructor(public scene: Game, x: number, y: number, type: 'like'|'dislike') {
         super(scene, x, y, Phaser.Math.RND.pick(Reaction[type]) , {})
         scene.add.existing(this);
         scene.physics.add.existing(this);

         this.body.setCircle(7)
         this.setScale(1.5 ,1.5 )
         this.setOrigin( 0.25,0.5);
         this.body.setOffset( 4.5,0)
     }

     enableBody(_, x, y, ...args) {
         this.body.setEnable(true)
         this.setActive(true);
         this.setVisible(true);
         this.body.x = x;
         this.body.y = y;
         this.setShadow(0, 0, this.bgColor, 10, false, true);
     }
     disableBody(...args) {
         this.setActive(false);
         this.setVisible(false);
         this.body.enable=false;
     }
    abstract launch(...args)
}
