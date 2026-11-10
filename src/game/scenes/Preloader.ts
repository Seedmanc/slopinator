import { Scene } from 'phaser';
import K from "../const/ResourceKeys";

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        //this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image('logo', 'logo.png');
        this.load.image('star', 'star.png');


        const g = this.add.graphics();
        // player rig
        g.clear();
        g.fillStyle(0x232a3d, 1); g.fillRoundedRect(4, 6, 32, 28, 6);
        g.fillStyle(0x3fd0ff, 1); g.fillRect(8, 10, 10, 6);
        g.fillStyle(0xffd54f, 1); g.fillCircle(30, 14, 3);
        g.fillStyle(0x141926, 1); g.fillRoundedRect(10, 26, 8, 8, 2); g.fillRoundedRect(22, 26, 8, 8, 2);
        g.lineStyle(2, 0x3fd0ff, 0.8); g.strokeRoundedRect(4, 6, 32, 28, 6);
        g.generateTexture(K.Player, 40, 40);
        // barrel
        g.clear(); g.fillStyle(0x9fb4d8, 1); g.fillRect(0, 2, 26, 6); g.fillStyle(0x3fd0ff, 1); g.fillRect(22, 1, 8, 8);
        g.generateTexture(K.Barrel, 30, 10);
        // projectile
        g.clear(); g.fillStyle(0xeeeeee, 1); g.fillRect(0, 0, 12, 12);  g.generateTexture(K.Projectile, 12, 12);
        // website
        g.clear();
        g.fillStyle(0x1b2233,1); g.fillRoundedRect(0,0,96,76,6);
        g.lineStyle(2,0x3a4763,1); g.strokeRoundedRect(0,0,96,76,6);
        g.fillStyle(0x2a3550,1); g.fillRoundedRect(0,0,96,16,{tl:6,tr:6,bl:0,br:0});
        g.fillStyle(0xff5f5f,1); g.fillCircle(8,8,2.5); g.fillStyle(0xffd54f,1); g.fillCircle(16,8,2.5); g.fillStyle(0x5fffb0,1); g.fillCircle(24,8,2.5);
        g.fillStyle(0x232c44,1);
        g.generateTexture(K.Website,96,76);
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('Game');
    }
}
