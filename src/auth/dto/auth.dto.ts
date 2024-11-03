import { IsEmail, IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: '123' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ example: 'john@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional({ example: 'https://example.com/picture.jpg' })
  @IsString()
  @IsOptional()
  profilePicture?: string;
}

export class UserFromGoogleDto {
  @ApiProperty({ example: 'john@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional({ example: 'https://example.com/picture.jpg' })
  @IsString()
  @IsOptional()
  picture?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}

export class AuthResponseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}

export class JwtPayloadDto {
    @ApiProperty()
    @IsString()
    sub: string;
  
    @ApiProperty()
    @IsEmail()
    email: string;
  }