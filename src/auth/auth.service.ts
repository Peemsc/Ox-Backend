import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import {
  AuthResponseDto,
  UserFromGoogleDto,
  UserResponseDto,
  JwtPayloadDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    userFromGoogle: UserFromGoogleDto,
  ): Promise<AuthResponseDto> {
    try {
      let user = await this.userService.findByEmail(userFromGoogle.email);

      if (!user) {
        user = await this.userService.create({
          email: userFromGoogle.email,
          firstName: userFromGoogle.firstName,
          lastName: userFromGoogle.lastName,
          profilePicture: userFromGoogle.picture,
        });
      }

      const payload: JwtPayloadDto = {
        sub: user.id,
        email: user.email,
      };

      const userResponse: UserResponseDto = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
      };

      return {
        user: userResponse,
        accessToken: this.jwtService.sign(payload),
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error during authentication process',
      );
    }
  }

  async validateToken(token: string): Promise<UserResponseDto> {
    try {
      const payload = this.jwtService.verify(token) as JwtPayloadDto;
      const user = await this.userService.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
