import {Component, OnDestroy, viewChild} from '@angular/core';
import { PhaserGame } from './phaser-game.component';
import { MainMenu } from '../game/scenes/MainMenu';
import { CommonModule } from '@angular/common';
import { EventBus } from '../game/EventBus';
import Phaser from "phaser";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, PhaserGame, FormsModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent implements OnDestroy
{
    public spritePosition = { x: 0, y: 0 };
    public canMoveSprite = false;
    public batchSize;
    loadout = {maxBatch: 3}
    phaserRef = viewChild.required(PhaserGame);

    constructor()
    {
        EventBus.on('scene:ready', (scene: Phaser.Scene) => {
            this.canMoveSprite = scene.scene.key !== 'MainMenu';
        });
        EventBus.on('batch:updated', (size) => {
            this.batchSize = size;
        });
    }

    public changeScene()
    {
        const scene = this.phaserRef().scene;// as MainMenu;
        if (scene) {
            scene['changeScene']();
        }
    }

    onBatchChange() {
        EventBus.emit('batch:change', this.batchSize);
    }
    ngOnDestroy() {
        EventBus.removeAllListeners()
    }
}
