import Phaser from "phaser";
import K, {Affinity} from "../const/ResourceKeys";
import {Game} from "../scenes/Game";
import ammoConfig from '../const/ammo.json';
import Projectile from "./Projectile";
import UIPlugin from "phaser4-rex-plugins/templates/ui/ui-plugin";
import LineProgressCanvas = UIPlugin.LineProgressCanvas;
import Reaction from "./Reaction";

export default class Enemy extends Phaser.GameObjects.Container {
    readonly MaxSat = 100;
    readonly Texture = K.Website;
    body : Phaser.Physics.Arcade.Body;
    private saturation: number = 0;
    private alertness: number = 0;
    private readonly satView: LineProgressCanvas;
    private readonly alertView: LineProgressCanvas;
    private readonly image: Phaser.GameObjects.Image;
    private affinity: Affinity;

    constructor(public scene: Game, x: number, y: number, affinity:   Affinity) {
        super(scene, x, y)
        this.saturation = 0;
        this.affinity = affinity;
        this.width = scene.textures.get(this.Texture).get().width;
        this.height = scene.textures.get(this.Texture).get().height;
        this.image = scene.add.image(0, 0,  this.Texture)
        this.add(this.image)
        const color = ammoConfig[affinity ].color;
        this.satView = scene.add['rexLineProgressCanvas'](0, 0, 50, 10, color, 0, {
            trackColor: '#000000', trackStrokeColor: color, valuechangeCallback:null //valuechangeCallback is useless but w/o it I get TS2345
        });
        this.alertView = scene.add['rexLineProgressCanvas'](0, 15, 50, 10, 'white', 0, {
            trackColor: '#000000', trackStrokeColor: 'white', valuechangeCallback:null
        });
        this.add(this.satView);
        this.add(this.alertView);

        // @ts-ignore
        scene.add.existing(this); //Type argument cannot be inferred from usage
        scene.physics.add.existing<typeof this>(this); //Expression statement is not assignment or call

        this.body.setCollideWorldBounds(true);
    }

    hit(proj: Projectile) {
        let damage = this.MaxSat * Projectile.BaseDmg;
        let mismatch = Math.abs(this.affinity - proj.affinity);
        this.saturation += (ammoConfig.length-1 - mismatch) * damage;
        this.saturation = Phaser.Math.Clamp(this.saturation, 0,this.MaxSat)

        this.satView.setValue(this.saturation/this.MaxSat)
        this.alertness += (1 - Projectile.BaseDmg) * mismatch * damage;
        this.alertness = Phaser.Math.Clamp(this.alertness, 0,this.MaxSat)
        this.alertView.setValue(this.alertness/this.MaxSat)

        this.react(mismatch/(ammoConfig.length-1))
    }

    react(failProb: number) {
        let reactions: string[] = [];
        const fractionalFill = (good: boolean, base: number = 1.25) => {
            const type = good ? 'likes' : 'dislikes';
            const adjusted = base + (good ? -1 : 1) * this.alertness/this.MaxSat;
            for (let i=0;i<Math.floor(adjusted);i++) {
                reactions.push(type);
            }
            if (Math.random() <= adjusted - Math.floor(adjusted)) {
                reactions.push(type);
            }
        }

        fractionalFill(Math.random() >= failProb)

        reactions.forEach((r, i) => {
            this.scene.time.delayedCall(200 * i, () => {
                (<Reaction>this.scene[r].get())?.launch(this, this.scene.player, 1-i%2)
            })
        })
    }
}
