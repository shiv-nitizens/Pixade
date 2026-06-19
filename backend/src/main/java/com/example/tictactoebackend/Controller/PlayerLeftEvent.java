package com.example.tictactoebackend.Controller;

public class PlayerLeftEvent {
    private String playerId;
    public PlayerLeftEvent(String playerId){
        this.playerId = playerId;
    }
    public String getPlayerId(){
        return playerId;
    }
}
