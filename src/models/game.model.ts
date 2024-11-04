import {
  Column,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table
export class Game extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ],
  })
  board: string[][];

  @Column({
    type: DataType.ENUM('ongoing', 'won', 'lost', 'draw'),
    defaultValue: 'ongoing',
  })
  status: 'ongoing' | 'won' | 'lost' | 'draw';

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isCompleted: boolean;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  moveCount: number;
}
