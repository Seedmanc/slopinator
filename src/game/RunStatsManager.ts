import {EventBus} from "./EventBus";
import Phaser from "phaser";

export type RunSummary = {accuracy: number, score: number, lost?: boolean}

export class RunStatsManager {
    static shotsFired: number;
    static shotsLanded: number;
    static score: number;

    static start() {
        RunStatsManager.reset();
        EventBus.on('player:fire', (amt=1)=> {
            RunStatsManager.shotsFired += amt;
        })
        EventBus.on('enemy:hit', ([enemy, proj])=> {
            RunStatsManager.shotsLanded++;
        })
        EventBus.on('score:up', (base)=> {
            RunStatsManager.score+=base*10;
        })
    }

    static get accuracy(): number {
        return Phaser.Math.RoundTo(RunStatsManager.shotsFired && RunStatsManager.shotsLanded/RunStatsManager.shotsFired,-2);
    }

    static reset() {
        RunStatsManager.shotsFired = 0;
        RunStatsManager.shotsLanded = 0;
        RunStatsManager.score = 0;
        EventBus.off('player:fire')
        EventBus.off('enemy:hit')
        EventBus.off('score:up')
    }

    static getRunSummary(): RunSummary {
        return {
            accuracy: RunStatsManager.accuracy,
            score: RunStatsManager.score
        }
    }

}
