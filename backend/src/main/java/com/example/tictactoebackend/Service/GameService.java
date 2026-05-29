package com.example.tictactoebackend.Service;

import com.example.tictactoebackend.Model.Game;
import com.example.tictactoebackend.Storage.GameStorage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class GameService {

    @Autowired
    GameStorage gameStorage;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public Game createGame(String player1Id) {
        String gameId = UUID.randomUUID().toString();
        Game game = new Game(gameId, player1Id);
        gameStorage.addGame(game);
        return game;
    }

    public Game getGame(String gameId) {
        return gameStorage.getGame(gameId);
    }

    public Game joinGame(String gameId, String player2Id) {
        Game game = gameStorage.getGame(gameId);

        if (game == null) {
            throw new RuntimeException("Game not found");
        }

        if (!"WAITING".equals(game.getStatus())) {
            throw new RuntimeException("Game already started");
        }

        if (game.getPlayer2Id() != null) {
            throw new RuntimeException("Game already has two players");
        }

        if (player2Id.equals(game.getPlayer1Id())) {
            throw new RuntimeException("Player cannot join own game");
        }

        game.setPlayer2Id(player2Id);
        game.setStatus("IN_PROGRESS");
        game.setCurrentTurn("X");

        messagingTemplate.convertAndSend("/topic/games/" + gameId, game);
        return game;
    }

    private boolean checkWinner(String board, char symbol) {
        int[][] patterns = {
                {0, 1, 2}, {3, 4, 5}, {6, 7, 8},
                {0, 3, 6}, {1, 4, 7}, {2, 5, 8},
                {0, 4, 8}, {2, 4, 6}
        };

        for (int[] p : patterns) {
            if (board.charAt(p[0]) == symbol &&
                    board.charAt(p[1]) == symbol &&
                    board.charAt(p[2]) == symbol) {
                return true;
            }
        }

        return false;
    }

    public Game makeMove(String gameId, String playerId, int position) {
        Game game = gameStorage.getGame(gameId);

        if (game == null) {
            throw new RuntimeException("Game not found");
        }

        if (!"IN_PROGRESS".equals(game.getStatus())) {
            throw new RuntimeException("Game is not active");
        }

        if (!playerId.equals(game.getPlayer1Id()) &&
                !playerId.equals(game.getPlayer2Id())) {
            throw new RuntimeException("Invalid player");
        }

        char symbol = playerId.equals(game.getPlayer1Id()) ? 'X' : 'O';

        if (!game.getCurrentTurn().equals(String.valueOf(symbol))) {
            throw new RuntimeException("Not your turn");
        }

        if (position < 0 || position > 8) {
            throw new RuntimeException("Invalid position");
        }

        String board = game.getBoard();

        if (board.charAt(position) != '_') {
            throw new RuntimeException("Cell already occupied");
        }

        StringBuilder updatedBoard = new StringBuilder(board);
        updatedBoard.setCharAt(position, symbol);
        game.setBoard(updatedBoard.toString());

        if (checkWinner(game.getBoard(), symbol)) {
            game.setWinner(playerId);
            game.setStatus("FINISHED");
        } else if (!game.getBoard().contains("_")) {
            game.setStatus("FINISHED");
        } else {
            game.setCurrentTurn(symbol == 'X' ? "O" : "X");
        }

        game.incrementVersion();
        messagingTemplate.convertAndSend("/topic/games/" + gameId, game);

        return game;
    }
}