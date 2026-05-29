package com.example.tictactoebackend.DataTransferObject;

public class CreateGameRequest {
    private String playerId;

    public String getPlayerId() {
        return playerId;
    }

    public void setPlayerId(String playerId) {
        this.playerId = playerId;
    }
}
