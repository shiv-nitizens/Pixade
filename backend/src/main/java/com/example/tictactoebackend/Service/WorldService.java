package com.example.tictactoebackend.Service;

import com.example.tictactoebackend.Model.PlayerPosition;
import com.example.tictactoebackend.Model.World;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class WorldService {

    HashMap<String, World> worlds = new HashMap<>();
    public WorldService() {
        World commonWorld = new World();
        commonWorld.setWorldId("COMMON_WORLD");
        worlds.put("COMMON_WORLD", commonWorld);
    }
    public World createWorld(String playerId) {
        World world = new World();
        String worldId = UUID.randomUUID().toString();
        int x = ThreadLocalRandom.current().nextInt(100, 700);
        int y = ThreadLocalRandom.current().nextInt(100, 500);
        PlayerPosition playerPosition = new PlayerPosition(playerId, x, y);

        world.setWorldId(worldId);
        world.setHostId(playerId);

        world.addOutsidePlayer(playerId, playerPosition);
        worlds.put(worldId, world);
        return world;
    }

    public World joinWorld(String worldId, String playerId) {
        World world = worlds.get(worldId);
        if (world == null) {
            return null;
        }
        int x = ThreadLocalRandom.current().nextInt(100, 700);
        int y = ThreadLocalRandom.current().nextInt(100, 500);
        PlayerPosition playerPosition = new PlayerPosition(playerId, x, y);
        world.addOutsidePlayer(playerId, playerPosition);
        return world;
    }
    public World getWorld(String worldId) {
        return worlds.get(worldId);
    }
    public void leaveWorld(String worldId, String playerId) {
        World world = worlds.get(worldId);
        if (world == null) {
            return;
        }
        world.removeOutsidePlayer(playerId);
        world.removeArcadePlayer(playerId);
    }
    public void enterArcade(String worldId, String playerId) {
        World world = worlds.get(worldId);
        if (world == null) {
            return;
        }
        PlayerPosition player = world.getOutsidePlayers().remove(playerId);
        if (player != null) {
            world.getArcadePlayers().put(playerId, player);
        }
    }

    public void leaveArcade(String worldId, String playerId) {
        World world = worlds.get(worldId);
        if (world == null) {
            return;
        }
        PlayerPosition player =
                world.getArcadePlayers().remove(playerId);
        if (player != null) {
            world.getOutsidePlayers().put(playerId, player);
        }
    }
}