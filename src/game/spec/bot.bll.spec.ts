import { BotBLL } from '../bll/bot.bll';

describe('BotBLL', () => {
  describe('getBestMove', () => {
    it('should block player winning move', () => {
      const board = [
        ['X', 'X', ''],
        ['', '', ''],
        ['', '', '']
      ];
      const move = BotBLL.getBestMove(board);
      expect(move.row).toBe(0);
      expect(move.col).toBe(2);
    });

    it('should take winning move when available', () => {
      const board = [
        ['O', 'O', ''],
        ['', '', ''],
        ['', '', '']
      ];
      const move = BotBLL.getBestMove(board);
      expect(move.row).toBe(0);
      expect(move.col).toBe(2);
    });

    it('should take center if available', () => {
      const board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
      ];
      const move = BotBLL.getBestMove(board);
      expect(move.row).toBe(1);
      expect(move.col).toBe(1);
    });
  });
});