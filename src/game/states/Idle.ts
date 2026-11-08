import {IState} from "./StateMachine";
import Player from "../models/Player";
import ammoConfig from '../const/ammo.json';

export default abstract class IdleState implements IState {
    static onUpdate(this: Player) {
        if (this.scene.input.activePointer.leftButtonDown() &&
            this.scene.time.now >= this.scene.nextFireAt &&
            this.scene.projectiles.getTotalFree() >= this.batchSize) {
            this.fireBullets();
            this.scene.nextFireAt = this.scene.time.now + this.fireDelay*Math.sqrt(this.batchSize);
        }
    }
    static onEnter(plr: Player) {
        plr.eightDirection.setSpeed(plr.defaultSpeed)
        plr.cooldown.setVisible(false);
        plr.scene.input.keyboard.on ('keydown', e => {
            let index = parseInt(e.key)-1;
            if (!isNaN(index) && 0<= index && index <= ammoConfig.length-1 && index != plr.ammoIndex)
                plr.stateMachine.setState('S.Switching', index )
        });
    }

    static onExit(this: Player) {
        this.scene.input.keyboard.off('keydown')
    }

}
