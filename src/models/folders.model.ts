import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { PRIVACY_VALUES } from 'src/config/constants.config';

@Table({ tableName: 'folders', timestamps: false })
export class Folders extends Model<
  InferAttributes<Folders>,
  InferCreationAttributes<Folders, { omit: 'id' }>
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;
  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;
  @Column({ type: DataType.STRING, allowNull: true })
  declare description: string;
  @Column({ type: DataType.UUID, allowNull: false })
  declare creator: string;
  @Column({ type: DataType.UUID, allowNull: true })
  declare inFolder: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: PRIVACY_VALUES.PRIVATE,
  })
  declare privacy: string;
}
