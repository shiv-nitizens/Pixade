package com.example.tictactoebackend.Model;

public class NeonPlayer {
    String playerId;

    float x;
    float y;
    boolean alive = true;
    String direction;

    public NeonPlayer(String playerId, float x, float y,String direction) {
        this.playerId = playerId;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.alive = true;
    }

    public float getX() {
        return x;
    }

    public void setX(float x) {
        this.x = x;
    }

    public float getY() {
        return y;
    }

    public void setY(float y) {
        this.y = y;
    }

    public String getPlayerId() {
        return playerId;
    }

    public void setPlayerId(String playerId) {
        this.playerId = playerId;
    }
    public boolean isAlive() {
        return alive;
    }

    public void setAlive(boolean alive) {
        this.alive = alive;
    }
    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }
}
