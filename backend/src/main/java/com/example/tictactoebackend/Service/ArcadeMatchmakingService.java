package com.example.tictactoebackend.Service;

import org.springframework.stereotype.Service;

@Service
public class ArcadeMatchmakingService {

    private String waitingPlayer;

    public String getWaitingPlayer(){
        return waitingPlayer;
    }
    public void setWaitingPlayer(String waitingPlayer){
        this.waitingPlayer = waitingPlayer;
    }
}
