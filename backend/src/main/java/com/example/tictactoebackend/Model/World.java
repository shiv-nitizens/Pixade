package com.example.tictactoebackend.Model;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class World {
    String WorldId;
    String HostId;
    Map<String,PlayerPosition> players;

    public World() {
        this.players = new HashMap<>();
    }

    public String getWorldId() {
        return WorldId;
    }

    public void setWorldId(String worldId) {
        WorldId = worldId;
    }

    public Map<String,PlayerPosition> getPlayers() {
        return players;
    }

    public void addPlayers(String playerId,PlayerPosition playerPosition){
        this.players.put(playerId,playerPosition);
    }

    public String getHostId() {
        return HostId;
    }

    public void setHostId(String hostId) {
        HostId = hostId;
    }
}
