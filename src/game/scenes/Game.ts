import {EventBus} from '../EventBus';
import Phaser, {Scene} from 'phaser';
import Player from "../models/Player";
import Projectile from "../models/Projectile";
import Enemy from "../models/Enemy";
import {Dislike, Like} from "../models/Reaction";
import {AFFINITIES} from "../const/Affinity";
import {StatsManager} from "../StatsManager";
import Group = Phaser.Physics.Arcade.Group;
import GameObjectWithBody = Phaser.Types.Physics.Arcade.GameObjectWithBody;
import {Balance} from "../const/Balance";
const Disposables = [Projectile, Dislike, Like];

export class Game extends Scene {
    player: Player;
    enemies: Group;
    readonly groups = new Map<typeof Disposables[number], Phaser.Physics.Arcade.Group>();

    constructor() {
        super('Game');
    }

    private group<T extends GameObjectWithBody>(type) {
        const group = this.physics.add.group({
            allowGravity:  true,
            classType: type,
            maxSize: 16,
            collideWorldBounds: true
        });
        this.groups.set(type, group);
    }

    create() {
        this.time.timeScale = Balance.Speed;
        this.tweens.timeScale = Balance.Speed;
        this.physics.world.timeScale = 1/Balance.Speed

        StatsManager.start();
        Disposables.forEach(T => this.group(T));
        this.enemies = this.physics.add.group({
            allowGravity:  false,
            classType: Enemy,
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
        EventBus.on('site:saturated', () => {
            if (this.enemies.countActive() == 0) {
                this.scene.pause()
                window.setTimeout( () =>{  //can't use scene.time because it's paused
                    this.scene.stop()
                    this.changeScene('GameOver', {lose:false})
                }, 1000/Balance.Speed)
            }
        });

        EventBus.emit('scene:ready', this);
    }

    update() {
        this.player.stateMachine.update();
        this.player.update()
    }
    changeScene (which: string = 'GameOver', data?) {
        EventBus.off('batch:change')
        EventBus.off('site:saturated')
        this.scene.start(which, data);
    }
}
