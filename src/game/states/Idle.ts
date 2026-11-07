import {IState} from "./StateMachine";
import Player from "../models/Player";

export default abstract class IdleState implements IState {

    static onUpdate(this: Player) {
        if (this.scene.input.activePointer.leftButtonDown() &&
            this.scene.time.now >= this.scene.nextFireAt &&
            this.scene.projectiles.getTotalFree() >= this.batchSize) {
            this.fireBullets();
            this.scene.nextFireAt = this.scene.time.now + this.fireDelay*Math.sqrt(this.batchSize);
        }
    }
    static onEnter(this: Player) {
        this.eightDirection.setSpeed(this.defaultSpeed)
        this.cooldown.setVisible(false);
        this.scene.input.keyboard.on('keydown-ONE', () => this['stateMachine'].setState('S.Switching', 0))
        this.scene.input.keyboard.on('keydown-TWO', () => this['stateMachine'].setState('S.Switching', 1))
        this.scene.input.keyboard.on('keydown-THREE', () => this['stateMachine'].setState('S.Switching', 2))
    }
   /* static canSwitch(index, this: Player): boolean {
        return index != this.ammoIndex;
    }*/
    static onExit(this: Player) {
        this.scene.input.keyboard.off('keydown-ONE')
        this.scene.input.keyboard.off('keydown-TWO')
        this.scene.input.keyboard.off('keydown-THREE')
    }

}
