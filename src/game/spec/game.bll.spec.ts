import { GameBLL } from '../bll/game.bll';

describe('GameBLL', () => {
  describe('checkWinner', () => {
    it('should return true for horizontal win', () => {
      const board = [
        ['X', 'X', 'X'],
        ['', '', ''],
        ['', '', '']
      ];
      expect(GameBLL.checkWinner(board, 'X')).toBeTruthy();
    });

    it('should return true for vertical win', () => {
      const board = [
        ['O', '', ''],
        ['O', '', ''],
        ['O', '', '']
      ];
      expect(GameBLL.checkWinner(board, 'O')).toBeTruthy();
    });
  });

  describe('handleGameResult', () => {
    it('should add bonus point for 3 consecutive wins', () => {
      const result = GameBLL.handleGameResult(5, 2, true);
      expect(result.newScore).toBe(7); // 5 + 1 + 1(bonus)
      expect(result.newConsecutiveWins).toBe(0); // reset after 3 wins
    });
  });
});
