import { GameBLL } from '../bll/game.bll';

describe('GameBLL', () => {
  describe('checkWinner', () => {
    it('should detect horizontal win', () => {
      const board = [
        ['X', 'X', 'X'],
        ['', '', ''],
        ['', '', ''],
      ];
      expect(GameBLL.checkWinner(board, 'X')).toBe(true);
    });

    it('should detect vertical win', () => {
      const board = [
        ['O', '', ''],
        ['O', '', ''],
        ['O', '', ''],
      ];
      expect(GameBLL.checkWinner(board, 'O')).toBe(true);
    });
  });
});
