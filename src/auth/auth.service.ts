import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private jwtService: JwtService,
  ) {}

  async validateUser(userData: any): Promise<User> {
    let user = await this.userModel.findOne({
      where: { providerId: userData.providerId },
    });

    if (!user) {
      user = await this.userModel.create({
        email: userData.email,
        name: userData.name,
        provider: userData.provider,
        providerId: userData.providerId,
      });
    }

    return user;
  }

  async login(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
