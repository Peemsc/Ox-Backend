import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { Game } from '../models/game.model';
import { User } from '../models/user.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Game, User]),
  ],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}