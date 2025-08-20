import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table
} from 'sequelize-typescript'
import { InferAttributes, InferCreationAttributes } from 'sequelize'
import {
  PRIVACY_VALUES,
  PrivacyType,
  SHARING_VALUES,
  SharingType
} from 'src/config/constants.config'
import { File } from './file.model'
import { User } from './user.model'

@Table({ tableName: 'folders', timestamps: true })
export class Folder extends Model<
  InferAttributes<Folder>,
  InferCreationAttributes<Folder, { omit: 'id' }>
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  declare id: string
  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string
  @Column({ type: DataType.STRING, allowNull: true })
  declare description: string

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare creator: string

  @BelongsTo(() => User, { onDelete: 'CASCADE' })
  creatorUser?: User

  @Column({ type: DataType.UUID, allowNull: true })
  declare inFolder: string
  @Column({
    type: DataType.ENUM(...Object.values(PRIVACY_VALUES)),
    allowNull: false,
    defaultValue: PRIVACY_VALUES.PRIVATE
  })
  declare privacy: PrivacyType

  @Column({
    type: DataType.ENUM(...Object.values(SHARING_VALUES)),
    allowNull: true,
    defaultValue: SHARING_VALUES.READING
  })
  declare sharingOptions?: SharingType

  @HasMany(() => File, { onDelete: 'CASCADE' })
  files?: File[]
}
