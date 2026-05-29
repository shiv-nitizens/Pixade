package com.example.tictactoebackend.Controller;

import com.example.tictactoebackend.DataTransferObject.CreateGameRequest;
import com.example.tictactoebackend.DataTransferObject.JoinGameRequest;
import com.example.tictactoebackend.DataTransferObject.MakeMoveRequest;
import com.example.tictactoebackend.Model.Game;
import com.example.tictactoebackend.Service.GameService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @PostMapping("/games")
    public ResponseEntity<Game> createGame(@RequestBody CreateGameRequest request) {
        Game game = gameService.createGame(request.getPlayerId());
        return ResponseEntity.status(HttpStatus.CREATED).body(game);
    }

    @GetMapping("/games/{id}")
    public ResponseEntity<Game> getGame(@PathVariable String id) {
        Game game = gameService.getGame(id);

        if (game == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.ok(game);
    }

    @PostMapping("/games/{id}/move")
    public ResponseEntity<Game> makeMove(@PathVariable String id,
                                         @RequestBody MakeMoveRequest request) {
        try {
            Game updatedGame = gameService.makeMove(
                    id,
                    request.getPlayerId(),
                    request.getPosition()
            );

            return ResponseEntity.ok(updatedGame);
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Game not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/games/{id}/join")
    public ResponseEntity<Game> joinGame(@PathVariable String id,
                                         @RequestBody JoinGameRequest request) {
        try {
            Game game = gameService.joinGame(id, request.getPlayerId());
            return ResponseEntity.ok(game);
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Game not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}