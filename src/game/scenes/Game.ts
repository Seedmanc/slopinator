import {EventBus} from '../EventBus';
import Phaser, {Scene} from 'phaser';
import Player from "../models/Player";
import Projectile from "../models/Projectile";
import Enemy from "../models/Enemy";
import {Affinity} from "../const/ResourceKeys";
import Like from "../models/Like";
import Dislike from "../models/Dislike";

export const matrix = new Phaser.GameObjects.Components.TransformMatrix();
const Disposables = [Projectile, Dislike, Like];
export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    player: Player;
    projectiles: Phaser.Physics.Arcade.Group;
    likes: Phaser.Physics.Arcade.Group;
    dislikes: Phaser.Physics.Arcade.Group;
    nextFireAt=0;
    enemy: Enemy;

    constructor() {
        super('Game');
    }

    private group<T>(type) {
        this[type.name.toLowerCase()+'s'] = this.physics.add.group({
            allowGravity:  true,
            classType: type,
            maxSize: 16,
            collideWorldBounds: true,
            // @ts-ignore
            createCallback: (bullet: T) => bullet.body.onWorldBounds = true //ridiculous typescript crap
        });
    }

    create() {
        Disposables.forEach(T => this.group<typeof T>(T));

        this.camera = this.cameras.main;
        this.player = new Player(this, this.scale.width / 2, this.scale.height * 0.75);

        const zone = this.add.zone(0, 0, this.scale.width, this.camera.height / 2).setOrigin(0, 0);
        this.physics.add.existing(zone, true);

        this.physics.add.collider(this.player, zone);
        this.physics.world.on('worldbounds', (body) => {
            if (Disposables.some(type => body.gameObject instanceof type)) {
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
