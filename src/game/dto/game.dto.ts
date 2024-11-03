import { IsNumber, Min, Max } from 'class-validator';

export class MakeMoveDto {
  @IsNumber()
  @Min(0)
  @Max(2)
  row: number;

  @IsNumber()
  @Min(0)
  @Max(2)
  col: number;
}

export class GameResponseDto {
  id: number;
  board: string[][];
  status: 'ongoing' | 'won' | 'lost' | 'draw';
  userId: number;
}

export class GameStatsResponseDto {
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  currentScore: number;
  consecutiveWins: number;
  winRate: number;
}

export class CreateGameResponseDto {
  id: number;
  board: string[][];
  status: 'ongoing' | 'won' | 'lost' | 'draw';  ;
  userId: number;
}
export class GameHistoryResponseDto {
  id: number;
  status: 'won' | 'lost' | 'draw';
  playedAt: Date;
}