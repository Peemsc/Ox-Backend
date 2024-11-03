import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { UserResponseDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User
  ) {}

  async getProfile(userId: number): Promise<UserResponseDto> {
    const user = await User.findByPk(userId);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      score: user.score,
      consecutiveWins: user.consecutiveWins
    };
  }

  async getLeaderboard(): Promise<UserResponseDto[]> {
    const users = await User.findAll({
      order: [['score', 'DESC']],
      limit: 10
    });
    
    return users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      score: user.score,
      consecutiveWins: user.consecutiveWins
    }));
  }
}