import { Client } from "@stomp/stompjs";
import Phaser from "phaser";
import ArcadeBuilding from "../assets/ArcadeBuilding.png"
import PlayerSheet from "../assets/spritesheet.png"
import Tree from "../assets/Tree.png"
import Floor from "../assets/OutsideFloor.png"
import FlowerPot from "../assets/FlowerPot.png"
import Fountain from "../assets/Fountain.png";
import Lamp from "../assets/Lamp.png";
import Base from "../assets/Base1.png";
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
import Flag from "../assets/Flag.png";
import Bin2 from "../assets/Bin2.png";
import BottomLeftSign from "../assets/bottomLeftSign.png";
import Boulder from "../assets/Boulder.png";
import Stones from "../assets/Stones.png";
import Flower from "../assets/Flower.png";
import Statue2 from "../assets/Statue2.png";
import IdleDown from "../assets/down-idle.png"
import WalkDown1 from "../assets/down-one.png"
import WalkDown2 from "../assets/down-two.png"
import WalkDown3 from "../assets/down-three.png"
import IdleLeft from "../assets/left-idle.png";
import WalkLeft1 from "../assets/left-one.png";
import WalkLeft2 from "../assets/left-two.png";
import WalkLeft3 from "../assets/left-three.png";
import IdleUp from "../assets/up-idle.png";
import WalkUp1 from "../assets/up-one.png";
import WalkUp2 from "../assets/up-two.png";
import WalkUp3 from "../assets/up-three.png";
import IdleRight from "../assets/right-idle.png";
import WalkRight1 from "../assets/right-one.png";
import WalkRight2 from "../assets/right-two.png";
import WalkRight3 from "../assets/right-three.png";
import Player from "../entities/player";

