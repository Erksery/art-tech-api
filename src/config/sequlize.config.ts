import * as dotenv from 'dotenv';
import { Dialect } from 'sequelize';
import { User } from 'src/models/user.model';

dotenv.config();

export const sequelizeConfig = {
  dialect: 'mysql' as Dialect,
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: process.env.SQL_PASSWORD,
  database: 'artTechManager',
  models: [User],
  autoLoadModels: true,
  synchronize: true,
  sync: { alter: true },
  logging: console.log,
};
