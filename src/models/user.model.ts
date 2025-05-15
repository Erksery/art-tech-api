import {
  BeforeCreate,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import * as bcrypt from 'bcryptjs';
import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { ROLE_VALUES, STATUS_VALUES } from 'src/config/constants.config';

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
    type: DataType.ENUM(...Object.values(ROLE_VALUES)),
    defaultValue: ROLE_VALUES.USER,
    allowNull: false,
  })
  declare role: string;

  @Column({
    type: DataType.ENUM(...Object.values(STATUS_VALUES)),
    defaultValue: STATUS_VALUES.PENDING,
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
