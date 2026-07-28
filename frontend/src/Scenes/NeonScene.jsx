import Phaser from "phaser";
import { Client } from "@stomp/stompjs";

class NeonScene extends Phaser.Scene {

    constructor() {
        super("NeonScene");
    }

    create(data) {

        this.playerId = data.playerId;
        this.game = data.game;
        this.gameId = this.game.gameId;
        this.gameStarted = false;
        this.direction = "RIGHT";
        this.speed = 3;

        this.alive = true;

        this.trail = this.add.graphics();
        this.trail.lineStyle(6,0x00ff00);

        this.trailPoints = [];

        this.cameras.main.setBackgroundColor("#111111");

        this.add.text(250,30,"NEON TRAILS",
            {
                fontSize: "36px",
                color: "#00ffcc"
            }
        );

       const me = this.game.players[this.playerId];

        this.player = this.add.rectangle(me.x,me.y,40,40,0x00ff00);
        this.direction = me.direction;

        this.otherPlayers = {};

        this.lastSentX = this.player.x;
        this.lastSentY = this.player.y;

        this.client = new Client({
            brokerURL: "ws://localhost:8080/ws"
        });

        this.client.onConnect = () => {
            console.log("Connected to Neon");
            this.client.publish({
                destination: `/app/neon/${this.gameId}/player-move`,
                body: JSON.stringify({
                    playerId: this.playerId,
                    x: this.player.x,
                    y: this.player.y
                })
            });

        this.client.subscribe(
            `/topic/neon/${this.gameId}/winner`,
            (message) => {
                const winner = message.body;
                this.alive = false;
                const text = winner === this.playerId ? "YOU WIN!" : "YOU LOSE!";
                this.add.text(
                    this.scale.width / 2,
                    this.scale.height / 2 - 80,
                    text,
                    {
                        fontSize: "42px",
                        color: "#00ff00"
                    }
                ).setOrigin(0.5);
                this.time.delayedCall(3000, () => {
                    if (this.client) {
                        this.client.deactivate();
                    }
                    this.scene.stop("NeonScene");
                    this.scene.resume("ArcadeInteriorScene");
                });
            }
        );
            this.client.subscribe(
                `/topic/neon/${this.gameId}/players`,
                (message) => {
                    const player = JSON.parse(message.body);
                    if (player.playerId === this.playerId) {
                        return;
                    }
                   if (!this.otherPlayers[player.playerId]) {
                        const trail = this.add.graphics();
                        trail.lineStyle(6, 0xff0000);
                        this.otherPlayers[player.playerId] = {
                        rectangle: this.add.rectangle(player.x,player.y,40,40,0xff0000),
                        trail: trail,
                        lastX: player.x,
                        lastY: player.y,
                        trailPoints: []
                    };
                    } else {
                        const remote = this.otherPlayers[player.playerId];
                        remote.trail.lineBetween(
                            remote.lastX,
                            remote.lastY,
                            player.x,
                            player.y
                        );
                        remote.trailPoints.push({
                        x: player.x,
                        y: player.y
                    });
                        remote.lastX = player.x;
                        remote.lastY = player.y;
                        remote.rectangle.x = player.x;
                        remote.rectangle.y = player.y;
                    }   
                }
            );
        };
        this.client.activate();
        this.keys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        this.startCountdown();
    }
    update() {
        if (!this.alive || !this.gameStarted) {
            return;
        }
        const oldX = this.player.x;
        const oldY = this.player.y;
        if (!this.keys) return;
        if (Phaser.Input.Keyboard.JustDown(this.keys.up)) {
            this.direction = "UP";
        }
        if (Phaser.Input.Keyboard.JustDown(this.keys.down)) {
            this.direction = "DOWN";
        }
        if (Phaser.Input.Keyboard.JustDown(this.keys.left)) {
            this.direction = "LEFT";
        }
        if (Phaser.Input.Keyboard.JustDown(this.keys.right)) {
            this.direction = "RIGHT";
        }
        switch (this.direction) {
            case "UP":
                this.player.y -= this.speed;
                break;
            case "DOWN":
                this.player.y += this.speed;
                break;
            case "LEFT":
                this.player.x -= this.speed;
                break;
            case "RIGHT":
                this.player.x += this.speed;
                break;
        }
        this.checkTrailCollision();
        this.checkEnemyTrailCollision();

        this.trail.lineBetween(
            oldX,
            oldY,
            this.player.x,
            this.player.y
        );
        this.trailPoints.push({
            x: this.player.x,
            y: this.player.y
        });
        const width = this.scale.width;
        const height = this.scale.height;
       if ( this.player.x < 0 || this.player.x > width || this.player.y < 0 || this.player.y > height) {
            this.die();
            return;
        }
        if ( this.client && this.client.connected && ( this.player.x !== this.lastSentX || this.player.y !== this.lastSentY)) {
            this.client.publish({
                destination: `/app/neon/${this.gameId}/player-move`,
                body: JSON.stringify({
                    playerId: this.playerId,
                    x: this.player.x,
                    y: this.player.y
                })
            });
            this.lastSentX = this.player.x;
            this.lastSentY = this.player.y;
        }
    }
    checkTrailCollision() {
    for ( let i = 0; i < this.trailPoints.length - 10;i++) {
        const point = this.trailPoints[i];
        const distance =
            Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                point.x,
                point.y
            );
        if (distance < 8) {
            this.die();
            return;
        }
    }
}
checkEnemyTrailCollision() {
    for (const id in this.otherPlayers) {
        const remote = this.otherPlayers[id];
        for (const point of remote.trailPoints) {
            const distance = Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                point.x,
                point.y
            );
            if (distance < 8) {
                this.die();
                return;
            }
        }
    }
}

die() {
    if (!this.alive) {
        return;
    }
    this.alive = false;
    this.player.setFillStyle(0x555555);
    if (this.client.connected) {
        this.client.publish({
            destination: `/app/neon/${this.gameId}/player-died`,
            body: JSON.stringify({
                playerId: this.playerId
            })
        });
    }
}
startCountdown() {
    let count = 3;
    const text = this.add.text(
        this.scale.width / 2,
        this.scale.height / 2,
        count,
        {
            fontSize: "80px",
            color: "#ffffff"
        }
    ).setOrigin(0.5);
    const timer = this.time.addEvent({
        delay: 1000,
        repeat: 3,
        callback: () => {
            count--;
            if (count > 0) {
                text.setText(count);
            } else if (count === 0) {
                text.setText("GO!");
            } else {
                text.destroy();
                this.gameStarted = true;
                timer.remove();
            }
        }
    });
}
}

export default NeonScene;