import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: 'User ID' })
  id: number;

  @ApiProperty({ description: 'User email address' })
  email: string;

  @ApiProperty({ description: 'User first name' })
  firstName: string;

  @ApiProperty({ description: 'User last name' })
  lastName: string;

  @ApiProperty({ description: 'Profile picture URL', required: false })
  profilePicture?: string;

  @ApiProperty({ description: 'Total score' })
  score: number;

  @ApiProperty({ description: 'Current consecutive wins' })
  consecutiveWins: number;
}


export class LeaderboardResponseDto {
  @ApiProperty({ description: 'User ID' })
  id: number;

  @ApiProperty({ description: 'User full name' })
  fullName: string;

  @ApiProperty({ description: 'Total score' })
  score: number;

  @ApiProperty({ description: 'Current consecutive wins' })
  consecutiveWins: number;

  @ApiProperty({ description: 'Rank position' })
  rank: number;
}