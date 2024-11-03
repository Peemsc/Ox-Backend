import { IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MakeMoveDto {
  @ApiProperty({ description: 'Row index (0-2)', minimum: 0, maximum: 2 })
  @IsNumber()
  @Min(0)
  @Max(2)
  row: number;

  @ApiProperty({ description: 'Column index (0-2)', minimum: 0, maximum: 2 })
  @IsNumber()
  @Min(0)
  @Max(2)
  col: number;
}

export class GameResponseDto {
  @ApiProperty({ description: 'Game ID' })
  id: number;

  @ApiProperty({ 
    description: 'Game board', 
    example: [['X', '', ''], ['', 'O', ''], ['', '', '']] 
  })
  board: string[][];

  @ApiProperty({ 
    description: 'Game status',
    enum: ['ongoing', 'won', 'lost', 'draw'] 
  })
  status: 'ongoing' | 'won' | 'lost' | 'draw';

  @ApiProperty({ description: 'User ID' })
  userId: number;
}

export class GameStatsResponseDto {
  @ApiProperty({ description: 'Total games played' })
  totalGames: number;

  @ApiProperty({ description: 'Number of games won' })
  wins: number;

  @ApiProperty({ description: 'Number of games lost' })
  losses: number;

  @ApiProperty({ description: 'Number of games drawn' })
  draws: number;

  @ApiProperty({ description: 'Current score' })
  currentScore: number;

  @ApiProperty({ description: 'Number of consecutive wins' })
  consecutiveWins: number;

  @ApiProperty({ 
    description: 'Win rate percentage',
    minimum: 0,
    maximum: 100 
  })
  winRate: number;
}

export class CreateGameResponseDto {
  @ApiProperty({ description: 'Game ID' })
  id: number;

  @ApiProperty({ 
    description: 'Initial game board',
    example: [['', '', ''], ['', '', ''], ['', '', '']] 
  })
  board: string[][];

  @ApiProperty({ 
    description: 'Game status',
    enum: ['ongoing', 'won', 'lost', 'draw'],
    default: 'ongoing'
  })
  status: 'ongoing' | 'won' | 'lost' | 'draw';

  @ApiProperty({ description: 'User ID' })
  userId: number;
}

export class GameHistoryResponseDto {
  @ApiProperty({ description: 'Game ID' })
  id: number;

  @ApiProperty({ 
    description: 'Game result',
    enum: ['won', 'lost', 'draw'] 
  })
  status: 'won' | 'lost' | 'draw';

  @ApiProperty({ description: 'Game completion date' })
  playedAt: Date;
}