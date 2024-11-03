import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { GameService } from './game.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  MakeMoveDto,
  GameResponseDto,
  GameStatsResponseDto,
  CreateGameResponseDto,
  GameHistoryResponseDto,
} from './dto/game.dto';

@ApiTags('Game')
@ApiBearerAuth()
@Controller('game')
@UseGuards(JwtAuthGuard)
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  @ApiOperation({ summary: 'Create new game' })
  @ApiResponse({ 
    status: 201, 
    description: 'Game created successfully',
    type: CreateGameResponseDto
  })
  async createGame(@Req() req): Promise<CreateGameResponseDto> {
    return this.gameService.createGame(req.user.id);
  }

  @Post(':id/move')
  @ApiOperation({ summary: 'Make a move in the game' })
  @ApiResponse({ 
    status: 200, 
    description: 'Move made successfully',
    type: GameResponseDto
  })
  @ApiResponse({ status: 400, description: 'Invalid move' })
  @ApiResponse({ status: 404, description: 'Game not found' })
  async makeMove(
    @Param('id') id: number,
    @Req() req,
    @Body() moveDto: MakeMoveDto
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
      userId: game.userId,
    };
  }

  @Get('current')
  @ApiOperation({ summary: 'Get current game' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns current game or null if no active game',
    type: GameResponseDto
  })
  async getCurrentGame(@Req() req): Promise<GameResponseDto | null> {
    const game = await this.gameService.getCurrentGame(req.user.id);
    if (!game) return null;
    return {
      id: game.id,
      board: game.board,
      status: game.status,
      userId: game.userId,
    };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get user game statistics' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns game statistics',
    type: GameStatsResponseDto
  })
  async getStats(@Req() req): Promise<GameStatsResponseDto> {
    return this.gameService.getGameStats(req.user.id);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get game history' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns list of completed games',
    type: [GameHistoryResponseDto]
  })
  async getGameHistory(@Req() req): Promise<GameHistoryResponseDto[]> {
    return this.gameService.getGameHistory(req.user.id);
  }
}