import Phaser from "phaser";
import K, {Affinity} from "../const/ResourceKeys";
import {Game} from "../scenes/Game";
import UIPlugin from "phaser4-rex-plugins/templates/ui/ui-plugin";
import LineProgress = UIPlugin.LineProgress;
import ammoConfig from '../const/ammo.json';
import Projectile from "./Projectile";

export default class Enemy extends Phaser.GameObjects.Container {
    readonly MaxSat = 100;
    readonly #Texture = K.Website;
    saturation: number = 0;
    alertness: number = 0;
    body : Phaser.Physics.Arcade.Body;
    satView: LineProgress;
    alertView: LineProgress;
    #image: Phaser.GameObjects.Image;
    affinity: Affinity;

    constructor(public scene: Game, x: number, y: number, affinity:   Affinity) {
        super(scene, x, y)
        this.saturation = 0;
        this.affinity = affinity;
        this.width = scene.textures.get(this.#Texture).get().width;
        this.height = scene.textures.get(this.#Texture).get().height;
        this.#image = scene.add.image(0, 0,  this.#Texture)
        this.add(this.#image)
        const color = ammoConfig[affinity ].color;
        // @ts-ignore
        this.satView = scene.add['rexLineProgressCanvas'](0, 0, 50, 10, color, 0, {  //TS2740: Type 'LineProgress' is missing the following properties from type 'LineProgress': isSizeChanged, setFillStyle, fillColor, fillAlpha, and 19 more.
            trackColor: '#000000', trackStrokeColor: color,
        });
        // @ts-ignore
        this.alertView = scene.add['rexLineProgressCanvas'](0, 15, 50, 10, 'white', 0, {
            trackColor: '#000000', trackStrokeColor: 'white',
        });
        this.add(this.satView);
        this.add(this.alertView);

        // @ts-ignore
        scene.add.existing(this); //Type argument cannot be inferred from usage
        // @ts-ignore
        scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);
    }

    hit(proj: Projectile) {
        let damage = this.MaxSat * Projectile.BaseDmg;
        let mismatch = Math.abs(this.affinity - proj.affinity);
        this.saturation += (ammoConfig.length-1 - mismatch) * damage;

        this.satView.setValue(this.saturation/this.MaxSat)
        this.alertness += (1 - Projectile.BaseDmg) * mismatch * damage;
        this.alertView.setValue(this.alertness/this.MaxSat)
    }
}
