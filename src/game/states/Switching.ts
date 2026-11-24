import {IState} from "./StateMachine";
import Player from "../models/Player";
import {AFFINITIES, TAffinity} from "../const/Affinity";
import {Balance} from "../const/Balance";

export default abstract class SwitchingState implements IState {
    static onUpdate(this: Player) {}
    static onEnter(plr: Player, nextAmmo: TAffinity) {
        plr._cooldown.setVisible(true)
        plr._cooldown.setTrackColor(plr._ammo.color)
        plr._cooldown.setBarColor(AFFINITIES[nextAmmo]?.color)
        plr._cooldown.setValue(0);
        plr._eightDirection.setSpeed(plr._defaultSpeed/1.5) // HDD stutter replacement as movement is owned by rex plugin
        plr.scene.tweens.killTweensOf(plr._cooldown)
        plr.scene.tweens.add({
            targets: plr._cooldown,
            value: 1,
            duration: Balance.AmmoSwitchDelay/Balance.Speed,
            onComplete: () => {
                plr._setAmmo(nextAmmo)
                plr.stateMachine.setState('S.Idle')
            }
        })
    }
    static onExit(this: Player) {
        this._cooldown.setVisible(false)
    }

}
