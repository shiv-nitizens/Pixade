import Phaser from "phaser";
import ArcadeBuilding from "../assets/ArcadeBuilding.png"
import ghost from "../assets/vecteezy_pixel-art-of-a-levitating-white-ghost-with-a-side-view-for_69528640.png"
import Tree from "../assets/Tree.png"
import Floor from "../assets/OutsideFloor.png"
import FlowerPot from "../assets/FlowerPot.png"
import Fountain from "../assets/Fountain.png";
import Lamp from "../assets/Lamp.png";
import Base from "../assets/Base.png";
import Pavement from "../assets/Pavement.png";
import Shop from "../assets/Shop.png";
import CostumeStore from "../assets/CostumeStore.png"; 
import FlowerPot2 from "../assets/FlowerPot2.png"
import Bin from "../assets/Bin.png";
import MartSign from "../assets/MartSign.png";
import Statue from "../assets/Statue.png";
import ClothSign from "../assets/clothSign.png";
import Bench from "../assets/Bench.png";
import FlowerPot3 from "../assets/FlowerPot3.png"

class OutsideWorldScene extends Phaser.Scene{
    constructor(){
        super("OutsideWorldScene")
    }
    preload(){
        this.load.image("ArcadeBuilding",ArcadeBuilding);
        this.load.image("ghost",ghost);
        this.load.image("Tree",Tree);
        this.load.image("Floor",Floor);
        this.load.image("FlowerPot",FlowerPot);
        this.load.image("Fountain",Fountain);
        this.load.image("Lamp",Lamp);
        this.load.image("Base",Base);
        this.load.image("Pavement",Pavement);
        this.load.image("Shop",Shop);
        this.load.image("CostumeStore",CostumeStore);
        this.load.image("FlowerPot2",FlowerPot2);
        this.load.image("Bin",Bin);
        this.load.image("MartSign",MartSign);
        this.load.image("Statue",Statue);
        this.load.image("ClothSign",ClothSign);
        this.load.image("Bench",Bench);
        this.load.image("FlowerPot3",FlowerPot3);

    }
    create(){
        this.add.rectangle(0,0,3000,3000,0x3cb043).setOrigin(0);
                const tileSize = 400;

         for(let x = 0; x < 3000; x += tileSize){
            for(let y = 0; y < 3000; y += tileSize){
                this.add.image(x, y, "Floor")
                    .setOrigin(0,0)
                    .setDisplaySize(tileSize, tileSize);
            }
        }
        this.Pavement = this.add.image(1200,1100,"Pavement").setScale(1.2)
        this.ArcadeBuilding = this.add.image(1200,380,"ArcadeBuilding").setScale(0.5);

       this.shop = this.add.image(1850, 580, "Shop").setScale(0.37);
        this.coustumeStore = this.add.image(550, 580, "CostumeStore").setScale(0.38);

        this.FlowerPot2 = this.add.image(1960,700,"FlowerPot2").setScale(0.35);
        this.Bin = this.add.image(2035,700,"Bin").setScale(0.13);
        this.MartSign = this.add.image(1730,690,"MartSign").setScale(0.08);


        this.Statue = this.add.image(450,705,"Statue").setScale(0.07);
        this.ClothSign = this.add.image(650,705,"ClothSign").setScale(0.08);

        this.leftPot = this.add.image(990,560,"FlowerPot").setScale(0.1);
        this.righPot = this.add.image(1400,560,"FlowerPot").setScale(0.1);
        const bounds = this.ArcadeBuilding.getBounds();
        this.buildingCollision = new Phaser.Geom.Rectangle(1040,430,320,50);
        this.leftPillarCollision =new Phaser.Geom.Rectangle(1135,470,55,80);
        this.rightPillarCollision =new Phaser.Geom.Rectangle(1235,470,35,80);
        this.entranceZone = new Phaser.Geom.Rectangle(1150,500,85,40);

        this.player = this.add.image(900,1150,"ghost").setScale(0.018);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0,0,3000,3000);
        this.enterArcadeText = this.add.text( 0,0, "[ENTER] Enter Arcade",
            {
                fontSize: "16px",
                color: "#ffffff",
                backgroundColor: "#000000"
            });

        this.rightFlowerPot = this.add.image(1670,900,"FlowerPot3").setScale(0.13);
        this.leftFlowerPot = this.add.image(740,900,"FlowerPot3").setScale(0.13);

        this.fountain = this.add.image(1200,1050,"Fountain").setScale(0.3);
        this.upperLeftLamp = this.add.image(1000,800,"Lamp").setScale(0.15);
        this.upperRightLamp = this.add.image(1398,800,"Lamp").setScale(0.15);
        this.leftLamp = this.add.image(1020,1300,"Lamp").setScale(0.15);
        this.rightLamp = this.add.image(1370,1300,"Lamp").setScale(0.15);
        this.rightBench = this.add.image(1670,1075,"Bench").setScale(0.15);
        this.leftBench = this.add.image(750,1075,"Bench").setScale(0.15);

        this.enterArcadeText.setVisible(false);

        this.keys = this.input.keyboard.addKeys({
                    up: Phaser.Input.Keyboard.KeyCodes.W,
                    down: Phaser.Input.Keyboard.KeyCodes.S,
                    right: Phaser.Input.Keyboard.KeyCodes.D,
                    left: Phaser.Input.Keyboard.KeyCodes.A
                    });
        this.enterKey = this.input.keyboard.addKey( Phaser.Input.Keyboard.KeyCodes.ENTER );
    }
    update(){

        const oldX = this.player.x;
        const oldY = this.player.y;

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

        if(this.player.x < 0){
            this.player.x = 0;
        }
        if(this.player.x > 3000){
            this.player.x = 3000;
        }

        if(this.player.y < 0){
            this.player.y = 0;
        }
        if(this.player.y > 3000){
            this.player.y = 3000;
        }
        
      const hitBuilding = this.buildingCollision.contains(this.player.x,this.player.y) || this.leftPillarCollision.contains(this.player.x,this.player.y )|| this.rightPillarCollision.contains(this.player.x, this.player.y);
        const nearEntrance =
            this.entranceZone.contains(
                this.player.x,
                this.player.y
            );

        if (hitBuilding && !nearEntrance) {
            this.player.x = oldX;
            this.player.y = oldY;
        }

        if (nearEntrance) {
            this.enterArcadeText.setPosition( this.player.x - 60, this.player.y - 60 ); 
            this.enterArcadeText.setVisible(true);
        }else{
            this.enterArcadeText.setVisible(false);
        }
        if (nearEntrance && Phaser.Input.Keyboard.JustDown( this.enterKey)) {
            this.cameras.main.once(
                "camerafadeoutcomplete",
                () => {
                    this.scene.start(
                        "ArcadeInteriorScene"
                    );
                }
            );
            this.cameras.main.fadeOut(
                500,
                0,
                0,
                0
            );
        }
    }
}
export default OutsideWorldScene;