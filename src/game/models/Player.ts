import UIPlugin from "phaser4-rex-plugins/templates/ui/ui-plugin";
import CircularProgress = UIPlugin.CircularProgress;
import Phaser from "phaser";
import K from "../const/ResourceKeys";
import EightDirection from "phaser4-rex-plugins/plugins/behaviors/eightdirection/EightDirection";
import {EventBus} from "../EventBus";

export default class Player extends Phaser.GameObjects.Container {
    health: number;
    cooldown: CircularProgress;
    batchSize = 1;
    body : Phaser.Physics.Arcade.Body;
    eightDirection: EightDirection;
    barrel: Phaser.GameObjects.Image;
    #sprite: Phaser.GameObjects.Image;
    batchPreview: Phaser.GameObjects.Container;

    constructor(public scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y)
        this.health = 100;
        this.width = scene.textures.get(K.Player).get().width;
        this.height = scene.textures.get(K.Player).get().height;

        this.barrel = scene.add.image(0, 0,  K.Barrel).setOrigin(0, 0.5).setAngle(-90);
        this.#sprite = scene.add.image(0, 0,  K.Player)
        this.add(this.#sprite)
        this.add(this.barrel)

        this.batchPreview = scene.add.container(0, 0);
        this.add(this.batchPreview);
        this.updateBatch()

        scene.input.on('pointermove', (pointer) => {
            this.barrel.setAngle(Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(this.x, this.y, pointer.x, pointer.y)))
            this.batchPreview.setAngle(this.barrel.angle+90)
        });
    }

    updateBatch(size = this.batchSize) {
        this.batchSize = Phaser.Math.Clamp(size,1,4);
        this.batchPreview.removeAll();
        const rectangles = [] ;
        for (let i = 0; i < this.batchSize; i++) {
            let rect = this.scene.add.rectangle(0, 0, 10, 10, 0xffffff,0.5);
            rectangles.push(rect);
            this.batchPreview.add(rect);
        }
        const blkSize = rectangles[0].width;
        const w = this.batchSize - Math.floor(this.batchSize / 4) * 2 //1 2 3 4 => 1 2 3 2
        Phaser.Actions.GridAlign(rectangles, {
            width: w, height: 2,
            cellWidth: 2*blkSize, cellHeight: 2*blkSize,
            x: -5-blkSize*(w-1), y: -45
        });

        EventBus.emit('batch-size-changed', this.batchSize);
    }
}
