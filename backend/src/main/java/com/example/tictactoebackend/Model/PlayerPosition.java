package com.example.tictactoebackend.Model;

public class PlayerPosition {
    String playerId;
    float x;
    float y;
    String direction;
    private boolean moving;
    public PlayerPosition(){}
    public float getX() {
        return x;
    }
    public void setX(float x) {
        this.x = x;
    }
    public String getPlayerId() {
        return playerId;
    }
    public void setPlayerId(String playerId) {
        this.playerId = playerId;
    }
    public float getY() {
        return y;
    }
    public void setY(float y) {
        this.y = y;
    }
    public PlayerPosition(String playerId, int x, int y){
        this.playerId = playerId;
        this.x = x;
        this.y = y;
        this.direction = "down";
    }
    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }
    public boolean isMoving() {
        return moving;
    }

    public void setMoving(boolean moving) {
        this.moving = moving;
    }
}
