import { GameBLL } from "./game.bll";

export class BotBLL {
    static getBestMove(board: string[][]): { row: number; col: number } {
      // Check for winning move
      const winningMove = this.findWinningMove(board, 'O');
      if (winningMove) return winningMove;
  
      // Block player's winning move
      const blockingMove = this.findWinningMove(board, 'X');
      if (blockingMove) return blockingMove;
  
      // Take center if available
      if (!board[1][1]) return { row: 1, col: 1 };
  
      // Take corner
      const cornerMove = this.findEmptyCorner(board);
      if (cornerMove) return cornerMove;
  
      // Take any available space
      return this.findEmptySpace(board);
    }
  
    private static findWinningMove(board: string[][], player: string): { row: number; col: number } | null {
      // Check all possible moves
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          if (!board[row][col]) {
            board[row][col] = player;
            if (GameBLL.checkWinner(board, player)) {
              board[row][col] = ''; // Reset the move
              return { row, col };
            }
            board[row][col] = ''; // Reset the move
          }
        }
      }
      return null;
    }
  
    private static findEmptyCorner(board: string[][]): { row: number; col: number } | null {
      const corners = [
        { row: 0, col: 0 },
        { row: 0, col: 2 },
        { row: 2, col: 0 },
        { row: 2, col: 2 }
      ];
  
      for (const corner of corners) {
        if (!board[corner.row][corner.col]) {
          return corner;
        }
      }
      return null;
    }
  
    private static findEmptySpace(board: string[][]): { row: number; col: number } {
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          if (!board[row][col]) {
            return { row, col };
          }
        }
      }
      return null; // Should never happen in a valid game
    }
  }