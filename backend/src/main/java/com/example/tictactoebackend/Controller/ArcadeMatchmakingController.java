package com.example.tictactoebackend.Controller;

import com.example.tictactoebackend.DataTransferObject.ArcadeJoinRequest;
import com.example.tictactoebackend.Model.Game;
import com.example.tictactoebackend.Model.GameType;
import com.example.tictactoebackend.Model.NeonGame;
import com.example.tictactoebackend.Service.ArcadeMatchmakingService;
import com.example.tictactoebackend.Service.GameService;
import com.example.tictactoebackend.Service.NeonGameService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ArcadeMatchmakingController {

    GameService gameService;
    ArcadeMatchmakingService arcadeMatchmakingService;
    SimpMessagingTemplate simpMessagingTemplate;
    NeonGameService neonGameService;

    public ArcadeMatchmakingController(
            ArcadeMatchmakingService arcadeMatchmakingService,
            GameService gameService,
            SimpMessagingTemplate simpMessagingTemplate,
            NeonGameService neonGameService
    ) {

        this.arcadeMatchmakingService = arcadeMatchmakingService;
        this.gameService = gameService;
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.neonGameService = neonGameService;
    }

    @MessageMapping("/arcade-join")
    public void joinArcade(ArcadeJoinRequest req) {

        String waitingPlayer =arcadeMatchmakingService.getWaitingPlayer(req.getGameType());
        if (waitingPlayer == null) {
            arcadeMatchmakingService.setWaitingPlayer(req.getGameType(),req.getPlayerId());
            return;
        }
        if (waitingPlayer.equals(req.getPlayerId())) {
            return;
        }
        arcadeMatchmakingService.clearWaitingPlayer(req.getGameType());
        startGame(req.getGameType(),waitingPlayer,req.getPlayerId());
    }
    private void startGame(GameType gameType,String player1,String player2) {
        switch (gameType) {
            case TIC_TAC_TOE -> {
                Game game = gameService.createGame(player1);
                gameService.joinGame(game.getGameId(),player2);
                simpMessagingTemplate.convertAndSend("/topic/arcade",game);
            }
            case NEON_TRAILS -> {
                NeonGame game = neonGameService.createGame(player1);
                neonGameService.joinGame(game.getGameId(),player2);
                simpMessagingTemplate.convertAndSend("/topic/neon", game);
            }
            case SUMO_ARENA -> {
                System.out.println("Sumo Arena coming soon...");
            }
            case TANK_BATTLE -> {
                System.out.println("Tank Battle coming soon...");
            }
            case BOMBER_ARENA -> {
                System.out.println("Bomber Arena coming soon...");
            }
            case CAPTURE_THE_FLAG -> {
                System.out.println("Capture The Flag coming soon...");
            }
        }
    }
}