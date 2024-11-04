import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { UserResponseDto, LeaderboardResponseDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findById(id: number): Promise<User> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(userData: {
    email: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  }): Promise<User> {
    const existingUser = await this.findByEmail(userData.email).catch(() => null);
    if (existingUser) {
      throw new Error('User already exists');
    }

    return await this.userModel.create({
      ...userData,
      score: 0,
      consecutiveWins: 0,
    });
  }

  async getProfile(userId: number): Promise<UserResponseDto> {
    const user = await this.findById(userId);
    return this.transformToDto(user);
  }

  async getLeaderboard(limit: number = 10, page: number = 1): Promise<LeaderboardResponseDto[]> {
    const offset = (page - 1) * limit;
    const users = await this.userModel.findAll({
      order: [['score', 'DESC']],
      limit,
      offset,
    });

    return users.map((user, index) => ({
      id: user.id,
      fullName: `${user.firstName} ${user.lastName}`,
      score: user.score,
      consecutiveWins: user.consecutiveWins,
      rank: offset + index + 1
    }));
  }

  private transformToDto(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture,
      score: user.score,
      consecutiveWins: user.consecutiveWins,
    };
  }
}