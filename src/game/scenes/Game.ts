import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import EightDirectionPlugin from "phaser4-rex-plugins/plugins/eightdirection-plugin";
import Player from "../models/Player";
import Projectile from "../models/Projectile";

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
        // @ts-ignore
        this.projectiles = this.physics.add.group({// why does it say argument is not assignable
            allowGravity: false,
            classType: Projectile,
            maxSize: 2
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
        // @ts-ignore
        this.player.body.setCollideWorldBounds(true);

        this.add.existing(this.player);



        this.physics.world.on('worldbounds', (body) => {console.log(body)
            if (body.gameObject instanceof Projectile) {
                this.projectiles.killAndHide(body.gameObject); //i don't want to write 2 lines every time here
                body.enable = false;
            }
        });

        EventBus.emit('current-scene-ready', this);
    }

    update() {

        if (this.input.activePointer.leftButtonDown() && this.time.now >= this.nextFireAt) {
            this.fireBullet();
            this.nextFireAt = this.time.now + 500;
        }
    }

    fireBullet() {
        const bullet = this.projectiles.get(this.player.x, this.player.y) as Projectile;

        if (!bullet) {
            return;
        }

        bullet.setActive(true); //i don't want to write 3 lines every time here
        bullet.setVisible(true);
        bullet.body.enable = true;
        // @ts-ignore
        bullet.body.setCollideWorldBounds(true, 0, 0, true); //if I remove this, the onworldbounds callback never fires

        this.physics.velocityFromAngle(this.player.barrel.angle, 500, bullet.body.velocity);
    }

    changeScene() {
        this.scene.start('GameOver');
    }
}
