// src/bll/game.bll.ts
export class GameBLL {
    static isValidMove(board: string[][], row: number, col: number): boolean {
      return row >= 0 && row < 3 && col >= 0 && col < 3 && !board[row][col];
    }
  
    static checkWinner(board: string[][], player: string): boolean {
      // Check rows
      for (let i = 0; i < 3; i++) {
        if (board[i][0] === player && 
            board[i][1] === player && 
            board[i][2] === player) {
          return true;
        }
      }
  
      // Check columns
      for (let i = 0; i < 3; i++) {
        if (board[0][i] === player && 
            board[1][i] === player && 
            board[2][i] === player) {
          return true;
        }
      }
  
      // Check diagonals
      if (board[0][0] === player && 
          board[1][1] === player && 
          board[2][2] === player) {
        return true;
      }
      if (board[0][2] === player && 
          board[1][1] === player && 
          board[2][0] === player) {
        return true;
      }
  
      return false;
    }
  
    static isBoardFull(board: string[][]): boolean {
      return board.every(row => row.every(cell => cell !== ''));
    }
  
    static handleGameResult(currentScore: number, consecutiveWins: number, won: boolean): {
      newScore: number;
      newConsecutiveWins: number;
    } {
      if (won) {
        const newConsecutiveWins = consecutiveWins + 1;
        let scoreIncrease = 1;
        
        // Bonus point for 3 consecutive wins
        if (newConsecutiveWins === 3) {
          scoreIncrease += 1;
        }
        
        return {
          newScore: currentScore + scoreIncrease,
          newConsecutiveWins: newConsecutiveWins === 3 ? 0 : newConsecutiveWins
        };
      }
  
      // If lost
      return {
        newScore: Math.max(0, currentScore - 1), // Don't go below 0
        newConsecutiveWins: 0 // Reset consecutive wins
      };
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
        // โบนัสพิเศษสำหรับชนะติดต่อกัน 3 ครั้ง
        if (consecutiveWins === 3) {
          newScore += 1;
        }
        return newScore;
      }
      // ถ้าแพ้ ลด 1 คะแนน แต่ไม่ติดลบ
      return Math.max(0, currentScore - 1);
    }
  
    static updateConsecutiveWins(currentStreak: number, won: boolean): number {
      if (won) {
        return currentStreak + 1;
      }
      return 0; // รีเซ็ตเมื่อแพ้
    }
  
    static getBotMove(board: string[][]): { row: number; col: number } {
      // Try to win
      const winMove = this.findWinningMove(board, 'O');
      if (winMove) return winMove;
  
      // Block player's winning move
      const blockMove = this.findWinningMove(board, 'X');
      if (blockMove) return blockMove;
  
      // Take center if available
      if (!board[1][1]) return { row: 1, col: 1 };
  
      // Take corners
      for (const [row, col] of [[0,0], [0,2], [2,0], [2,2]]) {
        if (!board[row][col]) return { row, col };
      }
  
      // Take any available space
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (!board[i][j]) return { row: i, col: j };
        }
      }
  
      return null;
    }
  
    private static findWinningMove(board: string[][], player: string): { row: number; col: number } | null {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (!board[i][j]) {
            board[i][j] = player;
            if (this.checkWinner(board, player)) {
              board[i][j] = '';
              return { row: i, col: j };
            }
            board[i][j] = '';
          }
        }
      }
      return null;
    }
    
  }