package com.example.tictactoebackend.Storage;

import com.example.tictactoebackend.Model.Game;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class GameStorage {

    private Map<String,Game > gameStore = new ConcurrentHashMap<>();

    public void addGame(Game game){
        gameStore.put(game.getGameId(),game);
    }
    public Game getGame(String gameId){
        return gameStore.get(gameId);
    }
    public void removeGame(String gameId){
        gameStore.remove(gameId);
    }

}
