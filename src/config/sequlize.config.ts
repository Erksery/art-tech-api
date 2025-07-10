import * as dotenv from 'dotenv'
import { Dialect } from 'sequelize'
import { File } from 'src/models/file.model'
import { Folder } from 'src/models/folder.model'
import { Token } from 'src/models/token.model'
import { Trash } from 'src/models/trash.model'
import { User } from 'src/models/user.model'

dotenv.config()

export const sequelizeConfig = {
  dialect: 'mysql' as Dialect,
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: process.env.SQL_PASSWORD,
  database: 'artTechManager',
  models: [User, Token, Folder, File, Trash],
  autoLoadModels: true,
  synchronize: false,
  sync: { alter: false },
  logging: console.log
}
