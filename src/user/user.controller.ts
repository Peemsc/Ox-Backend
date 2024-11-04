import { Controller, Get, UseGuards, Req, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserResponseDto, LeaderboardResponseDto } from './dto/user.dto';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'Returns user profile',
    type: UserResponseDto
  })
  async getProfile(@Req() req): Promise<UserResponseDto> {
    return this.userService.getProfile(req.user.id);
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get user leaderboard' })
  @ApiResponse({
    status: 200,
    description: 'Returns top players',
    type: [LeaderboardResponseDto]
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records to return (default: 10)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  async getLeaderboard(
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 1
  ): Promise<LeaderboardResponseDto[]> {
    return this.userService.getLeaderboard(limit, page);
  }
}