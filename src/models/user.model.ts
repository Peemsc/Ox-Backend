import { Column, Model, Table, HasMany, DataType } from 'sequelize-typescript';
import { Game } from './game.model';

@Table
export class User extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  provider: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  providerId: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  score: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  consecutiveWins: number;

  @HasMany(() => Game)
  games: Game[];
}