package com.example.tictactoebackend.Service;

public class CheckWinner {
    private boolean checkWinner(String board, char symbol) {

        int[][] patterns = {
                {0,1,2}, {3,4,5}, {6,7,8},
                {0,3,6}, {1,4,7}, {2,5,8},
                {0,4,8}, {2,4,6}
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
}
