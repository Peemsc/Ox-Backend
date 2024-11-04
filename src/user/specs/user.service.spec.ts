import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { getModelToken } from '@nestjs/sequelize';
import { User } from '../../models/user.model';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let mockUserModel;

  beforeEach(async () => {
    mockUserModel = {
      findOne: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return a user if found', async () => {
      const user = { email: 'test@example.com' };
      mockUserModel.findOne.mockResolvedValue(user);

      expect(await service.findByEmail('test@example.com')).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserModel.findOne.mockResolvedValue(null);

      await expect(service.findByEmail('test@example.com')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findById', () => {
    it('should return a user if found', async () => {
      const user = { id: 1 };
      mockUserModel.findByPk.mockResolvedValue(user);

      expect(await service.findById(1)).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserModel.findByPk.mockResolvedValue(null);

      await expect(service.findById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userData = { email: 'test@example.com', firstName: 'John', lastName: 'Doe' };
      const createdUser = { ...userData, id: 1, score: 0, consecutiveWins: 0 };
      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockResolvedValue(createdUser);

      expect(await service.create(userData)).toEqual(createdUser);
    });

    it('should throw an error if user already exists', async () => {
      const userData = { email: 'test@example.com', firstName: 'John', lastName: 'Doe' };
      mockUserModel.findOne.mockResolvedValue(userData);

      await expect(service.create(userData)).rejects.toThrow('User already exists');
    });
  });

  describe('getLeaderboard', () => {
    it('should return a paginated list of users', async () => {
      const users = [
        { id: 1, firstName: 'John', lastName: 'Doe', score: 100, consecutiveWins: 5 },
        { id: 2, firstName: 'Jane', lastName: 'Smith', score: 90, consecutiveWins: 3 },
      ];
      mockUserModel.findAll.mockResolvedValue(users);

      const leaderboard = await service.getLeaderboard(2, 1);
      expect(leaderboard).toHaveLength(2);
      expect(leaderboard[0].rank).toBe(1);
    });
  });
});
