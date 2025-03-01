import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import * as bcrypt from 'bcryptjs';
import { User } from './user.model';
import { InferAttributes, InferCreationAttributes } from 'sequelize';

@Table({ tableName: 'tokens', timestamps: false })
export class Token extends Model<
  InferAttributes<Token>,
  InferCreationAttributes<Token>
> {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare userId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare token: string;

  @BelongsTo(() => User)
  declare user?: User;

  static async hashToken(token: string): Promise<string> {
    return await bcrypt.hash(token, 10);
  }
}
