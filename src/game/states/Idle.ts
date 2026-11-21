import {IState} from "./StateMachine";
import Player from "../models/Player";
import {AFFINITIES} from "../const/Affinity";
import Projectile from "../models/Projectile";

export default abstract class IdleState implements IState {
    static onUpdate(this: Player) {
        if (this.scene.input.activePointer.leftButtonDown() &&
            this.scene.time.now >= this._nextFireAt &&
            this.scene.groups.get(Projectile)?.getTotalFree() >= this.batchSize) {
            this.fireBullets();
            this._nextFireAt = this.scene.time.now + this._fireDelayMs*Math.sqrt(this.batchSize);
        }
    }
    static onEnter(plr: Player) {
        plr._eightDirection.setSpeed(plr._defaultSpeed)
        plr._cooldown.setVisible(false);
        plr.scene.input.keyboard.on ('keydown', e => {
            let index = parseInt(e.key)-1;
            if (!isNaN(index) && 0<= index && index <= (AFFINITIES.length-1) && index != plr._ammoIndex)
                plr.stateMachine.setState('S.Switching', index )
        });
    }

    static onExit(this: Player) {
        this.scene.input.keyboard.off('keydown')
    }

}
