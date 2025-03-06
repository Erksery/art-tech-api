import {
  BeforeCreate,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import * as bcrypt from 'bcryptjs';
import { InferAttributes, InferCreationAttributes } from 'sequelize';

@Table({ tableName: 'users', timestamps: false })
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User, { omit: 'id' }>
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  declare login: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare password: string;

  @Column({
    type: DataType.ENUM('User', 'Admin'),
    defaultValue: 'User',
    allowNull: false,
  })
  declare role: string;

  @Column({
    type: DataType.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
    allowNull: false,
  })
  declare status: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare avatar_url?: string;

  @BeforeCreate
  static async hashPassword(user: User) {
    if (!user.password) {
      throw new Error('Password is missing!');
    }

    user.password = await bcrypt.hash(user.password, 10);
  }
}
