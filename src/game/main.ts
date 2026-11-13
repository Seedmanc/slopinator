import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { Game as MainGame } from './scenes/Game';
import { MainMenu } from './scenes/MainMenu';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';
import CircularProgressCanvasPlugin from 'phaser4-rex-plugins/plugins/circularprogresscanvas-plugin.js';
import EightDirectionPlugin from "phaser4-rex-plugins/plugins/eightdirection-plugin";
import LineProgressCanvasPlugin from 'phaser4-rex-plugins/plugins/lineprogresscanvas-plugin.js';



// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
export const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1000,
    height: 1000,
    fps: {
        target: 60
    },
    disableContextMenu: true,
    backgroundColor: '#028af880',
    //transparent: true,
    scene: [
       // Boot,
        Preloader,
        MainMenu,
        MainGame,
        GameOver
    ],
    physics: {
        default: 'arcade',
        arcade: {
             debug: true
        }
    },
    input: {
        windowEvents: false
    },
    plugins: {
        global: [{
            key: 'rexCircularProgressCanvas',
            plugin: CircularProgressCanvasPlugin,
            start: true
        },{
            key: 'rexEightDirection',
            plugin: EightDirectionPlugin,
            start: true
        },{
            key: 'rexLineProgressCanvasPlugin',
            plugin: LineProgressCanvasPlugin,
            start: true
        }]
    },
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
}

export default StartGame;
