import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from '../game.service';
import { getModelToken } from '@nestjs/sequelize';
import { Game } from '../../models/game.model';
import { User } from '../../models/user.model';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('GameService', () => {
  let service: GameService;

  const mockGame = {
    id: 1,
    userId: 1,
    board: [['', '', ''], ['', '', ''], ['', '', '']],
    status: 'ongoing',
    save: jest.fn().mockResolvedValue(true), // Mock save ให้คืนค่า
  };

  const mockGameModel = {
    create: jest.fn().mockResolvedValue(mockGame),
    findOne: jest.fn().mockResolvedValue(mockGame),
    findAll: jest.fn().mockResolvedValue([mockGame]), // Mock ข้อมูลตัวอย่างสำหรับ findAll
  };

  const mockUserModel = {
    findByPk: jest.fn().mockResolvedValue({
      id: 1,
      score: 0,
      consecutiveWins: 0,
      save: jest.fn().mockResolvedValue(true),
    }),
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
      const result = await service.createGame(1);
      expect(result).toEqual(mockGame);
      expect(mockGameModel.create).toHaveBeenCalledWith({
        userId: 1,
        board: [['', '', ''], ['', '', ''], ['', '', '']],
        status: 'ongoing',
      });
    });
  });

  describe('makeMove', () => {
    it('should throw NotFoundException when game not found', async () => {
      mockGameModel.findOne.mockResolvedValue(null);
      await expect(service.makeMove(1, 1, 0, 0)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid move', async () => {
      mockGame.board[0][0] = 'X'; // จำลองตำแหน่งที่ไม่ว่าง
      mockGameModel.findOne.mockResolvedValue(mockGame);

      await expect(service.makeMove(1, 1, 0, 0)).rejects.toThrow(BadRequestException);
    });

    it('should handle player win correctly', async () => {
      mockGame.board[0][1] = 'X';
      mockGame.board[0][2] = 'X';
      mockGameModel.findOne.mockResolvedValue(mockGame);

      await service.makeMove(1, 1, 0, 2);
      expect(mockGame.status).toBe('won');
      expect(mockGame.save).toHaveBeenCalled();
    });
  });
});
