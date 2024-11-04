import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Game } from '../models/game.model';
import { User } from '../models/user.model';
import { GameBLL } from './bll/game.bll';
import { Op } from 'sequelize';
import { GameHistoryResponseDto, GameStatsResponseDto } from './dto/game.dto';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game)
    private gameModel: typeof Game,
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async createGame(userId: number): Promise<Game> {
    return await this.gameModel.create({
      userId,
      board: [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
      ],
      status: 'ongoing'
    });
  }

  async getCurrentGame(userId: number): Promise<Game | null> {
    return await this.gameModel.findOne({
      where: {
        userId,
        status: 'ongoing'
      },
      include: [User]
    });
  }

  async makeMove(
    gameId: number,
    userId: number,
    row: number,
    col: number,
): Promise<Game> {
    const game = await this.gameModel.findOne({
      where: { id: gameId, userId },
      include: [User],
    });

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    if (game.status !== 'ongoing') {
      throw new BadRequestException('Game is already finished');
    }

    if (game.board[row][col] !== '') {
      throw new BadRequestException('Position is already taken');
    }
    // Make player's move
    game.board[row][col] = 'X';

    // Check if player won
    if (GameBLL.checkWinner(game.board, 'X')) {
      game.status = 'won';
      await this.updateUserScore(userId, true);
      return await game.save();
    }

    // Check for draw
    if (GameBLL.isBoardFull(game.board)) {
      game.status = 'draw';
      return await game.save();
    }

    // Bot's move
    const botMove = GameBLL.getBotMove(game.board);
    if (botMove) {
      game.board[botMove.row][botMove.col] = 'O';

      // Check if bot won
      if (GameBLL.checkWinner(game.board, 'O')) {
        game.status = 'lost';
        await this.updateUserScore(userId, false);
      } else if (GameBLL.isBoardFull(game.board)) {
        game.status = 'draw';
      }
    }

    return await game.save();
  }

  private async updateUserScore(userId: number, won: boolean) {
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const result = GameBLL.handleGameResult(
      user.score,
      user.consecutiveWins,
      won,
    );
    user.score = result.newScore;
    user.consecutiveWins = result.newConsecutiveWins;

    await user.save();
  }

  async getGameHistory(userId: number): Promise<GameHistoryResponseDto[]> {
    const games = await this.gameModel.findAll({
      where: {
        userId,
        status: {
          [Op.in]: ['won', 'lost', 'draw'],
        },
      },
      order: [['createdAt', 'DESC']],
      limit: 10,
    });

    return games.map((game) => ({
      id: game.id,
      status: game.status as 'won' | 'lost' | 'draw',
      playedAt: game.createdAt,
    }));
  }

  async getStats(userId: number): Promise<GameStatsResponseDto> {
    const games = await this.gameModel.findAll({
      where: { userId },
    });

    const stats = games.reduce(
      (acc, game) => {
        acc.totalGames++;
        if (game.status === 'won') acc.gamesWon++;
        if (game.status === 'lost') acc.gamesLost++;
        if (game.status === 'draw') acc.gamesDrawn++;
        return acc;
      },
      { totalGames: 0, gamesWon: 0, gamesLost: 0, gamesDrawn: 0 },
    );

    const user = await this.userModel.findByPk(userId);

    return {
      totalGames: stats.totalGames,
      wins: stats.gamesWon,
      losses: stats.gamesLost,
      draws: stats.gamesDrawn,
      currentScore: user.score,
      consecutiveWins: user.consecutiveWins,
      winRate:
        stats.totalGames > 0 ? (stats.gamesWon / stats.totalGames) * 100 : 0,
    };
  }
  async getGameStats(userId: number): Promise<GameStatsResponseDto> {
    const user = await this.userModel.findByPk(userId);
    const games = await this.gameModel.findAll({
      where: { userId },
    });

    const totalGames = games.length;
    const wins = games.filter((g) => g.status === 'won').length;
    const losses = games.filter((g) => g.status === 'lost').length;
    const draws = games.filter((g) => g.status === 'draw').length;

    return {
      totalGames,
      wins,
      losses,
      draws,
      currentScore: user.score,
      consecutiveWins: user.consecutiveWins,
      winRate: totalGames > 0 ? (wins / totalGames) * 100 : 0,
    };
  }
}
