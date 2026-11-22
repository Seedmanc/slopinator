import Phaser from "phaser";
import K from "../const/ResourceKeys";
import EightDirection from "phaser4-rex-plugins/plugins/behaviors/eightdirection/EightDirection";
import {EventBus} from "../EventBus";
import { Game, matrix} from "../scenes/Game";
import StateMachine from "../states/StateMachine";
import IdleState from "../states/Idle";
import SwitchingState from "../states/Switching";
import EightDirectionPlugin from "phaser4-rex-plugins/plugins/eightdirection-plugin";
import UIPlugin from "phaser4-rex-plugins/templates/ui/ui-plugin";
import CircularProgressCanvas = UIPlugin.CircularProgressCanvas;
import Projectile from "./Projectile";
import {AFFINITIES, Affinity, TAffinity} from "../const/Affinity";
import LineProgressCanvas = UIPlugin.LineProgressCanvas;
import {Dislike, Like} from "./Reaction";
import {Balance} from "../const/Balance";

export default class Player extends Phaser.GameObjects.Container {
    batchSize = 1;
    body : Phaser.Physics.Arcade.Body;
    stateMachine: StateMachine
    hp = 1;

    readonly #barrel: Phaser.GameObjects.Image;
    readonly #sprite: Phaser.GameObjects.Image;
    readonly #batchPreview: Phaser.GameObjects.Container;
    readonly #hpView: LineProgressCanvas
    _eightDirection: EightDirection;
    _fireDelayMs = 1000/Balance.FireRate;
    _defaultSpeed = 400*Balance.Speed;
    _ammoIndex: TAffinity = Affinity.Realism;
    _cooldown: CircularProgressCanvas;
    _nextFireAt=0;
    get _ammo(): { type: string, color: string } {
        return AFFINITIES[this._ammoIndex];
    }

    constructor(public scene: Game, x: number, y: number) {
        super(scene, x, y)
        this.width = scene.textures.get(K.Player).get().width;
        this.height = scene.textures.get(K.Player).get().height;

        this.#barrel = scene.add.image(0, 0,  K.Barrel).setOrigin(0, 0.5).setAngle(-90);
        this.#sprite = scene.add.image(0, 0,  K.Player)
        this.add(this.#sprite)
        this.add(this.#barrel)

        this.#batchPreview = scene.add.container(0, 0);
        this.add(this.#batchPreview);
        this.updateBatch()

        this.#hpView = scene.add['rexLineProgressCanvas'](0, 20, this.width, 9, 'blue', this.hp, {
            trackColor: '#000000', trackStrokeColor: 'cyan', valuechangeCallback:null //valuechangeCallback is useless but w/o it I get TS2345
        });
        this.add(this.#hpView)

        // @ts-ignore
        scene.add.existing(this);
        // @ts-ignore
        scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);

        scene.input.on('pointermove', this.updateAim, this);
        scene.input.on('pointerdown', this.updateAim, this);
        const cursorKeys = <Phaser.Types.Input.Keyboard.CursorKeys>scene.input.keyboard.addKeys({
            up: 'W', down: 'S', left: 'A', right: 'D'
        });
        this._eightDirection = (<EightDirectionPlugin>scene.plugins.get('rexEightDirection'))
            .add(this, { cursorKeys, speed: this._defaultSpeed});

        this._cooldown = this.scene.add['rexCircularProgressCanvas']({
            x: 0, y: 0,
            radius: scene.textures.get(K.Player).get().width,
            trackColor: 'red', barColor: 'lime',
            anticlockwise: true, startAngle: 0,
            valuechangeCallback:null
        })
        this.add(this._cooldown);

        this.addStates();
    }

    updateBatch(size = this.batchSize) {
        this.batchSize = Phaser.Math.Clamp(size,1,4);
        this.#batchPreview.removeAll();
        const rectangles = [] ;
        for (let i = 0; i < this.batchSize; i++) {
            let rect = this.scene.add.rectangle(0, 0, 10, 10, Phaser.Display.Color.ValueToColor(this._ammo.color).color,0.7);
            rectangles.push(rect);
            this.#batchPreview.add(rect);
        }
        const blkSize = rectangles[0].width;
        const w = this.batchSize - Math.floor(this.batchSize / 4) * 2 //1 2 3 4 => 1 2 3 2
        Phaser.Actions.GridAlign(rectangles, {
            width: w, height: 2,
            cellWidth: 2*blkSize, cellHeight: 2*blkSize,
            x: -5-blkSize*(w-1), y: -45
        });

        EventBus.emit('batch:updated', this.batchSize);
    }

    fireBullets() {
        this.#batchPreview.each(el => {
            const bullet: Projectile = this.scene.groups.get(Projectile).get()
            if (!bullet)
                return;
            bullet.setAffinity(this._ammoIndex);
            el.getWorldTransformMatrix(matrix);
            let x = matrix.getX(1,1); let y = matrix.getY(1,1);
            bullet.enableBody(true, x, y, true, true);
            this.scene.physics.velocityFromAngle(this.#barrel.angle, bullet.speed, bullet.body.velocity);
            bullet.setAngle(0);
        })
        EventBus.emit('player:fire', this.batchSize);
    }

    _setAmmo(pendingAmmo: TAffinity) {
        this._ammoIndex = pendingAmmo;
        this.updateBatch()
    }

    disliked(reaction: Dislike) {
        this.hp -= reaction.BaseDmg;
        this.#hpView.setValue(this.hp);
        this.body.acceleration.copy(reaction.body.velocity.scale(15))
        this.scene.time.delayedCall(200,() =>{
            this.body.setAcceleration(0)
            if (this.hp<=0)
                this.scene.changeScene('GameOver', {lose:true})
        })
    }

    liked(reaction:Like) {
        if (this.hp<1) {
            this.hp += reaction.BaseDmg;
            this.#hpView.setValue(this.hp);
        } else
            EventBus.emit('score:up', reaction.BaseDmg)
    }

    private updateAim(ptr) {
        let targetAngle = Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(this.x, this.y, ptr.x, ptr.y));
        if (targetAngle > 0) {
            targetAngle = targetAngle > 90 ? -180 : 0;
        }
        this.#barrel.setAngle(targetAngle);
        this.#batchPreview.setAngle(this.#barrel.angle+90)
    }

    private addStates() {
        this.stateMachine = new StateMachine(this, 'player')
        this.stateMachine
            .addState('S.Idle', IdleState)
            .addState('S.Switching', SwitchingState)
            .setState('S.Idle');
    }
}
