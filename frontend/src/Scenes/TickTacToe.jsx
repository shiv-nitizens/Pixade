import Phaser from "phaser";
import { Client } from "@stomp/stompjs";

class TickTacToeScene extends Phaser.Scene{
    constructor(){
        super("TickTacToeScene");
    }
    renderBoard() {
        this.cells = [];
    for (const obj of this.boardObjects) {
        obj.destroy();
    }
    this.boardObjects = [];
    const board = this.gameState.board;
    const cellSize = 250;
    const startX =
        (window.innerWidth - cellSize * 3) / 2;
    const startY = 150;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;
            const x = startX + j * cellSize;
            const y = startY + i * cellSize;
            this.cells.push({
                x,y,index
            })
            const cell = this.add.rectangle(
                x,
                y,
                cellSize,
                cellSize,
                0x000000
            );
            cell.setStrokeStyle(
                4,
                0xff0000
            );
            this.boardObjects.push(cell);
            const symbol =
                board[index];
            if (symbol !== "_") {
                const symbolCell =
                    this.add.rectangle(
                        x,
                        y,
                        cellSize,
                        cellSize,
                        0x222222
                    );
                if(symbol === "X"){
                    symbolCell
                        .setStrokeStyle(4, 0x00ff00)
                        .setDepth(1);
                }
                else if(symbol === "O"){
                    symbolCell
                        .setStrokeStyle(4, 0x0000ff)
                        .setDepth(1);
                }
                this.boardObjects.push(
                    symbolCell
                );
            }
        }
    }
}
    async create(data){
        
        this.cameras.main.setBackgroundColor("#000000")

        this.playerId = data.playerId;
        this.gameId = data.gameId;
        this.player  = this.add.rectangle(400, 300, 50, 40, 0x00ff00);
        this.player.setDepth(10);
        this.client = new Client({
            brokerURL:"ws://localhost:8080/ws"        
        })
        this.client.onConnect=()=>{
            console.log("connected to ws");
            this.client.subscribe(
                `/topic/games/${this.gameId}`,
                (mess)=>{
                    const game = JSON.parse(mess.body)
                    this.gameState = game;
                    this.renderBoard();
                    console.log(
                        "board updated"
                        ,game
                    )
                }
            )
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
        this.interactKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.ENTER
        )
        this.testKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.P
        )

        const res = await fetch(`http://localhost:8080/games/${this.gameId}`);

        this.makeMove = async (position)=> 
            await fetch(`http://localhost:8080/games/${this.gameId}/move`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                playerId: this.playerId,
                position: position
            })
        });
        this.handleMove = async (position) => {
            const res = await this.makeMove(position);
            if (!res.ok) {
                console.log("Move failed");
                return;
            }
            this.scene.restart({
                gameId: this.gameId,
                playerId: this.playerId
            });
        };

        const game = await res.json();
        this.gameState = game;
        this.boardObjects = [];
        this.renderBoard();
        this.gameState = game;

        this.EscapeKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.ESC
        )
    }
    update(){
         const speed = 3;
        if(!this.keys || !this.EscapeKey || !this.interactKey || !this.testKey){
            return;
        }
        if(Phaser.Input.Keyboard.JustDown(this.testKey)){
            this.client.publish({
                destination:"app/player-move",
                body:JSON.stringify({
                  playerId:this.playerId,
                  x:this.player.x,
                  y:this.player.y  
                })
            })
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
        
        if(Phaser.Input.Keyboard.JustDown(this.interactKey)){
            for(const cell of this.cells){
                if(Math.abs(this.player.x - cell.x)<95 && Math.abs(this.player.y - cell.y)<95){
                    console.log(
                        "game:" +this.gameId + "playerId"+ this.playerId +"index"+ cell.index
                    );
                   this.handleMove(cell.index);
                }
            }
        }

        if(Phaser.Input.Keyboard.JustDown(this.EscapeKey)){
            this.scene.stop();
            this.scene.resume("WorldScene");
      }
    }
}
export default TickTacToeScene;