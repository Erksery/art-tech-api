import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table
} from 'sequelize-typescript'
import { InferAttributes, InferCreationAttributes } from 'sequelize'
import { File } from './file.model'
import { User } from './user.model'

@Table({ tableName: 'trash', timestamps: true })
export class Trash extends Model<
  InferAttributes<Trash>,
  InferCreationAttributes<Trash, { omit: 'id' }>
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  declare id: string

  @ForeignKey(() => File)
  @Column({ type: DataType.UUID, allowNull: false })
  declare fileId: string

  @BelongsTo(() => File, { onDelete: 'CASCADE' })
  file?: File

  @Column({ type: DataType.DATE, allowNull: false })
  declare deletedAt: Date

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare deletedBy: string

  @BelongsTo(() => User, { onDelete: 'CASCADE' })
  deletedByUser?: User

  @Column({ type: DataType.STRING, allowNull: true })
  declare reason: string | null
}
