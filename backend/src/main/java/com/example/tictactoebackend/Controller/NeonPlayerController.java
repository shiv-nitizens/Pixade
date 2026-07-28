package com.example.tictactoebackend.Controller;

import com.example.tictactoebackend.Model.NeonGame;
import com.example.tictactoebackend.Model.NeonPlayer;
import com.example.tictactoebackend.Model.NeonPlayerDiedRequest;
import com.example.tictactoebackend.Service.NeonGameService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class NeonPlayerController {

    NeonGameService neonGameService;
    SimpMessagingTemplate simpMessagingTemplate;

    public NeonPlayerController(NeonGameService neonGameService,SimpMessagingTemplate simpMessagingTemplate) {
        this.neonGameService = neonGameService;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }
    @MessageMapping("/neon/{gameId}/player-move")
    public void movePlayer(
            @DestinationVariable String gameId,
            NeonPlayer player) {

        NeonGame game = neonGameService.getGame(gameId);

        if (game == null) {
            return;
        }

        NeonPlayer existing = game.getPlayers().get(player.getPlayerId());

        if (existing == null) {
            return;
        }

        existing.setX(player.getX());
        existing.setY(player.getY());
        existing.setDirection(player.getDirection());

        simpMessagingTemplate.convertAndSend(
                "/topic/neon/" + gameId + "/players",
                existing
        );
    }
    @MessageMapping("/neon/{gameId}/player-died")
    public void playerDied(
            @DestinationVariable String gameId,
            NeonPlayerDiedRequest request
    ) {

        neonGameService.markPlayerDead(
                gameId,
                request.getPlayerId()
        );

        String winner =
                neonGameService.getWinner(gameId);

        if (winner != null) {

            simpMessagingTemplate.convertAndSend(
                    "/topic/neon/" + gameId + "/winner",
                    winner
            );
            System.out.println("winnner is" + winner);
        }
    }
}