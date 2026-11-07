import {IState} from "./StateMachine";
import Player from "../models/Player";

export default abstract class SwitchingState implements IState {
    static pendingAmmo: number;

    static onUpdate(this: Player) {}
    static onEnter(plr: Player, nextAmmo: number) {
        SwitchingState.pendingAmmo = nextAmmo;
        plr.cooldown.setVisible(true)
        plr.cooldown.setValue(0);
        plr.eightDirection.setSpeed(plr.defaultSpeed/1.5)
        plr.scene.tweens.add({
            targets: plr.cooldown,
            value: 1,
            duration: 2000,
            onComplete: () => plr.stateMachine.setState('S.Idle')
        })
    }
    static onExit(this: Player) {
        this.cooldown.setVisible(false)
        this.setAmmo(SwitchingState.pendingAmmo)
    }

}
