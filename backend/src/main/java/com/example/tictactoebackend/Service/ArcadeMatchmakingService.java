package com.example.tictactoebackend.Service;

import com.example.tictactoebackend.Model.GameType;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class ArcadeMatchmakingService {

    Map<GameType, String> waitingPlayers = new HashMap<>();
    public String getWaitingPlayer(GameType gameType) {
        return waitingPlayers.get(gameType);
    }
    public void setWaitingPlayer(GameType gameType,String playerId) {
        waitingPlayers.put(gameType, playerId);
    }
    public void clearWaitingPlayer(GameType gameType) {
        waitingPlayers.remove(gameType);
    }
}
