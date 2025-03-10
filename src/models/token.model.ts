import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.model';
import { InferAttributes, InferCreationAttributes } from 'sequelize';

@Table({ tableName: 'tokens', timestamps: false })
export class Token extends Model<
  InferAttributes<Token>,
  InferCreationAttributes<Token, { omit: 'id' }>
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare userId: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare token: string;

  @BelongsTo(() => User)
  declare user?: User;
}
