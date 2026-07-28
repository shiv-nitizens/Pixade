package com.example.tictactoebackend.Controller;

public class PlayerLeftEvent {
    String playerId;
    public PlayerLeftEvent(String playerId){
        this.playerId = playerId;
    }
    public String getPlayerId(){
        return playerId;
    }
}
