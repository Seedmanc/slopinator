import {Dislike, Like} from "../models/Reaction";
import {Disposables} from "../scenes/Game";
import Phaser from "phaser";

export const fractionalFill = (good: boolean, random: number, alertness: number, ownReactivity = 1, projReactivity = 1): typeof Disposables => {
    const reactions = []; const baseRate = 1.25;
    const type = good ? Like : Dislike;
    let  adjusted = (baseRate + (good ? -1 : 1) * alertness);
    adjusted *= Math.min(ownReactivity,projReactivity)

    for (let i=0;i<Math.floor(adjusted);i++) {
        reactions.push(type);
    }
    if (random <= adjusted - Math.floor(adjusted)) {
        reactions.push(type);
    }
    return reactions;
}

export function getAirToGroundAngle({x,y}, tx,ty, speed, gravity, tol) {
    const dx = tx - x; const dy = y - ty;
    if (Math.abs(dx) <= tol)
        return {angles:[Math.PI/2, Math.PI/2], speed:0};
    speed = speed * Phaser.Math.Clamp((Math.abs(dx)-200)/200+0.5,0.66,1.4) // smaller arc when tgt close, higher further away
    const v2 = speed ** 2; const v4 = speed ** 4;
    const x2 = dx * dx;
    let root = v4 - gravity * (gravity * x2 + 2 * dy * v2);
    if (root < 0) root = 0;
    const sqrtRoot = Math.sqrt(root);
    const gx = gravity * dx;
    const offset = dx < 0 ?
        Math.PI : 0;
    const lowAngle =-Math.atan((v2 - sqrtRoot) / gx) + offset;
    let highAngle = -Math.atan((v2 + sqrtRoot) / gx) + offset;
    return {angles:[lowAngle, highAngle], speed};
}
