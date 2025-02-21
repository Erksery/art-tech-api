import { User } from 'src/models/user.model';

export const sequelizeConfig = {
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'test',
  models: [User],
};
