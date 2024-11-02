// src/bll/game.bll.ts
export class GameBLL {
    static isValidMove(board: string[][], row: number, col: number): boolean {
      return row >= 0 && row < 3 && col >= 0 && col < 3 && !board[row][col];
    }
  
    static isBoardFull(board: string[][]): boolean {
      return board.every(row => row.every(cell => cell !== ''));
    }
  
    static checkWinner(board: string[][], player: string): boolean {
      // Check rows
      for (let i = 0; i < 3; i++) {
        if (board[i][0] === player && board[i][1] === player && board[i][2] === player) {
          return true;
        }
      }
  
      // Check columns
      for (let i = 0; i < 3; i++) {
        if (board[0][i] === player && board[1][i] === player && board[2][i] === player) {
          return true;
        }
      }
  
      // Check diagonals
      if (board[0][0] === player && board[1][1] === player && board[2][2] === player) {
        return true;
      }
      if (board[0][2] === player && board[1][1] === player && board[2][0] === player) {
        return true;
      }
  
      return false;
    }
  
    static getBestMove(board: string[][]): { row: number; col: number } {
      let bestScore = -Infinity;
      let move = { row: 0, col: 0 };
  
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (!board[i][j]) {
            board[i][j] = 'O';
            const score = this.minimax(board, 0, false);
            board[i][j] = '';
  
            if (score > bestScore) {
              bestScore = score;
              move = { row: i, col: j };
            }
          }
        }
      }
  
      return move;
    }
  
    private static minimax(board: string[][], depth: number, isMaximizing: boolean): number {
      if (this.checkWinner(board, 'O')) return 10 - depth;
      if (this.checkWinner(board, 'X')) return depth - 10;
      if (this.isBoardFull(board)) return 0;
  
      if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            if (!board[i][j]) {
              board[i][j] = 'O';
              const score = this.minimax(board, depth + 1, false);
              board[i][j] = '';
              bestScore = Math.max(score, bestScore);
            }
          }
        }
        return bestScore;
      } else {
        let bestScore = Infinity;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            if (!board[i][j]) {
              board[i][j] = 'X';
              const score = this.minimax(board, depth + 1, true);
              board[i][j] = '';
              bestScore = Math.min(score, bestScore);
            }
          }
        }
        return bestScore;
      }
    }
  
    static calculateConsecutiveWins(currentConsecutiveWins: number, won: boolean): number {
      if (won) {
        return currentConsecutiveWins + 1;
      }
      return 0;
    }
  
    static calculateScore(currentScore: number, won: boolean, consecutiveWins: number): number {
      if (won) {
        let newScore = currentScore + 1;
        // Bonus point for 3 consecutive wins
        if (consecutiveWins === 3) {
          newScore += 1;
        }
        return newScore;
      }
      return Math.max(0, currentScore - 1);
    }
  }