class OutsideWorldScene extends Phaser.Scene{
    constructor(){
        super("OutsideWorldScene")
    }
    preload(){
        this.load.image("ArcadeBuilding",ArcadeBuilding);
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
        this.load.image("Flag",Flag);
        this.load.image("Bin2",Bin2);
        this.load.image("BottomLeftSign",BottomLeftSign);
        this.load.image("Boulder",Boulder);
        this.load.image("Stones",Stones);
        this.load.image("Flower",Flower);
        this.load.image("Statue2",Statue2);
        this.load.spritesheet("player", PlayerSheet, { frameWidth: 256,frameHeight: 256 });
        this.load.image("idle-down", IdleDown);
        this.load.image("walk-down-1", WalkDown1);
        this.load.image("walk-down-2", WalkDown2);
        this.load.image("walk-down-3", WalkDown3);
        this.load.image("idle-left", IdleLeft);
        this.load.image("walk-left-1", WalkLeft1);
        this.load.image("walk-left-2", WalkLeft2);
        this.load.image("walk-left-3", WalkLeft3);
        this.load.image("idle-up", IdleUp);
        this.load.image("walk-up-1", WalkUp1);
        this.load.image("walk-up-2", WalkUp2);
        this.load.image("walk-up-3", WalkUp3);
        this.load.image("idle-right", IdleRight);
        this.load.image("walk-right-1", WalkRight1);
        this.load.image("walk-right-2", WalkRight2);
        this.load.image("walk-right-3", WalkRight3);
                
    }
    create(){
        this.add.rectangle(0,0,3000,3000,0x3cb043).setOrigin(0);

        this.base = this.add.image(0,0,"Base").setOrigin(0).setScale(1.8);
        this.Pavement = this.add.image(1373,1000,"Pavement").setScale(0.7)
        this.ArcadeBuilding = this.add.image(1375,420,"ArcadeBuilding").setScale(0.5);
        this.leftPot = this.add.image(1160,600,"FlowerPot").setScale(0.1);
        this.righPot = this.add.image(1590,600,"FlowerPot").setScale(0.1);

        this.bottomLeftSign = this.add.image(420 , 1250,"BottomLeftSign").setScale(0.125);
        this.boulder = this.add.image(395,255,"Boulder").setScale(0.1);
        this.stones = this.add.image(2020,120,"Stones").setScale(0.12);

        this.shop = this.add.image(2150,650, "Shop").setScale(0.37);
        this.FlowerPot2 = this.add.image(2260,770,"FlowerPot2").setScale(0.35);
        this.Bin = this.add.image(2350,770,"Bin").setScale(0.13);
        this.MartSign = this.add.image(2040,770,"MartSign").setScale(0.085);

        this.coustumeStore = this.add.image(630, 635, "CostumeStore").setScale(0.38);
        this.Statue = this.add.image(530,765,"Statue").setScale(0.07);
        this.ClothSign = this.add.image(735,765,"ClothSign").setScale(0.08);
        this.bin2 = this.add.image(830,730,"Bin2").setScale(0.13);

        const bounds = this.ArcadeBuilding.getBounds();
        this.buildingCollision = new Phaser.Geom.Rectangle(1340,180,370,350);
        this.leftPillarCollision =new Phaser.Geom.Rectangle(1440,480,35,80);
        this.rightPillarCollision =new Phaser.Geom.Rectangle(1580,480,35,80);
        this.entranceZone = new Phaser.Geom.Rectangle(1480,510,100,60);

        this.player = new Player(this);
        this.otherPlayers = {};
        this.lastSentX = this.player.sprite.x;
        this.lastSentY = this.player.sprite.y;
        this.lastSentMoving = false;
        this.client = new Client({
            brokerURL: "ws://localhost:8080/ws"
        });

        this.anims.create({
            key: "walk-down",
            frames: [
                { key: "walk-down-1" },
                { key: "walk-down-2" },
                { key: "walk-down-3" }
            ],
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: "walk-left",
            frames: [
                { key: "walk-left-1" },
                { key: "walk-left-2" },
                { key: "walk-left-3" }
            ],
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: "walk-up",
            frames: [
                { key: "walk-up-1" },
                { key: "walk-up-2" },
                { key: "walk-up-3" }
            ],
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: "walk-right",
            frames: [
                { key: "walk-right-1" },
                { key: "walk-right-2" },
                { key: "walk-right-3" }
            ],
            frameRate: 5,
            repeat: -1
        });
        this.lastDirection = "down";

        this.cameras.main.startFollow(this.player.sprite,true,0.1,0.1);
        this.cameras.main.setBounds(0,0,2790,1790);
        this.enterArcadeText = this.add.text( 0,0, "[ENTER] Enter Arcade",{ fontSize: "16px",color: "#ffffff",backgroundColor: "#000000"});    

        this.leftFlowerPot = this.add.image(940,930,"FlowerPot3").setScale(0.13);
        this.flower = this.add.image(835,1100,"Flower").setScale(0.08);
        this.rightFlowerPot = this.add.image(1850,930,"FlowerPot3").setScale(0.13);
        
        this.statue2 = this.add.image(550,1100,"Statue2").setScale(0.15);

        this.rightFlag = this.add.image(1500,800,"Flag").setScale(0.105,0.08);
        this.leftFlag = this.add.image(1240,800,"Flag").setScale(0.105,0.08);
        this.fountain = this.add.image(1375,955,"Fountain").setScale(0.25);
        this.rightBench = this.add.image(1848,1120,"Bench").setScale(0.15);
        this.leftBench = this.add.image(938,1120,"Bench").setScale(0.17);

        this.enterArcadeText.setVisible(false);

        this.keys = this.input.keyboard.addKeys({
                    up: Phaser.Input.Keyboard.KeyCodes.W,
                    down: Phaser.Input.Keyboard.KeyCodes.S,
                    right: Phaser.Input.Keyboard.KeyCodes.D,
                    left: Phaser.Input.Keyboard.KeyCodes.A
                    });
        this.enterKey = this.input.keyboard.addKey( Phaser.Input.Keyboard.KeyCodes.ENTER );
        this.darkness = this.add.rectangle(0,0,2790,1790,0x000000);
        this.darkness.setOrigin(0,0);
        this.darkness.setAlpha(0.4);
        this.darkness.setDepth(100);
        this.player.sprite.setDepth(10);


        this.leftLamp = this.add.image(1150,1300,"Lamp").setScale(0.18);
        this.rightLamp = this.add.image(1580,1300,"Lamp").setScale(0.18);

        this.topRightLamp = this.add.image(1870,210,"Lamp").setScale(0.18);
        this.topLeftLamp = this.add.image(925,210,"Lamp").setScale(0.18);
        this.bottomLeftLamp = this.add.image(170,1120,"Lamp").setScale(0.18);
        this.bottonRightLamp = this.add.image(2550,1120,"Lamp").setScale(0.18);


        Object.values(this.players).forEach(player => {

        if(player.playerId === this.playerId){
            return;
        }
        const sprite = this.add.sprite(
            player.x,
            player.y,
            "idle-down"
        );
        sprite.setScale(0.10);
        sprite.setDepth(10);
        this.otherPlayers[player.playerId] = sprite;
        this.children.bringToTop(this.darkness);
        });

        this.client.onConnect = () => {
        this.client.subscribe(
            `/topic/worlds/${this.worldId}/players`,
            (message) => {

                const player = JSON.parse(message.body);
                if (player.playerId === this.playerId) {
                    return;
                }
                if (!this.otherPlayers[player.playerId]) {
                const sprite = this.add.sprite(player.x,player.y,"idle-down");
                sprite.setScale(0.10);
                sprite.setDepth(10);

                this.otherPlayers[player.playerId] = sprite;
                this.children.bringToTop(this.darkness);
            }else{
               const sprite = this.otherPlayers[player.playerId];

            sprite.x = player.x;
            sprite.y = player.y;

            if (player.moving) {
                sprite.anims.play(
                    `walk-${player.direction}`,
                    true
                );
            }else{
                sprite.anims.stop();
                sprite.setTexture(
                    `idle-${player.direction}`
                );
            }}});

                this.client.subscribe(
                `/topic/worlds/${this.worldId}/player-left`,
                (message) => {
                    const event = JSON.parse(message.body);
                    const sprite = this.otherPlayers[event.playerId];
                    if (sprite) {
                        sprite.destroy();
                        delete this.otherPlayers[event.playerId];
                    }});

                this.client.publish({
                    destination: `/app/worlds/${this.worldId}/player-move`,
                    body: JSON.stringify({
                playerId: this.playerId,
                x: this.player.sprite.x,
                y: this.player.sprite.y,
                direction: "down",
                moving: false
            })});
            };

            this.client.onWebSocketError = console.error;
            this.client.onStompError = console.error;

            this.darkness.setOrigin(0, 0);
            this.darkness.setAlpha(0.4);
            this.client.activate();
    }
    update(){
        
        const oldX = this.player.sprite.x;
        const oldY = this.player.sprite.y;

        const speed = 1.5;
        let moving = false;

        if (this.keys.down.isDown) {
            this.player.sprite.y += speed;
            this.player.sprite.anims.play("walk-down", true);
            this.lastDirection = "down";
            moving = true;
        }else if (this.keys.left.isDown) {
            this.player.sprite.x -= speed;
            this.player.sprite.anims.play("walk-left", true);
            this.lastDirection = "left";
            moving = true;
        }else if (this.keys.up.isDown) {
            this.player.sprite.y -= speed;
            this.player.sprite.anims.play("walk-up", true);
            this.lastDirection = "up";
            moving = true;
        }else if (this.keys.right.isDown) {
            this.player.sprite.x += speed;
            this.player.sprite.anims.play("walk-right", true);
            this.lastDirection = "right";
            moving = true;
        }

        if (!moving) {
            this.player.sprite.anims.stop();
            switch (this.lastDirection) {
                case "down":
                    this.player.sprite.setTexture("idle-down");
                    break;
                case "left":
                    this.player.sprite.setTexture("idle-left");
                    break;
                case "up":
                    this.player.sprite.setTexture("idle-up");
                    break;
                case "right":
                    this.player.sprite.setTexture("idle-right");
                    break;
            }
        }
        if(this.player.sprite.x < 0){
            this.player.sprite.x = 0;
        }
        if(this.player.sprite.x > 2790){
            this.player.sprite.x = 2790;
        }
        if(this.player.sprite.y < 0){
            this.player.sprite.y = 0;
        }
        if(this.player.sprite.y > 1790){
            this.player.sprite.y = 1790;
        }
        
      const hitBuilding = this.buildingCollision.contains(this.player.sprite.x,this.player.sprite.y) || this.leftPillarCollision.contains(this.player.sprite.x,this.player.sprite.y )|| this.rightPillarCollision.contains(this.player.sprite.x, this.player.sprite.y);
        const nearEntrance =
            this.entranceZone.contains(
                this.player.sprite.x,
                this.player.sprite.y
            );

        if (hitBuilding && !nearEntrance) {
            this.player.sprite.x = oldX;
            this.player.sprite.y = oldY;
        }

        if (nearEntrance) {
            this.enterArcadeText.setPosition( this.player.sprite.x - 60, this.player.sprite.y - 60 ); 
            this.enterArcadeText.setVisible(true);
        }else{
            this.enterArcadeText.setVisible(false);
        }
        if (nearEntrance && Phaser.Input.Keyboard.JustDown( this.enterKey)) {
            this.cameras.main.once(
                "camerafadeoutcomplete",
                ()=>{
                    this.scene.start(
                        "ArcadeInteriorScene"
                    );
                }
            );
            this.cameras.main.fadeOut(500,0,0,0);
        }
            if (this.client.connected && (this.player.sprite.x !== this.lastSentX || this.player.sprite.y !== this.lastSentY || moving !== this.lastSentMoving)){
            this.client.publish({
            destination: `/app/worlds/${this.worldId}/player-move`,
            body: JSON.stringify({
                playerId: this.playerId,
                x: this.player.sprite.x,
                y: this.player.sprite.y,
                direction: this.lastDirection,
                moving: moving
            })
        });
        this.lastSentX = this.player.sprite.x;
        this.lastSentY = this.player.sprite.y;
        this.lastSentMoving = moving;
        }
    }
}
export default OutsideWorldScene;