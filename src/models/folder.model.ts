import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { InferAttributes, InferCreationAttributes } from 'sequelize';
import {
  PRIVACY_VALUES,
  PrivacyType,
  SHARING_VALUES,
  SharingType,
} from 'src/config/constants.config';
import { File } from './file.model';

@Table({ tableName: 'folders', timestamps: false })
export class Folder extends Model<
  InferAttributes<Folder>,
  InferCreationAttributes<Folder, { omit: 'id' }>
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
    type: DataType.ENUM(...Object.values(PRIVACY_VALUES)),
    allowNull: false,
    defaultValue: PRIVACY_VALUES.PRIVATE,
  })
  declare privacy: PrivacyType;

  @Column({
    type: DataType.ENUM(...Object.values(SHARING_VALUES)),
    allowNull: true,
    defaultValue: SHARING_VALUES.READING,
  })
  declare sharingOptions?: SharingType;

  @HasMany(() => File, { onDelete: 'CASCADE' })
  files?: File[];
}
