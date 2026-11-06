import UIPlugin from "phaser4-rex-plugins/templates/ui/ui-plugin";
import CircularProgress = UIPlugin.CircularProgress;
import Phaser from "phaser";
import K from "../const/ResourceKeys";
import EightDirection from "phaser4-rex-plugins/plugins/behaviors/eightdirection/EightDirection";

export default class Player extends Phaser.GameObjects.Container {
    health: number;
    cooldown: CircularProgress;
    batchSize = 2;
    body : Phaser.Physics.Arcade.Body;
    eightDirection: EightDirection;
    barrel: Phaser.GameObjects.Image;
    #sprite: Phaser.GameObjects.Image;
    batchPreview: Phaser.GameObjects.Container;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y)
        this.health = 100;
        this.width = scene.textures.get(K.Player).get().width;
        this.height = scene.textures.get(K.Player).get().height;

        this.barrel = scene.add.image(0, 0,  K.Barrel).setOrigin(0, 0.5);
        this.#sprite = scene.add.image(0, 0,  K.Player)
        this.add(this.#sprite)
        this.add(this.barrel)

        this.batchPreview = scene.add.container(0, 0);
        const rectangles = [] ;
        for (let i = 0; i < this.batchSize; i++) {
            let rect = scene.add.rectangle(0, 0, 10, 10, 0xffffff,0.5);
            rectangles.push(rect);
            this.batchPreview.add(rect);
        }
        Phaser.Actions.GridAlign(rectangles, {
            width: 2, height: 1,
            cellWidth: 20, cellHeight: 10,
            x:  -15,   y: -30
        });
        this.add(this.batchPreview);

        scene.input.on('pointermove', (pointer) => {
            this.barrel.setAngle(Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(this.x, this.y, pointer.x, pointer.y)))
            this.batchPreview.setAngle(this.barrel.angle+90)
        });
    }
}
