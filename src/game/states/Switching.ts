import {IState} from "./StateMachine";
import Player from "../models/Player";
import {AFFINITIES, TAffinity} from "../const/Affinity";

export default abstract class SwitchingState implements IState {
    static pendingAmmo: TAffinity;

    static onUpdate(this: Player) {}
    static onEnter(plr: Player, nextAmmo: TAffinity) {
        SwitchingState.pendingAmmo = nextAmmo;
        plr.cooldown.setVisible(true)
        plr.cooldown.setTrackColor(plr.ammo.color)
        plr.cooldown.setBarColor(AFFINITIES[nextAmmo]?.color)
        plr.cooldown.setValue(0);
        plr.eightDirection.setSpeed(plr.defaultSpeed/1.5) // HDD stutter replacement as movement is owned by rex plugin
        plr.scene.tweens.add({
            targets: plr.cooldown,
            value: 1,
            duration: 1000,
            onComplete: () => plr.stateMachine.setState('S.Idle')
        })
    }
    static onExit(this: Player) {
        this.cooldown.setVisible(false)
        this.setAmmo(SwitchingState.pendingAmmo)
    }

}
