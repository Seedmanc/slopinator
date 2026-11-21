import Phaser from "phaser";
import K from "../const/ResourceKeys";
import {AFFINITIES, TAffinity} from "../const/Affinity";
import {Balance} from "../const/Balance";

export default class Projectile extends Phaser.Physics.Arcade.Image {
     static readonly BaseDmg = Balance.Damage;
     readonly speed = 400*Balance.Speed
     body: Phaser.Physics.Arcade.Body;
     affinity: TAffinity;

     constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, K.Projectile)
     }
     setAffinity(value: TAffinity) {
         this.affinity = value;
         this.setTint(Phaser.Display.Color.ValueToColor(AFFINITIES[value].color).color);
     }
}
