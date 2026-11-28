import Phaser from "phaser";
import K from "../const/ResourceKeys";
import {Game} from "../scenes/Game";
import Projectile from "./Projectile";
import UIPlugin from "phaser4-rex-plugins/templates/ui/ui-plugin";
import LineProgressCanvas = UIPlugin.LineProgressCanvas;
import {AFFINITIES, TAffinity} from "../const/Affinity";
import {EventBus} from "../EventBus";
import {ReactSpawner} from "./ReactSpawner";
import {Matchup} from "../const/core";

export default class Enemy extends Phaser.GameObjects.Container {
    body : Phaser.Physics.Arcade.Body;
    affinity: TAffinity;

    private saturation: number = 0;
    alertness: number = 0;
    private readonly satView: LineProgressCanvas;
    private readonly alertView: LineProgressCanvas;
    private readonly image: Phaser.GameObjects.Image;
    private readonly Texture = K.Website;

    constructor(public scene: Game, x: number, y: number, affinity: TAffinity) {
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

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setCollideWorldBounds(true);
    }

    hit(proj: Projectile): boolean {
        if (!this.active)
            return false;
        const matchup = Matchup(this.affinity, proj.affinity, proj.damage)
        this.saturation += matchup.satDelta;   //0 to 0.2
        this.saturation = Phaser.Math.Clamp(Phaser.Math.RoundTo(this.saturation,-3), 0,1)
        this.satView.setValue(this.saturation)

        this.alertness += matchup.alertDelta; // 0 to 0.18
        this.alertness = Phaser.Math.Clamp(Phaser.Math.RoundTo(this.alertness,-3), 0,1)
        this.alertView.setValue(this.alertness)

        if (this.saturation >= 1) {
            this.setActive(false)
            this.body.setEnable(false)

            this.setAlpha(0.5)
            EventBus.emit('site:saturated', this.alertness)
        } else
            ReactSpawner.spawn(matchup.mismatchMul, this, this.scene.player, proj, this.scene)

        return true;
    }
}
