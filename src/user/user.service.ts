import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { UserResponseDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({
      where: {
        email,
      },
    });
  }

  async findById(id: number): Promise<User> {
    return await this.userModel.findByPk(id);
  }

  async create(userData: {
    email: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  }): Promise<User> {
    return await this.userModel.create({
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      profilePicture: userData.profilePicture,
      score: 0,
      consecutiveWins: 0,
    });
  }

  async getProfile(userId: number): Promise<UserResponseDto> {
    const user = await this.userModel.findByPk(userId);
    return this.transformToDto(user);
  }

  async getLeaderboard(): Promise<UserResponseDto[]> {
    const users = await this.userModel.findAll({
      order: [['score', 'DESC']],
      limit: 10,
    });

    return users.map((user) => this.transformToDto(user));
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
