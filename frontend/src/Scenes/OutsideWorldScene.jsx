import Phaser from "phaser";

class OutsideWorldScene extends Phaser.Scene{
    constructor(){
        super("OutsideWorldScene")
    }
    create(){
        this.add.rectangle(0,0,3000,3000,0x3cb043).setOrigin(0);
        this.ArcadeBuilding = this.add.rectangle(800,500,300,200,0x444444);
        this.player = this.add.rectangle(300,700,40,40,0x00ff00);
        this.enterArcadeText = this.add.text( 0,0, "[ENTER] Enter Arcade",
            {
                fontSize: "16px",
                color: "#ffffff",
                backgroundColor: "#000000"
            });

        this.enterArcadeText.setVisible(false);

        this.entranceZone = new Phaser.Geom.Rectangle( 760, 600, 80, 40 );

        this.keys = this.input.keyboard.addKeys({
                    up: Phaser.Input.Keyboard.KeyCodes.W,
                    down: Phaser.Input.Keyboard.KeyCodes.S,
                    right: Phaser.Input.Keyboard.KeyCodes.D,
                    left: Phaser.Input.Keyboard.KeyCodes.A
                    });
        this.enterKey = this.input.keyboard.addKey( Phaser.Input.Keyboard.KeyCodes.ENTER );
    }
    update(){

        const speed = 3;
        if (this.keys.up.isDown) {
            this.player.y -= speed;
        }
        if (this.keys.down.isDown) {
            this.player.y += speed;
        }
        if (this.keys.right.isDown) {
            this.player.x += speed;
        }
        if (this.keys.left.isDown) {
            this.player.x -= speed;
        }

        const nearEntrance = this.entranceZone.contains(
            this.player.x,
            this.player.y
        );
        if (nearEntrance) {
            this.enterArcadeText.setPosition( this.player.x - 60, this.player.y - 60 ); 
            this.enterArcadeText.setVisible(true);
        }else{
            this.enterArcadeText.setVisible(false);
        }
        if ( nearEntrance && Phaser.Input.Keyboard.JustDown(this.enterKey)){
            this.cameras.main.fadeOut(500,0,0,0);
        }
        this.cameras.main.once(
            "camerafadeoutcomplete",
            () => {
                this.scene.start(
                "ArcadeInteriorScene"
            );
            }
        );
    }
}
export default OutsideWorldScene;