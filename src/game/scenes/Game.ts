import {EventBus} from '../EventBus';
import Phaser, {Scene} from 'phaser';
import Player from "../models/Player";
import Projectile from "../models/Projectile";
import Enemy from "../models/Enemy";
import {Dislike, Like} from "../models/Reaction";
import {AFFINITIES} from "../const/Affinity";
import {StatsManager} from "../StatsManager";
import Group = Phaser.Physics.Arcade.Group;
export const matrix = new Phaser.GameObjects.Components.TransformMatrix();
const Disposables = [Projectile, Dislike, Like];

export class Game extends Scene {
    player: Player;
    enemies: Group;
    readonly groups = new Map<typeof Disposables[number], Phaser.Physics.Arcade.Group>();

    constructor() {
        super('Game');
    }

    private group<T>(type) {
        const group = this.physics.add.group({
            allowGravity:  true,
            classType: type,
            maxSize: 16,
            collideWorldBounds: true,
            // @ts-ignore
            createCallback: (bullet: T) => bullet.body.onWorldBounds = true //TS2322
        });
        this.groups.set(type, group);
    }

    create() {
        StatsManager.start();
        Disposables.forEach(T => this.group<typeof T>(T));
        // @ts-ignore
        this.enemies = this.physics.add.group({
            allowGravity:  false,
            classType: Enemy, // because of this line IDE says "implement all members"
            maxSize: 3,
            collideWorldBounds: true
        });

        this.player = new Player(this, this.scale.width / 2, this.scale.height * 0.75);

        const playerZone = this.add.zone(0, 0, this.scale.width, this.scale.height / 2).setOrigin(0, 0);
        this.physics.add.existing(playerZone, true);
        const enemyZone = this.add.zone(0, this.scale.height / 2, this.scale.width, this.scale.height / 2).setOrigin(0, 0);
        this.physics.add.existing(enemyZone, true);
        this.physics.add.collider(this.player, playerZone);
        this.physics.add.collider(this.enemies, enemyZone);

        this.physics.add.collider(this.player, this.groups.get(Dislike), (plr:Player, reaction:Dislike) => {
            plr.disliked(reaction)
            reaction.disableBody();
        });
        this.physics.add.overlap(this.player, this.groups.get(Like), (plr:Player, reaction:Like) => {
            reaction.disableBody();
            plr.liked(reaction)
        });

        AFFINITIES.forEach((_,i) => this.enemies.create(this.scale.width/4*(i+1), this.scale.height*0.25, null, i))

        this.physics.world.on('worldbounds', (body) => {
            if (Disposables.some(type => body.gameObject instanceof type)) {
                body.gameObject.disableBody(true, true);
            }
        });
        this.physics.add.overlap(this.enemies, this.groups.get(Projectile), (enemy:Enemy, proj:Projectile) => {
            enemy.hit(proj);
            proj.disableBody(true, true);
            EventBus.emit('enemy:hit', [enemy.affinity, proj.affinity]);
        });

        this.input.keyboard.on('keydown-Q',()=>this.player.updateBatch(this.player.batchSize-1));
        this.input.keyboard.on('keydown-E',()=>this.player.updateBatch(this.player.batchSize+1));
        EventBus.on('batch:change', this.player.updateBatch, this.player);
        EventBus.on('site:saturated', (alertness) => {
            if (this.enemies.countActive() == 0)
                this.changeScene('GameOver', {lose:false})
        });

        EventBus.emit('scene:ready', this);
    }

    update() {
        this.player.stateMachine.update();
    }
    changeScene (which: string = 'GameOver', data?) {
        EventBus.off('batch:change')
        this.scene.start(which, data);
    }
}
