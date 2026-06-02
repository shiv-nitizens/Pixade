package com.example.tictactoebackend.Controller;

import com.example.tictactoebackend.Model.PlayerPosition;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class PlayerPositionController {

    SimpMessagingTemplate simpMessagingTemplate;

    public PlayerPositionController(SimpMessagingTemplate simpMessagingTemplate){
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @MessageMapping("/player-move")
    public void handleMove(PlayerPosition playerPosition){
        simpMessagingTemplate.convertAndSend("/topic/players",playerPosition);
    }
}
