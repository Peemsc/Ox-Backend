import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from '../game.service';
import { getModelToken } from '@nestjs/sequelize';
import { Game } from '../../models/game.model';
import { User } from '../..//models/user.model';

describe('GameService', () => {
  let service: GameService;

  const mockGameModel = {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
  };

  const mockUserModel = {
    findByPk: jest.fn(),
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

  describe('makeMove', () => {
    it('should handle player win correctly', async () => {
      // Setup
      const game = {
        id: 1,
        userId: 1,
        board: [['X', 'X', ''], ['', '', ''], ['', '', '']],
        status: 'ongoing',
        save: jest.fn(),
      };
      mockGameModel.findOne.mockResolvedValue(game);

      // Execute
      await service.makeMove(1, 1, 0, 2);

      // Assert
      expect(game.status).toBe('won');
    });

  });
});