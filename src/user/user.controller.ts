import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserResponseDto } from './dto/user.dto';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@Req() req): Promise<UserResponseDto> {
    return this.userService.getProfile(req.user.id);
  }

  @Get('leaderboard')
  async getLeaderboard(): Promise<UserResponseDto[]> {
    return this.userService.getLeaderboard();
  }
}