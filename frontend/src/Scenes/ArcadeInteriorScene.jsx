import Phaser from "phaser";
import { useEffect } from "react";
import TickTacToeScene from "./TickTacToe";
import OutsideWorldScene from "./OutsideWorldScene";
import { Client } from "@stomp/stompjs";
import ArcadeMachine from "../assets/image.png";
import floor from "../assets/Floor.png";
import ghost from "../assets/vecteezy_pixel-art-of-a-levitating-white-ghost-with-a-side-view-for_69528640.png"

class ArcadeInteriorScene extends Phaser.Scene {
    constructor() {
        super("ArcadeInteriorScene");
    }
    preload(){
        this.load.image("ArcadeMachine",ArcadeMachine)
        this.load.image("floor",floor)
        this.load.image("ghost",ghost)
    }
    create() {
        this.cameras.main.fadeIn(500,0,0,0);
        console.log(this.playerId)
        const tileSize = 650;

        for(let x = 0; x < this.scale.width; x += tileSize){
            for(let y = 0; y < this.scale.height; y += tileSize){
                this.add.image(x, y, "floor")
                    .setOrigin(0,0)
                    .setDisplaySize(tileSize, tileSize);
            }
        }
        this.player = this.add.image(300,400,"ghost").setScale(0.018);
        this.playerName = this.add.text( this.player.x, this.player.y-30, this.playerId );
        this.arcadeMachines =
        [
            {x: 300, y: 600, game: "TICTACTOE" },
            {x: 600, y: 600, game: "??????????" },
            {x: 900, y: 600, game: "??????????" }
        ];
        this.interactionText = this.add.text(0, 0, "",
            {fontSize: "16px", color: "#ffffff", backgroundColor: "#000000" }
        );
        this.interactionText.setVisible(false);
        this.arcadeMachines.forEach(machine => {
            machine.sprite = this.add.image(machine.x, machine.y, "ArcadeMachine").setScale(0.125);
            machine.label = this.add.text(machine.x, machine.y - 80, machine.game ).setOrigin(0.5);
        });
        this.otherPlayer = {};
        console.log(this.players);
        if (this.players) {
            Object.values(this.players).forEach((player) => {
                if (player.playerId === this.playerId) {
                    return;
                }
                this.otherPlayer[player.playerId] = {
                    rectangle: this.add.image(player.x,player.y,"ghost").setScale(0.025),
                    text: this.add.text(player.x, player.y, player.playerId)
                };
            });
        }
        this.lastSentX = this.player.x;
        this.lastSentY = this.player.y;

        this.client = new Client({
            brokerURL:"ws://localhost:8080/ws"        
        })
        this.client.onConnect=()=>{
            this.client.subscribe(`/topic/worlds/${this.worldId}/players`,(mess)=>{
                const player = JSON.parse(mess.body);
                if(player.playerId === this.playerId){
                    return
                }
                if(!this.otherPlayer[player.playerId]){
                    this.otherPlayer[player.playerId]= {
                        rectangle: this.add.image(player.x,player.y,"ghost").setScale(0.025),
                        text :this.add.text(player.x,player.y,player.playerId)
                    }
                }else{
                    const remotePlayer = this.otherPlayer[player.playerId];

                    remotePlayer.rectangle.x =player.x;
                    remotePlayer.rectangle.y =player.y;

                    remotePlayer.text.x = player.x-50;
                    remotePlayer.text.y = player.y-50;
                }
            });
            this.client.subscribe("/topic/arcade",(mess)=>{
                console.log("subbed to arcade....");
                const game = JSON.parse(mess.body);
                console.log("arcade message: ",game);
                if(this.playerId == game.player1Id || this.playerId == game.player2Id){
                    this.scene.pause();
                    this.scene.launch("TickTacToeScene",{
                        gameId: game.gameId,
                        playerId: this.playerId
                    });
                }
            });
            this.client.subscribe(
                `/topic/worlds/${this.worldId}/player-left`,
                (message) => {
                    const event = JSON.parse(message.body);
                    const player =
                        this.otherPlayer[event.playerId];
                    if(player){
                        player.rectangle.destroy();
                        player.text.destroy();
                        delete this.otherPlayer[event.playerId];
                    }
                }
            );
            this.client.publish({
            destination:`/app/worlds/${this.worldId}/player-move`,
            body:JSON.stringify({
                playerId:this.playerId,
                x:this.player.x,
                y:this.player.y
                })
            });        
        }
        this.client.onWebSocketError = (err) => {
            console.log("WS ERROR", err);
        };

        this.client.onStompError = (frame) => {
            console.log("STOMP ERROR", frame);
        };

        this.client.onDisconnect = () => {
            console.log("disconnected");
        };
        this.client.activate();

        this.keys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            left: Phaser.Input.Keyboard.KeyCodes.A
        });
        this.arcadeInterateKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.ENTER
        );
        window.addEventListener(
            "start-tictactoe",
            (event)=>{
                const { gameId , playerId} = event.detail;
                this.scene.pause();
                this.scene.launch("TickTacToeScene",{gameId , playerId});
            }
        )
    }
    update() {
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
        this.playerName.x = this.player.x-50;
        this.playerName.y = this.player.y-50;

    let hitMachine = false;

    for (const machine of this.arcadeMachines) {

        const machineBounds = machine.sprite.getBounds();

        if (
            this.player.x + 6 > machineBounds.left &&
            this.player.x - 6 < machineBounds.right &&
            this.player.y + 3 > machineBounds.top &&
            this.player.y - 3 < machineBounds.bottom
        ) {
            hitMachine = true;
            break;
        }
    }

    if (hitMachine) {
    this.player.x = oldX;
    this.player.y = oldY;
}
                
        if(this.client.connected && (this.player.x !== this.lastSentX || this.player.y !== this.lastSentY)){
            this.client.publish({
                destination:`/app/worlds/${this.worldId}/player-move`,
                body:JSON.stringify({
                  playerId:this.playerId,
                  x:this.player.x,
                  y:this.player.y  
                })
            })
            this.lastSentX = this.player.x;
            this.lastSentY = this.player.y;
        }
        let nearbyMachine = null;
        for (const machine of this.arcadeMachines) {
            const machineBounds = machine.sprite.getBounds();
            const leftZone = new Phaser.Geom.Rectangle(machineBounds.left - 50, machineBounds.top, 50, machineBounds.height );
            const rightZone = new Phaser.Geom.Rectangle(machineBounds.right, machineBounds.top, 50, machineBounds.height );
            const canInteract =
                leftZone.contains(this.player.x, this.player.y) ||
                rightZone.contains(this.player.x, this.player.y);
            if (canInteract) {
                nearbyMachine = machine;
                break;
            }
        }
        if (nearbyMachine) {
            this.interactionText.setText(`[ENTER] ${nearbyMachine.game}`);
            this.interactionText.setPosition(this.player.x - 50,this.player.y - 80);
            this.interactionText.setVisible(true);
        }else{
            this.interactionText.setVisible(false);
        }
        if (Phaser.Input.Keyboard.JustDown(this.arcadeInterateKey)) {
            let selectedMachine = null;
            for (const machine of this.arcadeMachines) {
                const machineBounds = machine.sprite.getBounds();
                const leftZone = new Phaser.Geom.Rectangle(machineBounds.left - 50, machineBounds.top, 50, machineBounds.height);
                const rightZone = new Phaser.Geom.Rectangle(machineBounds.right, machineBounds.top, 50, machineBounds.height);
                const canInteract =
                    leftZone.contains(this.player.x, this.player.y) ||
                    rightZone.contains(this.player.x, this.player.y);
                if (canInteract) {
                    selectedMachine = machine;
                    break;
                }
            }
            if (selectedMachine && selectedMachine.game === "TICTACTOE" ){
                this.client.publish({
                    destination: "/app/arcade-join",
                    body: JSON.stringify({
                        playerId: this.playerId
                    })
                });
            }else{
                console.log("COMMING SOON....")
            }
            if (selectedMachine) {
                console.log(selectedMachine.game);
            }
        }
    }
}

