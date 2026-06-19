package com.example.tictactoebackend.Service;

import com.example.tictactoebackend.Model.PlayerPosition;
import com.example.tictactoebackend.Model.World;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class WorldService {

    HashMap<String, World> Worlds = new HashMap<>();

    public WorldService() {
        World commonWorld = new World();
        commonWorld.setWorldId("COMMON_WORLD");

        Worlds.put(
                "COMMON_WORLD",
                commonWorld
        );
    }

    public World createWorld(String playerId){
        World world = new World();
        String worldId = UUID.randomUUID().toString();
        int x = ThreadLocalRandom.current().nextInt(100,700);
        int y = ThreadLocalRandom.current().nextInt(100,500);

        PlayerPosition playerPosition = new PlayerPosition(playerId,x,y);

        world.setWorldId(worldId);
        world.setHostId(playerId);
        world.addPlayers(playerId,playerPosition);
        Worlds.put(worldId,world);
        return world;
    }
    public World joinWorld(String worldId,String playerId){
        World world = Worlds.get(worldId);
        int x = ThreadLocalRandom.current().nextInt(100,700);
        int y = ThreadLocalRandom.current().nextInt(100,500);

        PlayerPosition playerPosition = new PlayerPosition(playerId,x,y);
        world.addPlayers(playerId,playerPosition);
        return world;
    }

    public World getWorld(String worldId){
        return Worlds.get(worldId);
    }

    public void leaveWorld(String worldId, String playerId) {
        World world = Worlds.get(worldId);
        if(world == null){
            return;
        }
        world.getPlayers().remove(playerId);
    }

}