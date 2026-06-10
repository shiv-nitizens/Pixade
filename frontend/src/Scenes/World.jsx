import Phaser from "phaser";
import { useEffect } from "react";
import TickTacToeScene from "./TickTacToe";
import { Client } from "@stomp/stompjs";
import ArcadeMachine from "../assets/image.png";
import floor from "../assets/Floor.png";
import ghost from "../assets/vecteezy_pixel-art-of-a-levitating-white-ghost-with-a-side-view-for_69528640.png"

class WorldScene extends Phaser.Scene {
    constructor() {
        super("WorldScene");
    }
    preload(){
        this.load.image("ArcadeMachine",ArcadeMachine)
        this.load.image("floor",floor)
        this.load.image("ghost",ghost)
    }
    create() {
        const tileSize = 650;

        for(let x = 0; x < this.scale.width; x += tileSize){
            for(let y = 0; y < this.scale.height; y += tileSize){
                this.add.image(x, y, "floor")
                    .setOrigin(0,0)
                    .setDisplaySize(tileSize, tileSize);
            }
        }
        this.player = this.add.image(300,400,"ghost").setScale(0.025);
        this.arcadeMachine = this.add.image(400,600,"ArcadeMachine").setScale(0.125);
        this.otherPlayer = {};
        console.log(this.players);
        if (this.players) {
            Object.values(this.players).forEach((player) => {

                if (player.playerId === this.playerId) {
                    return;
                }

                this.otherPlayer[player.playerId] = {
                    rectangle: this.add.rectangle(
                        player.x,
                        player.y,
                        50,
                        40,
                        0x0000ff
                    ),
                    text: this.add.text(
                        player.x,
                        player.y,
                        player.playerId
                    )
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
                        rectangle :this.add.rectangle(player.x,player.y,50,40,0x0000ff),
                        text :this.add.text(player.x,player.y,player.playerId,0xff0000)
                    }
                }else{
                    const remotePlayer = this.otherPlayer[player.playerId];

                    remotePlayer.rectangle.x =player.x;
                    remotePlayer.rectangle.y =player.y;

                    remotePlayer.text.x = player.x-30;
                    remotePlayer.text.y = player.y+40;
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

    const machineBounds = this.arcadeMachine.getBounds();

    const hitMachine =
        this.player.x + 6 > machineBounds.left &&
        this.player.x - 6 < machineBounds.right &&
        this.player.y + 3 > machineBounds.top &&
        this.player.y - 3 < machineBounds.bottom;

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
        if (Phaser.Input.Keyboard.JustDown(this.arcadeInterateKey)) {

            const machineBounds = this.arcadeMachine.getBounds();

            const leftZone = new Phaser.Geom.Rectangle(
                machineBounds.left - 50,
                machineBounds.top,
                50,
                machineBounds.height
            );

            const rightZone = new Phaser.Geom.Rectangle(
                machineBounds.right,
                machineBounds.top,
                50,
                machineBounds.height
            );

            const canInteract =
                leftZone.contains(this.player.x, this.player.y) ||
                rightZone.contains(this.player.x, this.player.y);
            console.log("Can Interact",canInteract);

            if (canInteract) {
                this.client.publish({
                    destination:"/app/arcade-join",
                    body: JSON.stringify({
                        playerId: this.playerId
                    })
                });
            }
        }
    }
}

function World({worldId,playerId,players}) {
    useEffect(() => {
        const worldScene = new WorldScene();
        worldScene.playerId = playerId;
        worldScene.worldId = worldId; 
        worldScene.players = players;
        const config = {
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            parent: "game-container",
            scene: [
                worldScene,
                TickTacToeScene
            ]
        }
        const game = new Phaser.Game(config);
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
            </div>
        <div id="game-container"></div>
        </>
    );
}
export default World;
