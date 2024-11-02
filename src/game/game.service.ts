import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Game } from '../models/game.model';
import { User } from '../models/user.model';
import { GameBLL } from './bll/game.bll';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game)
    private gameModel: typeof Game,
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async createGame(userId: number): Promise<Game> {
    return await Game.create({
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
    return await Game.findOne({
      where: { 
        userId,
        status: 'ongoing'
      },
      include: [User]
    });
  }

  async makeMove(gameId: number, userId: number, row: number, col: number): Promise<Game> {
    const game = await Game.findOne({
      where: { id: gameId, userId },
      include: [User],
    });

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    if (game.status !== 'ongoing') {
      throw new BadRequestException('Game is already finished');
    }

    if (!GameBLL.isValidMove(game.board, row, col)) {
      throw new BadRequestException('Invalid move');
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
    const botMove = GameBLL.getBestMove(game.board);
    game.board[botMove.row][botMove.col] = 'O';

    // Check if bot won
    if (GameBLL.checkWinner(game.board, 'O')) {
      game.status = 'lost';
      await this.updateUserScore(userId, false);
    } else if (GameBLL.isBoardFull(game.board)) {
      game.status = 'draw';
    }

    return await game.save();
  }

  private async updateUserScore(userId: number, won: boolean) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    const newConsecutiveWins = GameBLL.calculateConsecutiveWins(user.consecutiveWins, won);
    user.score = GameBLL.calculateScore(user.score, won, newConsecutiveWins);
    user.consecutiveWins = newConsecutiveWins;
    
    await user.save();
  }
}