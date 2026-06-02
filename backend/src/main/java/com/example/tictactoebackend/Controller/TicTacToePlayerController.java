package com.example.tictactoebackend.Controller;

import com.example.tictactoebackend.Model.PlayerPosition;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class TicTacToePlayerController {
    SimpMessagingTemplate simpMessagingTemplate;

    public TicTacToePlayerController( SimpMessagingTemplate simpMessagingTemplate){
        this.simpMessagingTemplate = simpMessagingTemplate;
    }
    @MessageMapping("/games/{gameId}/player-move")
    public void handlePlayerMove(
            @DestinationVariable String gameId,
            PlayerPosition playerPosition)
    {
        System.out.println("broadcasting...");
        simpMessagingTemplate.convertAndSend(
                "/topic/games/"+gameId+"/players",
                playerPosition);
    }

}
