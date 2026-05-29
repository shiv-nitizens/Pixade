package com.example.tictactoebackend.Model;

public class Game {
    private String gameId;
    private String player1Id;
    private String player2Id;
    private String currentTurn;
    private String board;
    private String winner;
    private String status;
    private int version;

    public Game(String gameId, String player1Id) {
        this.status = "WAITING";
        this.gameId = gameId;
        this.player1Id = player1Id;
        this.player2Id = null;
        this.currentTurn = null;
        this.board = "_".repeat(9);
        this.winner = null;
        this.version =0;
    }

    public String getGameId() {
        return gameId;
    }

    public String getPlayer1Id() {
        return player1Id;
    }

    public String getPlayer2Id() {
        return player2Id;
    }

    public String getCurrentTurn() {
        return currentTurn;
    }

    public String getBoard() {
        return board;
    }

    public String getWinner() {
        return winner;
    }

    public String getStatus() {
        return status;
    }

    public int getVersion() {
        return version;
    }

    public void setCurrentTurn(String currentTurn) {
        this.currentTurn = currentTurn;
    }

    public void setBoard(String board) {
        this.board = board;
    }

    public void setPlayer2Id(String player2Id) {
        this.player2Id = player2Id;
    }

    public void setWinner(String winner) {
        this.winner = winner;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void incrementVersion() {
        this.version++;
    }
}
