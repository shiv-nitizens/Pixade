package com.example.tictactoebackend.Service;

import com.example.tictactoebackend.Model.NeonGame;
import com.example.tictactoebackend.Model.NeonPlayer;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class NeonGameService {
    private final Map<String, NeonGame> games = new HashMap<>();
    public NeonGame createGame(String playerId) {
        NeonGame game = new NeonGame();
        String gameId = UUID.randomUUID().toString();
        game.setGameId(gameId);
        game.getPlayers().put(
                playerId,
                new NeonPlayer(
                        playerId,
                        100,
                        100,
                        "RIGHT"
                )
        );        games.put(gameId, game);
        return game;
    }
    public NeonGame joinGame(String gameId,String playerId){
        NeonGame game = games.get(gameId);
        if (game == null) {
            return null;
        }
        game.getPlayers().put(
                playerId,
                new NeonPlayer(
                        playerId,
                        700,
                        500,
                        "LEFT"
                )
        );        return game;
    }

    public NeonGame getGame(String gameId) {
        return games.get(gameId);
    }
    public void markPlayerDead(String gameId, String playerId) {

        NeonGame game = games.get(gameId);

        if (game == null) {
            return;
        }

        NeonPlayer player = game.getPlayers().get(playerId);

        if (player != null) {
            player.setAlive(false);
        }
    }
    public String getWinner(String gameId) {

        NeonGame game = games.get(gameId);

        if (game == null) {
            return null;
        }

        int aliveCount = 0;
        String winner = null;

        for (NeonPlayer player : game.getPlayers().values()) {

            if (player.isAlive()) {
                aliveCount++;
                winner = player.getPlayerId();
            }
        }

        return aliveCount == 1 ? winner : null;
    }
}