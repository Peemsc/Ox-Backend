import { Controller, Post, Body, Param, UseGuards, Req, Get } from '@nestjs/common';
import { GameService } from './game.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MakeMoveDto, GameResponseDto, GameHistoryResponseDto, GameStatsResponseDto } from './dto/game.dto';

@Controller('game')
@UseGuards(JwtAuthGuard)
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post(':id/move')
  async makeMove(
    @Param('id') id: number,
    @Req() req,
    @Body() moveDto: MakeMoveDto,
  ): Promise<GameResponseDto> {
    const game = await this.gameService.makeMove(
      id,
      req.user.id,
      moveDto.row,
      moveDto.col,
    );
    return {
      id: game.id,
      board: game.board,
      status: game.status,
      score: game.user.score,
      consecutiveWins: game.user.consecutiveWins,
      userId: game.userId,
    };
  }

  @Get('history')
  async getGameHistory(@Req() req): Promise<GameHistoryResponseDto[]> {
    return this.gameService.getGameHistory(req.user.id);
  }

  @Get('stats')
  async getGameStats(@Req() req): Promise<GameStatsResponseDto> {
    return this.gameService.getGameStats(req.user.id);
  }
}
