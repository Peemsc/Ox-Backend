import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  BadRequestException,
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

  async validateUser(userFromGoogle: UserFromGoogleDto): Promise<AuthResponseDto> {
    try {
      // ตรวจสอบข้อมูลที่จำเป็น
      if (!userFromGoogle?.email || !userFromGoogle?.firstName || !userFromGoogle?.lastName) {
        throw new BadRequestException('Missing required Google user data');
      }

      let user = await this.userService.findByEmail(userFromGoogle.email);

      if (!user) {
        try {
          user = await this.userService.create({
            email: userFromGoogle.email,
            firstName: userFromGoogle.firstName,
            lastName: userFromGoogle.lastName,
            profilePicture: userFromGoogle.picture,
          });
        } catch (error) {
          console.error('Create user error:', error);
          throw new InternalServerErrorException('Failed to create user');
        }
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
        accessToken: this.jwtService.sign(payload, {
          expiresIn: '1d'
        }),
      };
    } catch (error) {
      if (error instanceof UnauthorizedException || 
          error instanceof BadRequestException) {
        throw error;
      }
      console.error('Authentication error:', error);
      throw new InternalServerErrorException('Error during authentication process');
    }
  }
}