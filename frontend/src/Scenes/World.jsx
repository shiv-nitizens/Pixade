import Phaser from "phaser";
import { useEffect } from "react";
import TickTacToeScene from "./TickTacToe";

class WorldScene extends Phaser.Scene {
    constructor() {
        super("WorldScene");
    }
    create() {
        this.player = this.add.rectangle(400, 300, 50, 40, 0x00ff00);
        this.arcadeMachine = this.add.rectangle(300, 400, 40, 30, 0xff0000)

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
