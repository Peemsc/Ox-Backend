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
  score: number;
  consecutiveWins: number;
  userId: number;
}