package com.example.tictactoebackend.Model;

import java.util.HashSet;
import java.util.Set;

public class World {
    String WorldId;
    String HostId;
    Set<String> players;

    public World() {
        this.players = new HashSet<>();
    }

    public String getWorldId() {
        return WorldId;
    }

    public void setWorldId(String worldId) {
        WorldId = worldId;
    }

    public Set<String> getPlayers() {
        return players;
    }

    public void addPlayers(String playerId){
        this.players.add(playerId);
    }

    public String getHostId() {
        return HostId;
    }

    public void setHostId(String hostId) {
        HostId = hostId;
    }
}
