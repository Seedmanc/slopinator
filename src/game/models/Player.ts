import Phaser from "phaser";
import K, {Affinity} from "../const/ResourceKeys";
import EightDirection from "phaser4-rex-plugins/plugins/behaviors/eightdirection/EightDirection";
import {EventBus} from "../EventBus";
import {Game, matrix} from "../scenes/Game";
import StateMachine from "../states/StateMachine";
import IdleState from "../states/Idle";
import SwitchingState from "../states/Switching";
import EightDirectionPlugin from "phaser4-rex-plugins/plugins/eightdirection-plugin";
import UIPlugin from "phaser4-rex-plugins/templates/ui/ui-plugin";
import CircularProgressCanvas = UIPlugin.CircularProgressCanvas;
import ammoConfig from '../const/ammo.json';
import Projectile from "./Projectile";

export default class Player extends Phaser.GameObjects.Container {
    health: number;
    cooldown: CircularProgressCanvas;
    batchSize = 1;
    body : Phaser.Physics.Arcade.Body;
    eightDirection: EightDirection;
    barrel: Phaser.GameObjects.Image;
    #sprite: Phaser.GameObjects.Image;
    batchPreview: Phaser.GameObjects.Container;
    fireDelay = 400;
    stateMachine: StateMachine
    defaultSpeed = 200;
    ammoIndex: Affinity = 1;

    get ammo(): { type: string, color: string } {
        return ammoConfig[this.ammoIndex];
    }

    constructor(public scene: Game, x: number, y: number) {
        super(scene, x, y)
        this.health = 100;
        this.width = scene.textures.get(K.Player).get().width;
        this.height = scene.textures.get(K.Player).get().height;

        this.barrel = scene.add.image(0, 0,  K.Barrel).setOrigin(0, 0.5).setAngle(-90);
        this.#sprite = scene.add.image(0, 0,  K.Player)
        this.add(this.#sprite)
        this.add(this.barrel)

        this.batchPreview = scene.add.container(0, 0);
        this.add(this.batchPreview);
        this.updateBatch()

        // @ts-ignore
        scene.add.existing(this);
        // @ts-ignore
        scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);

        scene.input.on('pointermove', (pointer) => {
            this.barrel.setAngle(Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(this.x, this.y, pointer.x, pointer.y)))
            this.batchPreview.setAngle(this.barrel.angle+90)
        });
        const cursorKeys = <Phaser.Types.Input.Keyboard.CursorKeys>scene.input.keyboard.addKeys({
            up: 'W', down: 'S', left: 'A', right: 'D'
        });
        this.eightDirection = (<EightDirectionPlugin>scene.plugins.get('rexEightDirection'))
            .add(this, { cursorKeys, speed: this.defaultSpeed});

        this.cooldown = this.scene.add['rexCircularProgressCanvas']({
            x: 0, y: 0,
            radius: scene.textures.get(K.Player).get().width,
            trackColor: 'red', barColor: 'lime' ,
            anticlockwise: true, startAngle: 0,
            valuechangeCallback:null
        })
        this.add(this.cooldown);

        this.addStates();
    }

    updateBatch(size = this.batchSize) {
        this.batchSize = Phaser.Math.Clamp(size,1,4);
        this.batchPreview.removeAll();
        const rectangles = [] ;
        for (let i = 0; i < this.batchSize; i++) {
            let rect = this.scene.add.rectangle(0, 0, 10, 10, Phaser.Display.Color.ValueToColor(this.ammo.color).color,0.7);
            rectangles.push(rect);
            this.batchPreview.add(rect);
        }
        const blkSize = rectangles[0].width;
        const w = this.batchSize - Math.floor(this.batchSize / 4) * 2 //1 2 3 4 => 1 2 3 2
        Phaser.Actions.GridAlign(rectangles, {
            width: w, height: 2,
            cellWidth: 2*blkSize, cellHeight: 2*blkSize,
            x: -5-blkSize*(w-1), y: -45
        });

        EventBus.emit('batch-size-changed', this.batchSize);
    }

    fireBullets() {
        this.batchPreview.each(el => {
            const bullet:Projectile = this.scene.projectiles.get()
            bullet.setAffinity(this.ammoIndex);
            el.getWorldTransformMatrix(matrix);
            let x = matrix.getX(1,1);
            let y = matrix.getY(1,1);
            bullet?.enableBody(true, x, y, true, true);
            this.scene.physics.velocityFromAngle(this.barrel.angle, this.fireDelay, bullet?.body.velocity);
            bullet?.setAngle(0);
        })
    }

    setAmmo(pendingAmmo: number) {
        this.ammoIndex = pendingAmmo;
        this.updateBatch()
    }

    private addStates() {
        this.stateMachine = new StateMachine(this, 'player')
        this.stateMachine
            .addState('S.Idle', IdleState)
            .addState('S.Switching', SwitchingState)
            .setState('S.Idle');
    }
}
