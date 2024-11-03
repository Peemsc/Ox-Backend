import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Param, 
  UseGuards, 
  Req 
} from '@nestjs/common';
import { GameService } from './game.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { 
  MakeMoveDto, 
  GameResponseDto, 
  GameStatsResponseDto,
  CreateGameResponseDto, 
  GameHistoryResponseDto
} from './dto/game.dto';

@Controller('game')
@UseGuards(JwtAuthGuard)
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  async createGame(@Req() req): Promise<CreateGameResponseDto> {
    const game = await this.gameService.createGame(req.user.id);
    return {
      id: game.id,
      board: game.board,
      status: game.status,
      userId: game.userId
    };
  }

  @Post(':id/move')
  async makeMove(
    @Param('id') id: number,
    @Req() req,
    @Body() moveDto: MakeMoveDto
  ): Promise<GameResponseDto> {
    const game = await this.gameService.makeMove(
      id, 
      req.user.id, 
      moveDto.row, 
      moveDto.col
    );
    return {
      id: game.id,
      board: game.board,
      status: game.status,
      userId: game.userId
    };
  }

  @Get('current')
  async getCurrentGame(@Req() req): Promise<GameResponseDto | null> {
    const game = await this.gameService.getCurrentGame(req.user.id);
    if (!game) return null;
    return {
      id: game.id,
      board: game.board,
      status: game.status,
      userId: game.userId
    };
  }

  @Get('stats')
  async getStats(@Req() req): Promise<GameStatsResponseDto> {
    return this.gameService.getGameStats(req.user.id);
  }

  @Get('history')
  async getGameHistory(@Req() req): Promise<GameHistoryResponseDto[]> {
    return this.gameService.getGameHistory(req.user.id);
  }
}