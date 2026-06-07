import Phaser from "phaser";
import { useEffect } from "react";
import TickTacToeScene from "./TickTacToe";
import { Client } from "@stomp/stompjs";

class WorldScene extends Phaser.Scene {
    constructor() {
        super("WorldScene");
    }
    create() {
        this.player = this.add.rectangle(400, 300, 50, 40, 0x00ff00);
        this.arcadeMachine = this.add.rectangle(300, 400, 40, 30, 0xff0000);
        this.otherPlayer = {};
        this.lastSeenX = this.player.x;
        this.lastSeenY = this.player.y;

        this.client = new Client({
            brokerURL:"ws://localhost:8080/ws"        
        })
        this.client.onConnect=()=>{
            this.client.publish({
            destination:`/app/worlds/${this.worldId}/player-move`,
            body:JSON.stringify({
                playerId:this.playerId,
                x:this.player.x,
                y:this.player.y
            })
        });
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
            })
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
            const x = this.player.x;
            const y = this.player.y;
            if (Math.abs(300 - x) < 30 && Math.abs(400 - y) < 30) {
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

function World({worldId,playerId}) {
    useEffect(() => {
        const worldScene = new WorldScene();
        worldScene.playerId = playerId;
        worldScene.worldId = worldId; 
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
