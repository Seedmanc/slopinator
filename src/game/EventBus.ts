import { Events } from 'phaser';
import EventEmitter = Phaser.Events.EventEmitter;
import {TAffinity} from "./const/Affinity";

interface EvtEmitter extends EventEmitter {
    on<K extends keyof GameEvents>(event: K, fn: (p?: GameEvents[K]) => void, context?: any): this;
    off<K extends keyof GameEvents>(event: K, fn?: (p?: GameEvents[K]) => void, context?: any): this;
    emit<K extends keyof GameEvents>(event: K, p: GameEvents[K]): boolean;
}

export const EventBus: EvtEmitter = new Events.EventEmitter();

type GameEvents = {
    "site:saturated": number;
    "score:up": number;
    "batch:change": number; // from angular to game
    "batch:updated": number; //from game to angular
    "scene:ready": Phaser.Scene;
    "player:fire": number;
    "enemy:hit": [enemy:TAffinity, proj:TAffinity];
};
