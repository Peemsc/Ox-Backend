import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthResponseDto, UserResponseDto } from './dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  @ApiOperation({ 
    summary: 'Google OAuth Login',
    description: 'Redirects to Google login page'
  })
  @ApiResponse({ 
    status: 302,
    description: 'Redirects to Google authentication page'
  })
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  @ApiOperation({ 
    summary: 'Google OAuth Callback',
    description: 'Handles the Google OAuth callback and returns user data with JWT'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Authentication successful',
    type: AuthResponseDto
  })
  @ApiUnauthorizedResponse({ description: 'Authentication failed' })
  async googleAuthRedirect(@Req() req) {
    return this.authService.validateUser(req.user);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get User Profile',
    description: 'Returns the current user profile using JWT authentication'
  })
  @ApiResponse({ 
    status: 200,
    description: 'Profile retrieved successfully',
    type: UserResponseDto
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired token' })
  getProfile(@Req() req) {
    return req.user;
  }
}