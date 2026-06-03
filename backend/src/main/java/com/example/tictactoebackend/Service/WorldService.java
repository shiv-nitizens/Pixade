package com.example.tictactoebackend.Service;

import com.example.tictactoebackend.Model.World;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.UUID;

@Service
public class WorldService {

    HashMap<String, World> Worlds = new HashMap<>();

    public World createWorld(String playerId){
        World world = new World();
        String worldId = UUID.randomUUID().toString();
        world.setWorldId(worldId);
        world.setHostId(playerId);
        world.addPlayers(playerId);
        Worlds.put(worldId,world);
        return world;
    }
    public World joinWorld(String worldId,String playerId){
        World world = Worlds.get(worldId);
        world.addPlayers(playerId);
        return world;
    }

    public World getWorld(String worldId){
        return Worlds.get(worldId);
    }

}