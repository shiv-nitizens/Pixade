package com.example.tictactoebackend.Controller;

import com.example.tictactoebackend.Model.PlayerPosition;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class PlayerPositionController {

    SimpMessagingTemplate simpMessagingTemplate;

    public PlayerPositionController(SimpMessagingTemplate simpMessagingTemplate){
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @MessageMapping("/worlds/{worldId}/player-move")
    public void handleMove(@DestinationVariable String worldId, PlayerPosition playerPosition){
        simpMessagingTemplate.convertAndSend("/topic/worlds/"+worldId+"/players",playerPosition);
        System.out.println("movement detected");
    }
}
