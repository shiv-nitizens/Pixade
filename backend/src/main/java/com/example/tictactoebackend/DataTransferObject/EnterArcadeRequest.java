package com.example.tictactoebackend.DataTransferObject;

public class EnterArcadeRequest {
    String playerId;
    public EnterArcadeRequest() {
    }
    public String getPlayerId() {
        return playerId;
    }
    public void setPlayerId(String playerId) {
        this.playerId = playerId;
    }
}