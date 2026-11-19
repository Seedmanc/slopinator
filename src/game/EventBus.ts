import { Events } from 'phaser';
import EventEmitter = Phaser.Events.EventEmitter;
import {TAffinity} from "./const/Affinity";

interface EvtEmitter extends EventEmitter {
    on<K extends keyof GameEvents>(event: K, fn: (p?: GameEvents[K]) => void, context?: any): this;
    emit<K extends keyof GameEvents>(event: K, p: GameEvents[K]): boolean;
}
// Used to emit events between components, HTML and Phaser scenes
export const EventBus: EvtEmitter = new Events.EventEmitter();

type GameEvents = {
    /*"building:saturated": { buildingId: string };
    "building:annoyanceOverflow": { buildingId: string };
    "shield:hit": { buildingId: string };
    "captcha:launched": { buildingId: string };
    "player:hit": { damage: number; source: "dislike" | "insult" | "pencil" };
    "like:collected": { hpFull: boolean };
    "boss:phase": { phase: "ranged" | "vacuum" | "trainedStrike" };*/
    "batch:change": number;
    "batch:changed": number;
    "scene:ready": Phaser.Scene;
    "player:fire": number|null;
    "enemy:hit": [enemy:TAffinity, proj:TAffinity];
    // ...
};
