import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table
} from 'sequelize-typescript'
import { InferAttributes, InferCreationAttributes } from 'sequelize'
import { Folder } from './folder.model'

@Table({ tableName: 'files', timestamps: true })
export class File extends Model<
  InferAttributes<File>,
  InferCreationAttributes<File, { omit: 'id' }>
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  declare id: string

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string

  @Column({ type: DataType.STRING, allowNull: false })
  declare originalFilename: string

  @Column({ type: DataType.UUID, allowNull: false })
  declare creator: string

  @Column({ type: DataType.STRING, allowNull: false })
  declare mimeType: string

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare size: number

  @ForeignKey(() => Folder)
  @Column({ type: DataType.UUID, allowNull: false })
  declare folderId: string | null

  @BelongsTo(() => Folder, { onDelete: 'CASCADE' })
  folder?: Folder
}
