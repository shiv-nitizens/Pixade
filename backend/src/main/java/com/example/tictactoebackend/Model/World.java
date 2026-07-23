package com.example.tictactoebackend.Model;

import java.util.HashMap;
import java.util.Map;

public class World {
    private String worldId;
    private String hostId;
    private Map<String, PlayerPosition> outsidePlayers;
    private Map<String, PlayerPosition> arcadePlayers;

    public World() {
        this.outsidePlayers = new HashMap<>();
        this.arcadePlayers = new HashMap<>();
    }
    public String getWorldId() {
        return worldId;
    }
    public void setWorldId(String worldId) {
        this.worldId = worldId;
    }
    public String getHostId() {
        return hostId;
    }
    public void setHostId(String hostId) {
        this.hostId = hostId;
    }
    public Map<String, PlayerPosition> getOutsidePlayers() {
        return outsidePlayers;
    }
    public Map<String, PlayerPosition> getArcadePlayers() {
        return arcadePlayers;
    }
    public void addOutsidePlayer(String playerId, PlayerPosition playerPosition) {
        outsidePlayers.put(playerId, playerPosition);
    }
    public void addArcadePlayer(String playerId, PlayerPosition playerPosition) {
        arcadePlayers.put(playerId, playerPosition);
    }
    public void removeOutsidePlayer(String playerId) {
        outsidePlayers.remove(playerId);
    }
    public void removeArcadePlayer(String playerId) {
        arcadePlayers.remove(playerId);
    }
}