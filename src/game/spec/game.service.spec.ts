import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from '../game.service';
import { getModelToken } from '@nestjs/sequelize';
import { Game } from '../../models/game.model';
import { User } from '../../models/user.model';
import { BadRequestException } from '@nestjs/common';
import { GameBLL } from '../bll/game.bll';

describe('GameService', () => {
  let service: GameService;

  const mockGameModel = {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    build: jest.fn(),
  };

  const mockUserModel = {
    findByPk: jest.fn(),
    build: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameService,
        {
          provide: getModelToken(Game),
          useValue: mockGameModel,
        },
        {
          provide: getModelToken(User),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<GameService>(GameService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createGame', () => {
    it('should create a new game', async () => {
      const mockGame = {
        id: 1,
        userId: 1,
        board: [['', '', ''], ['', '', ''], ['', '', '']],
        status: 'ongoing',
        save: jest.fn().mockResolvedValue(true),
      };
      mockGameModel.create.mockResolvedValue(mockGame);

      const result = await service.createGame(1);
      expect(result).toEqual(mockGame);
    });
  });

  describe('makeMove', () => {
    it('should throw BadRequestException for invalid move', async () => {
      const mockUser = {
        id: 1,
        score: 0,
        consecutiveWins: 0,
        save: jest.fn().mockResolvedValue(true),
      };

      const mockGame = {
        id: 1,
        userId: 1,
        board: [
          ['X', '', ''],  // Position [0,0] is already taken
          ['', '', ''],
          ['', '', '']
        ],
        status: 'ongoing',
        save: jest.fn().mockImplementation(function() {
          return Promise.resolve(this);
        }),
        user: mockUser,
      };

      mockGameModel.findOne.mockResolvedValue(mockGame);
      mockUserModel.findByPk.mockResolvedValue(mockUser);

      // Use expect().rejects without the async wrapper
      await expect(service.makeMove(1, 1, 0, 0)).rejects.toThrow(BadRequestException);
    });

    it('should handle player win correctly', async () => {
      const mockUser = {
        id: 1,
        score: 0,
        consecutiveWins: 0,
        save: jest.fn().mockResolvedValue(true),
      };

      const mockGame = {
        id: 1,
        userId: 1,
        board: [
          ['X', 'X', ''],
          ['', '', ''],
          ['', '', '']
        ],
        status: 'ongoing',
        save: jest.fn().mockImplementation(function() {
          // Important: Update the status before resolving
          this.status = 'won';
          return Promise.resolve(this);
        }),
        user: mockUser,
      };

      mockGameModel.findOne.mockResolvedValue(mockGame);
      mockUserModel.findByPk.mockResolvedValue(mockUser);

      // Mock GameBLL static methods for a winning move
      jest.spyOn(GameBLL, 'checkWinner').mockReturnValue(true);
      jest.spyOn(GameBLL, 'handleGameResult').mockReturnValue({
        newScore: 10,
        newConsecutiveWins: 1,
      });

      const result = await service.makeMove(1, 1, 0, 2);
      
      expect(result.status).toBe('won');
      expect(mockGame.save).toHaveBeenCalled();
      expect(mockUser.save).toHaveBeenCalled();
    });
});

  describe('getCurrentGame', () => {
    it('should return current ongoing game', async () => {
      const mockGame = {
        id: 1,
        userId: 1,
        status: 'ongoing',
      };
      mockGameModel.findOne.mockResolvedValue(mockGame);

      const result = await service.getCurrentGame(1);
      expect(result).toEqual(mockGame);
      expect(mockGameModel.findOne).toHaveBeenCalledWith({
        where: { userId: 1, status: 'ongoing' },
        include: [User],
      });
    });

    it('should return null when no ongoing game', async () => {
      mockGameModel.findOne.mockResolvedValue(null);

      const result = await service.getCurrentGame(1);
      expect(result).toBeNull();
    });
  });

  describe('getGameStats', () => {
    it('should return game statistics', async () => {
      const mockGames = [
        { status: 'won' },
        { status: 'lost' },
        { status: 'won' },
      ];
      const mockUser = {
        id: 1,
        score: 10,
        consecutiveWins: 2,
      };

      mockGameModel.findAll.mockResolvedValue(mockGames);
      mockUserModel.findByPk.mockResolvedValue(mockUser);

      const result = await service.getGameStats(1);
      expect(result).toEqual({
        totalGames: 3,
        wins: 2,
        losses: 1,
        draws: 0,
        currentScore: 10,
        consecutiveWins: 2,
        winRate: (2 / 3) * 100,
      });
    });
  });
});