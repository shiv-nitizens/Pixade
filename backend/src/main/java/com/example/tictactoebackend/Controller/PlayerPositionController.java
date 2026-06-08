package com.example.tictactoebackend.Controller;

import com.example.tictactoebackend.Model.PlayerPosition;
import com.example.tictactoebackend.Model.World;
import com.example.tictactoebackend.Service.WorldService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.HashMap;
import java.util.Map;

@Controller
public class PlayerPositionController {

    SimpMessagingTemplate simpMessagingTemplate;
    WorldService worldService;

    public PlayerPositionController(SimpMessagingTemplate simpMessagingTemplate , WorldService worldService){
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.worldService = worldService;
    }

    @MessageMapping("/worlds/{worldId}/player-move")
    public void handleMove(@DestinationVariable String worldId, PlayerPosition playerPosition){
        World world = worldService.getWorld(worldId);
        Map<String,PlayerPosition> players = world.getPlayers();
        players.put(playerPosition.getPlayerId(),playerPosition);

        simpMessagingTemplate.convertAndSend("/topic/worlds/"+worldId+"/players",playerPosition);
    }
}
