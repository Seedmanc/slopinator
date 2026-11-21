import {EventBus} from "./EventBus";

export class StatsManager {
    static shotsFired = 0;
    static shotsLanded = 0;
    static score = 0;

    static start() {
        StatsManager.reset();
        EventBus.on('player:fire', (amt=1)=> {
            StatsManager.shotsFired += amt;
        })
        EventBus.on('enemy:hit', ([enemy, proj])=> {
            StatsManager.shotsLanded++;
        })
        EventBus.on('score:up', (base)=> {
            StatsManager.score+=base*10;
        })
    }

    static get accuracy(): number {
        return StatsManager.shotsFired && StatsManager.shotsLanded/StatsManager.shotsFired;
    }

    static reset() {
        StatsManager.shotsFired = 0;
        StatsManager.shotsLanded = 0;
        StatsManager.score = 0;
        EventBus.off('player:fire')
        EventBus.off('enemy:hit')
    }

}
