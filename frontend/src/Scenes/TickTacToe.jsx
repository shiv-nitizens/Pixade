import Phaser from "phaser";

class TickTacToeScene extends Phaser.Scene{
    constructor(){
        super("TickTacToeScene");
    }
    create(){
        this.add.text(
            400,
            300,
            "Tic Tac Toe",
            {
                fontSize: "40px",
                color: "#ffffff"
            }
        );
        this.EscapeKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.ESC
        )
    }
    update(){
      
    }
}
export default TickTacToeScene;