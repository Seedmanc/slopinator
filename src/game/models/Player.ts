import UIPlugin from "phaser4-rex-plugins/templates/ui/ui-plugin";
import CircularProgress = UIPlugin.CircularProgress;
import Phaser from "phaser";
import K from "../const/ResourceKeys";
import EightDirection from "phaser4-rex-plugins/plugins/behaviors/eightdirection/EightDirection";

export default class Player extends Phaser.GameObjects.Container {
    health: number;
    cooldown!: CircularProgress;

    eightDirection: EightDirection;
    barrel: Phaser.GameObjects.Image;
    #sprite: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y)
        this.health = 100;
        this.width = scene.textures.get(K.Player).get().width;
        this.height = scene.textures.get(K.Player).get().height;
        this.barrel = scene.add.image(0, 0,  K.Barrel).setOrigin(0, 0.5);
        this.#sprite = scene.add.image(0, 0,  K.Player)
        this.add(this.#sprite)
        this.add(this.barrel)
        scene.input.on('pointermove', (pointer) => {
            this.barrel.setAngle(Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(this.x, this.y, pointer.x, pointer.y)))
        });
    }
}
