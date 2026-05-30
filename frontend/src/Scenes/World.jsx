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
        this.playerId = localStorage.getItem("playerId");
        this.otherPlayer = {};

        this.client = new Client({
            brokerURL:"ws://localhost:8080/ws"        
        })
        this.client.onConnect=()=>{
            this.client.subscribe("/topic/players",(mess)=>{
                const player = JSON.parse(mess.body);
                if(player.playerId === this.playerId){
                    return
                }
                if(!this.otherPlayer[player.playerId]){
                    this.otherPlayer[player.playerId]= this.add.rectangle(player.x,player.y,50,40,0x0000ff)
                }else{
                    const remotePlayer = this.otherPlayer[player.playerId];

                    remotePlayer.x =player.x;
                    remotePlayer.y =player.y;
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
        this.testKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.P
        )

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
        if(Phaser.Input.Keyboard.JustDown(this.testKey)){
            const payload = {
                playerId: this.playerId,
                x: this.player.x,
                y: this.player.y
            };
            this.client.publish({
                destination: "/app/player-move",
                body: JSON.stringify(payload)
            });
        }
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
        if (Phaser.Input.Keyboard.JustDown(this.arcadeInterateKey)) {
            const x = this.player.x;
            const y = this.player.y;
            if (Math.abs(300 - x) < 30 && Math.abs(400 - y) < 30) {
                window.dispatchEvent(
                    new Event("open-menu")
                );
            }
        }
    }
}

function World() {
    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            parent: "game-container",
            scene: [
                WorldScene,
                TickTacToeScene
            ]
        }
        const game = new Phaser.Game(config);
        return () => {
            game.destroy(true);
        }
    }, []);

    return (
        <div
            id="game-container"
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 1
            }}
        ></div>
    );
}
export default World;
