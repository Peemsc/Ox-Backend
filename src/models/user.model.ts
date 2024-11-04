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
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  profilePicture: string;

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
