package com.example.tictactoebackend.Controller;

import com.example.tictactoebackend.DataTransferObject.EnterArcadeRequest;
import com.example.tictactoebackend.Service.WorldService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
@Controller
public class RoomController {

    WorldService worldService;
    SimpMessagingTemplate simpMessagingTemplate;

    public RoomController(WorldService worldService , SimpMessagingTemplate simpMessagingTemplate) {
        this.worldService = worldService;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @MessageMapping("/worlds/{worldId}/enter-arcade")
    public void enterArcade(@DestinationVariable String worldId,EnterArcadeRequest request) {
        worldService.enterArcade(worldId, request.getPlayerId());
        simpMessagingTemplate.convertAndSend(
                "/topic/worlds/" + worldId + "/player-left",
                new PlayerLeftEvent(request.getPlayerId())
        );
    }
}