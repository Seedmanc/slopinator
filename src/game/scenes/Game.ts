import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import EightDirectionPlugin from "phaser4-rex-plugins/plugins/eightdirection-plugin";
import Player from "../models/player";
import ArcadeGameObject from "phaser4-rex-plugins/plugins/utils/arcade/ArcadeGameObject";

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    player: Player|ArcadeGameObject;

    constructor () {
        super('Game');
    }

    create () {
        this.camera = this.cameras.main;
       // this.camera.setBackgroundColor(0x00ff00);
        this.player = new Player(this, this.scale.width/2, this.scale.height*0.75);

        var zone = this.add.zone(0, 0, this.scale.width, this.camera.height/2).setOrigin(0,0);
        this.physics.add.existing(zone,true);

        /*this.gameText = this.add.text(512, 384, 'Make something fun!\nand share it with us:\nsupport@phaser.io', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);*/
        //this.player=(<BuildArcadeObjectPlugin>this.plugins.get('rexBuildArcadeObject')).build(this.player);

        var cursorKeys = <Phaser.Types.Input.Keyboard.CursorKeys>this.input.keyboard.addKeys({
            up: 'W',            down: 'S',            left: 'A',            right: 'D'
        });
        this.player['eightDirection'] = (<EightDirectionPlugin>this.plugins.get('rexEightDirection'))
            .add(this.player, {cursorKeys });
        this.physics.add.collider(this.player,zone)
        // @ts-ignore
         this.player.body.setCollideWorldBounds(true);
        this.add.existing(this.player)
        //this.physics.add.existing(this.player)
        EventBus.emit('current-scene-ready', this);
    }

    changeScene () {
        this.scene.start('GameOver');
    }
}
