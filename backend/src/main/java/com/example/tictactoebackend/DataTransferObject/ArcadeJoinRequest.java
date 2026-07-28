package com.example.tictactoebackend.DataTransferObject;

import com.example.tictactoebackend.Model.GameType;

public class ArcadeJoinRequest {

    String playerId;
    GameType gameType;
    public GameType getGameType() {
        return gameType;
    }
    public void setGameType(GameType gameType) {
        this.gameType = gameType;
    }
    public String getPlayerId() {
        return playerId;
    }

    public void setPlayerId(String playerId) {
        this.playerId = playerId;
    }
}
