import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import {StatsManager} from "../StatsManager";
import Phaser from "phaser";

export class GameOver extends Scene
{   won: boolean;
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameOverText : Phaser.GameObjects.Text;

    constructor ()
    {
        super('GameOver');
    }

    init(data) {
        this.won = !data.lose;
    }

    create ()
    {
        this.camera = this.cameras.main
        this.camera.setBackgroundColor(this.won ? 0x00ff00 : 0xff0000);

        //this.background = this.add.image(512, 384, 'background');
        //this.background.setAlpha(0.5);

        this.gameOverText = this.add.text(512, 384, `${this.won ? 'Win' : 'Game Over'}\nAccuracy: ${StatsManager.accuracy*100}%\nScore: ${StatsManager.score}`, {
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
