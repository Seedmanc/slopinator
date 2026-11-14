import Phaser from "phaser";
import K, {Affinity} from "../const/ResourceKeys";
import ammoConfig from '../const/ammo.json';

export default class Projectile extends Phaser.Physics.Arcade.Image {
     static readonly BaseDmg = 0.1;
     body: Phaser.Physics.Arcade.Body;
     affinity: Affinity;

     constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, K.Projectile)
     }
     setAffinity(value: Affinity) {
         this.affinity = value;
         this.setTint(Phaser.Display.Color.ValueToColor(ammoConfig[value].color).color);
     }
}
