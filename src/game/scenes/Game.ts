import {EventBus} from '../EventBus';
import Phaser, {Scene} from 'phaser';
import Player from "../models/Player";
import Projectile from "../models/Projectile";
import Enemy from "../models/Enemy";
import {Dislike, Like} from "../models/Reaction";
import {AFFINITIES, TAffinity} from "../const/Affinity";
import {RunStatsManager} from "../RunStatsManager";
import Group = Phaser.Physics.Arcade.Group;
import GameObjectWithBody = Phaser.Types.Physics.Arcade.GameObjectWithBody;
import {Balance} from "../const/Balance";
import {Pooled} from "../const/core";

export class Game extends Scene {
    player: Player;
    enemies: Group;
    loadout: {maxBatch: number};
    readonly groups = new Map<typeof Pooled[number], Phaser.Physics.Arcade.Group>();

    constructor() {
        super('Game');
    }

    create() {
        this.loadout = this.registry.get('loadout');
        this.time.timeScale = Balance.Speed;
        this.tweens.timeScale = Balance.Speed;
        this.physics.world.timeScale = 1/Balance.Speed

        RunStatsManager.start();
        Pooled.forEach(T => this.group(T));
        this.enemies = this.physics.add.group({
            allowGravity:  false,
            classType: Enemy,
            maxSize: 3,
            collideWorldBounds: true
        });

        this.buildLevel()
        this.addInteractions()
        this.addControls()
        this.addEvents()
    }

    update() {
        this.player.stateMachine.update();
        this.player.update()
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

    private buildLevel() {
        this.player = new Player(this, this.scale.width / 2, this.scale.height * 0.75);
        AFFINITIES.forEach((_,i:TAffinity) => {
            this.enemies.add(new Enemy(this, this.scale.width/4*(i+1), this.scale.height*0.25, i))
        })

        const playerZone = this.add.zone(0, 0, this.scale.width, this.scale.height / 2).setOrigin(0, 0);
        this.physics.add.existing(playerZone, true);
        this.physics.add.collider(this.player, playerZone);

        const enemyZone = this.add.zone(0, this.scale.height / 2, this.scale.width, this.scale.height / 2).setOrigin(0, 0);
        this.physics.add.existing(enemyZone, true);
        this.physics.add.collider(this.enemies, enemyZone);
    }
    private addInteractions() {
        this.physics.add.collider(this.player, this.groups.get(Dislike), (plr:Player, reaction:Dislike) => {
            plr.disliked(reaction)
            reaction.disableBody();
        });
        this.physics.add.overlap(this.player, this.groups.get(Like), (plr:Player, reaction:Like) => {
            reaction.disableBody();
            plr.liked(reaction)
        });
        this.physics.world.on('worldbounds', (body) => {
            if (Pooled.some(type => body.gameObject instanceof type)) {
                body.gameObject.disableBody(true, true);
            }
        });
        this.physics.add.overlap(this.enemies, this.groups.get(Projectile), (enemy:Enemy, proj:Projectile) => {
            if (enemy.hit(proj))
                EventBus.emit('enemy:hit', [enemy.affinity, proj.affinity]);
            proj.disableBody(true, true);
        })
    }
    private addControls() {
        this.input.keyboard.on('keydown-Q',()=>this.player.updateBatch(this.player.batchSize-1));
        this.input.keyboard.on('keydown-E',()=>this.player.updateBatch(this.player.batchSize+1));
        this.input.on('wheel', (_, __, ___, deltaY) =>  this.player.updateBatch(this.player.batchSize-Math.sign(deltaY)));
    }
    private addEvents() {
        EventBus.on('batch:change', this.player.updateBatch, this.player);
        EventBus.on('site:saturated', () => {
            if (this.enemies.countActive() == 0) {
                this.scene.pause()
                window.setTimeout( () =>{  //can't use scene.time because it's paused
                    this.scene.stop()
                    this.changeScene('GameOver', false)
                }, 1000/Balance.Speed)
            }
        });
        EventBus.emit('scene:ready', this);
    }
    changeScene(which: string = 'GameOver', lost) {
        EventBus.off('batch:change')
        EventBus.off('site:saturated')
        this.scene.start(which, {...RunStatsManager.getRunSummary(), lost});
    }
}
