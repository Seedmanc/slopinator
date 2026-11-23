import Phaser from "phaser";
import K from "../const/ResourceKeys";
import {Game} from "../scenes/Game";
import Projectile from "./Projectile";
import UIPlugin from "phaser4-rex-plugins/templates/ui/ui-plugin";
import LineProgressCanvas = UIPlugin.LineProgressCanvas;
import Reaction, {Dislike, Like} from "./Reaction";
import {AFFINITIES, Affinity, TAffinity} from "../const/Affinity";
import {EventBus} from "../EventBus";

export default class Enemy extends Phaser.GameObjects.Container {
    body : Phaser.Physics.Arcade.Body;
    affinity: TAffinity;

    private saturation: number = 0;
    private alertness: number = 0;
    private readonly satView: LineProgressCanvas;
    private readonly alertView: LineProgressCanvas;
    private readonly image: Phaser.GameObjects.Image;
    private readonly Texture = K.Website;

    constructor(public scene: Game, x: number, y: number, _, affinity: TAffinity) {
        super(scene, x, y)
        this.affinity = affinity;
        this.width = scene.textures.get(this.Texture).get().width;
        this.height = scene.textures.get(this.Texture).get().height;
        this.image = scene.add.image(0, 0,  this.Texture)
        this.add(this.image)
        const color = AFFINITIES[affinity].color;
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
        const damage = Projectile.BaseDmg;
        const mismatch = Math.abs(this.affinity - proj.affinity); //0 to 2
        const maxAmmo = AFFINITIES.length-1
        this.saturation += (maxAmmo - mismatch) * damage;   //0 to 0.2
        this.saturation = Phaser.Math.Clamp(this.saturation, 0,1)

        this.satView.setValue(this.saturation)
        this.alertness += (1 - Projectile.BaseDmg) * mismatch * damage; // 0 to 0.18
        this.alertness = Phaser.Math.Clamp(this.alertness, 0,1)
        this.alertView.setValue(this.alertness)
        if (this.saturation >= 1) {
            this.setActive(false)
            this.setAlpha(0.5)
            EventBus.emit('site:saturated', this.alertness)
        }
        else
            this.react(mismatch/maxAmmo)
    }

    private react(failProb: number) {
        let reactions = [];
        const fractionalFill = (good: boolean, base: number = 1.25) => {
            const type = good ? Like : Dislike;
            let  adjusted = (base + (good ? -1 : 1) * this.alertView.getValue()); // is it ok to use UIcomponent to avoid this.alertness/this.maxSat again?
            if (failProb == 0.5 || this.affinity == Affinity.Base) {
                adjusted*=0.7   // generic type site is more passive... I wanted to avoid using ifs though, tying everything to numbers
            }
            for (let i=0;i<Math.floor(adjusted);i++) {
                reactions.push(type);
            }
            if (Phaser.Math.RND.frac() <= adjusted - Math.floor(adjusted)) {
                reactions.push(type);
            }
        }

        fractionalFill(Phaser.Math.RND.frac() >= failProb)

        reactions.forEach((r, i) => {
            this.scene.time.delayedCall(200 * i, () => {
                (<Reaction>this.scene.groups.get(r).get())?.launch(this, this.scene.player, 1 - i%2)
            })
        })
    }
}
