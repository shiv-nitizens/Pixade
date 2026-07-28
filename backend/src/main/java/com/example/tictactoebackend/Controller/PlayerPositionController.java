package com.example.tictactoebackend.Controller;

import com.example.tictactoebackend.Model.PlayerPosition;
import com.example.tictactoebackend.Model.World;
import com.example.tictactoebackend.Service.WorldService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class PlayerPositionController {
    SimpMessagingTemplate simpMessagingTemplate;
    WorldService worldService;

    public PlayerPositionController(SimpMessagingTemplate simpMessagingTemplate, WorldService worldService) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.worldService = worldService;
    }

    @MessageMapping("/worlds/{worldId}/outside/player-move")
    public void handleOutsideMove(@DestinationVariable String worldId, PlayerPosition playerPosition) {
        World world = worldService.getWorld(worldId);
        if (world == null) {
            return;
        }
        world.getOutsidePlayers().put(playerPosition.getPlayerId(), playerPosition);
        simpMessagingTemplate.convertAndSend(
                "/topic/worlds/" + worldId + "/outside/players",
                playerPosition
        );
    }

    @MessageMapping("/worlds/{worldId}/arcade/player-move")
    public void handleArcadeMove(@DestinationVariable String worldId, PlayerPosition playerPosition) {
        World world = worldService.getWorld(worldId);
        if (world == null) {
            return;
        }
        world.getArcadePlayers().put(playerPosition.getPlayerId(), playerPosition);
        simpMessagingTemplate.convertAndSend(
                "/topic/worlds/" + worldId + "/arcade/players",
                playerPosition
        );
    }
}