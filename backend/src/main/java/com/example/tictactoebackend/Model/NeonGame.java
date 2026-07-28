package com.example.tictactoebackend.Model;

import java.util.HashMap;
import java.util.Map;

public class NeonGame {
    String gameId;

    Map<String, NeonPlayer> players = new HashMap<>();

    public String getGameId() {
        return gameId;
    }

    public void setGameId(String gameId) {
        this.gameId = gameId;
    }

    public Map<String, NeonPlayer> getPlayers() {
        return players;
    }

    public void setPlayers(Map<String, NeonPlayer> players) {
        this.players = players;
    }
}
