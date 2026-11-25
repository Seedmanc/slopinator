import Phaser from "phaser";
import {Game} from "../scenes/Game";
import Vector2Like = Phaser.Types.Math.Vector2Like;
import {Balance} from "../const/Balance";

export default abstract class Reaction extends Phaser.GameObjects.Text {
     body: Phaser.Physics.Arcade.Body;
     private static readonly dislike = ['💢', '😡', '🚫', '👎','🤢'];
     private static readonly like = ['❤','👍','👌','🎯','💋'];
     protected abstract readonly bgColor: string;
     protected abstract speed;
     readonly BaseDmg = Balance.Damage;

     protected constructor(public scene: Game, x: number, y: number, type: 'like'|'dislike') {
         super(scene, x, y, Phaser.Math.RND.pick(Reaction[type]) , {})
         scene.add.existing(this);
         scene.physics.add.existing(this);

         this.body.setCircle(7)
         this.setScale(1.5 ,1.5)
         this.setOrigin(0.25,0.5);
         this.body.setCollideWorldBounds(true, null, null, true)
     }
     disableBody() {
         this.setActive(false);
         this.setVisible(false);
         this.body.enable=false;
     }
     abstract launch(src: Vector2Like, ...args)

     protected enableBody({x, y}: Vector2Like) {
        this.body.reset(x, y);
        this.body.setEnable(true)
        this.setActive(true);
        this.setVisible(true);
        this.setShadow(0, 0, this.bgColor, 10, false, true);
     }
}


export class Like extends Reaction {
    protected readonly bgColor = 'lime'
    protected speed = 350;
    constructor(scene, x: number, y: number) {
        super(scene, x, y, 'like')
        this.body.setCircle(this.body.radius+1)
        this.body.setOffset(2,-1)
    }
    launch(pos: Vector2Like) {
        this.enableBody(pos)
        this.scene.physics.velocityFromAngle( Phaser.Math.RND.between(30, 150), this.speed, this.body.velocity) //arc 120 to bottom
    }
}


export class Dislike extends Reaction {
    private readonly gravity = 1000;
    protected readonly bgColor = 'magenta'
    protected speed = 350;

    constructor(scene, x: number, y: number) {
        super(scene, x, y, 'dislike')
        this.body.setCircle(this.body.radius-1)
        this.body.setOffset(4,0)
    }

    launch(src: Vector2Like, {x, y}: Vector2Like, high = 0) {
        this.enableBody(src)
        this.body.setGravityY(this.gravity)
        const {angles,speed}  = this.getAirToGroundAngle(src, x,y, this.speed, this.body.gravity.y, this.scene.player.body.halfWidth)
        let angle = angles[high];
        const maxH = this.speed**2 * Math.sin(angle)**2/(2*this.gravity)
        if (maxH >= this.body.position.y)
            angle = angles[0]
        this.scene.physics.velocityFromAngle(Phaser.Math.RadToDeg(angle), speed, this.body.velocity);
    }

    private getAirToGroundAngle({x,y}, tx,ty, speed, gravity, tol) {
        const dx = tx - x; const dy = y - ty;
        if (Math.abs(dx) <= tol)
            return {angles:[Math.PI/2, Math.PI/2], speed:0};
        speed = speed * Phaser.Math.Clamp((Math.abs(dx)-200)/200+0.5,0.66,1.4) // smaller arc when tgt close, higher further away
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
