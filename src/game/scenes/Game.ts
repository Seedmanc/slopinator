import {EventBus} from '../EventBus';
import Phaser, {Scene} from 'phaser';
import Player from "../models/Player";
import Projectile from "../models/Projectile";
import Enemy from "../models/Enemy";
import {Affinity} from "../const/ResourceKeys";

export const matrix = new Phaser.GameObjects.Components.TransformMatrix();
export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    player: Player;
    projectiles: Phaser.Physics.Arcade.Group;
    nextFireAt=0;
    enemy: Enemy;

    constructor() {
        super('Game');
    }

    create() {
        this.projectiles = this.physics.add.group({
            allowGravity: false,
            classType: Projectile as any, // the shit i have to put up with...
            maxSize: 10,
            collideWorldBounds: true,
            createCallback: (bullet: Projectile) => bullet.body.onWorldBounds = true
        });

        this.camera = this.cameras.main;

        this.player = new Player(this, this.scale.width / 2, this.scale.height * 0.75);

        const zone = this.add.zone(0, 0, this.scale.width, this.camera.height / 2).setOrigin(0, 0);
        this.physics.add.existing(zone, true);


        this.physics.add.collider(this.player, zone);
        this.physics.world.on('worldbounds', (body) => {
            if (body.gameObject instanceof Projectile) {
                body.gameObject.disableBody(true, true);
            }
        });

        this.input.keyboard.on('keydown-Q',()=>this.player.updateBatch(this.player.batchSize-1));
        this.input.keyboard.on('keydown-E',()=>this.player.updateBatch(this.player.batchSize+1));

        this.enemy = new Enemy(this, this.scale.width / 2, this.scale.height * 0.25, Affinity.Anime)
        this.physics.add.overlap(this.enemy, this.projectiles, (enemy:Enemy, proj:Projectile) => {
            enemy.hit(proj);
            proj.disableBody(true, true);
        });

        EventBus.emit('current-scene-ready', this);
        EventBus.on('batch-size', size=>this.player.updateBatch(size));
    }

    update() {
        this.player.stateMachine.update();
    }
}
