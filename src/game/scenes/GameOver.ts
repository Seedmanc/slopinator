import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import {RunSummary } from "../RunStatsManager";
import Phaser from "phaser";

export class GameOver extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameOverText : Phaser.GameObjects.Text;
    runSummary: RunSummary

    constructor ()
    {
        super('GameOver');
    }

    init(data: RunSummary) {
        this.runSummary = data;
    }

    create ()
    {
        this.camera = this.cameras.main
        this.camera.setBackgroundColor(this.runSummary.lost ? 0xff0000 : 0x00ff00);

        //this.background = this.add.image(512, 384, 'background');
        //this.background.setAlpha(0.5);

        this.gameOverText = this.add.text(512, 384, `${this.runSummary.lost ? 'Game Over' : 'Win'}\nAccuracy: ${this.runSummary.accuracy*100}%\nScore: ${this.runSummary.score}`, {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        EventBus.emit('scene:ready', this);
    }

    changeScene () {
        this.scene.start('Game');
    }
}
