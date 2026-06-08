package com.example.tictactoebackend.DataTransferObject;

import com.example.tictactoebackend.Model.PlayerPosition;

import java.util.concurrent.ThreadLocalRandom;

public class CreateWorldRequest {
    String playerId;
    int x = ThreadLocalRandom.current().nextInt(100,700);
    int y = ThreadLocalRandom.current().nextInt(100,500) ;
    PlayerPosition playerPosition = new PlayerPosition(playerId,x,y);

    public String getPlayerId() {
        return playerId;
    }

    public int getX() {
        return x;
    }

    public PlayerPosition getPlayerPosition() {
        return playerPosition;
    }

    public int getY() {
        return y;
    }
}
