import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserResponseDto, LeaderboardResponseDto } from '../dto/user.dto';
import { NotFoundException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    getProfile: jest.fn(),
    getLeaderboard: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return the user profile', async () => {
      const userId = 1;
      const user = { id: userId, email: 'test@example.com', firstName: 'John', lastName: 'Doe' } as UserResponseDto;
      mockUserService.getProfile.mockResolvedValue(user);

      const result = await controller.getProfile({ user: { id: userId } });
      expect(result).toEqual(user);
      expect(mockUserService.getProfile).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserService.getProfile.mockRejectedValue(new NotFoundException('User not found'));

      await expect(controller.getProfile({ user: { id: 1 } })).rejects.toThrow(NotFoundException);
    });
  });

  describe('getLeaderboard', () => {
    it('should return the leaderboard', async () => {
      const leaderboard = [
        { id: 1, fullName: 'John Doe', score: 100, consecutiveWins: 5, rank: 1 },
        { id: 2, fullName: 'Jane Smith', score: 90, consecutiveWins: 3, rank: 2 },
      ] as LeaderboardResponseDto[];
      mockUserService.getLeaderboard.mockResolvedValue(leaderboard);

      const result = await controller.getLeaderboard(10, 1);
      expect(result).toEqual(leaderboard);
      expect(mockUserService.getLeaderboard).toHaveBeenCalledWith(10, 1);
    });
  });
});
