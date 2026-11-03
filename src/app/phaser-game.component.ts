import {AfterViewInit, Component} from "@angular/core";
import Phaser from "phaser";
import StartGame from "../game/main";
import { EventBus } from "../game/EventBus";

@Component({
    selector: 'phaser-game',
    template: `<div [id]="parentId"></div>`,
    standalone: true,
})
export class PhaserGame implements AfterViewInit {
    readonly parentId = 'game-container';
    scene: Phaser.Scene;
    game: Phaser.Game;
    sceneCallback: (scene: Phaser.Scene) => void;

    ngAfterViewInit () {
        this.game = StartGame(this.parentId);

        EventBus.on('current-scene-ready', (scene: Phaser.Scene) => {
            this.scene = scene;

            if (this.sceneCallback) {
                this.sceneCallback(scene);
            }
        });
    }

    ngOnDestroy () {
        if (this.game) {
            this.game.destroy(true);
        }
    }
}
