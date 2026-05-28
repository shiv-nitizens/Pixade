import Phaser from "phaser";

class TickTacToeScene extends Phaser.Scene{
    constructor(){
        super("TickTacToeScene");
    }
    async create(data){

        this.cameras.main.setBackgroundColor("#000000")

        const playerId = data.playerId;
        const gameId = data.gameId;

        const res = await fetch(`http://localhost:8080/games/${gameId}`);
        const game = await res.json();
        this.gameState = game;

        const board = game.board;
        const cellSize = 250;
        const startX = (window.innerWidth - (cellSize*3))/2+cellSize/2;
        const startY =(window.innerHeight - (cellSize*3))/2+cellSize/2;

        for(let i = 0 ; i < 3; i++){
            for(let j =  0 ; j < 3 ; j++){
                const index = i*3+j;
                const x = startX+i*cellSize;
                const y = startY+j*cellSize;
                this.add.rectangle(x,y,cellSize,cellSize,0x000000) 
                .setStrokeStyle(4, 0xff0000)

                const symbol = board[index];

                if(symbol !== "_"){
                    this.add
                    .rectangle(
                        x,
                        y,
                        cellSize,
                        cellSize,
                        0x222222
                    )
                    .setStrokeStyle(4, 0xffffff);
                }
            }
        }

        this.EscapeKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.ESC
        )
    }
    update(){
        if(!this.EscapeKey){
            return;
        }
      if(Phaser.Input.Keyboard.JustDown(this.EscapeKey)){
        this.scene.stop();
        this.scene.resume("WorldScene");
      }
    }
}
export default TickTacToeScene;