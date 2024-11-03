import { ApiProperty } from '@nestjs/swagger';

export class UserFromGoogleDto {
  @ApiProperty({ description: 'User email from Google' })
  email: string;

  @ApiProperty({ description: 'User first name from Google' })
  firstName: string;

  @ApiProperty({ description: 'User last name from Google' })
  lastName: string;

  @ApiProperty({ description: 'Google profile picture URL' })
  picture: string;
}

export class UserResponseDto {
  @ApiProperty({ description: 'User ID' })
  id: number;

  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({ description: 'User first name' })
  firstName: string;

  @ApiProperty({ description: 'User last name' })
  lastName: string;

  @ApiProperty({ description: 'Profile picture URL' })
  profilePicture: string;
}

export class JwtPayloadDto {
  @ApiProperty({ description: 'User ID' })
  sub: number;

  @ApiProperty({ description: 'User email' })
  email: string;
}

export class AuthResponseDto {
  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({ description: 'JWT access token' })
  accessToken: string;
}