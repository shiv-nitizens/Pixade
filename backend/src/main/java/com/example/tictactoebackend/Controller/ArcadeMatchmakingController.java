package com.example.tictactoebackend.Controller;

import com.example.tictactoebackend.DataTransferObject.ArcadeJoinRequest;
import com.example.tictactoebackend.Model.Game;
import com.example.tictactoebackend.Service.ArcadeMatchmakingService;
import com.example.tictactoebackend.Service.GameService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ArcadeMatchmakingController {
    GameService gameService;
    ArcadeMatchmakingService arcadeMatchmakingService;
    SimpMessagingTemplate simpMessagingTemplate;

    public ArcadeMatchmakingController(ArcadeMatchmakingService arcadeMatchmakingService,GameService gameService,SimpMessagingTemplate simpMessagingTemplate){
        this.arcadeMatchmakingService = arcadeMatchmakingService;
        this.gameService = gameService;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }
    @MessageMapping("/arcade-join")
    public void joinArcade(ArcadeJoinRequest req){
        String waitingPlayer = arcadeMatchmakingService.getWaitingPlayer();

        if(waitingPlayer == null){
            arcadeMatchmakingService.setWaitingPlayer(req.getPlayerId());
            return;
        }
        Game game = gameService.createGame(waitingPlayer);
        gameService.joinGame(game.getGameId(),req.getPlayerId());
        simpMessagingTemplate.convertAndSend(
                "/topic/arcade",game
        );
    }
}
