import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import Phaser from "phaser";
import EightDirectionPlugin from "phaser4-rex-plugins/plugins/eightdirection-plugin";
import Player from "../models/Player";
import Projectile from "../models/Projectile";

const matrix = new Phaser.GameObjects.Components.TransformMatrix();
export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    player: Player;
    projectiles: Phaser.Physics.Arcade.Group;
    nextFireAt=0;

    constructor() {
        super('Game');
    }

    create() {
        this.projectiles = this.physics.add.group({
            allowGravity: false,
            classType: Projectile as any, // the shit i have to put up with...
            maxSize: 4,
            collideWorldBounds: true,
            createCallback: (bullet: Projectile) => bullet.body.onWorldBounds = true
        });

        this.camera = this.cameras.main;

        this.player = new Player(this, this.scale.width / 2, this.scale.height * 0.75);

        const zone = this.add.zone(0, 0, this.scale.width, this.camera.height / 2).setOrigin(0, 0);
        this.physics.add.existing(zone, true);

        const cursorKeys = <Phaser.Types.Input.Keyboard.CursorKeys>this.input.keyboard.addKeys({
            up: 'W', down: 'S', left: 'A', right: 'D'
        });

        this.player.eightDirection = (<EightDirectionPlugin>this.plugins.get('rexEightDirection'))
            .add(this.player, { cursorKeys });

        this.physics.add.collider(this.player, zone);
        this.player.body.setCollideWorldBounds(true);

        this.add.existing(this.player);
        this.physics.world.on('worldbounds', (body) => {
            if (body.gameObject instanceof Projectile) {
                body.gameObject.disableBody(true, true);
            }
        });

        EventBus.emit('current-scene-ready', this);
    }

    update() {
        if (this.input.activePointer.leftButtonDown() &&
            this.time.now >= this.nextFireAt &&
            this.projectiles.getTotalFree() >= this.player.batchSize) {
            this.fireBullets();
            this.nextFireAt = this.time.now + 500;
        }
    }

    fireBullets() {
        this.player.batchPreview.each(el => {
            const bullet = this.projectiles.get();
            el.getWorldTransformMatrix(matrix);
            let x = matrix.getX(1,1);
            let y = matrix.getY(1,1);
            bullet?.enableBody( true,   x,  y, true, true);
            this.physics.velocityFromAngle(this.player.barrel.angle, 500, bullet?.body.velocity);
            bullet?.setAngle(0);
        })
    }

    changeScene() {
        this.scene.start('GameOver');
    }
}
