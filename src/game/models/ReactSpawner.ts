import {AFFINITIES} from "../const/Affinity";
import Phaser from "phaser";
import {fractionalFill} from "../const/core";
import Reaction, {Dislike, Like} from "./Reaction";
import {Balance} from "../const/Balance";
import Projectile from "./Projectile";
import Vector2Like = Phaser.Types.Math.Vector2Like;
import {Game} from "../scenes/Game";
import Enemy from "./Enemy";

export class ReactSpawner {
    static spawn(failProb: number, src: Enemy, tgt: Vector2Like, proj: Projectile, scene: Game) { //not sure is the the best way to extract the functionality from Enemy
        const isGood = Phaser.Math.RND.frac() >= failProb;
        const reactions = fractionalFill(isGood, Phaser.Math.RND.frac(), src.alertness, AFFINITIES[src.affinity]['reactivity'], AFFINITIES[proj.affinity]['reactivity'])
        const type = isGood ? Like : Dislike;

        reactions.forEach((_, i) => {
            scene.time.delayedCall(Balance.ReactDelay * i, () => {
                const reaction = <Reaction>scene.groups.get(type).get()
                if (!reaction && scene.physics.world.drawDebug)
                    console.warn(type, scene.groups.get(type).countActive(), 'not enough');
                reaction?.launch(src, tgt, 1 - i%2)
            })
        })
    }
}
