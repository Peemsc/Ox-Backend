import { GameBLL } from '../bll/game.bll';

describe('GameBLL', () => {
  describe('checkWinner', () => {
    it('should detect horizontal win', () => {
      const board = [
        ['X', 'X', 'X'],
        ['', '', ''],
        ['', '', '']
      ];
      expect(GameBLL.checkWinner(board, 'X')).toBeTruthy();
    });

    it('should detect vertical win', () => {
      const board = [
        ['O', '', ''],
        ['O', '', ''],
        ['O', '', '']
      ];
      expect(GameBLL.checkWinner(board, 'O')).toBeTruthy();
    });

    it('should detect diagonal win (top-left to bottom-right)', () => {
      const board = [
        ['X', '', ''],
        ['', 'X', ''],
        ['', '', 'X']
      ];
      expect(GameBLL.checkWinner(board, 'X')).toBeTruthy();
    });

    it('should detect diagonal win (top-right to bottom-left)', () => {
      const board = [
        ['', '', 'O'],
        ['', 'O', ''],
        ['O', '', '']
      ];
      expect(GameBLL.checkWinner(board, 'O')).toBeTruthy();
    });

    it('should return false when no winner', () => {
      const board = [
        ['X', 'O', 'X'],
        ['O', 'X', 'O'],
        ['O', 'X', 'O']
      ];
      expect(GameBLL.checkWinner(board, 'X')).toBeFalsy();
    });
  });

  describe('handleGameResult', () => {
    it('should add point for win', () => {
      const result = GameBLL.handleGameResult(5, 0, true);
      expect(result.newScore).toBe(6);
      expect(result.newConsecutiveWins).toBe(1);
    });

    it('should add bonus point for 3 consecutive wins', () => {
      const result = GameBLL.handleGameResult(7, 2, true);
      expect(result.newScore).toBe(9); // 7 + 1 + 1(bonus)
      expect(result.newConsecutiveWins).toBe(0); // reset after bonus
    });

    it('should subtract point for loss', () => {
      const result = GameBLL.handleGameResult(5, 2, false);
      expect(result.newScore).toBe(4);
      expect(result.newConsecutiveWins).toBe(0);
    });

    it('should not allow negative score', () => {
      const result = GameBLL.handleGameResult(0, 0, false);
      expect(result.newScore).toBe(0);
    });
  });

  describe('isBoardFull', () => {
    it('should return true for full board', () => {
      const board = [
        ['X', 'O', 'X'],
        ['O', 'X', 'O'],
        ['O', 'X', 'O']
      ];
      expect(GameBLL.isBoardFull(board)).toBeTruthy();
    });

    it('should return false for non-full board', () => {
      const board = [
        ['X', 'O', ''],
        ['O', 'X', 'O'],
        ['O', 'X', 'O']
      ];
      expect(GameBLL.isBoardFull(board)).toBeFalsy();
    });
  });

  describe('isValidMove', () => {
    it('should return true for valid empty position', () => {
      const board = [
        ['X', '', ''],
        ['', '', ''],
        ['', '', '']
      ];
      expect(GameBLL.isValidMove(board, 0, 1)).toBeTruthy();
    });

    it('should return false for occupied position', () => {
      const board = [
        ['X', '', ''],
        ['', '', ''],
        ['', '', '']
      ];
      expect(GameBLL.isValidMove(board, 0, 0)).toBeFalsy();
    });

    it('should return false for out of bounds position', () => {
      const board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
      ];
      expect(GameBLL.isValidMove(board, 3, 3)).toBeFalsy();
    });
  });
});