function World({worldId,playerId,players}) {
    useEffect(() => {

        const outsideWorldScene = new OutsideWorldScene();
        outsideWorldScene.playerId = playerId;
        outsideWorldScene.worldId = worldId;
        outsideWorldScene.players = players;

        const arcadeInteriorScene = new ArcadeInteriorScene();
        arcadeInteriorScene.playerId = playerId;
        arcadeInteriorScene.worldId = worldId; 
        arcadeInteriorScene.players = players;
        const config = {
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            parent: "game-container",
            scene: [
                outsideWorldScene,
                arcadeInteriorScene,
                TickTacToeScene
            ]
        }
        const game = new Phaser.Game(config);
        window.leaveWorld = async () => {
            await fetch("http://localhost:8080/world/leave-world", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                worldId,
                playerId
            })
        });
    game.destroy(true);
    window.location.reload();
};
        return () => {
            game.destroy(true);
        }
    }, []);

    return (<>
        <div style={{position: "fixed",top: "10px",left: "10px",zIndex: 1000,background: "#222",color: "white",padding: "10px",borderRadius: "8px"}}>
                World ID: {worldId}
                <br />
                <button style={{cursor:"pointer"}}
                    onClick={() =>
                        navigator.clipboard.writeText(worldId)
                    }
                >
                    Copy
                </button>
                <button onClick={() => window.leaveWorld()}>
                    Leave World
                </button>
            </div>
        <div id="game-container"></div>
        </>
    );
}
export default World;
